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
    text: "Clasificamos, digitalizamos, custodiamos y destruimos sus documentos bajo la norma del Archivo General de la Nación (AGN) y la Ley 594. Cero riesgos, total acceso.",
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
    badge: "Inspección técnica", titleA: "La ", titleMark: "visita de diagnóstico", titleB: " a su archivo antes de cualquier intervención",
    text: "Antes de ejecutar cualquier proceso, evaluamos técnicamente el estado actual de su archivo documental. Le entregamos un panorama objetivo y fundamentado para tomar decisiones financieras y normativas basadas en evidencias reales, no en estimaciones.",
    steps: [
      { t: "Auditoría inicial", d: "Revisamos y evaluamos el estado actual de su fondo documental en sus instalaciones." },
      { t: "Análisis de hallazgos y riesgos", d: "Determinamos el volumen exacto (metros lineales), nivel de deterioro, riesgos legales y oportunidades de optimización." },
      { t: "Plan de acción", d: "Estructuración de un plan priorizado para organizar, digitalizar, custodiar o eliminar de forma segura." },
      { t: "Propuesta técnica", d: "Presentación de una solución integral con entregables medibles, plazos de cumplimiento y presupuesto optimizado." },
    ] as Step[],
    cta: "Solicite una visita de diagnóstico para su archivo",
    reportTitle: "Informe de diagnóstico", reportSub: "Lo que identificamos en su archivo", points: "7 puntos",
    report: [
      { i: "stack", t: "Volumen y diagnóstico físico", d: "Evaluación cuantitativa y cualitativa de las unidades documentales y su estado de conservación." },
      { i: "rulers", t: "Cálculo de espacio y ocupación", d: "Medición precisa en metros lineales del área física utilizada por su archivo actual." },
      { i: "list-check", t: "Nivel de clasificación y control TRD", d: "Auditoría de inventario existente y su grado de alineación con las Tablas de Retención Documental (TRD) vigentes." },
      { i: "upc-scan", t: "Factibilidad de digitalización y captura OCR", d: "Identificación de series documentales de alta consulta aptas para migrar a flujos de trabajo 100 % digitales." },
      { i: "shield-check", t: "Requerimientos de custodia especializada", d: "Determinación de información crítica que exige resguardo en nuestras instalaciones de alta seguridad." },
      { i: "hourglass-bottom", t: "Análisis de disposición final y tiempos de retención", d: "Identificación documental que ha cumplido su ciclo de vida legal y es candidata para destrucción certificada." },
      { i: "exclamation-triangle", t: "Evaluación de riesgos y matriz de cumplimiento", d: "Detección de brechas normativas, vulnerabilidades de acceso y oportunidades inmediatas de optimización." },
    ],
  },
  services: { kicker: "Lo que hacemos", title: "Soluciones a la medida para la gestión de sus archivos", cta: "Cotizar solución de gestión documental integral" },
  model: {
    kicker: "Cómo trabajamos", title1: "Nuestra metodología de trabajo", title2: "El camino hacia un archivo eficiente y seguro",
    text: "Le guiamos en cada fase del proceso: desde la valoración técnica inicial y la organización bajo norma AGN, hasta la transformación digital con OCR, la custodia búnker de alta seguridad y la destrucción final certificada.",
    stepLabel: "Paso",
    steps: [
      { n: 1, t: "Diagnóstico de estado actual", k: "Entrada",
        d: "Identificamos brechas de cumplimiento normativo, riesgos operativos y oportunidades de optimización. Establecemos una línea base precisa mediante el levantamiento de inventarios y el análisis del volumen real para estructurar un plan de acción a la medida.",
        items: [{ i: "search", l: "Diagnóstico técnico y normativo de archivo", to: "/?servicio=diagnostico#cotizador" }, { i: "list-columns-reverse", l: "Levantamiento e inventario", to: "/servicios/levantamiento-de-inventario" }] },
      { n: 2, t: "Normalización y gobierno archivístico", k: "Organización",
        d: "Diseñamos los instrumentos de control y clasificamos su fondo documental bajo los lineamientos del Archivo General de la Nación (AGN). Establecemos las reglas de retención, acceso y disposición legal para transformar archivos desorganizados en un sistema normativo, eficiente y auditable.",
        items: [{ i: "folder2-open", l: "Diseño e implementación de Programa de Gestión Documental (PGD)", to: "/servicios/programa-de-gestion-documental" }, { i: "table", l: "Estructuración de Tablas de Retención (TRD) y Valoración Documental (TVD)", to: "/servicios/programa-de-gestion-documental" }, { i: "list-check", l: "Organización, depuración y foliación física bajo norma AGN", to: "/servicios/levantamiento-de-inventario" }] },
      { n: 3, t: "Custodia especializada y continuidad operativa", k: "Almacenamiento",
        d: "Resguardamos su patrimonio documental y medios magnéticos en infraestructura de alta seguridad con monitoreo continuo. Mantenemos su información blindada, organizada y disponible con tiempos de respuesta garantizados (SLA) para asegurar la continuidad de sus operaciones.",
        items: [{ i: "archive", l: "Custodia de archivos físicos en búnker de alta seguridad", s: "CCTV 24/7 y control biométrico", to: "/servicios/custodia-de-archivos" }, { i: "hdd-stack", l: "Custodia de medios magnéticos y respaldos DRP", s: "Air Gap fuera de línea", to: "/servicios/custodia-de-medios-magneticos" }] },
      { n: 4, t: "Disposición final y escalabilidad operativa", k: "Nuevos proyectos",
        d: "Cerramos el ciclo de vida de los documentos que cumplen su tiempo de retención legal y escalamos la capacidad operativa de su compañía. Expandimos el valor del servicio integrando atención prioritaria para contingencias y despliegue de personal técnico directamente en sus sedes.",
        items: [{ i: "file-earmark-x", l: "Destrucción segura y certificada de documentos", s: "Conforme a Ley 594 de 2000 y Habeas Data", to: "/servicios/destruccion-de-documentos" }, { i: "lightning-charge", l: "Respuesta prioritaria y atención de requerimientos urgentes", s: "Servicio inmediato", to: "/servicios/servicio-inmediato" }, { i: "person-badge", l: "Gestión y administración documental in-house", s: "Personal técnico especializado en sus instalaciones", to: "/servicios/servicio-inhouse" }] },
    ] as ModelStep[],
  },
  connect: {
    kicker: "Conéctese con nosotros", title: "Contenido y redes sociales de Transarchivos",
    allVideos: "Da play al conocimiento: ver todos los videos", channel: "Ir al canal de YouTube", follow: "Síganos en nuestras redes",
  },
  why: [
    { ic: "shield-check", t: "Cumplimiento normativo", d: "Operamos bajo la Ley 594 de 2000 y la normativa del AGN." },
    { ic: "camera-video-fill", t: "Custodia con vigilancia 24/7", d: "Centro documental con CCTV, control de acceso y monitoreo ambiental permanente." },
    { ic: "graph-up-arrow", t: "Costo variable y escalable", d: "Pague solo por el volumen exacto que custodia, sin costos fijos de espacio o personal." },
    { ic: "lightning-charge-fill", t: "Ágil, en su sede e inmediato", d: "Del diagnóstico al despacho exprés, adaptados al ritmo de su operación." },
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
    text: "We classify, scan, store and destroy your documents under the standards of the General Archive of the Nation (AGN) and Law 594. Zero risk, full access.",
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
    badge: "Technical inspection", titleA: "The ", titleMark: "assessment visit", titleB: " to your archive before any intervention",
    text: "Before carrying out any process, we technically evaluate the current state of your document archive. We give you an objective, well-founded picture so you can make financial and regulatory decisions based on real evidence, not estimates.",
    steps: [
      { t: "Initial audit", d: "We review and evaluate the current state of your document holdings at your premises." },
      { t: "Analysis of findings and risks", d: "We determine the exact volume (linear metres), level of deterioration, legal risks and optimisation opportunities." },
      { t: "Action plan", d: "A prioritised plan to organise, scan, store or securely dispose of documents." },
      { t: "Technical proposal", d: "A comprehensive solution with measurable deliverables, compliance deadlines and an optimised budget." },
    ],
    cta: "Request an assessment visit for your archive",
    reportTitle: "Assessment report", reportSub: "What we identify in your archive", points: "7 points",
    report: [
      { i: "stack", t: "Volume and physical assessment", d: "Quantitative and qualitative evaluation of the document units and their state of conservation." },
      { i: "rulers", t: "Space and occupancy calculation", d: "Precise measurement in linear metres of the physical area used by your current archive." },
      { i: "list-check", t: "Classification level and TRD control", d: "Audit of the existing inventory and its degree of alignment with the current Records Retention Schedules (TRD)." },
      { i: "upc-scan", t: "Feasibility of scanning and OCR capture", d: "Identification of frequently consulted record series suitable for migrating to 100% digital workflows." },
      { i: "shield-check", t: "Specialised storage requirements", d: "Identification of critical information that requires safekeeping in our high-security facilities." },
      { i: "hourglass-bottom", t: "Final disposition and retention analysis", d: "Identification of documents that have completed their legal life cycle and are candidates for certified destruction." },
      { i: "exclamation-triangle", t: "Risk assessment and compliance matrix", d: "Detection of regulatory gaps, access vulnerabilities and immediate optimisation opportunities." },
    ],
  },
  services: { kicker: "What we do", title: "Tailored solutions for managing your records", cta: "Get a quote for a comprehensive records management solution" },
  model: {
    kicker: "How we work", title1: "Our working methodology", title2: "The path to an efficient, secure archive",
    text: "We guide you through every phase of the process: from the initial technical appraisal and organisation under AGN standards, to digital transformation with OCR, high-security bunker storage and certified final destruction.",
    stepLabel: "Step",
    steps: [
      { n: 1, t: "Assessment of the current state", k: "Entry",
        d: "We identify regulatory compliance gaps, operational risks and optimisation opportunities. We establish a precise baseline through inventories and the analysis of the real volume to structure a tailored action plan.",
        items: [{ i: "search", l: "Technical and regulatory assessment of the archive", to: "/?servicio=diagnostico#cotizador" }, { i: "list-columns-reverse", l: "Survey and inventory", to: "/servicios/levantamiento-de-inventario" }] },
      { n: 2, t: "Standardisation and archival governance", k: "Organisation",
        d: "We design the control instruments and classify your document holdings under the guidelines of the General Archive of the Nation (AGN). We set the rules for retention, access and legal disposition to turn disorganised archives into a regulated, efficient and auditable system.",
        items: [{ i: "folder2-open", l: "Design and implementation of a Records Management Program (PGD)", to: "/servicios/programa-de-gestion-documental" }, { i: "table", l: "Structuring of Retention (TRD) and Appraisal (TVD) Schedules", to: "/servicios/programa-de-gestion-documental" }, { i: "list-check", l: "Organisation, weeding and physical foliation under AGN standards", to: "/servicios/levantamiento-de-inventario" }] },
      { n: 3, t: "Specialised storage and operational continuity", k: "Storage",
        d: "We safeguard your documentary heritage and magnetic media in high-security infrastructure with continuous monitoring. We keep your information protected, organised and available with guaranteed response times (SLA) to ensure the continuity of your operations.",
        items: [{ i: "archive", l: "Storage of physical records in a high-security bunker", s: "24/7 CCTV and biometric control", to: "/servicios/custodia-de-archivos" }, { i: "hdd-stack", l: "Media vaulting and DRP backups", s: "Offline air gap", to: "/servicios/custodia-de-medios-magneticos" }] },
      { n: 4, t: "Final disposition and operational scalability", k: "New projects",
        d: "We close the life cycle of documents that have completed their legal retention period and scale your company's operational capacity. We expand the value of the service with priority attention for contingencies and the deployment of technical staff directly at your sites.",
        items: [{ i: "file-earmark-x", l: "Secure, certified document destruction", s: "In line with Law 594 of 2000 and Habeas Data", to: "/servicios/destruccion-de-documentos" }, { i: "lightning-charge", l: "Priority response to urgent requirements", s: "Rapid retrieval service", to: "/servicios/servicio-inmediato" }, { i: "person-badge", l: "On-site records management and administration", s: "Specialised technical staff at your premises", to: "/servicios/servicio-inhouse" }] },
    ],
  },
  connect: {
    kicker: "Connect with us", title: "Transarchivos content and social media",
    allVideos: "Press play on knowledge: see all videos", channel: "Go to the YouTube channel", follow: "Follow us on social media",
  },
  why: [
    { ic: "shield-check", t: "Regulatory compliance", d: "We operate under Law 594 of 2000 and the AGN regulations." },
    { ic: "camera-video-fill", t: "Storage with 24/7 surveillance", d: "Document centre with CCTV, access control and permanent environmental monitoring." },
    { ic: "graph-up-arrow", t: "Variable, scalable cost", d: "Pay only for the exact volume you store, with no fixed costs for space or staff." },
    { ic: "lightning-charge-fill", t: "Agile, on site and immediate", d: "From the assessment to express dispatch, adapted to the pace of your operation." },
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
