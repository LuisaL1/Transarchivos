// Función de Vercel: recibe las solicitudes del sitio y las envía por correo
// con Brevo (API transaccional). La clave nunca llega al navegador.
//
// Variables de entorno (Vercel → Settings → Environment Variables):
//   BREVO_API_KEY     clave de API de Brevo (obligatoria)
//   LEADS_TO          correo comercial: cotizador y motivos comerciales (por defecto mercadeo@transarchivos.com)
//   LEADS_TO_NEWSLETTER correo que recibe las suscripciones al blog (por defecto marketing@transarchivos.com)
//   LEADS_TO_GENERAL  correo general: soporte, PQRS, datos personales, empleo y otros (por defecto info@transarchivos.com)
//   LEADS_FROM        remitente (por defecto no-reply@transarchivos.com; distinto de los buzones que reciben)
//   LEADS_FROM_NAME   nombre del remitente (por defecto "Transarchivos")
//
// JavaScript .mjs (no TypeScript): Node siempre lo carga como módulo ES. Con
// .ts, Vercel lo compilaba a ES pero lo cargaba como CommonJS y la función se
// caía al arrancar ("Unexpected token 'export'", error 500); .mts no lo
// reconoce como función (404). Las pruebas lo verifican (tests/security).
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
// Límite de envíos por IP: el formulario es público y cada envío cuesta dos
// correos (aviso + confirmación). Se cuenta en memoria de la instancia de
// Vercel (se reinicia al escalar o dormir): no sustituye a un servicio de
// cuotas, pero frena a un script que repita envíos. Máx. 5 cada 10 min.
const RATE = { max: 5, windowMs: 10 * 60_000 };
const hits = new Map();
/** Solo para pruebas: olvida los envíos contados. */
export function resetRateLimit() { hits.clear(); }
function limited(ip) {
    const now = Date.now();
    const recent = (hits.get(ip) ?? []).filter(t => now - t < RATE.windowMs);
    recent.push(now);
    hits.set(ip, recent);
    if (hits.size > 5000)
        hits.clear(); // sin crecimiento indefinido
    return recent.length > RATE.max;
}
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const EMAIL = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]{2,}$/;
// Plantilla de correo: banner en imagen (índigo #1800AD + logo + detalle de esquina; las
// imágenes no se alteran en el modo oscuro de Gmail), cuerpo en tabla.
function layout(base, title, inner) {
    return `<!doctype html><html><head><meta charset="utf-8"><meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light only"></head>
<body style="margin:0;padding:0;background:#F1F3FB">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#F1F3FB" style="background:#F1F3FB"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #E4E6F7">
<tr><td bgcolor="#1800AD" style="background:#1800AD;line-height:0"><img src="${base}/brand/email-header.png?v=5" width="560" alt="Transarchivos Ltda." style="display:block;width:100%;max-width:560px;height:auto;border:0"></td></tr>
<tr><td style="padding:26px 28px 6px;font-family:Arial,sans-serif"><h1 style="margin:0;color:#1800AD;font-size:21px;line-height:1.3">${title}</h1></td></tr>
<tr><td style="padding:12px 28px 26px;font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#37352F">${inner}</td></tr>
<tr><td bgcolor="#F7F8FF" style="background:#F7F8FF;padding:14px 28px;font-family:Arial,sans-serif;font-size:12px;color:#6B6B6B;border-top:1px solid #E4E6F7">Transarchivos Ltda. · Cl. 21 # 39A-40, Bogotá · (601) 316-4530</td></tr>
</table></td></tr></table></body></html>`;
}
// Correo de confirmación para el visitante ("recibimos su solicitud"), en el
// idioma de la página desde la que escribió (lang: "es" | "en").
function confirmation(base, kind, name, fields, lang = "es") {
    const first = esc(name.split(" ")[0] || "");
    if (lang === "en") return confirmationEn(base, kind, name, fields, first);
    if (kind === "suscripcion") {
        const subject = "Suscripción confirmada · Transarchivos";
        // Anular: las suscripciones viven en el buzón de marketing (no hay base de
        // datos), así que el botón abre un correo listo para enviar a ese buzón.
        const newsletterTo = process.env.LEADS_TO_NEWSLETTER || "marketing@transarchivos.com";
        const subscriber = fields["Correo"] ?? "";
        const unsubscribe = `mailto:${newsletterTo}?subject=${encodeURIComponent("Anular suscripción al blog")}&body=${encodeURIComponent(`Por favor anulen la suscripción al blog de Transarchivos del correo ${subscriber}.`)}`;
        const html = layout(base, "¡Gracias por suscribirse!", `
<p style="margin:0 0 12px">Hola,</p>
<p style="margin:0 0 12px">Su correo quedó registrado para recibir las novedades y guías sobre gestión documental de Transarchivos.</p>
<p style="margin:0 0 16px">Si no solicitó esta suscripción o ya no desea recibir nuestros correos, puede anularla en cualquier momento:</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#1800AD" style="background:#1800AD;border-radius:10px"><a href="${esc(unsubscribe)}" style="display:inline-block;padding:11px 20px;color:#ffffff;font-weight:bold;text-decoration:none;font-family:Arial,sans-serif;font-size:14px">Anular suscripción</a></td></tr></table>
<p style="margin:14px 0 18px;color:#6B6B6B;font-size:12px">El botón abre un correo a ${esc(newsletterTo)} con la solicitud lista para enviar.</p>
<p style="margin:0;color:#6B6B6B;font-size:12px">Tratamos sus datos según nuestra <a href="https://www.transarchivos.com/privacidad" style="color:#1800AD">política de privacidad</a>.</p>`);
        const text = `Su correo quedó registrado para recibir las novedades y guías de Transarchivos.\n\nPara anular la suscripción, escriba a ${newsletterTo} con el asunto «Anular suscripción al blog».`;
        return { subject, html, text };
    }
    // Solo se repite al visitante un dato corto (nombre del servicio o motivo):
    // así el formulario no sirve para enviar textos largos a un tercero.
    const short = (v, fallback) => (v ?? "").replace(/\s+/g, " ").trim().slice(0, 60) || fallback;
    const what = kind === "cotizacion" ? short(fields["Servicio"], "nuestros servicios") : short(fields["Motivo"], "contacto");
    const about = kind === "cotizacion" ? `su solicitud de cotización de <strong>${esc(what)}</strong>` : `su mensaje (${esc(what)})`;
    const aboutText = kind === "cotizacion" ? `su solicitud de cotización de ${what}` : `su mensaje (${what})`;
    const subject = "Recibimos su solicitud · Transarchivos";
    const html = layout(base, "¡Recibimos su solicitud!", `
<p style="margin:0 0 12px">Hola${first ? ` ${first}` : ""},</p>
<p style="margin:0 0 12px">Gracias por escribirnos. Recibimos ${about} y un asesor de nuestro equipo le responderá a este correo a la mayor brevedad.</p>
<p style="margin:0 0 16px">Si necesita atención inmediata, escríbanos por WhatsApp o llámenos:</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#1800AD" style="background:#1800AD;border-radius:10px"><a href="https://wa.me/573243586973" style="display:inline-block;padding:11px 20px;color:#ffffff;font-weight:bold;text-decoration:none;font-family:Arial,sans-serif;font-size:14px">WhatsApp 324 358 6973</a></td></tr></table>
<p style="margin:14px 0 18px;color:#6B6B6B">Teléfonos: (601) 316-4530 · 324 358 6973</p>
<p style="margin:0;color:#6B6B6B;font-size:12px">Este es un mensaje automático de confirmación. Tratamos sus datos según nuestra <a href="https://www.transarchivos.com/privacidad" style="color:#1800AD">política de privacidad</a>.</p>`);
    const text = `Hola${name ? ` ${name.split(" ")[0]}` : ""},\n\nGracias por escribirnos. Recibimos ${aboutText} y un asesor le responderá a este correo a la mayor brevedad.\n\nAtención inmediata: WhatsApp 324 358 6973 · Teléfonos (601) 316-4530 · 324 358 6973\n\nMensaje automático de Transarchivos Ltda.`;
    return { subject, html, text };
}
// Versión en inglés de la confirmación (mismo diseño; el correo al equipo de
// Transarchivos sigue en español).
function confirmationEn(base, kind, name, fields, first) {
    const privacy = `<p style="margin:0;color:#6B6B6B;font-size:12px">This is an automatic confirmation. We process your data according to our <a href="https://www.transarchivos.com/en/privacy" style="color:#1800AD">privacy policy</a>.</p>`;
    if (kind === "suscripcion") {
        const newsletterTo = process.env.LEADS_TO_NEWSLETTER || "marketing@transarchivos.com";
        const subscriber = fields["Correo"] ?? "";
        const unsubscribe = `mailto:${newsletterTo}?subject=${encodeURIComponent("Anular suscripción al blog")}&body=${encodeURIComponent(`Por favor anulen la suscripción al blog de Transarchivos del correo ${subscriber}.`)}`;
        const html = layout(base, "Thank you for subscribing!", `
<p style="margin:0 0 12px">Hello,</p>
<p style="margin:0 0 12px">Your email has been registered to receive Transarchivos' news and guides on records management (our content is published in Spanish).</p>
<p style="margin:0 0 16px">If you did not request this subscription or no longer wish to receive our emails, you can unsubscribe at any time:</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#1800AD" style="background:#1800AD;border-radius:10px"><a href="${esc(unsubscribe)}" style="display:inline-block;padding:11px 20px;color:#ffffff;font-weight:bold;text-decoration:none;font-family:Arial,sans-serif;font-size:14px">Unsubscribe</a></td></tr></table>
<p style="margin:14px 0 18px;color:#6B6B6B;font-size:12px">The button opens an email to ${esc(newsletterTo)} with the request ready to send.</p>
${privacy}`);
        const text = `Your email has been registered to receive Transarchivos' news and guides.\n\nTo unsubscribe, write to ${newsletterTo} with the subject «Anular suscripción al blog».`;
        return { subject: "Subscription confirmed · Transarchivos", html, text };
    }
    const short = (v, fallback) => (v ?? "").replace(/\s+/g, " ").trim().slice(0, 60) || fallback;
    const what = kind === "cotizacion" ? short(fields["Servicio"], "our services") : short(fields["Motivo"], "contact");
    const about = kind === "cotizacion" ? `your quote request for <strong>${esc(what)}</strong>` : `your message (${esc(what)})`;
    const aboutText = kind === "cotizacion" ? `your quote request for ${what}` : `your message (${what})`;
    const html = layout(base, "We received your request!", `
<p style="margin:0 0 12px">Hello${first ? ` ${first}` : ""},</p>
<p style="margin:0 0 12px">Thank you for writing to us. We received ${about} and an advisor from our team will reply to this email as soon as possible.</p>
<p style="margin:0 0 16px">If you need immediate assistance, write to us on WhatsApp or call us:</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#1800AD" style="background:#1800AD;border-radius:10px"><a href="https://wa.me/573243586973" style="display:inline-block;padding:11px 20px;color:#ffffff;font-weight:bold;text-decoration:none;font-family:Arial,sans-serif;font-size:14px">WhatsApp +57 324 358 6973</a></td></tr></table>
<p style="margin:14px 0 18px;color:#6B6B6B">Phones: +57 (601) 316-4530 · +57 324 358 6973</p>
${privacy}`);
    const text = `Hello${name ? ` ${name.split(" ")[0]}` : ""},\n\nThank you for writing to us. We received ${aboutText} and an advisor will reply to this email as soon as possible.\n\nImmediate assistance: WhatsApp +57 324 358 6973 · Phones +57 (601) 316-4530 · +57 324 358 6973\n\nAutomatic message from Transarchivos Ltda.`;
    return { subject: "We received your request · Transarchivos", html, text };
}
export async function GET() {
    const key = process.env.BREVO_API_KEY;
    if (!key)
        return json({ configured: false });
    const r = await fetch("https://api.brevo.com/v3/account", { headers: { "api-key": key, Accept: "application/json" } }).catch(() => null);
    const d = r ? await r.json().catch(() => ({})) : {};
    return json({ configured: true, brevo: r?.ok ? "ok" : `${r?.status ?? "sin respuesta"} ${d.code ?? ""} ${d.message ?? ""}`.trim(), from: process.env.LEADS_FROM || "no-reply@transarchivos.com", to: process.env.LEADS_TO || "mercadeo@transarchivos.com", toNewsletter: process.env.LEADS_TO_NEWSLETTER || "marketing@transarchivos.com", toGeneral: process.env.LEADS_TO_GENERAL || "info@transarchivos.com" });
}
export async function POST(req) {
    // Solo desde el propio sitio
    const origin = req.headers.get("origin");
    const host = req.headers.get("host");
    if (origin && host && new URL(origin).host !== host)
        return json({ ok: false, error: "origin" }, 403);
    const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "desconocida";
    if (limited(ip))
        return json({ ok: false, error: "rate" }, 429);
    let body;
    try {
        body = await req.json();
    }
    catch {
        return json({ ok: false, error: "json" }, 400);
    }
    // Campo trampa para bots: si viene lleno, se responde OK sin enviar nada.
    if (body.website)
        return json({ ok: true });
    const kind = body.kind === "cotizacion" ? "cotizacion" : body.kind === "suscripcion" ? "suscripcion" : "contacto";
    const fields = Object.fromEntries(Object.entries(body.fields ?? {})
        .filter(([k, v]) => typeof v === "string" && k.length <= 60)
        .map(([k, v]) => [k, v.trim().slice(0, 4000)]));
    const replyEmail = (body.replyTo?.email ?? "").trim();
    if (!EMAIL.test(replyEmail))
        return json({ ok: false, error: "email" }, 422);
    if (Object.keys(fields).length === 0 || Object.keys(fields).length > 40)
        return json({ ok: false, error: "fields" }, 422);
    if (fields["Autorización de datos"] !== "Sí")
        return json({ ok: false, error: "consent" }, 422);
    const key = process.env.BREVO_API_KEY;
    if (!key)
        return json({ ok: false, error: "not-configured" }, 503);
    const subject = (body.subject ?? (kind === "cotizacion" ? "Solicitud de cotización" : "Nuevo mensaje de contacto")).slice(0, 150);
    // Imágenes del correo: siempre desde producción (no desde una vista previa
    // o un despliegue antiguo, que tendría otro banner). Ver docs/07-formularios.md
    const base = (process.env.EMAIL_ASSETS_URL || "https://transarchivos.vercel.app").replace(/\/$/, "");
    const rows = Object.entries(fields).map(([k, v]) => `<tr><td style="padding:9px 12px;border:1px solid #E4E6F7;background:#F7F8FF;font-weight:bold;color:#1800AD;vertical-align:top;width:38%">${esc(k)}</td><td style="padding:9px 12px;border:1px solid #E4E6F7;white-space:pre-wrap">${esc(v)}</td></tr>`).join("");
    const html = layout(base, esc(subject), `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px">${rows}</table><p style="color:#6B6B6B;font-size:12px;margin:16px 0 0">Enviado desde el formulario del sitio web. Responda este correo para contestarle directamente a la persona.</p>`);
    const text = `${subject}\n\n` + Object.entries(fields).map(([k, v]) => `${k}: ${v}`).join("\n");
    const sender = { email: process.env.LEADS_FROM || "no-reply@transarchivos.com", name: process.env.LEADS_FROM_NAME || "Transarchivos" };
    // Destino según el motivo: lo comercial a mercadeo, lo demás al correo general.
    const lang = body.lang === "en" ? "en" : "es";
    const COMMERCIAL = ["Solicitar una cotización", "Información sobre un servicio", "Request a quote", "Information about a service"];
    const commercial = kind === "cotizacion" || COMMERCIAL.includes(fields["Motivo"] ?? "");
    const leadsTo = kind === "suscripcion" ? (process.env.LEADS_TO_NEWSLETTER || "marketing@transarchivos.com")
        : commercial ? (process.env.LEADS_TO || "mercadeo@transarchivos.com") : (process.env.LEADS_TO_GENERAL || "info@transarchivos.com");
    const send = (payload) => fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: { "api-key": key, "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ sender, ...payload }),
    });
    // 1) Solicitud al equipo de Transarchivos (responder = el visitante)
    const name = (body.replyTo?.name ?? "").slice(0, 120);
    const res = await send({
        to: [{ email: leadsTo, name: kind === "suscripcion" ? "Marketing Transarchivos" : commercial ? "Mercadeo Transarchivos" : "Transarchivos" }],
        replyTo: { email: replyEmail, name: name || replyEmail },
        subject, htmlContent: html, textContent: text, tags: [`sitio-${kind}`],
    });
    if (!res.ok) {
        // Motivo que da Brevo (p. ej. remitente no verificado, clave inválida, IP no autorizada)
        const detail = await res.json().catch(() => ({}));
        console.error("Brevo rechazó el envío:", res.status, detail);
        return json({ ok: false, error: "provider", status: res.status, detail: `${detail.code ?? ""} ${detail.message ?? ""}`.trim().slice(0, 200) }, 502);
    }
    // 2) Confirmación automática al visitante. Si falla, la solicitud ya llegó:
    // el visitante ve "enviado", pero el motivo queda en los logs de Vercel y en
    // la respuesta ("confirmation") para poder diagnosticarlo.
    let confirmationStatus = "sent";
    try {
        const c = confirmation(base, kind, name, fields, lang);
        const rc = await send({ to: [{ email: replyEmail, name: name || replyEmail }], replyTo: { email: leadsTo, name: "Transarchivos" }, subject: c.subject, htmlContent: c.html, textContent: c.text, tags: [`sitio-${kind}-confirmacion`] });
        if (!rc.ok) {
            const d = await rc.json().catch(() => ({}));
            console.error("Brevo rechazó la confirmación:", rc.status, d);
            confirmationStatus = `failed ${rc.status} ${d.code ?? ""} ${d.message ?? ""}`.trim().slice(0, 200);
        }
    }
    catch (e) {
        console.error("Error al enviar la confirmación:", e);
        confirmationStatus = "failed network";
    }
    return json({ ok: true, confirmation: confirmationStatus });
}
