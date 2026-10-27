// ─── Página principal ─────────────────────────────────────────────────────────
// Vive en "/" (y en "/en"); cada card de servicio enlaza a su propia página en
// /servicios/:slug (ver ServiceDetailPage). Textos en src/i18n/home.ts.

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { JoelBridge } from "@/components/ui/JoelBridge";
import { JOEL } from "@/data/joelPoses";
import heroJoelImg from "@/assets/images/joel-flujo.webp";
import { Link, useLocation, useNavigate, useNavigationType } from "react-router-dom";
import { track } from "@/lib/visitor";
import { ChatBot } from "@/components/chat/LazyChatBot";
import { HeroQuickStart, HeroRotatingTitle, HeroPhotos } from "@/components/home/Hero";
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
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { WHATSAPP_LABEL, whatsappUrl } from "@/data/contact";
import { useLang } from "@/i18n";
import { useContent } from "@/i18n/content";
import { useHomeUi } from "@/i18n/home";
import { C } from "@/styles/tokens";

const SOCIAL = [
  { n: "LinkedIn", ic: "linkedin", u: "https://linkedin.com/company/transarchivos-ltda01" },
  { n: "Facebook", ic: "facebook", u: "https://facebook.com/profile.php?id=61569443213087" },
  { n: "Instagram", ic: "instagram", u: "https://instagram.com/transarchivos" },
  { n: "TikTok", ic: "tiktok", u: "https://tiktok.com/@transarchivos" },
  { n: "YouTube", ic: "youtube", u: "https://youtube.com/@Transarchivosltda" },
];
// 3 videos reales del canal elegidos por el cliente (en español).
const FEATURED_VIDEOS = [
  { id: "a_t-MWf08k8", title: "¡Evite sanciones en auditorías 2026! Cómo preparar su archivo empresarial HOY · #JoelTeLoCuenta" },
  { id: "V39D_X_ip34", title: "Ley 594 de 2000 en Colombia: qué es, cómo se aplica y por qué cumplirla · #JoelTeLoCuenta" },
  { id: "7eK4K0Smbt0", title: "¿Qué es un diagnóstico documental y para qué sirve? · Servicio Transarchivos" },
];
// Colores de las 4 tarjetas del modelo (dorado, marino, índigo y marino
// oscuro; pedido del cliente, oct. 2026).
const MODEL_COLORS = [C.gold, C.navy, C.indigo, C.navyDark];
const MODEL_ICONS = ["clipboard2-pulse-fill", "gear-wide-connected", "shield-fill-check", "rocket-takeoff-fill"];

export function HomePage() {
  const { lp } = useLang();
  const h = useHomeUi();
  const { services } = useContent();
  // Estado del chat en la página (no dentro de ChatBot): así el avatar del
  // hero también puede abrirlo con un clic, no solo el botón flotante.
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
  // sección y se vuelve a ajustar mientras la página termina de acomodarse.
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
  // posición; si se vuelve con atrás (POP), se restaura donde estaba.
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

  const linkHover = {
    onMouseEnter: (e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.color = C.yellow; },
    onMouseLeave: (e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.color = "rgba(255,255,255,0.72)"; },
  };

  return (
    <div ref={pageRef} className="min-h-full" style={{ background: "#ffffff", fontFamily: "Inter, sans-serif", color: "#37352F" }}>

      <SiteHeader onChat={() => setChatOpen(true)} />

      {/* ── HERO ────────────────────────────────────────────────────────────
          Secuencia de fotos de la operación de fondo (con velo índigo). En
          computador, dos columnas: a la izquierda el título animado, la frase
          fija y el selector "¿Qué necesita hoy?"; a la derecha, Joel en grande
          (pedido del cliente, oct. 2026). En celular todo centrado y sin Joel. */}
      <section className="relative overflow-hidden" style={{ background: C.indigo }}>
        <HeroPhotos />
        {/* Sombra negra arriba: da contraste al navbar sobre las fotos. */}
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-36 pointer-events-none" style={{ zIndex: 2, background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 45%, transparent 100%)" }} />

        <div className="relative min-h-[70svh] md:min-h-[88vh] flex items-center" style={{ zIndex: 3 }}>
          <div className="w-full max-w-6xl mx-auto px-6 md:px-8 pt-32 pb-14 md:pt-36 md:pb-24 grid lg:grid-cols-[minmax(0,640px)_minmax(0,1fr)] gap-6 xl:gap-10 items-center">
            <div className="text-center lg:text-left relative z-10 lg:-ml-3 xl:-ml-14">
            <h1 className="text-[32px] md:text-[42px] xl:text-[48px] font-bold tracking-tight mb-5" style={{ fontFamily: "Poppins, sans-serif", color: "#fff", lineHeight: 1.18, textShadow: "0 2px 22px rgba(0,0,0,0.35)" }}>
              <HeroRotatingTitle />
            </h1>
            <p className="text-base lg:text-lg max-w-xl mx-auto lg:mx-0" style={{ color: "rgba(255,255,255,0.9)", lineHeight: 1.6, textShadow: "0 1px 12px rgba(0,0,0,0.35)" }}>
              {h.hero.text}
            </p>
            <div className="max-w-[600px] mx-auto lg:mx-0">
              <HeroQuickStart />
            </div>
            </div>
            {/* Joel con la caja de Transarchivos y el flujo de documentos hacia
                él (imagen entregada por el cliente, oct. 2026). La imagen va
                completa y más grande que su columna; el borde izquierdo se
                desvanece para que los papeles se diluyan al acercarse al
                texto. Solo Joel y la caja reciben el clic (abre el chat). */}
            <div className="hidden lg:flex justify-end self-end relative lg:-mr-10 xl:-mr-20">
              <img src={heroJoelImg} alt="" draggable={false} className="select-none h-[520px] xl:h-[600px] max-w-none pointer-events-none"
                style={{ maskImage: "linear-gradient(90deg, transparent 4%, #000 42%)", WebkitMaskImage: "linear-gradient(90deg, transparent 4%, #000 42%)" }} />
              <button type="button" onClick={() => setChatOpen(true)} aria-label={h.hero.joel}
                className="absolute right-[3%] bottom-0 top-[14%] w-[26%] cursor-pointer rounded-3xl focus:outline-none focus-visible:ring-4 focus-visible:ring-amarillo/70" />
            </div>
          </div>
        </div>
      </section>

      <section className="relative">
        {/* Franja de normativa */}
        <div className="relative border-t py-3 md:py-4" style={{ borderColor: "#E9E9E7", background: "#fff" }}>
          <div className="max-w-6xl mx-auto px-5 md:px-8 flex flex-wrap justify-center md:justify-between items-center gap-x-4 gap-y-2 md:gap-4">
            {h.hero.trust.map(t => (
              <span key={t} className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "#6B7280", fontFamily: "Montserrat, sans-serif" }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6.5" stroke={C.indigo} strokeOpacity=".3"/><path d="M4 7l2 2 4-4" stroke={C.indigo} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <ClientsMarquee />

      <Stats />

      {/* ── DIAGNÓSTICO DOCUMENTAL (producto de entrada) ───────────────────── */}
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
                <span className="relative">{h.diagnostic.badge}</span>
              </span>
              <h3 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: C.indigo, fontFamily: "Poppins, sans-serif", lineHeight: 1.2 }}>
                {h.diagnostic.titleA}<span style={{ background: "linear-gradient(transparent 62%, #FFDE59 62%)" }}>{h.diagnostic.titleMark}</span>{h.diagnostic.titleB}
              </h3>
              <p className="text-sm mb-8" style={{ color: C.muted, lineHeight: 1.65 }}>{h.diagnostic.text}</p>

              {/* Proceso en 4 pasos (línea de tiempo vertical) */}
              <div className="relative mb-9">
                <span aria-hidden="true" className="absolute w-0.5 rounded-full" style={{ left: 15, top: 16, bottom: 16, background: C.border }} />
                <ol className="relative">
                {h.diagnostic.steps.map((st, i) => (
                  <li key={st.t} className="relative flex items-start gap-4 pb-5 last:pb-0">
                    <span className="relative flex items-center justify-center rounded-full font-bold text-xs shrink-0"
                      style={{ width: 32, height: 32, background: i === 0 ? C.indigo : "#fff", color: i === 0 ? "#fff" : C.indigo, border: "2px solid #1800AD", fontFamily: "Poppins, sans-serif" }}>
                      {String(i + 1).padStart(2, "0")}
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
                {h.diagnostic.cta} <Bi n="arrow-right" size={15} color={C.indigo} />
              </a>
            </div>

            {/* Derecha: "informe" con lo que identifica, sobre fondo índigo con lupas */}
            <div className="relative overflow-hidden p-6 md:p-10 flex items-center" style={{ background: C.indigo }}>
              <Bi n="search" size={260} color={C.lavender}
                className="hidden md:block absolute pointer-events-none select-none"
                style={{ top: -40, right: -40, opacity: 0.16, transform: "rotate(12deg)" }} />
              <Bi n="search" size={170} color={C.lavender}
                className="hidden md:block absolute pointer-events-none select-none"
                style={{ bottom: -36, left: -30, opacity: 0.12, transform: "rotate(-14deg)" }} />
              <div className="relative w-full rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1px solid #E4E6F7", boxShadow: "0 24px 48px -24px rgba(0,0,0,0.45)" }}>
                <div className="flex items-center justify-between gap-3 px-5 py-4" style={{ borderBottom: "1px solid #ECEEF6" }}>
                  <span className="flex items-center gap-3">
                    <BiTile n="file-earmark-text" size={36} accent={C.indigo} />
                    <span>
                      <span className="block text-sm font-bold" style={{ color: C.indigo, fontFamily: "Poppins, sans-serif" }}>{h.diagnostic.reportTitle}</span>
                      <span className="block text-[11px]" style={{ color: C.faint }}>{h.diagnostic.reportSub}</span>
                    </span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0" style={{ background: "#FFF6D6", color: "#8a6d00", fontFamily: "Montserrat, sans-serif" }}>{h.diagnostic.points}</span>
                </div>
                <ul className="px-5 py-1.5">
                  {h.diagnostic.report.map((f, k) => (
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

      {/* ── SERVICIOS ────────────────────────────────────────────────────── */}
      <section id="servicios" className="relative isolate overflow-hidden py-20" style={{ scrollMarginTop: 64 }}>
        <SectionDecor variant="dark" flip />
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-bold uppercase tracking-widest text-center mb-3" style={{ color: C.yellow, fontFamily: "Montserrat, sans-serif" }}>{h.services.kicker}</p>
          <h2 className="text-3xl font-bold text-center mb-14" style={{ fontFamily: "Poppins, sans-serif", color: "#fff" }}>{h.services.title}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" style={{ marginTop: 40 }}>
            {services.map(s => <ServiceCard key={s.slug} service={s} />)}
          </div>

          <div className="mt-12 flex justify-center">
            <a href="#cotizador" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-center transition-all hover:scale-105"
              style={{ background: C.yellow, color: C.indigo, fontFamily: "Montserrat, sans-serif", textDecoration: "none", boxShadow: "0 14px 28px -12px rgba(255,222,89,0.55)" }}>
              {h.services.cta} <Bi n="arrow-right" size={15} color={C.indigo} />
            </a>
          </div>
        </div>
      </section>

      <JoelBridge src={JOEL.cajas} side="right" height={220} sink={30} offset={8} />
      <FolderDivider color={C.cream} />

      <SolucionesSection />

      <FolderDivider color={C.indigo} />

      {/* ── MODELO: ENTRADA → ORGANIZACIÓN → ALMACENAMIENTO → NUEVOS PROYECTOS ─
          Basado en el "Modelo de Negocio - Transarchivos"; textos del documento
          de correcciones del inicio (oct. 2026). */}
      <section id="modelo" className="relative isolate overflow-hidden py-20" style={{ scrollMarginTop: 64 }}>
        <SectionDecor variant="dark" folder={false} />

        <div className="relative max-w-6xl mx-auto px-6" style={{ zIndex: 1 }}>
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: C.yellow, fontFamily: "Montserrat, sans-serif" }}>{h.model.kicker}</p>
            <h2 className="text-3xl md:text-4xl font-bold max-w-4xl mx-auto" style={{ fontFamily: "Poppins, sans-serif", color: "#fff", lineHeight: 1.2 }}>
              {h.model.title1}<br />
              <span style={{ color: C.yellow }}>{h.model.title2}</span>
            </h2>
            <p className="text-sm mt-4 max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.78)" }}>{h.model.text}</p>
          </div>

          <div className="relative grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {h.model.steps.map((st, idx, arr) => {
              const first = lp(st.items[0].to);
              return (
              <div key={st.n} role="link" tabIndex={0}
                // Toda la tarjeta lleva a su primer servicio (los enlaces de
                // adentro conservan su propio destino).
                onClick={e => { if ((e.target as HTMLElement).closest("a")) return; navigateHome(first); }}
                onKeyDown={e => { if (e.key === "Enter") navigateHome(first); }}
                className="group relative rounded-3xl flex flex-col cursor-pointer card-lift"
                // z-index decreciente: la flecha amarilla de cada tarjeta se
                // monta sobre el borde de la siguiente y siempre se ve completa.
                style={{ background: "#fff", border: "1.5px solid #E4E6F7", zIndex: arr.length - idx }}>
                <div className="relative px-6 pt-6 pb-7 overflow-hidden" style={{ background: MODEL_COLORS[idx], borderRadius: "22px 22px 0 0", minHeight: 200 }}>
                  <span aria-hidden="true" className="absolute select-none pointer-events-none font-bold" style={{ right: -6, top: -22, fontSize: 130, lineHeight: 1, color: "rgba(255,255,255,0.14)", fontFamily: "Poppins, sans-serif" }}>{st.n}</span>
                  <div className="relative">
                    <span className="inline-flex items-center justify-center mb-3" style={{ width: 46, height: 46, borderRadius: 14, background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.35)", backdropFilter: "blur(4px)" }}>
                      <Bi n={MODEL_ICONS[idx]} size={23} color="#fff" />
                    </span>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: "rgba(255,255,255,0.8)", fontFamily: "Montserrat, sans-serif" }}>{h.model.stepLabel} {st.n} · {st.k}</p>
                    <p className="text-lg font-bold" style={{ color: "#fff", fontFamily: "Poppins, sans-serif", lineHeight: 1.25 }}>{st.t}</p>
                  </div>
                </div>
                <div className="flex flex-col flex-1 p-5 xl:p-6">
                  <p className="text-sm mb-5" style={{ color: C.muted, lineHeight: 1.6 }}>{st.d}</p>
                  <ul className="space-y-2 mt-auto">
                    {st.items.map(it => (
                      <li key={it.l}>
                        <Link to={lp(it.to)} className="flex items-start gap-2.5 text-xs font-semibold leading-snug rounded-2xl px-2 py-2 transition-colors hover:bg-hielo" style={{ color: C.indigo, fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
                          <span className="flex items-center justify-center rounded-xl shrink-0" style={{ width: 32, height: 32, background: "#F7F8FF", border: "1px solid #E4E6F7" }}>
                            <Bi n={it.i} size={15} color={C.indigo} />
                          </span>
                          <span className="flex-1 min-w-0">
                            {it.l}
                            {it.s && <span className="block text-[11px] font-medium mt-0.5" style={{ color: C.muted }}>{it.s}</span>}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                {idx < arr.length - 1 && (
                  <span className="hidden lg:flex absolute items-center justify-center rounded-full z-10 font-bold"
                    style={{ width: 34, height: 34, top: 36, right: -29, background: C.yellow, color: C.indigo, boxShadow: "0 8px 18px -6px rgba(200,150,10,0.6)", fontSize: 16 }}><Bi n="arrow-right" size={17} color={C.indigo} style={{ WebkitTextStroke: "0.5px #1800AD" }} /></span>
                )}
              </div>
            ); })}
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

      {/* Cobertura desde Bogotá + video del centro documental (entre el
          cotizador y el blog; pedido del cliente, oct. 2026). */}
      <MapReveal />

      <BlogSection />

      <FolderDivider color={C.cream} />

      {/* ── VIDEOS + REDES SOCIALES ─────────────────────────────────────────
          3 videos reales del canal de YouTube de Transarchivos, embebidos vía
          youtube-nocookie.com (modo de privacidad ampliada). */}
      <section className="relative isolate overflow-hidden">
      <SectionDecor variant="light" />
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-8">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: C.gold, fontFamily: "Montserrat, sans-serif" }}>{h.connect.kicker}</p>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "Poppins, sans-serif", color: C.indigo }}>{h.connect.title}</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {FEATURED_VIDEOS.map(v => (
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
              <p className="p-4 text-sm font-semibold leading-snug" lang="es" style={{ color: C.indigo, fontFamily: "Montserrat, sans-serif" }}>{v.title}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <Link to={lp("/videos")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all hover:scale-105"
            style={{ background: C.indigo, color: "#fff", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
            <Bi n="play-circle" size={16} color={C.yellow} />
            {h.connect.allVideos}
          </Link>
          <a href="https://www.youtube.com/@Transarchivosltda" target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all hover:scale-105"
            style={{ background: "#fff", color: C.indigo, border: "1.5px solid #E4E6F7", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
            <Bi n="youtube" size={16} color={C.indigo} />
            {h.connect.channel}
          </a>
        </div>

        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: C.faint, fontFamily: "Montserrat, sans-serif" }}>{h.connect.follow}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {SOCIAL.map(({ n: r, ic, u: url }) => (
              <a key={r} href={url} target="_blank" rel="noreferrer" aria-label={r} title={r} className="flex items-center justify-center transition-all hover:-translate-y-0.5"
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

      {/* ── POR QUÉ TRANSARCHIVOS: franja de confianza (5 diferenciales) ──── */}
      <section className="relative overflow-hidden" style={{ background: "#F7F8FF" }}>
        <div className="relative max-w-6xl mx-auto px-6 py-5">
          <div className="grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-borde">
            {h.why.map(f => (
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

      {/* ── PIE ───────────────────────────────────────────────────────────── */}
      <footer style={{ background: C.indigo }}>
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div>
              <Logo size="sm" light />
              <p className="mt-4 text-sm leading-relaxed max-w-xs" style={{ color: "rgba(255,255,255,0.72)" }}>{h.footer.text}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: C.yellow, fontFamily: "Montserrat, sans-serif" }}>{h.footer.services}</p>
              <ul className="space-y-2.5">
                {services.map(s => (
                  <li key={s.slug}>
                    <Link to={lp(`/servicios/${s.slug}`)} className="text-sm transition-colors" style={{ color: "rgba(255,255,255,0.72)" }} {...linkHover}>
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: C.yellow, fontFamily: "Montserrat, sans-serif" }}>{h.footer.company}</p>
              <ul className="space-y-2.5">
                {h.footer.links.map(item => (
                  <li key={item.label}>
                    <Link to={lp(item.to)} className="text-sm transition-colors" style={{ color: "rgba(255,255,255,0.72)" }} {...linkHover}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: C.yellow, fontFamily: "Montserrat, sans-serif" }}>{h.footer.contact}</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5 text-sm" style={{ color: "rgba(255,255,255,0.72)" }}>
                  <Bi n="geo-alt-fill" size={14} color={C.yellow} style={{ marginTop: 3, flexShrink: 0 }} />
                  {h.footer.address}
                </li>
                <li>
                  <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2.5 text-sm transition-colors" style={{ color: "rgba(255,255,255,0.72)" }} {...linkHover}>
                    <Bi n="whatsapp" size={14} color={C.yellow} style={{ marginTop: 3, flexShrink: 0 }} />
                    WhatsApp {WHATSAPP_LABEL}
                  </a>
                </li>
                <li>
                  <a href="#contacto" className="flex items-start gap-2.5 text-sm transition-colors break-all" style={{ color: "rgba(255,255,255,0.72)" }} {...linkHover}>
                    <Bi n="envelope-fill" size={14} color={C.yellow} style={{ marginTop: 3, flexShrink: 0 }} />
                    info@transarchivos.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="h-px" style={{ background: "rgba(255,255,255,0.12)" }} />

          <div className="pt-6 flex flex-wrap justify-between items-center gap-4">
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.72)" }}>© {new Date().getFullYear()} Transarchivos Ltda. · Bogotá, Colombia · <Link to={lp("/politicas")} style={{ color: "#fff", fontWeight: 600 }}>{h.footer.policies}</Link> · <Link to={lp("/privacidad")} style={{ color: "#fff", fontWeight: 600 }}>{h.footer.privacy}</Link></p>
            <div className="flex gap-2">
              {SOCIAL.map(({ n: r, ic, u: url }) => (
                <a key={r} href={url} target="_blank" rel="noreferrer" aria-label={r} title={r} className="flex items-center justify-center transition-all hover:-translate-y-0.5"
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
