import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Bi } from "@/components/ui/Icons";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import colombiaMap from "@/assets/images/colombia.svg";
import joelImg from "@/assets/images/joel.webp"; // silueta en súper zoom
import { C } from "@/styles/tokens";

// ─── Cobertura desde Bogotá para toda Colombia (efecto al hacer scroll) ────
// Inspirado en el recurso de Audi que pidió el cliente: la sección queda fija
// mientras se baja y el desplazamiento controla la animación.
//   1. Mapa de Colombia con rutas desde 10 ciudades que llegan a Bogotá (centro
//      de operaciones): la información de todo el país se centraliza allí.
//   2. Desde Bogotá se abre un círculo que revela el video de archivo hasta
//      cubrir toda la pantalla, con el mensaje final.
// Con "reducir movimiento" se muestra el mapa sin animación. En celular el mapa
// y el texto se reducen para que todo quepa en la pantalla fija (más aún en
// pantallas bajas, como el iPhone SE).

// Posiciones calibradas con coordenadas geográficas reales (lon/lat → mapa,
// ajuste con Punta Gallinas, Leticia, Cabo Manglares y Puerto Carreño).
const BOGOTA = { left: 0.4296, top: 0.5013 };
// Ciudades desde las que la información llega al centro de Bogotá.
const CITIES: { name: string; x: number; y: number; left?: boolean; below?: boolean }[] = [
  { name: "Cartagena", x: 0.3237, y: 0.1906 },
  { name: "Santa Marta", x: 0.4200, y: 0.1437 },
  { name: "Cúcuta", x: 0.5472, y: 0.3277 },
  { name: "Bucaramanga", x: 0.5010, y: 0.3700 },
  { name: "Tunja", x: 0.4826, y: 0.4564 },
  { name: "Medellín", x: 0.3160, y: 0.4178, left: true },
  { name: "Neiva", x: 0.3385, y: 0.5982 },
  { name: "Cali", x: 0.2445, y: 0.5697 },
  { name: "Armenia", x: 0.3085, y: 0.5109, left: true },
  { name: "Ibagué", x: 0.3423, y: 0.5161, below: true },
];
const MW = 1006, MH = 1370; // proporción del mapa (viewBox del SVG)
// Curva desde la ciudad hasta Bogotá (el recorrido termina en Bogotá).
const route = (c: { x: number; y: number }) => {
  const x1 = c.x * MW, y1 = c.y * MH, x2 = BOGOTA.left * MW, y2 = BOGOTA.top * MH;
  const d = Math.hypot(x2 - x1, y2 - y1), mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  // control perpendicular a la recta, siempre hacia el mismo lado (arco suave)
  const nx = -(y2 - y1) / d, ny = (x2 - x1) / d;
  return `M${x1.toFixed(1)} ${y1.toFixed(1)} Q${(mx + nx * d * 0.22).toFixed(1)} ${(my + ny * d * 0.22).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
};
// Recorrido por los pasillos del centro documental (video entregado por
// Transarchivos en 4K en el documento de correcciones del inicio, oct. 2026;
// reemplazó la toma de la bodega), sin audio, en bucle al 70 %; versión
// vertical para celular. Nombres nuevos al cambiarlo (caché).
const VIDEO = { desktop: "/videos/transarchivos-centro-documental.mp4", mobile: "/videos/transarchivos-centro-documental-movil.mp4" };

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
// Entra lento (se ve nacer el círculo en Bogotá) y acelera al final.
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function MapReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  const [center, setCenter] = useState({ x: 0, y: 0, r: 2000 });
  const reduced = useReducedMotion();
  // Ciudad resaltada: recorre las ciudades una a una (pausa al pasar el mouse).
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  useEffect(() => {
    if (reduced || hover !== null) return;
    const id = window.setInterval(() => setActive(i => (i + 1) % CITIES.length), 2400);
    return () => clearInterval(id);
  }, [reduced, hover]);
  const current = hover ?? active;

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const sec = sectionRef.current, map = mapRef.current;
      if (!sec || !map) return;
      const r = sec.getBoundingClientRect();
      const total = sec.offsetHeight - window.innerHeight;
      setP(clamp(-r.top / total));
      const m = map.getBoundingClientRect();
      const x = m.left + m.width * BOGOTA.left;
      const y = m.top - Math.max(0, r.top) + m.height * BOGOTA.top;
      const far = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      setCenter({ x, y, r: far });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, [reduced]);

  // Fases: 0–0.3 mapa · 0.3–0.85 se abre el círculo · 0.85–1 video completo.
  const reveal = ease(clamp((p - 0.28) / 0.6));
  const mapText = 1 - clamp((p - 0.22) / 0.15);
  const endText = clamp((p - 0.82) / 0.12);
  const mapScale = 1 + reveal * 0.35;

  return (
    <section ref={sectionRef} aria-label="Cobertura nacional" className="relative" style={{ height: reduced ? "auto" : "260vh", background: C.indigo }}>
      <div className={reduced ? "relative" : "sticky top-0 h-screen overflow-hidden"}>
        {/* Cuadrícula de fondo */}
        <svg aria-hidden="true" className="absolute inset-0 w-full h-full">
          <defs><pattern id="map-grid" width="56" height="56" patternUnits="userSpaceOnUse"><path d="M56 0H0V56" fill="none" stroke="rgba(255,255,255,0.05)" /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#map-grid)" />
        </svg>

        {/* Silueta de Joel en súper zoom a la izquierda, detrás del texto,
            recortada abajo; se desvanece con el texto. */}
        <div aria-hidden="true" className="hidden md:block absolute pointer-events-none"
          style={{
            left: "-7vw", bottom: "-46vh", height: "135vh", aspectRatio: "1012 / 1555",
            // Mismo color del mapa (blanco al 16 % sobre el azul).
            opacity: mapText, background: "rgba(255,255,255,0.16)",
            maskImage: `url(${joelImg})`, WebkitMaskImage: `url(${joelImg})`,
            maskSize: "contain", WebkitMaskSize: "contain", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat",
            maskPosition: "bottom left", WebkitMaskPosition: "bottom left",
          }} />

        <div className="relative h-full max-w-6xl mx-auto px-6 grid md:grid-cols-2 content-center md:items-center gap-4 md:gap-8 pt-20 [@media(max-height:720px)]:pt-16 pb-6 md:py-0">
          {/* Texto del mapa */}
          <div style={{ opacity: mapText, transform: `translateY(${(1 - mapText) * -20}px)` }} className="text-center md:text-left order-2 md:order-1">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: C.yellow, fontFamily: "Montserrat, sans-serif" }}>Cobertura nacional</p>
            <h2 className="text-[26px] [@media(max-height:720px)]:text-[22px] md:text-[40px] md:[@media(max-height:720px)]:text-[40px] font-bold mb-3 md:mb-4" style={{ color: "#fff", fontFamily: "Poppins, sans-serif", lineHeight: 1.15 }}>
              Cobertura estratégica desde la capital para toda Colombia
            </h2>
            <p className="text-[13px] [@media(max-height:720px)]:text-[12px] md:text-[15px] md:[@media(max-height:720px)]:text-[15px] max-w-md mx-auto md:mx-0" style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>
              Nuestra sede de operación y bodegas especializadas en Bogotá listas para responder a las demandas de gestión documental de empresas a nivel nacional. Desde nuestra infraestructura central garantizamos la ejecución de procesos críticos con plena validez legal, incluyendo la eliminación definitiva y trazable de archivos bajo los más estrictos lineamientos normativos y ambientales que exige la ley.
            </p>
          </div>

          {/* Mapa con Bogotá */}
          <div className="relative order-1 md:order-2 flex justify-center">
            <div ref={mapRef} className="relative h-[30vh] [@media(max-height:720px)]:h-[20vh] md:h-[78vh] md:[@media(max-height:720px)]:h-[70vh]" style={{ aspectRatio: "1006 / 1370", transform: `scale(${mapScale})`, transformOrigin: `${BOGOTA.left * 100}% ${BOGOTA.top * 100}%` }}>
              <img loading="lazy" decoding="async" src={colombiaMap} alt="Mapa de Colombia con Bogotá resaltada" draggable={false} className="w-full h-full select-none" style={{ objectFit: "contain", filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.4))" }} />
              {/* Rutas: de cada ciudad hacia Bogotá (los trazos y puntos viajan hacia el centro) */}
              <svg aria-hidden="true" viewBox={`0 0 ${MW} ${MH}`} className="absolute inset-0 w-full h-full overflow-visible">
                {CITIES.map((c, i) => {
                  const d = route(c), on = i === current;
                  return (
                    <g key={c.name}>
                      {/* línea base continua (siempre visible) */}
                      <path d={d} fill="none" stroke={on ? C.yellow : "#ffffff"} strokeOpacity={on ? 0.35 : 0.12} strokeWidth={on ? 4 : 2.5} strokeLinecap="round" style={{ transition: "stroke 0.5s, stroke-opacity 0.5s" }} />
                      {/* trazo punteado que avanza hacia Bogotá */}
                      <path d={d} fill="none" stroke={on ? C.yellow : "#ffffff"} strokeOpacity={on ? 0.95 : 0.3} strokeWidth={on ? 4 : 2.2}
                        strokeLinecap="round" className={reduced ? "" : "map-flow"} style={{ transition: "stroke 0.5s, stroke-opacity 0.5s, stroke-width 0.5s", animationDuration: `${1.8 + (i % 3) * 0.4}s` }} />
                      {!reduced && (
                        <circle r={on ? 7 : 4} fill={on ? C.yellow : "#ffffff"} opacity={on ? 1 : 0.45}>
                          <animateMotion dur={`${2.8 + (i % 4) * 0.5}s`} repeatCount="indefinite" path={d} begin={`-${i * 0.4}s`} />
                        </circle>
                      )}
                      <circle cx={c.x * MW} cy={c.y * MH} r={on ? 26 : 0} fill={C.yellow} fillOpacity="0.22" style={{ transition: "r 0.4s" }} />
                      <circle cx={c.x * MW} cy={c.y * MH} r={on ? 10 : 6} fill={on ? "#fff" : "rgba(255,255,255,0.75)"} stroke={C.yellow} strokeWidth={on ? 4 : 0} style={{ transition: "r 0.3s" }} />
                    </g>
                  );
                })}
              </svg>
              {/* Etiquetas y zonas de mouse (HTML: texto nítido) */}
              {CITIES.map((c, i) => (
                <span key={c.name} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
                  className="absolute" style={{ left: `${c.x * 100}%`, top: `${c.y * 100}%`, width: 26, height: 26, transform: "translate(-50%, -50%)" }}>
                  {/* Solo se muestra el nombre de la ciudad activa (discreto, sin saturar el mapa). */}
                  <span className={`absolute whitespace-nowrap text-[10px] md:text-[11px] font-bold px-2 py-0.5 rounded-full transition-all duration-500 pointer-events-none ${c.below ? "top-full mt-0.5 left-1/2 -translate-x-1/2" : c.left ? "right-full mr-1 top-1/2 -translate-y-1/2" : "left-full ml-1 top-1/2 -translate-y-1/2"} ${i === current ? "opacity-100" : "opacity-0"}`}
                    style={{ background: i === current ? C.yellow : "rgba(255,255,255,0.92)", color: C.indigo, fontFamily: "Montserrat, sans-serif", boxShadow: "0 6px 16px -6px rgba(0,0,0,0.5)" }}>
                    {c.name}
                  </span>
                </span>
              ))}
              <span className="absolute" style={{ left: `${BOGOTA.left * 100}%`, top: `${BOGOTA.top * 100}%`, transform: "translate(-50%, -50%)" }}>
                <span className="absolute inset-0 rounded-full" style={{ background: C.yellow, animation: "mapPulse 1.8s cubic-bezier(0,0,0.2,1) infinite" }} />
                <span className="relative block rounded-full" style={{ width: 16, height: 16, background: C.yellow, border: "3px solid #fff", boxShadow: "0 0 18px 4px rgba(255,222,89,0.7)" }} />
                <span className="absolute whitespace-nowrap text-[11px] md:text-xs font-bold px-2.5 py-1 rounded-full left-1/2 -translate-x-1/2 top-6 md:left-6 md:translate-x-0 md:top-1/2 md:-translate-y-1/2" style={{ background: "#fff", color: C.indigo, fontFamily: "Montserrat, sans-serif", opacity: mapText }}>
                  Bogotá · Centro de operaciones
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Video revelado desde Bogotá */}
        {!reduced && (
          <div aria-hidden={endText < 0.5} inert={endText < 0.5} className="absolute inset-0" style={{ clipPath: `circle(${reveal * center.r}px at ${center.x}px ${center.y}px)`, pointerEvents: endText > 0.5 ? "auto" : "none" }}>
            <video autoPlay muted loop playsInline preload="metadata"
              ref={el => { if (el) { el.muted = true; el.setAttribute("muted", ""); el.defaultPlaybackRate = 0.7; el.playbackRate = 0.7; } }}
              onLoadedMetadata={e => { e.currentTarget.playbackRate = 0.7; }}
              className="absolute inset-0 w-full h-full" style={{ objectFit: "cover" }}>
              <source src={VIDEO.mobile} type="video/mp4" media="(max-width: 767px)" />
              <source src={VIDEO.desktop} type="video/mp4" />
            </video>
            <div className="absolute inset-0" style={{ background: "rgba(24,0,173,0.55)" }} />
            <div className="relative h-full max-w-6xl mx-auto px-6 flex flex-col justify-center items-center text-center"
              style={{ opacity: endText, transform: `translateY(${(1 - endText) * 24}px)` }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: C.yellow, fontFamily: "Montserrat, sans-serif" }}>Gestión documental integral</p>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 max-w-3xl" style={{ color: "#fff", fontFamily: "Poppins, sans-serif", lineHeight: 1.12 }}>
                Más de cuatro décadas liderando la protección de la información empresarial de Colombia
              </h2>
              <p className="text-sm md:text-base max-w-2xl mb-7" style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>
                Gestionando el ciclo total de sus archivos bajo los estándares de la normativa colombiana. Nos encargamos de la clasificación, digitalización con OCR, custodia de alta seguridad y destrucción trazable, brindando respaldo legal a su empresa.
              </p>
              <Link to="/?servicio=diagnostico#cotizador" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold transition-transform hover:scale-[1.03]"
                style={{ background: C.yellow, color: C.indigo, fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
                Solicitar cotización <Bi n="arrow-right" size={14} color={C.indigo} />
              </Link>
            </div>
          </div>
        )}

        {/* Indicador de scroll */}
        {!reduced && (
          <div aria-hidden="true" className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1" style={{ opacity: 1 - clamp(p / 0.15) }}>
            <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "Montserrat, sans-serif" }}>Desplácese</span>
            <Bi n="chevron-down" size={14} color="rgba(255,255,255,0.6)" className="hero-word-in" />
          </div>
        )}
      </div>
    </section>
  );
}
