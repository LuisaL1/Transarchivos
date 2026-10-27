import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Puente con Zoho (src/lib/zohoBridge.ts) sobre una ventana de Zoho FALSA:
// nunca se carga el widget real en las pruebas.
const z = { floatwindow: { visible: vi.fn() } };
vi.mock("@/lib/crmChat", () => ({
  loadCrmChat: vi.fn(async () => z),
  setBridging: vi.fn(),
  styleChatWindow: vi.fn(),
  announce: vi.fn(),
  // La página aislada de Zoho: aquí, la misma ventana de prueba
  zohoWindow: () => window,
}));
// El puente espera 1,5 s a que el campo de Zoho esté quieto: las pruebas tardan un poco más
vi.setConfig({ testTimeout: 12_000 });
const { openBridge } = await import("@/lib/zohoBridge");
const { setBridging } = await import("@/lib/crmChat");

let doc: Document;
const sent: string[] = [];
// Cómo muestra Zoho el mensaje del visitante (null: no lo muestra)
let render: (v: string) => string | null = (v) => v;

// Ventana falsa: inicio con "Chatee con nosotros ahora"; al pulsarlo, campo de texto
function fakeZoho() {
  const frame = document.createElement("iframe");
  frame.id = "siq_chatwindow";
  document.body.appendChild(frame);
  doc = frame.contentDocument!;
  doc.body.innerHTML = `<div class="home-icon-optns"><em class="siqico-chat-start"></em></div><div id="scroll-container"></div>`;
  doc.querySelector(".home-icon-optns")!.addEventListener("click", () => {
    const ta = doc.createElement("textarea");
    ta.className = "siqcw-textarea";
    ta.addEventListener("keydown", (e) => {
      if ((e as KeyboardEvent).key !== "Enter") return;
      sent.push(ta.value);
      // Zoho muestra el mensaje del visitante en la conversación
      const shownText = render(ta.value);
      if (shownText === null) return;
      const v = doc.createElement("div");
      v.setAttribute("data-zsqa", "visitor_msg message_bubble");
      v.innerHTML = `<span data-zsqa="msg">${shownText}</span>`;
      doc.getElementById("scroll-container")!.appendChild(v);
    });
    doc.body.appendChild(ta);
  });
}

// Mensaje del bot o del asesor de Zoho (misma estructura que la ventana real)
function agentSays(id: string, name: string, text: string, extra = "") {
  const grp = doc.createElement("div");
  grp.className = "siqcw-agentmsg-grp";
  grp.innerHTML = `<div class="siqcw-name-div">${name}</div><div class="chat-bubble-cont" id="${id}" data-zsqa="agent_msg message_bubble"><span data-zsqa="msg">${text}</span>${extra}</div>`;
  doc.getElementById("scroll-container")!.appendChild(grp);
}
// El puente procesa cada mensaje cuando ya está completo (unos 700 ms)
const tick = () => new Promise((r) => setTimeout(r, 1300));
const handlers = () => ({ onMessage: vi.fn(), onForm: vi.fn() });

beforeEach(() => {
  sent.length = 0;
  render = (v) => v;
  fakeZoho();
});
afterEach(() => {
  document.getElementById("siq_chatwindow")?.remove();
  vi.clearAllMocks();
});

describe("puente con Zoho (Joel pregunta y Zoho SalesIQ responde)", () => {
  it("al abrir el chat prepara la conversación escondida, sin enviar nada", async () => {
    await openBridge(handlers());
    expect(setBridging).toHaveBeenCalledWith(true);
    expect(z.floatwindow.visible).toHaveBeenCalledWith("show");
    expect(doc.querySelector("textarea.siqcw-textarea")).not.toBeNull();
    expect(sent).toEqual([]);
  });

  it("envía lo que escribe el visitante y confirma que Zoho lo recibió", async () => {
    const b = await openBridge(handlers());
    await expect(b.send("¿Tienen custodia de cintas?")).resolves.toBe(true);
    expect(sent).toEqual(["¿Tienen custodia de cintas?"]);
  });

  it("pasa a Joel las respuestas con su nombre y sus opciones", async () => {
    const h = handlers();
    const b = await openBridge(h);
    await b.send("Hola");
    agentSays("m1", "Joel", "¡Hola! ¿Qué servicio necesita?", `<div class="tag-div">Custodia de archivos</div><div class="tag-div">Digitalización</div>`);
    await tick();
    expect(h.onMessage).toHaveBeenCalledWith({
      id: "m1",
      name: "Joel",
      text: "¡Hola! ¿Qué servicio necesita?",
      options: ["Custodia de archivos", "Digitalización"],
    });
    // Elegir una opción pulsa el botón correspondiente en Zoho
    const clicked = vi.fn();
    doc.querySelectorAll(".tag-div")[1].addEventListener("click", clicked);
    expect(b.choose("Digitalización")).toBe(true);
    expect(clicked).toHaveBeenCalled();
    // Lo que el visitante escribe después va a Zoho (uno a la vez, confirmado y en orden)
    await expect(Promise.all([b.send("Somos dos"), b.send("Y un piano")])).resolves.toEqual([true, true]);
    expect(sent).toEqual(["Hola", "Somos dos", "Y un piano"]);
  });

  it("no repite en Joel lo que Zoho muestra antes del primer mensaje (su saludo)", async () => {
    const h = handlers();
    const b = await openBridge(h);
    agentSays("w1", "Joel", "¡Bienvenido a Transarchivos!");
    await tick();
    expect(h.onMessage).not.toHaveBeenCalled();
    await b.send("Hola");
    agentSays("m1", "Joel", "¿En qué le ayudo?");
    await tick();
    expect(h.onMessage.mock.calls.map((c) => c[0].id)).toEqual(["m1"]);
  });

  it("envía UNA sola vez un mensaje de varias líneas con emoji (Zoho lo muestra distinto)", async () => {
    // Zoho cambia los saltos de línea por <br> y el emoji por una imagen
    render = (v) => v.replace(/\n/g, "<br>").replace("🆕", '<img alt="">');
    const b = await openBridge(handlers());
    await expect(b.send("🆕 NUEVA COTIZACIÓN\nCliente: Ana\n\n• Servicio: Custodia")).resolves.toBe(true);
    await new Promise((r) => setTimeout(r, 6500));
    expect(sent).toHaveLength(1);
  }, 12_000);

  it("si Zoho nunca confirma un mensaje, reintenta pocas veces, avisa que no llegó y sigue con los demás", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const b = await openBridge(handlers());
    render = () => null;
    const lost = b.send("Perdido");
    await vi.advanceTimersByTimeAsync(30_000);
    await expect(lost).resolves.toBe(false);
    expect(sent).toEqual(["Perdido", "Perdido", "Perdido"]);
    // Después de fallar no sigue enviando ese mensaje
    await vi.advanceTimersByTimeAsync(30_000);
    expect(sent).toHaveLength(3);
    render = (v) => v;
    const ok = b.send("Hola");
    await vi.advanceTimersByTimeAsync(1_000);
    await expect(ok).resolves.toBe(true);
    b.stop();
    vi.useRealTimers();
  });

  it("espera a que el campo de Zoho esté habilitado y quieto antes de escribir (al abrir queda un momento en «Por favor, espere…»)", async () => {
    // Como el Zoho real: el campo aparece deshabilitado y se habilita después
    doc.querySelector(".home-icon-optns")!.addEventListener("click", () => {
      const ta = doc.querySelector<HTMLTextAreaElement>("textarea.siqcw-textarea")!;
      ta.disabled = true;
      ta.placeholder = "Por favor, espere...";
      setTimeout(() => { ta.disabled = false; ta.placeholder = "Estamos a su disposición para ayudarle"; }, 1200);
    });
    const t0 = Date.now();
    const b = await openBridge(handlers());
    // No queda lista mientras el campo está deshabilitado
    expect(Date.now() - t0).toBeGreaterThanOrEqual(1200);
    await expect(b.send("Hola")).resolves.toBe(true);
  }, 15_000);

  it("no repite mensajes ya vistos", async () => {
    const h = handlers();
    const b = await openBridge(h);
    await b.send("Hola");
    agentSays("m1", "Laura", "Hola");
    await tick();
    agentSays("m2", "Laura", "¿En qué te ayudo?");
    await tick();
    await tick();
    expect(h.onMessage.mock.calls.map((c) => c[0].id)).toEqual(["m1", "m2"]);
  });

  it("omite solas las preguntas opcionales de datos de Zoho", async () => {
    const h = handlers();
    const b = await openBridge(h);
    await b.send("Hola");
    const skipped = vi.fn();
    agentSays(
      "f1",
      "Transarchivos",
      "¿Cómo quiere que le contactemos?",
      `<input class="siqcw-input"><span data-zsqa="skip_btn">Omitir</span>`,
    );
    doc.querySelector('[data-zsqa="skip_btn"]')!.addEventListener("click", skipped);
    // También cuando la pregunta usa el campo de texto de Zoho (solo trae "Omitir")
    agentSays("f2", "Transarchivos", "¿Podemos enviarle un correo electrónico?", `<span data-zsqa="skip_btn">Omitir</span>`);
    await tick();
    expect(skipped).toHaveBeenCalled();
    expect(h.onMessage).not.toHaveBeenCalled();
    expect(h.onForm).not.toHaveBeenCalled();
  });

  it("si un formulario no se puede omitir, Joel ofrece llenarlo en la ventana de Zoho", async () => {
    const h = handlers();
    const b = await openBridge(h);
    await b.send("Hola");
    agentSays("f3", "Transarchivos", "Indique su nombre", `<input class="siqcw-input">`);
    await tick();
    expect(h.onForm).toHaveBeenCalledWith({ canSkip: false });
  });

  it("al terminar deja de escuchar, esconde la ventana y descarta lo pendiente", async () => {
    const h = handlers();
    const b = await openBridge(h);
    await b.send("Hola");
    render = () => null;
    const pending = b.send("¿Sigue ahí?");
    b.stop();
    await expect(pending).resolves.toBe(false);
    agentSays("m9", "Laura", "¿Sigues ahí?");
    await tick();
    expect(h.onMessage).not.toHaveBeenCalled();
    expect(z.floatwindow.visible).toHaveBeenLastCalledWith("hide");
    expect(setBridging).toHaveBeenLastCalledWith(false);
  });

  it("si la ventana de Zoho no aparece, falla y deja de esconderla", async () => {
    document.getElementById("siq_chatwindow")!.remove();
    vi.useFakeTimers();
    const p = openBridge(handlers());
    const check = expect(p).rejects.toThrow("bridge-timeout");
    await vi.advanceTimersByTimeAsync(16_000);
    await check;
    expect(setBridging).toHaveBeenLastCalledWith(false);
    vi.useRealTimers();
  });
});
