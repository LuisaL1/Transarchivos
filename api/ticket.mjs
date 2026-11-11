// Función de Vercel: el cotizador del sitio crea un ticket en Zoho Desk. Las
// credenciales viven solo en el servidor (variables de entorno): nunca llegan
// al navegador. Ver docs/07-formularios.md.
//
// Variables de entorno (Vercel → Settings → Environment Variables; en este
// equipo, .env.local, que Git ignora):
//   ZOHO_DESK_CLIENT_ID, ZOHO_DESK_CLIENT_SECRET, ZOHO_DESK_REFRESH_TOKEN
//                            Self Client de api-console.zoho.com (obligatorias)
//   ZOHO_DESK_ORG_ID         ID de la organización de Zoho Desk (obligatoria)
//   ZOHO_DESK_DEPARTMENT_ID  departamento que recibe los tickets (obligatoria)
//   ZOHO_DESK_ACCOUNTS_URL   centro de datos (por defecto https://accounts.zoho.com)
//   ZOHO_DESK_API_URL        (por defecto https://desk.zoho.com)
//
// JavaScript .mjs (no TypeScript), como api/contact.mjs: ver la nota de ese archivo.
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
// Límite de envíos por IP (en memoria de la instancia; frena a un script que
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
// Diagnóstico sin datos secretos: ¿están las variables, sirve el token y se ve el departamento?
export async function GET() {
    const c = env();
    if (!configured(c))
        return json({ configured: false });
    try {
        const r = await desk(c, `/departments/${c.departmentId}`);
        const d = await r.json().catch(() => ({}));
        return json({ configured: true, token: "ok", department: r.ok ? d.name ?? "ok" : `${r.status} ${d.errorCode ?? ""}`.trim() });
    }
    catch (e) {
        return json({ configured: true, token: String(e.message).slice(0, 120) });
    }
}
// IP del visitante para el límite de envíos: la que añade el proxy de la plataforma
// al final de X-Forwarded-For (las que escribe el cliente van a la izquierda y
// se ignoran). TRUSTED_PROXY_HOPS = cuántos proxies de confianza hay delante.
const clientIp = (req) => {
    const hops = Math.max(1, Number(process.env.TRUSTED_PROXY_HOPS) || 1);
    const parts = (req.headers.get("x-forwarded-for") ?? "").split(",").map((p) => p.trim()).filter(Boolean);
    return parts.at(-hops) ?? parts[0] ?? "desconocida";
};
// Un Origin ilegible (p. ej. "null" de un iframe aislado) también es ajeno.
const foreignOrigin = (req) => {
    const origin = req.headers.get("origin");
    const host = req.headers.get("host");
    if (!origin || !host)
        return false;
    try {
        return new URL(origin).host !== host;
    }
    catch {
        return true;
    }
};
export async function POST(req) {
    // Solo desde el propio sitio
    if (foreignOrigin(req))
        return json({ ok: false, error: "origin" }, 403);
    if (limited(clientIp(req)))
        return json({ ok: false, error: "rate" }, 429);
    let body;
    try {
        body = await req.json();
    }
    catch {
        return json({ ok: false, error: "json" }, 400);
    }
    if (body === null || typeof body !== "object" || Array.isArray(body))
        return json({ ok: false, error: "json" }, 400);
    // Campo trampa para bots: si viene lleno, se responde OK sin crear nada.
    if (body.website)
        return json({ ok: true });
    const fields = Object.fromEntries(Object.entries(body.fields ?? {})
        .filter(([k, v]) => typeof v === "string" && k.length <= 60)
        .map(([k, v]) => [k, v.trim().slice(0, 4000)]));
    const email = (body.contact?.email ?? "").trim();
    if (!EMAIL.test(email))
        return json({ ok: false, error: "email" }, 422);
    if (Object.keys(fields).length === 0 || Object.keys(fields).length > 40)
        return json({ ok: false, error: "fields" }, 422);
    if (fields["Autorización de datos"] !== "Sí")
        return json({ ok: false, error: "consent" }, 422);
    const c = env();
    if (!configured(c))
        return json({ ok: false, error: "not-configured" }, 503);
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
            console.error("Zoho Desk rechazó el ticket:", r.status, d);
            return json({ ok: false, error: "provider", status: r.status, detail: `${d.errorCode ?? ""} ${d.message ?? ""}`.trim().slice(0, 200) }, 502);
        }
        return json({ ok: true, ticket: d.ticketNumber ?? null });
    }
    catch (e) {
        console.error("Error al crear el ticket en Zoho Desk:", e);
        return json({ ok: false, error: "provider", detail: String(e.message).slice(0, 120) }, 502);
    }
}
