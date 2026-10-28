# Chat con el widget de Zoho SalesIQ

**Variante de prueba (rama `chat-salesiq-widget`, oct. 2026).** El chat del
sitio **es el widget de Zoho SalesIQ**: su botón flotante y su ventana, tal
cual. El chat propio de Joel (ventana, saludo personalizado, botones de
servicios y preguntas frecuentes, cotización guiada y el puente con Zoho) se
quitó; esa versión sigue en la rama `chat-joel-salesiq`.

Todo el flujo (saludo, botones, preguntas frecuentes, cotización, transferencia
a un asesor) **se configura en Zoho SalesIQ**, no en el código.

| Qué hace el visitante | Qué pasa |
| --- | --- |
| Entra a cualquier página | Cuando el navegador queda libre, se carga el widget de Zoho y aparece su botón flotante en la esquina inferior derecha. |
| Pulsa el botón de Zoho | Se abre la ventana de Zoho. |
| Pulsa "Chat con Joel" / "Chatee con Joel" (menú, soporte, preguntas frecuentes) o la imagen de Joel del hero | Se abre la misma ventana de Zoho (`openChat`, `src/lib/chatWidget.ts`). Si Zoho no carga, se abre WhatsApp. |

| Pieza | Archivo |
| --- | --- |
| Arranque al entrar y apertura desde los botones del sitio | `src/lib/chatWidget.ts` (`startChatWidget`, `openChat`; desde `App.tsx` y las páginas) |
| Carga del widget en la página aislada | `src/lib/crmChat.ts` (`loadCrmChat`, `openCrmChat`) |
| Tamaño y posición del iframe | `#ta-zoho-frame` en `src/styles/index.css` |

## Configuración en Zoho SalesIQ

1. **Código del widget:** está en `SALESIQ_WIDGET` (`src/lib/crmChat.ts`),
   tomado de Zoho → Configuración → Marcas → Transarchivos → Código de
   instalación. Si se cambia de marca en Zoho, actualizarlo ahí. No es secreto.
2. En Zoho (Configuración → Canales → Sitio web): autorizar
   `www.transarchivos.com` y el dominio de Vercel; idioma español.
3. El bot, el saludo, los botones, las preguntas frecuentes, la cotización y la
   transferencia a un asesor se arman en Zoho (bot y base de conocimientos).
   El contenido aprobado para redactarlos está en `src/data/` (`faqs.ts`,
   `serviceFaqs.ts`, `serviceDetails.ts`, `solutions.ts`) y en
   `RecursosTransarchivos/`. Mismas reglas: sin precios, sin ISO 9001, Bogotá
   como sede.
4. Probar con mensajes marcados **"PRUEBA técnica (ignorar)"**. En local
   (`pnpm dev`) se habla con el Zoho real.

## Página aislada y CSP (vercel.json)

Zoho **no se carga en las páginas del sitio**: vive en `public/chat-asesor.html`,
que el sitio muestra en un iframe en la esquina (`#ta-zoho-frame`). El widget
ejecuta un script en línea distinto para cada visitante, así que no se puede
autorizar en la CSP estricta del sitio.

El iframe es invisible hasta que Zoho está listo (clase `ta-zoho-ready` en
`<html>`). Con la ventana cerrada mide 160 × 160 px (solo el botón flotante, 25 % más
grande y a 32 px de la esquina: `src/styles/zoho-host.css`),
para no tapar el sitio; al abrir la ventana crece a 440 px de ancho (en celular,
toda la pantalla) con la clase `ta-zoho-open`, que se pone y se quita con los
eventos de abrir, cerrar y minimizar de Zoho. Se esconde con el menú móvil
abierto y, en celular, mientras se muestra el aviso de cookies.

**Ojo:** si Zoho muestra algo fuera del botón con la ventana cerrada (por
ejemplo, una burbuja de invitación junto al botón), queda recortado por el
iframe. Desactívelo en Zoho o agrande el iframe cerrado en `index.css`.

| Cabeceras | Para | Scripts permitidos |
| --- | --- | --- |
| `/((?!chat-asesor).*)` | Todo el sitio | Solo los del propio sitio y Google Tag Manager. Nada de Zoho. `frame-src 'self'` para mostrar la página aislada. |
| `/chat-asesor` y `/chat-asesor.html` | La página aislada | `'unsafe-inline'` más `salesiq.zohopublic.com`, `salesiq.zoho.com` y `static.zohocdn.com`; `connect-src` con `salesiq.zoho.com`, `*.zohopublic.com` (también `wss:`) y `static.zohocdn.com`. Solo el sitio la puede mostrar (`frame-ancestors 'self'`, `X-Frame-Options: SAMEORIGIN`) y no se indexa (`X-Robots-Tag`). |

Si algo del chat no funciona en producción, abra la consola del navegador: un
mensaje "Refused to …" indica el dominio que falta. Agréguelo en las reglas de
`/chat-asesor` de `vercel.json` y revise `tests/security/static.test.ts`.

## Diseño

Los colores, el avatar y los textos del widget se configuran primero en Zoho
(Configuración → Marcas → Personalización). Además, el sitio inyecta dos hojas
de estilo (iframes del mismo origen):

| Qué | Archivo |
| --- | --- |
| Lo de adentro de la ventana | `src/styles/zoho-chat.css` (se inyecta desde `src/lib/crmChat.ts`) |
| Marco (esquinas, sombra) y botón flotante | `src/styles/zoho-host.css` (se inyecta en la página aislada) |

Los estilos dependen de las clases internas de Zoho (`.siqcw-header`,
`#zsiq_float`…); revise el chat después de cada actualización grande de Zoho.

## Protección de datos

- El widget se carga **al entrar al sitio**, así que Zoho puede guardar sus
  cookies desde la primera visita, sin que la persona abra el chat. La política
  (`/privacidad`) lo dice; el área legal debe revisarla antes de publicar esta
  variante.
- Zoho actúa como encargado del tratamiento y puede procesar los datos en
  servidores fuera de Colombia.

## Modo "API" (sin uso en esta variante)

`api/advisor.mjs` (y `scripts/zoho-token.mjs`, `scripts/zoho-advisor-check.mjs`)
siguen en el proyecto, pero ningún código del navegador los llama: eran el
canal de Joel por la API de Zoho. Si esta variante se adopta, se pueden borrar
junto con `tests/unit/advisor-api.test.ts`.

## Pruebas

Las pruebas **nunca se conectan con Zoho**: cada archivo de
`tests/e2e/` responde al script de Zoho con un script vacío, y las que necesitan
el widget lo simulan (`mockZoho` en `tests/e2e/flows.spec.ts`).

- `tests/unit/crmChat.test.ts`: carga una sola vez, en español y con el botón;
  el iframe crece al abrir la ventana; los botones del sitio la abren;
  reintento si falla; estilos inyectados.
- `tests/e2e/flows.spec.ts`: el widget se carga al entrar, con el iframe
  pequeño, y "Chatee con Joel" abre la ventana.
- `tests/e2e/csp.spec.ts`: con las cabeceras de `vercel.json`, Zoho carga al
  entrar sin bloqueos.
- `tests/security/static.test.ts`: CSP del sitio sin Zoho.
