import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { readdirSync } from "node:fs";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { PUBLIC_ROUTES } from "@/seo/meta";
import { createHandler, sourceRegex, start } from "../../server/server.mjs";
import { resetRateLimit } from "../../api/contact.mjs";

// Servidor de producción en GoDaddy (server/server.mjs): debe responder como lo
// hacía Vercel. Corre sobre dist/ (después de `pnpm build`).
let server: Server;
let base = "";
const listen = async (handler: ReturnType<typeof createHandler>) => {
  const s = createServer(handler);
  await new Promise<void>(r => s.listen(0, "127.0.0.1", r));
  return [s, `http://127.0.0.1:${(s.address() as AddressInfo).port}`] as const;
};

beforeAll(async () => { [server, base] = await listen(createHandler({ canonicalHost: "" })); });
afterAll(() => new Promise<void>(r => server.close(() => r())));
afterEach(() => { vi.unstubAllEnvs(); resetRateLimit(); });

const get = (p: string, init: RequestInit = {}, at = base) => fetch(at + p, { redirect: "manual", ...init });

describe("server/server.mjs", () => {
  it("entrega todas las rutas públicas con direcciones limpias", async () => {
    for (const r of PUBLIC_ROUTES) {
      const res = await get(r);
      expect(res.status, r).toBe(200);
      expect(res.headers.get("content-type"), r).toContain("text/html");
    }
  });

  it("aplica las cabeceras de seguridad de hosting/headers.json", async () => {
    const h = (await get("/")).headers;
    expect(h.get("content-security-policy")).toContain("default-src 'self'");
    expect(h.get("strict-transport-security")).toContain("max-age=");
    expect(h.get("x-frame-options")).toBe("DENY");
    expect(h.get("x-content-type-options")).toBe("nosniff");
  });

  it("la página aislada del chat se puede incrustar en el sitio", async () => {
    const res = await get("/chat-asesor");
    expect(res.status).toBe(200);
    expect(res.headers.get("x-frame-options")).toBe("SAMEORIGIN");
  });

  it("redirige .html, barra final e /index a la dirección limpia", async () => {
    for (const [from, to] of [["/nosotros.html", "/nosotros"], ["/nosotros/", "/nosotros"], ["/index.html", "/"], ["/en/about.html", "/en/about"]]) {
      const res = await get(from);
      expect(res.status, from).toBe(308);
      expect(new URL(res.headers.get("location") ?? "", base).pathname, from).toBe(to);
    }
  });

  it("una ruta inexistente responde 404 con la página de error", async () => {
    const res = await get("/no-existe");
    expect(res.status).toBe(404);
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(await res.text()).toContain("No encontramos esta página");
  });

  it("no sale de dist/ con rutas con .. ni entrega archivos ocultos o comprimidos sueltos", async () => {
    for (const p of ["/%2e%2e/package.json", "/..%2fpackage.json", "/assets/%2e%2e/%2e%2e/package.json", "/%00", "/%E0%A4%A", "/.env", "/index.html.br"]) {
      const res = await get(p);
      expect([400, 404], p).toContain(res.status);
    }
  });

  it("los archivos de assets/ se guardan un año", async () => {
    const js = readdirSync("dist/assets").find(f => f.endsWith(".js"));
    const res = await get(`/assets/${js}`);
    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toContain("immutable");
  });

  it("fotos, videos y marca se guardan un día (no cambian de nombre al reemplazarse)", async () => {
    for (const p of ["/hero-fotos/01.webp", "/videos/page-hero.webp", "/brand/email-header.png"]) {
      expect((await get(p)).headers.get("cache-control"), p).toBe("public, max-age=86400, stale-while-revalidate=604800");
    }
    expect((await get("/")).headers.get("cache-control")).toContain("must-revalidate");
  });

  it("entrega la versión .br o .gz del build y atiende rangos (video en Safari)", async () => {
    for (const enc of ["br", "gzip"]) {
      const res = await get("/", { headers: { "accept-encoding": enc } });
      expect(res.headers.get("content-encoding"), enc).toBe(enc);
      expect(res.headers.get("vary")).toBe("Accept-Encoding");
      expect(await res.text(), enc).toContain("<html");
    }
    expect((await get("/", { headers: { "accept-encoding": "identity" } })).headers.get("content-encoding")).toBeNull();
    const part = await get("/hero-fotos/01.webp", { headers: { range: "bytes=0-99" } });
    expect(part.status).toBe(206);
    expect(part.headers.get("content-range")).toMatch(/^bytes 0-99\//);
    expect((await part.arrayBuffer()).byteLength).toBe(100);
    expect((await get("/hero-fotos/01.webp", { headers: { range: "bytes=999999999-" } })).status).toBe(416);
  });

  it("revalida con ETag (304)", async () => {
    const etag = (await get("/nosotros")).headers.get("etag") ?? "";
    expect((await get("/nosotros", { headers: { "if-none-match": etag } })).status).toBe(304);
  });

  it("solo acepta GET y HEAD en las páginas", async () => {
    expect((await get("/", { method: "PUT" })).status).toBe(405);
    expect((await get("/", { method: "HEAD" })).status).toBe(200);
  });

  it("ejecuta las funciones de api/ y rechaza lo que no existe", async () => {
    const bad = await get("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: "no es json" });
    expect(bad.status).toBe(400);
    expect(await bad.json()).toMatchObject({ ok: false, error: "json" });
    expect((await get("/api/no-existe")).status).toBe(404);
    expect((await get("/api/_seguridad")).status).toBe(404);
    expect((await get("/api/..%2fserver", { method: "POST" })).status).toBe(404);
    for (const [ruta, method] of [["/api/contact", "PUT"], ["/api/contact", "GET"], ["/api/ticket", "GET"], ["/api/ticket", "HEAD"]]) {
      const res = await get(ruta, { method });
      expect(res.status, `${method} ${ruta}`).toBe(405);
      expect(res.headers.get("allow"), `${method} ${ruta}`).toBe("POST");
    }
    expect((await get("/api/contact", { method: "POST", body: "x".repeat(70 * 1024) })).status).toBe(413);
  });

  it("detrás del proxy compara el Origin con X-Forwarded-Host", async () => {
    const post = (origin: string) => get("/api/contact", { method: "POST", headers: { origin, "x-forwarded-host": "www.transarchivos.com" }, body: "no es json" });
    expect((await post("https://www.transarchivos.com")).status).toBe(400);
    expect((await post("https://otro-sitio.com")).status).toBe(403);
  });

  it("con TRUSTED_PROXY_HOPS=0 el límite de envíos usa la IP de la conexión, no X-Forwarded-For", async () => {
    vi.stubEnv("TRUSTED_PROXY_HOPS", "0");
    const estados: number[] = [];
    for (let i = 0; i < 7; i++)
      estados.push((await get("/api/contact", { method: "POST", headers: { "x-forwarded-for": `198.51.100.${i}` }, body: "no es json" })).status);
    expect(estados.slice(0, 5)).toEqual([400, 400, 400, 400, 400]);
    expect(estados.slice(5)).toEqual([429, 429]);
  });

  it("con SITE_CANONICAL_HOST redirige el dominio sin www y http a https://www", async () => {
    const [s, at] = await listen(createHandler({ canonicalHost: "www.transarchivos.com" }));
    try {
      const sinWww = await get("/nosotros?x=1", { headers: { "x-forwarded-host": "transarchivos.com", "x-forwarded-proto": "https" } }, at);
      expect(sinWww.status).toBe(301);
      expect(sinWww.headers.get("location")).toBe("https://www.transarchivos.com/nosotros?x=1");
      const http = await get("/", { headers: { "x-forwarded-host": "www.transarchivos.com", "x-forwarded-proto": "http" } }, at);
      expect(http.headers.get("location")).toBe("https://www.transarchivos.com/");
      expect((await get("/", { headers: { "x-forwarded-host": "www.transarchivos.com", "x-forwarded-proto": "https" } }, at)).status).toBe(200);
    } finally {
      await new Promise<void>(r => s.close(() => r()));
    }
  });

  it("aplica las redirecciones de hosting/headers.json", async () => {
    const [s, at] = await listen(createHandler({ canonicalHost: "", config: { headers: [], redirects: [{ source: "/:lang(fr|de)/:path*", destination: "/en", permanent: false }] } }));
    try {
      const res = await get("/fr/algo", {}, at);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toBe("/en");
    } finally {
      await new Promise<void>(r => s.close(() => r()));
    }
  });

  it("traduce el formato de vercel.json a expresiones regulares", () => {
    expect(sourceRegex("/assets/(.*)").test("/assets/a.js")).toBe(true);
    expect(sourceRegex("/((?!chat-asesor).*)").test("/chat-asesor")).toBe(false);
    expect(sourceRegex("/:lang(fr|de)").test("/fr")).toBe(true);
    expect(sourceRegex("/blog/:slug").test("/blog/a/b")).toBe(false);
  });
});

describe("arranque (start)", () => {
  it("escucha en el puerto indicado, atiende páginas y deja en el registro qué variables ve", async () => {
    vi.stubEnv("HOST", "127.0.0.1");
    vi.stubEnv("BREVO_API_KEY", "");
    vi.stubEnv("ZOHO_DESK_CLIENT_ID", "valor-que-no-debe-salir-123");
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    const s = start(0);
    await new Promise<void>(r => s.once("listening", r));
    const at = `http://127.0.0.1:${(s.address() as AddressInfo).port}`;
    expect((await get("/", {}, at)).status).toBe(200);
    // El 404 y las funciones de api/ responden también por el arranque real
    expect((await get("/no-existe", {}, at)).status).toBe(404);
    s.closeAllConnections(); // keep-alive de 65 s: sin esto close() espera
    await new Promise<void>(r => s.close(() => r()));
    const lines = log.mock.calls.map(c => String(c[0]));
    log.mockRestore();
    expect(lines.some(l => l.includes("Sitio en http://localhost:"))).toBe(true);
    expect(lines.some(l => l.includes("BREVO_API_KEY ✗"))).toBe(true);
    // Nunca el valor de una variable, solo su nombre y si existe
    expect(lines.some(l => l.includes("ZOHO_DESK_CLIENT_ID ✓"))).toBe(true);
    expect(lines.join("\n")).not.toContain("valor-que-no-debe-salir-123");
  });
});
