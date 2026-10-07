// Envía una solicitud del sitio a /api/contact (función de Vercel → Brevo →
// correo de la empresa). `fields` se muestra como tabla en el correo.
export type LeadKind = "contacto" | "cotizacion";
export type LeadResult = { ok: true } | { ok: false; error: string };

export async function sendLead(kind: LeadKind, subject: string, fields: Record<string, string>, replyTo: { email: string; name?: string }, website = ""): Promise<LeadResult> {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, subject, fields, replyTo, website }),
    });
    const data = await res.json().catch(() => ({}));
    return res.ok && data.ok ? { ok: true } : { ok: false, error: data.error || `http-${res.status}` };
  } catch {
    return { ok: false, error: "network" };
  }
}
