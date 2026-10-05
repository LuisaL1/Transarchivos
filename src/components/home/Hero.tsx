import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Bi } from "@/components/ui/Icons";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export const HERO_VIDEOS = ["/videos/archivosvi2.mp4", "/videos/archivosvi4.mp4"];

export function HeroVideoBackground() {
  const [idx, setIdx] = useState(0);
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  const reduced = useReducedMotion();

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
    <div className="absolute inset-0 md:left-1/2 overflow-hidden pointer-events-none" aria-hidden="true"
      style={{ backgroundColor: "#272B7C", backgroundImage: "url(/videos/hero-poster.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}>
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
      {/* Velo: en celular el texto va encima del video (más oscuro); en la
          pantalla dividida el video está solo a la derecha (velo suave). */}
      <div className="absolute inset-0 md:hidden" style={{ background: "rgba(39,43,124,0.6)" }} />
      <div className="absolute inset-0 hidden md:block" style={{ background: "rgba(10,13,61,0.18)" }} />
    </div>
  );
}

// ─── Palabra animada del título ────────────────────────────────────────────
// "Sus archivos, bajo [palabra]." — las 6 palabras del título original, que
// remiten a los distintos servicios (gestión documental integral). Cambia
// cada 2,6 s dentro de la pastilla amarilla; el ancho se ajusta con
// transición. Con "reducir movimiento" se queda en la primera palabra.

const HERO_WORDS = ["control", "custodia", "orden", "legalidad", "resguardo", "protección"];

export function HeroRotatingWord() {
  const [idx, setIdx] = useState(0);
  const ghost = useRef<HTMLSpanElement>(null);
  const [w, setW] = useState<number | null>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setIdx(i => (i + 1) % HERO_WORDS.length), 2600);
    return () => clearInterval(t);
  }, []);
  useLayoutEffect(() => {
    const el = ghost.current; if (!el) return;
    const measure = () => setW(el.getBoundingClientRect().width);
    measure();
    // La fuente del título carga después: se vuelve a medir al cambiar de tamaño.
    const ro = new ResizeObserver(measure); ro.observe(el);
    return () => ro.disconnect();
  }, [idx]);
  const word = HERO_WORDS[idx];
  return (
    <span className="inline-flex align-middle rounded-xl md:rounded-2xl px-3 md:px-4" style={{ background: "#FFDE59", color: "#272B7C", textShadow: "none" }}>
      <span className="relative inline-block overflow-hidden" style={{ width: w ?? "auto", height: "1.22em", transition: "width 0.35s cubic-bezier(0.4,0,0.2,1)" }}>
        <span ref={ghost} className="invisible whitespace-nowrap">{word}</span>
        <span key={word} className="absolute left-0 top-0 whitespace-nowrap hero-word-in">{word}</span>
      </span>
    </span>
  );
}

// ─── "¿Qué necesita hoy?" ──────────────────────────────────────────────────
// Selector compacto bajo el título: al elegir una necesidad muestra en una
// línea qué hacemos y lleva a cotizar ese servicio (con el servicio ya
// elegido en el cotizador) o a conocerlo.

const QUICK = [
  { label: "Organizar", icon: "list-columns-reverse", title: "Inventario y organización", text: "Clasificamos y ordenamos su archivo según la norma AGN.", slug: "levantamiento-de-inventario" },
  { label: "Digitalizar", icon: "upc-scan", title: "Digitalización con valor legal", text: "Escaneo, OCR e indexación para encontrarlo todo en segundos.", slug: "digitalizacion-de-documentos" },
  { label: "Custodiar", icon: "archive", title: "Custodia de archivos", text: "Centro documental con vigilancia 24 h y consulta cuando la necesite.", slug: "custodia-de-archivos" },
  { label: "Destruir", icon: "file-earmark-x", title: "Destrucción certificada", text: "Eliminación segura con acta y certificado, según la Ley 594.", slug: "destruccion-de-documentos" },
];

export function HeroQuickStart() {
  const [sel, setSel] = useState(0);
  const q = QUICK[sel];
  return (
    <div className="mt-9 max-w-[440px] mx-auto md:mx-0">
    <p className="text-center md:text-left text-sm font-semibold mb-3" style={{ color: "#fff", fontFamily: "Montserrat, sans-serif" }}>¿Qué necesitas hoy?</p>
    <div className="text-left rounded-3xl p-2"
      style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)", backdropFilter: "blur(10px)", boxShadow: "0 30px 60px -30px rgba(0,0,0,0.55)" }}>
      {/* Pestañas: indicador amarillo que se desliza; foco de teclado interno
          (sin el contorno azul global, que se veía tosco sobre el amarillo). */}
      <div role="tablist" aria-label="¿Qué necesitas hoy?" className="relative grid grid-cols-4">
        <span aria-hidden="true" className="absolute top-0 bottom-0 rounded-2xl"
          style={{ width: "25%", left: `${sel * 25}%`, background: "#FFDE59", boxShadow: "0 10px 24px -12px rgba(255,222,89,0.8)", transition: "left 0.35s cubic-bezier(0.4,0,0.2,1)" }} />
        {QUICK.map((o, i) => {
          const on = i === sel;
          return (
            <button key={o.label} type="button" role="tab" aria-selected={on} onClick={() => setSel(i)}
              className={`qs-tab relative flex flex-col items-center gap-1 py-2.5 rounded-2xl transition-colors ${on ? "" : "hover:bg-white/[0.07]"}`}>
              <Bi n={o.icon} size={16} color={on ? "#272B7C" : "rgba(255,255,255,0.72)"} style={{ transition: "color 0.25s" }} />
              <span className="text-[11px] font-bold" style={{ color: on ? "#272B7C" : "rgba(255,255,255,0.78)", fontFamily: "Montserrat, sans-serif", transition: "color 0.25s" }}>{o.label}</span>
            </button>
          );
        })}
      </div>

      {/* Detalle: alto fijo, texto centrado en vertical (sin huecos) */}
      <div role="tabpanel" className="mt-2 rounded-2xl" style={{ background: "#fff" }}>
        <div key={q.slug} className="hero-word-in flex items-center gap-3.5 px-4 h-[84px]">
          <span className="grid place-items-center rounded-xl shrink-0" style={{ width: 44, height: 44, background: "#272B7C" }}>
            <Bi n={q.icon} size={19} color="#FFDE59" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold leading-tight truncate" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>{q.title}</p>
            <p className="text-xs mt-1 line-clamp-2" style={{ color: "#6B6B6B", lineHeight: 1.45 }}>{q.text}</p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 px-4 py-3" style={{ borderTop: "1px solid #F0F1FA" }}>
          <Link to={`/servicios/${q.slug}`} className="group inline-flex items-center gap-1 text-xs font-semibold" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
            Ver servicio <Bi n="chevron-right" size={10} color="#272B7C" className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link to={`/?servicio=${q.slug}#cotizador`} className="group inline-flex items-center gap-2 pl-4 pr-1.5 py-1.5 rounded-full text-xs font-bold transition-colors hover:bg-[#1800AD]"
            style={{ background: "#272B7C", color: "#fff", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
            Cotizar este servicio
            <span className="grid place-items-center rounded-full transition-transform group-hover:translate-x-0.5" style={{ width: 24, height: 24, background: "#FFDE59" }}>
              <Bi n="arrow-right" size={11} color="#272B7C" />
            </span>
          </Link>
        </div>
      </div>
    </div>
    </div>
  );
}
