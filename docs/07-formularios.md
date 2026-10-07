# 7 · Formularios y envío de solicitudes (Brevo)

Todo contacto por correo del sitio pasa por formularios propios. Ningún enlace
abre el programa de correo del visitante.

| Formulario | Dónde | Qué envía |
| --- | --- | --- |
| **Formulario de contacto** (`ContactModal`) | Tarjeta de soporte, pie de página, preguntas frecuentes, menú de celular, chat de Joel, política de privacidad | Nombre, empresa, correo, teléfono, motivo, mensaje y autorización de datos |
| **Cotizador** (`QuoteSimulator`) | Sección `#cotizador` | Servicio, respuestas, datos de contacto, siguiente paso sugerido y autorización |

- Cualquier enlace a `#contacto` abre el formulario. Con `contactHref({ motivo, mensaje, nombre, empresa })` (`src/data/contact.ts`) se abre con datos precargados. Así lo hace Joel al terminar una cotización en el chat.
- Ambos formularios exigen la **autorización de tratamiento de datos** (Ley 1581 de 2012). El servidor la vuelve a verificar.

## Cómo viaja la información

```
Navegador ──POST /api/contact──► Función de Vercel (api/contact.ts) ──API Brevo──► mercadeo@transarchivos.com
```

- La función valida los datos, aplica el **campo trampa** contra bots (`website`) y rechaza envíos desde otros dominios.
- Escapa el contenido antes de armar el correo y lo envía con **Brevo** (API transaccional).
- El correo llega con **"Responder a" = el visitante**, así que basta con responderlo.
- **Diseño de los correos:** banner en imagen (`public/brand/email-header.png`: azul, logo blanco y detalle de esquina) para que el modo oscuro de Gmail no altere los colores; cuerpo en tablas. El banner se carga desde el dominio que recibió la solicitud.
- **Confirmación automática:** el visitante recibe "Recibimos su solicitud · Transarchivos" (con su nombre, el motivo o servicio, WhatsApp y teléfonos). Si responde, la respuesta llega a mercadeo@transarchivos.com. Si esta confirmación falla, la solicitud igual se da por enviada.
- La clave de Brevo solo existe en el servidor: nunca llega al navegador.
- El sitio no guarda copia de los datos.

## Configuración (área encargada de Brevo)

1. En Brevo, **verificar el dominio** transarchivos.com (DNS: SPF, DKIM y DMARC) o, al menos, el remitente que se va a usar.
2. Crear una **clave de API** (SMTP & API → API Keys).
3. En Vercel → proyecto `transarchivos` → **Settings → Environment Variables**, entorno **Production** (y Preview si se quiere probar ahí):

   | Variable | Valor | Obligatoria |
   | --- | --- | --- |
   | `BREVO_API_KEY` | La clave de API de Brevo | Sí |
   | `LEADS_TO` | Correo que recibe las solicitudes (por defecto `mercadeo@transarchivos.com`) | No |
   | `LEADS_FROM` | Remitente verificado en Brevo (por defecto `no-reply@transarchivos.com`) | No |
   | `LEADS_FROM_NAME` | Nombre del remitente (por defecto "Transarchivos") | No |

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
- `tests/e2e/flows.spec.ts`: el formulario se abre desde soporte, exige la autorización y envía; el cotizador envía directo. El envío se simula: no llega ningún correo real.
