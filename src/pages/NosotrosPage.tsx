import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logoImg from "@/assets/images/logo.png";
import { Bi, BiTile } from "@/components/ui/Icons";
import { norms } from "@/data/services";

export function NosotrosKicker({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <BiTile n={icon} size={40} accent="#1800AD" />
      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#9B9B9B", fontFamily: "Montserrat, sans-serif" }}>{label}</p>
    </div>
  );
}

export function NosotrosPage() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth", block: "start" }));
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  const inPageNav = [
    { l: "Quiénes somos", a: "quienes-somos" },
    { l: "Nuestra historia", a: "historia" },
    { l: "Misión y visión", a: "mision-vision" },
    { l: "Nuestro equipo", a: "equipo" },
    { l: "Cultura", a: "cultura" },
    { l: "Clientes", a: "clientes" },
    { l: "Tecnología y seguridad", a: "aliados" },
    { l: "Cumplimiento normativo", a: "certificados" },
  ];

  return (
    <div className="min-h-full" style={{ background: "#fff", fontFamily: "Inter, sans-serif", color: "#37352F" }}>
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #14163F 0%, #272B7C 55%, #1800AD 100%)" }}>
        <div className="absolute pointer-events-none rounded-full" style={{ width: 560, height: 560, top: -220, right: -160, background: "radial-gradient(circle, rgba(255,222,89,0.22) 0%, transparent 70%)" }} />
        <div className="absolute pointer-events-none rounded-full" style={{ width: 420, height: 420, bottom: -180, left: -160, background: "radial-gradient(circle, rgba(24,0,173,0.3) 0%, transparent 70%)" }} />

        <div className="relative max-w-5xl mx-auto px-6 pt-6 pb-16" id="quienes-somos" style={{ scrollMarginTop: 24 }}>
          <div className="flex items-center justify-between mb-14">
            <Link to="/" className="rounded-xl px-3 py-1.5" style={{ background: "rgba(255,255,255,0.95)" }}>
              <img src={logoImg} alt="Transarchivos" style={{ height: 30, width: "auto" }} />
            </Link>
            <Link to="/" className="text-xs font-bold px-4 py-2 rounded-full transition-all hover:scale-105"
              style={{ background: "rgba(255,255,255,0.14)", color: "#fff", border: "1px solid rgba(255,255,255,0.35)", fontFamily: "Montserrat, sans-serif", textDecoration: "none", backdropFilter: "blur(6px)" }}>
              <Bi n="arrow-left" size={13} color="#fff" className="mr-1.5" style={{ verticalAlign: "-1px" }} />Volver al inicio
            </Link>
          </div>

          <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-5"
            style={{ background: "#FFDE59", color: "#1800AD", fontFamily: "Montserrat, sans-serif" }}>Quiénes somos</span>
          <h1 className="text-4xl md:text-5xl font-bold max-w-3xl" style={{ color: "#fff", fontFamily: "Poppins, sans-serif", lineHeight: 1.15 }}>
            Pioneros de la gestión documental en Colombia <span style={{ color: "#FFDE59" }}>desde 1983</span>
          </h1>
          <p className="text-base md:text-lg max-w-2xl mt-6" style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>
            En Transarchivos Ltda llevamos más de 40 años ayudando a empresas a transformar su gestión documental en una ventaja competitiva. Nacimos en 1983 para atender a Ecopetrol y desde entonces no hemos dejado de evolucionar. Fuimos pioneros en crear en Bogotá uno de los primeros centros especializados en custodia documental.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-10 max-w-sm">
            {[["40+", "Años de experiencia"], ["1983", "Año de fundación"]].map(([v, l]) => (
              <div key={l} className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
                <p className="font-bold" style={{ color: "#FFDE59", fontFamily: "Poppins, sans-serif", fontSize: v.length > 5 ? 20 : 26 }}>{v}</p>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navegación interna */}
      <div className="sticky top-0 z-20" style={{ background: "rgba(255,255,255,0.94)", backdropFilter: "blur(8px)", borderBottom: "1px solid #E4E6F7" }}>
        <div className="max-w-5xl mx-auto px-6 py-3 flex gap-2 overflow-x-auto">
          {inPageNav.map(n => (
            <a key={n.a} href={`#${n.a}`}
              className="shrink-0 text-xs font-semibold px-3.5 py-2 rounded-full transition-colors hover:bg-[#EEF0FB]"
              style={{ color: "#272B7C", background: "#F7F8FF", border: "1px solid #E4E6F7", fontFamily: "Montserrat, sans-serif", textDecoration: "none", whiteSpace: "nowrap" }}>
              {n.l}
            </a>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-20">

        {/* Nuestra historia */}
        <section id="historia" style={{ scrollMarginTop: 76 }}>
          <NosotrosKicker icon="clock-history" label="Nuestra historia" />
          <div className="grid lg:grid-cols-2 gap-6 mt-6">
            <div className="relative overflow-hidden rounded-3xl p-8 md:p-10 flex flex-col justify-between"
              style={{ background: "linear-gradient(135deg, #14163F 0%, #272B7C 55%, #1800AD 100%)", minHeight: 320 }}>
              <span className="absolute select-none pointer-events-none font-bold"
                style={{ right: -14, bottom: -64, fontSize: 170, lineHeight: 1, color: "rgba(255,255,255,0.05)", fontFamily: "Poppins, sans-serif" }}>1983</span>
              <span className="absolute select-none pointer-events-none"
                style={{ top: 10, left: 26, fontSize: 90, lineHeight: 1, color: "#FFDE59", fontFamily: "Georgia, serif" }}>“</span>
              <p className="relative text-lg leading-relaxed mt-10" style={{ color: "#fff", fontFamily: "Poppins, sans-serif", fontWeight: 500 }}>
                Nacimos en 1983 en respuesta a una necesidad puntual de Ecopetrol de gestionar su información documental. A partir de esa experiencia, adecuamos en Bogotá un centro de información documental con especificaciones técnicas de custodia y capacitamos a nuestro personal como archivistas bajo normas archivísticas avanzadas.
              </p>
              <div className="relative flex items-center gap-3 mt-8">
                <span className="w-8 h-0.5 rounded-full" style={{ background: "#FFDE59" }} />
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.75)", fontFamily: "Montserrat, sans-serif" }}>Primera empresa de gestión documental en Bogotá</p>
              </div>
            </div>
            <div className="rounded-3xl p-7" style={{ background: "#F7F8FF", border: "1.5px solid #E4E6F7" }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif" }}>En más de 4 décadas, hemos…</p>
              <ul className="space-y-3">
                {[
                  "Mantenido los estándares archivísticos de seguridad, accesibilidad, eficiencia, integridad, autenticidad y fiabilidad.",
                  "Permanecido alineados con la Ley 594 de 2000, la Resolución 8934 de 2014 y el Decreto 962 (Ley Antitrámites).",
                  "Atendido multinacionales, pymes, microempresas y compañías en liquidación o reestructuración.",
                  "Desarrollado instrumentos técnicos como TVD, TRD, digitalización, microfilmación y custodia física, digital y en la nube.",
                ].map((t, i) => (
                  <li key={i} className="flex gap-3 text-sm" style={{ color: "#6B6B6B", lineHeight: 1.6 }}>
                    <Bi n="check-circle-fill" size={15} color="#C8960A" style={{ marginTop: 3, flexShrink: 0 }} />{t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Misión y visión */}
        <section id="mision-vision" style={{ scrollMarginTop: 76 }}>
          <NosotrosKicker icon="bullseye" label="Misión y visión" />
          <div className="grid lg:grid-cols-2 gap-6 mt-6">
            {[
              { t: "Misión", ic: "bullseye", x: "Somos pioneros de la gestión documental en Colombia. Ofrecemos soluciones integrales de consultoría archivística, administración, custodia física y transformación digital de la información, bajo el estricto cumplimiento legal. A través de servicios ágiles, in-house e inmediatos, aseguramos la calidad operativa y la seguridad de los datos (confidencialidad, integridad y disponibilidad). Nos comprometemos con la mejora continua de nuestros procesos para superar las expectativas de nuestras partes interesadas y mitigar los riesgos del entorno." },
              { t: "Visión", ic: "binoculars-fill", x: "Para el año 2030, queremos consolidar nuestro liderazgo en Colombia como proveedores integrales de custodia física, consultoría archivística y transformación digital. Seremos reconocidos por la excelencia de nuestros estándares de calidad, la solidez en la seguridad de la información y la adopción de tecnologías seguras en la nube, garantizando un crecimiento sostenible que impulse el desarrollo y la estabilidad de nuestros colaboradores." },
            ].map(m => (
              <div key={m.t} className="rounded-3xl p-8" style={{ background: "#fff", border: "1.5px solid #E4E6F7", boxShadow: "0 14px 34px -22px rgba(39,43,124,0.25)" }}>
                <BiTile n={m.ic} accent="#272B7C" size={46} />
                <p className="text-lg font-bold mt-4 mb-3" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>{m.t}</p>
                <p className="text-sm leading-relaxed" style={{ color: "#6B6B6B" }}>{m.x}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Nuestro equipo */}
        <section id="equipo" style={{ scrollMarginTop: 76 }}>
          <NosotrosKicker icon="people" label="Nuestro equipo" />
          <p className="text-sm max-w-2xl mt-4 mb-6" style={{ color: "#6B6B6B", lineHeight: 1.7 }}>
            Nuestro personal técnico de archivo está capacitado bajo normas archivísticas avanzadas y los lineamientos del Archivo General de la Nación (AGN). En los proyectos Inhouse, Transarchivos asume la figura de empleador del personal en sitio — selección, capacitación, reemplazos por incapacidad o vacaciones y evaluación de desempeño — con protocolos de contingencia ante ausencias, informes mensuales de gestión y cumplimiento de acuerdos de servicio.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { ic: "mortarboard-fill", t: "Formación archivística", x: "Personal capacitado bajo normas archivísticas avanzadas y lineamientos del AGN." },
              { ic: "person-badge-fill", t: "Empleador del personal Inhouse", x: "Selección, capacitación, reemplazos y evaluación de desempeño a cargo de Transarchivos." },
              { ic: "clipboard-data-fill", t: "KPIs y SLA medibles", x: "Informes mensuales de gestión y cumplimiento de acuerdos de servicio con el cliente." },
            ].map(c => (
              <div key={c.t} className="rounded-2xl p-5" style={{ background: "#F7F8FF", border: "1px solid #E4E6F7" }}>
                <BiTile n={c.ic} accent="#1800AD" size={40} />
                <p className="text-sm font-bold mt-3 mb-1" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>{c.t}</p>
                <p className="text-xs leading-relaxed" style={{ color: "#6B6B6B" }}>{c.x}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Cultura organizacional */}
        <section id="cultura" style={{ scrollMarginTop: 76 }}>
          <NosotrosKicker icon="heart" label="Cultura organizacional" />
          <p className="text-sm max-w-2xl mt-4 mb-6" style={{ color: "#6B6B6B", lineHeight: 1.7 }}>
            Nuestra cultura se sostiene en 4 principios que guían cómo trabajamos cada día con clientes, colegas, proveedores y visitantes.
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { t: "Compromiso", ic: "hand-thumbs-up-fill", x: "Cumplimos de manera oportuna y eficiente los requerimientos de nuestros clientes internos y externos." },
              { t: "Confidencialidad", ic: "shield-lock-fill", x: "Manejamos la información interna y externa de acuerdo con la legislación colombiana y las políticas de seguridad y privacidad establecidas." },
              { t: "Responsabilidad", ic: "patch-check-fill", x: "Brindamos un tratamiento especial a la información de nuestros clientes y de nuestra organización." },
              { t: "Sensibilidad humana", ic: "heart-fill", x: "Interactuamos con nuestros clientes, compañeros de trabajo, proveedores y visitantes como queremos ser tratados." },
            ].map((v, i) => (
              <div key={v.t} className="rounded-2xl p-5 transition-all hover:-translate-y-1" style={{ background: "#fff", border: "1.5px solid #E4E6F7" }}>
                <div className="mb-3"><BiTile n={v.ic} accent={i % 2 ? "#C8960A" : "#272B7C"} size={40} /></div>
                <p className="text-sm font-bold mb-1.5" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>{v.t}</p>
                <p className="text-xs leading-relaxed" style={{ color: "#6B6B6B" }}>{v.x}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Nuestros principales clientes */}
        <section id="clientes" style={{ scrollMarginTop: 76 }}>
          <NosotrosKicker icon="briefcase" label="Nuestros principales clientes" />
          <p className="text-sm max-w-2xl mt-4 mb-6" style={{ color: "#6B6B6B" }}>
            Atendemos multinacionales, pymes y microempresas, y también compañías en liquidación o reestructuración, en estos sectores:
          </p>
          <div className="grid grid-cols-3 gap-3 mb-4 max-w-2xl">
            {[
              { icon: "bank", label: "Financiero y aseguradoras" },
              { icon: "heart-pulse", label: "Salud y laboratorios" },
              { icon: "minecart-loaded", label: "Petróleo y minería" },
            ].map(s => (
              <div key={s.label} className="flex flex-col items-center text-center gap-3 rounded-2xl px-3 py-5 transition-all hover:-translate-y-1 cursor-default"
                style={{ background: "#F7F8FF", border: "1.5px solid #E4E6F7" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#272B7C"; e.currentTarget.style.boxShadow = "0 14px 28px -14px rgba(39,43,124,0.35)"; e.currentTarget.style.background = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#E4E6F7"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.background = "#F7F8FF"; }}>
                <div className="flex items-center justify-center rounded-2xl" style={{ width: 60, height: 60, background: "#fff", boxShadow: "0 6px 16px -8px rgba(39,43,124,0.25)" }}>
                  <Bi n={s.icon} size={26} color="#272B7C" />
                </div>
                <span className="text-xs font-semibold leading-tight" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif" }}>{s.label}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { n: "rulers", l: "Ingeniería e infraestructura" },
              { n: "bricks", l: "Construcción" },
              { n: "airplane-fill", l: "Líneas aéreas" },
              { n: "flask-fill", l: "Laboratorios" },
              { n: "arrow-repeat", l: "Compañías en liquidación o reestructuración" },
            ].map(s => (
              <span key={s.l} className="inline-flex items-center gap-2 text-xs font-semibold pl-2 pr-4 py-1.5 rounded-full" style={{ background: "#F7F8FF", color: "#272B7C", border: "1px solid #D5D9F5", fontFamily: "Montserrat, sans-serif" }}>
                <BiTile n={s.n} accent="#272B7C" size={26} />{s.l}
              </span>
            ))}
          </div>
        </section>

        {/* Tecnología y seguridad (antes "Aliados tecnológicos") */}
        <section id="aliados" style={{ scrollMarginTop: 76 }}>
          <NosotrosKicker icon="cpu" label="Tecnología y seguridad" />
          <p className="text-sm max-w-2xl mt-4 mb-6" style={{ color: "#6B6B6B", lineHeight: 1.7 }}>
            La infraestructura y los protocolos con los que protegemos su información:
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { ic: "thermometer-half", t: "Control ambiental 24 h", x: "Monitoreo automatizado de temperatura y humedad en el centro documental." },
              { ic: "magnet-fill", t: "Blindaje electromagnético", x: "Protección de medios magnéticos contra campos electromagnéticos." },
              { ic: "fire", t: "Extinción sin agua", x: "Sistemas de extinción de incendios con agentes limpios." },
              { ic: "camera-video-fill", t: "Monitoreo y CCTV", x: "Vigilancia perimetral constante y control de acceso restringido." },
              { ic: "truck", t: "Transporte con GPS", x: "Vehículos propios monitoreados por GPS y trazabilidad por código de barras." },
              { ic: "cloud-check-fill", t: "Copias air gap y nube segura", x: "Respaldo desconectado de la red y adopción de tecnologías seguras en la nube." },
            ].map(c => (
              <div key={c.t} className="rounded-2xl p-5" style={{ background: "#F7F8FF", border: "1px solid #E4E6F7" }}>
                <BiTile n={c.ic} accent="#C8960A" size={40} />
                <p className="text-sm font-bold mt-3 mb-1" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>{c.t}</p>
                <p className="text-xs leading-relaxed" style={{ color: "#6B6B6B" }}>{c.x}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Certificados */}
        <section id="certificados" style={{ scrollMarginTop: 76 }}>
          <NosotrosKicker icon="patch-check" label="Cumplimiento normativo" />
          <p className="text-xs font-bold uppercase tracking-wider mt-6 mb-3" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif" }}>Marco normativo con el que operamos</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {norms.map(n => (
              <div key={n.code} className="rounded-2xl p-4 flex flex-col justify-center transition-all hover:-translate-y-0.5"
                style={{ background: "#F7F8FF", border: "1.5px solid #E4E6F7" }}>
                <p className="text-sm font-bold" style={{ background: "linear-gradient(135deg,#272B7C,#1800AD)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontFamily: "Poppins, sans-serif" }}>{n.code}</p>
                <p className="text-[11px] leading-snug mt-1" style={{ color: "#6B6B6B" }}>{n.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <div className="rounded-3xl p-10 text-center" style={{ background: "#F7F8FF", border: "1.5px solid #E4E6F7" }}>
          <p className="text-xl font-bold mb-2" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>¿Hablamos de la gestión documental de su empresa?</p>
          <p className="text-sm mb-6" style={{ color: "#6B6B6B" }}>Escríbanos y un asesor especializado le contactará a la brevedad.</p>
          <Link to="/#faq" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold transition-all hover:scale-105"
            style={{ background: "#272B7C", color: "#fff", fontFamily: "Montserrat, sans-serif", textDecoration: "none", boxShadow: "0 14px 28px -10px rgba(39,43,124,0.45)" }}>
            Hablemos de su proyecto <Bi n="arrow-right" size={15} color="#fff" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Service detail page ───────────────────────────────────────────────────────
// Contenido de cada servicio tomado del "Informe Documento maestro"
// (definición, objetivos/beneficios, etapas, argumentos de venta, modalidades
// y normativa). Solo cifras que aparecen en ese documento.
