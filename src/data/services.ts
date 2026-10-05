

// Los 9 servicios reales publicados hoy en transarchivos.com (no la lista
// genérica de 5 anterior). Cada uno abre su propia página en /servicios/:slug.
// "keywords": 2 términos de búsqueda reales (del listado de palabras clave por
// servicio) para que alguien que no conoce el nombre formal del servicio pero
// sí un término técnico (OCR, TRD, backup...) lo reconozca igual.
// "icon": nombre del ícono de Bootstrap Icons (bi-<nombre>).
export const serviceItems: { icon: string; title: string; slug: string; desc: string; keywords: string[] }[] = [
  { icon: "list-columns-reverse", title: "Levantamiento de Inventario", slug: "levantamiento-de-inventario", desc: "Diagnóstico y organización según norma AGN", keywords: ["Inventario documental", "Diagnóstico"] },
  { icon: "folder2-open", title: "Programa de Gestión Documental", slug: "programa-de-gestion-documental", desc: "PGD · Cumplimiento Ley 594", keywords: ["TRD", "Tablas de retención"] },
  { icon: "hdd-stack", title: "Custodia de Medios Magnéticos", slug: "custodia-de-medios-magneticos", desc: "Cintas, discos y medios con control ambiental", keywords: ["Copia air gap", "Cintas LTO"] },
  { icon: "archive", title: "Custodia de Archivos", slug: "custodia-de-archivos", desc: "Centro documental con vigilancia 24 h", keywords: ["Centro documental", "Consulta y recuperación"] },
  { icon: "upc-scan", title: "Digitalización de Documentos", slug: "digitalizacion-de-documentos", desc: "Escaneo, OCR e indexación", keywords: ["OCR", "DMS / ECM"] },
  { icon: "file-earmark-x", title: "Destrucción de Documentos", slug: "destruccion-de-documentos", desc: "Destrucción con certificado y trazabilidad", keywords: ["Trituración industrial", "Certificado de destrucción"] },
  { icon: "film", title: "Microfilmación de Archivos", slug: "microfilmacion-de-archivos", desc: "Preservación a más de 100 años", keywords: ["Microfilm", "Historias clínicas"] },
  { icon: "person-badge", title: "Servicio Inhouse", slug: "servicio-inhouse", desc: "Personal de archivo en su sede", keywords: ["Outsourcing documental", "Personal en sitio"] },
  { icon: "lightning-charge", title: "Servicio Inmediato", slug: "servicio-inmediato", desc: "Entrega urgente con trazabilidad", keywords: ["Entrega urgente", "Despacho express"] },
];

// "slug" arma la URL propia de cada servicio (/servicios/<slug>) — coinciden
// con las rutas reales que ya usa transarchivos.com hoy (p.ej.
// transarchivos.com/levantamiento-de-inventario/), así que si el día de
// mañana el sitio pasa a este dominio, los enlaces externos siguen sirviendo.
export const services = [
  {
    icon: "list-columns-reverse", title: "Levantamiento de Inventario", slug: "levantamiento-de-inventario",
    tag: "Norma AGN · Ley 594", accent: "#272B7C",
    desc: "Identificación, registro y clasificación de los documentos de un archivo para conocer su volumen, estado y ubicación.",
  },
  {
    icon: "folder2-open", title: "Programa de Gestión Documental", slug: "programa-de-gestion-documental",
    tag: "PGD · Ley 594", accent: "#1800AD",
    desc: "Sistema para manejar los documentos durante todo su ciclo de vida: creación, uso, conservación y disposición final.",
  },
  {
    icon: "hdd-stack", title: "Custodia de Medios Magnéticos", slug: "custodia-de-medios-magneticos",
    tag: "Copia air gap · DRP", accent: "#272B7C",
    desc: "Almacenamiento especializado de cintas LTO/DAT/DLT, discos duros, CDs/DVDs y otros medios.",
  },
  {
    icon: "archive", title: "Custodia de Archivos", slug: "custodia-de-archivos",
    tag: "CCTV · vigilancia 24 h", accent: "#1800AD",
    desc: "Resguardo y gestión de documentos físicos y digitales con seguridad, integridad y disponibilidad.",
  },
  {
    icon: "upc-scan", title: "Digitalización de Documentos", slug: "digitalizacion-de-documentos",
    tag: "Valor legal · OCR", accent: "#272B7C",
    desc: "Conversión de documentos físicos a archivos digitales con captura, indexación y OCR opcional.",
  },
  {
    icon: "file-earmark-x", title: "Destrucción de Documentos", slug: "destruccion-de-documentos",
    tag: "Certificado de destrucción", accent: "#C8960A",
    desc: "Destrucción segura y trazable, con acta de eliminación y certificado, alineada con la Ley 594 de 2000.",
  },
  {
    icon: "film", title: "Microfilmación de Archivos", slug: "microfilmacion-de-archivos",
    tag: "Microfilme 16 / 35 mm", accent: "#272B7C",
    desc: "Conversión de documentos a microfilme para su preservación segura a largo plazo.",
  },
  {
    icon: "person-badge", title: "Servicio Inhouse", slug: "servicio-inhouse",
    tag: "En sus instalaciones", accent: "#1800AD",
    desc: "Personal técnico de archivo en su sede, capacitado y supervisado por Transarchivos.",
  },
  {
    icon: "lightning-charge", title: "Servicio Inmediato", slug: "servicio-inmediato",
    tag: "Respuesta prioritaria", accent: "#C8960A",
    desc: "Consulta, recuperación y entrega urgente de documentos, con trazabilidad en cada etapa.",
  },
];

export const norms = [
  { code: "Ley 594 / 2000", name: "Ley General de Archivos (AGN)" },
  { code: "Decreto 1080 / 2015", name: "PGD y ciclo de vida del documento electrónico" },
  { code: "Res. 8934 / 2014", name: "Superintendencia de Industria y Comercio" },
  { code: "Decreto 962 · art. 28", name: "Ley Antitrámites" },
  { code: "Ley 1581 / 2012", name: "Protección de datos personales" },
  { code: "Ley 527 / 1999", name: "Comercio electrónico: validez legal de la digitalización" },
  { code: "Decreto 2527 / 1950", name: "Validez jurídica de la microfilmación" },
  { code: "Norma Icontec 2001", name: "Estantería de carga pesada del Centro Documental" },
];
