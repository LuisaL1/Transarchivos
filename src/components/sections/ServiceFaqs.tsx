import { useState, type ReactNode } from "react";
import { Bi } from "@/components/ui/Icons";
import { kicker, h2 } from "@/components/ui/SectionHead";
import { usePagesUi } from "@/i18n/pages";
import { C } from "@/styles/tokens";
import type { ServiceFaq } from "@/data/serviceFaqs";

// Preguntas frecuentes de un servicio (src/data/serviceFaqs.ts), en acordeón,
// con el mismo aspecto que las de la portada (FaqSection). Las respuestas
// traen varios párrafos; los que empiezan con "1. ", "2. "… se agrupan en una
// lista numerada y su encabezado (hasta los dos puntos) va en negrita.

type Block = { t: "p"; s: string } | { t: "ol"; items: string[] };

function blocks(a: string[]): Block[] {
  const out: Block[] = [];
  for (const s of a) {
    const m = /^\d+\.\s+(.*)$/.exec(s);
    const last = out[out.length - 1];
    if (m && last?.t === "ol") last.items.push(m[1]);
    else if (m) out.push({ t: "ol", items: [m[1]] });
    else out.push({ t: "p", s });
  }
  return out;
}

function lead(s: string): ReactNode {
  const i = s.indexOf(":");
  if (i < 1 || i > 60) return s;
  return <><strong style={{ color: C.indigo }}>{s.slice(0, i + 1)}</strong>{s.slice(i + 1)}</>;
}

export function ServiceFaqs({ faqs, serviceTitle, dark }: { faqs: ServiceFaq[]; serviceTitle: string; dark: boolean }) {
  const [open, setOpen] = useState(0);
  const u = usePagesUi().service;
  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="max-w-2xl mb-8">
        {kicker(u.faqKicker, dark)}
        {h2(u.faqTitle(serviceTitle), dark)}
      </div>
      <div className="space-y-3">
        {faqs.map((f, i) => {
          const on = open === i;
          return (
            <div key={f.q} className="rounded-2xl overflow-hidden transition-shadow" style={{ background: "#fff", border: `1px solid ${on ? "#C9CDEE" : C.border}`, boxShadow: on ? "0 18px 36px -28px rgba(24,0,173,0.45)" : "none" }}>
              <button type="button" onClick={() => setOpen(on ? -1 : i)} aria-expanded={on}
                className="w-full flex items-center justify-between gap-4 px-5 md:px-6 py-4 text-left">
                <span className="text-sm md:text-[15px] font-bold" style={{ color: C.indigo, fontFamily: "Montserrat, sans-serif" }}>{f.q}</span>
                <span className="flex items-center justify-center rounded-full shrink-0 transition-transform" style={{ width: 28, height: 28, background: on ? C.indigo : "#F2F3FA", transform: on ? "rotate(45deg)" : "none" }}>
                  <Bi n="plus-lg" size={13} color={on ? "#fff" : C.indigo} />
                </span>
              </button>
              <div className="grid transition-all duration-300" style={{ gridTemplateRows: on ? "1fr" : "0fr" }}>
                <div className="overflow-hidden">
                  <div className="px-5 md:px-6 pb-5 text-sm space-y-3" style={{ color: C.muted, lineHeight: 1.7 }}>
                    {blocks(f.a).map((b, j) => b.t === "p"
                      ? <p key={j}>{b.s}</p>
                      : <ol key={j} className="list-decimal pl-5 space-y-1.5">{b.items.map(it => <li key={it}>{lead(it)}</li>)}</ol>)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
