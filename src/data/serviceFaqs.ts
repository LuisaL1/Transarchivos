// Preguntas frecuentes de cada servicio. Fuente: "Preguntas frecuentes para
// servicios Pag web" (RecursosTransarchivos/, oct. 2026), transcritas tal cual.
// Se muestran en la página de cada servicio (/servicios/<slug>#preguntas), las
// responde Joel y las encuentra el buscador. Cada respuesta es una lista de
// párrafos; los que empiezan con "1. ", "2. "… se muestran como lista numerada.
export type ServiceFaq = { q: string; a: string[] };

export const SERVICE_FAQS: Record<string, ServiceFaq[]> = {
  // Servicio Levantamiento de inventario
  "levantamiento-de-inventario": [
    { q: "¿Cuál es el impacto financiero real y el retorno de inversión para mi empresa al contratar un Levantamiento de Inventario Documental?",
      a: [
        "Un archivo sin inventariar es un centro invisible de costos y un multiplicador de ineficiencias. En Transarchivos demostramos el retorno de inversión a través de tres pilares inmediatos:",
        "1. Optimización de espacio: El levantamiento nos permite identificar con precisión técnica qué documentos están duplicados o ya cumplieron su ciclo de vida legal, liberando metros cuadrados de oficinas de alto costo.",
        "2. Mitigación de tiempos muertos: Un ejecutivo o colaborador pierde un promedio de hasta el 20% de su jornada laboral buscando información desorganizada. Garantizamos que toda su información esté al alcance de su mano de forma rápida y sin complicaciones.",
        "3. Prevención de contingencias legales: Evita costosas multas o la pérdida de litigios jurídicos y comerciales por no encontrar un documento crítico en el momento requerido. No es un gasto; es un blindaje operativo y financiero.",
      ] },
    { q: "¿Cómo me garantiza Transarchivos que el levantamiento de inventario cumple con las normativas legales vigentes en Colombia (como la Ley 594 de 2000)?",
      a: [
        "En Colombia, la gestión documental está estrictamente regulada por el Archivo General de la Nación (AGN) y la Ley 594 de 2000. Transarchivos no realiza un simple conteo físico; estructuramos e identificamos la información de acuerdo con las más rigurosas normas archivísticas nacionales.",
        "Durante el proceso, clasificamos los expedientes determinando de forma exacta su volumen, estado de conservación y tipología documental. Esto permite alimentar directamente los instrumentos archivísticos obligatorios de su organización (como las T ablas de Retención Documental - TRD), asegurando que su empresa esté 100% blindada ante auditorías de entes de control, entes certificadores (ISO) o requerimientos de las superintendencias.",
      ] },
    { q: "¿Qué protocolos de seguridad y confidencialidad implementa Transarchivos al manipular información de alta sensibilidad corporativa durante el proceso?",
      a: [
        "La seguridad de la información es nuestro compromiso principal. En Transarchivos ejecutamos el levantamiento de inventario bajo estrictas cadenas de custodia y protocolos de confidencialidad respaldados por acuerdos legales (NDA) con nuestro personal altamente calificado. Cada paso del proceso (desde la identificación en el sitio hasta el registro en nuestras bases de datos) es trazable. Además, durante el levantamiento realizamos una evaluación del estado físico del material, detectando de forma preventiva riesgos de deterioro biológico, humedad o afectaciones estructurales, sugiriendo medidas inmediatas de restauración o digitalización para garantizar la total continuidad y preservación del patrimonio documental de su negocio.",
      ] },
    { q: "¿Es el levantamiento de inventario un requisito indispensable si mi objetivo final como organización es la digitalización total de los archivos?",
      a: [
        "Definitivamente sí. Digitalizar un archivo desorganizado es simplemente trasladar el caos físico al entorno digital, lo cual duplica los costos y disminuye la eficiencia. El levantamiento de inventario es el pilar fundamental y el primer paso obligatorio hacia una transformación digital exitosa. Al identificar, clasificar y depurar los documentos con Transarchivos, definimos con exactitud qué información es crítica para ser indexada y digitalizada de manera inteligente. Esto optimiza el presupuesto de digitalización, asegurando que su empresa invierta solo en la información que genera valor estratégico y permitiendo que los motores de búsqueda encuentren los archivos de forma inmediata en el futuro ecosistema digital de la compañía.",
      ] },
  ],
  // Servicio Programa de Gestión Documental (PGD)
  "programa-de-gestion-documental": [
    { q: "¿Cuál es el riesgo legal y sancionatorio real para mi empresa si no contamos con un Programa de Gestión Documental (PGD)?",
      a: [
        "En Colombia, el PGD es un instrumento archivístico obligatorio por ley para las entidades públicas y aquellas privadas que cumplen funciones públicas o están bajo la vigilancia de ciertas superintendencias, alineado con la Ley 594 de 2000 y el Decreto 1080 de 2015. No contar con él o tener un documento desactualizado, expone a la alta gerencia a sanciones económicas e investigaciones por parte del Archivo General de la Nación (AGN) o las superintendencias competentes. Transarchivos actúa como su aliado estratégico y escudo normativo.",
        "Diseñamos, formulamos e implementamos el PGD a la medida de su organización, asegurando el cumplimiento riguroso de la normatividad vigente. Esto transforma un riesgo legal latente en un marco de cumplimiento sólido que supera con éxito cualquier auditoría gubernamental.",
      ] },
    { q: "¿De qué manera el PGD diseñado por Transarchivos mejora la productividad en todas las áreas de la compañía?",
      a: [
        "El PGD de Transarchivos funciona como el \"manual de operaciones definitivo\" para la información de su empresa. Su objetivo es unificar los criterios para la producción, recepción, distribución, consulta, retención y disposición final de todos los documentos, tanto físicos como electrónicos. Al eliminar la discrecionalidad de cada empleado o área, estandarizamos los flujos de trabajo. Esto se traduce en una reducción drástica de tiempos de respuesta, flujos de información más ágiles entre departamentos y la eliminación de reprocesos por documentos perdidos o mal clasificados. El PGD no frena la operación; la acelera bajo un marco de orden y eficiencia.",
      ] },
    { q: "¿Cómo impacta la implementación a mediano y largo plazo del PGD en la reducción de costos operativos de la organización?",
      a: [
        "El PGD es una de las inversiones con mayor impacto en la eficiencia de costos a largo plazo. Su implementación detiene el crecimiento descontrolado de los archivos mediante la aplicación de políticas claras de eliminación segura y oportuna de documentos que ya perdieron vigencia legal y administrativa.",
        "Esto genera un ahorro directo en la compra de insumos, almacenamiento físico y servidores digitales. Además, al integrar principios de sostenibilidad, el PGD optimiza el uso de recursos y reduce la huella de carbono de la empresa al racionalizar la producción de papel, alineando a la compañía con las tendencias globales de responsabilidad ambiental y eficiencia corporativa.",
      ] },
    { q: "¿Cuál es la importancia del PGD en nuestra estrategia de transformación digital y en la adopción de nuevas tecnologías de información?",
      a: [
        "Un software de gestión documental sin un PGD es solo un contenedor tecnológico vacío y desordenado. El PGD de Transarchivos establece las reglas de negocio, la arquitectura de la información y las políticas de seguridad que el software debe ejecutar.",
        "Definimos el ciclo de vida del documento electrónico, las firmas digitales, los metadatos necesarios y los esquemas de preservación a largo plazo para asegurar que la información digital mantenga su validez legal en el tiempo. Transarchivos garantiza que su transición hacia la oficina cero papel o modelos híbridos sea jurídicamente válida, tecnológicamente viable y operativamente eficiente.",
      ] },
  ],
  // Servicio de Almacenamiento de Medios Magnéticos
  "custodia-de-medios-magneticos": [
    { q: "Si ya contamos con copias de seguridad en la nube, ¿cuál es el valor estratégico y de continuidad del negocio que aporta la custodia física de medios magnéticos con Transarchivos?",
      a: [
        "La nube es una excelente herramienta, pero no es infalible ni inmune a ciberataques sofisticados (como el ransomware, que a menudo encripta tanto los sistemas locales como sus réplicas en la nube). La custodia de medios magnéticos (cintas LTO, discos duros, servidores de respaldo) ofrece lo que en ciberseguridad se conoce como Air Gap (brecha de aire): una copia de seguridad física tradicional, totalmente desconectada de la red e inaccesible para los hackers.",
        "Transarchivos se convierte en el pilar de su Plan de Recuperación ante Desastres (DRP). En caso de un colapso tecnológico o un secuestro de datos, garantizamos que su empresa cuente con un respaldo físico idéntico, seguro y fuera de línea para restaurar la operación en el menor tiempo posible, protegiendo la supervivencia financiera y reputacional de su organización.",
      ] },
    { q: "¿Qué especificaciones técnicas e infraestructura especializada posee Transarchivos para garantizar que los medios magnéticos no sufran degradación física o pérdida de datos durante su almacenamiento?",
      a: [
        "Garantizamos un control automatizado y estricto de temperatura y humedad relativa las 24 horas del día para evitar la degradación del soporte magnético. Además, nuestras bóvedas cuentan con blindaje contra campos electromagnéticos, sistemas de extinción de incendios mediante agentes limpios (que apagan el fuego sin usar agua ni dañar los componentes electrónicos) y monitoreo perimetral constante. Su información se preserva en un entorno óptimo que asegura su perfecta lectura al momento de ser requerida.",
      ] },
    { q: "¿Cómo garantiza Transarchivos la seguridad, confidencialidad y estricta cadena de custodia durante el transporte y almacenamiento de nuestros medios magnéticos?",
      a: [
        "En Transarchivos entendemos que custodiamos el activo más crítico de su empresa. Por ello, implementamos una cadena de custodia hermética y auditable:",
        "1. Transporte Blindado y Controlado: Los medios se transportan en maletines de seguridad herméticos, ignífugos y con sellos de seguridad numerados, utilizando vehículos propios de la compañía monitoreados por GPS.",
        "2. Trazabilidad Total: Cada movimiento, desde la recolección en sus instalaciones hasta su ubicación en nuestra bóveda, se registra en nuestro sistema mediante código de barras, generando un historial de auditoría transparente.",
        "3. Control de Acceso Riguroso: Solo el personal expresamente autorizado por la alta gerencia de su empresa, y tras una estricta validación de identidad, puede solicitar la entrega o rotación de los medios, asegurando el cumplimiento total de la Ley 1581 de 2012 (Protección de Datos Personales).",
      ] },
    { q: "¿Cómo maneja Transarchivos la logística de rotación periódica de los medios magnéticos y bajo qué ventanas de atención programada operan?",
      a: [
        "Nuestra operación logística está estructurada para integrarse de manera ordenada y predecible con las rutinas de su equipo de TI. Establecemos cronogramas de rotación programados (diarios, semanales o mensuales) que se ejecutan dentro de nuestra jornada de atención.",
        "Nuestro personal realiza el intercambio de medios de forma ágil y sistemática directamente en sus sedes, las solicitudes de retiro, entrega o rotación se coordinan previamente con nuestro equipo de servicio al cliente. De esta manera, aseguramos que cuando su equipo técnico requiera un medio magnético para una auditoría, prueba de restauración o actualización programada, este sea entregado bajo estrictas medidas de seguridad dentro de los tiempos estipulados.",
      ] },
  ],
  // Servicio Custodia Documental
  "custodia-de-archivos": [
    { q: "¿Cuál es el beneficio económico real de tercerizar la custodia de nuestros archivos físicos con Transarchivos en lugar de mantenerlos en nuestras propias instalaciones?",
      a: [
        "Mantener un archivo inactivo en oficinas comerciales es uno de los costos ocultos más ineficientes para una empresa. Transarchivos le permite liberar valiosos metros cuadrados de infraestructura de alto costo para destinarlos al core business de su negocio (puestos de trabajo, salas de juntas o áreas comerciales).",
        "Al externalizar la custodia con nosotros, usted transforma un costo fijo de arrendamiento y administración de espacio en un costo variable y escalable: solo paga por el volumen exacto de cajas que tiene en custodia. Además, elimina los gastos asociados a personal dedicado al archivo, sistemas de seguridad y mantenimiento de infraestructura física.",
      ] },
    { q: "¿Qué condiciones de seguridad, infraestructura y prevención de riesgos ofrece Transarchivos para garantizar la protección absoluta de documentos físicos?",
      a: [
        "En Transarchivos protegemos su patrimonio documental bajo los más estrictos estándares de seguridad industrial y física. Nuestras instalaciones cuentan con:",
        "1. Sistemas de prevención y control de incendios",
        "2. Monitoreo y seguridad 24/7",
        "3. Control ambiental preventivo",
      ] },
    { q: "¿Cómo garantizan la rápida localización de un documento específico cuando lo requiero y en qué condiciones de servicio opera su entrega?",
      a: [
        "Cada caja y expediente que ingresa a Transarchivos es codificado mediante sistemas inteligentes de códigos de barras y asociado a nuestro software de gestión.",
        "Cuando su empresa requiera una consulta, nuestro equipo procesará la solicitud de manera eficiente. Usted puede solicitar la consulta física del documento (con transporte seguro hasta sus oficinas) o para mayor agilidad, solicitar un Servicio inmediato donde escaneamos el documento requerido y se lo enviamos de forma electrónica y segura.",
      ] },
    { q: "¿De qué manera nos ayuda Transarchivos a controlar el crecimiento del archivo y a gestionar la eliminación legal de los documentos que ya vencieron?",
      a: [
        "Trabajamos de la mano con los instrumentos archivísticos de su empresa (como las T ablas de Retención Documental - TRD) para parametrizar las fechas de vencimiento legal y administrativo de sus archivos. Transarchivos le notificará formalmente para proceder, bajo su estricta autorización, a la eliminación segura y certificada de los documentos.",
      ] },
  ],
  // Servicio de Digitalización documental
  "digitalizacion-de-documentos": [
    { q: "¿Cómo garantiza Transarchivos que los documentos digitalizados tengan plena validez legal y jurídica ante entes de control y procesos judiciales en Colombia?",
      a: [
        "En Colombia, la digitalización no es un simple escaneo de imágenes; está rigurosamente regulada por la Ley 527 de 1999 (Comercio Electrónico), el Decreto 1080 de 2015 y las directrices del Archivo General de la Nación (AGN).",
        "Transarchivos ejecuta proyectos de digitalización con valor legal. Esto significa que aplicamos protocolos técnicos estrictos de autenticidad, integridad y disponibilidad. Aseguramos la correcta indexación de metadatos y, si la regulación de su sector lo exige.",
      ] },
    { q: "¿De qué manera la digitalización documental optimiza los tiempos de respuesta operativos y el acceso a la información dentro de la empresa?",
      a: [
        "Transformar sus documentos físicos en activos digitales estructurados, eliminamos los tiempos muertos de búsqueda y la dependencia de un espacio físico. Transarchivos entrega la información organizada e indexada por los criterios clave que su negocio necesite (ej. número de identificación, fecha, tipo de contrato, nombre de cliente). Esto permite que, a través de su sistema de gestión documental o el software dispuesto, sus colaboradores localicen los documentos de forma ágil.",
      ] },
    { q: "¿Debemos digitalizar el 100% de los archivos de la compañía? ¿Cómo nos ayuda Transarchivos a optimizar el presupuesto de este proyecto?",
      a: [
        "En Transarchivos asesoramos a la alta gerencia para aplicar una digitalización inteligente y costo- eficiente. Antes de encender un escáner, analizamos el ciclo de vida de su información utilizando instrumentos como las Tablas de Retención Documental (TRD). Recomendamos digitalizar de forma prioritaria los documentos de alta consulta operativa, los de conservación permanente y aquellos de alto riesgo legal.",
        "Para el archivo histórico o de baja consulta, implementamos nuestro modelo de Custodia Física con Digitalización bajo Demanda, donde el documento solo se digitaliza si el cliente lo solicita. De esta manera, optimizamos al máximo su presupuesto, invirtiendo solo en la información que genera valor real para el negocio.",
      ] },
    { q: "¿Cómo se garantiza la seguridad de los documentos durante el proceso de digitalización y qué alternativas ofrecen para no interrumpir nuestra operación diaria?",
      a: [
        "En Transarchivos mitigamos el riesgo operativo mediante dos modalidades adaptables y una estricta cadena de custodia, ofrecemos:",
        "1. Digitalización Documental (En nuestro centro de operación): Transportamos el archivo bajo estrictos protocolos de seguridad y códigos de barras a nuestras instalaciones controladas. Si durante el proceso su empresa requiere un documento urgente, nuestro equipo lo ubica en la línea de producción de forma prioritaria, lo digitaliza y se lo envía electrónicamente.",
        "2. Digitalización In-house (En sus instalaciones): Desplazamos nuestro personal experto y tecnología especializada directamente a su sede. De esta forma, los documentos nunca salen de su empresa y su equipo puede consultarlos de inmediato si es necesario.",
      ] },
  ],
  // Servicio Destrucción Legal de Documentos
  "destruccion-de-documentos": [
    { q: "¿Cómo garantiza Transarchivos el cumplimiento de la Ley de Protección de Datos Personales (Ley 1581 de 2012) durante el proceso de eliminación de archivos?",
      a: [
        "Transarchivos mitiga este riesgo de forma absoluta mediante un proceso cerrado de destrucción segura y confidencial. Desde el momento en que se recolectan los documentos en sus sedes, estos entran en una estricta cadena de custodia con personal autorizado y vehículos controlados. El material es sometido a un proceso de trituración mecánica industrial que hace imposible la reconstrucción o lectura de la información, garantizando que los datos confidenciales de sus clientes, empleados y aliados jamás queden expuestos, blindando jurídicamente a su empresa ante la SIC y otros entes de control.",
      ] },
    { q: "¿Qué soporte legal entrega Transarchivos para certificar ante futuras auditorías que un documento fue destruido de manera legítima?",
      a: [
        "En la gestión documental profesional, lo que no está registrado y certificado, no existe jurídicamente. Transarchivos no realiza destrucciones arbitrarias; el proceso se ejecuta con base en las Tablas de Retención Documental (TRD) o las actas de eliminación aprobadas por el comité de archivo de su compañía. Una vez finalizado el procedimiento, Transarchivos emite un Certificado de Destrucción Legal.",
        "Este documento técnico y jurídico especifica las fechas, el volumen, el método de eliminación y la trazabilidad de las series documentales destruidas. Este certificado es su soporte legal definitivo ante la DIAN, las Superintendencias o cualquier proceso de auditoría externa (como ISO), demostrando que su organización actuó en estricto cumplimiento de la ley y de los ciclos de vida archivísticos.",
      ] },
    { q: "¿De qué manera el servicio de destrucción de Transarchivos se alinea con las políticas de sostenibilidad y economía circular de nuestra empresa?",
      a: [
        "En Transarchivos convertimos una obligación legal y de seguridad en un hito de sostenibilidad para su organización. Todo el papel resultante del proceso de trituración industrial es compactado e integrado directamente en cadenas de economía circular y reciclaje industrial.",
        "Garantizamos que el 100% del residuo de papel se transforme en materia prima para la fabricación de nuevos productos (como cartón o papel higiénico), evitando que termine en rellenos sanitarios. De esta manera, ayudamos a su compañía a reducir su huella de carbono, optimizar el uso de recursos naturales y sumar indicadores positivos a sus reportes de sostenibilidad corporativa corporativa (ESG).",
      ] },
    { q: "¿Cómo es la logística de recolección para la destrucción y qué control tenemos sobre el material antes de que salga de nuestras sedes?",
      a: [
        "Nuestra logística está diseñada para ser ágil, limpia y sin fricciones para su operación. Transarchivos coordina previamente la recolección de los documentos, se verifica que el material corresponda únicamente a los documentos autorizados para destrucción.",
        "Se valida la cantidad de cajas o unidades documentales que serán enviadas y ambas partes firman un acta de entrega, garantizando la trazabilidad y la cadena de custodia. Luego, los documentos son transportados de forma segura hasta las instalaciones donde se realiza su destrucción y finalmente se entrega un certificado de destrucción que confirma la eliminación segura de la información.",
      ] },
  ],
  // Servicio Microfilmación De Archivos
  "microfilmacion-de-archivos": [
    { q: "¿Cuál es el valor estratégico y la justificación técnica para seguir microfilmando archivos?",
      a: [
        "La nube y los servidores son ideales para la consulta diaria, pero sufren de un riesgo crítico a largo plazo: la obsolescencia tecnológica (formatos de archivo, sistemas operativos y software que cambian o desaparecen cada década) y la vulnerabilidad ante ciberataques masivos.",
        "El microfilm es el único medio de preservación a largo plazo que garantiza una vida útil de hasta 500 años bajo condiciones óptimas de conservación. No requiere software, hardware específico ni energía eléctrica para ser leído; basta con una fuente de luz y una lupa. Para la alta gerencia, la microfilmación no compite con lo digital; se complementa. Mientras lo digital resuelve el acceso inmediato, la microfilmación asegura la supervivencia del patrimonio histórico, accionarial y legal de la empresa para las próximas generaciones, totalmente inmune a cualquier virus informático o apagón tecnológico.",
      ] },
    { q: "¿Qué respaldo y validez jurídica tienen los documentos microfilmados por Transarchivos ante procesos legales, entes de control y auditorías en el país?",
      a: [
        "En Colombia, la microfilmación cuenta con un piso jurídico excepcionalmente sólido y maduro, respaldado por el Decreto 2527 de 1950 y la Ley 594 de 2000. La ley otorga a las copias e impresiones obtenidas a partir de un microfilm certificado el mismo valor probatorio y validez legal que el documento original en papel.",
        "Transarchivos realiza este proceso bajo estrictos protocolos de control de calidad (pruebas de densidad y de residuos químicos) y con la inclusión de actas de apertura y cierre dentro del rollo que garantizan la integridad de la información desde el primer fotograma. De este modo, su empresa cuenta con un blindaje legal absoluto: si el papel original se deteriora o es destruido bajo los tiempos de ley, el microfilm certificado mantiene la plena vigencia y fuerza jurídica de la compañía ante cualquier juzgado o ente regulador.",
      ] },
    { q: "¿Cómo interactúa el archivo microfilmado con los procesos del día a día de la empresa para evitar retrasos operativos en las consultas?",
      a: [
        "En Transarchivos implementamos lo que la alta gerencia denomina una estrategia híbrida de información, maximizando el retorno de la inversión. El proceso no frena la operación; la optimiza. Mediante tecnologías de última generación, realizamos procesos en paralelo: el documento se microfilma (para asegurar su preservación legal a largo plazo) y al mismo tiempo se digitaliza e indexa. De esta forma, su equipo consulta el archivo digital en segundos desde su computador para la operación diaria, mientras que el rollo de microfilm se custodia de forma ultra-segura como un respaldo maestro inalterable. Esto optimiza el costo total de propiedad de la información, dándole a la empresa lo mejor de ambos mundos: la inmediatez digital y la seguridad perpetua del microfilm.",
      ] },
    { q: "¿Cuáles son los protocolos logísticos y de custodia que maneja Transarchivos para el traslado y procesamiento de los documentos de conservación permanente?",
      a: [
        "El material altamente sensible se recolecta en sus instalaciones de manera programada empleando transporte seguro y personal especializado de la compañía. Una vez que ingresa a nuestro laboratorio de micrografía, es inventariado y procesado bajo estrictas medidas de seguridad física y ambiental.",
        "Durante todo el ciclo del proyecto, usted tiene visibilidad completa sobre el estado de sus documentos. Una vez microfilmados, los originales se restituyen con total seguridad a sus oficinas o se trasladan a nuestras bóvedas de custodia especializada, según la decisión estratégica que tome su organización.",
      ] },
  ],
  // Servicio Servicio In house
  "servicio-inhouse": [
    { q: "¿Cómo maneja Transarchivos la contratación y supervisión del personal In-house para garantizar que no existan riesgos de seguridad de la información o pasivos laborales para nuestra empresa?",
      a: [
        "En Transarchivos asumimos de manera autónoma y exclusiva la figura de empleador. Todo nuestro personal asignado a su organización está contratado bajo el estricto cumplimiento de la legislación laboral colombiana, con todas sus prestaciones sociales, seguridad social y parafiscales al día. Mantenemos una subordinación técnica y administrativa directa sobre nuestros colaboradores a través de supervisores y coordinadores de cuenta externos.",
        "Esto significa que Transarchivos se encarga de la selección, capacitación, reemplazos por incapacidades o vacaciones, y evaluaciones de desempeño. De esta forma, su empresa recibe el beneficio de un equipo experto in situ, eliminando por completo cualquier riesgo de seguridad, pasivos laborales o carga administrativa para su departamento de Talento Humano.",
      ] },
    { q: "¿Cuál es el valor agregado que aporta el personal In-house de Transarchivos en comparación con tener un equipo de archivo contratado directamente por nosotros?",
      a: [
        "La gran diferencia radica en la especialización y la productividad. Al contratar directamente personal de archivo general, su empresa debe invertir tiempo y recursos en capacitarlos en normas técnicas, y usualmente carecen de supervisión archivística experta.",
        "Transarchivos provee profesionales y técnicos en gestión documental debidamente calificados, entrenados bajo los lineamientos del Archivo General de la Nación (AGN) y las mejores prácticas del sector. Nuestra curva de aprendizaje es mínima porque implementamos de inmediato metodologías estandarizadas y herramientas de control de tiempos. Esto transforma un área típicamente lenta en un centro de servicios interno ágil, con indicadores de gestión (KPIs) medibles que aseguran que la información esté disponible para sus usuarios en tiempo récord.",
      ] },
    { q: "¿Cómo garantiza Transarchivos la continuidad del servicio In-house ante ausencias del personal y bajo qué esquemas de supervisión operan?",
      a: [
        "Garantizamos la continuidad absoluta de su operación adaptándonos a la jornada acordada con su empresa. Si un analista In-house presenta una incapacidad, calamidad o desvinculación, Transarchivos activa un protocolo de contingencia para cubrir la vacante con personal previamente capacitado en los procesos de su cuenta, evitando baches operativos. T odo el servicio está respaldado por manuales de funciones y procedimientos diseñados por nuestros coordinadores de proyectos, quienes realizan visitas de auditoría técnica periódicas. Transarchivos le entrega informes mensuales de gestión que demuestran el cumplimiento de los acuerdos de niveles de servicio (SLAs).",
      ] },
    { q: "¿Por qué es mejor contratar un servicio In-house con Transarchivos que tener un gestor documental propio?",
      a: [
        "Más que contratar un gestor documental, con el servicio In-house de Transarchivos su empresa incorpora el respaldo de más de 40 años de experiencia en gestión documental. Esto significa contar con profesionales especializados, metodologías probadas y el acompañamiento permanente de un equipo experto que garantiza procesos eficientes y alineados con la normativa. Además, Transarchivos asume la selección, capacitación y continuidad del personal, evitando interrupciones por ausencias y permitiendo que su organización se concentre en su actividad principal mientras la gestión documental queda en manos de especialistas. Es una solución más segura, flexible y rentable que depender de un único recurso interno.",
      ] },
  ],
  // Servicio Inmediato
  "servicio-inmediato": [
    { q: "¿Cómo nos respalda el Servicio Inmediato ante una auditoría sorpresa o un requerimiento legal urgente?",
      a: [
        "El Servicio Inmediato de Transarchivos está diseñado precisamente para operar como su canal de respuesta ante emergencias (Disaster Recovery logístico). Cuando su alta gerencia o equipo legal activa este servicio prioritario, interrumpimos los flujos de distribución convencionales para enfocar recursos exclusivos en su requerimiento.",
        "Localizamos de forma inmediata el expediente en nuestras bodegas automatizadas y despachamos la información en tiempo récord, asegurando que su empresa responda a la contingencia con total puntualidad y solvencia institucional.",
      ] },
    { q: "¿Qué modalidades ofrece el Servicio Inmediato de Transarchivos para acelerar al máximo la entrega de la información requerida?",
      a: [
        "Entendemos que en una urgencia cada minuto cuenta. Por ello, el Servicio Inmediato opera bajo dos modalidades estratégicas según la naturaleza de la necesidad:",
        "1. Digitalización Prioritaria bajo Demanda (La opción más rápida): Localizamos el documento físico en nuestras instalaciones, se traslada a nuestra central de digitalización y se escanea en alta resolución. El archivo electrónico indexado se sube de forma segura a su plataforma o se envía de manera encriptada a su equipo, eliminando los tiempos de desplazamiento físico.",
        "2. Despacho Físico Express: Si su organización requiere obligatoriamente el soporte original (con firmas y sellos húmedos), activamos una unidad de transporte prioritaria para llevar el documento en su estado físico bajo estrictas condiciones de seguridad y cadena de custodia directa hasta sus oficinas.",
      ] },
    { q: "¿Cómo se coordinan las solicitudes de Servicio Inmediato dentro de la jornada de atención de Transarchivos para garantizar la entrega el mismo día?",
      a: [
        "Nuestra infraestructura logística y de servicio al cliente está calibrada para procesar y despachar requerimientos urgentes con total agilidad dentro de nuestra jornada laboral.",
        "Para asegurar la efectividad y el cumplimiento de la entrega express el mismo día, las solicitudes prioritarias deben ser radicadas y validadas por nuestro canal de servicio al cliente preferencial dentro de esta ventana horaria. Al recibir la alerta en nuestros sistemas, el equipo de planta ejecuta la búsqueda inmediata y la preparación del material. Esto nos permite optimizar los tiempos de despacho y asegurar que, tanto para la opción digital como para la física, la información llegue a las manos del tomador de decisiones de su empresa de forma oportuna y sin baches operativos antes del cierre de su jornada.",
      ] },
    { q: "¿Qué mecanismos de control y gobernanza ofrece Transarchivos para evitar sobrecostos por el uso inadecuado o injustificado del Servicio Inmediato?",
      a: [
        "El Servicio Inmediato debe ser un recurso estratégico. En Transarchivos protegemos el presupuesto de su empresa implementando protocolos estrictos de autorización y perfiles de usuario.",
        "Durante la configuración del servicio, acordamos con la alta gerencia quiénes son las únicas personas de la compañía (generalmente directores de área, representantes legales o jefes de cumplimiento) con la facultad de autorizar y solicitar un despacho express.",
      ] },
  ],
};
