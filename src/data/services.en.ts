// English version of the site's core content (services menu and cards, solutions,
// FAQs, "About" menu, figures, standards). Same structure as the Spanish files:
// when a Spanish text changes, update it here too. Slugs, ids and icons stay the
// same; only the texts are translated. Pending review by Transarchivos.
import { services, serviceItems, norms } from "@/data/services";
import { SOLUTIONS } from "@/data/solutions";
import { nosotrosGroups } from "@/data/nosotros";
import { STATS } from "@/data/stats";

type SvcText = { title: string; tag: string; desc: string; card: { title: string; tag: string; cta: string; desc: string }; quote: { title: string; desc: string } | null; menu: string };

const SVC: Record<string, SvcText> = {
  "levantamiento-de-inventario": {
    title: "Document inventory", tag: "AGN standards · Law 594",
    desc: "Identification, registration and classification of the documents in an archive to establish their volume, condition and location.",
    menu: "Assessment and classification of your archive under the standards of Colombia's General Archive (AGN).",
    card: { title: "Document survey and inventory", tag: "Law 594 of 2000 · AGN guidelines", cta: "Learn more",
      desc: "We identify, register and methodically classify your document holdings to establish their exact volume, state of conservation and physical location, in line with the requirements of the Records Retention Schedules (TRD)." },
    quote: { title: "Document inventory", desc: "Identification, foliation and systematic registration of your archive. A precise census of volume (linear metres/boxes), physical location and state of conservation." },
  },
  "programa-de-gestion-documental": {
    title: "Records management program", tag: "PGD · Law 594",
    desc: "A system to manage documents throughout their life cycle: creation, use, preservation and final disposition.",
    menu: "The strategic instrument for controlling the document life cycle in compliance with Law 594.",
    card: { title: "Records Management Program (PGD)", tag: "Law 594 of 2000 · AGN guidelines", cta: "Learn more",
      desc: "We formulate the archival instrument that governs the creation, use, preservation and disposal of your company's documents. A strategic solution aligned with AGN standards to keep full control of the archive throughout its life cycle." },
    quote: { title: "Records Management Program (PGD)", desc: "Structuring of the regulatory and operational framework that guarantees the traceability, preservation and legal validity of your company's documents." },
  },
  "custodia-de-medios-magneticos": {
    title: "Technical media vaulting", tag: "Air-gapped copy · DRP",
    desc: "Specialised storage of LTO/DAT/DLT tapes, hard drives, CDs/DVDs and other media.",
    menu: "Storage of LTO tapes, hard drives and optical media under strict temperature and humidity control.",
    card: { title: "Media vaulting and air-gapped backup", tag: "Air gap · DRP", cta: "See technical specifications",
      desc: "High-security storage for magnetic tapes, hard drives and mass-storage media. We protect your company's critical backup copy in secure facilities isolated from the network." },
    quote: { title: "Technical media vaulting", desc: "Security rooms for the preservation of LTO/DAT tapes, disks and optical media." },
  },
  "custodia-de-archivos": {
    title: "Records storage", tag: "CCTV · 24-hour surveillance",
    desc: "Safekeeping and management of physical and digital documents with security, integrity and availability.",
    menu: "Safekeeping of your archive in facilities with 24/7 surveillance and strict access control.",
    card: { title: "Records storage and safekeeping", tag: "CCTV · 24/7 monitoring", cta: "See storage conditions",
      desc: "Storage and administration of physical records in high-security facilities with uninterrupted CCTV surveillance, biometric access control and fire-prevention systems." },
    quote: { title: "Records storage", desc: "Secure storage of physical records. Continuous monitoring, secure custody and guaranteed retrieval/loan service." },
  },
  "digitalizacion-de-documentos": {
    title: "Document scanning", tag: "Legal validity · OCR",
    desc: "Conversion of physical documents into digital files with capture, indexing and optional OCR.",
    menu: "High-volume scanning, OCR recognition and indexing for full control of your information.",
    card: { title: "Document scanning and OCR capture", tag: "Legal validity · Structured indexing", cta: "See the scanning process",
      desc: "We turn your physical files into high-resolution digital documents with full legal backing, optical character recognition (OCR) and search metadata." },
    quote: { title: "Document scanning", desc: "Conversion of files into high-fidelity digital formats." },
  },
  "destruccion-de-documentos": {
    title: "Document destruction", tag: "Certificate of destruction",
    desc: "Secure, traceable destruction with a disposal record and certificate, in line with Law 594 of 2000.",
    menu: "Confidential, irreversible shredding with a certificate of destruction, video record and full traceability.",
    card: { title: "Certified document destruction", tag: "Habeas Data compliant", cta: "See the destruction protocol",
      desc: "Definitive, secure and traceable disposal of physical records that have completed their legal retention period, with an official record and a Certificate of Destruction with full legal validity." },
    quote: { title: "Certified document destruction", desc: "Confidential shredding of records to prevent leaks of sensitive information and penalties; we deliver the supporting evidence of the process." },
  },
  "microfilmacion-de-archivos": {
    title: "Microfilm conversion", tag: "16 / 35 mm microfilm",
    desc: "Conversion of historical microfilm into indexed digital files for fast retrieval.",
    menu: "Conversion of historical microfilm into indexed digital files for fast retrieval.",
    card: { title: "From microfilm to digital PDF", tag: "From 16 / 35 mm to PDF", cta: "See the PDF conversion process",
      desc: "We convert your analogue microfilm (16 and 35 mm) into fully legible, organised PDF documents. No more dependence on traditional readers: remote consultation, bulk processing and secure backup of your historical holdings in the cloud or on your servers." },
    quote: { title: "Microfilm conversion", desc: "Scanning of 15/35mm reels into high-definition digital formats and recovery of historical records." },
  },
  "servicio-inhouse": {
    title: "On-site service", tag: "At your premises",
    desc: "Technical archive staff at your premises, trained and supervised by Transarchivos.",
    menu: "Specialised archive staff at your premises, trained and supervised directly by Transarchivos.",
    card: { title: "On-site records management", tag: "Technical staff at your premises", cta: "See the on-site operating model",
      desc: "Professional archive staff working directly at your company's premises. We handle the daily execution and technical supervision with Transarchivos' methodology and guaranteed quality." },
    quote: { title: "On-site records management", desc: "Archive technicians at your premises, backed and supervised by Transarchivos to guarantee proper organisation." },
  },
  "servicio-inmediato": {
    title: "Rapid retrieval service", tag: "Priority response",
    desc: "Consultation, retrieval and urgent delivery of documents, with traceability at every stage.",
    menu: "Consult the documents stored in Transarchivos' custody.",
    card: { title: "Rapid delivery service", tag: "Document consultation and retrieval", cta: "See response times and protocols",
      desc: "Location, scanning and/or urgent dispatch of critical documents. Guaranteed traceability from the request to physical or digital receipt at your company." },
    quote: null,
  },
};

export const servicesEn = services.map(s => { const e = SVC[s.slug]; return { ...s, title: e.title, tag: e.tag, desc: e.desc, card: e.card, quote: e.quote }; });
export const serviceItemsEn = serviceItems.map(s => ({ ...s, title: SVC[s.slug].title, desc: SVC[s.slug].menu }));

const NORMS_EN: Record<string, [string, string]> = {
  "Ley 594 / 2000": ["General Archives Law (AGN)", "Sets the rules and principles of archival practice in Colombia: organisations must organise, preserve and dispose of their documents according to their Records Retention Schedules, under the authority of the General Archive of the Nation."],
  "Decreto 1080 / 2015": ["PGD and the electronic document life cycle", "Single Regulatory Decree of the Culture Sector: regulates the Records Management Program (PGD), the archival instruments and the management of electronic documents throughout their life cycle."],
  "Res. 8934 / 2014": ["Superintendence of Industry and Commerce", "Guidelines of the Superintendence of Industry and Commerce on records management and the organisation of archives for the companies it supervises."],
  "Ley Antitrámites 962 de 2005 · art. 28": ["Preservation of documents on technical media", "Article 28: books and business papers may be kept on any technical medium (such as scanning or microfilm) that guarantees their exact reproduction, for ten years."],
  "Ley 1581 / 2012": ["Personal data protection", "General personal data protection regime: governs how people's data are collected, processed and protected, including the data held in stored records."],
  "Ley 527 / 1999": ["Electronic commerce: legal validity of scanned documents", "Recognises the legal and evidentiary validity of data messages and electronic documents: the legal basis of scanning with legal validity."],
  "Decreto 2527 / 1950": ["Legal validity of microfilm", "Authorises the microfilming of records and gives evidentiary value to copies obtained from certified microfilm, equal to the original document."],
  "Norma Icontec 2001": ["Heavy-duty shelving of the Document Centre", "Technical specifications of the heavy-duty metal shelving installed in our document centre to store archive boxes safely."],
};
export const normsEn = norms.map(n => ({ ...n, name: NORMS_EN[n.code]?.[0] ?? n.name, detail: NORMS_EN[n.code]?.[1] ?? n.detail, code: n.code.replace("Ley Antitrámites", "Anti-red-tape Law").replace("Ley", "Law").replace("Decreto", "Decree").replace("Norma Icontec", "Icontec standard").replace(" de 2005 · art. 28", " of 2005 · art. 28") }));

const SOL: Record<string, { tag: string; title: string; problem: string; desc: string; points: string[]; labels?: string[]; cta: string }> = {
  cumplimiento: {
    tag: "Legal risk", title: "Compliance with Law 594 of 2000",
    problem: "Secure the evidentiary validity of your records and avoid demands from regulators.",
    desc: "We design and implement the mandatory archival instruments (Records Management Program, PGD, and Records Retention Schedules, TRD), guaranteeing strict regulatory compliance and preventing audit findings or penalties from regulatory bodies.",
    points: ["Institutional PGD: a mandatory instrument under Decree 1080 of 2015", "Records Retention and Appraisal Schedules for managing the document life cycle", "Regulatory inventory: standardised classification under the current parameters of the General Archive of the Nation (AGN)"],
    cta: "Request a legal compliance assessment",
  },
  espacio: {
    tag: "Costs and space", title: "Free up space at your premises",
    problem: "Recover key work areas and eliminate storage costs.",
    desc: "We transfer the custody of your document holdings to our secure logistics centre and carry out the certified disposal of files that have completed their life cycle.",
    points: ["Exact measurement in linear and cubic metres to eliminate idle capacity", "Legally valid destruction record for the definitive write-off of expired files"],
    labels: ["Storage and specialised infrastructure", "Secure, traceable destruction of records"],
    cta: "Get a quote for a storage and clean-out project",
  },
  digital: {
    tag: "Digital transformation", title: "Paperless office",
    problem: "Speed up decision-making by eliminating paper flows and fragmented archives.",
    desc: "We turn your physical archive into an intelligent, structured digital ecosystem available for instant consultation. We implement scanning processes with evidentiary validity (Law 527 of 1999), OCR technology and the technical definition of the electronic document life cycle to eliminate dead time in managing your information.",
    points: ["Smart search (OCR): instant location of documents and key information through advanced indexing", "Legally valid safekeeping: processes aligned with Law 527 of 1999 to guarantee authenticity and legal integrity"],
    labels: ["Document scanning (legal validity · OCR)", "Records Management Program (PGD)", "Microfilm scanning and conversion (16 / 35 mm)"],
    cta: "Request a scanning and digital integration plan",
  },
  operacion: {
    tag: "Document operations", title: "Archive administration and management at your premises",
    problem: "Remove the bottlenecks in the physical handling of files inside your company.",
    desc: "We deploy a trained technical team at your own premises to take over the administration, organisation and processing of your document flow. Transarchivos handles hiring, ongoing training and methodological supervision of the staff, guaranteeing operational continuity and compliance standards.",
    points: ["On-site specialisation: archival technicians embedded in your daily processes", "Methodology: we adapt to the guidelines set by the client for document organisation, applying archival standards", "Continuity without labour risk: relief for Human Resources, Purchasing and General Services in managing specialised staff"],
    labels: ["On-site records management (specialised technical staff)"],
    cta: "Request an on-site operations project",
  },
};
export const solutionsEn = SOLUTIONS.map(s => ({ ...s, ...SOL[s.id] }));

export const faqsEn = [
  { q: "Why start with a document assessment?", a: "Because before moving a single sheet of paper it pays to know what is going on with your archive: volume, condition, space it occupies, organisation, risks and opportunities. With that information you decide which services you need instead of starting from assumptions." },
  { q: "How do I request a quote?", a: "In the «Request your quote» section, choose the service, answer a few questions about your archive and enter your contact details. When you submit the request, an advisor will reply with the scope and conditions. If you don't know a detail, you can tick «I don't know»." },
  { q: "How is the cost of the services calculated?", a: "It depends on the service, the volume and the condition of your archive. In storage, for example, the cost is variable and scalable: you pay for the volume you store, with no fixed costs for space or staff. That is why every quote is built with the information of your case." },
  { q: "Do you serve companies outside Bogotá?", a: "We operate mainly in Bogotá, where our headquarters and storage warehouses are located. We are open to serving companies in other Colombian cities depending on the scope of the project." },
  { q: "Which regulations do you comply with?", a: "We work under the General Archives Law (Law 594 of 2000) and the regulations of the General Archive of the Nation, as well as Law 1581 of 2012 on personal data protection, among other rules applicable to records management." },
  { q: "How do you protect the documents in your custody?", a: "Our document centre has 24-hour CCTV surveillance, access control and permanent environmental monitoring. You can also consult and retrieve your documents whenever you need them." },
  { q: "Is scanning legally valid?", a: "Yes. The conversion of physical documents into digital files is done with capture, indexing and optional OCR, within the framework of Law 527 of 1999, which recognises the validity of electronic documents." },
  { q: "Do you provide proof when you destroy documents?", a: "Yes. Destruction is secure and traceable, and comes with a disposal record and a certificate of destruction, in line with Law 594 of 2000." },
  { q: "Can you work inside our premises?", a: "Yes, with the on-site service: technical archive staff work at your premises, trained and supervised by Transarchivos." },
];

const ABOUT_LABELS: Record<string, string> = {
  "La empresa": "The company", "Quiénes somos": "Who we are", "Nuestra historia": "Our history", "Misión y visión": "Mission and vision",
  "Equipo y cultura": "Team and culture", "Nuestro equipo": "Our team", "Cultura": "Culture",
  "Resultados": "Results", "Nuestros clientes": "Our clients", "Normativa": "Regulations",
};
export const nosotrosGroupsEn = nosotrosGroups.map(g => ({ heading: ABOUT_LABELS[g.heading] ?? g.heading, items: g.items.map(i => ({ ...i, label: ABOUT_LABELS[i.label] ?? i.label })) }));

const STAT_LABELS: Record<string, string> = { "años de experiencia en el mercado": "years of experience in the market", "contratos comerciales": "commercial contracts", "de folios custodiados": "folios in custody" };
export const statsEn = STATS.map(s => ({ ...s, value: s.value.replace(".", ","), unit: s.unit ? "million" : s.unit, label: STAT_LABELS[s.label] ?? s.label }));

export const CONTACT_REASONS_EN = ["Request a quote", "Information about a service", "Support for a contracted service", "Requests, complaints or claims", "Personal data (Law 1581)", "Work with us", "Other"];
