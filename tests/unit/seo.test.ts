import { describe, expect, it } from "vitest";
import { PUBLIC_ROUTES, clip, getPageMeta, isoDate, renderHeadTags } from "@/seo/meta";
import { SITE_URL } from "@/seo/site";
import { FAQS } from "@/data/faqs";

// Metadatos SEO de cada ruta (los mismos que usa la pre-generación y SeoHead).
const metas = PUBLIC_ROUTES.map(r => getPageMeta(r));

describe("SEO · metadatos por página", () => {
  it("cubre inicio, nosotros, 9 servicios y los artículos", () => {
    expect(PUBLIC_ROUTES).toContain("/");
    expect(PUBLIC_ROUTES.filter(r => r.startsWith("/servicios/"))).toHaveLength(9);
  });
  it("títulos únicos y de 30 a 70 caracteres", () => {
    expect(new Set(metas.map(m => m.title)).size).toBe(metas.length);
    for (const m of metas) { expect(m.title.length, m.title).toBeGreaterThanOrEqual(30); expect(m.title.length, m.title).toBeLessThanOrEqual(70); }
  });
  it("descripciones únicas y de 70 a 160 caracteres", () => {
    expect(new Set(metas.map(m => m.description)).size).toBe(metas.length);
    for (const m of metas) { expect(m.description.length, m.description).toBeGreaterThanOrEqual(70); expect(m.description.length, m.description).toBeLessThanOrEqual(160); }
  });
  it("canónica absoluta en el dominio oficial, sin barra final (salvo inicio)", () => {
    for (const m of metas) {
      expect(m.canonical.startsWith(SITE_URL + "/")).toBe(true);
      if (m.path !== "/") expect(m.canonical.endsWith("/")).toBe(false);
    }
  });
  it("imagen para redes con URL absoluta", () => {
    for (const m of metas) expect(m.image).toMatch(/^https:\/\//);
  });
  it("mientras no se active la indexación, todo lleva noindex", () => {
    for (const m of metas) expect(m.robots).toMatch(/noindex/);
  });
  it("rutas desconocidas → 404 con noindex", () => {
    for (const p of ["/no-existe", "/servicios/no-existe", "/blog/no-existe"]) {
      const m = getPageMeta(p);
      expect(m.notFound).toBe(true);
      expect(m.robots).toMatch(/noindex/);
    }
  });
});

describe("SEO · datos estructurados (JSON-LD)", () => {
  const types = (path: string) => getPageMeta(path).jsonLd.flatMap(g => (g["@graph"] as { "@type": string }[]).map(n => n["@type"]));
  it("toda página pública incluye la empresa (LocalBusiness) y el sitio", () => {
    for (const r of PUBLIC_ROUTES) expect(types(r)).toEqual(expect.arrayContaining(["ProfessionalService", "WebSite"]));
  });
  it("inicio incluye FAQPage con todas las preguntas", () => {
    const faq = getPageMeta("/").jsonLd[0]["@graph"] as { "@type": string; mainEntity?: unknown[] }[];
    expect(faq.find(n => n["@type"] === "FAQPage")?.mainEntity).toHaveLength(FAQS.length);
  });
  it("servicios llevan Service + migas; artículos BlogPosting con fecha ISO + migas", () => {
    expect(types("/servicios/custodia-de-archivos")).toEqual(expect.arrayContaining(["Service", "BreadcrumbList"]));
    const art = PUBLIC_ROUTES.find(r => r.startsWith("/blog/"))!;
    expect(types(art)).toEqual(expect.arrayContaining(["BlogPosting", "BreadcrumbList"]));
  });
  it("la empresa tiene dirección en Bogotá, teléfono y redes; sin horario inventado", () => {
    const org = (getPageMeta("/").jsonLd[0]["@graph"] as Record<string, unknown>[])[0];
    expect(org.address).toMatchObject({ addressLocality: "Bogotá", addressCountry: "CO" });
    expect(org.telephone).toBeTruthy();
    expect((org.sameAs as string[]).length).toBeGreaterThanOrEqual(4);
    expect(org.openingHours).toBeUndefined();
  });
});

describe("SEO · utilidades", () => {
  it("clip corta en palabra completa", () => {
    expect(clip("uno dos tres cuatro", 12)).toBe("uno dos…");
  });
  it("isoDate convierte fechas en español", () => {
    expect(isoDate("3 de agosto de 2026")).toBe("2026-08-03");
  });
  it("el HTML del head escapa comillas y el JSON-LD no puede cerrar la etiqueta", () => {
    const html = renderHeadTags({ ...getPageMeta("/"), title: 'A "B" <script>', jsonLd: [{ x: "</script><script>alert(1)</script>" }] });
    expect(html).toContain("A &quot;B&quot; &lt;script&gt;");
    expect(html).not.toContain("</script><script>alert");
  });
});
