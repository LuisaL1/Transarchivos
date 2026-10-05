// Pre-generación de HTML por ruta (SEO). Se ejecuta en `pnpm build` después
// del build del cliente y del build de servidor (dist-ssr/).
//  · Escribe dist/<ruta>.html con el contenido ya renderizado y las etiquetas
//    SEO propias de cada página (título, descripción, canónica, OG, JSON-LD).
//  · Escribe dist/404.html (Vercel lo sirve con estado 404), sitemap.xml y robots.txt.
// Vercel sirve /servicios/x desde dist/servicios/x.html gracias a "cleanUrls".
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";

const DIST = "dist";
const ssr = await import(pathToFileURL(join(process.cwd(), "dist-ssr", "entry-server.js")).href);
const { render, getPageMeta, renderHeadTags, PUBLIC_ROUTES, INDEXABLE, SITE_URL } = ssr;

const template = readFileSync(join(DIST, "index.html"), "utf8");
if (!template.includes("<!--seo:start-->") || !template.includes('<div id="root"><!--app-html--></div>')) throw new Error("index.html sin marcadores SEO");

function page(url) {
  const meta = getPageMeta(url);
  const html = template
    .replace(/<!--seo:start-->[\s\S]*?<!--seo:end-->/, renderHeadTags(meta))
    .replace('<div id="root"><!--app-html--></div>', `<div id="root" data-path="${url}">${render(url)}</div>`);
  return { meta, html };
}
const write = (file, content) => { const f = join(DIST, file); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, content); };

for (const route of PUBLIC_ROUTES) {
  const { html } = page(route);
  write(route === "/" ? "index.html" : `${route.slice(1)}.html`, html);
}
write("404.html", page("/404").html);

const today = new Date().toISOString().slice(0, 10);
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PUBLIC_ROUTES.map(r => { const m = getPageMeta(r); return `  <url><loc>${m.canonical}</loc><lastmod>${m.lastmod ?? today}</lastmod><priority>${(m.priority ?? 0.5).toFixed(1)}</priority></url>`; }).join("\n")}
</urlset>
`);
write("robots.txt", INDEXABLE
  ? `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`
  : `# Sitio en etapa de prototipo: no indexar (activar con VITE_SITE_INDEXABLE=true).\nUser-agent: *\nDisallow: /\n`);

rmSync("dist-ssr", { recursive: true, force: true });
console.log(`Pre-generadas ${PUBLIC_ROUTES.length} rutas + 404 · sitemap.xml · robots.txt (${INDEXABLE ? "indexable" : "noindex"})`);
