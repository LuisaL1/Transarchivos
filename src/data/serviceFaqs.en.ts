// English version of the service FAQs (serviceFaqs.ts is the source of truth;
// same order and same number of questions per service). Paragraphs starting
// with "1. ", "2. "… are shown as a numbered list. Pending review by Transarchivos.
import type { ServiceFaq } from "@/data/serviceFaqs";

export const SERVICE_FAQS_EN: Record<string, ServiceFaq[]> = {
  "levantamiento-de-inventario": [
    { q: "What is the real financial impact and return on investment for my company when hiring a Document Inventory?",
      a: [
        "An archive without an inventory is an invisible cost centre and a multiplier of inefficiencies. At Transarchivos we demonstrate the return on investment through three immediate pillars:",
        "1. Space optimisation: The inventory lets us identify with technical precision which documents are duplicated or have already completed their legal life cycle, freeing up expensive square metres of office space.",
        "2. Less dead time: An executive or employee loses on average up to 20% of the working day looking for disorganised information. We guarantee that all your information is within reach, quickly and without complications.",
        "3. Prevention of legal contingencies: It avoids costly fines or the loss of legal and commercial disputes for not finding a critical document when it is required. It is not an expense; it is operational and financial protection.",
      ] },
    { q: "How does Transarchivos guarantee that the document inventory complies with the legal regulations in force in Colombia (such as Law 594 of 2000)?",
      a: [
        "In Colombia, records management is strictly regulated by the General Archive of the Nation (AGN) and Law 594 of 2000. Transarchivos does not perform a simple physical count; we structure and identify the information in line with the most rigorous national archival standards.",
        "During the process, we classify the files, determining exactly their volume, state of conservation and document type. This directly feeds your organisation's mandatory archival instruments (such as the Records Retention Schedules, TRD), ensuring your company is 100% protected against audits by regulators, certification bodies (ISO) or requirements from the superintendences.",
      ] },
    { q: "What security and confidentiality protocols does Transarchivos implement when handling highly sensitive corporate information during the process?",
      a: [
        "Information security is our main commitment. At Transarchivos we carry out the inventory under strict chains of custody and confidentiality protocols backed by legal agreements (NDAs) with our highly qualified staff. Every step of the process (from identification on site to registration in our databases) is traceable. In addition, during the inventory we assess the physical condition of the material, detecting in advance risks of biological deterioration, humidity or structural damage, and suggesting immediate restoration or scanning measures to guarantee the continuity and preservation of your business's documentary heritage.",
      ] },
    { q: "Is the document inventory an essential requirement if my organisation's final goal is the full digitisation of its archives?",
      a: [
        "Definitely yes. Scanning a disorganised archive simply moves the physical chaos into the digital environment, which doubles costs and reduces efficiency. The document inventory is the fundamental pillar and the first mandatory step towards a successful digital transformation. By identifying, classifying and weeding the documents with Transarchivos, we define exactly which information is critical to be indexed and scanned intelligently. This optimises the scanning budget, ensuring your company invests only in the information that generates strategic value, and lets search engines find the files instantly in the company's future digital ecosystem.",
      ] },
  ],
  "programa-de-gestion-documental": [
    { q: "What is the real legal and sanctioning risk for my company if we do not have a Records Management Program (PGD)?",
      a: [
        "In Colombia, the PGD is an archival instrument required by law for public entities and for private ones that perform public functions or are supervised by certain superintendences, in line with Law 594 of 2000 and Decree 1080 of 2015. Not having one, or having an outdated document, exposes senior management to financial penalties and investigations by the General Archive of the Nation (AGN) or the competent superintendences. Transarchivos acts as your strategic ally and regulatory shield.",
        "We design, formulate and implement the PGD tailored to your organisation, ensuring rigorous compliance with the regulations in force. This turns a latent legal risk into a solid compliance framework that successfully passes any government audit.",
      ] },
    { q: "How does the PGD designed by Transarchivos improve productivity across all areas of the company?",
      a: [
        "Transarchivos' PGD works as the \"definitive operations manual\" for your company's information. Its goal is to unify the criteria for the production, receipt, distribution, consultation, retention and final disposition of all documents, both physical and electronic. By removing the discretion of each employee or department, we standardise workflows. This translates into drastically shorter response times, more agile information flows between departments and the elimination of rework due to lost or misclassified documents. The PGD does not slow down the operation; it speeds it up within a framework of order and efficiency.",
      ] },
    { q: "How does the medium- and long-term implementation of the PGD reduce the organisation's operating costs?",
      a: [
        "The PGD is one of the investments with the greatest impact on long-term cost efficiency. Its implementation stops the uncontrolled growth of archives through clear policies for the secure and timely disposal of documents that have lost their legal and administrative validity.",
        "This generates direct savings on supplies, physical storage and digital servers. In addition, by integrating sustainability principles, the PGD optimises the use of resources and reduces the company's carbon footprint by rationalising paper production, aligning the company with global trends in environmental responsibility and corporate efficiency.",
      ] },
    { q: "How important is the PGD in our digital transformation strategy and in the adoption of new information technologies?",
      a: [
        "Records management software without a PGD is just an empty, disorganised technological container. Transarchivos' PGD establishes the business rules, the information architecture and the security policies the software must execute.",
        "We define the electronic document life cycle, digital signatures, the necessary metadata and the long-term preservation schemes to ensure digital information keeps its legal validity over time. Transarchivos guarantees that your transition to the paperless office or to hybrid models is legally valid, technologically viable and operationally efficient.",
      ] },
  ],
  "custodia-de-medios-magneticos": [
    { q: "If we already have backups in the cloud, what strategic and business-continuity value does the physical vaulting of magnetic media with Transarchivos add?",
      a: [
        "The cloud is an excellent tool, but it is neither infallible nor immune to sophisticated cyberattacks (such as ransomware, which often encrypts both local systems and their cloud replicas). Media vaulting (LTO tapes, hard drives, backup servers) offers what cybersecurity calls an Air Gap: a traditional physical backup, completely disconnected from the network and inaccessible to hackers.",
        "Transarchivos becomes the pillar of your Disaster Recovery Plan (DRP). In the event of a technological collapse or a data hijacking, we guarantee your company has an identical, secure, offline physical backup to restore operations in the shortest possible time, protecting the financial and reputational survival of your organisation.",
      ] },
    { q: "What technical specifications and specialised infrastructure does Transarchivos have to guarantee that magnetic media do not suffer physical degradation or data loss during storage?",
      a: [
        "We guarantee automated, strict control of temperature and relative humidity 24 hours a day to prevent the degradation of the magnetic medium. In addition, our vaults have shielding against electromagnetic fields, fire-extinguishing systems with clean agents (which put out fire without using water or damaging electronic components) and constant perimeter monitoring. Your information is preserved in an optimal environment that ensures it reads perfectly when required.",
      ] },
    { q: "How does Transarchivos guarantee security, confidentiality and a strict chain of custody during the transport and storage of our magnetic media?",
      a: [
        "At Transarchivos we understand that we are safeguarding your company's most critical asset. That is why we implement an airtight, auditable chain of custody:",
        "1. Secure, controlled transport: The media travel in airtight, fire-resistant security cases with numbered security seals, in the company's own GPS-monitored vehicles.",
        "2. Full traceability: Every movement, from collection at your premises to its location in our vault, is recorded in our system by barcode, generating a transparent audit trail.",
        "3. Rigorous access control: Only staff expressly authorised by your company's senior management, after strict identity validation, may request the delivery or rotation of the media, ensuring full compliance with Law 1581 of 2012 (Personal Data Protection).",
      ] },
    { q: "How does Transarchivos handle the logistics of periodic media rotation, and within which scheduled service windows do you operate?",
      a: [
        "Our logistics operation is structured to integrate in an orderly, predictable way with the routines of your IT team. We set scheduled rotation calendars (daily, weekly or monthly) that run within our business hours.",
        "Our staff exchange the media quickly and systematically directly at your sites; withdrawal, delivery or rotation requests are coordinated in advance with our customer service team. This way, when your technical team needs a magnetic medium for an audit, a restore test or a scheduled update, it is delivered under strict security measures within the agreed times.",
      ] },
  ],
  "custodia-de-archivos": [
    { q: "What is the real economic benefit of outsourcing the storage of our physical records to Transarchivos instead of keeping them at our own premises?",
      a: [
        "Keeping an inactive archive in commercial offices is one of the most inefficient hidden costs for a company. Transarchivos lets you free up valuable square metres of high-cost infrastructure for your core business (workstations, meeting rooms or sales areas).",
        "By outsourcing storage to us, you turn a fixed cost of rent and space administration into a variable, scalable cost: you only pay for the exact volume of boxes you have in storage. You also eliminate the expenses associated with dedicated archive staff, security systems and the upkeep of physical infrastructure.",
      ] },
    { q: "What security, infrastructure and risk-prevention conditions does Transarchivos offer to guarantee the absolute protection of physical documents?",
      a: [
        "At Transarchivos we protect your documentary heritage under the strictest standards of industrial and physical security. Our facilities have:",
        "1. Fire prevention and control systems",
        "2. 24/7 monitoring and security",
        "3. Preventive environmental control",
      ] },
    { q: "How do you guarantee the fast location of a specific document when I need it, and under what service conditions is it delivered?",
      a: [
        "Every box and file that enters Transarchivos is coded with smart barcode systems and linked to our management software.",
        "When your company needs a retrieval, our team processes the request efficiently. You can request the physical retrieval of the document (with secure transport to your offices) or, for greater speed, request the Rapid retrieval service, where we scan the required document and send it to you electronically and securely.",
      ] },
    { q: "How does Transarchivos help us control the growth of the archive and manage the legal disposal of documents that have expired?",
      a: [
        "We work hand in hand with your company's archival instruments (such as the Records Retention Schedules, TRD) to set the legal and administrative expiry dates of your records. Transarchivos will formally notify you so that, under your strict authorisation, we proceed with the secure, certified disposal of the documents.",
      ] },
  ],
  "digitalizacion-de-documentos": [
    { q: "How does Transarchivos guarantee that scanned documents have full legal validity before regulators and court proceedings in Colombia?",
      a: [
        "In Colombia, scanning is not a simple capture of images; it is rigorously regulated by Law 527 of 1999 (Electronic Commerce), Decree 1080 of 2015 and the guidelines of the General Archive of the Nation (AGN).",
        "Transarchivos carries out scanning projects with legal validity. This means we apply strict technical protocols of authenticity, integrity and availability. We ensure the correct indexing of metadata and, where your sector's regulation requires it, the corresponding controls.",
      ] },
    { q: "How does document scanning optimise operational response times and access to information within the company?",
      a: [
        "By turning your physical documents into structured digital assets, we eliminate dead search time and the dependence on physical space. Transarchivos delivers the information organised and indexed by the key criteria your business needs (e.g. ID number, date, contract type, customer name). This lets your staff locate documents quickly through your records management system or the software provided.",
      ] },
    { q: "Should we scan 100% of the company's archives? How does Transarchivos help us optimise the budget for this project?",
      a: [
        "At Transarchivos we advise senior management to apply smart, cost-efficient scanning. Before switching on a scanner, we analyse the life cycle of your information using instruments such as the Records Retention Schedules (TRD). We recommend scanning as a priority the documents with high operational use, those for permanent preservation and those with high legal risk.",
        "For the historical or low-use archive, we implement our model of Physical Storage with On-Demand Scanning, where a document is scanned only when the client requests it. This way we optimise your budget to the maximum, investing only in the information that generates real value for the business.",
      ] },
    { q: "How is the security of the documents guaranteed during the scanning process, and what alternatives do you offer so our daily operation is not interrupted?",
      a: [
        "At Transarchivos we mitigate operational risk through two adaptable modes and a strict chain of custody. We offer:",
        "1. Document scanning (at our operations centre): We transport the archive under strict security protocols and barcodes to our controlled facilities. If during the process your company urgently needs a document, our team locates it on the production line as a priority, scans it and sends it to you electronically.",
        "2. On-site scanning (at your premises): We deploy our expert staff and specialised technology directly to your site. This way the documents never leave your company and your team can consult them immediately if needed.",
      ] },
  ],
  "destruccion-de-documentos": [
    { q: "How does Transarchivos guarantee compliance with the Personal Data Protection Law (Law 1581 of 2012) during the records disposal process?",
      a: [
        "Transarchivos mitigates this risk completely through a closed process of secure, confidential destruction. From the moment the documents are collected at your sites, they enter a strict chain of custody with authorised staff and controlled vehicles. The material undergoes an industrial mechanical shredding process that makes it impossible to reconstruct or read the information, guaranteeing that the confidential data of your customers, employees and partners is never exposed, and legally protecting your company before the SIC and other regulators.",
      ] },
    { q: "What legal support does Transarchivos provide to certify in future audits that a document was legitimately destroyed?",
      a: [
        "In professional records management, what is not recorded and certified does not legally exist. Transarchivos does not carry out arbitrary destructions; the process is executed on the basis of the Records Retention Schedules (TRD) or the disposal records approved by your company's archive committee. Once the procedure is complete, Transarchivos issues a Certificate of Legal Destruction.",
        "This technical and legal document specifies the dates, the volume, the disposal method and the traceability of the record series destroyed. The certificate is your definitive legal support before the DIAN, the Superintendences or any external audit process (such as ISO), demonstrating that your organisation acted in strict compliance with the law and with archival life cycles.",
      ] },
    { q: "How does Transarchivos' destruction service align with our company's sustainability and circular-economy policies?",
      a: [
        "At Transarchivos we turn a legal and security obligation into a sustainability milestone for your organisation. All the paper resulting from the industrial shredding process is compacted and integrated directly into circular-economy and industrial recycling chains.",
        "We guarantee that 100% of the paper residue becomes raw material for new products (such as cardboard or tissue paper), keeping it out of landfills. This helps your company reduce its carbon footprint, optimise the use of natural resources and add positive indicators to its corporate sustainability (ESG) reports.",
      ] },
    { q: "What are the collection logistics for destruction, and what control do we have over the material before it leaves our sites?",
      a: [
        "Our logistics are designed to be agile, clean and frictionless for your operation. Transarchivos coordinates the collection of the documents in advance and checks that the material corresponds only to the documents authorised for destruction.",
        "The number of boxes or document units to be sent is validated and both parties sign a handover record, guaranteeing traceability and the chain of custody. The documents are then transported securely to the facilities where they are destroyed, and finally a certificate of destruction is delivered confirming the secure disposal of the information.",
      ] },
  ],
  "microfilmacion-de-archivos": [
    { q: "What is the strategic value and technical justification for continuing to microfilm records?",
      a: [
        "The cloud and servers are ideal for daily consultation, but they suffer from a critical long-term risk: technological obsolescence (file formats, operating systems and software that change or disappear every decade) and vulnerability to massive cyberattacks.",
        "Microfilm is the only long-term preservation medium that guarantees a useful life of up to 500 years under optimal conservation conditions. It needs no software, specific hardware or electricity to be read; a light source and a magnifying glass are enough. For senior management, microfilming does not compete with digital; it complements it. While digital solves immediate access, microfilm ensures the survival of the company's historical, shareholder and legal heritage for the next generations, completely immune to any computer virus or technological blackout.",
      ] },
    { q: "What backing and legal validity do documents microfilmed by Transarchivos have in legal proceedings, before regulators and in audits in the country?",
      a: [
        "In Colombia, microfilming has an exceptionally solid and mature legal foundation, backed by Decree 2527 of 1950 and Law 594 of 2000. The law gives copies and prints obtained from certified microfilm the same evidentiary value and legal validity as the original paper document.",
        "Transarchivos performs this process under strict quality-control protocols (density and chemical residue tests) and includes opening and closing records within the reel that guarantee the integrity of the information from the first frame. This gives your company absolute legal protection: if the original paper deteriorates or is destroyed within the legal periods, the certified microfilm keeps the company's full validity and legal force before any court or regulator.",
      ] },
    { q: "How does the microfilmed archive interact with the company's day-to-day processes to avoid operational delays in retrievals?",
      a: [
        "At Transarchivos we implement what senior management calls a hybrid information strategy, maximising the return on investment. The process does not slow down the operation; it optimises it. Using state-of-the-art technology, we run processes in parallel: the document is microfilmed (to ensure its long-term legal preservation) and at the same time scanned and indexed. This way your team consults the digital archive in seconds from their computer for daily operations, while the microfilm reel is stored ultra-securely as an unalterable master backup. This optimises the total cost of ownership of the information, giving the company the best of both worlds: digital immediacy and the perpetual security of microfilm.",
      ] },
    { q: "What logistics and custody protocols does Transarchivos use to transfer and process documents for permanent preservation?",
      a: [
        "Highly sensitive material is collected at your premises on a scheduled basis using secure transport and the company's specialised staff. Once it enters our micrographics laboratory, it is inventoried and processed under strict physical and environmental security measures.",
        "Throughout the project cycle you have full visibility of the status of your documents. Once microfilmed, the originals are returned safely to your offices or moved to our specialised storage vaults, according to the strategic decision your organisation makes.",
      ] },
  ],
  "servicio-inhouse": [
    { q: "How does Transarchivos handle the hiring and supervision of on-site staff to guarantee there are no information-security risks or labour liabilities for our company?",
      a: [
        "At Transarchivos we take on the role of employer autonomously and exclusively. All our staff assigned to your organisation are hired in strict compliance with Colombian labour law, with all social benefits, social security and payroll contributions up to date. We keep direct technical and administrative subordination over our staff through external supervisors and account coordinators.",
        "This means Transarchivos handles selection, training, replacements for sick leave or holidays, and performance reviews. Your company gets the benefit of an expert on-site team, completely eliminating any security risk, labour liability or administrative burden for your Human Resources department.",
      ] },
    { q: "What added value does Transarchivos' on-site staff bring compared with having an archive team hired directly by us?",
      a: [
        "The big difference lies in specialisation and productivity. When you hire general archive staff directly, your company has to invest time and resources in training them in technical standards, and they usually lack expert archival supervision.",
        "Transarchivos provides duly qualified records management professionals and technicians, trained under the guidelines of the General Archive of the Nation (AGN) and the sector's best practices. Our learning curve is minimal because we immediately implement standardised methodologies and time-control tools. This turns a typically slow area into an agile internal service centre, with measurable management indicators (KPIs) that ensure the information is available to your users in record time.",
      ] },
    { q: "How does Transarchivos guarantee the continuity of the on-site service when staff are absent, and under what supervision schemes do you operate?",
      a: [
        "We guarantee the absolute continuity of your operation, adapting to the working hours agreed with your company. If an on-site analyst is on sick leave, has an emergency or leaves, Transarchivos activates a contingency protocol to fill the vacancy with staff previously trained in your account's processes, avoiding operational gaps. The whole service is backed by job and procedure manuals designed by our project coordinators, who carry out periodic technical audit visits. Transarchivos delivers monthly management reports that demonstrate compliance with the service level agreements (SLAs).",
      ] },
    { q: "Why is it better to hire an on-site service with Transarchivos than to have our own records manager?",
      a: [
        "More than hiring a records manager, with Transarchivos' on-site service your company gains the backing of more than 40 years of experience in records management. That means specialised professionals, proven methodologies and the permanent support of an expert team that guarantees efficient processes aligned with the regulations. Transarchivos also handles the selection, training and continuity of the staff, avoiding interruptions due to absences and letting your organisation focus on its core activity while records management is in the hands of specialists. It is a safer, more flexible and more cost-effective solution than depending on a single internal resource.",
      ] },
  ],
  "servicio-inmediato": [
    { q: "How does the Rapid retrieval service support us in a surprise audit or an urgent legal requirement?",
      a: [
        "Transarchivos' Rapid retrieval service is designed precisely to work as your emergency response channel (logistical disaster recovery). When your senior management or legal team activates this priority service, we interrupt the conventional distribution flows to focus exclusive resources on your requirement.",
        "We immediately locate the file in our automated warehouses and dispatch the information in record time, ensuring your company responds to the contingency with complete punctuality and institutional solvency.",
      ] },
    { q: "What modes does Transarchivos' Rapid retrieval service offer to speed up the delivery of the required information as much as possible?",
      a: [
        "We understand that in an emergency every minute counts. That is why the Rapid retrieval service operates in two strategic modes depending on the nature of the need:",
        "1. Priority on-demand scanning (the fastest option): We locate the physical document at our facilities, move it to our scanning centre and scan it in high resolution. The indexed electronic file is securely uploaded to your platform or sent encrypted to your team, eliminating physical travel times.",
        "2. Express physical dispatch: If your organisation strictly requires the original (with wet signatures and stamps), we activate a priority transport unit to deliver the document in its physical form under strict security conditions and a direct chain of custody to your offices.",
      ] },
    { q: "How are Rapid retrieval requests coordinated within Transarchivos' business hours to guarantee same-day delivery?",
      a: [
        "Our logistics and customer-service infrastructure is calibrated to process and dispatch urgent requirements with total agility within our working day.",
        "To ensure the effectiveness and fulfilment of same-day express delivery, priority requests must be filed and validated through our preferential customer-service channel within this time window. On receiving the alert in our systems, the floor team carries out the immediate search and prepares the material. This lets us optimise dispatch times and ensure that, for both the digital and the physical option, the information reaches your company's decision-maker on time and without operational gaps before the end of your working day.",
      ] },
    { q: "What control and governance mechanisms does Transarchivos offer to avoid extra costs from improper or unjustified use of the Rapid retrieval service?",
      a: [
        "The Rapid retrieval service should be a strategic resource. At Transarchivos we protect your company's budget by implementing strict authorisation protocols and user profiles.",
        "During the set-up of the service, we agree with senior management who are the only people in the company (usually area directors, legal representatives or compliance officers) with the authority to authorise and request an express dispatch.",
      ] },
  ],
};
