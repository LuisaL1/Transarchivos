# Transarchivos · Sitio web

Sitio corporativo de Transarchivos Ltda. (gestión documental, Bogotá) hecho con
React 19 + Vite 8 + Tailwind CSS v4 + TypeScript. Se publica en Vercel. Está en
español (raíz) e inglés (`/en`, ver "Idiomas").

## Comandos

- `pnpm dev` — servidor local en http://localhost:8443
- `pnpm build` — build de producción en `dist/`
- `pnpm typecheck` — verificación de tipos
- `pnpm lint` — ESLint (calidad, accesibilidad, seguridad)
- `pnpm test` / `pnpm test:e2e` — pruebas (ver `TESTING.md`)
- `pnpm check` — todo lo anterior + build; debe quedar en verde antes de cada commit
- `pnpm check:all` — lo anterior + código sin uso (`lint:unused`, knip) + auditoría de dependencias + extremo a extremo
- `pnpm email:header` — regenera el banner de los correos (`public/brand/email-header.png`)

## Arquitectura (`src/`)

```
src/
├── main.tsx              Punto de entrada (router + estilos globales)
├── App.tsx               Rutas en los dos idiomas: el inicio va en el paquete principal; las demás
│                         páginas y el chat se cargan aparte (React.lazy); el pre-render las espera
├── i18n/                 Idiomas: index.ts (rutas /en, slugs traducidos, useLang), content.ts
│                         (contenido por idioma: useContent), ui.ts / home.ts / pages.ts (textos de
│                         la interfaz en español e inglés)
├── pages/                Una página por ruta (cada una existe en "/…" y en "/en/…")
│   ├── HomePage.tsx          "/" y "/en"  (estado del chat, hero, secciones)
│   ├── ServiceDetailPage.tsx "/servicios/:slug" y "/en/services/:slug"
│   ├── NosotrosPage.tsx      "/nosotros" y "/en/about"
│   ├── ArticlePage.tsx       "/blog/:slug" y "/en/blog/:slug"
│   ├── PoliciesPage.tsx      "/politicas" y "/en/policies" (7 políticas oficiales, solo en español)
│   ├── VideosPage.tsx        "/videos" y "/en/videos" ("Da play al conocimiento": los videos del canal)
│   └── PrivacyPage.tsx       "/privacidad" y "/en/privacy" (aviso del sitio y cookies)
├── components/
│   ├── layout/           Navbar compartido (SiteHeader), franja de idioma (LangBar), menús
│   │                     desplegables, búsqueda (SearchOverlay) y tarjeta de soporte
│   ├── sections/         Secciones reutilizables: tarjeta de servicio, soluciones,
│   │                     cotizador, blog, preguntas frecuentes; y las compartidas por
│   │                     las páginas internas: PageHero (encabezado) y CtaBand (llamado final)
│   ├── home/             Piezas propias del hero (videos, barra de Joel)
│   ├── chat/             Chat de Joel (ChatBot: interfaz); LazyChatBot lo carga aparte
│   └── ui/               Primitivas: íconos, marca (logo/Joel), fondos y pestaña de carpeta
│                         (SectionDecor), rótulo/título de sección (SectionHead)
├── data/                 CONTENIDO del sitio (fuente única de verdad, en español; los *.en.ts
│   │                     traducen solo los textos: services.en, serviceDetails.en, serviceFaqs.en,
│   │                     blog.en y quote.en)
│   ├── services.ts           Los 9 servicios
│   ├── serviceDetails.ts     Contenido de la página de cada servicio (fotos: assets/images/servicios)
│   ├── solutions.ts          Soluciones por necesidad del cliente
│   ├── faqs.ts               Preguntas frecuentes (portada y Joel)
│   ├── serviceFaqs.ts        Preguntas frecuentes de cada servicio (página del servicio, Joel y buscador)
│   ├── chat.ts               Pasos, textos e íconos del chat de Joel en los dos idiomas (makeChat(lang))
│   ├── policies.ts           Políticas institucionales oficiales (/politicas; PDF en public/documentos)
│   ├── quote.ts              Preguntas y unidades del cotizador
│   ├── blog.ts               Artículos del blog
│   ├── videos.ts             Videos horizontales del canal de YouTube (página /videos)
│   ├── nosotros.ts           Menú de Nosotros
│   ├── stats.ts              Indicadores de la portada (años, contratos, folios)
│   ├── contact.ts            Número y enlace de WhatsApp (whatsappUrl)
│   ├── clients.ts            Clientes históricos (carrusel de logos; imágenes en assets/images/clientes)
│   └── search.ts             Índice del buscador
├── hooks/useAdvisorChat.ts  Lógica del chat de Joel y del chat con un asesor (API, puente, ventana de Zoho)
├── lib/joel.ts           "Cerebro" del asesor virtual en español (sin IA externa); joel.en.ts, en inglés
├── lib/advisorEvents.ts  Eventos ta:open-advisor, ta:crm-chat, ta:send-quote
├── lib/crmChat.ts        Carga de Zoho SalesIQ en la página aislada (solo al pedir un asesor; SALESIQ_WIDGET)
├── lib/zohoBridge.ts     Puente: la conversación de Zoho se ve dentro de Joel
├── lib/advisorChat.ts    Cliente de /api/advisor (modo API, listo para activar)
├── lib/visitor.ts        Lo que el sitio recuerda del visitante (localStorage): visitas, eventos, búsquedas
├── lib/leads.ts          Envío de formularios a /api/contact
├── lib/analytics.ts      Google Analytics con consentimiento (Consent Mode v2)
├── seo/                  Datos de la empresa (site.ts) y metadatos por ruta (meta.ts)
├── entry-server.tsx      Render en servidor para la pre-generación de HTML
├── data/joelPoses.ts     Poses de Joel por servicio (imágenes en assets/images/joel)
├── hooks/                Hooks reutilizables (aparición al hacer scroll)
├── assets/images/        Imágenes importadas desde el código
├── styles/tokens.ts      Paleta en código (C.indigo, C.yellow…) para estilos en línea
└── styles/index.css      Estilos globales, tokens de color de Tailwind (@theme), animaciones
public/                   Archivos servidos tal cual (videos, favicon, robots, documentos/ PDF oficiales)
api/contact.mjs           Función de Vercel: formularios → correo por Brevo (docs/07-formularios.md)
api/advisor.mjs           Función de Vercel: chat con un asesor por la API de Zoho SalesIQ (docs/08-chat-asesor.md)
public/chat-asesor.html   Página aislada donde vive el widget de Zoho (CSP propia en vercel.json)
src/styles/zoho-*.css     Diseño del sitio dentro de la ventana de Zoho (respaldo)
scripts/prerender.mjs     Pre-genera dist/<ruta>.html, 404, sitemap y robots (SEO)
scripts/generate-email-header.mjs  Banner de los correos (pnpm email:header)
knip.json                 Detección de archivos, exportaciones y dependencias sin uso (pnpm lint:unused)
tests/                    unit/, security/, seo/ (HTML generado), e2e/ (Playwright + axe)
docs/                     Documentación técnica (arquitectura, UX/UI, conversión, pruebas, decisiones)
RecursosTransarchivos/    Documentos fuente del cliente (contexto, no se publican)
```

### Reglas

- El texto del sitio vive en `src/data/` (español) y en los archivos `*.en.ts`
  junto a cada uno (inglés). Para cambiar un servicio, una pregunta frecuente o
  una solución, edite el archivo de datos en los dos idiomas: el sitio, el
  buscador y Joel se actualizan solos. Los textos de la interfaz (menús, botones,
  títulos de sección) están en `src/i18n/ui.ts`, `home.ts` y `pages.ts`.
- Todo el contenido debe salir de los documentos de `RecursosTransarchivos/`.
  No inventar cifras, precios, horarios ni certificaciones (la empresa NO tiene
  ISO 9001). Operan principalmente en Bogotá.
- Importar con el alias `@/` (apunta a `src/`).
- Colores: nunca escribir un hex nuevo. En estilos en línea usar `C.x` de
  `styles/tokens.ts`; en clases de Tailwind, los tokens del `@theme` de
  `styles/index.css` (`bg-indigo`, `text-dorado`, `border-borde`…). Ambas listas
  deben coincidir.
- Páginas internas: encabezado con `<PageHero>`, llamado final con `<CtaBand>`,
  títulos de sección con `kicker()`/`h2()`/`mark()` de `ui/SectionHead`.
- Lo que no se usa se borra: `pnpm lint:unused` (knip) falla en CI si quedan
  archivos, exportaciones o dependencias sin uso; TypeScript rechaza variables
  y parámetros sin uso.
- Componentes: un archivo por componente o por grupo pequeño relacionado;
  exportaciones con nombre (`export function X`).
- SEO: cada ruta se pre-genera en el servidor, en los dos idiomas. No usar
  `window`/`document`/`localStorage` durante el render (solo en efectos). Rutas
  nuevas → `src/seo/meta.ts` y `src/i18n/index.ts` (sección o slug traducido)
  (ver `docs/06-seo.md`).

## Idiomas

- Español en la raíz (`/servicios/custodia-de-archivos`) e inglés con prefijo y
  rutas traducidas (`/en/services/records-storage`). Las secciones y slugs en
  inglés están en `src/i18n/index.ts` (`SECTIONS`, `SLUGS`); el contenido se
  busca siempre por el slug en español (`slugEs`).
- En los componentes: `useLang()` da `lang`, `lp(rutaEnEspañol)` (la misma ruta
  en el idioma actual) y `tr(es, en)`; `useContent()` da los datos del idioma;
  `useUi()`, `useHomeUi()` y `usePagesUi()`, los textos de la interfaz. Los
  enlaces se escriben siempre con la ruta en español y se pasan por `lp()`.
- La franja superior de idioma (`LangBar`, como en Transpack) ofrece
  "Latinoamérica y España (Español)" e "International (English)" y lleva a la
  misma página en el otro idioma; se recoge al hacer scroll. Las páginas
  internas reservan `HEADER_SPACE` (barra + franja) arriba.
- Lo que no se traduce: las políticas institucionales (`/en/policies` las muestra
  en español con un aviso), los títulos de los videos de YouTube y los correos
  al equipo de Transarchivos (siempre en español; la confirmación al visitante sí
  va en su idioma, `api/contact.mjs`). Joel en inglés usa `src/lib/joel.en.ts`.
- Cada página lleva `hreflang` a su versión en el otro idioma (`x-default` en
  español), `og:locale` y el `lang` del `<html>`; el sitemap incluye las dos.
- Las traducciones las escribió el equipo de desarrollo (oct. 2026) y están
  pendientes de revisión por Transarchivos.

## Diseño

- Paleta: índigo vivo `#1800AD` (único azul del sitio: fondos, textos sobre
  blanco, botones, menú y chat; pedido de Joel, oct. 2026), amarillo `#FFDE59`,
  dorado `#C8960A`, blanco y grises claros. El azul oscuro `#272B7C` del manual
  queda solo en el logo, en los correos y en las tarjetas del modelo "Cómo
  trabajamos", que conservan sus cuatro colores (dorado, marino `#272B7C`,
  índigo y marino oscuro `#14163F`; pedido del cliente, oct. 2026). La lista blanca de colores está en
  `tests/unit/content.test.ts`.
- Fondos (oct. 2026): las secciones **alternan** dos tonos mediante
  `<SectionDecor variant="dark" | "light">`: índigo `#1800AD` (títulos y textos
  en blanco, rótulos en amarillo) y crema `#FBFBF8` (títulos en índigo, rótulos
  en dorado, textos en gris). Las tarjetas siempre son blancas con texto índigo;
  los botones de acción, amarillos. El hero, el mapa, el modelo, el blog, las
  preguntas frecuentes y el pie van en índigo; la franja de clientes es blanca.
  Las secciones se separan con la pestaña de carpeta horizontal (`FolderLip`,
  casi a todo el ancho, bajada inclinada a la derecha); `FolderDivider` recibe
  el color de la sección de abajo.
- Tipografías: Poppins (títulos), Montserrat (rótulos/botones), Inter (texto).
- Íconos: Bootstrap Icons (`<Bi n="..." />`, `<BiTile />`, `<MenuIcon />`).
- Estilo corporativo: sin caricaturas (solo Joel), sin degradados (en su lugar,
  el detalle de esquina del chat y el menú: cuadrado amarillo translúcido girado
  45° con puntas redondeadas, radio ≈ 17 % del lado), tarjetas blancas con borde fino, motivo gráfico de carpeta. Única
  excepción: la sombra negra superior del hero de inicio.
- Hero de inicio: secuencia de fotos de la operación de fondo (`public/hero-fotos/`,
  fundido lento cada 12 s, sin otro movimiento, velo índigo); el video del centro documental va en la sección del mapa.
  En computador, dos columnas: a la izquierda el título animado (tres frases que
  se alternan), la frase fija y el selector "¿Qué necesita hoy?"; a la derecha,
  Joel con la caja y el flujo de documentos (`assets/images/joel-flujo.webp`,
  imagen del cliente). En celular todo centrado y sin Joel (oct. 2026).

## Joel (asesor virtual)

`src/lib/joel.ts` entiende texto libre (palabras clave, sinónimos, errores de
tipeo), responde preguntas específicas, maneja objeciones, se defiende de
manipulación y temas ajenos, personaliza el saludo según el comportamiento del
visitante y aprende palabras nuevas. Todo se guarda en el `localStorage` del
visitante (no hay servidor). Recibe el conocimiento desde `src/data/` al crearse
(ver `getJoel()` en `hooks/useAdvisorChat.ts`).

**Chat con un asesor humano (Zoho SalesIQ):** Joel atiende primero; "Hablar con
un asesor" o pedir una persona por escrito (`handoff`) conecta de una vez, sin
mencionar Zoho. La conversación se ve dentro de Joel (puente); si falla, se abre
la ventana de Zoho con el diseño del sitio. El resumen de la cotización guiada
se envía al chat del equipo con "Enviar a un asesor". Zoho nunca se carga en las
páginas del sitio ni antes de pedir un asesor. Las funciones de Vercel son
`.mjs` (con `.ts` fallaban en Vercel). Ver `docs/08-chat-asesor.md`.
