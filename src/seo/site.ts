// Datos de la empresa para SEO (metadatos y datos estructurados).
// Fuente: "Informe Documento maestro" y "Misión y visión" (RecursosTransarchivos/).
// No agregar datos que no estén en esos documentos (p. ej. horario de atención).

/** Dominio canónico (sin barra final). */
export const SITE_URL = "https://www.transarchivos.com";

/**
 * Indexación: mientras sea false, todas las páginas llevan noindex y robots.txt
 * bloquea a los buscadores. Se activa en Vercel con VITE_SITE_INDEXABLE=true
 * el día en que www.transarchivos.com apunte a este sitio (ver docs/06-seo.md).
 */
export const INDEXABLE = import.meta.env.VITE_SITE_INDEXABLE === "true";

/** Código de verificación de Google Search Console (opcional; método "etiqueta HTML"). */
export const GOOGLE_VERIFICATION = (import.meta.env.VITE_GOOGLE_SITE_VERIFICATION ?? "").trim();

/** Datos legales para la política de privacidad. NIT: confirmar con Transarchivos (no figura en los documentos fuente). */
export const LEGAL = { nit: "", privacyEmail: "info@transarchivos.com", updated: "7 de octubre de 2026" };

export const BRAND = {
  name: "Transarchivos",
  legalName: "Transarchivos Ltda.",
  slogan: "Gestión documental en Bogotá desde 1983",
  description:
    "Empresa colombiana de gestión documental: levantamiento de inventario, programa de gestión documental, digitalización, custodia de archivos y medios magnéticos, microfilmación y destrucción certificada de documentos.",
  foundingDate: "1983",
  email: "info@transarchivos.com",
  phones: ["+57 601 316 4530", "+57 324 358 6973"],
  address: { streetAddress: "Cl. 21 # 39A-40", addressLocality: "Bogotá", addressRegion: "Bogotá D.C.", addressCountry: "CO" },
  sameAs: [
    "https://www.facebook.com/profile.php?id=61569443213087",
    "https://www.instagram.com/transarchivos",
    "https://www.linkedin.com/company/transarchivos-ltda01",
    "https://www.tiktok.com/@transarchivos",
    "https://www.youtube.com/@Transarchivosltda",
  ],
  logo: "/brand/logo.png",
  ogImage: "/brand/og-image.jpg",
  locale: "es_CO",
};

export const abs = (path: string) => (/^https?:\/\//.test(path) ? path : SITE_URL + (path.startsWith("/") ? path : "/" + path));
