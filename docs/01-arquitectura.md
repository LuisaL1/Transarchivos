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
│   │                   QuoteSimulator (cotizador), BlogSection, FaqSection
│   ├── home/           Hero (videos, palabra rotativa, selector), MapReveal
│   ├── chat/           ChatBot (interfaz + guion del chat)
│   └── ui/             Icons, Brand (logo, avatar, silueta), SectionDecor,
│                       JoelBridge/JoelFigure (poses de Joel)
├── data/               CONTENIDO (fuente única): services, serviceDetails,
│                       solutions, faqs, quote, blog, nosotros, search, joelPoses
├── lib/
│   ├── joel.ts         Motor del asesor virtual (sin IA externa)
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
| `/servicios/:slug` | `ServiceDetailPage` | 9 servicios (slugs en `src/data/services.ts`) |
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
        ├──────► data/search.ts  (índice del buscador)
        └──────► lib/joel.ts      (conocimiento de Joel, vía getJoel() en ChatBot)

Estado del visitante (solo en su navegador, localStorage/sessionStorage):
  ta-joel-profile        perfil de Joel (visitas, intereses, búsquedas, palabras aprendidas)
  ta-joel-visit          marca de visita por sesión
  ta-chat-teaser         invitación del chat ya mostrada en la sesión
  ta-analytics-consent   decisión del aviso de cookies
```

No hay estado global (ni Context ni store). Cada página maneja su propio estado
(por ejemplo, `chatOpen` en las páginas que muestran el chat).

## Componentes clave

| Componente | Responsabilidad | Notas para mantenimiento |
| --- | --- | --- |
| `SiteHeader` | Navbar: flotante (píldora) arriba y barra blanca completa al hacer scroll; megamenús; buscador; soporte; menú de celular | Prop `solid` para páginas internas. Los menús abren al pasar el mouse **y** con clic. El radio de la píldora no se anima a propósito (ver comentarios). |
| `NavMenus` | Contenido de los megamenús + `MenuFeature` (tarjeta azul con detalle de esquina) | Solo azul marino `#272B7C` |
| `Hero` | `HeroVideoBackground` (video institucional en bucle, sin audio: `transarchivos-hero-movil.mp4` 720×1080 en celular, `transarchivos-hero.mp4` 1080×1080 en computador y `transarchivos-hero-4k.mp4` 1920×1920 en Retina/4K, ya recortados al espacio, con póster inmediato; montaje cinematográfico (planos largos con movimiento de cámara lento, fundidos de 1 s, bucle sin salto, sin filtros de color) y reproducción al 70 % con `HERO_VIDEO_RATE`), `HeroRotatingWord`, `HeroQuickStart` (selector con pestañas) | Panel de detalle de alto fijo para que el título no salte al cambiar de pestaña |
| `MapReveal` | Sección fija de 260vh: mapa de Colombia → pin de Bogotá → revelado circular de video (clip-path) | Capa oculta con `inert` para que no reciba foco |
| `QuoteSimulator` | Cotizador guiado de 4 pasos (ver 03) | Preguntas por servicio en `data/quote.ts` |
| `ChatBot` | Chat de Joel: guion por pasos + texto libre vía `lib/joel.ts` | `heroJoel`: no muestra la invitación en pantallas medianas o grandes, porque Joel ya está en el hero |
| `JoelBridge` / `JoelFigure` | Poses de Joel entre secciones y dentro de páginas | Ocultas en celular |
| `JoelShowcase` | "Joel en acción" en cada servicio: tarjeta azul con pestaña de carpeta y Joel sobresaliendo por arriba | Pose y alto por servicio en `SERVICE_JOEL` (`data/joelPoses.ts`); visible también en celular |
| `SectionDecor` | Fondo de sección: color plano, puntos y carpeta en contorno | Variantes `cream` / `lavender` |
| `useScrollReveal` | Fundido de entrada escalonado al hacer scroll | Respeta `prefers-reduced-motion` |

## Joel · motor del asesor virtual (`src/lib/joel.ts`)

Funciona sin IA externa ni servidor, en tres partes:

1. **Perfil del visitante.** Cuenta las secciones, servicios, artículos y
   búsquedas del visitante, y lo clasifica en segmentos (comprador, técnico,
   interesado en un servicio, recurrente) para personalizar el saludo.
2. **Motor de intenciones.**
   - Normaliza el texto (sin tildes ni signos) y tolera errores de tipeo.
   - Usa sinónimos y puntúa por palabras clave.
   - Recuerda el último servicio del que se habló y combina intenciones
     (por ejemplo, precio + servicio).
   - Cubre:
     - datos puntuales;
     - preguntas frecuentes;
     - artículos del blog;
     - soluciones;
     - objeciones (caro, lo hacemos internamente, la nube, confianza, competencia);
     - cortesía.
   - Se defiende de manipulación (*prompt injection*), temas ajenos y ofensas.
   - Nunca inventa precios ni certificaciones.
3. **Aprendizaje.** Si no entiende y el visitante elige después una opción, guarda
   la asociación palabra → destino (`LEARN_DEST` en `ChatBot.tsx`).

Recibe el conocimiento al crearse: `createJoel({ services, details, faqs, solutions, posts, quote, quoteUnit })`.
Para enseñarle algo nuevo, agregue el contenido en `src/data/`. Solo para
intenciones nuevas hay que editar `joel.ts` (y agregar su prueba en
`tests/unit/joel.test.ts`).

## Configuración y despliegue

- **Variables:** `VITE_GA_MEASUREMENT_ID` (opcional). Ver `.env.example`.
- **Vercel:**
  - framework Vite, salida `dist/`;
  - `vercel.json` define la reescritura SPA, las cabeceras de seguridad (CSP y otras) y la caché inmutable de `/assets/*`.
- **Antes de publicar:** quitar `noindex` de `index.html` y borrar `public/robots.txt`.
- **Íconos:** `favicon-16/32.png`, `favicon.png` (48), `apple-touch-icon.png`
  (180), `icon-192/512.png`, `site.webmanifest`.
