import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bi } from "@/components/ui/Icons";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useLang } from "@/i18n";
import { useHomeUi } from "@/i18n/home";
import { C } from "@/styles/tokens";

// Fondo del hero: secuencia de fotos de la operación (bodegas, digitalización,
// microfilmación, flota), entregadas por Transarchivos ("Secuencia de imágenes
// home", oct. 2026) y guardadas en public/hero-fotos/ (WebP de 1920 px). Pasan
// una a una con un fundido largo cada SLIDE_MS, sin acercamiento ni otro
// movimiento (el título ya se anima: el fondo debe quedarse quieto); la primera
// se precarga en index.html para que aparezca de inmediato. Con "reducir
// movimiento" se queda en la primera foto. Para cambiar las fotos, reemplace
// los archivos (01.webp…) y ajuste HERO_PHOTO_COUNT.
const HERO_PHOTO_COUNT = 16;
const HERO_PHOTOS = Array.from({ length: HERO_PHOTO_COUNT }, (_, i) => `/hero-fotos/${String(i + 1).padStart(2, "0")}.webp`);
const SLIDE_MS = 12000;
const FADE_MS = 2500;

export function HeroPhotos() {
  const reduced = useReducedMotion();
  const [idx, setIdx] = useState(0);
  // Cuántas fotos ya están en el DOM: la actual y la siguiente (que se carga
  // escondida para que el fundido no espere la descarga). Al dar la vuelta ya
  // están todas.
  const [mounted, setMounted] = useState(2);
  useEffect(() => {
    if (reduced) return;
    const t = window.setInterval(() => setIdx(i => (i + 1) % HERO_PHOTOS.length), SLIDE_MS);
    return () => clearInterval(t);
  }, [reduced]);
  useEffect(() => { setMounted(m => Math.max(m, Math.min(HERO_PHOTOS.length, idx + 2))); }, [idx]);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true" style={{ backgroundColor: C.indigo }}>
      {HERO_PHOTOS.slice(0, mounted).map((src, i) => {
        const on = i === idx;
        return (
          <img key={src} src={src} alt="" decoding="async" fetchPriority={i === 0 ? "high" : "low"}
            className="absolute inset-0 w-full h-full"
            style={{ objectFit: "cover", opacity: on ? 1 : 0, transition: `opacity ${FADE_MS}ms ease-in-out` }} />
        );
      })}
      {/* Velo índigo: el texto va encima de la foto. Más cerrado (0,8) para que
          las fotos apenas se insinúen y el contraste sea mejor (pedido del cliente, oct. 2026). */}
      <div className="absolute inset-0" style={{ background: "rgba(24,0,173,0.8)" }} />
    </div>
  );
}

// ─── Título animado ────────────────────────────────────────────────────────
// Tres frases que se alternan cada 4,5 s (documento "Correcciones en página web
// de Transarchivos - Home", oct. 2026), con la parte clave en la pastilla
// amarilla. Las tres frases ocupan la misma celda de la cuadrícula: el alto es
// el de la más larga y el contenido de abajo no salta al cambiar. Solo la
// visible se lee en voz alta. Con "reducir movimiento" se queda en la primera.
export function HeroRotatingTitle() {
  const reduced = useReducedMotion();
  const titles = useHomeUi().hero.titles;
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const t = window.setInterval(() => setIdx(i => (i + 1) % titles.length), 4500);
    return () => clearInterval(t);
  }, [reduced, titles.length]);
  return (
    <span className="grid items-end">
      {titles.map(([a, mark, b], i) => (
        <span key={mark} aria-hidden={i !== idx} className={`[grid-area:1/1] ${i === idx ? "hero-word-in" : "invisible"}`}>
          {a}<span className="whitespace-nowrap rounded-xl md:rounded-2xl px-2 md:px-3 [box-decoration-break:clone]" style={{ background: C.yellow, color: C.indigo, textShadow: "none" }}>{mark}</span>{b}
        </span>
      ))}
    </span>
  );
}

// ─── "¿Qué necesita hoy?" ──────────────────────────────────────────────────
// Selector compacto bajo el título: al elegir una necesidad muestra en una
// línea qué hacemos y lleva a cotizar ese servicio (con el servicio ya
// elegido en el cotizador) o a conocerlo. Textos en src/i18n/home.ts.
export function HeroQuickStart() {
  const [sel, setSel] = useState(0);
  const { lp } = useLang();
  const u = useHomeUi().hero;
  const QUICK = u.quick;
  const q = QUICK[sel];
  return (
    <div className="mt-9 max-w-[560px] lg:max-w-[600px] mx-auto lg:mx-0">
    <p className="text-center lg:text-left text-base font-semibold mb-3" style={{ color: "#fff", fontFamily: "Montserrat, sans-serif" }}>{u.quickTitle}</p>
    <div className="text-left rounded-3xl p-2"
      style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)", backdropFilter: "blur(10px)", boxShadow: "0 30px 60px -30px rgba(0,0,0,0.55)" }}>
      {/* Pestañas: indicador amarillo que se desliza; foco de teclado interno. */}
      <div role="tablist" aria-label={u.quickTitle} className="relative grid grid-cols-4">
        <span aria-hidden="true" className="absolute top-0 bottom-0 rounded-2xl"
          style={{ width: "25%", left: `${sel * 25}%`, background: C.yellow, boxShadow: "0 10px 24px -12px rgba(255,222,89,0.8)", transition: "left 0.35s cubic-bezier(0.4,0,0.2,1)" }} />
        {QUICK.map((o, i) => {
          const on = i === sel;
          return (
            <button key={o.slug} type="button" role="tab" aria-selected={on} onClick={() => setSel(i)}
              className={`qs-tab relative flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-colors ${on ? "" : "hover:bg-white/[0.07]"}`}>
              <Bi n={o.icon} size={20} color={on ? C.indigo : "rgba(255,255,255,0.72)"} style={{ transition: "color 0.25s" }} />
              <span className="text-[13px] lg:text-sm font-bold" style={{ color: on ? C.indigo : "rgba(255,255,255,0.78)", fontFamily: "Montserrat, sans-serif", transition: "color 0.25s" }}>{o.label}</span>
            </button>
          );
        })}
      </div>

      {/* Detalle del servicio elegido */}
      <div role="tabpanel" className="mt-2 rounded-2xl" style={{ background: "#fff" }}>
        {/* Los cuatro textos ocupan la misma celda: la tarjeta no cambia de tamaño al cambiar de pestaña. */}
        <div className="grid">
          {QUICK.map((o, i) => (
            <div key={o.slug} aria-hidden={i !== sel} className={`[grid-area:1/1] flex items-center gap-4 px-5 py-5 ${i === sel ? "hero-word-in" : "invisible"}`}>
              <span className="grid place-items-center rounded-xl shrink-0" style={{ width: 52, height: 52, background: C.indigo }}>
                <Bi n={o.icon} size={23} color={C.yellow} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-base lg:text-lg font-bold leading-tight" style={{ color: C.indigo, fontFamily: "Poppins, sans-serif" }}>{o.title}</p>
                <p className="text-sm lg:text-[15px] mt-1.5" style={{ color: C.muted, lineHeight: 1.5 }}>{o.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between gap-3 px-5 py-3.5" style={{ borderTop: "1px solid #F0F1FA" }}>
          <Link to={lp(`/servicios/${q.slug}`)} className="group inline-flex items-center gap-1 text-sm font-semibold" style={{ color: C.indigo, fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
            {u.seeService} <Bi n="chevron-right" size={12} color={C.indigo} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link to={lp(`/?servicio=${q.slug}#cotizador`)} className="group inline-flex items-center gap-2.5 pl-5 pr-2 py-2 rounded-full text-sm font-bold transition-colors hover:bg-indigo"
            style={{ background: C.indigo, color: "#fff", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
            {u.quoteThis}
            <span className="grid place-items-center rounded-full transition-transform group-hover:translate-x-0.5" style={{ width: 28, height: 28, background: C.yellow }}>
              <Bi n="arrow-right" size={13} color={C.indigo} />
            </span>
          </Link>
        </div>
      </div>
    </div>
    </div>
  );
}
