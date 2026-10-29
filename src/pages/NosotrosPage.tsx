// ─── Página "Nosotros" ──────────────────────────────────────────────────────
// Contenido tomado del Documento maestro, de "Misión y visión" y de la reseña
// histórica entregada por el cliente (documento del 29 de octubre de 2026),
// con un anclaje real por cada ítem del menú desplegable "Nosotros". Textos en
// src/i18n/pages.ts. La sección "Tecnología y seguridad" se retiró a pedido
// del cliente; el marco normativo se despliega al tocar cada norma.

import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bi } from "@/components/ui/Icons";
import { ChatBot } from "@/components/chat/LazyChatBot";
import { ClientsMarquee } from "@/components/home/ClientsMarquee";
import { HEADER_SPACE, SiteHeader } from "@/components/layout/SiteHeader";
import { JoelFigure } from "@/components/ui/JoelBridge";
import { SectionDecor } from "@/components/ui/SectionDecor";
import { h2, kicker, mark } from "@/components/ui/SectionHead";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { JOEL } from "@/data/joelPoses";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLang } from "@/i18n";
import { useContent } from "@/i18n/content";
import { usePagesUi } from "@/i18n/pages";
import { C } from "@/styles/tokens";

export function NosotrosPage() {
  const { hash } = useLocation();
  const { lp } = useLang();
  const { common, about: u } = usePagesUi();
  const { norms } = useContent();
  const pageRef = useRef<HTMLDivElement>(null);
  useScrollReveal(pageRef);
  const [chatOpen, setChatOpen] = useState(false);
  // Normas desplegadas (varias a la vez)
  const [openNorms, setOpenNorms] = useState<Set<string>>(() => new Set());
  const toggleNorm = (code: string) => setOpenNorms(s => { const n = new Set(s); if (n.has(code)) n.delete(code); else n.add(code); return n; });

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth", block: "start" }));
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  const card = { background: "#fff", border: "1px solid #E4E6F7", boxShadow: "0 14px 30px -26px rgba(24,0,173,0.45)" } as const;
  const para = { color: C.muted, lineHeight: 1.75 } as const;

  return (
    <div ref={pageRef} className="min-h-full" style={{ background: C.cream, fontFamily: "Inter, sans-serif", color: "#37352F" }}>
      <SiteHeader solid onChat={() => setChatOpen(true)} />
      <div aria-hidden="true" style={{ height: HEADER_SPACE }} />

      {/* Hero: mismo formato de las páginas de servicio */}
      <PageHero id="quienes-somos" scrollMarginTop={70}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-10 items-center pt-12 pb-24">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <Link to={lp("/")} aria-label={common.back} title={common.back} className="grid place-items-center rounded-full shrink-0 transition-colors hover:bg-white/20"
                  style={{ width: 36, height: 36, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)" }}>
                  <Bi n="arrow-left" size={15} color="#fff" />
                </Link>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "Montserrat, sans-serif" }}>
                  <Link to={lp("/")} style={{ color: "inherit", textDecoration: "none" }}>{common.home}</Link> / <span style={{ color: C.yellow }}>{u.crumb}</span>
                </p>
              </div>
              <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-5" style={{ background: "rgba(255,255,255,0.1)", color: C.yellow, border: "1px solid rgba(255,222,89,0.35)", fontFamily: "Montserrat, sans-serif" }}>
                <Bi n="building" size={13} color={C.yellow} /> {u.badge}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#fff", fontFamily: "Poppins, sans-serif", lineHeight: 1.1 }}>{u.title}</h1>
              <p className="text-lg md:text-xl font-semibold mb-4" style={{ color: C.yellow, fontFamily: "Poppins, sans-serif", lineHeight: 1.35 }}>{u.tagline}</p>
              <p className="text-base max-w-xl mb-8" style={{ color: "rgba(255,255,255,0.78)", lineHeight: 1.7 }}>{u.intro}</p>
              <div className="flex flex-wrap gap-3">
                <Link to={lp("/#cotizador")} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold transition-transform hover:scale-[1.03]"
                  style={{ background: C.yellow, color: C.indigo, fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
                  {common.quote} <Bi n="arrow-right" size={14} color={C.indigo} />
                </Link>
                <Link to={lp("/#servicios")} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold"
                  style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
                  {u.services}
                </Link>
              </div>
            </div>

            <div className="rounded-3xl p-6 md:p-7" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.16)", backdropFilter: "blur(10px)" }}>
              <div className="flex items-center gap-3 mb-6">
                <span className="grid place-items-center rounded-2xl" style={{ width: 56, height: 56, background: C.yellow }}>
                  <Bi n="building" size={26} color={C.indigo} />
                </span>
                <p className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.85)", fontFamily: "Montserrat, sans-serif" }}>{u.figures}</p>
              </div>
              <div className="space-y-4">
                {u.figuresList.map(([v, l]) => (
                  <div key={v} className="flex items-baseline gap-4 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                    <span className="text-2xl md:text-3xl font-bold shrink-0" style={{ color: "#fff", fontFamily: "Poppins, sans-serif", minWidth: 120 }}>{v}</span>
                    <span className="text-sm" style={{ color: "rgba(255,255,255,0.68)" }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageHero>

      {/* Historia: reseña completa del cliente, con Joel leyendo la historia de
          Transarchivos y los logos de clientes centrados en el ancho del texto. */}
      <section id="historia" className="relative isolate overflow-hidden py-16" style={{ scrollMarginTop: 80 }}>
        <SectionDecor variant="light" />
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-10 lg:gap-14 items-start">
            <div>
              {kicker(u.historyKicker)}
              {h2(<>{u.historyA}{mark(u.historyMark)}</>)}
              <div className="mt-8 pl-4"><JoelFigure src={JOEL.historia} height={300} /></div>
            </div>
            <div className="space-y-4 text-[15px]">
              {u.history.map(p => <p key={p} style={para}>{p}</p>)}
              <h3 className="text-xl font-bold pt-4" style={{ color: C.indigo, fontFamily: "Poppins, sans-serif", lineHeight: 1.3 }}>{u.backedTitle}</h3>
              {u.backed.map(p => <p key={p} style={para}>{p}</p>)}
            </div>
          </div>

          {/* Logos de clientes, dentro del mismo ancho de la reseña */}
          <div className="mt-12 rounded-3xl py-6" style={{ background: "#fff", border: "1px solid #E4E6F7" }}>
            <p className="mb-2 text-center text-xs font-bold uppercase tracking-widest" style={{ color: C.gold, fontFamily: "Montserrat, sans-serif" }}>{u.logos}</p>
            <ClientsMarquee contained />
          </div>

          <div className="mt-12 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-6 items-stretch">
            <div className="rounded-3xl p-6 md:p-7" style={card}>
              <p className="text-[15px]" style={para}>{u.closing}</p>
              <p className="text-[15px] mt-4 font-semibold" style={{ color: C.indigo, lineHeight: 1.6 }}>{u.principles}</p>
            </div>
            <div className="relative overflow-hidden rounded-3xl p-6 md:p-7" style={{ background: C.indigo }}>
              <span aria-hidden="true" className="absolute pointer-events-none" style={{ right: -40, top: -40, width: 120, height: 120, transform: "rotate(45deg)", borderRadius: 20, background: "rgba(255,222,89,0.22)" }} />
              <p className="relative text-sm font-semibold mb-4" style={{ color: C.yellow, fontFamily: "Montserrat, sans-serif" }}>{u.commitmentsIntro}</p>
              <ul className="relative grid grid-cols-2 gap-2.5 mb-5">
                {u.commitments.map(c => (
                  <li key={c.l} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)" }}>
                    <Bi n={c.ic} size={16} color={C.yellow} />
                    <span className="text-sm font-bold" style={{ color: "#fff", fontFamily: "Poppins, sans-serif" }}>{c.l}</span>
                  </li>
                ))}
              </ul>
              <p className="relative text-sm" style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>{u.commitmentsText}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Misión y visión */}
      <section id="mision-vision" className="relative isolate overflow-hidden py-16" style={{ scrollMarginTop: 80 }}>
        <SectionDecor variant="dark" flip folder={false} />
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">{kicker(u.missionKicker, true)}{h2(u.missionTitle, true)}</div>
          <div className="grid md:grid-cols-2 gap-5">
            {u.mission.map((m, i) => (
              <div key={m.t} className="relative rounded-3xl p-7 overflow-hidden" style={{ background: i === 0 ? "rgba(255,255,255,0.08)" : "#fff", border: i === 0 ? "1.5px solid rgba(255,255,255,0.22)" : "1.5px solid #E4E6F7", boxShadow: "0 24px 50px -32px rgba(0,0,0,0.55)" }}>
                <span className="grid place-items-center rounded-2xl mb-4" style={{ width: 52, height: 52, background: i === 0 ? C.yellow : C.indigo }}>
                  <Bi n={m.ic} size={22} color={i === 0 ? C.indigo : C.yellow} />
                </span>
                <p className="text-lg font-bold mb-2" style={{ color: i === 0 ? "#fff" : C.indigo, fontFamily: "Poppins, sans-serif" }}>{m.t}</p>
                <p className="text-sm" style={{ color: i === 0 ? "rgba(255,255,255,0.78)" : C.muted, lineHeight: 1.7 }}>{m.x}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section id="equipo" className="relative isolate overflow-hidden py-16" style={{ scrollMarginTop: 80 }}>
        <SectionDecor variant="light" />
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-10 items-start">
          <div>
            {kicker(u.teamKicker)}
            {h2(<>{u.teamA}{mark(u.teamMark)}{u.teamB}</>)}
            <p className="text-sm mt-4" style={{ color: C.muted, lineHeight: 1.7 }}>{u.teamText}</p>
            <div className="mt-10 pl-6"><JoelFigure src={JOEL.notas} height={250} /></div>
          </div>
          <div className="grid gap-4">
            {u.team.map((c, i) => (
              <div key={c.t} className="group relative rounded-3xl p-6 flex items-start gap-4 overflow-hidden card-lift" style={{ background: "#fff", border: "1.5px solid #E4E6F7" }}>
                <span aria-hidden="true" className="absolute select-none font-bold" style={{ right: 16, top: 10, fontSize: 40, lineHeight: 1, color: "rgba(24,0,173,0.06)", fontFamily: "Poppins, sans-serif" }}>0{i + 1}</span>
                <span className="grid place-items-center rounded-2xl shrink-0 transition-colors bg-indigo/[0.08] group-hover:bg-indigo" style={{ width: 48, height: 48 }}>
                  <i className={`bi bi-${c.ic} text-indigo group-hover:text-amarillo transition-colors`} aria-hidden="true" style={{ fontSize: 21, lineHeight: 1 }} />
                </span>
                <div>
                  <p className="text-base font-bold mb-1" style={{ color: C.indigo, fontFamily: "Poppins, sans-serif" }}>{c.t}</p>
                  <p className="text-sm" style={{ color: C.muted, lineHeight: 1.6 }}>{c.x}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cultura */}
      <section id="cultura" className="relative isolate overflow-hidden py-16" style={{ scrollMarginTop: 80 }}>
        <SectionDecor variant="dark" flip folder={false} />
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl mb-10">
            {kicker(u.cultureKicker, true)}{h2(u.cultureTitle, true)}
            <p className="text-sm mt-4" style={{ color: "rgba(255,255,255,0.78)", lineHeight: 1.7 }}>{u.cultureText}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {u.values.map((v, i) => (
              <div key={v.t} className="group relative rounded-3xl p-6 overflow-hidden card-lift" style={{ background: "#fff", border: "1.5px solid #E4E6F7" }}>
                <span aria-hidden="true" className="absolute select-none font-bold" style={{ right: 16, top: 10, fontSize: 44, lineHeight: 1, color: "rgba(24,0,173,0.06)", fontFamily: "Poppins, sans-serif" }}>0{i + 1}</span>
                <span className="grid place-items-center rounded-2xl mb-4 transition-colors bg-indigo/[0.08] group-hover:bg-indigo" style={{ width: 48, height: 48 }}>
                  <i className={`bi bi-${v.ic} text-indigo group-hover:text-amarillo transition-colors`} aria-hidden="true" style={{ fontSize: 21, lineHeight: 1 }} />
                </span>
                <p className="text-base font-bold mb-1" style={{ color: C.indigo, fontFamily: "Poppins, sans-serif" }}>{v.t}</p>
                <p className="text-[13px] font-semibold mb-2.5 pl-3" style={{ color: C.indigo, borderLeft: "3px solid #FFDE59", lineHeight: 1.4 }}>{v.s}</p>
                <p className="text-sm" style={{ color: C.muted, lineHeight: 1.6 }}>{v.x}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clientes: sectores atendidos */}
      <section id="clientes" className="relative isolate overflow-hidden py-16" style={{ scrollMarginTop: 80 }}>
        <SectionDecor variant="light" />
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            {kicker(u.clientsKicker)}{h2(<>{u.clientsA}{mark(u.clientsMark)}</>)}
            <p className="text-sm mt-4 max-w-2xl mx-auto" style={{ color: C.muted }}>{u.clientsText}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {u.sectors.map(x => (
              <div key={x.l} className="group flex items-center gap-3 rounded-2xl p-4 card-lift" style={{ background: "#fff", border: "1.5px solid #E4E6F7" }}>
                <span className="grid place-items-center rounded-xl shrink-0 transition-colors bg-indigo/[0.08] group-hover:bg-indigo" style={{ width: 42, height: 42 }}>
                  <i className={`bi bi-${x.ic} text-indigo group-hover:text-amarillo transition-colors`} aria-hidden="true" style={{ fontSize: 18, lineHeight: 1 }} />
                </span>
                <span className="text-sm font-semibold" style={{ color: C.indigo, fontFamily: "Montserrat, sans-serif" }}>{x.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cumplimiento normativo: cada norma se despliega con una reseña breve */}
      <section id="certificados" className="relative isolate overflow-hidden py-16" style={{ scrollMarginTop: 80 }}>
        <SectionDecor variant="dark" flip folder={false} />
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between gap-6 mb-8">
            <div className="max-w-2xl">
              {kicker(u.normsKicker, true)}{h2(u.normsTitle, true)}
              <p className="text-sm mt-3" style={{ color: "rgba(255,255,255,0.7)" }}>{u.normsHint}</p>
            </div>
            <JoelFigure src={JOEL.legal} height={200} className="shrink-0 mr-6" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 items-start">
            {norms.map(n => {
              const on = openNorms.has(n.code);
              return (
                <div key={n.code} className="rounded-2xl overflow-hidden card-lift" style={{ background: "#fff", border: `1.5px solid ${on ? "#C9CDEE" : "#E4E6F7"}` }}>
                  <button type="button" onClick={() => toggleNorm(n.code)} aria-expanded={on} className="w-full flex items-start justify-between gap-3 p-4 text-left">
                    <span className="min-w-0">
                      <span className="block text-sm font-bold" style={{ color: C.indigo, fontFamily: "Poppins, sans-serif", lineHeight: 1.3 }}>{n.code}</span>
                      <span className="block text-[11px] leading-snug mt-1" style={{ color: C.muted }}>{n.name}</span>
                    </span>
                    <span className="grid place-items-center rounded-full shrink-0 transition-transform" style={{ width: 26, height: 26, background: on ? C.indigo : "#F2F3FA", transform: on ? "rotate(45deg)" : "none" }}>
                      <Bi n="plus-lg" size={12} color={on ? "#fff" : C.indigo} />
                    </span>
                  </button>
                  <div className="grid transition-all duration-300" style={{ gridTemplateRows: on ? "1fr" : "0fr" }}>
                    <div className="overflow-hidden">
                      <p className="px-4 pb-4 text-[12.5px]" style={{ color: C.muted, lineHeight: 1.6, borderTop: "1px solid #F0F1FA", paddingTop: 10 }}>{n.detail}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Llamado final (mismo de las páginas de servicio) */}
      <CtaBand title={u.cta} />

      <ChatBot open={chatOpen} setOpen={setChatOpen} />
    </div>
  );
}
