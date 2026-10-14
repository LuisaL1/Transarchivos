# 5 · Decisiones y pendientes

## Decisiones tomadas con el cliente (no revertir sin consultar)

| Tema | Decisión |
| --- | --- |
| Hero | Video a pantalla completa con velo azul y contenido centrado: título animado ("Sus archivos, bajo [control·custodia·orden·legalidad·resguardo·protección]"), frase y selector con Joel. Reemplazó la pantalla dividida (oct. 2026). Selector "¿Qué necesita hoy?" sin textos de relleno. |
| Colores | Inversión de colores a pedido del cliente ("mucho blanco"): fondos en índigo vivo #1800AD del manual de marca (Joel pidió este tono: el azul oscuro se veía opaco), textos en blanco, botones de acción en amarillo y tarjetas blancas. Aplica a todo el sitio (oct. 2026). |
| Azul único | Todo el sitio usa un solo azul, el índigo vivo #1800AD del manual (textos, botones, menú, chat, ventanas). El azul oscuro #272B7C queda solo en el logo, en los correos y en el modelo "Cómo trabajamos", cuyas cuatro tarjetas conservan sus colores originales: dorado, marino, índigo y marino oscuro #14163F (pedido del cliente, oct. 2026). |
| Chat con un asesor | Igual que Transpack: Joel atiende primero y conecta de una vez con un asesor de Zoho SalesIQ (puente dentro de Joel; API lista pero bloqueada por un permiso de Zoho; ventana de Zoho como respaldo). La cotización guiada se envía al chat del equipo con «Enviar a un asesor». Zoho vive en `public/chat-asesor.html` con su propia CSP. Trato de usted, como el resto del sitio (oct. 2026). Ver `docs/08-chat-asesor.md`. |
| Contraste | Las secciones alternan índigo y crema (demasiado azul seguido cansaba): hero, mapa, cifras, servicios, modelo, blog, FAQ y pie en índigo; confianza, clientes, diagnóstico, soluciones, cotizador, videos y diferenciales claras. Páginas internas: alternan desde su hero. (oct. 2026) |
| Pestaña de carpeta | En la división del hero, pegada al borde superior y del mismo azul del panel. Bajo el menú hay una sombra negra suave (pedida por el cliente). |
| Joel en el hero | Junto al selector, volteado, con la mano sobre la tarjeta y sin globo de texto. Solo su cuerpo es clicable, para no bloquear la pestaña "Destruir". |
| Mapa | La animación original del mapa se conserva. Se agregó solo la silueta de Joel en súper zoom, del color del mapa. Se descartaron rutas, camión, Joel detective y mini-Joel en el pin. |
| Secciones de inicio | Estilo claro original (crema/lavanda). Se descartaron fondos de colores y el "bento" de servicios. |
| Colores | Solo la paleta del manual. El menú usa solo `#272B7C`. Fuera del menú se conserva el índigo donde ya estaba. |
| Degradados | Ninguno. Se reemplazan por el detalle de esquina del menú y el chat. |
| Páginas internas | Servicios, Nosotros y artículos comparten el mismo formato (ver 02). Nosotros no tiene navegación interna con píldoras. |
| Artículos | "Más del blog" y preguntas frecuentes en la columna lateral, no abajo, para evitar espacio muerto. |
| Contenido | Sin ISO 9001. Bogotá como sede, abiertos al resto del país. Sin precios: no existen tarifas oficiales. |
| Favicon | La "t" manuscrita del logo sobre azul: versión gruesa para la pestaña, con flecha para los íconos grandes. |
| Documentos fuente | `RecursosTransarchivos/` no se borra ni se publica. |

## Pendientes priorizados

| Prioridad | Pendiente | Detalle |
| --- | --- | --- |
| Alta | **Chat con un asesor: puesta en marcha** | Código del widget ya puesto en `SALESIQ_WIDGET`. Falta: autorizar el dominio en Zoho, apagar el bot de Zoho y probar con mensajes «PRUEBA técnica (ignorar)». Modo API: pendiente del permiso de organización de Zoho (ver `docs/08-chat-asesor.md`). |
| Alta | **Google Analytics** | ID `G-PNPFD16QSZ` ya integrado y verificado (`pnpm test:ga`). Falta: crear la variable en Vercel (Production), marcar los eventos clave en GA4 y agregar `quote_step` y `chat_message` (ver 03). |
| Alta | **Publicación** | SEO técnico listo. Falta seguir el checklist de `docs/06-seo.md`: dominio, `VITE_SITE_INDEXABLE=true`, Search Console, Google Business Profile y redirecciones 301 del sitio anterior. |
| Media | **Suscripción del blog** | Conectarla a la herramienta de correo que elija la empresa. |
| Media | **Contraste AA** | Rótulos dorados y grises terciarios (tabla en `TESTING.md`). Requiere aprobación de diseño. Después, activar `A11Y_STRICT`. |
| Media | **Rendimiento** | Bundle JS de ~530 KB: dividir por rutas con `React.lazy`. Imágenes: `joel.png` 1,1 MB, `logo.png` 378 KB y poses de ~300 KB, pasarlas a WebP/AVIF con tamaños responsive. Videos del hero de ~10 MB: versión comprimida para celular. |
| Media | **Logo vectorial** | Con el SVG oficial, rehacer el favicon y el logo nítidos. |
| Baja | **Joel** | Revisar periódicamente las preguntas que no entendió (`unknown` en el perfil local); hoy solo quedan en el navegador del visitante. |
| Alta | **Datos legales** | La política de privacidad del sitio (`/privacidad`) ya está publicada. Falta: agregar el NIT en `LEGAL.nit` (`src/seo/site.ts`) y que el área legal de Transarchivos la revise; enlazar también la política general de la empresa si la tienen publicada. |
