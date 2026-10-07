import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "../../api/contact";

// Función /api/contact (Vercel → Brevo). No envía nada real: fetch se simula.
const req = (body: unknown, headers: Record<string, string> = {}) =>
  new Request("https://www.transarchivos.com/api/contact", { method: "POST", headers: { "Content-Type": "application/json", host: "www.transarchivos.com", ...headers }, body: JSON.stringify(body) });
const valid = { kind: "contacto", subject: "Contacto web — Otro", fields: { Nombre: "Ana", Correo: "ana@empresa.com", Mensaje: "Hola <b>", "Autorización de datos": "Sí" }, replyTo: { email: "ana@empresa.com", name: "Ana" } };

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe("/api/contact", () => {
  it("sin clave de Brevo responde 503 (no configurado)", async () => {
    vi.stubEnv("BREVO_API_KEY", "");
    expect((await POST(req(valid))).status).toBe(503);
  });
  it("exige correo válido y autorización de datos", async () => {
    vi.stubEnv("BREVO_API_KEY", "k");
    expect((await POST(req({ ...valid, replyTo: { email: "no-es-correo" } }))).status).toBe(422);
    expect((await POST(req({ ...valid, fields: { ...valid.fields, "Autorización de datos": "" } }))).status).toBe(422);
  });
  it("rechaza envíos desde otro sitio", async () => {
    vi.stubEnv("BREVO_API_KEY", "k");
    expect((await POST(req(valid, { origin: "https://otro-sitio.com" }))).status).toBe(403);
  });
  it("el campo trampa (bots) responde OK sin enviar", async () => {
    const f = vi.fn(); vi.stubGlobal("fetch", f); vi.stubEnv("BREVO_API_KEY", "k");
    expect((await POST(req({ ...valid, website: "spam" }))).status).toBe(200);
    expect(f).not.toHaveBeenCalled();
  });
  it("envía a Brevo al correo de la empresa, con respuesta al visitante y HTML escapado", async () => {
    const f = vi.fn().mockResolvedValue(new Response("{}", { status: 201 })); vi.stubGlobal("fetch", f); vi.stubEnv("BREVO_API_KEY", "k");
    const r = await POST(req(valid, { origin: "https://www.transarchivos.com" }));
    expect(r.status).toBe(200);
    const [url, init] = f.mock.calls[0];
    expect(url).toBe("https://api.brevo.com/v3/smtp/email");
    expect(init.headers["api-key"]).toBe("k");
    const sent = JSON.parse(init.body);
    expect(sent.to[0].email).toBe("mercadeo@transarchivos.com");
    expect(sent.replyTo.email).toBe("ana@empresa.com");
    expect(sent.htmlContent).toContain("Hola &lt;b&gt;");
    expect(sent.htmlContent).not.toContain("<b>");
    // confirmación automática al visitante
    expect(f).toHaveBeenCalledTimes(2);
    const conf = JSON.parse(f.mock.calls[1][1].body);
    expect(conf.to[0].email).toBe("ana@empresa.com");
    expect(conf.replyTo.email).toBe("mercadeo@transarchivos.com");
    expect(conf.subject).toMatch(/Recibimos su solicitud/);
  });
  it("si falla solo la confirmación, la solicitud igual se da por enviada", async () => {
    const f = vi.fn().mockResolvedValueOnce(new Response("{}", { status: 201 })).mockRejectedValueOnce(new Error("x"));
    vi.stubGlobal("fetch", f); vi.stubEnv("BREVO_API_KEY", "k");
    expect((await POST(req(valid))).status).toBe(200);
  });
  it("si Brevo falla responde 502", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 401 }))); vi.stubEnv("BREVO_API_KEY", "k");
    expect((await POST(req(valid))).status).toBe(502);
  });
});
