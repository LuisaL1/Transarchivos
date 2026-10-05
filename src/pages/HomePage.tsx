import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";
import { Link, useLocation, useNavigate, useNavigationType } from "react-router-dom";
import { track } from "@/lib/joel";
import { ChatBot } from "@/components/chat/ChatBot";
import { HeroAskJoel, HeroVideoBackground } from "@/components/home/Hero";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { BlogSection } from "@/components/sections/BlogSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { QuoteSimulator } from "@/components/sections/QuoteSimulator";
import { ServiceCard } from "@/components/sections/ServiceCard";
import { SolucionesSection } from "@/components/sections/SolucionesSection";
import { Logo } from "@/components/ui/Brand";
import { Bi, BiTile } from "@/components/ui/Icons";
import { Divider, SectionDecor } from "@/components/ui/SectionDecor";
import { services } from "@/data/services";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function HomePage() {
  // Estado del chat en App (no dentro de ChatBot): así el avatar del hero
  // también puede abrirlo con un clic, no solo el botón flotante.
  const [chatOpen, setChatOpen] = useState(false);
  const [chatSeed, setChatSeed] = useState<{ text: string; id: number } | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  // Animación de entrada (solo la carpeta): solo la primera carga de la sesión
  // y nunca con "reducir movimiento". El estado final es la página normal.
  const [intro] = useState(() => {
    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
      if (sessionStorage.getItem("ta-intro") === "1") return false;
      sessionStorage.setItem("ta-intro", "1");
    } catch { /* sin almacenamiento: se anima igual */ }
    return true;
  });
  useScrollReveal(pageRef);
  // Comportamiento del visitante (para Joel): qué secciones mira con calma.
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const seen = new Set<string>(); const timers: Record<string, number> = {};
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      const id = (e.target as HTMLElement).id;
      if (e.isIntersecting && !seen.has(id)) timers[id] = window.setTimeout(() => { seen.add(id); track("section", id); }, 1500);
      else clearTimeout(timers[id]);
    }), { threshold: 0.35 });
    ["diagnostico", "servicios", "soluciones", "modelo", "cotizador", "blog", "faq"].forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => { io.disconnect(); Object.values(timers).forEach(clearTimeout); };
  }, []);
  const navigateHome = useNavigate();
  const askJoel = (text: string) => { trackEvent("chat_question", { source: "hero" }); setChatSeed({ text, id: Date.now() }); setChatOpen(true); };

  const { hash, key: locKey } = useLocation();
  const navType = useNavigationType();
  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: "auto", block: "start" }));
  }, [hash, locKey]);
  // "Atrás" del navegador: al salir de la página principal se guarda la
  // posición; si se vuelve con atrás (POP), se restaura donde estaba en vez
  // de arrancar desde el inicio. Se reintenta un instante después porque
  // imágenes y fuentes pueden cambiar la altura de la página al cargar.
  // Se lee una sola vez al crear la página (antes de que cualquier limpieza
  // de efectos sobrescriba el valor guardado).
  const [savedScroll] = useState(() => { try { return Number(sessionStorage.getItem("ta-home-scroll")) || 0; } catch { return 0; } });
  useLayoutEffect(() => {
    const saved = savedScroll;
    if (navType === "POP" && !hash && saved > 0) {
      const go = () => window.scrollTo(0, saved);
      go(); requestAnimationFrame(go); const t = window.setTimeout(go, 350);
      return () => clearTimeout(t);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => { try { sessionStorage.setItem("ta-home-scroll", String(window.scrollY)); } catch { /* sin almacenamiento */ } }, []);

  return (
    <div ref={pageRef} className="min-h-full" style={{ background: "#ffffff", fontFamily: "Inter, sans-serif", color: "#37352F" }}>

      <SiteHeader onChat={() => setChatOpen(true)} />

      {/* ── HERO ────────────────────────────────────────────────────────────
          Centrado sobre los videos de fondo: insignia, título, bajada y una
          caja para escribirle directo a Joel. Debajo, la franja navy con una
          muesca recortada (a través de ella se ven los videos) y la sección
          "Dónde operamos". */}
      <section className="relative overflow-hidden" style={{ background: "#3a3c56" }}>
        <HeroVideoBackground />
        <div className="relative">
        <div className="relative max-w-2xl mx-auto px-6 pt-24 md:pt-44 pb-4 text-center flex flex-col justify-center min-h-[62svh] md:min-h-[72vh]">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5" style={{ fontFamily: "Poppins, sans-serif", color: "#fff", lineHeight: 1.15, textShadow: "0 2px 18px rgba(10,13,61,0.45)" }}>
            Sus archivos,<br />
            bajo{" "}
            <span className="inline-block rounded-xl md:rounded-2xl px-3 md:px-4 align-middle" style={{ background: "#FFDE59", color: "#272B7C", textShadow: "none", paddingBottom: "0.12em" }}>resguardo</span>.
          </h1>

          <p className="text-base max-w-2xl mx-auto mb-7" style={{ color: "rgba(255,255,255,0.85)", textWrap: "balance", textShadow: "0 1px 10px rgba(10,13,61,0.5)" }}>
            Clasificamos, digitalizamos, custodiamos y destruimos legalmente sus documentos
          </p>

          <HeroAskJoel onAsk={askJoel} />
        </div>
        </div>

        {/* Carpeta: cuerpo de un solo color (mismo tono claro de la sección de blog, #FBFBF8) con una pestaña
            arriba a la izquierda, como una carpeta de archivo, sobre los videos. */}
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 mt-10 md:mt-36">
          <div className={`relative h-[44px] sm:h-[100px] md:h-[170px] ${intro ? "folder-intro" : ""}`}>
            {/* La pestaña baja 3 px por dentro del cuerpo (se solapan) para que
                nunca se vea una línea de corte entre ambos durante la animación. */}
            <svg className="folder-tab absolute left-0 block w-[170px] h-[30px] sm:w-[280px] sm:h-[49px]" viewBox="0 0 280 49" preserveAspectRatio="none" aria-hidden="true" style={{ bottom: "calc(100% - 3px)" }}>
              <path d="M0 49 V18 Q0 0 18 0 H196 Q209 0 217 10 L242 38 Q249 46 262 46 H280 V49 Z" fill="#FBFBF8" />
            </svg>
            <div className="absolute inset-0" style={{ background: "#FBFBF8", borderRadius: "0 28px 0 0" }} />
          </div>
        </div>

        {/* Bottom trust bar */}
        <div className="relative border-t py-3 md:py-4" style={{ borderColor: "#E9E9E7", background: "#fff" }}>
          <div className="max-w-6xl mx-auto px-5 md:px-8 flex flex-wrap justify-center md:justify-between items-center gap-x-4 gap-y-2 md:gap-4">
            {["Ley 594 de 2000", "Norma AGN", "Certificado de destrucción", "Custodia con vigilancia 24 h"].map(t => (
              <span key={t} className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "#6B7280", fontFamily: "Montserrat, sans-serif" }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6.5" stroke="#272B7C" strokeOpacity=".3"/><path d="M4 7l2 2 4-4" stroke="#272B7C" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── DIAGNÓSTICO DOCUMENTAL (producto de entrada) ─────────────────────
          Antes vivía al final de "Cómo trabajamos"; ahora se presenta antes
          de las unidades de negocio, como punto de partida para quien no
          sabe qué servicio necesita — el "producto nuevo" de la casa. */}
      <section id="diagnostico" className="relative isolate overflow-hidden py-10 md:py-16" style={{ scrollMarginTop: 80 }}>
        <SectionDecor variant="cream" />
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="relative overflow-hidden rounded-3xl grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]"
            style={{ background: "#fff", border: "1.5px solid #E4E6F7", boxShadow: "0 30px 60px -34px rgba(39,43,124,0.3)" }}>

            {/* Izquierda: propuesta + proceso */}
            <div className="relative p-6 md:p-10">
              <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-4"
                style={{ background: "linear-gradient(135deg, #272B7C, #1800AD)", color: "#fff", fontFamily: "Montserrat, sans-serif", boxShadow: "0 8px 16px -8px rgba(39,43,124,0.5)" }}>
                Diagnóstico documental
              </span>
              <h3 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif", lineHeight: 1.2 }}>
                La <span style={{ background: "linear-gradient(transparent 62%, #FFDE59 62%)" }}>radiografía completa</span> de su archivo, antes de mover un solo papel
              </h3>
              <p className="text-sm mb-8" style={{ color: "#6B6B6B", lineHeight: 1.65 }}>
                No le preguntamos qué servicio quiere: le mostramos qué está pasando hoy con su archivo, para que decida con información real — no con suposiciones.
              </p>

              {/* Proceso en 4 pasos (línea de tiempo vertical) */}
              <ol className="relative mb-9">
                <span className="absolute w-0.5 rounded-full" style={{ left: 15, top: 16, bottom: 16, background: "#E4E6F7" }} />
                {[
                  { t: "Diagnóstico", d: "Revisamos su archivo tal como está hoy." },
                  { t: "Hallazgos", d: "Identificamos volumen, estado, riesgos y oportunidades." },
                  { t: "Plan de acción", d: "Priorizamos qué hacer primero y con qué servicios." },
                  { t: "Propuesta", d: "Recibe una propuesta clara, con alcance y tiempos." },
                ].map((st, i) => (
                  <li key={st.t} className="relative flex items-start gap-4 pb-5 last:pb-0">
                    <span className="relative flex items-center justify-center rounded-full font-bold text-xs shrink-0"
                      style={{ width: 32, height: 32, background: i === 0 ? "#272B7C" : "#fff", color: i === 0 ? "#fff" : "#272B7C", border: "2px solid #272B7C", fontFamily: "Poppins, sans-serif" }}>
                      {i + 1}
                    </span>
                    <div className="pt-1">
                      <p className="text-sm font-bold" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>{st.t}</p>
                      <p className="text-xs mt-0.5" style={{ color: "#8A8A8A" }}>{st.d}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <a href="#cotizador" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95"
                style={{ background: "#272B7C", color: "#fff", fontFamily: "Montserrat, sans-serif", textDecoration: "none", boxShadow: "0 14px 28px -10px rgba(39,43,124,0.45)" }}>
                Solicitar diagnóstico <Bi n="arrow-right" size={15} color="#fff" />
              </a>
            </div>

            {/* Derecha: "informe" con lo que identifica */}
            <div className="relative p-6 md:p-10 flex items-center" style={{ background: "#F7F8FF" }}>
              <Bi n="search" size={260} color="#272B7C"
                className="hidden md:block absolute pointer-events-none select-none"
                style={{ top: -40, right: -40, opacity: 0.04, transform: "rotate(12deg)" }} />
              <div className="relative w-full rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1px solid #E4E6F7", boxShadow: "0 24px 48px -28px rgba(39,43,124,0.35)" }}>
                <div className="flex items-center justify-between gap-3 px-5 py-4" style={{ borderBottom: "1px solid #ECEEF6" }}>
                  <span className="flex items-center gap-3">
                    <BiTile n="file-earmark-text" size={36} accent="#1800AD" />
                    <span>
                      <span className="block text-sm font-bold" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>Informe de diagnóstico</span>
                      <span className="block text-[11px]" style={{ color: "#9B9B9B" }}>Lo que identificamos en su archivo</span>
                    </span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0" style={{ background: "#FFF6D6", color: "#8a6d00", fontFamily: "Montserrat, sans-serif" }}>7 puntos</span>
                </div>
                <ul className="px-5 py-1.5">
                  {[
                    { i: "stack", t: "Volumen y estado documental", d: "Cuántos documentos tiene y en qué condición se encuentran" },
                    { i: "rulers", t: "Espacio ocupado", d: "Metros lineales o cúbicos que ocupa su archivo hoy" },
                    { i: "list-check", t: "Inventario y organización", d: "Cómo están clasificados y si siguen la TRD vigente" },
                    { i: "upc-scan", t: "Oportunidades de digitalización", d: "Qué series pueden pasar a un flujo digital" },
                    { i: "shield-check", t: "Necesidades de custodia", d: "Qué debe resguardarse bajo condiciones controladas" },
                    { i: "hourglass-bottom", t: "Disposición final", d: "Qué documentos ya cumplieron su tiempo de retención" },
                    { i: "exclamation-triangle", t: "Riesgos y oportunidades de mejora", d: "Vacíos normativos y puntos por optimizar" },
                  ].map((f, k) => (
                    <li key={f.t} className="flex items-center gap-3 py-2.5" style={{ borderTop: k ? "1px solid #F1F2F8" : "none" }}>
                      <BiTile n={f.i} size={32} accent="#272B7C" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-semibold leading-snug" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif" }}>{f.t}</p>
                        <p className="text-[11px] leading-snug" style={{ color: "#8A8A8A" }}>{f.d}</p>
                      </div>
                      <Bi n="check-circle-fill" size={15} color="#16a34a" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* ── SERVICES ────────────────────────────────────────────────────── */}
      <section id="servicios" className="relative isolate overflow-hidden py-20">
        <SectionDecor variant="lavender" flip />
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-bold uppercase tracking-widest text-center mb-3" style={{ color: "#9B9B9B", fontFamily: "Montserrat, sans-serif" }}>
            Lo que hacemos
          </p>
          <h2 className="text-3xl font-bold text-center mb-14" style={{ fontFamily: "Poppins, sans-serif", color: "#272B7C" }}>
            Soluciones documentales a la medida
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" style={{ marginTop: 40 }}>
            {services.map(s => <ServiceCard key={s.title} service={s} />)}
          </div>

          {/* CTA */}
          <div className="mt-12 flex justify-center">
            <a href="#faq" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all hover:scale-105"
              style={{ background: "#272B7C", color: "#ffffff", fontFamily: "Montserrat, sans-serif", textDecoration: "none", boxShadow: "0 14px 28px -10px rgba(39,43,124,0.45)" }}>
              Agendar diagnóstico →
            </a>
          </div>
        </div>
      </section>

      <Divider />

      <SolucionesSection />

      <Divider />

      {/* ── MODELO: DIAGNÓSTICO → SOLUCIÓN → PROTECCIÓN → EXPANSIÓN ──────────
          Contenido del documento "Modelo de Negocio - Transarchivos". */}
      <section id="modelo" className="relative isolate overflow-hidden py-20">
        <SectionDecor variant="cream" folder={false} />
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true" style={{ zIndex: 0 }}>
          {/* Un resplandor navy sutil (se quitó el dorado — se veía como una
              mancha amarilla pegada a la esquina). */}

        </div>

        <div className="relative max-w-6xl mx-auto px-6" style={{ zIndex: 1 }}>
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#9B9B9B", fontFamily: "Montserrat, sans-serif" }}>Cómo trabajamos</p>
            <h2 className="text-3xl md:text-4xl font-bold max-w-3xl mx-auto" style={{ fontFamily: "Poppins, sans-serif", color: "#272B7C", lineHeight: 1.2 }}>
              Su socio integral para <span style={{ background: "linear-gradient(transparent 62%, #FFDE59 62%)" }}>todo el ciclo de vida documental</span>
            </h2>
            <p className="text-sm mt-4 max-w-2xl mx-auto" style={{ color: "#6B6B6B" }}>
              Le ayudamos a diagnosticar, organizar, transformar, proteger y disponer correctamente de su información documental. Cada servicio cumple una función dentro de un mismo recorrido.
            </p>
          </div>

          <div className="relative grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { n: 1, t: "Diagnóstico", k: "Entrada", ic: "clipboard2-pulse-fill", c: "#C8960A", d: "Detectamos su necesidad y abrimos la relación entendiendo qué pasa hoy con su archivo.", g: "linear-gradient(135deg, #B8860B 0%, #E5AE1A 100%)",
                items: [{ i: "search", l: "Diagnóstico documental", href: "#cotizador" }, { i: "list-columns-reverse", l: "Levantamiento de inventario", to: "/servicios/levantamiento-de-inventario" }] },
              { n: 2, t: "Solución", k: "Transformación", ic: "gear-wide-connected", c: "#272B7C", d: "Resolvemos el problema documental con un proyecto a la medida.", g: "linear-gradient(135deg, #272B7C 0%, #4B50A0 100%)",
                items: [{ i: "upc-scan", l: "Digitalización", to: "/servicios/digitalizacion-de-documentos" }, { i: "folder2-open", l: "Programa de Gestión Documental", to: "/servicios/programa-de-gestion-documental" }] },
              { n: 3, t: "Protección", k: "Recurrencia", ic: "shield-fill-check", c: "#1800AD", d: "Protegemos su información y la mantenemos disponible cuando la necesite.", g: "linear-gradient(135deg, #1800AD 0%, #5B3FD4 100%)",
                items: [{ i: "archive", l: "Custodia de archivos", to: "/servicios/custodia-de-archivos" }, { i: "hdd-stack", l: "Custodia de medios magnéticos", to: "/servicios/custodia-de-medios-magneticos" }] },
              { n: 4, t: "Expansión", k: "Nuevos proyectos", ic: "rocket-takeoff-fill", c: "#272B7C", d: "Cerramos el ciclo de vida documental y ampliamos el valor de la relación.", g: "linear-gradient(135deg, #14163F 0%, #272B7C 100%)",
                items: [{ i: "file-earmark-x", l: "Destrucción legal", to: "/servicios/destruccion-de-documentos" }, { i: "lightning-charge", l: "Servicio inmediato", to: "/servicios/servicio-inmediato" }, { i: "person-badge", l: "Servicio Inhouse", to: "/servicios/servicio-inhouse" }] },
            ].map((st, idx, arr) => (
              <div key={st.n} role="link" tabIndex={0}
                // Toda la tarjeta lleva a su primer servicio (los enlaces de
                // adentro conservan su propio destino). Mismo efecto de las
                // tarjetas de servicios, sin cambiar el borde.
                onClick={e => { if ((e.target as HTMLElement).closest("a")) return; const f = st.items[0]; if ("to" in f && f.to) navigateHome(f.to); else navigateHome("/?servicio=diagnostico#cotizador"); }}
                onKeyDown={e => { if (e.key !== "Enter") return; const f = st.items[0]; if ("to" in f && f.to) navigateHome(f.to); else navigateHome("/?servicio=diagnostico#cotizador"); }}
                className="group relative rounded-3xl flex flex-col cursor-pointer card-lift"
                // z-index decreciente: cada tarjeta queda por encima de la
                // siguiente, así su flecha amarilla (que se monta sobre el borde
                // de la tarjeta de al lado) siempre se ve completa, incluso al
                // pasar el mouse.
                style={{ background: "#fff", border: "1.5px solid #E4E6F7", zIndex: arr.length - idx }}>
                <div className="relative px-6 pt-6 pb-7 overflow-hidden" style={{ background: st.g, borderRadius: "22px 22px 0 0", minHeight: 150 }}>
                  <span className="absolute select-none pointer-events-none font-bold" style={{ right: -6, top: -22, fontSize: 130, lineHeight: 1, color: "rgba(255,255,255,0.14)", fontFamily: "Poppins, sans-serif" }}>{st.n}</span>
                  <div className="relative">
                    <span className="inline-flex items-center justify-center mb-3" style={{ width: 46, height: 46, borderRadius: 14, background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.35)", backdropFilter: "blur(4px)" }}>
                      <Bi n={st.ic} size={23} color="#fff" />
                    </span>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: "rgba(255,255,255,0.8)", fontFamily: "Montserrat, sans-serif" }}>Paso {st.n} · {st.k}</p>
                    <p className="text-2xl font-bold" style={{ color: "#fff", fontFamily: "Poppins, sans-serif" }}>{st.t}</p>
                  </div>
                </div>
                <div className="flex flex-col flex-1 p-6">
                  <p className="text-sm mb-5" style={{ color: "#6B6B6B", lineHeight: 1.6 }}>{st.d}</p>
                  <ul className="space-y-2 mt-auto">
                    {st.items.map(it => {
                      const inner = (
                        <>
                          <span className="flex items-center justify-center rounded-xl shrink-0" style={{ width: 38, height: 38, background: "#F7F8FF", border: "1px solid #E4E6F7" }}>
                            <Bi n={it.i} size={17} color="#272B7C" />
                          </span>
                          <span className="flex-1">{it.l}</span>
                          <Bi n="arrow-right" size={14} color="#1800AD" className="transition-transform group-hover/item:translate-x-1" />
                        </>
                      );
                      const cls = "group/item flex items-center gap-3 text-xs font-semibold rounded-2xl px-2.5 py-2 transition-colors hover:bg-[#F7F8FF]";
                      const sty = { color: "#272B7C", fontFamily: "Montserrat, sans-serif", textDecoration: "none" } as const;
                      return (
                        <li key={it.l}>
                          {"to" in it && it.to
                            ? <Link to={it.to} className={cls} style={sty}>{inner}</Link>
                            : <a href={it.href} className={cls} style={sty}>{inner}</a>}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                {idx < arr.length - 1 && (
                  <span className="hidden lg:flex absolute items-center justify-center rounded-full z-10 font-bold"
                    style={{ width: 34, height: 34, top: 36, right: -29, background: "#FFDE59", color: "#1800AD", boxShadow: "0 8px 18px -6px rgba(200,150,10,0.6)", fontSize: 16 }}><Bi n="arrow-right" size={17} color="#1800AD" style={{ WebkitTextStroke: "0.5px #1800AD" }} /></span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      <div className="relative isolate overflow-hidden">
        <SectionDecor variant="lavender" joel />
        <QuoteSimulator />
      </div>

      <Divider />

      <BlogSection />

      <Divider />

      {/* ── VIDEOS + REDES SOCIALES ───────────────────────────────────────────
          3 videos reales del canal de YouTube de Transarchivos
          (youtube.com/@Transarchivosltda), elegidos por el cliente —
          embebidos vía youtube-nocookie.com (modo de privacidad ampliada).
          Las redes sociales, que antes vivían en la sección de Contacto
          (eliminada), se muestran acá debajo del canal de YouTube. */}
      <section className="relative isolate overflow-hidden">
      <SectionDecor variant="cream" />
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-8">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#9B9B9B", fontFamily: "Montserrat, sans-serif" }}>Conéctese con nosotros</p>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "Poppins, sans-serif", color: "#272B7C" }}>
            Contenido y redes sociales de Transarchivos
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            { id: "a_t-MWf08k8", title: "¡Evite sanciones en auditorías 2026! Cómo preparar su archivo empresarial HOY · #JoelTeLoCuenta" },
            { id: "V39D_X_ip34", title: "Ley 594 de 2000 en Colombia: qué es, cómo se aplica y por qué cumplirla · #JoelTeLoCuenta" },
            { id: "7eK4K0Smbt0", title: "¿Qué es un diagnóstico documental y para qué sirve? · Servicio Transarchivos" },
          ].map(v => (
            <div key={v.id} className="rounded-2xl overflow-hidden" style={{ border: "1px solid #E9E9E7", boxShadow: "0 20px 40px -24px rgba(39,43,124,0.25)" }}>
              <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${v.id}`}
                  title={v.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <p className="p-4 text-sm font-semibold leading-snug" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif" }}>{v.title}</p>
            </div>
          ))}
        </div>

        <div className="text-center mb-10">
          <a href="https://www.youtube.com/@Transarchivosltda" target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all hover:scale-105"
            style={{ background: "#272B7C", color: "#fff", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
            <Bi n="youtube" size={16} color="#fff" />
            Ver más en nuestro canal
          </a>
        </div>

        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#9B9B9B", fontFamily: "Montserrat, sans-serif" }}>Síganos en nuestras redes</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { n: "LinkedIn", ic: "linkedin", u: "https://linkedin.com/company/transarchivos-ltda01" },
              { n: "Facebook", ic: "facebook", u: "https://facebook.com/profile.php?id=61569443213087" },
              { n: "Instagram", ic: "instagram", u: "https://instagram.com/transarchivos" },
              { n: "TikTok", ic: "tiktok", u: "https://tiktok.com/@transarchivos" },
              { n: "YouTube", ic: "youtube", u: "https://youtube.com/@Transarchivosltda" },
            ].map(({ n: r, ic, u }) => (
              <a key={r} href={u} target="_blank" rel="noreferrer" aria-label={r} title={r} className="flex items-center justify-center transition-all hover:-translate-y-0.5"
                style={{ width: 40, height: 40, borderRadius: 12, background: "#272B7C14", textDecoration: "none" }}>
                <Bi n={ic} size={19} color="#272B7C" />
              </a>
            ))}
          </div>
        </div>
      </div>
      </section>

      <Divider />

      <FaqSection onChat={() => setChatOpen(true)} />

      <Divider />

      {/* ── POR QUÉ TRANSARCHIVOS ────────────────────────────────────────────
          Franja de confianza (5 diferenciales), a los colores de marca y con
          contenido real del modelo de negocio / documento maestro: cumplimiento
          normativo, custodia con vigilancia 24 h, costo variable y escalable,
          servicios ágiles/in-house/inmediatos, y trayectoria desde 1983.
          Después de Contacto; fondo claro y sobrio — sigue usando navy/dorado
          de marca, pero sin el degradado fuerte. */}
      <section className="relative overflow-hidden" style={{ background: "#F7F8FF" }}>
        <div className="relative max-w-6xl mx-auto px-6 py-5">
          <div className="grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x" style={{ borderColor: "#E4E6F7" }}>
            {[
              { ic: "shield-check", t: "Cumplimiento normativo", d: "Operamos bajo la Ley 594 de 2000 y la normativa del AGN." },
              { ic: "camera-video-fill", t: "Custodia con vigilancia 24/7", d: "Centro documental con CCTV, control de acceso y monitoreo ambiental permanente." },
              { ic: "graph-up-arrow", t: "Costo variable y escalable", d: "Paga por el volumen exacto que custodia, sin costos fijos de espacio o personal." },
              { ic: "lightning-charge-fill", t: "Ágil, in-house e inmediato", d: "Del diagnóstico al despacho express, adaptados al ritmo de su operación." },
              { ic: "award-fill", t: "Trayectoria desde 1983", d: "Pioneros de la gestión documental en Colombia, con más de 40 años de experiencia." },
            ].map(f => (
              <div key={f.t} className="flex flex-col items-center text-center gap-1.5 px-4 py-2.5 md:py-0" style={{ borderColor: "#E4E6F7" }}>
                <span className="flex items-center justify-center rounded-full shrink-0" style={{ width: 34, height: 34, border: "1.5px solid #C8960A" }}>
                  <Bi n={f.ic} size={14} color="#C8960A" />
                </span>
                <div>
                  <p className="text-xs font-bold mb-0.5" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>{f.t}</p>
                  <p className="text-[11px] leading-snug" style={{ color: "#6B6B6B" }}>{f.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── FOOTER ───────────────────────────────────────────────────────────
          Rediseñado: fondo propio (antes se fundía con el blanco de la
          sección de arriba), enlaces reales en vez de "#" muertos (cada
          servicio a su propia página, "Empresa" a los anclajes reales de
          /nosotros), columna de contacto (con los datos reales que antes
          vivían en la sección de Contacto, eliminada), e íconos de redes
          en vez de texto plano en la barra inferior. */}
      <footer style={{ background: "#F7F8FF" }}>
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div>
              <Logo size="sm" />
              <p className="mt-4 text-sm leading-relaxed max-w-xs" style={{ color: "#8A8A8A" }}>
                Empresa colombiana de gestión documental. Clasificación, digitalización, custodia, conservación y destrucción legal de archivos bajo normativa AGN.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif" }}>Servicios</p>
              <ul className="space-y-2.5">
                {services.map(s => (
                  <li key={s.title}>
                    <Link to={`/servicios/${s.slug}`} className="text-sm transition-colors" style={{ color: "#6B6B6B" }}
                      onMouseEnter={e => e.currentTarget.style.color = "#1800AD"} onMouseLeave={e => e.currentTarget.style.color = "#6B6B6B"}>
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif" }}>Empresa</p>
              <ul className="space-y-2.5">
                {[
                  { label: "Quiénes somos", to: "/nosotros#quienes-somos" },
                  { label: "Nuestra historia", to: "/nosotros#historia" },
                  { label: "Normativa y certificados", to: "/nosotros#certificados" },
                  { label: "Nuestros clientes", to: "/nosotros#clientes" },
                  { label: "Preguntas frecuentes", to: "/#faq" },
                ].map(item => (
                  <li key={item.label}>
                    <Link to={item.to} className="text-sm transition-colors" style={{ color: "#6B6B6B" }}
                      onMouseEnter={e => e.currentTarget.style.color = "#1800AD"} onMouseLeave={e => e.currentTarget.style.color = "#6B6B6B"}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif" }}>Contacto</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5 text-sm" style={{ color: "#6B6B6B" }}>
                  <Bi n="geo-alt-fill" size={14} color="#C8960A" style={{ marginTop: 3, flexShrink: 0 }} />
                  Cl. 21 # 39A-40, Bogotá, Colombia
                </li>
                <li>
                  <a href="tel:+576013164530" className="flex items-start gap-2.5 text-sm transition-colors" style={{ color: "#6B6B6B" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#1800AD"} onMouseLeave={e => e.currentTarget.style.color = "#6B6B6B"}>
                    <Bi n="telephone-fill" size={14} color="#C8960A" style={{ marginTop: 3, flexShrink: 0 }} />
                    (601) 316-4530
                  </a>
                </li>
                <li>
                  <a href="mailto:info@transarchivos.com" className="flex items-start gap-2.5 text-sm transition-colors break-all" style={{ color: "#6B6B6B" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#1800AD"} onMouseLeave={e => e.currentTarget.style.color = "#6B6B6B"}>
                    <Bi n="envelope-fill" size={14} color="#C8960A" style={{ marginTop: 3, flexShrink: 0 }} />
                    info@transarchivos.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="h-px" style={{ background: "#E4E6F7" }} />

          <div className="pt-6 flex flex-wrap justify-between items-center gap-4">
            <p className="text-xs" style={{ color: "#9B9B9B" }}>© {new Date().getFullYear()} Transarchivos Ltda. · Bogotá, Colombia</p>
            <div className="flex gap-2">
              {[
                { n: "LinkedIn", ic: "linkedin", u: "https://linkedin.com/company/transarchivos-ltda01" },
                { n: "Facebook", ic: "facebook", u: "https://facebook.com/profile.php?id=61569443213087" },
                { n: "Instagram", ic: "instagram", u: "https://instagram.com/transarchivos" },
                { n: "TikTok", ic: "tiktok", u: "https://tiktok.com/@transarchivos" },
                { n: "YouTube", ic: "youtube", u: "https://youtube.com/@Transarchivosltda" },
              ].map(({ n: r, ic, u }) => (
                <a key={r} href={u} target="_blank" rel="noreferrer" aria-label={r} title={r} className="flex items-center justify-center transition-all hover:-translate-y-0.5"
                  style={{ width: 34, height: 34, borderRadius: 10, background: "#272B7C14", textDecoration: "none" }}>
                  <Bi n={ic} size={15} color="#272B7C" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <ChatBot open={chatOpen} setOpen={setChatOpen} seed={chatSeed} />
    </div>
  );
}

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
