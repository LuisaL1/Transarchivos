// ─── Preguntas frecuentes ───────────────────────────────────────────────────
// Respuestas basadas en el contenido real del sitio (servicios, normativa,
// cobertura). Acordeón: una abierta a la vez.

import { useState } from "react";
import avatarImg from "@/assets/images/joel/joel-bata.webp";
import { ChatAvatarFace } from "@/components/ui/Brand";
import { Bi } from "@/components/ui/Icons";
import { SectionDecor } from "@/components/ui/SectionDecor";
import { FAQS } from "@/data/faqs";
import { WHATSAPP_LABEL, whatsappUrl } from "@/data/contact";
import { C } from "@/styles/tokens";

export function FaqSection({ onChat }: { onChat: () => void }) {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="relative isolate overflow-hidden py-20" style={{ scrollMarginTop: 80 }}>
      <SectionDecor variant="dark" />
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[340px_minmax(0,1fr)] gap-10 items-start">
        <div className="lg:sticky lg:top-28">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: C.yellow, fontFamily: "Montserrat, sans-serif" }}>Preguntas frecuentes</p>
          <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: "Poppins, sans-serif", color: "#fff", lineHeight: 1.2 }}>Resolvemos sus dudas</h2>
          <p className="text-sm mb-7" style={{ color: "rgba(255,255,255,0.78)", lineHeight: 1.65 }}>Lo que más nos preguntan sobre nuestros servicios. Si no encuentra su respuesta, hable con nosotros.</p>
          {/* Joel se asoma por detrás de la tarjeta de ayuda: es el momento
              en que el visitante tiene dudas, justo donde él aporta. */}
          <div className="relative mt-24">
          <img loading="lazy" decoding="async" src={avatarImg} alt="" aria-hidden="true" draggable={false}
            className="absolute select-none pointer-events-none"
            style={{ height: 150, right: 18, bottom: "calc(100% - 46px)", zIndex: 0, filter: "drop-shadow(0 10px 14px rgba(29,32,80,0.18))" }} />
          <div className="relative rounded-2xl p-5" style={{ zIndex: 1, background: "#fff", border: "1px solid #E4E6F7", boxShadow: "0 20px 40px -30px rgba(24,0,173,0.35)" }}>
            <p className="text-sm font-bold mb-3" style={{ color: C.indigo, fontFamily: "Poppins, sans-serif" }}>¿Necesita ayuda?</p>
            <button type="button" onClick={onChat} className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 mb-2 text-left transition-colors hover:opacity-90" style={{ background: C.yellow }}>
              <ChatAvatarFace size={30} ring="light" />
              <span className="text-sm font-bold" style={{ color: C.indigo, fontFamily: "Montserrat, sans-serif" }}>Chatee con Joel</span>
            </button>
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-hielo" style={{ color: C.indigo, textDecoration: "none" }}>
              <Bi n="whatsapp" size={15} color={C.indigo} /> WhatsApp {WHATSAPP_LABEL}
            </a>
            <a href="#contacto" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-hielo" style={{ color: C.indigo, textDecoration: "none" }}>
              <Bi n="envelope" size={15} color={C.indigo} /> info@transarchivos.com
            </a>
          </div>
          </div>
        </div>

        <div className="space-y-3">
          {FAQS.map((f, i) => {
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
                    <p className="px-5 md:px-6 pb-5 text-sm" style={{ color: C.muted, lineHeight: 1.7 }}>{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
