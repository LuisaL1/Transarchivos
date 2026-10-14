// Joel, asesor virtual: chat guiado (cotización, servicios, preguntas
// frecuentes y contacto). Aquí viven los pasos de la conversación, los textos
// de la interfaz y los íconos de las opciones. La lógica está en
// src/hooks/useAdvisorChat.ts; el texto libre lo responde el cerebro de Joel
// (src/lib/joel.ts).
import { FAQS } from "@/data/faqs";
import { services } from "@/data/services";
import { contactHref, whatsappUrl } from "@/data/contact";

export const NAME = "Joel";

export type ChatData = Record<string, string>;
type ChatAction = {
  label: string;
  icon: string;
  href?: string;
  to?: string;
  /** Abre el chat con un asesor (Zoho SalesIQ; lo atiende useAdvisorChat) */
  crm?: boolean;
  /** Envía la cotización del chat a un asesor (useAdvisorChat) */
  sendQuote?: boolean;
};
export type ChatMsg = {
  /** "agent": un asesor de Transarchivos respondiendo desde Zoho SalesIQ */
  from: "bot" | "user" | "agent";
  text: string;
  actions?: ChatAction[];
  /** Nombre del asesor (mensajes "agent") */
  name?: string;
};
export type ChatOption = { label: string; next: string | ((d: ChatData) => string); set?: ChatData };
export type ChatStep = {
  say: (d: ChatData) => string[];
  options?: ChatOption[] | ((d: ChatData) => ChatOption[]);
  input?: { key: string; placeholder: string; next: (d: ChatData) => string };
  actions?: (d: ChatData) => ChatAction[];
};

const CHAT_UNITS = [
  { slug: "diagnostico", title: "Diagnóstico documental", desc: "Le mostramos qué está pasando hoy con su archivo (volumen, estado, riesgos y oportunidades) antes de mover un solo papel." },
  ...services.map(sv => ({ slug: sv.slug, title: sv.title, desc: sv.desc })),
];
const unitBySlug = (slug: string) => CHAT_UNITS.find(u => u.slug === slug);

const CHAT_VOLUMES = ["Menos de 100 cajas", "Entre 100 y 1.000 cajas", "Más de 1.000 cajas", "No lo sé"];
const CHAT_URGENCY = ["Sin urgencia", "En las próximas semanas", "Urgente"];
const CHAT_FAQ_COUNT = 6;

/** Resumen de la cotización guiada (una línea por dato; el celular va aparte) */
const quoteSummary = (d: ChatData) =>
  `• Servicio: ${unitBySlug(d.service)?.title ?? "—"}\n• Volumen: ${d.volume ?? "—"}\n• Urgencia: ${d.urgency ?? "—"}\n• Empresa: ${d.company ?? "—"}`;

/** Celular con al menos 7 dígitos (también con indicativo de otro país) */
export const validPhone = (v: string) => v.replace(/\D/g, "").length >= 7;

/** Formulario de contacto con la solicitud ya escrita */
const quoteMailto = (d: ChatData) => contactHref({
  motivo: "Solicitar una cotización", nombre: d.name, empresa: d.company,
  mensaje: `Quisiera una cotización.\n${quoteSummary(d)}\n• Celular / WhatsApp: ${d.phone ?? "—"}\n(Solicitud iniciada con Joel, asesor virtual)`,
});
/** WhatsApp con la solicitud ya escrita */
const quoteWhatsapp = (d: ChatData) =>
  whatsappUrl(`Hola, soy ${d.name || ""} de ${d.company || ""}. Joel (asesor virtual) me ayudó a preparar esta solicitud:\n${quoteSummary(d)}`);

/**
 * Mensaje para el equipo comercial cuando el visitante termina una cotización
 * con Joel: llega al chat de los asesores (Zoho SalesIQ) para dar seguimiento.
 */
export function teamQuoteMessage(d: ChatData): string {
  return [
    "🆕 NUEVA COTIZACIÓN para seguimiento (chat de Joel en el sitio web)",
    `Cliente: ${d.name || "—"}`,
    `Celular / WhatsApp: ${d.phone || "—"}`,
    "",
    quoteSummary(d),
    "",
    "Por favor, contactar al cliente para dar seguimiento o cerrar la venta.",
  ].join("\n");
}

const CONTACT_ACTIONS: ChatAction[] = [
  { label: "Escribir por WhatsApp", icon: "whatsapp", href: whatsappUrl() },
  { label: "Escribirnos (formulario)", icon: "envelope-fill", href: contactHref() },
];

export const CHAT_STEPS: Record<string, ChatStep> = {
  start: {
    say: () => [`¡Hola! Soy ${NAME}, el asesor virtual de Transarchivos. 👋`, "¿En qué le puedo ayudar hoy?"],
    options: [
      { label: "Cotizar un servicio", next: "q_service" },
      { label: "Conocer los servicios", next: "info_list" },
      { label: "Preguntas frecuentes", next: "faq_list" },
      { label: "Hablar con un asesor", next: "human" },
    ],
  },

  // Cotización guiada
  q_service: {
    say: () => ["Con gusto. ¿Qué servicio necesita?", "Si no está seguro, el diagnóstico documental es el mejor punto de partida."],
    options: CHAT_UNITS.map(u => ({ label: u.title, next: "q_volume", set: { service: u.slug } })),
  },
  q_volume: {
    say: d => [`${unitBySlug(d.service)?.title}: buena elección.`, "¿Aproximadamente qué volumen de archivo tiene?"],
    options: CHAT_VOLUMES.map(v => ({ label: v, next: "q_urgency", set: { volume: v } })),
  },
  q_urgency: {
    say: () => ["¿Qué tan pronto lo necesita?"],
    options: CHAT_URGENCY.map(v => ({ label: v, next: "q_name", set: { urgency: v } })),
  },
  q_name: {
    say: () => ["Perfecto. ¿Cuál es su nombre?", "Usaremos sus datos solo para responder su solicitud, según nuestra política de privacidad (transarchivos.com/privacidad)."],
    input: { key: "name", placeholder: "Escriba su nombre…", next: () => "q_company" },
  },
  q_company: {
    say: d => [`Gracias, ${d.name}. ¿De qué empresa nos escribe?`],
    input: { key: "company", placeholder: "Nombre de la empresa…", next: () => "q_phone" },
  },
  // Número para que el equipo comercial dé seguimiento a la cotización
  q_phone: {
    say: () => ["¿A qué número de celular o WhatsApp le puede contactar un asesor?", "Con su solicitud, nuestro equipo comercial le contactará para darle seguimiento."],
    input: { key: "phone", placeholder: "Ej. 300 123 4567", next: d => (validPhone(d.phone ?? "") ? "q_done" : "q_phone_retry") },
  },
  q_phone_retry: {
    say: () => ["Ese número no parece completo. ¿Me lo escribe de nuevo? Si es de otro país, incluya el indicativo."],
    input: { key: "phone", placeholder: "Ej. 300 123 4567", next: d => (validPhone(d.phone ?? "") ? "q_done" : "q_phone_retry") },
  },
  q_done: {
    say: d => [
      `¡Gracias, ${d.name}! Este es el resumen de su solicitud:`,
      `${quoteSummary(d)}\n• Celular / WhatsApp: ${d.phone ?? "—"}`,
      "Envíela a un asesor y le contactará con el alcance y las condiciones.",
    ],
    actions: d => [
      // Le llega al asesor en su chat (useAdvisorChat → Zoho SalesIQ)
      { label: "Enviar a un asesor", icon: "headset", sendQuote: true },
      { label: "Escribir por WhatsApp", icon: "whatsapp", href: quoteWhatsapp(d) },
      { label: "Enviar por correo", icon: "envelope-fill", href: quoteMailto(d) },
    ],
    options: [{ label: "Volver al inicio", next: "reset" }],
  },

  // Servicios
  info_list: {
    say: () => ["Estos son nuestros servicios. ¿Sobre cuál quiere saber más?"],
    options: CHAT_UNITS.map(u => ({ label: u.title, next: "info_detail", set: { service: u.slug } })),
  },
  info_detail: {
    say: d => [unitBySlug(d.service)?.desc ?? ""],
    actions: d => d.service === "diagnostico"
      ? [{ label: "Ver el diagnóstico documental", icon: "search", href: "#cotizador" }]
      : [{ label: `Ver ${unitBySlug(d.service)?.title}`, icon: "box-arrow-up-right", to: `/servicios/${d.service}` }],
    options: [
      { label: "Cotizar este servicio", next: "q_volume" },
      { label: "Ver otro servicio", next: "info_list" },
      { label: "Volver al inicio", next: "reset" },
    ],
  },

  // Preguntas frecuentes
  faq_list: {
    say: () => ["Estas son algunas de las preguntas que más nos hacen:"],
    options: () => FAQS.slice(0, CHAT_FAQ_COUNT).map((f, i) => ({ label: f.q, next: "faq_answer", set: { faq: String(i) } })),
  },
  faq_answer: {
    say: d => [FAQS[Number(d.faq)]?.a ?? ""],
    actions: () => [{ label: "Ver todas las preguntas", icon: "question-circle", href: "#faq" }],
    options: [
      { label: "Otra pregunta", next: "faq_list" },
      { label: "Cotizar un servicio", next: "q_service" },
      { label: "Volver al inicio", next: "reset" },
    ],
  },

  // "Hablar con un asesor": useAdvisorChat conecta de una vez con el asesor.
  // Este paso solo se muestra si eso no es posible.
  human: {
    say: () => ["Le conecto con un asesor."],
    actions: () => [{ label: "Chatear con un asesor", icon: "headset", crm: true }, ...CONTACT_ACTIONS],
    options: [{ label: "Volver al inicio", next: "reset" }],
  },
};

// Opciones que, al elegirse después de algo que Joel no entendió, le enseñan
// a qué se refería el visitante.
export const LEARN_DEST: Record<string, string> = { q_service: "intent:cotizar", human: "intent:contacto", faq_list: "intent:normativa" };

// Textos de la interfaz del chat
export const CHAT_TEXT = {
  role: "Asesor virtual",
  status: "En línea · Responde al instante",
  restart: "Reiniciar conversación",
  closeChat: "Cerrar chat",
  openChat: `Hablar con ${NAME}, asesor virtual`,
  window: `Chat con ${NAME}`,
  placeholder: "Escriba su mensaje…",
  message: "Mensaje",
  send: "Enviar",
  teaser: "¿Necesita organizar, digitalizar o custodiar su archivo? Le ayudo.",
  backToStart: "Volver al inicio",
  // Chat con un asesor (Zoho SalesIQ)
  crmError: "No pudimos abrir el chat con un asesor en este momento. Escríbanos por otro canal:",
  crmWhatsapp: "Escribir por WhatsApp",
  crmForm: "Dejar un mensaje",
  // Chat con un asesor dentro de la ventana de Joel (src/lib/advisorChat.ts y zohoBridge.ts)
  advisorAsk: "Le conecto con un asesor. Escríbale su mensaje y le responderá aquí mismo.",
  advisorConnecting: "Listo, un asesor le responderá aquí en unos momentos.",
  advisorJoined: (name: string) => `${name} se unió a la conversación.`,
  advisorBusy: "Nuestros asesores están ocupados en este momento. Puede seguir esperando aquí o escribirnos por otro canal:",
  advisorEnded: "El asesor terminó la conversación. ¡Gracias por escribirnos!",
  advisorBack: "Volvió conmigo. Si quiere hablar otra vez con un asesor, elija «Hablar con un asesor».",
  advisorResume: "Sigue en el chat con un asesor de Transarchivos.",
  advisorSendError: "Su mensaje no se pudo enviar. Inténtelo de nuevo.",
  advisorBanner: "Chat con un asesor de Transarchivos",
  advisorEnd: "Volver con Joel",
  advisorPlaceholder: "Escriba su mensaje al asesor…",
  advisorLabel: "Asesor",
  advisorForm: "Nuestro equipo le pide unos datos de contacto. Puede completarlos en la ventana de atención o seguir sin ellos.",
  advisorFormFill: "Completar mis datos",
  advisorFormSkip: "Omitir este paso",
  // Cotización enviada al chat de los asesores para seguimiento
  quoteSent: (phone: string) => `Listo, su cotización ya está con un asesor. Le contactará al ${phone}; si sigue aquí, también le puede escribir en este chat.`,
  sendToAdvisor: "Enviar a un asesor",
  quoteSendFail: "No pude enviarla en este momento. Envíela por WhatsApp con el botón de arriba y un asesor le responderá.",
};

// Íconos de las opciones del chat. TODAS las opciones se muestran con el mismo
// formato (lista con ícono, como el menú inicial), así que toda opción tiene ícono.
const CHAT_OPTION_ICONS: Record<string, string> = {
  "Cotizar un servicio": "ui-checks", "Conocer los servicios": "grid", "Preguntas frecuentes": "question-circle",
  "Hablar con un asesor": "headset", "Volver al inicio": "arrow-counterclockwise",
  "Completar mis datos": "person-lines-fill", "Omitir este paso": "skip-forward",
  "Cotizar este servicio": "ui-checks", "Ver otro servicio": "grid", "Otra pregunta": "question-circle",
  // Servicios: el mismo ícono de su tarjeta en el sitio
  "Diagnóstico documental": "search",
  ...Object.fromEntries(services.map(sv => [sv.title, sv.icon])),
  // Volumen y urgencia
  "Menos de 100 cajas": "box-seam", "Entre 100 y 1.000 cajas": "boxes", "Más de 1.000 cajas": "archive", "No lo sé": "question-circle",
  "Sin urgencia": "calendar-check", "En las próximas semanas": "calendar-week", "Urgente": "lightning-charge",
};

// Ícono para cualquier opción del chat (incluidas las que arma el cerebro de
// Joel, como "Cotizar Servicio inmediato"). Nunca queda una opción sin ícono.
export function chatOptionIcon(label: string): string {
  if (CHAT_OPTION_ICONS[label]) return CHAT_OPTION_ICONS[label];
  if (/^Cotizar/.test(label)) return "ui-checks";
  if (/^(Solicitar|Empezar)/.test(label)) return "search";
  if (/^(Ver|Conocer)/.test(label)) return "box-arrow-up-right";
  if (/^Hablar/.test(label)) return "headset";
  if (/^Dudas|normativa/i.test(label)) return "shield-check";
  if (/^Contarle/.test(label)) return "chat-dots";
  if (/^¿/.test(label)) return "question-circle";
  return "chat-dots";
}
