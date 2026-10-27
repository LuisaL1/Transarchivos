// English version of the blog articles (blog.ts is the source of truth: same
// slugs, covers and order). The dates in English are only for display; the
// publication date for search engines comes from the Spanish article.
// Pending review by Transarchivos.
import imgInteligencia from "@/assets/images/blog/inteligencia-documental.jpg";
import imgMido from "@/assets/images/blog/mido.jpg";
import imgCiclo1 from "@/assets/images/blog/ciclo-vida-1.jpg";
import imgCiclo2 from "@/assets/images/blog/ciclo-vida-2.jpg";
import imgEco1 from "@/assets/images/blog/economia-circular-1.jpg";
import imgEco2 from "@/assets/images/blog/economia-circular-2.jpg";
import type { Post } from "@/data/blog";

export const blogPostsEn: Post[] = [
  {
    slug: "mido-software-gestion-documental",
    title: "Mido – Transarchivos' records management software",
    cat: "Technology",
    date: "August 3, 2026",
    cover: imgMido,
    excerpt:
      "How do we protect the memory of Colombian companies without ever losing a document? Meet Mido, the in-house software with which we register and locate every file in real time.",
    blocks: [
      { t: "h2", text: "How do we protect the memory of Colombian companies without ever losing a document?" },
      { t: "p", text: "For the senior management of any organisation there is an invisible but deeply critical asset: corporate information and the way it is safeguarded. Over the years, contracts, files, invoices and historical records pile up and become the operational heart of the company. Yet delegating the custody of this volume of documents usually raises a natural concern among executives: where exactly is our information, and how secure is the control we have over it?" },
      { t: "p", text: "At Transarchivos we understand that storing a document is not simply taking up physical space, but taking on the operational continuity of our clients. That is why, over four decades (40 years) of uninterrupted work, we have successfully indexed and managed millions of documents and records of Colombian companies, perfecting a comprehensive management model that combines the warmth of a close service with the uncompromising precision of technology." },
      { t: "p", text: "The fundamental pillar that makes this guarantee of peace of mind possible is Mido, our own records management software, a tool developed in-house to solve simply what used to be complex. Its impact on the daily life of organisations is tangible and direct. Mido works as the great structural heart of our whole operation: from the instant a file or a box enters our facilities, the system records its entry, assigns a precise classification and establishes a detailed map that lets us know, with absolute certainty and in real time, what we have in our custody and exactly where it is." },
      { t: "p", text: "Through this exclusive platform, our clients enjoy a complete, personalised records management cycle designed to accompany the information at each of its stages. The process ranges from the initial classification and technical arrangement of the document holdings to specialised storage in high-security facilities. It also covers the administration of the central and historical archive, final disposition and secure destruction under the legal regulations. The real advantage of having our own system like Mido is that each of these steps is rigorously logged in a digital record. An archive in custody must never be an inaccessible repository, but an available resource; that is why, when a document retrieval is requested, the system locates the exact coordinates of the document to coordinate its physical delivery or digital access in record time, eliminating any margin for loss." },
      { t: "p", text: "Supporting the decision-making of senior management demands standards that go beyond the conventional. Our whole operation is governed by the Transarchivos Quality Guarantee, an institutional commitment founded on auditable processes, specialised infrastructure, strict regulatory compliance and a policy of zero information loss sustained over 40 years. Knowing that millions of records have passed through our hands without neglecting a single folio is the strongest proof that we are the most reliable and appropriate partner for records management in the Colombian business sector." },
      { t: "h2", text: "Still have doubts about the custody of your information?" },
      { t: "p", text: "If your company still keeps records at its own premises without proper control, or if you are worried about taking the step towards external storage for fear of losing visibility of your documents, we invite you to see the Transarchivos standard first-hand." },
      { t: "p", text: "Let us show you how the Mido software and our team of specialists can turn the handling of your information into an agile, secure and 100% traceable process. Contact us today to schedule your document assessment and discover why the most demanding organisations in Colombia trust us to protect their most valuable asset." },
    ],
  },
  {
    slug: "gestion-documental-economia-circular",
    title: "The paper cycle that never ends: can records management drive the circular economy in Colombia?",
    cat: "Sustainability",
    date: "August 18, 2026",
    cover: imgEco1,
    excerpt:
      "The mass of documents generated by the business sector is usually seen as an unavoidable waste. Under a sustainable model, archives become an asset for reducing the carbon footprint.",
    blocks: [
      { t: "p", text: "Colombian companies face an operational and tax crossroads: the need to be cost-efficient while meeting increasingly strict environmental sustainability commitments and the National Government's circular-economy regulations. In this scenario, the mass of documents, files and physical inventories generated by the business sector is usually seen as a mere regulatory requirement or an unavoidable waste. However, when corporate archives are managed under a sustainable model, they become a key asset for reducing the carbon footprint and maximising operational efficiency." },
      { t: "h2", text: "Analysing the question: the paradox of corporate paper" },
      { t: "p", text: "According to Colombia's Ministry of Environment and Sustainable Development and the national circular-economy reports, the consumption of paper and cardboard in the productive sector still represents a substantial share of recoverable solid waste. Producing a single tonne of virgin paper requires approximately:" },
      { t: "ul", items: ["17 mature trees.", "26,000 litres of water.", "More than 4,000 kilowatt-hours (kWh) of energy."] },
      { t: "p", text: "For a country with more than 1.7 million registered companies, the inefficient accumulation of documents, duplicate physical copies and final disposal without ecological criteria not only overload landfills, but generate massive logistical overheads from unproductive storage." },
      { t: "p", text: "The circular economy proposes replacing the linear model (extract, make, use and throw away) with a regenerative one based on reducing, reusing, digitising and recycling. In B2B records management, this approach demands answers in three key dimensions:" },
      { t: "ul", items: [
        { b: "Efficiency at the source", t: "Minimising the printing of non-essential documents through capture tools and digital workflows." },
        { b: "An optimised life cycle", t: "Storage of files in controlled environmental conditions that prevent premature deterioration and extend the usefulness of the information without excessive energy consumption." },
        { b: "Secure, circular final disposition", t: "Certified confidential destruction that returns paper pulp to the industrial production chain as raw material." },
      ] },
      { t: "h2", text: "Transarchivos' answer: 40 years turning custody into sustainability" },
      { t: "p", text: "The answer to this problem does not lie solely in trying to eliminate paper overnight (an unrealistic goal for most regulated sectors in Colombia), but in governing the complete information cycle with environmental responsibility and legal rigour." },
      { t: "p", text: "For more than 40 years, Transarchivos has acted as a strategic partner of Colombian companies, implementing a Records Management Program (PGD) designed to integrate the circular economy into every phase of information handling:" },
      { t: "ul", items: [
        { b: "Strategic scanning", t: "Data processing and capture that reduces the need for printed duplicates, speeding up the transition to an optimised office." },
        { b: "Optimised storage and inventories", t: "Storage centres designed to maximise storage density, reducing the land and water footprint associated with in-house storage infrastructure." },
        { b: "Secure destruction with a circular approach", t: "When the document life cycle is completed according to the retention schedules (TRD) authorised by law, the documents undergo confidential industrial shredding. All the fibrous residue is reinjected into the national paper industry as recycled material, fully closing the production cycle." },
      ] },
      { t: "img", src: imgEco2, alt: "Transarchivos archive boxes stacked in the storage centre" },
      { t: "p", text: "Through the handling of thousands of companies and institutions across the country, Transarchivos has ensured that written-off documentary material does not end up in landfills, helping to preserve thousands of hectares of forest and significantly reducing water consumption in the country's industrial processes." },
      { t: "h2", text: "Optimise your resources today" },
      { t: "p", text: "A structured Records Management Program not only ensures compliance with the regulations of the General Archive of the Nation (AGN) and ESG (Environmental, Social and Governance) metrics, but frees up operating capital and physical space in your organisation. Make your company's information respond to the challenges of today's market with the backing of more than four decades of proven experience from Transarchivos." },
      { t: "p", text: "Discover how to implement a Sustainable Records Management Program for your company: visit our services section at www.transarchivos.com and request specialised consulting from our team of expert archivists." },
    ],
  },
  {
    slug: "ciclo-de-vida-documental-sostenibilidad",
    title: "The document life cycle and environmental sustainability: how to reduce the corporate carbon footprint in Colombia",
    cat: "Sustainability",
    date: "August 6, 2026",
    cover: imgCiclo1,
    excerpt:
      "In the era of digital transformation and ESG criteria, managing archives stopped being a simple matter of physical storage and became a strategic pillar of sustainability and corporate compliance.",
    blocks: [
      { t: "p", text: "In the era of digital transformation and ESG (Environmental, Social and Governance) criteria, managing archives stopped being a simple matter of physical storage and became a strategic pillar of sustainability and corporate compliance." },
      { t: "p", text: "Every printed sheet, misplaced file or saturated server has a direct impact on the environment and on your organisation's finances. Properly managing a document's life cycle under ecological parameters is today a key decision for modernising processes, complying with the law and protecting the planet." },
      { t: "h2", text: "The challenge in Colombia: the hidden impact of paper in companies" },
      { t: "p", text: "According to official figures from DANE's Environmental Satellite Account and reports from Colombia's industrial sector, the country generates more than 11 million tonnes of waste a year, of which only about 17% is recovered or recycled. In the office environment, an average employee can consume thousands of sheets of paper a year, a significant share of which ends up filed without control or disposed of improperly." },
      { t: "p", text: "This consumption not only translates into high operating costs for supplies and the rental of unnecessary square metres; it also increases the carbon footprint through the transport, storage and final disposal of documents." },
      { t: "h2", text: "Legal and environmental framework: regulatory backing for your company" },
      { t: "p", text: "To guarantee efficient, ecological document handling, organisations in Colombia must align their processes with a clear legal and institutional framework:" },
      { t: "ul", items: [
        { b: "Law 594 of 2000 (General Archives Law)", t: "Issued through the General Archive of the Nation (AGN), it sets the mandatory guidelines for categorising, preserving and managing public documents, and private ones with public functions, at their different stages of life." },
        { b: "ISO 14001:2026 standard", t: "The update of the international standard for Environmental Management Systems requires companies to control and reduce the environmental impact of all their operating processes, including the administration of office resources and waste treatment." },
      ] },
      { t: "p", text: "Complying with the regulations not only avoids legal penalties; it ensures that every document completes its natural cycle without generating overheads or waste." },
      { t: "h2", text: "The 3 phases of the document life cycle with a green approach" },
      { t: "p", text: "Through specialised records management, an archive passes through three key stages, optimising resources and guaranteeing the circular economy:" },
      { t: "img", src: imgCiclo2, alt: "Infographic: the document life cycle with an environmental approach — active, semi-active and inactive phases" },
      { t: "p", lead: "1. Active phase (current records) — creation and digital control", text: "This is when documents are created or received for the company's daily business." },
      { t: "ul", items: [
        { b: "The problem", t: "Excessive printing, unnecessary duplicates and disorder in the workflow." },
        { b: "The Transarchivos solution", t: "We implement capture, indexing and cloud backup solutions. This allows files to be scanned in bulk and electronic documents to be used, reducing the unnecessary use of paper by up to 40% from the start." },
      ] },
      { t: "p", lead: "2. Semi-active phase (central archive) — efficient storage and custody", text: "This covers documents that are no longer consulted daily but must be kept for several years for tax, commercial or legal reasons." },
      { t: "ul", items: [
        { b: "The problem", t: "Offices saturated with boxes of paper, taking up useful space that needs lighting, air conditioning and continuous maintenance." },
        { b: "The Transarchivos solution", t: "We move your physical records to our specialised secure storage centres. We free up to 25% of the useful space in your offices, reducing energy consumption and optimising retrieval logistics thanks to our on-demand scanning service." },
      ] },
      { t: "p", lead: "3. Inactive phase (historical archive or final disposition) — ecological destruction or preservation", text: "This is reached when the retention period set in the Records Retention Schedule (TRD) is completed." },
      { t: "ul", items: [
        { b: "The problem", t: "Burning files or throwing them in with ordinary rubbish, which exposes the company's confidential data and pollutes the environment." },
        { b: "The Transarchivos solution", t: "We carry out the confidential, secure destruction of paper through authorised mechanical processes, delivering the shredded raw material to the paper industry for certified recycling. If the archive has historical value, we guarantee its technical, permanent preservation." },
      ] },
      { t: "h2", text: "Transarchivos' differential value: leadership in storage and ecological destruction" },
      { t: "p", text: "For 40 years, Transarchivos has been the strategic partner of thousands of Colombian companies in the custody, organisation and protection of their information assets. Our commitment goes beyond storing boxes: we lead the transition to sustainable archives. We have maximum-security storage infrastructure, advanced indexing technologies and a green destruction model that guarantees the return of destroyed paper to circular-economy chains, avoiding tonnes of CO₂ emissions." },
      { t: "p", text: "Take control of your documents and reduce your carbon footprint. Efficient records management is not an expense; it is an investment in productivity, legal certainty and environmental responsibility for your company. Let the experts at Transarchivos, backed by 40 years of experience in the Colombian market, design a plan tailored to your needs." },
    ],
  },
  {
    slug: "inteligencia-documental-engranaje-maestro",
    title: "Why is Document Intelligence the master gear of efficient companies?",
    cat: "Document intelligence",
    date: "June 24, 2026",
    cover: imgInteligencia,
    excerpt:
      "It is Monday at 8:00 a.m. and an unscheduled audit knocks on the door. To respond you only need three key documents… how long would it take you to find them?",
    blocks: [
      { t: "p", text: "Picture this for a second: it is Monday at 8:00 a.m. An unscheduled audit knocks on your company's door, or worse, a million-dollar tender opportunity comes up that closes in 24 hours. To respond, you only need three key documents. Three!" },
      { t: "p", text: "In theory it seems easy. In practice, a race against the clock begins in which two executives search through messy digital folders, an assistant digs through boxes of physical records in the warehouse and the operations director tries to remember which of the seven versions saved in their email is the final approved one." },
      { t: "p", text: "The result: lost hours, accumulated frustration, stress at the limit and, often, an opportunity that evaporates." },
      { t: "p", text: "This scene (repeated daily in thousands of institutions, start-ups and large corporations) reveals a silent but destructive symptom: the lack of Document Intelligence." },
      { t: "h2", text: "What exactly is Document Intelligence, and why is it not “just filing documents”?" },
      { t: "p", text: "For decades, records management was wrongly seen as a necessary evil: that dark room at the back of the office full of swamped folders and old boxes, or a cloud folder called “Miscellaneous Documents 2024”." },
      { t: "p", text: "Today that approach is extinct. Document Intelligence is the strategic evolution of custody and information. It is the technical, technological and operational capacity to capture, process, classify, protect and access an organisation's information precisely and instantly." },
      { t: "p", text: "It is not only about keeping papers or scanning files into PDF; it is about turning the document flow into structured data at the service of decision-making." },
      { t: "h2", text: "The gear effect: synergy between departments" },
      { t: "p", text: "A company works exactly like a precision watch. When Document Intelligence is embedded in the corporate DNA, it acts as the lubricant that lets every department turn in perfect harmony:" },
      { t: "ul", items: [
        { b: "Finance and Accounting", t: "Radically shortens response times for tax reviews, internal audits or account reconciliations." },
        { b: "Human Resources", t: "Keeps exact traceability of employment records, contracts and certifications, protecting the organisation from legal contingencies." },
        { b: "Legal and Compliance", t: "Guarantees regulatory rigour, respect for personal data protection and the strict application of the Records Retention Schedules (TRD)." },
        { b: "Operations and Sales", t: "Speeds up the signing of contracts, the consultation of commercial background and the instant approval of projects." },
      ] },
      { t: "p", lead: "The real impact:", text: "When information flows without friction, management decisions go from taking days to taking minutes." },
      { t: "h2", text: "The invisible cost of improvising: saving time and money" },
      { t: "p", text: "It is often thought that implementing formal document administration solutions is an expense. The reality is that the real cost lies in improvisation." },
      { t: "table", head: ["Dimension", "With disorganised information", "With Document Intelligence"], rows: [
        ["Search time", "Between 18 and 25 minutes on average per file.", "Search and retrieval in a matter of seconds."],
        ["Operating costs", "Duplicate documents, inefficient physical storage, regulatory fines.", "Space optimisation, strategic scanning and zero penalties for non-compliance."],
        ["Business continuity", "High risk of loss from incidents or information leaks.", "Secure storage, backup copies and technical indexing."],
      ] },
      { t: "p", text: "Saving time in document retrieval translates directly into hours of high-value work recovered for your managers and staff. And in the B2B world, recovered time is direct profit margin." },
      { t: "h2", text: "The human factor: why qualified staff are needed" },
      { t: "p", text: "Technology is an extraordinary ally (today, solutions driven by artificial intelligence are transforming the way we process information), but it does not work in a vacuum. For Document Intelligence to be sustainable over time, it needs the leadership of archival and records management professionals." },
      { t: "p", text: "Having qualified staff guarantees:" },
      { t: "ol", items: [
        { b: "Technical judgement", t: "The correct structuring, classification and appraisal of the company's documentary heritage." },
        { b: "Security and confidentiality", t: "Clear protocols to control who accesses which information and when." },
        { b: "A firm step towards digital transformation", t: "An orderly process in which scanning responds to real operational needs and not to the simple impulse to scan without methodology." },
      ] },
      { t: "h2", text: "Is your organisation ready to take the next step?" },
      { t: "p", text: "Being prepared is not a matter of luck; it is a management decision. Document Intelligence is not a luxury reserved for multinationals; it is the backbone that lets any company, large or growing, build solid foundations to scale safely." },
      { t: "p", text: "At Transarchivos we help organisations turn the management of their business documents into a real competitive advantage. From specialised physical storage and the technical application of organisation tools to advanced scanning and integration processes, we structure solutions tailored to the challenges of your sector." },
      { t: "p", text: "Make your company's gears work with the precision today's market demands." },
      { t: "h2", text: "Shall we talk about your company's records management?" },
      { t: "p", text: "Discover how to boost your organisation's operational efficiency with the backing of experts in business document solutions. Contact Transarchivos' team of specialists today and let's design the right strategy for your organisation together." },
    ],
  },
];
