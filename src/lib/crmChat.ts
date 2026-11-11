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
// · El botón propio de Zoho se esconde: el chat se abre con el botón de Joel
//   (src/components/chat/ChatLauncher.tsx). El iframe solo se ve con la
//   ventana abierta, con el tamaño y la posición de la ventana de Joel (clase
//   ta-zoho-open, src/styles/index.css).
// · Diseño: src/styles/zoho-chat.css (adentro de la ventana, como el chat de
//   Joel) y src/styles/zoho-host.css (la ventana llena el iframe). Como en el
//   chat de Joel, "Reiniciar" es un botón de la cabecera (addRestartButton).
// · Solo en español. El código del widget no es secreto.
// Documentación: docs/08-chat-asesor.md.
import chatCss from "@/styles/zoho-chat.css?raw";
import hostCss from "@/styles/zoho-host.css?raw";
import { CHAT_EVENT } from "@/lib/chatWidget";

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
      // La ventana de Zoho llena el iframe
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
const RESTART_ID = "ta-restart";
/** "Reiniciar" que Zoho pone al pie del último mensaje del bot (zoho-chat.css lo esconde) */
const ZOHO_RESTART = '.bot-action[data-zsqa="restart"]';
/** Bootstrap Icons: arrow-counterclockwise */
const RESTART_ICON = ["M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z", "M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"];
const SVG_NS = "http://www.w3.org/2000/svg";

function restartIcon(doc: Document) {
  const svg = doc.createElementNS(SVG_NS, "svg");
  svg.setAttribute("width", "15");
  svg.setAttribute("height", "15");
  svg.setAttribute("viewBox", "0 0 16 16");
  svg.setAttribute("fill", "currentColor");
  svg.setAttribute("aria-hidden", "true");
  for (const d of RESTART_ICON) {
    const path = doc.createElementNS(SVG_NS, "path");
    path.setAttribute("fill-rule", "evenodd");
    path.setAttribute("d", d);
    svg.appendChild(path);
  }
  return svg;
}

/** Tiempo máximo para esperar el "Reiniciar" de Zoho si se pulsa mientras el bot responde */
const RESTART_WAIT_MS = 10_000;

/** Botón "Reiniciar" de la cabecera; pulsa el de Zoho: el funcionamiento es el
 *  mismo. Zoho solo tiene el suyo mientras el último mensaje es del bot y este
 *  no está escribiendo; para no parpadear, el botón sigue a la vista desde que
 *  Zoho lo ofrece hasta que termina la conversación con el bot (un asesor la
 *  toma o se cierra). Si se pulsa mientras el bot responde, espera al de Zoho. */
function addRestartButton(doc: Document) {
  let offered = false;
  let waiting = 0;
  const lastZohoRestart = () => {
    const all = doc.querySelectorAll<HTMLElement>(ZOHO_RESTART);
    return all[all.length - 1];
  };
  const setWaiting = (timer: number) => {
    window.clearTimeout(waiting);
    waiting = timer;
    doc.getElementById(RESTART_ID)?.toggleAttribute("aria-busy", timer > 0);
  };
  const press = () => {
    const zoho = lastZohoRestart();
    if (zoho) zoho.click();
    else setWaiting(window.setTimeout(() => setWaiting(0), RESTART_WAIT_MS));
  };
  const sync = () => {
    const zoho = lastZohoRestart();
    if (zoho && waiting) {
      setWaiting(0);
      zoho.click();
    }
    offered = !!doc.querySelector(".bot-chat") && (offered || !!zoho);
    // Se repone si Zoho redibuja la cabecera
    const header = doc.querySelector(".siqcw-header");
    let btn = doc.getElementById(RESTART_ID) as HTMLButtonElement | null;
    if (header && btn?.parentElement !== header) {
      btn?.remove();
      btn = doc.createElement("button");
      btn.id = RESTART_ID;
      btn.type = "button";
      btn.title = "Reiniciar conversación";
      btn.setAttribute("aria-label", btn.title);
      btn.appendChild(restartIcon(doc));
      btn.addEventListener("click", press);
      header.appendChild(btn);
    }
    if (btn && btn.hidden === offered) btn.hidden = !offered;
  };
  sync();
  new MutationObserver(sync).observe(doc.documentElement, { childList: true, subtree: true });
}

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
    addRestartButton(doc);
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

/** Muestra el iframe mientras la ventana de Zoho está abierta y avisa al botón de Joel. */
const setOpen = (open: boolean) => {
  document.documentElement.classList.toggle("ta-zoho-open", open);
  window.dispatchEvent(new CustomEvent(CHAT_EVENT, { detail: { open } }));
};

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
        z.floatbutton?.visible("hide");
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

/** Cierra la ventana del chat. */
export async function closeCrmChat() {
  const z = await loadCrmChat();
  z.floatwindow?.visible("hide");
  setOpen(false);
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
