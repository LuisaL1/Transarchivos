

export function Bi({ n, size = 16, color, className = "", style }: { n: string; size?: number; color?: string; className?: string; style?: React.CSSProperties }) {
  return <i className={`bi bi-${n} ${className}`} aria-hidden="true" style={{ fontSize: size, color, lineHeight: 1, display: "inline-block", ...style }} />;
}

export function BiTile({ n, accent = "#272B7C", size = 44, solid = false }: { n: string; accent?: string; size?: number; solid?: boolean }) {
  return (
    <span className="inline-flex items-center justify-center shrink-0"
      style={{ width: size, height: size, borderRadius: Math.round(size * 0.28), background: solid ? accent : `${accent}14` }}>
      <Bi n={n} size={Math.round(size * 0.5)} color={solid ? "#fff" : accent} />
    </span>
  );
}

// ─── Primitives ───────────────────────────────────────────────────────────────

// Ficha de ícono que se rellena al pasar el mouse sobre el enlace (group).
export function MenuIcon({ n, size = 38 }: { n: string; size?: number }) {
  return (
    <span className="grid place-items-center shrink-0 rounded-lg transition-colors bg-[#F2F3FA] text-[#272B7C] group-hover:bg-[#272B7C] group-hover:text-[#FFDE59]" style={{ width: size, height: size }}>
      <i className={`bi bi-${n}`} aria-hidden="true" style={{ fontSize: Math.round(size * 0.45), lineHeight: 1 }} />
    </span>
  );
}
