// Contenido de la página de cada servicio (/servicios/:slug). Base: "Informe
// Documento maestro"; textos actualizados con el documento del cliente
// "Correcciones página web Transarchivos - Landing pages de servicios"
// (oct. 2026). Las fotos del encabezado están en assets/images/servicios
// (<slug>-1.webp y <slug>-2.webp).
//
// - title: título de la página cuando no es el nombre del servicio.
// - stats: ya no se muestran en la página (el cliente pidió fotos en su lugar);
//   Joel los sigue usando en sus respuestas.
// - about: párrafo junto a los beneficios (si falta, la descripción corta).
// - benefits: "Título: descripción" se muestra con el título en negrita.
// - reasons: "d" vacío = solo el título (lista corta).
export type SvcDetail = {
  title?: string;
  tagline: string;
  intro: string;
  about?: string;
  stats: { v: string; l: string }[];
  benefitsTitle?: string;
  benefits: string[];
  includes?: string[];
  stepsKicker?: string;
  stepsTitle?: string;
  stepsIntro?: string;
  // Pasos con "d" vacío: solo título, con un gráfico (ícono "ic") en su lugar.
  steps?: { ic?: string; t: string; d: string }[];
  reasonsKicker?: string;
  reasonsTitle?: string;
  reasons: { ic: string; t: string; d: string }[];
  extra?: { title: string; text: string; note: string };
  modes?: { ic: string; t: string; d: string }[];
  audience?: { title: string; items: { ic: string; t: string; d: string }[] };
  norms: string[];
  ctaTitle?: string;
};

export const SERVICE_DETAILS: Record<string, SvcDetail> = {
  "levantamiento-de-inventario": {
    tagline: "El instrumento para un buen control de la información.",
    intro: "Identificamos, registramos y clasificamos los documentos o expedientes que conforman su archivo, con el objetivo de conocer su volumen, estado de conservación, ubicación y valor documental.",
    about: "",
    stats: [{ v: "20%", l: "del tiempo que se pierde buscando información puede recuperarse" }, { v: "Ley 594", l: "y normas del AGN como marco" }, { v: "Paso 1", l: "obligatorio antes de digitalizar" }],
    benefits: [
      "Identificación precisa del volumen, características físicas y valor de su fondo documental.",
      "Clasificación alineada a los estándares del Archivo General de la Nación (AGN).",
      "Búsqueda y recuperación inmediata de expedientes mediante bases de datos estructuradas.",
      "Detección oportuna de deterioro para planes de restauración o digitalización.",
      "Identificación de series documentales aptas para transferencia al archivo central o eliminación segura (TRD/TVD).",
    ],
    stepsTitle: "Proceso de levantamiento",
    stepsIntro: "La clasificación documental es el primer paso para poner orden en los archivos de una empresa: según su naturaleza, función y valor, aplicando las normativas archivísticas vigentes (Tablas de Retención y Valoración Documental).",
    steps: [
      { ic: "clipboard2-pulse", t: "Diagnóstico inicial", d: "" },
      { ic: "upc-scan", t: "Identificación y codificación", d: "" },
      { ic: "database", t: "Registro en base de datos", d: "" },
      { ic: "file-earmark-text", t: "Entrega de informe final", d: "" },
    ],
    reasonsKicker: "¿Por qué elegir a Transarchivos?",
    reasons: [
      { ic: "bank", t: "Validez jurídica", d: "Garantizamos la conformidad legal de su archivo bajo la Ley 594 de 2000, la Ley 527 y los lineamientos del AGN. Cada intervención, desde la custodia hasta la eliminación, cuenta con trazabilidad auditable y soporte legal para proteger a su organización ante cualquier requerimiento regulatorio." },
      { ic: "shield-lock", t: "Infraestructura búnker y recuperación crítica", d: "Protegemos sus documentos en bóvedas especializadas con monitoreo 24/7. Aseguramos la continuidad de su operación con la entrega urgente de expedientes bajo estrictos Acuerdos de Nivel de Servicio (SLA)." },
      { ic: "clipboard2-pulse", t: "Consultoría diagnóstica", d: "Realizamos una evaluación técnica y operativa de su archivo. Estructuramos el ciclo de vida documental mediante Tablas de Retención (TRD/TVD) e implementamos el Programa de Gestión Documental (PGD) para ordenar su información con criterio." },
      { ic: "cpu", t: "Innovación e integración tecnológica", d: "Convertimos archivos físicos en activos digitales mediante escaneo de alta velocidad y reconocimiento óptico (OCR)." },
    ],
    norms: ["Ley 594 de 2000", "Ley 2106 de 2019 (Ley Antitrámites)", "Ley 527 de 1999", "Normativa del Archivo General de la Nación", "Tablas de Retención Documental"],
  },

  "programa-de-gestion-documental": {
    tagline: "Gobierno de información, cumplimiento normativo y eficiencia operativa para su empresa.",
    intro: "El Programa de Gestión Documental (PGD) de Transarchivos es un servicio de consultoría e intervención integral diseñado para estructurar y administrar todo el ciclo de vida de la información de su compañía.",
    about: "A través de este modelo, definimos y ejecutamos las políticas, procesos e instrumentos archivísticos (Tablas de Retención Documental, TRD) que regulan la creación, organización, custodia, consulta y disposición final de los documentos físicos de un archivo, garantizando un control total del patrimonio documental bajo los estándares exigidos por el Archivo General de la Nación (AGN) y la Ley 594 de 2000.",
    stats: [{ v: "Obligatorio", l: "para entidades públicas y privadas con funciones públicas" }, { v: "Decreto 1080", l: "de 2015 como respaldo" }, { v: "Cero papel", l: "jurídicamente válido" }],
    benefits: [
      "Blindaje jurídico y normativo: reduce el riesgo de sanciones financieras y legales al asegurar el cumplimiento estricto de los requerimientos de entes reguladores (Superintendencias, DIAN, AGN, MinTIC) y normativas de Hábeas Data.",
      "Reducción de costos fijos: depura el archivo documental vencido, optimizando el uso de metros cuadrados operativos y eliminando el pago de custodia por archivos sin valor legal o administrativo.",
      "Productividad y agilidad operativa: sustituye la búsqueda manual de carpetas por estructuras estandarizadas de clasificación e indexación, permitiendo que su equipo localice información crítica en cuestión de segundos.",
      "Continuidad del negocio y control de riesgos: protege la memoria corporativa contra pérdidas, accesos no autorizados o contingencias, asegurando la disponibilidad de los activos de información en todo momento.",
    ],
    reasonsTitle: "Lo que nos diferencia de la competencia",
    reasons: [
      { ic: "speedometer2", t: "Control total y en tiempo real de su información", d: "" },
      { ic: "clock-history", t: "Historial de movimientos y cambios siempre disponible", d: "" },
      { ic: "shield-check", t: "Mayor seguridad y respaldo de la información", d: "" },
      { ic: "lightning-charge", t: "Optimización de tiempos y reducción de errores", d: "" },
      { ic: "sliders", t: "Herramientas adaptables a las necesidades de cada cliente", d: "" },
    ],
    extra: {
      title: "Software de gestión documental",
      text: "En Transarchivos contamos con un software especializado en el manejo documental. Centraliza y controla la trazabilidad de miles de documentos: contratos, registros y movimientos. Esta herramienta optimiza los procesos, mejora la experiencia y le da velocidad a la consulta documental, permitiendo una gestión más ágil, segura y eficiente.",
      note: "En Transarchivos evolucionamos con usted, ofreciendo no solo experiencia en la gestión física de documentos, sino también soluciones tecnológicas que fortalecen la seguridad y modernización de su empresa.",
    },
    norms: ["Ley 594 de 2000", "Ley 2106 de 2019 (Ley Antitrámites)", "Decreto 1080 de 2015", "Normas del AGN"],
  },

  "custodia-de-medios-magneticos": {
    title: "Custodia de medios técnicos",
    tagline: "Protección, control y continuidad del negocio para sus activos digitales.",
    intro: "Un servicio especializado de almacenamiento en nuestras instalaciones, diseñado para resguardar soportes técnicos y ópticos con información.",
    about: "A diferencia del papel, los medios técnicos son extremadamente sensibles a campos electromagnéticos, variaciones térmicas, humedad y partículas en suspensión. Transarchivos garantiza la preservación física y la integridad de los backups de su empresa, asegurando que sus copias de seguridad de recuperación ante desastres estén intactas y disponibles cuando las necesite.",
    stats: [{ v: "Air gap", l: "copia de seguridad aislada de la red" }, { v: "24 h", l: "control de temperatura y humedad" }, { v: "Propios", l: "vehículos y contenedores especializados para el traslado" }],
    benefitsTitle: "Beneficios estratégicos para las empresas",
    benefits: [
      "Garantía de recuperación ante desastres: asegura la continuidad del negocio al resguardar copias de respaldo fuera del sitio principal, protegiendo a la empresa contra fallas de infraestructura o desastres naturales.",
      "Preservación de los datos: previene la pérdida irremediable de información por humedad, calor o acumulación de polvo, extendiendo la vida útil de las cintas y discos.",
      "Cumplimiento normativo: se facilita al cliente el cumplimiento de las normas que demanda la ISO 27001 al mantener tercerizado el servicio.",
    ],
    stepsTitle: "Proceso de custodia de medios técnicos en 5 pasos",
    steps: [
      { t: "Recolección segura", d: "Entrega del medio por parte del cliente, dejando evidencia de la trazabilidad." },
      { t: "Transporte del medio", d: "Trasladamos los soportes en contenedores especializados, en vehículos de la empresa." },
      { t: "Almacenamiento en cuarto de seguridad", d: "Ingresamos los medios a cajillas de seguridad asignadas a cada cliente." },
      { t: "Monitoreo y protección activa 24/7", d: "Mantenemos sus activos bajo vigilancia permanente." },
      { t: "Rotación y despacho", d: "Entregamos sus copias cuando lo requiera, de acuerdo con las condiciones del contrato." },
    ],
    reasons: [
      { ic: "clock-history", t: "Eficiencia operativa en tiempos de entrega", d: "Cumplimiento de la entrega de los medios técnicos en los tiempos establecidos." },
      { ic: "truck", t: "Logística de transporte seguro", d: "Realizamos la recolección y despacho de sus medios con transporte exclusivo de la empresa Transarchivos." },
    ],
    norms: ["Ley 1581 de 2012", "Ley 2106 de 2019 (Ley Antitrámites)", "ISO 27001 (seguridad de la información)", "plan de recuperación ante desastres (DRP)"],
  },
  "custodia-de-archivos": {
    tagline: "Protegemos y conservamos sus documentos con seguridad, organización y trazabilidad.",
    intro: "La custodia de archivos es un servicio especializado que consiste en el resguardo, protección y gestión física de los documentos y archivos de una organización. Este servicio se encarga de garantizar la seguridad, integridad, disponibilidad y el acceso inmediato de los archivos a lo largo de su ciclo de vida documental.",
    about: "",
    stats: [{ v: "24/7", l: "monitoreo y vigilancia con CCTV" }, { v: "Icontec", l: "estantería de carga pesada" }, { v: "Variable", l: "pague por el volumen que custodia" }],
    benefits: ["Accesibilidad a la información", "Seguridad 24/7: privacidad y confidencialidad", "Recuperación profesional de la información", "Optimización de espacio"],
    stepsKicker: "Nuestra fórmula del éxito",
    stepsTitle: "Un método simple y transparente para llevarlo al siguiente nivel",
    steps: [
      { t: "Identificación y diagnóstico", d: "Analizamos y clasificamos su fondo documental según su tipología y naturaleza jurídica (contratos, facturas, expedientes de personal, correspondencia). Definimos la estructura lógica antes de cualquier movimiento físico." },
      { t: "Indexación y clasificación", d: "Registramos cada documento en bases de datos estructuradas asociando metadatos clave (nombres, fechas, folios, códigos de expediente). Esto garantiza una búsqueda ágil y un control documental preciso." },
      { t: "Embalaje y rotulado técnico", d: "Guardamos la información en cajas documentales X300 de alta resistencia, debidamente codificadas y rotuladas bajo estándares del Archivo General de la Nación (AGN) para asegurar su preservación." },
      { t: "Almacenamiento e infraestructura búnker", d: "Resguardamos su archivo en instalaciones especializadas con control riguroso y sistemas automatizados de protección con acceso biométrico." },
      { t: "Consulta, despacho y trazabilidad", d: "Suministramos sus expedientes en formato físico o digitalizado bajo estrictos Acuerdos de Nivel de Servicio (SLA). Mantenemos registro de auditoría y trazabilidad total sobre cada solicitud." },
    ],
    reasons: [
      { ic: "building-lock", t: "Bóvedas búnker con control ambiental y protección activa", d: "Ofrecemos instalaciones de almacenamiento industrial diseñadas bajo estándares internacionales de seguridad física y control de acceso para preservar sus archivos por años." },
      { ic: "link-45deg", t: "Trazabilidad total y cadena de custodia ininterrumpida", d: "Cada caja, carpeta y documento cuenta con codificación y seguimiento en tiempo real desde el momento de la recolección hasta su consulta final. Mantenemos una bitácora de auditoría digital que garantiza la máxima confidencialidad, el cumplimiento de Hábeas Data y la seguridad jurídica de su patrimonio documental." },
      { ic: "lightning-charge", t: "Recuperación y consulta", d: "Eliminamos los tiempos muertos en la gestión de su información. Atendemos sus solicitudes de préstamo de documentos en tiempo récord (Servicio inmediato), respaldados por Acuerdos de Nivel de Servicio (SLA) rigurosos que garantizan la continuidad operativa de su empresa ante emergencias o auditorías." },
      { ic: "rulers", t: "Optimización eficiente de metros cuadrados", d: "Liberamos áreas costosas en sus instalaciones al trasladar sus documentos a nuestras instalaciones de alta densidad. Le ayudamos a reducir costos fijos de infraestructura y a eliminar riesgos por almacenamiento inadecuado." },
    ],
    norms: ["Ley 594 de 2000", "Ley 2106 de 2019 (Ley Antitrámites)", "Norma Icontec (estantería)", "Tablas de Retención Documental"],
  },

  "digitalizacion-de-documentos": {
    tagline: "Su archivo físico, digital y con valor legal.",
    intro: "La digitalización de documentos es el proceso técnico mediante el cual se convierten documentos físicos en archivos digitales, mediante el uso de escáneres de alta producción. Este proceso incluye fases como la captura, indexación y el reconocimiento óptico de caracteres para generar archivos digitales con capacidad de búsqueda.",
    about: "Nuestro servicio está respaldado por procesos internos que aseguran la confidencialidad, integridad y disponibilidad de la información del cliente.",
    stats: [{ v: "200–600", l: "dpi de resolución de escaneo" }, { v: "OCR", l: "PDF con texto buscable" }, { v: "Ley 527", l: "de 1999, valor legal" }],
    benefits: ["Ahorro de costos en espacio físico", "Protección de la información sensible en caso de pérdida o deterioro del documento", "Reducción de riesgos"],
    stepsTitle: "Así transformamos sus documentos en activos digitales",
    steps: [
      { t: "Preparación de documentos", d: "Retiro de ganchos, desdoblado, unificación y alineación de los documentos." },
      { t: "Escaneo de documentos", d: "Captura de la imagen." },
      { t: "Indexación", d: "Asignación de nombre a los documentos." },
      { t: "Revisión final de calidad", d: "Consolidación de la información para su posterior entrega en medio magnético de almacenamiento." },
    ],
    reasons: [
      { ic: "tag", t: "Precios competitivos", d: "Equilibrio óptimo entre costos y beneficios tangibles adquiridos del servicio." },
      { ic: "shield-lock", t: "Confidencialidad", d: "Tranquilidad absoluta y control de la información." },
      { ic: "person-check", t: "Experiencia del personal", d: "Tareas realizadas por profesionales altamente calificados en el manejo de las herramientas, el software y el procesamiento de imágenes." },
    ],
    modes: [
      { ic: "building", t: "En nuestro centro de operación", d: "Con tiempos de respuesta óptimos para sus solicitudes." },
      { ic: "house-door", t: "En su empresa (in house)", d: "El documento no sale de sus instalaciones." },
    ],
    norms: ["Ley 527 de 1999", "Ley 2106 de 2019 (Ley Antitrámites)", "Decreto 1080 de 2015", "Normas del AGN"],
  },
  "destruccion-de-documentos": {
    tagline: "Eliminación confidencial, certificada y responsable.",
    intro: "En Transarchivos ofrecemos un servicio de destrucción documental confiable y seguro, respaldado por las normas vigentes. Cumplimos con los lineamientos del Archivo General de la Nación y la Ley 594 de 2000, eliminando únicamente aquellos documentos que ya cumplieron su ciclo de vida según las Tablas de Retención y Valoración Documental.",
    about: "El proceso queda soportado con actas de eliminación y entregamos certificados de destrucción como garantía ante auditorías o requerimientos legales. Además, aplicamos la Ley 1581 de 2012 para la protección de datos personales, asegurando que la información confidencial sea destruida de manera irreversible, protegiendo la privacidad y seguridad de su organización.",
    stats: [{ v: "100%", l: "del papel triturado va a economía circular" }, { v: "1983", l: "profesionalizando la destrucción documental" }, { v: "Certificado", l: "de disposición final con acta e inventario" }],
    benefits: ["Protección total de la información sensible", "Cumplimiento de la normativa legal"],
    stepsTitle: "Proceso de destrucción segura en 5 pasos",
    steps: [
      { t: "Validación de datos Transarchivos", d: "El cliente y/o Transarchivos se encarga de entregar el inventario que será puesto en disposición final." },
      { t: "Recolección de documentos", d: "Se transportan los documentos que son objeto de destrucción a nuestro centro de operación documental." },
      { t: "Trituración industrial irreversible", d: "Procesamos la documentación en plantas de trituración bajo estándares de corte no rearmables, asegurando la eliminación física total." },
      { t: "Expedición de certificado de destrucción", d: "Emitimos un acta de destrucción adjuntando el inventario y el certificado de disposición final." },
      { t: "Reciclaje y gestión ambiental responsable", d: "Enviamos el residuo triturado a procesos de economía circular para su transformación en papel reciclado, entregando un reporte cuantificado de impacto ambiental." },
    ],
    reasonsTitle: "Lo que nos diferencia de la competencia",
    reasons: [
      { ic: "link-45deg", t: "Trazabilidad", d: "Garantizamos una cadena de custodia ininterrumpida desde la entrega del material hasta su procesamiento final." },
      { ic: "file-earmark-check", t: "Certificación legal y cumplimiento", d: "Entregamos los documentos y soportes del proceso de destrucción: acta, inventario adjunto, certificado de disposición final y registro fotográfico." },
      { ic: "recycle", t: "Compromiso ambiental y economía circular certificada", d: "Garantizamos la disposición verde del 100% del material destruido. Convertimos sus desechos de papel en insumos reciclados para la industria." },
    ],
    norms: ["Ley 594 de 2000", "Ley 2106 de 2019 (Ley Antitrámites)", "Ley 1581 de 2012", "Normas del AGN"],
  },
  "microfilmacion-de-archivos": {
    title: "Conversión de microfilms y microfichas",
    tagline: "De soportes históricos a activos digitales con plena validez legal.",
    intro: "El proceso de conversión de microfilms y microfichas se realiza por lotes, garantizando la calidad y la alta definición para formatos digitales (PDF/A, TIFF, JPEG).",
    about: "Este proceso rescata la información resguardada en acetato o poliéster durante décadas y la transforma en un activo digital, accesible desde cualquier dispositivo y totalmente integrado a la infraestructura tecnológica de su organización.",
    stats: [{ v: "16 / 35", l: "milímetros, formatos de microfilme" }, { v: "PDF/A", l: "TIFF o JPEG de alta definición" }, { v: "OCR", l: "archivos 100% buscables por texto" }],
    benefitsTitle: "Beneficios estratégicos para las empresas",
    benefits: [
      "Recuperación inmediata: elimina la dependencia de equipos mecánicos obsoletos o dañados para recuperar y visualizar imágenes de microfilms.",
      "Continuidad del negocio: el microfilm sufre degradación química con el tiempo (síndrome del vinagre, hongos o pérdida de contraste). La digitalización detiene la pérdida irremediable de datos y crea respaldos digitales seguros.",
      "Integración operativa: los documentos históricos o técnicos pasan de estar aislados a conectarse directamente con sus sistemas de gestión (ERP, CRM o repositorios en la nube), dinamizando procesos de auditoría, respuesta legal o consulta técnica.",
    ],
    reasons: [
      { ic: "award", t: "Experiencia", d: "Convertimos sus microfilms a digital combinando los conocimientos adquiridos en los procesos realizados." },
      { ic: "lightning-charge", t: "Tiempos rápidos de respuesta", d: "Aceleramos la conversión de sus microfilms con tiempos rápidos de respuesta y tarifas altamente competitivas." },
      { ic: "search", t: "Procesos adaptados al estado real de sus microfilms o microfichas", d: "Evaluamos técnicamente las condiciones físicas y el nivel de conservación de sus rollos para aplicar el método de conservación exacto que requiera." },
    ],
    audience: { title: "Ideal para", items: [
      { ic: "heart-pulse", t: "Historias clínicas", d: "" }, { ic: "journal-bookmark", t: "Registros notariales", d: "" },
      { ic: "briefcase", t: "Expedientes laborales", d: "" }, { ic: "calculator", t: "Archivos contables y financieros", d: "" },
      { ic: "bank2", t: "Documentos históricos", d: "" }, { ic: "clock-history", t: "Conservación prolongada", d: "" },
    ] },
    norms: ["Ley 527 de 1999", "Ley 2106 de 2019 (Ley Antitrámites)", "Decreto 2527 de 1950", "Ley 594 de 2000", "Normas del AGN"],
    ctaTitle: "Convierta sus rollos de película en archivos PDF buscables",
  },
  "servicio-inhouse": {
    tagline: "Gestión documental eficiente, dentro de su propia empresa.",
    intro: "En Transarchivos ofrecemos una solución diseñada para aquellas organizaciones que desean contar con personal experto en gestión documental, trabajando directamente desde sus instalaciones.",
    about: "Este modelo permite tercerizar la operación documental para que usted no pierda el control de su gestión, optimizando recursos, mejorando la eficiencia y garantizando el cumplimiento normativo. Algunas empresas prefieren que sus documentos no salgan de sus instalaciones: con este servicio obtienen el respaldo de nuestro equipo experto sin interrumpir su operación interna.",
    stats: [{ v: "40+", l: "años de metodologías probadas" }, { v: "SLA", l: "con informes mensuales de gestión" }, { v: "0", l: "pasivos laborales para su empresa" }],
    includes: ["Organización, clasificación y foliación", "Inventarios", "Preparación para digitalización o destrucción", "Acompañamiento en auditorías", "Digitalización profesional"],
    benefitsTitle: "Beneficios estratégicos para las empresas",
    benefits: [
      "Cero riesgo de traslado: mantiene la información crítica o confidencial dentro de sus instalaciones, eliminando los riesgos y costos asociados al transporte de documentos.",
      "Reducción de carga administrativa: Transarchivos asume la contratación, capacitación, gestión y supervisión del personal archivístico, liberando a su área de Talento Humano y Operaciones de cargas operativas.",
      "Estandarización inmediata de procesos: transformamos archivos físicos en activos de información eficientes.",
      "Continuidad y disponibilidad inmediata: su equipo conserva el acceso físico directo a los documentos en todo momento, respaldado por un sistema de organización técnica que reduce los tiempos de consulta a segundos.",
    ],
    reasons: [
      { ic: "person-check", t: "Personal calificado y supervisión técnica continua", d: "Desplegamos personal experto en archivística y gestión documental, respaldado por un coordinador que audita la productividad y la calidad del trabajo realizado en sus instalaciones." },
      { ic: "pc-display", t: "Infraestructura y equipamiento tecnológico propio", d: "Suministramos e instalamos en su sede los elementos que el cliente haya acordado en las condiciones del contrato." },
      { ic: "shield-check", t: "Metodología adaptada a sus políticas de seguridad", d: "Nos acoplamos estrictamente a sus protocolos de seguridad de la información y acuerdos de confidencialidad." },
    ],
    audience: { title: "¿Para quién es?", items: [
      { ic: "people", t: "Recursos Humanos", d: "Historiales laborales y documentos sensibles con trazabilidad." },
      { ic: "cart", t: "Compras", d: "Soporte ordenado y digitalizado para auditorías y contratos." },
      { ic: "building-gear", t: "Servicios Generales", d: "Menos carga operativa y más espacio libre." },
      { ic: "calculator", t: "Contabilidad", d: "Cumplimiento de la Ley 594, TRD y TVD." },
    ] },
    norms: ["Ley 594 de 2000", "Ley 2106 de 2019 (Ley Antitrámites)", "Tablas de Retención y Valoración Documental"],
  },
  "servicio-inmediato": {
    tagline: "Acceso y respuesta prioritaria para la información crítica de sus expedientes.",
    intro: "Es la solución de atención rápida para clientes corporativos de Transarchivos que requieren consultar un documento custodiado en momentos de contingencia, requerimientos judiciales, auditorías imprevistas o cierres de negocios urgentes.",
    about: "A través de este servicio, activamos protocolos de búsqueda acelerada en nuestro centro documental para entregar la información en dos modalidades: digitalización bajo demanda (escaneo y envío electrónico) o entrega física en sus instalaciones.",
    stats: [{ v: "Mismo día", l: "si se radica dentro del horario de atención" }, { v: "2", l: "modalidades: digitalización bajo demanda o entrega física" }, { v: "100%", l: "trazable en cada etapa" }],
    benefitsTitle: "Beneficios para clientes activos de Transarchivos",
    benefits: [
      "Respuesta inmediata ante contingencias y auditorías: evita sanciones, multas o pérdidas de términos legales al obtener en minutos o pocas horas los documentos solicitados por entes de control (DIAN, Superintendencias, juzgados).",
      "Flexibilidad de entrega (física o digital): permite elegir entre un envío digital seguro para consulta instantánea desde el sistema web, o el traslado del expediente original físico.",
      "Trazabilidad y control: toda solicitud requiere autorización de los usuarios delegados de su empresa, manteniendo un registro auditable de quién pidió el archivo, la razón y el tiempo de consulta.",
    ],
    stepsTitle: "Proceso del servicio inmediato en 5 pasos",
    steps: [
      { t: "Solicitud vía plataforma o canal", d: "El usuario autorizado de su empresa radica la solicitud de consulta a través de nuestro correo corporativo, indicando el expediente que necesita." },
      { t: "Ubicación en nuestro centro documental", d: "Nuestro sistema de gestión ubica de manera inmediata la posición de la caja y carpeta mediante código de barras, activando al equipo para realizar la extracción." },
      { t: "Procesamiento (digital o físico)", d: "Modo digital: se ubica la información, se digitaliza y se envía el documento mediante correo o por enlace en la web. Modo físico: asignamos un mensajero o vehículo de Transarchivos en ruta directo a la sede de su empresa o punto de requerimiento." },
      { t: "Entrega segura y cierre", d: "Entregamos el expediente físico en sus instalaciones bajo los acuerdos de nivel de servicio, registrando la confirmación de recibido." },
      { t: "Registro de salida", d: "Registramos el movimiento en el aplicativo de gestión documental para abrir la trazabilidad del préstamo, para su posterior retorno a su lugar de origen." },
    ],
    reasons: [
      { ic: "clock-history", t: "Tiempos de respuesta", d: "Acordes a la necesidad del cliente, dentro de los horarios establecidos en Transarchivos." },
      { ic: "person-lock", t: "Filtro de seguridad", d: "Validamos las personas autorizadas para dichos procesos." },
      { ic: "people", t: "Experiencia laboral", d: "Registro, entrega y devolución documentados, con personal capacitado en el manejo y transporte." },
    ],
    modes: [
      { ic: "file-earmark-pdf", t: "Digitalización bajo demanda", d: "Escaneo en alta resolución y envío electrónico." },
      { ic: "truck", t: "Entrega física", d: "Entrega del documento en custodia con traslado directo a las instalaciones del cliente." },
    ],
    norms: ["Ley 594 de 2000", "Ley 2106 de 2019 (Ley Antitrámites)", "Ley 1581 de 2012", "Normas del AGN"],
  },

};
