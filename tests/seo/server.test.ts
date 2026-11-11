import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { readdirSync } from "node:fs";
import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import { PUBLIC_ROUTES } from "@/seo/meta";

// Servidor de producción (server.mjs) para alojamientos con Node.js: debe
// responder igual que Vercel. Corre sobre dist/ (después de `pnpm build`).
let server: Server;
let base = "";

beforeAll(async () => {
  const { createServer } = await import(/* @vite-ignore */ "../../server.mjs") as { createServer: () => Promise<Server> };
  server = await createServer();
  await new Promise<void>(r => server.listen(0, "127.0.0.1", r));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});
afterAll(() => new Promise<void>(r => server.close(() => r())));

const get = (p: string, init: RequestInit = {}) => fetch(base + p, { redirect: "manual", ...init });

describe("server.mjs", () => {
  it("entrega todas las rutas públicas con direcciones limpias", async () => {
    for (const r of PUBLIC_ROUTES) {
      const res = await get(r);
      expect(res.status, r).toBe(200);
      expect(res.headers.get("content-type"), r).toContain("text/html");
    }
  });

  it("aplica las cabeceras de seguridad de vercel.json", async () => {
    const h = (await get("/")).headers;
    expect(h.get("content-security-policy")).toContain("default-src 'self'");
    expect(h.get("strict-transport-security")).toContain("max-age=");
    expect(h.get("x-frame-options")).toBe("DENY");
    expect(h.get("x-content-type-options")).toBe("nosniff");
  });

  it("la página aislada del chat se puede incrustar en el sitio", async () => {
    const res = await get("/chat-asesor");
    expect(res.status).toBe(200);
    expect(res.headers.get("x-frame-options")).not.toBe("DENY");
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
    expect(await res.text()).toContain("No encontramos esta página");
  });

  it("no sale de dist/ con rutas con ..", async () => {
    for (const p of ["/%2e%2e/package.json", "/..%2fpackage.json", "/assets/%2e%2e/%2e%2e/package.json", "/%00"]) {
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

  it("comprime el texto y atiende rangos (video en Safari)", async () => {
    const res = await get("/", { headers: { "accept-encoding": "gzip" } });
    expect(res.headers.get("content-encoding")).toBe("gzip");
    const part = await get("/hero-fotos/01.webp", { headers: { range: "bytes=0-99" } });
    expect(part.status).toBe(206);
    expect(part.headers.get("content-range")).toMatch(/^bytes 0-99\//);
    expect((await part.arrayBuffer()).byteLength).toBe(100);
    expect((await get("/hero-fotos/01.webp", { headers: { range: "bytes=999999999-" } })).status).toBe(416);
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
    expect((await get("/api/..%2fserver", { method: "POST" })).status).toBe(404);
  });
});
