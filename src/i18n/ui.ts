// Textos de la interfaz compartida (header, menús, pie, búsqueda, soporte,
// cookies, formulario de contacto, cotizador y secciones de la portada) en los
// dos idiomas. El español es la referencia: el objeto `en` debe tener las
// mismas claves (TypeScript lo exige). Los componentes los leen con useUi().
import { useLang, type Lang } from "@/i18n";

const es = {
  nav: {
    services: "Servicios", solutions: "Soluciones", about: "Nosotros", blog: "Blog", videos: "Da play al conocimiento", contact: "Contacto",
    quote: "Cotización", quoteLong: "Solicitar cotización", contactDirect: "Contacto directo", search: "Buscar", closeSearch: "Cerrar búsqueda", support: "Soporte",
    openMenu: "Abrir menú", closeMenu: "Cerrar menú", logo: "Transarchivos, ir al inicio", chatJoel: "Chat con Joel", whatsapp: "WhatsApp",
    blogAndFaq: "Contacto y preguntas frecuentes", address: "Cl. 21 # 39A-40, Bogotá", chooseLang: "Elegir idioma", langs: "Idiomas disponibles",
  },
  menus: {
    services: { kicker: "Diagnóstico documental", title: "¿No sabe por dónde empezar?", text: "Le mostramos el diagnóstico técnico y normativo de su información antes de mover un solo folio. ¿Dudas inmediatas? Pregúntele a Joel, nuestro consultor virtual disponible 24/7.", cta: "Agendar diagnóstico inicial", foot: "9 servicios bajo la Ley 594 de 2000 y la normativa del AGN", all: "Ver todos" },
    solutions: { kicker: "Soluciones", title: "Parta de su necesidad, no del servicio", text: "Combinamos nuestros servicios según el reto de su empresa: cumplimiento legal, espacio, oficina cero papel o gestión del archivo en su sede.", cta: "Ver todas las soluciones" },
    about: { kicker: "Desde 1983", title: "Pioneros de la gestión documental en Colombia", text: "Más de 40 años ayudando a las empresas a organizar, proteger y transformar su información.", cta: "Conozca nuestra historia" },
    blog: { kicker: "Blog y novedades", title: "Conocimiento especializado que protege la memoria de su empresa", text: "Guías sobre gestión documental, normativa, tecnología y sostenibilidad.", cta: "Ver todos los artículos", videos: "Da play al conocimiento: todos los videos del canal" },
  },
  support: {
    title: "Soporte Transarchivos", text: "¿Necesita ayuda con su archivo o su solicitud?",
    chat: "Chatee con Joel", chatDesc: "Asesor con IA, responde al instante", whatsapp: "Escríbanos por WhatsApp", call: "Llámenos", write: "Escríbanos", writeDesc: "Formulario de contacto", faq: "Ver preguntas frecuentes",
  },
  search: {
    placeholder: "Buscar servicios, soluciones, artículos…", aria: "Buscar", dialog: "Buscar en el sitio", close: "Cerrar búsqueda", quick: "Accesos rápidos",
    shortcuts: ["Servicios", "Soluciones", "Solicitar cotización", "Preguntas frecuentes"],
    none: (q: string) => `Sin resultados para "${q}".`, hint: "Pruebe con otra palabra, o pregúntele a Joel en el chat.",
    kinds: { Servicio: "Servicio", Artículo: "Artículo", Sección: "Sección", Pregunta: "Pregunta" } as Record<string, string>,
    index: {
      diagnostic: ["Diagnóstico documental", "Empiece por saber qué está pasando con su archivo, antes de mover un solo papel"],
      solutions: ["Soluciones", "Cumplimiento normativo, respaldo ante desastres, oficina cero papel, espacio y auditorías"],
      model: ["Cómo trabajamos", "Nuestro modelo de 4 pasos: diagnóstico, solución, protección y expansión"],
      faq: ["Preguntas frecuentes", "Cotización, costos, cobertura, normativa, custodia y más"],
      blog: ["Blog", "Artículos y guías sobre gestión documental, tecnología y sostenibilidad"],
      videos: ["Da play al conocimiento", "Todos los videos del canal de YouTube de Transarchivos: guías, normativa y servicios"],
      quote: ["Solicitar cotización", "Elija su servicio y responda unas preguntas para armar su solicitud"],
    },
  },
  cookies: {
    aria: "Aviso de cookies", title: "Usamos cookies analíticas",
    text: "Nos ayudan a entender cómo se usa el sitio para mejorarlo. No las usamos con fines publicitarios. Puede aceptarlas o rechazarlas; el sitio funciona igual. Más información en nuestra ",
    policy: "política de privacidad", accept: "Aceptar", reject: "Rechazar",
  },
  contact: {
    title: "Escríbanos", text: "Déjenos sus datos y un asesor de Transarchivos le responde.", close: "Cerrar formulario",
    name: "Nombre *", company: "Empresa", email: "Correo electrónico *", phone: "Teléfono", reason: "Motivo *", message: "Mensaje *", placeholder: "Cuéntenos qué necesita…",
    consent: "Autorizo a Transarchivos Ltda. a tratar mis datos personales para responder esta solicitud, según su ", consentLink: "política de privacidad y tratamiento de datos",
    error: "No pudimos enviar su mensaje en este momento. Intente de nuevo o escríbanos por ", code: "Código", send: "Enviar mensaje", sending: "Enviando…",
    sentTitle: "¡Mensaje enviado!", sentText: (email: string) => `Recibimos su solicitud. Un asesor le responderá a ${email}.`, closeBtn: "Cerrar",
    subject: (reason: string) => `Contacto web — ${reason}`,
  },
  cta: { quote: "Solicitar cotización", whatsapp: "Escribir por WhatsApp", text: "Arme su solicitud en minutos o hable con un asesor. Sin compromiso." },
  solutions: {
    kicker: "Soluciones", titleA: "Soluciones de acuerdo con la ", titleMark: "necesidad de su empresa",
    text: "Combinamos infraestructura, tecnología OCR e instrumentos archivísticos para resolver problemáticas complejas de espacio, cumplimiento, digitalización y seguridad.",
    integrated: "Servicios integrados",
  },
  faq: {
    kicker: "Preguntas frecuentes", title: "Resolvemos sus dudas", text: "Lo que más nos preguntan sobre nuestros servicios. Si no encuentra su respuesta, hable con nosotros.",
    help: "¿Necesita ayuda?", chat: "Chatee con Joel",
  },
  blog: {
    kicker: "Blog y novedades", title1: "Conocimiento especializado que protege", title2: "la memoria de su empresa", featured: "Destacado", read: "Leer artículo", min: "min",
    subTitle: "Reciba novedades y guías en su correo", subText: "Contenido sobre gestión documental y novedades de Transarchivos.", placeholder: "su@correo.com",
    subscribe: "Suscribirme", sending: "Enviando…", consent: "Autorizo el tratamiento de mi correo para recibir novedades, según la ", policy: "política de privacidad",
    thanks: "¡Gracias! Le enviamos la confirmación a su correo.", error: "No pudimos registrar su correo. Intente de nuevo en unos minutos.",
    subject: "Nueva suscripción al blog", origin: "Sección Blog del sitio web",
  },
  quote: {
    kicker: "Cotización a la medida", title: "Defina su necesidad y prepare su solicitud comercial",
    text: "4 pasos simples. Visualice la composición técnica de su requerimiento en tiempo real antes de conectarse con nuestro equipo comercial.",
    steps: ["Servicio", "Detalles", "Contacto", "Resumen"],
    diagnostic: { title: "Diagnóstico documental", desc: "Identificamos la condición actual del archivo y su volumen. Diseñamos la ruta técnica adecuada antes de iniciar cualquier intervención." },
    s0Title: "¿Qué servicio necesita?", s0Text: "¿No tiene certeza sobre el alcance técnico? Inicie con un Diagnóstico Documental para evaluar el estado actual de su archivo.", next: "Continuar", back: "Atrás",
    solution: "Solución", multi: "Esta solución combina varios servicios. Está cotizando el principal; puede cambiar:", single: "Está cotizando el servicio que compone esta solución.",
    s1Title: "Cuéntenos sobre su archivo", s1Text: "Si no conoce algún dato, elija \"No lo sé\": un asesor le ayudará a completarlo.", select: "Seleccione…",
    location: "Ubicación (ciudad y sede)", locationPh: "Ej.: Bogotá, sede principal", special: "Requerimientos especiales", optional: "(opcional)", specialPh: "Restricciones, características del material, otra información…",
    s2Title: "¿A quién contactamos?", s2Text: "Usaremos estos datos solo para responder su solicitud.", company: "Empresa", sector: "Sector económico", name: "Su nombre", role: "Cargo", email: "Correo electrónico", phone: "Teléfono",
    consent: "Autorizo a Transarchivos Ltda. a tratar mis datos personales para responder esta solicitud, según su ", consentLink: "política de privacidad y tratamiento de datos", summary: "Ver resumen",
    s3Title: "Revise y envíe su solicitud", s3Text: "Envíela por correo o por WhatsApp: llega directamente a nuestro equipo comercial.", nextStep: "Siguiente paso", also: "También podría necesitar", modify: "Modificar datos",
    sendWa: "Enviar por WhatsApp", sendMail: "Enviar por correo", sent: "Solicitud enviada", sending: "Enviando…", thanks: (email: string) => `¡Gracias! Recibimos su solicitud. Un asesor le responderá a ${email}.`,
    error: "No pudimos enviar la solicitud en este momento. Intente de nuevo o escríbanos por ",
    aside: "Su solicitud", change: "Cambiar", complete: "Información completa", noCommit: "Sin compromiso. Un asesor revisa su solicitud y le responde con el alcance y las condiciones.",
    nextSteps: {
      missing: { t: "Completar la información", d: "Faltan variables críticas. Un asesor le pedirá los datos restantes o programará una visita o levantamiento antes de cotizar." },
      special: { t: "Validación de Operaciones", d: "Su solicitud tiene una condición especial. Comercial y Operaciones la validarán antes de comprometer alcance y tiempos." },
      ok: { t: "Cotización según parámetros", d: "La información es suficiente. Comercial elaborará la cotización con el alcance y las condiciones definidas." },
    },
    labels: { location: "Ubicación", special: "Requerimientos especiales", none: "Ninguno", company: "Empresa", sector: "Sector", contact: "Contacto", email: "Correo", phone: "Teléfono", service: "Servicio", solutionOf: "Solución de interés", nextStep: "Siguiente paso sugerido" },
    waIntro: "Hola, Transarchivos. Quisiera una cotización.", waData: "Datos de la solicitud", waContact: "Contacto", subject: (title: string) => `Solicitud de cotización — ${title}`,
    unknown: ["no l", "no estoy"],
  },
  clients: { kicker: "Nuestros clientes", title: "Más de 4.000 compañías garantizan nuestro cumplimiento", aria: "Empresas que han confiado en Transarchivos", row: (n: number) => `Logos de clientes, fila ${n}` },
  stats: { aria: "Nuestra experiencia en cifras" },
  map: {
    aria: "Central de operaciones en Bogotá", kicker: "Centro de operaciones · Bogotá", title: "La Central de Operaciones Documentales de Transarchivos (respaldos multi-sede)",
    text1: "Desde Bogotá lideramos soluciones de custodia, digitalización y destrucción documental. Disponemos de múltiples centros documentales estratégicamente distribuidos en la ciudad para prevenir la pérdida masiva de información ante desastres o contingencias.",
    text2: "Nuestras sedes cuentan con laboratorios y sistemas de seguridad para proteger, procesar y administrar activos de información sensible. Garantizamos la ejecución de procesos críticos y la destrucción segura de archivos bajo estricto cumplimiento legal, ambiental y de Hábeas Data.",
    alt: "Mapa de Cundinamarca con Bogotá resaltada y los municipios vecinos", bogota: "Bogotá · Centro de operaciones",
    endKicker: "Gestión documental integral", endTitle: "Más de cuatro décadas liderando la protección de la información empresarial de Colombia",
    endText: "Gestionando el ciclo total de sus archivos bajo los estándares de la normativa colombiana. Nos encargamos de la clasificación, digitalización con OCR, custodia de alta seguridad y destrucción trazable, brindando respaldo legal a su empresa.",
    scroll: "Desplácese", cta: "Solicitar cotización",
  },
};

export type Ui = typeof es;

const en: Ui = {
  nav: {
    services: "Services", solutions: "Solutions", about: "About us", blog: "Blog", videos: "Press play on knowledge", contact: "Contact",
    quote: "Quote", quoteLong: "Request a quote", contactDirect: "Direct contact", search: "Search", closeSearch: "Close search", support: "Support",
    openMenu: "Open menu", closeMenu: "Close menu", logo: "Transarchivos, go to home", chatJoel: "Chat with Joel", whatsapp: "WhatsApp",
    blogAndFaq: "Contact and FAQs", address: "Cl. 21 # 39A-40, Bogotá", chooseLang: "Choose language", langs: "Available languages",
  },
  menus: {
    services: { kicker: "Document assessment", title: "Not sure where to start?", text: "We show you the technical and regulatory assessment of your information before moving a single folio. Immediate questions? Ask Joel, our virtual consultant available 24/7.", cta: "Schedule an initial assessment", foot: "9 services under Law 594 of 2000 and the AGN regulations", all: "See all" },
    solutions: { kicker: "Solutions", title: "Start from your need, not from the service", text: "We combine our services according to your company's challenge: legal compliance, space, paperless office or archive management at your premises.", cta: "See all solutions" },
    about: { kicker: "Since 1983", title: "Pioneers of records management in Colombia", text: "More than 40 years helping companies organise, protect and transform their information.", cta: "Discover our history" },
    blog: { kicker: "Blog and news", title: "Specialised knowledge that protects your company's memory", text: "Guides on records management, regulations, technology and sustainability.", cta: "See all articles", videos: "Press play on knowledge: all the channel's videos" },
  },
  support: {
    title: "Transarchivos support", text: "Need help with your archive or your request?",
    chat: "Chat with Joel", chatDesc: "AI advisor, replies instantly", whatsapp: "Message us on WhatsApp", call: "Call us", write: "Write to us", writeDesc: "Contact form", faq: "See frequently asked questions",
  },
  search: {
    placeholder: "Search services, solutions, articles…", aria: "Search", dialog: "Search the site", close: "Close search", quick: "Quick links",
    shortcuts: ["Services", "Solutions", "Request a quote", "FAQs"],
    none: (q: string) => `No results for "${q}".`, hint: "Try another word, or ask Joel in the chat.",
    kinds: { Servicio: "Service", Artículo: "Article", Sección: "Section", Pregunta: "Question" },
    index: {
      diagnostic: ["Document assessment", "Start by finding out what is going on with your archive, before moving a single sheet of paper"],
      solutions: ["Solutions", "Regulatory compliance, disaster recovery, paperless office, space and audits"],
      model: ["How we work", "Our 4-step model: assessment, solution, protection and expansion"],
      faq: ["Frequently asked questions", "Quotes, costs, coverage, regulations, storage and more"],
      blog: ["Blog", "Articles and guides on records management, technology and sustainability"],
      videos: ["Press play on knowledge", "All the videos on Transarchivos' YouTube channel: guides, regulations and services"],
      quote: ["Request a quote", "Choose your service and answer a few questions to build your request"],
    },
  },
  cookies: {
    aria: "Cookie notice", title: "We use analytics cookies",
    text: "They help us understand how the site is used so we can improve it. We don't use them for advertising. You can accept or reject them; the site works the same either way. More information in our ",
    policy: "privacy policy", accept: "Accept", reject: "Reject",
  },
  contact: {
    title: "Write to us", text: "Leave us your details and a Transarchivos advisor will reply.", close: "Close form",
    name: "Name *", company: "Company", email: "Email *", phone: "Phone", reason: "Reason *", message: "Message *", placeholder: "Tell us what you need…",
    consent: "I authorise Transarchivos Ltda. to process my personal data to answer this request, according to its ", consentLink: "privacy and data processing policy",
    error: "We couldn't send your message right now. Try again or write to us on ", code: "Code", send: "Send message", sending: "Sending…",
    sentTitle: "Message sent!", sentText: (email: string) => `We received your request. An advisor will reply to ${email}.`, closeBtn: "Close",
    subject: (reason: string) => `Contacto web (EN) — ${reason}`,
  },
  cta: { quote: "Request a quote", whatsapp: "Message us on WhatsApp", text: "Build your request in minutes or talk to an advisor. No commitment." },
  solutions: {
    kicker: "Solutions", titleA: "Solutions built around ", titleMark: "your company's needs",
    text: "We combine infrastructure, OCR technology and archival instruments to solve complex problems of space, compliance, digitisation and security.",
    integrated: "Integrated services",
  },
  faq: {
    kicker: "Frequently asked questions", title: "We answer your questions", text: "What we are asked most about our services. If you can't find your answer, talk to us.",
    help: "Need help?", chat: "Chat with Joel",
  },
  blog: {
    kicker: "Blog and news", title1: "Specialised knowledge that protects", title2: "your company's memory", featured: "Featured", read: "Read article", min: "min",
    subTitle: "Get news and guides in your inbox", subText: "Content on records management and news from Transarchivos.", placeholder: "you@email.com",
    subscribe: "Subscribe", sending: "Sending…", consent: "I authorise the processing of my email to receive news, according to the ", policy: "privacy policy",
    thanks: "Thank you! We sent a confirmation to your email.", error: "We couldn't register your email. Try again in a few minutes.",
    subject: "Nueva suscripción al blog (EN)", origin: "Sección Blog del sitio web (inglés)",
  },
  quote: {
    kicker: "Tailored quote", title: "Define your need and prepare your commercial request",
    text: "4 simple steps. See the technical composition of your requirement in real time before connecting with our sales team.",
    steps: ["Service", "Details", "Contact", "Summary"],
    diagnostic: { title: "Document assessment", desc: "We identify the current condition of the archive and its volume. We design the right technical route before starting any intervention." },
    s0Title: "Which service do you need?", s0Text: "Not sure about the technical scope? Start with a Document Assessment to evaluate the current state of your archive.", next: "Continue", back: "Back",
    solution: "Solution", multi: "This solution combines several services. You are quoting the main one; you can change it:", single: "You are quoting the service that makes up this solution.",
    s1Title: "Tell us about your archive", s1Text: "If you don't know a detail, choose \"I don't know\": an advisor will help you complete it.", select: "Select…",
    location: "Location (city and site)", locationPh: "E.g. Bogotá, head office", special: "Special requirements", optional: "(optional)", specialPh: "Restrictions, characteristics of the material, other information…",
    s2Title: "Who should we contact?", s2Text: "We will use these details only to answer your request.", company: "Company", sector: "Industry", name: "Your name", role: "Job title", email: "Email", phone: "Phone",
    consent: "I authorise Transarchivos Ltda. to process my personal data to answer this request, according to its ", consentLink: "privacy and data processing policy", summary: "See summary",
    s3Title: "Review and send your request", s3Text: "Send it by email or WhatsApp: it goes directly to our sales team.", nextStep: "Next step", also: "You might also need", modify: "Edit details",
    sendWa: "Send by WhatsApp", sendMail: "Send by email", sent: "Request sent", sending: "Sending…", thanks: (email: string) => `Thank you! We received your request. An advisor will reply to ${email}.`,
    error: "We couldn't send the request right now. Try again or write to us on ",
    aside: "Your request", change: "Change", complete: "Information complete", noCommit: "No commitment. An advisor reviews your request and replies with the scope and conditions.",
    nextSteps: {
      missing: { t: "Complete the information", d: "Critical details are missing. An advisor will ask for the remaining data or schedule a visit or inventory before quoting." },
      special: { t: "Operations validation", d: "Your request has a special condition. Sales and Operations will validate it before committing to scope and times." },
      ok: { t: "Quote according to parameters", d: "The information is sufficient. Sales will prepare the quote with the defined scope and conditions." },
    },
    labels: { location: "Location", special: "Special requirements", none: "None", company: "Company", sector: "Industry", contact: "Contact", email: "Email", phone: "Phone", service: "Service", solutionOf: "Solution of interest", nextStep: "Suggested next step" },
    waIntro: "Hello, Transarchivos. I would like a quote.", waData: "Request details", waContact: "Contact", subject: (title: string) => `Solicitud de cotización (EN) — ${title}`,
    unknown: ["i don", "not sure"],
  },
  clients: { kicker: "Our clients", title: "More than 4,000 companies vouch for our compliance", aria: "Companies that have trusted Transarchivos", row: (n: number) => `Client logos, row ${n}` },
  stats: { aria: "Our experience in figures" },
  map: {
    aria: "Operations centre in Bogotá", kicker: "Operations centre · Bogotá", title: "Transarchivos' Document Operations Centre (multi-site backups)",
    text1: "From Bogotá we lead document storage, scanning and destruction solutions. We have several document centres strategically distributed across the city to prevent the massive loss of information in the event of disasters or contingencies.",
    text2: "Our sites have laboratories and security systems to protect, process and manage sensitive information assets. We guarantee the execution of critical processes and the secure destruction of records in strict compliance with legal, environmental and Habeas Data requirements.",
    alt: "Map of Cundinamarca with Bogotá highlighted and the neighbouring municipalities", bogota: "Bogotá · Operations centre",
    endKicker: "Comprehensive records management", endTitle: "More than four decades leading the protection of Colombia's business information",
    endText: "Managing the full cycle of your records under the standards of Colombian regulations. We handle classification, scanning with OCR, high-security storage and traceable destruction, giving your company legal backing.",
    scroll: "Scroll", cta: "Request a quote",
  },
};

export const UI: Record<Lang, Ui> = { es, en };
export function useUi(): Ui { return UI[useLang().lang]; }
