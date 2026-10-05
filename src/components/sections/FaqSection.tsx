import { useState } from "react";
import avatarImg from "@/assets/images/joel.png";
import { ChatAvatarFace } from "@/components/ui/Brand";
import { Bi } from "@/components/ui/Icons";
import { SectionDecor } from "@/components/ui/SectionDecor";
import { FAQS } from "@/data/faqs";

export function FaqSection({ onChat }: { onChat: () => void }) {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="relative isolate overflow-hidden py-20" style={{ scrollMarginTop: 80 }}>
      <SectionDecor variant="lavender" />
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[340px_minmax(0,1fr)] gap-10 items-start">
        <div className="lg:sticky lg:top-28">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#C8960A", fontFamily: "Montserrat, sans-serif" }}>Preguntas frecuentes</p>
          <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: "Poppins, sans-serif", color: "#272B7C", lineHeight: 1.2 }}>Resolvemos sus dudas</h2>
          <p className="text-sm mb-7" style={{ color: "#6B6B6B", lineHeight: 1.65 }}>Lo que más nos preguntan sobre nuestros servicios. Si no encuentra su respuesta, hable con nosotros.</p>
          {/* Joel se asoma por detrás de la tarjeta de ayuda: es el momento
              en que el visitante tiene dudas, justo donde él aporta. */}
          <div className="relative mt-24">
          <img src={avatarImg} alt="" aria-hidden="true" draggable={false}
            className="absolute select-none pointer-events-none"
            style={{ height: 150, right: 18, bottom: "calc(100% - 46px)", zIndex: 0, filter: "drop-shadow(0 10px 14px rgba(29,32,80,0.18))" }} />
          <div className="relative rounded-2xl p-5" style={{ zIndex: 1, background: "#fff", border: "1px solid #E4E6F7", boxShadow: "0 20px 40px -30px rgba(39,43,124,0.35)" }}>
            <p className="text-sm font-bold mb-3" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>¿Necesita ayuda?</p>
            <button type="button" onClick={onChat} className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 mb-2 text-left transition-colors hover:opacity-90" style={{ background: "#272B7C" }}>
              <ChatAvatarFace size={30} ring="light" />
              <span className="text-sm font-bold" style={{ color: "#fff", fontFamily: "Montserrat, sans-serif" }}>Chatee con Joel</span>
            </button>
            <a href="tel:+576013164530" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-[#F7F8FF]" style={{ color: "#272B7C", textDecoration: "none" }}>
              <Bi n="telephone" size={15} color="#272B7C" /> (601) 316-4530
            </a>
            <a href="mailto:info@transarchivos.com" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-[#F7F8FF]" style={{ color: "#272B7C", textDecoration: "none" }}>
              <Bi n="envelope" size={15} color="#272B7C" /> info@transarchivos.com
            </a>
          </div>
          </div>
        </div>

        <div className="space-y-3">
          {FAQS.map((f, i) => {
            const on = open === i;
            return (
              <div key={f.q} className="rounded-2xl overflow-hidden transition-shadow" style={{ background: "#fff", border: `1px solid ${on ? "#C9CDEE" : "#E4E6F7"}`, boxShadow: on ? "0 18px 36px -28px rgba(39,43,124,0.45)" : "none" }}>
                <button type="button" onClick={() => setOpen(on ? -1 : i)} aria-expanded={on}
                  className="w-full flex items-center justify-between gap-4 px-5 md:px-6 py-4 text-left">
                  <span className="text-sm md:text-[15px] font-bold" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif" }}>{f.q}</span>
                  <span className="flex items-center justify-center rounded-full shrink-0 transition-transform" style={{ width: 28, height: 28, background: on ? "#272B7C" : "#F2F3FA", transform: on ? "rotate(45deg)" : "none" }}>
                    <Bi n="plus-lg" size={13} color={on ? "#fff" : "#272B7C"} />
                  </span>
                </button>
                <div className="grid transition-all duration-300" style={{ gridTemplateRows: on ? "1fr" : "0fr" }}>
                  <div className="overflow-hidden">
                    <p className="px-5 md:px-6 pb-5 text-sm" style={{ color: "#6B6B6B", lineHeight: 1.7 }}>{f.a}</p>
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

// ─── Aparición al hacer scroll ──────────────────────────────────────────────
// Mismo efecto que en Transpack: cada bloque entra con un fundido y un leve
// desplazamiento hacia arriba cuando aparece en pantalla al bajar. Se aplica
// solo a las secciones debajo del hero, recorriendo su contenido: entra en
// los contenedores (max-w / mx-auto) y, si encuentra una grilla, anima cada
// tarjeta por separado y escalonada. Respeta "reducir movimiento".
