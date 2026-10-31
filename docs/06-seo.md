# 6 · SEO técnico

## Resumen
El sitio es una SPA de React, pero **cada ruta se entrega como HTML
pre-generado** con su contenido completo y sus etiquetas SEO. Google, Bing,
LinkedIn, WhatsApp y Facebook leen la página sin ejecutar JavaScript. Después,
React "hidrata" ese HTML y el sitio funciona igual que siempre.

| Elemento | Estado |
| --- | --- |
| HTML pre-generado por ruta (18 rutas en español + 18 en inglés + 404) | ✅ `scripts/prerender.mjs` |
| Título y meta descripción únicos por página | ✅ `src/seo/meta.ts` |
| URL canónica absoluta (`https://www.transarchivos.com/...`) | ✅ |
| Dos idiomas: `/…` (español) y `/en/…` (inglés, rutas traducidas), `hreflang` es/en/x-default en cada página y en el sitemap, `og:locale`, `<html lang>` por idioma | ✅ `src/i18n/`, `src/seo/meta.ts` |
| Open Graph + Twitter Cards (imagen 1200×630) | ✅ `public/brand/og-image.jpg`; los artículos usan su portada |
| Datos estructurados JSON-LD | ✅ ProfessionalService (LocalBusiness), WebSite, FAQPage, ItemList, Service, BlogPosting, AboutPage, BreadcrumbList |
| `sitemap.xml` y `robots.txt` generados | ✅ desde `src/data/` en cada build |
| 404 real (estado HTTP 404 + `noindex`) | ✅ `dist/404.html` + `NotFoundPage` |
| URLs limpias sin `.html` ni barra final | ✅ `cleanUrls` + `trailingSlash: false` en `vercel.json` |
| Un solo `<h1>` por página, `lang="es-CO"` o `lang="en-US"` según la ruta | ✅ verificado por pruebas |
| Rendimiento | ✅ tipografías con `preconnect` (antes `@import` encadenado), logo de 378 KB → 72 KB, imágenes bajo el pliegue con `loading="lazy"` |
| Verificación de Search Console | ✅ opcional por variable (`VITE_GOOGLE_SITE_VERIFICATION`) |
| Indexación | ⏸️ **Desactivada** hasta la publicación (un solo interruptor, ver abajo) |

## Cómo funciona

```
pnpm build
 1. vite build                       → dist/ (cliente)
 2. vite build --ssr entry-server    → dist-ssr/ (temporal)
 3. node scripts/prerender.mjs
      para cada ruta de PUBLIC_ROUTES:
        prerender(<App/> en esa URL)       → contenido (espera las páginas React.lazy)
        getPageMeta(url) → renderHeadTags  → <head>
        escribe dist/<ruta>.html  (con data-path="<ruta>")
      escribe dist/404.html, sitemap.xml, robots.txt
```

- **Metadatos:** `src/seo/meta.ts` → `getPageMeta(pathname)` es la única fuente.
  La usan la pre-generación (servidor) y `SeoHead` (navegador, al cambiar de
  ruta), así que nunca se contradicen.
- **Datos de la empresa:** `src/seo/site.ts` (dominio, razón social, dirección,
  teléfonos, correo, redes). Todo sale de los documentos de
  `RecursosTransarchivos/`. **No hay horario**, porque no figura en ellos: si la
  empresa lo confirma, agréguelo como `openingHoursSpecification`.
- **Hidratación:** `main.tsx` usa `hydrateRoot` solo si el HTML recibido
  corresponde a la ruta actual (`data-path`). En otro caso, como la 404 en una
  URL desconocida o en desarrollo, renderiza desde cero.
- **Estado del navegador sin desajustes:** lo que depende del navegador
  (reducir movimiento, scroll, aviso de cookies) arranca igual que en el
  servidor y se corrige al montar (`useReducedMotion`, efectos).

### Reglas para no romper el SEO
- **Página nueva:**
  1. agréguela a `ES_ROUTES` y a `getPageMeta` (con título y descripción en los
     dos idiomas) en `src/seo/meta.ts`;
  2. dele nombre en inglés en `SECTIONS` de `src/i18n/index.ts` (y a sus slugs
     en `SLUGS`, si los tiene);
  3. cree su ruta en `App.tsx` (la lista `PAGES` la genera en los dos idiomas);
  4. agréguela a `tests/e2e/seo.spec.ts` si es clave.
  El sitemap, los `hreflang` y el HTML en los dos idiomas se generan solos.
- **Servicio o artículo nuevo** en `src/data/`: se pre-genera, entra al sitemap
  y recibe sus datos estructurados de forma automática.
- **No acceder a `window`, `document` ni `localStorage` durante el render:** solo
  en efectos o manejadores. Si hace falta un valor del navegador para pintar,
  empiece con el valor del servidor y corríjalo en un `useLayoutEffect`.
- **Mantener un solo `<h1>` por página.** Lo verifica `pnpm test:seo`.
- **Títulos entre 30 y 70 caracteres; descripciones entre 70 y 160.** Lo
  verifica `tests/unit/seo.test.ts`.

## Día de la publicación (checklist)
1. Apuntar el dominio **www.transarchivos.com** a Vercel (Settings → Domains),
   con redirección de `transarchivos.com` → `www.transarchivos.com`.
2. En Vercel → Settings → Environment Variables (Production):
   `VITE_SITE_INDEXABLE=true`. Volver a desplegar.
   - Quita el `noindex` de todas las páginas, excepto la 404.
   - `robots.txt` pasa a `Allow: /` y publica la ruta del sitemap.
3. **Google Search Console:** agregar la propiedad de dominio y verificarla por
   DNS (recomendado), o por etiqueta con `VITE_GOOGLE_SITE_VERIFICATION`.
   Enviar `https://www.transarchivos.com/sitemap.xml`.
4. **Bing Webmaster Tools:** importar desde Search Console.
5. **Google Business Profile:** crear o reclamar la ficha con **exactamente** los
   mismos datos de `src/seo/site.ts` (nombre, dirección, teléfono, web). La
   coherencia de estos datos es clave para el SEO local.
6. **Redirecciones 301 desde el sitio anterior:** si las URLs viejas de
   transarchivos.com son distintas, agregarlas a `redirects` en `vercel.json`
   para no perder el posicionamiento ganado. Pida la lista de URLs indexadas
   (Search Console → Páginas) antes del cambio.
7. Validar:
   - [Prueba de resultados enriquecidos](https://search.google.com/test/rich-results);
   - vista previa de enlaces (LinkedIn Post Inspector, Facebook Sharing Debugger);
   - PageSpeed Insights en celular.

## Recomendaciones de contenido (siguiente fase)
- **Palabras clave objetivo**, ya presentes en títulos y textos: "gestión
  documental Bogotá", "custodia de archivos", "digitalización de documentos",
  "destrucción de documentos certificada", "programa de gestión documental",
  "microfilmación", "Ley 594 de 2000".
- **El H1 de inicio** (tres frases que se alternan; la primera, "Protegemos la memoria de su empresa", es la que se lee) es de marca. La palabra
  clave principal está en el título, la meta descripción y el subtítulo.
  Considerar un H2 visible con "gestión documental en Bogotá" en la siguiente
  revisión de contenido.
- **Blog:** publicar con regularidad artículos que respondan preguntas reales
  (por ejemplo, "¿cuánto tiempo debo guardar las facturas?"), enlazados a la
  página del servicio relacionado.
- **Enlaces internos:** cada artículo debería enlazar al menos a un servicio.

## Pendientes de rendimiento (Core Web Vitals)
- **JS (hecho):** 203 KB de código propio en el paquete principal (solo el inicio; antes 423 KB) + 229 KB de librerías aparte (`vendor`, en caché entre versiones) + un trozo por página interna (2–48 KB) y el chat de Joel (71 KB), que se descargan al usarse (`lib/lazyPage.tsx`; la pre-generación los precarga para que el HTML salga completo y sin scripts en línea, que la CSP prohíbe). Los logos de clientes no se incrustan en el JS (`assetsInlineLimit` en `vite.config.ts`).
- **Imágenes:**
  - `joel.webp` (126 KB; antes `joel.png` de 1,1 MB) y las poses ya van en WebP; falta AVIF si se quiere apurar más;
  - agregar `width`/`height` para evitar saltos de diseño.
- **Fotos del hero:** 16 WebP de 1920 px en `public/hero-fotos/` (~150–250 KB cada una); solo se descargan la actual y la siguiente. **Video del mapa:** versiones para celular (1,8 MB) y computador (2,5 MB); cada pantalla descarga solo la suya. Si se necesita aún más liviano, recortar su resolución o usar `preload="metadata"`.
