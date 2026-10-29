

// Las 4 soluciones más recurrentes (documento "Correcciones en página web de
// Transarchivos - Home", oct. 2026: se retiraron "Respaldo y recuperación ante
// desastres" y "Auditorías y requerimientos urgentes" para optimizar el
// espacio; esos casos los cubren Custodia de medios técnicos y Servicio
// inmediato). "problem": la frase de beneficio bajo el título. "labels": cómo
// se nombran los servicios integrados en la tarjeta (mismo orden que "slugs";
// si falta, se usa el nombre del servicio). "cta": texto del enlace a cotizar.
export const SOLUTIONS: { id: string; icon: string; tag: string; title: string; problem: string; desc: string; points: string[]; slugs: string[]; labels?: string[]; cta: string }[] = [
  {
    id: "cumplimiento", icon: "shield-check", tag: "Riesgo legal",
    title: "Cumplimiento de la Ley 594 de 2000",
    problem: "Asegure la validez probatoria de sus archivos y evite requerimientos de entes de control.",
    desc: "Diseñamos e implementamos los instrumentos archivísticos obligatorios (Programa de Gestión Documental PGD y Tablas de Retención Documental TRD) garantizando el estricto cumplimiento normativo y previniendo hallazgos de auditoría o sanciones por parte de entes reguladores.",
    points: ["PGD institucional: instrumento de carácter obligatorio según el Decreto 1080 de 2015", "Tablas de Retención y Valoración Documental para la gestión del ciclo de vida documental", "Inventario normativo: clasificación estandarizada bajo parámetros vigentes del Archivo General de la Nación (AGN)"],
    slugs: ["programa-de-gestion-documental", "levantamiento-de-inventario"],
    cta: "Solicitar valoración de cumplimiento legal",
  },
  {
    id: "espacio", icon: "box-seam", tag: "Costos y espacio",
    title: "Libere espacio en sus instalaciones",
    problem: "Recupere áreas de trabajo clave y elimine los gastos de almacenamiento.",
    desc: "Transferimos la custodia de su fondo documental a nuestro centro logístico de seguridad y ejecutamos la depuración certificada de los expedientes que ya cumplieron su ciclo de vida.",
    points: ["Medición exacta en metros lineales y cúbicos para eliminar la capacidad ociosa", "Acta de destrucción con validez legal para dar de baja definitiva expedientes caducos"],
    slugs: ["custodia-de-archivos", "destruccion-de-documentos"],
    labels: ["Custodia e infraestructura especializada", "Destrucción segura y trazable de archivos"],
    cta: "Cotizar proyecto de custodia y depuración",
  },
  {
    id: "digital", icon: "upc-scan", tag: "Transformación digital",
    title: "Oficina cero papel",
    problem: "Acelere la toma de decisiones eliminando el flujo de papel físico y la fragmentación de archivos.",
    desc: "Convertimos su archivo físico en un ecosistema digital inteligente, estructurado y de consulta inmediata. Implementamos procesos de digitalización con validez probatoria (Ley 527 de 1999), tecnología OCR y la definición técnica del ciclo de vida del documento electrónico para eliminar tiempos muertos en la gestión de su información.",
    points: ["Búsqueda inteligente (OCR): localización instantánea de documentos e información clave mediante indexación avanzada", "Resguardo con valor legal: procesos alineados con la Ley 527 de 1999 para garantizar la autenticidad e integridad jurídica"],
    slugs: ["digitalizacion-de-documentos", "programa-de-gestion-documental", "microfilmacion-de-archivos"],
    labels: ["Digitalización de documentos (valor legal · OCR)", "Programa de Gestión Documental (PGD)", "Digitalización y conversión de microfilmes (16 / 35 mm)"],
    cta: "Solicitar plan de digitalización e integración digital",
  },
  {
    id: "operacion", icon: "people", tag: "Operación documental",
    title: "Administración y gestión del archivo en sus instalaciones",
    problem: "Elimine los cuellos de botella en la administración física de expedientes dentro de su empresa.",
    desc: "Desplegamos un equipo técnico capacitado en sus propias instalaciones para asumir la administración, organización y trámite del flujo documental. Transarchivos asume la contratación, capacitación continua y supervisión metodológica del personal, garantizando continuidad operativa y estándares de cumplimiento.",
    points: ["Especialización in situ: técnicos en archivística integrados directamente a sus procesos diarios", "Metodología: nos adaptamos a los lineamientos dispuestos por el cliente para la organización documental aplicando las normas archivísticas", "Continuidad sin riesgo laboral: alivio de carga para Gestión Humana, Compras y Servicios Generales en la administración de personal especializado"],
    slugs: ["servicio-inhouse"],
    labels: ["Gestión documental in-house (personal técnico especializado)"],
    cta: "Solicitar proyecto operativo in-house",
  },
];

export const SOLUTIONS_ICON: Record<string, string> = Object.fromEntries(SOLUTIONS.map(x => [x.id, x.icon]));
