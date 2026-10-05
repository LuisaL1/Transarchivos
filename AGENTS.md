# Transarchivos · Sitio web

Sitio corporativo de Transarchivos Ltda. (gestión documental, Bogotá) hecho con
React 19 + Vite 8 + Tailwind CSS v4 + TypeScript. Se publica en Vercel.

## Comandos

- `pnpm dev` — servidor local en http://localhost:8443
- `pnpm build` — build de producción en `dist/`
- `pnpm typecheck` — verificación de tipos
- Para probar el código sin variables o imports sobrantes:
  `npx tsc --noEmit -p . --noUnusedLocals --noUnusedParameters`

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
│   └── search.ts             Índice del buscador
├── lib/joel.ts           "Cerebro" del asesor virtual (sin IA externa)
├── hooks/                Hooks reutilizables (aparición al hacer scroll)
├── assets/images/        Imágenes importadas desde el código
└── styles/index.css      Estilos globales, animaciones, puntero/foco
public/                   Archivos servidos tal cual (videos del hero, favicon, robots)
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

## Diseño

- Paleta: azul marino `#272B7C`, índigo `#1800AD`, amarillo `#FFDE59`,
  dorado `#C8960A`, crema `#FBFBF8`, lavanda `#F1F3FB`.
- Tipografías: Poppins (títulos), Montserrat (rótulos/botones), Inter (texto).
- Íconos: Bootstrap Icons (`<Bi n="..." />`, `<BiTile />`, `<MenuIcon />`).
- Estilo corporativo: sin caricaturas (solo Joel), sin degradados en los fondos
  de sección, tarjetas blancas con borde fino, motivo gráfico de carpeta.
- La única animación del hero es la entrada de la carpeta.

## Joel (asesor virtual)

`src/lib/joel.ts` entiende texto libre (palabras clave, sinónimos, errores de
tipeo), responde preguntas específicas, maneja objeciones, se defiende de
manipulación y temas ajenos, personaliza el saludo según el comportamiento del
visitante y aprende palabras nuevas. Todo se guarda en el `localStorage` del
visitante (no hay servidor). Recibe el conocimiento desde `src/data/` al crearse
(ver `getJoel()` en `components/chat/ChatBot.tsx`).
