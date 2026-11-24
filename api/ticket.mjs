// Función del servidor (server/server.mjs, GoDaddy): el cotizador del sitio crea un ticket en Zoho Desk. Las
// credenciales viven solo en el servidor (variables de entorno): nunca llegan
// al navegador. Ver docs/07-formularios.md.
//
// Variables de entorno (GoDaddy → My Apps → Transarchivos → Settings; en este
// equipo, .env.local, que Git ignora):
//   ZOHO_DESK_CLIENT_ID, ZOHO_DESK_CLIENT_SECRET, ZOHO_DESK_REFRESH_TOKEN
//                            Self Client de api-console.zoho.com (obligatorias)
//   ZOHO_DESK_ORG_ID         ID de la organización de Zoho Desk (obligatoria)
//   ZOHO_DESK_DEPARTMENT_ID  departamento que recibe los tickets (obligatoria)
//   ZOHO_DESK_ACCOUNTS_URL   centro de datos (por defecto https://accounts.zoho.com)
//   ZOHO_DESK_API_URL        (por defecto https://desk.zoho.com)
//
// JavaScript .mjs (no TypeScript), como api/contact.mjs: ver la nota de ese archivo.
import { json, leerEnvio, logger } from "./_seguridad.mjs";
const log = logger("ticket");
// Límite de envíos por IP (en memoria del servidor; frena a un script que
// repita envíos, como en api/contact.mjs). Máx. 5 cada 10 min.
const RATE = { max: 5, windowMs: 10 * 60_000 };
const hits = new Map();
function limited(ip) {
    const now = Date.now();
    const recent = (hits.get(ip) ?? []).filter(t => now - t < RATE.windowMs);
    recent.push(now);
    hits.set(ip, recent);
    if (hits.size > 5000)
        hits.clear();
    return recent.length > RATE.max;
}
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const EMAIL = /^[^\s@<>"]+@(?:[^\s@<>".]+\.)+[^\s@<>".]{2,}$/;
const env = () => ({
    clientId: process.env.ZOHO_DESK_CLIENT_ID,
    clientSecret: process.env.ZOHO_DESK_CLIENT_SECRET,
    refreshToken: process.env.ZOHO_DESK_REFRESH_TOKEN,
    orgId: process.env.ZOHO_DESK_ORG_ID,
    departmentId: process.env.ZOHO_DESK_DEPARTMENT_ID,
    accounts: (process.env.ZOHO_DESK_ACCOUNTS_URL || "https://accounts.zoho.com").replace(/\/$/, ""),
    api: (process.env.ZOHO_DESK_API_URL || "https://desk.zoho.com").replace(/\/$/, ""),
});
const configured = (c) => !!(c.clientId && c.clientSecret && c.refreshToken && c.orgId && c.departmentId);
// Token de acceso: dura una hora; se reutiliza mientras le quede más de un minuto.
let token = null;
/** Solo para pruebas: olvida el token y los envíos contados. */
export function resetForTests() { token = null; hits.clear(); }
async function accessToken(c) {
    if (token && token.expires > Date.now() + 60_000)
        return token.value;
    const q = new URLSearchParams({ refresh_token: c.refreshToken, client_id: c.clientId, client_secret: c.clientSecret, grant_type: "refresh_token" });
    const r = await fetch(`${c.accounts}/oauth/v2/token?${q}`, { method: "POST" });
    const d = await r.json().catch(() => ({}));
    if (!r.ok || !d.access_token)
        throw new Error(`token ${r.status} ${d.error ?? ""}`.trim());
    token = { value: d.access_token, expires: Date.now() + (Number(d.expires_in) || 3600) * 1000 };
    return token.value;
}
const desk = async (c, path, init = {}) => fetch(`${c.api}/api/v1${path}`, {
    ...init,
    headers: { Authorization: `Zoho-oauthtoken ${await accessToken(c)}`, orgId: c.orgId, "Content-Type": "application/json", ...init.headers },
});
export async function POST(req) {
    const envio = await leerEnvio(req, limited, log);
    if (envio.rechazo)
        return envio.rechazo;
    const body = envio.body;
    // Campo trampa para bots: si viene lleno, se responde OK sin crear nada.
    if (body.website) {
        console.warn("[ticket] ✗ Bot detectado (campo trampa lleno): no se creó nada");
        return json({ ok: true });
    }
    const fields = Object.fromEntries(Object.entries(body.fields ?? {})
        .filter(([k, v]) => typeof v === "string" && k.length <= 60)
        .map(([k, v]) => [k, v.trim().slice(0, 4000)]));
    const email = (body.contact?.email ?? "").trim();
    if (!EMAIL.test(email))
        return log.reject("email", 422, "correo del visitante inválido");
    if (Object.keys(fields).length === 0 || Object.keys(fields).length > 40)
        return log.reject("fields", 422, `${Object.keys(fields).length} campos (debe tener entre 1 y 40)`);
    if (fields["Autorización de datos"] !== "Sí")
        return log.reject("consent", 422, "sin autorización de datos");
    const c = env();
    if (!configured(c)) {
        const missing = [["ZOHO_DESK_CLIENT_ID", c.clientId], ["ZOHO_DESK_CLIENT_SECRET", c.clientSecret], ["ZOHO_DESK_REFRESH_TOKEN", c.refreshToken], ["ZOHO_DESK_ORG_ID", c.orgId], ["ZOHO_DESK_DEPARTMENT_ID", c.departmentId]]
            .filter(([, v]) => !v).map(([k]) => k);
        log.fail(`No se creó: faltan las variables ${missing.join(", ")}`);
        return json({ ok: false, error: "not-configured" }, 503);
    }
    const name = String(body.contact?.name ?? "").trim().slice(0, 120) || email;
    const phone = String(body.contact?.phone ?? "").trim().slice(0, 40);
    const subject = String(body.subject ?? "Solicitud de cotización").trim().slice(0, 250);
    const rows = Object.entries(fields).map(([k, v]) => `<tr><td style="padding:6px 10px;border:1px solid #E4E6F7;background:#F7F8FF;font-weight:bold;vertical-align:top">${esc(k)}</td><td style="padding:6px 10px;border:1px solid #E4E6F7;white-space:pre-wrap">${esc(v)}</td></tr>`).join("");
    const description = `<table style="border-collapse:collapse">${rows}</table><p>Enviado desde el cotizador del sitio web${body.lang === "en" ? " (versión en inglés)" : ""}.</p>`;
    try {
        const r = await desk(c, "/tickets", {
            method: "POST",
            body: JSON.stringify({
                subject, departmentId: c.departmentId, description, channel: "Web", email,
                ...(phone ? { phone } : {}),
                // Zoho Desk busca el contacto por el correo o lo crea
                contact: { lastName: name, email, ...(phone ? { phone } : {}) },
            }),
        });
        const d = await r.json().catch(() => ({}));
        if (!r.ok) {
            log.fail(`Zoho Desk rechazó el ticket (HTTP ${r.status}):`, d.errorCode ?? "", d.message ?? "");
            return json({ ok: false, error: "provider", status: r.status, detail: `${d.errorCode ?? ""} ${d.message ?? ""}`.trim().slice(0, 200) }, 502);
        }
        log.ok(`Ticket #${d.ticketNumber ?? "sin número"} creado en Zoho Desk`);
        return json({ ok: true, ticket: d.ticketNumber ?? null });
    }
    catch (e) {
        log.fail("No se creó el ticket en Zoho Desk:", e instanceof Error ? e.message : e);
        return json({ ok: false, error: "provider", detail: String(e.message).slice(0, 120) }, 502);
    }
}
