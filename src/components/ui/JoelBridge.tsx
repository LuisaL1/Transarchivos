import { useEffect, useRef, useState } from "react";
import { FolderOutline } from "@/components/ui/SectionDecor";

// ─── Joel entre secciones ───────────────────────────────────────────────────
// Joel (poses del kit de marca, recortadas en PNG) parado sobre la unión de
// dos secciones: los pies en la sección de abajo y el cuerpo sobre la de
// arriba. Detrás, una carpeta en contorno y un parche de puntos (mismos
// elementos gráficos del sitio). Entra con un deslizamiento suave al
// aparecer en pantalla. Solo en pantallas grandes, para no tapar contenido.

export function JoelBridge({ src, side = "right", height = 210, sink = 34, offset = 0, flip = false }: {
  src: string; side?: "left" | "right"; height?: number; sink?: number; offset?: number; flip?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setShown(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { rootMargin: "0px 0px -80px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const dir = side === "right" ? 1 : -1;
  return (
    <div aria-hidden="true" className="relative h-0 z-20 hidden lg:block pointer-events-none">
      <div className="relative max-w-6xl mx-auto px-6">
        <div ref={ref} className="absolute" style={{ [side]: offset, bottom: -sink, height }}>
          {/* Elementos gráficos detrás */}
          <div className="absolute" style={{ color: "rgba(39,43,124,0.12)", width: height * 0.95, height: height * 0.66, bottom: height * 0.12, [side === "right" ? "right" : "left"]: -height * 0.18 }}>
            <FolderOutline style={{ width: "100%", transform: `rotate(${dir * 6}deg)` }} />
          </div>
          <div className="absolute rounded-full" style={{ width: 70, height: 50, top: 6, [side === "right" ? "left" : "right"]: -26, backgroundImage: "radial-gradient(rgba(39,43,124,0.22) 1.3px, transparent 1.6px)", backgroundSize: "12px 12px" }} />
          {/* Sombra de piso */}
          <span className="absolute left-1/2 -translate-x-1/2 rounded-full" style={{ bottom: -6, width: height * 0.55, height: 12, background: "rgba(10,13,61,0.18)", filter: "blur(6px)" }} />
          <img loading="lazy" decoding="async" src={src} alt="" draggable={false} className="relative select-none h-full w-auto max-w-none"
            style={{
              transform: `${flip ? "scaleX(-1) " : ""}translateX(${shown ? 0 : dir * 40 * (flip ? -1 : 1)}px)`,
              opacity: shown ? 1 : 0,
              transition: "transform 0.9s cubic-bezier(0.2,0.7,0.2,1), opacity 0.9s ease",
              filter: "contrast(1.04) saturate(1.06) drop-shadow(0 2px 2px rgba(10,13,61,0.18)) drop-shadow(0 14px 18px rgba(10,13,61,0.18))",
            }} />
        </div>
      </div>
    </div>
  );
}

// ─── Joel dentro de una sección ────────────────────────────────────────────
// Misma composición (carpeta en contorno, puntos, sombra de piso y entrada
// suave), pero en el flujo normal de la página, para ubicarlo junto a un
// bloque de texto. Oculto en celular.
export function JoelFigure({ src, height = 240, flip = false, className = "" }: { src: string; height?: number; flip?: boolean; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setShown(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { rootMargin: "0px 0px -60px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} aria-hidden="true" className={`relative hidden lg:inline-block ${className}`} style={{ height }}>
      <div className="absolute" style={{ color: "rgba(39,43,124,0.12)", width: height * 1.05, height: height * 0.7, bottom: height * 0.1, left: -height * 0.18 }}>
        <FolderOutline style={{ width: "100%", transform: "rotate(-6deg)" }} />
      </div>
      <div className="absolute" style={{ width: 70, height: 50, top: 8, right: -24, backgroundImage: "radial-gradient(rgba(39,43,124,0.22) 1.3px, transparent 1.6px)", backgroundSize: "12px 12px" }} />
      <span className="absolute left-1/2 -translate-x-1/2 rounded-full" style={{ bottom: -6, width: height * 0.6, height: 12, background: "rgba(10,13,61,0.16)", filter: "blur(6px)" }} />
      <img loading="lazy" decoding="async" src={src} alt="" draggable={false} className="relative select-none h-full w-auto max-w-none"
        style={{ transform: `${flip ? "scaleX(-1) " : ""}translateY(${shown ? 0 : 24}px)`, opacity: shown ? 1 : 0, transition: "transform 0.9s cubic-bezier(0.2,0.7,0.2,1), opacity 0.9s ease", filter: "drop-shadow(0 14px 18px rgba(10,13,61,0.18))" }} />
    </div>
  );
}

// ─── Joel en acción (página de cada servicio) ──────────────────────────────
// Escenario de marca: tarjeta azul corporativo con la pestaña de carpeta, el
// detalle de esquina amarillo y puntos; Joel, en la pose de ese servicio,
// sobresale por arriba de la tarjeta (efecto "pop-out") con sombra de piso.
// Sirve igual para escenas anchas (escritorio con equipo) y de cuerpo entero.
export function JoelShowcase({ src, height = 300 }: { src: string; height?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setShown(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { rootMargin: "0px 0px -60px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} aria-hidden="true" className="relative select-none" style={{ marginTop: height - 150 }}>
      {/* Pestaña de carpeta sobre la tarjeta (mismo trazo del llamado final) */}
      <svg className="absolute left-0 bottom-full block" width="180" height="30" viewBox="0 0 280 46" preserveAspectRatio="none">
        <path d="M0 46 V18 Q0 0 18 0 H196 Q209 0 217 10 L242 38 Q249 46 262 46 Z" fill="#272B7C" />
      </svg>
      <div className="relative h-[190px] rounded-[0_28px_28px_28px]" style={{ background: "#272B7C" }}>
        <div className="absolute inset-0 overflow-hidden rounded-[0_28px_28px_28px]">
          <span className="absolute" style={{ right: -40, top: -40, width: 110, height: 110, transform: "rotate(45deg)", borderRadius: 19, background: "rgba(255,222,89,0.22)" }} />
          <span className="absolute" style={{ left: 22, bottom: 22, width: 110, height: 60, backgroundImage: "radial-gradient(rgba(255,255,255,0.22) 1.3px, transparent 1.6px)", backgroundSize: "14px 14px" }} />
          {/* Sombra de piso */}
          <span className="absolute left-1/2 -translate-x-1/2 rounded-full" style={{ bottom: 16, width: "38%", height: 16, background: "rgba(5,8,40,0.5)", filter: "blur(9px)" }} />
        </div>
        <img loading="lazy" decoding="async" src={src} alt="" draggable={false}
          className="absolute left-1/2 w-auto max-w-[94%] object-contain object-bottom"
          style={{
            bottom: 18, height,
            transform: `translateX(-50%) translateY(${shown ? 0 : 24}px)`, opacity: shown ? 1 : 0,
            transition: "transform 0.7s cubic-bezier(0.2,0.8,0.2,1), opacity 0.6s ease",
            // Ligero contraste y saturación + sombra de contacto: aspecto más 3D
            filter: "contrast(1.04) saturate(1.06) drop-shadow(0 2px 3px rgba(5,8,40,0.35)) drop-shadow(0 16px 20px rgba(5,8,40,0.32))",
          }} />
      </div>
    </div>
  );
}
