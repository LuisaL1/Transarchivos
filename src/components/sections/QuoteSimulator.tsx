import { useState, useEffect } from "react";
import { trackEvent } from "@/lib/analytics";
import { useLocation } from "react-router-dom";
import { track } from "@/lib/joel";
import { Bi, MenuIcon } from "@/components/ui/Icons";
import { QUOTE_SECTORS, QUOTE_URGENCY, quoteConfig } from "@/data/quote";
import { services } from "@/data/services";
import { SOLUTIONS, SOLUTIONS_ICON } from "@/data/solutions";

export function QuoteSimulator() {
  const [selected, setSelected] = useState("diagnostico");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [contact, setContact] = useState<Record<string, string>>({});
  // Llegada desde "Cotizar esta solución" o desde la página de un servicio:
  // ?servicio=<slug>&solucion=<id> deja el servicio ya elegido y abre
  // directamente el paso "Detalles", con el contexto de la solución.
  const location = useLocation();
  const [solution, setSolution] = useState<string | null>(null);
  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    const sv = sp.get("servicio");
    if (!sv || !(sv === "diagnostico" || services.some(x => x.slug === sv))) return;
    setSelected(sv); setAnswers({}); setStep(1);
    setSolution(sp.get("solucion"));
    track("quote", sv);
  }, [location.search, location.key]);
  const solutionInfo = solution ? SOLUTIONS.find(x => x.id === solution) : undefined;

  const cfg = quoteConfig[selected];
  const svc = services.find(s => s.slug === selected);
  const title = svc ? svc.title : "Diagnóstico documental";
  const accent = svc ? svc.accent : "#C8960A";
  const icon = svc ? svc.icon : "search";

  // Pasos: 0 Servicio · 1 Detalles · 2 Contacto · 3 Resumen. Cambiar de
  // servicio borra las respuestas (cada servicio tiene sus propias preguntas).
  const pick = (id: string, goTo = step) => { if (id !== selected) { setAnswers({}); if (solutionInfo && !solutionInfo.slugs.includes(id)) setSolution(null); } setSelected(id); setStep(goTo); track("quote", id); };
  const setA = (k: string, v: string) => setAnswers(a => ({ ...a, [k]: v }));
  const setC = (k: string, v: string) => setContact(c => ({ ...c, [k]: v }));

  const unknownCount = cfg.fields.filter(f => (answers[f.key] ?? "").toLowerCase().startsWith("no l") || (answers[f.key] ?? "").toLowerCase().startsWith("no estoy")).length;
  const missingVolume = !(answers.volume ?? "").trim();
  const special = answers.urgencia === "Urgente" || (answers.especiales ?? "").trim().length > 0;
  const nextStep = missingVolume || unknownCount >= 2
    ? { t: "Completar la información", d: "Faltan variables críticas. Un asesor le pedirá los datos restantes o programará una visita o levantamiento antes de cotizar.", ic: "question-circle-fill", c: "#C8960A" }
    : special
      ? { t: "Validación de Operaciones", d: "Su solicitud tiene una condición especial. Comercial y Operaciones la validarán antes de comprometer alcance y tiempos.", ic: "shield-fill-exclamation", c: "#1800AD" }
      : { t: "Cotización según parámetros", d: "La información es suficiente. Comercial elaborará la cotización con el alcance y las condiciones definidas.", ic: "check-circle-fill", c: "#16a34a" };

  // Completitud "en vivo": cuántas de las variables que el documento marca
  // como mínimas (volumen + campos del servicio + ubicación + urgencia) ya
  // tiene el cliente respondidas — no es un precio, es transparencia sobre
  // qué tan lista está la solicitud para cotizarse, sin esperar a un asesor.
  const requiredKeys = ["volume", ...cfg.fields.map(f => f.key), "ubicacion", "urgencia"];
  const answeredCount = requiredKeys.filter(k => (answers[k] ?? "").trim()).length;
  const completPct = Math.round((answeredCount / requiredKeys.length) * 100);

  const summary: [string, string][] = [
    [cfg.volumeLabel, answers.volume || "—"],
    ...cfg.fields.map(f => [f.label, answers[f.key] || "—"] as [string, string]),
    ["Ubicación", answers.ubicacion || "—"],
    ["Urgencia", answers.urgencia || "—"],
    ["Requerimientos especiales", answers.especiales || "Ninguno"],
  ];
  const contactRows: [string, string][] = [
    ["Empresa", contact.empresa || "—"], ["Sector", contact.sector || "—"],
    ["Contacto", `${contact.nombre || "—"}${contact.cargo ? " · " + contact.cargo : ""}`],
    ["Correo", contact.email || "—"], ["Teléfono", contact.telefono || "—"],
  ];
  const mailto = () => {
    const body =
      `Solicitud de cotización — ${title}\n` + (solutionInfo ? `Solución de interés: ${solutionInfo.title}\n` : "") + `\nDATOS DE LA SOLICITUD\n` +
      summary.map(([k, v]) => `- ${k}: ${v}`).join("\n") +
      `\n\nCONTACTO\n` + contactRows.map(([k, v]) => `- ${k}: ${v}`).join("\n") +
      `\n\nSiguiente paso sugerido: ${nextStep.t}`;
    return `mailto:info@transarchivos.com?subject=${encodeURIComponent("Solicitud de cotización — " + title)}&body=${encodeURIComponent(body)}`;
  };

  const inputCls = "w-full px-3.5 py-3 rounded-xl text-sm outline-none transition-colors focus:border-[#272B7C] focus:ring-4 focus:ring-[#272B7C]/10";
  const inputStyle = { backgroundColor: "#fff", border: "1.5px solid #DDE0F2", color: "#272B7C" } as const;
  const labelCls = "block text-xs font-semibold mb-1.5";
  const labelStyle = { color: "#272B7C", fontFamily: "Montserrat, sans-serif" } as const;

  const units = [
    { slug: "diagnostico", icon: "search", title: "Diagnóstico documental", desc: "¿No sabe qué servicio necesita? Empiece por entender qué está pasando con su archivo.", accent: "#C8960A" },
    ...services,
  ];
  const STEPS = ["Servicio", "Detalles", "Contacto", "Resumen"];
  const primaryBtn = "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90 cursor-pointer";
  const secondaryBtn = "inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold cursor-pointer";
  const answeredRows = summary.filter(([, v]) => v !== "—" && v !== "Ninguno");

  return (
    <section id="cotizador" className="relative max-w-6xl mx-auto px-6 py-16" style={{ scrollMarginTop: 80 }}>
      <p className="text-xs font-bold uppercase tracking-widest text-center mb-3" style={{ color: "#9B9B9B", fontFamily: "Montserrat, sans-serif" }}>
        Solicite su cotización
      </p>
      <h2 className="text-3xl font-bold text-center mb-4" style={{ fontFamily: "Poppins, sans-serif", color: "#272B7C" }}>
        Cuéntenos qué necesita y arme su solicitud
      </h2>
      <p className="text-sm text-center max-w-xl mx-auto mb-10" style={{ color: "#9B9B9B" }}>
        Cuatro pasos cortos. Verá cómo se arma su solicitud antes de enviarla a nuestro equipo comercial.
      </p>

      <div className="rounded-3xl overflow-hidden" style={{ background: "#fff", border: "1.5px solid #E4E6F7", boxShadow: "0 30px 60px -34px rgba(39,43,124,0.3)" }}>
        {/* Pasos */}
        <div className="px-5 md:px-8 py-5" style={{ borderBottom: "1px solid #ECEEF6", background: "#FAFBFF" }}>
          <ol className="grid grid-cols-4 gap-2">
            {STEPS.map((n, i) => {
              const done = i < step, on = i === step;
              return (
                <li key={n}>
                  <button type="button" disabled={i > step} onClick={() => setStep(i)}
                    className="w-full flex flex-col sm:flex-row items-center gap-2 text-left disabled:cursor-default">
                    <span className="flex items-center justify-center rounded-full font-bold shrink-0" style={{
                      width: 30, height: 30, fontSize: 12, fontFamily: "Poppins, sans-serif",
                      background: done || on ? "#272B7C" : "#fff", color: done || on ? "#fff" : "#B5B9D6",
                      border: `2px solid ${done || on ? "#272B7C" : "#E4E6F7"}`,
                    }}>
                      {done ? <Bi n="check-lg" size={13} color="#fff" /> : i + 1}
                    </span>
                    <span className="text-[11px] sm:text-xs font-semibold" style={{ color: on ? "#272B7C" : done ? "#6B6B6B" : "#B5B9D6", fontFamily: "Montserrat, sans-serif" }}>{n}</span>
                    {i < STEPS.length - 1 && <span className="hidden sm:block flex-1 h-0.5 rounded-full" style={{ background: done ? "#272B7C" : "#E4E6F7" }} />}
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Contenido del paso */}
          <div className="p-5 md:p-8" key={step} style={{ animation: "fadeInUp 0.3s ease both" }}>
            {step === 0 && (
              <>
                <p className="text-lg font-bold mb-1" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>¿Qué servicio necesita?</p>
                <p className="text-sm mb-5" style={{ color: "#8A8A8A" }}>Si no está seguro, elija el diagnóstico documental.</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {units.map(u => {
                    const on = u.slug === selected;
                    return (
                      <button key={u.slug} type="button" onClick={() => pick(u.slug, 0)}
                        className="relative flex items-start gap-3 text-left p-3.5 rounded-2xl transition-all cursor-pointer hover:-translate-y-0.5"
                        style={{ border: `1.5px solid ${on ? u.accent : "#ECEEF6"}`, background: on ? `${u.accent}0D` : "#fff", boxShadow: on ? `0 10px 24px -16px ${u.accent}` : "none" }}>
                        <span className="flex items-center justify-center rounded-xl shrink-0" style={{ width: 38, height: 38, background: on ? u.accent : `${u.accent}14`, transition: "background 0.2s" }}>
                          <Bi n={u.icon} size={17} color={on ? "#fff" : u.accent} />
                        </span>
                        <span className="min-w-0 pr-5">
                          <span className="block text-sm font-semibold leading-tight mb-0.5" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif" }}>{u.title}</span>
                          <span className="block text-[11px] leading-snug line-clamp-2" style={{ color: "#8A8A8A" }}>{u.desc}</span>
                        </span>
                        {on && <Bi n="check-circle-fill" size={16} color={u.accent} className="absolute top-3 right-3" />}
                      </button>
                    );
                  })}
                </div>
                <div className="flex justify-end mt-6">
                  <button type="button" onClick={() => setStep(1)} className={primaryBtn} style={{ background: "#272B7C", color: "#fff", fontFamily: "Montserrat, sans-serif" }}>
                    Continuar <Bi n="arrow-right" size={15} color="#fff" />
                  </button>
                </div>
              </>
            )}

            {step === 1 && (
              <form onSubmit={e => { e.preventDefault(); setStep(2); }}>
                {solutionInfo && (
                  <div className="flex items-start gap-3 rounded-2xl p-3.5 mb-5" style={{ background: "#F7F8FF", border: "1px solid #E4E6F7" }}>
                    <MenuIcon n={SOLUTIONS_ICON[solutionInfo.id] ?? "lightbulb"} size={34} />
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#C8960A", fontFamily: "Montserrat, sans-serif" }}>Solución: {solutionInfo.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: "#6B6B6B" }}>
                        {solutionInfo.slugs.length > 1 ? "Esta solución combina varios servicios. Está cotizando el principal; puede cambiar:" : "Está cotizando el servicio que compone esta solución."}
                      </p>
                      {solutionInfo.slugs.length > 1 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {solutionInfo.slugs.map(sl => {
                            const o = services.find(x => x.slug === sl); const on = sl === selected;
                            return o ? (
                              <button key={sl} type="button" onClick={() => pick(sl, 1)} className="text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors"
                                style={{ background: on ? "#272B7C" : "#fff", color: on ? "#fff" : "#272B7C", border: "1px solid #DDE0F2", fontFamily: "Montserrat, sans-serif" }}>{o.title}</button>
                            ) : null;
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <p className="text-lg font-bold mb-1" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>Cuéntenos sobre su archivo</p>
                <p className="text-sm mb-5" style={{ color: "#8A8A8A" }}>Si no conoce algún dato, elija "No lo sé": un asesor le ayudará a completarlo.</p>
                <div className="grid sm:grid-cols-2 gap-x-4 gap-y-4">
                  <div className="sm:col-span-2">
                    <label className={labelCls} style={labelStyle}>{cfg.volumeLabel}</label>
                    <input value={answers.volume ?? ""} onChange={e => setA("volume", e.target.value)} placeholder={cfg.volumePlaceholder} className={inputCls} style={inputStyle} />
                  </div>
                  {cfg.fields.map((f, i) => (
                    <div key={f.key} className={i === cfg.fields.length - 1 && cfg.fields.length % 2 === 1 ? "sm:col-span-2" : ""}>
                      <label className={labelCls} style={labelStyle}>{f.label}</label>
                      <select value={answers[f.key] ?? ""} onChange={e => setA(f.key, e.target.value)} className={inputCls} style={inputStyle}>
                        <option value="">Seleccione…</option>
                        {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                  <div>
                    <label className={labelCls} style={labelStyle}>Ubicación (ciudad y sede)</label>
                    <input value={answers.ubicacion ?? ""} onChange={e => setA("ubicacion", e.target.value)} placeholder="Ej.: Bogotá, sede principal" className={inputCls} style={inputStyle} />
                  </div>
                  <div>
                    <label className={labelCls} style={labelStyle}>Nivel de urgencia</label>
                    <div className="grid grid-cols-3 gap-2">
                      {QUOTE_URGENCY.map(o => {
                        const on = answers.urgencia === o;
                        return (
                          <button key={o} type="button" onClick={() => setA("urgencia", o)}
                            className="px-2 py-2.5 rounded-xl text-[11px] font-semibold leading-tight transition-colors"
                            style={{ border: `1.5px solid ${on ? "#272B7C" : "#DDE0F2"}`, background: on ? "#272B7C" : "#fff", color: on ? "#fff" : "#272B7C", fontFamily: "Montserrat, sans-serif" }}>{o}</button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls} style={labelStyle}>Requerimientos especiales <span style={{ color: "#9B9B9B", fontWeight: 400 }}>(opcional)</span></label>
                    <textarea value={answers.especiales ?? ""} onChange={e => setA("especiales", e.target.value)} rows={2} placeholder="Restricciones, características del material, otra información…" className={`${inputCls} resize-none`} style={inputStyle} />
                  </div>
                </div>
                <div className="flex justify-between gap-3 mt-6">
                  <button type="button" onClick={() => setStep(0)} className={secondaryBtn} style={{ background: "#fff", color: "#272B7C", border: "1.5px solid #DDE0F2", fontFamily: "Montserrat, sans-serif" }}>
                    <Bi n="arrow-left" size={14} color="#272B7C" /> Atrás
                  </button>
                  <button type="submit" className={primaryBtn} style={{ background: "#272B7C", color: "#fff", fontFamily: "Montserrat, sans-serif" }}>
                    Continuar <Bi n="arrow-right" size={15} color="#fff" />
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={e => { e.preventDefault(); setStep(3); }}>
                <p className="text-lg font-bold mb-1" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>¿A quién contactamos?</p>
                <p className="text-sm mb-5" style={{ color: "#8A8A8A" }}>Usaremos estos datos solo para responder su solicitud.</p>
                <div className="grid sm:grid-cols-2 gap-x-4 gap-y-4">
                  <div>
                    <label className={labelCls} style={labelStyle}>Empresa</label>
                    <input required value={contact.empresa ?? ""} onChange={e => setC("empresa", e.target.value)} className={inputCls} style={inputStyle} />
                  </div>
                  <div>
                    <label className={labelCls} style={labelStyle}>Sector económico</label>
                    <select required value={contact.sector ?? ""} onChange={e => setC("sector", e.target.value)} className={inputCls} style={inputStyle}>
                      <option value="">Seleccione…</option>
                      {QUOTE_SECTORS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls} style={labelStyle}>Su nombre</label>
                    <input required value={contact.nombre ?? ""} onChange={e => setC("nombre", e.target.value)} className={inputCls} style={inputStyle} />
                  </div>
                  <div>
                    <label className={labelCls} style={labelStyle}>Cargo</label>
                    <input required value={contact.cargo ?? ""} onChange={e => setC("cargo", e.target.value)} className={inputCls} style={inputStyle} />
                  </div>
                  <div>
                    <label className={labelCls} style={labelStyle}>Correo electrónico</label>
                    <input required type="email" value={contact.email ?? ""} onChange={e => setC("email", e.target.value)} className={inputCls} style={inputStyle} />
                  </div>
                  <div>
                    <label className={labelCls} style={labelStyle}>Teléfono</label>
                    <input required type="tel" value={contact.telefono ?? ""} onChange={e => setC("telefono", e.target.value)} className={inputCls} style={inputStyle} />
                  </div>
                </div>
                <div className="flex justify-between gap-3 mt-6">
                  <button type="button" onClick={() => setStep(1)} className={secondaryBtn} style={{ background: "#fff", color: "#272B7C", border: "1.5px solid #DDE0F2", fontFamily: "Montserrat, sans-serif" }}>
                    <Bi n="arrow-left" size={14} color="#272B7C" /> Atrás
                  </button>
                  <button type="submit" className={primaryBtn} style={{ background: "#272B7C", color: "#fff", fontFamily: "Montserrat, sans-serif" }}>
                    Ver resumen <Bi n="arrow-right" size={15} color="#fff" />
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <div>
                <p className="text-lg font-bold mb-1" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>Revise y envíe su solicitud</p>
                <p className="text-sm mb-5" style={{ color: "#8A8A8A" }}>Se abrirá su correo con la solicitud lista para enviar a info@transarchivos.com.</p>
                <div className="flex items-start gap-3 rounded-2xl p-4 mb-5" style={{ background: `${nextStep.c}10`, border: `1px solid ${nextStep.c}33` }}>
                  <Bi n={nextStep.ic} size={20} color={nextStep.c} style={{ marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <p className="text-sm font-bold" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>Siguiente paso: {nextStep.t}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#6B6B6B", lineHeight: 1.55 }}>{nextStep.d}</p>
                  </div>
                </div>
                <div className="rounded-2xl p-4 mb-5 grid sm:grid-cols-2 gap-x-6 gap-y-2" style={{ border: "1px solid #ECEEF6" }}>
                  {contactRows.map(([k, v]) => (
                    <div key={k} className="text-xs">
                      <span className="block" style={{ color: "#9B9B9B" }}>{k}</span>
                      <span className="block font-semibold" style={{ color: "#272B7C" }}>{v}</span>
                    </div>
                  ))}
                </div>
                {cfg.next.length > 0 && (
                  <div className="mb-6">
                    <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: "#9B9B9B", fontFamily: "Montserrat, sans-serif" }}>También podría necesitar</p>
                    <div className="flex flex-wrap gap-2">
                      {cfg.next.map(n => {
                        const o = services.find(x => x.slug === n);
                        return o ? (
                          <button key={n} type="button" onClick={() => pick(n, 1)} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full cursor-pointer"
                            style={{ background: "#fff", color: "#272B7C", border: "1px solid #DDE0F2", fontFamily: "Montserrat, sans-serif" }}>
                            <Bi n={o.icon} size={12} color={o.accent} />{o.title}
                          </button>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
                <div className="flex flex-col-reverse sm:flex-row justify-between gap-3">
                  <button type="button" onClick={() => setStep(2)} className={secondaryBtn} style={{ background: "#fff", color: "#272B7C", border: "1.5px solid #DDE0F2", fontFamily: "Montserrat, sans-serif" }}>
                    <Bi n="arrow-left" size={14} color="#272B7C" /> Modificar datos
                  </button>
                  <a href={mailto()} onClick={() => trackEvent("generate_lead", { method: "cotizador", service: selected, solution: solution ?? undefined })} className={primaryBtn} style={{ background: "#272B7C", color: "#fff", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
                    <Bi n="envelope-arrow-up" size={16} color="#fff" /> Enviar solicitud por correo
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Resumen en vivo */}
          <aside className="p-5 md:p-7 lg:border-l" style={{ borderColor: "#ECEEF6", background: "#FAFBFF" }}>
            <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: "#9B9B9B", fontFamily: "Montserrat, sans-serif" }}>Su solicitud</p>
            <div className="flex items-center gap-3 rounded-2xl p-3 mb-4" style={{ background: "#fff", border: "1px solid #ECEEF6" }}>
              <span className="flex items-center justify-center rounded-xl shrink-0" style={{ width: 42, height: 42, background: accent }}>
                <Bi n={icon} size={19} color="#fff" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold leading-tight" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>{title}</p>
                {cfg.level && <p className="text-[11px]" style={{ color: "#9B9B9B" }}>{cfg.level}</p>}
              </div>
              {step > 0 && (
                <button type="button" onClick={() => setStep(0)} className="text-[11px] font-semibold shrink-0" style={{ color: "#1800AD", fontFamily: "Montserrat, sans-serif" }}>Cambiar</button>
              )}
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif" }}>Información completa</span>
                <span className="text-xs font-bold" style={{ color: completPct === 100 ? "#16a34a" : "#272B7C" }}>{completPct}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "#E4E6F7" }}>
                <div className="h-full rounded-full" style={{ width: `${completPct}%`, background: completPct === 100 ? "#16a34a" : "#C8960A", transition: "width 0.3s ease" }} />
              </div>
            </div>

            {answeredRows.length > 0 ? (
              <ul className="space-y-2">
                {answeredRows.map(([k, v]) => (
                  <li key={k} className="flex items-start gap-2 text-xs">
                    <Bi n="check-circle-fill" size={12} color="#16a34a" style={{ marginTop: 2, flexShrink: 0 }} />
                    <span><span style={{ color: "#9B9B9B" }}>{k}: </span><span className="font-semibold" style={{ color: "#272B7C" }}>{v}</span></span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs leading-relaxed" style={{ color: "#9B9B9B" }}>
                {selected === "diagnostico" ? units[0].desc : svc?.desc}
              </p>
            )}

            <div className="flex items-start gap-2 mt-5 pt-4" style={{ borderTop: "1px solid #ECEEF6" }}>
              <Bi n="shield-lock" size={13} color="#9B9B9B" style={{ marginTop: 2, flexShrink: 0 }} />
              <p className="text-[11px] leading-snug" style={{ color: "#9B9B9B" }}>Sin compromiso. Un asesor revisa su solicitud y le responde con el alcance y las condiciones.</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

// ─── Blog / contenido especializado ─────────────────────────────────────────
// Artículos reales de la carpeta RecursosTransarchivos (ver src/blogData.ts).
