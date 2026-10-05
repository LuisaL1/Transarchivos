# Transarchivos · Sitio web

Sitio corporativo de Transarchivos Ltda. — React + Vite + Tailwind CSS + TypeScript.

## Requisitos

- Node.js 22
- pnpm 10 (`corepack enable` o `npm i -g pnpm`)

## Uso

```bash
pnpm install     # instalar dependencias
pnpm dev         # desarrollo en http://localhost:8443
pnpm build       # build de producción en dist/
pnpm preview     # ver el build localmente
pnpm check       # tipos + lint + pruebas + build (antes de cada commit)
pnpm check:all   # lo anterior + auditoría de seguridad + pruebas de extremo a extremo
```

Pruebas de calidad, accesibilidad y seguridad: ver `TESTING.md`.

## Despliegue

Vercel (framework: Vite, salida: `dist`). `vercel.json` redirige todas las
rutas a `index.html` para que funcionen las páginas internas al recargar.

`pnpm build` pre-genera el HTML de cada ruta, el sitemap y el robots.txt (SEO).
La indexación se activa con `VITE_SITE_INDEXABLE=true` (ver `docs/06-seo.md`).

## Pendientes de desarrollo

- **Cotizador y chat**: hoy arman un correo (`mailto:`) a info@transarchivos.com.
  Falta un backend o servicio de formularios que reciba la solicitud, la guarde
  y notifique a Comercial. Si se usa un servicio externo, agregarlo a la CSP de
  `vercel.json`.
- **Suscripción del blog** (`BlogSection`): solo muestra el mensaje de éxito.
  Falta conectarla a la herramienta de correo que elija la empresa.
- **Google Analytics** (ID `G-PNPFD16QSZ`, ya integrado y verificado con
  `pnpm test:ga`): crear la variable `VITE_GA_MEASUREMENT_ID=G-PNPFD16QSZ` en
  Vercel → Settings → Environment Variables (entorno Production) y volver a
  desplegar.
- **Contraste de color (accesibilidad AA)**: los rótulos dorados y algunos
  textos grises no alcanzan el contraste mínimo (tabla en `TESTING.md`).
  Requiere aprobación de diseño.
- **Rendimiento**:
  - el bundle JS pesa ~530 KB (dividir por rutas con `React.lazy`);
  - imágenes pesadas: `joel.png` 1,1 MB, `logo.png` 378 KB y las poses de Joel
    de ~300 KB (convertir a WebP/AVIF).
- **Publicación oficial**: seguir el checklist de `docs/06-seo.md` (dominio,
  `VITE_SITE_INDEXABLE=true` en Vercel, Search Console, Google Business Profile
  y redirecciones del sitio anterior).

## Documentación técnica

Ver `docs/` (arquitectura, diseño UX/UI, conversión y analítica, calidad y
seguridad, decisiones y pendientes).

## Estructura

Ver `AGENTS.md` (arquitectura, reglas de contenido, diseño y funcionamiento del
asesor virtual Joel).
