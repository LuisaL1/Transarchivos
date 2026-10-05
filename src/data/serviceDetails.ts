export type SvcDetail = {
  tagline: string;
  intro: string;
  stats: { v: string; l: string }[];
  benefits: string[];
  steps?: { t: string; d: string }[];
  reasons: { ic: string; t: string; d: string }[];
  modes?: { ic: string; t: string; d: string }[];
  audience?: { title: string; items: { ic: string; t: string; d: string }[] };
  norms: string[];
};

export const SERVICE_DETAILS: Record<string, SvcDetail> = {
  "levantamiento-de-inventario": {
    tagline: "La base de un buen control de la información.",
    intro: "Identificamos, registramos y clasificamos los documentos o expedientes que conforman su archivo para conocer su volumen, estado de conservación, ubicación y valor documental.",
    stats: [{ v: "20%", l: "del tiempo que se pierde buscando información puede recuperarse" }, { v: "Ley 594", l: "y normas del AGN como marco" }, { v: "Paso 1", l: "obligatorio antes de digitalizar" }],
    benefits: ["Saber qué existe, sus características e importancia", "Estructurar la información según normas archivísticas", "Localizar documentos rápidamente", "Detectar deterioro y necesidad de restauración o digitalización", "Identificar qué puede eliminarse o transferirse"],
    reasons: [
      { ic: "graph-up-arrow", t: "Retorno de la inversión", d: "Libera espacio de alto costo, reduce hasta un 20% del tiempo perdido buscando información y previene multas o litigios por documentos no encontrados." },
      { ic: "shield-check", t: "Cumplimiento legal", d: "Se ejecuta bajo las normas del AGN y la Ley 594 de 2000, alimenta las TRD y blinda a la empresa ante auditorías y superintendencias." },
      { ic: "lock", t: "Seguridad y trazabilidad", d: "Cadena de custodia y acuerdos de confidencialidad con el personal; trazable desde la identificación hasta el registro en bases de datos." },
      { ic: "upc-scan", t: "Antes de digitalizar", d: "Evita trasladar el caos físico al entorno digital y optimiza el presupuesto de digitalización." },
    ],
    norms: ["Ley 594 de 2000", "Normas del AGN", "Tablas de Retención Documental"],
  },
  "programa-de-gestion-documental": {
    tagline: "Sus documentos, ordenados durante todo su ciclo de vida.",
    intro: "Un sistema estructurado de políticas, normas, procedimientos y herramientas para manejar los documentos desde su creación y uso hasta su conservación y disposición final. Lo diseñamos, formulamos e implementamos a la medida.",
    stats: [{ v: "Obligatorio", l: "para entidades públicas y privadas con funciones públicas" }, { v: "Decreto 1080", l: "de 2015 como respaldo" }, { v: "Cero papel", l: "jurídicamente válido" }],
    benefits: ["Ahorra dinero reduciendo costos de almacenamiento y administración", "Encuentra información en segundos", "Cumple normas legales y evita sanciones", "Protege la información con control de acceso", "Libera espacio físico y digital", "Mejora la toma de decisiones con información confiable"],
    reasons: [
      { ic: "exclamation-triangle", t: "Riesgo legal", d: "Su ausencia expone a sanciones e investigaciones del AGN cuando la entidad tiene funciones públicas o está vigilada por superintendencias." },
      { ic: "diagram-3", t: "Productividad", d: "Unifica criterios de producción, recepción, consulta, retención y disposición de documentos físicos y electrónicos en todas las áreas." },
      { ic: "piggy-bank", t: "Costos y sostenibilidad", d: "Detiene el crecimiento descontrolado del archivo con eliminación segura y oportuna, ahorrando insumos, espacio y servidores." },
      { ic: "cpu", t: "Transformación digital", d: "Define arquitectura de información, ciclo de vida del documento electrónico, firmas digitales, metadatos y preservación." },
    ],
    norms: ["Ley 594 de 2000", "Decreto 1080 de 2015", "Normas del AGN"],
  },
  "custodia-de-medios-magneticos": {
    tagline: "¿Por qué sus backups no pueden quedarse en la oficina?",
    intro: "Almacenamiento especializado de soportes físicos de información: cintas LTO, DAT y DLT, discos duros externos, CDs, DVDs y otros medios. Una necesidad crítica para la continuidad del negocio.",
    stats: [{ v: "Air gap", l: "copia desconectada de la red" }, { v: "24 h", l: "control de temperatura y humedad" }, { v: "GPS", l: "en vehículos propios de transporte" }],
    benefits: ["Copia de respaldo protegida frente a ransomware", "Pilar de su Plan de Recuperación ante Desastres (DRP)", "Condiciones ambientales controladas", "Trazabilidad completa de cada medio", "Rotaciones programadas con su equipo de TI"],
    steps: [
      { t: "Recolección", d: "En maletines herméticos e ignífugos con sellos numerados." },
      { t: "Transporte", d: "Vehículos propios monitoreados por GPS." },
      { t: "Registro", d: "Trazabilidad de cada medio por código de barras." },
      { t: "Resguardo", d: "Bóveda con control ambiental, blindaje y acceso restringido." },
      { t: "Rotación", d: "Cronogramas diarios, semanales o mensuales con su TI." },
    ],
    reasons: [
      { ic: "shield-lock", t: "Air gap frente a ransomware", d: "La nube no es infalible: el ransomware puede cifrar también sus réplicas. La copia física desconectada es su última línea de defensa." },
      { ic: "thermometer-half", t: "Infraestructura técnica", d: "Control automatizado de temperatura y humedad, blindaje electromagnético, extinción con agentes limpios y monitoreo perimetral." },
      { ic: "upc", t: "Cadena de custodia", d: "Sellos numerados, código de barras y acceso restringido a personal autorizado, en cumplimiento de la Ley 1581 de 2012." },
      { ic: "calendar-check", t: "Logística coordinada", d: "Rotaciones diarias, semanales o mensuales coordinadas con el equipo de TI de su empresa." },
    ],
    norms: ["Ley 1581 de 2012", "Plan de Recuperación ante Desastres (DRP)"],
  },
  "custodia-de-archivos": {
    tagline: "Su archivo protegido, disponible cuando lo necesite.",
    intro: "Resguardo, protección y gestión de los documentos físicos y digitales de su organización, garantizando seguridad, integridad y disponibilidad a lo largo de todo su ciclo de vida.",
    stats: [{ v: "24/7", l: "monitoreo y vigilancia con CCTV" }, { v: "Icontec", l: "estantería de carga pesada" }, { v: "Variable", l: "paga por el volumen que custodia" }],
    benefits: ["Convierte un costo fijo de espacio en uno variable y escalable", "Elimina gastos propios de personal, seguridad y mantenimiento", "Consulta física o electrónica cuando la necesite", "Eliminación certificada al cumplir los tiempos de retención"],
    steps: [
      { t: "Identificación", d: "Clasificación por tipo: contratos, facturas, correspondencia…" },
      { t: "Indexación", d: "Registro con metadatos: nombres, fechas, expedientes." },
      { t: "Embalaje", d: "Cajas o carpetas adecuadas, debidamente rotuladas." },
      { t: "Almacenamiento", d: "Control de temperatura, humedad y protección contra incendios." },
      { t: "Consulta", d: "Entrega física o electrónica, con auditoría y cumplimiento." },
    ],
    reasons: [
      { ic: "cash-coin", t: "Costo variable", d: "Paga por el volumen exacto de cajas, sin arrendamientos ni administración de espacio propio." },
      { ic: "camera-video", t: "Seguridad integral", d: "Prevención y control de incendios, monitoreo 24/7 y control ambiental preventivo." },
      { ic: "upc-scan", t: "Localización inmediata", d: "Cada caja y expediente se codifica con código de barras y se asocia al software de gestión." },
      { ic: "hourglass-split", t: "Ciclo de vida", d: "Parametrizamos vencimientos con sus TRD y le avisamos antes de la eliminación segura y certificada." },
    ],
    norms: ["Ley 594 de 2000", "Norma Icontec (estantería)", "Tablas de Retención Documental"],
  },
  "digitalizacion-de-documentos": {
    tagline: "Su archivo físico, digital y con valor legal.",
    intro: "Convertimos sus documentos físicos en archivos digitales con escáneres profesionales y software de procesamiento de imágenes: captura, optimización, indexación y OCR opcional.",
    stats: [{ v: "200–600", l: "dpi de resolución de escaneo" }, { v: "OCR", l: "PDF con texto buscable" }, { v: "Ley 527", l: "de 1999, valor legal" }],
    benefits: ["Integración con sistemas electrónicos (DMS / ECM)", "Acceso y consulta desde cualquier ubicación", "Respaldo del archivo físico en procesos legales", "Respaldos digitales y control de accesos", "Cumplimiento de normas de conservación documental"],
    steps: [
      { t: "Preparación", d: "Clasificación y retiro de grapas y clips." },
      { t: "Escaneo", d: "Equipos de alta capacidad, color, B/N o grises." },
      { t: "Procesamiento", d: "Recorte, alineación y limpieza de fondo." },
      { t: "OCR e indexación", d: "Texto buscable y metadatos de consulta." },
      { t: "Entrega", d: "PDF, TIFF o JPG; nube, USB o integración a su DMS." },
    ],
    reasons: [
      { ic: "patch-check", t: "Validez legal", d: "Digitalización con valor legal, regulada por la Ley 527 de 1999, el Decreto 1080 de 2015 y el AGN." },
      { ic: "speedometer2", t: "Eficiencia operativa", d: "Elimina tiempos muertos de búsqueda y entrega la información indexada por los criterios que su negocio necesita." },
      { ic: "funnel", t: "Presupuesto optimizado", d: "No digitalizamos el 100%: priorizamos con sus TRD lo de alta consulta y alto riesgo legal; lo demás, bajo demanda." },
    ],
    modes: [
      { ic: "building", t: "En nuestro centro de operación", d: "Con atención prioritaria para documentos urgentes." },
      { ic: "house-door", t: "In-house, en su empresa", d: "El documento no sale de sus instalaciones." },
    ],
    norms: ["Ley 527 de 1999", "Decreto 1080 de 2015", "Normas del AGN"],
  },
  "destruccion-de-documentos": {
    tagline: "Destruir no es desaparecer: es cerrar el ciclo con seguridad.",
    intro: "Un proceso seguro, trazable y alineado con la normativa colombiana para eliminar los documentos que ya cumplieron su tiempo de retención, con acta de eliminación y certificado de destrucción.",
    stats: [{ v: "100%", l: "del papel triturado va a economía circular" }, { v: "1983", l: "profesionalizando la destrucción documental" }, { v: "Certificado", l: "válido ante DIAN y superintendencias" }],
    benefits: ["Reduce costos de almacenar documentos sin valor", "Libera espacio físico", "Protege datos personales y la privacidad", "Aporta a indicadores ESG y a la huella de carbono"],
    steps: [
      { t: "Recolección", d: "Coordinada con su equipo." },
      { t: "Verificación", d: "El material corresponde a lo autorizado." },
      { t: "Acta de entrega", d: "Firma del acta y transporte seguro." },
      { t: "Trituración", d: "Mecánica industrial, imposible de reconstruir." },
      { t: "Certificado", d: "Con fechas, volumen, método y trazabilidad." },
    ],
    reasons: [
      { ic: "file-earmark-lock", t: "Protección de datos", d: "Trituración mecánica industrial que hace imposible leer la información; blindaje jurídico ante la SIC." },
      { ic: "file-earmark-check", t: "Soporte legal", d: "Basado en TRD o actas aprobadas por el comité de archivo; certificado válido ante DIAN, superintendencias o auditorías ISO." },
      { ic: "recycle", t: "Sostenibilidad", d: "El papel triturado se integra a cadenas de economía circular, reduciendo la huella de carbono." },
      { ic: "building", t: "De grandes empresas a micro", d: "Un servicio escalable, desde corporaciones hasta microempresas." },
    ],
    norms: ["Ley 594 de 2000", "Ley 1581 de 2012", "Normas del AGN"],
  },
  "microfilmacion-de-archivos": {
    tagline: "Proteja hoy la historia de su organización, más allá del tiempo.",
    intro: "Convertimos documentos físicos en imágenes reducidas sobre películas fotográficas especiales de 16 mm o 35 mm, consultables con lectores especializados y digitalizables después.",
    stats: [{ v: "+100", l: "años de vida útil" }, { v: "16 / 35", l: "milímetros, formatos de microfilme" }, { v: "Miles", l: "de páginas en un solo rollo" }],
    benefits: ["Conservación a largo plazo", "Un rollo contiene miles de páginas", "Formato no editable y resistente a ataques digitales", "Reconocido como copia fiel del original", "Respaldo físico que complementa la digitalización"],
    reasons: [
      { ic: "wifi-off", t: "Inmune a la obsolescencia", d: "No requiere software, hardware ni energía eléctrica para leerse, y no puede ser atacado por ciberdelincuentes." },
      { ic: "bank", t: "Validez jurídica", d: "Respaldado por el Decreto 2527 de 1950 y la Ley 594 de 2000; las copias certificadas tienen el mismo valor probatorio." },
      { ic: "intersect", t: "Estrategia híbrida", d: "Microfilme para la preservación legal y digitalización en paralelo para la consulta diaria." },
      { ic: "truck", t: "Laboratorio propio", d: "Recolección con transporte seguro y procesamiento en nuestro laboratorio de micrografía." },
    ],
    audience: { title: "Ideal para conservar", items: [
      { ic: "heart-pulse", t: "Historias clínicas", d: "" }, { ic: "journal-bookmark", t: "Registros notariales", d: "" },
      { ic: "briefcase", t: "Expedientes judiciales", d: "" }, { ic: "calculator", t: "Archivos contables y financieros", d: "" },
      { ic: "bank2", t: "Documentos históricos", d: "" }, { ic: "clock-history", t: "Conservación prolongada", d: "" },
    ] },
    norms: ["Decreto 2527 de 1950", "Ley 594 de 2000"],
  },
  "servicio-inhouse": {
    tagline: "Gestión documental eficiente, dentro de su propia empresa.",
    intro: "Externalice la operación documental sin perder el control: personal técnico de archivo trabaja en sus instalaciones, capacitado y supervisado por Transarchivos.",
    stats: [{ v: "40+", l: "años de metodologías probadas" }, { v: "SLA", l: "con informes mensuales de gestión" }, { v: "0", l: "pasivos laborales para su empresa" }],
    benefits: ["Organización, clasificación, foliación y rotulación", "Aplicación de Tablas de Retención Documental", "Inventarios físicos y digitales", "Preparación para digitalización, custodia o eliminación", "Acompañamiento en auditorías"],
    reasons: [
      { ic: "person-check", t: "Sin riesgo laboral", d: "Transarchivos es el empleador: selección, capacitación, reemplazos y evaluación de desempeño corren por nuestra cuenta." },
      { ic: "mortarboard", t: "Personal ya calificado", d: "Formado bajo lineamientos del AGN, con curva de aprendizaje mínima y KPIs medibles." },
      { ic: "arrow-repeat", t: "Continuidad garantizada", d: "Protocolo de contingencia ante incapacidades o ausencias, con personal capacitado en su cuenta." },
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
    tagline: "Un documento a tiempo puede marcar la diferencia.",
    intro: "Consulte, recupere o reciba sus documentos de forma urgente para procesos administrativos, legales, operativos o auditorías, sin demoras y con respaldo legal.",
    stats: [{ v: "Mismo día", l: "si se radica dentro del horario de atención" }, { v: "2", l: "modalidades: digital o física" }, { v: "100%", l: "trazable en cada etapa" }],
    benefits: ["Menores tiempos de respuesta", "Más eficiencia en auditorías y trámites legales", "Acceso seguro e inmediato a documentos críticos", "Soporte logístico sin interrumpir su operación"],
    reasons: [
      { ic: "lightning-charge", t: "Respuesta ante emergencias", d: "Un canal tipo «recuperación ante desastres logística»: localizamos el expediente y lo despachamos en tiempo récord." },
      { ic: "person-lock", t: "Gobernanza", d: "Protocolos de autorización con perfiles definidos (directores, representantes legales, cumplimiento) para evitar usos indebidos." },
      { ic: "signpost-split", t: "Cadena de custodia", d: "Registro, entrega y devolución documentados, con personal capacitado en el manejo y transporte." },
    ],
    modes: [
      { ic: "cloud-arrow-down", t: "Digitalización prioritaria bajo demanda", d: "La más rápida: escaneo en alta resolución y entrega electrónica cifrada." },
      { ic: "truck", t: "Despacho físico express", d: "Transporte prioritario del original, con firmas y sellos húmedos, bajo estrictas condiciones de seguridad." },
    ],
    norms: ["Ley 594 de 2000", "Ley 1581 de 2012", "Normas del AGN"],
  },
};
