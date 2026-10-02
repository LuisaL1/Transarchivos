import { useState, useEffect, useLayoutEffect, useRef, useMemo } from "react";
import { Routes, Route, Link, useParams, useLocation } from "react-router-dom";
import avatarImg from "@/imports/iconojoel.png";
import imagenBlog1Img from "@/imports/imagenblog1.png";
import imagenBlog2Img from "@/imports/imagenblog2.png";
import imagenBlog3Img from "@/imports/imagenblog3.png";
import graficoCotizadorImg from "@/imports/graficocotizador-transparente.png";
import graficoCotizador2Img from "@/imports/graficocotizador2.png";
import lapizImg from "@/imports/lapiz-transparente.png";
import escudoImg from "@/imports/escudo-transparente.png";
import personajeCardImg from "@/imports/personaje-card2.png";
import personajeCard2Img from "@/imports/personaje-card3.png";
import logoImg from "@/imports/logo.png";
import { blogPosts, readMinutes, type Item } from "@/blogData";
import monoClasificacion from "@/imports/mono/clasificacion.png";
import monoArchivoLupa from "@/imports/mono/archivolupa.png";
import egProducto1Img from "@/imports/eg-producto-1.png";
import egProducto2Img from "@/imports/eg-producto-2.png";
import elementogSocio1Img from "@/imports/elementogsocio1.png";
import elementogSocio2Img from "@/imports/elementogsocio2.png";
import diagnosticoLupaImg from "@/imports/diagnostico-lupa.png";
import monoDigitalizacion from "@/imports/mono/digitalizacion.png";
import monoCarpeta from "@/imports/mono/carpeta.png";
import monoCandado from "@/imports/mono/candado.png";
import monoEscudo from "@/imports/mono/escudo.png";
import monoDestruccion from "@/imports/mono/destruccion.png";
import monoRayo from "@/imports/mono/rayo.png";
import monoInhouse from "@/imports/mono/inhouse.png";
import monoVolumen from "@/imports/mono/volumen.png";
import monoEspacio from "@/imports/mono/espacio.png";
import monoInventario from "@/imports/mono/inventario.png";
import monoDisposicionFinal from "@/imports/mono/disposicionfinal.png";
import bancaIcon from "@/imports/banca.png";
import saludIcon from "@/imports/salud.png";
import industriaIcon from "@/imports/industria.png";
import iconoClasificacion from "@/imports/clasificacion.png";
import iconoCandado from "@/imports/candado.png";
import iconoDestruccion from "@/imports/destruccion.png";
import iconoDigitalizacion from "@/imports/digitalizacion.png";
import iconoEscudo from "@/imports/escudo.png";
import iconoCarpeta from "@/imports/carpeta.png";
import iconoMicrofilmacion from "@/imports/microfilmacion.png";
import iconoInhouse from "@/imports/inhouse.png";
import iconoRayo from "@/imports/rayo.png";
import iconoQuienesSomos from "@/imports/quienessomos.png";
import iconoHistoria from "@/imports/historia.png";
import iconoEquipo from "@/imports/equipo.png";
import iconoCultura from "@/imports/cultura.png";
import iconoClientes from "@/imports/clientes.png";
import iconoMisionVision from "@/imports/misionyvision.png";
import iconoAliados from "@/imports/aliados.png";
import iconoCertificados from "@/imports/certificados.png";
import iconoLupa from "@/imports/iconoarchivolupa.png";
import iconoProteccion from "@/imports/proteccion.png";
import iconoLegal from "@/imports/legal-document_2912872.png";
import gifBuscar from "@/imports/buscar.gif";
import gifJuicio from "@/imports/juicio.gif";
import gifCandado from "@/imports/candado-abierto.gif";
import staticBuscar from "@/imports/image-9.png";
import staticCandado from "@/imports/image-10.png";
import staticJuicio from "@/imports/image-11.png";
import colombiaDeptImg from "@/imports/colombia-departamentos.svg";


// ─── Cycling word (Notion-style) ─────────────────────────────────────────────

const cyclingWords = [
  { word: "control",    bg: "#EEF0FB", dot: "#272B7C", text: "#272B7C" },
  { word: "custodia",   bg: "#272B7C", dot: "#FFDE59", text: "#ffffff" },
  { word: "orden",      bg: "#EEF0FB", dot: "#1800AD", text: "#1800AD" },
  { word: "legalidad",  bg: "#1800AD", dot: "#FFDE59", text: "#ffffff" },
  { word: "resguardo",  bg: "#FFDE59", dot: "#272B7C", text: "#272B7C" },
  { word: "protección", bg: "#EEF0FB", dot: "#272B7C", text: "#272B7C" },
];

function CyclingWord() {
  const [index, setIndex] = useState(0);
  const [animState, setAnimState] = useState<"idle" | "out" | "in">("idle");
  const [displayed, setDisplayed] = useState(0);
  const ghostRef = useRef<HTMLSpanElement>(null);
  const [slotWidth, setSlotWidth] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimState("out");
      setTimeout(() => {
        setIndex(i => {
          const next = (i + 1) % cyclingWords.length;
          setDisplayed(next);
          return next;
        });
        setAnimState("in");
        setTimeout(() => setAnimState("idle"), 350);
      }, 300);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  // CSS no puede animar "width: auto" (el ancho intrínseco del texto) — por eso
  // el cuadro saltaba de golpe al cambiar a una palabra más corta/larga. Acá
  // medimos el ancho real del ghost en píxeles cada vez que cambia (palabra nueva
  // o breakpoint que cambia el tamaño de letra) y se lo damos como número exacto
  // al contenedor, que sí puede transicionar entre dos valores concretos.
  useLayoutEffect(() => {
    const el = ghostRef.current;
    if (!el) return;
    const measure = () => setSlotWidth(el.getBoundingClientRect().width);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const current = cyclingWords[displayed];

  // Mismo tamaño y line-height que el resto del título ("Sus archivos,").
  const wordTextStyle: React.CSSProperties = {
    fontFamily: "Poppins, sans-serif",
    fontWeight: 700,
    lineHeight: 1.1,
    whiteSpace: "nowrap",
  };

  return (
    <span
      className="inline-flex items-center rounded-xl md:rounded-2xl align-middle px-3 py-0.5 md:px-4 md:py-1"
      style={{
        background: current.bg,
        transition: "background 0.5s ease",
        verticalAlign: "middle",
      }}
    >
      {/* Slot de ancho variable: el ghost mide la palabra ACTUAL, así la píldora se
          ajusta exacto a cada palabra (sin sobrar espacio en las cortas). El ancho
          en px medido (slotWidth) es lo que realmente transiciona suave entre una
          palabra y otra, en vez de saltar de golpe (ver useLayoutEffect arriba).
          El alto lo define el propio texto (misma clase y line-height que el h1).
          padding-bottom: a diferencia del h1, esta caja recorta (overflow:hidden,
          necesario para la animación de deslizamiento) y con el line-height del h1
          la "g" de "legalidad"/"resguardo" quedaba recortada abajo — el line-height
          del h1 nunca recorta nada ahí porque no tiene máscara. Este aire extra solo
          abajo (no arriba, para no desalinear con "bajo") le da lugar al descendente
          sin tocar el tamaño de letra. */}
      <span
        className="text-5xl md:text-6xl"
        style={{
          display: "inline-block",
          position: "relative",
          overflow: "hidden",
          paddingBottom: "0.22em",
          width: slotWidth ?? "auto",
          transition: "width 0.32s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Ghost — invisible, reserva y mide el ancho de la palabra actual */}
        {/* inline-block (no "block"): así siempre se encoge a su propio texto, aunque
            el padre ya tenga un ancho explícito en px — si fuera "block" se estiraría
            al 100% del padre y el ResizeObserver dejaría de detectar cambios reales. */}
        <span ref={ghostRef} style={{ ...wordTextStyle, display: "inline-block", opacity: 0, userSelect: "none", pointerEvents: "none" }}>
          {current.word}
        </span>
        {/* Animated word */}
        <span
          key={displayed}
          className="text-5xl md:text-6xl"
          style={{
            ...wordTextStyle,
            color: current.text,
            position: "absolute",
            top: 0,
            left: 0,
            transition: "color 0.3s ease",
            animation: animState === "out"
              ? "wordOut 0.28s cubic-bezier(0.4,0,0.6,1) forwards"
              : animState === "in"
              ? "wordIn 0.32s cubic-bezier(0.0,0,0.2,1) forwards"
              : "none",
          }}
        >
          {current.word}
        </span>
      </span>
    </span>
  );
}

// ─── World coverage map (network of hotspots on a real world map) ──────────

type ColombiaHotspot = { id: string; title: string; sub: string; desc: string; left: number; top: number; hq?: boolean };

// Datos reales confirmados por el cliente (no simulados): sede y bodegas de
// custodia en Bogotá; recolección con logística propia en Barranquilla, Cali
// y Medellín. Fuera de estas 4 ciudades también recogen en el resto del país
// (salvo zonas de alto riesgo), pero solo se marcan las 4 confirmadas.
const COLOMBIA_HOTSPOTS: ColombiaHotspot[] = [
  { id: "bog", title: "Bogotá",       sub: "Sede principal · Bodegas de custodia", desc: "Centro de operaciones: aquí están nuestras bodegas certificadas y todo el equipo administrativo.", left: 48.6, top: 49.5, hq: true },
  { id: "med", title: "Medellín",     sub: "Cobertura de recolección",             desc: "Recolección y logística propia de archivos físicos en Medellín y su área metropolitana.", left: 38.6, top: 41.1 },
  { id: "cal", title: "Cali",         sub: "Cobertura de recolección",             desc: "Recolección y logística propia de archivos físicos en Cali y el suroccidente del país.", left: 32.8, top: 56.8 },
  { id: "baq", title: "Barranquilla", sub: "Cobertura de recolección",             desc: "Recolección y logística propia de archivos físicos en Barranquilla y la costa Caribe.", left: 52.5, top: 20.5 },
];

// Mapa real de Colombia CON fronteras de departamentos (basado en un mapa
// administrativo público), recoloreado al mismo estilo sutil navy/blanco.
// Países vecinos, océano y la leyenda del archivo original quedaron ocultos
// al procesar el SVG — solo se ve Colombia y sus divisiones internas.
// El viewBox del propio archivo ya está recortado ("zoom") sobre la región
// donde están las 4 ciudades (centro-occidente + costa Caribe), conservando
// el contorno completo (Guajira, costa Caribe y Pacífica) para que siga
// leyéndose claramente como Colombia — no un recorte tan cerrado que pierda
// la silueta. El mapa ahora vive en su propia columna junto al avatar (no
// centrado detrás de él), así que puede ser mucho más grande.
const COLOMBIA_BOX_STYLE: React.CSSProperties = {
  top: "50%", right: -170, transform: "translateY(-50%)",
  height: "min(96vw, 1000px)", aspectRatio: "1006 / 1370",
};

function ColombiaMap() {
  return (
    <>
      {/* Capa 1: el mapa, detrás de los pines (pero ambos delante del avatar) */}
      <div className="absolute" style={{ ...COLOMBIA_BOX_STYLE, zIndex: 1, pointerEvents: "none" }}>
        <img
          src={colombiaDeptImg}
          alt="Mapa de cobertura de Transarchivos en Colombia"
          draggable={false}
          className="w-full h-full select-none"
          style={{ objectFit: "contain", filter: "drop-shadow(0 12px 28px rgba(0,0,0,0.35))" }}
        />
      </div>

      {/* Capa 2: los pines, siempre por encima del avatar (mismo sistema de coordenadas que la capa 1) */}
      <div className="absolute" style={{ ...COLOMBIA_BOX_STYLE, zIndex: 30, pointerEvents: "none" }}>
        {COLOMBIA_HOTSPOTS.map(h => <ColombiaPin key={h.id} {...h} />)}
      </div>
    </>
  );
}

function ColombiaPin({ title, sub, desc, left, top, hq }: ColombiaHotspot) {
  const [hovered, setHovered] = useState(false);
  const isTop = top < 50;
  const isLeftHalf = left < 50;

  return (
    <div
      className="absolute"
      style={{ left: `${left}%`, top: `${top}%`, transform: "translate(-50%, -50%)", zIndex: hovered ? 2 : 1, pointerEvents: "auto" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ position: "relative", width: hq ? 16 : 12, height: hq ? 16 : 12, cursor: "pointer" }}>
        <span style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: "#FFDE59", opacity: 0.85,
          animation: `mapPing ${hq ? 1.4 : 1.7}s cubic-bezier(0,0,0.2,1) infinite`,
        }} />
        <span style={{
          position: "absolute", inset: hq ? -2 : -1, borderRadius: "50%",
          background: hq ? "#FFDE59" : "#ffffff",
          border: `2px solid ${hq ? "#ffffff" : "#FFDE59"}`,
          boxShadow: hovered
            ? "0 0 0 6px rgba(255,222,89,0.35), 0 0 14px 4px rgba(255,222,89,0.85)"
            : "0 0 10px 3px rgba(255,222,89,0.75), 0 2px 6px rgba(0,0,0,0.4)",
          transform: hovered ? "scale(1.3)" : "scale(1)",
          transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease",
        }} />
      </div>

      <div style={{
        position: "absolute",
        ...(isTop ? { top: "calc(100% + 10px)" } : { bottom: "calc(100% + 10px)" }),
        ...(isLeftHalf ? { left: 0 } : { right: 0 }),
        width: 200,
        opacity: hovered ? 1 : 0,
        pointerEvents: hovered ? "auto" : "none",
        transition: "opacity 0.2s ease",
      }}>
        <div className="rounded-xl p-3 shadow-2xl" style={{ background: "#ffffff", border: "1px solid #E9E9E7" }}>
          <div className="flex items-center gap-1.5 mb-1">
            <p className="font-bold text-sm" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif" }}>{title}</p>
            {hq && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "#FFDE5933", color: "#8a6d00" }}>HQ</span>}
          </div>
          <p className="text-[11px] font-semibold mb-1" style={{ color: "#9B9B9B" }}>{sub}</p>
          <p className="text-xs leading-relaxed" style={{ color: "#6B7280" }}>{desc}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Animated avatar ─────────────────────────────────────────────────────────

// Antes seguía el cursor con un tilt 3D (rotateX/rotateY vía requestAnimationFrame)
// — se quitó ese movimiento a pedido; solo queda la flotación suave por CSS
// (animation: avatarFloat en el div exterior).
function AnimatedAvatar({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative z-10 flex flex-col items-center" style={{ animation: "avatarFloat 4s ease-in-out infinite" }}>
      <div>
        <img
          src={src}
          alt={alt}
          draggable={false}
          className="select-none relative z-10"
          style={{
            height: "min(32vw, 460px)",
            width: "auto",
            objectFit: "contain",
            objectPosition: "bottom",
            filter: "drop-shadow(0 32px 48px rgba(39,43,124,0.22)) drop-shadow(0 8px 16px rgba(39,43,124,0.12))",
          }}
        />
      </div>
      {/* Ground shadow */}
      <div
        style={{
          width: 180,
          height: 24,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(39,43,124,0.22) 0%, transparent 70%)",
          marginTop: -16,
        }}
      />
    </div>
  );
}

// Recorte de solo la cara/busto del avatar de cuerpo completo (iconojoel.png,
// 1012×1555px) para el widget de chat — mostrar el cuerpo entero encogido a
// 36-40px se veía como una figurita diminuta y rara. El recorte usa % fijos
// calibrados sobre la región cara+hombros (x:150-780, y:0-630 del original)
// para que funcione a cualquier tamaño de contenedor cuadrado.
function ChatAvatarFace({ size, ring }: { size: number; ring?: "light" | "navy" }) {
  // Squircle (esquinas suaves) en vez de círculo perfecto + sombra propia
  // para dar algo de relieve — marco más "moderno" que el círculo plano
  // original, sin cambiar el personaje.
  return (
    <div style={{
      width: size, height: size, borderRadius: Math.round(size * 0.3), overflow: "hidden",
      position: "relative", flexShrink: 0,
      background: "#EEF0FB",
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

// ─── Bootstrap Icons ────────────────────────────────────────────────────────
// Se usa solo la fuente de íconos (bootstrap-icons). Van dentro de "fichas"
// con el mismo lenguaje visual que los íconos de servicios: cuadrado
// redondeado, fondo tenue del color de acento y trazo grueso (variantes -fill).

function Bi({ n, size = 16, color, className = "", style }: { n: string; size?: number; color?: string; className?: string; style?: React.CSSProperties }) {
  return <i className={`bi bi-${n} ${className}`} aria-hidden="true" style={{ fontSize: size, color, lineHeight: 1, display: "inline-block", ...style }} />;
}

function BiTile({ n, accent = "#272B7C", size = 44, solid = false }: { n: string; accent?: string; size?: number; solid?: boolean }) {
  return (
    <span className="inline-flex items-center justify-center shrink-0"
      style={{ width: size, height: size, borderRadius: Math.round(size * 0.28), background: solid ? accent : `${accent}14` }}>
      <Bi n={n} size={Math.round(size * 0.5)} color={solid ? "#fff" : accent} />
    </span>
  );
}

// ─── Parallax card ────────────────────────────────────────────────────────────

function ParallaxCard({ children, depth = 1, className = "", style = {} }: {
  children: React.ReactNode;
  depth?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const section = ref.current?.closest("section");
    const onMove = (e: MouseEvent) => {
      const rect = section?.getBoundingClientRect();
      if (!rect) return;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      targetRef.current = {
        x: ((e.clientX - cx) / rect.width) * 18 * depth,
        y: ((e.clientY - cy) / rect.height) * 12 * depth,
      };
    };
    const onLeave = () => { targetRef.current = { x: 0, y: 0 }; };
    section?.addEventListener("mousemove", onMove);
    section?.addEventListener("mouseleave", onLeave);

    const tick = () => {
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.07;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.07;
      if (ref.current) {
        ref.current.style.transform = `translate(${currentRef.current.x.toFixed(2)}px, ${currentRef.current.y.toFixed(2)}px)`;
      }
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => {
      section?.removeEventListener("mousemove", onMove);
      section?.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(frameRef.current);
    };
  }, [depth]);

  return (
    <div ref={ref} className={`absolute z-20 ${className}`} style={{ willChange: "transform", ...style }}>
      {children}
    </div>
  );
}

// ─── Primitives ───────────────────────────────────────────────────────────────

function Tag({ children, color = "default" }: { children: React.ReactNode; color?: "navy" | "yellow" | "green" | "gray" | "default" }) {
  const styles: Record<string, { bg: string; text: string }> = {
    navy:    { bg: "#EEF0FB", text: "#272B7C" },
    yellow:  { bg: "#FFF8D6", text: "#7A5C00" },
    green:   { bg: "#E6F4EA", text: "#1D6B35" },
    gray:    { bg: "#F1F1EF", text: "#6B6B6B" },
    default: { bg: "#F1F1EF", text: "#6B6B6B" },
  };
  const s = styles[color];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
      style={{ background: s.bg, color: s.text, fontFamily: "Montserrat, sans-serif" }}
    >
      {children}
    </span>
  );
}

function Divider() {
  return <div className="border-b" style={{ borderColor: "#E9E9E7" }} />;
}

// ─── Nav Dropdown ─────────────────────────────────────────────────────────────

// Los 9 servicios reales publicados hoy en transarchivos.com (no la lista
// genérica de 5 anterior). Cada uno abre su propia página en /servicios/:slug.
// "keywords": 2 términos de búsqueda reales (del listado de palabras clave por
// servicio) para que alguien que no conoce el nombre formal del servicio pero
// sí un término técnico (OCR, TRD, backup...) lo reconozca igual.
const serviceItems: { icon: string; title: string; slug: string; desc: string; keywords: string[] }[] = [
  { icon: iconoClasificacion, title: "Levantamiento de Inventario", slug: "levantamiento-de-inventario", desc: "Diagnóstico y organización según norma AGN", keywords: ["Inventario documental", "Diagnóstico"] },
  { icon: iconoCarpeta, title: "Programa de Gestión Documental", slug: "programa-de-gestion-documental", desc: "PGD · Cumplimiento Ley 594", keywords: ["TRD", "Tablas de retención"] },
  { icon: iconoEscudo, title: "Custodia de Medios Magnéticos", slug: "custodia-de-medios-magneticos", desc: "Cintas, discos y medios con control ambiental", keywords: ["Copia air gap", "Cintas LTO"] },
  { icon: iconoCandado, title: "Custodia de Archivos", slug: "custodia-de-archivos", desc: "Centro documental con vigilancia 24 h", keywords: ["Centro documental", "Consulta y recuperación"] },
  { icon: iconoDigitalizacion, title: "Digitalización de Documentos", slug: "digitalizacion-de-documentos", desc: "Escaneo, OCR e indexación", keywords: ["OCR", "DMS / ECM"] },
  { icon: iconoDestruccion, title: "Destrucción de Documentos", slug: "destruccion-de-documentos", desc: "Destrucción con certificado y trazabilidad", keywords: ["Trituración industrial", "Certificado de destrucción"] },
  { icon: iconoMicrofilmacion, title: "Microfilmación de Archivos", slug: "microfilmacion-de-archivos", desc: "Preservación a más de 100 años", keywords: ["Microfilm", "Historias clínicas"] },
  { icon: iconoInhouse, title: "Servicio Inhouse", slug: "servicio-inhouse", desc: "Personal de archivo en su sede", keywords: ["Outsourcing documental", "Personal en sitio"] },
  { icon: iconoRayo, title: "Servicio Inmediato", slug: "servicio-inmediato", desc: "Entrega urgente con trazabilidad", keywords: ["Entrega urgente", "Despacho express"] },
];

// Solo el botón disparador. El contenido del menú ya no es un panel aparte
// posicionado en "absolute" — vive dentro del propio pill (ver App), como una
// segunda fila que aparece cuando "open" es true. Así el pill literalmente
// crece para contenerlo: una sola figura, sin costuras ni huecos que tapar.
function NavDropdownTrigger({ label, open, setOpen }: { label: string; open: boolean; setOpen: (v: boolean | ((prev: boolean) => boolean)) => void }) {
  return (
    <button
      // Solo abre (no alterna): con mouse, el hover ya lo abre antes de que el
      // click llegue a disparar — si el click alternara, cerraría lo que el
      // hover acababa de abrir. En touch (sin hover previo) el click sí abre.
      // Para cerrar: mover el cursor fuera del pill, o clic afuera.
      onClick={() => setOpen(true)}
      onMouseEnter={() => setOpen(true)}
      className="flex items-center gap-1 px-3.5 py-2 rounded-full text-sm font-medium transition-colors"
      style={{
        color: open ? "#ffffff" : "#272B7C",
        background: open ? "#1800AD" : "transparent",
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      {label}
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
        style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>
        <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}

// Contenido del menú "Servicios", como segunda fila dentro del pill.
function ServicesPanelContent({ setOpen }: { setOpen: (v: boolean) => void }) {
  return (
    <div className="px-4 pb-4 pt-1">
      <div className="h-px mb-3" style={{ background: "rgba(39,43,124,0.10)" }} />
      <div className="flex items-center justify-between mb-3 px-1">
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(39,43,124,0.55)", fontFamily: "Montserrat, sans-serif" }}>Servicios</p>
        <a href="#servicios" onClick={() => setOpen(false)} className="text-xs font-semibold flex items-center gap-1 hover:opacity-70 transition-opacity" style={{ color: "#1800AD", fontFamily: "Montserrat, sans-serif" }}>
          Ver todos →
        </a>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {serviceItems.map(s => (
          <Link key={s.title} to={`/servicios/${s.slug}`} onClick={() => setOpen(false)}
            className="flex items-start gap-3 p-3 rounded-xl transition-colors hover:bg-[#272B7C]/[0.06] cursor-pointer"
            style={{ textDecoration: "none" }}>
            <img src={s.icon} alt="" className="w-11 h-11 mt-0.5 object-contain shrink-0" />
            <div>
              <p className="text-sm font-semibold" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif" }}>{s.title}</p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(39,43,124,0.55)" }}>{s.desc}</p>
              {/* Palabras clave de búsqueda: para quien no conoce el nombre formal
                  del servicio pero sí un término técnico (OCR, TRD, backup...). */}
              <div className="flex flex-wrap gap-1 mt-1.5">
                {s.keywords.map(k => (
                  <span key={k} className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                    style={{ background: "rgba(24,0,173,0.07)", color: "#1800AD" }}>
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
        {/* CTA card — invita a chatear con "Joel" (nombre humanizado de la IA
            de Transarchivos) en vez del genérico "diagnóstico gratuito". Solo el
            texto por ahora: la integración real del chat es un paso aparte. */}
        <a href="#cotizador" onClick={() => setOpen(false)}
          className="col-span-3 flex items-center justify-between p-3 rounded-xl mt-1 transition-colors hover:bg-[#272B7C]/[0.08]"
          style={{ background: "rgba(39,43,124,0.04)", border: "1px solid rgba(39,43,124,0.10)", textDecoration: "none" }}>
          <p className="text-sm font-semibold" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif" }}>
            ¿Necesita orientación? Hable con <span style={{ color: "#1800AD" }}>Joel</span>
          </p>
          <span className="text-sm font-bold shrink-0 ml-3" style={{ color: "#1800AD" }}>→</span>
        </a>
      </div>
    </div>
  );
}

// Las 3 columnas del dropdown "Nosotros". Cada ítem enlaza a su propia
// sección en /nosotros (antes todos apuntaban al mismo #nosotros de la
// landing). "Aliados tecnológicos" se presenta en la página como "Tecnología
// y seguridad": no hay nombres de aliados/socios tecnológicos reales en los
// documentos fuente, así que el contenido real que sí existe (infraestructura
// de seguridad, control ambiental, air gap, nube) se muestra bajo un rótulo
// honesto, aunque el ancla se conserva como "aliados" por compatibilidad.
const nosotrosGroups: { heading: string; items: { label: string; icon: string; anchor: string }[] }[] = [
  { heading: "La empresa", items: [
    { label: "Quiénes somos", icon: iconoQuienesSomos, anchor: "quienes-somos" },
    { label: "Nuestra historia", icon: iconoHistoria, anchor: "historia" },
    { label: "Misión y visión", icon: iconoMisionVision, anchor: "mision-vision" },
  ] },
  { heading: "Equipo y cultura", items: [
    { label: "Nuestro equipo", icon: iconoEquipo, anchor: "equipo" },
    { label: "Cultura organizacional", icon: iconoCultura, anchor: "cultura" },
  ] },
  { heading: "Resultados y alianzas", items: [
    { label: "Nuestros principales clientes", icon: iconoClientes, anchor: "clientes" },
    { label: "Aliados tecnológicos", icon: iconoAliados, anchor: "aliados" },
    { label: "Certificados", icon: iconoCertificados, anchor: "certificados" },
  ] },
];

// Contenido del menú "Nosotros", como segunda fila dentro del pill — mismo
// mecanismo que ServicesPanelContent (el pill se ensancha para contenerlo).
function NosotrosPanelContent({ setOpen }: { setOpen: (v: boolean) => void }) {
  return (
    <div className="px-4 pb-4 pt-1">
      <div className="h-px mb-3" style={{ background: "rgba(39,43,124,0.10)" }} />
      <div className="grid grid-cols-3 gap-4 px-1">
        {nosotrosGroups.map(g => (
          <div key={g.heading}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "rgba(39,43,124,0.5)", fontFamily: "Montserrat, sans-serif" }}>{g.heading}</p>
            <div className="flex flex-col gap-0.5">
              {g.items.map(item => (
                <Link key={item.label} to={`/nosotros#${item.anchor}`} onClick={() => setOpen(false)}
                  className="flex items-center gap-3 text-sm p-2 rounded-xl transition-colors hover:bg-[#272B7C]/[0.06] cursor-pointer"
                  style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
                  <img src={item.icon} alt="" className="w-11 h-11 object-contain shrink-0" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Contenido del menú "Blog" — mismo mecanismo que Servicios/Nosotros (el pill
// se ensancha para contenerlo). Muestra los 3 artículos más recientes y, como
// pidió el cliente, un acceso directo al canal de YouTube real de la empresa.
function BlogPanelContent({ setOpen }: { setOpen: (v: boolean) => void }) {
  const recent = blogPosts.slice(0, 3);
  return (
    <div className="px-4 pb-4 pt-1">
      <div className="h-px mb-3" style={{ background: "rgba(39,43,124,0.10)" }} />
      <div className="flex items-center justify-between mb-3 px-1">
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(39,43,124,0.55)", fontFamily: "Montserrat, sans-serif" }}>Artículos recientes</p>
        <a href="#blog" onClick={() => setOpen(false)} className="text-xs font-semibold flex items-center gap-1 hover:opacity-70 transition-opacity" style={{ color: "#1800AD", fontFamily: "Montserrat, sans-serif" }}>
          Ver todos →
        </a>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {recent.map(p => (
          <Link key={p.slug} to={`/blog/${p.slug}`} onClick={() => setOpen(false)}
            className="rounded-xl overflow-hidden transition-colors hover:bg-[#272B7C]/[0.06]" style={{ textDecoration: "none" }}>
            <img src={p.cover} alt="" className="w-full object-cover" style={{ height: 80 }} />
            <div className="p-2.5">
              <p className="text-xs font-semibold leading-snug" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.title}</p>
              <p className="text-[11px] mt-1" style={{ color: "rgba(39,43,124,0.5)" }}>{p.date}</p>
            </div>
          </Link>
        ))}
      </div>
      {/* Canal de YouTube real — acceso directo pedido por el cliente. */}
      <a href="https://www.youtube.com/@Transarchivosltda" target="_blank" rel="noreferrer" onClick={() => setOpen(false)}
        className="flex items-center justify-between p-3 rounded-xl mt-3 transition-colors hover:bg-[#272B7C]/[0.08]"
        style={{ background: "rgba(39,43,124,0.04)", border: "1px solid rgba(39,43,124,0.10)", textDecoration: "none" }}>
        <span className="flex items-center gap-2.5 text-sm font-semibold" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif" }}>
          <Bi n="youtube" size={18} color="#1800AD" />
          Véanos en nuestro canal de YouTube
        </span>
        <span className="text-sm font-bold shrink-0 ml-3" style={{ color: "#1800AD" }}>→</span>
      </a>
    </div>
  );
}

// ─── Logo ─────────────────────────────────────────────────────────────────────

function Logo({ size = "md" }: { size?: "xs" | "sm" | "md" | "lg" }) {
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
function HeaderLogo({ scrolled: _scrolled, size = 64 }: { scrolled: boolean; size?: number }) {
  return (
    <img src={logoImg} alt="Transarchivos Ltda." draggable={false}
      className="select-none"
      style={{ height: size, width: "auto", objectFit: "contain" }} />
  );
}

// ─── Service data ─────────────────────────────────────────────────────────────

// "slug" arma la URL propia de cada servicio (/servicios/<slug>) — coinciden
// con las rutas reales que ya usa transarchivos.com hoy (p.ej.
// transarchivos.com/levantamiento-de-inventario/), así que si el día de
// mañana el sitio pasa a este dominio, los enlaces externos siguen sirviendo.
const services = [
  {
    icon: iconoClasificacion, title: "Levantamiento de Inventario", slug: "levantamiento-de-inventario",
    tag: "Norma AGN · Ley 594", accent: "#272B7C",
    desc: "Identificación, registro y clasificación de los documentos de un archivo para conocer su volumen, estado y ubicación.",
  },
  {
    icon: iconoCarpeta, title: "Programa de Gestión Documental", slug: "programa-de-gestion-documental",
    tag: "PGD · Ley 594", accent: "#1800AD",
    desc: "Sistema para manejar los documentos durante todo su ciclo de vida: creación, uso, conservación y disposición final.",
  },
  {
    icon: iconoEscudo, title: "Custodia de Medios Magnéticos", slug: "custodia-de-medios-magneticos",
    tag: "Copia air gap · DRP", accent: "#272B7C",
    desc: "Almacenamiento especializado de cintas LTO/DAT/DLT, discos duros, CDs/DVDs y otros medios.",
  },
  {
    icon: iconoCandado, title: "Custodia de Archivos", slug: "custodia-de-archivos",
    tag: "CCTV · vigilancia 24 h", accent: "#1800AD",
    desc: "Resguardo y gestión de documentos físicos y digitales con seguridad, integridad y disponibilidad.",
  },
  {
    icon: iconoDigitalizacion, title: "Digitalización de Documentos", slug: "digitalizacion-de-documentos",
    tag: "Valor legal · OCR", accent: "#272B7C",
    desc: "Conversión de documentos físicos a archivos digitales con captura, indexación y OCR opcional.",
  },
  {
    icon: iconoDestruccion, title: "Destrucción de Documentos", slug: "destruccion-de-documentos",
    tag: "Certificado de destrucción", accent: "#C8960A",
    desc: "Destrucción segura y trazable, con acta de eliminación y certificado, alineada con la Ley 594 de 2000.",
  },
  {
    icon: iconoMicrofilmacion, title: "Microfilmación de Archivos", slug: "microfilmacion-de-archivos",
    tag: "Microfilme 16 / 35 mm", accent: "#272B7C",
    desc: "Conversión de documentos a microfilme para su preservación segura a largo plazo.",
  },
  {
    icon: iconoInhouse, title: "Servicio Inhouse", slug: "servicio-inhouse",
    tag: "En sus instalaciones", accent: "#1800AD",
    desc: "Personal técnico de archivo en su sede, capacitado y supervisado por Transarchivos.",
  },
  {
    icon: iconoRayo, title: "Servicio Inmediato", slug: "servicio-inmediato",
    tag: "Respuesta prioritaria", accent: "#C8960A",
    desc: "Consulta, recuperación y entrega urgente de documentos, con trazabilidad en cada etapa.",
  },
];

// ─── Búsqueda del header ────────────────────────────────────────────────────
// Índice combinado de servicios, artículos del blog y secciones de la propia
// landing, para que la lupa del navbar busque sobre contenido real del sitio
// en vez de ser un campo decorativo sin función.
type SearchResult = { kind: "Servicio" | "Artículo" | "Sección"; title: string; desc: string; to?: string; href?: string };

const searchIndex: SearchResult[] = [
  { kind: "Sección", title: "Diagnóstico documental", desc: "Empiece por saber qué está pasando con su archivo, antes de mover un solo papel", href: "#cotizador" },
  { kind: "Sección", title: "Cómo trabajamos", desc: "Nuestro modelo de 4 pasos: diagnóstico, solución, protección y expansión", href: "#modelo" },
  { kind: "Sección", title: "Blog", desc: "Artículos y guías sobre gestión documental, tecnología y sostenibilidad", href: "#blog" },
  { kind: "Sección", title: "Solicitar cotización", desc: "Elija su servicio y responda unas preguntas para armar su solicitud", href: "#cotizador" },
  ...services.map(s => ({ kind: "Servicio" as const, title: s.title, desc: s.desc, to: `/servicios/${s.slug}` })),
  ...blogPosts.map(p => ({ kind: "Artículo" as const, title: p.title, desc: p.excerpt, to: `/blog/${p.slug}` })),
];

// Sin tildes ni diéresis: quien escribe rápido en un buscador casi nunca
// tipea acentos ("digitalizacion" debe encontrar "Digitalización").
const foldAccents = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "");

function searchContent(query: string): SearchResult[] {
  const q = foldAccents(query.trim().toLowerCase());
  // Con 1 sola letra casi cualquier palabra matchea (demasiado ruido para ser
  // útil) — se pide un mínimo de 2 caracteres antes de mostrar resultados.
  if (q.length < 2) return [];
  return searchIndex.filter(r => foldAccents(r.title.toLowerCase()).includes(q) || foldAccents(r.desc.toLowerCase()).includes(q)).slice(0, 7);
}

const norms = [
  { code: "Ley 594 / 2000", name: "Ley General de Archivos (AGN)" },
  { code: "Decreto 1080 / 2015", name: "PGD y ciclo de vida del documento electrónico" },
  { code: "Res. 8934 / 2014", name: "Superintendencia de Industria y Comercio" },
  { code: "Decreto 962 · art. 28", name: "Ley Antitrámites" },
  { code: "Ley 1581 / 2012", name: "Protección de datos personales" },
  { code: "Ley 527 / 1999", name: "Comercio electrónico: validez legal de la digitalización" },
  { code: "Decreto 2527 / 1950", name: "Validez jurídica de la microfilmación" },
  { code: "Norma Icontec 2001", name: "Estantería de carga pesada del Centro Documental" },
];

// ─── Service Card (for Services section) ──────────────────────────────────────

function ServiceCard({ service }: { service: typeof services[0] }) {
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
          <img src={service.icon} alt="" className="select-none"
            style={{ width: 36, height: 36, objectFit: "contain", filter: hovered ? "brightness(0) invert(1)" : "none", transition: "filter 0.2s" }} />
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

type QField = { key: string; label: string; options: string[] };
type QConfig = { volumeLabel: string; volumePlaceholder: string; fields: QField[]; level?: string; next: string[] };

const QUOTE_URGENCY = ["Sin urgencia", "En las próximas semanas", "Urgente"];
const QUOTE_SECTORS = [
  "Salud", "Aseguradoras", "Petróleo", "Ingeniería e infraestructura", "Construcción",
  "Líneas aéreas", "Laboratorios", "Financiero", "Minería", "Compañía en liquidación o reestructuración", "Otro",
];

const quoteConfig: Record<string, QConfig> = {
  diagnostico: {
    volumeLabel: "Volumen aproximado del archivo", volumePlaceholder: "Ej.: 800 cajas, o “no lo sé”",
    level: "Nivel 1 · Entrada", next: ["levantamiento-de-inventario", "digitalizacion-de-documentos", "custodia-de-archivos", "destruccion-de-documentos"],
    fields: [
      { key: "situacion", label: "Situación actual del archivo", options: ["No tenemos programa de gestión documental", "Tenemos uno desactualizado", "Necesitamos implementarlo", "No estoy seguro"] },
      { key: "areas", label: "Áreas involucradas", options: ["1 a 3", "4 a 10", "Más de 10", "No lo sé"] },
      { key: "entregable", label: "Qué espera recibir", options: ["Diagnóstico con hallazgos", "Plan de acción", "Propuesta de solución", "No lo sé"] },
    ],
  },
  "levantamiento-de-inventario": {
    volumeLabel: "Volumen documental", volumePlaceholder: "Ej.: 1.200 cajas o 300 metros lineales",
    level: "Nivel 1 · Entrada", next: ["custodia-de-archivos", "digitalizacion-de-documentos", "destruccion-de-documentos"],
    fields: [
      { key: "detalle", label: "Nivel de detalle requerido", options: ["Por caja", "Por carpeta o expediente", "Por documento", "No lo sé"] },
      { key: "areas", label: "Cantidad de áreas", options: ["1", "2 a 5", "Más de 5", "No lo sé"] },
      { key: "estado", label: "Estado de la documentación", options: ["Organizada", "Desorganizada", "Con deterioro", "No lo sé"] },
    ],
  },
  "programa-de-gestion-documental": {
    volumeLabel: "Áreas o dependencias a cubrir", volumePlaceholder: "Ej.: 6 dependencias",
    level: "Nivel 2 · Solución", next: ["levantamiento-de-inventario", "digitalizacion-de-documentos", "custodia-de-archivos"],
    fields: [
      { key: "situacion", label: "Situación actual", options: ["No tenemos PGD", "Tenemos uno desactualizado", "Debemos implementarlo", "No estoy seguro"] },
      { key: "alcance", label: "Alcance esperado", options: ["Diagnóstico", "Diseño del PGD", "Diseño e implementación", "No lo sé"] },
      { key: "acompanamiento", label: "Nivel de acompañamiento", options: ["Puntual", "Continuo durante la implementación", "No lo sé"] },
    ],
  },
  "custodia-de-medios-magneticos": {
    volumeLabel: "Cantidad de medios", volumePlaceholder: "Ej.: 200 cintas",
    level: "Nivel 3 · Protección", next: ["digitalizacion-de-documentos", "destruccion-de-documentos"],
    fields: [
      { key: "soporte", label: "Tipo de soporte", options: ["Cintas LTO / DAT / DLT", "Discos duros externos", "CDs / DVDs", "Otros o mezcla"] },
      { key: "rotacion", label: "Rotación de medios", options: ["Diaria", "Semanal", "Mensual", "Sin rotación", "No lo sé"] },
      { key: "recoleccion", label: "Recolección y entrega", options: ["Recolección por Transarchivos", "Entrega por el cliente", "Por definir"] },
    ],
  },
  "custodia-de-archivos": {
    volumeLabel: "Volumen documental", volumePlaceholder: "Ej.: 2.000 cajas",
    level: "Nivel 3 · Protección", next: ["digitalizacion-de-documentos", "destruccion-de-documentos"],
    fields: [
      { key: "unidad", label: "Unidad con la que mide su volumen", options: ["Cajas", "Metros lineales", "Carpetas o expedientes", "No lo sé"] },
      { key: "permanencia", label: "Permanencia estimada", options: ["Menos de 1 año", "1 a 3 años", "Más de 3 años", "No lo sé"] },
      { key: "consultas", label: "Consultas esperadas", options: ["Pocas", "Frecuentes", "No lo sé"] },
      { key: "recoleccion", label: "Recolección", options: ["Recolección por Transarchivos", "Entrega por el cliente", "Por definir"] },
    ],
  },
  "digitalizacion-de-documentos": {
    volumeLabel: "Volumen a digitalizar", volumePlaceholder: "Ej.: 150.000 páginas o 400 cajas",
    level: "Nivel 2 · Solución", next: ["custodia-de-archivos", "destruccion-de-documentos"],
    fields: [
      { key: "tipo", label: "Tipo de documentos", options: ["Contratos y comerciales", "Historias laborales", "Historias clínicas", "Contables o legales", "Otros"] },
      { key: "estado", label: "Estado del documento", options: ["Bueno", "Con grapas o clips", "Deteriorado", "No lo sé"] },
      { key: "modalidad", label: "Modalidad", options: ["En el centro de Transarchivos", "In-house, en sus instalaciones", "No lo sé"] },
      { key: "entrega", label: "Formato y entrega", options: ["PDF con OCR", "PDF / TIFF / JPG", "Integración con su DMS", "No lo sé"] },
      { key: "fisico", label: "Destino del archivo físico", options: ["Custodia", "Destrucción certificada", "Devolución", "No lo sé"] },
    ],
  },
  "destruccion-de-documentos": {
    volumeLabel: "Volumen a destruir", volumePlaceholder: "Ej.: 5 toneladas o 800 cajas",
    level: "Nivel 4 · Expansión", next: ["custodia-de-archivos", "digitalizacion-de-documentos"],
    fields: [
      { key: "material", label: "Tipo de material", options: ["Papel confidencial", "Medios magnéticos", "Mixto"] },
      { key: "trd", label: "¿Cuenta con TRD o acta de eliminación aprobada?", options: ["Sí", "No", "En proceso", "No lo sé"] },
      { key: "inventario", label: "¿Tiene inventario de lo que se destruirá?", options: ["Sí", "No", "Parcial"] },
      { key: "recoleccion", label: "Recolección", options: ["Recolección por Transarchivos", "Por definir"] },
    ],
  },
  "microfilmacion-de-archivos": {
    volumeLabel: "Volumen a microfilmar", volumePlaceholder: "Ej.: 100.000 imágenes o 300 cajas",
    next: [],
    fields: [
      { key: "tipo", label: "Tipo de documentos", options: ["Historias clínicas", "Registros notariales", "Expedientes judiciales", "Contables, legales o financieros", "Históricos o patrimoniales", "Otros"] },
      { key: "formato", label: "Formato de microfilme", options: ["16 mm", "35 mm", "No lo sé"] },
      { key: "originales", label: "Destino de los originales", options: ["Restituirlos al cliente", "Trasladarlos a custodia", "No lo sé"] },
      { key: "paralelo", label: "¿Digitalizar en paralelo?", options: ["Sí", "No", "No lo sé"] },
    ],
  },
  "servicio-inhouse": {
    volumeLabel: "Documentación a intervenir", volumePlaceholder: "Ej.: 500 cajas en sitio",
    level: "Nivel 4 · Expansión", next: [],
    fields: [
      { key: "perfil", label: "Área que solicita", options: ["Recursos Humanos", "Compras", "Servicios Generales", "Comité de Archivo", "Otra"] },
      { key: "actividades", label: "Actividades requeridas", options: ["Organización y rotulación", "Aplicación de TRD", "Inventarios", "Preparación para digitalización", "Varias de las anteriores"] },
      { key: "personas", label: "Personas requeridas en sitio", options: ["1", "2 a 3", "Más de 3", "No lo sé"] },
      { key: "duracion", label: "Duración estimada", options: ["Menos de 3 meses", "3 a 12 meses", "Más de 12 meses", "No lo sé"] },
    ],
  },
  "servicio-inmediato": {
    volumeLabel: "Documentos requeridos", volumePlaceholder: "Ej.: 3 expedientes",
    level: "Nivel 4 · Expansión", next: [],
    fields: [
      { key: "modalidad", label: "Modalidad", options: ["Digitalización prioritaria bajo demanda", "Despacho físico express", "No lo sé"] },
      { key: "custodia", label: "¿Los documentos están en custodia con Transarchivos?", options: ["Sí", "No", "Parcialmente"] },
      { key: "plazo", label: "Plazo requerido", options: ["Mismo día", "24 a 48 horas", "Esta semana"] },
    ],
  },
};

// Unidad de cotización por servicio — tabla del punto 7 de "LÓGICA DE
// COTIZACIÓN TRANSARCHIVOS" ("las unidades definitivas, tarifas y fórmulas
// deben ser determinadas posteriormente"). Solo cubre los 5 servicios que el
// documento tabula explícitamente; el resto no tiene unidad definida todavía.
const QUOTE_UNIT: Record<string, string> = {
  "custodia-de-archivos": "Unidad contractual/operativa, según volumen, permanencia y condiciones.",
  "custodia-de-medios-magneticos": "Unidad contractual/operativa, según volumen, permanencia y condiciones.",
  "digitalizacion-de-documentos": "Unidad de producción, según volumen y características documentales.",
  "levantamiento-de-inventario": "Unidad de levantamiento, según volumen, detalle y complejidad.",
  "destruccion-de-documentos": "Unidad de manejo, según volumen y condiciones.",
  "diagnostico": "Proyecto, jornada o entregable, según alcance y dedicación.",
  "programa-de-gestion-documental": "Proyecto, jornada o entregable, según alcance y dedicación.",
};

function QuoteSimulator() {
  const [selected, setSelected] = useState("diagnostico");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [contact, setContact] = useState<Record<string, string>>({});

  const cfg = quoteConfig[selected];
  const svc = services.find(s => s.slug === selected);
  const title = svc ? svc.title : "Diagnóstico documental";
  const accent = svc ? svc.accent : "#C8960A";
  const icon = svc ? svc.icon : iconoLupa;

  const pick = (id: string) => { setSelected(id); setStep(0); setAnswers({}); };
  const setA = (k: string, v: string) => setAnswers(a => ({ ...a, [k]: v }));
  const setC = (k: string, v: string) => setContact(c => ({ ...c, [k]: v }));

  const unknownCount = cfg.fields.filter(f => (answers[f.key] ?? "").toLowerCase().startsWith("no l") || (answers[f.key] ?? "").toLowerCase().startsWith("no estoy")).length;
  const missingVolume = !(answers.volume ?? "").trim();
  const special = answers.urgencia === "Urgente" || (answers.especiales ?? "").trim().length > 0;
  const nextStep = missingVolume || unknownCount >= 2
    ? { t: "Completar la información", d: "Faltan variables críticas. Un asesor le pedirá los datos restantes o programará una visita o levantamiento antes de cotizar.", ic: "question-circle-fill", c: "#C8960A" }
    : special
      ? { t: "Validación de Operaciones", d: "Su solicitud tiene una condición especial. Comercial y Operaciones la validarán antes de comprometer alcance y tiempos.", ic: "shield-fill-exclamation", c: "#1800AD" }
      : { t: "Cotización según parámetros", d: "La información es suficiente. Comercial elaborará la cotización con el alcance y las condiciones definidas.", ic: "check-circle-fill", c: "#16a34a" };

  // Completitud "en vivo": cuántas de las variables que el documento marca
  // como mínimas (volumen + campos del servicio + ubicación + urgencia) ya
  // tiene el cliente respondidas — no es un precio, es transparencia sobre
  // qué tan lista está la solicitud para cotizarse, sin esperar a un asesor.
  const requiredKeys = ["volume", ...cfg.fields.map(f => f.key), "ubicacion", "urgencia"];
  const answeredCount = requiredKeys.filter(k => (answers[k] ?? "").trim()).length;
  const completPct = Math.round((answeredCount / requiredKeys.length) * 100);

  const summary: [string, string][] = [
    [cfg.volumeLabel, answers.volume || "—"],
    ...cfg.fields.map(f => [f.label, answers[f.key] || "—"] as [string, string]),
    ["Ubicación", answers.ubicacion || "—"],
    ["Urgencia", answers.urgencia || "—"],
    ["Requerimientos especiales", answers.especiales || "Ninguno"],
  ];
  const contactRows: [string, string][] = [
    ["Empresa", contact.empresa || "—"], ["Sector", contact.sector || "—"],
    ["Contacto", `${contact.nombre || "—"}${contact.cargo ? " · " + contact.cargo : ""}`],
    ["Correo", contact.email || "—"], ["Teléfono", contact.telefono || "—"],
  ];
  const mailto = () => {
    const body =
      `Solicitud de cotización — ${title}\n\nDATOS DE LA SOLICITUD\n` +
      summary.map(([k, v]) => `- ${k}: ${v}`).join("\n") +
      `\n\nCONTACTO\n` + contactRows.map(([k, v]) => `- ${k}: ${v}`).join("\n") +
      `\n\nSiguiente paso sugerido: ${nextStep.t}`;
    return `mailto:info@transarchivos.com?subject=${encodeURIComponent("Solicitud de cotización — " + title)}&body=${encodeURIComponent(body)}`;
  };

  const inputStyle = { background: "#fff", border: "1.5px solid #D5D9F5", color: "#272B7C" } as const;
  const labelCls = "block text-[11px] font-semibold mb-1.5";
  const labelStyle = { color: "#272B7C", fontFamily: "Montserrat, sans-serif" } as const;

  return (
    <section id="cotizador" className="relative max-w-6xl mx-auto px-6 py-14">
      <img src={graficoCotizador2Img} alt="" aria-hidden="true"
        className="hidden lg:block absolute pointer-events-none select-none"
        style={{ width: 300, height: "auto", maxWidth: "none", bottom: 10, left: -160, opacity: 0.9, zIndex: 0 }} />

      <div className="relative" style={{ zIndex: 1 }}>
        <p className="text-xs font-bold uppercase tracking-widest text-center mb-3" style={{ color: "#9B9B9B", fontFamily: "Montserrat, sans-serif" }}>
          Solicite su cotización
        </p>
        <h2 className="text-3xl font-bold text-center mb-4" style={{ fontFamily: "Poppins, sans-serif", color: "#272B7C" }}>
          Cuéntenos qué necesita y arme su solicitud
        </h2>
        <p className="text-sm text-center max-w-xl mx-auto mb-8" style={{ color: "#9B9B9B" }}>
          Elija el servicio y responda unas preguntas. A medida que avanza, vea el progreso de su solicitud antes de enviarla a nuestro equipo comercial.
        </p>

        <div className="grid md:grid-cols-[minmax(0,1fr)_380px] gap-8 items-center" style={{ marginBottom: 24 }}>
          {/* Selector de servicio — las 10 unidades de negocio (diagnóstico +
              9 servicios) comparten el mismo formato de ficha compacta
              (ícono + título), para que ninguna se vea "secundaria" frente
              a las demás. 2 columnas fijas (en vez de 3) para que 10 fichas
              formen exactamente 5 filas completas, sin una fila final con
              una sola ficha huérfana y dos huecos vacíos al lado. La
              descripción de la unidad elegida va debajo, en una tarjeta
              propia (no como texto suelto) que cambia según la selección. */}
          <div>
            <div className="grid grid-cols-2 gap-2.5 mb-2.5">
              {[
                { slug: "diagnostico", icon: iconoLupa, title: "Diagnóstico documental", desc: "¿No sabe qué servicio necesita? Empiece por entender qué está pasando con su archivo.", accent: "#C8960A" },
                ...services,
              ].map(s => {
                const active = s.slug === selected;
                return (
                  <button key={s.slug} onClick={() => pick(s.slug)}
                    className="flex items-center gap-2.5 text-left p-2.5 rounded-2xl transition-all cursor-pointer"
                    style={{ border: `1.5px solid ${active ? s.accent : "#E9E9E7"}`, background: active ? `${s.accent}0D` : "#fff" }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: active ? s.accent : `${s.accent}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.2s" }}>
                      <img src={s.icon} alt="" style={{ width: 19, height: 19, objectFit: "contain", filter: active ? "brightness(0) invert(1)" : "none", transition: "filter 0.2s" }} />
                    </div>
                    <span className="text-xs font-semibold leading-tight" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif" }}>{s.title}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex items-start gap-2.5 rounded-xl p-3" style={{ background: "#F7F8FF", border: "1px solid #E4E6F7" }}>
              <Bi n="info-circle-fill" size={14} color="#272B7C" style={{ marginTop: 1, flexShrink: 0 }} />
              <p className="text-xs leading-snug" style={{ color: "#6B6B6B" }}>
                {selected === "diagnostico" ? "¿No sabe qué servicio necesita? Empiece por entender qué está pasando con su archivo." : svc?.desc}
              </p>
            </div>
          </div>

          {/* Asistente de solicitud */}
          <div className="relative">
            <img src={graficoCotizadorImg} alt="" aria-hidden="true"
              className="hidden lg:block absolute pointer-events-none select-none"
              style={{ width: 410, height: "auto", top: -65, right: -170, zIndex: 10 }} />
            <div className="relative rounded-3xl flex flex-col" style={{ background: "#fff", border: "1.5px solid #E4E6F7", boxShadow: "0 30px 60px -34px rgba(39,43,124,0.3)", height: 530 }}>
              <div className="p-5 pb-4 rounded-t-3xl" style={{ borderBottom: "1px solid #E9E9E7", background: "linear-gradient(180deg, #F7F8FF 0%, #fff 100%)" }}>
                <div className="flex items-center gap-3">
                  <div style={{ width: 50, height: 50, borderRadius: 14, background: accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 8px 18px -6px ${accent}80` }}>
                    <img src={icon} alt="" style={{ width: 28, height: 28, objectFit: "contain", filter: "brightness(0) invert(1)" }} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>{title}</p>
                    {cfg.level && <p className="text-[11px]" style={{ color: "#9B9B9B" }}>{cfg.level}</p>}
                  </div>
                </div>
                <div className="relative grid grid-cols-3 gap-2 mt-5">
                  <div className="absolute" style={{ top: 13, left: "16.5%", right: "16.5%", height: 2, background: "#E4E6F7" }} />
                  {["Detalles", "Contacto", "Resumen"].map((n, i) => (
                    <div key={n} className="relative flex flex-col items-center text-center gap-1">
                      <span className="flex items-center justify-center rounded-full font-bold relative" style={{
                        width: 26, height: 26, fontSize: 11,
                        background: i < step ? "#272B7C" : i === step ? "#fff" : "#fff",
                        color: i < step ? "#fff" : i === step ? "#272B7C" : "#C3C7E8",
                        border: `2px solid ${i <= step ? "#272B7C" : "#E4E6F7"}`,
                        fontFamily: "Poppins, sans-serif",
                      }}>
                        {i < step ? <Bi n="check-lg" size={12} color="#fff" /> : i + 1}
                      </span>
                      <span className="text-[10px] font-semibold leading-tight" style={{ color: i === step ? "#272B7C" : "#9B9B9B", fontFamily: "Montserrat, sans-serif" }}>{n}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Avance de la solicitud — visible en los 3 pasos, no solo al
                  final. No es una simulación ni calcula un precio (el
                  documento de lógica de cotización aclara que todavía no
                  existen tarifas ni fórmulas); solo muestra qué tan completos
                  están los datos que se enviarán al equipo comercial. */}
              <div className="mx-5 mt-4 rounded-xl p-4 space-y-3" style={{ background: "#F7F8FF", borderLeft: "3px solid #272B7C", boxShadow: "0 2px 10px -4px rgba(39,43,124,0.15)" }}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif" }}>
                    <Bi n="list-check" size={12} color="#272B7C" />Avance de la solicitud
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ color: "#fff", background: completPct === 100 ? "#16a34a" : "#272B7C" }}>{completPct}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#E4E6F7" }}>
                  <div className="h-full rounded-full" style={{ width: `${completPct}%`, background: completPct === 100 ? "#16a34a" : "#C8960A", transition: "width 0.3s ease" }} />
                </div>
              </div>

              {step === 0 && (
                <form className="flex flex-col flex-1 min-h-0" onSubmit={e => { e.preventDefault(); setStep(1); }}>
                  {/* 2 columnas en vez de una sola fila por campo: con
                      servicios de hasta 5 campos + ubicación + urgencia, una
                      columna única obligaba a mucho scroll dentro de la
                      tarjeta. Cada grupo arma su propia grilla de a pares —
                      así, si un servicio tiene un número impar de campos, el
                      que sobra ocupa la fila completa en vez de dejar una
                      celda vacía a su lado (ubicación/urgencia siempre van
                      emparejadas entre sí, nunca con un campo suelto). La
                      etiqueta tiene una altura mínima de 2 líneas para que,
                      aunque un par tenga etiquetas de distinto largo, los
                      campos arranquen a la misma altura. */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    <div>
                      <label className={labelCls} style={labelStyle}>{cfg.volumeLabel}</label>
                      <input value={answers.volume ?? ""} onChange={e => setA("volume", e.target.value)} placeholder={cfg.volumePlaceholder}
                        className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
                    </div>

                    <div className="grid grid-cols-2 gap-x-3 gap-y-4">
                      {cfg.fields.map((f, i) => {
                        const lastOdd = i === cfg.fields.length - 1 && cfg.fields.length % 2 === 1;
                        return (
                          <div key={f.key} className={lastOdd ? "col-span-2" : ""}>
                            <label className={labelCls} style={{ ...labelStyle, minHeight: "2.2em", display: "flex", alignItems: "flex-end" }}>{f.label}</label>
                            <select value={answers[f.key] ?? ""} onChange={e => setA(f.key, e.target.value)}
                              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle}>
                              <option value="">Seleccione…</option>
                              {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                          </div>
                        );
                      })}
                    </div>

                    <div className="grid grid-cols-2 gap-x-3 gap-y-4">
                      <div>
                        <label className={labelCls} style={{ ...labelStyle, minHeight: "2.2em", display: "flex", alignItems: "flex-end" }}>Ubicación (ciudad y sede)</label>
                        <input value={answers.ubicacion ?? ""} onChange={e => setA("ubicacion", e.target.value)} placeholder="Ej.: Bogotá, sede principal"
                          className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
                      </div>
                      <div>
                        <label className={labelCls} style={{ ...labelStyle, minHeight: "2.2em", display: "flex", alignItems: "flex-end" }}>Nivel de urgencia</label>
                        <select value={answers.urgencia ?? ""} onChange={e => setA("urgencia", e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle}>
                          <option value="">Seleccione…</option>
                          {QUOTE_URGENCY.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className={labelCls} style={labelStyle}>Requerimientos especiales (opcional)</label>
                      <textarea value={answers.especiales ?? ""} onChange={e => setA("especiales", e.target.value)} rows={2} placeholder="Restricciones, características del material, otra información…"
                        className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none" style={inputStyle} />
                    </div>
                  </div>
                  <div className="p-5 pt-3" style={{ borderTop: "1px solid #E9E9E7" }}>
                    <button type="submit" className="w-full py-3 rounded-xl text-sm font-semibold cursor-pointer transition-all hover:opacity-90"
                      style={{ background: "#272B7C", color: "#fff", fontFamily: "Montserrat, sans-serif" }}>Continuar <Bi n="arrow-right" size={15} color="#fff" style={{ verticalAlign: "-2px", marginLeft: 4 }} /></button>
                  </div>
                </form>
              )}

              {step === 1 && (
                <form className="flex flex-col flex-1 min-h-0" onSubmit={e => { e.preventDefault(); setStep(2); }}>
                  <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    <div>
                      <label className={labelCls} style={labelStyle}>Empresa</label>
                      <input required value={contact.empresa ?? ""} onChange={e => setC("empresa", e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
                    </div>
                    <div>
                      <label className={labelCls} style={labelStyle}>Sector económico</label>
                      <select required value={contact.sector ?? ""} onChange={e => setC("sector", e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle}>
                        <option value="">Seleccione…</option>
                        {QUOTE_SECTORS.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls} style={labelStyle}>Su nombre</label>
                        <input required value={contact.nombre ?? ""} onChange={e => setC("nombre", e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
                      </div>
                      <div>
                        <label className={labelCls} style={labelStyle}>Cargo</label>
                        <input required value={contact.cargo ?? ""} onChange={e => setC("cargo", e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls} style={labelStyle}>Correo electrónico</label>
                      <input required type="email" value={contact.email ?? ""} onChange={e => setC("email", e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
                    </div>
                    <div>
                      <label className={labelCls} style={labelStyle}>Teléfono</label>
                      <input required value={contact.telefono ?? ""} onChange={e => setC("telefono", e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
                    </div>
                  </div>
                  <div className="p-5 pt-3 flex gap-3" style={{ borderTop: "1px solid #E9E9E7" }}>
                    <button type="button" onClick={() => setStep(0)} className="px-5 py-3 rounded-xl text-sm font-semibold cursor-pointer"
                      style={{ background: "#fff", color: "#272B7C", border: "1.5px solid #D5D9F5", fontFamily: "Montserrat, sans-serif" }}>Atrás</button>
                    <button type="submit" className="flex-1 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-all hover:opacity-90"
                      style={{ background: "#272B7C", color: "#fff", fontFamily: "Montserrat, sans-serif" }}>Ver resumen <Bi n="arrow-right" size={15} color="#fff" style={{ verticalAlign: "-2px", marginLeft: 4 }} /></button>
                  </div>
                </form>
              )}

              {step === 2 && (
                <div className="flex flex-col flex-1 min-h-0">
                  <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {/* La completitud ya se muestra arriba en el panel
                        "Avance de la solicitud", igual en los 3 pasos — aquí
                        solo el detalle de lo capturado. */}
                    <div className="rounded-xl p-4 space-y-1.5" style={{ background: "#fff", border: "1px solid #E9E9E7" }}>
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#9B9B9B", fontFamily: "Montserrat, sans-serif" }}>Su solicitud</p>
                      {[...summary, ...contactRows].map(([k, v]) => (
                        <div key={k} className="flex justify-between gap-3 text-xs">
                          <span style={{ color: "#9B9B9B" }}>{k}</span>
                          <span className="text-right font-semibold" style={{ color: "#272B7C" }}>{v}</span>
                        </div>
                      ))}
                    </div>
                    {cfg.next.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "#9B9B9B", fontFamily: "Montserrat, sans-serif" }}>También podría necesitar</p>
                        <div className="flex flex-wrap gap-2">
                          {cfg.next.map(n => {
                            const o = services.find(x => x.slug === n);
                            return o ? (
                              <button key={n} onClick={() => pick(n)} className="text-[11px] font-semibold px-3 py-1.5 rounded-full cursor-pointer"
                                style={{ background: "#fff", color: "#272B7C", border: "1px solid #D5D9F5", fontFamily: "Montserrat, sans-serif" }}>{o.title}</button>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-5 pt-3 space-y-2" style={{ borderTop: "1px solid #E9E9E7" }}>
                    <a href={mailto()} className="flex items-center justify-center w-full py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                      style={{ background: "#272B7C", color: "#fff", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}><Bi n="envelope-arrow-up-fill" size={16} color="#fff" className="mr-2" />Enviar solicitud por correo</a>
                    <button onClick={() => setStep(1)} className="w-full text-xs font-semibold cursor-pointer" style={{ color: "#1800AD", fontFamily: "Montserrat, sans-serif" }}><Bi n="arrow-left" size={12} color="#1800AD" className="mr-1.5" />Modificar datos</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Blog / contenido especializado ─────────────────────────────────────────
// Artículos reales de la carpeta RecursosTransarchivos (ver src/blogData.ts).

// Un color por categoría (en vez del dorado único de antes) para que la
// sección tenga más vida: cada eyebrow, subrayado y acento hereda el color
// de su propia categoría.
const BLOG_CAT_COLOR: Record<string, string> = {
  "Tecnología": "#1800AD",
  "Sostenibilidad": "#15803d",
  "Inteligencia documental": "#C8960A",
};
const blogCatColor = (c: string) => BLOG_CAT_COLOR[c] ?? "#272B7C";

function BlogSection() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const [featured, ...rest] = blogPosts;

  return (
    <section id="blog" className="relative overflow-hidden" style={{ background: "#FBFBF8" }}>
      <div className="absolute pointer-events-none rounded-full" style={{ width: 420, height: 420, bottom: -160, left: -160, background: "radial-gradient(circle, rgba(24,0,173,0.08) 0%, transparent 70%)" }} />

      {/* Ilustraciones del cliente (imagenblog1/2/3), como acentos
          decorativos: la tercera en la esquina inferior, y la segunda junto
          a la suscripción. La primera va dentro del encabezado, al lado del
          título (más abajo). */}
      <img src={imagenBlog3Img} alt="" aria-hidden="true"
        className="hidden xl:block absolute pointer-events-none select-none"
        style={{ width: 300, bottom: 0, left: -40, opacity: 0.9, zIndex: 0 }} />
      <div className="relative max-w-6xl mx-auto px-6 py-20">
        {/* Encabezado: solo título, centrado — se quitaron las pestañas de categoría.
            La ilustración va antes del título (a su izquierda), como parte
            del mismo bloque centrado. */}
        <div className="mb-12 pb-8 flex flex-col items-center justify-center gap-4 xl:flex-row xl:gap-6" style={{ borderBottom: "1.5px solid #E4E6F7" }}>
          <img src={imagenBlog1Img} alt="" aria-hidden="true"
            className="hidden xl:block shrink-0 pointer-events-none select-none" style={{ width: 180 }} />
          <div className="text-center xl:text-left">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#C8960A", fontFamily: "Montserrat, sans-serif" }}>Blog y novedades</p>
          <h2 className="text-3xl md:text-[44px] font-bold max-w-2xl mx-auto xl:mx-0" style={{ fontFamily: "Poppins, sans-serif", color: "#272B7C", lineHeight: 1.15 }}>
            Conocimiento que protege<br />
            <span style={{ background: "linear-gradient(transparent 62%, #FFDE59 62%)" }}>la memoria de su empresa</span>
          </h2>
          </div>
        </div>

        {/* Bento: destacado grande a la izquierda (tarjeta "portada") +
            columna de tarjetas compactas apiladas a la derecha — tarjetas
            otra vez, pero organizadas como hero + sidebar en vez de un
            grid parejo de 3 columnas. */}
        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-6 mb-10">
          {featured && (() => { const fc = blogCatColor(featured.cat); return (
            <Link to={`/blog/${featured.slug}`}
              className="group flex flex-col rounded-3xl overflow-hidden transition-all hover:-translate-y-1.5"
              style={{ background: "#fff", border: "1.5px solid #E4E6F7", boxShadow: `0 24px 50px -28px ${fc}66`, textDecoration: "none" }}>
              <div className="relative overflow-hidden" style={{ height: 300 }}>
                <img src={featured.cover} alt="" className="w-full h-full" style={{ objectFit: "cover" }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(20,22,63,0.05) 45%, rgba(20,22,63,0.55) 100%)" }} />
                <span className="absolute top-4 left-4 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full" style={{ background: fc, color: "#fff", fontFamily: "Montserrat, sans-serif" }}>
                  Destacado · {featured.cat}
                </span>
              </div>
              <div className="flex flex-col flex-1 p-7 md:p-8">
                <h3 className="text-2xl font-bold mb-3 transition-colors" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif", lineHeight: 1.25 }}>{featured.title}</h3>
                <p className="text-sm mb-6" style={{ color: "#6B6B6B", lineHeight: 1.65 }}>{featured.excerpt}</p>
                <div className="mt-auto pt-5 flex items-center justify-between text-xs" style={{ borderTop: "1px solid #F0F1FA", color: "#9B9B9B" }}>
                  <span>{featured.date} · {readMinutes(featured)} min</span>
                  <span className="font-bold inline-flex items-center gap-1.5 transition-transform group-hover:translate-x-0.5" style={{ color: fc }}>
                    Leer artículo <Bi n="arrow-right" size={13} color={fc} />
                  </span>
                </div>
              </div>
            </Link>
          ); })()}

          <div className="relative flex flex-col justify-center gap-4">
            {/* Un solo cuadrado mostaza semi-torcido detrás de las 3
                tarjetas juntas — mismo lenguaje que los acentos cuadrados
                amarillos de los elementos gráficos. */}
            <div className="hidden sm:block absolute pointer-events-none"
              style={{ top: 30, bottom: 30, left: -3, right: -3, background: "#E8B023", borderRadius: 24, transform: "rotate(-2deg)", zIndex: 0 }} />
            {rest.map(p => {
              const pc = blogCatColor(p.cat);
              return (
                <Link key={p.slug} to={`/blog/${p.slug}`}
                  className="group relative flex gap-4 rounded-2xl p-3 transition-all hover:-translate-y-1"
                  style={{ background: "#fff", border: "1.5px solid #E4E6F7", boxShadow: `0 10px 24px -20px ${pc}80`, textDecoration: "none" }}>
                  <div className="relative overflow-hidden rounded-xl shrink-0" style={{ width: 100, height: 100 }}>
                    <img src={p.cover} alt="" className="w-full h-full" style={{ objectFit: "cover" }} />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center py-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: pc, fontFamily: "Montserrat, sans-serif" }}>{p.cat}</span>
                    <h4 className="text-sm font-bold mb-1.5 line-clamp-2" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif", lineHeight: 1.3 }}>{p.title}</h4>
                    <span className="text-[11px]" style={{ color: "#9B9B9B" }}>{p.date} · {readMinutes(p)} min</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Suscripción, también como tarjeta — igual lenguaje que el resto
            de la sección ahora que volvimos a cards. La tercera ilustración
            se asoma por encima de la tarjeta, mismo truco que la silueta de
            Joel en la burbuja del chat. */}
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5 rounded-3xl p-7 md:px-9"
          style={{ background: "#fff", border: "1.5px solid #E4E6F7", boxShadow: "0 14px 34px -24px rgba(39,43,124,0.25)" }}>
          <img src={imagenBlog2Img} alt="" aria-hidden="true"
            className="hidden lg:block absolute pointer-events-none select-none"
            style={{ width: 220, top: -400, right: -230, zIndex: 0, transform: "rotate(-4deg)" }} />
          <div className="flex items-center gap-4">
            <span className="flex items-center justify-center rounded-2xl shrink-0" style={{ width: 44, height: 44, background: "linear-gradient(135deg, #C8960A, #FFDE59)" }}>
              <Bi n="envelope-paper-heart-fill" size={19} color="#fff" />
            </span>
            <div>
              <p className="font-bold text-base" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>Reciba novedades y guías en su correo</p>
              <p className="text-xs mt-0.5" style={{ color: "#9B9B9B" }}>Contenido sobre gestión documental y novedades de Transarchivos.</p>
            </div>
          </div>
          {sent ? (
            <p className="text-sm font-semibold" style={{ color: "#15803d", fontFamily: "Montserrat, sans-serif" }}>
              <Bi n="check-circle-fill" size={14} color="#15803d" className="mr-1.5" />¡Gracias! Le avisaremos cuando publiquemos.
            </p>
          ) : (
            <form className="flex gap-3 md:w-[380px]" onSubmit={e => { e.preventDefault(); if (email.trim()) setSent(true); }}>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="su@correo.com"
                className="flex-1 min-w-0 px-4 py-2.5 rounded-full text-sm outline-none"
                style={{ background: "#fff", border: "1.5px solid #E4E6F7", color: "#272B7C" }} />
              <button type="submit" className="px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all hover:opacity-85 cursor-pointer"
                style={{ background: "#272B7C", color: "#fff", fontFamily: "Montserrat, sans-serif" }}>Suscribirme</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Chatbot ──────────────────────────────────────────────────────────────────

type ChatMsg = { from: "bot" | "user"; text: string };

const FLOWS: Record<string, { text: string; options?: { label: string; next: string }[] }> = {
  start: {
    text: "Hola, soy Joel, el asistente de Transarchivos. ¿Cuál es el motivo de su visita?",
    options: [
      { label: "→  Necesito un servicio documental", next: "corporate" },
      { label: "→  Soy estudiante o investigador", next: "academic" },
      { label: "→  Busco empleo o prácticas", next: "jobs" },
    ],
  },
  corporate: {
    text: "Perfecto. Un especialista puede presentarle una propuesta a la medida de su empresa. ¿Cómo prefiere continuar?",
    options: [
      { label: "→  Solicitar cotización", next: "quote" },
      { label: "→  Hablar con un asesor", next: "advisor" },
    ],
  },
  academic: {
    text: "Con gusto. Escríbanos a info@transarchivos.com y le compartiremos terminología, normativa y recursos técnicos de archivística.",
  },
  jobs: { text: "Puede escribirnos a info@transarchivos.com con el asunto \"Candidatura espontánea\"." },
  quote: { text: "Complete la solicitud en la sección “Solicite su cotización” y un asesor de Transarchivos se pondrá en contacto con usted. ✓" },
  advisor: { text: "Conectándole con un asesor. También puede escribirnos a info@transarchivos.com o llamar al (601) 316-4530." },
};

// "open"/"setOpen" viven en App (no local) para que el avatar del hero
// también pueda abrir el chat, no solo el botón flotante.
function ChatBot({ open, setOpen }: { open: boolean; setOpen: (v: boolean | ((prev: boolean) => boolean)) => void }) {
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [flow, setFlow] = useState("start");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && msgs.length === 0) {
      setTyping(true);
      setTimeout(() => { setTyping(false); setMsgs([{ from: "bot", text: FLOWS.start.text }]); }, 700);
    }
  }, [open]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);

  const pick = (label: string, next: string) => {
    setMsgs((m) => [...m, { from: "user", text: label }]);
    setTyping(true);
    setFlow(next);
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { from: "bot", text: FLOWS[next].text }]);
    }, 800);
  };

  const opts = FLOWS[flow]?.options ?? [];

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl pl-2.5 pr-4 py-2.5 transition-all hover:-translate-y-1 active:scale-95"
        style={{
          background: "linear-gradient(135deg, #272B7C 0%, #1800AD 100%)",
          color: "#fff",
          boxShadow: "0 16px 34px -10px rgba(24,0,173,0.55), 0 2px 8px rgba(10,13,61,0.2)",
        }}
        aria-label="Joel"
      >
        {open ? (
          <>
            <span className="flex items-center justify-center rounded-full" style={{ width: 32, height: 32, background: "rgba(255,255,255,0.15)" }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><line x1="2" y1="2" x2="14" y2="14" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><line x1="14" y1="2" x2="2" y2="14" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
            </span>
            <span className="text-sm font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>Cerrar</span>
          </>
        ) : (
          <>
            <div className="relative flex-shrink-0">
              {/* Anillo pulsante detrás del avatar — mismo lenguaje "con vida" de
                  los pines del mapa, para que el botón llame la atención sin
                  perder formalidad (nada de rebote/parpadeo brusco). */}
              <span className="absolute inset-0" style={{ borderRadius: "32%", background: "#FFDE59", opacity: 0.48, animation: "chatPing 2.4s cubic-bezier(0,0,0.2,1) infinite" }} />
              <ChatAvatarFace size={36} ring="light" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2" style={{ background: "#22c55e", borderColor: "#272B7C" }} />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold leading-none mb-1 flex items-center gap-1.5" style={{ fontFamily: "Montserrat, sans-serif" }}>
                Joel
                <span className="text-[8px] font-bold px-1.5 py-px rounded-full" style={{ background: "#FFDE59", color: "#5c4900", letterSpacing: "0.02em" }}>IA</span>
              </p>
              <p className="text-xs leading-none" style={{ color: "rgba(255,255,255,0.7)" }}>En línea ahora</p>
            </div>
            <span className="w-2 h-2 rounded-full animate-pulse ml-1" style={{ background: "#FFDE59" }} />
          </>
        )}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 rounded-[28px] overflow-hidden flex flex-col"
          style={{ width: 440, height: 600, background: "#fff", boxShadow: "0 40px 80px -30px rgba(24,0,173,0.45), 0 4px 16px rgba(10,13,61,0.15)", border: "1px solid rgba(39,43,124,0.08)" }}>
          {/* Header — degradado navy→indigo de marca con glow decorativo,
              mismo lenguaje que la sección "Conozca a Joel". */}
          <div className="relative overflow-hidden px-5 py-4 flex items-center gap-3" style={{ background: "linear-gradient(135deg, #272B7C 0%, #1800AD 100%)" }}>
            <div className="absolute rounded-full pointer-events-none" style={{ width: 200, height: 200, top: -100, right: -60, background: "radial-gradient(circle, rgba(255,222,89,0.25) 0%, transparent 70%)" }} />
            <div className="relative flex-shrink-0">
              <ChatAvatarFace size={44} ring="light" />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2" style={{ background: "#22c55e", borderColor: "#1800AD" }} />
            </div>
            <div className="relative flex-1">
              <p className="text-sm font-bold flex items-center gap-1.5" style={{ color: "#ffffff", fontFamily: "Poppins, sans-serif" }}>
                Joel
                <span className="text-[8px] font-bold px-1.5 py-px rounded-full" style={{ background: "#FFDE59", color: "#5c4900" }}>IA</span>
              </p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>Transarchivos · Respuesta inmediata</p>
            </div>
            <button onClick={() => setOpen(false)} className="relative flex items-center justify-center rounded-full transition-colors hover:bg-white/15" style={{ width: 28, height: 28 }} aria-label="Cerrar">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><line x1="2" y1="2" x2="14" y2="14" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><line x1="14" y1="2" x2="2" y2="14" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          </div>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: "#F7F8FF" }}>
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"} items-end gap-2`}>
                {m.from === "bot" && <div className="shrink-0 mb-0.5"><ChatAvatarFace size={22} /></div>}
                <div className="max-w-[78%] px-3.5 py-2.5 text-xs leading-relaxed"
                  style={{
                    background: m.from === "bot" ? "#ffffff" : "linear-gradient(135deg, #272B7C, #1800AD)",
                    color: m.from === "bot" ? "#37352F" : "#ffffff",
                    border: m.from === "bot" ? "1px solid #E4E6F7" : "none",
                    borderRadius: m.from === "bot" ? "4px 16px 16px 16px" : "16px 16px 4px 16px",
                    boxShadow: m.from === "bot" ? "0 4px 12px -6px rgba(39,43,124,0.15)" : "0 6px 16px -6px rgba(24,0,173,0.4)",
                  }}>
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start items-end gap-2">
                <div className="shrink-0 mb-0.5"><ChatAvatarFace size={22} /></div>
                <div className="bg-white flex gap-1" style={{ border: "1px solid #E4E6F7", borderRadius: "4px 16px 16px 16px", padding: "10px 14px" }}>
                  {[0,1,2].map(i => <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: "#1800AD", opacity: 0.6, animation: `chatBounce 1.4s ${i*0.2}s infinite` }} />)}
                </div>
              </div>
            )}
            {!typing && opts.length > 0 && (
              <div className="flex flex-col gap-1.5 pt-1">
                {opts.map(o => (
                  <button key={o.next} onClick={() => pick(o.label, o.next)}
                    className="text-left text-xs font-semibold rounded-xl px-3.5 py-2.5 border transition-all"
                    style={{ borderColor: "#E4E6F7", color: "#272B7C", background: "#ffffff", fontFamily: "Montserrat, sans-serif" }}
                    onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = "#1800AD"; (e.target as HTMLElement).style.background = "#EEF0FB"; (e.target as HTMLElement).style.transform = "translateX(2px)"; }}
                    onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = "#E4E6F7"; (e.target as HTMLElement).style.background = "#ffffff"; (e.target as HTMLElement).style.transform = "translateX(0)"; }}>
                    {o.label}
                  </button>
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>
          <div className="px-4 py-3 text-center text-xs" style={{ borderTop: "1px solid #E4E6F7", color: "#9B9B9B", background: "#fff" }}>
            ¿Prefiere contacto directo? <a href="#cotizador" className="font-semibold" style={{ color: "#1800AD", textDecoration: "none" }}>Ver formulario →</a>
          </div>
        </div>
      )}
    </>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

// Toda la página principal (antes era el App exportado directamente). Ahora
// App es un enrutador liviano: esto vive en "/", y cada card de servicio
// enlaza a su propia página en "/servicios/:slug" (ver ServiceDetailPage).
function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Un solo dropdown abierto a la vez en el pill ("Servicios" o "Nosotros",
  // antes solo existía "Servicios" con un boolean — ahora que hay dos, se
  // necesita saber CUÁL está abierto, no solo si algo está abierto).
  const [openMenu, setOpenMenu] = useState<"servicios" | "nosotros" | "blog" | null>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  // Estado del chat en App (no dentro de ChatBot): así el avatar del hero
  // también puede abrirlo con un clic, no solo el botón flotante.
  const [chatOpen, setChatOpen] = useState(false);

  // Búsqueda del header: reemplaza la fila del nav por un input cuando está
  // abierta (mismo mecanismo "el pill crece" que Servicios/Nosotros), y
  // cierra el dropdown "Servicios/Nosotros" si estaba abierto (mutuamente
  // excluyentes dentro del mismo pill).
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Al llegar desde otra página con un ancla (p.ej. "/#servicios" desde el
  // detalle de un servicio), salta directo a esa sección en vez de quedar
  // arriba del todo.
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: "auto", block: "start" }));
  }, [hash]);
  // useMemo: evita recalcular el filtro en cada render del componente (p.ej.
  // al cruzar el umbral de "scrolled") cuando el texto de búsqueda no cambió.
  const searchResults = useMemo(() => searchContent(searchQuery), [searchQuery]);
  const searchHasQuery = searchQuery.trim().length >= 2;
  const toggleSearch = () => {
    setOpenMenu(null);
    setSearchOpen(o => !o);
    setSearchQuery("");
  };
  useEffect(() => {
    if (searchOpen) requestAnimationFrame(() => searchInputRef.current?.focus());
  }, [searchOpen]);

  // Ancho real del botón CTA del navbar, medido en vivo — el espacio reservado
  // a la izquierda del nav debe ser EXACTAMENTE igual a este ancho (no solo
  // "la mitad del espacio sobrante") para que "Servicios/Nosotros/Blog/
  // Contacto" quede centrado de verdad en el pill: si el CTA es más ancho que
  // su "parte justa" del espacio libre, se desborda hacia la izquierda y rompe
  // la simetría — reservar su mismo ancho del otro lado lo neutraliza siempre,
  // sin importar si el texto del botón cambia.
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const [ctaWidth, setCtaWidth] = useState(0);
  useLayoutEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const measure = () => setCtaWidth(el.offsetWidth);
    measure();
    // ResizeObserver en vez de intentar adivinar CUÁNDO el botón termina de
    // asentar su tamaño real (se probaron document.fonts.ready y el evento
    // "load" del window — ambos se resuelven antes de que la hoja de Google
    // Fonts con Montserrat realmente cargue y el botón crezca ~12px). El
    // observer reacciona al cambio de tamaño en sí, sin importar la causa.
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cierra "Servicios" al hacer clic fuera del pill (el mouseleave del pill ya
  // lo cierra al pasar el cursor fuera, pero un clic afuera sin mover el mouse
  // — p.ej. con teclado o trackpad — también debe cerrarlo).
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (pillRef.current && !pillRef.current.contains(e.target as Node)) { setOpenMenu(null); setSearchOpen(false); }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navLinks = [
    { label: "Servicios", href: "#servicios" },
    { label: "Nosotros", href: "/nosotros" },
    { label: "Blog", href: "#blog" },
    { label: "Contacto", href: "#cotizador" },
  ];

  return (
    <div className="min-h-full" style={{ background: "#ffffff", fontFamily: "Inter, sans-serif", color: "#37352F" }}>

      {/* ── HEADER — pill flotante que se convierte en barra completa al hacer scroll ── */}
      {/* fixed (no sticky): el header sale del flujo del documento para que el hero
          (tanto el lado claro como el navy) llegue hasta el borde real de arriba,
          pegado, sin espacio por encima.
          Logo y botón mobile posicionados de forma absoluta (no en el flujo), así
          el pill queda REALMENTE centrado en la página sin que el ancho del logo
          lo empuje hacia un lado. z-index explícito: cuando el pill se hace barra
          completa al scrollear, pasa por debajo del logo/hamburguesa. */}
      {/* min-h: en mobile el pill queda vacío (nav y CTA son hidden md:flex), así que
          sin un alto mínimo propio el header se encoge a casi nada y el logo —
          centrado respecto a él— queda cortado por arriba. */}
      {/* Fondo propio del header (no solo del pill): en modo scrolled, el pill puede
          ser unos px más bajo que el header y dejaba una franja transparente
          alrededor del logo por donde se colaba el contenido al hacer scroll. */}
      <header
        className="fixed top-0 left-0 right-0 z-50 pb-3 min-h-[72px] md:min-h-0 flex items-center justify-center"
        style={{
          // Sin borderBottom: una línea de 1px sólida se ve dura/"cortada" al
          // volver de scrolled a flotante — una sombra suave, sin borde, separa
          // igual de bien pero con un degradado, más estético.
          background: scrolled ? "#ffffff" : "transparent",
          boxShadow: scrolled ? "0 4px 20px rgba(10,13,61,0.12)" : "none",
          transition: "background 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        {/* Logo — suelto, alineado con el borde del bloque de texto del hero (no
            pegado al borde real de la pantalla) */}
        {/* top fijo en vez de top-1/2 (que centra respecto al header completo): al
            abrirse "Servicios" el header crece en alto, y con top-1/2 el logo se
            iba arrastrando hacia el centro nuevo en vez de quedarse arriba, fijo
            junto a la fila 1 del navbar. */}
        <a href="#" className="absolute z-10 left-4 md:left-28" style={{ top: -2 }}>
          <HeaderLogo scrolled={scrolled} size={64} />
        </a>

        {/* Pill / barra — una sola figura que se ENSANCHA (crece en alto) cuando
            "Servicios" está abierto, en vez de abrir un panel aparte pegado debajo.
            Al ser un único elemento con un solo border-radius, no hay costura ni
            huecos que tapar: el radio de 9999px se recorta solo a un valor normal
            de "tarjeta redondeada" en cuanto la caja es más alta que ancha/2. */}
        <div
          ref={pillRef}
          onMouseLeave={() => setOpenMenu(null)}
          className="hidden md:flex relative flex-col"
          style={{
            zIndex: 1,
            // Ancho FIJO (no depende de openMenu): antes el pill se angostaba al
            // cerrar y se ensanchaba al abrir cada dropdown, y como la fila 1 usa
            // "mx-auto" para centrarse, ese cambio de ancho hacía que el texto
            // (Servicios/Nosotros/Blog/Contacto) se recorriera visiblemente en
            // cada apertura — el ancho ya es el máximo que necesita el dropdown
            // más ancho (Servicios), así que abrir/cerrar nunca mueve la fila 1.
            width: scrolled ? "100%" : "min(800px, calc(100vw - 32px))",
            // Un radio de 9999px NO se recorta a "tarjeta redondeada" al crecer:
            // en CSS, un radio uniforme en las 4 esquinas siempre se limita a
            // min(ancho, alto)/2 — con el pill más ancho que alto se veía como un
            // óvalo gigante. Por eso acá, abierto, se usa un radio fijo normal.
            borderRadius: scrolled ? "0px" : (openMenu || (searchOpen && searchHasQuery)) ? "28px" : "9999px",
            overflow: "hidden",
            background: "#ffffff",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            // Sin borde: incluso a 10% de opacidad, un borde de 1px contorneando
            // todo el pill se veía como una línea oscura y dura calcando la forma
            // — la sombra sola ya separa el pill del fondo, sin ese contorno duro.
            border: "none",
            boxShadow: scrolled
              ? "none"
              : "0 12px 32px -8px rgba(10,13,61,0.18), 0 2px 8px rgba(10,13,61,0.10)",
            // Sin "border-radius" en la transición: animar el radio (9999px→28px al
            // abrir "Servicios") hacía que Chromium recalculara el hit-test del mouse
            // en cada frame de la animación, disparando entra/sale falsos en cadena y
            // dejando el menú a veces cerrado justo después de abrirlo. El radio ahora
            // cambia al instante (imperceptible); ancho/sombra/borde sí siguen animados
            // para el efecto de scroll (pill → barra completa).
            transition: "width 0.45s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s ease, border-color 0.3s ease",
          }}
        >
          {/* Fila 1: la barra de siempre */}
          <div className="flex items-center gap-2 pl-2 pr-2 py-2 md:pl-3 md:pr-3">
            {/* Espacio reservado a la izquierda: en modo scrolled, sitio para el
                logo; si no, un hueco deliberadamente MENOR que el ancho del
                grupo de la derecha (CTA + lupa + soporte) — no se busca
                centrar el nav, se busca correrlo hacia la izquierda, cerca
                del logo, que es justo lo que se pidió. El pill tiene ancho
                fijo (no se toca) y el grupo de la derecha ya ocupa
                ctaWidth+86px (lupa+soporte+márgenes), así que con un hueco
                simétrico el nav (392px) no cabía sin montarse sobre el CTA
                — de ahí que este hueco sea chico a propósito. */}
            <div className="shrink-0 transition-all" style={{ width: scrolled ? 168 : Math.max(ctaWidth - 145, 0) }} />

            {/* Desktop nav — centrado dentro del espacio que sobra entre los dos
                huecos iguales (izquierdo y el que ocupa el CTA a la derecha).
                Con la búsqueda abierta, el nav se reemplaza por el input
                (mismo espacio, mismo centrado) en vez de convivir los dos. */}
            <div className="flex-1 flex justify-center min-w-0 px-2">
              {searchOpen ? (
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => { if (e.key === "Escape") setSearchOpen(false); }}
                  placeholder="Buscar servicios, artículos del blog…"
                  className="w-full max-w-md px-4 py-2 rounded-full text-sm outline-none"
                  style={{ background: "#F7F8FF", color: "#272B7C", fontFamily: "Montserrat, sans-serif", border: "1.5px solid #E4E6F7" }}
                />
              ) : (
                <nav className="flex items-center gap-0.5 shrink-0">
                  <NavDropdownTrigger label="Servicios" open={openMenu === "servicios"} setOpen={() => setOpenMenu("servicios")} />
                  <NavDropdownTrigger label="Nosotros" open={openMenu === "nosotros"} setOpen={() => setOpenMenu("nosotros")} />
                  <NavDropdownTrigger label="Blog" open={openMenu === "blog"} setOpen={() => setOpenMenu("blog")} />
                  {[{ label: "Contacto", href: "#cotizador" }].map(l => (
                    <a key={l.label} href={l.href}
                      className="px-3.5 py-2 rounded-full text-sm font-medium transition-colors"
                      style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#1800AD"; e.currentTarget.style.color = "#ffffff"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#272B7C"; }}>
                      {l.label}
                    </a>
                  ))}
                </nav>
              )}
            </div>

            {/* CTA derecha — píldora sólida navy, para destacar sobre el pill blanco */}
            <a ref={ctaRef} href="#cotizador"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-transform hover:scale-105 active:scale-95 shrink-0"
              style={{ background: "#272B7C", color: "#ffffff", fontFamily: "Montserrat, sans-serif" }}>
              Simular cotización
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M3 11L11 3M11 3H5M11 3V9" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>

            {/* Búsqueda y soporte — íconos circulares a la derecha del CTA,
                con un leve borde para distinguirse del pill blanco. */}
            <button type="button" onClick={toggleSearch} aria-label={searchOpen ? "Cerrar búsqueda" : "Buscar"} title={searchOpen ? "Cerrar búsqueda" : "Buscar"}
              className="flex items-center justify-center rounded-full shrink-0 transition-transform hover:scale-105 active:scale-95"
              style={{ width: 36, height: 36, background: searchOpen ? "#1800AD" : "#fff", border: `1.5px solid ${searchOpen ? "#1800AD" : "#E4E6F7"}`, marginLeft: 8 }}>
              <Bi n={searchOpen ? "x-lg" : "search"} size={searchOpen ? 13 : 14} color={searchOpen ? "#fff" : "#272B7C"} />
            </button>
            <button type="button" onClick={() => setChatOpen(true)} aria-label="Soporte" title="Soporte"
              className="flex items-center justify-center rounded-full shrink-0 transition-transform hover:scale-105 active:scale-95"
              style={{ width: 36, height: 36, background: "#fff", border: "1.5px solid #E4E6F7", marginLeft: 6, marginRight: scrolled ? 8 : 0 }}>
              <Bi n="headset" size={15} color="#272B7C" />
            </button>
          </div>

          {/* Fila 2: contenido de "Servicios"/"Nosotros"/búsqueda — el pill
              crece para incluirla (mutuamente excluyentes). */}
          {openMenu === "servicios" && <ServicesPanelContent setOpen={() => setOpenMenu(null)} />}
          {openMenu === "nosotros" && <NosotrosPanelContent setOpen={() => setOpenMenu(null)} />}
          {openMenu === "blog" && <BlogPanelContent setOpen={() => setOpenMenu(null)} />}
          {searchOpen && searchHasQuery && (
            <div className="px-4 pb-4 pt-1">
              <div className="h-px mb-3" style={{ background: "rgba(39,43,124,0.10)" }} />
              {/* Altura FIJA (no max-height): con 1 resultado o con 7, el pill
                  debe medir siempre lo mismo — nada de que crezca o se encoja
                  según cuántos coincidan, eso se sentía "deforme" al escribir. */}
              <div className="overflow-y-auto" style={{ height: 300 }}>
                {searchResults.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-sm text-center" style={{ color: "#9B9B9B" }}>Sin resultados para "{searchQuery}".</p>
                  </div>
                ) : (
                <div className="flex flex-col gap-1">
                  {searchResults.map(r => {
                    const inner = (
                      <>
                        <span className="text-[10px] font-bold uppercase tracking-wider shrink-0 mt-0.5" style={{ color: "#1800AD", fontFamily: "Montserrat, sans-serif", width: 56 }}>{r.kind}</span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif" }}>{r.title}</p>
                          <p className="text-xs truncate" style={{ color: "rgba(39,43,124,0.55)" }}>{r.desc}</p>
                        </div>
                      </>
                    );
                    const cls = "flex items-start gap-3 p-3 rounded-xl transition-colors hover:bg-[#272B7C]/[0.06] cursor-pointer";
                    const onPick = () => { setSearchOpen(false); setSearchQuery(""); };
                    return r.to
                      ? <Link key={r.title} to={r.to} onClick={onPick} className={cls} style={{ textDecoration: "none" }}>{inner}</Link>
                      : <a key={r.title} href={r.href} onClick={onPick} className={cls} style={{ textDecoration: "none" }}>{inner}</a>;
                  })}
                </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile — botón hamburguesa suelto a la derecha */}
        <button className="md:hidden absolute z-10 right-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors"
          style={{ background: mobileOpen ? "#1800AD" : "#ffffff", boxShadow: "0 4px 14px rgba(10,13,61,0.18)", border: mobileOpen ? "none" : "1px solid rgba(39,43,124,0.10)" }} onClick={() => setMobileOpen(!mobileOpen)}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            {mobileOpen
              ? <><line x1="4" y1="4" x2="16" y2="16" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round"/><line x1="16" y1="4" x2="4" y2="16" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round"/></>
              : <><line x1="3" y1="6" x2="17" y2="6" stroke="#272B7C" strokeWidth="1.8" strokeLinecap="round"/><line x1="3" y1="11" x2="17" y2="11" stroke="#272B7C" strokeWidth="1.8" strokeLinecap="round"/><line x1="3" y1="16" x2="17" y2="16" stroke="#272B7C" strokeWidth="1.8" strokeLinecap="round"/></>
            }
          </svg>
        </button>

        {/* Mobile flyout — tarjeta clara debajo del botón */}
        {mobileOpen && (
          <div className="md:hidden absolute top-full right-4 left-4 mt-2 rounded-3xl overflow-hidden"
            style={{ background: "#ffffff", boxShadow: "0 20px 40px -12px rgba(10,13,61,0.35)", border: "1px solid #E9E9E7" }}>
            <div className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map(l => <a key={l.label} href={l.href} className="py-2.5 text-sm font-medium rounded-xl px-3 hover:bg-gray-50" style={{ color: "#37352F" }} onClick={() => setMobileOpen(false)}>{l.label}</a>)}
              <a href="#cotizador" className="mt-2 py-3 text-center text-sm font-bold rounded-full" style={{ background: "#272B7C", color: "#ffffff" }} onClick={() => setMobileOpen(false)}>Simular cotización</a>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: "#F7F8FF" }}>
        {/* Background shape — solo desde md, donde el hero pasa a 2 columnas (avatar/mapa incluidos) */}
        <div className="hidden md:block absolute inset-0 pointer-events-none">
          {/* Base: dark navy canvas for the lava lamp */}
          <div className="absolute top-0 right-0 w-[55%] h-full" style={{ background: "#0a0d3d" }} />
          {/* Lava blobs — larger + faster for vivid integration */}
          <div className="absolute" style={{ top: "0%",  right: "5%",  width: 420, height: 420, borderRadius: "50%", background: "#1800AD", filter: "blur(55px)", opacity: 0.95, animation: "blob1 11s ease-in-out infinite" }} />
          <div className="absolute" style={{ top: "35%", right: "20%", width: 380, height: 380, borderRadius: "50%", background: "#FFDE59", filter: "blur(50px)", opacity: 0.85, animation: "blob2 13s ease-in-out infinite" }} />
          <div className="absolute" style={{ top: "50%", right: "0%",  width: 380, height: 380, borderRadius: "50%", background: "#3D2FCC", filter: "blur(48px)", opacity: 0.90, animation: "blob3 10s ease-in-out infinite" }} />
          <div className="absolute" style={{ top: "10%", right: "30%", width: 300, height: 300, borderRadius: "50%", background: "#5B3FD4", filter: "blur(45px)", opacity: 0.80, animation: "blob4 12s ease-in-out infinite" }} />
          <div className="absolute" style={{ top: "65%", right: "28%", width: 280, height: 280, borderRadius: "50%", background: "#FFDE59", filter: "blur(44px)", opacity: 0.65, animation: "blob1 14s ease-in-out infinite reverse" }} />
          <div className="absolute" style={{ top: "25%", right: "2%",  width: 260, height: 260, borderRadius: "50%", background: "#272B7C", filter: "blur(42px)", opacity: 0.75, animation: "blob2 9s ease-in-out infinite reverse" }} />
        </div>

        {/* Avatar + mapa: posicionados sobre el panel navy REAL (55% de la sección),
            no sobre la columna angosta del grid de abajo (esa tiene tope por max-w-6xl
            y en pantallas anchas queda descentrada respecto al panel navy).
            Oculto en mobile: a una sola columna esta capa (con medidas fijas en px)
            queda encima del texto — hasta que tengamos una versión mobile propia. */}
        <div className="hidden md:block absolute right-0 overflow-hidden" style={{ top: 0, width: "55%", height: 840, zIndex: 5 }}>
          {/* Mapa sin recortar, grande, pegado al borde derecho del panel (capa de
              fondo) y el avatar por encima, con el brazo montándose sobre el mapa —
              mismo nivel espacial/tamaño/posición que la referencia del cliente. */}
          <div className="relative w-full h-full" style={{ transform: "translateX(-70px)" }}>
            <ColombiaMap />
            {/* Clic en el avatar del hero también abre el chat (Joel) — no solo
                el botón flotante de la esquina. */}
            <div className="absolute cursor-pointer" style={{ left: 170, bottom: 100, zIndex: 20 }}
              onClick={() => setChatOpen(true)} title="Hablar con Joel" role="button" aria-label="Hablar con Joel">
              <AnimatedAvatar src={avatarImg} alt="Asesor Transarchivos" />
            </div>
          </div>
        </div>

        {/* Sin max-w-6xl: el texto debe alinearse con el panel claro real (45% de la
            sección), igual que el avatar/mapa se alinea con el panel navy (55%). Con
            max-w-6xl, en monitores muy anchos el contenido quedaba centrado dentro de
            una caja angosta, muy a la derecha del borde real y con un vacío enorme a
            la izquierda. */}
        <div className="relative px-8 md:px-16 pt-36 md:pt-40 pb-16 grid md:grid-cols-[45%_55%] gap-8 items-start">
          {/* Lápiz: sin recortar, se deja sangrar un poco por el borde izquierdo
              como antes (no tiene problema de encimarse con el panel navy). */}
          <img src={lapizImg} alt="" aria-hidden="true"
            className="hidden md:block absolute pointer-events-none select-none"
            style={{ top: 90, left: -24, width: 340, height: "auto", opacity: 0.14, zIndex: 0 }} />
          {/* Escudo: SÍ necesita recorte — al moverlo hacia la derecha el pie se
              salía sobre el panel navy. El ancho del contenedor tiene que
              calzar con el 45%/55% del propio panel navy (que se mide sobre el
              ancho TOTAL de la sección, sin restar el padding) — no con el 45%
              de la columna del grid (que sí resta el padding y quedaba ~6px
              más ancho, dejando un pedazo asomado sobre el navy). */}
          <div className="hidden md:block absolute pointer-events-none overflow-hidden"
            style={{ top: 0, bottom: 0, left: 0, width: "45%", zIndex: 0 }}>
            <img src={escudoImg} alt="" aria-hidden="true" className="absolute select-none"
              style={{ bottom: 80, left: "65%", width: 300, height: "auto", opacity: 0.14 }} />
          </div>

          {/* LEFT — copy. Centrada en mobile/columna única. Desde md, el bloque se
              centra DENTRO del panel claro (45%) en vez de pegarse al borde, con el
              texto alineado a la izquierda dentro de ese bloque — igual que el avatar
              se centra dentro del panel navy. */}
          {/* w-full (ancho DEFINIDO = 100% de la columna del grid), tope en max-w-lg:
              con solo max-w-lg (sin w-full) este bloque se encogía/agrandaba al ritmo
              del propio h1 (cuya línea "bajo [palabra]." cambia de ancho al rotar de
              palabra) — y al recentrarse con mx-auto, arrastraba con él a la insignia,
              el párrafo y los botones. Con un ancho explícito (no "auto") el bloque no
              se mueve nunca; solo se mueve el punto "." al final del h1, dentro de su
              propia línea. w-full en vez de un px fijo para no desbordar la columna
              del grid en pantallas medianas (~768–1265px), donde el 45% es angosto. */}
          <div className="relative text-center md:text-left md:w-full md:max-w-lg md:mx-auto" style={{ zIndex: 1, marginTop: 80 }}>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight" style={{ fontFamily: "Poppins, sans-serif", color: "#272B7C", lineHeight: 1.1, marginBottom: 4 }}>
              Sus archivos,<br />
              bajo <CyclingWord />.
            </h1>
            {/* Underline — ancho fijo, no depende del contenedor */}
            <div className="flex justify-center md:justify-start" style={{ marginBottom: 24, marginTop: 2 }}>
              <svg width="340" height="10" viewBox="0 0 340 10" fill="none">
                <path d="M0 7 Q85 1 170 6 Q255 11 340 5" stroke="#FFDE59" strokeWidth="5" fill="none" strokeLinecap="round"/>
              </svg>
            </div>

            <p className="text-lg mb-10 max-w-sm mx-auto md:mx-0" style={{ color: "#6B7280" }}>
              Clasificamos, digitalizamos, custodiamos y destruimos legalmente sus documentos — con certificación y trayectoria real.
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-12">
              <a href="#cotizador"
                className="px-7 py-4 rounded-2xl font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-lg"
                style={{ background: "#272B7C", color: "#fff", fontFamily: "Montserrat, sans-serif", boxShadow: "0 8px 24px rgba(39,43,124,0.28)" }}>
                Agendar diagnóstico
              </a>
              <a href="#servicios"
                className="px-7 py-4 rounded-2xl font-bold text-sm border-2 transition-all hover:scale-105 active:scale-95"
                style={{ color: "#272B7C", borderColor: "#272B7C", background: "#fff", fontFamily: "Montserrat, sans-serif" }}>
                Ver servicios
              </a>
            </div>

            {/* Social proof row */}
            <div className="flex items-center justify-center md:justify-start gap-6 flex-wrap">
              {[
                { val: "40+", label: "años" },
                { val: "ISO 9001", label: "certificados" },
                { val: "1983", label: "pioneros en Bogotá" },
              ].map(s => (
                <div key={s.val} className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold" style={{ fontFamily: "Poppins, sans-serif", color: "#272B7C" }}>{s.val}</span>
                  <span className="text-xs" style={{ color: "#9B9B9B", fontFamily: "Montserrat, sans-serif" }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — celda vacía: solo reserva el ancho/alto de la columna en el grid.
              El avatar y el mapa reales se dibujan en la capa absoluta de arriba,
              alineada al panel navy completo en vez de a esta columna con tope. */}
          <div aria-hidden="true" style={{ minHeight: 620 }} />
        </div>

        {/* Bottom trust bar */}
        <div className="relative border-t py-4" style={{ borderColor: "#E9E9E7", background: "#fff" }}>
          <div className="max-w-6xl mx-auto px-8 flex flex-wrap justify-center md:justify-between items-center gap-4">
            {["Ley 594 de 2000", "ISO 9001", "Norma AGN", "Certificado de destrucción", "Custodia con vigilancia 24 h"].map(t => (
              <span key={t} className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "#6B7280", fontFamily: "Montserrat, sans-serif" }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6.5" stroke="#272B7C" strokeOpacity=".3"/><path d="M4 7l2 2 4-4" stroke="#272B7C" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── DIAGNÓSTICO DOCUMENTAL (producto de entrada) ─────────────────────
          Antes vivía al final de "Cómo trabajamos"; ahora se presenta antes
          de las unidades de negocio, como punto de partida para quien no
          sabe qué servicio necesita — el "producto nuevo" de la casa. */}
      <section className="relative overflow-hidden py-16" style={{ background: "#fff" }}>
        <div className="max-w-6xl mx-auto px-6 relative">
          <img src={egProducto1Img} alt="" aria-hidden="true"
            className="hidden xl:block absolute pointer-events-none select-none"
            style={{ width: 220, height: "auto", bottom: 220, left: -195, zIndex: 0 }} />
          <img src={egProducto2Img} alt="" aria-hidden="true"
            className="hidden xl:block absolute pointer-events-none select-none"
            style={{ width: 340, height: "auto", bottom: 260, right: -275, zIndex: 0 }} />

          <div className="relative overflow-hidden rounded-3xl p-6 md:p-9"
            style={{ background: "#fff", border: "1.5px solid #E4E6F7", boxShadow: "0 30px 60px -34px rgba(39,43,124,0.3)", paddingBottom: 46 }}>
            <Bi n="search" size={280} color="#272B7C"
              className="hidden md:block absolute pointer-events-none select-none"
              style={{ top: -50, right: -50, opacity: 0.04, transform: "rotate(12deg)" }} />

            <div className="relative max-w-2xl">
              <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3"
                style={{ background: "linear-gradient(135deg, #272B7C, #1800AD)", color: "#fff", fontFamily: "Montserrat, sans-serif", boxShadow: "0 8px 16px -8px rgba(39,43,124,0.5)" }}>
                Diagnóstico documental
              </span>
              <h3 className="text-xl md:text-2xl font-bold mb-2.5" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif", lineHeight: 1.25 }}>
                La <span style={{ background: "linear-gradient(transparent 62%, #FFDE59 62%)" }}>radiografía completa</span> de su archivo, antes de mover un solo papel
              </h3>
              <p className="text-sm" style={{ color: "#6B6B6B", lineHeight: 1.6 }}>
                No le preguntamos qué servicio quiere: le mostramos qué está pasando hoy con su archivo, para que decida con información real — no con suposiciones.
              </p>
            </div>

            {/* Línea de tiempo del resultado */}
            <div className="relative grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 mb-6">
              <div className="hidden md:block absolute" style={{ top: 16, left: "12.5%", right: "12.5%", height: 2, background: "#E4E6F7" }} />
              {["Diagnóstico", "Hallazgos", "Plan de acción", "Propuesta"].map((s, i) => (
                <div key={s} className="relative flex flex-col items-center text-center gap-1.5">
                  <span className="flex items-center justify-center rounded-full font-bold text-xs relative"
                    style={{ width: 32, height: 32, background: i === 0 ? "#272B7C" : "#fff", color: i === 0 ? "#fff" : "#272B7C", border: "2px solid #272B7C", fontFamily: "Poppins, sans-serif" }}>
                    {i + 1}
                  </span>
                  <span className="text-[11px] font-semibold" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif" }}>{s}</span>
                </div>
              ))}
            </div>

            <p className="relative text-[10px] font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: "#9B9B9B", fontFamily: "Montserrat, sans-serif" }}>
              <span style={{ width: 16, height: 2, borderRadius: 1, background: "#C8960A" }} />
              Lo que identifica
            </p>
            <div className="relative flex flex-wrap justify-center gap-2 mb-5">
              {[
                { i: monoVolumen, t: "Volumen y estado documental", d: "Cuántos documentos tiene y en qué condición se encuentran" },
                { i: monoEspacio, t: "Espacio ocupado", d: "Metros lineales o cúbicos que ocupa su archivo hoy" },
                { i: monoInventario, t: "Inventario y organización", d: "Cómo están clasificados y si siguen la TRD vigente" },
                { i: monoDigitalizacion, t: "Oportunidades de digitalización", d: "Qué series pueden pasar a un flujo digital" },
                { i: monoEscudo, t: "Necesidades de custodia", d: "Qué debe resguardarse bajo condiciones controladas" },
                { i: monoDisposicionFinal, t: "Disposición final", d: "Qué documentos ya cumplieron su tiempo de retención" },
                { i: monoArchivoLupa, t: "Riesgos y oportunidades de mejora", d: "Vacíos normativos y puntos por optimizar" },
              ].map(({ i, t, d }) => (
                <div key={t} className="rounded-lg p-2.5 flex flex-col items-center text-center gap-1.5 w-[calc(50%-4px)] sm:w-[calc(25%-6px)]"
                  style={{ background: "#F7F8FF", border: "1px solid #E4E6F7" }}>
                  <div className="flex items-center justify-center rounded-lg" style={{ width: 32, height: 32, background: "#fff", boxShadow: "0 6px 16px -8px rgba(39,43,124,0.25)" }}>
                    <img src={i} alt="" className="select-none" style={{ width: 18, height: 18, objectFit: "contain" }} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold leading-snug mb-0.5" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>{t}</p>
                    <p className="text-[10px] leading-snug" style={{ color: "#8A8A8A" }}>{d}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative pt-5 flex justify-center" style={{ borderTop: "1px solid #E4E6F7" }}>
              <a href="#cotizador" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95"
                style={{ background: "#272B7C", color: "#fff", fontFamily: "Montserrat, sans-serif", textDecoration: "none", boxShadow: "0 14px 28px -10px rgba(39,43,124,0.45)" }}>
                Solicitar diagnóstico <Bi n="arrow-right" size={15} color="#fff" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* ── SERVICES ────────────────────────────────────────────────────── */}
      <section id="servicios" className="py-20" style={{ background: "#F7F8FF" }}>
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-bold uppercase tracking-widest text-center mb-3" style={{ color: "#9B9B9B", fontFamily: "Montserrat, sans-serif" }}>
            Lo que hacemos
          </p>
          <h2 className="text-3xl font-bold text-center mb-14" style={{ fontFamily: "Poppins, sans-serif", color: "#272B7C" }}>
            Soluciones documentales a la medida
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" style={{ marginTop: 40 }}>
            {services.map((s, i) => (
              i === 0 ? (
                <div key={s.title} className="relative">
                  <div className="relative" style={{ zIndex: 1 }}>
                    <ServiceCard service={s} />
                  </div>
                  {/* Personaje asomándose por la esquina de la primera card — el
                      cuerpo va DETRÁS (z-index menor que la card, así que la
                      card tapa lo que cae dentro de su área). La misma imagen
                      se repite ENCIMA (z-index mayor) pero recortada con
                      clip-path a solo la región de la manita, para que quede
                      la mano montada sobre la card sin que se vea el resto
                      del cuerpo duplicado. Estática (sin animación). */}
                  <img src={personajeCardImg} alt="" aria-hidden="true"
                    className="hidden lg:block absolute pointer-events-none select-none"
                    style={{ width: 170, height: "auto", top: -58, left: -65, zIndex: 0 }} />
                  <img src={personajeCardImg} alt="" aria-hidden="true"
                    className="hidden lg:block absolute pointer-events-none select-none"
                    style={{ width: 170, height: "auto", top: -58, left: -65, zIndex: 10, clipPath: "inset(38% 50% 43% 31%)" }} />
                </div>
              ) : i === 5 ? (
                <div key={s.title} className="relative">
                  <div className="relative" style={{ zIndex: 1 }}>
                    <ServiceCard service={s} />
                  </div>
                  {/* Personaje al lado DERECHO de la card "Destrucción de
                      Documentos" — más grande y más pegado, por ENCIMA de la
                      card (no detrás): la carpeta amarilla y la mano se dejan
                      montar sobre la card sin recortar, a propósito. */}
                  <img src={personajeCard2Img} alt="" aria-hidden="true"
                    className="hidden lg:block absolute pointer-events-none select-none"
                    style={{ width: 270, height: "auto", top: -25, right: -150, zIndex: 10 }} />
                </div>
              ) : (
                <ServiceCard key={s.title} service={s} />
              )
            ))}
          </div>

          {/* CTA */}
          <div className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl" style={{ background: "#EEF0FB", border: "1px solid #D5D9F5" }}>
            <p className="font-semibold text-sm text-center sm:text-left" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif" }}>
              ¿No sabe por dónde empezar? — Comience con un diagnóstico documental.
            </p>
            <a href="#cotizador" className="px-5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all hover:opacity-90"
              style={{ background: "#272B7C", color: "#ffffff", fontFamily: "Montserrat, sans-serif" }}>
              Agendar diagnóstico →
            </a>
          </div>
        </div>
      </section>

      <Divider />

      {/* ── MODELO: DIAGNÓSTICO → SOLUCIÓN → PROTECCIÓN → EXPANSIÓN ──────────
          Contenido del documento "Modelo de Negocio - Transarchivos". */}
      <section id="modelo" className="relative overflow-hidden py-20" style={{ background: "#fff" }}>
        {/* Patrón de fondo decorativo con los 2 elementos gráficos del cliente
            (eg-producto-1/2), repetidos a muy baja opacidad para unificar
            visualmente "Cómo trabajamos" y "Diagnóstico documental" como una
            sola franja — posiciones en % para que escale con el alto real de
            toda la sección (ambos bloques juntos). */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true" style={{ zIndex: 0 }}>
          {/* Un resplandor navy sutil (se quitó el dorado — se veía como una
              mancha amarilla pegada a la esquina). */}
          <div className="absolute rounded-full" style={{ width: 560, height: 560, top: "58%", left: "-10%", background: "radial-gradient(circle, rgba(24,0,173,0.08) 0%, transparent 70%)" }} />

          {/* 4 "carriles" (izq. borde, izq. interior, der. borde, der.
              interior). Cada carril es una pila vertical con separación fija
              (misma distancia siempre = "espacios iguales"), pero cada
              imagen tiene un pequeño jitter de posición/rotación/escala +
              elección aleatoria de cuál de los 2 gráficos usar (semilla fija,
              así que el resultado es "random" visualmente pero estable entre
              renders). El carril interior queda a suficiente distancia
              horizontal del exterior (>13% del ancho) para que, incluso con
              el jitter y la rotación al máximo, ningún elemento se monte
              sobre otro. */}
          {(() => {
            let seed = 42;
            const rand = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
            const SIZE = 230;
            const ROW_GAP = 300; // > tamaño de imagen + margen de sobra
            const lanes = [
              { side: "left" as const, x: -6, rows: 5, offset: 0 },
              { side: "left" as const, x: 26, rows: 5, offset: ROW_GAP / 2 },
              { side: "right" as const, x: -6, rows: 5, offset: 60 },
              { side: "right" as const, x: 26, rows: 5, offset: ROW_GAP / 2 + 60 },
            ];
            return lanes.flatMap((lane, li) =>
              Array.from({ length: lane.rows }, (_, i) => {
                const top = lane.offset + i * ROW_GAP + (rand() - 0.5) * 70; // jitter vertical, muy por debajo del ROW_GAP
                const x = lane.x + (rand() - 0.5) * 3; // jitter horizontal leve
                const img = rand() > 0.5 ? elementogSocio1Img : elementogSocio2Img;
                const rot = (rand() - 0.5) * 20; // ±10deg
                const scale = 0.85 + rand() * 0.3; // 0.85–1.15
                return (
                  <img key={`${li}-${i}`} src={img} alt="" style={{
                    position: "absolute", width: SIZE, top,
                    [lane.side]: `${x}%`,
                    opacity: 0.05, transform: `rotate(${rot}deg) scale(${scale})`,
                  }} />
                );
              })
            );
          })()}
        </div>

        <div className="relative max-w-6xl mx-auto px-6" style={{ zIndex: 1 }}>
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#9B9B9B", fontFamily: "Montserrat, sans-serif" }}>Cómo trabajamos</p>
            <h2 className="text-3xl md:text-4xl font-bold max-w-3xl mx-auto" style={{ fontFamily: "Poppins, sans-serif", color: "#272B7C", lineHeight: 1.2 }}>
              Su socio integral para <span style={{ background: "linear-gradient(transparent 62%, #FFDE59 62%)" }}>todo el ciclo de vida documental</span>
            </h2>
            <p className="text-sm mt-4 max-w-2xl mx-auto" style={{ color: "#6B6B6B" }}>
              Le ayudamos a diagnosticar, organizar, transformar, proteger y disponer correctamente de su información documental. Cada servicio cumple una función dentro de un mismo recorrido.
            </p>
          </div>

          <div className="relative grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { n: 1, t: "Diagnóstico", k: "Entrada", ic: "clipboard2-pulse-fill", c: "#C8960A", d: "Detectamos su necesidad y abrimos la relación entendiendo qué pasa hoy con su archivo.", g: "linear-gradient(135deg, #B8860B 0%, #E5AE1A 100%)",
                items: [{ i: monoArchivoLupa, l: "Diagnóstico documental", href: "#cotizador" }, { i: monoClasificacion, l: "Levantamiento de inventario", to: "/servicios/levantamiento-de-inventario" }] },
              { n: 2, t: "Solución", k: "Transformación", ic: "gear-wide-connected", c: "#272B7C", d: "Resolvemos el problema documental con un proyecto a la medida.", g: "linear-gradient(135deg, #272B7C 0%, #4B50A0 100%)",
                items: [{ i: monoDigitalizacion, l: "Digitalización", to: "/servicios/digitalizacion-de-documentos" }, { i: monoCarpeta, l: "Programa de Gestión Documental", to: "/servicios/programa-de-gestion-documental" }] },
              { n: 3, t: "Protección", k: "Recurrencia", ic: "shield-fill-check", c: "#1800AD", d: "Protegemos su información y la mantenemos disponible cuando la necesite.", g: "linear-gradient(135deg, #1800AD 0%, #5B3FD4 100%)",
                items: [{ i: monoCandado, l: "Custodia de archivos", to: "/servicios/custodia-de-archivos" }, { i: monoEscudo, l: "Custodia de medios magnéticos", to: "/servicios/custodia-de-medios-magneticos" }] },
              { n: 4, t: "Expansión", k: "Nuevos proyectos", ic: "rocket-takeoff-fill", c: "#272B7C", d: "Cerramos el ciclo de vida documental y ampliamos el valor de la relación.", g: "linear-gradient(135deg, #14163F 0%, #272B7C 100%)",
                items: [{ i: monoDestruccion, l: "Destrucción legal", to: "/servicios/destruccion-de-documentos" }, { i: monoRayo, l: "Servicio inmediato", to: "/servicios/servicio-inmediato" }, { i: monoInhouse, l: "Servicio Inhouse", to: "/servicios/servicio-inhouse" }] },
            ].map((st, idx, arr) => (
              <div key={st.n} className="group relative rounded-3xl flex flex-col transition-all hover:-translate-y-2"
                style={{ background: "#fff", border: "1.5px solid #E4E6F7", boxShadow: "0 18px 40px -24px rgba(39,43,124,0.4)" }}>
                <div className="relative px-6 pt-6 pb-7 overflow-hidden" style={{ background: st.g, borderRadius: "22px 22px 0 0", minHeight: 150 }}>
                  <span className="absolute select-none pointer-events-none font-bold" style={{ right: -6, top: -22, fontSize: 130, lineHeight: 1, color: "rgba(255,255,255,0.14)", fontFamily: "Poppins, sans-serif" }}>{st.n}</span>
                  <div className="relative">
                    <span className="inline-flex items-center justify-center mb-3" style={{ width: 46, height: 46, borderRadius: 14, background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.35)", backdropFilter: "blur(4px)" }}>
                      <Bi n={st.ic} size={23} color="#fff" />
                    </span>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: "rgba(255,255,255,0.8)", fontFamily: "Montserrat, sans-serif" }}>Paso {st.n} · {st.k}</p>
                    <p className="text-2xl font-bold" style={{ color: "#fff", fontFamily: "Poppins, sans-serif" }}>{st.t}</p>
                  </div>
                </div>
                <div className="flex flex-col flex-1 p-6">
                  <p className="text-sm mb-5" style={{ color: "#6B6B6B", lineHeight: 1.6 }}>{st.d}</p>
                  <ul className="space-y-2 mt-auto">
                    {st.items.map(it => {
                      const inner = (
                        <>
                          <span className="flex items-center justify-center rounded-xl shrink-0" style={{ width: 38, height: 38, background: "#F7F8FF", border: "1px solid #E4E6F7" }}>
                            <img src={it.i} alt="" style={{ width: 24, height: 24, objectFit: "contain" }} />
                          </span>
                          <span className="flex-1">{it.l}</span>
                          <Bi n="arrow-right" size={14} color="#1800AD" className="transition-transform group-hover/item:translate-x-1" />
                        </>
                      );
                      const cls = "group/item flex items-center gap-3 text-xs font-semibold rounded-2xl px-2.5 py-2 transition-colors hover:bg-[#F7F8FF]";
                      const sty = { color: "#272B7C", fontFamily: "Montserrat, sans-serif", textDecoration: "none" } as const;
                      return (
                        <li key={it.l}>
                          {"to" in it && it.to
                            ? <Link to={it.to} className={cls} style={sty}>{inner}</Link>
                            : <a href={it.href} className={cls} style={sty}>{inner}</a>}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                {idx < arr.length - 1 && (
                  <span className="hidden lg:flex absolute items-center justify-center rounded-full z-10 font-bold"
                    style={{ width: 34, height: 34, top: 36, right: -29, background: "#FFDE59", color: "#1800AD", boxShadow: "0 8px 18px -6px rgba(200,150,10,0.6)", fontSize: 16 }}><Bi n="arrow-right" size={17} color="#1800AD" style={{ WebkitTextStroke: "0.5px #1800AD" }} /></span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── ASESOR IA ─────────────────────────────────────────────────────
          Protagoniza a "Joel" como asesor inteligente (no un simple
          formulario de contacto): mismo degradado navy + glow dorado que el
          resto del sitio (antes tenía un fondo morado/magenta con blobs que
          no combinaba con la paleta de marca), copy orientado a generar la
          necesidad de hablarle, y un mockup de chat más grande y "vivo"
          (indicador de escritura). Reubicada justo después de Servicios
          para capturar la intención de compra en caliente. */}
      <section className="relative overflow-hidden py-8" style={{ background: "linear-gradient(135deg, #14163F 0%, #272B7C 55%, #1800AD 100%)" }}>
        <div className="max-w-6xl mx-auto px-6 relative" style={{ zIndex: 1 }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left: copy */}
            <div>
              <h2 className="text-2xl font-bold mb-2.5" style={{ fontFamily: "Poppins, sans-serif", color: "#fff", lineHeight: 1.2 }}>
                Conozca a <span style={{ color: "#FFDE59" }}>Joel</span>, su asesor inteligente
              </h2>
              <p className="text-sm max-w-md" style={{ color: "rgba(255,255,255,0.75)" }}>
                Cuéntele qué está pasando con su archivo físico o digital: Joel identifica si necesita diagnóstico, custodia, digitalización o destrucción certificada, bajo la normativa archivística vigente, y lo conecta con el especialista indicado. Disponible 24/7, sin formularios ni esperas.
              </p>
            </div>

            {/* Centro: botón entre el texto y el avatar. */}
            <button onClick={() => setChatOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95 flex-shrink-0"
              style={{ background: "#FFDE59", color: "#1800AD", fontFamily: "Montserrat, sans-serif", boxShadow: "0 8px 24px rgba(255,222,89,0.25)" }}>
              Hablar con Joel ahora
              <span>→</span>
            </button>

            {/* Right: foto de perfil de la IA — más discreta (círculo chico,
                anillos finos) que antes, para que la sección no alargue tanto
                el scroll de la página. */}
            <div className="relative flex justify-center flex-shrink-0">
              <div className="absolute rounded-full pointer-events-none" style={{ width: 195, height: 195, top: "50%", left: "50%", transform: "translate(-50%,-50%)", border: "1.5px dashed rgba(255,222,89,0.4)", zIndex: 0 }} />
              <div className="absolute rounded-full pointer-events-none" style={{ width: 172, height: 172, top: "50%", left: "50%", transform: "translate(-50%,-50%)", border: "1.5px solid rgba(255,222,89,0.22)", zIndex: 0 }} />
              <button onClick={() => setChatOpen(true)} aria-label="Hablar con Joel"
                className="relative transition-transform hover:scale-[1.03] active:scale-95 cursor-pointer" style={{ zIndex: 1 }}>
                <div className="rounded-full overflow-hidden mx-auto" style={{ width: 144, height: 144, boxShadow: "0 20px 46px rgba(0,0,0,0.4), 0 0 0 6px rgba(255,222,89,0.18), 0 0 0 2px rgba(255,255,255,0.25)" }}>
                  <ChatAvatarFace size={144} ring={undefined} />
                </div>
                <span className="absolute bottom-3 right-3 w-4 h-4 rounded-full border-[3px]" style={{ background: "#22c55e", borderColor: "#14163F" }} />
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap" style={{ background: "#FFDE59", color: "#1800AD", fontFamily: "Montserrat, sans-serif", boxShadow: "0 8px 20px rgba(0,0,0,0.25)" }}>
                  Joel · IA
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap" style={{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)", fontFamily: "Montserrat, sans-serif", backdropFilter: "blur(4px)" }}>
                  ● En línea ahora
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      <Divider />

      <QuoteSimulator />

      <Divider />

      <BlogSection />

      <Divider />

      {/* ── VIDEOS + REDES SOCIALES ───────────────────────────────────────────
          3 videos reales del canal de YouTube de Transarchivos
          (youtube.com/@Transarchivosltda), elegidos por el cliente —
          embebidos vía youtube-nocookie.com (modo de privacidad ampliada).
          Las redes sociales, que antes vivían en la sección de Contacto
          (eliminada), se muestran acá debajo del canal de YouTube. */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#9B9B9B", fontFamily: "Montserrat, sans-serif" }}>Conéctese con nosotros</p>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "Poppins, sans-serif", color: "#272B7C" }}>
            Contenido y redes sociales de Transarchivos
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            { id: "a_t-MWf08k8", title: "¡Evite sanciones en auditorías 2026! Cómo preparar su archivo empresarial HOY · #JoelTeLoCuenta" },
            { id: "V39D_X_ip34", title: "Ley 594 de 2000 en Colombia: qué es, cómo se aplica y por qué cumplirla · #JoelTeLoCuenta" },
            { id: "7eK4K0Smbt0", title: "¿Qué es un diagnóstico documental y para qué sirve? · Servicio Transarchivos" },
          ].map(v => (
            <div key={v.id} className="rounded-2xl overflow-hidden" style={{ border: "1px solid #E9E9E7", boxShadow: "0 20px 40px -24px rgba(39,43,124,0.25)" }}>
              <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${v.id}`}
                  title={v.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <p className="p-4 text-sm font-semibold leading-snug" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif" }}>{v.title}</p>
            </div>
          ))}
        </div>

        <div className="text-center mb-10">
          <a href="https://www.youtube.com/@Transarchivosltda" target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all hover:scale-105"
            style={{ background: "#272B7C", color: "#fff", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
            <Bi n="youtube" size={16} color="#fff" />
            Ver más en nuestro canal
          </a>
        </div>

        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#9B9B9B", fontFamily: "Montserrat, sans-serif" }}>Síganos en nuestras redes</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { n: "LinkedIn", ic: "linkedin", u: "https://linkedin.com/company/transarchivos-ltda01" },
              { n: "Facebook", ic: "facebook", u: "https://facebook.com/profile.php?id=61569443213087" },
              { n: "Instagram", ic: "instagram", u: "https://instagram.com/transarchivos" },
              { n: "TikTok", ic: "tiktok", u: "https://tiktok.com/@transarchivos" },
              { n: "YouTube", ic: "youtube", u: "https://youtube.com/@Transarchivosltda" },
            ].map(({ n: r, ic, u }) => (
              <a key={r} href={u} target="_blank" rel="noreferrer" aria-label={r} title={r} className="flex items-center justify-center transition-all hover:-translate-y-0.5"
                style={{ width: 40, height: 40, borderRadius: 12, background: "#272B7C14", textDecoration: "none" }}>
                <Bi n={ic} size={19} color="#272B7C" />
              </a>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── POR QUÉ TRANSARCHIVOS ────────────────────────────────────────────
          Franja de confianza (5 diferenciales), a los colores de marca y con
          contenido real del modelo de negocio / documento maestro: cumplimiento
          normativo, custodia con vigilancia 24 h, costo variable y escalable,
          servicios ágiles/in-house/inmediatos, y trayectoria desde 1983.
          Después de Contacto; fondo claro y sobrio — sigue usando navy/dorado
          de marca, pero sin el degradado fuerte. */}
      <section className="relative overflow-hidden" style={{ background: "#F7F8FF" }}>
        <div className="relative max-w-6xl mx-auto px-6 py-5">
          <div className="grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x" style={{ borderColor: "#E4E6F7" }}>
            {[
              { ic: "shield-check", t: "Cumplimiento normativo", d: "Operamos bajo la Ley 594 de 2000, el AGN y certificación ISO 9001." },
              { ic: "camera-video-fill", t: "Custodia con vigilancia 24/7", d: "Centro documental con CCTV, control de acceso y monitoreo ambiental permanente." },
              { ic: "graph-up-arrow", t: "Costo variable y escalable", d: "Paga por el volumen exacto que custodia, sin costos fijos de espacio o personal." },
              { ic: "lightning-charge-fill", t: "Ágil, in-house e inmediato", d: "Del diagnóstico al despacho express, adaptados al ritmo de su operación." },
              { ic: "award-fill", t: "Trayectoria desde 1983", d: "Pioneros de la gestión documental en Colombia, con más de 40 años de experiencia." },
            ].map(f => (
              <div key={f.t} className="flex flex-col items-center text-center gap-1.5 px-4 py-2.5 md:py-0" style={{ borderColor: "#E4E6F7" }}>
                <span className="flex items-center justify-center rounded-full shrink-0" style={{ width: 34, height: 34, border: "1.5px solid #C8960A" }}>
                  <Bi n={f.ic} size={14} color="#C8960A" />
                </span>
                <div>
                  <p className="text-xs font-bold mb-0.5" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>{f.t}</p>
                  <p className="text-[11px] leading-snug" style={{ color: "#6B6B6B" }}>{f.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── FOOTER ───────────────────────────────────────────────────────────
          Rediseñado: fondo propio (antes se fundía con el blanco de la
          sección de arriba), enlaces reales en vez de "#" muertos (cada
          servicio a su propia página, "Empresa" a los anclajes reales de
          /nosotros), columna de contacto (con los datos reales que antes
          vivían en la sección de Contacto, eliminada), e íconos de redes
          en vez de texto plano en la barra inferior. */}
      <footer style={{ background: "#F7F8FF" }}>
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div>
              <Logo size="sm" />
              <p className="mt-4 text-sm leading-relaxed max-w-xs" style={{ color: "#8A8A8A" }}>
                Empresa colombiana de gestión documental. Clasificación, digitalización, custodia, conservación y destrucción legal de archivos bajo normativa AGN.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif" }}>Servicios</p>
              <ul className="space-y-2.5">
                {services.map(s => (
                  <li key={s.title}>
                    <Link to={`/servicios/${s.slug}`} className="text-sm transition-colors" style={{ color: "#6B6B6B" }}
                      onMouseEnter={e => e.currentTarget.style.color = "#1800AD"} onMouseLeave={e => e.currentTarget.style.color = "#6B6B6B"}>
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif" }}>Empresa</p>
              <ul className="space-y-2.5">
                {[
                  { label: "Quiénes somos", to: "/nosotros#quienes-somos" },
                  { label: "Nuestra historia", to: "/nosotros#historia" },
                  { label: "Normativa y certificados", to: "/nosotros#certificados" },
                  { label: "Nuestros clientes", to: "/nosotros#clientes" },
                ].map(item => (
                  <li key={item.label}>
                    <Link to={item.to} className="text-sm transition-colors" style={{ color: "#6B6B6B" }}
                      onMouseEnter={e => e.currentTarget.style.color = "#1800AD"} onMouseLeave={e => e.currentTarget.style.color = "#6B6B6B"}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif" }}>Contacto</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5 text-sm" style={{ color: "#6B6B6B" }}>
                  <Bi n="geo-alt-fill" size={14} color="#C8960A" style={{ marginTop: 3, flexShrink: 0 }} />
                  Cl. 21 # 39A-40, Bogotá, Colombia
                </li>
                <li>
                  <a href="tel:+576013164530" className="flex items-start gap-2.5 text-sm transition-colors" style={{ color: "#6B6B6B" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#1800AD"} onMouseLeave={e => e.currentTarget.style.color = "#6B6B6B"}>
                    <Bi n="telephone-fill" size={14} color="#C8960A" style={{ marginTop: 3, flexShrink: 0 }} />
                    (601) 316-4530
                  </a>
                </li>
                <li>
                  <a href="mailto:info@transarchivos.com" className="flex items-start gap-2.5 text-sm transition-colors break-all" style={{ color: "#6B6B6B" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#1800AD"} onMouseLeave={e => e.currentTarget.style.color = "#6B6B6B"}>
                    <Bi n="envelope-fill" size={14} color="#C8960A" style={{ marginTop: 3, flexShrink: 0 }} />
                    info@transarchivos.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="h-px" style={{ background: "#E4E6F7" }} />

          <div className="pt-6 flex flex-wrap justify-between items-center gap-4">
            <p className="text-xs" style={{ color: "#9B9B9B" }}>© {new Date().getFullYear()} Transarchivos Ltda. · Bogotá, Colombia</p>
            <div className="flex gap-2">
              {[
                { n: "LinkedIn", ic: "linkedin", u: "https://linkedin.com/company/transarchivos-ltda01" },
                { n: "Facebook", ic: "facebook", u: "https://facebook.com/profile.php?id=61569443213087" },
                { n: "Instagram", ic: "instagram", u: "https://instagram.com/transarchivos" },
                { n: "TikTok", ic: "tiktok", u: "https://tiktok.com/@transarchivos" },
                { n: "YouTube", ic: "youtube", u: "https://youtube.com/@Transarchivosltda" },
              ].map(({ n: r, ic, u }) => (
                <a key={r} href={u} target="_blank" rel="noreferrer" aria-label={r} title={r} className="flex items-center justify-center transition-all hover:-translate-y-0.5"
                  style={{ width: 34, height: 34, borderRadius: 10, background: "#272B7C14", textDecoration: "none" }}>
                  <Bi n={ic} size={15} color="#272B7C" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <ChatBot open={chatOpen} setOpen={setChatOpen} />
    </div>
  );
}

// ─── Página "Nosotros" ──────────────────────────────────────────────────────
// Contenido tomado del Documento maestro y de "Misión y visión" (carpeta
// RecursosTransarchivos) — es la misma información que antes vivía apretada
// en la sección #nosotros de la landing, ahora repartida en su propia página
// con un anclaje real por cada ítem del menú desplegable "Nosotros".
// "Nuestro equipo", "Cultura organizacional" y "Aliados tecnológicos" no
// tienen nombres, fotos ni logos reales en los documentos fuente, así que en
// vez de inventarlos se muestran con los hechos reales más cercanos (cómo se
// forma y organiza el personal, los valores corporativos, la infraestructura
// de seguridad) — "Aliados tecnológicos" se presenta honestamente como
// "Tecnología y seguridad".

function NosotrosKicker({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <img src={icon} alt="" className="w-10 h-10 object-contain shrink-0" />
      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#9B9B9B", fontFamily: "Montserrat, sans-serif" }}>{label}</p>
    </div>
  );
}

function NosotrosPage() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth", block: "start" }));
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  const inPageNav = [
    { l: "Quiénes somos", a: "quienes-somos" },
    { l: "Nuestra historia", a: "historia" },
    { l: "Misión y visión", a: "mision-vision" },
    { l: "Nuestro equipo", a: "equipo" },
    { l: "Cultura", a: "cultura" },
    { l: "Clientes", a: "clientes" },
    { l: "Tecnología y seguridad", a: "aliados" },
    { l: "Certificados", a: "certificados" },
  ];

  return (
    <div className="min-h-full" style={{ background: "#fff", fontFamily: "Inter, sans-serif", color: "#37352F" }}>
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #14163F 0%, #272B7C 55%, #1800AD 100%)" }}>
        <div className="absolute pointer-events-none rounded-full" style={{ width: 560, height: 560, top: -220, right: -160, background: "radial-gradient(circle, rgba(255,222,89,0.22) 0%, transparent 70%)" }} />
        <div className="absolute pointer-events-none rounded-full" style={{ width: 420, height: 420, bottom: -180, left: -160, background: "radial-gradient(circle, rgba(24,0,173,0.3) 0%, transparent 70%)" }} />

        <div className="relative max-w-5xl mx-auto px-6 pt-6 pb-16" id="quienes-somos" style={{ scrollMarginTop: 24 }}>
          <div className="flex items-center justify-between mb-14">
            <Link to="/" className="rounded-xl px-3 py-1.5" style={{ background: "rgba(255,255,255,0.95)" }}>
              <img src={logoImg} alt="Transarchivos" style={{ height: 30, width: "auto" }} />
            </Link>
            <Link to="/" className="text-xs font-bold px-4 py-2 rounded-full transition-all hover:scale-105"
              style={{ background: "rgba(255,255,255,0.14)", color: "#fff", border: "1px solid rgba(255,255,255,0.35)", fontFamily: "Montserrat, sans-serif", textDecoration: "none", backdropFilter: "blur(6px)" }}>
              <Bi n="arrow-left" size={13} color="#fff" className="mr-1.5" style={{ verticalAlign: "-1px" }} />Volver al inicio
            </Link>
          </div>

          <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-5"
            style={{ background: "#FFDE59", color: "#1800AD", fontFamily: "Montserrat, sans-serif" }}>Quiénes somos</span>
          <h1 className="text-4xl md:text-5xl font-bold max-w-3xl" style={{ color: "#fff", fontFamily: "Poppins, sans-serif", lineHeight: 1.15 }}>
            Pioneros de la gestión documental en Colombia <span style={{ color: "#FFDE59" }}>desde 1983</span>
          </h1>
          <p className="text-base md:text-lg max-w-2xl mt-6" style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>
            En Transarchivos Ltda llevamos más de 40 años ayudando a empresas a transformar su gestión documental en una ventaja competitiva. Nacimos en 1983 para atender a Ecopetrol y desde entonces no hemos dejado de evolucionar. Fuimos pioneros en crear en Bogotá uno de los primeros centros especializados en custodia documental.
          </p>

          <div className="grid grid-cols-3 gap-4 mt-10 max-w-xl">
            {[["40+", "Años de experiencia"], ["1983", "Año de fundación"], ["ISO 9001", "Certificación de calidad"]].map(([v, l]) => (
              <div key={l} className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
                <p className="font-bold" style={{ color: "#FFDE59", fontFamily: "Poppins, sans-serif", fontSize: v.length > 5 ? 20 : 26 }}>{v}</p>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navegación interna */}
      <div className="sticky top-0 z-20" style={{ background: "rgba(255,255,255,0.94)", backdropFilter: "blur(8px)", borderBottom: "1px solid #E4E6F7" }}>
        <div className="max-w-5xl mx-auto px-6 py-3 flex gap-2 overflow-x-auto">
          {inPageNav.map(n => (
            <a key={n.a} href={`#${n.a}`}
              className="shrink-0 text-xs font-semibold px-3.5 py-2 rounded-full transition-colors hover:bg-[#EEF0FB]"
              style={{ color: "#272B7C", background: "#F7F8FF", border: "1px solid #E4E6F7", fontFamily: "Montserrat, sans-serif", textDecoration: "none", whiteSpace: "nowrap" }}>
              {n.l}
            </a>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-20">

        {/* Nuestra historia */}
        <section id="historia" style={{ scrollMarginTop: 76 }}>
          <NosotrosKicker icon={iconoHistoria} label="Nuestra historia" />
          <div className="grid lg:grid-cols-2 gap-6 mt-6">
            <div className="relative overflow-hidden rounded-3xl p-8 md:p-10 flex flex-col justify-between"
              style={{ background: "linear-gradient(135deg, #14163F 0%, #272B7C 55%, #1800AD 100%)", minHeight: 320 }}>
              <span className="absolute select-none pointer-events-none font-bold"
                style={{ right: -14, bottom: -64, fontSize: 170, lineHeight: 1, color: "rgba(255,255,255,0.05)", fontFamily: "Poppins, sans-serif" }}>1983</span>
              <span className="absolute select-none pointer-events-none"
                style={{ top: 10, left: 26, fontSize: 90, lineHeight: 1, color: "#FFDE59", fontFamily: "Georgia, serif" }}>“</span>
              <p className="relative text-lg leading-relaxed mt-10" style={{ color: "#fff", fontFamily: "Poppins, sans-serif", fontWeight: 500 }}>
                Nacimos en 1983 en respuesta a una necesidad puntual de Ecopetrol de gestionar su información documental. A partir de esa experiencia, adecuamos en Bogotá un centro de información documental con especificaciones técnicas de custodia y capacitamos a nuestro personal como archivistas bajo normas archivísticas avanzadas.
              </p>
              <div className="relative flex items-center gap-3 mt-8">
                <span className="w-8 h-0.5 rounded-full" style={{ background: "#FFDE59" }} />
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.75)", fontFamily: "Montserrat, sans-serif" }}>Primera empresa de gestión documental en Bogotá</p>
              </div>
            </div>
            <div className="rounded-3xl p-7" style={{ background: "#F7F8FF", border: "1.5px solid #E4E6F7" }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif" }}>En más de 4 décadas, hemos…</p>
              <ul className="space-y-3">
                {[
                  "Mantenido los estándares archivísticos de seguridad, accesibilidad, eficiencia, integridad, autenticidad y fiabilidad.",
                  "Permanecido alineados con la Ley 594 de 2000, la Resolución 8934 de 2014 y el Decreto 962 (Ley Antitrámites).",
                  "Obtenido la certificación de calidad internacional ISO 9001.",
                  "Atendido multinacionales, pymes, microempresas y compañías en liquidación o reestructuración.",
                  "Desarrollado instrumentos técnicos como TVD, TRD, digitalización, microfilmación y custodia física, digital y en la nube.",
                ].map((t, i) => (
                  <li key={i} className="flex gap-3 text-sm" style={{ color: "#6B6B6B", lineHeight: 1.6 }}>
                    <Bi n="check-circle-fill" size={15} color="#C8960A" style={{ marginTop: 3, flexShrink: 0 }} />{t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Misión y visión */}
        <section id="mision-vision" style={{ scrollMarginTop: 76 }}>
          <NosotrosKicker icon={iconoMisionVision} label="Misión y visión" />
          <div className="grid lg:grid-cols-2 gap-6 mt-6">
            {[
              { t: "Misión", ic: "bullseye", x: "Somos pioneros de la gestión documental en Colombia. Ofrecemos soluciones integrales de consultoría archivística, administración, custodia física y transformación digital de la información, bajo el estricto cumplimiento legal. A través de servicios ágiles, in-house e inmediatos, aseguramos la calidad operativa y la seguridad de los datos (confidencialidad, integridad y disponibilidad). Nos comprometemos con la mejora continua de nuestros procesos para superar las expectativas de nuestras partes interesadas y mitigar los riesgos del entorno." },
              { t: "Visión", ic: "binoculars-fill", x: "Para el año 2030, queremos consolidar nuestro liderazgo en Colombia como proveedores integrales de custodia física, consultoría archivística y transformación digital. Seremos reconocidos por la excelencia de nuestros estándares de calidad, la solidez en la seguridad de la información y la adopción de tecnologías seguras en la nube, garantizando un crecimiento sostenible que impulse el desarrollo y la estabilidad de nuestros colaboradores." },
            ].map(m => (
              <div key={m.t} className="rounded-3xl p-8" style={{ background: "#fff", border: "1.5px solid #E4E6F7", boxShadow: "0 14px 34px -22px rgba(39,43,124,0.25)" }}>
                <BiTile n={m.ic} accent="#272B7C" size={46} />
                <p className="text-lg font-bold mt-4 mb-3" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>{m.t}</p>
                <p className="text-sm leading-relaxed" style={{ color: "#6B6B6B" }}>{m.x}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Nuestro equipo */}
        <section id="equipo" style={{ scrollMarginTop: 76 }}>
          <NosotrosKicker icon={iconoEquipo} label="Nuestro equipo" />
          <p className="text-sm max-w-2xl mt-4 mb-6" style={{ color: "#6B6B6B", lineHeight: 1.7 }}>
            Nuestro personal técnico de archivo está capacitado bajo normas archivísticas avanzadas y los lineamientos del Archivo General de la Nación (AGN). En los proyectos Inhouse, Transarchivos asume la figura de empleador del personal en sitio — selección, capacitación, reemplazos por incapacidad o vacaciones y evaluación de desempeño — con protocolos de contingencia ante ausencias, informes mensuales de gestión y cumplimiento de acuerdos de servicio.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { ic: "mortarboard-fill", t: "Formación archivística", x: "Personal capacitado bajo normas archivísticas avanzadas y lineamientos del AGN." },
              { ic: "person-badge-fill", t: "Empleador del personal Inhouse", x: "Selección, capacitación, reemplazos y evaluación de desempeño a cargo de Transarchivos." },
              { ic: "clipboard-data-fill", t: "KPIs y SLA medibles", x: "Informes mensuales de gestión y cumplimiento de acuerdos de servicio con el cliente." },
            ].map(c => (
              <div key={c.t} className="rounded-2xl p-5" style={{ background: "#F7F8FF", border: "1px solid #E4E6F7" }}>
                <BiTile n={c.ic} accent="#1800AD" size={40} />
                <p className="text-sm font-bold mt-3 mb-1" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>{c.t}</p>
                <p className="text-xs leading-relaxed" style={{ color: "#6B6B6B" }}>{c.x}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Cultura organizacional */}
        <section id="cultura" style={{ scrollMarginTop: 76 }}>
          <NosotrosKicker icon={iconoCultura} label="Cultura organizacional" />
          <p className="text-sm max-w-2xl mt-4 mb-6" style={{ color: "#6B6B6B", lineHeight: 1.7 }}>
            Nuestra cultura se sostiene en 4 principios que guían cómo trabajamos cada día con clientes, colegas, proveedores y visitantes.
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { t: "Compromiso", ic: "hand-thumbs-up-fill", x: "Cumplimos de manera oportuna y eficiente los requerimientos de nuestros clientes internos y externos." },
              { t: "Confidencialidad", ic: "shield-lock-fill", x: "Manejamos la información interna y externa de acuerdo con la legislación colombiana y las políticas de seguridad y privacidad establecidas." },
              { t: "Responsabilidad", ic: "patch-check-fill", x: "Brindamos un tratamiento especial a la información de nuestros clientes y de nuestra organización." },
              { t: "Sensibilidad humana", ic: "heart-fill", x: "Interactuamos con nuestros clientes, compañeros de trabajo, proveedores y visitantes como queremos ser tratados." },
            ].map((v, i) => (
              <div key={v.t} className="rounded-2xl p-5 transition-all hover:-translate-y-1" style={{ background: "#fff", border: "1.5px solid #E4E6F7" }}>
                <div className="mb-3"><BiTile n={v.ic} accent={i % 2 ? "#C8960A" : "#272B7C"} size={40} /></div>
                <p className="text-sm font-bold mb-1.5" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>{v.t}</p>
                <p className="text-xs leading-relaxed" style={{ color: "#6B6B6B" }}>{v.x}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Nuestros principales clientes */}
        <section id="clientes" style={{ scrollMarginTop: 76 }}>
          <NosotrosKicker icon={iconoClientes} label="Nuestros principales clientes" />
          <p className="text-sm max-w-2xl mt-4 mb-6" style={{ color: "#6B6B6B" }}>
            Atendemos multinacionales, pymes y microempresas, y también compañías en liquidación o reestructuración, en estos sectores:
          </p>
          <div className="grid grid-cols-3 gap-3 mb-4 max-w-2xl">
            {[
              { icon: bancaIcon, label: "Financiero y aseguradoras" },
              { icon: saludIcon, label: "Salud y laboratorios" },
              { icon: industriaIcon, label: "Petróleo y minería" },
            ].map(s => (
              <div key={s.label} className="flex flex-col items-center text-center gap-3 rounded-2xl px-3 py-5 transition-all hover:-translate-y-1 cursor-default"
                style={{ background: "#F7F8FF", border: "1.5px solid #E4E6F7" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#272B7C"; e.currentTarget.style.boxShadow = "0 14px 28px -14px rgba(39,43,124,0.35)"; e.currentTarget.style.background = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#E4E6F7"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.background = "#F7F8FF"; }}>
                <div className="flex items-center justify-center rounded-2xl" style={{ width: 60, height: 60, background: "#fff", boxShadow: "0 6px 16px -8px rgba(39,43,124,0.25)" }}>
                  <img src={s.icon} alt="" className="select-none" style={{ width: 36, height: 36, objectFit: "contain" }} />
                </div>
                <span className="text-xs font-semibold leading-tight" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif" }}>{s.label}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { n: "rulers", l: "Ingeniería e infraestructura" },
              { n: "bricks", l: "Construcción" },
              { n: "airplane-fill", l: "Líneas aéreas" },
              { n: "flask-fill", l: "Laboratorios" },
              { n: "arrow-repeat", l: "Compañías en liquidación o reestructuración" },
            ].map(s => (
              <span key={s.l} className="inline-flex items-center gap-2 text-xs font-semibold pl-2 pr-4 py-1.5 rounded-full" style={{ background: "#F7F8FF", color: "#272B7C", border: "1px solid #D5D9F5", fontFamily: "Montserrat, sans-serif" }}>
                <BiTile n={s.n} accent="#272B7C" size={26} />{s.l}
              </span>
            ))}
          </div>
        </section>

        {/* Tecnología y seguridad (antes "Aliados tecnológicos") */}
        <section id="aliados" style={{ scrollMarginTop: 76 }}>
          <NosotrosKicker icon={iconoAliados} label="Tecnología y seguridad" />
          <p className="text-sm max-w-2xl mt-4 mb-6" style={{ color: "#6B6B6B", lineHeight: 1.7 }}>
            La infraestructura y los protocolos con los que protegemos su información:
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { ic: "thermometer-half", t: "Control ambiental 24 h", x: "Monitoreo automatizado de temperatura y humedad en el centro documental." },
              { ic: "magnet-fill", t: "Blindaje electromagnético", x: "Protección de medios magnéticos contra campos electromagnéticos." },
              { ic: "fire", t: "Extinción sin agua", x: "Sistemas de extinción de incendios con agentes limpios." },
              { ic: "camera-video-fill", t: "Monitoreo y CCTV", x: "Vigilancia perimetral constante y control de acceso restringido." },
              { ic: "truck", t: "Transporte con GPS", x: "Vehículos propios monitoreados por GPS y trazabilidad por código de barras." },
              { ic: "cloud-check-fill", t: "Copias air gap y nube segura", x: "Respaldo desconectado de la red y adopción de tecnologías seguras en la nube." },
            ].map(c => (
              <div key={c.t} className="rounded-2xl p-5" style={{ background: "#F7F8FF", border: "1px solid #E4E6F7" }}>
                <BiTile n={c.ic} accent="#C8960A" size={40} />
                <p className="text-sm font-bold mt-3 mb-1" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>{c.t}</p>
                <p className="text-xs leading-relaxed" style={{ color: "#6B6B6B" }}>{c.x}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Certificados */}
        <section id="certificados" style={{ scrollMarginTop: 76 }}>
          <NosotrosKicker icon={iconoCertificados} label="Certificados y cumplimiento normativo" />
          <div className="relative overflow-hidden rounded-3xl p-7 flex items-center gap-5 mt-6 mb-6"
            style={{ background: "linear-gradient(135deg, #272B7C 0%, #1800AD 100%)" }}>
            <span className="absolute pointer-events-none select-none" style={{ right: -20, top: -30, fontSize: 140, lineHeight: 1, color: "rgba(255,255,255,0.06)" }}><Bi n="patch-check-fill" size={140} color="rgba(255,255,255,0.08)" /></span>
            <BiTile n="patch-check-fill" accent="#FFDE59" size={64} solid />
            <div className="relative">
              <p className="text-lg font-bold" style={{ color: "#fff", fontFamily: "Poppins, sans-serif" }}>ISO 9001</p>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>Certificación internacional de calidad</p>
            </div>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif" }}>Marco normativo con el que operamos</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {norms.map(n => (
              <div key={n.code} className="rounded-2xl p-4 flex flex-col justify-center transition-all hover:-translate-y-0.5"
                style={{ background: "#F7F8FF", border: "1.5px solid #E4E6F7" }}>
                <p className="text-sm font-bold" style={{ background: "linear-gradient(135deg,#272B7C,#1800AD)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontFamily: "Poppins, sans-serif" }}>{n.code}</p>
                <p className="text-[11px] leading-snug mt-1" style={{ color: "#6B6B6B" }}>{n.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <div className="rounded-3xl p-10 text-center" style={{ background: "#F7F8FF", border: "1.5px solid #E4E6F7" }}>
          <p className="text-xl font-bold mb-2" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>¿Hablamos de la gestión documental de su empresa?</p>
          <p className="text-sm mb-6" style={{ color: "#6B6B6B" }}>Escríbanos y un asesor especializado le contactará a la brevedad.</p>
          <Link to="/#contacto" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold transition-all hover:scale-105"
            style={{ background: "#272B7C", color: "#fff", fontFamily: "Montserrat, sans-serif", textDecoration: "none", boxShadow: "0 14px 28px -10px rgba(39,43,124,0.45)" }}>
            Hablemos de su proyecto <Bi n="arrow-right" size={15} color="#fff" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Service detail page ───────────────────────────────────────────────────────

// Placeholder por ahora — el flujo de navegación (cada card abre su propia
// página en /servicios/:slug) ya queda funcionando; el diseño detallado de
// cada página (normativa, proceso paso a paso, FAQ, como se ve en el resto
// del sitio) es el siguiente paso, pendiente a propósito.
function ServiceDetailPage() {
  const { slug } = useParams();
  const service = services.find(s => s.slug === slug);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!service) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center gap-4 px-6 text-center" style={{ fontFamily: "Inter, sans-serif" }}>
        <p className="text-2xl font-bold" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>Servicio no encontrado</p>
        <Link to="/#servicios" className="text-sm font-semibold" style={{ color: "#1800AD", textDecoration: "none" }}>← Volver a servicios</Link>
      </div>
    );
  }

  return (
    <div className="min-h-full" style={{ background: "#ffffff", fontFamily: "Inter, sans-serif", color: "#37352F" }}>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link to="/#servicios" className="inline-flex items-center gap-1 text-sm font-semibold mb-10"
          style={{ color: "#1800AD", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
          ← Volver a servicios
        </Link>

        <div className="flex items-center gap-4 mb-6">
          <div style={{ width: 72, height: 72, borderRadius: 20, background: `${service.accent}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <img src={service.icon} alt="" style={{ width: 44, height: 44, objectFit: "contain" }} />
          </div>
          <div>
            <span style={{ fontSize: 11, fontFamily: "Montserrat, sans-serif", fontWeight: 600, color: service.accent, background: `${service.accent}14`, borderRadius: 99, padding: "3px 10px" }}>
              {service.tag}
            </span>
            <h1 className="text-3xl font-bold mt-2" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>{service.title}</h1>
          </div>
        </div>

        <p className="text-base leading-relaxed mb-10" style={{ color: "#6B6B6B" }}>{service.desc}</p>

        <div className="p-6 rounded-2xl" style={{ background: "#F7F8FF", border: "1px solid #E9E9E7" }}>
          <p className="text-sm" style={{ color: "#9B9B9B" }}>
            Esta página está en construcción — pronto tendrá el detalle completo de este servicio (normativa, proceso, preguntas frecuentes). Mientras tanto, puede{" "}
            <Link to="/#contacto" style={{ color: "#1800AD", fontWeight: 600 }}>contactarnos</Link> directamente.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Página de artículo del blog ────────────────────────────────────────────────

function ArticlePage() {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);
  const [progress, setProgress] = useState(0);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center gap-4 px-6 text-center" style={{ fontFamily: "Inter, sans-serif" }}>
        <p className="text-2xl font-bold" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>Artículo no encontrado</p>
        <a href="/#blog" className="text-sm font-semibold" style={{ color: "#1800AD", textDecoration: "none" }}>← Volver al blog</a>
      </div>
    );
  }

  const others = blogPosts.filter(p => p.slug !== post.slug).slice(0, 3);
  const renderItem = (i: Item) => typeof i === "string" ? i : <><strong style={{ color: "#272B7C" }}>{i.b}.</strong> {i.t}</>;
  const firstP = post.blocks.findIndex(b => b.t === "p");

  return (
    <div className="min-h-full" style={{ background: "#F7F8FF", fontFamily: "Inter, sans-serif", color: "#37352F" }}>
      <div className="fixed top-0 left-0 right-0 z-40" style={{ height: 4, background: "rgba(255,255,255,0.15)" }}>
        <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, #FFDE59, #FF9F1C)", transition: "width 0.1s linear" }} />
      </div>

      {/* Portada */}
      <div className="relative overflow-hidden" style={{ minHeight: 520 }}>
        <img src={post.cover} alt="" className="absolute inset-0 w-full h-full" style={{ objectFit: "cover" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(20,22,63,0.72) 0%, rgba(20,22,63,0.55) 35%, rgba(20,22,63,0.96) 100%)" }} />
        <div className="absolute pointer-events-none rounded-full" style={{ width: 560, height: 560, top: -220, right: -160, background: "radial-gradient(circle, rgba(255,222,89,0.28) 0%, transparent 70%)" }} />

        <div className="relative max-w-4xl mx-auto px-6 pt-6 pb-28 flex flex-col" style={{ minHeight: 520 }}>
          <div className="flex items-center justify-between">
            <Link to="/" className="rounded-xl px-3 py-1.5" style={{ background: "rgba(255,255,255,0.95)" }}>
              <img src={logoImg} alt="Transarchivos" style={{ height: 30, width: "auto" }} />
            </Link>
            <a href="/#blog" className="text-xs font-bold px-4 py-2 rounded-full transition-all hover:scale-105"
              style={{ background: "rgba(255,255,255,0.14)", color: "#fff", border: "1px solid rgba(255,255,255,0.35)", fontFamily: "Montserrat, sans-serif", textDecoration: "none", backdropFilter: "blur(6px)" }}>
              <Bi n="arrow-left" size={13} color="#fff" className="mr-1.5" style={{ verticalAlign: "-1px" }} />Volver al blog
            </a>
          </div>

          <div className="mt-auto pt-20">
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-5"
              style={{ background: "#FFDE59", color: "#1800AD", fontFamily: "Montserrat, sans-serif" }}>{post.cat}</span>
            <h1 className="text-3xl md:text-5xl font-bold max-w-3xl" style={{ color: "#fff", fontFamily: "Poppins, sans-serif", lineHeight: 1.15 }}>{post.title}</h1>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-6 text-sm" style={{ color: "rgba(255,255,255,0.8)", fontFamily: "Montserrat, sans-serif" }}>
              <span className="flex items-center gap-2">
                <span className="flex items-center justify-center rounded-full font-bold" style={{ width: 30, height: 30, background: "#fff", color: "#272B7C", fontSize: 13 }}>T</span>
                Transarchivos Ltda.
              </span>
              <span className="flex items-center gap-1.5"><Bi n="calendar3" size={14} color="#FFDE59" />{post.date}</span>
              <span className="flex items-center gap-1.5"><Bi n="clock-fill" size={14} color="#FFDE59" />{readMinutes(post)} min de lectura</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <article className="relative max-w-3xl mx-auto px-4 sm:px-6" style={{ marginTop: -72 }}>
        <div className="rounded-3xl p-7 sm:p-10 md:p-14" style={{ background: "#fff", boxShadow: "0 40px 80px -40px rgba(39,43,124,0.4)", border: "1.5px solid #E4E6F7" }}>
          <div className="space-y-6 text-base md:text-[17px]" style={{ color: "#4B4B4B", lineHeight: 1.8 }}>
            {post.blocks.map((b, i) => {
              if (b.t === "h2") return (
                <h2 key={i} className="flex items-start gap-3 text-xl md:text-2xl font-bold pt-8" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif", lineHeight: 1.3 }}>
                  <span className="shrink-0 rounded-full" style={{ width: 6, height: 30, background: "linear-gradient(#FFDE59, #FF9F1C)", marginTop: 2 }} />
                  {b.text}
                </h2>
              );
              if (b.t === "p") {
                const lead = i === firstP && !b.lead;
                return (
                  <p key={i} className={lead ? "text-lg md:text-xl" : ""} style={lead ? { color: "#272B7C", fontFamily: "Poppins, sans-serif", fontWeight: 500, lineHeight: 1.6 } : undefined}>
                    {b.lead && <strong style={{ color: "#272B7C" }}>{b.lead} </strong>}
                    {b.text}
                  </p>
                );
              }
              if (b.t === "ul") return (
                <ul key={i} className="space-y-3">
                  {b.items.map((it, j) => (
                    <li key={j} className="flex gap-3.5 rounded-2xl p-4 text-[15px]" style={{ background: "#F7F8FF", border: "1px solid #E4E6F7", lineHeight: 1.65 }}>
                      <span className="shrink-0 flex items-center justify-center rounded-full" style={{ width: 22, height: 22, background: "#FFDE59", marginTop: 2 }}><Bi n="check-lg" size={13} color="#1800AD" style={{ WebkitTextStroke: "0.7px #1800AD" }} /></span>
                      <span>{renderItem(it)}</span>
                    </li>
                  ))}
                </ul>
              );
              if (b.t === "ol") return (
                <ol key={i} className="space-y-3">
                  {b.items.map((it, j) => (
                    <li key={j} className="flex gap-3.5 rounded-2xl p-4 text-[15px]" style={{ background: "#F7F8FF", border: "1px solid #E4E6F7", lineHeight: 1.65 }}>
                      <span className="shrink-0 flex items-center justify-center rounded-full font-bold" style={{ width: 28, height: 28, background: "#272B7C", color: "#FFDE59", fontSize: 13, fontFamily: "Poppins, sans-serif" }}>{j + 1}</span>
                      <span>{renderItem(it)}</span>
                    </li>
                  ))}
                </ol>
              );
              if (b.t === "img") return (
                <figure key={i} className="-mx-2 sm:-mx-6 md:-mx-8">
                  <img src={b.src} alt={b.alt} className="w-full rounded-2xl" style={{ boxShadow: "0 24px 50px -28px rgba(39,43,124,0.5)" }} />
                  <figcaption className="text-xs text-center mt-3" style={{ color: "#9B9B9B", fontFamily: "Montserrat, sans-serif" }}>{b.alt}</figcaption>
                </figure>
              );
              return (
                <div key={i} className="overflow-x-auto rounded-2xl" style={{ border: "1.5px solid #E4E6F7" }}>
                  <table className="w-full text-sm" style={{ borderCollapse: "collapse", minWidth: 560, lineHeight: 1.5 }}>
                    <thead>
                      <tr style={{ background: "linear-gradient(135deg, #272B7C, #1800AD)", color: "#fff" }}>
                        {b.head.map(h => <th key={h} className="text-left px-4 py-3.5 font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {b.rows.map((r, ri) => (
                        <tr key={ri} style={{ background: ri % 2 ? "#F7F8FF" : "#fff", borderTop: "1px solid #E4E6F7" }}>
                          {r.map((c, ci) => <td key={ci} className="px-4 py-3.5 align-top" style={ci === 0 ? { fontWeight: 700, color: "#272B7C" } : undefined}>{c}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>

          {/* Llamado a la acción */}
          <div className="mt-14 rounded-3xl p-7 md:p-9 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center gap-6"
            style={{ background: "linear-gradient(135deg, #14163F 0%, #272B7C 55%, #1800AD 100%)" }}>
            <div className="absolute pointer-events-none rounded-full" style={{ width: 320, height: 320, top: -120, right: -80, background: "radial-gradient(circle, rgba(255,222,89,0.28) 0%, transparent 70%)" }} />
            <div className="relative shrink-0"><ChatAvatarFace size={72} ring="light" /></div>
            <div className="relative flex-1">
              <p className="text-lg md:text-xl font-bold mb-1" style={{ color: "#fff", fontFamily: "Poppins, sans-serif", lineHeight: 1.3 }}>¿Hablamos de la gestión documental de su empresa?</p>
              <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.75)" }}>Agende su diagnóstico documental con el equipo de especialistas de Transarchivos.</p>
              <a href="/#contacto" className="inline-flex px-6 py-3 rounded-xl text-sm font-bold transition-all hover:scale-105"
                style={{ background: "#FFDE59", color: "#1800AD", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>Agendar diagnóstico</a>
            </div>
          </div>
        </div>
      </article>

      {/* Más del blog */}
      <section className="pt-20 pb-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#9B9B9B", fontFamily: "Montserrat, sans-serif" }}>Siga leyendo</p>
              <p className="text-2xl font-bold" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>Más del blog</p>
            </div>
            <a href="/#blog" className="text-sm font-semibold hidden sm:block" style={{ color: "#1800AD", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>Ver todos →</a>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {others.map(o => (
              <Link key={o.slug} to={`/blog/${o.slug}`} className="group block rounded-3xl overflow-hidden bg-white transition-all hover:-translate-y-1.5"
                style={{ border: "1.5px solid #E4E6F7", textDecoration: "none", boxShadow: "0 14px 34px -22px rgba(39,43,124,0.35)" }}>
                <div className="overflow-hidden" style={{ height: 150 }}>
                  <img src={o.cover} alt="" className="w-full h-full transition-transform duration-500 group-hover:scale-105" style={{ objectFit: "cover" }} />
                </div>
                <div className="p-5">
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "#1800AD", fontFamily: "Montserrat, sans-serif" }}>{o.cat}</p>
                  <p className="text-sm font-bold" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif", lineHeight: 1.4 }}>{o.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── App (enrutador) ────────────────────────────────────────────────────────────

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/nosotros" element={<NosotrosPage />} />
      <Route path="/servicios/:slug" element={<ServiceDetailPage />} />
      <Route path="/blog/:slug" element={<ArticlePage />} />
    </Routes>
  );
}
