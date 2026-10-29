// Puerta de entrada al chat (widget de Zoho SalesIQ). El código de Zoho y sus
// hojas de estilo (src/lib/crmChat.ts) se descargan aparte, no en el paquete
// principal.
import { whatsappUrl } from "@/data/contact";

/** Evento con { open: boolean } cuando la ventana de Zoho se abre o se cierra */
export const CHAT_EVENT = "ta:crm-chat";

const crmChat = () => import("@/lib/crmChat");
let open = false;
if (typeof window !== "undefined") window.addEventListener(CHAT_EVENT, e => { open = (e as CustomEvent<{ open: boolean }>).detail.open; });

/** Carga el widget al entrar al sitio, cuando el navegador está libre. */
export function startChatWidget() {
  const run = () => { void crmChat().then(m => m.loadCrmChat()).catch(() => {}); };
  if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(run, { timeout: 4000 });
  else setTimeout(run, 1500);
}

/** Abre la ventana del chat; si Zoho no carga, ofrece WhatsApp. */
export function openChat() {
  void crmChat().then(m => m.openCrmChat()).catch(() => window.open(whatsappUrl(), "_blank", "noopener"));
}

/** Botón flotante de Joel: abre o cierra la ventana del chat. */
export function toggleChat() {
  if (!open) return openChat();
  void crmChat().then(m => m.closeCrmChat());
}
