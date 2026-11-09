// Textos de la portada (src/pages/HomePage.tsx y src/components/home) en los
// dos idiomas. El español es la referencia (documentos de correcciones del
// cliente, oct. 2026); la traducción está pendiente de revisión por Transarchivos.
import { useLang, type Lang } from "@/i18n";

type Step = { t: string; d: string };
type ModelItem = { i: string; l: string; s?: string; to: string };
type ModelStep = { n: number; t: string; k: string; d: string; items: ModelItem[] };

const es = {
  hero: {
    titles: [["Protegemos la ", "memoria", " de su empresa."], ["Gestión documental ", "inteligente", "."], ["La memoria física de su empresa en nuestro ", "centro documental", "."]] as [string, string, string][],
    text: "Clasificamos, organizamos y custodiamos sus documentos, facilitamos su consulta y lo acompañamos en cada etapa de su gestión, conforme a la normativa aplicable.",
    joel: "Hablar con Joel",
    quickTitle: "¿Qué necesita hoy?", seeService: "Ver servicio", quoteThis: "Cotizar este servicio",
    quick: [
      { label: "Organizar", icon: "list-columns-reverse", title: "Inventario documental", text: "Organizamos y clasificamos su archivo bajo la normativa del Archivo General de la Nación (AGN).", slug: "levantamiento-de-inventario" },
      { label: "Digitalizar", icon: "upc-scan", title: "Digitalización", text: "Convertimos sus archivos físicos en documentos digitales interactivos mediante OCR (Reconocimiento Óptico de Caracteres).", slug: "digitalizacion-de-documentos" },
      { label: "Custodiar", icon: "archive", title: "Custodia de archivos", text: "Resguardamos sus documentos en instalaciones de alta seguridad, garantizando su conservación, trazabilidad y acceso a la información.", slug: "custodia-de-archivos" },
      { label: "Destruir", icon: "file-earmark-x", title: "Destrucción legal", text: "Eliminamos sus documentos bajo estrictos protocolos ambientales y normativos, entregando un certificado de destrucción con total validez legal.", slug: "destruccion-de-documentos" },
    ],
    trust: ["Ley 594 de 2000 (Ley General de Archivos)", "Ley 2106 de 2019 (Ley Antitrámites)", "Programa de Gestión Documental (PGD)", "Ley 527 de 1999 (Comercio Electrónico)"],
  },
  diagnostic: {
    badge: "Visita de cortesía gratuita", titleA: "", titleMark: "Visita de cortesía gratuita", titleB: " a su archivo antes de cualquier intervención",
    text: "Antes de ejecutar cualquier proceso, evaluamos técnicamente el estado actual de su archivo documental. Y según su solicitud realizamos la cotización.",
    steps: [
      { t: "Revisión inicial", d: "Revisamos y evaluamos el estado actual de su fondo documental en sus instalaciones." },
      { t: "Análisis de hallazgos y riesgos", d: "Determinamos el volumen exacto (metros lineales), nivel de deterioro, riesgos legales y oportunidades de optimización." },
      { t: "Plan de acción", d: "Según su necesidad, cotizamos un plan para organizar, digitalizar, custodiar o eliminar de forma segura sus archivos." },
    ] as Step[],
    cta: "Solicite su visita gratuita para su archivo",
    reportTitle: "Informe de nuestra visita", reportSub: "Lo que identificamos en su archivo", points: "6 puntos",
    report: [
      { i: "stack", t: "Volumen y diagnóstico físico", d: "Evaluación cuantitativa y cualitativa de las unidades documentales y su estado de conservación." },
      { i: "rulers", t: "Cálculo de espacio y ocupación", d: "Medición precisa en metros lineales del área física utilizada por su archivo actual." },
      { i: "list-check", t: "Nivel de clasificación y control TRD", d: "Auditoría de inventario existente y su grado de alineación con las Tablas de Retención Documental (TRD) vigentes." },
      { i: "upc-scan", t: "Factibilidad de digitalización y captura OCR", d: "Identificación de series documentales de alta consulta aptas para migrar a flujos de trabajo 100 % digitales." },
      { i: "shield-check", t: "Requerimientos de custodia especializada", d: "Determinación de información crítica que exige resguardo en nuestras instalaciones de alta seguridad." },
      { i: "hourglass-bottom", t: "Análisis de disposición final y tiempos de retención", d: "Identificación documental que ha cumplido su ciclo de vida legal y es candidata para destrucción certificada." },
    ],
  },
  services: { kicker: "Lo que hacemos", title: "Soluciones adecuadas para la gestión de sus archivos", cta: "Cotizar solución de gestión documental integral" },
  model: {
    kicker: "Cómo trabajamos", title1: "Así cuidamos y transformamos su información", title2: "",
    text: "Lo acompañamos en cada etapa, desde la organización y administración documental hasta la custodia, digitalización y disposición final de sus documentos.",
    stepLabel: "Paso",
    steps: [
      { n: 1, t: "Diagnóstico de estado actual", k: "Entrada",
        d: "Identificamos las condiciones actuales y el volumen del archivo en el cual se va a trabajar.",
        items: [{ i: "search", l: "Diagnóstico técnico y normativo de archivo", to: "/?servicio=diagnostico#cotizador" }, { i: "list-columns-reverse", l: "Levantamiento e inventario", to: "/servicios/levantamiento-de-inventario" }] },
      { n: 2, t: "Normalización y manejo archivístico", k: "Organización",
        d: "Establecemos los instrumentos de control y clasificamos su fondo documental bajo los lineamientos del Archivo General de la Nación (AGN) y los principios archivísticos establecidos por Transarchivos.",
        items: [{ i: "folder2-open", l: "Diseño e implementación de Programa de Gestión Documental (PGD)", to: "/servicios/programa-de-gestion-documental" }, { i: "table", l: "Estructuración de Tablas de Retención (TRD) y Valoración Documental (TVD)", to: "/servicios/programa-de-gestion-documental" }, { i: "list-check", l: "Organización, depuración y foliación física bajo norma AGN", to: "/servicios/levantamiento-de-inventario" }] },
      { n: 3, t: "Custodia especializada y continuidad operativa", k: "Almacenamiento",
        d: "Resguardamos su archivo documental y medios técnicos en infraestructura de seguridad con monitoreo continuo. Mantenemos su información organizada y disponible con tiempos de respuesta garantizados para asegurar la continuidad de sus operaciones.",
        items: [{ i: "archive", l: "Custodia de archivos en centros documentales", to: "/servicios/custodia-de-archivos" }, { i: "hdd-stack", l: "Custodia de medios técnicos", to: "/servicios/custodia-de-medios-magneticos" }] },
      { n: 4, t: "Disposición final y escalabilidad operativa", k: "Nuevos proyectos",
        d: "Cerramos el ciclo de vida de los documentos que cumplen su tiempo de retención legal.",
        items: [{ i: "file-earmark-x", l: "Destrucción segura y certificada de documentos", s: "Conforme a la Ley 594 de 2000 y la Ley Antitrámites", to: "/servicios/destruccion-de-documentos" }, { i: "lightning-charge", l: "Respuesta prioritaria y atención de requerimientos urgentes", s: "Servicio inmediato", to: "/servicios/servicio-inmediato" }, { i: "person-badge", l: "Gestión y administración documental in-house", s: "Personal técnico especializado en sus instalaciones", to: "/servicios/servicio-inhouse" }] },
    ] as ModelStep[],
  },
  connect: {
    kicker: "Conéctese con nosotros", title: "Contenido y redes sociales de Transarchivos",
    allVideos: "Da play al conocimiento: ver todos los videos", channel: "Ir al canal de YouTube", follow: "Síganos en nuestras redes",
  },
  why: [
    // Textos enviados por el cliente por WhatsApp (30 oct. 2026)
    { ic: "shield-check", t: "Cumplimiento normativo", d: "Operamos bajo la Ley 594 de 2000 y la Ley Antitrámites 962, artículo 28." },
    { ic: "camera-video-fill", t: "Custodia con vigilancia 24/7", d: "Centro documental con CCTV, control de acceso y monitoreo." },
    { ic: "tag-fill", t: "Precios competitivos", d: "Soluciones documentales a precios competitivos, con el respaldo y la calidad que su empresa necesita." },
    { ic: "lightning-charge-fill", t: "Rapidez y oportunidad", d: "Respondemos a sus necesidades con agilidad y oportunidad, brindando soluciones cuando su empresa las necesita." },
    { ic: "award-fill", t: "Trayectoria desde 1983", d: "Pioneros de la gestión documental en Colombia, con más de 40 años de experiencia." },
  ],
  footer: {
    text: "Empresa colombiana de gestión documental. Clasificación, digitalización, custodia, conservación y destrucción legal de archivos bajo normativa AGN.",
    services: "Servicios", company: "Empresa", contact: "Contacto",
    links: [
      { label: "Quiénes somos", to: "/nosotros#quienes-somos" }, { label: "Nuestra historia", to: "/nosotros#historia" }, { label: "Normativa y certificados", to: "/nosotros#certificados" },
      { label: "Nuestros clientes", to: "/nosotros#clientes" }, { label: "Da play al conocimiento (videos)", to: "/videos" }, { label: "Preguntas frecuentes", to: "/#faq" },
    ],
    address: "Cl. 21 # 39A-40, Bogotá, Colombia", policies: "Políticas", privacy: "Privacidad y cookies",
  },
};

export type HomeUi = typeof es;

const en: HomeUi = {
  hero: {
    titles: [["We protect your company's ", "memory", "."], ["Intelligent ", "records management", "."], ["Your company's physical memory in our ", "document centre", "."]],
    text: "We classify, organise and store your documents, make them easy to consult and support you at every stage of their management, in line with the applicable regulations.",
    joel: "Talk to Joel",
    quickTitle: "What do you need today?", seeService: "See service", quoteThis: "Get a quote for this service",
    quick: [
      { label: "Organise", icon: "list-columns-reverse", title: "Document inventory", text: "We organise and classify your archive under the regulations of the General Archive of the Nation (AGN).", slug: "levantamiento-de-inventario" },
      { label: "Scan", icon: "upc-scan", title: "Scanning", text: "We turn your physical files into interactive digital documents using OCR (Optical Character Recognition).", slug: "digitalizacion-de-documentos" },
      { label: "Store", icon: "archive", title: "Records storage", text: "We safeguard your documents in high-security facilities, guaranteeing their preservation, traceability and access to the information.", slug: "custodia-de-archivos" },
      { label: "Destroy", icon: "file-earmark-x", title: "Legal destruction", text: "We dispose of your documents under strict environmental and regulatory protocols, delivering a certificate of destruction with full legal validity.", slug: "destruccion-de-documentos" },
    ],
    trust: ["Law 594 of 2000 (General Archives Law)", "Law 2106 of 2019 (Anti-red-tape Law)", "Records Management Program (PGD)", "Law 527 of 1999 (Electronic Commerce)"],
  },
  diagnostic: {
    badge: "Courtesy visit", titleA: "", titleMark: "Courtesy visit", titleB: " to your archive before any intervention",
    text: "Before carrying out any process, we technically evaluate the current state of your document archive. According to your request, we prepare the quote.",
    steps: [
      { t: "Initial review", d: "We review and evaluate the current state of your document holdings at your premises." },
      { t: "Analysis of findings and risks", d: "We determine the exact volume (linear metres), level of deterioration, legal risks and optimisation opportunities." },
      { t: "Action plan", d: "According to your needs, we quote a plan to organise, scan, store or securely dispose of your documents." },
    ],
    cta: "Request your free visit for your archive",
    reportTitle: "Our visit report", reportSub: "What we identify in your archive", points: "6 points",
    report: [
      { i: "stack", t: "Volume and physical assessment", d: "Quantitative and qualitative evaluation of the document units and their state of conservation." },
      { i: "rulers", t: "Space and occupancy calculation", d: "Precise measurement in linear metres of the physical area used by your current archive." },
      { i: "list-check", t: "Classification level and TRD control", d: "Audit of the existing inventory and its degree of alignment with the current Records Retention Schedules (TRD)." },
      { i: "upc-scan", t: "Feasibility of scanning and OCR capture", d: "Identification of frequently consulted record series suitable for migrating to 100% digital workflows." },
      { i: "shield-check", t: "Specialised storage requirements", d: "Identification of critical information that requires safekeeping in our high-security facilities." },
      { i: "hourglass-bottom", t: "Final disposition and retention analysis", d: "Identification of documents that have completed their legal life cycle and are candidates for certified destruction." },
    ],
  },
  services: { kicker: "What we do", title: "Right solutions for managing your records", cta: "Get a quote for a comprehensive records management solution" },
  model: {
    kicker: "How we work", title1: "How we care for and transform your information", title2: "",
    text: "We accompany you at every stage, from document organisation and management to custody, digitisation and final disposal of your documents.",
    stepLabel: "Step",
    steps: [
      { n: 1, t: "Assessment of the current state", k: "Entry",
        d: "We identify the current condition and the volume of the archive to be worked on.",
        items: [{ i: "search", l: "Technical and regulatory assessment of the archive", to: "/?servicio=diagnostico#cotizador" }, { i: "list-columns-reverse", l: "Survey and inventory", to: "/servicios/levantamiento-de-inventario" }] },
      { n: 2, t: "Standardisation and archival handling", k: "Organisation",
        d: "We establish the control instruments and classify your document holdings under the guidelines of the General Archive of the Nation (AGN) and the archival principles set by Transarchivos.",
        items: [{ i: "folder2-open", l: "Design and implementation of a Records Management Program (PGD)", to: "/servicios/programa-de-gestion-documental" }, { i: "table", l: "Structuring of Retention (TRD) and Appraisal (TVD) Schedules", to: "/servicios/programa-de-gestion-documental" }, { i: "list-check", l: "Organisation, weeding and physical foliation under AGN standards", to: "/servicios/levantamiento-de-inventario" }] },
      { n: 3, t: "Specialised storage and operational continuity", k: "Storage",
        d: "We safeguard your document archive and technical media in secure infrastructure with continuous monitoring. We keep your information organised and available with guaranteed response times to ensure the continuity of your operations.",
        items: [{ i: "archive", l: "Records storage in document centres", to: "/servicios/custodia-de-archivos" }, { i: "hdd-stack", l: "Technical media vaulting", to: "/servicios/custodia-de-medios-magneticos" }] },
      { n: 4, t: "Final disposition and operational scalability", k: "New projects",
        d: "We close the life cycle of documents that have completed their legal retention period.",
        items: [{ i: "file-earmark-x", l: "Secure, certified document destruction", s: "In line with Law 594 of 2000 and the Anti-red-tape Law", to: "/servicios/destruccion-de-documentos" }, { i: "lightning-charge", l: "Priority response to urgent requirements", s: "Rapid retrieval service", to: "/servicios/servicio-inmediato" }, { i: "person-badge", l: "On-site records management and administration", s: "Specialised technical staff at your premises", to: "/servicios/servicio-inhouse" }] },
    ],
  },
  connect: {
    kicker: "Connect with us", title: "Transarchivos content and social media",
    allVideos: "Press play on knowledge: see all videos", channel: "Go to the YouTube channel", follow: "Follow us on social media",
  },
  why: [
    { ic: "shield-check", t: "Regulatory compliance", d: "We operate under Law 594 of 2000 and the Anti-red-tape Law 962, article 28." },
    { ic: "camera-video-fill", t: "Storage with 24/7 surveillance", d: "Document centre with CCTV, access control and monitoring." },
    { ic: "tag-fill", t: "Competitive prices", d: "Document solutions at competitive prices, with the backing and quality your company needs." },
    { ic: "lightning-charge-fill", t: "Speed and timeliness", d: "We respond to your needs with agility and timeliness, delivering solutions when your company needs them." },
    { ic: "award-fill", t: "Track record since 1983", d: "Pioneers of records management in Colombia, with more than 40 years of experience." },
  ],
  footer: {
    text: "Colombian records management company. Classification, scanning, storage, preservation and legal destruction of records under AGN regulations.",
    services: "Services", company: "Company", contact: "Contact",
    links: [
      { label: "Who we are", to: "/nosotros#quienes-somos" }, { label: "Our history", to: "/nosotros#historia" }, { label: "Regulations and certificates", to: "/nosotros#certificados" },
      { label: "Our clients", to: "/nosotros#clientes" }, { label: "Press play on knowledge (videos)", to: "/videos" }, { label: "Frequently asked questions", to: "/#faq" },
    ],
    address: "Cl. 21 # 39A-40, Bogotá, Colombia", policies: "Policies", privacy: "Privacy and cookies",
  },
};

const HOME_UI: Record<Lang, HomeUi> = { es, en };
export function useHomeUi(): HomeUi { return HOME_UI[useLang().lang]; }
