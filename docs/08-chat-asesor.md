# Chat con un asesor: Zoho SalesIQ (CRM)

Misma arquitectura que el sitio de Transpack (`../pagina web transpack`,
`docs/chat-crm.md`), adaptada a Transarchivos (un idioma, trato de usted).

**Joel atiende primero.** El chat del sitio es Joel, el asesor virtual propio.
Cuando la persona pide un asesor ("Hablar con un asesor", o escribe "quiero
hablar con un asesor", "con una persona"…), **Joel la conecta de una vez**:
"Le conecto con un asesor. Escríbale su mensaje y le responderá aquí mismo."
Sin pasos intermedios y **sin mencionar Zoho** ni la plataforma. Si pide
contacto en general (teléfono, WhatsApp), Joel lo da en una línea y ofrece
"Chatear con un asesor" como primera opción. "Asesoría" es pedir orientación,
no un asesor: Joel la da él mismo. En los tres modos el asesor atiende desde su
panel de SalesIQ como cualquier chat:

| Modo | Cuándo | Cómo se ve |
| --- | --- | --- |
| **API** (`api/advisor.mjs`) | Si las credenciales de la API de Zoho están en Vercel. **Hoy bloqueado:** Zoho no da el permiso de organización (ver "Estado") | Todo dentro de Joel; el navegador nunca carga Zoho. |
| **Puente** (`src/lib/zohoBridge.ts`) — **el que se usa hoy** | Si la API no está configurada | Todo dentro de Joel: el widget de Zoho se carga **escondido** y Joel escribe en él y muestra sus respuestas. Si Zoho pide un formulario, Joel ofrece completarlo en la ventana de Zoho u omitirlo. |
| **Ventana de Zoho** (respaldo) | Si el puente falla (por ejemplo, Zoho cambió su ventana) | Se abre la ventana del widget de SalesIQ, con el diseño del sitio. |

## Puesta en marcha (pendiente)

1. **Código del widget:** ya está en `SALESIQ_WIDGET` (`src/lib/crmChat.ts`),
   tomado de Zoho → Configuración → Marcas → Transarchivos → Código de
   instalación. Si se cambia de marca en Zoho, actualizarlo ahí. No es secreto.
2. En Zoho (Configuración → Canales → Sitio web): autorizar
   `www.transarchivos.com` y el dominio de Vercel; idioma español.
3. **Apagar el bot de Zoho** (SalesIQ → Bot → Zobot): Joel cumple ese papel en
   el sitio. Si queda encendido, sus mensajes aparecen en Joel y la
   conversación no llega a los asesores hasta que el bot la transfiera.
4. Probar en el sitio publicado con mensajes marcados **"PRUEBA técnica
   (ignorar)"** para que el equipo los reconozca.

## Cotización terminada → seguimiento del equipo comercial

Cuando el visitante termina la cotización guiada de Joel:

1. Joel pide el **celular o WhatsApp** después de la empresa (valida que tenga
   al menos 7 dígitos; si no, lo vuelve a pedir).
2. El resumen trae como primer botón **"Enviar a un asesor"** (debajo, WhatsApp
   y correo). Al pulsarlo (nada se envía antes), Joel **manda la cotización al
   chat de los asesores** (por la API o el puente, el que esté activo) como una
   conversación nueva. El primer mensaje es `teamQuoteMessage`
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
   cotización ya está con un asesor. Le contactará al <número>…") y se queda
   escuchando: si el asesor responde mientras el cliente sigue en la página, la
   respuesta aparece en Joel. Si el envío falla: "No pude enviarla en este
   momento…" y sugiere WhatsApp.
4. Una cotización se envía una sola vez; si ya hay una conversación con un
   asesor abierta, va por esa misma. Si se hace otra cotización (aunque sea
   igual), se puede volver a enviar.

Se registra `generate_lead` con `method: "chat_advisor"`.

## Modo "puente" (activo)

1. "Hablar con un asesor" → Joel dice "Le conecto con un asesor" y pide el mensaje.
2. Se carga el widget de Zoho en la página aislada, escondida fuera de la
   pantalla (`#ta-zoho-frame`, `src/styles/index.css`), se pulsa "Chatee con
   nosotros ahora" y se escribe la pregunta en su campo de texto.
3. Un observador lee los mensajes nuevos del bot o del asesor de Zoho
   (`[data-zsqa="agent_msg message_bubble"]`) y los muestra en Joel con su
   nombre y el ícono de audífonos; los botones de sugerencia de Zoho aparecen
   como opciones en Joel.
4. Lo que la persona escribe después va al campo de texto de Zoho. Los envíos
   se confirman uno a uno (Zoho pierde envíos muy seguidos): se compara el texto
   sin acentos ni signos, con máximo 3 reintentos; si Zoho nunca confirma la
   pregunta inicial, el puente falla (sin decir "Listo").
5. Las **preguntas de datos del visitante** que hace Zoho ("¿Cómo quiere que
   le contactemos?"…) se **omiten solas**: mientras no se respondan, Zoho no
   pasa la conversación a los asesores, y Joel ya tiene la consulta. Si una
   pregunta no se puede omitir, Joel ofrece "Completar mis datos" (muestra la
   ventana de Zoho; al cerrarla se vuelve a esconder).
6. "Volver con Joel" deja de escuchar y esconde Zoho. Si nadie responde en
   `WAIT_MS` (2 minutos), Joel ofrece WhatsApp y el formulario.

**Cuidado:** depende de la estructura interna de la ventana de Zoho (clases y
atributos `data-zsqa`). Si Zoho la cambia, el puente falla y Joel abre la
ventana de Zoho (respaldo).

## Modo "API" (listo, bloqueado por Zoho)

```
Navegador (Joel) ──/api/advisor──► Función de Vercel (api/advisor.mjs) ──API REST──► Zoho SalesIQ ◄── asesor
```

1. Con la pregunta, la función abre la conversación en SalesIQ (API de
   visitante) y le entrega al navegador un **pase firmado** (`ADVISOR_SECRET`,
   vence en 12 horas) que solo sirve para esa conversación.
2. Lo que la persona escribe después se envía a esa conversación; cada 3,5 s
   el chat pregunta si hay respuestas nuevas ("X se unió a la conversación").
3. La conversación sigue al cambiar de página o recargar (`sessionStorage`).

| Pieza | Archivo |
| --- | --- |
| Función (abrir, enviar, leer) | `api/advisor.mjs` |
| Cliente del navegador | `src/lib/advisorChat.ts` |
| Lógica en el chat | `src/hooks/useAdvisorChat.ts` (`live`: `ask` → `connecting` → `live`) |
| Mensajes del asesor y franja "Chat con un asesor" | `src/components/chat/ChatBot.tsx` |
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
**Org OAuth token** para la API de visitante, el modo activo es el puente.

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
solo cuando la persona pide un asesor. El widget ejecuta un script en línea
distinto para cada visitante, así que no se puede autorizar con una huella fija
en la CSP estricta del sitio.

| Cabeceras | Para | Scripts permitidos |
| --- | --- | --- |
| `/((?!chat-asesor).*)` | Todo el sitio | Solo los del propio sitio y Google Tag Manager. Nada de Zoho. `frame-src 'self'` para mostrar la página aislada. |
| `/chat-asesor` y `/chat-asesor.html` | La página aislada | `'unsafe-inline'` más `salesiq.zohopublic.com`, `salesiq.zoho.com` y `static.zohocdn.com`; `connect-src` con `salesiq.zoho.com`, `*.zohopublic.com` (también `wss:`) y `static.zohocdn.com`. Solo el sitio la puede mostrar (`frame-ancestors 'self'`, `X-Frame-Options: SAMEORIGIN`) y no se indexa (`X-Robots-Tag`). |

Si algo del chat no funciona en producción, abra la consola del navegador: un
mensaje "Refused to …" indica el dominio que falta. Agréguelo en las reglas de
`/chat-asesor` de `vercel.json` y revise `tests/security/static.test.ts`.

## Diseño (ventana de Zoho de respaldo)

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

- Mientras la persona no pida un asesor (o no pulse "Enviar a un asesor"), no
  se envía nada a Zoho ni se cargan sus cookies.
- Joel no muestra un aviso previo ni nombra la plataforma: el uso de los datos
  lo explica la política (`/privacidad`): fila "Chat con un asesor (Zoho
  SalesIQ)", Zoho como encargado del tratamiento con servidores que pueden
  estar fuera de Colombia, y la cotización que llega al equipo con nombre y
  celular.

## Analítica

- Pedir un asesor: `contact_click` con `method: "advisor_chat"`.
- Abrir la conversación con el asesor: `generate_lead` con `method: "advisor_chat"`.
- Cotización enviada al equipo: `generate_lead` con `method: "chat_advisor"`.
- Lo que se escribe nunca llega a Google Analytics.

## Pruebas

Las pruebas **nunca se conectan con Zoho**: simulan el widget (`mockZoho` en
`tests/e2e/flows.spec.ts`) y `/api/advisor`. `crmChat` y `zohoBridge` se
cargan con `import()` solo al usarse (límite de tamaño del bundle en CI).

- `tests/unit/zohoBridge.test.ts`, `crmChat.test.ts`, `advisor-api.test.ts`,
  `chatQuote.test.ts` y `joel.test.ts` ("chat con un asesor").
- `tests/security/static.test.ts`: funciones de Vercel en `.mjs`, credenciales
  de Zoho solo en el servidor, CSP del sitio sin Zoho.
- `tests/e2e/flows.spec.ts`: puente dentro de Joel, pedir un asesor por escrito,
  cotización enviada una sola vez, falla del puente, modo API.
- `tests/e2e/csp.spec.ts`: con las cabeceras de `vercel.json`, el chat con un
  asesor no queda bloqueado.
