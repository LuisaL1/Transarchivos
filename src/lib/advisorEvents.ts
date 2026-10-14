// Eventos del chat con un asesor (Zoho SalesIQ). Van aparte de src/lib/crmChat.ts
// para que el código de Zoho (y su hoja de estilos) se descargue solo cuando
// alguien elige "Hablar con un asesor".

/** Evento con { open: boolean } cuando la ventana de Zoho se abre o se cierra */
export const CRM_CHAT_EVENT = "ta:crm-chat";
/** Pedido de abrir el chat con un asesor (botón en el chat de Joel; lo atiende useAdvisorChat) */
export const ADVISOR_EVENT = "ta:open-advisor";
export const requestAdvisorChat = () => window.dispatchEvent(new Event(ADVISOR_EVENT));
/** Pedido de enviar la cotización del chat a un asesor (botón del resumen) */
export const QUOTE_EVENT = "ta:send-quote";
export const requestQuoteToAdvisor = () => window.dispatchEvent(new Event(QUOTE_EVENT));
