// Servidor del sitio en GoDaddy (hosting Node.js; arranca con `pnpm start`).
// Hace lo que antes hacía Vercel, solo con módulos de Node (sin dependencias):
//  · /api/contact y /api/ticket → las funciones de api/ (Request → Response).
//  · Lo demás → los archivos de dist/ con URLs limpias: /nosotros sirve
//    nosotros.html, /x/, /x.html e /index redirigen (308) y lo que no existe
//    responde 404.html con estado 404 (equivale a cleanUrls + trailingSlash: false).
//  · Cabeceras y redirecciones de hosting/headers.json (CSP, HSTS, caché…).
//  · Entrega la versión .br o .gz que deja `pnpm build` (scripts/precompress.mjs)
//    y atiende rangos de bytes (Safari los exige para reproducir video).
//
// Variables de entorno (GoDaddy → My Apps → Transarchivos → Settings, o un .env
// en la carpeta de la app):
//   las de api/ (BREVO_API_KEY, LEADS_*, ZOHO_DESK_*) y
//   SITE_CANONICAL_HOST  p. ej. www.transarchivos.com: redirige el dominio sin www
//                        y http → https. Vacía (URL temporal, local), no redirige.
//   TRUSTED_PROXY_HOPS   proxies delante de la app (por defecto 1, el del hosting).
//                        0 = sin proxy: se usa la IP de la conexión, no X-Forwarded-For.
//   SITE_DIST            carpeta del build (por defecto dist)
// Local: `pnpm build && pnpm start`. Documentación: docs/09-hosting-nodejs.md.
import http from "node:http";
import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import * as contact from "../api/contact.mjs";
import * as ticket from "../api/ticket.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const API = { "/api/contact": contact, "/api/ticket": ticket };
/** Cabeceras de la conexión con Node que no pasan a la función */
const HOP = new Set(["connection", "keep-alive", "transfer-encoding", "upgrade", "content-length"]);
/** Tamaño máximo del cuerpo de un formulario */
export const MAX_BODY = 64 * 1024;

const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8", ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8", ".webmanifest": "application/manifest+json; charset=utf-8", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".avif": "image/avif", ".gif": "image/gif",
  ".ico": "image/x-icon", ".mp4": "video/mp4", ".webm": "video/webm", ".pdf": "application/pdf", ".woff": "font/woff", ".woff2": "font/woff2",
};
const COMPRESSIBLE = new Set([".html", ".css", ".js", ".mjs", ".json", ".txt", ".xml", ".webmanifest", ".svg"]);

/** source de hosting/headers.json (formato de vercel.json) → expresión regular */
export function sourceRegex(source) {
  const re = source
    .replace(/:(\w+)\*/g, "(?<$1>.*)")
    .replace(/:(\w+)\(/g, "(?<$1>")
    .replace(/:(\w+)/g, "(?<$1>[^/]+)");
  return new RegExp(`^${re}$`);
}

/** Dominio con el que llegó la petición (el proxy del hosting lo pasa en X-Forwarded-Host) */
const hostOf = (req) => String(req.headers["x-forwarded-host"] ?? req.headers.host ?? "localhost").split(",")[0].trim();

/** Crea el manejador de peticiones (las pruebas lo usan con otras opciones) */
export function createHandler({
  root = path.resolve(ROOT, process.env.SITE_DIST || "dist"),
  config = JSON.parse(readFileSync(path.join(ROOT, "hosting", "headers.json"), "utf8")),
  canonicalHost = (process.env.SITE_CANONICAL_HOST ?? "").trim(),
} = {}) {
  root = path.resolve(root);
  const redirects = (config.redirects ?? []).map(r => ({ ...r, re: sourceRegex(r.source) }));
  const rules = (config.headers ?? []).map(h => ({ re: sourceRegex(h.source), headers: h.headers }));
  /** Cabeceras de hosting/headers.json para la ruta (las últimas reglas mandan) */
  const headersFor = (pathname) => {
    const out = {};
    for (const r of rules) if (r.re.test(pathname)) for (const h of r.headers) out[h.key] = h.value;
    return out;
  };

  return async function handler(req, res) {
    try {
      const host = hostOf(req);
      let url, pathname;
      try {
        url = new URL(req.url ?? "/", "http://localhost");
        pathname = decodeURIComponent(url.pathname);
      } catch {
        return send(res, 400, { "Content-Type": "text/plain; charset=utf-8" }, "Solicitud no válida");
      }
      if (pathname.includes("\0")) return send(res, 400, { "Content-Type": "text/plain; charset=utf-8" }, "Solicitud no válida");
      const base = headersFor(url.pathname);

      // 1) Dominio canónico y https (solo si SITE_CANONICAL_HOST está configurada)
      if (canonicalHost) {
        const proto = String(req.headers["x-forwarded-proto"] ?? "").split(",")[0].trim();
        if (host !== canonicalHost || proto === "http")
          return redirect(res, 301, `https://${canonicalHost}${url.pathname}${url.search}`, base);
      }

      // 2) Redirecciones de hosting/headers.json
      for (const r of redirects)
        if (r.re.test(url.pathname)) return redirect(res, r.permanent ? 308 : 307, r.destination, base);

      // 3) Funciones de api/
      if (url.pathname === "/api" || url.pathname.startsWith("/api/")) {
        const t0 = Date.now();
        res.on("finish", () => logApi(req.method, url.pathname, res.statusCode, Date.now() - t0));
        const mod = API[url.pathname];
        if (!mod) return sendJson(res, 404, { ok: false, error: "not_found" }, base);
        const fn = req.method === "HEAD" ? mod.GET : mod[req.method ?? "GET"];
        if (typeof fn !== "function") {
          const allow = ["GET", "POST"].filter(m => typeof mod[m] === "function").join(", ");
          return sendJson(res, 405, { ok: false, error: "method" }, { ...base, Allow: allow });
        }
        return await runApi(req, res, fn, `http://${host}${url.pathname}${url.search}`, base);
      }

      // 4) Archivos de dist/
      return await serveStatic(req, res, root, pathname, url.search, base, headersFor);
    } catch (e) {
      console.error("[server] ✗ Error del servidor:", e);
      if (!res.headersSent) send(res, 500, { "Content-Type": "text/plain; charset=utf-8" }, "Error del servidor");
      else res.end();
    }
  };
}

/** Una línea por llamada a /api: ✓ si respondió bien, ✗ si no (con el estado y el tiempo) */
function logApi(method, pathname, status, ms) {
  const line = `[api] ${status < 400 ? "✓" : "✗"} ${method} ${pathname} → ${status} (${ms} ms)`;
  if (status >= 500) console.error(line);
  else if (status >= 400) console.warn(line);
  else console.log(line);
}

/** Petición de Node → Request web → función de api/ → respuesta de Node */
async function runApi(req, res, fn, url, base) {
  let body;
  if (req.method !== "GET" && req.method !== "HEAD") {
    try {
      body = await readBody(req);
    } catch {
      return sendJson(res, 413, { ok: false, error: "size" }, base);
    }
  }
  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers))
    if (v !== undefined && !HOP.has(k)) headers.set(k, Array.isArray(v) ? v.join(", ") : v);
  // IP del visitante para el límite de envíos (api/_seguridad.mjs → clientIp). Sin
  // proxy delante (TRUSTED_PROXY_HOPS=0) X-Forwarded-For lo escribe el visitante:
  // se reemplaza por la IP real de la conexión.
  const ip = req.socket.remoteAddress;
  if (ip && (process.env.TRUSTED_PROXY_HOPS?.trim() === "0" || !headers.has("x-forwarded-for"))) headers.set("x-forwarded-for", ip);
  let out;
  try {
    out = await fn(new Request(url, { method: req.method, headers, body }));
  } catch (e) {
    console.error(`[server] ✗ Error en ${new URL(url).pathname}:`, e);
    return sendJson(res, 500, { ok: false, error: "server" }, base);
  }
  const buf = Buffer.from(await out.arrayBuffer());
  const h = { ...base };
  out.headers.forEach((v, k) => (h[k] = v));
  h["Content-Length"] = String(buf.length);
  res.writeHead(out.status, h);
  res.end(req.method === "HEAD" ? undefined : buf);
}

function readBody(req) {
  return new Promise((ok, fail) => {
    const chunks = [];
    let size = 0;
    // Si es demasiado grande se sigue leyendo (sin guardar) para poder responder 413
    req.on("data", c => {
      size += c.length;
      if (size <= MAX_BODY) chunks.push(c);
    });
    req.on("end", () => (size > MAX_BODY ? fail(new Error("size")) : ok(Buffer.concat(chunks))));
    req.on("error", fail);
  });
}

async function serveStatic(req, res, root, pathname, search, base, headersFor) {
  if (req.method !== "GET" && req.method !== "HEAD")
    return send(res, 405, { ...base, Allow: "GET, HEAD", "Content-Type": "text/plain; charset=utf-8" }, "Método no permitido");

  // Direcciones limpias (cleanUrls y trailingSlash: false de vercel.json).
  pathname = path.posix.normalize(pathname);
  let clean = pathname;
  if (clean.length > 1) {
    if (clean.endsWith(".html")) clean = clean.slice(0, -5);
    let end = clean.length;
    while (end > 0 && clean.charCodeAt(end - 1) === 47) end--;
    clean = clean.slice(0, end);
  }
  if (clean === "/index" || clean === "") clean = "/";
  if (clean !== pathname) return redirect(res, 308, encodeURI(clean) + search, base);

  const file = lookup(root, pathname);
  if (file) return serveFile(req, res, file, 200, base);
  const notFound = path.join(root, "404.html");
  if (existsSync(notFound)) return serveFile(req, res, notFound, 404, { ...headersFor("/404"), "Cache-Control": "no-store" });
  return send(res, 404, { "Content-Type": "text/plain; charset=utf-8" }, "No encontramos esta página");
}

/** Archivo de dist/ para la ruta: el exacto, "<ruta>.html" o "<ruta>/index.html" (o null). Nunca sale de root. */
function lookup(root, pathname) {
  // Las versiones comprimidas y los archivos ocultos no se piden directamente
  if (/\.(br|gz)$/.test(pathname) || /(^|\/)\./.test(pathname)) return null;
  const clean = pathname === "/" ? "/index" : pathname;
  for (const c of [clean, `${clean}.html`, path.posix.join(clean, "index.html")]) {
    const f = path.resolve(root, `.${c}`);
    if (!f.startsWith(root + path.sep)) return null;
    try {
      if (statSync(f).isFile()) return f;
    } catch { /* siguiente candidato */ }
  }
  return null;
}

function serveFile(req, res, file, status, base) {
  const ext = path.extname(file).toLowerCase();
  const headers = {
    "Content-Type": TYPES[ext] ?? "application/octet-stream",
    // Por defecto (HTML incluido) se revalida siempre; /assets/ (con hash) trae
    // su caché inmutable de hosting/headers.json
    "Cache-Control": "public, max-age=0, must-revalidate",
    "Accept-Ranges": "bytes",
    ...base,
  };
  const st = statSync(file);
  const etag = `W/"${st.size.toString(16)}-${Math.floor(st.mtimeMs).toString(16)}"`;
  headers.ETag = etag;
  headers["Last-Modified"] = st.mtime.toUTCString();
  if (status === 200 && req.headers["if-none-match"] === etag) return send(res, 304, headers, "");

  // Rangos: Safari los exige para reproducir video (siempre sobre el archivo sin comprimir).
  const range = req.headers.range;
  if (status === 200 && range) {
    const m = /^bytes=(\d*)-(\d*)$/.exec(range);
    let start = m && m[1] !== "" ? Number(m[1]) : Number.NaN;
    let end = m && m[2] !== "" ? Number(m[2]) : Number.NaN;
    if (m && Number.isNaN(start) && !Number.isNaN(end)) { start = Math.max(st.size - end, 0); end = st.size - 1; }
    if (m && !Number.isNaN(start) && Number.isNaN(end)) end = st.size - 1;
    if (!m || Number.isNaN(start) || start > end || start >= st.size)
      return send(res, 416, { ...headers, "Content-Range": `bytes */${st.size}` }, "");
    end = Math.min(end, st.size - 1);
    res.writeHead(206, { ...headers, "Content-Range": `bytes ${start}-${end}/${st.size}`, "Content-Length": String(end - start + 1) });
    return req.method === "HEAD" ? res.end() : pipe(createReadStream(file, { start, end }), res, file);
  }

  // Versión ya comprimida en el build, si el navegador la acepta
  let served = file;
  let size = st.size;
  if (COMPRESSIBLE.has(ext)) {
    headers.Vary = "Accept-Encoding";
    const accept = String(req.headers["accept-encoding"] ?? "");
    for (const [enc, re, suffix] of [["br", /\bbr\b/, ".br"], ["gzip", /\bgzip\b/, ".gz"]]) {
      if (re.test(accept) && existsSync(file + suffix)) {
        served = file + suffix;
        size = statSync(served).size;
        headers["Content-Encoding"] = enc;
        break;
      }
    }
  }
  res.writeHead(status, { ...headers, "Content-Length": String(size) });
  return req.method === "HEAD" ? res.end() : pipe(createReadStream(served), res, served);
}

function pipe(stream, res, file) {
  stream.on("error", e => {
    console.error(`[server] ✗ No se pudo leer ${file}:`, e.message);
    res.destroy();
  }).pipe(res);
}

function send(res, status, headers, body) {
  res.writeHead(status, { ...headers, "Content-Length": String(Buffer.byteLength(body)) });
  res.end(body);
}
function sendJson(res, status, data, base) {
  send(res, status, { ...base, "Content-Type": "application/json", "Cache-Control": "no-store" }, JSON.stringify(data));
}
function redirect(res, status, location, base) {
  send(res, status, { ...base, Location: location }, "");
}

/** Arranca el servidor en el puerto que asigna el hosting (PORT) */
export function start(port = Number(process.env.PORT) || 3000) {
  // Si el hosting no entrega las variables a la app, se leen de un archivo .env
  // en la carpeta de la app (nunca en el repositorio: .gitignore lo excluye).
  // Las que ya vienen del entorno tienen prioridad.
  const envFile = path.join(ROOT, ".env");
  if (existsSync(envFile)) {
    process.loadEnvFile(envFile);
    console.log("[server] Variables leídas de .env");
  }
  const server = http.createServer(createHandler());
  server.keepAliveTimeout = 65_000;
  // Errores que de otro modo tumbarían la app sin dejar rastro
  process.on("uncaughtException", e => console.error("[server] ✗ Error no controlado:", e));
  process.on("unhandledRejection", e => console.error("[server] ✗ Promesa rechazada:", e));
  for (const sig of ["SIGTERM", "SIGINT"])
    process.once(sig, () => {
      console.log(`[server] Deteniendo (${sig})`);
      server.close(() => process.exit(0));
      setTimeout(() => process.exit(0), 5000).unref();
    });
  server.on("error", e => {
    console.error(`[server] ✗ No arrancó en el puerto ${port}:`, e.message);
    process.exit(1);
  });
  // 0.0.0.0: el hosting llega a la app desde fuera del contenedor
  server.listen(port, process.env.HOST || "0.0.0.0", () => {
    console.log(`[server] ✓ Sitio en http://localhost:${port} (Node ${process.version})`);
    // Qué variables de los formularios ve la app (solo el nombre, nunca el valor)
    const vars = ["BREVO_API_KEY", "ZOHO_DESK_CLIENT_ID", "ZOHO_DESK_CLIENT_SECRET", "ZOHO_DESK_REFRESH_TOKEN", "ZOHO_DESK_ORG_ID", "ZOHO_DESK_DEPARTMENT_ID"];
    const has = k => Boolean((process.env[k] ?? "").trim());
    console.log(`[server] Variables: ${vars.map(k => `${k} ${has(k) ? "✓" : "✗"}`).join(" · ")}`);
  });
  return server;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) start();
