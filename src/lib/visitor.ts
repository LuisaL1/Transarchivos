// ─── Perfil del visitante ─────────────────────────────────────────────────
// Lo que el sitio recuerda de cada visitante en SU navegador (localStorage,
// sin servidor): visitas, secciones y servicios vistos y búsquedas. En esta
// variante el chat es el widget de Zoho SalesIQ, que no lo lee (antes Joel lo
// usaba para personalizar el saludo).

export type Profile = {
  visits: number; first: number; last: number;
  counts: Record<string, number>;      // "section:faq", "service:slug", "article:slug", "quote:slug"
  searches: string[];
};
const KEY = "ta-joel-profile";
const empty = (): Profile => ({ visits: 0, first: Date.now(), last: Date.now(), counts: {}, searches: [] });

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
export function track(kind: "section" | "service" | "article" | "quote", key: string) {
  const p = load(); const k = `${kind}:${key}`;
  p.counts[k] = (p.counts[k] || 0) + 1; p.last = Date.now(); save(p);
}
export function trackSearch(q: string) {
  const t = q.trim(); if (t.length < 3) return;
  const p = load(); p.searches = [t, ...p.searches.filter(x => x !== t)].slice(0, 15); save(p);
}

