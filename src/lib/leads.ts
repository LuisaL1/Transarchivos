// Envía una solicitud del sitio a /api/contact (función de Vercel → Brevo →
// correo de la empresa). `fields` se muestra como tabla en el correo.
export type LeadKind = "contacto" | "cotizacion" | "suscripcion";
export type LeadResult = { ok: true } | { ok: false; error: string; detail?: string };

// `lang`: idioma de la página; la confirmación al visitante se envía en ese
// idioma (el correo al equipo de Transarchivos va siempre en español).
export async function sendLead(kind: LeadKind, subject: string, fields: Record<string, string>, replyTo: { email: string; name?: string }, website = "", lang: "es" | "en" = "es"): Promise<LeadResult> {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, subject, fields, replyTo, website, lang }),
    });
    const data = await res.json().catch(() => ({}));
    return res.ok && data.ok ? { ok: true } : { ok: false, error: data.error || `http-${res.status}`, detail: data.detail };
  } catch {
    return { ok: false, error: "network" };
  }
}

// El cotizador crea un ticket en Zoho Desk (/api/ticket, función de Vercel).
export async function sendTicket(subject: string, fields: Record<string, string>, contact: { email: string; name?: string; phone?: string }, website = "", lang: "es" | "en" = "es"): Promise<LeadResult> {
  try {
    const res = await fetch("/api/ticket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, fields, contact, website, lang }),
    });
    const data = await res.json().catch(() => ({}));
    return res.ok && data.ok ? { ok: true } : { ok: false, error: data.error || `http-${res.status}`, detail: data.detail };
  } catch {
    return { ok: false, error: "network" };
  }
}
