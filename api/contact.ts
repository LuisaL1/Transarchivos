// Función de Vercel: recibe las solicitudes del sitio y las envía por correo
// con Brevo (API transaccional). La clave nunca llega al navegador.
//
// Variables de entorno (Vercel → Settings → Environment Variables):
//   BREVO_API_KEY     clave de API de Brevo (obligatoria)
//   LEADS_TO          correo que recibe las solicitudes (por defecto info@transarchivos.com)
//   LEADS_FROM        remitente verificado en Brevo (por defecto no-reply@transarchivos.com)
//   LEADS_FROM_NAME   nombre del remitente (por defecto "Sitio web Transarchivos")

type Payload = { kind?: string; subject?: string; fields?: Record<string, unknown>; replyTo?: { email?: string; name?: string }; website?: string };

const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const EMAIL = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]{2,}$/;

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

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": key, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      sender: { email: process.env.LEADS_FROM || "no-reply@transarchivos.com", name: process.env.LEADS_FROM_NAME || "Sitio web Transarchivos" },
      to: [{ email: process.env.LEADS_TO || "info@transarchivos.com", name: "Transarchivos" }],
      replyTo: { email: replyEmail, name: (body.replyTo?.name ?? "").slice(0, 120) || replyEmail },
      subject, htmlContent: html, textContent: text,
      tags: [`sitio-${kind}`],
    }),
  });
  if (!res.ok) return json({ ok: false, error: "provider", status: res.status }, 502);
  return json({ ok: true });
}
