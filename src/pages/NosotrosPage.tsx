// ─── Página "Nosotros" ──────────────────────────────────────────────────────
// Contenido tomado del Documento maestro y de "Misión y visión" (carpeta
// RecursosTransarchivos) — es la misma información que antes vivía apretada
// en la sección #nosotros de la landing, ahora repartida en su propia página
// con un anclaje real por cada ítem del menú desplegable "Nosotros".
// "Nuestro equipo", "Cultura organizacional" y "Aliados tecnológicos" no
// tienen nombres, fotos ni logos reales en los documentos fuente, así que en
// vez de inventarlos se muestran con los hechos reales más cercanos (cómo se
// forma y organiza el personal, los valores corporativos, la infraestructura
// de seguridad) — "Aliados tecnológicos" se presenta honestamente como
// "Tecnología y seguridad".

import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bi, BiTile } from "@/components/ui/Icons";
import { norms } from "@/data/services";
import { ChatBot } from "@/components/chat/ChatBot";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { JoelSilhouette } from "@/components/ui/Brand";
import { JoelFigure } from "@/components/ui/JoelBridge";
import { SectionDecor } from "@/components/ui/SectionDecor";
import { JOEL } from "@/data/joelPoses";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { whatsappUrl } from "@/data/contact";

export function NosotrosPage() {
  const { hash } = useLocation();
  const pageRef = useRef<HTMLDivElement>(null);
  useScrollReveal(pageRef);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth", block: "start" }));
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  const kicker = (t: string) => (
    <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#C8960A", fontFamily: "Montserrat, sans-serif" }}>{t}</p>
  );
  const h2 = (c: React.ReactNode) => (
    <h2 className="text-2xl md:text-3xl font-bold" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif", lineHeight: 1.2 }}>{c}</h2>
  );
  const mark = (t: string) => <span style={{ background: "linear-gradient(transparent 62%, #FFDE59 62%)" }}>{t}</span>;
  const card = { background: "#fff", border: "1px solid #E4E6F7", boxShadow: "0 14px 30px -26px rgba(39,43,124,0.45)" } as const;

  return (
    <div ref={pageRef} className="min-h-full" style={{ background: "#fff", fontFamily: "Inter, sans-serif", color: "#37352F" }}>
      <SiteHeader solid onChat={() => setChatOpen(true)} />
      <div aria-hidden="true" style={{ height: 60 }} />

      {/* Hero: mismo formato de las páginas de servicio */}
      <section id="quienes-somos" className="relative isolate overflow-hidden" style={{ backgroundColor: "#272B7C", scrollMarginTop: 70 }}>
        <div aria-hidden="true" className="absolute inset-0" style={{ zIndex: -1, backgroundImage: "url(/videos/hero-poster.jpg)", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div aria-hidden="true" className="absolute inset-0" style={{ zIndex: -1, background: "rgba(39,43,124,0.88)" }} />
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-10 items-center pt-12 pb-24">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <Link to="/" aria-label="Volver al inicio" title="Volver al inicio" className="grid place-items-center rounded-full shrink-0 transition-colors hover:bg-white/20"
                  style={{ width: 36, height: 36, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)" }}>
                  <Bi n="arrow-left" size={15} color="#fff" />
                </Link>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "Montserrat, sans-serif" }}>
                  <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>Inicio</Link> / <span style={{ color: "#FFDE59" }}>Nosotros</span>
                </p>
              </div>
              <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-5" style={{ background: "rgba(255,255,255,0.1)", color: "#FFDE59", border: "1px solid rgba(255,222,89,0.35)", fontFamily: "Montserrat, sans-serif" }}>
                <Bi n="building" size={13} color="#FFDE59" /> Quiénes somos
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#fff", fontFamily: "Poppins, sans-serif", lineHeight: 1.1 }}>
                Pioneros de la gestión documental en Colombia
              </h1>
              <p className="text-lg md:text-xl font-semibold mb-4" style={{ color: "#FFDE59", fontFamily: "Poppins, sans-serif", lineHeight: 1.35 }}>Más de 40 años cuidando la información de las empresas.</p>
              <p className="text-base max-w-xl mb-8" style={{ color: "rgba(255,255,255,0.78)", lineHeight: 1.7 }}>
                Nacimos en 1983 para atender a Ecopetrol y desde entonces no hemos dejado de evolucionar. Fuimos pioneros en crear en Bogotá uno de los primeros centros especializados en custodia documental, y hoy ayudamos a las empresas a convertir su gestión documental en una ventaja competitiva.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/#cotizador" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold transition-transform hover:scale-[1.03]"
                  style={{ background: "#FFDE59", color: "#272B7C", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
                  Solicitar cotización <Bi n="arrow-right" size={14} color="#272B7C" />
                </Link>
                <Link to="/#servicios" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold"
                  style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
                  Conocer servicios
                </Link>
              </div>
            </div>

            <div className="rounded-3xl p-6 md:p-7" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.16)", backdropFilter: "blur(10px)" }}>
              <div className="flex items-center gap-3 mb-6">
                <span className="grid place-items-center rounded-2xl" style={{ width: 56, height: 56, background: "#FFDE59" }}>
                  <Bi n="building" size={26} color="#272B7C" />
                </span>
                <p className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.85)", fontFamily: "Montserrat, sans-serif" }}>En cifras</p>
              </div>
              <div className="space-y-4">
                {[["1983", "año de fundación, para atender a Ecopetrol"], ["40+", "años de trayectoria en gestión documental"], ["Bogotá", "sede y bodegas de custodia; atendemos todo el país"]].map(([v, l]) => (
                  <div key={v} className="flex items-baseline gap-4 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                    <span className="text-2xl md:text-3xl font-bold shrink-0" style={{ color: "#fff", fontFamily: "Poppins, sans-serif", minWidth: 120 }}>{v}</span>
                    <span className="text-sm" style={{ color: "rgba(255,255,255,0.68)" }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="relative max-w-6xl mx-auto px-6">
          <div className="relative h-10">
            <svg className="absolute left-0 bottom-full block" width="220" height="36" viewBox="0 0 280 46" preserveAspectRatio="none">
              <path d="M0 46 V18 Q0 0 18 0 H196 Q209 0 217 10 L242 38 Q249 46 262 46 Z" fill="#FBFBF8" />
            </svg>
            <div className="absolute inset-0" style={{ background: "#FBFBF8", borderRadius: "0 28px 0 0" }} />
          </div>
        </div>
      </section>

      {/* Historia */}
      <section id="historia" className="relative isolate overflow-hidden py-16" style={{ scrollMarginTop: 80 }}>
        <SectionDecor variant="cream" />
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-10 items-start">
          <div>
            {kicker("Nuestra historia")}
            {h2(<>Más de 40 años de {mark("trayectoria")}</>)}
            <p className="text-sm mt-4" style={{ color: "#6B6B6B", lineHeight: 1.7 }}>
              Nacimos en 1983 en respuesta a una necesidad puntual de Ecopetrol de gestionar su información documental. A partir de esa experiencia, adecuamos en Bogotá un centro de información documental con especificaciones técnicas de custodia y capacitamos a nuestro personal como archivistas bajo normas archivísticas avanzadas.
            </p>
            <div className="mt-10 pl-6"><JoelFigure src={JOEL.levantandoCajas} height={260} /></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { ic: "shield-check", t: "Mantenido los estándares archivísticos de seguridad, accesibilidad, eficiencia, integridad, autenticidad y fiabilidad." },
              { ic: "journal-check", t: "Permanecido alineados con la Ley 594 de 2000, la Resolución 8934 de 2014 y el Decreto 962 (Ley Antitrámites)." },
              { ic: "building", t: "Atendido multinacionales, pymes, microempresas y compañías en liquidación o reestructuración." },
              { ic: "tools", t: "Desarrollado TVD, TRD, digitalización, microfilmación y custodia física, digital y en la nube." },
            ].map(x => (
              <div key={x.t} className="flex items-start gap-3 rounded-2xl p-4" style={card}>
                <BiTile n={x.ic} size={34} accent="#1800AD" />
                <span className="text-sm" style={{ color: "#272B7C", lineHeight: 1.5 }}>{x.t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Misión y visión */}
      <section id="mision-vision" className="relative isolate overflow-hidden py-16" style={{ scrollMarginTop: 80 }}>
        <SectionDecor variant="lavender" flip folder={false} />
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">{kicker("Misión y visión")}{h2("Hacia dónde vamos")}</div>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { t: "Misión", ic: "bullseye", x: "Somos pioneros de la gestión documental en Colombia. Ofrecemos soluciones integrales de consultoría archivística, administración, custodia física y transformación digital de la información, bajo el estricto cumplimiento legal. A través de servicios ágiles, in-house e inmediatos, aseguramos la calidad operativa y la seguridad de los datos (confidencialidad, integridad y disponibilidad). Nos comprometemos con la mejora continua de nuestros procesos para superar las expectativas de nuestras partes interesadas y mitigar los riesgos del entorno." },
              { t: "Visión 2030", ic: "binoculars", x: "Para el año 2030, queremos consolidar nuestro liderazgo en Colombia como proveedores integrales de custodia física, consultoría archivística y transformación digital. Seremos reconocidos por la excelencia de nuestros estándares de calidad, la solidez en la seguridad de la información y la adopción de tecnologías seguras en la nube, garantizando un crecimiento sostenible que impulse el desarrollo y la estabilidad de nuestros colaboradores." },
            ].map((m, i) => (
              <div key={m.t} className="relative rounded-3xl p-7 overflow-hidden" style={{ background: i === 0 ? "#272B7C" : "#fff", border: i === 0 ? "none" : "1.5px solid #E4E6F7", boxShadow: "0 24px 50px -32px rgba(39,43,124,0.55)" }}>
                <span className="grid place-items-center rounded-2xl mb-4" style={{ width: 52, height: 52, background: i === 0 ? "#FFDE59" : "#272B7C" }}>
                  <Bi n={m.ic} size={22} color={i === 0 ? "#272B7C" : "#FFDE59"} />
                </span>
                <p className="text-lg font-bold mb-2" style={{ color: i === 0 ? "#fff" : "#272B7C", fontFamily: "Poppins, sans-serif" }}>{m.t}</p>
                <p className="text-sm" style={{ color: i === 0 ? "rgba(255,255,255,0.78)" : "#6B6B6B", lineHeight: 1.7 }}>{m.x}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section id="equipo" className="relative isolate overflow-hidden py-16" style={{ scrollMarginTop: 80 }}>
        <SectionDecor variant="cream" />
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-10 items-start">
          <div>
            {kicker("Nuestro equipo")}
            {h2(<>Personal {mark("capacitado")} y respaldado</>)}
            <p className="text-sm mt-4" style={{ color: "#6B6B6B", lineHeight: 1.7 }}>
              Nuestro personal técnico de archivo está capacitado bajo normas archivísticas avanzadas y los lineamientos del Archivo General de la Nación (AGN). En los proyectos Inhouse, Transarchivos asume la figura de empleador del personal en sitio, con protocolos de contingencia ante ausencias, informes mensuales de gestión y cumplimiento de acuerdos de servicio.
            </p>
            <div className="mt-10 pl-6"><JoelFigure src={JOEL.notas} height={250} /></div>
          </div>
          <div className="grid gap-4">
            {[
              { ic: "mortarboard", t: "Formación archivística", x: "Personal capacitado bajo normas archivísticas avanzadas y lineamientos del AGN." },
              { ic: "person-badge", t: "Empleador del personal Inhouse", x: "Selección, capacitación, reemplazos y evaluación de desempeño a cargo de Transarchivos." },
              { ic: "clipboard-data", t: "KPIs y SLA medibles", x: "Informes mensuales de gestión y cumplimiento de acuerdos de servicio con el cliente." },
            ].map((c, i) => (
              <div key={c.t} className="group relative rounded-3xl p-6 flex items-start gap-4 overflow-hidden card-lift" style={{ background: "#fff", border: "1.5px solid #E4E6F7" }}>
                <span aria-hidden="true" className="absolute select-none font-bold" style={{ right: 16, top: 10, fontSize: 40, lineHeight: 1, color: "rgba(39,43,124,0.06)", fontFamily: "Poppins, sans-serif" }}>0{i + 1}</span>
                <span className="grid place-items-center rounded-2xl shrink-0 transition-colors bg-[#272B7C]/[0.08] group-hover:bg-[#272B7C]" style={{ width: 48, height: 48 }}>
                  <i className={`bi bi-${c.ic} text-[#272B7C] group-hover:text-[#FFDE59] transition-colors`} aria-hidden="true" style={{ fontSize: 21, lineHeight: 1 }} />
                </span>
                <div>
                  <p className="text-base font-bold mb-1" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>{c.t}</p>
                  <p className="text-sm" style={{ color: "#6B6B6B", lineHeight: 1.6 }}>{c.x}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cultura */}
      <section id="cultura" className="relative isolate overflow-hidden py-16" style={{ scrollMarginTop: 80 }}>
        <SectionDecor variant="lavender" flip folder={false} />
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-10">{kicker("Cultura organizacional")}{h2("Los valores que nos guían")}</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { t: "Compromiso", ic: "hand-thumbs-up", x: "Cumplimos de manera oportuna y eficiente los requerimientos de nuestros clientes internos y externos." },
              { t: "Confidencialidad", ic: "shield-lock", x: "Manejamos la información interna y externa de acuerdo con la legislación colombiana y las políticas de seguridad y privacidad." },
              { t: "Responsabilidad", ic: "patch-check", x: "Brindamos un tratamiento especial a la información de nuestros clientes y de nuestra organización." },
              { t: "Sensibilidad humana", ic: "heart", x: "Interactuamos con clientes, compañeros, proveedores y visitantes como queremos ser tratados." },
            ].map((v, i) => (
              <div key={v.t} className="group relative rounded-3xl p-6 overflow-hidden card-lift" style={{ background: "#fff", border: "1.5px solid #E4E6F7" }}>
                <span aria-hidden="true" className="absolute select-none font-bold" style={{ right: 16, top: 10, fontSize: 44, lineHeight: 1, color: "rgba(39,43,124,0.06)", fontFamily: "Poppins, sans-serif" }}>0{i + 1}</span>
                <span className="grid place-items-center rounded-2xl mb-4 transition-colors bg-[#272B7C]/[0.08] group-hover:bg-[#272B7C]" style={{ width: 48, height: 48 }}>
                  <i className={`bi bi-${v.ic} text-[#272B7C] group-hover:text-[#FFDE59] transition-colors`} aria-hidden="true" style={{ fontSize: 21, lineHeight: 1 }} />
                </span>
                <p className="text-base font-bold mb-2" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>{v.t}</p>
                <p className="text-sm" style={{ color: "#6B6B6B", lineHeight: 1.6 }}>{v.x}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clientes */}
      <section id="clientes" className="relative isolate overflow-hidden py-16" style={{ scrollMarginTop: 80 }}>
        <SectionDecor variant="cream" />
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            {kicker("Nuestros clientes")}{h2(<>Experiencia en {mark("múltiples sectores")}</>)}
            <p className="text-sm mt-4 max-w-2xl mx-auto" style={{ color: "#6B6B6B" }}>Atendemos multinacionales, pymes y microempresas, y también compañías en liquidación o reestructuración.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { ic: "bank", l: "Financiero y aseguradoras" }, { ic: "heart-pulse", l: "Salud" }, { ic: "eyedropper", l: "Laboratorios" },
              { ic: "fuel-pump", l: "Petróleo" }, { ic: "minecart-loaded", l: "Minería" }, { ic: "rulers", l: "Ingeniería e infraestructura" },
              { ic: "bricks", l: "Construcción" }, { ic: "airplane", l: "Líneas aéreas" },
            ].map(x => (
              <div key={x.l} className="group flex items-center gap-3 rounded-2xl p-4 card-lift" style={{ background: "#fff", border: "1.5px solid #E4E6F7" }}>
                <span className="grid place-items-center rounded-xl shrink-0 transition-colors bg-[#272B7C]/[0.08] group-hover:bg-[#272B7C]" style={{ width: 42, height: 42 }}>
                  <i className={`bi bi-${x.ic} text-[#272B7C] group-hover:text-[#FFDE59] transition-colors`} aria-hidden="true" style={{ fontSize: 18, lineHeight: 1 }} />
                </span>
                <span className="text-sm font-semibold" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif" }}>{x.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tecnología y seguridad */}
      <section id="aliados" className="relative isolate overflow-hidden py-16" style={{ scrollMarginTop: 80 }}>
        <SectionDecor variant="lavender" flip folder={false} />
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-10 items-start">
          <div>
            {kicker("Tecnología y seguridad")}
            {h2(<>Infraestructura que {mark("protege")} su información</>)}
            <p className="text-sm mt-4" style={{ color: "#6B6B6B", lineHeight: 1.7 }}>La infraestructura y los protocolos con los que cuidamos cada documento, físico o digital, con trazabilidad en nuestro software propio Mido.</p>
            <div className="mt-10 pl-6"><JoelFigure src={JOEL.digitalizando} height={230} /></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { ic: "thermometer-half", t: "Control ambiental 24 h", x: "Temperatura y humedad monitoreadas en el centro documental." },
              { ic: "magnet", t: "Blindaje electromagnético", x: "Protección de medios magnéticos contra campos electromagnéticos." },
              { ic: "fire", t: "Extinción sin agua", x: "Sistemas de extinción de incendios con agentes limpios." },
              { ic: "camera-video", t: "Monitoreo y CCTV", x: "Vigilancia perimetral constante y control de acceso restringido." },
              { ic: "truck", t: "Transporte con GPS", x: "Vehículos propios monitoreados y trazabilidad por código de barras." },
              { ic: "cloud-check", t: "Copias air gap y nube segura", x: "Respaldo desconectado de la red y tecnologías seguras en la nube." },
            ].map(c => (
              <div key={c.t} className="flex items-start gap-3 rounded-2xl p-4" style={card}>
                <BiTile n={c.ic} size={34} accent="#1800AD" />
                <div>
                  <p className="text-sm font-bold" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>{c.t}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#6B6B6B", lineHeight: 1.5 }}>{c.x}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cumplimiento normativo */}
      <section id="certificados" className="relative isolate overflow-hidden py-16" style={{ scrollMarginTop: 80 }}>
        <SectionDecor variant="cream" flip />
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between gap-6 mb-8">
            <div className="max-w-2xl">{kicker("Cumplimiento normativo")}{h2("Marco normativo con el que operamos")}</div>
            <JoelFigure src={JOEL.legal} height={200} className="shrink-0 mr-6" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {norms.map(n => (
              <div key={n.code} className="rounded-2xl p-4 card-lift" style={{ background: "#fff", border: "1.5px solid #E4E6F7" }}>
                <p className="text-sm font-bold" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>{n.code}</p>
                <p className="text-[11px] leading-snug mt-1" style={{ color: "#6B6B6B" }}>{n.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Llamado final (mismo de las páginas de servicio) */}
      <section className="py-16" style={{ background: "#FBFBF8" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="relative">
            <svg aria-hidden="true" className="absolute left-0 bottom-full block" width="220" height="36" viewBox="0 0 280 46" preserveAspectRatio="none">
              <path d="M0 46 V18 Q0 0 18 0 H196 Q209 0 217 10 L242 38 Q249 46 262 46 Z" fill="#272B7C" />
            </svg>
            <div className="relative overflow-hidden rounded-[0_28px_28px_28px] p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-6" style={{ background: "#272B7C" }}>
              <JoelSilhouette style={{ height: 300, bottom: -40, right: 40, opacity: 0.12, background: "#FFDE59" }} />
              <div className="relative max-w-xl">
                <p className="text-2xl md:text-3xl font-bold mb-2" style={{ color: "#fff", fontFamily: "Poppins, sans-serif", lineHeight: 1.2 }}>¿Hablamos de la gestión documental de su empresa?</p>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.72)" }}>Arme su solicitud en minutos o hable con un asesor. Sin compromiso.</p>
              </div>
              <div className="relative flex flex-wrap gap-3">
                <Link to="/#cotizador" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold transition-transform hover:scale-[1.03]"
                  style={{ background: "#FFDE59", color: "#272B7C", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
                  Solicitar cotización <Bi n="arrow-right" size={14} color="#272B7C" />
                </Link>
                <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold"
                  style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
                  <Bi n="whatsapp" size={14} color="#fff" /> Escribir por WhatsApp
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
