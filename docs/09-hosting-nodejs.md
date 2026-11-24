# Publicación en GoDaddy (hosting Node.js)

El sitio se publica en el hosting Node.js de GoDaddy (host.godaddy.com →
_My Apps_), conectado a este repositorio de GitHub, como **una sola app
Node.js**. GoDaddy compila la rama elegida y arranca `server/server.mjs`, que
hace todo lo que antes hacía Vercel:

| Qué | Dónde |
| --- | --- |
| Páginas pre-generadas | `dist/` (de `pnpm build`), con URLs limpias: `/nosotros` → `nosotros.html`, `/en/about` → `en/about.html` |
| `/x/`, `/x.html` e `/index` → `/x` | `server/server.mjs` (redirección 308) |
| 404 real | `dist/404.html` con estado 404 |
| Cabeceras (CSP, HSTS, caché…) | `hosting/headers.json` (la del chat, aparte para `/chat-asesor`) |
| Redirecciones | `redirects` de `hosting/headers.json` (hoy vacío; ahí van las del sitio anterior, `docs/06-seo.md`) |
| Formularios | `/api/contact` → `api/contact.mjs` (Brevo) |
| Cotizador | `/api/ticket` → `api/ticket.mjs` (Zoho Desk) |
| Compresión | `.br`/`.gz` que deja `pnpm build` (`scripts/precompress.mjs`) |
| Video en Safari | Rangos de bytes (206) |
| `www` y https | `SITE_CANONICAL_HOST` (abajo) |

El servidor solo usa módulos de Node; las dependencias del proyecto solo se usan
para compilar. `vercel.json` se queda hasta el cambio de DNS con las mismas
cabeceras (lo verifica `tests/security/static.test.ts`); después se borra.

En local: `pnpm build && pnpm start` → http://localhost:3000 (igual que en
producción, sin redirección a `www`).

## 1. Configurar la app (una sola vez)

En host.godaddy.com → _My Apps_ → Transarchivos → _Settings_:

- **Fuente:** el repositorio de GitHub y la rama (`main`, o una rama de prueba).
- **Instalación:** `pnpm install` (o `npm install`). Debe instalar también las
  dependencias de desarrollo (no usar `--omit=dev` ni `NODE_ENV=production` en
  este paso): se usan para compilar.
- **Build:** `pnpm build` (o `npm run build`).
- **Inicio:** `pnpm start` (o `node server/server.mjs`). **Nunca `dev`**: el
  servidor de desarrollo de Vite simula los formularios, no pone las cabeceras
  y el hosting no le deja abrir su puerto.
- **Node.js:** 22 (mínimo 20.19).
- El puerto lo asigna GoDaddy en `PORT`; el servidor lo lee y escucha en `0.0.0.0`.

**Variables de entorno** (misma pantalla; nunca en el repositorio). Si el
hosting no se las entrega a la app, el servidor las lee de un archivo `.env` en
la carpeta de la app (Git lo ignora); las del panel tienen prioridad.

| Variable | Cuándo se lee | Para qué |
| --- | --- | --- |
| `VITE_GA_MEASUREMENT_ID` | **Al compilar** | Google Analytics (G-…) |
| `VITE_SITE_INDEXABLE` | **Al compilar** | `true` solo cuando el dominio apunte aquí (`docs/06-seo.md`) |
| `VITE_GOOGLE_SITE_VERIFICATION` | **Al compilar** | Opcional: Search Console |
| `BREVO_API_KEY` | Al ejecutar | Clave de Brevo (`docs/07-formularios.md`). Secreta |
| `LEADS_TO`, `LEADS_TO_GENERAL`, `LEADS_TO_NEWSLETTER`, `LEADS_FROM`, `LEADS_FROM_NAME` | Al ejecutar | Opcionales: buzones (`docs/07-formularios.md`) |
| `EMAIL_ASSETS_URL` | Al ejecutar | Opcional: por defecto `https://www.transarchivos.com` (banner de los correos) |
| `ZOHO_DESK_CLIENT_ID`, `ZOHO_DESK_CLIENT_SECRET`, `ZOHO_DESK_REFRESH_TOKEN`, `ZOHO_DESK_ORG_ID`, `ZOHO_DESK_DEPARTMENT_ID` | Al ejecutar | Credenciales del cotizador (`docs/07-formularios.md`). Secretas |
| `TRUSTED_PROXY_HOPS` | Al ejecutar | Opcional (por defecto 1, el proxy de GoDaddy; súmele 1 si hay una CDN delante). `0` si la app recibe las visitas directamente, sin proxy: entonces el límite de envíos usa la IP de la conexión y no `X-Forwarded-For`, que el visitante podría inventar |
| `SITE_CANONICAL_HOST` | Al ejecutar | `www.transarchivos.com` **solo después del cambio de DNS** (paso 6 de la sección 4) |

Las `VITE_*` se leen al compilar: después de cambiarlas, vuelva a desplegar.

**Brevo:** si la clave tiene restringidas las IP, autorice la IP de salida del
hosting (o quite la restricción).

## 2. Publicar un cambio

Cada push a la rama configurada se compila y publica en la vista previa
(dirección temporal de GoDaddy). Cuando esté bien, publíquelo desde el panel de
la app. La integración continua de GitHub (`.github/workflows/ci.yml`) corre aparte.

Si el plan no permite compilar en el servidor: ejecutar `pnpm build` en un
computador y subir `dist/`, `api/`, `server/`, `hosting/` y `package.json`; el
comando de inicio es el mismo.

## 3. Diagnóstico

- **Registros** (_Logs_ en el panel). Cada línea empieza por su área y lleva
  **✓** si se cumplió o **✗** si falló; busque "✗" para ver solo los
  problemas. Nunca incluyen datos del visitante ni claves.

  | Línea | Qué significa |
  | --- | --- |
  | `[server] ✓ Sitio en http://localhost:… (Node …)` | La app arrancó |
  | `[server] Variables leídas de .env` | Las tomó del archivo `.env` de la carpeta de la app |
  | `[server] Variables: BREVO_API_KEY ✓ · …` | Qué variables ve la app (solo el nombre) |
  | `[server] ✗ No arrancó en el puerto …` | El puerto está ocupado o no permitido |
  | `[server] ✗ Error no controlado / Promesa rechazada` | Error de código; la línea trae el detalle |
  | `[server] Deteniendo (SIGTERM)` | El hosting reinició o detuvo la app (normal al desplegar) |
  | `[api] ✓ POST /api/contact → 200 (523 ms)` | Una llamada a /api: estado y tiempo |
  | `[contact] ✓ Solicitud de contacto enviada a …` | El correo al equipo salió por Brevo |
  | `[contact] ✓ Confirmación enviada al visitante` | El correo de confirmación salió |
  | `[contact] ✗ Rechazada (origin/rate/email/consent…)` | El formulario llegó incompleto, desde otro sitio o repetido demasiadas veces |
  | `[contact] ✗ No se envió: falta la variable BREVO_API_KEY` | Falta la clave |
  | `[contact] ✗ Brevo rechazó …` / `Brevo no respondió` | Problema con Brevo (clave, IP autorizada, remitente) |
  | `[contact] ✗ Bot detectado` | Un bot llenó el campo trampa; no se envió nada |
  | `[ticket] ✓ Ticket #123 creado en Zoho Desk` | El ticket del cotizador se creó |
  | `[ticket] ✗ No se creó: faltan las variables …` | Faltan credenciales de Zoho (dice cuáles) |
  | `[ticket] ✗ Zoho Desk rechazó el ticket (HTTP …)` | Permisos, plan o token de Zoho |

- **Reiniciar:** _Reiniciar la aplicación_ en el panel.
- **¿Formularios configurados?** `/api/contact` y `/api/ticket` solo aceptan
  POST (un GET responde 405). Revise la línea `[server] Variables: …` del
  arranque y, después de un envío de prueba, las líneas `[contact]` y `[ticket]`.
- **¿Rechaza los formularios con "origin"?** El proxy debe pasar el dominio en
  `Host` o en `X-Forwarded-Host`; el registro `[contact] ✗ Rechazada (origin…)`
  muestra el origen y el sitio que vio el servidor.
- **Probar cabeceras:** `curl -I https://<dominio>/` y
  `curl -I https://<dominio>/chat-asesor`.
- **Pruebas:** `pnpm test:seo` incluye `tests/seo/server.test.ts` (URLs limpias,
  404, cabeceras, rutas con `..`, caché, compresión, rangos, dominio canónico,
  proxy y la API).
- En local (HTTP) el navegador avisa de que la página del chat no puede
  incrustarse: es la directiva `upgrade-insecure-requests`; con HTTPS en
  producción no ocurre.

## 4. Cambio de DNS (día de publicación)

Los correos de `@transarchivos.com` (mercadeo@, info@, marketing@) **no se
deben caer**:

1. Averigüe dónde está el DNS: `dig NS transarchivos.com`.
2. **Copie todos los registros actuales** (captura o exportación) antes de tocar
   nada: MX, TXT (SPF, DKIM y DMARC del correo y de Brevo, verificaciones de
   Google), CNAME.
3. Pruebe el sitio en la vista previa de GoDaddy con `SITE_CANONICAL_HOST`
   vacía: páginas, formulario de contacto, cotizador y chat.
4. Baje el TTL de `@` y `www` a 300 un día antes. Conecte el dominio desde el
   panel de la app (_Conectar un dominio_) y cambie **solo** los registros `@` y
   `www` que GoDaddy indique. **No toque MX ni TXT.**
5. Verifique el candado (https) en `@` y `www`.
6. Ponga `SITE_CANONICAL_HOST=www.transarchivos.com` en la app y reiníciela: el
   dominio sin `www` y `http` pasan a `https://www.transarchivos.com` (301).
7. En **Zoho SalesIQ** autorice `www.transarchivos.com` (`docs/08-chat-asesor.md`)
   y en **Brevo** confirme el dominio del remitente verificado.
8. Envíe una vez el formulario de contacto y el cotizador reales (mensaje
   marcado «PRUEBA técnica (ignorar)») y confirme que lleguen los correos y el
   ticket de Zoho Desk.
9. **Compruebe el límite de envíos** (`docs/11-pentest-zap.md`): el pentesting
   solo lo validó en local, y depende de que `TRUSTED_PROXY_HOPS` coincida con
   los proxies reales de GoDaddy. Desde un computador, mande 8 envíos seguidos
   con un `X-Forwarded-For` distinto cada vez; del sexto en adelante deben
   responder `429`. Si todos pasan, el valor está mal (pruebe con `0`).
   Con el formulario real, hágalo con mensajes de prueba y avise al equipo.
10. Siga la lista de `docs/06-seo.md` (indexación, Search Console).
11. Con todo funcionando: borre `vercel.json` y pause o elimine el proyecto de
    Vercel.
