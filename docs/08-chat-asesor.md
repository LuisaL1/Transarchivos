# Chat de Joel con Zoho SalesIQ (CRM)

Misma base técnica que el sitio de Transpack (`../pagina web transpack`,
`docs/chat-crm.md`), adaptada a Transarchivos (un idioma, trato de usted).

**Joel es la cara; Zoho SalesIQ, las respuestas** (oct. 2026). La ventana del
chat es Joel, pero **todo lo que el visitante escribe lo responde Zoho
SalesIQ**: su bot, con los artículos y preguntas frecuentes configurados en
Zoho, o un asesor humano si el bot transfiere la conversación. El sitio ya no
tiene respuestas propias para el texto libre: si Zoho no responde, Joel lo dice
y ofrece WhatsApp y el formulario. Nunca se menciona Zoho en el chat.

Lo que sigue local (en `src/data/chat.ts`), sin pasar por Zoho:

- el saludo personalizado y el menú de botones (`src/lib/joel.ts`);
- "Conocer los servicios" y "Preguntas frecuentes" (botones con los textos del sitio);
- la cotización guiada (servicio, volumen, urgencia, nombre, empresa y celular).

| Qué hace el visitante | Qué pasa |
| --- | --- |
| Abre el chat | Joel saluda con botones. Zoho se carga escondido, sin enviar nada, para que la primera respuesta llegue antes. |
| Escribe cualquier cosa (fuera de un paso que pide un dato) | El texto va a Zoho; Joel muestra "escribiendo…" y luego la respuesta, con sus botones si los trae. |
| Elige "Hablar con un asesor" | Joel le escribe a Zoho «Quiero hablar con un asesor»; el bot de Zoho hace la transferencia. |
| Elige "Dudas de normativa" (saludo del visitante técnico) | Se le pregunta a Zoho con ese texto. |
| Elige un botón que sugirió Zoho | Se pulsa ese botón en Zoho. |
| Termina la cotización y elige "Enviar a un asesor" | El resumen va a la misma conversación de Zoho (ver abajo). |

Las respuestas de Zoho firmadas con el nombre **Joel** (o sin nombre) se ven
como de Joel; con otro nombre (un asesor), con ese nombre y el ícono de
audífonos. **Por eso el bot de Zoho debe llamarse Joel.**

Si Zoho tarda más de `REPLY_MS` (25 s, `src/lib/advisorChat.ts`), Joel dice que
la respuesta está tardando y ofrece WhatsApp y el formulario; si la respuesta
llega después, igual se muestra. Si Zoho no carga o no confirma el mensaje:
"No pude responderle en este momento…" con los mismos canales.

| Canal | Cuándo | Cómo se ve |
| --- | --- | --- |
| **API** (`api/advisor.mjs`) | Si las credenciales de la API de Zoho están en Vercel. **Hoy bloqueado:** Zoho no da el permiso de organización (ver "Estado") | Todo dentro de Joel; el navegador nunca carga Zoho. |
| **Puente** (`src/lib/zohoBridge.ts`) — **el que se usa hoy** | Si la API no está configurada (también en `pnpm dev`) | Todo dentro de Joel: el widget de Zoho se carga **escondido** al abrir el chat y Joel escribe en él y muestra sus respuestas. Si Zoho pide un formulario que no se puede omitir, Joel ofrece completarlo en la ventana de Zoho. |

## Configuración en Zoho SalesIQ (pendiente)

1. **Código del widget:** ya está en `SALESIQ_WIDGET` (`src/lib/crmChat.ts`),
   tomado de Zoho → Configuración → Marcas → Transarchivos → Código de
   instalación. Si se cambia de marca en Zoho, actualizarlo ahí. No es secreto.
2. En Zoho (Configuración → Canales → Sitio web): autorizar
   `www.transarchivos.com` y el dominio de Vercel; idioma español. (El 26 de
   octubre de 2026 el widget cargó desde `localhost:8443` sin configuración extra.)
3. **Encender el bot de Zoho y conectarlo a la base de conocimientos**
   (artículos y preguntas frecuentes). Es el que responde en Joel. Confirmar
   que el plan de SalesIQ lo incluye.
4. **Nombre del bot: «Joel»**, para que sus respuestas se vean como de Joel.
5. En el bot, configurar:
   - la **transferencia a un asesor** cuando el visitante escriba «Quiero
     hablar con un asesor» (es lo que envía el botón "Hablar con un asesor");
   - que los mensajes que empiezan por **«🆕 NUEVA COTIZACIÓN»** pasen
     directo a un asesor, sin respuesta del bot;
   - qué responder cuando no encuentra un artículo (por ejemplo, ofrecer un
     asesor). Joel no tiene respuesta propia de respaldo.
6. Si el bot muestra un saludo al abrir la conversación, no se repite en Joel
   (Joel ya saludó): solo pasan los mensajes que llegan después del primer
   mensaje del visitante.
7. Probar con mensajes marcados **"PRUEBA técnica (ignorar)"** para que el
   equipo los reconozca. En local (`pnpm dev`) se habla con el Zoho real.

Para redactar los artículos, el contenido aprobado del sitio está en
`src/data/` (`faqs.ts`, `serviceFaqs.ts`, `serviceDetails.ts`, `solutions.ts`)
y en los documentos de `RecursosTransarchivos/`. Mismas reglas: sin precios,
sin ISO 9001, Bogotá como sede.

## Cotización terminada → seguimiento del equipo comercial

Cuando el visitante termina la cotización guiada de Joel:

1. Joel pide el **celular o WhatsApp** después de la empresa (valida que tenga
   al menos 7 dígitos; si no, lo vuelve a pedir).
2. El resumen trae como primer botón **"Enviar a un asesor"** (debajo, WhatsApp
   y correo). Al pulsarlo (nada se envía antes), Joel **manda la cotización a
   Zoho** (por la API o el puente, el que esté activo), en la misma
   conversación del visitante. El mensaje es `teamQuoteMessage`
   (`src/data/chat.ts`):

   ```
   🆕 NUEVA COTIZACIÓN para seguimiento (chat de Joel en el sitio web)
   Cliente: <nombre>
   Celular / WhatsApp: <número>

   • Servicio: …
   • Volumen: …
   • Urgencia: …
   • Empresa: …

   Por favor, contactar al cliente para dar seguimiento o cerrar la venta.
   ```

3. Joel confirma al cliente solo cuando Zoho confirmó la recepción ("Listo, su
   cotización ya está con un asesor. Le contactará al <número>…"). Si el asesor
   responde mientras el cliente sigue en la página, la respuesta aparece en
   Joel. Si el envío falla: "No pude enviarla en este momento…" y sugiere WhatsApp.
4. Una cotización se envía una sola vez. Si se hace otra cotización (aunque sea
   igual), se puede volver a enviar.

Se registra `generate_lead` con `method: "chat_advisor"`.

## Modo "puente" (activo)

1. Al abrir el chat se carga el widget de Zoho en la página aislada, escondida
   fuera de la pantalla (`#ta-zoho-frame`, `src/styles/index.css`); se pulsa
   "Chatee con nosotros ahora" y se espera a que su campo de texto esté
   habilitado. No se envía nada todavía.
2. Lo que la persona escribe se pone en el campo de texto de Zoho. Los envíos
   se confirman uno a uno (Zoho pierde envíos muy seguidos): se compara el texto
   sin acentos ni signos, con máximo 3 reintentos; si Zoho no lo confirma, Joel
   dice que no pudo responder.
3. Un observador lee los mensajes nuevos del bot o del asesor de Zoho
   (`[data-zsqa="agent_msg message_bubble"]`) y los muestra en Joel; los
   botones de sugerencia de Zoho (`.tag-div`) aparecen como opciones en Joel.
4. Las **preguntas de datos del visitante** que hace Zoho ("¿Cómo quiere que
   le contactemos?"…) se **omiten solas** cuando tienen "Omitir". Si una
   pregunta no se puede omitir, Joel ofrece "Completar mis datos" (muestra la
   ventana de Zoho; al cerrarla se vuelve a esconder).
5. Si Zoho no carga, se reintenta con el siguiente mensaje.

**Cuidado:** depende de la estructura interna de la ventana de Zoho (clases y
atributos `data-zsqa`). Si Zoho la cambia, el puente falla y Joel ofrece
WhatsApp y el formulario. Las respuestas con artículos pueden llegar como
tarjetas con enlace: el puente solo toma el texto (`[data-zsqa="msg"]`) y los
botones; revisarlo con el Zoho real cuando haya artículos.

## Modo "API" (listo, bloqueado por Zoho)

```
Navegador (Joel) ──/api/advisor──► Función de Vercel (api/advisor.mjs) ──API REST──► Zoho SalesIQ ◄── bot / asesor
```

1. Con el primer mensaje, la función abre la conversación en SalesIQ (API de
   visitante) y le entrega al navegador un **pase firmado** (`ADVISOR_SECRET`,
   vence en 12 horas) que solo sirve para esa conversación.
2. Lo que la persona escribe después se envía a esa conversación; cada 3,5 s
   el chat pregunta si hay respuestas nuevas ("X se unió a la conversación").
3. La conversación sigue al cambiar de página o recargar (`sessionStorage`).

| Pieza | Archivo |
| --- | --- |
| Función (abrir, enviar, leer) | `api/advisor.mjs` |
| Cliente del navegador | `src/lib/advisorChat.ts` |
| Lógica en el chat | `src/hooks/useAdvisorChat.ts` (`askZoho` → `deliver`, por la API o el puente) |
| Mensajes de Zoho en la ventana | `src/components/chat/ChatBot.tsx` |
| Simulación en `pnpm dev` | `vite.config.ts` (`ADVISOR_MOCK=1 pnpm dev`: un asesor de prueba responde a los 5 s) |
| Credenciales y verificación con Zoho real | `scripts/zoho-token.mjs` (`pnpm advisor:token`), `scripts/zoho-advisor-check.mjs` (`pnpm advisor:check`) |

**Seguridad:** las credenciales de Zoho son de toda la cuenta y solo existen
en el servidor (prueba en `tests/security/static.test.ts`). La función acepta
solo pedidos del propio sitio, valida el largo de los mensajes y no reenvía al
navegador los detalles de los errores de Zoho.

**Estado (octubre de 2026):** en Transpack, abrir conversaciones a nombre del
visitante responde `1009 Invalid OAuthScope` con tokens de usuario; la
autorización de organización (`/oauth/v2/org/auth`) rechaza los clientes de
api-console.zoho.com. Hasta que soporte de Zoho SalesIQ indique cómo obtener el
**Org OAuth token** para la API de visitante, el modo activo es el puente. En
`pnpm dev` la API nunca se usa: `vite.config.ts` responde "no configurado".

### Configuración (área encargada de Zoho)

1. <https://api-console.zoho.com> → **Add Client → Self Client → Create**.
   Copie el **Client ID** y el **Client Secret**.
2. **Generate Code** con el scope `SalesIQ.conversations.CREATE,SalesIQ.conversations.READ,SalesIQ.Apps.READ,SalesIQ.departments.READ`.
3. En `.env.local` (no se sube): `ZOHO_CLIENT_ID`, `ZOHO_CLIENT_SECRET`,
   `ZOHO_AUTH_CODE` y `ZOHO_SALESIQ_SCREEN` (el nombre del portal en la
   dirección de SalesIQ; por defecto `transarchivos`). `pnpm advisor:token`
   guarda la clave de renovación y crea `ADVISOR_SECRET`.
4. `pnpm advisor:check` muestra marcas y departamentos;
   `pnpm advisor:check --conversacion` abre una conversación **de prueba**.
5. En Vercel → Settings → Environment Variables (Production): las mismas
   variables (ver `.env.example`). **Redeploy**.

## Página aislada y CSP (vercel.json)

Zoho **no se carga en las páginas del sitio**. Vive en `public/chat-asesor.html`,
que el sitio abre en un iframe escondido (`#ta-zoho-frame`, `src/lib/crmChat.ts`)
solo cuando la persona abre el chat. El widget ejecuta un script en línea
distinto para cada visitante, así que no se puede autorizar con una huella fija
en la CSP estricta del sitio.

| Cabeceras | Para | Scripts permitidos |
| --- | --- | --- |
| `/((?!chat-asesor).*)` | Todo el sitio | Solo los del propio sitio y Google Tag Manager. Nada de Zoho. `frame-src 'self'` para mostrar la página aislada. |
| `/chat-asesor` y `/chat-asesor.html` | La página aislada | `'unsafe-inline'` más `salesiq.zohopublic.com`, `salesiq.zoho.com` y `static.zohocdn.com`; `connect-src` con `salesiq.zoho.com`, `*.zohopublic.com` (también `wss:`) y `static.zohocdn.com`. Solo el sitio la puede mostrar (`frame-ancestors 'self'`, `X-Frame-Options: SAMEORIGIN`) y no se indexa (`X-Robots-Tag`). |

Si algo del chat no funciona en producción, abra la consola del navegador: un
mensaje "Refused to …" indica el dominio que falta. Agréguelo en las reglas de
`/chat-asesor` de `vercel.json` y revise `tests/security/static.test.ts`.

## Diseño (ventana de Zoho, solo para formularios)

Mismo diseño del chat de Joel: cabecera índigo con el cuadrado amarillo
translúcido girado 45°, rótulo "Transarchivos" en amarillo, fondo suave,
tarjetas blancas con borde fino, botón de enviar índigo con ícono amarillo, la
foto de Joel (`public/brand/joel.webp`) en lugar del robot de Zoho y solo
colores de la paleta (`src/styles/tokens.ts`), sin degradados.

| Qué | Archivo |
| --- | --- |
| Lo de adentro de la ventana | `src/styles/zoho-chat.css` (se inyecta desde `src/lib/crmChat.ts`) |
| Marco (esquinas, sombra) y botón de cerrar | `src/styles/zoho-host.css` (se inyecta en la página aislada) |

Los estilos dependen de las clases internas de Zoho (`.siqcw-header`,
`.home-icon-optns`, `.tag-div`…); revise el chat después de cada actualización
grande de Zoho.

## Protección de datos

- Mientras la persona no abra el chat, no se carga Zoho ni sus cookies. Al
  abrirlo se carga (modo puente), pero no se le envía nada hasta que la persona
  escribe, elige "Hablar con un asesor" o "Enviar a un asesor".
- Joel no muestra un aviso previo ni nombra la plataforma: el uso de los datos
  lo explica la política (`/privacidad`): fila "Respuestas del chat (Zoho
  SalesIQ)", Zoho como encargado del tratamiento con servidores que pueden
  estar fuera de Colombia, y la cotización que llega al equipo con nombre y
  celular. El área legal debe revisarla.

## Analítica

- Mensaje del visitante enviado a Zoho: `chat_message` (sin el texto).
- Pedir un asesor: `contact_click` con `method: "advisor_chat"`.
- Cotización enviada al equipo: `generate_lead` con `method: "chat_advisor"`.
- Lo que se escribe nunca llega a Google Analytics.

## Pruebas

Las pruebas **nunca se conectan con Zoho**: simulan el widget (`mockZoho` en
`tests/e2e/flows.spec.ts`, que responde a cada mensaje) y `/api/advisor`.
`crmChat` y `zohoBridge` se cargan con `import()` solo al usarse (límite de
tamaño del bundle en CI).

- `tests/unit/zohoBridge.test.ts`, `crmChat.test.ts`, `advisor-api.test.ts`,
  `chatQuote.test.ts` y `joel.test.ts` (saludo).
- `tests/security/static.test.ts`: funciones de Vercel en `.mjs`, credenciales
  de Zoho solo en el servidor, CSP del sitio sin Zoho.
- `tests/e2e/flows.spec.ts`: texto libre respondido por Zoho (puente), "Hablar
  con un asesor", cotización enviada una sola vez, Zoho que no carga y modo API.
- `tests/e2e/csp.spec.ts`: con las cabeceras de `vercel.json`, Zoho carga al
  abrir el chat sin bloqueos.
