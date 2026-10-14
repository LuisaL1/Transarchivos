// ─── Fondos decorativos de sección ─────────────────────────────────────────
// Capa detrás del contenido (z-index -1; la sección lleva "isolate"): un
// color plano de la paleta (sin amarillo ni degradados), un parche de puntos y, en algunas, la silueta de la carpeta del hero en
// contorno como marca de agua. Dos tonos que se alternan sección a sección
// (oct. 2026, para que el índigo no canse): "dark" = índigo vivo #1800AD del
// manual de marca, con textos en blanco; "light" = crema, con textos en índigo.

import { useLayoutEffect, useRef, useState } from "react";
import { JoelSilhouette } from "@/components/ui/Brand";
import { C } from "@/styles/tokens";


// ─── Pestaña de carpeta horizontal ─────────────────────────────────────────
// Motivo de carpeta que separa secciones: tapa redondeada a la izquierda, tramo
// recto que ocupa casi todo el ancho y bajada inclinada a la derecha (queda un
// tramo final de línea, "tail", para que se lea como pestaña). Es un solo
// trazo SVG dibujado en píxeles exactos: se mide el ancho disponible (al
// pre-generar, un ancho de referencia) y el viewBox coincide con él, así las
// curvas no se deforman ni quedan empalmes. Geometría en unidades de 30 px,
// escalada por "height".
function FolderLip({ color, line, height = 30, tail = 0.14 }: { color: string; line?: string; height?: number; tail?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(1104);
  useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    const measure = () => setW(Math.max(200, Math.round(el.getBoundingClientRect().width)));
    measure();
    const ro = new ResizeObserver(measure); ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const k = height / 30, h = height, r = 12 * k;
  const x1 = w * (1 - tail) - 46 * k; // donde termina el tramo recto
  const top = (y: number) => `M${y} ${h} V${r} Q${y} ${y} ${r} ${y} H${x1} Q${x1 + 8.5 * k} ${y} ${x1 + 14.5 * k} ${6 * k + y} L${x1 + 33.5 * k} ${25 * k - y} Q${x1 + 37.5 * k} ${h - y} ${x1 + 46 * k} ${h - y} H${w}`;
  return (
    <div ref={ref} className="w-full" style={{ height }}>
      <svg className="block" width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" shapeRendering="geometricPrecision">
        <path d={`${top(0)} V${h} Z`} fill={color} />
        {line && <path d={top(0.5)} fill="none" stroke={line} strokeWidth="1" strokeLinejoin="round" />}
      </svg>
    </div>
  );
}

// Separador entre secciones (también el borde inferior de los encabezados de
// las páginas internas): la línea fina sobre la sección de arriba y la pestaña
// horizontal, alineada con el contenido y rellena con el color de la sección
// de abajo. No ocupa alto: la pestaña sube sobre la sección de arriba.
export function FolderDivider({ color }: { color: string }) {
  // La línea va sobre la sección de arriba, que es del tono contrario al de
  // abajo (las secciones alternan): clara sobre índigo, índigo sobre clara.
  const line = color.toUpperCase() === C.indigo ? "rgba(24,0,173,0.16)" : "rgba(255,255,255,0.25)";
  return (
    <div aria-hidden="true" className="relative h-0 z-10 pointer-events-none">
      <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: line }} />
      <div className="absolute inset-x-0 bottom-0 max-w-6xl mx-auto px-6">
        <FolderLip color={color} line={line} />
      </div>
    </div>
  );
}

// ─── Nav Dropdown ─────────────────────────────────────────────────────────────

export type DecorVariant = "dark" | "light";

const DECOR_BG: Record<DecorVariant, string> = {
  dark: C.indigo,  // índigo vivo (manual de marca)
  light: C.cream, // crema
};

export function FolderOutline({ style }: { style: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 400 280" fill="none" aria-hidden="true" className="absolute" style={style}>
      <path d="M8 60 V26 Q8 8 26 8 H150 Q163 8 171 18 L190 44 Q197 52 210 52 H374 Q392 52 392 70 V254 Q392 272 374 272 H26 Q8 272 8 254 Z"
        stroke="currentColor" strokeWidth="2" />
      <path d="M8 84 H392" stroke="currentColor" strokeWidth="2" strokeDasharray="6 8" />
    </svg>
  );
}

export function SectionDecor({ variant, flip = false, folder = true, joel = false }: { variant: DecorVariant; flip?: boolean; folder?: boolean; joel?: boolean }) {
  const side = (a: string, b: string) => (flip ? b : a);
  const dark = variant === "dark";
  const ink = dark ? "255,255,255" : "24,0,173";
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -1, background: DECOR_BG[variant] }}>
      <div className="absolute" style={{ width: 220, height: 160, top: 40, [side("left", "right")]: 32, backgroundImage: `radial-gradient(rgba(${ink},${dark ? 0.16 : 0.18}) 1.4px, transparent 1.6px)`, backgroundSize: "18px 18px" }} />
      {/* Junto al encabezado, donde hay aire; las piernas quedan detrás de la tarjeta. */}
      {joel && <JoelSilhouette style={{ height: 400, top: 28, [side("left", "right")]: "max(16px, calc(50% - 610px))", opacity: dark ? 0.09 : 0.07, background: dark ? "#FFFFFF" : C.indigo }} />}
      {folder && (
        <div className="hidden lg:block" style={{ color: `rgba(${ink},${dark ? 0.06 : 0.07})` }}>
          <FolderOutline style={{ width: 420, bottom: -60, [side("right", "left")]: -70, transform: `rotate(${flip ? 8 : -8}deg)` }} />
        </div>
      )}
    </div>
  );
}
