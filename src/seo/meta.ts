import { blogPosts, type Post } from "@/data/blog";
import { FAQS } from "@/data/faqs";
import { SERVICE_DETAILS } from "@/data/serviceDetails";
import { services } from "@/data/services";
import { BRAND, GOOGLE_VERIFICATION, INDEXABLE, SITE_URL, abs } from "@/seo/site";

// ─── Metadatos por ruta ─────────────────────────────────────────────────────
// Una sola función para el servidor (pre-generación de HTML en el build) y el
// navegador (SeoHead al cambiar de ruta), así ambos dicen exactamente lo mismo.

export type JsonLd = Record<string, unknown>;
export type PageMeta = {
  path: string;
  title: string;
  description: string;
  canonical: string;
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
  contactPoint: BRAND.phones.map(t => ({ "@type": "ContactPoint", telephone: t, email: BRAND.email, contactType: "customer service", areaServed: "CO", availableLanguage: "es" })),
  sameAs: BRAND.sameAs,
  knowsAbout: ["Gestión documental", "Custodia de archivos", "Digitalización de documentos", "Destrucción de documentos", "Microfilmación", "Ley 594 de 2000"],
};
const website: JsonLd = { "@type": "WebSite", "@id": SITE_ID, url: SITE_URL + "/", name: BRAND.name, inLanguage: "es-CO", publisher: { "@id": ORG_ID } };

const graph = (...nodes: JsonLd[]): JsonLd => ({ "@context": "https://schema.org", "@graph": [organization, website, ...nodes] });
const breadcrumb = (items: [string, string][]): JsonLd => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: abs(path) })),
});
const webPage = (path: string, name: string, description: string, type = "WebPage"): JsonLd => ({
  "@type": type, "@id": abs(path) + "#pagina", url: abs(path), name, description, inLanguage: "es-CO", isPartOf: { "@id": SITE_ID }, about: { "@id": ORG_ID },
});

const base = (path: string) => ({
  path,
  canonical: path === "/" ? SITE_URL + "/" : abs(path),
  robots: INDEXABLE ? "index, follow, max-image-preview:large, max-snippet:-1" : "noindex, nofollow",
  image: abs(BRAND.ogImage),
  imageAlt: `${BRAND.legalName} · ${BRAND.slogan}`,
  ogType: "website" as const,
});

function homeMeta(): PageMeta {
  const title = "Gestión documental en Bogotá | Transarchivos Ltda.";
  const description = "Clasificación, digitalización, custodia y destrucción certificada de documentos para empresas, bajo la Ley 594 de 2000. Más de 40 años de experiencia en Bogotá.";
  return {
    ...base("/"), title, description, priority: 1,
    jsonLd: [graph(
      webPage("/", title, description),
      {
        "@type": "ItemList", name: "Servicios de gestión documental",
        itemListElement: services.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.title, url: abs(`/servicios/${s.slug}`) })),
      },
      { "@type": "FAQPage", mainEntity: FAQS.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    )],
  };
}

function nosotrosMeta(): PageMeta {
  const title = "Quiénes somos: pioneros desde 1983 | Transarchivos";
  const description = "Nacimos en 1983 para atender a Ecopetrol y fuimos pioneros en crear en Bogotá uno de los primeros centros de custodia documental. Conozca nuestra historia.";
  return {
    ...base("/nosotros"), title, description, priority: 0.7,
    jsonLd: [graph(webPage("/nosotros", title, description, "AboutPage"), breadcrumb([["Inicio", "/"], ["Nosotros", "/nosotros"]]))],
  };
}

function serviceMeta(slug: string): PageMeta | null {
  const s = services.find(x => x.slug === slug);
  const d = SERVICE_DETAILS[slug];
  if (!s || !d) return null;
  const path = `/servicios/${slug}`;
  const title = `${s.title} en Bogotá | Transarchivos`;
  const description = clip(`${s.title}: ${d.intro}`);
  return {
    ...base(path), title, description, priority: 0.9,
    jsonLd: [graph(
      webPage(path, title, description),
      {
        "@type": "Service", "@id": abs(path) + "#servicio", name: s.title, serviceType: s.title, description: d.intro,
        provider: { "@id": ORG_ID }, areaServed: [{ "@type": "City", name: "Bogotá" }, { "@type": "Country", name: "Colombia" }], url: abs(path),
      },
      breadcrumb([["Inicio", "/"], ["Servicios", "/#servicios"], [s.title, path]]),
    )],
  };
}

function articleMeta(post: Post): PageMeta {
  const path = `/blog/${post.slug}`;
  const date = isoDate(post.date);
  const title = clip(`${post.title} | Transarchivos`, 70);
  const description = clip(post.excerpt);
  const image = abs(post.cover);
  return {
    ...base(path), title, description, ogType: "article", image, imageAlt: post.title, lastmod: date, priority: 0.6,
    jsonLd: [graph(
      webPage(path, post.title, description),
      {
        "@type": "BlogPosting", "@id": abs(path) + "#articulo", headline: clip(post.title, 110), description, image: [image],
        datePublished: date, dateModified: date, inLanguage: "es-CO", articleSection: post.cat,
        author: { "@id": ORG_ID }, publisher: { "@id": ORG_ID }, mainEntityOfPage: { "@id": abs(path) + "#pagina" },
      },
      breadcrumb([["Inicio", "/"], ["Blog", "/#blog"], [post.title, path]]),
    )],
  };
}

function privacyMeta(): PageMeta {
  const title = "Política de privacidad y datos personales | Transarchivos";
  const description = "Cómo el sitio web de Transarchivos Ltda. recoge y trata sus datos personales, el uso de cookies y cómo ejercer sus derechos según la Ley 1581 de 2012.";
  return {
    ...base("/privacidad"), title, description, priority: 0.3,
    jsonLd: [graph(webPage("/privacidad", title, description), breadcrumb([["Inicio", "/"], ["Privacidad", "/privacidad"]]))],
  };
}

function notFoundMeta(path: string): PageMeta {
  return {
    ...base(path), canonical: SITE_URL + "/", robots: "noindex, follow", notFound: true,
    title: "Página no encontrada | Transarchivos",
    description: "La página que busca no existe o cambió de dirección. Vuelva al inicio para conocer nuestros servicios de gestión documental.",
    jsonLd: [],
  };
}

/** Metadatos de cualquier ruta (las desconocidas devuelven la página 404). */
export function getPageMeta(pathname: string): PageMeta {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (path === "/") return homeMeta();
  if (path === "/nosotros") return nosotrosMeta();
  if (path === "/privacidad") return privacyMeta();
  const svc = path.match(/^\/servicios\/([a-z0-9-]+)$/);
  if (svc) return serviceMeta(svc[1]) ?? notFoundMeta(path);
  const art = path.match(/^\/blog\/([a-z0-9-]+)$/);
  if (art) { const post = blogPosts.find(p => p.slug === art[1]); return post ? articleMeta(post) : notFoundMeta(path); }
  return notFoundMeta(path);
}

/** Todas las rutas públicas (pre-generación y sitemap). */
export const PUBLIC_ROUTES = ["/", "/nosotros", "/privacidad", ...services.map(s => `/servicios/${s.slug}`), ...blogPosts.map(p => `/blog/${p.slug}`)];

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
    `<meta data-seo property="og:site_name" content="${BRAND.name}" />`,
    `<meta data-seo property="og:locale" content="${BRAND.locale}" />`,
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
