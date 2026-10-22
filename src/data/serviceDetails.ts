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
    intro: "Identificamos, clasificamos y registramos los documentos que conforman su archivo, con el fin de determinar su volumen, estado de conservación, ubicación y valor documental, para su posterior registro en una base de datos y la elaboración del inventario documental.",
    about: "",
    stats: [{ v: "20%", l: "del tiempo que se pierde buscando información puede recuperarse" }, { v: "Ley 594", l: "y normas del AGN como marco" }, { v: "Paso 1", l: "obligatorio antes de digitalizar" }],
    benefits: [
      "Identificación precisa del volumen, características físicas y valor de su fondo documental para determinar su disposición final (custodia, digitalización o destrucción).",
      "Clasificación alineada a los estándares del Archivo General de la Nación (AGN).",
      "Búsqueda y recuperación inmediata de expedientes mediante bases de datos estructuradas.",
      "Detección oportuna de fallas en la conservación de los documentos, orientada a su posterior custodia o digitalización.",
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
      { ic: "bank", t: "Validez jurídica", d: "" },
      { ic: "shield-lock", t: "Centro documental seguro y acceso inmediato a la información", d: "" },
      { ic: "search", t: "Agilidad en la búsqueda de documentos", d: "" },
      { ic: "cpu", t: "Innovación e integración tecnológica", d: "" },
    ],
    norms: ["Ley 594 de 2000", "Normativa del Archivo General de la Nación", "Tablas de Retención Documental"],
  },

  "programa-de-gestion-documental": {
    tagline: "La gestión documental de su empresa en un proceso organizado, eficiente y seguro, alineado con el Archivo General de la Nación.",
    intro: "El Programa de Gestión Documental de Transarchivos permite planificar, organizar y controlar los documentos durante todo su ciclo de vida, desde su creación hasta su disposición final, optimizando su gestión, facilitando el acceso a la información y garantizando su seguridad.",
    about: "A través de este modelo, definimos y ejecutamos las Tablas de Retención Documental (TRD) que regulan la creación, organización, custodia y disposición final de los documentos físicos de un archivo, garantizando un control del patrimonio documental bajo los estándares exigidos por el Archivo General de la Nación (AGN) y la Ley 594 de 2000.",
    stats: [{ v: "Obligatorio", l: "para entidades públicas y privadas con funciones públicas" }, { v: "Decreto 1080", l: "de 2015 como respaldo" }, { v: "Cero papel", l: "jurídicamente válido" }],
    benefits: [
      "Cumplimiento normativo: reduce los riesgos mediante una gestión documental alineada con la normativa vigente y los requerimientos de entidades reguladoras como la DIAN y el Archivo General de la Nación.",
      "Reducción de costos: optimice el espacio físico mediante la organización documental y evite gastos en la conservación de documentos que ya cumplieron su tiempo de retención y pueden eliminarse legalmente.",
      "Productividad y agilidad operativa: agilice la búsqueda de documentos mediante sistemas de clasificación e indexación.",
    ],
    reasonsKicker: "¿Por qué elegir a Transarchivos?",
    reasons: [
      { ic: "speedometer2", t: "Control en tiempo real", d: "Supervisión de sus unidades documentales 24/7." },
      { ic: "clock-history", t: "Trazabilidad documental", d: "Historial de movimientos y consultas." },
      { ic: "shield-check", t: "Seguridad y respaldo", d: "Protección y conservación de la información." },
      { ic: "lightning-charge", t: "Eficiencia operativa", d: "Reducción de tiempos de búsqueda de documentos." },
      { ic: "tag", t: "Precios competitivos", d: "Soluciones ajustadas a las necesidades de su empresa, con una excelente relación entre costo, calidad y valor del servicio." },
    ],
    extra: {
      title: "Software de gestión documental",
      text: "En Transarchivos contamos con una herramienta de gestión documental que centraliza y controla la trazabilidad de miles de documentos, desde su creación hasta su disposición final. Esta herramienta optimiza los procesos, mejora la experiencia y brinda rapidez al momento de consulta de documentos.",
      note: "En Transarchivos evolucionamos con usted, ofreciendo no solo experiencia en la gestión física de documentos, sino también soluciones tecnológicas que fortalecen la seguridad y modernización de su empresa.",
    },
    norms: ["Ley 594 de 2000", "Decreto 1080 de 2015", "Normas del AGN"],
  },

  "custodia-de-medios-magneticos": {
    tagline: "Protección, control y continuidad del negocio para sus activos digitales.",
    intro: "Un servicio especializado de almacenamiento en búnkeres de alta seguridad, diseñado para resguardar soportes magnéticos y ópticos de información.",
    about: "A diferencia del papel, los medios magnéticos son extremadamente sensibles a campos electromagnéticos, variaciones térmicas, humedad y partículas en suspensión. Transarchivos garantiza la preservación física y la integridad de los backups de su empresa, asegurando que sus copias de seguridad de recuperación ante desastres (DRP) estén intactas y disponibles cuando las necesite.",
    stats: [{ v: "Air gap", l: "copia de seguridad aislada de la red" }, { v: "24 h", l: "control de temperatura y humedad" }, { v: "GPS", l: "en vehículos propios de transporte" }],
    benefitsTitle: "Beneficios estratégicos para las empresas",
    benefits: [
      "Garantía de recuperación ante desastres (DRP): asegura la continuidad del negocio al resguardar copias de respaldo fuera del sitio principal (off-site storage), protegiendo a la empresa contra ciberataques, fallas de infraestructura o desastres naturales.",
      "Preservación de los datos: previene la pérdida irremediable de información causada por la degradación magnética, humedad, calor o acumulación de polvo, extendiendo la vida útil de las cintas y discos.",
      "Cumplimiento normativo y auditorías de TI: facilita la acreditación de estándares internacionales de seguridad de la información (ISO 27001, PCI-DSS, SOX, Hábeas Data) al mantener la rotación y custodia auditable de sus backups.",
      "Ahorro en infraestructura especializada: elimina la necesidad de construir y mantener salas de servidores climatizadas de alta seguridad dentro de las instalaciones de la empresa.",
    ],
    stepsTitle: "Proceso de custodia de medios magnéticos en 5 pasos",
    steps: [
      { t: "Recolección segura y registro de seriales", d: "Registramos la cadena de custodia identificando cada medio por su serial y código único." },
      { t: "Transporte climatizado y trazabilidad GPS", d: "Trasladamos los soportes en vehículos autorizados, garantizando la protección física y magnética durante todo el trayecto." },
      { t: "Almacenamiento en bóveda búnker", d: "Ingresamos los medios a celdas blindadas con control automatizado de temperatura, humedad relativa y aislamiento contra campos electromagnéticos." },
      { t: "Monitoreo y protección activa 24/7", d: "Mantenemos sus activos bajo vigilancia permanente." },
      { t: "Rotación y despacho exprés bajo SLA", d: "Entregamos sus copias de seguridad cuando lo requiera su plan de recuperación (DRP)." },
    ],
    reasons: [
      { ic: "thermometer-half", t: "Bóvedas búnker con climatización de alta precisión", d: "Contamos con celdas de custodia técnica con control estricto. Mantenemos las condiciones ambientales exactas que exige la norma técnica para evitar la corrosión de cintas magnéticas y el deterioro de soportes digitales." },
      { ic: "shield-lock", t: "Blindaje electromagnético y protección", d: "Nuestras bóvedas están equipadas con aislamiento contra campos electromagnéticos y sistemas avanzados de detección y extinción limpia de incendios, garantizando la máxima protección física." },
      { ic: "truck", t: "Logística de transporte seguro y rutas climatizadas", d: "Realizamos la recolección y despacho de sus medios en cofres de seguridad blindados. Nuestro transporte cuenta con control de cadena de custodia y protocolos de seguridad física durante todo el trayecto." },
      { ic: "upc-scan", t: "Trazabilidad por serial y disponibilidad", d: "Gestionamos cada medio magnético mediante un control individual por código de barras/RFID y serial. Ofrecemos entrega inmediata ante emergencias informáticas, respaldados por acuerdos de nivel de servicio (SLA)." },
    ],
    norms: ["Ley 1581 de 2012", "plan de recuperación ante desastres (DRP)"],
  },
  "custodia-de-archivos": {
    tagline: "Protegemos y conservamos sus documentos con seguridad, organización y trazabilidad.",
    intro: "El servicio de custodia documental de Transarchivos consiste en el almacenamiento, protección y conservación segura de los documentos físicos de las empresas en instalaciones especializadas, bajo condiciones controladas y con procesos que garantizan su organización, trazabilidad y confidencialidad.",
    about: "Transarchivos cuenta con centros documentales independientes que permiten distribuir los archivos en diferentes ubicaciones, reduciendo el riesgo de pérdida masiva de información ante desastres y garantizando mayor seguridad para los documentos de nuestros clientes.",
    stats: [{ v: "24/7", l: "monitoreo y vigilancia con CCTV" }, { v: "Icontec", l: "estantería de carga pesada" }, { v: "Variable", l: "pague por el volumen que custodia" }],
    benefits: [
      "Accesibilidad a la información: consulta y localización rápida de documentos.",
      "Control en tiempo real: seguimiento y trazabilidad de la información.",
      "Seguridad 24/7: protección permanente de sus documentos.",
      "Optimización del espacio: libere áreas de sus instalaciones al trasladar sus archivos a nuestros centros documentales.",
    ],
    stepsKicker: "Así funciona nuestro servicio de custodia documental",
    stepsTitle: "Un método simple y transparente para llevarlo al siguiente nivel",
    steps: [
      { ic: "clipboard2-pulse", t: "Identificación y diagnóstico", d: "" },
      { ic: "tags", t: "Clasificación e indexación", d: "" },
      { ic: "box-seam", t: "Almacenamiento y rotulado técnico en la unidad documental", d: "" },
      { ic: "building-check", t: "Ingreso al centro documental", d: "" },
      { ic: "truck", t: "Consultas, despacho y trazabilidad", d: "" },
    ],
    reasons: [
      { ic: "search", t: "Búsqueda ágil", d: "Consulte su información cuando la necesite." },
      { ic: "award", t: "Más de 40 años de experiencia", d: "Trayectoria y conocimiento en gestión documental." },
      { ic: "patch-check", t: "Ética y transparencia", d: "Procesos responsables y confiables." },
      { ic: "shield-lock", t: "Respaldo de la información", d: "Protección y control de sus documentos." },
      { ic: "tag", t: "Precios competitivos", d: "Soluciones ajustadas a las necesidades de su empresa." },
    ],
    norms: ["Ley 594 de 2000", "Ley 962 de 2005, art. 28 (Ley Antitrámites)", "Norma Icontec (estantería)", "Tablas de Retención Documental"],
  },

  "digitalizacion-de-documentos": {
    tagline: "Su archivo físico, digital y con valor legal.",
    intro: "La digitalización de documentos es el proceso técnico mediante el cual se convierten documentos físicos en archivos digitales, mediante el uso de escáneres profesionales y software de procesamiento de imágenes. Incluye la captura, optimización, indexación y el reconocimiento óptico de caracteres (OCR) para generar archivos digitales con capacidad de búsqueda.",
    about: "Nuestro servicio está respaldado por prácticas de seguridad de la información bajo estándares internacionales como ISO 27001, lo que asegura la confidencialidad, integridad y disponibilidad de los datos digitales de su empresa.",
    stats: [{ v: "200–600", l: "dpi de resolución de escaneo" }, { v: "OCR", l: "PDF con texto buscable" }, { v: "Ley 527", l: "de 1999, valor legal" }],
    benefits: ["Protección total de la información sensible", "Cumplimiento de la normativa legal", "Tranquilidad jurídica y empresarial", "Reducción de riesgos de fuga de información"],
    stepsTitle: "Así transformamos sus documentos en activos digitales",
    steps: [
      { t: "Preparación", d: "Limpieza de folios, retiro de ganchos y clasificación previa." },
      { t: "Captura", d: "Escaneo de alta velocidad en color o escala de grises." },
      { t: "Procesamiento", d: "Alineación, recorte de bordes y mejora visual de la imagen." },
      { t: "Indexación OCR", d: "Extracción de metadatos y conversión a texto buscable (OCR)." },
      { t: "Integración", d: "Entrega de archivos en la nube, USB o directo a su software corporativo." },
    ],
    reasons: [
      { ic: "upc-scan", t: "Escaneo industrial con indexación OCR", d: "Utilizamos escáneres de alta velocidad y motores OCR avanzados que transforman el papel en archivos PDF 100% buscables. Su equipo podrá localizar por palabra clave en segundos, acelerando la productividad de su empresa." },
      { ic: "patch-check", t: "Validez legal y equivalencia probatoria", d: "Garantizamos que cada expediente digitalizado conserve la misma fuerza legal que el original físico. Alineamos todo el proceso a la Ley 527 de 1999 y los estándares del AGN para respaldar su información ante auditorías o litigios." },
      { ic: "shield-lock", t: "Cadena de custodia y seguridad blindada", d: "Mantenemos trazabilidad absoluta sobre sus documentos en cada etapa (transporte, preparación, escaneo y reensamble). Protegemos su información confidencial bajo estrictos acuerdos de confidencialidad y protocolos de Hábeas Data." },
    ],
    modes: [
      { ic: "building", t: "En nuestro centro de operación", d: "Con atención prioritaria para documentos urgentes." },
      { ic: "house-door", t: "En su empresa (in house)", d: "El documento no sale de sus instalaciones." },
    ],
    norms: ["Ley 527 de 1999", "Ley 962 de 2005, art. 28 (Ley Antitrámites)", "Decreto 1080 de 2015", "Normas del AGN"],
  },
  "destruccion-de-documentos": {
    title: "Destrucción legal de documentos",
    tagline: "Eliminación confidencial, certificada y ambientalmente responsable.",
    intro: "En Transarchivos ofrecemos un servicio de destrucción documental confiable y 100% seguro, respaldado por la normativa vigente. Cumplimos con los lineamientos del Archivo General de la Nación y la Ley 594 de 2000, eliminando únicamente aquellos documentos que ya cumplieron su ciclo de vida según las Tablas de Retención y Valoración Documental.",
    about: "Cada proceso queda soportado con actas de eliminación y entregamos certificados de destrucción como garantía ante auditorías o requerimientos legales. Además, aplicamos la Ley 1581 de 2012 para la protección de datos personales, asegurando que la información confidencial sea destruida de manera irreversible, protegiendo la privacidad y seguridad de su organización.",
    stats: [{ v: "100%", l: "del papel triturado va a economía circular" }, { v: "1983", l: "profesionalizando la destrucción documental" }, { v: "Certificado", l: "válido ante DIAN y superintendencias" }],
    benefits: ["Protección total de la información sensible", "Cumplimiento de la normativa legal", "Tranquilidad jurídica y empresarial", "Reducción de riesgos de fuga de información"],
    stepsTitle: "Proceso de destrucción segura en 5 pasos",
    steps: [
      { t: "Validación y aprobación del Comité de Archivo", d: "Verificamos los tiempos de retención en las TRD/TVD y presentamos el inventario documental para obtener el Acta Oficial de Aprobación firmada por el Comité Interno de Archivo de la empresa." },
      { t: "Recolección y cadena de custodia segura", d: "Sellamos y transportamos los lotes autorizados a nuestro centro de custodia, garantizando cero riesgo de manipulación o fuga de información." },
      { t: "Trituración industrial irreversible", d: "Procesamos la documentación en plantas de trituración de alto rendimiento bajo estándares de corte en partículas no rearmables, asegurando la eliminación física total." },
      { t: "Expedición de certificado de destrucción", d: "Emitimos una certificación formal y auditable (alineada al Acta del Comité y a la Ley de Hábeas Data) que respalda a la empresa ante entes de control como la DIAN, el AGN o las Superintendencias." },
      { t: "Reciclaje y gestión ambiental responsable", d: "Enviamos el residuo triturado a procesos de economía circular para su transformación en papel reciclado, entregando un reporte cuantificado de impacto ambiental." },
    ],
    reasonsTitle: "Lo que nos diferencia de la competencia",
    reasons: [
      { ic: "scissors", t: "Trituración industrial con estándar DIN (partícula irreversible)", d: "Utilizamos maquinaria industrial de corte en partículas finas que imposibilita la reconstrucción de los textos, garantizando una eliminación física 100% efectiva de la información confidencial." },
      { ic: "link-45deg", t: "Trazabilidad blindada", d: "Garantizamos una cadena de custodia ininterrumpida desde la entrega del material hasta su procesamiento final." },
      { ic: "file-earmark-check", t: "Certificación legal y cumplimiento normativo (Hábeas Data)", d: "Entregamos un Certificado de Destrucción Segura con validez jurídica ante entes de control (Superintendencias, DIAN, AGN), asegurando que su compañía quede totalmente blindada ante sanciones por vulneración de la Ley de Protección de Datos Personales." },
      { ic: "recycle", t: "Compromiso ambiental y economía circular certificada", d: "Garantizamos la disposición verde del 100% del material destruido. Convertimos sus desechos de papel en insumos reciclados para la industria." },
    ],
    norms: ["Ley 594 de 2000", "Ley 962 de 2005, art. 28 (Ley Antitrámites)", "Ley 1581 de 2012", "Normas del AGN"],
  },
  "microfilmacion-de-archivos": {
    title: "Digitalización de microfilms y microfichas",
    tagline: "De soportes históricos a activos digitales con plena validez legal.",
    intro: "La digitalización de microfilms consiste en la conversión de rollos de película (16 mm / 35 mm), chaquetas y microfichas analógicas a formatos digitales de alta definición (PDF/A, TIFF, JPEG).",
    about: "Este proceso rescata la información resguardada en acetato o poliéster durante décadas y la transforma en un activo digital, accesible desde cualquier dispositivo y totalmente integrado a la infraestructura tecnológica de su organización.",
    stats: [{ v: "16 / 35", l: "milímetros, formatos de microfilme" }, { v: "PDF/A", l: "TIFF o JPEG de alta definición" }, { v: "OCR", l: "archivos 100% buscables por texto" }],
    benefitsTitle: "Beneficios estratégicos para las empresas",
    benefits: [
      "Recuperación inmediata de la información: elimina la dependencia de visores mecánicos obsoletos o dañados. Su equipo podrá buscar y consultar cualquier expediente en segundos mediante palabras clave.",
      "Continuidad del negocio: el microfilm sufre degradación química con el tiempo (síndrome del vinagre, hongos o pérdida de contraste). La digitalización detiene la pérdida irremediable de datos y crea respaldos digitales seguros.",
      "Integración operativa: los documentos históricos o técnicos pasan de estar aislados a conectarse directamente con sus sistemas de gestión (ERP, CRM o repositorios en la nube), dinamizando procesos de auditoría, respuesta legal o consulta técnica.",
      "Ahorro de tiempos y costos operativos: reduce a cero el tiempo invertido por el personal en desplazamientos, montaje de rollos y búsquedas manuales, aumentando drásticamente la productividad de las áreas jurídicas y administrativas.",
    ],
    reasons: [
      { ic: "lightbulb", t: "Laboratorio de captura", d: "A diferencia de escaneos genéricos o adaptaciones improvisadas, utilizamos escáneres industriales especializados equipados con luz LED fría que protegen las cintas frágiles contra el estrés térmico, garantizando la captura fotograma a fotograma sin riesgo de ruptura." },
      { ic: "search", t: "Procesamiento avanzado con OCR", d: "No entregamos imágenes aisladas o «ciegas». Aplicamos algoritmos de reconocimiento óptico de caracteres (OCR) de alta definición y corrección de polaridad (negativo a positivo) para que los archivos PDF generados sean 100% buscables por texto." },
      { ic: "bank", t: "Preservación del valor probatorio y validez jurídica", d: "Garantizamos que la migración del soporte mantenga la estricta cadena de custodia y la equivalencia probatoria bajo la Ley 527 de 1999 y las directrices del Archivo General de la Nación (AGN), respaldando sus documentos ante cualquier tribunal o entidad reguladora." },
    ],
    audience: { title: "Ideal para", items: [
      { ic: "heart-pulse", t: "Historias clínicas", d: "" }, { ic: "journal-bookmark", t: "Registros notariales", d: "" },
      { ic: "briefcase", t: "Expedientes judiciales", d: "" }, { ic: "calculator", t: "Archivos contables y financieros", d: "" },
      { ic: "bank2", t: "Documentos históricos", d: "" }, { ic: "clock-history", t: "Conservación prolongada", d: "" },
    ] },
    norms: ["Ley 527 de 1999", "Decreto 2527 de 1950", "Ley 594 de 2000", "Normas del AGN"],
    ctaTitle: "Convierta sus rollos de película en archivos PDF buscables",
  },
  "servicio-inhouse": {
    tagline: "Gestión documental eficiente, dentro de su propia empresa.",
    intro: "En Transarchivos ofrecemos una solución diseñada para aquellas organizaciones que desean contar con personal experto en gestión documental, trabajando directamente desde sus instalaciones.",
    about: "Este modelo permite externalizar la operación documental para que usted no pierda el control de su gestión, optimizando recursos, mejorando la eficiencia y garantizando el cumplimiento normativo. Algunas empresas prefieren que sus documentos no salgan de sus instalaciones: con este servicio obtienen el respaldo de nuestro equipo experto sin interrumpir su operación interna.",
    stats: [{ v: "40+", l: "años de metodologías probadas" }, { v: "SLA", l: "con informes mensuales de gestión" }, { v: "0", l: "pasivos laborales para su empresa" }],
    includes: ["Organización, clasificación y foliación", "Inventarios", "Preparación para digitalización o destrucción", "Acompañamiento en auditorías", "Digitalización profesional"],
    benefitsTitle: "Beneficios estratégicos para las empresas",
    benefits: [
      "Cero riesgo de traslado: mantiene la información crítica o confidencial dentro de sus instalaciones, eliminando los riesgos y costos asociados al transporte de documentos.",
      "Reducción de carga administrativa: Transarchivos asume la contratación, capacitación, gestión y supervisión del personal archivístico, liberando a su área de Talento Humano y Operaciones de cargas operativas.",
      "Estandarización inmediata de procesos: transformamos archivos físicos en activos de información eficientes, aplicando las Tablas de Retención Documental (TRD) directamente en su sitio de trabajo.",
      "Continuidad y disponibilidad inmediata: su equipo conserva el acceso físico directo a los documentos en todo momento, respaldado por un sistema de organización técnica que reduce los tiempos de consulta a segundos.",
    ],
    reasons: [
      { ic: "person-check", t: "Personal calificado y supervisión técnica continua", d: "Desplegamos personal experto en archivística y gestión documental, respaldado por un coordinador de cuenta que audita periódicamente el rendimiento, la productividad y la calidad del trabajo realizado en sus instalaciones." },
      { ic: "pc-display", t: "Infraestructura y equipamiento tecnológico propio", d: "Suministramos e instalamos en su sede los escáneres industriales, insumos de conservación (cajas y carpetas con especificación AGN) y software de indexación necesarios para la operación." },
      { ic: "shield-check", t: "Metodología adaptada a sus políticas de seguridad", d: "Nos acoplamos estrictamente a sus protocolos de seguridad de la información, acuerdos de confidencialidad y horarios de trabajo." },
      { ic: "arrow-left-right", t: "Transición gradual hacia el archivo híbrido y digital", d: "No solo organizamos el papel en sus estantes; preparamos su archivo para la transformación digital. Establecemos estaciones de digitalización in-house e indexación OCR, reduciendo paulatinamente la dependencia del papel físico." },
    ],
    audience: { title: "¿Para quién es?", items: [
      { ic: "people", t: "Recursos Humanos", d: "Historiales laborales y documentos sensibles con trazabilidad." },
      { ic: "cart", t: "Compras", d: "Soporte ordenado y digitalizado para auditorías y contratos." },
      { ic: "building-gear", t: "Servicios Generales", d: "Menos carga operativa y más espacio libre." },
      { ic: "clipboard-check", t: "Comité de Archivo", d: "Cumplimiento de la Ley 594, TRD y TVD." },
    ] },
    norms: ["Ley 594 de 2000", "Tablas de Retención y Valoración Documental"],
  },
  "servicio-inmediato": {
    tagline: "Control, seguridad y acceso a su información.",
    intro: "El Servicio Inmediato de Transarchivos permite a nuestros clientes solicitar la entrega de expedientes o documentos bajo nuestra custodia. Localizamos y gestionamos la entrega de sus archivos (en formato físico o digital), garantizando la trazabilidad y el control de la cadena de custodia en cada requerimiento.",
    about: "A través de este servicio, activamos protocolos de búsqueda en nuestro centro documental para entregar la información en tres modalidades: documento PDF digital, despacho físico mediante mensajería o visita de consulta a nuestras instalaciones.",
    stats: [{ v: "Mismo día", l: "si se radica dentro del horario de atención" }, { v: "3", l: "modalidades: digital, física o visita de consulta" }, { v: "100%", l: "trazable en cada etapa" }],
    benefitsTitle: "Beneficios para clientes de Transarchivos",
    benefits: [
      "Respuesta ante auditorías: evite sanciones, multas o pérdidas de términos legales al obtener los documentos solicitados por entes de control (DIAN, Superintendencias, juzgados).",
      "Flexibilidad de entrega (física o digital): permite elegir entre un envío digital para la consulta desde el sistema web, el traslado del expediente original o la programación de una visita de consulta.",
      "Trazabilidad y control total: toda solicitud requiere autorización de los usuarios delegados de su empresa, manteniendo un registro auditable de quién pidió el archivo, la razón y el tiempo de consulta.",
    ],
    stepsTitle: "Proceso del servicio inmediato en 4 pasos",
    steps: [
      { t: "Solicitud por parte del cliente", d: "El usuario autorizado de su empresa radica la solicitud de consulta a través de nuestros canales de atención, indicando el expediente que necesita." },
      { t: "Ubicación en centro documental", d: "Nuestro sistema de gestión ubica la unidad documental donde está almacenado el documento." },
      { t: "Procesamiento (digital o físico)", d: "Modo digital (PDF): digitalizamos el documento solicitado en alta resolución con OCR y lo subimos a su portal seguro para la consulta. Modo físico: asignamos un mensajero o vehículo de la flota de Transarchivos directo a la sede de su empresa o punto de requerimiento. Visita de consulta: usted puede agendar una visita a nuestras instalaciones para consultar sus expedientes." },
      { t: "Registro de salida y cadena de custodia", d: "Registramos el movimiento en el sistema de gestión documental para abrir la bitácora de trazabilidad. El documento queda asociado a un manifiesto que registra el usuario solicitante, fecha, hora y responsable del traslado." },
    ],
    reasons: [
      { ic: "lightning-charge", t: "Respuesta ante emergencias", d: "Un canal tipo «recuperación ante desastres logística»: localizamos el expediente y lo despachamos en tiempo récord." },
      { ic: "person-lock", t: "Gobernanza", d: "Protocolos de autorización con perfiles definidos (directores, representantes legales, cumplimiento) para evitar usos indebidos." },
      { ic: "signpost-split", t: "Cadena de custodia", d: "Registro, entrega y devolución documentados, con personal capacitado en el manejo y transporte." },
    ],
    modes: [
      { ic: "file-earmark-pdf", t: "Documento PDF digital", d: "Digitalizamos el documento en alta resolución con OCR y lo subimos a su portal seguro." },
      { ic: "truck", t: "Despacho físico", d: "Un mensajero o vehículo de la flota de Transarchivos lleva el original a su sede." },
      { ic: "building", t: "Visita de consulta", d: "Agende una visita a nuestras instalaciones para consultar sus expedientes." },
    ],
    norms: ["Ley 594 de 2000", "Ley 1581 de 2012", "Normas del AGN"],
  },

};
