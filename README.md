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
pnpm check:all   # lo anterior + código sin uso (knip) + auditoría de seguridad + extremo a extremo
```

Pruebas de calidad, accesibilidad y seguridad: ver `TESTING.md`.

## Despliegue

**GoDaddy** (hosting Node.js conectado a GitHub): compila con `pnpm build` y
arranca `pnpm start` (`server/server.mjs`), que entrega las páginas de `dist/`,
aplica las cabeceras de `hosting/headers.json` y ejecuta las funciones de `api/`:
formularios (Brevo) y cotizador (Zoho Desk). Pasos, variables y cambio de DNS en
`docs/09-hosting-nodejs.md`. `vercel.json` se conserva hasta el cambio de DNS.

`pnpm build` pre-genera el HTML de cada ruta, el sitemap y el robots.txt (SEO).
La indexación se activa con `VITE_SITE_INDEXABLE=true` (ver `docs/06-seo.md`).

## Pendientes de desarrollo

- **Formularios → correo (Brevo)**: el formulario de contacto y el cotizador ya
  envían a `/api/contact`. Falta que el área encargada configure Brevo y las
  variables de entorno en GoDaddy (ver `docs/07-formularios.md`).
- **Suscripción del blog** (`BlogSection`): solo muestra el mensaje de éxito.
  Falta conectarla a la herramienta de correo que elija la empresa.
- **Google Analytics** (ID `G-PNPFD16QSZ`, ya integrado y verificado con
  `pnpm test:ga`): crear la variable `VITE_GA_MEASUREMENT_ID=G-PNPFD16QSZ` en
  GoDaddy → My Apps → Transarchivos → Settings y volver a desplegar.
- **Contraste de color (accesibilidad AA)**: los rótulos dorados y algunos
  textos grises no alcanzan el contraste mínimo (tabla en `TESTING.md`).
  Requiere aprobación de diseño.
- **Rendimiento**:
  - el bundle JS pesa ~530 KB (dividir por rutas con `React.lazy`);
  - imágenes pesadas: `joel.png` 1,1 MB, `logo.png` 378 KB y las poses de Joel
    de ~300 KB (convertir a WebP/AVIF).
- **Publicación oficial**: seguir el checklist de `docs/06-seo.md` (dominio,
  `VITE_SITE_INDEXABLE=true` en GoDaddy, Search Console, Google Business Profile
  y redirecciones del sitio anterior).

## Documentación técnica

Ver `docs/` (arquitectura, diseño UX/UI, conversión y analítica, calidad y
seguridad, decisiones y pendientes).

## Estructura

Ver `AGENTS.md` (arquitectura, reglas de contenido, diseño y funcionamiento del
asesor virtual Joel).
