import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { CHAT_EVENT } from "@/lib/chatWidget";
import { HOST_ID, SALESIQ_SRC, closeCrmChat, loadCrmChat, openCrmChat, resetCrmChatForTests, setZohoHostForTests, styleChatWindow } from "@/lib/crmChat";

// Cargador del chat de Zoho SalesIQ (sin cargar el script real). En el sitio,
// Zoho vive en una página aislada (iframe); aquí esa página es la ventana de
// prueba (jsdom no carga iframes).
beforeEach(() => setZohoHostForTests(window));
afterEach(() => {
  resetCrmChatForTests();
  document.getElementById("zsiqscript")?.remove();
  delete window.$zoho;
  document.getElementById("siq_chatwindow")?.remove();
});

// Simula lo que hace el script de Zoho al cargar: completa la API y llama a ready()
function zohoLoads() {
  const calls: string[] = [];
  const on: Record<string, () => void> = {};
  const z = window.$zoho!.salesiq!;
  Object.assign(z, {
    language: (l: string) => calls.push(`language:${l}`),
    floatbutton: { visible: (v: string) => calls.push(`button:${v}`) },
    floatwindow: { visible: (v: string) => calls.push(`window:${v}`), open: (cb: () => void) => (on.open = cb), close: (cb: () => void) => (on.close = cb), minimize: () => {} },
  });
  z.ready!();
  return { calls, on };
}

describe("chat de Zoho SalesIQ", () => {
  it("no carga nada por sí solo (lo arranca src/lib/chatWidget.ts)", () => {
    expect(document.getElementById("zsiqscript")).toBeNull();
    expect(window.$zoho).toBeUndefined();
    expect(document.getElementById(HOST_ID)).toBeNull();
  });

  it("carga el script una sola vez, en español y sin el botón de Zoho (se usa el de Joel)", async () => {
    const p = loadCrmChat();
    expect(loadCrmChat()).toBe(p);
    await Promise.resolve();
    await Promise.resolve();
    const s = document.getElementById("zsiqscript") as HTMLScriptElement;
    expect(s.src).toBe(SALESIQ_SRC);
    expect(document.querySelectorAll("#zsiqscript")).toHaveLength(1);
    const { calls, on } = zohoLoads();
    await p;
    expect(calls).toEqual(["language:es", "button:hide"]);
    expect(document.documentElement.classList.contains("ta-zoho-ready")).toBe(true);
    // El iframe se muestra mientras la ventana está abierta y el botón de Joel se entera
    const events: boolean[] = [];
    const listen = (e: Event) => events.push((e as CustomEvent<{ open: boolean }>).detail.open);
    window.addEventListener(CHAT_EVENT, listen);
    on.open();
    expect(document.documentElement.classList.contains("ta-zoho-open")).toBe(true);
    on.close();
    expect(document.documentElement.classList.contains("ta-zoho-open")).toBe(false);
    window.removeEventListener(CHAT_EVENT, listen);
    expect(events).toEqual([true, false]);
  });

  it("los botones del sitio abren la ventana de Zoho", async () => {
    const p = openCrmChat();
    await Promise.resolve();
    await Promise.resolve();
    const { calls } = zohoLoads();
    await p;
    expect(calls).toContain("window:show");
    expect(document.documentElement.classList.contains("ta-zoho-open")).toBe(true);
    await closeCrmChat();
    expect(calls).toContain("window:hide");
    expect(document.documentElement.classList.contains("ta-zoho-open")).toBe(false);
  });

  it("si el script no carga, falla y permite reintentar", async () => {
    const p = loadCrmChat();
    await Promise.resolve();
    await Promise.resolve();
    document.getElementById("zsiqscript")!.dispatchEvent(new Event("error"));
    await expect(p).rejects.toThrow("load");
    expect(document.getElementById("zsiqscript")).toBeNull();
    expect(loadCrmChat()).not.toBe(p);
  });

  it("si Zoho no responde a tiempo, falla", async () => {
    vi.useFakeTimers();
    const p = loadCrmChat();
    await vi.advanceTimersByTimeAsync(15_000);
    await expect(p).rejects.toThrow("timeout");
    vi.useRealTimers();
  });
});

describe("chat de Zoho SalesIQ · diseño del sitio", () => {
  it("aplica los estilos del sitio dentro de la ventana de Zoho, una sola vez", () => {
    expect(styleChatWindow()).toBe(false); // todavía no existe la ventana
    const frame = document.createElement("iframe");
    frame.id = "siq_chatwindow";
    document.body.appendChild(frame);
    expect(styleChatWindow()).toBe(true);
    styleChatWindow();
    expect(frame.contentDocument!.querySelectorAll("#ta-chat-style")).toHaveLength(1);
  });

  it("pone 'Reiniciar' en la cabecera: se ve solo si Zoho lo ofrece y pulsa el de Zoho", async () => {
    const frame = document.createElement("iframe");
    frame.id = "siq_chatwindow";
    document.body.appendChild(frame);
    const doc = frame.contentDocument!;
    doc.body.innerHTML = '<header class="siqcw-header"><div></div><em class="chat-win-close"></em></header><div id="scroll-container"></div>';
    styleChatWindow();
    const btn = doc.getElementById("ta-restart") as HTMLButtonElement;
    expect(btn.nextElementSibling?.className).toBe("chat-win-close");
    expect(btn.getAttribute("aria-label")).toBe("Reiniciar conversación");
    expect(btn.hidden).toBe(true);
    // Zoho ofrece reiniciar al pie del último mensaje del bot
    const zoho = doc.createElement("div");
    zoho.className = "bot-action";
    zoho.dataset.zsqa = "restart";
    const restart = vi.fn();
    zoho.addEventListener("click", restart);
    doc.getElementById("scroll-container")!.appendChild(zoho);
    await new Promise(r => setTimeout(r));
    expect(btn.hidden).toBe(false);
    btn.click();
    expect(restart).toHaveBeenCalledOnce();
    // Si Zoho redibuja la cabecera, el botón vuelve
    doc.querySelector("header")!.replaceWith(Object.assign(doc.createElement("header"), { className: "siqcw-header" }));
    await new Promise(r => setTimeout(r));
    expect(doc.querySelector(".siqcw-header #ta-restart")).not.toBeNull();
  });

  it("la hoja de estilos usa la marca: índigo, cuadrado amarillo girado, sin degradados y la foto de Joel", () => {
    // Vitest no procesa CSS (css: false): se revisa el archivo directamente
    const css = readFileSync("src/styles/zoho-chat.css", "utf8");
    expect(css).toContain("--siqcw-custom-bg-color: #1800ad");
    expect(css).toContain("rgba(255, 222, 89, 0.22)");
    expect(css).toContain("rotate(45deg)");
    expect(css).not.toMatch(/#356b58|#272b7c|#ff7619/i);
    expect(css).not.toMatch(/linear-gradient/);
    expect(css).toMatch(/--ta-joel: url\("data:image\/webp;base64,/);
    expect(css).toMatch(/\.siqcw-bot-logo,\s*\.embed-prof-cont \{[^}]*var\(--ta-joel\)/);
    // El CSS del portal de Zoho es la misma hoja (con la foto incrustada)
    const portal = readFileSync("docs/zoho-salesiq-portal.css", "utf8");
    expect(portal.slice(portal.indexOf("@import"))).toBe(css.slice(css.indexOf("@import")));
    expect(readFileSync("public/chat-asesor.html", "utf8")).toMatch(/noindex/);
  });
});
