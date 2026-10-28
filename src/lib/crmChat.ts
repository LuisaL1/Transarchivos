// ─── Chat con el widget de Zoho SalesIQ ──────────────────────────────────────
// El chat del sitio ES el widget de Zoho SalesIQ (botón flotante y ventana):
// los flujos, botones y respuestas se configuran en Zoho. Se carga al entrar
// al sitio (src/lib/chatWidget.ts), así que Zoho pone sus cookies desde la
// primera visita (ver la política de datos).
//
// · Zoho vive en una PÁGINA AISLADA del sitio (public/chat-asesor.html) que se
//   muestra en un iframe en la esquina. Esa página tiene su propia CSP
//   (vercel.json) con los scripts en línea que Zoho necesita; el resto del
//   sitio conserva su CSP estricta.
// · El iframe ocupa solo el botón mientras la ventana está cerrada y crece al
//   abrirla (clase ta-zoho-open, src/styles/index.css).
// · Diseño: src/styles/zoho-chat.css (adentro de la ventana) y
//   src/styles/zoho-host.css (marco y botón).
// · Solo en español. El código del widget no es secreto.
// Documentación: docs/08-chat-asesor.md.
import chatCss from "@/styles/zoho-chat.css?raw";
import hostCss from "@/styles/zoho-host.css?raw";

/** Código del widget de SalesIQ de Transarchivos (Zoho → Configuración → Marcas → Transarchivos → Código de instalación). No es secreto. */
export const SALESIQ_WIDGET = "siqeaaa826a3795e844e6740651f160fdd894fe2b84c3b32f737334473fe85fbb32";
export const SALESIQ_SRC = `https://salesiq.zohopublic.com/widget?wc=${SALESIQ_WIDGET}`;
/** Página aislada donde vive Zoho y el iframe que la contiene */
export const HOST_SRC = "/chat-asesor.html";
export const HOST_ID = "ta-zoho-frame";
/** Tiempo máximo para que cargue el widget de Zoho */
const TIMEOUT_MS = 15_000;

type SalesIQ = {
  ready?: () => void;
  language?: (l: string) => void;
  floatbutton?: { visible: (v: "show" | "hide") => void };
  floatwindow?: {
    visible: (v: "show" | "hide") => void;
    open?: (cb: () => void) => void;
    close?: (cb: () => void) => void;
    minimize?: (cb: () => void) => void;
  };
};
declare global {
  interface Window {
    $zoho?: { salesiq?: SalesIQ };
  }
}

// ─── Página aislada ─────────────────────────────────────────────────────────
let host: Promise<Window> | null = null;
let hostWin: Window | null = null;

/** Crea (una vez) el iframe con la página aislada y espera a que cargue. */
function zohoHost(): Promise<Window> {
  if (host) return host;
  host = new Promise<Window>((resolve, reject) => {
    const frame = document.createElement("iframe");
    frame.id = HOST_ID;
    frame.title = "Chat con un asesor de Transarchivos";
    frame.onload = () => {
      const w = frame.contentWindow;
      if (!w?.document?.body) return reject(new Error("host"));
      // Marco y botón de la ventana de Zoho
      const style = w.document.createElement("style");
      style.textContent = hostCss;
      w.document.head.appendChild(style);
      hostWin = w;
      resolve(w);
    };
    frame.onerror = () => reject(new Error("host"));
    frame.src = HOST_SRC;
    document.body.appendChild(frame);
  }).catch(e => {
    host = null;
    document.getElementById(HOST_ID)?.remove();
    throw e;
  });
  return host;
}

const STYLE_ID = "ta-chat-style";

/** Aplica el diseño del sitio dentro de la ventana de Zoho (iframe del mismo origen). */
export function styleChatWindow(): boolean {
  const frame = hostWin?.document.getElementById("siq_chatwindow") as HTMLIFrameElement | null;
  const doc = frame?.contentDocument;
  if (!frame || !doc?.head) return false;
  if (!frame.dataset.taStyled) {
    // Si Zoho vuelve a cargar la ventana, se aplica otra vez
    frame.addEventListener("load", () => styleChatWindow());
    frame.dataset.taStyled = "1";
  }
  if (!doc.getElementById(STYLE_ID)) {
    const style = doc.createElement("style");
    style.id = STYLE_ID;
    style.textContent = chatCss;
    doc.head.appendChild(style);
  }
  return true;
}

/** Espera a que Zoho cree la ventana para darle el diseño del sitio. */
function watchChatWindow(w: Window) {
  if (styleChatWindow()) return;
  const obs = new MutationObserver(() => { if (styleChatWindow()) obs.disconnect(); });
  obs.observe(w.document.body, { childList: true, subtree: true });
  window.setTimeout(() => obs.disconnect(), 30_000);
}

/** Agranda el iframe mientras la ventana de Zoho está abierta. */
const setOpen = (open: boolean) => document.documentElement.classList.toggle("ta-zoho-open", open);

let loading: Promise<SalesIQ> | null = null;

/** Carga el script de Zoho una sola vez (en la página aislada) y resuelve cuando está listo. */
export function loadCrmChat(): Promise<SalesIQ> {
  if (loading) return loading;
  loading = zohoHost().then(w => new Promise<SalesIQ>((resolve, reject) => {
    const timer = window.setTimeout(() => fail(new Error("timeout")), TIMEOUT_MS);
    function fail(e: Error) {
      window.clearTimeout(timer);
      loading = null; // permite reintentar
      w.document.getElementById("zsiqscript")?.remove();
      reject(e);
    }
    // Objeto de arranque que pide Zoho (el mismo del fragmento oficial)
    w.$zoho = w.$zoho || {};
    w.$zoho.salesiq = {
      ...w.$zoho.salesiq,
      ready() {
        window.clearTimeout(timer);
        const z = w.$zoho!.salesiq!;
        z.language?.("es");
        z.floatbutton?.visible("show");
        z.floatwindow?.open?.(() => setOpen(true));
        z.floatwindow?.close?.(() => setOpen(false));
        z.floatwindow?.minimize?.(() => setOpen(false));
        watchChatWindow(w);
        document.documentElement.classList.add("ta-zoho-ready");
        resolve(z);
      },
    };
    const s = w.document.createElement("script");
    s.id = "zsiqscript";
    s.src = SALESIQ_SRC;
    s.defer = true;
    s.onerror = () => fail(new Error("load"));
    w.document.body.appendChild(s);
  }));
  loading.catch(() => (loading = null));
  return loading;
}

/** Abre la ventana del chat (carga Zoho si hace falta). */
export async function openCrmChat() {
  const z = await loadCrmChat();
  setOpen(true);
  z.floatwindow?.visible("show");
}

/** Solo para pruebas: usa esta ventana como página aislada (jsdom no carga iframes). */
export function setZohoHostForTests(w: Window) {
  hostWin = w;
  host = Promise.resolve(w);
}

/** Solo para pruebas: olvida la carga anterior. */
export function resetCrmChatForTests() {
  loading = null;
  host = null;
  hostWin = null;
  document.getElementById(HOST_ID)?.remove();
  document.documentElement.classList.remove("ta-zoho-open", "ta-zoho-ready");
}
