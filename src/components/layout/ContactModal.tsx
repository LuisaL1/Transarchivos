import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Bi } from "@/components/ui/Icons";
import { CONTACT_REASONS, whatsappUrl } from "@/data/contact";
import { trackEvent } from "@/lib/analytics";
import { sendLead } from "@/lib/leads";

// ─── Formulario de contacto (ventana emergente) ─────────────────────────────
// Reemplaza los enlaces "mailto:" del sitio: cualquier enlace a "#contacto"
// (o "#contacto?motivo=…&mensaje=…") abre esta ventana con esos datos
// precargados. Envía a /api/contact (Brevo → correo de la empresa).
// Incluye la autorización de tratamiento de datos (Ley 1581 de 2012).

type Prefill = { motivo?: string; mensaje?: string; nombre?: string; empresa?: string };
type Status = "idle" | "sending" | "sent" | "error";

export function ContactModal() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nombre: "", empresa: "", email: "", telefono: "", motivo: CONTACT_REASONS[1], mensaje: "", autorizacion: false, website: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [errCode, setErrCode] = useState("");
  const firstRef = useRef<HTMLInputElement>(null);

  // Abre la ventana desde cualquier enlace "#contacto…" del sitio
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a");
      const href = a?.getAttribute("href") ?? "";
      if (!href.startsWith("#contacto")) return;
      e.preventDefault();
      const p = Object.fromEntries(new URLSearchParams(href.split("?")[1] ?? "")) as Prefill;
      setForm(f => ({ ...f, ...(p.motivo && CONTACT_REASONS.includes(p.motivo) ? { motivo: p.motivo } : {}), ...(p.mensaje ? { mensaje: p.mensaje } : {}), ...(p.nombre ? { nombre: p.nombre } : {}), ...(p.empresa ? { empresa: p.empresa } : {}) }));
      setStatus("idle");
      setOpen(true);
      trackEvent("contact_click", { method: "form" });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("menu-open");
    requestAnimationFrame(() => firstRef.current?.focus());
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.classList.remove("menu-open"); window.removeEventListener("keydown", onKey); };
  }, [open]);

  if (!open) return null;
  const set = (k: keyof typeof form, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const r = await sendLead("contacto", `Contacto web — ${form.motivo}`, {
      "Motivo": form.motivo, "Nombre": form.nombre, "Empresa": form.empresa || "—", "Correo": form.email,
      "Teléfono": form.telefono || "—", "Mensaje": form.mensaje, "Autorización de datos": "Sí",
    }, { email: form.email, name: form.nombre }, form.website);
    setStatus(r.ok ? "sent" : "error");
    setErrCode(r.ok ? "" : [r.error, r.detail].filter(Boolean).join(" · "));
    if (r.ok) trackEvent("generate_lead", { method: "formulario", motivo: form.motivo });
  };

  const input = "w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-colors focus:border-[#272B7C] focus:ring-4 focus:ring-[#272B7C]/10";
  const inputStyle = { backgroundColor: "#fff", border: "1.5px solid #DDE0F2", color: "#272B7C" } as const;
  const label = "block text-xs font-semibold mb-1.5";
  const labelStyle = { color: "#272B7C", fontFamily: "Montserrat, sans-serif" } as const;

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div role="presentation" className="absolute inset-0" onClick={() => setOpen(false)} style={{ background: "rgba(39,43,124,0.55)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", animation: "searchFade 0.25s ease both" }} />
      <div role="dialog" aria-modal="true" aria-labelledby="contact-title" className="relative w-full sm:max-w-[560px] max-h-[100dvh] sm:max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl"
        style={{ background: "#fff", boxShadow: "0 40px 90px -30px rgba(10,13,61,0.6)", animation: "searchDrop 0.35s cubic-bezier(0.2, 0.9, 0.3, 1.1) both" }}>
        <div className="relative px-6 pt-5 pb-5 overflow-hidden" style={{ background: "#272B7C" }}>
          <span aria-hidden="true" className="absolute pointer-events-none" style={{ top: -36, right: -36, width: 110, height: 110, background: "rgba(255,222,89,0.22)", transform: "rotate(45deg)", borderRadius: 19 }} />
          <p id="contact-title" className="relative flex items-center gap-2 text-lg font-bold" style={{ color: "#fff", fontFamily: "Poppins, sans-serif" }}>
            <Bi n="envelope-paper" size={18} color="#FFDE59" /> Escríbanos
          </p>
          <p className="relative text-sm mt-1" style={{ color: "rgba(255,255,255,0.75)" }}>Déjenos sus datos y un asesor de Transarchivos le responde.</p>
          <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar formulario" className="absolute top-4 right-4 grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-white/15">
            <Bi n="x-lg" size={14} color="#fff" />
          </button>
        </div>

        {status === "sent" ? (
          <div className="px-6 py-10 text-center">
            <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full" style={{ background: "#EAF7EE" }}><Bi n="check-lg" size={26} color="#16a34a" /></span>
            <p className="text-lg font-bold mb-1" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>¡Mensaje enviado!</p>
            <p className="text-sm mb-6" style={{ color: "#6B6B6B" }}>Recibimos su solicitud. Un asesor le responderá a {form.email}.</p>
            <button type="button" onClick={() => setOpen(false)} className="px-6 py-3 rounded-xl text-sm font-bold" style={{ background: "#272B7C", color: "#fff", fontFamily: "Montserrat, sans-serif" }}>Cerrar</button>
          </div>
        ) : (
          <form onSubmit={submit} className="px-6 py-5">
            <div className="grid sm:grid-cols-2 gap-x-4 gap-y-3.5">
              <div>
                <label htmlFor="ct-nombre" className={label} style={labelStyle}>Nombre *</label>
                <input ref={firstRef} id="ct-nombre" required autoComplete="name" value={form.nombre} onChange={e => set("nombre", e.target.value)} className={input} style={inputStyle} />
              </div>
              <div>
                <label htmlFor="ct-empresa" className={label} style={labelStyle}>Empresa</label>
                <input id="ct-empresa" autoComplete="organization" value={form.empresa} onChange={e => set("empresa", e.target.value)} className={input} style={inputStyle} />
              </div>
              <div>
                <label htmlFor="ct-email" className={label} style={labelStyle}>Correo electrónico *</label>
                <input id="ct-email" type="email" required autoComplete="email" value={form.email} onChange={e => set("email", e.target.value)} className={input} style={inputStyle} />
              </div>
              <div>
                <label htmlFor="ct-telefono" className={label} style={labelStyle}>Teléfono</label>
                <input id="ct-telefono" type="tel" autoComplete="tel" value={form.telefono} onChange={e => set("telefono", e.target.value)} className={input} style={inputStyle} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="ct-motivo" className={label} style={labelStyle}>Motivo *</label>
                <select id="ct-motivo" required value={form.motivo} onChange={e => set("motivo", e.target.value)} className={input} style={inputStyle}>
                  {CONTACT_REASONS.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="ct-mensaje" className={label} style={labelStyle}>Mensaje *</label>
                <textarea id="ct-mensaje" required rows={4} maxLength={3000} value={form.mensaje} onChange={e => set("mensaje", e.target.value)} placeholder="Cuéntenos qué necesita…" className={`${input} resize-none`} style={inputStyle} />
              </div>
            </div>
            {/* Campo trampa para bots (oculto a personas) */}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={e => set("website", e.target.value)} aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />
            <label htmlFor="ct-autorizacion" className="mt-4 flex items-start gap-2.5 text-xs cursor-pointer" style={{ color: "#4B4B4B", lineHeight: 1.55 }}>
              <input id="ct-autorizacion" type="checkbox" required checked={form.autorizacion} onChange={e => set("autorizacion", e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#272B7C]" />
              <span>Autorizo a Transarchivos Ltda. a tratar mis datos personales para responder esta solicitud, según su <Link to="/privacidad" target="_blank" style={{ color: "#1800AD", fontWeight: 600 }}>política de privacidad y tratamiento de datos</Link>.</span>
            </label>
            {status === "error" && (
              <p role="alert" className="mt-4 rounded-xl px-3.5 py-3 text-xs" style={{ background: "#FFF6D6", color: "#8A6D00", lineHeight: 1.55 }}>
                No pudimos enviar su mensaje en este momento. Intente de nuevo o escríbanos por <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" style={{ color: "#272B7C", fontWeight: 700 }}>WhatsApp</a>.
                {errCode && <span className="block mt-1.5 opacity-70" style={{ fontSize: 10 }}>Código: {errCode}</span>}
              </p>
            )}
            <button type="submit" disabled={status === "sending"} className="mt-5 w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-opacity disabled:opacity-60"
              style={{ background: "#272B7C", color: "#fff", fontFamily: "Montserrat, sans-serif" }}>
              {status === "sending" ? "Enviando…" : <>Enviar mensaje <Bi n="send" size={14} color="#FFDE59" /></>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
