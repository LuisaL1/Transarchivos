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
  steps?: { t: string; d: string }[];
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
    tagline: "La base de un buen control de la información.",
    intro: "Identificamos, registramos y clasificamos los documentos o expedientes que conforman su archivo, con el objetivo de conocer su volumen, estado de conservación, ubicación y valor documental.",
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
      { t: "Diagnóstico inicial", d: "Analizamos la situación actual del archivo (volumen, ubicación, estado y tipo de documentos). Transarchivos se encarga de la recolección de estos documentos." },
      { t: "Identificación y codificación", d: "Cada unidad documental se clasifica y etiqueta con un código único, facilitando su control y ubicación dentro del archivo." },
      { t: "Registro en base de datos", d: "Toda la información se registra en un sistema de inventario, lo que permite generar el control total de la información." },
      { t: "Entrega de informe final", d: "Se entrega un informe consolidado del inventario documental, acompañado del resumen detallado de los documentos identificados." },
    ],
    reasons: [
      { ic: "bank", t: "Validez jurídica", d: "Garantizamos la conformidad legal de su archivo bajo la Ley 594 de 2000, la Ley 527 y los lineamientos del AGN. Cada intervención, desde la custodia hasta la eliminación, cuenta con trazabilidad auditable y soporte legal para proteger a su organización ante cualquier requerimiento regulatorio." },
      { ic: "shield-lock", t: "Infraestructura búnker y recuperación crítica", d: "Protegemos sus documentos en bóvedas especializadas con monitoreo 24/7. Aseguramos la continuidad de su operación con la entrega urgente de expedientes bajo estrictos Acuerdos de Nivel de Servicio (SLA)." },
      { ic: "clipboard2-pulse", t: "Consultoría diagnóstica", d: "Realizamos una evaluación técnica y operativa de su archivo. Estructuramos el ciclo de vida documental mediante Tablas de Retención (TRD/TVD) e implementamos el Programa de Gestión Documental (PGD) para ordenar su información con criterio." },
      { ic: "cpu", t: "Innovación e integración tecnológica", d: "Convertimos archivos físicos en activos digitales mediante escaneo de alta velocidad y reconocimiento óptico de caracteres (OCR)." },
    ],
    norms: ["Ley 594 de 2000", "Normas del AGN", "Tablas de Retención Documental"],
  },
  "programa-de-gestion-documental": {
    tagline: "Gobierno de información, cumplimiento normativo y eficiencia operativa para su empresa.",
    intro: "El Programa de Gestión Documental (PGD) de Transarchivos es un servicio de consultoría e intervención integral diseñado para estructurar y administrar todo el ciclo de vida de la información de su compañía.",
    about: "A través de este modelo, definimos y ejecutamos las políticas, procesos e instrumentos archivísticos (Tablas de Retención Documental TRD) que regulan la creación, organización, custodia, consulta y disposición final de los documentos físicos de un archivo, garantizando un control total del patrimonio documental bajo los estándares exigidos por el Archivo General de la Nación (AGN) y la Ley 594 de 2000.",
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
      { ic: "check2-circle", t: "Optimización de tiempos y reducción de errores", d: "" },
      { ic: "sliders", t: "Herramienta adaptable a las necesidades de cada cliente", d: "" },
    ],
    extra: {
      title: "Software de gestión documental",
      text: "En Transarchivos contamos con un software especializado en el manejo documental. Centraliza y controla la trazabilidad de miles de documentos: contratos, registros y movimientos. Esta herramienta optimiza los procesos, mejora la experiencia y le da velocidad a la consulta documental, permitiendo una gestión más ágil, segura y eficiente.",
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
    tagline: "Su archivo protegido, disponible cuando lo necesite.",
    intro: "La custodia de archivos es un servicio especializado que consiste en el resguardo, protección y gestión física de los documentos y archivos de una organización.",
    about: "Este servicio se encarga de garantizar la seguridad, integridad, disponibilidad y el acceso inmediato de los archivos a lo largo de su ciclo de vida documental.",
    stats: [{ v: "24/7", l: "monitoreo y vigilancia con CCTV" }, { v: "Icontec", l: "estantería de carga pesada" }, { v: "Variable", l: "pague por el volumen que custodia" }],
    benefits: ["Accesibilidad a la información", "Seguridad 24/7", "Privacidad y confidencialidad", "Recuperación profesional de la información", "Optimización de espacio"],
    stepsKicker: "Nuestra fórmula del éxito",
    stepsTitle: "Un método simple y transparente para llevarlo al siguiente nivel",
    steps: [
      { t: "Identificación y diagnóstico", d: "Analizamos y clasificamos su fondo documental según su tipología y naturaleza jurídica (contratos, facturas, expedientes de personal, correspondencia). Definimos la estructura lógica antes de cualquier movimiento físico." },
      { t: "Indexación y clasificación", d: "Registramos cada documento en bases de datos estructuradas asociando metadatos clave (nombres, fechas, folios, códigos de expediente). Esto garantiza una búsqueda ágil y un control documental preciso." },
      { t: "Embalaje y rotulado técnico", d: "Guardamos la información en cajas documentales X300 de alta resistencia, debidamente codificadas y rotuladas bajo estándares del Archivo General de la Nación (AGN) para asegurar su preservación." },
      { t: "Almacenamiento e infraestructura búnker", d: "Resguardamos su archivo en instalaciones especializadas con control riguroso y sistemas automatizados de protección con control biométrico." },
      { t: "Consulta, despacho y trazabilidad", d: "Suministramos sus expedientes en formato físico o digitalizado bajo estrictos Acuerdos de Nivel de Servicio (SLA). Mantenemos registro de auditoría y trazabilidad total sobre cada solicitud." },
    ],
    reasons: [
      { ic: "shield-lock", t: "Bóvedas búnker con control ambiental y protección activa", d: "Ofrecemos instalaciones de almacenamiento industrial diseñadas bajo estándares internacionales de seguridad física y control de acceso para preservar sus archivos por años." },
      { ic: "upc-scan", t: "Trazabilidad total y cadena de custodia ininterrumpida", d: "Cada caja, carpeta y documento cuenta con codificación y seguimiento en tiempo real desde el momento de la recolección hasta su consulta final. Mantenemos una bitácora de auditoría digital que garantiza la máxima confidencialidad, el cumplimiento de Hábeas Data y la seguridad jurídica de su patrimonio documental." },
      { ic: "lightning-charge", t: "Recuperación y consulta", d: "Eliminamos los tiempos muertos en la gestión de su información. Atendemos sus solicitudes de préstamo de documentos en tiempo récord (Servicio Inmediato), respaldados por Acuerdos de Nivel de Servicio (SLA) rigurosos que garantizan la continuidad operativa de su empresa ante emergencias o auditorías." },
      { ic: "rulers", t: "Optimización eficiente de metros cuadrados", d: "Liberamos áreas costosas en sus instalaciones al trasladar sus documentos a nuestras instalaciones de alta densidad. Le ayudamos a reducir costos fijos de infraestructura y a eliminar riesgos por almacenamiento inadecuado." },
    ],
    norms: ["Ley 594 de 2000", "Norma Icontec (estantería)", "Tablas de Retención Documental"],
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
    norms: ["Ley 527 de 1999", "Decreto 1080 de 2015", "Normas del AGN"],
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
    norms: ["Ley 594 de 2000", "Ley 1581 de 2012", "Normas del AGN"],
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
    tagline: "Acceso y respuesta prioritaria para la información crítica de sus expedientes.",
    intro: "Es la solución de atención rápida para clientes corporativos de Transarchivos que requieren consultar un documento custodiado en momentos de contingencia, requerimientos judiciales, auditorías imprevistas o cierres de negocios urgentes.",
    about: "A través de este servicio, activamos protocolos de búsqueda acelerada en nuestras bóvedas para entregar la información en dos modalidades: digitalización inmediata (consulta exprés en PDF) o despacho físico de emergencia mediante mensajería prioritaria.",
    stats: [{ v: "Mismo día", l: "si se radica dentro del horario de atención" }, { v: "2", l: "modalidades: digital o física" }, { v: "100%", l: "trazable en cada etapa" }],
    benefitsTitle: "Beneficios para clientes activos de Transarchivos",
    benefits: [
      "Respuesta inmediata ante contingencias y auditorías: evita sanciones, multas o pérdidas de términos legales al obtener en minutos o pocas horas los documentos solicitados por entes de control (DIAN, Superintendencias, juzgados).",
      "Continuidad operativa sin interrupciones: su equipo no detiene sus procesos comerciales o jurídicos esperando el flujo habitual de préstamos; accede a la información de forma prioritaria.",
      "Flexibilidad de entrega (física o digital): permite elegir entre un envío digital seguro para consulta instantánea desde el sistema web, o el traslado del expediente original físico.",
      "Trazabilidad y control total: toda solicitud prioritaria requiere autorización de los usuarios delegados de su empresa, manteniendo un registro auditable de quién pidió el archivo, la razón y el tiempo de consulta.",
    ],
    stepsTitle: "Proceso del servicio inmediato en 5 pasos",
    steps: [
      { t: "Solicitud exprés por canal prioritario", d: "El usuario autorizado de su empresa radica la solicitud de consulta urgente a través de nuestro correo corporativo servicio@transarchivos.com, indicando el expediente que necesita." },
      { t: "Ubicación acelerada en bóveda búnker", d: "Nuestro sistema de gestión de depósitos ubica de manera inmediata la posición exacta de la caja y carpeta mediante código de barras/RFID, activando al equipo de extracción rápida." },
      { t: "Procesamiento prioritario (digital o físico)", d: "Modo digital (OCR exprés): digitalizamos el documento solicitado en alta resolución con OCR y lo subimos a su portal seguro en tiempo récord. Modo físico: asignamos un mensajero o vehículo de la flota de Transarchivos en ruta prioritaria exclusiva directo a la sede de su empresa o punto de requerimiento." },
      { t: "Entrega segura y cierre de SLA", d: "Entregamos el expediente físico en sus instalaciones bajo estrictos Acuerdos de Nivel de Servicio (SLA de emergencia), registrando la confirmación de recibido." },
      { t: "Registro de salida y cadena de custodia", d: "Registramos el movimiento en el sistema de gestión documental para abrir la bitácora de trazabilidad. El documento queda asociado a un manifiesto digital que registra el usuario solicitante, fecha, hora exacta y responsable del traslado." },
    ],
    reasons: [
      { ic: "lightning-charge", t: "Respuesta ante emergencias", d: "Un canal tipo «recuperación ante desastres logística»: localizamos el expediente y lo despachamos en tiempo récord." },
      { ic: "person-lock", t: "Gobernanza", d: "Protocolos de autorización con perfiles definidos (directores, representantes legales, cumplimiento) para evitar usos indebidos." },
      { ic: "signpost-split", t: "Cadena de custodia", d: "Registro, entrega y devolución documentados, con personal capacitado en el manejo y transporte." },
    ],
    modes: [
      { ic: "cloud-arrow-down", t: "Digitalización prioritaria bajo demanda", d: "La más rápida: escaneo en alta resolución y entrega electrónica cifrada." },
      { ic: "truck", t: "Despacho físico exprés", d: "Transporte prioritario del original, con firmas y sellos húmedos, bajo estrictas condiciones de seguridad." },
    ],
    norms: ["Ley 594 de 2000", "Ley 1581 de 2012", "Normas del AGN"],
  },
};
