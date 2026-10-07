# Transarchivos · Sitio web

Sitio corporativo de Transarchivos Ltda. (gestión documental, Bogotá) hecho con
React 19 + Vite 8 + Tailwind CSS v4 + TypeScript. Se publica en Vercel.

## Comandos

- `pnpm dev` — servidor local en http://localhost:8443
- `pnpm build` — build de producción en `dist/`
- `pnpm typecheck` — verificación de tipos
- `pnpm lint` — ESLint (calidad, accesibilidad, seguridad)
- `pnpm test` / `pnpm test:e2e` — pruebas (ver `TESTING.md`)
- `pnpm check` — todo lo anterior + build; debe quedar en verde antes de cada commit

## Arquitectura (`src/`)

```
src/
├── main.tsx              Punto de entrada (router + estilos globales)
├── App.tsx               Rutas de la aplicación
├── pages/                Una página por ruta
│   ├── HomePage.tsx          "/"  (estado del chat, hero, secciones)
│   ├── ServiceDetailPage.tsx "/servicios/:slug"
│   ├── NosotrosPage.tsx      "/nosotros"
│   └── ArticlePage.tsx       "/blog/:slug"
├── components/
│   ├── layout/           Navbar compartido (SiteHeader), menús desplegables,
│   │                     búsqueda (SearchOverlay) y tarjeta de soporte
│   ├── sections/         Secciones reutilizables: tarjeta de servicio,
│   │                     soluciones, cotizador, blog, preguntas frecuentes
│   ├── home/             Piezas propias del hero (videos, barra de Joel)
│   ├── chat/             Chat de Joel (interfaz y guion)
│   └── ui/               Primitivas: íconos, marca (logo/Joel), fondos de sección
├── data/                 CONTENIDO del sitio (fuente única de verdad)
│   ├── services.ts           Los 9 servicios
│   ├── serviceDetails.ts     Contenido de la página de cada servicio
│   ├── solutions.ts          Soluciones por necesidad del cliente
│   ├── faqs.ts               Preguntas frecuentes
│   ├── quote.ts              Preguntas y unidades del cotizador
│   ├── blog.ts               Artículos del blog
│   ├── nosotros.ts           Menú de Nosotros
│   ├── stats.ts              Indicadores de la portada (años, contratos, folios)
│   ├── contact.ts            Número y enlace de WhatsApp (whatsappUrl)
│   ├── clients.ts            Clientes históricos (carrusel de logos; imágenes en assets/images/clientes)
│   └── search.ts             Índice del buscador
├── lib/joel.ts           "Cerebro" del asesor virtual (sin IA externa)
├── seo/                  Datos de la empresa (site.ts) y metadatos por ruta (meta.ts)
├── entry-server.tsx      Render en servidor para la pre-generación de HTML
├── data/joelPoses.ts     Poses de Joel por servicio (imágenes en assets/images/joel)
├── hooks/                Hooks reutilizables (aparición al hacer scroll)
├── assets/images/        Imágenes importadas desde el código
└── styles/index.css      Estilos globales, animaciones, puntero/foco
public/                   Archivos servidos tal cual (videos del hero, favicon, robots)
api/contact.ts            Función de Vercel: formularios → correo por Brevo (docs/07-formularios.md)
scripts/prerender.mjs     Pre-genera dist/<ruta>.html, 404, sitemap y robots (SEO)
tests/                    unit/, security/, seo/ (HTML generado), e2e/ (Playwright + axe)
docs/                     Documentación técnica (arquitectura, UX/UI, conversión, pruebas, decisiones)
RecursosTransarchivos/    Documentos fuente del cliente (contexto, no se publican)
```

### Reglas

- El texto del sitio vive en `src/data/`. Para cambiar un servicio, una pregunta
  frecuente o una solución, edite el archivo de datos: el sitio, el buscador y
  Joel se actualizan solos.
- Todo el contenido debe salir de los documentos de `RecursosTransarchivos/`.
  No inventar cifras, precios, horarios ni certificaciones (la empresa NO tiene
  ISO 9001). Operan principalmente en Bogotá.
- Importar con el alias `@/` (apunta a `src/`).
- Componentes: un archivo por componente o por grupo pequeño relacionado;
  exportaciones con nombre (`export function X`).
- SEO: cada ruta se pre-genera en el servidor. No usar `window`/`document`/
  `localStorage` durante el render (solo en efectos). Rutas nuevas → `src/seo/meta.ts`
  (ver `docs/06-seo.md`).

## Diseño

- Paleta: azul marino `#272B7C`, índigo `#1800AD`, amarillo `#FFDE59`,
  dorado `#C8960A`, crema `#FBFBF8`, lavanda `#F1F3FB`. El menú de navegación
  usa solo el azul marino. La lista blanca de colores está en
  `tests/unit/content.test.ts`.
- Tipografías: Poppins (títulos), Montserrat (rótulos/botones), Inter (texto).
- Íconos: Bootstrap Icons (`<Bi n="..." />`, `<BiTile />`, `<MenuIcon />`).
- Estilo corporativo: sin caricaturas (solo Joel), sin degradados (en su lugar,
  el detalle de esquina del chat y el menú: cuadrado amarillo translúcido girado
  45°), tarjetas blancas con borde fino, motivo gráfico de carpeta. Única
  excepción: la sombra negra superior del hero de inicio.
- Hero de inicio: pantalla dividida (panel azul con el título animado
  "Sus archivos, bajo [palabra]" y videos a la derecha), pestaña de carpeta en
  la división y Joel junto al selector "¿Qué necesitas hoy?".

## Joel (asesor virtual)

`src/lib/joel.ts` entiende texto libre (palabras clave, sinónimos, errores de
tipeo), responde preguntas específicas, maneja objeciones, se defiende de
manipulación y temas ajenos, personaliza el saludo según el comportamiento del
visitante y aprende palabras nuevas. Todo se guarda en el `localStorage` del
visitante (no hay servidor). Recibe el conocimiento desde `src/data/` al crearse
(ver `getJoel()` en `components/chat/ChatBot.tsx`).
