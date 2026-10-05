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
pnpm typecheck   # verificar tipos
```

## Despliegue

Vercel (framework: Vite, salida: `dist`). `vercel.json` redirige todas las
rutas a `index.html` para que funcionen las páginas internas al recargar.

Antes de publicar oficialmente: quitar `<meta name="robots" content="noindex">`
de `index.html` y borrar `public/robots.txt`.

## Estructura

Ver `AGENTS.md` (arquitectura, reglas de contenido, diseño y funcionamiento del
asesor virtual Joel).
