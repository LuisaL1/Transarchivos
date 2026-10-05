// ─── Joel: "cerebro" local del asesor virtual ──────────────────────────────
// Funciona sin IA externa. Tiene tres partes:
//  1. Perfil del visitante: registra en el navegador (localStorage, nunca sale
//     del equipo) qué secciones, servicios y artículos ve, qué busca y qué
//     pregunta. Con eso detecta tendencias (interés por un servicio, visitante
//     técnico que solo lee contenido, visitante listo para cotizar, recurrente).
//  2. Motor de intenciones: normaliza el texto, tolera errores de tipeo,
//     puntúa palabras clave y sinónimos, recuerda de qué servicio se venía
//     hablando y combina varias intenciones (p. ej. "precio" + "digitalización").
//  3. Aprendizaje: cuando no entiende algo y el visitante elige después una
//     opción, asocia esas palabras a esa opción para la próxima vez.
// El conocimiento (servicios, preguntas frecuentes, soluciones, blog…) lo
// entrega la app al crear el motor, para que haya una sola fuente de verdad.

export type JoelAction = { label: string; icon: string; href?: string; to?: string };
export type JoelOption = { label: string; next: string; set?: Record<string, string> };
export type JoelReply = { say: string[]; actions?: JoelAction[]; options?: JoelOption[]; intent: string; service?: string };

export type JoelKB = {
  services: { slug: string; title: string; desc: string; tag: string }[];
  details: Record<string, { tagline: string; intro: string; stats: { v: string; l: string }[]; benefits: string[]; reasons: { t: string; d: string }[]; modes?: { t: string; d: string }[]; norms: string[]; steps?: { t: string; d: string }[] }>;
  faqs: { q: string; a: string }[];
  solutions: { id: string; title: string; problem: string; desc: string; slugs: string[] }[];
  posts: { slug: string; title: string; cat: string; excerpt: string }[];
  quote: Record<string, { volumeLabel: string; fields: { label: string }[] }>;
  quoteUnit: Record<string, string>;
};

// ─── 1. Perfil del visitante ────────────────────────────────────────────────

type Profile = {
  visits: number; first: number; last: number;
  counts: Record<string, number>;      // "section:faq", "service:slug", "article:slug", "quote:slug", "chat:intent"
  searches: string[];
  learned: Record<string, string>;     // palabra → destino ("service:slug" | "step:id" | "intent:x")
  unknown: string[];                   // preguntas que no supo responder (para revisar)
};
const KEY = "ta-joel-profile";
const empty = (): Profile => ({ visits: 0, first: Date.now(), last: Date.now(), counts: {}, searches: [], learned: {}, unknown: [] });

function load(): Profile {
  try { const p = JSON.parse(localStorage.getItem(KEY) || "null"); if (p && typeof p === "object") return { ...empty(), ...p }; } catch { /* sin almacenamiento */ }
  return empty();
}
function save(p: Profile) { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* sin almacenamiento */ } }

/** Registra una visita (una vez por sesión del navegador). */
export function trackVisit() {
  try { if (sessionStorage.getItem("ta-joel-visit")) return; sessionStorage.setItem("ta-joel-visit", "1"); } catch { /* */ }
  const p = load(); p.visits += 1; p.last = Date.now(); save(p);
}
/** Registra un evento: track("section", "faq"), track("service", slug)… */
export function track(kind: "section" | "service" | "article" | "quote" | "chat", key: string) {
  const p = load(); const k = `${kind}:${key}`;
  p.counts[k] = (p.counts[k] || 0) + 1; p.last = Date.now(); save(p);
}
export function trackSearch(q: string) {
  const t = q.trim(); if (t.length < 3) return;
  const p = load(); p.searches = [t, ...p.searches.filter(x => x !== t)].slice(0, 15); save(p);
}

type Insight = {
  returning: boolean;
  segment: "tecnico" | "comprador" | "explorador";
  topServices: string[];
  readArticles: string[];
};

const ARTICLE_SERVICE: Record<string, string> = {
  "mido-software-gestion-documental": "custodia-de-archivos",
  "gestion-documental-economia-circular": "destruccion-de-documentos",
  "ciclo-de-vida-documental-sostenibilidad": "programa-de-gestion-documental",
  "inteligencia-documental-engranaje-maestro": "programa-de-gestion-documental",
};

export function getInsight(): Insight {
  const p = load(); const c = p.counts;
  const sum = (prefix: string) => Object.entries(c).filter(([k]) => k.startsWith(prefix)).reduce((a, [, v]) => a + v, 0);
  const svc: Record<string, number> = {};
  const add = (slug: string, n: number) => { svc[slug] = (svc[slug] || 0) + n; };
  for (const [k, v] of Object.entries(c)) {
    const [kind, key] = k.split(":");
    if (kind === "service") add(key, 3 * v);
    if (kind === "quote" && key !== "diagnostico") add(key, 4 * v);
    if (kind === "chat" && key.startsWith("svc-")) add(key.slice(4), 2 * v);
    if (kind === "article" && ARTICLE_SERVICE[key]) add(ARTICLE_SERVICE[key], 1 * v);
  }
  const articles = Object.keys(c).filter(k => k.startsWith("article:")).map(k => k.slice(8));
  const tech = articles.length * 2 + (c["section:faq"] || 0) + (c["section:modelo"] || 0) + (c["chat:normativa"] || 0) * 2 + (c["chat:faq"] || 0);
  const buy = (c["section:cotizador"] || 0) + sum("quote:") * 3 + (c["chat:precio"] || 0) * 3 + (c["chat:cotizar"] || 0) * 3;
  const segment = buy >= 3 && buy >= tech ? "comprador" : tech >= 3 ? "tecnico" : "explorador";
  return {
    returning: p.visits > 1,
    segment,
    topServices: Object.entries(svc).sort((a, b) => b[1] - a[1]).filter(([, v]) => v >= 3).map(([k]) => k).slice(0, 2),
    readArticles: articles,
  };
}

// ─── 2. Normalización, tolerancia a errores ────────────────────────────────

export const norm = (t: string) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9ñ\s]/g, " ").replace(/\s+/g, " ").trim();
const STOP = new Set("a al algo algun alguna alguno ante como con cual cuales de del el ella ellos en entre era es esa ese eso esta este esto estoy fue ha han hay la las le les lo los me mi mis mucho muy nada ni no nos o otra otro para pero poco por porque puede pueden que quiero quisiera se si sin sobre solo son su sus tambien tengo tiene tienen todo todos tu un una uno unos usted ustedes y ya yo hola buenas buenos dias tardes noches gracias favor necesito saber quiero ayuda".split(" "));
const stem = (w: string) => w.length > 5 ? w.replace(/(aciones|acion|amiento|mente|ciones|cion|ndo|ados|adas|ado|ada|ar|er|ir|es|s)$/, "") : w.replace(/s$/, "");

function lev(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 2) return 9;
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}
/** ¿El texto contiene la palabra clave? Acepta frases, raíces y errores de tipeo. */
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
export const keywordsOf = (text: string) => norm(text).split(" ").filter(w => w.length >= 4 && !STOP.has(w));

// ─── 3. Motor ──────────────────────────────────────────────────────────────

export type Memory = { lastService?: string; lastIntent?: string; unknownStreak: number; rude: number; pendingWords: string[] };
export const newMemory = (): Memory => ({ unknownStreak: 0, rude: 0, pendingWords: [] });

const SERVICE_KEYWORDS: Record<string, string[]> = {
  "levantamiento-de-inventario": ["inventario", "levantamiento", "censo documental", "cuantas cajas", "organizar archivo", "desorden", "desorganizado", "clasificar", "clasificacion", "fuid"],
  "programa-de-gestion-documental": ["pgd", "programa de gestion", "gestion documental", "trd", "tabla de retencion", "tablas de retencion", "tvd", "valoracion documental", "politica documental", "cero papel", "ciclo de vida"],
  "custodia-de-medios-magneticos": ["cinta", "cintas", "lto", "dat", "dlt", "backup", "backups", "copia de seguridad", "respaldo", "disco duro", "discos", "medios magneticos", "ransomware", "air gap", "drp", "recuperacion ante desastres"],
  "custodia-de-archivos": ["custodia", "bodega", "bodegas", "guardar", "almacenar", "almacenamiento", "espacio", "cajas", "arriendo", "archivo central", "consulta de documentos"],
  "digitalizacion-de-documentos": ["digitalizar", "digitalizacion", "escanear", "escaneo", "scanner", "ocr", "pdf", "documento electronico", "indexar", "indexacion", "dms", "ecm"],
  "destruccion-de-documentos": ["destruir", "destruccion", "triturar", "trituracion", "eliminar documentos", "eliminacion", "botar", "desechar", "certificado de destruccion", "acta de eliminacion", "reciclaje", "reciclar"],
  "microfilmacion-de-archivos": ["microfilm", "microfilme", "microfilmacion", "microfilmar", "rollo", "16 mm", "35 mm", "historias clinicas", "preservacion", "largo plazo"],
  "servicio-inhouse": ["inhouse", "in house", "en sitio", "en nuestras instalaciones", "personal de archivo", "outsourcing", "tercerizar", "archivista", "auxiliar de archivo"],
  "servicio-inmediato": ["urgente", "urgencia", "inmediato", "express", "hoy mismo", "mismo dia", "rapido", "auditoria manana", "lo necesito ya", "despacho"],
};

type Rule = { id: string; kws: string[]; w?: number };
const RULES: Rule[] = [
  { id: "precio", kws: ["precio", "precios", "costo", "costos", "cuanto cuesta", "cuanto vale", "cuanto cobran", "tarifa", "tarifas", "valor", "presupuesto", "economico", "barato"] },
  { id: "cotizar", kws: ["cotizar", "cotizacion", "propuesta", "contratar", "solicitar servicio", "quiero el servicio"] },
  { id: "tiempo", kws: ["cuanto tiempo", "cuanto se demora", "demora", "tarda", "tiempos de entrega", "plazo", "cuando estaria"] },
  { id: "cobertura", kws: ["bogota", "ciudad", "ciudades", "medellin", "cali", "barranquilla", "cartagena", "bucaramanga", "pais", "cobertura", "donde estan", "ubicacion", "direccion", "sede", "fuera de bogota", "regiones"] },
  { id: "normativa", kws: ["ley", "norma", "normativa", "normatividad", "decreto", "agn", "archivo general", "594", "1080", "527", "1581", "2527", "8934", "cumplimiento", "sancion", "sanciones", "multa", "multas", "superintendencia", "sic", "auditoria", "auditorias"] },
  { id: "empresa", kws: ["quienes son", "sobre ustedes", "historia de", "trayectoria", "cuantos anos", "1983", "ecopetrol", "mision", "vision", "valores"] },
  { id: "seguridad", kws: ["seguridad", "seguro", "confidencial", "confidencialidad", "privacidad", "proteccion de datos", "datos personales", "robo", "perdida", "incendio", "humedad", "vigilancia", "cctv", "acceso"] },
  { id: "mido", kws: ["mido", "software", "plataforma", "sistema", "aplicacion", "trazabilidad", "rastrear", "ubicar documento", "tiempo real"] },
  { id: "sostenibilidad", kws: ["sostenible", "sostenibilidad", "ambiental", "huella de carbono", "economia circular", "esg", "verde", "ecologico"] },
  { id: "diagnostico", kws: ["diagnostico", "no se que necesito", "no se por donde", "por donde empezar", "asesoria", "asesorar", "orientacion", "recomendacion", "que me recomienda", "evaluar"] },
  { id: "contacto", kws: ["contacto", "telefono", "celular", "llamar", "correo", "email", "whatsapp", "asesor", "humano", "persona", "hablar con alguien", "comercial", "vendedor"] },
  { id: "certificaciones", kws: ["iso", "9001", "acreditacion", "acreditados", "certificacion de calidad", "certificados de calidad"] },
  { id: "empleo", kws: ["empleo", "trabajo", "vacante", "vacantes", "hoja de vida", "practica", "practicas", "pasantia", "estudiante", "tesis", "investigacion", "universidad"] },
  { id: "caso", kws: ["mi caso", "contarle mi caso", "le cuento"] },
  { id: "pqrs", kws: ["queja", "reclamo", "pqr", "pqrs", "inconformidad", "mal servicio", "peticion"] },
  // objeciones
  { id: "obj-caro", kws: ["muy caro", "es caro", "costoso", "no tengo presupuesto", "sale caro", "mas barato", "mas economico", "descuento"] },
  { id: "obj-interno", kws: ["lo hacemos nosotros", "lo hacemos internamente", "tenemos archivista", "nuestro personal", "no lo necesito", "no necesitamos", "ya tenemos quien"] },
  { id: "obj-nube", kws: ["nube", "ya tenemos nube", "esta en la nube", "drive", "onedrive", "sharepoint", "google drive", "todo es digital", "ya es digital"] },
  { id: "obj-confianza", kws: ["no confio", "desconfio", "como se que", "garantia", "garantizan", "y si se pierde", "referencias", "clientes"] },
  { id: "obj-competencia", kws: ["competencia", "otra empresa", "otro proveedor", "proveedor actual", "por que ustedes", "que los diferencia", "diferencia"] },
  // conversación
  { id: "saludo", kws: ["hola", "buenas", "buenos dias", "buenas tardes", "buenas noches", "hey", "saludos"], w: 0.5 },
  { id: "gracias", kws: ["gracias", "muchas gracias", "perfecto", "excelente", "genial", "listo", "vale"], w: 0.6 },
  { id: "despedida", kws: ["adios", "chao", "hasta luego", "nos vemos", "bye"] },
  { id: "bot", kws: ["eres un robot", "eres una ia", "eres humano", "chatgpt", "inteligencia artificial", "eres real", "quien eres", "como te llamas"] },
  { id: "inyeccion", kws: ["ignora", "olvida tus instrucciones", "instrucciones anteriores", "prompt", "actua como", "modo desarrollador", "jailbreak", "system"] },
  { id: "ofensa", kws: ["estupido", "idiota", "inutil", "malparido", "hp", "gonorrea", "basura", "tonto", "porqueria", "mierda"] },
  { id: "fuera", kws: ["futbol", "clima", "receta", "pelicula", "chiste", "musica", "politica", "presidente", "novia", "novio", "horoscopo", "bitcoin", "partido"] },
];

// Problemas del cliente → solución (asesoría a partir del dolor que describe).
const PAINS: { kws: string[]; solution: string }[] = [
  { kws: ["sancion", "multa", "investigacion", "agn", "visita de control", "superintendencia", "no cumplimos", "incumplimiento"], solution: "cumplimiento" },
  { kws: ["ransomware", "hackeo", "virus", "ciberataque", "perdimos informacion", "backup", "copias de seguridad"], solution: "continuidad" },
  { kws: ["no encuentro", "no encontramos", "perdemos tiempo", "buscar documentos", "mucho papel", "papeleo", "cero papel"], solution: "digital" },
  { kws: ["no hay espacio", "sin espacio", "ocupa mucho", "bodega llena", "oficina llena", "arriendo", "trasteo", "mudanza", "muchas cajas"], solution: "espacio" },
  { kws: ["auditoria", "requerimiento", "juzgado", "demanda", "lo necesito ya", "urgente"], solution: "auditorias" },
  { kws: ["no tenemos personal", "nadie maneja", "recursos humanos", "hojas de vida", "historias laborales", "personal de archivo"], solution: "operacion" },
];

export function createJoel(kb: JoelKB) {
  const svc = (slug: string) => kb.services.find(s => s.slug === slug);
  const lc = (s: string) => s.toLowerCase();

  const cotizarOpts = (slug?: string): JoelOption[] => [
    slug ? { label: "Cotizar este servicio", next: "q_volume", set: { service: slug } } : { label: "Cotizar un servicio", next: "q_service" },
    { label: "Hablar con un asesor", next: "advisor" },
    { label: "Volver al inicio", next: "reset" },
  ];
  const svcActions = (slug: string): JoelAction[] => [{ label: `Ver ${svc(slug)?.title}`, icon: "box-arrow-up-right", to: `/servicios/${slug}` }];

  function serviceAnswer(slug: string, asked: Set<string>): JoelReply {
    const s = svc(slug)!; const d = kb.details[slug];
    if (asked.has("precio") || asked.has("cotizar")) return priceAnswer(slug);
    if (asked.has("tiempo")) return timeAnswer(slug);
    if (asked.has("normativa")) {
      return { intent: "normativa", service: slug, say: [`${s.title} se respalda en: ${d.norms.join(", ")}.`, d.reasons.find(r => /legal|cumpl|jur/i.test(r.t))?.d ?? d.reasons[0].d], actions: svcActions(slug), options: cotizarOpts(slug) };
    }
    if (asked.has("seguridad")) {
      const r = d.reasons.find(r => /segur|custodia|protec|datos/i.test(r.t + r.d)) ?? d.reasons[0];
      return { intent: "seguridad", service: slug, say: [`Sobre seguridad en ${lc(s.title)}: ${r.d}`], actions: svcActions(slug), options: cotizarOpts(slug) };
    }
    const say = [`${s.title}: ${d.tagline}`, d.intro, `Algunos datos: ${d.stats.map(x => `${x.v} ${x.l}`).join(" · ")}.`];
    if (d.modes) say.push(`Lo ofrecemos en dos modalidades: ${d.modes.map(m => lc(m.t)).join(" o ")}.`);
    return { intent: `svc-${slug}`, service: slug, say, actions: svcActions(slug), options: [{ label: "Cotizar este servicio", next: "q_volume", set: { service: slug } }, { label: "¿Por qué con ustedes?", next: "brain:por que ustedes " + s.title }, { label: "Ver otro servicio", next: "info_list" }] };
  }

  function priceAnswer(slug?: string): JoelReply {
    if (!slug) return { intent: "precio", say: ["No manejamos una lista de precios fija: cada cotización depende del servicio, el volumen y las condiciones de su archivo.", "Si me dice qué servicio le interesa, le explico de qué depende su valor y qué datos necesitamos para cotizarlo."], options: [{ label: "Cotizar un servicio", next: "q_service" }, { label: "Conocer los servicios", next: "info_list" }, { label: "Hablar con un asesor", next: "advisor" }] };
    const s = svc(slug)!; const q = kb.quote[slug];
    const vars = q ? [q.volumeLabel, ...q.fields.map(f => f.label)].map(lc).join(", ") : "el volumen y las condiciones del archivo";
    const say = [`El valor de ${lc(s.title)} no es una tarifa fija: se calcula con su información.`, `Para cotizarlo necesitamos: ${vars}.`];
    if (kb.quoteUnit[slug]) say.push(`Se cotiza por ${lc(kb.quoteUnit[slug])}`);
    if (slug === "custodia-de-archivos") say.push("Una ventaja: convierte un costo fijo de espacio en uno variable, porque paga por el volumen exacto que custodia.");
    say.push("¿Armamos la solicitud ahora? Toma un par de minutos.");
    return { intent: "precio", service: slug, say, options: cotizarOpts(slug) };
  }

  function timeAnswer(slug?: string): JoelReply {
    if (slug === "servicio-inmediato") return { intent: "tiempo", service: slug, say: ["Con el Servicio Inmediato, si la solicitud se radica dentro del horario de atención, la entrega puede ser el mismo día.", "Puede ser digital (escaneo prioritario y envío cifrado) o física (despacho express del original)."], options: cotizarOpts(slug) };
    return { intent: "tiempo", service: slug, say: [`Los tiempos${slug ? ` de ${lc(svc(slug)!.title)}` : ""} dependen del volumen y del estado del archivo, por eso los define el asesor en la propuesta.`, "Si es urgente, contamos con el Servicio Inmediato para consultas y entregas prioritarias."], options: [...(slug ? [{ label: "Cotizar este servicio", next: "q_volume", set: { service: slug } }] : []), { label: "Ver Servicio Inmediato", next: "info_detail", set: { service: "servicio-inmediato" } }, { label: "Hablar con un asesor", next: "advisor" }] };
  }

  function solutionAnswer(id: string): JoelReply {
    const sol = kb.solutions.find(s => s.id === id)!;
    const names = sol.slugs.map(sl => svc(sl)?.title).filter(Boolean).join(" y ");
    return {
      intent: `sol-${id}`, service: sol.slugs[0],
      say: [`Entiendo. Lo que describe es un caso de «${sol.title.toLowerCase()}».`, sol.desc, `Le recomiendo ${names}. Si no tiene claro el estado de su archivo, lo ideal es empezar por un diagnóstico documental.`],
      actions: [{ label: "Ver esta solución", icon: "lightbulb", href: `#sol-${id}` }],
      options: [{ label: `Cotizar ${svc(sol.slugs[0])?.title}`, next: "q_volume", set: { service: sol.slugs[0] } }, { label: "Empezar con un diagnóstico", next: "q_volume", set: { service: "diagnostico" } }, { label: "Hablar con un asesor", next: "advisor" }],
    };
  }


  // ─── Preguntas específicas ─────────────────────────────────────────────
  // Cada pregunta frecuente de un cliente, con su respuesta puntual (tomada de
  // los documentos de la empresa). "need": grupos de palabras; deben aparecer
  // todos (de cada grupo, al menos una). "svc": el servicio cuenta como grupo
  // si se nombra o si es del que se venía hablando.
  type Fact = { id: string; need: string[][]; svc?: string; not?: string[]; reply: () => Omit<JoelReply, "intent"> };
  const SK = (slug: string) => [...SERVICE_KEYWORDS[slug], norm(svc(slug)?.title ?? "")];
  const ask = (slug: string): JoelOption[] => [{ label: "Cotizar este servicio", next: "q_volume", set: { service: slug } }, { label: "Hablar con un asesor", next: "advisor" }];
  const see = (slug: string): JoelAction[] => [{ label: `Ver ${svc(slug)?.title}`, icon: "box-arrow-up-right", to: `/servicios/${slug}` }];
  const steps = (slug: string) => (kb.details[slug].steps ?? []).map((st, i) => `${i + 1}. ${st.t}: ${st.d}`).join("\n");
  const C = "custodia-de-archivos", M = "custodia-de-medios-magneticos", D = "digitalizacion-de-documentos", X = "destruccion-de-documentos", F = "microfilmacion-de-archivos", P = "programa-de-gestion-documental", I = "levantamiento-de-inventario", H = "servicio-inhouse", N = "servicio-inmediato";

  const FACTS: Fact[] = [
    { id: "custodia-tiempo", svc: C, need: [["cuanto tiempo", "por cuanto tiempo", "hasta cuando", "cuantos anos"], ["guardan", "guardar", "custodian", "conservan", "tienen", "mantienen"]], not: ["debo", "deben", "facturas", "contables"], reply: () => ({ say: ["Los custodiamos el tiempo que su empresa necesite. Trabajamos con sus Tablas de Retención para parametrizar los vencimientos y le avisamos antes de que un documento cumpla su tiempo.", "Con su autorización, al final lo eliminamos de forma segura y certificada, o lo seguimos conservando."], actions: see(C), options: ask(C) }) },
    // Generales
    { id: "recomendar", need: [["recomienda", "recomiendas", "recomendaria", "no se cual", "no se que servicio", "cual servicio", "cual necesito", "que me sirve", "que me conviene", "no se que necesito", "no se por donde"]], reply: () => ({ say: ["Con gusto le recomiendo. Cuénteme en una frase qué le preocupa de su archivo, por ejemplo: «no tengo espacio», «no encuentro los documentos», «me exigen cumplir la ley» o «necesito un documento ya».", "Si prefiere, el diagnóstico documental le muestra exactamente qué necesita antes de invertir."], options: [{ label: "Empezar con un diagnóstico", next: "q_volume", set: { service: "diagnostico" } }, { label: "Conocer los servicios", next: "info_list" }] }) },
    { id: "servicios", need: [["servicios", "que hacen", "que ofrecen", "a que se dedican", "portafolio", "que venden", "en que me pueden ayudar"]], not: ["custodia", "digitaliz", "destru", "microfilm", "inventario", "inhouse", "inmediato", "pgd"], reply: () => ({ say: ["Acompañamos todo el ciclo de vida de sus documentos con 9 servicios:", "• Para empezar: Diagnóstico documental y Levantamiento de Inventario.\n• Para resolver: Digitalización, Programa de Gestión Documental (PGD) y Microfilmación.\n• Para proteger: Custodia de Archivos y Custodia de Medios Magnéticos.\n• Para cerrar el ciclo y crecer: Destrucción certificada, Servicio Inmediato y Servicio Inhouse.", "¿Cuál le interesa? También puede contarme su caso y le recomiendo."], options: [{ label: "Conocer los servicios", next: "info_list" }, { label: "Contarle mi caso", next: "brain:contarle mi caso" }, { label: "Empezar con un diagnóstico", next: "q_volume", set: { service: "diagnostico" } }] }) },
    { id: "proceso", need: [["como trabajan", "proceso", "como empiezo", "como inicio", "como empezar", "pasos", "metodologia", "como funciona el servicio", "como es el proceso"]], not: ["custodia", "digitaliz", "destru", "microfilm", "inventario", "inhouse", "inmediato", "pgd", "cotiz"], reply: () => ({ say: ["Trabajamos en un recorrido de 4 pasos:", "1. Diagnóstico: entendemos qué pasa hoy con su archivo.\n2. Solución: lo resolvemos con un proyecto a la medida (inventario, digitalización, PGD).\n3. Protección: lo custodiamos y lo mantenemos disponible.\n4. Expansión: cerramos el ciclo (destrucción certificada) y atendemos lo urgente.", "Para empezar, solo necesita contarnos su necesidad: un asesor le propone el alcance."], options: [{ label: "Empezar con un diagnóstico", next: "q_volume", set: { service: "diagnostico" } }, { label: "Cotizar un servicio", next: "q_service" }] }) },
    { id: "cotizar-que", need: [["que necesito", "que datos", "que informacion", "que piden", "requisitos"]], not: ["servicio necesito"], reply: () => ({ say: ["Para cotizar necesitamos: el servicio, el volumen aproximado (cajas, metros lineales o número de documentos), la ubicación, la urgencia y unos datos de contacto.", "Si no conoce algún dato, no hay problema: un asesor le ayuda a completarlo. ¿Armamos la solicitud?"], options: [{ label: "Cotizar un servicio", next: "q_service" }, { label: "Empezar con un diagnóstico", next: "q_volume", set: { service: "diagnostico" } }] }) },
    { id: "pyme", need: [["pyme", "pequena", "pequeno", "microempresa", "poco archivo", "pocas cajas", "emprendimiento", "pocos documentos"]], reply: () => ({ say: ["Claro que sí. Nuestros servicios son escalables: atendemos desde grandes corporaciones hasta pymes y microempresas.", "Con poco archivo, lo usual es empezar con custodia (paga solo por lo que guarda) o con una destrucción certificada de lo que ya no necesita."], options: [{ label: "Ver Custodia de Archivos", next: "info_detail", set: { service: C } }, { label: "Cotizar un servicio", next: "q_service" }] }) },
    { id: "clientes", need: [["clientes", "referencias", "con quien han trabajado", "empresas que atienden"]], reply: () => ({ say: ["Hemos atendido multinacionales, pymes y microempresas de sectores como salud, laboratorios, aseguradoras, financiero, petróleo, minería, ingeniería e infraestructura, construcción, líneas aéreas y empresas en liquidación o reestructuración.", "Si necesita referencias de su sector, un asesor se las comparte."], actions: [{ label: "Ver nuestros clientes", icon: "briefcase", to: "/nosotros#clientes" }], options: [{ label: "Hablar con un asesor", next: "advisor" }] }) },
    { id: "capacidad", need: [["cuantas cajas", "cuantos documentos", "capacidad", "volumen manejan", "cuanto manejan", "millones"]], reply: () => ({ say: ["En más de 40 años hemos indexado y gestionado millones de documentos y archivos de empresas colombianas, todos registrados en nuestro software Mido.", "Para su caso, el volumen no es un problema: la custodia es escalable y se paga por lo que se guarda."], options: [{ label: "Cotizar Custodia de Archivos", next: "q_volume", set: { service: C } }] }) },
    // Sectores
    { id: "salud", need: [["hospital", "hospitales", "clinica", "clinicas", "salud", "eps", "ips", "historias clinicas", "historia clinica", "laboratorio", "laboratorios", "consultorio"]], reply: () => ({ say: ["Sí, el sector salud y los laboratorios están entre los que hemos atendido.", "Para historias clínicas solemos combinar: custodia con condiciones controladas, digitalización para la consulta diaria y microfilmación para la conservación de largo plazo (más de 100 años)."], options: [{ label: "Ver Microfilmación", next: "info_detail", set: { service: F } }, { label: "Ver Custodia de Archivos", next: "info_detail", set: { service: C } }, { label: "Hablar con un asesor", next: "advisor" }] }) },
    { id: "financiero", need: [["banco", "bancos", "financiero", "financiera", "aseguradora", "aseguradoras", "fiduciaria", "cooperativa"]], reply: () => ({ say: ["Sí, hemos trabajado con el sector financiero y con aseguradoras, donde la confidencialidad y la trazabilidad son clave.", "Allí son muy útiles la custodia con cadena de custodia, la digitalización con valor legal y la custodia de backups fuera de la red (air gap)."], options: [{ label: "Ver Custodia de Medios Magnéticos", next: "info_detail", set: { service: M } }, { label: "Hablar con un asesor", next: "advisor" }] }) },
    { id: "publico", need: [["entidad publica", "entidades publicas", "sector publico", "gobierno", "alcaldia", "ministerio", "estatal", "funciones publicas"]], reply: () => ({ say: ["Las entidades públicas, y las privadas con funciones públicas o vigiladas por superintendencias, están obligadas a tener un Programa de Gestión Documental (Decreto 1080 de 2015) bajo la Ley 594 de 2000.", "Lo diseñamos, formulamos e implementamos a la medida, junto con las Tablas de Retención Documental."], options: [{ label: "Ver Programa de Gestión Documental", next: "info_detail", set: { service: P } }, { label: "Hablar con un asesor", next: "advisor" }] }) },
    { id: "otros-sectores", need: [["petroleo", "petrolera", "mineria", "minera", "constructora", "construccion", "ingenieria", "aerolinea", "lineas aereas", "liquidacion", "reestructuracion", "infraestructura"]], reply: () => ({ say: ["Sí, ese sector está entre los que hemos atendido. De hecho, nacimos en 1983 para atender a Ecopetrol.", "Cuénteme qué necesita su empresa y le recomiendo el servicio adecuado."], options: [{ label: "Contarle mi caso", next: "brain:contarle mi caso" }, { label: "Hablar con un asesor", next: "advisor" }] }) },
    // Contacto
    { id: "horario", need: [["horario", "horarios", "a que hora", "abren", "cierran", "sabado", "sabados", "domingo", "festivo", "festivos", "abiertos"]], reply: () => ({ say: ["No tengo el horario de atención exacto en este momento. Para confirmarlo, llámenos al (601) 316-4530 o escríbanos a info@transarchivos.com.", "Para urgencias, el Servicio Inmediato garantiza entrega el mismo día si la solicitud se radica dentro del horario de atención."], actions: [{ label: "Llamar al (601) 316-4530", icon: "telephone-fill", href: "tel:+576013164530" }] }) },
    { id: "whatsapp", need: [["whatsapp", "wsp", "wasap", "whats"]], reply: () => ({ say: ["Por ahora nuestros canales de atención son el teléfono (601) 316-4530 y el correo info@transarchivos.com."], actions: [{ label: "Llamar al (601) 316-4530", icon: "telephone-fill", href: "tel:+576013164530" }, { label: "Escribir a info@transarchivos.com", icon: "envelope-fill", href: "mailto:info@transarchivos.com" }] }) },
    { id: "llamenme", need: [["me pueden llamar", "me llaman", "llamenme", "me contacten", "me contactan", "que me llamen", "me escriban"]], reply: () => ({ say: ["Con gusto. Complete la solicitud con sus datos de contacto y un asesor le llamará. Toma un par de minutos."], options: [{ label: "Cotizar un servicio", next: "q_service" }], actions: [{ label: "Abrir el cotizador", icon: "ui-checks", href: "#cotizador" }] }) },
    { id: "transporte", need: [["recogen", "recoger", "recoleccion", "transporte", "transportan", "camion", "camiones", "vehiculo", "vehiculos", "van por", "pasan por", "llevan", "traslado", "trasladar"]], reply: () => ({ say: ["Sí, recogemos los documentos en sus instalaciones con logística propia y transporte seguro, con trazabilidad en cada etapa.", "Los medios magnéticos viajan en maletines herméticos e ignífugos con sellos numerados, en vehículos propios monitoreados por GPS."], options: [{ label: "Cotizar Custodia de Archivos", next: "q_volume", set: { service: C } }, { label: "Hablar con un asesor", next: "advisor" }] }) },
    // Custodia
    { id: "custodia-como", svc: C, need: [["como funciona", "como es", "proceso", "pasos", "en que consiste", "como trabajan"]], reply: () => ({ say: ["Así funciona la custodia de archivos:", steps(C), "Cada caja queda codificada con código de barras en nuestro software Mido, para ubicarla en segundos."], actions: see(C), options: ask(C) }) },
    { id: "donde", need: [["donde"]], not: ["direccion"], svc: C, reply: () => ({ say: ["En nuestro centro documental de Bogotá, con estantería de carga pesada según norma Icontec, CCTV, vigilancia 24 h, control de acceso, control de temperatura y humedad y protección contra incendios."], actions: see(C), options: ask(C) }) },
    { id: "consulta", need: [["consultar", "consulta", "pedir", "pido", "pedimos", "solicitar", "solicito", "recuperar", "sacar", "necesito ver", "devuelvan", "devolver", "traigan", "envien"], ["documento", "documentos", "expediente", "caja", "cajas", "custodia", "archivo"]], not: ["copia"], reply: () => ({ say: ["Sí, sus documentos en custodia siempre están disponibles. Puede pedir la consulta física (se los llevamos) o digital (los escaneamos y se los enviamos).", "Si es urgente, el Servicio Inmediato prioriza la búsqueda y puede entregar el mismo día si se radica dentro del horario de atención. Solo pueden solicitarlo personas autorizadas por su empresa."], options: [{ label: "Ver Servicio Inmediato", next: "info_detail", set: { service: N } }, { label: "Hablar con un asesor", next: "advisor" }] }) },
    { id: "riesgo-bodega", need: [["inunda", "inundacion", "incendio", "fuego", "agua", "terremoto", "sismo", "se moja", "ratas", "plagas", "robo", "roban", "temblor"]], reply: () => ({ say: ["Nuestras bodegas están preparadas para eso: control automatizado de temperatura y humedad, sistema de prevención y extinción de incendios, monitoreo 24/7, vigilancia con CCTV y estantería de carga pesada según norma Icontec.", "Para medios magnéticos, además, usamos extinción con agentes limpios (sin agua) y blindaje contra campos electromagnéticos."], options: ask(C) }) },
    { id: "acceso", need: [["quien", "quienes"], ["ver", "acceso", "acceder", "consultar", "mira", "revisa", "manipula", "toca"]], reply: () => ({ say: ["Solo el personal autorizado de Transarchivos, bajo acuerdos de confidencialidad, y las personas que su empresa autorice.", "Definimos perfiles de autorización (por ejemplo directores de área, representantes legales o jefes de cumplimiento) para evitar consultas indebidas, en cumplimiento de la Ley 1581 de 2012."], options: ask(C) }) },
    { id: "cobro", need: [["mensual", "por mes", "cada mes", "contrato", "contratos", "permanencia", "minimo", "anual", "por ano", "pagan", "factura mensual"]], reply: () => ({ say: ["La custodia funciona como un costo variable y escalable: se paga por el volumen que custodia, sin costos fijos de espacio, personal ni mantenimiento.", "La unidad de cobro, la permanencia y las condiciones del contrato se definen en la propuesta según su volumen. Un asesor se las detalla."], options: [{ label: "Cotizar Custodia de Archivos", next: "q_volume", set: { service: C } }, { label: "Hablar con un asesor", next: "advisor" }] }) },
    { id: "retencion", need: [["cuanto tiempo", "por cuanto tiempo", "cuantos anos", "conservar", "retencion", "guardar"], ["debo", "deben", "hay que", "obligacion", "obligatorio", "facturas", "factura", "contables", "contabilidad", "contratos", "nomina", "laborales", "historias", "libros"]], reply: () => ({ say: ["El tiempo que debe conservar cada tipo de documento lo definen sus Tablas de Retención Documental (TRD). Como referencia general, los libros y papeles de comercio se conservan 10 años (Decreto 962, art. 28, Ley Antitrámites).", "Le ayudamos a elaborar sus TRD y, cuando un documento cumple su tiempo, a eliminarlo de forma segura y certificada."], options: [{ label: "Ver Programa de Gestión Documental", next: "info_detail", set: { service: P } }, { label: "Hablar con un asesor", next: "advisor" }] }) },
    { id: "diferencia-custodias", need: [["diferencia", "diferencias", "vs", "versus", "comparar", "o la de"], ["archivo", "archivos", "papel"], ["medios", "magneticos", "cintas", "backup", "backups"]], reply: () => ({ say: ["• Custodia de Archivos: para documentos en papel (cajas, carpetas, expedientes) en nuestro centro documental, con consulta física o digital.\n• Custodia de Medios Magnéticos: para cintas LTO/DAT/DLT, discos duros y otros soportes de backup, en una bóveda con control ambiental y blindaje. Es su copia fuera de la red (air gap) ante ransomware."], options: [{ label: "Ver Custodia de Archivos", next: "info_detail", set: { service: C } }, { label: "Ver Custodia de Medios", next: "info_detail", set: { service: M } }] }) },
    // PGD / TRD
    { id: "trd-que", need: [["tabla de retencion", "tablas de retencion", "trd", "tvd", "tabla de valoracion"], ["que es", "que son", "para que", "en que consiste", "significa", "sirve"]], reply: () => ({ say: ["Las Tablas de Retención Documental (TRD) son el listado de las series documentales de cada área, con el tiempo que debe conservarse cada una y qué hacer al final (conservar, digitalizar, microfilmar o eliminar). Las Tablas de Valoración (TVD) hacen lo mismo con el archivo acumulado.", "Son la base para cumplir la Ley 594 de 2000 y para no guardar más de lo necesario. Las elaboramos como parte del Programa de Gestión Documental."], options: [{ label: "Ver Programa de Gestión Documental", next: "info_detail", set: { service: P } }] }) },
    { id: "pgd-obligatorio", svc: P, need: [["obligatorio", "obligatoria", "debo", "deben", "exigen", "tengo que", "privada", "privadas", "aplica", "necesito tener"]], reply: () => ({ say: ["Es obligatorio para entidades públicas y para privadas que cumplan funciones públicas o estén vigiladas por superintendencias (Ley 594 de 2000 y Decreto 1080 de 2015). Su ausencia puede traer sanciones e investigaciones del AGN.", "Si su empresa es privada sin esas condiciones, no es obligatorio, pero sí muy recomendable: ahorra espacio y tiempo, y le prepara para auditorías y para la oficina cero papel."], actions: see(P), options: ask(P) }) },
    { id: "pgd-que", svc: P, need: [["que es", "que son", "para que sirve", "en que consiste", "significa"]], reply: () => ({ say: ["El Programa de Gestión Documental (PGD) es el sistema de políticas, normas y procedimientos con el que su empresa maneja sus documentos durante todo su ciclo de vida: creación, uso, conservación y disposición final.", "Unifica criterios entre áreas, evita el crecimiento descontrolado del archivo y define el camino hacia una oficina cero papel jurídicamente válida."], actions: see(P), options: ask(P) }) },
    // Organización / deterioro
    { id: "inhouse-sede", need: [["venga", "vengan", "en mi oficina", "en nuestra oficina", "en nuestra sede", "en mi empresa", "en sitio", "a domicilio", "en nuestras instalaciones", "aqui en"], ["organizar", "ordenar", "archivo", "personal", "trabajen", "digitalizar", "escanear", "persona", "alguien"]], reply: () => ({ say: ["Sí. Con el Servicio Inhouse, personal técnico de archivo trabaja en su sede: organiza, clasifica, folia, rotula, aplica sus TRD y prepara documentos para digitalizar, custodiar o eliminar.", "Transarchivos asume la contratación, los reemplazos y la supervisión. Y si necesita digitalizar sin que los documentos salgan de su empresa, también lo hacemos in-house."], options: [{ label: "Ver Servicio Inhouse", next: "info_detail", set: { service: H } }, { label: "Cotizar Servicio Inhouse", next: "q_volume", set: { service: H } }] }) },
    { id: "organizar", need: [["organizar", "ordenar", "desorden", "desordenado", "desorganizado", "organizacion", "clasificar", "caos", "reguero"], ["archivo", "documentos", "papeles", "cajas", "carpetas", "expedientes"]], reply: () => ({ say: ["El primer paso para organizar un archivo es el Levantamiento de Inventario: identificamos, registramos y clasificamos lo que hay para conocer su volumen, estado y ubicación.", "Con eso se definen sus Tablas de Retención y se decide qué custodiar, qué digitalizar y qué eliminar. Si prefiere que lo hagamos en su sede, está el Servicio Inhouse."], options: [{ label: "Ver Levantamiento de Inventario", next: "info_detail", set: { service: I } }, { label: "Cotizar inventario", next: "q_volume", set: { service: I } }, { label: "Ver Servicio Inhouse", next: "info_detail", set: { service: H } }] }) },
    { id: "deterioro", need: [["hongos", "humedad", "danando", "danados", "deterioro", "deteriorados", "amarillos", "rotos", "plagas", "se borran", "borrosos", "mojados", "polilla"]], reply: () => ({ say: ["Es importante actuar pronto. En el levantamiento de inventario evaluamos el estado físico de los documentos para detectar riesgos de deterioro biológico, humedad o daño estructural.", "Para salvar la información, se pueden digitalizar o microfilmar, y conservar los originales en custodia con control de temperatura y humedad."], options: [{ label: "Ver Levantamiento de Inventario", next: "info_detail", set: { service: I } }, { label: "Ver Microfilmación", next: "info_detail", set: { service: F } }, { label: "Hablar con un asesor", next: "advisor" }] }) },
    { id: "antiguos", need: [["viejos", "antiguos", "antiguo", "viejo", "historicos", "historico", "antiguedad", "patrimonio", "patrimoniales"]], reply: () => ({ say: ["Para documentos antiguos o históricos recomendamos preservarlos: la microfilmación dura más de 100 años y no depende de tecnología para leerse, y la digitalización permite consultarlos sin manipular el original.", "Los originales pueden quedar en custodia con condiciones ambientales controladas."], options: [{ label: "Ver Microfilmación", next: "info_detail", set: { service: F } }, { label: "Ver Digitalización", next: "info_detail", set: { service: D } }] }) },
    { id: "copia", need: [["copia", "copias", "fotocopia", "duplicado", "reproduccion"]], not: ["copia de seguridad", "copias de seguridad"], reply: () => ({ say: ["Si el documento está en nuestra custodia, lo escaneamos y se lo enviamos (digitalización prioritaria bajo demanda) o le llevamos el original.", "Si está en su empresa, podemos digitalizarlo con valor legal; y si es muy antiguo o frágil, la microfilmación es la copia de mayor duración."], options: [{ label: "Ver Servicio Inmediato", next: "info_detail", set: { service: N } }, { label: "Ver Digitalización", next: "info_detail", set: { service: D } }] }) },
    // Digitalización
    { id: "formatos", svc: D, need: [["formato", "formatos", "pdf", "tiff", "jpg", "como entregan", "en que entregan", "entregan", "entrega", "resolucion", "dpi"]], reply: () => ({ say: ["Entregamos los documentos digitalizados en PDF (con texto buscable si incluye OCR), TIFF o JPG, en color, blanco y negro o escala de grises, de 200 a 600 dpi.", "Los recibe en la nube, USB, disco duro o integrados a su sistema de gestión documental (DMS/ECM), indexados con los metadatos que necesite."], actions: see(D), options: ask(D) }) },
    { id: "validez", svc: D, need: [["validez", "valido", "valida", "legal", "dian", "sirve como", "reemplaza", "original", "probatorio", "juridico", "ante"]], reply: () => ({ say: ["Sí, hacemos digitalización con valor legal, en el marco de la Ley 527 de 1999 (comercio electrónico), el Decreto 1080 de 2015 y la normativa del AGN, y respalda el archivo físico en procesos legales.", "Qué originales puede eliminar después depende de sus Tablas de Retención: se lo confirmamos en el diagnóstico."], actions: see(D), options: ask(D) }) },
    { id: "gran-formato", svc: D, need: [["planos", "plano", "libros", "libro", "gran formato", "tamano", "empastados", "argollados", "fotos", "fotografias", "mapas"]], reply: () => ({ say: ["Digitalizamos con escáneres profesionales de alta capacidad. Para formatos especiales como planos, libros empastados o fotografías, el asesor confirma el equipo y las condiciones al cotizar, según el tamaño y el estado del material."], actions: see(D), options: ask(D) }) },
    { id: "todo", svc: D, need: [["todo", "toda", "100", "completo", "entero"]], reply: () => ({ say: ["No le recomendamos digitalizar el 100%: priorizamos con sus Tablas de Retención lo de alta consulta, conservación permanente o alto riesgo legal.", "Lo histórico o de baja consulta puede quedar en custodia física con digitalización bajo demanda. Así optimiza el presupuesto."], actions: see(D), options: ask(D) }) },
    // Destrucción
    { id: "destruccion-como", svc: X, need: [["como", "proceso", "pasos", "metodo"]], reply: () => ({ say: ["Así es la destrucción documental:", steps(X), "Solo destruimos lo que ya cumplió su tiempo de retención según sus TRD o un acta aprobada por su comité de archivo."], actions: see(X), options: ask(X) }) },
    { id: "certificado", need: [["certificado", "certifican", "acta", "constancia", "soporte", "evidencia", "comprobante"]], not: ["iso", "calidad"], reply: () => ({ say: ["Sí. Al finalizar entregamos un Certificado de Destrucción Legal con fecha, volumen, método y trazabilidad, válido ante la DIAN, superintendencias o auditorías ISO, junto con el acta de entrega del material."], options: [{ label: "Ver Destrucción de Documentos", next: "info_detail", set: { service: X } }, { label: "Cotizar destrucción", next: "q_volume", set: { service: X } }] }) },
    { id: "presenciar", svc: X, need: [["ver", "presenciar", "presente", "acompanar", "testigo", "mirar", "estar"]], reply: () => ({ say: ["El proceso se documenta de principio a fin: se verifica que el material corresponda a lo autorizado, se firma el acta de entrega y al final recibe el certificado con la trazabilidad.", "Si su empresa necesita presenciar la destrucción, coordínelo con el asesor al solicitar el servicio."], options: ask(X) }) },
    { id: "reciclaje", need: [["que pasa", "que hacen", "donde va", "a donde va", "reciclan", "reciclaje", "reciclar", "se recicla"], ["papel", "material", "destruido", "triturado", "residuo", "residuos", "lo que destruyen"]], reply: () => ({ say: ["El 100% del papel triturado se integra a cadenas de economía circular, por ejemplo para fabricar cartón o papel higiénico. Así reduce la huella de carbono y aporta a los indicadores ESG de su empresa."], options: [{ label: "Ver Destrucción de Documentos", next: "info_detail", set: { service: X } }] }) },
    // Microfilmación
    { id: "micro-dura", svc: F, need: [["cuanto dura", "vida util", "duracion", "cuantos anos", "dura", "durabilidad"]], reply: () => ({ say: ["El microfilme tiene una vida útil de más de 100 años, y puede llegar a 500 años en condiciones óptimas de conservación."], actions: see(F), options: ask(F) }) },
    { id: "micro-vs", svc: F, need: [["si ya", "escaneo", "escanear", "digitaliz", "diferencia", "para que sirve", "por que", "mejor"]], reply: () => ({ say: ["Son complementarios. El microfilme es inmune a la obsolescencia tecnológica y a los ciberataques: no necesita software, equipos ni electricidad para leerse, y la copia certificada tiene el mismo valor probatorio que el original (Decreto 2527 de 1950).", "La estrategia ideal es híbrida: microfilmar para preservar y digitalizar para la consulta diaria."], actions: see(F), options: ask(F) }) },
    { id: "micro-que", svc: F, need: [["que es", "en que consiste", "como funciona", "significa"]], reply: () => ({ say: ["La microfilmación convierte sus documentos en imágenes reducidas sobre película fotográfica especial de 16 o 35 mm. Un solo rollo guarda miles de páginas y dura más de 100 años.", "Es ideal para historias clínicas, registros notariales, expedientes judiciales, archivos contables y documentos históricos."], actions: see(F), options: ask(F) }) },
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
        // Nombrarlo suma; venir hablando de él solo habilita (no compite con
        // una pregunta general que también encaje).
        score += named ? 1.5 : 0;
      }
      if (score > bestScore) { bestScore = score; best = f; }
    }
    return best;
  }

  const RESP: Record<string, (m: Memory, asked: Set<string>) => JoelReply> = {
    precio: m => priceAnswer(m.lastService),
    cotizar: m => m.lastService ? priceAnswer(m.lastService) : { intent: "cotizar", say: ["Con gusto le ayudo a armar su solicitud. ¿Qué servicio necesita?"], options: [{ label: "Cotizar un servicio", next: "q_service" }], actions: [{ label: "Abrir el cotizador completo", icon: "ui-checks", href: "#cotizador" }] },
    tiempo: m => timeAnswer(m.lastService),
    cobertura: () => ({ intent: "cobertura", say: ["Operamos principalmente en Bogotá, donde están nuestra sede y nuestras bodegas de custodia (Cl. 21 # 39A-40).", "Estamos abiertos a atender empresas en otras ciudades de Colombia según el alcance del proyecto. Cuénteme dónde está y un asesor lo evalúa."], options: [{ label: "Hablar con un asesor", next: "advisor" }, { label: "Cotizar un servicio", next: "q_service" }] }),
    normativa: (m) => m.lastService ? serviceAnswer(m.lastService, new Set(["normativa"])) : { intent: "normativa", say: ["Trabajamos bajo la Ley General de Archivos (Ley 594 de 2000) y la normativa del AGN, además de:", "• Decreto 1080 de 2015: PGD obligatorio para entidades públicas y privadas con funciones públicas.\n• Ley 527 de 1999: validez legal de la digitalización.\n• Ley 1581 de 2012: protección de datos personales.\n• Decreto 2527 de 1950: validez jurídica de la microfilmación.", "Si le preocupa una sanción o una visita de control, el punto de partida es un diagnóstico de su archivo."], actions: [{ label: "Ver cumplimiento normativo", icon: "shield-check", href: "#sol-cumplimiento" }], options: [{ label: "Empezar con un diagnóstico", next: "q_volume", set: { service: "diagnostico" } }, { label: "Ver Programa de Gestión Documental", next: "info_detail", set: { service: "programa-de-gestion-documental" } }] },
    empresa: () => ({ intent: "empresa", say: ["Transarchivos nació en 1983 para atender a Ecopetrol y fue pionera en crear en Bogotá uno de los primeros centros especializados en custodia documental.", "Hoy, con más de 40 años, ofrecemos consultoría archivística, custodia física y transformación digital, con servicios ágiles, in-house e inmediatos, bajo estricto cumplimiento legal.", "Hemos atendido multinacionales, pymes y microempresas de sectores como salud, financiero, aseguradoras, petróleo, minería, construcción y líneas aéreas."], actions: [{ label: "Conocer más de nosotros", icon: "building", to: "/nosotros" }], options: [{ label: "Conocer los servicios", next: "info_list" }, { label: "Cotizar un servicio", next: "q_service" }] }),
    seguridad: (m) => m.lastService ? serviceAnswer(m.lastService, new Set(["seguridad"])) : { intent: "seguridad", say: ["La seguridad es el centro de lo que hacemos: centro documental con vigilancia 24 h y CCTV, control de acceso, monitoreo ambiental y protección contra incendios.", "Todo se gestiona con cadena de custodia, trazabilidad por código de barras en nuestro software propio Mido y acuerdos de confidencialidad, en cumplimiento de la Ley 1581 de 2012."], options: [{ label: "Ver Custodia de Archivos", next: "info_detail", set: { service: "custodia-de-archivos" } }, { label: "Hablar con un asesor", next: "advisor" }] },
    mido: () => ({ intent: "mido", say: ["Mido es nuestro software propio de gestión documental. Desde que una caja o expediente entra a nuestras instalaciones, registra su ingreso, lo clasifica y lo ubica en tiempo real.", "Así, ante una consulta, sabemos la coordenada exacta del documento para entregarlo en físico o en digital en tiempo récord, con cada paso asentado en una bitácora."], actions: [{ label: "Leer sobre Mido", icon: "journal-text", to: "/blog/mido-software-gestion-documental" }], options: [{ label: "Ver Custodia de Archivos", next: "info_detail", set: { service: "custodia-de-archivos" } }, { label: "Cotizar un servicio", next: "q_service" }] }),
    sostenibilidad: () => ({ intent: "sostenibilidad", say: ["La gestión documental también es sostenibilidad: el 100% del papel que destruimos se integra a cadenas de economía circular, y un buen PGD detiene el crecimiento innecesario del archivo.", "Eso reduce la huella de carbono de su empresa y aporta a sus indicadores ESG."], actions: [{ label: "Leer: economía circular", icon: "journal-text", to: "/blog/gestion-documental-economia-circular" }], options: [{ label: "Ver Destrucción de Documentos", next: "info_detail", set: { service: "destruccion-de-documentos" } }, { label: "Cotizar un servicio", next: "q_service" }] }),
    diagnostico: () => ({ intent: "diagnostico", say: ["Le recomiendo empezar por un diagnóstico documental: no le preguntamos qué servicio quiere, le mostramos qué está pasando hoy con su archivo.", "Identificamos volumen y estado, espacio ocupado, organización, oportunidades de digitalización, necesidades de custodia, disposición final y riesgos normativos. Con eso decide con información real."], actions: [{ label: "Ver el diagnóstico", icon: "search", href: "#diagnostico" }], options: [{ label: "Solicitar diagnóstico", next: "q_volume", set: { service: "diagnostico" } }, { label: "Contarle mi caso", next: "brain:contarle mi caso" }] }),
    contacto: () => ({ intent: "contacto", say: ["Claro. Puede comunicarse con un asesor de Transarchivos por estos medios:"], actions: [{ label: "Llamar al (601) 316-4530", icon: "telephone-fill", href: "tel:+576013164530" }, { label: "Escribir a info@transarchivos.com", icon: "envelope-fill", href: "mailto:info@transarchivos.com" }], options: [{ label: "Volver al inicio", next: "reset" }] }),
    certificaciones: () => ({ intent: "certificaciones", say: ["Trabajamos bajo la Ley 594 de 2000, la normativa del AGN y la Ley 1581 de protección de datos, y entregamos certificados de destrucción y actas de eliminación en cada proceso.", "Si su empresa necesita una certificación específica del proveedor, un asesor le confirma la documentación disponible."], options: [{ label: "Hablar con un asesor", next: "advisor" }, { label: "Ver normativa", next: "brain:normativa" }] }),
    empleo: () => ({ intent: "empleo", say: ["Con gusto. Escríbanos a info@transarchivos.com: si es estudiante o investigador, le compartimos recursos de archivística; si busca empleo, use el asunto «Candidatura espontánea»."], actions: [{ label: "Escribir a info@transarchivos.com", icon: "envelope-fill", href: "mailto:info@transarchivos.com" }], options: [{ label: "Volver al inicio", next: "reset" }] }),
    caso: () => ({ intent: "caso", say: ["Claro, cuénteme con sus palabras qué está pasando con su archivo. Por ejemplo:", "«Tenemos 800 cajas y ya no hay espacio en la oficina», «nos llegó un requerimiento y no encontramos los soportes» o «queremos dejar de imprimir»."] }),
    pqrs: () => ({ intent: "pqrs", say: ["Lamento la situación. Para que su caso quede registrado y se atienda, escríbanos a info@transarchivos.com o llámenos al (601) 316-4530 con los detalles."], actions: [{ label: "Escribir a info@transarchivos.com", icon: "envelope-fill", href: "mailto:info@transarchivos.com" }, { label: "Llamar al (601) 316-4530", icon: "telephone-fill", href: "tel:+576013164530" }] }),
    "obj-caro": (m) => ({ intent: "obj-caro", service: m.lastService, say: ["Entiendo la preocupación por el presupuesto. Vale la pena compararlo con lo que hoy le cuesta su archivo: metros de oficina o bodega, tiempo del personal buscando documentos y el riesgo de una sanción o de perder un soporte en una auditoría.", "En custodia, por ejemplo, pasa de un costo fijo de espacio a uno variable: paga solo por lo que custodia. Y no todo hay que digitalizarlo: priorizamos con sus Tablas de Retención.", "Un diagnóstico le muestra exactamente dónde está el ahorro antes de invertir."], options: [{ label: "Empezar con un diagnóstico", next: "q_volume", set: { service: "diagnostico" } }, ...(m.lastService ? [{ label: "Cotizar este servicio", next: "q_volume", set: { service: m.lastService } }] : []), { label: "Hablar con un asesor", next: "advisor" }] }),
    "obj-interno": () => ({ intent: "obj-interno", say: ["Tiene sentido manejarlo internamente si su equipo tiene el tiempo y la especialidad. Lo que solemos ver es que el archivo crece más rápido que la capacidad del equipo, y aparecen riesgos legales y de espacio.", "Si prefiere que la gestión siga dentro de su empresa, el Servicio Inhouse pone personal especializado en su sede: Transarchivos asume la contratación, los reemplazos y la supervisión, sin pasivos laborales para usted."], options: [{ label: "Ver Servicio Inhouse", next: "info_detail", set: { service: "servicio-inhouse" } }, { label: "Empezar con un diagnóstico", next: "q_volume", set: { service: "diagnostico" } }] }),
    "obj-nube": () => ({ intent: "obj-nube", say: ["La nube es muy útil, pero no es infalible: un ransomware puede cifrar también sus réplicas. Por eso una copia física desconectada de la red (air gap) es el pilar de un Plan de Recuperación ante Desastres.", "Además, lo digital necesita reglas: qué se conserva, cuánto tiempo y con qué metadatos. Eso lo define un Programa de Gestión Documental."], options: [{ label: "Ver Custodia de Medios Magnéticos", next: "info_detail", set: { service: "custodia-de-medios-magneticos" } }, { label: "Ver Programa de Gestión Documental", next: "info_detail", set: { service: "programa-de-gestion-documental" } }] }),
    "obj-confianza": () => ({ intent: "obj-confianza", say: ["Es una pregunta válida: le está confiando información crítica. Llevamos más de 40 años en gestión documental, desde 1983, con una política de cero pérdidas de información.", "Cada caja y expediente queda registrado y ubicado en tiempo real en nuestro software Mido, con cadena de custodia, vigilancia 24 h y acuerdos de confidencialidad. Puede pedirle a un asesor referencias de clientes de su sector."], options: [{ label: "Hablar con un asesor", next: "advisor" }, { label: "¿Qué es Mido?", next: "brain:mido" }] }),
    "obj-competencia": (m) => ({ intent: "obj-competencia", service: m.lastService, say: ["Lo que nos diferencia: más de 40 años de trayectoria (fuimos pioneros en custodia documental en Bogotá), software propio Mido con trazabilidad en tiempo real, y un modelo integral que acompaña todo el ciclo: diagnóstico, solución, protección y disposición final.", ...(m.lastService ? [`En ${lc(svc(m.lastService)!.title)} en particular: ${kb.details[m.lastService].reasons[0].d}`] : [])], options: [{ label: "Cotizar un servicio", next: "q_service" }, { label: "Hablar con un asesor", next: "advisor" }] }),
    saludo: () => ({ intent: "saludo", say: ["¡Hola! ¿En qué le puedo ayudar? Puede contarme qué está pasando con su archivo o elegir una opción."], options: [{ label: "Cotizar un servicio", next: "q_service" }, { label: "Conocer los servicios", next: "info_list" }, { label: "Preguntas frecuentes", next: "faq_list" }] }),
    gracias: () => ({ intent: "gracias", say: ["¡Con gusto! Si necesita algo más, aquí estoy."], options: [{ label: "Cotizar un servicio", next: "q_service" }, { label: "Volver al inicio", next: "reset" }] }),
    despedida: () => ({ intent: "despedida", say: ["¡Hasta pronto! Cuando quiera retomar, aquí estaré. Recuerde que también puede llamarnos al (601) 316-4530."] }),
    bot: () => ({ intent: "bot", say: ["Soy Joel, el asesor virtual de Transarchivos. Funciono con la información de la empresa y de este sitio para orientarle; no reemplazo a un asesor humano, pero le conecto con uno cuando lo necesite."], options: [{ label: "Hablar con un asesor", next: "advisor" }, { label: "Cotizar un servicio", next: "q_service" }] }),
    inyeccion: () => ({ intent: "inyeccion", say: ["Solo puedo ayudarle con temas de gestión documental y de los servicios de Transarchivos. ¿Qué necesita resolver con su archivo?"], options: [{ label: "Conocer los servicios", next: "info_list" }, { label: "Preguntas frecuentes", next: "faq_list" }] }),
    ofensa: (m) => ({ intent: "ofensa", say: m.rude > 1 ? ["Prefiero que mantengamos una conversación respetuosa. Si desea, puede comunicarse directamente con nuestro equipo al (601) 316-4530."] : ["Entiendo que puede estar molesto. Estoy para ayudarle: cuénteme qué necesita y buscamos la mejor solución."], options: [{ label: "Hablar con un asesor", next: "advisor" }] }),
    fuera: () => ({ intent: "fuera", say: ["Ese tema se sale de lo que manejo: soy especialista en gestión documental 📁. Puedo ayudarle a organizar, digitalizar, custodiar o destruir los documentos de su empresa."], options: [{ label: "Conocer los servicios", next: "info_list" }, { label: "Preguntas frecuentes", next: "faq_list" }] }),
  };

  /** Responde a un texto libre del visitante (y recuerda el servicio en contexto). */
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

    // Puntuar intenciones y servicios
    const scores: Record<string, number> = {};
    for (const r of RULES) for (const k of r.kws) if (has(t, words, k)) scores[r.id] = (scores[r.id] || 0) + (r.w ?? 1) * (k.includes(" ") ? 1.5 : 1);
    const svcScore: Record<string, number> = {};
    for (const [slug, kws] of Object.entries(SERVICE_KEYWORDS)) for (const k of kws) if (has(t, words, k)) svcScore[slug] = (svcScore[slug] || 0) + (k.includes(" ") ? 2 : 1.4);
    for (const s of kb.services) if (t.includes(norm(s.title))) svcScore[s.slug] = (svcScore[s.slug] || 0) + 4;
    for (const w of words) { const dest = learned[w]; if (!dest) continue; const [kind, key] = dest.split(":"); if (kind === "service") svcScore[key] = (svcScore[key] || 0) + 2; else if (kind === "intent") scores[key] = (scores[key] || 0) + 2; }
    const painScore: Record<string, number> = {};
    for (const p of PAINS) for (const k of p.kws) if (has(t, words, k)) painScore[p.solution] = (painScore[p.solution] || 0) + 1;

    const topSvc = Object.entries(svcScore).sort((a, b) => b[1] - a[1]);
    const topIntent = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const asked = new Set(Object.keys(scores));
    const refersBack = /\b(eso|ese|esa|este servicio|ese servicio|lo mismo|y cuanto|y el|y la)\b/.test(t);

    // Defensa primero: inyección, ofensas, fuera de tema
    if (scores.inyeccion) return RESP.inyeccion(mem, asked);
    if (scores.ofensa) { mem.rude++; return RESP.ofensa(mem, asked); }

    // Pregunta específica conocida (la respuesta más precisa)
    const fact = matchFact(t, words, mem);
    if (fact) { const r = fact.reply(); return { intent: `fact-${fact.id}`, service: fact.svc, ...r }; }

    // Objeciones: se responden primero (con el servicio en contexto, si lo hay)
    const obj = topIntent.find(([id]) => id.startsWith("obj-"));
    if (obj) { if (topSvc[0]) mem.lastService = topSvc[0][0]; return RESP[obj[0]](mem, asked); }

    // Dolor del cliente → asesoría por solución (si no nombra un servicio concreto)
    const topPain = Object.entries(painScore).sort((a, b) => b[1] - a[1])[0];
    // El dolor gana salvo que nombre el servicio explícitamente (puntaje alto).
    if (topPain && (!topSvc[0] || topSvc[0][1] < 4) && !scores.precio) return solutionAnswer(topPain[0]);

    // Servicio(s) mencionados
    if (topSvc[0] && topSvc[0][1] >= 1.4) {
      const second = topSvc[1] && topSvc[1][1] >= topSvc[0][1] * 0.8 ? topSvc[1][0] : null;
      const reply = serviceAnswer(topSvc[0][0], asked);
      if (second && reply.intent.startsWith("svc-")) {
        reply.say = [`Veo que le interesan ${svc(topSvc[0][0])!.title} y ${svc(second)!.title}; suelen trabajarse juntos.`, ...reply.say.slice(1, 2)];
        reply.options = [{ label: `Ver ${svc(topSvc[0][0])!.title}`, next: "info_detail", set: { service: topSvc[0][0] } }, { label: `Ver ${svc(second)!.title}`, next: "info_detail", set: { service: second } }, { label: "Empezar con un diagnóstico", next: "q_volume", set: { service: "diagnostico" } }];
      }
      return reply;
    }

    // Pregunta de seguimiento sobre el servicio del que se venía hablando
    if (mem.lastService && (refersBack || asked.has("precio") || asked.has("tiempo") || asked.has("normativa") || asked.has("seguridad"))) {
      return serviceAnswer(mem.lastService, asked);
    }

    // Intención general
    if (topIntent[0] && RESP[topIntent[0][0]]) return RESP[topIntent[0][0]](mem, asked);

    // Preguntas frecuentes por coincidencia de palabras
    const kw = keywordsOf(text);
    let bestFaq = -1, bestFaqScore = 0;
    kb.faqs.forEach((f, i) => { const fk = keywordsOf(f.q + " " + f.a); const sc = kw.filter(w => fk.some(x => stem(x) === stem(w))).length; if (sc > bestFaqScore) { bestFaqScore = sc; bestFaq = i; } });
    if (bestFaq >= 0 && bestFaqScore >= 2) return { intent: "faq", say: [kb.faqs[bestFaq].a], actions: [{ label: "Ver todas las preguntas", icon: "question-circle", href: "#faq" }], options: [{ label: "Otra pregunta", next: "faq_list" }, { label: "Cotizar un servicio", next: "q_service" }] };

    // Blog
    const post = kb.posts.find(p => { const pk = keywordsOf(p.title + " " + p.excerpt); return kw.filter(w => pk.some(x => stem(x) === stem(w))).length >= 2; });
    if (post) return { intent: "blog", say: [`Tenemos un artículo sobre eso: «${post.title}».`, post.excerpt], actions: [{ label: "Leer el artículo", icon: "journal-text", to: `/blog/${post.slug}` }], options: [{ label: "Cotizar un servicio", next: "q_service" }, { label: "Volver al inicio", next: "reset" }] };

    if (scores.fuera) return RESP.fuera(mem, asked);

    // No entendió: guarda las palabras para aprender de la siguiente elección
    mem.unknownStreak++;
    mem.pendingWords = kw;
    const p = load(); p.unknown = [text, ...p.unknown].slice(0, 30); save(p);
    if (mem.unknownStreak >= 2) return { intent: "fallback2", say: ["Quiero asegurarme de ayudarle bien. ¿Le parece si le comunico con un asesor, o me cuenta su caso en pocas palabras (por ejemplo: «tengo 500 cajas y no tengo espacio»)?"], options: [{ label: "Hablar con un asesor", next: "advisor" }, { label: "Empezar con un diagnóstico", next: "q_volume", set: { service: "diagnostico" } }, { label: "Conocer los servicios", next: "info_list" }] };
    return { intent: "fallback", say: ["No estoy seguro de haber entendido. 🤔", "¿Se refiere a alguna de estas opciones? Así aprendo para la próxima."], options: [{ label: "Cotizar un servicio", next: "q_service" }, { label: "Conocer los servicios", next: "info_list" }, { label: "Preguntas frecuentes", next: "faq_list" }, { label: "Hablar con un asesor", next: "advisor" }] };
  }

  /** Aprende: asocia las palabras que no entendió con lo que el visitante eligió después. */
  function learn(mem: Memory, dest: string) {
    if (!mem.pendingWords.length) return;
    const p = load();
    for (const w of mem.pendingWords) if (!SERVICE_KEYWORDS[w] && w.length >= 4) p.learned[w] = dest;
    save(p); mem.pendingWords = []; mem.unknownStreak = 0;
  }

  /** Saludo según el comportamiento del visitante en el sitio. */
  function greeting(): JoelReply {
    const ins = getInsight();
    const base: JoelOption[] = [
      { label: "Cotizar un servicio", next: "q_service" }, { label: "Conocer los servicios", next: "info_list" },
      { label: "Preguntas frecuentes", next: "faq_list" }, { label: "Hablar con un asesor", next: "advisor" },
    ];
    const top = ins.topServices[0] ? svc(ins.topServices[0]) : undefined;
    if (top && ins.segment === "comprador") return { intent: "saludo-comprador", service: top.slug, say: [ins.returning ? "¡Qué bueno verle de nuevo! Soy Joel, el asesor virtual de Transarchivos. 👋" : "¡Hola! Soy Joel, el asesor virtual de Transarchivos. 👋", `Veo que le interesa ${top.title}. ¿Le ayudo a terminar su solicitud de cotización?`], options: [{ label: `Cotizar ${top.title}`, next: "q_volume", set: { service: top.slug } }, ...base.slice(1, 4)] };
    if (ins.segment === "tecnico") return { intent: "saludo-tecnico", say: ["¡Hola! Soy Joel, el asesor virtual de Transarchivos. 👋", top ? `Veo que ha revisado contenido técnico sobre ${lc(top.title)}. Puedo resolver dudas de normativa o ayudarle a llevarlo a la práctica en su empresa.` : "Veo que le interesa el contenido técnico. Puedo resolver dudas de normativa o ayudarle a llevarlo a la práctica en su empresa."], options: [{ label: "Dudas de normativa", next: "brain:normativa" }, { label: "Empezar con un diagnóstico", next: "q_volume", set: { service: "diagnostico" } }, ...base.slice(1, 3)] };
    if (top) return { intent: "saludo-interes", service: top.slug, say: [ins.returning ? "¡Qué bueno verle de nuevo! Soy Joel. 👋" : "¡Hola! Soy Joel, el asesor virtual de Transarchivos. 👋", `Noto que ha estado revisando ${top.title}. ¿Quiere que le cuente cómo funciona o prefiere cotizarlo?`], options: [{ label: `Conocer ${top.title}`, next: "info_detail", set: { service: top.slug } }, { label: `Cotizar ${top.title}`, next: "q_volume", set: { service: top.slug } }, ...base.slice(2, 4)] };
    if (ins.returning) return { intent: "saludo", say: ["¡Qué bueno verle de nuevo! Soy Joel, el asesor virtual de Transarchivos. 👋", "¿En qué le puedo ayudar hoy? También puede escribirme su caso con sus palabras."], options: base };
    return { intent: "saludo", say: ["¡Hola! Soy Joel, el asesor virtual de Transarchivos. 👋", "¿En qué le puedo ayudar hoy? Puede elegir una opción o contarme su caso con sus palabras."], options: base };
  }

  return { respond, learn, greeting };
}
