import avatarImg from "@/assets/images/joel.png";
import logoImg from "@/assets/images/logo.png";

// Recorte de solo la cara/busto del avatar de cuerpo completo (iconojoel.png,
// 1012×1555px) para el widget de chat — mostrar el cuerpo entero encogido a
// 36-40px se veía como una figurita diminuta y rara. El recorte usa % fijos
// calibrados sobre la región cara+hombros (x:150-780, y:0-630 del original)
// para que funcione a cualquier tamaño de contenedor cuadrado.
export function ChatAvatarFace({ size, ring, round = false }: { size: number; ring?: "light" | "navy"; round?: boolean }) {
  // Squircle (esquinas suaves) en vez de círculo perfecto + sombra propia
  // para dar algo de relieve — marco más "moderno" que el círculo plano
  // original, sin cambiar el personaje.
  return (
    <div style={{
      width: size, height: size, borderRadius: round ? "50%" : Math.round(size * 0.3), overflow: "hidden",
      position: "relative", flexShrink: 0,
      background: round ? "#FFDE59" : "#EEF0FB",
      boxShadow: [
        ring === "light" ? "0 0 0 2px rgba(255,255,255,0.85)" : ring === "navy" ? "0 0 0 2px rgba(39,43,124,0.15)" : "",
        "0 4px 10px -3px rgba(10,13,61,0.35)",
      ].filter(Boolean).join(", "),
    }}>
      <img src={avatarImg} alt="" draggable={false}
        style={{ position: "absolute", left: "-23.8%", top: "0%", width: "160.6%", maxWidth: "none", height: "auto" }} />
    </div>
  );
}

// ─── Videos de fondo del hero ───────────────────────────────────────────────
// Los 2 videos (public/videos, comprimidos a 960×540) rotan en bucle con un
// fundido; solo se precargan el actual y el siguiente. Encima, un velo navy
// suave para que el texto blanco se lea. Cubre toda la sección, así que
// también se ve alrededor de la carpeta azul de abajo. En pantallas
// pequeñas o con "reducir movimiento" queda solo el fondo navy.

export function Logo({ size = "md" }: { size?: "xs" | "sm" | "md" | "lg" }) {
  // El logo nuevo trae más detalle tipográfico apilado que el wordmark anterior,
  // así que necesita algo más de alto para seguir siendo legible.
  // "xs" es para contextos muy compactos (la insignia del navbar tipo pill).
  const heights = { xs: 26, sm: 64, md: 76, lg: 92 };
  const h = heights[size];
  return (
    <img
      src={logoImg}
      alt="Transarchivos Ltda."
      draggable={false}
      className="select-none"
      style={{ height: h, width: "auto", objectFit: "contain" }}
    />
  );
}

// Logo del navbar: siempre la versión navy — el navbar (pill flotante y barra
// al hacer scroll) es blanco en ambos estados, así que ya no hace falta el
// crossfade a la versión blanca que se usaba sobre la barra oscura anterior.
// Sobre el hero oscuro el logo va en blanco; al hacer scroll (header blanco)
// vuelve a su color original.
export function HeaderLogo({ scrolled, size = 64 }: { scrolled: boolean; size?: number }) {
  return (
    <img src={logoImg} alt="Transarchivos Ltda." draggable={false}
      className="select-none"
      style={{ height: size, width: "auto", objectFit: "contain", filter: scrolled ? "none" : "brightness(0) invert(1)", transition: "filter 0.3s ease, height 0.3s ease" }} />
  );
}

// ─── Service data ─────────────────────────────────────────────────────────────

// Silueta de Joel (su figura como máscara sobre un plano azul marino muy
// tenue): marca la presencia del asesor sin repetir la ilustración a color.
export function JoelSilhouette({ style }: { style: React.CSSProperties }) {
  return (
    <div className="absolute hidden lg:block" style={{
      aspectRatio: "1012 / 1555", background: "#272B7C", opacity: 0.07,
      maskImage: `url(${avatarImg})`, WebkitMaskImage: `url(${avatarImg})`,
      maskSize: "contain", WebkitMaskSize: "contain", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat",
      maskPosition: "bottom", WebkitMaskPosition: "bottom", ...style,
    }} />
  );
}
