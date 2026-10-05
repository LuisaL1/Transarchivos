import { JoelSilhouette } from "@/components/ui/Brand";

export function Divider() {
  return <div className="border-b" style={{ borderColor: "#E9E9E7" }} />;
}

// ─── Nav Dropdown ─────────────────────────────────────────────────────────────

export type DecorVariant = "lavender" | "cream";

export const DECOR_BG: Record<DecorVariant, string> = {
  lavender: "#F1F3FB",
  cream: "#FBFBF8",
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
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -1, background: DECOR_BG[variant] }}>
      <div className="absolute" style={{ width: 220, height: 160, top: 40, [side("left", "right")]: 32, backgroundImage: "radial-gradient(rgba(39,43,124,0.18) 1.4px, transparent 1.6px)", backgroundSize: "18px 18px" }} />
      {/* Junto al encabezado, donde hay aire; las piernas quedan detrás de la tarjeta. */}
      {joel && <JoelSilhouette style={{ height: 400, top: 28, [side("left", "right")]: "max(16px, calc(50% - 610px))", opacity: 0.09 }} />}
      {folder && (
        <div className="hidden lg:block" style={{ color: "rgba(39,43,124,0.07)" }}>
          <FolderOutline style={{ width: 420, bottom: -60, [side("right", "left")]: -70, transform: `rotate(${flip ? 8 : -8}deg)` }} />
        </div>
      )}
    </div>
  );
}
