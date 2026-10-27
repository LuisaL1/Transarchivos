// ─── Joel in English: the virtual advisor's brain for the English site ──────
// Same idea as src/lib/joel.ts (keyword scoring with typo tolerance, service
// context, pains → solutions, FAQ matching, learning and a greeting based on
// the visitor's behaviour), with English keywords and answers. It reads the
// English content (src/i18n/content.ts) so there is a single source of truth.
// Pending review by Transarchivos.
import { PHONES, WHATSAPP_LABEL, contactHref, whatsappUrl } from "@/data/contact";
import { getInsight, load, save } from "@/lib/visitor";
import { norm, type JoelAction, type JoelKB, type JoelOption, type JoelReply, type Memory } from "@/lib/joel";

const STOP = new Set("a an the and or of to in on for with my our your we i you it is are do does can could would should have has need want like please hello hi thanks about from at by this that these those be me us them they".split(" "));
const stem = (w: string) => w.length > 4 ? w.replace(/(ations|ation|ising|izing|ingly|ness|ments|ment|ing|ies|ied|ed|es|s)$/, "") : w.replace(/s$/, "");
function lev(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 2) return 9;
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}
/** Does the text contain the keyword? Accepts phrases, stems and typos. */
function has(text: string, words: string[], kw: string): boolean {
  if (kw.includes(" ")) return ` ${text} `.includes(` ${kw} `);
  const ks = stem(kw);
  return words.some(w => {
    if (w === kw || (ks.length >= 4 && stem(w) === ks)) return true;
    if (ks.length >= 5 && w.startsWith(ks)) return true;
    if (w[0] !== kw[0]) return false;
    const tol = kw.length >= 9 ? 2 : kw.length >= 6 ? 1 : 0;
    return tol > 0 && lev(w, kw) <= tol;
  });
}
const keywordsOf = (text: string) => norm(text).split(" ").filter(w => w.length >= 4 && !STOP.has(w));

const C = "custodia-de-archivos", M = "custodia-de-medios-magneticos", D = "digitalizacion-de-documentos", X = "destruccion-de-documentos", F = "microfilmacion-de-archivos", P = "programa-de-gestion-documental", I = "levantamiento-de-inventario", H = "servicio-inhouse", N = "servicio-inmediato";

const SERVICE_KEYWORDS: Record<string, string[]> = {
  [I]: ["inventory", "survey", "census", "how many boxes", "organize", "organise", "mess", "disorganized", "disorganised", "classify", "classification", "sort"],
  [P]: ["pgd", "records management program", "records management programme", "retention schedule", "retention schedules", "trd", "tvd", "appraisal", "document policy", "paperless", "life cycle", "lifecycle"],
  [M]: ["tape", "tapes", "lto", "backup", "backups", "hard drive", "hard drives", "disks", "magnetic media", "media vaulting", "vaulting", "ransomware", "air gap", "drp", "disaster recovery"],
  [C]: ["storage", "store", "storing", "warehouse", "keep", "safekeeping", "custody", "boxes", "space", "offsite", "off-site", "central archive", "retrieval"],
  [D]: ["scan", "scanning", "scanner", "digitize", "digitise", "digitization", "digitisation", "ocr", "pdf", "electronic document", "index", "indexing", "dms", "ecm"],
  [X]: ["destroy", "destruction", "shred", "shredding", "dispose", "disposal", "get rid", "discard", "eliminate", "throw away", "certificate of destruction", "recycle", "recycling"],
  [F]: ["microfilm", "microfiche", "microfilming", "reel", "reels", "16 mm", "35 mm", "medical records", "long term", "long-term", "preservation"],
  [H]: ["on site", "on-site", "onsite", "in house", "in-house", "at our premises", "archive staff", "outsourcing", "outsource", "archivist", "staff at our office"],
  [N]: ["urgent", "urgency", "immediate", "express", "today", "same day", "fast", "quick", "asap", "right now", "rapid", "dispatch"],
};

type Rule = { id: string; kws: string[]; w?: number };
const RULES: Rule[] = [
  { id: "precio", kws: ["price", "prices", "cost", "costs", "how much", "rate", "rates", "fee", "fees", "pricing", "budget", "cheap", "expensive"] },
  { id: "cotizar", kws: ["quote", "quotation", "proposal", "hire", "contract", "request service", "estimate"] },
  { id: "tiempo", kws: ["how long", "turnaround", "delay", "lead time", "delivery time", "deadline", "when would"] },
  { id: "cobertura", kws: ["bogota", "colombia", "city", "cities", "medellin", "cali", "barranquilla", "cartagena", "country", "countries", "coverage", "where are you", "where do you operate", "do you work in", "do you operate", "do you serve", "location", "address", "outside bogota", "outside colombia", "regions", "international", "abroad", "worldwide", "latin america", "usa", "united states"] },
  { id: "normativa", kws: ["law", "laws", "regulation", "regulations", "decree", "agn", "general archive", "594", "1080", "527", "2106", "1581", "2527", "compliance", "compliant", "penalty", "penalties", "fine", "fines", "superintendence", "audit", "audits", "legal"] },
  { id: "empresa", kws: ["who are you", "about you", "your history", "track record", "how many years", "1983", "ecopetrol", "mission", "vision", "values", "about transarchivos"] },
  { id: "seguridad", kws: ["security", "secure", "safe", "confidential", "confidentiality", "privacy", "data protection", "personal data", "theft", "loss", "fire", "humidity", "surveillance", "cctv", "access"] },
  { id: "mido", kws: ["mido", "software", "platform", "system", "application", "traceability", "track", "locate document", "real time"] },
  { id: "sostenibilidad", kws: ["sustainable", "sustainability", "environmental", "carbon footprint", "circular economy", "esg", "green", "ecological"] },
  { id: "diagnostico", kws: ["assessment", "diagnosis", "diagnostic", "not sure what i need", "where to start", "advice", "advise", "guidance", "recommendation", "what do you recommend", "evaluate"] },
  { id: "contacto", kws: ["contact", "phone", "telephone", "number", "call", "email", "mail", "whatsapp", "sales"] },
  { id: "asesor", kws: ["advisor", "adviser", "agent", "human", "real person", "a person", "talk to someone", "speak to someone", "representative", "salesperson"] },
  { id: "certificaciones", kws: ["iso", "9001", "accreditation", "accredited", "quality certification", "certified company"] },
  { id: "empleo", kws: ["job", "jobs", "work with you", "vacancy", "vacancies", "resume", "cv", "internship", "student", "thesis", "research", "university"] },
  { id: "caso", kws: ["my case", "tell you my case", "let me explain"] },
  { id: "pqrs", kws: ["complaint", "claim", "unhappy", "bad service", "petition"] },
  { id: "obj-caro", kws: ["too expensive", "very expensive", "costly", "no budget", "cheaper", "discount"] },
  { id: "obj-interno", kws: ["we do it ourselves", "in-house team", "we have an archivist", "our own staff", "don't need", "do not need", "we already have someone"] },
  { id: "obj-nube", kws: ["cloud", "already in the cloud", "drive", "onedrive", "sharepoint", "google drive", "everything is digital", "already digital"] },
  { id: "obj-confianza", kws: ["don't trust", "do not trust", "how do i know", "guarantee", "guarantees", "what if it gets lost"] },
  { id: "obj-competencia", kws: ["competitor", "competitors", "another company", "other provider", "current provider", "why you", "what sets you apart", "difference"] },
  { id: "saludo", kws: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "greetings"], w: 0.5 },
  { id: "gracias", kws: ["thanks", "thank you", "perfect", "excellent", "great", "ok", "okay", "got it"], w: 0.6 },
  { id: "despedida", kws: ["bye", "goodbye", "see you", "later"] },
  { id: "bot", kws: ["are you a robot", "are you a bot", "are you an ai", "are you human", "chatgpt", "artificial intelligence", "are you real", "who are you", "what is your name"] },
  { id: "inyeccion", kws: ["ignore", "forget your instructions", "previous instructions", "prompt", "act as", "developer mode", "jailbreak", "system"] },
  { id: "ofensa", kws: ["stupid", "idiot", "useless", "garbage", "dumb", "crap", "shit", "fuck"] },
  { id: "fuera", kws: ["football", "soccer", "weather", "recipe", "movie", "joke", "music", "politics", "president", "girlfriend", "boyfriend", "horoscope", "bitcoin", "match"] },
];

const PAINS: { kws: string[]; solution: string }[] = [
  { kws: ["penalty", "fine", "investigation", "agn", "inspection", "superintendence", "not compliant", "non-compliance", "we don't comply"], solution: "cumplimiento" },
  { kws: ["can't find", "cannot find", "we lose time", "searching for documents", "too much paper", "paperwork", "paperless"], solution: "digital" },
  { kws: ["no space", "out of space", "takes up", "warehouse is full", "office is full", "rent", "moving", "relocation", "too many boxes"], solution: "espacio" },
  { kws: ["no staff", "nobody manages", "human resources", "personnel files", "employment records", "archive staff"], solution: "operacion" },
];

export function createJoelEn(kb: JoelKB) {
  const svc = (slug: string) => kb.services.find(s => s.slug === slug);
  const lc = (s: string) => s.toLowerCase();
  const path = (slug: string) => `/en/services/${({ [I]: "document-inventory", [P]: "records-management-program", [M]: "media-vaulting", [C]: "records-storage", [D]: "document-scanning", [X]: "document-destruction", [F]: "microfilm-conversion", [H]: "on-site-records-management", [N]: "rapid-retrieval" } as Record<string, string>)[slug] ?? slug}`;

  const QUOTE = "Get a quote", SERVICES = "Discover the services", FAQS = "Frequently asked questions", HUMAN = "Talk to an advisor", RESET = "Back to start", DIAG = "Start with an assessment", CASE = "Tell you my case";
  const quoteThis = (slug: string): JoelOption => ({ label: "Get a quote for this service", next: "q_volume", set: { service: slug } });
  const diagOpt: JoelOption = { label: DIAG, next: "q_volume", set: { service: "diagnostico" } };
  const seeOpt = (slug: string): JoelOption => ({ label: `See ${svc(slug)?.title}`, next: "info_detail", set: { service: slug } });
  const cotizarOpts = (slug?: string): JoelOption[] => [slug ? quoteThis(slug) : { label: QUOTE, next: "q_service" }, { label: HUMAN, next: "human" }, { label: RESET, next: "reset" }];
  const svcActions = (slug: string): JoelAction[] => [{ label: `See ${svc(slug)?.title}`, icon: "box-arrow-up-right", to: path(slug) }];
  const ask = (slug: string): JoelOption[] => [quoteThis(slug), { label: HUMAN, next: "human" }];

  function serviceAnswer(slug: string, asked: Set<string>): JoelReply {
    const s = svc(slug)!; const d = kb.details[slug];
    if (asked.has("precio") || asked.has("cotizar")) return priceAnswer(slug);
    if (asked.has("tiempo")) return timeAnswer(slug);
    if (asked.has("normativa")) return { intent: "normativa", service: slug, say: [`${s.title} is backed by: ${d.norms.join(", ")}.`, d.reasons.find(r => r.d && /legal|compl|law/i.test(r.t))?.d || d.about || d.intro], actions: svcActions(slug), options: cotizarOpts(slug) };
    if (asked.has("seguridad")) {
      const r = d.reasons.find(r => /secur|storage|protect|data|custody/i.test(r.t + r.d)) ?? d.reasons[0];
      return { intent: "seguridad", service: slug, say: [`On security in ${lc(s.title)}: ${r.d || r.t}`], actions: svcActions(slug), options: cotizarOpts(slug) };
    }
    const say = [`${s.title}: ${d.tagline}`, d.intro, `Some facts: ${d.stats.map(x => `${x.v} ${x.l}`).join(" · ")}.`];
    if (d.modes) say.push(`We offer it in ${d.modes.length === 3 ? "three" : "two"} modes: ${d.modes.map(m => lc(m.t)).join(" or ")}.`);
    return { intent: `svc-${slug}`, service: slug, say, actions: svcActions(slug), options: [quoteThis(slug), { label: "Why choose you?", next: "brain:why you " + s.title }, { label: "See another service", next: "info_list" }] };
  }

  function priceAnswer(slug?: string): JoelReply {
    if (!slug) return { intent: "precio", say: ["We don't work with a fixed price list: every quote depends on the service, the volume and the condition of your archive.", "If you tell me which service you are interested in, I'll explain what its price depends on and which details we need to quote it."], options: [{ label: QUOTE, next: "q_service" }, { label: SERVICES, next: "info_list" }, { label: HUMAN, next: "human" }] };
    const s = svc(slug)!; const q = kb.quote[slug];
    const vars = q ? [q.volumeLabel, ...q.fields.map(f => f.label)].map(lc).join(", ") : "the volume and condition of the archive";
    const say = [`The price of ${lc(s.title)} is not a fixed rate: it is calculated from your information.`, `To quote it we need: ${vars}.`];
    if (slug === C) say.push("One advantage: it turns a fixed cost of space into a variable one, because you pay for the exact volume you store.");
    say.push("Shall we build the request now? It takes a couple of minutes.");
    return { intent: "precio", service: slug, say, options: cotizarOpts(slug) };
  }

  function timeAnswer(slug?: string): JoelReply {
    if (slug === N) return { intent: "tiempo", service: slug, say: ["With the Rapid retrieval service, if the request is filed within business hours, delivery can be the same day.", "It can be digital (PDF document) or physical (dispatch of the original by courier)."], options: cotizarOpts(slug) };
    return { intent: "tiempo", service: slug, say: [`Turnaround times${slug ? ` for ${lc(svc(slug)!.title)}` : ""} depend on the volume and condition of the archive, so the advisor defines them in the proposal.`, "If it is urgent, we have the Rapid retrieval service for priority retrievals and deliveries."], options: [...(slug ? [quoteThis(slug)] : []), seeOpt(N), { label: HUMAN, next: "human" }] };
  }

  function solutionAnswer(id: string): JoelReply {
    const sol = kb.solutions.find(s => s.id === id)!;
    const names = sol.slugs.map(sl => svc(sl)?.title).filter(Boolean).join(" and ");
    return {
      intent: `sol-${id}`, service: sol.slugs[0],
      say: [`I understand. What you describe is a case of «${sol.title.toLowerCase()}».`, sol.desc, `I recommend ${names}. If you are not clear about the state of your archive, the ideal is to start with a document assessment.`],
      actions: [{ label: "See this solution", icon: "lightbulb", href: `#sol-${id}` }],
      options: [{ label: `Get a quote: ${svc(sol.slugs[0])?.title}`, next: "q_volume", set: { service: sol.slugs[0] } }, diagOpt, { label: HUMAN, next: "human" }],
    };
  }

  // Specific questions with their own answer (from the company's documents).
  type Fact = { id: string; need: string[][]; svc?: string; not?: string[]; reply: () => Omit<JoelReply, "intent"> };
  const SK = (slug: string) => [...SERVICE_KEYWORDS[slug], norm(svc(slug)?.title ?? "")];
  const see = (slug: string): JoelAction[] => svcActions(slug);
  const steps = (slug: string) => (kb.details[slug].steps ?? []).map((st, i) => `${i + 1}. ${st.t}${st.d ? `: ${st.d}` : ""}`).join("\n");
  const FACTS: Fact[] = [
    { id: "recomendar", need: [["recommend", "which service", "what do i need", "not sure what", "where to start", "what suits"]], reply: () => ({ say: ["Gladly. Tell me in one sentence what worries you about your archive, for example: «we have no space», «we can't find documents», «we must comply with the law» or «I need a document now».", "If you prefer, the document assessment shows you exactly what you need before investing."], options: [diagOpt, { label: SERVICES, next: "info_list" }] }) },
    { id: "servicios", need: [["services", "what do you do", "what do you offer", "portfolio", "how can you help"]], not: ["storage", "scan", "destr", "microfilm", "inventory", "on site", "rapid", "pgd"], reply: () => ({ say: ["We cover the whole life cycle of your documents with 9 services:", "• To start: Document assessment and Document inventory.\n• To solve: Document scanning, Records management program (PGD) and Microfilm conversion.\n• To protect: Records storage and Media vaulting.\n• To close the cycle and grow: Certified destruction, Rapid retrieval service and On-site service.", "Which one are you interested in? You can also tell me your case and I'll recommend one."], options: [{ label: SERVICES, next: "info_list" }, { label: CASE, next: "brain:tell you my case" }, diagOpt] }) },
    { id: "proceso", need: [["how do you work", "process", "how do i start", "how to start", "steps", "methodology", "how does it work"]], not: ["storage", "scan", "destr", "microfilm", "inventory", "on site", "rapid", "pgd", "quote"], reply: () => ({ say: ["We work in a 4-step journey:", "1. Assessment: we understand what is going on with your archive today.\n2. Solution: we solve it with a tailored project (inventory, scanning, PGD).\n3. Protection: we store it and keep it available.\n4. Expansion: we close the cycle (certified destruction) and handle urgent needs.", "To start, you only need to tell us your need: an advisor proposes the scope."], options: [diagOpt, { label: QUOTE, next: "q_service" }] }) },
    { id: "cotizar-que", need: [["what do i need", "what information", "what details", "what do you ask", "requirements"]], not: ["service do i need"], reply: () => ({ say: ["To quote we need: the service, the approximate volume (boxes, linear metres or number of documents), the location, the urgency and some contact details.", "If you don't know a detail, no problem: an advisor helps you complete it. Shall we build the request?"], options: [{ label: QUOTE, next: "q_service" }, diagOpt] }) },
    { id: "clientes", need: [["clients", "client", "customers", "references", "who have you worked with", "worked with", "companies you serve"]], reply: () => ({ say: ["For confidentiality, we don't share names or information about our clients, nor confirm whether a company works with us. We protect their information as we would protect yours.", "What I can tell you: we serve multinationals, SMEs and micro-enterprises in sectors such as healthcare, finance, insurance, oil, mining, engineering, construction and airlines. If you need references, an advisor can arrange them with the client's authorisation."], options: [{ label: HUMAN, next: "human" }, { label: CASE, next: "brain:tell you my case" }] }) },
    { id: "capacidad", need: [["how many boxes", "how many documents", "capacity", "volume you handle", "millions", "folios", "how many contracts", "figures", "experience do you have"]], reply: () => ({ say: ["In more than 40 years we have stored more than 900 million folios and signed more than 38,000 commercial contracts, all registered in our Mido software.", "For your case, volume is not a problem: storage is scalable and you pay for what you store."], options: [{ label: "Get a quote: Records storage", next: "q_volume", set: { service: C } }] }) },
    { id: "horario", need: [["hours", "opening", "open", "close", "saturday", "sunday", "holiday", "schedule"]], reply: () => ({ say: [`I don't have the exact business hours right now. To confirm them, write to us on WhatsApp at ${WHATSAPP_LABEL} or at info@transarchivos.com.`, "For emergencies, the Rapid retrieval service guarantees same-day delivery if the request is filed within business hours."], actions: [{ label: "Message us on WhatsApp", icon: "whatsapp", href: whatsappUrl() }] }) },
    { id: "whatsapp", need: [["whatsapp", "wsp"]], reply: () => ({ say: [`Of course! Write to us on WhatsApp at ${WHATSAPP_LABEL} and an advisor will reply. You can also write to info@transarchivos.com.`], actions: [{ label: "Message us on WhatsApp", icon: "whatsapp", href: whatsappUrl() }, { label: "Write to us (form)", icon: "envelope-fill", href: contactHref() }] }) },
    { id: "transporte", need: [["pick up", "pickup", "collect", "collection", "transport", "truck", "vehicle", "deliver", "transfer"]], reply: () => ({ say: ["Yes, we collect the documents at your premises with our own logistics and secure transport, with traceability at every stage.", "Magnetic media travel in airtight, fire-resistant cases with numbered seals, in our own GPS-monitored vehicles."], options: [{ label: "Get a quote: Records storage", next: "q_volume", set: { service: C } }, { label: HUMAN, next: "human" }] }) },
    { id: "consulta", need: [["retrieve", "retrieval", "request", "get back", "return", "send me", "access"], ["document", "documents", "file", "files", "box", "boxes", "archive", "storage"]], not: ["copy"], reply: () => ({ say: ["Yes, your stored documents are always available. You can request physical retrieval (we bring them to you) or digital (we scan and send them).", "If it is urgent, the Rapid retrieval service prioritises the search and can deliver the same day if filed within business hours. Only people authorised by your company can request it."], options: [seeOpt(N), { label: HUMAN, next: "human" }] }) },
    { id: "riesgo-bodega", need: [["flood", "fire", "water", "earthquake", "rats", "pests", "theft", "stolen"]], reply: () => ({ say: ["Our warehouses are prepared for that: automated temperature and humidity control, fire prevention and suppression systems, 24/7 monitoring, CCTV surveillance and heavy-duty shelving under the Icontec standard.", "For magnetic media we also use clean-agent suppression (no water) and shielding against electromagnetic fields."], options: ask(C) }) },
    { id: "retencion", need: [["how long", "how many years", "keep", "retain", "retention"], ["must", "should", "have to", "obligation", "mandatory", "invoices", "invoice", "accounting", "contracts", "payroll", "employment", "records", "books"]], reply: () => ({ say: ["How long each type of document must be kept is defined by your Records Retention Schedules (TRD). As a general reference, books and business papers are kept for 10 years in Colombia.", "We help you prepare your TRD and, when a document completes its period, dispose of it securely with a certificate."], options: [seeOpt(P), { label: HUMAN, next: "human" }] }) },
    { id: "trd-que", need: [["retention schedule", "retention schedules", "trd", "tvd", "appraisal schedule"], ["what is", "what are", "what for", "mean", "means"]], reply: () => ({ say: ["The Records Retention Schedules (TRD) are the list of record series of each department, with how long each one must be kept and what to do at the end (keep, scan, microfilm or dispose). The Appraisal Schedules (TVD) do the same for the accumulated archive.", "They are the basis for complying with Law 594 of 2000 and for not keeping more than necessary. We prepare them as part of the Records management program."], options: [seeOpt(P)] }) },
    { id: "pgd-obligatorio", svc: P, need: [["mandatory", "required", "must", "obliged", "private", "applies", "do i need"]], reply: () => ({ say: ["It is mandatory for public entities and for private ones that perform public functions or are supervised by superintendences (Law 594 of 2000 and Decree 1080 of 2015). Not having one can lead to penalties and investigations by the AGN.", "If your company is private without those conditions, it is not mandatory, but highly recommended: it saves space and time, and prepares you for audits and the paperless office."], actions: see(P), options: ask(P) }) },
    { id: "inhouse-sede", need: [["come to", "at my office", "at our office", "at our premises", "at my company", "on site", "on-site", "here at"], ["organize", "organise", "sort", "archive", "staff", "work", "scan", "person", "someone"]], reply: () => ({ say: ["Yes. With the On-site service, technical archive staff work at your premises: they organise, classify, foliate, label, apply your TRD and prepare documents for scanning, storage or disposal.", "Transarchivos handles hiring, replacements and supervision. And if you need to scan without the documents leaving your company, we also do that at your premises."], options: [seeOpt(H), { label: "Get a quote: On-site service", next: "q_volume", set: { service: H } }] }) },
    { id: "organizar", need: [["organize", "organise", "sort", "mess", "messy", "disorganized", "disorganised", "classify", "chaos"], ["archive", "documents", "papers", "boxes", "folders", "files", "records"]], reply: () => ({ say: ["The first step to organise an archive is the Document inventory: we identify, register and classify what there is to know its volume, condition and location.", "With that, your Retention Schedules are defined and you decide what to store, what to scan and what to dispose of. If you prefer us to do it at your premises, there is the On-site service."], options: [seeOpt(I), { label: "Get a quote: inventory", next: "q_volume", set: { service: I } }, seeOpt(H)] }) },
    { id: "deterioro", need: [["mold", "mould", "humidity", "damaged", "deterioration", "deteriorated", "yellow", "torn", "pests", "fading", "wet"]], reply: () => ({ say: ["It is important to act soon. In the document inventory we assess the physical condition of the documents to detect risks of biological deterioration, humidity or structural damage.", "To save the information, they can be scanned or microfilmed, and the originals kept in storage with temperature and humidity control."], options: [seeOpt(I), seeOpt(F), { label: HUMAN, next: "human" }] }) },
    { id: "formatos", svc: D, need: [["format", "formats", "pdf", "tiff", "jpg", "how do you deliver", "deliver", "delivery", "resolution", "dpi"]], reply: () => ({ say: ["We deliver scanned documents as PDF (with searchable text if OCR is included), TIFF or JPG, in colour, black and white or greyscale, from 200 to 600 dpi.", "You receive them in the cloud, on USB, hard drive or integrated into your records management system (DMS/ECM), indexed with the metadata you need."], actions: see(D), options: ask(D) }) },
    { id: "validez", svc: D, need: [["valid", "validity", "legal", "court", "evidence", "replace", "original", "legally"]], reply: () => ({ say: ["Yes, we scan with legal validity, within the framework of Law 527 of 1999 (electronic commerce), Decree 1080 of 2015 and the AGN regulations, and it backs the physical archive in legal proceedings.", "Which originals you can dispose of afterwards depends on your Retention Schedules: we confirm it in the assessment."], actions: see(D), options: ask(D) }) },
    { id: "todo", svc: D, need: [["everything", "all", "100", "complete", "entire", "whole"]], reply: () => ({ say: ["We don't recommend scanning 100%: we prioritise with your Retention Schedules what is frequently consulted, permanently preserved or legally high-risk.", "Historical or rarely used records can stay in physical storage with on-demand scanning. That optimises the budget."], actions: see(D), options: ask(D) }) },
    { id: "destruccion-como", svc: X, need: [["how", "process", "steps", "method"]], reply: () => ({ say: ["This is how document destruction works:", steps(X), "We only destroy what has completed its retention period according to your TRD or a record approved by your archive committee."], actions: see(X), options: ask(X) }) },
    { id: "certificado", need: [["certificate", "certify", "record", "proof", "evidence", "receipt"]], not: ["iso", "quality"], reply: () => ({ say: ["Yes. At the end we deliver a Certificate of Legal Destruction with date, volume, method and traceability, valid before the DIAN, superintendences or ISO audits, together with the handover record of the material."], options: [seeOpt(X), { label: "Get a quote: destruction", next: "q_volume", set: { service: X } }] }) },
    { id: "reciclaje", need: [["what happens", "what do you do", "where does", "recycle", "recycling", "recycled"], ["paper", "material", "destroyed", "shredded", "waste", "residue"]], reply: () => ({ say: ["100% of the shredded paper goes into circular-economy chains, for example to make cardboard or tissue paper. That reduces your carbon footprint and contributes to your company's ESG indicators."], options: [seeOpt(X)] }) },
    { id: "micro-dura", svc: F, need: [["how long", "useful life", "lifespan", "duration", "how many years", "last", "durability"]], reply: () => ({ say: ["Microfilm has a useful life of more than 100 years, and can reach 500 years under optimal conservation conditions."], actions: see(F), options: ask(F) }) },
    { id: "micro-vs", svc: F, need: [["already", "scan", "digital", "difference", "what for", "why", "better"]], reply: () => ({ say: ["They are complementary. Microfilm is immune to technological obsolescence and cyberattacks: it needs no software, equipment or electricity to be read, and the certified copy has the same evidentiary value as the original (Decree 2527 of 1950).", "The ideal strategy is hybrid: microfilm to preserve and scan for daily consultation."], actions: see(F), options: ask(F) }) },
    { id: "custodia-como", svc: C, need: [["how does it work", "how is it", "process", "steps", "what does it consist", "how do you work"]], reply: () => ({ say: ["This is how records storage works:", steps(C), "Every box is barcoded in our Mido software, so it can be located in seconds."], actions: see(C), options: ask(C) }) },
    { id: "donde", need: [["where"]], not: ["address"], svc: C, reply: () => ({ say: ["In our document centre in Bogotá, with heavy-duty shelving under the Icontec standard, CCTV, 24-hour surveillance, access control, temperature and humidity control and fire protection."], actions: see(C), options: ask(C) }) },
  ];

  function matchFact(t: string, words: string[], mem: Memory): Fact | null {
    let best: Fact | null = null, bestScore = 0;
    for (const f of FACTS) {
      if (f.not && f.not.some(k => has(t, words, k))) continue;
      if (!f.need.every(g => g.some(k => has(t, words, k)))) continue;
      let score = f.need.length * 2;
      if (f.svc) {
        const named = SK(f.svc).some(k => k && has(t, words, k));
        if (!named && mem.lastService !== f.svc) continue;
        score += named ? 1.5 : 0;
      }
      if (score > bestScore) { bestScore = score; best = f; }
    }
    return best;
  }

  const RESP: Record<string, (m: Memory, asked: Set<string>) => JoelReply> = {
    precio: m => priceAnswer(m.lastService),
    cotizar: m => m.lastService ? priceAnswer(m.lastService) : { intent: "cotizar", say: ["I'll gladly help you build your request. Which service do you need?"], options: [{ label: QUOTE, next: "q_service" }], actions: [{ label: "Open the full quote tool", icon: "ui-checks", href: "#cotizador" }] },
    tiempo: m => timeAnswer(m.lastService),
    cobertura: () => ({ intent: "cobertura", say: ["We operate mainly in Bogotá, Colombia, where our head office and storage warehouses are located (Cl. 21 # 39A-40).", "We are open to serving companies in other Colombian cities depending on the scope of the project. Tell me where you are and an advisor will assess it."], options: [{ label: HUMAN, next: "human" }, { label: QUOTE, next: "q_service" }] }),
    normativa: m => m.lastService ? serviceAnswer(m.lastService, new Set(["normativa"])) : { intent: "normativa", say: ["We work under Colombia's General Archives Law (Law 594 of 2000) and the regulations of the General Archive of the Nation (AGN), as well as:", "• Decree 1080 of 2015: mandatory PGD for public entities and private ones with public functions.\n• Law 527 of 1999: legal validity of scanning.\n• Law 2106 of 2019 (Anti-red-tape Law): preservation of documents on technical media.\n• Law 1581 of 2012: personal data protection.\n• Decree 2527 of 1950: legal validity of microfilm.", "If you are worried about a penalty or an inspection, the starting point is an assessment of your archive."], actions: [{ label: "See regulatory compliance", icon: "shield-check", href: "#sol-cumplimiento" }], options: [diagOpt, seeOpt(P)] },
    empresa: () => ({ intent: "empresa", say: ["Transarchivos was founded in 1983 and pioneered one of the first centres specialised in document custody in Bogotá.", "Today, with more than 40 years, we offer archival consulting, physical storage and digital transformation, with agile, on-site and immediate services, in strict legal compliance.", "We have served multinationals, SMEs and micro-enterprises in sectors such as healthcare, finance, insurance, oil, mining, construction and airlines."], actions: [{ label: "More about us", icon: "building", to: "/en/about" }], options: [{ label: SERVICES, next: "info_list" }, { label: QUOTE, next: "q_service" }] }),
    seguridad: m => m.lastService ? serviceAnswer(m.lastService, new Set(["seguridad"])) : { intent: "seguridad", say: ["Security is at the centre of what we do: a document centre with 24-hour surveillance and CCTV, access control, environmental monitoring and fire protection.", "Everything is managed with a chain of custody, barcode traceability in our own Mido software and confidentiality agreements, in compliance with Law 1581 of 2012."], options: [seeOpt(C), { label: HUMAN, next: "human" }] },
    mido: () => ({ intent: "mido", say: ["Mido is our own records management software. From the moment a box or file enters our facilities, it records its entry, classifies it and locates it in real time.", "So, when a retrieval is requested, we know the exact coordinates of the document to deliver it physically or digitally in record time, with every step logged."], actions: [{ label: "Read about Mido", icon: "journal-text", to: "/en/blog/mido-records-management-software" }], options: [seeOpt(C), { label: QUOTE, next: "q_service" }] }),
    sostenibilidad: () => ({ intent: "sostenibilidad", say: ["Records management is also sustainability: 100% of the paper we destroy goes into circular-economy chains, and a good PGD stops the unnecessary growth of the archive.", "That reduces your company's carbon footprint and contributes to its ESG indicators."], actions: [{ label: "Read: circular economy", icon: "journal-text", to: "/en/blog/records-management-circular-economy" }], options: [seeOpt(X), { label: QUOTE, next: "q_service" }] }),
    diagnostico: () => ({ intent: "diagnostico", say: ["I recommend starting with a document assessment: we don't ask which service you want, we show you what is going on with your archive today.", "We identify volume and condition, space used, organisation, scanning opportunities, storage needs, final disposition and regulatory risks. With that you decide with real information."], actions: [{ label: "See the assessment", icon: "search", href: "#diagnostico" }], options: [{ label: "Request an assessment", next: "q_volume", set: { service: "diagnostico" } }, { label: CASE, next: "brain:tell you my case" }] }),
    contacto: () => ({ intent: "contacto", say: [`Write to us on WhatsApp at ${WHATSAPP_LABEL} or call us at ${PHONES[0].label}. You can also chat right here with an advisor.`], actions: [{ label: "Chat with an advisor", icon: "headset", crm: true }, { label: "Message us on WhatsApp", icon: "whatsapp", href: whatsappUrl() }, { label: `Call ${PHONES[0].label}`, icon: "telephone", href: `tel:${PHONES[0].tel}` }, { label: "Write to us (form)", icon: "envelope-fill", href: contactHref() }] }),
    asesor: () => ({ intent: "asesor", say: [], handoff: true }),
    certificaciones: () => ({ intent: "certificaciones", say: ["We work under Law 594 of 2000, the AGN regulations and Law 1581 on data protection, and we deliver certificates of destruction and disposal records in every process.", "If your company needs a specific supplier certification, an advisor will confirm the documentation available."], options: [{ label: HUMAN, next: "human" }, { label: "See regulations", next: "brain:regulations" }] }),
    empleo: () => ({ intent: "empleo", say: ["Gladly. Write to us at info@transarchivos.com: if you are a student or researcher, we share archival resources; if you are looking for a job, use the subject «Spontaneous application»."], actions: [{ label: "Write to us (form)", icon: "envelope-fill", href: contactHref({ motivo: "Trabajar con nosotros" }) }], options: [{ label: RESET, next: "reset" }] }),
    caso: () => ({ intent: "caso", say: ["Of course, tell me in your own words what is going on with your archive. For example:", "«We have 800 boxes and there is no room left in the office», «we received a requirement and can't find the supporting documents» or «we want to stop printing»."] }),
    pqrs: () => ({ intent: "pqrs", say: [`I'm sorry about the situation. So your case is registered and handled, write to us at info@transarchivos.com or on WhatsApp at ${WHATSAPP_LABEL} with the details.`], actions: [{ label: "Write to us (form)", icon: "envelope-fill", href: contactHref({ motivo: "Peticiones, quejas o reclamos" }) }, { label: "Message us on WhatsApp", icon: "whatsapp", href: whatsappUrl() }] }),
    "obj-caro": m => ({ intent: "obj-caro", service: m.lastService, say: ["I understand the concern about the budget. It is worth comparing it with what your archive costs you today: office or warehouse space, staff time looking for documents and the risk of a penalty or of losing a supporting document in an audit.", "In storage, for example, you go from a fixed cost of space to a variable one: you pay only for what you store. And not everything has to be scanned: we prioritise with your Retention Schedules.", "An assessment shows you exactly where the savings are before investing."], options: [diagOpt, ...(m.lastService ? [quoteThis(m.lastService)] : []), { label: HUMAN, next: "human" }] }),
    "obj-interno": () => ({ intent: "obj-interno", say: ["It makes sense to handle it internally if your team has the time and the expertise. What we usually see is that the archive grows faster than the team's capacity, and legal and space risks appear.", "If you prefer to keep management inside your company, the On-site service places specialised staff at your premises: Transarchivos handles hiring, replacements and supervision, with no labour liabilities for you."], options: [seeOpt(H), diagOpt] }),
    "obj-nube": () => ({ intent: "obj-nube", say: ["The cloud is very useful, but it is not infallible: ransomware can also encrypt your replicas. That is why a physical copy disconnected from the network (air gap) is the pillar of a disaster recovery plan.", "Besides, digital needs rules: what is kept, for how long and with which metadata. That is defined by a Records management program."], options: [seeOpt(M), seeOpt(P)] }),
    "obj-confianza": () => ({ intent: "obj-confianza", say: ["It is a valid question: you are entrusting us with critical information. We have been in records management for more than 40 years, since 1983, with a policy of zero information loss.", "Every box and file is registered and located in real time in our Mido software, with a chain of custody, 24-hour surveillance and confidentiality agreements. You can ask an advisor for references from clients in your sector."], options: [{ label: HUMAN, next: "human" }, { label: "What is Mido?", next: "brain:mido" }] }),
    "obj-competencia": m => ({ intent: "obj-competencia", service: m.lastService, say: ["What sets us apart: more than 40 years of experience (we pioneered document custody in Bogotá), our own Mido software with real-time traceability, and a comprehensive model that covers the whole cycle: assessment, solution, protection and final disposition.", ...(m.lastService ? [`In ${lc(svc(m.lastService)!.title)} in particular: ${kb.details[m.lastService].reasons[0].d || kb.details[m.lastService].reasons[0].t}`] : [])], options: [{ label: QUOTE, next: "q_service" }, { label: HUMAN, next: "human" }] }),
    saludo: () => ({ intent: "saludo", say: ["Hello! How can I help you? You can tell me what is going on with your archive or choose an option."], options: [{ label: QUOTE, next: "q_service" }, { label: SERVICES, next: "info_list" }, { label: FAQS, next: "faq_list" }] }),
    gracias: () => ({ intent: "gracias", say: ["You're welcome! If you need anything else, I'm here."], options: [{ label: QUOTE, next: "q_service" }, { label: RESET, next: "reset" }] }),
    despedida: () => ({ intent: "despedida", say: [`See you soon! Whenever you want to pick this up again, I'll be here. Remember you can also write to us on WhatsApp at ${WHATSAPP_LABEL}.`] }),
    bot: () => ({ intent: "bot", say: ["I'm Joel, Transarchivos' virtual advisor. I work with the company's information and this site to guide you; I don't replace a human advisor, but I connect you with one whenever you need it."], options: [{ label: HUMAN, next: "human" }, { label: QUOTE, next: "q_service" }] }),
    inyeccion: () => ({ intent: "inyeccion", say: ["I can only help you with records management topics and Transarchivos' services. What do you need to solve with your archive?"], options: [{ label: SERVICES, next: "info_list" }, { label: FAQS, next: "faq_list" }] }),
    ofensa: m => ({ intent: "ofensa", say: m.rude > 1 ? [`I'd rather we keep a respectful conversation. If you wish, you can contact our team directly on WhatsApp at ${WHATSAPP_LABEL}.`] : ["I understand you may be upset. I'm here to help: tell me what you need and we'll find the best solution."], options: [{ label: HUMAN, next: "human" }] }),
    fuera: () => ({ intent: "fuera", say: ["That topic is outside what I handle: I specialise in records management 📁. I can help you organise, scan, store or destroy your company's documents."], options: [{ label: SERVICES, next: "info_list" }, { label: FAQS, next: "faq_list" }] }),
  };

  // Service FAQ (src/data/serviceFaqs.en.ts) that best matches the text.
  function serviceFaqAnswer(text: string, slugs: string[] | null, minScore: number): JoelReply | null {
    const kw = keywordsOf(text);
    let best: { slug: string; f: { q: string; a: string[] } } | null = null, bestScore = 0;
    for (const [slug, fs] of Object.entries(kb.serviceFaqs ?? {})) {
      if (slugs && !slugs.includes(slug)) continue;
      for (const f of fs) {
        const fk = keywordsOf(f.q + " " + f.a.join(" "));
        const sc = kw.filter(w => fk.some(x => stem(x) === stem(w))).length;
        if (sc > bestScore) { bestScore = sc; best = { slug, f }; }
      }
    }
    if (!best || bestScore < minScore) return null;
    const s = svc(best.slug);
    return { intent: "faq", service: best.slug, say: [best.f.a[0]],
      actions: [{ label: `Read the full answer${s ? ` · ${s.title}` : ""}`, icon: "question-circle", to: `${path(best.slug)}#preguntas` }],
      options: [quoteThis(best.slug), { label: "Another question", next: "faq_list" }] };
  }

  function respond(text: string, mem: Memory): JoelReply {
    const r = think(text, mem);
    if (r.service) mem.lastService = r.service;
    mem.lastIntent = r.intent;
    if (!r.intent.startsWith("fallback")) mem.unknownStreak = 0;
    return r;
  }

  function think(text: string, mem: Memory): JoelReply {
    const t = norm(text); const words = t.split(" ").filter(Boolean);
    const learned = load().learned;
    const scores: Record<string, number> = {};
    for (const r of RULES) for (const k of r.kws) if (has(t, words, k)) scores[r.id] = (scores[r.id] || 0) + (r.w ?? 1) * (k.includes(" ") ? 1.5 : 1);
    const svcScore: Record<string, number> = {};
    for (const [slug, kws] of Object.entries(SERVICE_KEYWORDS)) for (const k of kws) if (has(t, words, k)) svcScore[slug] = (svcScore[slug] || 0) + (k.includes(" ") ? 2 : 1.4);
    for (const s of kb.services) if (t.includes(norm(s.title))) svcScore[s.slug] = (svcScore[s.slug] || 0) + 4;
    for (const w of words) { const dest = learned[w]; if (!dest) continue; const [kind, key] = dest.split(":"); if (kind === "service") svcScore[key] = (svcScore[key] || 0) + 2; else if (kind === "intent") scores[key] = (scores[key] || 0) + 2; }
    const painScore: Record<string, number> = {};
    for (const p of PAINS) for (const k of p.kws) if (has(t, words, k)) painScore[p.solution] = (painScore[p.solution] || 0) + 1;
    // "advice" / "advise" ask for guidance, not for a person
    if (scores.asesor && /\badvi(c|s)e\b/.test(t) && !/\badvis(e|o)r\b/.test(t)) delete scores.asesor;
    const topSvc = Object.entries(svcScore).sort((a, b) => b[1] - a[1]);
    const topIntent = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const asked = new Set(Object.keys(scores));
    const refersBack = /\b(that|this service|that service|the same|and how much|and the)\b/.test(t);

    if (scores.inyeccion) return RESP.inyeccion(mem, asked);
    if (scores.ofensa) { mem.rude++; return RESP.ofensa(mem, asked); }
    const fact = matchFact(t, words, mem);
    if (fact) { const r = fact.reply(); return { intent: `fact-${fact.id}`, service: fact.svc, ...r }; }
    const obj = topIntent.find(([id]) => id.startsWith("obj-"));
    if (obj) { if (topSvc[0]) mem.lastService = topSvc[0][0]; return RESP[obj[0]](mem, asked); }
    const topPain = Object.entries(painScore).sort((a, b) => b[1] - a[1])[0];
    if (topPain && (!topSvc[0] || topSvc[0][1] < 4) && !scores.precio) return solutionAnswer(topPain[0]);
    const isQuestion = /\?/.test(text) || /^(what|how|which|when|where|why|can|could|do|does|is|are|should|must|will|would)\b/.test(t);
    if (topSvc[0] && topSvc[0][1] >= 1.4 && isQuestion) {
      const r = serviceFaqAnswer(text, [topSvc[0][0]], 3);
      if (r) return r;
    }
    if (topSvc[0] && topSvc[0][1] >= 1.4) {
      const second = topSvc[1] && topSvc[1][1] >= topSvc[0][1] * 0.8 ? topSvc[1][0] : null;
      const reply = serviceAnswer(topSvc[0][0], asked);
      if (second && reply.intent.startsWith("svc-")) {
        reply.say = [`I see you are interested in ${svc(topSvc[0][0])!.title} and ${svc(second)!.title}; they usually go together.`, ...reply.say.slice(1, 2)];
        reply.options = [seeOpt(topSvc[0][0]), seeOpt(second), diagOpt];
      }
      return reply;
    }
    if (mem.lastService && (refersBack || asked.has("precio") || asked.has("tiempo") || asked.has("normativa") || asked.has("seguridad"))) return serviceAnswer(mem.lastService, asked);
    if (topIntent[0] && RESP[topIntent[0][0]]) return RESP[topIntent[0][0]](mem, asked);
    const kw = keywordsOf(text);
    let bestFaq = -1, bestFaqScore = 0;
    kb.faqs.forEach((f, i) => { const fk = keywordsOf(f.q + " " + f.a); const sc = kw.filter(w => fk.some(x => stem(x) === stem(w))).length; if (sc > bestFaqScore) { bestFaqScore = sc; bestFaq = i; } });
    const svcFaq = serviceFaqAnswer(text, null, Math.max(3, bestFaqScore + 1));
    if (svcFaq) return svcFaq;
    if (bestFaq >= 0 && bestFaqScore >= 2) return { intent: "faq", say: [kb.faqs[bestFaq].a], actions: [{ label: "See all questions", icon: "question-circle", href: "#faq" }], options: [{ label: "Another question", next: "faq_list" }, { label: QUOTE, next: "q_service" }] };
    const post = kb.posts.find(p => { const pk = keywordsOf(p.title + " " + p.excerpt); return kw.filter(w => pk.some(x => stem(x) === stem(w))).length >= 2; });
    if (post) return { intent: "blog", say: [`We have an article about that: «${post.title}».`, post.excerpt], actions: [{ label: "Read the article", icon: "journal-text", to: `/en/blog/${({ "mido-software-gestion-documental": "mido-records-management-software", "gestion-documental-economia-circular": "records-management-circular-economy", "ciclo-de-vida-documental-sostenibilidad": "document-lifecycle-sustainability", "inteligencia-documental-engranaje-maestro": "document-intelligence-master-gear" } as Record<string, string>)[post.slug] ?? post.slug}` }], options: [{ label: QUOTE, next: "q_service" }, { label: RESET, next: "reset" }] };
    if (scores.fuera) return RESP.fuera(mem, asked);
    mem.unknownStreak++;
    mem.pendingWords = kw;
    const p = load(); p.unknown = [text, ...p.unknown].slice(0, 30); save(p);
    if (mem.unknownStreak >= 2) return { intent: "fallback2", say: ["I want to make sure I help you properly. Shall I connect you with an advisor, or would you tell me your case in a few words (for example: «I have 500 boxes and no space»)?"], options: [{ label: HUMAN, next: "human" }, diagOpt, { label: SERVICES, next: "info_list" }] };
    return { intent: "fallback", say: ["I'm not sure I understood. 🤔", "Do you mean one of these options? That way I'll learn for next time."], options: [{ label: QUOTE, next: "q_service" }, { label: SERVICES, next: "info_list" }, { label: FAQS, next: "faq_list" }, { label: HUMAN, next: "human" }] };
  }

  function learn(mem: Memory, dest: string) {
    if (!mem.pendingWords.length) return;
    const p = load();
    for (const w of mem.pendingWords) if (!SERVICE_KEYWORDS[w] && w.length >= 4) p.learned[w] = dest;
    save(p); mem.pendingWords = []; mem.unknownStreak = 0;
  }

  function greeting(): JoelReply {
    const ins = getInsight();
    const base: JoelOption[] = [{ label: QUOTE, next: "q_service" }, { label: SERVICES, next: "info_list" }, { label: FAQS, next: "faq_list" }, { label: HUMAN, next: "human" }];
    const top = ins.topServices[0] ? svc(ins.topServices[0]) : undefined;
    const hi = ins.returning ? "Good to see you again! I'm Joel, Transarchivos' virtual advisor. 👋" : "Hi! I'm Joel, Transarchivos' virtual advisor. 👋";
    if (top && ins.segment === "comprador") return { intent: "saludo-comprador", service: top.slug, say: [hi, `I see you are interested in ${top.title}. Shall I help you finish your quote request?`], options: [{ label: `Get a quote: ${top.title}`, next: "q_volume", set: { service: top.slug } }, ...base.slice(1, 4)] };
    if (ins.segment === "tecnico") return { intent: "saludo-tecnico", say: [hi, top ? `I see you have been reading technical content about ${lc(top.title)}. I can answer regulatory questions or help you put it into practice in your company.` : "I see you are interested in the technical content. I can answer regulatory questions or help you put it into practice in your company."], options: [{ label: "Regulatory questions", next: "brain:regulations" }, diagOpt, ...base.slice(1, 3)] };
    if (top) return { intent: "saludo-interes", service: top.slug, say: [hi, `I notice you have been looking at ${top.title}. Would you like me to explain how it works, or would you rather get a quote?`], options: [{ label: `Discover ${top.title}`, next: "info_detail", set: { service: top.slug } }, { label: `Get a quote: ${top.title}`, next: "q_volume", set: { service: top.slug } }, ...base.slice(2, 4)] };
    return { intent: "saludo", say: [hi, "How can I help you today? You can choose an option or tell me your case in your own words."], options: base };
  }

  return { respond, learn, greeting };
}
