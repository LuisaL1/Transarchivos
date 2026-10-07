# 6 · SEO técnico

## Resumen
El sitio es una SPA de React, pero **cada ruta se entrega como HTML
pre-generado** con su contenido completo y sus etiquetas SEO. Google, Bing,
LinkedIn, WhatsApp y Facebook leen la página sin ejecutar JavaScript. Después,
React "hidrata" ese HTML y el sitio funciona igual que siempre.

| Elemento | Estado |
| --- | --- |
| HTML pre-generado por ruta (15 rutas + 404) | ✅ `scripts/prerender.mjs` |
| Título y meta descripción únicos por página | ✅ `src/seo/meta.ts` |
| URL canónica absoluta (`https://www.transarchivos.com/...`) | ✅ |
| Open Graph + Twitter Cards (imagen 1200×630) | ✅ `public/brand/og-image.jpg`; los artículos usan su portada |
| Datos estructurados JSON-LD | ✅ ProfessionalService (LocalBusiness), WebSite, FAQPage, ItemList, Service, BlogPosting, AboutPage, BreadcrumbList |
| `sitemap.xml` y `robots.txt` generados | ✅ desde `src/data/` en cada build |
| 404 real (estado HTTP 404 + `noindex`) | ✅ `dist/404.html` + `NotFoundPage` |
| URLs limpias sin `.html` ni barra final | ✅ `cleanUrls` + `trailingSlash: false` en `vercel.json` |
| Un solo `<h1>` por página, `lang="es-CO"` | ✅ verificado por pruebas |
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
        renderToString(<App/> en esa URL)  → contenido
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
  1. agréguela a `PUBLIC_ROUTES` y a `getPageMeta`;
  2. cree su ruta en `App.tsx`;
  3. agréguela a `tests/e2e/seo.spec.ts` si es clave.
  El sitemap y el HTML se generan solos.
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
- **El H1 de inicio** ("Sus archivos, bajo control") es de marca. La palabra
  clave principal está en el título, la meta descripción y el subtítulo.
  Considerar un H2 visible con "gestión documental en Bogotá" en la siguiente
  revisión de contenido.
- **Blog:** publicar con regularidad artículos que respondan preguntas reales
  (por ejemplo, "¿cuánto tiempo debo guardar las facturas?"), enlazados a la
  página del servicio relacionado.
- **Enlaces internos:** cada artículo debería enlazar al menos a un servicio.

## Pendientes de rendimiento (Core Web Vitals)
- **JS:** 352 KB de código propio + 223 KB de librerías en archivo aparte (`vendor`, en caché entre versiones). Los logos de clientes no se incrustan en el JS (`assetsInlineLimit` en `vite.config.ts`). Si crece, dividir por rutas. Con pre-generación e hidratación hay
  que precargar el chunk de la ruta antes de hidratar (por ejemplo, con
  `React.lazy` + `import()` resuelto en `main.tsx`).
- **Imágenes:**
  - `joel.png` (1,1 MB) y las poses (~300 KB): convertir a WebP/AVIF;
  - agregar `width`/`height` para evitar saltos de diseño.
- **Video del hero:** versiones para celular (6,2 MB), computador (9,1 MB) y Retina/4K (18,2 MB); cada pantalla descarga solo la suya. Si se necesita aún más liviano, recortar su duración (43 s) o usar `preload="metadata"`.
