import { Bi } from "@/components/ui/Icons";

export function SupportPopover({ anchor, onClose, onChat, onHoverIn, onHoverOut }: { anchor: DOMRect; onClose: () => void; onChat: () => void; onHoverIn?: () => void; onHoverOut?: () => void }) {
  const items = [
    { ic: "chat-dots", t: "Chatee con Joel", d: "Asesor con IA, responde al instante", onClick: () => { onChat(); onClose(); } },
    { ic: "telephone", t: "Llámenos", d: "(601) 316-4530", href: "tel:+576013164530" },
    { ic: "envelope", t: "Escríbanos", d: "info@transarchivos.com", href: "mailto:info@transarchivos.com" },
  ];
  return (
    <div data-support-popover onMouseEnter={onHoverIn} onMouseLeave={onHoverOut} className="fixed z-[60] w-[340px] rounded-3xl overflow-hidden"
      style={{ top: anchor.bottom + 12, left: Math.max(16, Math.min(anchor.left - 8, window.innerWidth - 340 - 16)), background: "#fff", boxShadow: "0 30px 60px -20px rgba(10,13,61,0.35), 0 4px 14px rgba(10,13,61,0.08)", animation: "fadeInUp 0.2s ease both" }}>
      <div className="relative px-6 pt-5 pb-5 overflow-hidden" style={{ background: "linear-gradient(135deg, #14163F 0%, #272B7C 100%)" }}>
        <span className="absolute pointer-events-none" style={{ top: -30, right: -30, width: 110, height: 110, background: "rgba(255,222,89,0.18)", transform: "rotate(45deg)", borderRadius: 18 }} />
        <p className="relative flex items-center gap-2 text-base font-bold" style={{ color: "#fff", fontFamily: "Poppins, sans-serif" }}>
          <Bi n="headset" size={17} color="#FFDE59" /> Soporte Transarchivos
        </p>
        <p className="relative text-sm mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>¿Necesita ayuda con su archivo o su solicitud?</p>
      </div>
      <div className="py-2">
        {items.map(it => {
          const inner = (
            <>
              <span className="flex items-center justify-center rounded-xl shrink-0" style={{ width: 40, height: 40, background: "#F2F3FA" }}>
                <Bi n={it.ic} size={17} color="#272B7C" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif" }}>{it.t}</span>
                <span className="block text-xs truncate" style={{ color: "#8A8A8A" }}>{it.d}</span>
              </span>
            </>
          );
          const cls = "w-full flex items-center gap-3.5 px-6 py-3 text-left transition-colors hover:bg-[#F7F8FF]";
          return it.href
            ? <a key={it.t} href={it.href} className={cls} style={{ textDecoration: "none" }} onClick={onClose}>{inner}</a>
            : <button key={it.t} type="button" className={cls} onClick={it.onClick}>{inner}</button>;
        })}
      </div>
      <a href="#faq" onClick={onClose} className="flex items-center justify-between px-6 py-4 text-sm font-bold transition-colors hover:bg-[#F7F8FF]"
        style={{ borderTop: "1px solid #ECEEF6", color: "#272B7C", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
        Ver preguntas frecuentes <Bi n="question-circle" size={16} color="#272B7C" />
      </a>
    </div>
  );
}

// ─── Preguntas frecuentes ───────────────────────────────────────────────────
// Respuestas basadas en el contenido real del sitio (servicios, normativa,
// cobertura). Acordeón: una abierta a la vez.
