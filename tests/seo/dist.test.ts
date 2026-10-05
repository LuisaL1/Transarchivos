import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { PUBLIC_ROUTES, getPageMeta } from "@/seo/meta";

// Revisa el HTML pre-generado en dist/ (correr después de `pnpm build`:
// `pnpm test:seo`). Es lo que reciben Google y las redes sociales.
const file = (r: string) => `dist/${r === "/" ? "index" : r.slice(1)}.html`;
const read = (f: string) => readFileSync(f, "utf8");

describe("HTML pre-generado", () => {
  it("existe un archivo por ruta pública y la 404", () => {
    for (const r of PUBLIC_ROUTES) expect(existsSync(file(r)), file(r)).toBe(true);
    expect(existsSync("dist/404.html")).toBe(true);
  });
  for (const r of PUBLIC_ROUTES) {
    it(`${r}: título, descripción, canónica, OG, JSON-LD y contenido`, () => {
      const html = read(file(r));
      const m = getPageMeta(r);
      const head = html.slice(0, html.indexOf("</head>"));
      expect(head.match(/<title/g)).toHaveLength(1);
      expect(head).toContain(`<link data-seo rel="canonical" href="${m.canonical}"`);
      expect(head.match(/name="description"/g)).toHaveLength(1);
      for (const p of ["og:title", "og:description", "og:image", "og:url", "twitter:card"]) expect(head).toContain(`"${p}"`);
      for (const block of head.match(/<script data-seo type="application\/ld\+json">([\s\S]*?)<\/script>/g) ?? []) {
        expect(() => JSON.parse(block.replace(/^<script[^>]*>/, "").replace(/<\/script>$/, ""))).not.toThrow();
      }
      const body = html.slice(html.indexOf("<body"));
      expect(body.match(/<h1[\s>]/g), "un solo h1").toHaveLength(1);
      expect(body).toContain(`data-path="${r}"`);
      expect(body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").length, "contenido renderizado").toBeGreaterThan(1500);
    });
  }
  it("404.html lleva noindex", () => {
    expect(read("dist/404.html")).toMatch(/name="robots" content="noindex/);
  });
  it("sitemap.xml lista todas las rutas con su canónica", () => {
    const xml = read("dist/sitemap.xml");
    for (const r of PUBLIC_ROUTES) expect(xml).toContain(`<loc>${getPageMeta(r).canonical}</loc>`);
  });
  it("robots.txt coherente con la indexación", () => {
    const txt = read("dist/robots.txt");
    if (getPageMeta("/").robots.includes("noindex")) expect(txt).toMatch(/Disallow: \//);
    else expect(txt).toMatch(/Sitemap: https:\/\/.+\/sitemap\.xml/);
  });
});
