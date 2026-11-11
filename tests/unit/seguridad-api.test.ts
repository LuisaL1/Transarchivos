import { afterEach, describe, expect, it, vi } from "vitest";
import { POST as postContact, resetRateLimit as resetContact } from "../../api/contact.mjs";
import { POST as postTicket, resetForTests as resetTicket } from "../../api/ticket.mjs";

// Hallazgos de la prueba de penetración (docs/11-pentest-zap.md): el límite de
// envíos no debe poder saltarse con un X-Forwarded-For escrito por el cliente,
// y un cuerpo o un Origin raros deben rechazarse sin error de servidor.
const funciones = [
  ["contact", postContact, "https://www.transarchivos.com/api/contact"],
  ["ticket", postTicket, "https://www.transarchivos.com/api/ticket"],
] as const;

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); resetContact(); resetTicket(); });

const req = (url: string, init: { headers?: Record<string, string>; body?: string } = {}) =>
  new Request(url, { method: "POST", headers: { "Content-Type": "application/json", host: "www.transarchivos.com", ...init.headers }, body: init.body ?? "{}" });

describe.each(funciones)("/api/%s", (_n, post, url) => {
  it("el límite por IP no se salta con direcciones inventadas a la izquierda de X-Forwarded-For", async () => {
    const estados: number[] = [];
    for (let i = 0; i < 9; i++) estados.push((await post(req(url, { headers: { "x-forwarded-for": `10.9.${i}.1, 203.0.113.7` } }))).status);
    expect(estados.slice(0, 5)).not.toContain(429);
    expect(estados.slice(5)).toEqual([429, 429, 429, 429]);
  });
  it("cuenta aparte a cada visitante real", async () => {
    for (let i = 0; i < 6; i++) await post(req(url, { headers: { "x-forwarded-for": "203.0.113.7" } }));
    expect((await post(req(url, { headers: { "x-forwarded-for": "198.51.100.9" } }))).status).not.toBe(429);
  });
  it("con TRUSTED_PROXY_HOPS=2 toma la IP anterior a la del último proxy", async () => {
    vi.stubEnv("TRUSTED_PROXY_HOPS", "2");
    for (let i = 0; i < 6; i++) await post(req(url, { headers: { "x-forwarded-for": `198.51.100.${i}, 203.0.113.50, 10.0.0.1` } }));
    expect((await post(req(url, { headers: { "x-forwarded-for": "198.51.100.77, 203.0.113.50, 10.0.0.1" } }))).status).toBe(429);
  });
  it.each(["null", "[1,2,3]", '"texto"', "7", "true"])("un cuerpo %s responde 400, no 500", async cuerpo => {
    expect((await post(req(url, { body: cuerpo }))).status).toBe(400);
  });
  it("un Origin ilegible (null) o ajeno responde 403, no 500", async () => {
    for (const origin of ["null", "no es una url", "https://otro-sitio.com"])
      expect((await post(req(url, { headers: { origin } }))).status, origin).toBe(403);
  });
  it("acepta el Origin del propio sitio", async () => {
    expect((await post(req(url, { headers: { origin: "https://www.transarchivos.com" } }))).status).not.toBe(403);
  });
});
