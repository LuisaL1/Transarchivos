// Servidor de producción para alojamientos con Node.js (por ejemplo GoDaddy).
// Hace lo mismo que Vercel: entrega las páginas pre-generadas de dist/ con
// direcciones limpias (/nosotros), la página 404, las cabeceras de seguridad de
// vercel.json y ejecuta las funciones de api/ (formularios → Brevo).
// Sin dependencias: solo módulos de Node. Arranque: `npm start` (PORT opcional).
// Guía de instalación: docs/09-hosting-nodejs.md.
import http from "node:http";
import { createReadStream } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { promisify } from "node:util";
import zlib from "node:zlib";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, "dist");
const MAX_BODY = 1024 * 1024;
const brotli = promisify(zlib.brotliCompress);
const gzip = promisify(zlib.gzip);

const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8", ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8", ".webmanifest": "application/manifest+json; charset=utf-8", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif", ".ico": "image/x-icon",
  ".mp4": "video/mp4", ".webm": "video/webm", ".pdf": "application/pdf", ".woff": "font/woff", ".woff2": "font/woff2",
};
const COMPRESSIBLE = new Set([".html", ".css", ".js", ".mjs", ".json", ".txt", ".xml", ".webmanifest", ".svg"]);

// Cabeceras de seguridad y de caché: las mismas de vercel.json (una sola fuente de verdad).
async function loadHeaderRules() {
  const cfg = JSON.parse(await readFile(path.join(ROOT, "vercel.json"), "utf8"));
  return (cfg.headers ?? []).map(r => ({ re: new RegExp(`^${r.source}$`), headers: r.headers }));
}

const send = (res, status, body, headers = {}) => {
  res.writeHead(status, { "Content-Length": Buffer.byteLength(body), ...headers });
  res.end(body);
};

function applyHeaders(res, rules, pathname) {
  for (const r of rules) {
    if (!r.re.test(pathname)) continue;
    for (const h of r.headers) if (!res.hasHeader(h.key)) res.setHeader(h.key, h.value);
  }
}

// Convierte la petición de Node en una Request estándar y la respuesta en la de Node.
async function runApi(req, res, url, rules) {
  const name = url.pathname.slice("/api/".length);
  if (!/^[a-z0-9-]+$/i.test(name)) return notFoundJson(res, rules, url.pathname);
  const file = path.join(ROOT, "api", `${name}.mjs`);
  let mod;
  try { mod = await import(pathToFileURL(file).href); } catch { return notFoundJson(res, rules, url.pathname); }
  const handler = mod[req.method];
  if (typeof handler !== "function") {
    const allow = ["GET", "POST"].filter(m => typeof mod[m] === "function").join(", ");
    return send(res, 405, '{"ok":false,"error":"method"}', { Allow: allow, "Content-Type": "application/json" });
  }
  let body;
  if (req.method !== "GET" && req.method !== "HEAD") {
    const chunks = []; let size = 0;
    for await (const c of req) {
      size += c.length;
      if (size > MAX_BODY) return send(res, 413, '{"ok":false,"error":"size"}', { "Content-Type": "application/json" });
      chunks.push(c);
    }
    body = Buffer.concat(chunks);
  }
  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) if (v !== undefined) headers.set(k, Array.isArray(v) ? v.join(", ") : v);
  const proto = req.headers["x-forwarded-proto"] ?? "http";
  const request = new Request(`${proto}://${req.headers.host ?? "localhost"}${req.url}`, { method: req.method, headers, body });
  let response;
  try { response = await handler(request); } catch (e) {
    console.error("Error en /api/" + name + ":", e);
    return send(res, 500, '{"ok":false,"error":"server"}', { "Content-Type": "application/json" });
  }
  response.headers.forEach((v, k) => res.setHeader(k, v));
  applyHeaders(res, rules, url.pathname);
  const out = Buffer.from(await response.arrayBuffer());
  res.writeHead(response.status, { "Content-Length": out.length });
  res.end(req.method === "HEAD" ? undefined : out);
}

function notFoundJson(res, rules, pathname) {
  applyHeaders(res, rules, pathname);
  send(res, 404, '{"ok":false,"error":"not_found"}', { "Content-Type": "application/json" });
}

// Archivo que corresponde a una ruta: el exacto, "<ruta>.html" o "<ruta>/index.html".
async function resolveFile(pathname) {
  const clean = pathname === "/" ? "/index" : pathname;
  const candidates = [clean, `${clean}.html`, path.posix.join(clean, "index.html")];
  for (const c of candidates) {
    const file = path.join(DIST, c);
    if (file !== DIST && !file.startsWith(DIST + path.sep)) return null;
    try {
      const s = await stat(file);
      if (s.isFile()) return { file, size: s.size, mtime: s.mtime };
    } catch { /* siguiente candidato */ }
  }
  return null;
}

const compressed = new Map();
async function compressedBody(file, etag, enc) {
  const key = `${file}|${etag}|${enc}`;
  if (!compressed.has(key)) {
    const raw = await readFile(file);
    compressed.set(key, enc === "br" ? await brotli(raw) : await gzip(raw));
  }
  return compressed.get(key);
}

async function serveStatic(req, res, url, rules) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    return send(res, 405, "Método no permitido", { Allow: "GET, HEAD", "Content-Type": "text/plain; charset=utf-8" });
  }
  let pathname;
  try { pathname = decodeURIComponent(url.pathname); } catch { return send(res, 400, "Solicitud no válida"); }
  if (pathname.includes("\0")) return send(res, 400, "Solicitud no válida");
  pathname = path.posix.normalize(pathname);

  // Direcciones limpias (cleanUrls y trailingSlash: false de vercel.json).
  let clean = pathname;
  if (clean.length > 1) {
    if (clean.endsWith(".html")) clean = clean.slice(0, -5);
    let end = clean.length;
    while (end > 0 && clean.charCodeAt(end - 1) === 47) end--;
    clean = clean.slice(0, end);
  }
  if (clean === "/index" || clean === "") clean = "/";
  if (clean !== pathname) {
    res.writeHead(308, { Location: clean + url.search });
    return res.end();
  }

  const found = await resolveFile(pathname);
  const ext = found ? path.extname(found.file).toLowerCase() : ".html";
  applyHeaders(res, rules, pathname);

  if (!found) {
    let page; try { page = await readFile(path.join(DIST, "404.html")); } catch { page = Buffer.from("No encontramos esta página"); }
    res.setHeader("Content-Type", TYPES[".html"]);
    res.setHeader("Cache-Control", "no-store");
    res.writeHead(404, { "Content-Length": page.length });
    return res.end(req.method === "HEAD" ? undefined : page);
  }

  const etag = `W/"${found.size.toString(16)}-${Math.floor(found.mtime.getTime()).toString(16)}"`;
  res.setHeader("Content-Type", TYPES[ext] ?? "application/octet-stream");
  res.setHeader("Last-Modified", found.mtime.toUTCString());
  res.setHeader("ETag", etag);
  res.setHeader("Accept-Ranges", "bytes");
  if (!res.hasHeader("Cache-Control")) res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
  if (req.headers["if-none-match"] === etag) { res.writeHead(304); return res.end(); }

  // Rangos: Safari los exige para reproducir video.
  const range = req.headers.range;
  if (range) {
    const m = /^bytes=(\d*)-(\d*)$/.exec(range);
    let start = m && m[1] !== "" ? Number(m[1]) : Number.NaN;
    let end = m && m[2] !== "" ? Number(m[2]) : Number.NaN;
    if (m && Number.isNaN(start) && !Number.isNaN(end)) { start = Math.max(found.size - end, 0); end = found.size - 1; }
    if (m && !Number.isNaN(start) && Number.isNaN(end)) end = found.size - 1;
    if (!m || Number.isNaN(start) || start > end || start >= found.size) {
      res.writeHead(416, { "Content-Range": `bytes */${found.size}` });
      return res.end();
    }
    end = Math.min(end, found.size - 1);
    res.writeHead(206, { "Content-Range": `bytes ${start}-${end}/${found.size}`, "Content-Length": end - start + 1 });
    if (req.method === "HEAD") return res.end();
    return createReadStream(found.file, { start, end }).pipe(res);
  }

  const accept = String(req.headers["accept-encoding"] ?? "");
  const enc = COMPRESSIBLE.has(ext) && found.size > 1024 ? (/\bbr\b/.test(accept) ? "br" : /\bgzip\b/.test(accept) ? "gzip" : null) : null;
  if (COMPRESSIBLE.has(ext)) res.setHeader("Vary", "Accept-Encoding");
  if (enc) {
    const body = await compressedBody(found.file, etag, enc);
    res.writeHead(200, { "Content-Encoding": enc, "Content-Length": body.length });
    return res.end(req.method === "HEAD" ? undefined : body);
  }
  res.writeHead(200, { "Content-Length": found.size });
  if (req.method === "HEAD") return res.end();
  createReadStream(found.file).pipe(res);
}

export async function createServer() {
  const rules = await loadHeaderRules();
  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url ?? "/", "http://localhost");
      if (url.pathname.startsWith("/api/")) return await runApi(req, res, url, rules);
      return await serveStatic(req, res, url, rules);
    } catch (e) {
      console.error("Error del servidor:", e);
      if (!res.headersSent) send(res, 500, "Error del servidor", { "Content-Type": "text/plain; charset=utf-8" });
      else res.end();
    }
  });
  server.keepAliveTimeout = 65_000;
  return server;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT) || 3000;
  const server = await createServer();
  server.listen(port, process.env.HOST || "0.0.0.0", () => console.log(`Transarchivos escuchando en el puerto ${port}`));
  for (const sig of ["SIGTERM", "SIGINT"]) process.on(sig, () => server.close(() => process.exit(0)));
}
