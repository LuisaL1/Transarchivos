import { getContent } from "@/i18n/content";
import { localize, type Lang } from "@/i18n";
import { UI } from "@/i18n/ui";

// ─── Búsqueda del header ────────────────────────────────────────────────────
// Índice combinado de servicios, artículos del blog, preguntas frecuentes de
// los servicios y secciones de la propia portada, en el idioma de la página,
// para que la lupa del navbar busque sobre contenido real del sitio.
export type SearchResult = { kind: "Servicio" | "Artículo" | "Sección" | "Pregunta"; title: string; desc: string; to?: string; href?: string };

const indexes: Partial<Record<Lang, SearchResult[]>> = {};
function indexOf(lang: Lang): SearchResult[] {
  if (indexes[lang]) return indexes[lang]!;
  const c = getContent(lang), s = UI[lang].search.index, lp = (p: string) => localize(p, lang);
  const section = (k: keyof typeof s, dest: { href?: string; to?: string }): SearchResult => ({ kind: "Sección", title: s[k][0], desc: s[k][1], ...dest });
  const idx: SearchResult[] = [
    section("diagnostic", { href: "#cotizador" }), section("solutions", { href: "#soluciones" }), section("model", { href: "#modelo" }), section("faq", { href: "#faq" }),
    section("blog", { href: "#blog" }), section("videos", { to: lp("/videos") }), section("quote", { href: "#cotizador" }),
    ...c.services.map(x => ({ kind: "Servicio" as const, title: x.title, desc: x.desc, to: lp(`/servicios/${x.slug}`) })),
    ...c.blogPosts.map(p => ({ kind: "Artículo" as const, title: p.title, desc: p.excerpt, to: lp(`/blog/${p.slug}`) })),
    // Preguntas frecuentes de cada servicio: llevan a la sección de preguntas de su página.
    ...c.services.flatMap(x => (c.serviceFaqs[x.slug] ?? []).map(f => ({ kind: "Pregunta" as const, title: f.q, desc: x.title, to: lp(`/servicios/${x.slug}#preguntas`) }))),
  ];
  indexes[lang] = idx;
  return idx;
}

// Sin tildes ni diéresis: quien escribe rápido en un buscador casi nunca
// tipea acentos ("digitalizacion" debe encontrar "Digitalización").
const foldAccents = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "");

export function searchContent(query: string, lang: Lang = "es"): SearchResult[] {
  const q = foldAccents(query.trim().toLowerCase());
  // Con 1 sola letra casi cualquier palabra matchea (demasiado ruido para ser
  // útil) — se pide un mínimo de 2 caracteres antes de mostrar resultados.
  if (q.length < 2) return [];
  // Cada palabra debe aparecer (en el título o la descripción), en cualquier
  // orden: "microfilm validez" encuentra la pregunta sobre validez del microfilm.
  const words = q.split(" ").filter(Boolean);
  return indexOf(lang).filter(r => { const t = foldAccents((r.title + " " + r.desc).toLowerCase()); return words.every(w => t.includes(w)); }).slice(0, 7);
}
