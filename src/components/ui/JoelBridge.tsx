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
          <img src={src} alt="" draggable={false} className="relative select-none h-full w-auto max-w-none"
            style={{
              transform: `${flip ? "scaleX(-1) " : ""}translateX(${shown ? 0 : dir * 40 * (flip ? -1 : 1)}px)`,
              opacity: shown ? 1 : 0,
              transition: "transform 0.9s cubic-bezier(0.2,0.7,0.2,1), opacity 0.9s ease",
              filter: "drop-shadow(0 14px 18px rgba(10,13,61,0.18))",
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
      <img src={src} alt="" draggable={false} className="relative select-none h-full w-auto max-w-none"
        style={{ transform: `${flip ? "scaleX(-1) " : ""}translateY(${shown ? 0 : 24}px)`, opacity: shown ? 1 : 0, transition: "transform 0.9s cubic-bezier(0.2,0.7,0.2,1), opacity 0.9s ease", filter: "drop-shadow(0 14px 18px rgba(10,13,61,0.18))" }} />
    </div>
  );
}
