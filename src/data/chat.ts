// Joel, asesor virtual: chat guiado (cotización, servicios, preguntas
// frecuentes y contacto). Aquí viven los pasos de la conversación, los textos
// de la interfaz y los íconos de las opciones, en español y en inglés
// (makeChat(lang)). La lógica está en src/hooks/useAdvisorChat.ts; el texto
// libre lo responde el cerebro de Joel (src/lib/joel.ts y joel.en.ts).
import { contactHref, whatsappUrl } from "@/data/contact";
import { getContent } from "@/i18n/content";
import { localize, type Lang } from "@/i18n";

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

const CHAT_FAQ_COUNT = 6;

/** Celular con al menos 7 dígitos (también con indicativo de otro país) */
export const validPhone = (v: string) => v.replace(/\D/g, "").length >= 7;

// Textos de la interfaz del chat, por idioma
const TEXT = {
  es: {
    role: "Asesor virtual",
    status: "En línea · Responde al instante",
    restart: "Reiniciar conversación",
    closeChat: "Cerrar chat",
    openChat: `Hablar con ${NAME}, asesor virtual`,
    window: `Chat con ${NAME}`,
    placeholder: "Escriba su mensaje…",
    message: "Mensaje",
    send: "Enviar",
    close: "Cerrar",
    online: "En línea",
    connecting: "Conectando…",
    ai: "IA",
    hello: `¡Hola! Soy ${NAME}.`,
    closeTeaser: "Cerrar invitación",
    talk: `Hablar con ${NAME}`,
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
  },
  en: {
    role: "Virtual advisor",
    status: "Online · Replies instantly",
    restart: "Restart conversation",
    closeChat: "Close chat",
    openChat: `Talk to ${NAME}, virtual advisor`,
    window: `Chat with ${NAME}`,
    placeholder: "Type your message…",
    message: "Message",
    send: "Send",
    close: "Close",
    online: "Online",
    connecting: "Connecting…",
    ai: "AI",
    hello: `Hi! I'm ${NAME}.`,
    closeTeaser: "Close invitation",
    talk: `Talk to ${NAME}`,
    teaser: "Need to organise, scan or store your archive? I can help.",
    backToStart: "Back to start",
    crmError: "We couldn't open the chat with an advisor right now. Write to us through another channel:",
    crmWhatsapp: "Message us on WhatsApp",
    crmForm: "Leave a message",
    advisorAsk: "I'll connect you with an advisor. Type your message and they will reply right here. Our advisors speak Spanish; you may also write in English.",
    advisorConnecting: "Done, an advisor will reply here shortly.",
    advisorJoined: (name: string) => `${name} joined the conversation.`,
    advisorBusy: "Our advisors are busy right now. You can keep waiting here or write to us through another channel:",
    advisorEnded: "The advisor ended the conversation. Thank you for writing to us!",
    advisorBack: "You're back with me. If you want to talk to an advisor again, choose «Talk to an advisor».",
    advisorResume: "You are still in the chat with a Transarchivos advisor.",
    advisorSendError: "Your message could not be sent. Please try again.",
    advisorBanner: "Chat with a Transarchivos advisor",
    advisorEnd: "Back to Joel",
    advisorPlaceholder: "Type your message to the advisor…",
    advisorLabel: "Advisor",
    advisorForm: "Our team asks for a few contact details. You can fill them in the support window or continue without them.",
    advisorFormFill: "Fill in my details",
    advisorFormSkip: "Skip this step",
    quoteSent: (phone: string) => `Done, your quote is now with an advisor. They will contact you at ${phone}; if you stay here, you can also write to them in this chat.`,
    sendToAdvisor: "Send to an advisor",
    quoteSendFail: "I couldn't send it right now. Send it by WhatsApp with the button above and an advisor will reply.",
  },
};
type ChatText = typeof TEXT.es;

// Textos de la conversación guiada, por idioma
const STEP_TEXT = {
  es: {
    diagnostic: { title: "Diagnóstico documental", desc: "Le mostramos qué está pasando hoy con su archivo (volumen, estado, riesgos y oportunidades) antes de mover un solo papel." },
    volumes: ["Menos de 100 cajas", "Entre 100 y 1.000 cajas", "Más de 1.000 cajas", "No lo sé"],
    urgency: ["Sin urgencia", "En las próximas semanas", "Urgente"],
    quoteService: "Cotizar un servicio", services: "Conocer los servicios", faqs: "Preguntas frecuentes", human: "Hablar con un asesor", reset: "Volver al inicio",
    quoteThis: "Cotizar este servicio", another: "Ver otro servicio", anotherQ: "Otra pregunta", seeAllFaq: "Ver todas las preguntas", see: (t: string) => `Ver ${t}`, seeDiag: "Ver el diagnóstico documental",
    whatsapp: "Escribir por WhatsApp", form: "Escribirnos (formulario)", mail: "Enviar por correo", chatAdvisor: "Chatear con un asesor", send: "Enviar a un asesor",
    hello: [`¡Hola! Soy ${NAME}, el asesor virtual de Transarchivos. 👋`, "¿En qué le puedo ayudar hoy?"],
    qService: ["Con gusto. ¿Qué servicio necesita?", "Si no está seguro, el diagnóstico documental es el mejor punto de partida."],
    qVolume: (t: string) => [`${t}: buena elección.`, "¿Aproximadamente qué volumen de archivo tiene?"],
    qUrgency: ["¿Qué tan pronto lo necesita?"],
    qName: ["Perfecto. ¿Cuál es su nombre?", "Usaremos sus datos solo para responder su solicitud, según nuestra política de privacidad (transarchivos.com/privacidad)."], namePh: "Escriba su nombre…",
    qCompany: (n: string) => [`Gracias, ${n}. ¿De qué empresa nos escribe?`], companyPh: "Nombre de la empresa…",
    qPhone: ["¿A qué número de celular o WhatsApp le puede contactar un asesor?", "Con su solicitud, nuestro equipo comercial le contactará para darle seguimiento."], phonePh: "Ej. 300 123 4567",
    qPhoneRetry: ["Ese número no parece completo. ¿Me lo escribe de nuevo? Si es de otro país, incluya el indicativo."],
    qDone: (n: string) => [`¡Gracias, ${n}! Este es el resumen de su solicitud:`], qDoneEnd: "Envíela a un asesor y le contactará con el alcance y las condiciones.",
    summary: { service: "Servicio", volume: "Volumen", urgency: "Urgencia", company: "Empresa", phone: "Celular / WhatsApp" },
    infoList: ["Estos son nuestros servicios. ¿Sobre cuál quiere saber más?"],
    faqList: ["Estas son algunas de las preguntas que más nos hacen:"],
    humanSay: ["Le conecto con un asesor."],
    mailReason: "Solicitar una cotización", mailMsg: (s: string, p: string) => `Quisiera una cotización.\n${s}\n• Celular / WhatsApp: ${p}\n(Solicitud iniciada con Joel, asesor virtual)`,
    waMsg: (n: string, c: string, s: string) => `Hola, soy ${n} de ${c}. Joel (asesor virtual) me ayudó a preparar esta solicitud:\n${s}`,
  },
  en: {
    diagnostic: { title: "Document assessment", desc: "We show you what is going on with your archive today (volume, condition, risks and opportunities) before moving a single sheet of paper." },
    volumes: ["Fewer than 100 boxes", "Between 100 and 1,000 boxes", "More than 1,000 boxes", "I don't know"],
    urgency: ["No rush", "In the next few weeks", "Urgent"],
    quoteService: "Get a quote", services: "Discover the services", faqs: "Frequently asked questions", human: "Talk to an advisor", reset: "Back to start",
    quoteThis: "Get a quote for this service", another: "See another service", anotherQ: "Another question", seeAllFaq: "See all questions", see: (t: string) => `See ${t}`, seeDiag: "See the document assessment",
    whatsapp: "Message us on WhatsApp", form: "Write to us (form)", mail: "Send by email", chatAdvisor: "Chat with an advisor", send: "Send to an advisor",
    hello: [`Hi! I'm ${NAME}, Transarchivos' virtual advisor. 👋`, "How can I help you today?"],
    qService: ["Gladly. Which service do you need?", "If you're not sure, the document assessment is the best starting point."],
    qVolume: (t: string) => [`${t}: good choice.`, "Roughly what volume of records do you have?"],
    qUrgency: ["How soon do you need it?"],
    qName: ["Perfect. What is your name?", "We'll use your details only to answer your request, according to our privacy policy (transarchivos.com/en/privacy)."], namePh: "Type your name…",
    qCompany: (n: string) => [`Thank you, ${n}. Which company are you writing from?`], companyPh: "Company name…",
    qPhone: ["Which mobile or WhatsApp number can an advisor contact you on?", "With your request, our sales team will contact you to follow up."], phonePh: "E.g. +1 555 123 4567",
    qPhoneRetry: ["That number doesn't look complete. Could you type it again? If it's from another country, include the country code."],
    qDone: (n: string) => [`Thank you, ${n}! Here is the summary of your request:`], qDoneEnd: "Send it to an advisor and they will contact you with the scope and conditions.",
    summary: { service: "Service", volume: "Volume", urgency: "Urgency", company: "Company", phone: "Mobile / WhatsApp" },
    infoList: ["These are our services. Which one would you like to know more about?"],
    faqList: ["These are some of the questions we are asked most:"],
    humanSay: ["I'll connect you with an advisor."],
    mailReason: "Request a quote", mailMsg: (s: string, p: string) => `I would like a quote.\n${s}\n• Mobile / WhatsApp: ${p}\n(Request started with Joel, virtual advisor)`,
    waMsg: (n: string, c: string, s: string) => `Hello, I'm ${n} from ${c}. Joel (virtual advisor) helped me prepare this request:\n${s}`,
  },
};

export type ChatBundle = {
  steps: Record<string, ChatStep>;
  text: ChatText;
  /** Opciones que, al elegirse después de algo que Joel no entendió, le enseñan a qué se refería el visitante. */
  learnDest: Record<string, string>;
  teamQuoteMessage: (d: ChatData) => string;
  optionIcon: (label: string) => string;
};

const cache: Partial<Record<Lang, ChatBundle>> = {};

/** Conversación guiada, textos e íconos del chat en un idioma. */
export function makeChat(lang: Lang): ChatBundle {
  if (cache[lang]) return cache[lang]!;
  const S = STEP_TEXT[lang];
  const c = getContent(lang);
  const lp = (p: string) => localize(p, lang);
  const units = [
    { slug: "diagnostico", title: S.diagnostic.title, desc: S.diagnostic.desc },
    ...c.services.map(sv => ({ slug: sv.slug, title: sv.title, desc: sv.desc })),
  ];
  const unitBySlug = (slug: string) => units.find(u => u.slug === slug);

  /** Resumen de la cotización guiada (una línea por dato; el celular va aparte) */
  const quoteSummary = (d: ChatData) =>
    `• ${S.summary.service}: ${unitBySlug(d.service)?.title ?? "—"}\n• ${S.summary.volume}: ${d.volume ?? "—"}\n• ${S.summary.urgency}: ${d.urgency ?? "—"}\n• ${S.summary.company}: ${d.company ?? "—"}`;
  /** Formulario de contacto con la solicitud ya escrita */
  const quoteMailto = (d: ChatData) => contactHref({ motivo: S.mailReason, nombre: d.name, empresa: d.company, mensaje: S.mailMsg(quoteSummary(d), d.phone ?? "—") });
  /** WhatsApp con la solicitud ya escrita */
  const quoteWhatsapp = (d: ChatData) => whatsappUrl(S.waMsg(d.name || "", d.company || "", quoteSummary(d)));

  // Mensaje para el equipo comercial (siempre en español: lo lee el equipo de
  // Transarchivos) cuando el visitante termina una cotización con Joel.
  const teamQuoteMessage = (d: ChatData) => [
    `🆕 NUEVA COTIZACIÓN para seguimiento (chat de Joel en el sitio web${lang === "en" ? ", en inglés" : ""})`,
    `Cliente: ${d.name || "—"}`,
    `Celular / WhatsApp: ${d.phone || "—"}`,
    "",
    `• Servicio: ${getContent("es").services.find(s => s.slug === d.service)?.title ?? (d.service === "diagnostico" ? "Diagnóstico documental" : "—")}\n• Volumen: ${d.volume ?? "—"}\n• Urgencia: ${d.urgency ?? "—"}\n• Empresa: ${d.company ?? "—"}`,
    "",
    "Por favor, contactar al cliente para dar seguimiento o cerrar la venta.",
  ].join("\n");

  const contactActions: ChatAction[] = [
    { label: S.whatsapp, icon: "whatsapp", href: whatsappUrl() },
    { label: S.form, icon: "envelope-fill", href: contactHref() },
  ];
  const phoneNext = (d: ChatData) => (validPhone(d.phone ?? "") ? "q_done" : "q_phone_retry");

  const steps: Record<string, ChatStep> = {
    start: {
      say: () => S.hello,
      options: [
        { label: S.quoteService, next: "q_service" },
        { label: S.services, next: "info_list" },
        { label: S.faqs, next: "faq_list" },
        { label: S.human, next: "human" },
      ],
    },
    // Cotización guiada
    q_service: { say: () => S.qService, options: units.map(u => ({ label: u.title, next: "q_volume", set: { service: u.slug } })) },
    q_volume: { say: d => S.qVolume(unitBySlug(d.service)?.title ?? ""), options: S.volumes.map(v => ({ label: v, next: "q_urgency", set: { volume: v } })) },
    q_urgency: { say: () => S.qUrgency, options: S.urgency.map(v => ({ label: v, next: "q_name", set: { urgency: v } })) },
    q_name: { say: () => S.qName, input: { key: "name", placeholder: S.namePh, next: () => "q_company" } },
    q_company: { say: d => S.qCompany(d.name ?? ""), input: { key: "company", placeholder: S.companyPh, next: () => "q_phone" } },
    // Número para que el equipo comercial dé seguimiento a la cotización
    q_phone: { say: () => S.qPhone, input: { key: "phone", placeholder: S.phonePh, next: phoneNext } },
    q_phone_retry: { say: () => S.qPhoneRetry, input: { key: "phone", placeholder: S.phonePh, next: phoneNext } },
    q_done: {
      say: d => [...S.qDone(d.name ?? ""), `${quoteSummary(d)}\n• ${S.summary.phone}: ${d.phone ?? "—"}`, S.qDoneEnd],
      actions: d => [
        // Le llega al asesor en su chat (useAdvisorChat → Zoho SalesIQ)
        { label: S.send, icon: "headset", sendQuote: true },
        { label: S.whatsapp, icon: "whatsapp", href: quoteWhatsapp(d) },
        { label: S.mail, icon: "envelope-fill", href: quoteMailto(d) },
      ],
      options: [{ label: S.reset, next: "reset" }],
    },
    // Servicios
    info_list: { say: () => S.infoList, options: units.map(u => ({ label: u.title, next: "info_detail", set: { service: u.slug } })) },
    info_detail: {
      say: d => [unitBySlug(d.service)?.desc ?? ""],
      actions: d => d.service === "diagnostico"
        ? [{ label: S.seeDiag, icon: "search", href: "#cotizador" }]
        : [{ label: S.see(unitBySlug(d.service)?.title ?? ""), icon: "box-arrow-up-right", to: lp(`/servicios/${d.service}`) }],
      options: [{ label: S.quoteThis, next: "q_volume" }, { label: S.another, next: "info_list" }, { label: S.reset, next: "reset" }],
    },
    // Preguntas frecuentes
    faq_list: { say: () => S.faqList, options: () => c.faqs.slice(0, CHAT_FAQ_COUNT).map((f, i) => ({ label: f.q, next: "faq_answer", set: { faq: String(i) } })) },
    faq_answer: {
      say: d => [c.faqs[Number(d.faq)]?.a ?? ""],
      actions: () => [{ label: S.seeAllFaq, icon: "question-circle", href: "#faq" }],
      options: [{ label: S.anotherQ, next: "faq_list" }, { label: S.quoteService, next: "q_service" }, { label: S.reset, next: "reset" }],
    },
    // "Hablar con un asesor": useAdvisorChat conecta de una vez con el asesor.
    // Este paso solo se muestra si eso no es posible.
    human: { say: () => S.humanSay, actions: () => [{ label: S.chatAdvisor, icon: "headset", crm: true }, ...contactActions], options: [{ label: S.reset, next: "reset" }] },
  };

  // Íconos de las opciones del chat. TODAS las opciones se muestran con el mismo
  // formato (lista con ícono, como el menú inicial), así que toda opción tiene ícono.
  const icons: Record<string, string> = {
    [S.quoteService]: "ui-checks", [S.services]: "grid", [S.faqs]: "question-circle", [S.human]: "headset", [S.reset]: "arrow-counterclockwise",
    [TEXT[lang].advisorFormFill]: "person-lines-fill", [TEXT[lang].advisorFormSkip]: "skip-forward",
    [S.quoteThis]: "ui-checks", [S.another]: "grid", [S.anotherQ]: "question-circle",
    // Servicios: el mismo ícono de su tarjeta en el sitio
    [S.diagnostic.title]: "search",
    ...Object.fromEntries(c.services.map(sv => [sv.title, sv.icon])),
    // Volumen y urgencia
    [S.volumes[0]]: "box-seam", [S.volumes[1]]: "boxes", [S.volumes[2]]: "archive", [S.volumes[3]]: "question-circle",
    [S.urgency[0]]: "calendar-check", [S.urgency[1]]: "calendar-week", [S.urgency[2]]: "lightning-charge",
  };
  // Ícono para cualquier opción del chat (incluidas las que arma el cerebro de
  // Joel, como "Cotizar Servicio inmediato"). Nunca queda una opción sin ícono.
  const optionIcon = (label: string): string => {
    if (icons[label]) return icons[label];
    if (/^(Cotizar|Get a quote|Quote)/.test(label)) return "ui-checks";
    if (/^(Solicitar|Empezar|Request|Start)/.test(label)) return "search";
    if (/^(Ver|Conocer|See|Discover|Read)/.test(label)) return "box-arrow-up-right";
    if (/^(Hablar|Talk)/.test(label)) return "headset";
    if (/^Dudas|normativa|regulation/i.test(label)) return "shield-check";
    if (/^(Contarle|Tell)/.test(label)) return "chat-dots";
    if (/^¿|\?$/.test(label)) return "question-circle";
    return "chat-dots";
  };

  const bundle: ChatBundle = { steps, text: TEXT[lang], learnDest: { q_service: "intent:cotizar", human: "intent:contacto", faq_list: "intent:normativa" }, teamQuoteMessage, optionIcon };
  cache[lang] = bundle;
  return bundle;
}

// Versión en español (la de siempre), para quien no necesita elegir idioma.
const ES = makeChat("es");
export const CHAT_STEPS = ES.steps;
export const teamQuoteMessage = ES.teamQuoteMessage;
