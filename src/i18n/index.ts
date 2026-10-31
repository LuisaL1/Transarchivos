// Idiomas del sitio: español en la raíz ("/") e inglés con prefijo ("/en").
// El idioma sale de la URL, así cada versión tiene sus propias direcciones
// para Google (hreflang). Misma arquitectura que el sitio de Transpack.
//
// - Las direcciones en inglés llevan secciones y slugs traducidos
//   (/en/services/document-custody); el contenido se busca siempre por el
//   slug en español (slugEs).
// - Textos cortos: tr("español", "English"). Textos largos y datos: src/i18n/ui.ts
//   y los archivos *.en.ts de src/data.
import { useCallback } from "react";
import { useLocation } from "react-router-dom";

export type Lang = "es" | "en";
/** Idiomas publicados: rutas, selector de idioma, hreflang y sitemap. */
export const LANGS: Lang[] = ["es", "en"];

export const LANG_INFO: Record<Lang, { name: string; region: string; locale: string; hreflang: string; ogLocale: string }> = {
  es: { name: "Español", region: "Latinoamérica y España", locale: "es-CO", hreflang: "es", ogLocale: "es_CO" },
  en: { name: "English", region: "International", locale: "en-US", hreflang: "en", ogLocale: "en_US" },
};

export type Tr = (es: string, en: string) => string;
const makeTr = (lang: Lang): Tr => (es, en) => (lang === "es" ? es : en);

// ─── Rutas ──────────────────────────────────────────────────────────────────
type L = Exclude<Lang, "es">;

// Secciones con nombre propio en cada idioma
const SECTIONS: Record<string, Record<L, string>> = {
  servicios: { en: "services" },
  nosotros: { en: "about" },
  privacidad: { en: "privacy" },
  politicas: { en: "policies" },
  videos: { en: "videos" },
  blog: { en: "blog" },
};

// Slugs de servicios y artículos (el español manda; aquí solo la traducción)
const SLUGS: Record<string, Record<L, string>> = {
  "levantamiento-de-inventario": { en: "document-inventory" },
  "programa-de-gestion-documental": { en: "records-management-program" },
  "custodia-de-medios-magneticos": { en: "media-vaulting" },
  "custodia-de-archivos": { en: "records-storage" },
  "digitalizacion-de-documentos": { en: "document-scanning" },
  "destruccion-de-documentos": { en: "document-destruction" },
  "microfilmacion-de-archivos": { en: "microfilm-conversion" },
  "servicio-inhouse": { en: "on-site-records-management" },
  "servicio-inmediato": { en: "rapid-retrieval" },
  "mido-software-gestion-documental": { en: "mido-records-management-software" },
  "gestion-documental-economia-circular": { en: "records-management-circular-economy" },
  "ciclo-de-vida-documental-sostenibilidad": { en: "document-lifecycle-sustainability" },
  "inteligencia-documental-engranaje-maestro": { en: "document-intelligence-master-gear" },
};

const PREFIXED = LANGS.filter(l => l !== "es") as L[];

/** Idioma de una ruta (el español va sin prefijo). */
export const langOf = (pathname: string): Lang => {
  const first = pathname.split("/")[1] as L;
  return PREFIXED.includes(first) ? first : "es";
};

const splitPath = (path: string) => {
  const m = path.match(/^([^?#]*)(.*)$/);
  return { pathname: m?.[1] || "/", rest: m?.[2] ?? "" };
};

const toLocal = (part: string, lang: L) => SECTIONS[part]?.[lang] ?? SLUGS[part]?.[lang] ?? part;
const fromLocal = (part: string, lang: L) =>
  Object.keys(SECTIONS).find(k => SECTIONS[k][lang] === part) ?? Object.keys(SLUGS).find(k => SLUGS[k][lang] === part) ?? part;

/** Slug en cualquier idioma → slug en español (para buscar el contenido). */
export const slugEs = (slug: string, lang: Lang) => (lang === "es" ? slug : fromLocal(slug, lang));

/** Ruta en español → la misma ruta en el idioma pedido. */
export function localize(path: string, lang: Lang): string {
  if (lang === "es") return path;
  const { pathname, rest } = splitPath(path);
  const p = pathname.split("/").map(part => toLocal(part, lang)).join("/");
  return (p === "/" ? `/${lang}` : `/${lang}${p}`) + rest;
}

/** Ruta en cualquier idioma → su equivalente en español. */
export function toSpanish(path: string): string {
  const { pathname, rest } = splitPath(path);
  const lang = langOf(pathname);
  if (lang === "es") return path;
  const p = pathname.slice(lang.length + 1).split("/").map(part => fromLocal(part, lang)).join("/") || "/";
  return p + rest;
}

/** Idioma actual + utilidades para enlazar y traducir textos cortos. */
export function useLang() {
  const { pathname, search, hash } = useLocation();
  const lang = langOf(pathname);
  const lp = useCallback((path: string) => localize(path, lang), [lang]);
  const tr = useCallback<Tr>((es, en) => makeTr(lang)(es, en), [lang]);
  // La página actual en otro idioma (para el selector)
  const switchTo = (target: Lang) => localize(toSpanish(pathname + search + hash), target);
  return { lang, lp, tr, switchTo };
}
