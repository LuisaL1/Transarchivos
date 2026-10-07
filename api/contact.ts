// Función de Vercel: recibe las solicitudes del sitio y las envía por correo
// con Brevo (API transaccional). La clave nunca llega al navegador.
//
// Variables de entorno (Vercel → Settings → Environment Variables):
//   BREVO_API_KEY     clave de API de Brevo (obligatoria)
//   LEADS_TO          correo que recibe las solicitudes (por defecto mercadeo@transarchivos.com)
//   LEADS_FROM        remitente verificado en Brevo (por defecto no-reply@transarchivos.com)
//   LEADS_FROM_NAME   nombre del remitente (por defecto "Sitio web Transarchivos")

type Payload = { kind?: string; subject?: string; fields?: Record<string, unknown>; replyTo?: { email?: string; name?: string }; website?: string };

const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const EMAIL = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]{2,}$/;

// Correo de confirmación para el visitante ("recibimos su solicitud")
function confirmation(kind: string, name: string, fields: Record<string, string>) {
  const first = esc(name.split(" ")[0] || "");
  const about = kind === "cotizacion" ? `su solicitud de cotización de <strong>${esc(fields["Servicio"] ?? "nuestros servicios")}</strong>` : `su mensaje (${esc(fields["Motivo"] ?? "contacto")})`;
  const aboutText = kind === "cotizacion" ? `su solicitud de cotización de ${fields["Servicio"] ?? "nuestros servicios"}` : `su mensaje (${fields["Motivo"] ?? "contacto"})`;
  const subject = "Recibimos su solicitud · Transarchivos";
  const html = `<div style="background:#F1F3FB;padding:24px 12px;font-family:Arial,sans-serif;color:#37352F">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #E4E6F7">
<div style="background:#272B7C;padding:22px 26px"><p style="margin:0;color:#FFDE59;font-size:12px;font-weight:bold;letter-spacing:.12em;text-transform:uppercase">Transarchivos Ltda.</p><h1 style="margin:6px 0 0;color:#fff;font-size:20px">¡Recibimos su solicitud!</h1></div>
<div style="padding:24px 26px;font-size:15px;line-height:1.6">
<p style="margin:0 0 12px">Hola${first ? ` ${first}` : ""},</p>
<p style="margin:0 0 12px">Gracias por escribirnos. Recibimos ${about} y un asesor de nuestro equipo le responderá a este correo a la mayor brevedad.</p>
<p style="margin:0 0 18px">Si necesita atención inmediata, puede escribirnos por WhatsApp o llamarnos:</p>
<p style="margin:0 0 6px"><a href="https://wa.me/576013164530" style="color:#272B7C;font-weight:bold">WhatsApp (601) 316-4530</a></p>
<p style="margin:0 0 18px;color:#6B6B6B">Teléfonos: (601) 316-4530 · 324 358 6973</p>
<p style="margin:0;color:#6B6B6B;font-size:12px">Este es un mensaje automático de confirmación. Tratamos sus datos según nuestra <a href="https://www.transarchivos.com/privacidad" style="color:#1800AD">política de privacidad</a>.</p>
</div></div></div>`;
  const text = `Hola${name ? ` ${name.split(" ")[0]}` : ""},\n\nGracias por escribirnos. Recibimos ${aboutText} y un asesor le responderá a este correo a la mayor brevedad.\n\nAtención inmediata: WhatsApp (601) 316-4530 · Teléfonos (601) 316-4530 · 324 358 6973\n\nMensaje automático de Transarchivos Ltda.`;
  return { subject, html, text };
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

  const kind = body.kind === "cotizacion" ? "cotizacion" : "contacto";
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
  const rows = Object.entries(fields).map(([k, v]) => `<tr><td style="padding:8px 12px;border:1px solid #E4E6F7;background:#F7F8FF;font-weight:600;color:#272B7C;vertical-align:top">${esc(k)}</td><td style="padding:8px 12px;border:1px solid #E4E6F7;white-space:pre-wrap">${esc(v)}</td></tr>`).join("");
  const html = `<div style="font-family:Arial,sans-serif;color:#37352F"><h2 style="color:#272B7C;margin:0 0 12px">${esc(subject)}</h2><table style="border-collapse:collapse;font-size:14px">${rows}</table><p style="color:#6B6B6B;font-size:12px;margin-top:16px">Enviado desde el sitio web de Transarchivos. Responda este correo para contestarle directamente a la persona.</p></div>`;
  const text = `${subject}\n\n` + Object.entries(fields).map(([k, v]) => `${k}: ${v}`).join("\n");

  const sender = { email: process.env.LEADS_FROM || "no-reply@transarchivos.com", name: process.env.LEADS_FROM_NAME || "Sitio web Transarchivos" };
  const leadsTo = process.env.LEADS_TO || "mercadeo@transarchivos.com";
  const send = (payload: Record<string, unknown>) => fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": key, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ sender, ...payload }),
  });

  // 1) Solicitud al equipo de Transarchivos (responder = el visitante)
  const name = (body.replyTo?.name ?? "").slice(0, 120);
  const res = await send({
    to: [{ email: leadsTo, name: "Mercadeo Transarchivos" }],
    replyTo: { email: replyEmail, name: name || replyEmail },
    subject, htmlContent: html, textContent: text, tags: [`sitio-${kind}`],
  });
  if (!res.ok) return json({ ok: false, error: "provider", status: res.status }, 502);

  // 2) Confirmación automática al visitante (si falla, la solicitud ya llegó: no se reporta error)
  try {
    const c = confirmation(kind, name, fields);
    await send({ to: [{ email: replyEmail, name: name || replyEmail }], replyTo: { email: leadsTo, name: "Transarchivos" }, subject: c.subject, htmlContent: c.html, textContent: c.text, tags: [`sitio-${kind}-confirmacion`] });
  } catch { /* sin confirmación */ }
  return json({ ok: true });
}
