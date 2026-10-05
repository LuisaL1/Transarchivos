import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Bi } from "@/components/ui/Icons";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import colombiaMap from "@/assets/images/colombia.svg";
import joelImg from "@/assets/images/joel.png"; // silueta en súper zoom

// ─── Desde Bogotá, para toda Colombia (efecto al hacer scroll) ─────────────
// Inspirado en el recurso de Audi que pidió el cliente: la sección queda fija
// mientras se baja y el desplazamiento controla la animación.
//   1. Mapa de Colombia con el punto amarillo latiendo en Bogotá (centro de
//      operaciones) y el mensaje de cobertura nacional.
//   2. Desde Bogotá se abre un círculo que revela el video de archivo hasta
//      cubrir toda la pantalla, con el mensaje final.
// Con "reducir movimiento" se muestra el mapa sin animación.

const BOGOTA = { left: 0.486, top: 0.495 }; // posición del punto dentro del mapa
const VIDEO = "/videos/archivosvi4.mp4";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
// Entra lento (se ve nacer el círculo en Bogotá) y acelera al final.
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function MapReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  const [center, setCenter] = useState({ x: 0, y: 0, r: 2000 });
  const reduced = useReducedMotion();

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
    <section ref={sectionRef} aria-label="Cobertura nacional" className="relative" style={{ height: reduced ? "auto" : "260vh", background: "#272B7C" }}>
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

        <div className="relative h-full max-w-6xl mx-auto px-6 grid md:grid-cols-2 items-center gap-8 py-16 md:py-0">
          {/* Texto del mapa */}
          <div style={{ opacity: mapText, transform: `translateY(${(1 - mapText) * -20}px)` }} className="text-center md:text-left order-2 md:order-1">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#FFDE59", fontFamily: "Montserrat, sans-serif" }}>Cobertura nacional</p>
            <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: "#fff", fontFamily: "Poppins, sans-serif", lineHeight: 1.12 }}>
              Desde Bogotá,<br />para toda Colombia
            </h2>
            <p className="text-sm md:text-base max-w-md mx-auto md:mx-0" style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.7 }}>
              Nuestro centro de operaciones y bodegas están en Bogotá. Desde aquí atendemos empresas de distintas ciudades del país, también en servicios que no se pueden realizar legalmente en cualquier lugar, como la destrucción certificada de documentos.
            </p>
          </div>

          {/* Mapa con Bogotá */}
          <div className="relative order-1 md:order-2 flex justify-center">
            <div ref={mapRef} className="relative h-[46vh] md:h-[78vh]" style={{ aspectRatio: "1006 / 1370", transform: `scale(${mapScale})`, transformOrigin: `${BOGOTA.left * 100}% ${BOGOTA.top * 100}%` }}>
              <img loading="lazy" decoding="async" src={colombiaMap} alt="Mapa de Colombia con Bogotá resaltada" draggable={false} className="w-full h-full select-none" style={{ objectFit: "contain", filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.4))" }} />
              <span className="absolute" style={{ left: `${BOGOTA.left * 100}%`, top: `${BOGOTA.top * 100}%`, transform: "translate(-50%, -50%)" }}>
                <span className="absolute inset-0 rounded-full" style={{ background: "#FFDE59", animation: "mapPulse 1.8s cubic-bezier(0,0,0.2,1) infinite" }} />
                <span className="relative block rounded-full" style={{ width: 16, height: 16, background: "#FFDE59", border: "3px solid #fff", boxShadow: "0 0 18px 4px rgba(255,222,89,0.7)" }} />
                <span className="absolute whitespace-nowrap text-[11px] md:text-xs font-bold px-2.5 py-1 rounded-full left-1/2 -translate-x-1/2 top-6 md:left-6 md:translate-x-0 md:top-1/2 md:-translate-y-1/2" style={{ background: "#fff", color: "#272B7C", fontFamily: "Montserrat, sans-serif", opacity: mapText }}>
                  Bogotá · Centro de operaciones
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Video revelado desde Bogotá */}
        {!reduced && (
          <div aria-hidden={endText < 0.5} inert={endText < 0.5} className="absolute inset-0" style={{ clipPath: `circle(${reveal * center.r}px at ${center.x}px ${center.y}px)`, pointerEvents: endText > 0.5 ? "auto" : "none" }}>
            <video src={VIDEO} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full" style={{ objectFit: "cover" }}
              ref={el => { if (el) { el.muted = true; el.setAttribute("muted", ""); } }} />
            <div className="absolute inset-0" style={{ background: "rgba(39,43,124,0.6)" }} />
            <div className="relative h-full max-w-6xl mx-auto px-6 flex flex-col justify-center items-center text-center"
              style={{ opacity: endText, transform: `translateY(${(1 - endText) * 24}px)` }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#FFDE59", fontFamily: "Montserrat, sans-serif" }}>Gestión documental integral</p>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 max-w-3xl" style={{ color: "#fff", fontFamily: "Poppins, sans-serif", lineHeight: 1.12 }}>
                Más de 40 años cuidando la información de las empresas colombianas
              </h2>
              <p className="text-sm md:text-base max-w-xl mb-7" style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>
                Organizamos, digitalizamos, custodiamos y destruimos sus documentos con trazabilidad y cumplimiento legal, esté donde esté su empresa.
              </p>
              <Link to="/?servicio=diagnostico#cotizador" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold transition-transform hover:scale-[1.03]"
                style={{ background: "#FFDE59", color: "#272B7C", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
                Solicitar cotización <Bi n="arrow-right" size={14} color="#272B7C" />
              </Link>
            </div>
          </div>
        )}

        {/* Indicador de scroll */}
        {!reduced && (
          <div aria-hidden="true" className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1" style={{ opacity: 1 - clamp(p / 0.15) }}>
            <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "Montserrat, sans-serif" }}>Desplácese</span>
            <Bi n="chevron-down" size={14} color="rgba(255,255,255,0.6)" className="hero-word-in" />
          </div>
        )}
      </div>
    </section>
  );
}
