# Publicación en un hosting con Node.js (GoDaddy)

El sitio se publica hoy en Vercel (`vercel.json` + carpeta `api/`). Para un
alojamiento con **Node.js** conectado a GitHub, el proyecto trae `server.mjs`:
un servidor sin dependencias que hace lo mismo que Vercel.

| Qué hace | Cómo |
| --- | --- |
| Entrega las páginas pre-generadas de `dist/` | Direcciones limpias (`/nosotros`, `/en/about`); `/x.html`, la barra final e `/index` redirigen (308) |
| Página de error | Responde 404 con `dist/404.html` |
| Cabeceras de seguridad y de caché | Las lee de `vercel.json` (una sola fuente de verdad): CSP, HSTS, `X-Frame-Options`… y un año de caché para `/assets/` |
| Caché de fotos y video | Un día (con revalidación en segundo plano) para `hero-fotos/`, `videos/` y `brand/`, que conservan su nombre al reemplazarse; un año para `assets/` (nombre con huella); las páginas siempre se revalidan |
| Compresión y video | Brotli o gzip para texto; rangos de bytes (Safari los exige para reproducir video) |
| Formularios y cotizador | Ejecuta `api/<nombre>.mjs` en `/api/<nombre>` (hoy `api/contact.mjs` → Brevo y `api/ticket.mjs` → Zoho Desk), con el mismo código que en Vercel |

Vercel sigue funcionando igual: `server.mjs` no lo toca.

## Pasos (conexión con GitHub)

1. **Conectar el repositorio** (rama `main`) en el panel del hosting.
2. **Versión de Node:** 22 (mínimo 20.19).
3. **Comando de compilación:** `npm install && npm run build`. Debe instalar
   también las dependencias de desarrollo (no usar `--omit=dev` ni
   `NODE_ENV=production` en este paso). Si el panel lo permite:
   `corepack enable && pnpm install --frozen-lockfile && pnpm build`.
4. **Comando de inicio:** `npm start` (es `node server.mjs`). El hosting define
   el puerto con la variable `PORT`.
5. **Variables de entorno** (copiar de `.env.example`):

   | Variable | Cuándo se lee | Valor |
   | --- | --- | --- |
   | `BREVO_API_KEY` | Al ejecutar (servidor) | La clave de envío de Brevo |
   | `LEADS_TO`, `LEADS_TO_GENERAL`, `LEADS_TO_NEWSLETTER`, `LEADS_FROM`, `LEADS_FROM_NAME` | Al ejecutar | Buzones (ver `docs/07-formularios.md`) |
   | `ZOHO_DESK_CLIENT_ID`, `ZOHO_DESK_CLIENT_SECRET`, `ZOHO_DESK_REFRESH_TOKEN`, `ZOHO_DESK_ORG_ID`, `ZOHO_DESK_DEPARTMENT_ID` | Al ejecutar (servidor) | Credenciales de Zoho Desk con las que el cotizador crea el ticket (`docs/07-formularios.md`). Sin ellas el cotizador avisa y ofrece WhatsApp |
   | `TRUSTED_PROXY_HOPS` | Al ejecutar | Opcional (por defecto 1): cuántos proxies de confianza hay delante del sitio (el del hosting, más una CDN si la hay). Sirve para identificar al visitante en el límite de envíos por IP a partir de `X-Forwarded-For` |
   | `EMAIL_ASSETS_URL` | Al ejecutar | Opcional: por defecto `https://www.transarchivos.com` (de ahí se descarga el banner de los correos) |
   | `VITE_GA_MEASUREMENT_ID` | **Al compilar** | Identificador de Google Analytics (G-…) |
   | `VITE_SITE_INDEXABLE` | **Al compilar** | `true` para que Google indexe el sitio; sin ella lleva `noindex` |
   | `VITE_GOOGLE_SITE_VERIFICATION` | **Al compilar** | Código de Search Console (opcional) |

   Las `VITE_*` se incorporan al compilar: deben existir **antes** del paso 3 y
   un cambio exige volver a desplegar.
6. **Dominio y HTTPS** en GoDaddy. El servidor atiende HTTP y confía en el proxy
   del hosting para el HTTPS (usa `X-Forwarded-Proto`); el sitio ya envía HSTS.
7. En **Zoho SalesIQ** autorizar `www.transarchivos.com` (`docs/08-chat-asesor.md`)
   y en **Brevo** tener verificado el dominio del remitente.

Si el plan no permite compilar en el servidor: ejecutar `pnpm build` en un
computador y subir `dist/`, `api/`, `server.mjs`, `vercel.json` y
`package.json`; el comando de inicio es el mismo.

## Cómo comprobar

- `pnpm build && pnpm start` y abrir http://localhost:3000 (`PORT=4000 pnpm start`
  para otro puerto).
- `pnpm test:seo` incluye `tests/seo/server.test.ts`: direcciones limpias, 404,
  cabeceras, rutas con `..`, caché, compresión, rangos y la API.
- En producción: `GET /api/contact` responde `{"configured":true,…}` cuando la
  clave de Brevo está bien puesta; enviar el formulario con un mensaje marcado
  «PRUEBA técnica (ignorar)».
- En local (HTTP) el navegador avisa de que la página del chat no puede
  incrustarse: es la directiva `upgrade-insecure-requests`; con HTTPS en
  producción no ocurre.
