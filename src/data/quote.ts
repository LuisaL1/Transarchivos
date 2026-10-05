

export type QField = { key: string; label: string; options: string[] };

export type QConfig = { volumeLabel: string; volumePlaceholder: string; fields: QField[]; level?: string; next: string[] };

export const QUOTE_URGENCY = ["Sin urgencia", "En las próximas semanas", "Urgente"];

export const QUOTE_SECTORS = [
  "Salud", "Aseguradoras", "Petróleo", "Ingeniería e infraestructura", "Construcción",
  "Líneas aéreas", "Laboratorios", "Financiero", "Minería", "Compañía en liquidación o reestructuración", "Otro",
];

export const quoteConfig: Record<string, QConfig> = {
  diagnostico: {
    volumeLabel: "Volumen aproximado del archivo", volumePlaceholder: "Ej.: 800 cajas, o “no lo sé”",
    level: "Nivel 1 · Entrada", next: ["levantamiento-de-inventario", "digitalizacion-de-documentos", "custodia-de-archivos", "destruccion-de-documentos"],
    fields: [
      { key: "situacion", label: "Situación actual del archivo", options: ["No tenemos programa de gestión documental", "Tenemos uno desactualizado", "Necesitamos implementarlo", "No estoy seguro"] },
      { key: "areas", label: "Áreas involucradas", options: ["1 a 3", "4 a 10", "Más de 10", "No lo sé"] },
      { key: "entregable", label: "Qué espera recibir", options: ["Diagnóstico con hallazgos", "Plan de acción", "Propuesta de solución", "No lo sé"] },
    ],
  },
  "levantamiento-de-inventario": {
    volumeLabel: "Volumen documental", volumePlaceholder: "Ej.: 1.200 cajas o 300 metros lineales",
    level: "Nivel 1 · Entrada", next: ["custodia-de-archivos", "digitalizacion-de-documentos", "destruccion-de-documentos"],
    fields: [
      { key: "detalle", label: "Nivel de detalle requerido", options: ["Por caja", "Por carpeta o expediente", "Por documento", "No lo sé"] },
      { key: "areas", label: "Cantidad de áreas", options: ["1", "2 a 5", "Más de 5", "No lo sé"] },
      { key: "estado", label: "Estado de la documentación", options: ["Organizada", "Desorganizada", "Con deterioro", "No lo sé"] },
    ],
  },
  "programa-de-gestion-documental": {
    volumeLabel: "Áreas o dependencias a cubrir", volumePlaceholder: "Ej.: 6 dependencias",
    level: "Nivel 2 · Solución", next: ["levantamiento-de-inventario", "digitalizacion-de-documentos", "custodia-de-archivos"],
    fields: [
      { key: "situacion", label: "Situación actual", options: ["No tenemos PGD", "Tenemos uno desactualizado", "Debemos implementarlo", "No estoy seguro"] },
      { key: "alcance", label: "Alcance esperado", options: ["Diagnóstico", "Diseño del PGD", "Diseño e implementación", "No lo sé"] },
      { key: "acompanamiento", label: "Nivel de acompañamiento", options: ["Puntual", "Continuo durante la implementación", "No lo sé"] },
    ],
  },
  "custodia-de-medios-magneticos": {
    volumeLabel: "Cantidad de medios", volumePlaceholder: "Ej.: 200 cintas",
    level: "Nivel 3 · Protección", next: ["digitalizacion-de-documentos", "destruccion-de-documentos"],
    fields: [
      { key: "soporte", label: "Tipo de soporte", options: ["Cintas LTO / DAT / DLT", "Discos duros externos", "CDs / DVDs", "Otros o mezcla"] },
      { key: "rotacion", label: "Rotación de medios", options: ["Diaria", "Semanal", "Mensual", "Sin rotación", "No lo sé"] },
      { key: "recoleccion", label: "Recolección y entrega", options: ["Recolección por Transarchivos", "Entrega por el cliente", "Por definir"] },
    ],
  },
  "custodia-de-archivos": {
    volumeLabel: "Volumen documental", volumePlaceholder: "Ej.: 2.000 cajas",
    level: "Nivel 3 · Protección", next: ["digitalizacion-de-documentos", "destruccion-de-documentos"],
    fields: [
      { key: "unidad", label: "Unidad con la que mide su volumen", options: ["Cajas", "Metros lineales", "Carpetas o expedientes", "No lo sé"] },
      { key: "permanencia", label: "Permanencia estimada", options: ["Menos de 1 año", "1 a 3 años", "Más de 3 años", "No lo sé"] },
      { key: "consultas", label: "Consultas esperadas", options: ["Pocas", "Frecuentes", "No lo sé"] },
      { key: "recoleccion", label: "Recolección", options: ["Recolección por Transarchivos", "Entrega por el cliente", "Por definir"] },
    ],
  },
  "digitalizacion-de-documentos": {
    volumeLabel: "Volumen a digitalizar", volumePlaceholder: "Ej.: 150.000 páginas o 400 cajas",
    level: "Nivel 2 · Solución", next: ["custodia-de-archivos", "destruccion-de-documentos"],
    fields: [
      { key: "tipo", label: "Tipo de documentos", options: ["Contratos y comerciales", "Historias laborales", "Historias clínicas", "Contables o legales", "Otros"] },
      { key: "estado", label: "Estado del documento", options: ["Bueno", "Con grapas o clips", "Deteriorado", "No lo sé"] },
      { key: "modalidad", label: "Modalidad", options: ["En el centro de Transarchivos", "In-house, en sus instalaciones", "No lo sé"] },
      { key: "entrega", label: "Formato y entrega", options: ["PDF con OCR", "PDF / TIFF / JPG", "Integración con su DMS", "No lo sé"] },
      { key: "fisico", label: "Destino del archivo físico", options: ["Custodia", "Destrucción certificada", "Devolución", "No lo sé"] },
    ],
  },
  "destruccion-de-documentos": {
    volumeLabel: "Volumen a destruir", volumePlaceholder: "Ej.: 5 toneladas o 800 cajas",
    level: "Nivel 4 · Expansión", next: ["custodia-de-archivos", "digitalizacion-de-documentos"],
    fields: [
      { key: "material", label: "Tipo de material", options: ["Papel confidencial", "Medios magnéticos", "Mixto"] },
      { key: "trd", label: "¿Cuenta con TRD o acta de eliminación aprobada?", options: ["Sí", "No", "En proceso", "No lo sé"] },
      { key: "inventario", label: "¿Tiene inventario de lo que se destruirá?", options: ["Sí", "No", "Parcial"] },
      { key: "recoleccion", label: "Recolección", options: ["Recolección por Transarchivos", "Por definir"] },
    ],
  },
  "microfilmacion-de-archivos": {
    volumeLabel: "Volumen a microfilmar", volumePlaceholder: "Ej.: 100.000 imágenes o 300 cajas",
    next: [],
    fields: [
      { key: "tipo", label: "Tipo de documentos", options: ["Historias clínicas", "Registros notariales", "Expedientes judiciales", "Contables, legales o financieros", "Históricos o patrimoniales", "Otros"] },
      { key: "formato", label: "Formato de microfilme", options: ["16 mm", "35 mm", "No lo sé"] },
      { key: "originales", label: "Destino de los originales", options: ["Restituirlos al cliente", "Trasladarlos a custodia", "No lo sé"] },
      { key: "paralelo", label: "¿Digitalizar en paralelo?", options: ["Sí", "No", "No lo sé"] },
    ],
  },
  "servicio-inhouse": {
    volumeLabel: "Documentación a intervenir", volumePlaceholder: "Ej.: 500 cajas en sitio",
    level: "Nivel 4 · Expansión", next: [],
    fields: [
      { key: "perfil", label: "Área que solicita", options: ["Recursos Humanos", "Compras", "Servicios Generales", "Comité de Archivo", "Otra"] },
      { key: "actividades", label: "Actividades requeridas", options: ["Organización y rotulación", "Aplicación de TRD", "Inventarios", "Preparación para digitalización", "Varias de las anteriores"] },
      { key: "personas", label: "Personas requeridas en sitio", options: ["1", "2 a 3", "Más de 3", "No lo sé"] },
      { key: "duracion", label: "Duración estimada", options: ["Menos de 3 meses", "3 a 12 meses", "Más de 12 meses", "No lo sé"] },
    ],
  },
  "servicio-inmediato": {
    volumeLabel: "Documentos requeridos", volumePlaceholder: "Ej.: 3 expedientes",
    level: "Nivel 4 · Expansión", next: [],
    fields: [
      { key: "modalidad", label: "Modalidad", options: ["Digitalización prioritaria bajo demanda", "Despacho físico express", "No lo sé"] },
      { key: "custodia", label: "¿Los documentos están en custodia con Transarchivos?", options: ["Sí", "No", "Parcialmente"] },
      { key: "plazo", label: "Plazo requerido", options: ["Mismo día", "24 a 48 horas", "Esta semana"] },
    ],
  },
};

// Unidad de cotización por servicio — tabla del punto 7 de "LÓGICA DE
// COTIZACIÓN TRANSARCHIVOS" ("las unidades definitivas, tarifas y fórmulas
// deben ser determinadas posteriormente"). Solo cubre los 5 servicios que el
// documento tabula explícitamente; el resto no tiene unidad definida todavía.
export const QUOTE_UNIT: Record<string, string> = {
  "custodia-de-archivos": "Unidad contractual/operativa, según volumen, permanencia y condiciones.",
  "custodia-de-medios-magneticos": "Unidad contractual/operativa, según volumen, permanencia y condiciones.",
  "digitalizacion-de-documentos": "Unidad de producción, según volumen y características documentales.",
  "levantamiento-de-inventario": "Unidad de levantamiento, según volumen, detalle y complejidad.",
  "destruccion-de-documentos": "Unidad de manejo, según volumen y condiciones.",
  "diagnostico": "Proyecto, jornada o entregable, según alcance y dedicación.",
  "programa-de-gestion-documental": "Proyecto, jornada o entregable, según alcance y dedicación.",
};
