

export const SOLUTIONS: { id: string; icon: string; tag: string; title: string; problem: string; desc: string; points: string[]; slugs: string[] }[] = [
  {
    id: "cumplimiento", icon: "shield-check", tag: "Riesgo legal",
    title: "Cumplimiento normativo",
    problem: "Su empresa debe cumplir la Ley 594 y no tiene su archivo organizado.",
    desc: "Diseñamos e implementamos el Programa de Gestión Documental y las Tablas de Retención a la medida, para evitar sanciones e investigaciones del AGN.",
    points: ["PGD obligatorio por ley (Decreto 1080 de 2015)", "Tablas de Retención y Valoración Documental", "Inventario y organización según norma AGN"],
    slugs: ["programa-de-gestion-documental", "levantamiento-de-inventario"],
  },
  {
    id: "continuidad", icon: "hdd-stack", tag: "Continuidad del negocio",
    title: "Respaldo y recuperación ante desastres",
    problem: "Sus copias de seguridad están en la misma oficina o solo en la nube.",
    desc: "Custodiamos sus medios fuera de la red (copia air gap), pilar de su Plan de Recuperación ante Desastres frente a ransomware o siniestros.",
    points: ["Cintas LTO/DAT/DLT, discos y otros medios", "Control de temperatura y humedad 24 h", "Transporte con sellos numerados y trazabilidad"],
    slugs: ["custodia-de-medios-magneticos"],
  },
  {
    id: "digital", icon: "upc-scan", tag: "Transformación digital",
    title: "Oficina cero papel",
    problem: "Encontrar un documento toma horas y el papel no deja de crecer.",
    desc: "Digitalizamos con valor legal y definimos el ciclo de vida del documento electrónico, para que su información esté disponible en segundos.",
    points: ["Captura, indexación y OCR", "Validez legal (Ley 527 de 1999)", "Metadatos y esquemas de preservación"],
    slugs: ["digitalizacion-de-documentos", "programa-de-gestion-documental", "microfilmacion-de-archivos"],
  },
  {
    id: "espacio", icon: "box-seam", tag: "Costos y espacio",
    title: "Liberar espacio y reducir costos",
    problem: "El archivo ocupa metros valiosos de su sede y sigue creciendo.",
    desc: "Trasladamos su archivo a nuestro centro de custodia y eliminamos de forma segura lo que ya cumplió su tiempo de retención.",
    points: ["Pago por el volumen que custodia", "Consulta y recuperación cuando la necesite", "Destrucción certificada de lo que ya no se requiere"],
    slugs: ["custodia-de-archivos", "destruccion-de-documentos"],
  },
  {
    id: "auditorias", icon: "lightning-charge", tag: "Respuesta inmediata",
    title: "Auditorías y requerimientos urgentes",
    problem: "Un ente de control o un proceso legal le pide un documento ya.",
    desc: "Localizamos el expediente y se lo entregamos digitalizado o en físico con despacho prioritario, con trazabilidad en cada etapa.",
    points: ["Digitalización prioritaria bajo demanda", "Despacho físico express del original", "Cadena de custodia controlada"],
    slugs: ["servicio-inmediato"],
  },
  {
    id: "operacion", icon: "people", tag: "Operación documental",
    title: "Archivo gestionado en su sede",
    problem: "Necesita que su archivo funcione día a día sin cargar a su equipo.",
    desc: "Ubicamos personal técnico de archivo en sus instalaciones, capacitado y supervisado por Transarchivos.",
    points: ["Personal especializado en sitio", "Supervisión y estándares de Transarchivos", "Ideal para Recursos Humanos, Compras y Servicios Generales"],
    slugs: ["servicio-inhouse"],
  },
];

export const SOLUTIONS_ICON: Record<string, string> = Object.fromEntries(SOLUTIONS.map(x => [x.id, x.icon]));
