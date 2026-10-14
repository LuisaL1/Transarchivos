// ─── Perfil del visitante ─────────────────────────────────────────────────
// Lo que el sitio recuerda de cada visitante en SU navegador (localStorage,
// sin servidor): visitas, secciones y servicios vistos, búsquedas, palabras
// aprendidas y preguntas que Joel no supo responder. Está separado del
// cerebro de Joel (joel.ts) para que las páginas puedan registrar eventos sin
// cargar el chat completo (el chat se descarga aparte).

export type Profile = {
  visits: number; first: number; last: number;
  counts: Record<string, number>;      // "section:faq", "service:slug", "article:slug", "quote:slug", "chat:intent"
  searches: string[];
  learned: Record<string, string>;     // palabra → destino ("service:slug" | "step:id" | "intent:x")
  unknown: string[];                   // preguntas que no supo responder (para revisar)
};
const KEY = "ta-joel-profile";
const empty = (): Profile => ({ visits: 0, first: Date.now(), last: Date.now(), counts: {}, searches: [], learned: {}, unknown: [] });

export function load(): Profile {
  try { const p = JSON.parse(localStorage.getItem(KEY) || "null"); if (p && typeof p === "object") return { ...empty(), ...p }; } catch { /* sin almacenamiento */ }
  return empty();
}
export function save(p: Profile) { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* sin almacenamiento */ } }

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
