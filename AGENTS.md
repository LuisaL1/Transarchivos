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
- `pnpm check:all` — lo anterior + código sin uso (`lint:unused`, knip) + auditoría de dependencias + extremo a extremo
- `pnpm email:header` — regenera el banner de los correos (`public/brand/email-header.png`)

## Arquitectura (`src/`)

```
src/
├── main.tsx              Punto de entrada (router + estilos globales)
├── App.tsx               Rutas: el inicio va en el paquete principal; las demás páginas y el chat
│                         se cargan aparte (React.lazy); el pre-render las espera
├── pages/                Una página por ruta
│   ├── HomePage.tsx          "/"  (estado del chat, hero, secciones)
│   ├── ServiceDetailPage.tsx "/servicios/:slug"
│   ├── NosotrosPage.tsx      "/nosotros"
│   ├── ArticlePage.tsx       "/blog/:slug"
│   ├── PoliciesPage.tsx      "/politicas" (7 políticas oficiales)
│   └── PrivacyPage.tsx       "/privacidad" (aviso del sitio y cookies)
├── components/
│   ├── layout/           Navbar compartido (SiteHeader), menús desplegables,
│   │                     búsqueda (SearchOverlay) y tarjeta de soporte
│   ├── sections/         Secciones reutilizables: tarjeta de servicio, soluciones,
│   │                     cotizador, blog, preguntas frecuentes; y las compartidas por
│   │                     las páginas internas: PageHero (encabezado) y CtaBand (llamado final)
│   ├── home/             Piezas propias del hero (videos, barra de Joel)
│   ├── chat/             Chat de Joel (interfaz y guion); LazyChatBot lo carga aparte
│   └── ui/               Primitivas: íconos, marca (logo/Joel), fondos y pestaña de carpeta
│                         (SectionDecor), rótulo/título de sección (SectionHead)
├── data/                 CONTENIDO del sitio (fuente única de verdad)
│   ├── services.ts           Los 9 servicios
│   ├── serviceDetails.ts     Contenido de la página de cada servicio
│   ├── solutions.ts          Soluciones por necesidad del cliente
│   ├── faqs.ts               Preguntas frecuentes
│   ├── policies.ts           Políticas institucionales oficiales (/politicas; PDF en public/documentos)
│   ├── quote.ts              Preguntas y unidades del cotizador
│   ├── blog.ts               Artículos del blog
│   ├── nosotros.ts           Menú de Nosotros
│   ├── stats.ts              Indicadores de la portada (años, contratos, folios)
│   ├── contact.ts            Número y enlace de WhatsApp (whatsappUrl)
│   ├── clients.ts            Clientes históricos (carrusel de logos; imágenes en assets/images/clientes)
│   └── search.ts             Índice del buscador
├── lib/joel.ts           "Cerebro" del asesor virtual (sin IA externa)
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
api/contact.ts            Función de Vercel: formularios → correo por Brevo (docs/07-formularios.md)
scripts/prerender.mjs     Pre-genera dist/<ruta>.html, 404, sitemap y robots (SEO)
scripts/generate-email-header.mjs  Banner de los correos (pnpm email:header)
knip.json                 Detección de archivos, exportaciones y dependencias sin uso (pnpm lint:unused)
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
- SEO: cada ruta se pre-genera en el servidor. No usar `window`/`document`/
  `localStorage` durante el render (solo en efectos). Rutas nuevas → `src/seo/meta.ts`
  (ver `docs/06-seo.md`).

## Diseño

- Paleta: índigo vivo `#1800AD` (único azul del sitio: fondos, textos sobre
  blanco, botones, menú y chat; pedido de Joel, oct. 2026), amarillo `#FFDE59`,
  dorado `#C8960A`, blanco y grises claros. El azul oscuro `#272B7C` del manual
  queda solo en el logo y en los correos. La lista blanca de colores está en
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
- Hero de inicio: video a pantalla completa de fondo (velo azul marino), con el
  contenido centrado: título animado "Sus archivos, bajo [palabra]", frase y el
  selector "¿Qué necesita hoy?" con Joel a su lado.

## Joel (asesor virtual)

`src/lib/joel.ts` entiende texto libre (palabras clave, sinónimos, errores de
tipeo), responde preguntas específicas, maneja objeciones, se defiende de
manipulación y temas ajenos, personaliza el saludo según el comportamiento del
visitante y aprende palabras nuevas. Todo se guarda en el `localStorage` del
visitante (no hay servidor). Recibe el conocimiento desde `src/data/` al crearse
(ver `getJoel()` en `components/chat/ChatBot.tsx`).
