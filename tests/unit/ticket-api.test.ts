import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET, POST, resetForTests } from "../../api/ticket.mjs";

// Función /api/ticket (cotizador → Zoho Desk). No crea nada real: fetch se simula.
const req = (body: unknown, headers: Record<string, string> = {}) =>
  new Request("https://www.transarchivos.com/api/ticket", { method: "POST", headers: { "Content-Type": "application/json", host: "www.transarchivos.com", ...headers }, body: JSON.stringify(body) });
const valid = {
  subject: "Solicitud de cotización — Custodia",
  fields: { Servicio: "Custodia", Empresa: "ACME <b>", Contacto: "Ana", "Autorización de datos": "Sí" },
  contact: { email: "ana@empresa.com", name: "Ana Prueba", phone: "3000000000" },
  lang: "es",
};
const ENV = { ZOHO_DESK_CLIENT_ID: "id", ZOHO_DESK_CLIENT_SECRET: "secret", ZOHO_DESK_REFRESH_TOKEN: "refresh", ZOHO_DESK_ORG_ID: "942", ZOHO_DESK_DEPARTMENT_ID: "dep1" };
const configure = () => { for (const [k, v] of Object.entries(ENV)) vi.stubEnv(k, v); };
// Zoho responde: primero el token y luego la creación del ticket
const zoho = (ticket: Response = new Response(JSON.stringify({ id: "t1", ticketNumber: "101" }), { status: 200 })) => {
  const f = vi.fn()
    .mockResolvedValueOnce(new Response(JSON.stringify({ access_token: "tok", expires_in: 3600 }), { status: 200 }))
    .mockResolvedValue(ticket);
  vi.stubGlobal("fetch", f);
  return f;
};

beforeEach(() => resetForTests());
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe("/api/ticket", () => {
  it("sin credenciales responde 503 (no configurado) y el diagnóstico lo dice", async () => {
    for (const k of Object.keys(ENV)) vi.stubEnv(k, "");
    expect((await POST(req(valid))).status).toBe(503);
    expect(await (await GET()).json()).toEqual({ configured: false });
  });

  it("crea el ticket en el departamento, con el contacto y el detalle escapado", async () => {
    configure();
    const f = zoho();
    const r = await POST(req(valid, { origin: "https://www.transarchivos.com" }));
    expect(r.status).toBe(200);
    expect(await r.json()).toEqual({ ok: true, ticket: "101" });
    // 1) token con el refresh token (las credenciales solo viajan a Zoho)
    const [tokenUrl, tokenInit] = f.mock.calls[0];
    expect(tokenUrl).toMatch(/^https:\/\/accounts\.zoho\.com\/oauth\/v2\/token\?/);
    expect(tokenUrl).toContain("grant_type=refresh_token");
    expect(tokenInit.method).toBe("POST");
    // 2) ticket
    const [url, init] = f.mock.calls[1];
    expect(url).toBe("https://desk.zoho.com/api/v1/tickets");
    expect(init.headers.Authorization).toBe("Zoho-oauthtoken tok");
    expect(init.headers.orgId).toBe("942");
    const sent = JSON.parse(init.body);
    expect(sent).toMatchObject({ subject: valid.subject, departmentId: "dep1", email: "ana@empresa.com", phone: "3000000000", channel: "Web", contact: { lastName: "Ana Prueba", email: "ana@empresa.com" } });
    expect(sent.description).toContain("ACME &lt;b&gt;");
    expect(sent.description).not.toContain("<b>");
  });

  it("reutiliza el token mientras no venza", async () => {
    configure();
    const f = zoho();
    await POST(req(valid, { "x-forwarded-for": "198.51.100.1" }));
    await POST(req(valid, { "x-forwarded-for": "198.51.100.2" }));
    expect(f.mock.calls.filter(([u]) => String(u).includes("oauth/v2/token"))).toHaveLength(1);
  });

  it("exige correo válido y autorización de datos", async () => {
    configure();
    expect((await POST(req({ ...valid, contact: { email: "no-es-correo" } }))).status).toBe(422);
    expect((await POST(req({ ...valid, fields: { ...valid.fields, "Autorización de datos": "" } }))).status).toBe(422);
  });

  it("rechaza envíos desde otro sitio", async () => {
    configure();
    expect((await POST(req(valid, { origin: "https://otro-sitio.com" }))).status).toBe(403);
  });

  it("el campo trampa (bots) responde OK sin llamar a Zoho", async () => {
    configure();
    const f = vi.fn(); vi.stubGlobal("fetch", f);
    expect((await POST(req({ ...valid, website: "spam" }))).status).toBe(200);
    expect(f).not.toHaveBeenCalled();
  });

  it("limita los envíos por IP: al sexto en 10 minutos responde 429", async () => {
    configure();
    zoho();
    const ip = { "x-forwarded-for": "203.0.113.9" };
    for (let i = 0; i < 5; i++) expect((await POST(req(valid, ip))).status).toBe(200);
    expect((await POST(req(valid, ip))).status).toBe(429);
  });

  it("si Zoho rechaza el ticket responde 502 con el motivo (sin secretos)", async () => {
    configure();
    vi.spyOn(console, "error").mockImplementation(() => {});
    zoho(new Response(JSON.stringify({ errorCode: "SCOPE_MISMATCH", message: "no scope" }), { status: 403 }));
    const r = await POST(req(valid));
    expect(r.status).toBe(502);
    const d = await r.json();
    expect(d).toMatchObject({ ok: false, error: "provider", detail: "SCOPE_MISMATCH no scope" });
    expect(JSON.stringify(d)).not.toMatch(/secret|refresh/);
  });

  it("si el token falla responde 502", async () => {
    configure();
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: "invalid_code" }), { status: 400 })));
    expect((await POST(req(valid))).status).toBe(502);
  });
});
