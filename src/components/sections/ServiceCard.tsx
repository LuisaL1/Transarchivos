import { useState } from "react";
import { Link } from "react-router-dom";
import { Bi } from "@/components/ui/Icons";
import { services } from "@/data/services";

export function ServiceCard({ service }: { service: typeof services[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={`/servicios/${service.slug}`}
      className="flex flex-col gap-4 p-6 rounded-2xl cursor-pointer"
      style={{
        textDecoration: "none",
        background: "#ffffff",
        border: `1.5px solid ${hovered ? service.accent : "#E9E9E7"}`,
        boxShadow: hovered ? `0 20px 40px -12px ${service.accent}33` : "0 2px 10px rgba(39,43,124,0.05)",
        transform: hovered ? "translateY(-4px)" : "none",
        transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-start justify-between">
        {/* Icon badge */}
        <div
          style={{
            width: 56, height: 56, borderRadius: 16, flexShrink: 0,
            background: hovered ? service.accent : `${service.accent}14`,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.25s",
          }}
        >
          <Bi n={service.icon} size={26} color={hovered ? "#fff" : service.accent} style={{ transition: "color 0.2s" }} />
        </div>
        {/* Tag pill */}
        <span
          style={{
            fontSize: 10, fontFamily: "Montserrat, sans-serif", fontWeight: 600,
            color: service.accent, background: `${service.accent}14`,
            borderRadius: 99, padding: "3px 9px", whiteSpace: "nowrap",
          }}
        >
          {service.tag}
        </span>
      </div>

      <div>
        <p className="font-bold text-base mb-1.5" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>
          {service.title}
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "#6B6B6B" }}>
          {service.desc}
        </p>
      </div>

      <p className="text-xs font-semibold mt-auto pt-1 flex items-center gap-1" style={{ color: service.accent, fontFamily: "Montserrat, sans-serif" }}>
        Más información
        <span style={{ transition: "transform 0.2s", transform: hovered ? "translateX(3px)" : "none" }}>→</span>
      </p>
    </Link>
  );
}

// ─── Solicitud de cotización guiada ─────────────────────────────────────────
// Basada en "LÓGICA DE COTIZACIÓN TRANSARCHIVOS": la cotización no se calcula
// con una tabla de precios (todavía no existen tarifas ni fórmulas), sino que
// captura las variables que Comercial necesita por tipo de servicio, ubica la
// solicitud en el modelo (Entrada → Solución → Protección → Expansión), sugiere
// servicios complementarios y decide el siguiente paso (completar información,
// validación de Operaciones o cotización estándar).
