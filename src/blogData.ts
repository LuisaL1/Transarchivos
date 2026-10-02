// Artículos del blog. Texto tomado de los archivos de la carpeta
// RecursosTransarchivos (Blog Junio 24, Agosto 3, Agosto 6 y Agosto 18).
import imgInteligencia from "@/imports/blog/inteligencia-documental.jpg";
import imgMido from "@/imports/blog/mido.jpg";
import imgCiclo1 from "@/imports/blog/ciclo-vida-1.jpg";
import imgCiclo2 from "@/imports/blog/ciclo-vida-2.jpg";
import imgEco1 from "@/imports/blog/economia-circular-1.jpg";
import imgEco2 from "@/imports/blog/economia-circular-2.jpg";

export type Item = string | { b: string; t: string };
export type Block =
  | { t: "h2"; text: string }
  | { t: "p"; text: string; lead?: string }
  | { t: "ul"; items: Item[] }
  | { t: "ol"; items: Item[] }
  | { t: "img"; src: string; alt: string }
  | { t: "table"; head: string[]; rows: string[][] };

export type Post = {
  slug: string;
  title: string;
  cat: string;
  date: string;
  cover: string;
  excerpt: string;
  blocks: Block[];
};

export const blogPosts: Post[] = [
  {
    slug: "mido-software-gestion-documental",
    title: "Mido – Software de gestión documental Transarchivos",
    cat: "Tecnología",
    date: "3 de agosto de 2026",
    cover: imgMido,
    excerpt:
      "¿Cómo protegemos la memoria de las empresas colombianas sin perder jamás un documento? Conozca Mido, el software propio con el que registramos y ubicamos cada expediente en tiempo real.",
    blocks: [
      { t: "h2", text: "¿Cómo protegemos la memoria de las empresas colombianas sin perder jamás un documento?" },
      {
        t: "p",
        text: "Para la alta dirección de cualquier organización, existe un activo invisible pero profundamente crítico: la información corporativa y la forma en que se custodia. A lo largo de los años, los contratos, expedientes, facturas y registros históricos se acumulan, convirtiéndose en el corazón operativo de la compañía. Sin embargo, delegar la custodia de este volumen de documentos suele despertar una inquietud natural en los directivos: ¿dónde está exactamente nuestra información y qué tan seguro es el control que se tiene sobre ella?",
      },
      {
        t: "p",
        text: "En Transarchivos entendemos que guardar un documento no es simplemente ocupar un espacio físico, sino asumir la continuidad operativa de nuestros clientes. Por eso, durante cuatro décadas (40 años) de trayectoria ininterrumpida hemos logrado indexar y gestionar con éxito millones de documentos y archivos de empresas colombianas, perfeccionando un modelo de gestión integral que combina la calidez de un servicio cercano con la precisión irrestricta de la tecnología.",
      },
      {
        t: "p",
        text: "El pilar fundamental que hace posible esta garantía de serenidad es Mido, nuestro propio software de gestión documental, una herramienta desarrollada internamente para resolver de manera simple lo que antes resultaba complejo. Su impacto en el día a día de las organizaciones es tangible y directo. Mido funciona como el gran corazón estructural de toda nuestra operación: desde el instante en que un expediente o una caja ingresa a nuestras instalaciones, el sistema registra su entrada, asigna una clasificación precisa y establece un mapeo detallado que nos permite saber, con absoluta certeza y en tiempo real, qué tenemos bajo nuestra custodia y en qué punto exacto se encuentra.",
      },
      {
        t: "p",
        text: "A través de esta plataforma exclusiva, nuestros clientes cuentan con la cobertura de un ciclo de gestión documental completo y personalizado, diseñado para acompañar la información en cada una de sus etapas. Este proceso abarca desde la clasificación inicial y la ordenación técnica del fondo documental, hasta el almacenamiento especializado en custodias de alta seguridad. Asimismo, contempla procesos de la administración del archivo central e histórico, la disposición final o el estado de destrucción segura bajo normatividad legal. La verdadera ventaja de contar con un sistema propio como Mido radica en que cada uno de estos pasos queda rigurosamente asentado en una bitácora digital. Un archivo en custodia jamás debe ser un repositorio inaccesible, sino un recurso disponible; por ello, ante una solicitud de consulta de documentos, el sistema ubica la coordenada exacta del documento para coordinar su entrega física o su acceso digital en tiempo récord, eliminando cualquier margen de pérdida.",
      },
      {
        t: "p",
        text: "Respaldar la toma de decisiones de la alta gerencia exige estándares que trasciendan lo convencional. Toda nuestra operación se rige bajo la Garantía de Calidad Transarchivos, un compromiso institucional fundado en procesos auditables, infraestructura especializada, cumplimiento normativo estricto y una política de cero pérdidas de información sostenida a lo largo de 40 años. Saber que millones de registros han pasado por nuestras manos sin descuidar ni un solo folio es la prueba más sólida de que somos el aliado más acertado y confiable para la gestión documental del sector empresarial en Colombia.",
      },
      { t: "h2", text: "¿Aún tiene dudas sobre la custodia de su información?" },
      {
        t: "p",
        text: "Si su compañía aún conserva archivos en instalaciones propias sin el control adecuado o si le preocupa dar el paso hacia la custodia externa por temor a perder visibilidad sobre sus documentos, le invitamos a comprobar de primera mano el estándar Transarchivos.",
      },
      {
        t: "p",
        text: "Déjenos mostrarle cómo el software Mido y nuestro equipo de especialistas pueden transformar el manejo de su información en un proceso ágil, seguro y 100% trazable. Contáctenos hoy mismo para agendar su diagnóstico documental y descubrir por qué las organizaciones más exigentes de Colombia confían en nosotros para proteger su activo más valioso.",
      },
    ],
  },
  {
    slug: "gestion-documental-economia-circular",
    title: "El ciclo de papel que no termina: ¿puede la gestión documental impulsar la economía circular en Colombia?",
    cat: "Sostenibilidad",
    date: "18 de agosto de 2026",
    cover: imgEco1,
    excerpt:
      "La masa de documentos que genera el sector empresarial suele verse como un residuo inevitable. Bajo un modelo sostenible, los archivos se transforman en un activo para reducir la huella de carbono.",
    blocks: [
      {
        t: "p",
        text: "Las empresas colombianas enfrentan una encrucijada operativa e impositiva: la necesidad de ser eficientes en costos mientras cumplen con compromisos cada vez más estrictos de sostenibilidad ambiental y la reglamentación del Gobierno Nacional sobre economía circular. En este escenario, la masa de documentos, expedientes e inventarios físicos que genera el sector empresarial suele verse como un simple requerimiento normativo o un residuo inevitable. Sin embargo, cuando los archivos corporativos se gestionan bajo un modelo sostenible, se transforman en un activo clave para reducir la huella de carbono y maximizar la eficiencia operativa.",
      },
      { t: "h2", text: "Análisis del cuestionamiento: la paradoja del papel corporativo" },
      {
        t: "p",
        text: "De acuerdo con el Ministerio de Ambiente y Desarrollo Sostenible de Colombia y los informes nacionales de economía circular, el consumo de papel y cartón en el sector productivo sigue representando una fracción sustancial de los residuos sólidos aprovechables. Producir una sola tonelada de papel virgen requiere aproximadamente:",
      },
      { t: "ul", items: ["17 árboles adultos.", "26.000 litros de agua.", "Más de 4.000 kilovatios-hora (kWh) de energía."] },
      {
        t: "p",
        text: "Para un país con más de 1.7 millones de empresas registradas, la acumulación ineficiente de documentos, la duplicidad de copias físicas y la disposición final sin criterios ecológicos no solo sobrecargan los rellenos sanitarios, sino que generan sobrecostos logísticos masivos por almacenamiento improductivo.",
      },
      {
        t: "p",
        text: "La economía circular plantea sustituir el modelo lineal (extraer, fabricar, usar y tirar) por uno regenerativo basado en reducir, reutilizar, digitalizar y reciclar. En la gestión documental B2B, este enfoque exige responder a tres dimensiones clave:",
      },
      {
        t: "ul",
        items: [
          { b: "Eficiencia en la fuente", t: "Minimización en la impresión de documentos no esenciales a través de herramientas de captura y flujos de trabajo digitales." },
          { b: "Ciclo de vida optimizado", t: "Custodia de expedientes en condiciones ambientales controladas que eviten el deterioro prematuro y alarguen la utilidad de la información sin consumo energético desmedido." },
          { b: "Disposición final segura y circular", t: "Destrucción confidencial certificada que reincorpore la pulpa de papel como materia prima a la cadena productiva industrial." },
        ],
      },
      { t: "h2", text: "La respuesta de Transarchivos: 40 años transformando custodia en sostenibilidad" },
      {
        t: "p",
        text: "La respuesta a esta problemática no radica únicamente en intentar eliminar el papel de la noche a la mañana (un objetivo poco realista para la mayoría de los sectores regulados en Colombia), sino en gobernar el ciclo completo de la información con responsabilidad ambiental y rigurosidad legal.",
      },
      {
        t: "p",
        text: "Durante más de 40 años, Transarchivos ha actuado como un aliado estratégico de las empresas colombianas, implementando un Programa de Gestión Documental (PGD) diseñado para integrar la economía circular en cada fase del tratamiento de la información:",
      },
      {
        t: "ul",
        items: [
          { b: "Digitalización estratégica", t: "Procesamiento y captura de datos que reduce la necesidad de duplicación impresa, acelerando la transición hacia una oficina optimizada." },
          { b: "Custodia e inventarios optimizados", t: "Centros de custodia diseñados para maximizar la densidad de almacenamiento, reduciendo la huella territorial e hídrica asociada a la infraestructura de custodia interna." },
          { b: "Destrucción segura con enfoque circular", t: "Al cumplirse el ciclo de vida documental según las tablas de retención (TRD) autorizadas por ley, los documentos son sometidos a triturado industrial confidencial. La totalidad del residuo fibroso se reinyecta a la industria papelera nacional como material reciclado, cerrando completamente el ciclo de producción." },
        ],
      },
      { t: "img", src: imgEco2, alt: "Cajas de archivo Transarchivos apiladas en el centro de custodia" },
      {
        t: "p",
        text: "A través del manejo de miles de empresas e instituciones en todo el país, Transarchivos ha garantizado que el material documental dado de baja no termine en vertederos, permitiendo la conservación de miles de hectáreas forestales y reduciendo significativamente el consumo de agua en los procesos industriales del país.",
      },
      { t: "h2", text: "Optimice sus recursos hoy mismo" },
      {
        t: "p",
        text: "Un Programa de Gestión Documental estructurado no solo asegura el cumplimiento de las normativas del Archivo General de la Nación (AGN) y las métricas ESG (Gobernanza Ambiental y Social), sino que libera capital operativo y espacio físico en su organización. Haga que la información de su compañía responda a los desafíos del mercado actual con el respaldo de más de cuatro décadas de experiencia comprobada por parte de Transarchivos.",
      },
      {
        t: "p",
        text: "Descubra cómo implementar un Programa de Gestión Documental Sostenible para su empresa: visite nuestra sección de servicios en www.transarchivos.com y solicite una consultoría especializada con nuestro equipo de archivistas expertos.",
      },
    ],
  },
  {
    slug: "ciclo-de-vida-documental-sostenibilidad",
    title: "El ciclo de vida documental y la sostenibilidad ambiental: cómo reducir la huella de carbono empresarial en Colombia",
    cat: "Sostenibilidad",
    date: "6 de agosto de 2026",
    cover: imgCiclo1,
    excerpt:
      "En la era de la transformación digital y los criterios ESG, la gestión de archivos dejó de ser un simple asunto de almacenamiento físico para convertirse en un pilar estratégico de sostenibilidad y cumplimiento corporativo.",
    blocks: [
      {
        t: "p",
        text: "En la era de la transformación digital y los criterios ESG (Ambientales, Sociales y de Gobernanza), la gestión de archivos dejó de ser un simple asunto de almacenamiento físico para convertirse en un pilar estratégico de sostenibilidad y cumplimiento corporativo.",
      },
      {
        t: "p",
        text: "Cada hoja impresa, expediente mal ubicado o servidor saturado genera un impacto directo en el medio ambiente y en las finanzas de su organización. Implementar una correcta gestión del ciclo de vida de un documento bajo parámetros ecológicos es hoy una decisión clave para modernizar procesos, cumplir con la ley y proteger el planeta.",
      },
      { t: "h2", text: "El reto en Colombia: el impacto oculto del papel en las empresas" },
      {
        t: "p",
        text: "De acuerdo con cifras oficiales de la Cuenta Satélite Ambiental del DANE y reportes del sector industrial en Colombia, en el país se generan más de 11 millones de toneladas de residuos al año, de los cuales solo se aprovecha o recicla cerca del 17%. En el entorno de oficina, un colaborador promedio puede consumir miles de hojas de papel al año, de las cuales un porcentaje significativo termina archivado sin control o desechado de forma inadecuada.",
      },
      {
        t: "p",
        text: "Este consumo no solo se traduce en costos operativos elevados por compras de insumos y alquiler de metros cuadrados innecesarios; también incrementa la huella de carbono por transporte, almacenamiento y disposición final de documentos.",
      },
      { t: "h2", text: "Marco legal y ambiental: respaldo normativo para su empresa" },
      {
        t: "p",
        text: "Para garantizar un manejo documental eficiente y ecológico, las organizaciones en Colombia deben alinear sus procesos a un marco legal e institucional claro:",
      },
      {
        t: "ul",
        items: [
          { b: "Ley 594 de 2000 (Ley General de Archivos)", t: "Dictada por el Archivo General de la Nación (AGN), establece las pautas obligatorias para categorizar, conservar y gestionar los documentos públicos y privados con funciones públicas en sus distintas fases de vida." },
          { b: "Norma ISO 14001:2026", t: "La actualización del estándar internacional para Sistemas de Gestión Ambiental exige a las empresas controlar y reducir el impacto ambiental de todos sus procesos operativos, incluyendo la administración de recursos de oficina y el tratamiento de residuos." },
        ],
      },
      {
        t: "p",
        text: "Cumplir con la normatividad no solo evita sanciones legales; asegura que cada documento cumpla su ciclo natural sin generar sobrecostos ni desperdicios.",
      },
      { t: "h2", text: "Las 3 fases del ciclo de vida documental con enfoque verde" },
      {
        t: "p",
        text: "A través de la gestión documental especializada, un archivo transita por tres etapas clave, optimizando recursos y garantizando la economía circular:",
      },
      { t: "img", src: imgCiclo2, alt: "Infografía: ciclo de vida documental con enfoque ambiental — fase activa, semiactiva e inactiva" },
      {
        t: "p",
        lead: "1. Fase activa (archivo de gestión) — creación y control digital",
        text: "Es el momento en que los documentos se crean o reciben para el trámite diario de la compañía.",
      },
      {
        t: "ul",
        items: [
          { b: "El problema", t: "Impresiones excesivas, duplicados innecesarios y desorden en el flujo de trabajo." },
          { b: "La solución Transarchivos", t: "Implementamos soluciones de captura, indexación y respaldo en la nube. Esto permite digitalizar expedientes masivamente y trabajar con documentos electrónicos, reduciendo hasta en un 40% el uso innecesario de papel desde el inicio." },
        ],
      },
      {
        t: "p",
        lead: "2. Fase semiactiva (archivo central) — custodia y almacenamiento eficiente",
        text: "Corresponde a la documentación que pierde frecuencia de consulta diaria, pero debe conservarse durante varios años por requisitos tributarios, comerciales o legales.",
      },
      {
        t: "ul",
        items: [
          { b: "El problema", t: "Oficinas saturadas con cajas de papel, lo que exige espacio útil que requiere iluminación, aire acondicionado y mantenimiento continuo." },
          { b: "La solución Transarchivos", t: "Trasladamos sus archivos físicos a nuestros centros especializados de custodia segura. Liberamos hasta el 25% del espacio útil de sus oficinas, reduciendo el consumo energético y optimizando la logística de consulta gracias a nuestro servicio de archivo digitalizado bajo demanda." },
        ],
      },
      {
        t: "p",
        lead: "3. Fase inactiva (archivo histórico o disposición final) — destrucción ecológica o conservación",
        text: "Se alcanza cuando se cumple el tiempo de retención fijado en la Tabla de Retención Documental (TRD).",
      },
      {
        t: "ul",
        items: [
          { b: "El problema", t: "La quema o el descarte de expedientes en basura común, lo que expone datos confidenciales de la empresa y contamina el medio ambiente." },
          { b: "La solución Transarchivos", t: "Ejecutamos la destrucción confidencial y segura del papel mediante procesos mecánicos autorizados, entregando la materia prima picada a la industria papelera para su reciclaje certificado. Si el archivo posee valor histórico, garantizamos su conservación técnica y definitiva." },
        ],
      },
      { t: "h2", text: "El valor diferencial de Transarchivos: liderazgo en custodia y destrucción ecológica" },
      {
        t: "p",
        text: "Durante 40 años, Transarchivos ha sido el aliado estratégico de miles de empresas colombianas en la custodia, organización y protección de sus activos de información. Nuestro compromiso va más allá de guardar cajas: lideramos la transición hacia archivos sostenibles. Contamos con infraestructura de custodia de máxima seguridad, tecnologías avanzadas de indexación y un modelo de destrucción verde que garantiza la reincorporación del papel destruido a cadenas de economía circular, evitando toneladas de emisiones de CO₂.",
      },
      {
        t: "p",
        text: "Tome el control de sus documentos y reduzca su huella de carbono. La gestión documental eficiente no es un gasto, es una inversión en productividad, seguridad jurídica y responsabilidad ambiental para su compañía. Permita que los expertos de Transarchivos, respaldados por 40 años de experiencia en el mercado colombiano, diseñen un plan a la medida de sus necesidades.",
      },
    ],
  },
  {
    slug: "inteligencia-documental-engranaje-maestro",
    title: "¿Por qué la Inteligencia Documental es el engranaje maestro de las empresas eficientes?",
    cat: "Inteligencia documental",
    date: "24 de junio de 2026",
    cover: imgInteligencia,
    excerpt:
      "Es lunes a las 8:00 a.m. y una auditoría no programada toca a la puerta. Para responder solo necesita tres documentos clave… ¿cuánto tardaría en encontrarlos?",
    blocks: [
      {
        t: "p",
        text: "Imagine esto por un segundo: es lunes a las 8:00 a.m. Una auditoría no programada toca a la puerta de su empresa o peor aún, surge una oportunidad millonaria de licitación que cierra en 24 horas. Para responder, solo necesita tres documentos clave. ¡Tres!",
      },
      {
        t: "p",
        text: "En la teoría parece fácil. En la práctica, comienza una carrera contrarreloj donde dos ejecutivos buscan en carpetas digitales desordenadas, un asistente indaga en cajas de archivo físico en la bodega y el director operativo intenta recordar cuál de las siete versiones guardadas en su correo es la versión final aprobada.",
      },
      { t: "p", text: "El resultado: horas perdidas, frustración acumulada, estrés al límite y con frecuencia, una oportunidad que se evapora." },
      {
        t: "p",
        text: "Esta escena (que se repite a diario en miles de entidades, startups y grandes corporativos) revela un síntoma silencioso pero destructivo: la falta de Inteligencia Documental.",
      },
      { t: "h2", text: "¿Qué es exactamente la Inteligencia Documental y por qué no es “solo archivar documentos”?" },
      {
        t: "p",
        text: "Durante décadas, la gestión documental se vio erróneamente como un mal necesario: ese cuarto oscuro al fondo de la oficina lleno de carpetas empantanadas y cajas viejas o una carpeta en la nube llamada “Documentos Varios 2024”.",
      },
      {
        t: "p",
        text: "Hoy, ese enfoque está extinto. La Inteligencia Documental es la evolución estratégica de la custodia e información. Consiste en la capacidad técnica, tecnológica y operativa de capturar, procesar, clasificar, proteger y acceder a la información de una organización de manera precisa y al instante.",
      },
      {
        t: "p",
        text: "No se trata únicamente de guardar papeles o digitalizar archivos en formato PDF; se trata de convertir el flujo documental en datos estructurados al servicio de la toma de decisiones.",
      },
      { t: "h2", text: "El efecto engranaje: la sinergia entre áreas" },
      {
        t: "p",
        text: "Una empresa funciona exactamente como un reloj de precisión. Cuando la Inteligencia Documental está instalada en el ADN corporativo, actúa como el lubricante que permite que cada área gire en perfecta armonía:",
      },
      {
        t: "ul",
        items: [
          { b: "Finanzas y Contabilidad", t: "Reduce radicalmente los tiempos de respuesta ante revisiones fiscales, auditorías internas o cuadres de cuentas." },
          { b: "Gestión Humana", t: "Mantiene la trazabilidad exacta de historias laborales, contratos y certificaciones, protegiendo a la entidad de contingencias legales." },
          { b: "Área Legal y Cumplimiento", t: "Garantiza el rigor normativo, el respeto a la protección de datos personales y la aplicación estricta de las Tablas de Retención Documental (TRD)." },
          { b: "Operaciones y Ventas", t: "Agiliza la firma de contratos, la consulta de antecedentes comerciales y la aprobación instantánea de proyectos." },
        ],
      },
      {
        t: "p",
        lead: "El impacto real:",
        text: "Cuando la información fluye sin fricción, las decisiones directivas pasan de tomarse en días a tomarse en minutos.",
      },
      { t: "h2", text: "El costo invisible de improvisar: ahorro de tiempo y dinero" },
      {
        t: "p",
        text: "A menudo se piensa que implementar soluciones formales de administración documental representa un gasto. La realidad es que el verdadero costo está en la improvisación.",
      },
      {
        t: "table",
        head: ["Dimensión", "Con información desorganizada", "Con Inteligencia Documental"],
        rows: [
          ["Tiempo de búsqueda", "Entre 18 y 25 minutos promedio por expediente.", "Búsqueda y hallazgo en cuestión de segundos."],
          ["Costos operativos", "Duplicidad de documentos, almacenamiento físico ineficiente, multas normativas.", "Optimización de espacios, digitalización estratégica y cero sanciones por incumplimiento."],
          ["Continuidad del negocio", "Riesgo alto de pérdida por incidentes o fuga de información.", "Custodia segura, copias de respaldo e indexación técnica."],
        ],
      },
      {
        t: "p",
        text: "Ahorrar tiempo en la consulta documental se traduce directamente en horas de trabajo de alto valor recuperadas para sus gerentes y colaboradores. Y en el mundo B2B, el tiempo recuperado es margen de rentabilidad directo.",
      },
      { t: "h2", text: "El factor humano: por qué se necesita personal calificado" },
      {
        t: "p",
        text: "La tecnología es un aliado extraordinario (hoy las soluciones impulsadas por inteligencia artificial transforman la manera en que procesamos información), pero no funciona en el vacío. Para que la Inteligencia Documental sea sostenible en el tiempo, se requiere del liderazgo de profesionales de la archivística y la gestión documental.",
      },
      { t: "p", text: "Disponer de personal calificado garantiza:" },
      {
        t: "ol",
        items: [
          { b: "Criterio técnico", t: "La correcta estructuración, clasificación y valoración del patrimonio documental de la empresa." },
          { b: "Seguridad y confidencialidad", t: "Protocolos claros para controlar quién accede a qué información y cuándo." },
          { b: "Paso firme hacia la transformación digital", t: "Un proceso ordenado donde la digitalización responda a necesidades operativas reales y no al simple impulso de escanear sin metodología." },
        ],
      },
      { t: "h2", text: "¿Está su organización lista para dar el siguiente paso?" },
      {
        t: "p",
        text: "Estar preparado no es una cuestión de suerte, es una decisión gerencial. La Inteligencia Documental no es un lujo reservado para multinacionales; es la columna vertebral que le permite a cualquier empresa, grande o en expansión, construir bases sólidas para escalar con seguridad.",
      },
      {
        t: "p",
        text: "En Transarchivos, acompañamos a las organizaciones a transformar la gestión de sus documentos empresariales en una verdadera ventaja competitiva. Desde la custodia física especializada y la aplicación técnica de herramientas de organización, hasta procesos avanzados de digitalización e integración, estructuramos soluciones a la medida de los retos de su sector.",
      },
      {
        t: "p",
        text: "Haga que los engranajes de su compañía funcionen con la precisión que exige el mercado actual.",
      },
      { t: "h2", text: "¿Hablamos de la gestión documental de su empresa?" },
      {
        t: "p",
        text: "Descubra cómo potenciar la eficiencia operativa de su entidad con el respaldo de expertos en soluciones documentales empresariales. Contacte hoy al equipo de especialistas de Transarchivos y diseñemos juntos la estrategia adecuada para su organización.",
      },
    ],
  },
];

export function readMinutes(p: Post) {
  const words = p.blocks
    .map(b => {
      if (b.t === "h2") return b.text;
      if (b.t === "p") return (b.lead ?? "") + " " + b.text;
      if (b.t === "ul" || b.t === "ol") return b.items.map(i => (typeof i === "string" ? i : i.b + " " + i.t)).join(" ");
      if (b.t === "table") return [...b.head, ...b.rows.flat()].join(" ");
      return "";
    })
    .join(" ")
    .split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.round(words / 200));
}
