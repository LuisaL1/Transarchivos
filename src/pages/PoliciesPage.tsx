import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChatBot } from "@/components/chat/LazyChatBot";
import { HEADER_SPACE, SiteHeader } from "@/components/layout/SiteHeader";
import { Bi } from "@/components/ui/Icons";
import { SectionDecor } from "@/components/ui/SectionDecor";
import { PageHero } from "@/components/sections/PageHero";
import { POLICIES, type Policy, type PolicyBlock } from "@/data/policies";
import { useLang } from "@/i18n";
import { usePagesUi } from "@/i18n/pages";
import { C } from "@/styles/tokens";

// ─── Políticas institucionales ─────────────────────────────────────────────
// Las 7 políticas oficiales de Transarchivos (texto sin cambios, ver
// src/data/policies.ts), en tarjetas desplegables con índice lateral. El
// aviso de privacidad del sitio web (/privacidad) se enlaza aparte.
const ICONS: Record<string, string> = {
  "proteccion-de-datos": "shield-lock", "seguridad-de-la-informacion": "pc-display", "seguridad-vial": "truck",
  "responsabilidad-social": "people", "transparencia-empresarial": "patch-check", "no-alcohol-drogas-armas": "slash-circle", hseq: "clipboard2-check",
};

function Blocks({ blocks }: { blocks: PolicyBlock[] }) {
  // Agrupa los "li" consecutivos en una sola lista
  const out: React.ReactNode[] = [];
  let list: string[] = [];
  const flush = (k: number) => { if (list.length) { out.push(<ul key={`l${k}`} className="list-disc pl-5 space-y-1.5 mb-4">{list.map((t, i) => <li key={i}>{t}</li>)}</ul>); list = []; } };
  blocks.forEach((b, i) => {
    if (b.t === "ol" || b.t === "ul") {
      flush(i);
      const Tag = b.t;
      out.push(<Tag key={i} start={b.t === "ol" ? b.start : undefined} className={`${b.t === "ol" ? "list-decimal" : "list-disc"} pl-5 space-y-1.5 mb-4`}>{b.items.map((t, j) => <li key={j}>{t}</li>)}</Tag>);
      return;
    }
    if (!("text" in b)) return;
    if (b.t === "li") { list.push(b.text); return; }
    flush(i);
    if (b.t === "h") out.push(<h3 key={i} className="text-base font-bold mt-6 mb-2" style={{ color: C.indigo, fontFamily: "Poppins, sans-serif" }}>{b.text}</h3>);
    else if (b.t === "h4") out.push(<h4 key={i} className="text-sm font-bold mt-4 mb-2" style={{ color: C.indigo }}>{b.text}</h4>);
    else if (b.t === "note") out.push(<p key={i} className="mt-4 rounded-xl px-4 py-3 text-sm font-semibold" style={{ background: "#FFF6D6", color: "#8A6D00" }}>{b.text}</p>);
    else out.push(<p key={i} className="mb-3">{b.text}</p>);
  });
  flush(blocks.length);
  return <>{out}</>;
}

function PolicyCard({ p, open, onToggle, pdfLabel }: { p: Policy; open: boolean; onToggle: () => void; pdfLabel: string }) {
  return (
    <section id={p.id} lang="es" className="rounded-3xl bg-white" style={{ border: "1.5px solid #E4E6F7", boxShadow: "0 14px 30px -26px rgba(24,0,173,0.45)", scrollMarginTop: 90 }}>
      <button type="button" onClick={onToggle} aria-expanded={open} aria-controls={`${p.id}-body`} className="w-full flex items-start gap-4 p-5 md:p-6 text-left">
        <span className="grid place-items-center rounded-2xl shrink-0" style={{ width: 46, height: 46, background: C.indigo }}>
          <Bi n={ICONS[p.id] ?? "file-earmark-text"} size={20} color={C.yellow} />
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-base md:text-lg font-bold" style={{ color: C.indigo, fontFamily: "Poppins, sans-serif", lineHeight: 1.3 }}>{p.title}</span>
          <span className="block text-sm mt-1" style={{ color: C.muted, lineHeight: 1.55 }}>{p.summary}</span>
          {p.meta && <span className="block text-[11px] mt-1.5 font-semibold uppercase tracking-wider" style={{ color: C.gold, fontFamily: "Montserrat, sans-serif" }}>{p.meta}</span>}
        </span>
        <span className="grid place-items-center rounded-full shrink-0 transition-transform" style={{ width: 30, height: 30, background: open ? C.indigo : "#F2F3FA", transform: open ? "rotate(45deg)" : "none" }}>
          <Bi n="plus" size={17} color={open ? "#fff" : C.indigo} />
        </span>
      </button>
      {open && (
        <div id={`${p.id}-body`} className="px-5 md:px-6 pb-6 text-sm" style={{ color: "#4B4B4B", lineHeight: 1.7, borderTop: "1px solid #F0F1FA" }}>
          <div className="pt-5">
            {p.blocks ? <Blocks blocks={p.blocks} /> : (
              <ol className="list-decimal pl-5 space-y-2">{p.items?.map((t, i) => <li key={i}>{t}</li>)}</ol>
            )}
          </div>
          {p.pdf && (
            <a href={p.pdf} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold"
              style={{ background: C.indigo, color: "#fff", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
              <Bi n="file-earmark-pdf" size={15} color={C.yellow} /> {pdfLabel}
            </a>
          )}
        </div>
      )}
    </section>
  );
}

export function PoliciesPage() {
  const [chatOpen, setChatOpen] = useState(false);
  const u = usePagesUi();
  const { lp } = useLang();
  const { hash } = useLocation();
  const [open, setOpen] = useState<string | null>(null);
  // Llegada con ancla (#proteccion-de-datos…): abre esa política y la muestra.
  useEffect(() => {
    const id = hash.slice(1);
    if (id && POLICIES.some(p => p.id === id)) { setOpen(id); requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: "start" })); }
    else window.scrollTo(0, 0);
  }, [hash]);

  return (
    <div className="min-h-full" style={{ background: C.cream, fontFamily: "Inter, sans-serif", color: "#37352F" }}>
      <SiteHeader solid onChat={() => setChatOpen(true)} />
      <div aria-hidden="true" style={{ height: HEADER_SPACE }} />

      <PageHero>
        <div className="max-w-6xl mx-auto px-6 pt-12 pb-20">
          <p className="text-xs mb-5" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "Montserrat, sans-serif" }}>
            <Link to={lp("/")} style={{ color: "inherit", textDecoration: "none" }}>{u.common.home}</Link> / <span style={{ color: C.yellow }}>{u.common.policies}</span>
          </p>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 max-w-3xl" style={{ color: "#fff", fontFamily: "Poppins, sans-serif", lineHeight: 1.12 }}>{u.policies.title}</h1>
          <p className="text-base max-w-2xl" style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>{u.policies.text}</p>
          {u.policies.note && (
            <p className="mt-5 inline-flex items-start gap-2 rounded-xl px-4 py-3 text-sm max-w-2xl" style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,222,89,0.35)" }}>
              <Bi n="translate" size={15} color={C.yellow} className="mt-0.5 shrink-0" /> <span>{u.policies.note}</span>
            </p>
          )}
        </div>
      </PageHero>

      <section className="relative isolate overflow-hidden pb-16">
        <SectionDecor variant="light" />
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[260px_minmax(0,1fr)] gap-8 items-start">
          <nav aria-label={u.policies.indexAria} className="lg:sticky lg:top-24 rounded-3xl p-5 bg-white" style={{ border: "1px solid #E4E6F7" }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: C.gold, fontFamily: "Montserrat, sans-serif" }}>{u.policies.index}</p>
            <ol className="space-y-1">
              {POLICIES.map(p => (
                <li key={p.id}>
                  <a href={`#${p.id}`} onClick={() => setOpen(p.id)} className="block rounded-xl px-2 py-1.5 text-[13px] font-semibold leading-snug transition-colors hover:bg-niebla" style={{ color: C.indigo, textDecoration: "none" }}>
                    {p.title.replace(/^Política (de |Preventiva de )?/, "")}
                  </a>
                </li>
              ))}
            </ol>
            <div className="mt-4 pt-4" style={{ borderTop: "1px solid #F0F1FA" }}>
              <Link to={lp("/privacidad")} className="flex items-center gap-2 text-[12px] font-bold" style={{ color: C.indigo, textDecoration: "none" }}>
                <Bi n="cookie" size={13} color={C.indigo} /> {u.policies.privacy}
              </Link>
            </div>
          </nav>
          <div className="space-y-4">
            {POLICIES.map(p => <PolicyCard key={p.id} p={p} open={open === p.id} pdfLabel={u.policies.pdf} onToggle={() => setOpen(o => (o === p.id ? null : p.id))} />)}
            <div className="rounded-3xl p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ background: C.lavender }}>
              <p className="text-sm" style={{ color: "#4B4B4B" }}>{u.policies.ask}</p>
              <a href="#contacto?motivo=Datos+personales+%28Ley+1581%29" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shrink-0"
                style={{ background: C.yellow, color: C.indigo, fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
                {u.policies.write} <Bi n="arrow-right" size={13} color={C.indigo} />
              </a>
            </div>
          </div>
        </div>
      </section>
      <ChatBot open={chatOpen} setOpen={setChatOpen} />
    </div>
  );
}
