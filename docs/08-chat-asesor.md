# Chat con el widget de Zoho SalesIQ

**Variante de prueba (rama `chat-salesiq-widget`, oct. 2026).** El chat del
sitio **es el widget de Zoho SalesIQ**, con el aspecto del chat de Joel: se
abre con el mismo botón flotante de Joel y su ventana tiene la posición, el
tamaño y el diseño de la ventana de Joel. El funcionamiento es el de Zoho. El
chat propio de Joel (saludo personalizado, botones de servicios y preguntas
frecuentes, cotización guiada y el puente con Zoho) se quitó; esa versión
sigue en la rama `chat-joel-salesiq`.

Todo el flujo (saludo, botones, preguntas frecuentes, cotización, transferencia
a un asesor) **se configura en Zoho SalesIQ**, no en el código.

| Qué hace el visitante | Qué pasa |
| --- | --- |
| Entra a cualquier página | Ve el botón flotante de Joel (foto, "Joelito · IA · En línea") en la esquina inferior derecha. Cuando el navegador queda libre, se carga el widget de Zoho, escondido (su botón propio no se muestra). |
| Pulsa el botón de Joel | Se abre la ventana de Zoho sobre el botón; el botón pasa a "Cerrar" (en celular la ventana ocupa la pantalla y el botón se esconde). Otro clic la cierra. |
| Cierra o minimiza desde la ventana de Zoho | La ventana se esconde y el botón vuelve a "Joel". |
| Pulsa "Chat con Joel" / "Chatee con Joel" (menú, soporte, preguntas frecuentes) o la imagen de Joel del hero | Se abre la misma ventana de Zoho (`openChat`, `src/lib/chatWidget.ts`). Si Zoho no carga, se abre WhatsApp. |

| Pieza | Archivo |
| --- | --- |
| Botón flotante de Joel | `src/components/chat/ChatLauncher.tsx` (en `App.tsx`) |
| Arranque al entrar, abrir, abrir o cerrar | `src/lib/chatWidget.ts` (`startChatWidget`, `openChat`, `toggleChat`; evento `ta:crm-chat` con `{ open }`) |
| Carga del widget en la página aislada | `src/lib/crmChat.ts` (`loadCrmChat`, `openCrmChat`, `closeCrmChat`) |
| Tamaño y posición de la ventana | `#ta-zoho-frame` en `src/styles/index.css` |

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
que el sitio muestra en un iframe (`#ta-zoho-frame`). El widget
ejecuta un script en línea distinto para cada visitante, así que no se puede
autorizar en la CSP estricta del sitio.

Con la ventana cerrada, el iframe espera fuera de la pantalla (cuando Zoho
está listo, `<html>` lleva la clase `ta-zoho-ready`). Abierta (clase
`ta-zoho-open`, que se pone y se quita con los eventos de abrir, cerrar y
minimizar de Zoho), el iframe es la ventana del chat de Joel: 400 px de ancho
y hasta 620 px de alto, a 24 px del borde derecho y 92 px del inferior (sobre
el botón), esquinas de 24 px, borde índigo suave y sombra; en celular, toda la
pantalla. Adentro, la ventana de Zoho llena el iframe (`src/styles/zoho-host.css`).
El botón de Joel se esconde con el menú móvil abierto y, en celular, mientras
se muestra el aviso de cookies.

| Cabeceras | Para | Scripts permitidos |
| --- | --- | --- |
| `/((?!chat-asesor).*)` | Todo el sitio | Solo los del propio sitio y Google Tag Manager. Nada de Zoho. `frame-src 'self'` para mostrar la página aislada. |
| `/chat-asesor` y `/chat-asesor.html` | La página aislada | `'unsafe-inline'` más `salesiq.zohopublic.com`, `salesiq.zoho.com` y `static.zohocdn.com`; `connect-src` con `salesiq.zoho.com`, `*.zohopublic.com` (también `wss:`) y `static.zohocdn.com`. Solo el sitio la puede mostrar (`frame-ancestors 'self'`, `X-Frame-Options: SAMEORIGIN`) y no se indexa (`X-Robots-Tag`). |

Si algo del chat no funciona en producción, abra la consola del navegador: un
mensaje "Refused to …" indica el dominio que falta. Agréguelo en las reglas de
`/chat-asesor` de `vercel.json` y revise `tests/security/static.test.ts`.

## Diseño

El sitio inyecta dos hojas de estilo (iframes del mismo origen):

| Qué | Archivo |
| --- | --- |
| Lo de adentro de la ventana: diseño del chat de Joel | `src/styles/zoho-chat.css` (se inyecta desde `src/lib/crmChat.ts`) |
| La ventana llena el iframe; sin el botón de Zoho | `src/styles/zoho-host.css` (se inyecta en la página aislada) |

Lo que se copia del chat de Joel: cabecera índigo con el cuadrado amarillo
girado; de izquierda a derecha, la flecha de volver (cuando Zoho la muestra),
la foto de Joel (38 px) con punto verde, el rótulo "ASESOR VIRTUAL" y el
nombre, y los botones de 32 px: menú de opciones (tres puntos), Reiniciar y la
X; cuerpo gris; mensajes del bot en tarjeta blanca con la
foto de Joel al lado, del visitante en índigo; sin hora; opciones en una
tarjeta con una fila por opción; campo en píldora y botón de enviar amarillo;
botón "Reiniciar conversación" en la cabecera, a la izquierda de la X: lo pone
`src/lib/crmChat.ts`, pulsa el "Reiniciar" de Zoho (que se esconde del pie del
último mensaje) y sigue a la vista desde que Zoho lo ofrece hasta que termina
la conversación con el bot. Si se pulsa mientras el bot responde, espera a que
Zoho vuelva a ofrecerlo.

El menú de opciones de Zoho (tres puntos: silenciar, enviar la conversación
por correo, finalizar el chat) se abre bajo la cabecera, en una tarjeta blanca
con texto índigo. Para que no quede recortado, la cabecera no recorta lo que
sobresale y el cuadrado amarillo se dibuja dentro de ella.

Lo que se configura en Zoho: el **nombre** que se ve en la cabecera y sobre
los mensajes (el de la marca, hoy "Transarchivos") y el texto de los mensajes y
opciones. "Con tecnología Zoho SalesIQ" es de Zoho y se deja.

**CSS personalizado del portal:** `docs/zoho-salesiq-portal.css` es una copia
idéntica de `zoho-chat.css` (la foto de Joel va incrustada en `--ta-joel`, así
que no depende de ningún dominio) para subir en
Zoho → Configuración → Marcas → Personalización. Si el que está subido es
distinto, se mezcla con el del sitio: las reglas de los mensajes del sitio van
con `#scroll-container` delante para ganar, pero conviene que sean iguales.

Los estilos dependen de las clases internas de la ventana de Zoho
(`.siqcw-header`, `.chat-bubble-cont`, `.tag-div`, `data-zsqa`…; revisadas
con el widget real en octubre de 2026); revise el chat después de cada
actualización grande de Zoho.

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

- `tests/unit/crmChat.test.ts`: carga una sola vez, en español y sin el botón
  de Zoho; el iframe se muestra al abrir la ventana y avisa al botón de Joel;
  abrir y cerrar; reintento si falla; estilos inyectados.
- `tests/e2e/flows.spec.ts`: el widget se carga al entrar, con el iframe fuera
  de la pantalla y el botón de Joel a la vista; el botón de Joel y "Chatee con
  Joel" abren la ventana; el botón la cierra.
- `tests/e2e/csp.spec.ts`: con las cabeceras de `vercel.json`, Zoho carga al
  entrar sin bloqueos.
- `tests/security/static.test.ts`: CSP del sitio sin Zoho.
