// ─── App ──────────────────────────────────────────────────────────────────────
// Toda la página principal (antes era el App exportado directamente). Ahora
// App es un enrutador liviano: esto vive en "/", y cada card de servicio
// enlaza a su propia página en "/servicios/:slug" (ver ServiceDetailPage).

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { JoelBridge } from "@/components/ui/JoelBridge";
import { JOEL } from "@/data/joelPoses";
import avatarImg from "@/assets/images/joel.webp";
import { Link, useLocation, useNavigate, useNavigationType } from "react-router-dom";
import { track } from "@/lib/visitor";
import { ChatBot } from "@/components/chat/LazyChatBot";
import { HeroQuickStart, HeroRotatingWord, HeroVideoBackground } from "@/components/home/Hero";
import { MapReveal } from "@/components/home/MapReveal";
import { Stats } from "@/components/home/Stats";
import { ClientsMarquee } from "@/components/home/ClientsMarquee";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { BlogSection } from "@/components/sections/BlogSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { QuoteSimulator } from "@/components/sections/QuoteSimulator";
import { ServiceCard } from "@/components/sections/ServiceCard";
import { SolucionesSection } from "@/components/sections/SolucionesSection";
import { Logo } from "@/components/ui/Brand";
import { Bi, BiTile } from "@/components/ui/Icons";
import { FolderDivider, SectionDecor } from "@/components/ui/SectionDecor";
import { services } from "@/data/services";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { WHATSAPP_LABEL, whatsappUrl } from "@/data/contact";
import { C } from "@/styles/tokens";

export function HomePage() {
  // Estado del chat en App (no dentro de ChatBot): así el avatar del hero
  // también puede abrirlo con un clic, no solo el botón flotante.
  const [chatOpen, setChatOpen] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
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

  const { hash, key: locKey } = useLocation();
  const navType = useNavigationType();
  // Llegada con ancla (p. ej. "/#servicios" desde un servicio): se lleva a la
  // sección y se vuelve a ajustar mientras la página termina de acomodarse
  // (el mapa, las imágenes y las fuentes cambian la altura al cargar).
  useEffect(() => {
    if (!hash) return;
    const go = () => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "auto", block: "start" });
    let stop = false;
    const cancel = () => { stop = true; };
    window.addEventListener("wheel", cancel, { passive: true, once: true });
    window.addEventListener("touchstart", cancel, { passive: true, once: true });
    const timers = [0, 120, 400, 900, 1600].map(ms => window.setTimeout(() => { if (!stop) go(); }, ms));
    requestAnimationFrame(go);
    return () => { timers.forEach(clearTimeout); window.removeEventListener("wheel", cancel); window.removeEventListener("touchstart", cancel); };
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
          Video a pantalla completa de fondo (con velo azul marino para la
          lectura) y el contenido centrado: título animado, frase y el
          selector "¿Qué necesita hoy?" con Joel a su lado. */}
      <section className="relative overflow-hidden" style={{ background: C.indigo }}>
        <HeroVideoBackground />
        {/* Sombra negra arriba: da contraste al navbar sobre el video. */}
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-36 pointer-events-none" style={{ zIndex: 2, background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 45%, transparent 100%)" }} />

        <div className="relative min-h-[70svh] md:min-h-[88vh] flex items-center justify-center" style={{ zIndex: 3 }}>
          <div className="w-full max-w-3xl mx-auto px-6 pt-28 pb-14 md:pt-36 md:pb-16 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-[56px] xl:text-[62px] font-bold tracking-tight mb-5" style={{ fontFamily: "Poppins, sans-serif", color: "#fff", lineHeight: 1.12, textShadow: "0 2px 22px rgba(0,0,0,0.35)" }}>
              Sus archivos,<br />
              <span className="whitespace-nowrap">bajo <HeroRotatingWord />.</span>
            </h1>
            <p className="text-base lg:text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.9)", lineHeight: 1.6, textShadow: "0 1px 12px rgba(0,0,0,0.35)" }}>
              Clasificamos, digitalizamos, custodiamos y destruimos legalmente sus documentos
            </p>
            {/* Joel (imagen de la marca en redes) junto a la tarjeta, volteado
                para que señale el selector. Clic: abre el chat. */}
            <div className="relative max-w-[440px] mx-auto">
              <HeroQuickStart />
              {/* Solo el cuerpo (fuera de la tarjeta) recibe el clic: la mano
                  queda encima de las pestañas sin bloquearlas. */}
              <div className="group hidden lg:flex absolute bottom-[30px] left-full -ml-[68px] items-end w-[176px] pointer-events-none" style={{ zIndex: 3 }}>
                <img src={avatarImg} alt="" draggable={false} className="select-none h-[270px] w-[176px] max-w-none transition-transform duration-300 group-hover:-translate-y-1"
                  style={{ transform: "scaleX(-1)", filter: "drop-shadow(0 18px 24px rgba(0,0,0,0.35))" }} />
                <button type="button" onClick={() => setChatOpen(true)} aria-label="Hablar con Joel"
                  className="absolute inset-y-0 right-0 left-[76px] pointer-events-auto rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative">
        {/* Bottom trust bar */}
        <div className="relative border-t py-3 md:py-4" style={{ borderColor: "#E9E9E7", background: "#fff" }}>
          <div className="max-w-6xl mx-auto px-5 md:px-8 flex flex-wrap justify-center md:justify-between items-center gap-x-4 gap-y-2 md:gap-4">
            {["Ley 594 de 2000", "Norma AGN", "Certificado de destrucción", "Custodia con vigilancia 24 h"].map(t => (
              <span key={t} className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "#6B7280", fontFamily: "Montserrat, sans-serif" }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6.5" stroke={C.indigo} strokeOpacity=".3"/><path d="M4 7l2 2 4-4" stroke={C.indigo} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <MapReveal />

      <ClientsMarquee />

      <Stats />

      {/* ── DIAGNÓSTICO DOCUMENTAL (producto de entrada) ─────────────────────
          Antes vivía al final de "Cómo trabajamos"; ahora se presenta antes
          de las unidades de negocio, como punto de partida para quien no
          sabe qué servicio necesita — el "producto nuevo" de la casa. */}
      <section id="diagnostico" className="relative isolate overflow-hidden py-10 md:py-16" style={{ scrollMarginTop: 80 }}>
        <SectionDecor variant="light" />
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="relative overflow-hidden rounded-3xl grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]"
            style={{ background: "#fff", border: "1.5px solid #E4E6F7", boxShadow: "0 30px 60px -34px rgba(0,0,0,0.5)" }}>

            {/* Izquierda: propuesta + proceso */}
            <div className="relative p-6 md:p-10">
              <span className="relative overflow-hidden inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-4"
                style={{ background: C.indigo, color: "#fff", fontFamily: "Montserrat, sans-serif", boxShadow: "0 8px 16px -8px rgba(24,0,173,0.5)" }}>
                <span aria-hidden="true" className="absolute pointer-events-none" style={{ right: -12, top: -12, width: 24, height: 24, transform: "rotate(45deg)", borderRadius: 4, background: "rgba(255,222,89,0.3)" }} />
                <span className="relative">Diagnóstico documental</span>
              </span>
              <h3 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: C.indigo, fontFamily: "Poppins, sans-serif", lineHeight: 1.2 }}>
                La <span style={{ background: "linear-gradient(transparent 62%, #FFDE59 62%)" }}>radiografía completa</span> de su archivo, antes de mover un solo papel
              </h3>
              <p className="text-sm mb-8" style={{ color: C.muted, lineHeight: 1.65 }}>
                Antes de recomendarle un servicio, analizamos el estado de su archivo. Así podrá tomar decisiones informadas, basadas en hallazgos reales y no en suposiciones.
              </p>

              {/* Proceso en 4 pasos (línea de tiempo vertical) */}
              <div className="relative mb-9">
                <span aria-hidden="true" className="absolute w-0.5 rounded-full" style={{ left: 15, top: 16, bottom: 16, background: C.border }} />
                <ol className="relative">
                {[
                  { t: "Diagnóstico", d: "Revisamos su archivo tal como está hoy." },
                  { t: "Hallazgos", d: "Identificamos volumen, estado, riesgos y oportunidades." },
                  { t: "Plan de acción", d: "Priorizamos qué hacer primero y con qué servicios." },
                  { t: "Propuesta", d: "Recibirá una propuesta clara, con alcance y plazos definidos." },
                ].map((st, i) => (
                  <li key={st.t} className="relative flex items-start gap-4 pb-5 last:pb-0">
                    <span className="relative flex items-center justify-center rounded-full font-bold text-xs shrink-0"
                      style={{ width: 32, height: 32, background: i === 0 ? C.indigo : "#fff", color: i === 0 ? "#fff" : C.indigo, border: "2px solid #1800AD", fontFamily: "Poppins, sans-serif" }}>
                      {i + 1}
                    </span>
                    <div className="pt-1">
                      <p className="text-sm font-bold" style={{ color: C.indigo, fontFamily: "Poppins, sans-serif" }}>{st.t}</p>
                      <p className="text-xs mt-0.5" style={{ color: "#8A8A8A" }}>{st.d}</p>
                    </div>
                  </li>
                ))}
              </ol>
              </div>

              <a href="#cotizador" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95"
                style={{ background: C.yellow, color: C.indigo, fontFamily: "Montserrat, sans-serif", textDecoration: "none", boxShadow: "0 14px 28px -12px rgba(255,222,89,0.55)" }}>
                Solicitar diagnóstico <Bi n="arrow-right" size={15} color={C.indigo} />
              </a>
            </div>

            {/* Derecha: "informe" con lo que identifica */}
            <div className="relative p-6 md:p-10 flex items-center" style={{ background: "#F7F8FF" }}>
              <Bi n="search" size={260} color={C.indigo}
                className="hidden md:block absolute pointer-events-none select-none"
                style={{ top: -40, right: -40, opacity: 0.04, transform: "rotate(12deg)" }} />
              <div className="relative w-full rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1px solid #E4E6F7", boxShadow: "0 24px 48px -28px rgba(24,0,173,0.35)" }}>
                <div className="flex items-center justify-between gap-3 px-5 py-4" style={{ borderBottom: "1px solid #ECEEF6" }}>
                  <span className="flex items-center gap-3">
                    <BiTile n="file-earmark-text" size={36} accent={C.indigo} />
                    <span>
                      <span className="block text-sm font-bold" style={{ color: C.indigo, fontFamily: "Poppins, sans-serif" }}>Informe de diagnóstico</span>
                      <span className="block text-[11px]" style={{ color: C.faint }}>Lo que identificamos en su archivo</span>
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
                      <BiTile n={f.i} size={32} accent={C.indigo} />
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-semibold leading-snug" style={{ color: C.indigo, fontFamily: "Montserrat, sans-serif" }}>{f.t}</p>
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

      <FolderDivider color={C.indigo} />

      {/* ── SERVICES ────────────────────────────────────────────────────── */}
      <section id="servicios" className="relative isolate overflow-hidden py-20" style={{ scrollMarginTop: 64 }}>
        <SectionDecor variant="dark" flip />
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-bold uppercase tracking-widest text-center mb-3" style={{ color: C.yellow, fontFamily: "Montserrat, sans-serif" }}>
            Lo que hacemos
          </p>
          <h2 className="text-3xl font-bold text-center mb-14" style={{ fontFamily: "Poppins, sans-serif", color: "#fff" }}>
            Soluciones documentales a la medida
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" style={{ marginTop: 40 }}>
            {services.map(s => <ServiceCard key={s.title} service={s} />)}
          </div>

          {/* CTA */}
          <div className="mt-12 flex justify-center">
            <a href="#faq" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all hover:scale-105"
              style={{ background: C.yellow, color: C.indigo, fontFamily: "Montserrat, sans-serif", textDecoration: "none", boxShadow: "0 14px 28px -12px rgba(255,222,89,0.55)" }}>
              Agendar diagnóstico →
            </a>
          </div>
        </div>
      </section>

      <JoelBridge src={JOEL.cajas} side="right" height={220} sink={30} offset={8} />
      <FolderDivider color={C.cream} />

      <SolucionesSection />

      <FolderDivider color={C.indigo} />

      {/* ── MODELO: DIAGNÓSTICO → SOLUCIÓN → PROTECCIÓN → EXPANSIÓN ──────────
          Contenido del documento "Modelo de Negocio - Transarchivos". */}
      <section id="modelo" className="relative isolate overflow-hidden py-20" style={{ scrollMarginTop: 64 }}>
        <SectionDecor variant="dark" folder={false} />
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true" style={{ zIndex: 0 }}>
          {/* Un resplandor navy sutil (se quitó el dorado — se veía como una
              mancha amarilla pegada a la esquina). */}

        </div>

        <div className="relative max-w-6xl mx-auto px-6" style={{ zIndex: 1 }}>
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: C.yellow, fontFamily: "Montserrat, sans-serif" }}>Cómo trabajamos</p>
            <h2 className="text-3xl md:text-4xl font-bold max-w-3xl mx-auto" style={{ fontFamily: "Poppins, sans-serif", color: "#fff", lineHeight: 1.2 }}>
              Su socio integral para <span style={{ color: C.yellow }}>todo el ciclo de vida documental</span>
            </h2>
            <p className="text-sm mt-4 max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.78)" }}>
              Le ayudamos a diagnosticar, organizar, transformar, proteger y disponer correctamente de su información documental. Cada servicio cumple una función dentro de un mismo recorrido.
            </p>
          </div>

          <div className="relative grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {([
              { n: 1, t: "Diagnóstico", k: "Entrada", ic: "clipboard2-pulse-fill", c: C.gold, d: "Detectamos su necesidad y abrimos la relación entendiendo qué pasa hoy con su archivo.", g: C.gold,
                items: [{ i: "search", l: "Diagnóstico documental", href: "#cotizador" }, { i: "list-columns-reverse", l: "Levantamiento de inventario", to: "/servicios/levantamiento-de-inventario" }] },
              { n: 2, t: "Solución", k: "Transformación", ic: "gear-wide-connected", c: C.indigo, d: "Resolvemos el problema documental con un proyecto a la medida.", g: C.indigo,
                items: [{ i: "upc-scan", l: "Digitalización", to: "/servicios/digitalizacion-de-documentos" }, { i: "folder2-open", l: "Programa de gestión documental", to: "/servicios/programa-de-gestion-documental" }] },
              { n: 3, t: "Protección", k: "Recurrencia", ic: "shield-fill-check", c: C.indigo, d: "Protegemos su información y la mantenemos disponible cuando la necesite.", g: C.indigo,
                items: [{ i: "archive", l: "Custodia de archivos", to: "/servicios/custodia-de-archivos" }, { i: "hdd-stack", l: "Custodia de medios magnéticos", to: "/servicios/custodia-de-medios-magneticos" }] },
              { n: 4, t: "Expansión", k: "Nuevos proyectos", ic: "rocket-takeoff-fill", c: C.indigo, d: "Cerramos el ciclo de vida documental y ampliamos el valor de la relación.", g: C.indigo,
                items: [{ i: "file-earmark-x", l: "Destrucción legal", to: "/servicios/destruccion-de-documentos" }, { i: "lightning-charge", l: "Servicio inmediato", to: "/servicios/servicio-inmediato" }, { i: "person-badge", l: "Servicio in house", to: "/servicios/servicio-inhouse" }] },
            ] as { n: number; t: string; k: string; ic: string; c: string; d: string; g: string; items: { i: string; l: string; to?: string; href?: string }[] }[]).map((st, idx, arr) => (
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
                  <span aria-hidden="true" className="absolute select-none pointer-events-none font-bold" style={{ right: -6, top: -22, fontSize: 130, lineHeight: 1, color: "rgba(255,255,255,0.14)", fontFamily: "Poppins, sans-serif" }}>{st.n}</span>
                  <div className="relative">
                    <span className="inline-flex items-center justify-center mb-3" style={{ width: 46, height: 46, borderRadius: 14, background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.35)", backdropFilter: "blur(4px)" }}>
                      <Bi n={st.ic} size={23} color="#fff" />
                    </span>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: "rgba(255,255,255,0.8)", fontFamily: "Montserrat, sans-serif" }}>Paso {st.n} · {st.k}</p>
                    <p className="text-2xl font-bold" style={{ color: "#fff", fontFamily: "Poppins, sans-serif" }}>{st.t}</p>
                  </div>
                </div>
                <div className="flex flex-col flex-1 p-6">
                  <p className="text-sm mb-5" style={{ color: C.muted, lineHeight: 1.6 }}>{st.d}</p>
                  <ul className="space-y-2 mt-auto">
                    {st.items.map(it => {
                      const inner = (
                        <>
                          <span className="flex items-center justify-center rounded-xl shrink-0" style={{ width: 38, height: 38, background: "#F7F8FF", border: "1px solid #E4E6F7" }}>
                            <Bi n={it.i} size={17} color={C.indigo} />
                          </span>
                          <span className="flex-1">{it.l}</span>
                          <Bi n="arrow-right" size={14} color={C.indigo} className="transition-transform group-hover/item:translate-x-1" />
                        </>
                      );
                      const cls = "group/item flex items-center gap-3 text-xs font-semibold rounded-2xl px-2.5 py-2 transition-colors hover:bg-hielo";
                      const sty = { color: C.indigo, fontFamily: "Montserrat, sans-serif", textDecoration: "none" } as const;
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
                    style={{ width: 34, height: 34, top: 36, right: -29, background: C.yellow, color: C.indigo, boxShadow: "0 8px 18px -6px rgba(200,150,10,0.6)", fontSize: 16 }}><Bi n="arrow-right" size={17} color={C.indigo} style={{ WebkitTextStroke: "0.5px #1800AD" }} /></span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <JoelBridge src={JOEL.telefono} side="right" height={220} sink={175} offset={30} />
      <FolderDivider color={C.cream} />

      <div className="relative isolate overflow-hidden">
        <SectionDecor variant="light" />
        <QuoteSimulator />
      </div>

      <FolderDivider color={C.indigo} />

      <BlogSection />

      <FolderDivider color={C.cream} />

      {/* ── VIDEOS + REDES SOCIALES ───────────────────────────────────────────
          3 videos reales del canal de YouTube de Transarchivos
          (youtube.com/@Transarchivosltda), elegidos por el cliente —
          embebidos vía youtube-nocookie.com (modo de privacidad ampliada).
          Las redes sociales, que antes vivían en la sección de Contacto
          (eliminada), se muestran acá debajo del canal de YouTube. */}
      <section className="relative isolate overflow-hidden">
      <SectionDecor variant="light" />
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-8">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: C.gold, fontFamily: "Montserrat, sans-serif" }}>Conéctese con nosotros</p>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "Poppins, sans-serif", color: C.indigo }}>
            Contenido y redes sociales de Transarchivos
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            { id: "a_t-MWf08k8", title: "¡Evite sanciones en auditorías 2026! Cómo preparar su archivo empresarial HOY · #JoelTeLoCuenta" },
            { id: "V39D_X_ip34", title: "Ley 594 de 2000 en Colombia: qué es, cómo se aplica y por qué cumplirla · #JoelTeLoCuenta" },
            { id: "7eK4K0Smbt0", title: "¿Qué es un diagnóstico documental y para qué sirve? · Servicio Transarchivos" },
          ].map(v => (
            <div key={v.id} className="rounded-2xl overflow-hidden bg-white" style={{ border: "1px solid #E9E9E7", boxShadow: "0 20px 40px -24px rgba(24,0,173,0.25)" }}>
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
              <p className="p-4 text-sm font-semibold leading-snug" style={{ color: C.indigo, fontFamily: "Montserrat, sans-serif" }}>{v.title}</p>
            </div>
          ))}
        </div>

        <div className="text-center mb-10">
          <a href="https://www.youtube.com/@Transarchivosltda" target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all hover:scale-105"
            style={{ background: C.indigo, color: "#fff", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
            <Bi n="youtube" size={16} color={C.yellow} />
            Ver más en nuestro canal
          </a>
        </div>

        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: C.faint, fontFamily: "Montserrat, sans-serif" }}>Síganos en nuestras redes</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { n: "LinkedIn", ic: "linkedin", u: "https://linkedin.com/company/transarchivos-ltda01" },
              { n: "Facebook", ic: "facebook", u: "https://facebook.com/profile.php?id=61569443213087" },
              { n: "Instagram", ic: "instagram", u: "https://instagram.com/transarchivos" },
              { n: "TikTok", ic: "tiktok", u: "https://tiktok.com/@transarchivos" },
              { n: "YouTube", ic: "youtube", u: "https://youtube.com/@Transarchivosltda" },
            ].map(({ n: r, ic, u }) => (
              <a key={r} href={u} target="_blank" rel="noreferrer" aria-label={r} title={r} className="flex items-center justify-center transition-all hover:-translate-y-0.5"
                style={{ width: 40, height: 40, borderRadius: 12, background: "#1800AD14", textDecoration: "none" }}>
                <Bi n={ic} size={19} color={C.indigo} />
              </a>
            ))}
          </div>
        </div>
      </div>
      </section>

      <FolderDivider color={C.indigo} />

      <FaqSection onChat={() => setChatOpen(true)} />

      <FolderDivider color="#F7F8FF" />

      {/* ── POR QUÉ TRANSARCHIVOS ────────────────────────────────────────────
          Franja de confianza (5 diferenciales), a los colores de marca y con
          contenido real del modelo de negocio / documento maestro: cumplimiento
          normativo, custodia con vigilancia 24 h, costo variable y escalable,
          servicios ágiles/in-house/inmediatos, y trayectoria desde 1983.
          Después de Contacto; fondo claro y sobrio — sigue usando navy/dorado
          de marca, pero sin el degradado fuerte. */}
      <section className="relative overflow-hidden" style={{ background: "#F7F8FF" }}>
        <div className="relative max-w-6xl mx-auto px-6 py-5">
          <div className="grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-borde">
            {[
              { ic: "shield-check", t: "Cumplimiento normativo", d: "Operamos bajo la Ley 594 de 2000 y la normativa del AGN." },
              { ic: "camera-video-fill", t: "Custodia con vigilancia 24/7", d: "Centro documental con CCTV, control de acceso y monitoreo ambiental permanente." },
              { ic: "graph-up-arrow", t: "Costo variable y escalable", d: "Pague solo por el volumen exacto que custodia, sin costos fijos de espacio o personal." },
              { ic: "lightning-charge-fill", t: "Ágil, en su sede e inmediato", d: "Del diagnóstico al despacho exprés, adaptados al ritmo de su operación." },
              { ic: "award-fill", t: "Trayectoria desde 1983", d: "Pioneros de la gestión documental en Colombia, con más de 40 años de experiencia." },
            ].map(f => (
              <div key={f.t} className="flex flex-col items-center text-center gap-1.5 px-4 py-2.5 md:py-0">
                <span className="flex items-center justify-center rounded-full shrink-0" style={{ width: 34, height: 34, border: "1.5px solid #C8960A" }}>
                  <Bi n={f.ic} size={14} color={C.gold} />
                </span>
                <div>
                  <p className="text-xs font-bold mb-0.5" style={{ color: C.indigo, fontFamily: "Poppins, sans-serif" }}>{f.t}</p>
                  <p className="text-[11px] leading-snug" style={{ color: C.muted }}>{f.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-b" style={{ borderColor: C.border }} />

      {/* ── FOOTER ───────────────────────────────────────────────────────────
          Rediseñado: fondo propio (antes se fundía con el blanco de la
          sección de arriba), enlaces reales en vez de "#" muertos (cada
          servicio a su propia página, "Empresa" a los anclajes reales de
          /nosotros), columna de contacto (con los datos reales que antes
          vivían en la sección de Contacto, eliminada), e íconos de redes
          en vez de texto plano en la barra inferior. */}
      <footer style={{ background: C.indigo }}>
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div>
              <Logo size="sm" light />
              <p className="mt-4 text-sm leading-relaxed max-w-xs" style={{ color: "rgba(255,255,255,0.72)" }}>
                Empresa colombiana de gestión documental. Clasificación, digitalización, custodia, conservación y destrucción legal de archivos bajo normativa AGN.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: C.yellow, fontFamily: "Montserrat, sans-serif" }}>Servicios</p>
              <ul className="space-y-2.5">
                {services.map(s => (
                  <li key={s.title}>
                    <Link to={`/servicios/${s.slug}`} className="text-sm transition-colors" style={{ color: "rgba(255,255,255,0.72)" }}
                      onMouseEnter={e => e.currentTarget.style.color = C.yellow} onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.72)"}>
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: C.yellow, fontFamily: "Montserrat, sans-serif" }}>Empresa</p>
              <ul className="space-y-2.5">
                {[
                  { label: "Quiénes somos", to: "/nosotros#quienes-somos" },
                  { label: "Nuestra historia", to: "/nosotros#historia" },
                  { label: "Normativa y certificados", to: "/nosotros#certificados" },
                  { label: "Nuestros clientes", to: "/nosotros#clientes" },
                  { label: "Preguntas frecuentes", to: "/#faq" },
                ].map(item => (
                  <li key={item.label}>
                    <Link to={item.to} className="text-sm transition-colors" style={{ color: "rgba(255,255,255,0.72)" }}
                      onMouseEnter={e => e.currentTarget.style.color = C.yellow} onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.72)"}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: C.yellow, fontFamily: "Montserrat, sans-serif" }}>Contacto</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5 text-sm" style={{ color: "rgba(255,255,255,0.72)" }}>
                  <Bi n="geo-alt-fill" size={14} color={C.yellow} style={{ marginTop: 3, flexShrink: 0 }} />
                  Cl. 21 # 39A-40, Bogotá, Colombia
                </li>
                <li>
                  <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2.5 text-sm transition-colors" style={{ color: "rgba(255,255,255,0.72)" }}
                    onMouseEnter={e => e.currentTarget.style.color = C.yellow} onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.72)"}>
                    <Bi n="whatsapp" size={14} color={C.yellow} style={{ marginTop: 3, flexShrink: 0 }} />
                    WhatsApp {WHATSAPP_LABEL}
                  </a>
                </li>
                <li>
                  <a href="#contacto" className="flex items-start gap-2.5 text-sm transition-colors break-all" style={{ color: "rgba(255,255,255,0.72)" }}
                    onMouseEnter={e => e.currentTarget.style.color = C.yellow} onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.72)"}>
                    <Bi n="envelope-fill" size={14} color={C.yellow} style={{ marginTop: 3, flexShrink: 0 }} />
                    info@transarchivos.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="h-px" style={{ background: "rgba(255,255,255,0.12)" }} />

          <div className="pt-6 flex flex-wrap justify-between items-center gap-4">
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.72)" }}>© {new Date().getFullYear()} Transarchivos Ltda. · Bogotá, Colombia · <Link to="/politicas" style={{ color: "#fff", fontWeight: 600 }}>Políticas</Link> · <Link to="/privacidad" style={{ color: "#fff", fontWeight: 600 }}>Privacidad y cookies</Link></p>
            <div className="flex gap-2">
              {[
                { n: "LinkedIn", ic: "linkedin", u: "https://linkedin.com/company/transarchivos-ltda01" },
                { n: "Facebook", ic: "facebook", u: "https://facebook.com/profile.php?id=61569443213087" },
                { n: "Instagram", ic: "instagram", u: "https://instagram.com/transarchivos" },
                { n: "TikTok", ic: "tiktok", u: "https://tiktok.com/@transarchivos" },
                { n: "YouTube", ic: "youtube", u: "https://youtube.com/@Transarchivosltda" },
              ].map(({ n: r, ic, u }) => (
                <a key={r} href={u} target="_blank" rel="noreferrer" aria-label={r} title={r} className="flex items-center justify-center transition-all hover:-translate-y-0.5"
                  style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(255,255,255,0.1)", textDecoration: "none" }}>
                  <Bi n={ic} size={15} color="#fff" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <ChatBot open={chatOpen} setOpen={setChatOpen} heroJoel />
    </div>
  );
}
