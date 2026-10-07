// ─── Service detail page ───────────────────────────────────────────────────────
// Contenido de cada servicio tomado del "Informe Documento maestro"
// (definición, objetivos/beneficios, etapas, argumentos de venta, modalidades
// y normativa). Solo cifras que aparecen en ese documento.

import { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate, useNavigationType } from "react-router-dom";
import { ChatBot } from "@/components/chat/ChatBot";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ServiceCard } from "@/components/sections/ServiceCard";
import { JoelSilhouette } from "@/components/ui/Brand";
import { Bi, BiTile } from "@/components/ui/Icons";
import { SectionDecor } from "@/components/ui/SectionDecor";
import { SERVICE_DETAILS } from "@/data/serviceDetails";
import { services } from "@/data/services";
import { SOLUTIONS } from "@/data/solutions";
import { SERVICE_JOEL } from "@/data/joelPoses";
import { JoelShowcase } from "@/components/ui/JoelBridge";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function ServiceDetailPage() {
  const { slug } = useParams();
  const service = services.find(s => s.slug === slug);
  const detail = slug ? SERVICE_DETAILS[slug] : undefined;
  const pageRef = useRef<HTMLDivElement>(null);
  useScrollReveal(pageRef);
  const navigate = useNavigate();
  const navType = useNavigationType();
  // Volver: si se llegó desde el sitio, regresa a donde estaba (como el
  // "atrás" del navegador); si se entró directo por el enlace, va a la
  // sección de servicios de la página principal.
  const goBack = () => { if (navType === "PUSH" && window.history.length > 1) navigate(-1); else navigate("/#servicios"); };
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!service || !detail) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center gap-4 px-6 text-center" style={{ fontFamily: "Inter, sans-serif" }}>
        <p className="text-2xl font-bold" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>Servicio no encontrado</p>
        <Link to="/#servicios" className="text-sm font-semibold" style={{ color: "#1800AD", textDecoration: "none" }}>← Volver a servicios</Link>
      </div>
    );
  }

  const related = (SOLUTIONS.find(sol => sol.slugs.includes(service.slug))?.slugs ?? [])
    .concat(services.map(s => s.slug))
    .filter((sl, i, arr) => sl !== service.slug && arr.indexOf(sl) === i)
    .slice(0, 3)
    .map(sl => services.find(s => s.slug === sl)!)
    .filter(Boolean);

  const kicker = (t: string) => (
    <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#C8960A", fontFamily: "Montserrat, sans-serif" }}>{t}</p>
  );
  const h2 = (c: React.ReactNode) => (
    <h2 className="text-2xl md:text-3xl font-bold" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif", lineHeight: 1.2 }}>{c}</h2>
  );

  return (
    <div ref={pageRef} className="min-h-full" style={{ background: "#fff", fontFamily: "Inter, sans-serif", color: "#37352F" }}>
      {/* El mismo navbar del sitio, en su versión de barra blanca. */}
      <SiteHeader solid onChat={() => setChatOpen(true)} />
      <div aria-hidden="true" style={{ height: 60 }} />

      {/* Hero: foto del archivo bajo un velo navy, con la carpeta como base */}
      <section className="relative isolate overflow-hidden" style={{ backgroundColor: "#272B7C" }}>
        <div aria-hidden="true" className="absolute inset-0" style={{ zIndex: -1, backgroundImage: "url(/videos/hero-poster.jpg)", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div aria-hidden="true" className="absolute inset-0" style={{ zIndex: -1, background: "rgba(39,43,124,0.88)" }} />
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-10 items-center pt-12 pb-24">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <button type="button" onClick={goBack} aria-label="Volver a servicios" title="Volver a servicios"
                  className="grid place-items-center rounded-full shrink-0 transition-colors hover:bg-white/20"
                  style={{ width: 36, height: 36, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)" }}>
                  <Bi n="arrow-left" size={15} color="#fff" />
                </button>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "Montserrat, sans-serif" }}>
                  <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>Inicio</Link> / <button type="button" onClick={goBack} style={{ color: "inherit" }}>Servicios</button> / <span style={{ color: "#FFDE59" }}>{service.title}</span>
                </p>
              </div>
              <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-5" style={{ background: "rgba(255,255,255,0.1)", color: "#FFDE59", border: "1px solid rgba(255,222,89,0.35)", fontFamily: "Montserrat, sans-serif" }}>
                <Bi n={service.icon} size={13} color="#FFDE59" /> {service.tag}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#fff", fontFamily: "Poppins, sans-serif", lineHeight: 1.1 }}>{service.title}</h1>
              <p className="text-lg md:text-xl font-semibold mb-4" style={{ color: "#FFDE59", fontFamily: "Poppins, sans-serif", lineHeight: 1.35 }}>{detail.tagline}</p>
              <p className="text-base max-w-xl mb-8" style={{ color: "rgba(255,255,255,0.78)", lineHeight: 1.7 }}>{detail.intro}</p>
              <div className="flex flex-wrap gap-3">
                <Link to={`/?servicio=${service.slug}#cotizador`} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold transition-transform hover:scale-[1.03]"
                  style={{ background: "#FFDE59", color: "#272B7C", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
                  Solicitar cotización <Bi n="arrow-right" size={14} color="#272B7C" />
                </Link>
                <Link to="/#faq" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold"
                  style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
                  <Bi n="headset" size={14} color="#fff" /> Hablar con un asesor
                </Link>
              </div>
            </div>

            {/* Tarjeta con las cifras clave */}
            <div className="relative">
              <div className="rounded-3xl p-6 md:p-7" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.16)", backdropFilter: "blur(10px)" }}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="grid place-items-center rounded-2xl" style={{ width: 56, height: 56, background: "#FFDE59" }}>
                    <Bi n={service.icon} size={26} color="#272B7C" />
                  </span>
                  <p className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.85)", fontFamily: "Montserrat, sans-serif" }}>En cifras</p>
                </div>
                <div className="space-y-4">
                  {detail.stats.map(st => (
                    <div key={st.v} className="flex items-baseline gap-4 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                      <span className="text-2xl md:text-3xl font-bold shrink-0" style={{ color: "#fff", fontFamily: "Poppins, sans-serif", minWidth: 120 }}>{st.v}</span>
                      <span className="text-sm" style={{ color: "rgba(255,255,255,0.68)" }}>{st.l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Borde inferior con forma de carpeta, como en la página principal */}
        <div aria-hidden="true" className="relative max-w-6xl mx-auto px-6">
          <div className="relative h-10">
            <svg className="absolute left-0 bottom-full block" width="220" height="36" viewBox="0 0 280 46" preserveAspectRatio="none">
              <path d="M0 46 V18 Q0 0 18 0 H196 Q209 0 217 10 L242 38 Q249 46 262 46 Z" fill="#FBFBF8" />
            </svg>
            <div className="absolute inset-0" style={{ background: "#FBFBF8", borderRadius: "0 28px 0 0" }} />
          </div>
        </div>
      </section>

      {/* Qué incluye / beneficios */}
      <section className="relative isolate overflow-hidden py-16">
        <SectionDecor variant="cream" />
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-10 items-start">
          <div>
            {kicker("Lo que obtiene")}
            {h2(<>Beneficios para <span style={{ background: "linear-gradient(transparent 62%, #FFDE59 62%)" }}>su empresa</span></>)}
            <p className="text-sm mt-4" style={{ color: "#6B6B6B", lineHeight: 1.7 }}>{service.desc}</p>
            {SERVICE_JOEL[service.slug] && (
              <JoelShowcase src={SERVICE_JOEL[service.slug].src} height={SERVICE_JOEL[service.slug].height} />
            )}
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {detail.benefits.map(b => (
              <div key={b} className="flex items-start gap-3 rounded-2xl p-4" style={{ background: "#fff", border: "1px solid #E4E6F7", boxShadow: "0 14px 30px -26px rgba(39,43,124,0.45)" }}>
                <span className="grid place-items-center rounded-lg shrink-0" style={{ width: 28, height: 28, background: "#EAF7EE" }}>
                  <Bi n="check-lg" size={14} color="#16a34a" />
                </span>
                <span className="text-sm font-semibold" style={{ color: "#272B7C", lineHeight: 1.45 }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proceso */}
      {detail.steps && (
        <section className="relative isolate overflow-hidden py-16">
          <SectionDecor variant="lavender" flip folder={false} />
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-10">
              {kicker("Cómo lo hacemos")}
              {h2("Un proceso claro, paso a paso")}
            </div>
            <div className={`relative grid gap-4 sm:grid-cols-2 ${detail.steps.length >= 5 ? "lg:grid-cols-5" : "lg:grid-cols-4"}`}>
              <div className="hidden lg:block absolute" style={{ top: 26, left: "8%", right: "8%", height: 2, background: "repeating-linear-gradient(90deg, #C9CDEE 0 8px, transparent 8px 14px)" }} />
              {detail.steps.map((st, i) => (
                <div key={st.t} className="relative flex lg:flex-col items-center gap-3 lg:gap-0 text-left lg:text-center">
                  <span className="relative grid place-items-center rounded-full font-bold lg:mb-4 shrink-0" style={{ width: 44, height: 44, background: i === 0 ? "#272B7C" : "#fff", color: i === 0 ? "#FFDE59" : "#272B7C", border: "2px solid #272B7C", fontFamily: "Poppins, sans-serif", fontSize: 18, boxShadow: "0 10px 24px -12px rgba(39,43,124,0.5)" }}>{i + 1}</span>
                  <div className="rounded-2xl p-4 w-full h-full" style={{ background: "#fff", border: "1px solid #E4E6F7" }}>
                    <p className="text-sm font-bold mb-1" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>{st.t}</p>
                    <p className="text-xs" style={{ color: "#6B6B6B", lineHeight: 1.55 }}>{st.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Por qué con Transarchivos */}
      <section className="relative isolate overflow-hidden py-16">
        <SectionDecor variant={detail.steps ? "cream" : "lavender"} />
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-10">
            {kicker("Por qué con Transarchivos")}
            {h2("Lo que nos diferencia")}
          </div>
          <div className={`grid gap-5 sm:grid-cols-2 ${detail.reasons.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>
            {detail.reasons.map((r, i) => (
              <div key={r.t} className="group relative rounded-3xl p-6 transition-all hover:-translate-y-1.5 overflow-hidden"
                style={{ background: "#fff", border: "1.5px solid #E4E6F7", boxShadow: "0 18px 40px -28px rgba(39,43,124,0.45)" }}>
                <span aria-hidden="true" className="absolute select-none pointer-events-none font-bold" style={{ right: 16, top: 10, fontSize: 44, lineHeight: 1, color: "rgba(39,43,124,0.06)", fontFamily: "Poppins, sans-serif" }}>0{i + 1}</span>
                <span className="grid place-items-center rounded-2xl mb-4 transition-colors bg-[#272B7C]/[0.08] group-hover:bg-[#272B7C]" style={{ width: 48, height: 48 }}>
                  <i className={`bi bi-${r.ic} text-[#272B7C] group-hover:text-[#FFDE59] transition-colors`} aria-hidden="true" style={{ fontSize: 21, lineHeight: 1 }} />
                </span>
                <p className="text-base font-bold mb-2" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif", lineHeight: 1.3 }}>{r.t}</p>
                <p className="text-sm" style={{ color: "#6B6B6B", lineHeight: 1.6 }}>{r.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modalidades o público */}
      {(detail.modes || detail.audience) && (
        <section className="relative isolate overflow-hidden py-16">
          <SectionDecor variant="lavender" flip folder={false} />
          <div className="max-w-6xl mx-auto px-6">
            {detail.modes && (
              <>
                <div className="text-center mb-10">{kicker("Modalidades")}{h2("Elija cómo lo necesita")}</div>
                <div className="grid md:grid-cols-2 gap-5">
                  {detail.modes.map((m, i) => (
                    <div key={m.t} className="relative rounded-3xl p-7 flex items-start gap-5 overflow-hidden"
                      style={{ background: i === 0 ? "#272B7C" : "#fff", border: i === 0 ? "none" : "1.5px solid #E4E6F7", boxShadow: "0 24px 50px -32px rgba(39,43,124,0.55)" }}>
                      <span className="grid place-items-center rounded-2xl shrink-0" style={{ width: 56, height: 56, background: i === 0 ? "#FFDE59" : "#272B7C" }}>
                        <Bi n={m.ic} size={24} color={i === 0 ? "#272B7C" : "#FFDE59"} />
                      </span>
                      <div>
                        <p className="text-lg font-bold mb-1.5" style={{ color: i === 0 ? "#fff" : "#272B7C", fontFamily: "Poppins, sans-serif" }}>{m.t}</p>
                        <p className="text-sm" style={{ color: i === 0 ? "rgba(255,255,255,0.75)" : "#6B6B6B", lineHeight: 1.6 }}>{m.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {detail.audience && (
              <div className={detail.modes ? "mt-14" : ""}>
                <div className="text-center mb-10">{kicker("Pensado para usted")}{h2(detail.audience.title)}</div>
                <div className={`grid gap-4 sm:grid-cols-2 ${detail.audience.items.length > 4 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>
                  {detail.audience.items.map(a => (
                    <div key={a.t} className="flex items-start gap-3 rounded-2xl p-5" style={{ background: "#fff", border: "1px solid #E4E6F7" }}>
                      <BiTile n={a.ic} size={42} accent="#1800AD" />
                      <div>
                        <p className="text-sm font-bold" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>{a.t}</p>
                        {a.d && <p className="text-xs mt-1" style={{ color: "#6B6B6B", lineHeight: 1.55 }}>{a.d}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Normativa + servicios relacionados */}
      <section className="relative isolate overflow-hidden py-16">
        <SectionDecor variant="cream" flip />
        <div className="max-w-6xl mx-auto px-6">
          <div className="rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5 mb-14" style={{ background: "#fff", border: "1px solid #E4E6F7" }}>
            <div className="flex items-center gap-3 md:w-64 shrink-0">
              <BiTile n="patch-check" size={44} accent="#16a34a" />
              <p className="text-base font-bold" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif", lineHeight: 1.25 }}>Respaldo normativo</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {detail.norms.map(n => (
                <span key={n} className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: "#F2F3FA", color: "#272B7C", fontFamily: "Montserrat, sans-serif" }}>{n}</span>
              ))}
            </div>
          </div>

          <div className="flex items-end justify-between gap-4 mb-6">
            <div>{kicker("Complemente su solución")}{h2("Servicios relacionados")}</div>
            <Link to="/#servicios" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold" style={{ color: "#1800AD", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
              Ver todos <Bi n="arrow-right" size={13} color="#1800AD" />
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {related.map(r => <ServiceCard key={r.slug} service={r} />)}
          </div>
        </div>
      </section>

      {/* Llamado final */}
      <section className="py-16" style={{ background: "#FBFBF8" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="relative">
            <svg aria-hidden="true" className="absolute left-0 bottom-full block" width="220" height="36" viewBox="0 0 280 46" preserveAspectRatio="none">
              <path d="M0 46 V18 Q0 0 18 0 H196 Q209 0 217 10 L242 38 Q249 46 262 46 Z" fill="#272B7C" />
            </svg>
            <div className="relative overflow-hidden rounded-[0_28px_28px_28px] p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-6" style={{ background: "#272B7C" }}>
              <JoelSilhouette style={{ height: 300, bottom: -40, right: 40, opacity: 0.12, background: "#FFDE59" }} />
              <div className="relative max-w-xl">
                <p className="text-2xl md:text-3xl font-bold mb-2" style={{ color: "#fff", fontFamily: "Poppins, sans-serif", lineHeight: 1.2 }}>¿Listo para empezar con {service.title.toLowerCase()}?</p>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.72)" }}>Arme su solicitud en minutos o hable con un asesor. Sin compromiso.</p>
              </div>
              <div className="relative flex flex-wrap gap-3">
                <Link to={`/?servicio=${service.slug}#cotizador`} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold transition-transform hover:scale-[1.03]"
                  style={{ background: "#FFDE59", color: "#272B7C", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
                  Solicitar cotización <Bi n="arrow-right" size={14} color="#272B7C" />
                </Link>
                <a href="tel:+576013164530" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold"
                  style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
                  <Bi n="telephone" size={14} color="#fff" /> (601) 316-4530
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ChatBot open={chatOpen} setOpen={setChatOpen} />
    </div>
  );
}
