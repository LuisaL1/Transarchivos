# 7 · Formularios y envío de solicitudes (Brevo y Zoho Desk)

Todo contacto por correo del sitio pasa por formularios propios. Ningún enlace
abre el programa de correo del visitante.

| Formulario | Dónde | Qué envía |
| --- | --- | --- |
| **Formulario de contacto** (`ContactModal`) | Tarjeta de soporte, pie de página, preguntas frecuentes, menú de celular, chat de Joel, política de privacidad | Nombre, empresa, correo, teléfono, motivo, mensaje y autorización de datos |
| **Suscripción al blog** (`BlogSection`) | Sección Blog de la portada | Correo del suscriptor y autorización → marketing@; el suscriptor recibe "Suscripción confirmada" |
| **Cotizador** (`QuoteSimulator`) | Sección `#cotizador` | Servicio, respuestas, datos de contacto, siguiente paso sugerido y autorización → **ticket en Zoho Desk** (ver abajo) |

- Cualquier enlace a `#contacto` abre el formulario.
- Ambos formularios exigen la **autorización de tratamiento de datos** (Ley 1581 de 2012). El servidor la vuelve a verificar.

## Cómo viaja la información

```
Navegador ──POST /api/contact──► Función de Vercel (api/contact.ts) ──API Brevo──► mercadeo@ (comercial) / info@ (general)
```

- La función valida los datos, aplica el **campo trampa** contra bots (`website`), rechaza envíos desde otros dominios y **limita los envíos por IP** (5 cada 10 minutos; responde 429). El límite se cuenta en memoria de la instancia de Vercel, así que es un freno, no una cuota exacta. Lo que se repite al visitante en su confirmación (servicio o motivo) se acota a 60 caracteres, para que el formulario no sirva para enviar textos a terceros.
- Escapa el contenido antes de armar el correo y lo envía con **Brevo** (API transaccional).
- El correo llega con **"Responder a" = el visitante**, así que basta con responderlo.
- **Diseño de los correos:** banner en imagen (`public/brand/email-header.png`: índigo #1800AD (mismo azul del sitio; al cambiarlo, regenerar la imagen y subir `?v=` en `api/contact.ts` para renovar la caché de Gmail), logo blanco y detalle de esquina) para que el modo oscuro de Gmail no altere los colores; cuerpo en tablas. El banner se carga desde el dominio que recibió la solicitud, con versión en la URL (`?v=3`): al cambiar la imagen hay que subir el número, porque Gmail guarda en caché las imágenes por dirección.
- **Confirmación automática:** el visitante recibe "Recibimos su solicitud · Transarchivos" (con su nombre, el motivo o servicio, WhatsApp y teléfonos). Si responde, la respuesta llega a mercadeo@transarchivos.com. Si esta confirmación falla, la solicitud igual se da por enviada.
- La clave de Brevo solo existe en el servidor: nunca llega al navegador.
- El sitio no guarda copia de los datos.

## Cotizador → ticket en Zoho Desk

```
Navegador ──POST /api/ticket──► Función de Vercel (api/ticket.mjs) ──API Zoho Desk──► ticket en el departamento
```

- En el paso "Contacto" el botón dice **"Enviar"**: crea el ticket y pasa al
  paso "Resumen", que muestra el resumen con "Enviando…" y luego "Enviado". Si
  falla, avisa (con el enlace a WhatsApp) y ofrece "Modificar datos" o
  "Reintentar". Ya no se ofrece enviar por correo ni por WhatsApp.
- El ticket lleva el asunto "Solicitud de cotización — <servicio>", la tabla
  de datos (rótulos en español, contenido escapado), el correo y el teléfono, y
  el contacto (Zoho Desk lo busca por el correo o lo crea). Canal: "Web".
- Mismas protecciones que `/api/contact`: origen, límite por IP (5 cada 10
  min), campo trampa y autorización de datos verificada en el servidor.
- La función pide un token de acceso con el refresh token y lo reutiliza
  mientras no venza (una hora).
- El aviso de confirmación al cliente, si se quiere, se configura en Zoho Desk
  (respuesta automática del departamento); el sitio no envía correo.

**Credenciales (secretas):** Self Client de [api-console.zoho.com](https://api-console.zoho.com)
con el alcance `Desk.tickets.CREATE` (y `Desk.basic.READ` para que el
diagnóstico vea el departamento). Van **solo** en variables de entorno, nunca
en el código ni con prefijo `VITE_`:

| Variable | Valor |
| --- | --- |
| `ZOHO_DESK_CLIENT_ID` | Client ID del Self Client |
| `ZOHO_DESK_CLIENT_SECRET` | Client Secret del Self Client |
| `ZOHO_DESK_REFRESH_TOKEN` | Refresh token |
| `ZOHO_DESK_ORG_ID` | ID de la organización de Zoho Desk |
| `ZOHO_DESK_DEPARTMENT_ID` | Departamento que recibe los tickets |
| `ZOHO_DESK_ACCOUNTS_URL`, `ZOHO_DESK_API_URL` | Opcionales: centro de datos (por defecto `https://accounts.zoho.com` y `https://desk.zoho.com`) |

- **Producción:** Vercel → proyecto → Settings → Environment Variables
  (entorno Production; también Preview si se quiere probar ahí), y volver a
  desplegar.
- **Este equipo:** `.env.local` (Git lo ignora: regla `.env*` de `.gitignore`).
- **Diagnóstico:** `GET /api/ticket` responde si está configurado, si el
  token sirve y si ve el departamento, sin mostrar secretos.
- Sin las variables, la función responde "no configurado" (503) y el cotizador
  muestra el aviso con WhatsApp. En `pnpm dev`, `/api/ticket` se **simula**
  (`vite.config.ts`): no crea tickets.

## Configuración (área encargada de Brevo)

1. En Brevo, **verificar el dominio** transarchivos.com (DNS: SPF, DKIM y DMARC) o, al menos, el remitente que se va a usar.
2. Crear una **clave de API** (SMTP & API → API Keys).
3. En Vercel → proyecto `transarchivos` → **Settings → Environment Variables**, entorno **Production** (y Preview si se quiere probar ahí):

   | Variable | Valor | Obligatoria |
   | --- | --- | --- |
   | `BREVO_API_KEY` | La clave de API de Brevo | Sí |
   | `LEADS_TO` | Correo comercial: cotizador y motivos "Solicitar una cotización" e "Información sobre un servicio" (por defecto `mercadeo@transarchivos.com`) | No |
   | `LEADS_TO_NEWSLETTER` | Suscripciones al blog (por defecto `marketing@transarchivos.com`) | No |
   | `LEADS_TO_GENERAL` | Correo general: soporte, PQRS, datos personales, trabajar con nosotros y otros (por defecto `info@transarchivos.com`) | No |
   | `LEADS_FROM` | Remitente (por defecto `no-reply@transarchivos.com`). Debe ser distinto de los buzones que reciben: si remitente y destinatario son el mismo, el correo de la empresa lo archiva como enviado por sí mismo | No |
   | `LEADS_FROM_NAME` | Nombre del remitente (por defecto "Transarchivos") | No |
   | `EMAIL_ASSETS_URL` | Dominio de producción del que se cargan las imágenes de los correos (por defecto `https://www.transarchivos.com`) | No |

4. Volver a desplegar. Enviar una prueba desde el formulario y revisar la bandeja (y la carpeta de spam la primera vez).

**Mientras no esté `BREVO_API_KEY`**, la función responde "no configurado" y el formulario muestra un aviso con el enlace a WhatsApp. En `pnpm dev`, `/api/contact` se **simula** (`vite.config.ts`): no envía correos y muestra el contenido en la terminal.

## Pruebas
- `tests/unit/contact-api.test.ts`:
  - sin clave → 503;
  - correo o autorización inválidos → 422;
  - otro dominio → 403;
  - campo trampa → OK sin enviar;
  - armado del correo (destino, "responder a", HTML escapado);
  - falla de Brevo → 502.
- `tests/unit/ticket-api.test.ts`: sin credenciales → 503; ticket con departamento, contacto y detalle escapado; token reutilizado; correo o autorización inválidos → 422; otro dominio → 403; campo trampa; límite por IP; Zoho rechaza → 502 sin secretos.
- `tests/e2e/flows.spec.ts`: el formulario se abre desde soporte, exige la autorización y envía; el cotizador crea el ticket ("Enviando…" → "Enviado") y, si falla, permite reintentar. El envío se simula: no llega ningún correo real.
