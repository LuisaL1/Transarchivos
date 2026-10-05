import { useState, useEffect, useRef } from "react";
import { Bi } from "@/components/ui/Icons";

export const HERO_VIDEOS = ["/videos/archivosvi2.mp4", "/videos/archivosvi4.mp4"];

export function HeroVideoBackground() {
  const [idx, setIdx] = useState(0);
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  const [reduced] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    const v = refs.current[idx];
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => {});
  }, [idx]);

  const next = (idx + 1) % HERO_VIDEOS.length;

  return (
    // Fondo inmediato: el primer cuadro del primer video (hero-poster.jpg,
    // precargado en index.html), para que al recargar no se vea el azul
    // de base mientras el video carga (en celular y computador).
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true"
      style={{ backgroundColor: "#3a3c56", backgroundImage: "url(/videos/hero-poster.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}>
      {!reduced && (
        <div className="absolute inset-0">
          {HERO_VIDEOS.map((src, i) => (
            <video key={src} src={src}
              // React no escribe "muted" como atributo HTML: sin esto iPhone y
              // Android bloquean la reproducción automática.
              ref={el => { refs.current[i] = el; if (el) { el.muted = true; el.defaultMuted = true; el.setAttribute("muted", ""); } }}
              muted playsInline autoPlay={i === 0} preload={i === idx || i === next ? "auto" : "none"}
              poster={i === 0 ? "/videos/hero-poster.jpg" : undefined}
              onEnded={() => { if (i === idx) setIdx(next); }}
              onError={() => { if (i === idx) setIdx(next); }}
              className="absolute inset-0 w-full h-full"
              style={{ objectFit: "cover", opacity: i === idx ? 1 : 0, transition: "opacity 1.2s ease" }} />
          ))}
        </div>
      )}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,13,61,0.55) 0%, rgba(10,13,61,0.35) 45%, rgba(10,13,61,0.6) 100%)" }} />
    </div>
  );
}

// ─── Caja del hero para escribirle a Joel ────────────────────────────────────
// Al enviar (o al elegir una sugerencia) abre el chat con la pregunta ya escrita.

export const HERO_SUGGESTIONS = ["Digitalizar mi archivo", "Custodia de documentos", "Destrucción certificada"];

export function HeroAskJoel({ onAsk }: { onAsk: (text: string) => void }) {
  const [text, setText] = useState("");
  const send = (t: string) => { const v = t.trim(); if (!v) return; onAsk(v); setText(""); };

  return (
    <div className="text-left">
      <form onSubmit={e => { e.preventDefault(); send(text); }}
        className="flex items-center gap-3 rounded-2xl py-2 pl-5 pr-2"
        style={{ background: "#fff", border: "1px solid #E4E6F7", boxShadow: "0 24px 50px -30px rgba(39,43,124,0.35)" }}>
        <input type="text" value={text} onChange={e => setText(e.target.value)}
          placeholder={typeof window !== "undefined" && window.innerWidth < 640 ? "¿Qué necesita su empresa?" : "¿Qué necesita su empresa? Organizar, digitalizar, custodiar o destruir documentos…"}
          aria-label="Escríbale a Joel"
          className="flex-1 min-w-0 bg-transparent outline-none text-sm"
          style={{ color: "#272B7C" }} />
        <button type="submit" aria-label="Enviar a Joel"
          className="flex items-center justify-center rounded-full shrink-0 transition-all hover:scale-105 active:scale-95"
          style={{ width: 38, height: 38, background: text.trim() ? "#272B7C" : "#EEF0FB" }}>
          <Bi n="send" size={14} color={text.trim() ? "#fff" : "#272B7C"} />
        </button>
      </form>
      <div className="flex flex-wrap justify-center gap-2 mt-3">
        {HERO_SUGGESTIONS.map(t => (
          <button key={t} type="button" onClick={() => send(t)}
            className="text-xs px-3 py-1.5 rounded-full transition-colors hover:bg-white/25"
            style={{ background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", backdropFilter: "blur(6px)" }}>
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Bootstrap Icons ────────────────────────────────────────────────────────
// Se usa solo la fuente de íconos (bootstrap-icons). Van dentro de "fichas"
// con el mismo lenguaje visual que los íconos de servicios: cuadrado
// redondeado, fondo tenue del color de acento y trazo grueso (variantes -fill).
