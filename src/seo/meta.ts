import { blogPosts, type Post } from "@/data/blog";
import { VIDEOS } from "@/data/videos";
import { getContent } from "@/i18n/content";
import { LANG_INFO, LANGS, langOf, localize, toSpanish, type Lang } from "@/i18n";
import { BRAND, GOOGLE_VERIFICATION, INDEXABLE, SITE_URL, abs } from "@/seo/site";

// ─── Metadatos por ruta ─────────────────────────────────────────────────────
// Una sola función para el servidor (pre-generación de HTML en el build) y el
// navegador (SeoHead al cambiar de ruta), así ambos dicen exactamente lo mismo.
// Cada página existe en español ("/…") y en inglés ("/en/…"), con su propio
// título, descripción y canónica, y enlaces hreflang a la misma página en el
// otro idioma (x-default: español).

type JsonLd = Record<string, unknown>;
export type PageMeta = {
  path: string;
  lang: Lang;
  title: string;
  description: string;
  canonical: string;
  /** La misma página en cada idioma (hreflang), con x-default en español */
  alternates: { hreflang: string; href: string }[];
  robots: string;
  ogType: "website" | "article";
  image: string;
  imageAlt: string;
  jsonLd: JsonLd[];
  notFound?: boolean;
  /** Para el sitemap */
  lastmod?: string;
  priority?: number;
};

const ORG_ID = `${SITE_URL}/#organizacion`;
const SITE_ID = `${SITE_URL}/#sitio`;

/** Recorta en un límite de palabra, sin pasar de `max` caracteres. */
export function clip(text: string, max = 158) {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.\s]+$/, "") + "…";
}

const MONTHS: Record<string, string> = { enero: "01", febrero: "02", marzo: "03", abril: "04", mayo: "05", junio: "06", julio: "07", agosto: "08", septiembre: "09", octubre: "10", noviembre: "11", diciembre: "12" };
/** "3 de agosto de 2026" → "2026-08-03" */
export function isoDate(es: string) {
  const m = es.toLowerCase().match(/(\d{1,2}) de ([a-z]+) de (\d{4})/);
  if (!m || !MONTHS[m[2]]) throw new Error(`Fecha no reconocida: ${es}`);
  return `${m[3]}-${MONTHS[m[2]]}-${m[1].padStart(2, "0")}`;
}

const organization: JsonLd = {
  "@type": "ProfessionalService",
  "@id": ORG_ID,
  name: BRAND.legalName,
  alternateName: BRAND.name,
  url: SITE_URL + "/",
  logo: abs(BRAND.logo),
  image: abs(BRAND.ogImage),
  description: BRAND.description,
  slogan: BRAND.slogan,
  foundingDate: BRAND.foundingDate,
  email: BRAND.email,
  telephone: BRAND.phones[0],
  address: { "@type": "PostalAddress", ...BRAND.address },
  areaServed: [{ "@type": "City", name: "Bogotá" }, { "@type": "Country", name: "Colombia" }],
  contactPoint: BRAND.phones.map(t => ({ "@type": "ContactPoint", telephone: t, email: BRAND.email, contactType: "customer service", areaServed: "CO", availableLanguage: ["es", "en"] })),
  sameAs: BRAND.sameAs,
  knowsAbout: ["Gestión documental", "Custodia de archivos", "Digitalización de documentos", "Destrucción de documentos", "Microfilmación", "Ley 594 de 2000"],
};
const website: JsonLd = { "@type": "WebSite", "@id": SITE_ID, url: SITE_URL + "/", name: BRAND.name, inLanguage: ["es-CO", "en"], publisher: { "@id": ORG_ID } };

const graph = (...nodes: JsonLd[]): JsonLd => ({ "@context": "https://schema.org", "@graph": [organization, website, ...nodes] });
const breadcrumb = (items: [string, string][]): JsonLd => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: abs(path) })),
});
const webPage = (path: string, lang: Lang, name: string, description: string, type = "WebPage"): JsonLd => ({
  "@type": type, "@id": abs(path) + "#pagina", url: abs(path), name, description, inLanguage: LANG_INFO[lang].locale, isPartOf: { "@id": SITE_ID }, about: { "@id": ORG_ID },
});

/** Ruta en español → la misma página en cada idioma (+ x-default en español). */
const alternatesOf = (esPath: string) => [
  ...LANGS.map(l => ({ hreflang: LANG_INFO[l].hreflang, href: abs(localize(esPath, l)) })),
  { hreflang: "x-default", href: abs(esPath) },
];

// `esPath`: ruta en español de la página; `path`: la ruta en el idioma pedido.
const base = (esPath: string, lang: Lang) => {
  const path = localize(esPath, lang);
  return {
    path, lang,
    canonical: path === "/" ? SITE_URL + "/" : abs(path),
    alternates: alternatesOf(esPath),
    robots: INDEXABLE ? "index, follow, max-image-preview:large, max-snippet:-1" : "noindex, nofollow",
    image: abs(BRAND.ogImage),
    imageAlt: lang === "es" ? `${BRAND.legalName} · ${BRAND.slogan}` : `${BRAND.legalName} · Records management in Bogotá since 1983`,
    ogType: "website" as const,
  };
};
const tr = (lang: Lang, es: string, en: string) => (lang === "es" ? es : en);
const lp = (lang: Lang, esPath: string) => localize(esPath, lang);

function homeMeta(lang: Lang): PageMeta {
  const c = getContent(lang);
  const title = tr(lang, "Gestión documental en Bogotá | Transarchivos Ltda.", "Records management in Bogotá, Colombia | Transarchivos Ltda.");
  const description = tr(lang,
    "Clasificación, digitalización, custodia y destrucción certificada de documentos para empresas, bajo la Ley 594 de 2000. Más de 40 años de experiencia en Bogotá.",
    "Classification, scanning, storage and certified destruction of business records under Colombia's Law 594 of 2000. More than 40 years of experience in Bogotá.");
  return {
    ...base("/", lang), title, description, priority: 1,
    jsonLd: [graph(
      webPage(lp(lang, "/"), lang, title, description),
      {
        "@type": "ItemList", name: tr(lang, "Servicios de gestión documental", "Records management services"),
        itemListElement: c.services.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.title, url: abs(lp(lang, `/servicios/${s.slug}`)) })),
      },
      { "@type": "FAQPage", mainEntity: c.faqs.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    )],
  };
}

function nosotrosMeta(lang: Lang): PageMeta {
  const title = tr(lang, "Quiénes somos: pioneros desde 1983 | Transarchivos", "About us: pioneers since 1983 | Transarchivos");
  const description = tr(lang,
    "Nacimos en 1983 para atender a Ecopetrol y fuimos pioneros en crear en Bogotá uno de los primeros centros de custodia documental. Conozca nuestra historia.",
    "Founded in 1983 to serve Ecopetrol, we pioneered one of the first document custody centres in Bogotá. Discover our history, team, values and infrastructure.");
  const path = lp(lang, "/nosotros");
  return {
    ...base("/nosotros", lang), title, description, priority: 0.7,
    jsonLd: [graph(webPage(path, lang, title, description, "AboutPage"), breadcrumb([[tr(lang, "Inicio", "Home"), lp(lang, "/")], [tr(lang, "Nosotros", "About us"), path]]))],
  };
}

function serviceMeta(slug: string, lang: Lang): PageMeta | null {
  const c = getContent(lang);
  const s = c.services.find(x => x.slug === slug);
  const d = c.serviceDetails[slug];
  if (!s || !d) return null;
  const esPath = `/servicios/${slug}`;
  const path = lp(lang, esPath);
  const name = d.title ?? s.title;
  const title = tr(lang, `${name} en Bogotá | Transarchivos`, `${name} in Bogotá | Transarchivos`);
  const description = clip(`${name}: ${d.intro}`);
  return {
    ...base(esPath, lang), title, description, priority: 0.9,
    jsonLd: [graph(
      webPage(path, lang, title, description),
      {
        "@type": "Service", "@id": abs(path) + "#servicio", name, serviceType: name, description: d.intro,
        provider: { "@id": ORG_ID }, areaServed: [{ "@type": "City", name: "Bogotá" }, { "@type": "Country", name: "Colombia" }], url: abs(path),
      },
      breadcrumb([[tr(lang, "Inicio", "Home"), lp(lang, "/")], [tr(lang, "Servicios", "Services"), lp(lang, "/#servicios")], [name, path]]),
    )],
  };
}

function articleMeta(esPost: Post, lang: Lang): PageMeta {
  const post = getContent(lang).blogPosts.find(p => p.slug === esPost.slug) ?? esPost;
  const esPath = `/blog/${post.slug}`;
  const path = lp(lang, esPath);
  const date = isoDate(esPost.date);
  const title = clip(`${post.title} | Transarchivos`, 70);
  const description = clip(post.excerpt);
  const image = abs(post.cover);
  return {
    ...base(esPath, lang), title, description, ogType: "article", image, imageAlt: post.title, lastmod: date, priority: 0.6,
    jsonLd: [graph(
      webPage(path, lang, post.title, description),
      {
        "@type": "BlogPosting", "@id": abs(path) + "#articulo", headline: clip(post.title, 110), description, image: [image],
        datePublished: date, dateModified: date, inLanguage: LANG_INFO[lang].locale, articleSection: post.cat,
        author: { "@id": ORG_ID }, publisher: { "@id": ORG_ID }, mainEntityOfPage: { "@id": abs(path) + "#pagina" },
      },
      breadcrumb([[tr(lang, "Inicio", "Home"), lp(lang, "/")], ["Blog", lp(lang, "/#blog")], [post.title, path]]),
    )],
  };
}

function privacyMeta(lang: Lang): PageMeta {
  const title = tr(lang, "Política de privacidad y datos personales | Transarchivos", "Privacy and personal data policy | Transarchivos");
  const description = tr(lang,
    "Cómo el sitio web de Transarchivos Ltda. recoge y trata sus datos personales, el uso de cookies y cómo ejercer sus derechos según la Ley 1581 de 2012.",
    "How the Transarchivos Ltda. website collects and processes your personal data, how it uses cookies and how to exercise your rights under Law 1581 of 2012.");
  const path = lp(lang, "/privacidad");
  return {
    ...base("/privacidad", lang), title, description, priority: 0.3,
    jsonLd: [graph(webPage(path, lang, title, description), breadcrumb([[tr(lang, "Inicio", "Home"), lp(lang, "/")], [tr(lang, "Privacidad", "Privacy"), path]]))],
  };
}

function policiesMeta(lang: Lang): PageMeta {
  const title = tr(lang, "Políticas institucionales | Transarchivos Ltda.", "Institutional policies | Transarchivos Ltda.");
  const description = tr(lang,
    "Protección de datos personales, seguridad de la información, seguridad vial, responsabilidad social, transparencia empresarial y política HSEQ de Transarchivos.",
    "Transarchivos' personal data protection, information security, road safety, social responsibility, corporate transparency and HSEQ policies (in Spanish).");
  const path = lp(lang, "/politicas");
  return {
    ...base("/politicas", lang), title, description, priority: 0.3,
    jsonLd: [graph(webPage(path, lang, title, description), breadcrumb([[tr(lang, "Inicio", "Home"), lp(lang, "/")], [tr(lang, "Políticas", "Policies"), path]]))],
  };
}

function videosMeta(lang: Lang): PageMeta {
  const title = tr(lang, "Da play al conocimiento: videos de gestión documental | Transarchivos", "Press play on knowledge: records management videos | Transarchivos");
  const description = tr(lang,
    "Todos los videos del canal de YouTube de Transarchivos: Ley 594 de 2000, tablas de retención, digitalización, custodia y destrucción certificada de documentos.",
    "All the videos from Transarchivos' YouTube channel (in Spanish): Law 594 of 2000, retention schedules, scanning, storage and certified destruction of documents.");
  const path = lp(lang, "/videos");
  return {
    ...base("/videos", lang), title, description, priority: 0.6,
    jsonLd: [graph(
      webPage(path, lang, title, description, "CollectionPage"),
      { "@type": "ItemList", name: tr(lang, "Videos de Transarchivos", "Transarchivos videos"), itemListElement: VIDEOS.map((v, i) => ({ "@type": "ListItem", position: i + 1, name: v.title, url: `https://www.youtube.com/watch?v=${v.id}` })) },
      breadcrumb([[tr(lang, "Inicio", "Home"), lp(lang, "/")], [tr(lang, "Da play al conocimiento", "Press play on knowledge"), path]]),
    )],
  };
}

function notFoundMeta(path: string, lang: Lang): PageMeta {
  return {
    ...base("/", lang), path, canonical: abs(lp(lang, "/")), alternates: [], robots: "noindex, follow", notFound: true,
    title: tr(lang, "Página no encontrada | Transarchivos", "Page not found | Transarchivos"),
    description: tr(lang, "La página que busca no existe o cambió de dirección. Vuelva al inicio para conocer nuestros servicios de gestión documental.", "The page you are looking for does not exist or has moved. Go back to the home page to discover our records management services."),
    jsonLd: [],
  };
}

/** Metadatos de cualquier ruta, en su idioma (las desconocidas devuelven la página 404). */
export function getPageMeta(pathname: string): PageMeta {
  const path = pathname.replace(/\/+$/, "") || "/";
  const lang = langOf(path);
  const es = toSpanish(path);
  if (es === "/") return homeMeta(lang);
  if (es === "/nosotros") return nosotrosMeta(lang);
  if (es === "/privacidad") return privacyMeta(lang);
  if (es === "/politicas") return policiesMeta(lang);
  if (es === "/videos") return videosMeta(lang);
  const svc = es.match(/^\/servicios\/([a-z0-9-]+)$/);
  if (svc) return serviceMeta(svc[1], lang) ?? notFoundMeta(path, lang);
  const art = es.match(/^\/blog\/([a-z0-9-]+)$/);
  if (art) { const post = blogPosts.find(p => p.slug === art[1]); return post ? articleMeta(post, lang) : notFoundMeta(path, lang); }
  return notFoundMeta(path, lang);
}

/** Todas las rutas públicas en español (sin prefijo de idioma). */
const ES_ROUTES = ["/", "/nosotros", "/privacidad", "/politicas", "/videos", ...getContent("es").services.map(s => `/servicios/${s.slug}`), ...blogPosts.map(p => `/blog/${p.slug}`)];
/** Todas las rutas públicas en todos los idiomas (pre-generación y sitemap). */
export const PUBLIC_ROUTES = LANGS.flatMap(l => ES_ROUTES.map(r => localize(r, l)));

// ─── HTML del <head> (lo usa la pre-generación) ─────────────────────────────
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
// JSON-LD dentro de <script>: se escapa "<" para que ningún texto cierre la etiqueta.
const jsonForScript = (o: JsonLd) => JSON.stringify(o).replace(/</g, "\\u003c");

export function renderHeadTags(m: PageMeta): string {
  const tags = [
    `<title data-seo>${esc(m.title)}</title>`,
    `<meta data-seo name="description" content="${esc(m.description)}" />`,
    `<meta data-seo name="robots" content="${m.robots}" />`,
    `<link data-seo rel="canonical" href="${m.canonical}" />`,
    ...m.alternates.map(a => `<link data-seo rel="alternate" hreflang="${a.hreflang}" href="${esc(a.href)}" />`),
    `<meta data-seo property="og:site_name" content="${BRAND.name}" />`,
    `<meta data-seo property="og:locale" content="${LANG_INFO[m.lang].ogLocale}" />`,
    ...LANGS.filter(l => l !== m.lang).map(l => `<meta data-seo property="og:locale:alternate" content="${LANG_INFO[l].ogLocale}" />`),
    `<meta data-seo property="og:type" content="${m.ogType}" />`,
    `<meta data-seo property="og:title" content="${esc(m.title)}" />`,
    `<meta data-seo property="og:description" content="${esc(m.description)}" />`,
    `<meta data-seo property="og:url" content="${m.canonical}" />`,
    `<meta data-seo property="og:image" content="${m.image}" />`,
    `<meta data-seo property="og:image:alt" content="${esc(m.imageAlt)}" />`,
    `<meta data-seo name="twitter:card" content="summary_large_image" />`,
    `<meta data-seo name="twitter:title" content="${esc(m.title)}" />`,
    `<meta data-seo name="twitter:description" content="${esc(m.description)}" />`,
    `<meta data-seo name="twitter:image" content="${m.image}" />`,
    ...(GOOGLE_VERIFICATION ? [`<meta name="google-site-verification" content="${esc(GOOGLE_VERIFICATION)}" />`] : []),
    ...m.jsonLd.map(o => `<script data-seo type="application/ld+json">${jsonForScript(o)}</script>`),
  ];
  return tags.join("\n    ");
}
