# 1 · Arquitectura

## Stack

| Capa | Tecnología |
| --- | --- |
| UI | React 19 + TypeScript (estricto) |
| Enrutamiento | react-router-dom 7 (`BrowserRouter`, SPA) |
| Build / dev | Vite 8 (puerto local 8443) |
| Estilos | Tailwind CSS v4 (`@tailwindcss/vite`) + estilos en línea para tokens de marca |
| Íconos | Bootstrap Icons (fuente) |
| Tipografías | Google Fonts: Poppins, Montserrat, Inter (`@import` en `src/styles/index.css`) |
| Analítica | Google Analytics 4 con Consent Mode v2 (opcional por variable de entorno) |
| Pruebas | Vitest + Testing Library, Playwright + axe-core, ESLint |
| Hosting | Vercel (`vercel.json`: reescritura SPA + cabeceras de seguridad) |
| Gestor de paquetes | pnpm 10, Node 22 (`.mise.toml`) |

No hay backend, base de datos ni servicios externos aparte de GA4, Google
Fonts y los embebidos de YouTube (modo `youtube-nocookie`).

## Estructura

```
src/
├── main.tsx            Arranque: BrowserRouter, estilos globales, scroll manual
├── App.tsx             Rutas + AnalyticsTracker + CookieBanner + trackVisit()
├── pages/              Una página por ruta (componen secciones)
├── components/
│   ├── layout/         SiteHeader (navbar), NavMenus (megamenús), SearchOverlay,
│   │                   SupportPopover, Analytics (seguimiento + aviso de cookies)
│   ├── sections/       Secciones reutilizables: ServiceCard, SolucionesSection,
│   │                   QuoteSimulator (cotizador), BlogSection, FaqSection, ServiceFaqs
│   ├── home/           Hero (videos, palabra rotativa, selector), MapReveal
│   └── ui/             Icons, Brand (logo, avatar, silueta), SectionDecor,
│                       JoelBridge/JoelFigure (poses de Joel)
├── data/               CONTENIDO (fuente única): services, serviceDetails,
│                       solutions, faqs, quote, blog, nosotros, search, joelPoses
├── lib/
│   ├── chatWidget.ts   Chat: widget de Zoho SalesIQ (se carga al entrar; openChat lo abre)
│   ├── crmChat.ts      Carga del widget en la página aislada (ver 08)
│   └── analytics.ts    GA4: carga, consentimiento, page_view, eventos
├── hooks/useScrollReveal.ts  Aparición al hacer scroll
├── assets/images/      Imágenes importadas (Vite les pone hash de caché)
└── styles/index.css    Tokens Tailwind, animaciones, foco, puntero
public/                 Servido tal cual: videos del hero y póster, íconos, manifest, robots
tests/                  unit/, security/, e2e/  (ver 04)
```

### Convenciones
- Alias `@/` → `src/`.
- Exportaciones con nombre (`export function X`), un componente o grupo pequeño
  por archivo.
- **El texto no se escribe en los componentes:** se agrega en `src/data/`. Así el
  sitio, el buscador y Joel se actualizan juntos.
- Colores: tokens de marca en estilos en línea (`#272B7C`…). La lista blanca de
  colores permitidos está en `tests/unit/content.test.ts`.
- Comentarios en español, explicando el *por qué* de las decisiones de UI.

## Rutas

| Ruta | Página | Contenido |
| --- | --- | --- |
| `/` | `HomePage` | Landing completa (ver 02) |
| `/nosotros` | `NosotrosPage` | Anclas: `#quienes-somos`, `#historia`, `#mision-vision`, `#equipo`, `#cultura`, `#clientes`, `#aliados`, `#certificados` |
| `/videos` | `VideosPage` | "Da play al conocimiento": los 28 videos horizontales del canal de YouTube (`src/data/videos.ts`); miniatura de YouTube y reproductor youtube-nocookie solo al pulsar play |
| `/servicios/:slug` | `ServiceDetailPage` | 9 servicios (slugs en `src/data/services.ts`); al final, las preguntas frecuentes del servicio (`src/data/serviceFaqs.ts`, sección `#preguntas`, componente `ServiceFaqs`) |
| `/blog/:slug` | `ArticlePage` | Artículos de `src/data/blog.ts` |

Las rutas inexistentes de servicio o artículo muestran un aviso con enlace de
regreso. No hay una página 404 general: `vercel.json` reescribe todo a
`index.html`.

**Parámetros de URL del cotizador:** `/?servicio=<slug|diagnostico>&solucion=<id>#cotizador`
abre el cotizador con el servicio ya elegido, en el paso "Detalles". Los usan
el selector del hero, las tarjetas de solución, las páginas de servicio y Joel.

## Flujo de datos

```
RecursosTransarchivos/ (documentos del cliente)
        │  (redacción manual)
        ▼
src/data/*.ts ──► páginas y secciones (render)
        └──────► data/search.ts  (índice del buscador)

Estado del visitante (solo en su navegador, localStorage/sessionStorage):
  ta-joel-profile        perfil del visitante (visitas, intereses, búsquedas)
  ta-joel-visit          marca de visita por sesión
  ta-analytics-consent   decisión del aviso de cookies
```

No hay estado global (ni Context ni store). Cada página maneja su propio estado; el chat
(widget de Zoho) se abre con `openChat` (`src/lib/chatWidget.ts`).

## Componentes clave

| Componente | Responsabilidad | Notas para mantenimiento |
| --- | --- | --- |
| `SiteHeader` | Navbar: flotante (píldora) arriba y barra blanca completa al hacer scroll; megamenús; buscador; soporte; menú de celular | Prop `solid` para páginas internas. Los menús abren al pasar el mouse **y** con clic. El radio de la píldora no se anima a propósito (ver comentarios). |
| `NavMenus` | Contenido de los megamenús + `MenuFeature` (tarjeta azul con detalle de esquina) | Solo azul marino `#272B7C` |
| `Hero` | `HeroPhotos` (secuencia de 15 fotos de la operación en `public/hero-fotos/`, WebP 1920 px, fundido de 2,5 s cada 12 s, sin acercamiento (el título ya se anima); la primera precargada en `index.html`; con «reducir movimiento» queda fija), palabra rotativa y selector `HeroQuickStart`. Las páginas internas usan `page-hero.jpg` como fondo de su encabezado (`PageHero`) | Panel de detalle de alto fijo para que el título no salte al cambiar de pestaña |
| `MapReveal` | Sección fija de 260vh: mapa de Colombia → pin de Bogotá → revelado circular del video del centro documental (`transarchivos-centro-documental.mp4` / `-movil.mp4`, 7,8 s en bucle al 70 %) (clip-path) | Capa oculta con `inert` para que no reciba foco |
| `QuoteSimulator` | Cotizador guiado de 4 pasos (ver 03) | Preguntas por servicio en `data/quote.ts` |
| `JoelBridge` / `JoelFigure` | Poses de Joel entre secciones y dentro de páginas | Ocultas en celular |
| `JoelShowcase` | "Joel en acción" en cada servicio: tarjeta azul con pestaña de carpeta y Joel sobresaliendo por arriba | Pose y alto por servicio en `SERVICE_JOEL` (`data/joelPoses.ts`); visible también en celular |
| `SectionDecor` | Fondo de sección: color plano, puntos y carpeta en contorno | Variantes `cream` / `lavender` |
| `useScrollReveal` | Fundido de entrada escalonado al hacer scroll | Respeta `prefers-reduced-motion` |

## Chat · widget de Zoho SalesIQ

En esta variante (rama `chat-salesiq-widget`) el chat es el widget de Zoho
SalesIQ, tal cual: botón flotante y ventana. El flujo (saludo, botones,
preguntas frecuentes, cotización, asesor) se configura en Zoho. Ver
`docs/08-chat-asesor.md`.

## Configuración y despliegue

- **Variables:** `VITE_GA_MEASUREMENT_ID` (opcional). Ver `.env.example`.
- **Vercel:**
  - framework Vite, salida `dist/`;
  - `vercel.json` define la reescritura SPA, las cabeceras de seguridad (CSP y otras) y la caché inmutable de `/assets/*`.
- **Antes de publicar:** quitar `noindex` de `index.html` y borrar `public/robots.txt`.
- **Íconos:** `favicon-16/32.png`, `favicon.png` (48), `apple-touch-icon.png`
  (180), `icon-192/512.png`, `site.webmanifest`.
