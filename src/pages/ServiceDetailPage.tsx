// ─── Service detail page ───────────────────────────────────────────────────────
// Contenido de cada servicio en src/data/serviceDetails.ts ("Informe Documento
// maestro" + documento de correcciones de las páginas de servicios, oct. 2026).
// En el encabezado van dos fotos del servicio (pedido del cliente: reemplazan
// la tarjeta "En cifras").

import { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ChatBot } from "@/components/chat/LazyChatBot";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ServiceCard } from "@/components/sections/ServiceCard";
import { Bi, BiTile } from "@/components/ui/Icons";
import { SectionDecor, type DecorVariant } from "@/components/ui/SectionDecor";
import { h2, kicker } from "@/components/ui/SectionHead";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { ServiceFaqs } from "@/components/sections/ServiceFaqs";
import { SERVICE_FAQS } from "@/data/serviceFaqs";
import { SERVICE_DETAILS } from "@/data/serviceDetails";
import { services } from "@/data/services";
import { SOLUTIONS } from "@/data/solutions";
import { SERVICE_JOEL } from "@/data/joelPoses";
import { JoelShowcase } from "@/components/ui/JoelBridge";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { C } from "@/styles/tokens";

// Fotos de cada servicio: assets/images/servicios/<slug>-1.webp y -2.webp
// (entregadas por el cliente); el PGD tiene además la del software.
const PHOTOS = import.meta.glob<string>("@/assets/images/servicios/*.webp", { eager: true, import: "default" });
const photo = (name: string): string | undefined => PHOTOS[`/src/assets/images/servicios/${name}.webp`];

// "Título: descripción" → título en negrita y descripción debajo.
function splitBenefit(b: string) {
  const i = b.indexOf(": ");
  return i > 0 && i < 70 ? { t: b.slice(0, i), d: b.slice(i + 2) } : { t: b, d: "" };
}

export function ServiceDetailPage() {
  const { slug } = useParams();
  const service = services.find(s => s.slug === slug);
  const detail = slug ? SERVICE_DETAILS[slug] : undefined;
  const pageRef = useRef<HTMLDivElement>(null);
  useScrollReveal(pageRef);
  const navigate = useNavigate();
  // Volver / "Servicios": siempre a la sección de servicios de la portada
  // (no al punto donde estaba el visitante, que podía ser el hero).
  const goBack = () => navigate("/#servicios");
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!service || !detail) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center gap-4 px-6 text-center" style={{ fontFamily: "Inter, sans-serif" }}>
        <p className="text-2xl font-bold" style={{ color: C.indigo, fontFamily: "Poppins, sans-serif" }}>Servicio no encontrado</p>
        <Link to="/#servicios" className="text-sm font-semibold" style={{ color: C.indigo, textDecoration: "none" }}>← Volver a servicios</Link>
      </div>
    );
  }

  const related = (SOLUTIONS.find(sol => sol.slugs.includes(service.slug))?.slugs ?? [])
    .concat(services.map(s => s.slug))
    .filter((sl, i, arr) => sl !== service.slug && arr.indexOf(sl) === i)
    .slice(0, 3)
    .map(sl => services.find(s => s.slug === sl)!)
    .filter(Boolean);

  // Las secciones alternan tono (clara / índigo) en el orden en que existen;
  // el llamado final siempre va claro con la tarjeta índigo.
  const seq = ["benef", detail.steps && "steps", "why", detail.extra && "extra", (detail.modes || detail.audience) && "modes", "norms", "faq"].filter(Boolean) as string[];
  const tone = Object.fromEntries(seq.map((k, i) => [k, i % 2 ? "dark" : "light"])) as Record<string, DecorVariant>;
  const dk = (k: string) => tone[k] === "dark";
  const pageTitle = detail.title ?? service.title;
  const [photo1, photo2] = [photo(`${service.slug}-1`), photo(`${service.slug}-2`)];
  const shortReasons = detail.reasons.every(r => !r.d);

  return (
    <div ref={pageRef} className="min-h-full" style={{ background: C.cream, fontFamily: "Inter, sans-serif", color: "#37352F" }}>
      {/* El mismo navbar del sitio, en su versión de barra blanca. */}
      <SiteHeader solid onChat={() => setChatOpen(true)} />
      <div aria-hidden="true" style={{ height: 60 }} />

      {/* Hero: foto del archivo bajo un velo navy, con la carpeta como base */}
      <PageHero>
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
                  <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>Inicio</Link> / <button type="button" onClick={goBack} style={{ color: "inherit" }}>Servicios</button> / <span style={{ color: C.yellow }}>{pageTitle}</span>
                </p>
              </div>
              <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-5" style={{ background: "rgba(255,255,255,0.1)", color: C.yellow, border: "1px solid rgba(255,222,89,0.35)", fontFamily: "Montserrat, sans-serif" }}>
                <Bi n={service.icon} size={13} color={C.yellow} /> {service.tag}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#fff", fontFamily: "Poppins, sans-serif", lineHeight: 1.1 }}>{pageTitle}</h1>
              <p className="text-lg md:text-xl font-semibold mb-4" style={{ color: C.yellow, fontFamily: "Poppins, sans-serif", lineHeight: 1.35 }}>{detail.tagline}</p>
              <p className="text-base max-w-xl mb-8" style={{ color: "rgba(255,255,255,0.78)", lineHeight: 1.7 }}>{detail.intro}</p>
              <div className="flex flex-wrap gap-3">
                <Link to={`/?servicio=${service.slug}#cotizador`} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold transition-transform hover:scale-[1.03]"
                  style={{ background: C.yellow, color: C.indigo, fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
                  Solicitar cotización <Bi n="arrow-right" size={14} color={C.indigo} />
                </Link>
                <Link to="/#faq" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold"
                  style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
                  <Bi n="headset" size={14} color="#fff" /> Hablar con un asesor
                </Link>
              </div>
            </div>

            {/* Fotos del servicio: la principal grande y la segunda encima,
                abajo a la izquierda (en celular solo la principal). */}
            {photo1 && (
              <div className="relative lg:pb-14 lg:pl-10">
                <img src={photo1} alt={`${pageTitle} en Transarchivos`} decoding="async" fetchPriority="high"
                  className="w-full aspect-[4/3] rounded-3xl"
                  style={{ objectFit: "cover", border: "1px solid rgba(255,255,255,0.2)", boxShadow: "0 30px 60px -30px rgba(0,0,0,0.7)" }} />
                {photo2 && (
                  <img src={photo2} alt="" loading="lazy" decoding="async"
                    className="hidden lg:block absolute left-0 bottom-0 w-[46%] aspect-[4/3] rounded-2xl"
                    style={{ objectFit: "cover", border: "4px solid #fff", boxShadow: "0 24px 48px -20px rgba(0,0,0,0.6)" }} />
                )}
                <span className="absolute grid place-items-center rounded-2xl right-4 top-4 lg:right-[-12px] lg:top-[-12px]" style={{ width: 52, height: 52, background: C.yellow, boxShadow: "0 12px 24px -10px rgba(0,0,0,0.5)" }}>
                  <Bi n={service.icon} size={24} color={C.indigo} />
                </span>
              </div>
            )}
          </div>
        </div>
      </PageHero>

      {/* Qué incluye / beneficios */}
      <section className="relative isolate overflow-hidden py-16">
        <SectionDecor variant="light" />
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-10 items-start">
          <div>
            {kicker("Lo que obtiene")}
            {h2(detail.benefitsTitle ?? <>Beneficios para <span style={{ background: "linear-gradient(transparent 62%, #FFDE59 62%)" }}>su empresa</span></>)}
            {(detail.about ?? service.desc) && <p className="text-sm mt-4" style={{ color: C.muted, lineHeight: 1.7 }}>{detail.about ?? service.desc}</p>}
            {detail.includes && (
              <div className="mt-6">
                <p className="text-sm font-bold mb-3" style={{ color: C.indigo, fontFamily: "Poppins, sans-serif" }}>¿Qué incluye este servicio?</p>
                <ul className="flex flex-wrap gap-2">
                  {detail.includes.map(x => (
                    <li key={x} className="inline-flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2 rounded-full" style={{ background: "#fff", color: C.indigo, border: "1px solid #E4E6F7", fontFamily: "Montserrat, sans-serif" }}>
                      <Bi n="check2" size={14} color="#16a34a" />{x}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {SERVICE_JOEL[service.slug] && (
              <JoelShowcase src={SERVICE_JOEL[service.slug].src} height={SERVICE_JOEL[service.slug].height} />
            )}
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {detail.benefits.map(b => {
              const { t, d } = splitBenefit(b);
              return (
                <div key={b} className="flex items-start gap-3 rounded-2xl p-4" style={{ background: "#fff", border: "1px solid #E4E6F7", boxShadow: "0 14px 30px -26px rgba(24,0,173,0.45)" }}>
                  <span className="grid place-items-center rounded-lg shrink-0" style={{ width: 28, height: 28, background: "#EAF7EE" }}>
                    <Bi n="check-lg" size={14} color="#16a34a" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold" style={{ color: C.indigo, lineHeight: 1.45 }}>{t}</span>
                    {d && <span className="block text-[13px] mt-1" style={{ color: C.muted, lineHeight: 1.55 }}>{d}</span>}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Proceso */}
      {detail.steps && (
        <section className="relative isolate overflow-hidden py-16">
          <SectionDecor variant="dark" flip folder={false} />
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-10">
              {kicker(detail.stepsKicker ?? "Cómo lo hacemos", true)}
              {h2(detail.stepsTitle ?? "Un proceso claro, paso a paso", true)}
              {detail.stepsIntro && <p className="text-sm mt-4 max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.78)", lineHeight: 1.7 }}>{detail.stepsIntro}</p>}
            </div>
            <div className={`relative grid gap-4 sm:grid-cols-2 ${detail.steps.length >= 5 ? "lg:grid-cols-5" : "lg:grid-cols-4"}`}>
              <div className="hidden lg:block absolute" style={{ top: 26, left: "8%", right: "8%", height: 2, background: "repeating-linear-gradient(90deg, rgba(255,255,255,0.3) 0 8px, transparent 8px 14px)" }} />
              {detail.steps.map((st, i) => (
                <div key={st.t} className="relative flex lg:flex-col items-center gap-3 lg:gap-0 text-left lg:text-center">
                  <span className="relative grid place-items-center rounded-full font-bold lg:mb-4 shrink-0" style={{ width: 44, height: 44, background: i === 0 ? C.yellow : "#fff", color: C.indigo, border: "2px solid #FFDE59", fontFamily: "Poppins, sans-serif", fontSize: 18, boxShadow: "0 10px 24px -12px rgba(0,0,0,0.5)" }}>{i + 1}</span>
                  {st.d ? (
                    <div className="rounded-2xl p-4 w-full h-full" style={{ background: "#fff", border: "1px solid #E4E6F7" }}>
                      <p className="text-sm font-bold mb-1" style={{ color: C.indigo, fontFamily: "Poppins, sans-serif" }}>{st.t}</p>
                      <p className="text-xs" style={{ color: C.muted, lineHeight: 1.55 }}>{st.d}</p>
                    </div>
                  ) : (
                    // Solo título: un gráfico del paso en lugar del texto
                    // (pedido del cliente, oct. 2026).
                    <div className="rounded-2xl p-4 lg:p-5 w-full h-full flex items-center lg:flex-col gap-4 lg:gap-3 lg:text-center" style={{ background: "#fff", border: "1px solid #E4E6F7" }}>
                      <span className="relative grid place-items-center shrink-0 rounded-[22px] w-16 h-16 lg:w-24 lg:h-24" style={{ background: "#F1F3FB" }}>
                        <span aria-hidden="true" className="absolute rounded-md" style={{ right: 8, top: 8, width: 14, height: 14, transform: "rotate(45deg)", background: "rgba(255,222,89,0.85)" }} />
                        <Bi n={st.ic ?? "check2-circle"} size={40} color={C.indigo} className="lg:scale-125" />
                      </span>
                      <p className="text-sm font-bold" style={{ color: C.indigo, fontFamily: "Poppins, sans-serif", lineHeight: 1.35 }}>{st.t}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Por qué con Transarchivos */}
      <section className="relative isolate overflow-hidden py-16">
        <SectionDecor variant={tone.why} />
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-10">
            {kicker(detail.reasonsKicker ?? "Por qué con Transarchivos", dk("why"))}
            {h2(detail.reasonsTitle ?? "Lo que nos diferencia", dk("why"))}
          </div>
          <div className={`grid gap-5 sm:grid-cols-2 ${detail.reasons.length === 3 ? "lg:grid-cols-3" : detail.reasons.length === 5 ? "lg:grid-cols-5" : "lg:grid-cols-4"}`}>
            {detail.reasons.map((r, i) => shortReasons ? (
              <div key={r.t} className="flex flex-col gap-3 rounded-3xl p-5" style={{ background: "#fff", border: "1.5px solid #E4E6F7", boxShadow: "0 18px 40px -28px rgba(24,0,173,0.45)" }}>
                <BiTile n={r.ic} size={44} accent={C.indigo} />
                <p className="text-sm font-bold" style={{ color: C.indigo, fontFamily: "Poppins, sans-serif", lineHeight: 1.35 }}>{r.t}</p>
              </div>
            ) : (
              <div key={r.t} className="group relative rounded-3xl p-6 transition-all hover:-translate-y-1.5 overflow-hidden"
                style={{ background: "#fff", border: "1.5px solid #E4E6F7", boxShadow: "0 18px 40px -28px rgba(24,0,173,0.45)" }}>
                <span aria-hidden="true" className="absolute select-none pointer-events-none font-bold" style={{ right: 16, top: 10, fontSize: 44, lineHeight: 1, color: "rgba(24,0,173,0.06)", fontFamily: "Poppins, sans-serif" }}>0{i + 1}</span>
                <span className="grid place-items-center rounded-2xl mb-4 transition-colors bg-indigo/[0.08] group-hover:bg-indigo" style={{ width: 48, height: 48 }}>
                  <i className={`bi bi-${r.ic} text-indigo group-hover:text-amarillo transition-colors`} aria-hidden="true" style={{ fontSize: 21, lineHeight: 1 }} />
                </span>
                <p className="text-base font-bold mb-2" style={{ color: C.indigo, fontFamily: "Poppins, sans-serif", lineHeight: 1.3 }}>{r.t}</p>
                <p className="text-sm" style={{ color: C.muted, lineHeight: 1.6 }}>{r.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Banner adicional del servicio (p. ej. el software del PGD) */}
      {detail.extra && (
        <section className="relative isolate overflow-hidden py-16">
          <SectionDecor variant={tone.extra} folder={false} />
          <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-10 items-center">
            {photo(`${service.slug}-software`) && (
              <img src={photo(`${service.slug}-software`)} alt={detail.extra.title} loading="lazy" decoding="async"
                className="w-full aspect-[4/3] rounded-3xl" style={{ objectFit: "cover", boxShadow: "0 30px 60px -30px rgba(0,0,0,0.6)" }} />
            )}
            <div>
              {h2(detail.extra.title, dk("extra"))}
              <p className="text-sm mt-4 mb-6" style={{ color: dk("extra") ? "rgba(255,255,255,0.8)" : C.muted, lineHeight: 1.7 }}>{detail.extra.text}</p>
              <p className="text-base font-semibold pl-4" style={{ color: dk("extra") ? "#fff" : C.indigo, borderLeft: "3px solid #FFDE59", lineHeight: 1.6, fontFamily: "Poppins, sans-serif" }}>{detail.extra.note}</p>
            </div>
          </div>
        </section>
      )}

      {/* Modalidades o público */}
      {(detail.modes || detail.audience) && (
        <section className="relative isolate overflow-hidden py-16">
          <SectionDecor variant={tone.modes} flip folder={false} />
          <div className="max-w-6xl mx-auto px-6">
            {detail.modes && (
              <>
                <div className="text-center mb-10">{kicker("Modalidades", dk("modes"))}{h2("Elija cómo lo necesita", dk("modes"))}</div>
                <div className={`grid gap-5 ${detail.modes.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
                  {detail.modes.map((m, i) => (
                    <div key={m.t} className="relative rounded-3xl p-7 flex items-start gap-5 overflow-hidden"
                      style={{ background: i === 0 ? (dk("modes") ? "rgba(255,255,255,0.08)" : C.indigo) : "#fff", border: i === 0 ? (dk("modes") ? "1.5px solid rgba(255,255,255,0.22)" : "none") : "1.5px solid #E4E6F7", boxShadow: "0 24px 50px -32px rgba(24,0,173,0.45)" }}>
                      <span className="grid place-items-center rounded-2xl shrink-0" style={{ width: 56, height: 56, background: i === 0 ? C.yellow : C.indigo }}>
                        <Bi n={m.ic} size={24} color={i === 0 ? C.indigo : C.yellow} />
                      </span>
                      <div>
                        <p className="text-lg font-bold mb-1.5" style={{ color: i === 0 ? "#fff" : C.indigo, fontFamily: "Poppins, sans-serif" }}>{m.t}</p>
                        <p className="text-sm" style={{ color: i === 0 ? "rgba(255,255,255,0.75)" : C.muted, lineHeight: 1.6 }}>{m.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {detail.audience && (
              <div className={detail.modes ? "mt-14" : ""}>
                <div className="text-center mb-10">{kicker("Pensado para usted", dk("modes"))}{h2(detail.audience.title, dk("modes"))}</div>
                <div className={`grid gap-4 sm:grid-cols-2 ${detail.audience.items.length > 4 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>
                  {detail.audience.items.map(a => (
                    <div key={a.t} className="flex items-start gap-3 rounded-2xl p-5" style={{ background: "#fff", border: "1px solid #E4E6F7" }}>
                      <BiTile n={a.ic} size={42} accent={C.indigo} />
                      <div>
                        <p className="text-sm font-bold" style={{ color: C.indigo, fontFamily: "Poppins, sans-serif" }}>{a.t}</p>
                        {a.d && <p className="text-xs mt-1" style={{ color: C.muted, lineHeight: 1.55 }}>{a.d}</p>}
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
        <SectionDecor variant={tone.norms} flip />
        <div className="max-w-6xl mx-auto px-6">
          <div className="rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5 mb-14" style={{ background: "#fff", border: "1px solid #E4E6F7" }}>
            <div className="flex items-center gap-3 md:w-64 shrink-0">
              <BiTile n="patch-check" size={44} accent="#16a34a" />
              <p className="text-base font-bold" style={{ color: C.indigo, fontFamily: "Poppins, sans-serif", lineHeight: 1.25 }}>Respaldo normativo</p>
            </div>
            {/* Centradas: cuando pasan a una segunda fila no queda un hueco a la derecha. */}
            <div className="flex-1 flex flex-wrap justify-center gap-2">
              {detail.norms.map(n => (
                <span key={n} className="text-sm md:text-[15px] font-semibold px-4 py-2 rounded-full" style={{ background: "#F2F3FA", color: C.indigo, fontFamily: "Montserrat, sans-serif" }}>{n}</span>
              ))}
            </div>
          </div>

          <div className="flex items-end justify-between gap-4 mb-6">
            <div>{kicker("Complemente su solución", dk("norms"))}{h2("Servicios relacionados", dk("norms"))}</div>
            <Link to="/#servicios" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold" style={{ color: dk("norms") ? C.yellow : C.indigo, fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
              Ver todos <Bi n="arrow-right" size={13} color={dk("norms") ? C.yellow : C.indigo} />
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {related.map(r => <ServiceCard key={r.slug} service={r} />)}
          </div>
        </div>
      </section>

      {/* Preguntas frecuentes del servicio (src/data/serviceFaqs.ts) */}
      <section id="preguntas" className="relative isolate overflow-hidden py-16" style={{ scrollMarginTop: 80 }}>
        <SectionDecor variant={tone.faq} flip={tone.faq === "light"} />
        <ServiceFaqs faqs={SERVICE_FAQS[service.slug] ?? []} serviceTitle={service.title} dark={dk("faq")} />
      </section>

      {/* Llamado final */}
      <CtaBand title={detail.ctaTitle ?? `¿Listo para empezar con ${pageTitle.toLowerCase()}?`} text="Arme su solicitud en minutos o hable con un asesor. Sin compromiso." to={`/?servicio=${service.slug}#cotizador`} />
      <ChatBot open={chatOpen} setOpen={setChatOpen} />
    </div>
  );
}
