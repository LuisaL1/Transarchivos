// Función de Vercel: recibe las solicitudes del sitio y las envía por correo
// con Brevo (API transaccional). La clave nunca llega al navegador.
//
// Variables de entorno (Vercel → Settings → Environment Variables):
//   BREVO_API_KEY     clave de API de Brevo (obligatoria)
//   LEADS_TO          correo comercial: cotizador y motivos comerciales (por defecto mercadeo@transarchivos.com)
//   LEADS_TO_NEWSLETTER correo que recibe las suscripciones al blog (por defecto marketing@transarchivos.com)
//   LEADS_TO_GENERAL  correo general: soporte, PQRS, datos personales, empleo y otros (por defecto info@transarchivos.com)
//   LEADS_FROM        remitente verificado en Brevo (por defecto mercadeo@transarchivos.com)
//   LEADS_FROM_NAME   nombre del remitente (por defecto "Transarchivos")

type Payload = { kind?: string; subject?: string; fields?: Record<string, unknown>; replyTo?: { email?: string; name?: string }; website?: string };

const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const EMAIL = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]{2,}$/;

// Plantilla de correo: banner en imagen (azul + logo + detalle de esquina; las
// imágenes no se alteran en el modo oscuro de Gmail), cuerpo en tabla.
function layout(base: string, title: string, inner: string) {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light only"></head>
<body style="margin:0;padding:0;background:#F1F3FB">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#F1F3FB" style="background:#F1F3FB"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #E4E6F7">
<tr><td bgcolor="#272B7C" style="background:#272B7C;line-height:0"><img src="${base}/brand/email-header.png" width="560" alt="Transarchivos Ltda." style="display:block;width:100%;max-width:560px;height:auto;border:0"></td></tr>
<tr><td style="padding:26px 28px 6px;font-family:Arial,sans-serif"><h1 style="margin:0;color:#272B7C;font-size:21px;line-height:1.3">${title}</h1></td></tr>
<tr><td style="padding:12px 28px 26px;font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#37352F">${inner}</td></tr>
<tr><td bgcolor="#F7F8FF" style="background:#F7F8FF;padding:14px 28px;font-family:Arial,sans-serif;font-size:12px;color:#6B6B6B;border-top:1px solid #E4E6F7">Transarchivos Ltda. · Cl. 21 # 39A-40, Bogotá · (601) 316-4530</td></tr>
</table></td></tr></table></body></html>`;
}

// Correo de confirmación para el visitante ("recibimos su solicitud")
function confirmation(base: string, kind: string, name: string, fields: Record<string, string>) {
  const first = esc(name.split(" ")[0] || "");
  if (kind === "suscripcion") {
    const subject = "Suscripción confirmada · Transarchivos";
    const html = layout(base, "¡Gracias por suscribirse!", `
<p style="margin:0 0 12px">Hola,</p>
<p style="margin:0 0 12px">Su correo quedó registrado para recibir las novedades y guías sobre gestión documental de Transarchivos.</p>
<p style="margin:0 0 18px">Si no solicitó esta suscripción o desea cancelarla, responda este correo con la palabra «Cancelar».</p>
<p style="margin:0;color:#6B6B6B;font-size:12px">Tratamos sus datos según nuestra <a href="https://www.transarchivos.com/privacidad" style="color:#1800AD">política de privacidad</a>.</p>`);
    const text = "Su correo quedó registrado para recibir las novedades y guías de Transarchivos. Para cancelar, responda este correo con la palabra «Cancelar».";
    return { subject, html, text };
  }
  const about = kind === "cotizacion" ? `su solicitud de cotización de <strong>${esc(fields["Servicio"] ?? "nuestros servicios")}</strong>` : `su mensaje (${esc(fields["Motivo"] ?? "contacto")})`;
  const aboutText = kind === "cotizacion" ? `su solicitud de cotización de ${fields["Servicio"] ?? "nuestros servicios"}` : `su mensaje (${fields["Motivo"] ?? "contacto"})`;
  const subject = "Recibimos su solicitud · Transarchivos";
  const html = layout(base, "¡Recibimos su solicitud!", `
<p style="margin:0 0 12px">Hola${first ? ` ${first}` : ""},</p>
<p style="margin:0 0 12px">Gracias por escribirnos. Recibimos ${about} y un asesor de nuestro equipo le responderá a este correo a la mayor brevedad.</p>
<p style="margin:0 0 16px">Si necesita atención inmediata, escríbanos por WhatsApp o llámenos:</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#272B7C" style="background:#272B7C;border-radius:10px"><a href="https://wa.me/573243586973" style="display:inline-block;padding:11px 20px;color:#ffffff;font-weight:bold;text-decoration:none;font-family:Arial,sans-serif;font-size:14px">WhatsApp 324 358 6973</a></td></tr></table>
<p style="margin:14px 0 18px;color:#6B6B6B">Teléfonos: (601) 316-4530 · 324 358 6973</p>
<p style="margin:0;color:#6B6B6B;font-size:12px">Este es un mensaje automático de confirmación. Tratamos sus datos según nuestra <a href="https://www.transarchivos.com/privacidad" style="color:#1800AD">política de privacidad</a>.</p>`);
  const text = `Hola${name ? ` ${name.split(" ")[0]}` : ""},\n\nGracias por escribirnos. Recibimos ${aboutText} y un asesor le responderá a este correo a la mayor brevedad.\n\nAtención inmediata: WhatsApp 324 358 6973 · Teléfonos (601) 316-4530 · 324 358 6973\n\nMensaje automático de Transarchivos Ltda.`;
  return { subject, html, text };
}

export async function GET(): Promise<Response> {
  const key = process.env.BREVO_API_KEY;
  if (!key) return json({ configured: false });
  const r = await fetch("https://api.brevo.com/v3/account", { headers: { "api-key": key, Accept: "application/json" } }).catch(() => null);
  const d = r ? await r.json().catch(() => ({})) as { code?: string; message?: string } : {};
  return json({ configured: true, brevo: r?.ok ? "ok" : `${r?.status ?? "sin respuesta"} ${d.code ?? ""} ${d.message ?? ""}`.trim(), from: process.env.LEADS_FROM || "mercadeo@transarchivos.com", to: process.env.LEADS_TO || "mercadeo@transarchivos.com", toNewsletter: process.env.LEADS_TO_NEWSLETTER || "marketing@transarchivos.com", toGeneral: process.env.LEADS_TO_GENERAL || "info@transarchivos.com" });
}

export async function POST(req: Request): Promise<Response> {
  // Solo desde el propio sitio
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host && new URL(origin).host !== host) return json({ ok: false, error: "origin" }, 403);

  let body: Payload;
  try { body = await req.json(); } catch { return json({ ok: false, error: "json" }, 400); }

  // Campo trampa para bots: si viene lleno, se responde OK sin enviar nada.
  if (body.website) return json({ ok: true });

  const kind = body.kind === "cotizacion" ? "cotizacion" : body.kind === "suscripcion" ? "suscripcion" : "contacto";
  const fields = Object.fromEntries(
    Object.entries(body.fields ?? {})
      .filter(([k, v]) => typeof v === "string" && k.length <= 60)
      .map(([k, v]) => [k, (v as string).trim().slice(0, 4000)]),
  ) as Record<string, string>;
  const replyEmail = (body.replyTo?.email ?? "").trim();
  if (!EMAIL.test(replyEmail)) return json({ ok: false, error: "email" }, 422);
  if (Object.keys(fields).length === 0 || Object.keys(fields).length > 40) return json({ ok: false, error: "fields" }, 422);
  if (fields["Autorización de datos"] !== "Sí") return json({ ok: false, error: "consent" }, 422);

  const key = process.env.BREVO_API_KEY;
  if (!key) return json({ ok: false, error: "not-configured" }, 503);

  const subject = (body.subject ?? (kind === "cotizacion" ? "Solicitud de cotización" : "Nuevo mensaje de contacto")).slice(0, 150);
  // URL pública del sitio (para el banner): el dominio desde el que llegó la solicitud
  const base = `https://${host ?? "www.transarchivos.com"}`;
  const rows = Object.entries(fields).map(([k, v]) => `<tr><td style="padding:9px 12px;border:1px solid #E4E6F7;background:#F7F8FF;font-weight:bold;color:#272B7C;vertical-align:top;width:38%">${esc(k)}</td><td style="padding:9px 12px;border:1px solid #E4E6F7;white-space:pre-wrap">${esc(v)}</td></tr>`).join("");
  const html = layout(base, esc(subject), `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px">${rows}</table><p style="color:#6B6B6B;font-size:12px;margin:16px 0 0">Enviado desde el formulario del sitio web. Responda este correo para contestarle directamente a la persona.</p>`);
  const text = `${subject}\n\n` + Object.entries(fields).map(([k, v]) => `${k}: ${v}`).join("\n");

  const sender = { email: process.env.LEADS_FROM || "mercadeo@transarchivos.com", name: process.env.LEADS_FROM_NAME || "Transarchivos" };
  // Destino según el motivo: lo comercial a mercadeo, lo demás al correo general.
  const COMMERCIAL = ["Solicitar una cotización", "Información sobre un servicio"];
  const commercial = kind === "cotizacion" || COMMERCIAL.includes(fields["Motivo"] ?? "");
  const leadsTo = kind === "suscripcion" ? (process.env.LEADS_TO_NEWSLETTER || "marketing@transarchivos.com")
    : commercial ? (process.env.LEADS_TO || "mercadeo@transarchivos.com") : (process.env.LEADS_TO_GENERAL || "info@transarchivos.com");
  const send = (payload: Record<string, unknown>) => fetch("https://api.brevo.com/v3/smtp/email", {
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
    const detail = await res.json().catch(() => ({})) as { code?: string; message?: string };
    console.error("Brevo rechazó el envío:", res.status, detail);
    return json({ ok: false, error: "provider", status: res.status, detail: `${detail.code ?? ""} ${detail.message ?? ""}`.trim().slice(0, 200) }, 502);
  }

  // 2) Confirmación automática al visitante (si falla, la solicitud ya llegó: no se reporta error)
  try {
    const c = confirmation(base, kind, name, fields);
    await send({ to: [{ email: replyEmail, name: name || replyEmail }], replyTo: { email: leadsTo, name: "Transarchivos" }, subject: c.subject, htmlContent: c.html, textContent: c.text, tags: [`sitio-${kind}-confirmacion`] });
  } catch { /* sin confirmación */ }
  return json({ ok: true });
}
