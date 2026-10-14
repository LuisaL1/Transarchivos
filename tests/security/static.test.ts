import { describe, expect, it } from "vitest";
import { execSync } from "node:child_process";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

// Revisión estática de seguridad del código y la configuración.
const files = (dir: string): string[] => readdirSync(dir).flatMap(f => { const p = join(dir, f); return statSync(p).isDirectory() ? files(p) : [p]; });
const code = [...files("src"), "index.html"].filter(f => /\.(tsx?|html|css)$/.test(f)).map(f => [f, readFileSync(f, "utf8")] as const);

describe("Código", () => {
  it("no inyecta HTML ni evalúa código", () => {
    for (const [f, s] of code) expect(s, f).not.toMatch(/dangerouslySetInnerHTML|\beval\(|new Function\(|\.innerHTML\s*=|document\.write\(/);
  });
  it("los enlaces externos en pestaña nueva llevan rel=noreferrer/noopener", () => {
    for (const [f, s] of code) for (const tag of s.match(/<a\b[^>]*target="_blank"[^>]*>/g) ?? []) expect(tag, f).toMatch(/rel="[^"]*(noreferrer|noopener)/);
  });
  it("no hay enlaces http inseguros a recursos", () => {
    for (const [f, s] of code) for (const u of s.match(/(?:src|href)=["'`]http:\/\/[^"'`]+/g) ?? []) expect.fail(`${u} en ${f}`);
  });
  it("no hay credenciales ni llaves en el código", () => {
    const secret = /(AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{35}|sk_live_[0-9a-zA-Z]{20,}|ghp_[0-9A-Za-z]{36}|-----BEGIN [A-Z ]*PRIVATE KEY-----|xox[baprs]-[0-9A-Za-z-]{10,})/;
    for (const [f, s] of code) expect(s, f).not.toMatch(secret);
  });
  it("solo usa variables de entorno públicas VITE_ permitidas", () => {
    for (const [f, s] of code) for (const m of s.match(/import\.meta\.env\.(\w+)/g) ?? []) expect(["import.meta.env.VITE_GA_MEASUREMENT_ID", "import.meta.env.VITE_SITE_INDEXABLE", "import.meta.env.VITE_GOOGLE_SITE_VERIFICATION", "import.meta.env.DEV", "import.meta.env.PROD", "import.meta.env.MODE"], f).toContain(m);
  });
});

describe("Funciones de Vercel (api/)", () => {
  it("son .mjs: con .ts Vercel las cargaba como CommonJS (500) y .mts no las reconoce (404)", () => {
    const fns = readdirSync("api");
    expect(fns.length).toBeGreaterThan(0);
    for (const f of fns) expect(f, `api/${f}`).toMatch(/\.mjs$/);
  });
  it("la clave de Brevo solo existe en el servidor, nunca en el navegador", () => {
    for (const [f, s] of code) expect(s, f).not.toMatch(/BREVO_API_KEY|api\.brevo\.com/);
    const api = readFileSync("api/contact.mjs", "utf8");
    expect(api).toContain("process.env.BREVO_API_KEY");
    expect(api).not.toMatch(/VITE_BREVO/);
  });
  it("las credenciales de Zoho solo existen en el servidor, nunca en el navegador", () => {
    for (const [f, s] of code) expect(s, f).not.toMatch(/ZOHO_(CLIENT_SECRET|REFRESH_TOKEN|CLIENT_ID)|ADVISOR_SECRET|oauth\/v2\/token/);
    const api = readFileSync("api/advisor.mjs", "utf8");
    expect(api).toContain('env("ZOHO_REFRESH_TOKEN")');
    expect(api).not.toMatch(/VITE_ZOHO/);
  });
  it("el chat de Joel no ejecuta ni interpreta HTML del visitante", () => {
    for (const [f, s] of code.filter(([f]) => /chat|joel/i.test(f))) expect(s, f).not.toMatch(/innerHTML|dangerouslySetInnerHTML|DOMParser/);
  });
});

describe("Repositorio", () => {
  it("ningún archivo .env real está versionado", () => {
    const tracked = execSync("git ls-files", { encoding: "utf8" }).split("\n");
    expect(tracked.filter(f => /(^|\/)\.env(\.|$)/.test(f) && !f.endsWith(".env.example"))).toEqual([]);
  });
});

describe("Cabeceras de seguridad (vercel.json)", () => {
  const cfg = JSON.parse(readFileSync("vercel.json", "utf8"));
  // El sitio (todo menos la página aislada del chat con un asesor) y esa página tienen cabeceras distintas
  const pick = (src: string) => Object.fromEntries(cfg.headers.find((h: { source: string }) => h.source === src).headers.map((h: { key: string; value: string }) => [h.key, h.value]));
  const headers = pick("/((?!chat-asesor).*)");
  const helper = pick("/chat-asesor.html");
  it("define CSP, HSTS, nosniff, anti-clickjacking y referrer", () => {
    for (const k of ["Content-Security-Policy", "Strict-Transport-Security", "X-Content-Type-Options", "X-Frame-Options", "Referrer-Policy", "Permissions-Policy"]) expect(headers[k], k).toBeTruthy();
  });
  it("la CSP no permite scripts en línea ni eval", () => {
    const script = headers["Content-Security-Policy"].match(/script-src ([^;]+)/)[1];
    expect(script).not.toMatch(/unsafe-inline|unsafe-eval/);
    expect(headers["Content-Security-Policy"]).toMatch(/frame-ancestors 'none'/);
    expect(headers["Content-Security-Policy"]).toMatch(/object-src 'none'/);
  });
  it("la página no puede embeberse en otros sitios", () => expect(headers["X-Frame-Options"]).toBe("DENY"));
  it("el sitio nunca autoriza los scripts de Zoho: solo la página aislada del chat con un asesor", () => {
    expect(headers["Content-Security-Policy"]).not.toMatch(/zoho/i);
    const script = helper["Content-Security-Policy"].match(/script-src ([^;]+)/)[1];
    expect(script).toMatch(/salesiq\.zohopublic\.com/);
    expect(helper["Content-Security-Policy"]).toMatch(/frame-ancestors 'self'/);
    expect(helper["X-Frame-Options"]).toBe("SAMEORIGIN");
    expect(helper["X-Robots-Tag"]).toMatch(/noindex/);
  });
});
