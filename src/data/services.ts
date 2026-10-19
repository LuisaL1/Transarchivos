import { C } from "@/styles/tokens";


// Los 9 servicios reales publicados hoy en transarchivos.com (no la lista
// genérica de 5 anterior). Cada uno abre su propia página en /servicios/:slug.
// "keywords": 2 términos de búsqueda reales (del listado de palabras clave por
// servicio) para que alguien que no conoce el nombre formal del servicio pero
// sí un término técnico (OCR, TRD, backup...) lo reconozca igual.
// "icon": nombre del ícono de Bootstrap Icons (bi-<nombre>).
// "title" y "desc": nombre y texto del menú Servicios (documento de
// correcciones de las páginas de servicios, oct. 2026).
export const serviceItems: { icon: string; title: string; slug: string; desc: string; keywords: string[] }[] = [
  { icon: "list-columns-reverse", title: "Inventario documental", slug: "levantamiento-de-inventario", desc: "Diagnóstico y clasificación de su archivo bajo estándares del Archivo General de la Nación (AGN).", keywords: ["Inventario documental", "Diagnóstico"] },
  { icon: "folder2-open", title: "Programa de Gestión Documental (PGD)", slug: "programa-de-gestion-documental", desc: "Instrumento estratégico para el control del ciclo de vida documental bajo cumplimiento de la Ley 594.", keywords: ["TRD", "Tablas de retención"] },
  { icon: "hdd-stack", title: "Custodia de medios magnéticos", slug: "custodia-de-medios-magneticos", desc: "Almacenamiento de cintas LTO, discos duros y soportes ópticos bajo estricto control de temperatura y humedad.", keywords: ["Copia aislada (air gap)", "Cintas LTO"] },
  { icon: "archive", title: "Custodia de archivos", slug: "custodia-de-archivos", desc: "Resguardo de su archivo en instalaciones con vigilancia 24/7 y estricto control de acceso.", keywords: ["Centro documental", "Consulta y recuperación"] },
  { icon: "upc-scan", title: "Digitalización de documentos", slug: "digitalizacion-de-documentos", desc: "Escaneo masivo, reconocimiento OCR e indexación para el control total de su información.", keywords: ["OCR", "DMS / ECM"] },
  { icon: "file-earmark-x", title: "Destrucción de documentos", slug: "destruccion-de-documentos", desc: "Trituración confidencial irrecuperable con certificado de destrucción, registro en video y trazabilidad total.", keywords: ["Trituración industrial", "Certificado de destrucción"] },
  { icon: "film", title: "Digitalización de microfilms", slug: "microfilmacion-de-archivos", desc: "Transformación de microfilms históricos en archivos digitales indexados para rápida consulta.", keywords: ["Microfilm", "Historias clínicas"] },
  { icon: "person-badge", title: "Servicio in-house", slug: "servicio-inhouse", desc: "Personal especializado de archivo en su sede, capacitado y supervisado directamente por Transarchivos.", keywords: ["Tercerización documental", "Personal en sitio"] },
  { icon: "lightning-charge", title: "Servicio de consulta inmediata", slug: "servicio-inmediato", desc: "Consulte sus documentos almacenados bajo la custodia de Transarchivos.", keywords: ["Entrega urgente", "Despacho exprés"] },
];

// "slug" arma la URL propia de cada servicio (/servicios/<slug>) — coinciden
// con las rutas reales que ya usa transarchivos.com hoy (p.ej.
// transarchivos.com/levantamiento-de-inventario/), así que si el día de
// mañana el sitio pasa a este dominio, los enlaces externos siguen sirviendo.
// "card" y "quote": textos propios de la tarjeta de servicios y del cotizador
// del inicio (documento "Correcciones en página web de Transarchivos - Home",
// oct. 2026). "title", "tag" y "desc" siguen siendo los del menú, la página
// del servicio, el buscador y Joel. "quote: null": el servicio no se ofrece
// en el cotizador (Servicio inmediato, pedido del cliente).
type ServiceCardText = { title: string; tag: string; desc: string; cta: string };
type ServiceQuoteText = { title: string; desc: string } | null;
export const services: { icon: string; title: string; slug: string; tag: string; accent: string; desc: string; card: ServiceCardText; quote: ServiceQuoteText }[] = [
  {
    icon: "list-columns-reverse", title: "Levantamiento de inventario", slug: "levantamiento-de-inventario",
    tag: "Norma AGN · Ley 594", accent: C.indigo,
    desc: "Identificación, registro y clasificación de los documentos de un archivo para conocer su volumen, estado y ubicación.",
    card: { title: "Levantamiento e inventario documental", tag: "Ley 594 de 2000 · Lineamientos AGN", cta: "Más información",
      desc: "Ejecutamos la identificación, registro y clasificación metodológica de su fondo documental para establecer su volumen exacto, estado de conservación y ubicación física alineado con las exigencias de las Tablas de Retención Documental (TRD)." },
    quote: { title: "Inventario documental", desc: "Identificación, foliaje y registro sistemático de su archivo. Censo preciso del volumen (metros lineales/cajas), ubicación física y estado de conservación." },
  },
  {
    icon: "folder2-open", title: "Programa de gestión documental", slug: "programa-de-gestion-documental",
    tag: "PGD · Ley 594", accent: C.indigo,
    desc: "Sistema para manejar los documentos durante todo su ciclo de vida: creación, uso, conservación y disposición final.",
    card: { title: "Programa de Gestión Documental (PGD)", tag: "Ley 594 de 2000 · Lineamientos AGN", cta: "Más información",
      desc: "Formulamos el instrumento archivístico que regula la creación, uso, conservación y eliminación de los documentos de su compañía. Una solución estratégica alineada a la norma AGN para mantener el control total del archivo a lo largo de su ciclo de vida." },
    quote: { title: "Programa de Gestión Documental (PGD)", desc: "Estructuración del marco normativo y operativo que garantiza la trazabilidad, conservación y validez jurídica de los documentos de su compañía." },
  },
  {
    icon: "hdd-stack", title: "Custodia de medios magnéticos", slug: "custodia-de-medios-magneticos",
    tag: "Copia aislada (air gap) · DRP", accent: C.indigo,
    desc: "Almacenamiento especializado de cintas LTO/DAT/DLT, discos duros, CDs/DVDs y otros medios.",
    card: { title: "Custodia de medios magnéticos y copia aislada", tag: "Air Gap · DRP", cta: "Conocer especificaciones técnicas",
      desc: "Resguardo de alta seguridad para cintas magnéticas, discos duros y medios de almacenamiento masivo. Protegemos la copia de seguridad crítica de su compañía mediante instalaciones búnker aisladas de la red." },
    quote: { title: "Custodia de medios magnéticos", desc: "Bóveda de alta seguridad para la conservación de cintas LTO/DAT, discos y medios ópticos." },
  },
  {
    icon: "archive", title: "Custodia de archivos", slug: "custodia-de-archivos",
    tag: "CCTV · vigilancia 24 h", accent: C.indigo,
    desc: "Resguardo y gestión de documentos físicos y digitales con seguridad, integridad y disponibilidad.",
    card: { title: "Custodia y resguardo documental", tag: "CCTV · Monitoreo 24/7", cta: "Conocer condiciones de custodia",
      desc: "Almacenamiento y administración de archivos físicos en instalaciones de alta seguridad, equipadas con vigilancia CCTV ininterrumpida, control biométrico de acceso y sistemas de prevención de incendios." },
    quote: { title: "Custodia de archivos", desc: "Almacenamiento seguro de archivos físicos. Monitoreo continuo, custodia búnker y servicio de préstamo/recuperación garantizada." },
  },
  {
    icon: "upc-scan", title: "Digitalización de documentos", slug: "digitalizacion-de-documentos",
    tag: "Valor legal · OCR", accent: C.indigo,
    desc: "Conversión de documentos físicos a archivos digitales con captura, indexación y OCR opcional.",
    card: { title: "Digitalización de documentos y captura OCR", tag: "Valor legal · Indexación estructurada", cta: "Conocer el proceso de digitalización",
      desc: "Transformamos sus archivos físicos en documentos digitales de alta resolución con pleno respaldo jurídico, con reconocimiento óptico de texto (OCR) y metadatos de búsqueda." },
    quote: { title: "Digitalización de documentos", desc: "Conversión de archivos físicos a formatos digitales de alta fidelidad. Incluye indexación de metadatos y reconocimiento óptico de caracteres (OCR)." },
  },
  {
    icon: "file-earmark-x", title: "Destrucción de documentos", slug: "destruccion-de-documentos",
    tag: "Certificado de destrucción", accent: C.gold,
    desc: "Destrucción segura y trazable, con acta de eliminación y certificado, alineada con la Ley 594 de 2000.",
    card: { title: "Destrucción certificada de documentos", tag: "Conforme a la Ley Habeas Data", cta: "Conocer el protocolo de destrucción",
      desc: "Eliminación definitiva, segura y trazable de archivos físicos que han cumplido su tiempo de retención legal, entregando un acta oficial y Certificado de Destrucción con plena validez jurídica." },
    quote: { title: "Destrucción certificada de documentos", desc: "Trituración confidencial de archivos para evitar filtraciones de información sensible y sanciones de Habeas Data. Trazabilidad completa garantizada con soporte probatorio." },
  },
  {
    icon: "film", title: "Digitalización de microfilms", slug: "microfilmacion-de-archivos",
    tag: "Microfilme 16 / 35 mm", accent: C.indigo,
    desc: "Transformación de microfilms históricos en archivos digitales indexados para rápida consulta.",
    card: { title: "De microfilms a formatos digitales PDF", tag: "De 16 / 35 mm a PDF", cta: "Ver proceso de conversión a PDF",
      desc: "Transformamos sus soportes análogos de microfilmación (16 y 35 mm) en documentos digitales PDF totalmente legibles y organizados. Eliminamos la dependencia de visores tradicionales, permitiendo la consulta remota, el procesamiento masivo y el respaldo seguro de su fondo histórico en la nube o en sus servidores." },
    quote: { title: "Digitalización de microfilms", desc: "Conversión de rollos (16/35 mm) a formatos digitales de alta definición. Recuperación de archivos históricos con indexación y OCR para consulta instantánea." },
  },
  {
    icon: "person-badge", title: "Servicio in house", slug: "servicio-inhouse",
    tag: "En sus instalaciones", accent: C.indigo,
    desc: "Personal técnico de archivo en su sede, capacitado y supervisado por Transarchivos.",
    card: { title: "Gestión documental in-house", tag: "Personal técnico en sus instalaciones", cta: "Conocer el modelo de operación in-house",
      desc: "Personal archivístico profesional operando directamente en la sede de su compañía. Nos encargamos de la ejecución diaria y la supervisión técnica con la metodología y calidad garantizada por Transarchivos." },
    quote: { title: "Gestión documental in-house", desc: "Técnicos archivistas en sus instalaciones, respaldados y supervisados por Transarchivos para garantizar la correcta organización y custodia de su archivo." },
  },
  {
    icon: "lightning-charge", title: "Servicio inmediato", slug: "servicio-inmediato",
    tag: "Respuesta prioritaria", accent: C.gold,
    desc: "Consulta, recuperación y entrega urgente de documentos, con trazabilidad en cada etapa.",
    card: { title: "Servicio de entrega inmediata", tag: "Consulta y recuperación documental", cta: "Conocer tiempos de respuesta y protocolos",
      desc: "Ubicación, digitalización y/o despacho urgente de documentos críticos. Trazabilidad garantizada desde la solicitud hasta la recepción física o digital en su compañía." },
    quote: null,
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
