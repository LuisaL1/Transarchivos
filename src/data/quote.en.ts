// English version of the guided quote (same keys as quote.ts; only labels and
// options are translated). Spanish is the source of truth: when a question
// changes there, change it here too. Pending review by Transarchivos.
import { quoteConfig, type QConfig } from "@/data/quote";

export const QUOTE_SECTORS_EN = [
  "Healthcare", "Insurance", "Oil and gas", "Engineering and infrastructure", "Construction",
  "Airlines", "Laboratories", "Financial services", "Mining", "Company in liquidation or restructuring", "Other",
];

const DK = "I don't know";
const EN: Record<string, Omit<QConfig, "next">> = {
  diagnostico: {
    volumeLabel: "Approximate volume of the archive", volumePlaceholder: "E.g. 800 boxes, or “I don't know”", level: "Level 1 · Entry",
    fields: [
      { key: "situacion", label: "Current state of the archive", options: ["We have no records management program", "We have an outdated one", "We need to implement one", "Not sure"] },
      { key: "areas", label: "Departments involved", options: ["1 to 3", "4 to 10", "More than 10", DK] },
      { key: "entregable", label: "What you expect to receive", options: ["Assessment with findings", "Action plan", "Solution proposal", DK] },
    ],
  },
  "levantamiento-de-inventario": {
    volumeLabel: "Document volume", volumePlaceholder: "E.g. 1,200 boxes or 300 linear metres", level: "Level 1 · Entry",
    fields: [
      { key: "detalle", label: "Level of detail required", options: ["Per box", "Per folder or file", "Per document", DK] },
      { key: "areas", label: "Number of departments", options: ["1", "2 to 5", "More than 5", DK] },
      { key: "estado", label: "Condition of the documents", options: ["Organised", "Disorganised", "Deteriorated", DK] },
    ],
  },
  "programa-de-gestion-documental": {
    volumeLabel: "Departments or units to cover", volumePlaceholder: "E.g. 6 departments", level: "Level 2 · Solution",
    fields: [
      { key: "situacion", label: "Current situation", options: ["We have no PGD", "We have an outdated one", "We must implement one", "Not sure"] },
      { key: "alcance", label: "Expected scope", options: ["Assessment", "PGD design", "Design and implementation", DK] },
      { key: "acompanamiento", label: "Level of support", options: ["One-off", "Continuous during implementation", DK] },
    ],
  },
  "custodia-de-medios-magneticos": {
    volumeLabel: "Number of media", volumePlaceholder: "E.g. 200 tapes", level: "Level 3 · Protection",
    fields: [
      { key: "soporte", label: "Type of media", options: ["LTO / DAT / DLT tapes", "External hard drives", "CDs / DVDs", "Other or mixed"] },
      { key: "rotacion", label: "Media rotation", options: ["Daily", "Weekly", "Monthly", "No rotation", DK] },
      { key: "recoleccion", label: "Collection and delivery", options: ["Collected by Transarchivos", "Delivered by the client", "To be defined"] },
    ],
  },
  "custodia-de-archivos": {
    volumeLabel: "Document volume", volumePlaceholder: "E.g. 2,000 boxes", level: "Level 3 · Protection",
    fields: [
      { key: "unidad", label: "Unit you measure your volume in", options: ["Boxes", "Linear metres", "Folders or files", DK] },
      { key: "permanencia", label: "Estimated storage period", options: ["Less than 1 year", "1 to 3 years", "More than 3 years", DK] },
      { key: "consultas", label: "Expected retrievals", options: ["Few", "Frequent", DK] },
      { key: "recoleccion", label: "Collection", options: ["Collected by Transarchivos", "Delivered by the client", "To be defined"] },
    ],
  },
  "digitalizacion-de-documentos": {
    volumeLabel: "Volume to scan", volumePlaceholder: "E.g. 150,000 pages or 400 boxes", level: "Level 2 · Solution",
    fields: [
      { key: "tipo", label: "Type of documents", options: ["Contracts and commercial", "Employment records", "Medical records", "Accounting or legal", "Other"] },
      { key: "estado", label: "Condition of the documents", options: ["Good", "With staples or clips", "Deteriorated", DK] },
      { key: "modalidad", label: "Mode", options: ["At Transarchivos' centre", "At your premises (on site)", DK] },
      { key: "entrega", label: "Format and delivery", options: ["PDF with OCR", "PDF / TIFF / JPG", "Integration with your DMS", DK] },
      { key: "fisico", label: "Destination of the physical archive", options: ["Storage", "Certified destruction", "Return", DK] },
    ],
  },
  "destruccion-de-documentos": {
    volumeLabel: "Volume to destroy", volumePlaceholder: "E.g. 5 tonnes or 800 boxes", level: "Level 4 · Expansion",
    fields: [
      { key: "material", label: "Type of material", options: ["Confidential paper", "Magnetic media", "Mixed"] },
      { key: "trd", label: "Do you have a TRD or an approved disposal record?", options: ["Yes", "No", "In progress", DK] },
      { key: "inventario", label: "Do you have an inventory of what will be destroyed?", options: ["Yes", "No", "Partial"] },
      { key: "recoleccion", label: "Collection", options: ["Collected by Transarchivos", "To be defined"] },
    ],
  },
  "microfilmacion-de-archivos": {
    volumeLabel: "Volume of microfilm to convert", volumePlaceholder: "E.g. 40 reels or 100,000 images",
    fields: [
      { key: "tipo", label: "Type of documents", options: ["Medical records", "Notarial records", "Court files", "Accounting, legal or financial", "Historical or heritage", "Other"] },
      { key: "formato", label: "Microfilm format", options: ["16 mm", "35 mm", DK] },
      { key: "entrega", label: "Delivery format", options: ["PDF", "PDF with OCR and indexing", DK] },
      { key: "rollos", label: "Destination of the reels", options: ["Return them to the client", "Move them to storage", DK] },
    ],
  },
  "servicio-inhouse": {
    volumeLabel: "Documents to process", volumePlaceholder: "E.g. 500 boxes on site", level: "Level 4 · Expansion",
    fields: [
      { key: "perfil", label: "Requesting department", options: ["Human Resources", "Purchasing", "General Services", "Archive Committee", "Other"] },
      { key: "actividades", label: "Activities required", options: ["Organisation and labelling", "Application of the TRD", "Inventories", "Preparation for scanning", "Several of the above"] },
      { key: "personas", label: "People required on site", options: ["1", "2 to 3", "More than 3", DK] },
      { key: "duracion", label: "Estimated duration", options: ["Less than 3 months", "3 to 12 months", "More than 12 months", DK] },
    ],
  },
  "servicio-inmediato": {
    volumeLabel: "Documents required", volumePlaceholder: "E.g. 3 files", level: "Level 4 · Expansion",
    fields: [
      { key: "modalidad", label: "Mode", options: ["Priority on-demand scanning", "Express physical dispatch", DK] },
      { key: "custodia", label: "Are the documents stored with Transarchivos?", options: ["Yes", "No", "Partially"] },
      { key: "plazo", label: "Deadline", options: ["Same day", "24 to 48 hours", "This week"] },
    ],
  },
};

export const quoteConfigEn: Record<string, QConfig> = Object.fromEntries(
  Object.entries(quoteConfig).map(([k, v]) => [k, { ...v, ...EN[k] }]),
);
