import { useState, useEffect, useLayoutEffect, useRef, useMemo } from "react";
import { Routes, Route, Link, useParams, useLocation } from "react-router-dom";
import avatarImg from "@/imports/iconojoel.png";
import logoImg from "@/imports/logo.png";
import { blogPosts, readMinutes, type Item } from "@/blogData";


// ─── Avatar de Joel ─────────────────────────────────────────────────────────

// Recorte de solo la cara/busto del avatar de cuerpo completo (iconojoel.png,
// 1012×1555px) para el widget de chat — mostrar el cuerpo entero encogido a
// 36-40px se veía como una figurita diminuta y rara. El recorte usa % fijos
// calibrados sobre la región cara+hombros (x:150-780, y:0-630 del original)
// para que funcione a cualquier tamaño de contenedor cuadrado.
function ChatAvatarFace({ size, ring, round = false }: { size: number; ring?: "light" | "navy"; round?: boolean }) {
  // Squircle (esquinas suaves) en vez de círculo perfecto + sombra propia
  // para dar algo de relieve — marco más "moderno" que el círculo plano
  // original, sin cambiar el personaje.
  return (
    <div style={{
      width: size, height: size, borderRadius: round ? "50%" : Math.round(size * 0.3), overflow: "hidden",
      position: "relative", flexShrink: 0,
      background: round ? "linear-gradient(135deg, #FFF6D6 0%, #FFE39A 100%)" : "#EEF0FB",
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

const HERO_VIDEOS = ["/videos/archivosvi2.mp4", "/videos/archivosvi4.mp4"];

function HeroVideoBackground() {
  const [idx, setIdx] = useState(0);
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  const [reduced] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    const v = refs.current[idx];
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => {});
  }, [idx]);

  const next = (idx + 1) % HERO_VIDEOS.length;

  return (
    // Fondo inmediato: el primer cuadro del primer video (hero-poster.jpg,
    // precargado en index.html), para que al recargar no se vea el azul
    // de base mientras el video carga. También es el fondo en celular.
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true"
      style={{ backgroundColor: "#3a3c56", backgroundImage: "url(/videos/hero-poster.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}>
      {!reduced && (
        <div className="hidden md:block absolute inset-0">
          {HERO_VIDEOS.map((src, i) => (
            <video key={src} ref={el => { refs.current[i] = el; }} src={src}
              muted playsInline autoPlay={i === 0} preload={i === idx || i === next ? "auto" : "none"}
              poster={i === 0 ? "/videos/hero-poster.jpg" : undefined}
              onEnded={() => { if (i === idx) setIdx(next); }}
              className="absolute inset-0 w-full h-full"
              style={{ objectFit: "cover", opacity: i === idx ? 1 : 0, transition: "opacity 1.2s ease" }} />
          ))}
        </div>
      )}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,13,61,0.55) 0%, rgba(10,13,61,0.35) 45%, rgba(10,13,61,0.6) 100%)" }} />
    </div>
  );
}

// ─── Caja del hero para escribirle a Joel ────────────────────────────────────
// Al enviar (o al elegir una sugerencia) abre el chat con la pregunta ya escrita.

const HERO_SUGGESTIONS = ["Digitalizar mi archivo", "Custodia de documentos", "Destrucción certificada"];

function HeroAskJoel({ onAsk }: { onAsk: (text: string) => void }) {
  const [text, setText] = useState("");
  const send = (t: string) => { const v = t.trim(); if (!v) return; onAsk(v); setText(""); };

  return (
    <div className="text-left">
      <form onSubmit={e => { e.preventDefault(); send(text); }}
        className="flex items-center gap-3 rounded-2xl py-2 pl-5 pr-2"
        style={{ background: "#fff", border: "1px solid #E4E6F7", boxShadow: "0 24px 50px -30px rgba(39,43,124,0.35)" }}>
        <input type="text" value={text} onChange={e => setText(e.target.value)}
          placeholder="¿Qué necesita su empresa? Organizar, digitalizar, custodiar o destruir documentos…"
          aria-label="Escríbale a Joel"
          className="flex-1 min-w-0 bg-transparent outline-none text-sm"
          style={{ color: "#272B7C" }} />
        <button type="submit" aria-label="Enviar a Joel"
          className="flex items-center justify-center rounded-full shrink-0 transition-all hover:scale-105 active:scale-95"
          style={{ width: 38, height: 38, background: text.trim() ? "#272B7C" : "#EEF0FB" }}>
          <Bi n="send" size={14} color={text.trim() ? "#fff" : "#272B7C"} />
        </button>
      </form>
      <div className="flex flex-wrap justify-center gap-2 mt-3">
        {HERO_SUGGESTIONS.map(t => (
          <button key={t} type="button" onClick={() => send(t)}
            className="text-xs px-3 py-1.5 rounded-full transition-colors hover:bg-white/25"
            style={{ background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", backdropFilter: "blur(6px)" }}>
            {t}
          </button>
        ))}
      </div>
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
// "icon": nombre del ícono de Bootstrap Icons (bi-<nombre>).
const serviceItems: { icon: string; title: string; slug: string; desc: string; keywords: string[] }[] = [
  { icon: "list-columns-reverse", title: "Levantamiento de Inventario", slug: "levantamiento-de-inventario", desc: "Diagnóstico y organización según norma AGN", keywords: ["Inventario documental", "Diagnóstico"] },
  { icon: "folder2-open", title: "Programa de Gestión Documental", slug: "programa-de-gestion-documental", desc: "PGD · Cumplimiento Ley 594", keywords: ["TRD", "Tablas de retención"] },
  { icon: "hdd-stack", title: "Custodia de Medios Magnéticos", slug: "custodia-de-medios-magneticos", desc: "Cintas, discos y medios con control ambiental", keywords: ["Copia air gap", "Cintas LTO"] },
  { icon: "archive", title: "Custodia de Archivos", slug: "custodia-de-archivos", desc: "Centro documental con vigilancia 24 h", keywords: ["Centro documental", "Consulta y recuperación"] },
  { icon: "upc-scan", title: "Digitalización de Documentos", slug: "digitalizacion-de-documentos", desc: "Escaneo, OCR e indexación", keywords: ["OCR", "DMS / ECM"] },
  { icon: "file-earmark-x", title: "Destrucción de Documentos", slug: "destruccion-de-documentos", desc: "Destrucción con certificado y trazabilidad", keywords: ["Trituración industrial", "Certificado de destrucción"] },
  { icon: "film", title: "Microfilmación de Archivos", slug: "microfilmacion-de-archivos", desc: "Preservación a más de 100 años", keywords: ["Microfilm", "Historias clínicas"] },
  { icon: "person-badge", title: "Servicio Inhouse", slug: "servicio-inhouse", desc: "Personal de archivo en su sede", keywords: ["Outsourcing documental", "Personal en sitio"] },
  { icon: "lightning-charge", title: "Servicio Inmediato", slug: "servicio-inmediato", desc: "Entrega urgente con trazabilidad", keywords: ["Entrega urgente", "Despacho express"] },
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

// ─── Menús desplegables del navbar ──────────────────────────────────────────
// Mismo esquema que el header de Transpack: a la izquierda una columna
// destacada (degradado azul de marca, cuadro amarillo girado, rótulo, título,
// texto y llamado a la acción); a la derecha las opciones, con íconos que se
// rellenan de azul al pasar el mouse.

function MenuFeature({ kicker, title, text, cta, href, onClick }: { kicker: string; title: string; text: string; cta: string; href: string; onClick: () => void }) {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl p-5" style={{ background: "linear-gradient(135deg, #272B7C 0%, #1800AD 100%)" }}>
      <span aria-hidden="true" className="absolute pointer-events-none" style={{ right: -36, top: -36, width: 104, height: 104, transform: "rotate(45deg)", background: "rgba(255,222,89,0.25)" }} />
      <p className="relative mb-2 text-[10.5px] font-bold uppercase" style={{ letterSpacing: "0.16em", color: "#FFDE59", fontFamily: "Montserrat, sans-serif" }}>{kicker}</p>
      <p className="relative mb-2 text-[17px] font-bold leading-snug" style={{ color: "#fff", fontFamily: "Poppins, sans-serif" }}>{title}</p>
      <p className="relative mb-5 text-[12.5px] leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>{text}</p>
      <a href={href} onClick={onClick} className="group relative mt-auto inline-flex items-center gap-1.5 text-[13px] font-semibold" style={{ color: "#fff", textDecoration: "none", fontFamily: "Montserrat, sans-serif" }}>
        {cta} <Bi n="arrow-right" size={13} color="#FFDE59" className="transition-transform group-hover:translate-x-1" />
      </a>
    </div>
  );
}

// Ficha de ícono que se rellena al pasar el mouse sobre el enlace (group).
function MenuIcon({ n, size = 38 }: { n: string; size?: number }) {
  return (
    <span className="grid place-items-center shrink-0 rounded-lg transition-colors bg-[#F2F3FA] text-[#272B7C] group-hover:bg-[#272B7C] group-hover:text-[#FFDE59]" style={{ width: size, height: size }}>
      <i className={`bi bi-${n}`} aria-hidden="true" style={{ fontSize: Math.round(size * 0.45), lineHeight: 1 }} />
    </span>
  );
}

// Línea superior + aire: separa el menú de la fila del navbar (y del logo,
// que en la barra completa queda justo encima de la columna destacada).
const menuShell = "grid grid-cols-[220px_minmax(0,1fr)] gap-3 px-3 pb-3 pt-3 mt-2 border-t border-[#272B7C]/10";
const menuItemCls = "group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-[#F7F8FF]";

function ServicesPanelContent({ setOpen }: { setOpen: (v: boolean) => void }) {
  const close = () => setOpen(false);
  return (
    <div className={menuShell} style={{ animation: "fadeInUp 0.25s ease both" }}>
      <MenuFeature kicker="Diagnóstico documental" title="¿No sabe por dónde empezar?"
        text="Le mostramos qué está pasando hoy con su archivo antes de mover un solo papel. O pregúntele a Joel, nuestro asesor virtual."
        cta="Solicitar diagnóstico" href="#diagnostico" onClick={close} />
      <div className="py-1">
        <div className="grid grid-cols-3 gap-0.5">
          {serviceItems.map(s => (
            <Link key={s.title} to={`/servicios/${s.slug}`} onClick={close} className={menuItemCls} style={{ textDecoration: "none" }}>
              <MenuIcon n={s.icon} />
              <span className="min-w-0">
                <span className="block text-[13px] font-semibold leading-tight" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif" }}>{s.title}</span>
                <span className="block text-[11px] leading-snug mt-0.5" style={{ color: "#8A8A8A" }}>{s.desc}</span>
              </span>
            </Link>
          ))}
        </div>
        <div className="flex items-center justify-between mt-1.5 pt-2.5 px-2.5" style={{ borderTop: "1px solid #ECEEF6" }}>
          <span className="text-[11px]" style={{ color: "#9B9B9B" }}>9 servicios bajo la Ley 594 de 2000 y la normativa del AGN</span>
          <a href="#servicios" onClick={close} className="text-xs font-semibold inline-flex items-center gap-1" style={{ color: "#1800AD", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
            Ver todos <Bi n="arrow-right" size={12} color="#1800AD" />
          </a>
        </div>
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
    { label: "Quiénes somos", icon: "building", anchor: "quienes-somos" },
    { label: "Nuestra historia", icon: "clock-history", anchor: "historia" },
    { label: "Misión y visión", icon: "bullseye", anchor: "mision-vision" },
  ] },
  { heading: "Equipo y cultura", items: [
    { label: "Nuestro equipo", icon: "people", anchor: "equipo" },
    { label: "Cultura", icon: "heart", anchor: "cultura" },
  ] },
  { heading: "Resultados", items: [
    { label: "Nuestros clientes", icon: "briefcase", anchor: "clientes" },
    { label: "Tecnología", icon: "cpu", anchor: "aliados" },
    { label: "Normativa", icon: "patch-check", anchor: "certificados" },
  ] },
];

function NosotrosPanelContent({ setOpen }: { setOpen: (v: boolean) => void }) {
  const close = () => setOpen(false);
  return (
    <div className={menuShell} style={{ animation: "fadeInUp 0.25s ease both" }}>
      <MenuFeature kicker="Desde 1983" title="Pioneros de la gestión documental en Colombia"
        text="Más de 40 años ayudando a las empresas a organizar, proteger y transformar su información."
        cta="Conozca nuestra historia" href="/nosotros#historia" onClick={close} />
      <div className="grid grid-cols-3 gap-3 py-1">
        {nosotrosGroups.map(g => (
          <div key={g.heading}>
            <p className="text-[10.5px] font-bold uppercase mb-1.5 px-2 whitespace-nowrap" style={{ letterSpacing: "0.12em", color: "#9B9B9B", fontFamily: "Montserrat, sans-serif" }}>{g.heading}</p>
            <div className="flex flex-col">
              {g.items.map(item => (
                <Link key={item.label} to={`/nosotros#${item.anchor}`} onClick={close} className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-[#F7F8FF]" style={{ textDecoration: "none" }}>
                  <MenuIcon n={item.icon} size={34} />
                  <span className="text-[13px] font-semibold whitespace-nowrap" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif" }}>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Menú "Blog": los 3 artículos más recientes y acceso al canal de YouTube.
function BlogPanelContent({ setOpen }: { setOpen: (v: boolean) => void }) {
  const close = () => setOpen(false);
  const recent = blogPosts.slice(0, 3);
  return (
    <div className={menuShell} style={{ animation: "fadeInUp 0.25s ease both" }}>
      <MenuFeature kicker="Blog y novedades" title="Conocimiento que protege la memoria de su empresa"
        text="Guías sobre gestión documental, normativa, tecnología y sostenibilidad."
        cta="Ver todos los artículos" href="#blog" onClick={close} />
      <div className="py-1">
        <div className="grid gap-0.5">
          {recent.map(p => (
            <Link key={p.slug} to={`/blog/${p.slug}`} onClick={close} className={`${menuItemCls} items-center`} style={{ textDecoration: "none" }}>
              <img src={p.cover} alt="" className="shrink-0 rounded-lg object-cover" style={{ width: 64, height: 48 }} />
              <span className="min-w-0">
                <span className="block text-[10.5px] font-bold uppercase" style={{ letterSpacing: "0.1em", color: "#C8960A", fontFamily: "Montserrat, sans-serif" }}>{p.cat}</span>
                <span className="block text-[13px] font-semibold truncate" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif" }}>{p.title}</span>
              </span>
            </Link>
          ))}
        </div>
        <a href="https://www.youtube.com/@Transarchivosltda" target="_blank" rel="noreferrer" onClick={close}
          className={`${menuItemCls} items-center mt-1.5`} style={{ borderTop: "1px solid #ECEEF6", borderRadius: 0, textDecoration: "none" }}>
          <MenuIcon n="youtube" size={34} />
          <span className="flex-1 text-[13px] font-semibold" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif" }}>Véanos en nuestro canal de YouTube</span>
          <Bi n="box-arrow-up-right" size={12} color="#9B9B9B" />
        </a>
      </div>
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
// Sobre el hero oscuro el logo va en blanco; al hacer scroll (header blanco)
// vuelve a su color original.
function HeaderLogo({ scrolled, size = 64 }: { scrolled: boolean; size?: number }) {
  return (
    <img src={logoImg} alt="Transarchivos Ltda." draggable={false}
      className="select-none"
      style={{ height: size, width: "auto", objectFit: "contain", filter: scrolled ? "none" : "brightness(0) invert(1)", transition: "filter 0.3s ease, height 0.3s ease" }} />
  );
}

// ─── Service data ─────────────────────────────────────────────────────────────

// "slug" arma la URL propia de cada servicio (/servicios/<slug>) — coinciden
// con las rutas reales que ya usa transarchivos.com hoy (p.ej.
// transarchivos.com/levantamiento-de-inventario/), así que si el día de
// mañana el sitio pasa a este dominio, los enlaces externos siguen sirviendo.
const services = [
  {
    icon: "list-columns-reverse", title: "Levantamiento de Inventario", slug: "levantamiento-de-inventario",
    tag: "Norma AGN · Ley 594", accent: "#272B7C",
    desc: "Identificación, registro y clasificación de los documentos de un archivo para conocer su volumen, estado y ubicación.",
  },
  {
    icon: "folder2-open", title: "Programa de Gestión Documental", slug: "programa-de-gestion-documental",
    tag: "PGD · Ley 594", accent: "#1800AD",
    desc: "Sistema para manejar los documentos durante todo su ciclo de vida: creación, uso, conservación y disposición final.",
  },
  {
    icon: "hdd-stack", title: "Custodia de Medios Magnéticos", slug: "custodia-de-medios-magneticos",
    tag: "Copia air gap · DRP", accent: "#272B7C",
    desc: "Almacenamiento especializado de cintas LTO/DAT/DLT, discos duros, CDs/DVDs y otros medios.",
  },
  {
    icon: "archive", title: "Custodia de Archivos", slug: "custodia-de-archivos",
    tag: "CCTV · vigilancia 24 h", accent: "#1800AD",
    desc: "Resguardo y gestión de documentos físicos y digitales con seguridad, integridad y disponibilidad.",
  },
  {
    icon: "upc-scan", title: "Digitalización de Documentos", slug: "digitalizacion-de-documentos",
    tag: "Valor legal · OCR", accent: "#272B7C",
    desc: "Conversión de documentos físicos a archivos digitales con captura, indexación y OCR opcional.",
  },
  {
    icon: "file-earmark-x", title: "Destrucción de Documentos", slug: "destruccion-de-documentos",
    tag: "Certificado de destrucción", accent: "#C8960A",
    desc: "Destrucción segura y trazable, con acta de eliminación y certificado, alineada con la Ley 594 de 2000.",
  },
  {
    icon: "film", title: "Microfilmación de Archivos", slug: "microfilmacion-de-archivos",
    tag: "Microfilme 16 / 35 mm", accent: "#272B7C",
    desc: "Conversión de documentos a microfilme para su preservación segura a largo plazo.",
  },
  {
    icon: "person-badge", title: "Servicio Inhouse", slug: "servicio-inhouse",
    tag: "En sus instalaciones", accent: "#1800AD",
    desc: "Personal técnico de archivo en su sede, capacitado y supervisado por Transarchivos.",
  },
  {
    icon: "lightning-charge", title: "Servicio Inmediato", slug: "servicio-inmediato",
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
  { kind: "Sección", title: "Preguntas frecuentes", desc: "Cotización, costos, cobertura, normativa, custodia y más", href: "#faq" },
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
  const icon = svc ? svc.icon : "search";

  // Pasos: 0 Servicio · 1 Detalles · 2 Contacto · 3 Resumen. Cambiar de
  // servicio borra las respuestas (cada servicio tiene sus propias preguntas).
  const pick = (id: string, goTo = step) => { if (id !== selected) setAnswers({}); setSelected(id); setStep(goTo); };
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

  const inputCls = "w-full px-3.5 py-3 rounded-xl text-sm outline-none transition-colors focus:border-[#272B7C] focus:ring-4 focus:ring-[#272B7C]/10";
  const inputStyle = { background: "#fff", border: "1.5px solid #DDE0F2", color: "#272B7C" } as const;
  const labelCls = "block text-xs font-semibold mb-1.5";
  const labelStyle = { color: "#272B7C", fontFamily: "Montserrat, sans-serif" } as const;

  const units = [
    { slug: "diagnostico", icon: "search", title: "Diagnóstico documental", desc: "¿No sabe qué servicio necesita? Empiece por entender qué está pasando con su archivo.", accent: "#C8960A" },
    ...services,
  ];
  const STEPS = ["Servicio", "Detalles", "Contacto", "Resumen"];
  const primaryBtn = "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90 cursor-pointer";
  const secondaryBtn = "inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold cursor-pointer";
  const answeredRows = summary.filter(([, v]) => v !== "—" && v !== "Ninguno");

  return (
    <section id="cotizador" className="relative max-w-6xl mx-auto px-6 py-16" style={{ scrollMarginTop: 80 }}>
      <p className="text-xs font-bold uppercase tracking-widest text-center mb-3" style={{ color: "#9B9B9B", fontFamily: "Montserrat, sans-serif" }}>
        Solicite su cotización
      </p>
      <h2 className="text-3xl font-bold text-center mb-4" style={{ fontFamily: "Poppins, sans-serif", color: "#272B7C" }}>
        Cuéntenos qué necesita y arme su solicitud
      </h2>
      <p className="text-sm text-center max-w-xl mx-auto mb-10" style={{ color: "#9B9B9B" }}>
        Cuatro pasos cortos. A la derecha verá cómo se arma su solicitud antes de enviarla a nuestro equipo comercial.
      </p>

      <div className="rounded-3xl overflow-hidden" style={{ background: "#fff", border: "1.5px solid #E4E6F7", boxShadow: "0 30px 60px -34px rgba(39,43,124,0.3)" }}>
        {/* Pasos */}
        <div className="px-5 md:px-8 py-5" style={{ borderBottom: "1px solid #ECEEF6", background: "#FAFBFF" }}>
          <ol className="grid grid-cols-4 gap-2">
            {STEPS.map((n, i) => {
              const done = i < step, on = i === step;
              return (
                <li key={n}>
                  <button type="button" disabled={i > step} onClick={() => setStep(i)}
                    className="w-full flex flex-col sm:flex-row items-center gap-2 text-left disabled:cursor-default">
                    <span className="flex items-center justify-center rounded-full font-bold shrink-0" style={{
                      width: 30, height: 30, fontSize: 12, fontFamily: "Poppins, sans-serif",
                      background: done || on ? "#272B7C" : "#fff", color: done || on ? "#fff" : "#B5B9D6",
                      border: `2px solid ${done || on ? "#272B7C" : "#E4E6F7"}`,
                    }}>
                      {done ? <Bi n="check-lg" size={13} color="#fff" /> : i + 1}
                    </span>
                    <span className="text-[11px] sm:text-xs font-semibold" style={{ color: on ? "#272B7C" : done ? "#6B6B6B" : "#B5B9D6", fontFamily: "Montserrat, sans-serif" }}>{n}</span>
                    {i < STEPS.length - 1 && <span className="hidden sm:block flex-1 h-0.5 rounded-full" style={{ background: done ? "#272B7C" : "#E4E6F7" }} />}
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Contenido del paso */}
          <div className="p-5 md:p-8" key={step} style={{ animation: "fadeInUp 0.3s ease both" }}>
            {step === 0 && (
              <>
                <p className="text-lg font-bold mb-1" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>¿Qué servicio necesita?</p>
                <p className="text-sm mb-5" style={{ color: "#8A8A8A" }}>Si no está seguro, elija el diagnóstico documental.</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {units.map(u => {
                    const on = u.slug === selected;
                    return (
                      <button key={u.slug} type="button" onClick={() => pick(u.slug, 0)}
                        className="relative flex items-start gap-3 text-left p-3.5 rounded-2xl transition-all cursor-pointer hover:-translate-y-0.5"
                        style={{ border: `1.5px solid ${on ? u.accent : "#ECEEF6"}`, background: on ? `${u.accent}0D` : "#fff", boxShadow: on ? `0 10px 24px -16px ${u.accent}` : "none" }}>
                        <span className="flex items-center justify-center rounded-xl shrink-0" style={{ width: 38, height: 38, background: on ? u.accent : `${u.accent}14`, transition: "background 0.2s" }}>
                          <Bi n={u.icon} size={17} color={on ? "#fff" : u.accent} />
                        </span>
                        <span className="min-w-0 pr-5">
                          <span className="block text-sm font-semibold leading-tight mb-0.5" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif" }}>{u.title}</span>
                          <span className="block text-[11px] leading-snug line-clamp-2" style={{ color: "#8A8A8A" }}>{u.desc}</span>
                        </span>
                        {on && <Bi n="check-circle-fill" size={16} color={u.accent} className="absolute top-3 right-3" />}
                      </button>
                    );
                  })}
                </div>
                <div className="flex justify-end mt-6">
                  <button type="button" onClick={() => setStep(1)} className={primaryBtn} style={{ background: "#272B7C", color: "#fff", fontFamily: "Montserrat, sans-serif" }}>
                    Continuar <Bi n="arrow-right" size={15} color="#fff" />
                  </button>
                </div>
              </>
            )}

            {step === 1 && (
              <form onSubmit={e => { e.preventDefault(); setStep(2); }}>
                <p className="text-lg font-bold mb-1" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>Cuéntenos sobre su archivo</p>
                <p className="text-sm mb-5" style={{ color: "#8A8A8A" }}>Si no conoce algún dato, elija "No lo sé": un asesor le ayudará a completarlo.</p>
                <div className="grid sm:grid-cols-2 gap-x-4 gap-y-4">
                  <div className="sm:col-span-2">
                    <label className={labelCls} style={labelStyle}>{cfg.volumeLabel}</label>
                    <input value={answers.volume ?? ""} onChange={e => setA("volume", e.target.value)} placeholder={cfg.volumePlaceholder} className={inputCls} style={inputStyle} />
                  </div>
                  {cfg.fields.map((f, i) => (
                    <div key={f.key} className={i === cfg.fields.length - 1 && cfg.fields.length % 2 === 1 ? "sm:col-span-2" : ""}>
                      <label className={labelCls} style={labelStyle}>{f.label}</label>
                      <select value={answers[f.key] ?? ""} onChange={e => setA(f.key, e.target.value)} className={inputCls} style={inputStyle}>
                        <option value="">Seleccione…</option>
                        {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                  <div>
                    <label className={labelCls} style={labelStyle}>Ubicación (ciudad y sede)</label>
                    <input value={answers.ubicacion ?? ""} onChange={e => setA("ubicacion", e.target.value)} placeholder="Ej.: Bogotá, sede principal" className={inputCls} style={inputStyle} />
                  </div>
                  <div>
                    <label className={labelCls} style={labelStyle}>Nivel de urgencia</label>
                    <div className="grid grid-cols-3 gap-2">
                      {QUOTE_URGENCY.map(o => {
                        const on = answers.urgencia === o;
                        return (
                          <button key={o} type="button" onClick={() => setA("urgencia", o)}
                            className="px-2 py-2.5 rounded-xl text-[11px] font-semibold leading-tight transition-colors"
                            style={{ border: `1.5px solid ${on ? "#272B7C" : "#DDE0F2"}`, background: on ? "#272B7C" : "#fff", color: on ? "#fff" : "#272B7C", fontFamily: "Montserrat, sans-serif" }}>{o}</button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls} style={labelStyle}>Requerimientos especiales <span style={{ color: "#9B9B9B", fontWeight: 400 }}>(opcional)</span></label>
                    <textarea value={answers.especiales ?? ""} onChange={e => setA("especiales", e.target.value)} rows={2} placeholder="Restricciones, características del material, otra información…" className={`${inputCls} resize-none`} style={inputStyle} />
                  </div>
                </div>
                <div className="flex justify-between gap-3 mt-6">
                  <button type="button" onClick={() => setStep(0)} className={secondaryBtn} style={{ background: "#fff", color: "#272B7C", border: "1.5px solid #DDE0F2", fontFamily: "Montserrat, sans-serif" }}>
                    <Bi n="arrow-left" size={14} color="#272B7C" /> Atrás
                  </button>
                  <button type="submit" className={primaryBtn} style={{ background: "#272B7C", color: "#fff", fontFamily: "Montserrat, sans-serif" }}>
                    Continuar <Bi n="arrow-right" size={15} color="#fff" />
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={e => { e.preventDefault(); setStep(3); }}>
                <p className="text-lg font-bold mb-1" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>¿A quién contactamos?</p>
                <p className="text-sm mb-5" style={{ color: "#8A8A8A" }}>Usaremos estos datos solo para responder su solicitud.</p>
                <div className="grid sm:grid-cols-2 gap-x-4 gap-y-4">
                  <div>
                    <label className={labelCls} style={labelStyle}>Empresa</label>
                    <input required value={contact.empresa ?? ""} onChange={e => setC("empresa", e.target.value)} className={inputCls} style={inputStyle} />
                  </div>
                  <div>
                    <label className={labelCls} style={labelStyle}>Sector económico</label>
                    <select required value={contact.sector ?? ""} onChange={e => setC("sector", e.target.value)} className={inputCls} style={inputStyle}>
                      <option value="">Seleccione…</option>
                      {QUOTE_SECTORS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls} style={labelStyle}>Su nombre</label>
                    <input required value={contact.nombre ?? ""} onChange={e => setC("nombre", e.target.value)} className={inputCls} style={inputStyle} />
                  </div>
                  <div>
                    <label className={labelCls} style={labelStyle}>Cargo</label>
                    <input required value={contact.cargo ?? ""} onChange={e => setC("cargo", e.target.value)} className={inputCls} style={inputStyle} />
                  </div>
                  <div>
                    <label className={labelCls} style={labelStyle}>Correo electrónico</label>
                    <input required type="email" value={contact.email ?? ""} onChange={e => setC("email", e.target.value)} className={inputCls} style={inputStyle} />
                  </div>
                  <div>
                    <label className={labelCls} style={labelStyle}>Teléfono</label>
                    <input required type="tel" value={contact.telefono ?? ""} onChange={e => setC("telefono", e.target.value)} className={inputCls} style={inputStyle} />
                  </div>
                </div>
                <div className="flex justify-between gap-3 mt-6">
                  <button type="button" onClick={() => setStep(1)} className={secondaryBtn} style={{ background: "#fff", color: "#272B7C", border: "1.5px solid #DDE0F2", fontFamily: "Montserrat, sans-serif" }}>
                    <Bi n="arrow-left" size={14} color="#272B7C" /> Atrás
                  </button>
                  <button type="submit" className={primaryBtn} style={{ background: "#272B7C", color: "#fff", fontFamily: "Montserrat, sans-serif" }}>
                    Ver resumen <Bi n="arrow-right" size={15} color="#fff" />
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <div>
                <p className="text-lg font-bold mb-1" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>Revise y envíe su solicitud</p>
                <p className="text-sm mb-5" style={{ color: "#8A8A8A" }}>Se abrirá su correo con la solicitud lista para enviar a info@transarchivos.com.</p>
                <div className="flex items-start gap-3 rounded-2xl p-4 mb-5" style={{ background: `${nextStep.c}10`, border: `1px solid ${nextStep.c}33` }}>
                  <Bi n={nextStep.ic} size={20} color={nextStep.c} style={{ marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <p className="text-sm font-bold" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>Siguiente paso: {nextStep.t}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#6B6B6B", lineHeight: 1.55 }}>{nextStep.d}</p>
                  </div>
                </div>
                <div className="rounded-2xl p-4 mb-5 grid sm:grid-cols-2 gap-x-6 gap-y-2" style={{ border: "1px solid #ECEEF6" }}>
                  {contactRows.map(([k, v]) => (
                    <div key={k} className="text-xs">
                      <span className="block" style={{ color: "#9B9B9B" }}>{k}</span>
                      <span className="block font-semibold" style={{ color: "#272B7C" }}>{v}</span>
                    </div>
                  ))}
                </div>
                {cfg.next.length > 0 && (
                  <div className="mb-6">
                    <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: "#9B9B9B", fontFamily: "Montserrat, sans-serif" }}>También podría necesitar</p>
                    <div className="flex flex-wrap gap-2">
                      {cfg.next.map(n => {
                        const o = services.find(x => x.slug === n);
                        return o ? (
                          <button key={n} type="button" onClick={() => pick(n, 1)} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full cursor-pointer"
                            style={{ background: "#fff", color: "#272B7C", border: "1px solid #DDE0F2", fontFamily: "Montserrat, sans-serif" }}>
                            <Bi n={o.icon} size={12} color={o.accent} />{o.title}
                          </button>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
                <div className="flex flex-col-reverse sm:flex-row justify-between gap-3">
                  <button type="button" onClick={() => setStep(2)} className={secondaryBtn} style={{ background: "#fff", color: "#272B7C", border: "1.5px solid #DDE0F2", fontFamily: "Montserrat, sans-serif" }}>
                    <Bi n="arrow-left" size={14} color="#272B7C" /> Modificar datos
                  </button>
                  <a href={mailto()} className={primaryBtn} style={{ background: "#272B7C", color: "#fff", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
                    <Bi n="envelope-arrow-up" size={16} color="#fff" /> Enviar solicitud por correo
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Resumen en vivo */}
          <aside className="p-5 md:p-7 lg:border-l" style={{ borderColor: "#ECEEF6", background: "#FAFBFF" }}>
            <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: "#9B9B9B", fontFamily: "Montserrat, sans-serif" }}>Su solicitud</p>
            <div className="flex items-center gap-3 rounded-2xl p-3 mb-4" style={{ background: "#fff", border: "1px solid #ECEEF6" }}>
              <span className="flex items-center justify-center rounded-xl shrink-0" style={{ width: 42, height: 42, background: accent }}>
                <Bi n={icon} size={19} color="#fff" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold leading-tight" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>{title}</p>
                {cfg.level && <p className="text-[11px]" style={{ color: "#9B9B9B" }}>{cfg.level}</p>}
              </div>
              {step > 0 && (
                <button type="button" onClick={() => setStep(0)} className="text-[11px] font-semibold shrink-0" style={{ color: "#1800AD", fontFamily: "Montserrat, sans-serif" }}>Cambiar</button>
              )}
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif" }}>Información completa</span>
                <span className="text-xs font-bold" style={{ color: completPct === 100 ? "#16a34a" : "#272B7C" }}>{completPct}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "#E4E6F7" }}>
                <div className="h-full rounded-full" style={{ width: `${completPct}%`, background: completPct === 100 ? "#16a34a" : "#C8960A", transition: "width 0.3s ease" }} />
              </div>
            </div>

            {answeredRows.length > 0 ? (
              <ul className="space-y-2">
                {answeredRows.map(([k, v]) => (
                  <li key={k} className="flex items-start gap-2 text-xs">
                    <Bi n="check-circle-fill" size={12} color="#16a34a" style={{ marginTop: 2, flexShrink: 0 }} />
                    <span><span style={{ color: "#9B9B9B" }}>{k}: </span><span className="font-semibold" style={{ color: "#272B7C" }}>{v}</span></span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs leading-relaxed" style={{ color: "#9B9B9B" }}>
                {selected === "diagnostico" ? units[0].desc : svc?.desc}
              </p>
            )}

            <div className="flex items-start gap-2 mt-5 pt-4" style={{ borderTop: "1px solid #ECEEF6" }}>
              <Bi n="shield-lock" size={13} color="#9B9B9B" style={{ marginTop: 2, flexShrink: 0 }} />
              <p className="text-[11px] leading-snug" style={{ color: "#9B9B9B" }}>Sin compromiso. Un asesor revisa su solicitud y le responde con el alcance y las condiciones.</p>
            </div>
          </aside>
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

      <div className="relative max-w-6xl mx-auto px-6 py-20">
        {/* Encabezado: solo título, centrado. */}
        <div className="mb-12 pb-8 flex flex-col items-center justify-center" style={{ borderBottom: "1.5px solid #E4E6F7" }}>
          <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#C8960A", fontFamily: "Montserrat, sans-serif" }}>Blog y novedades</p>
          <h2 className="text-3xl md:text-[44px] font-bold max-w-2xl mx-auto" style={{ fontFamily: "Poppins, sans-serif", color: "#272B7C", lineHeight: 1.15 }}>
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
              style={{ top: 30, bottom: 30, left: -3, right: -3, background: "#FFDE59", borderRadius: 24, transform: "rotate(-2deg)", zIndex: 0 }} />
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
            de la sección. */}
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5 rounded-3xl p-7 md:px-9"
          style={{ background: "#fff", border: "1.5px solid #E4E6F7", boxShadow: "0 14px 34px -24px rgba(39,43,124,0.25)" }}>
          <div className="flex items-center gap-4">
            <span className="flex items-center justify-center rounded-2xl shrink-0" style={{ width: 44, height: 44, background: "linear-gradient(135deg, #C8960A, #FFDE59)" }}>
              <Bi n="envelope-paper" size={19} color="#fff" />
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

// ─── Joel, asesor virtual (chat guiado) ─────────────────────────────────────
// Mismo estilo y comportamiento que el chat de Transpack, con el avatar de
// Transarchivos: invitación que asoma a los 7 s (una vez por sesión), botón
// flotante, ventana con encabezado, mensajes uno a uno con "escribiendo…",
// opciones rápidas, campo de texto libre (reconoce palabras clave) y botones
// de acción (correo, teléfono, cotizador). No usa IA: sigue un guion.

type ChatData = Record<string, string>;
type ChatAction = { label: string; icon: string; href?: string; to?: string };
type ChatMsg = { from: "bot" | "user"; text: string; actions?: ChatAction[] };
type ChatOption = { label: string; next: string | ((d: ChatData) => string); set?: ChatData };
type ChatStep = {
  say: (d: ChatData) => string[];
  options?: ChatOption[] | ((d: ChatData) => ChatOption[]);
  input?: { key: string; placeholder: string; next: (d: ChatData) => string };
  actions?: (d: ChatData) => ChatAction[];
};

const CHAT_UNITS = [
  { slug: "diagnostico", title: "Diagnóstico documental", desc: "Le mostramos qué está pasando hoy con su archivo (volumen, estado, riesgos y oportunidades) antes de mover un solo papel." },
  ...services.map(sv => ({ slug: sv.slug, title: sv.title, desc: sv.desc })),
];
const unitBySlug = (slug: string) => CHAT_UNITS.find(u => u.slug === slug);
const foldChat = (t: string) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

const CHAT_VOLUMES = ["Menos de 100 cajas", "Entre 100 y 1.000 cajas", "Más de 1.000 cajas", "No lo sé"];
const CHAT_URGENCY = ["Sin urgencia", "En las próximas semanas", "Urgente"];
const CHAT_FAQ_COUNT = 6;

const quoteMailto = (d: ChatData) => {
  const body = `Hola, Transarchivos. Quisiera una cotización.\n\n` +
    `- Servicio: ${unitBySlug(d.service)?.title ?? "—"}\n- Volumen aproximado: ${d.volume ?? "—"}\n- Urgencia: ${d.urgency ?? "—"}\n` +
    `- Nombre: ${d.name ?? "—"}\n- Empresa: ${d.company ?? "—"}\n\n(Solicitud iniciada con Joel, asesor virtual)`;
  return `mailto:info@transarchivos.com?subject=${encodeURIComponent("Solicitud de cotización — " + (unitBySlug(d.service)?.title ?? "Transarchivos"))}&body=${encodeURIComponent(body)}`;
};

const CONTACT_ACTIONS: ChatAction[] = [
  { label: "Llamar al (601) 316-4530", icon: "telephone-fill", href: "tel:+576013164530" },
  { label: "Escribir a info@transarchivos.com", icon: "envelope-fill", href: "mailto:info@transarchivos.com" },
];

const CHAT_STEPS: Record<string, ChatStep> = {
  start: {
    say: () => ["¡Hola! Soy Joel, el asesor virtual de Transarchivos. 👋", "¿En qué le puedo ayudar hoy?"],
    options: [
      { label: "Cotizar un servicio", next: "q_service" },
      { label: "Conocer los servicios", next: "info_list" },
      { label: "Preguntas frecuentes", next: "faq_list" },
      { label: "Hablar con un asesor", next: "advisor" },
      { label: "Soy estudiante o busco empleo", next: "other" },
    ],
  },

  // Cotización guiada
  q_service: {
    say: () => ["Con gusto. ¿Qué servicio necesita?", "Si no está seguro, el diagnóstico documental es el mejor punto de partida."],
    options: CHAT_UNITS.map(u => ({ label: u.title, next: "q_volume", set: { service: u.slug } })),
  },
  q_volume: {
    say: d => [`${unitBySlug(d.service)?.title}: buena elección.`, "¿Aproximadamente qué volumen de archivo tiene?"],
    options: CHAT_VOLUMES.map(v => ({ label: v, next: "q_urgency", set: { volume: v } })),
  },
  q_urgency: {
    say: () => ["¿Qué tan pronto lo necesita?"],
    options: CHAT_URGENCY.map(v => ({ label: v, next: "q_name", set: { urgency: v } })),
  },
  q_name: {
    say: () => ["Perfecto. ¿Cuál es su nombre?"],
    input: { key: "name", placeholder: "Escriba su nombre…", next: () => "q_company" },
  },
  q_company: {
    say: d => [`Gracias, ${d.name}. ¿De qué empresa nos escribe?`],
    input: { key: "company", placeholder: "Nombre de la empresa…", next: () => "q_done" },
  },
  q_done: {
    say: d => [
      `Listo, ${d.name}. Este es el resumen de su solicitud:`,
      `• Servicio: ${unitBySlug(d.service)?.title}\n• Volumen: ${d.volume}\n• Urgencia: ${d.urgency}\n• Empresa: ${d.company}`,
      d.urgency === "Urgente"
        ? "Como es urgente, le recomiendo llamarnos directamente. También puede enviarnos el resumen por correo:"
        : "Envíenos el resumen por correo y un asesor le responderá con el alcance y las condiciones. Si quiere dar más detalles, puede completar la cotización detallada:",
    ],
    actions: d => [
      { label: "Enviar solicitud por correo", icon: "envelope-arrow-up-fill", href: quoteMailto(d) },
      { label: "Completar cotización detallada", icon: "ui-checks", href: "#cotizador" },
      { label: "Llamar al (601) 316-4530", icon: "telephone-fill", href: "tel:+576013164530" },
    ],
    options: [{ label: "Volver al inicio", next: "reset" }],
  },

  // Servicios
  info_list: {
    say: () => ["Estos son nuestros servicios. ¿Sobre cuál quiere saber más?"],
    options: CHAT_UNITS.map(u => ({ label: u.title, next: "info_detail", set: { service: u.slug } })),
  },
  info_detail: {
    say: d => [unitBySlug(d.service)?.desc ?? ""],
    actions: d => d.service === "diagnostico"
      ? [{ label: "Ver el diagnóstico documental", icon: "search", href: "#cotizador" }]
      : [{ label: `Ver ${unitBySlug(d.service)?.title}`, icon: "box-arrow-up-right", to: `/servicios/${d.service}` }],
    options: [
      { label: "Cotizar este servicio", next: "q_volume" },
      { label: "Ver otro servicio", next: "info_list" },
      { label: "Volver al inicio", next: "reset" },
    ],
  },

  // Preguntas frecuentes
  faq_list: {
    say: () => ["Estas son algunas de las preguntas que más nos hacen:"],
    options: () => FAQS.slice(0, CHAT_FAQ_COUNT).map((f, i) => ({ label: f.q, next: "faq_answer", set: { faq: String(i) } })),
  },
  faq_answer: {
    say: d => [FAQS[Number(d.faq)]?.a ?? ""],
    actions: () => [{ label: "Ver todas las preguntas", icon: "question-circle", href: "#faq" }],
    options: [
      { label: "Otra pregunta", next: "faq_list" },
      { label: "Cotizar un servicio", next: "q_service" },
      { label: "Volver al inicio", next: "reset" },
    ],
  },

  // Contacto y otros
  advisor: {
    say: () => ["Claro. Puede comunicarse con un asesor de Transarchivos por estos medios:"],
    actions: () => CONTACT_ACTIONS,
    options: [{ label: "Volver al inicio", next: "reset" }],
  },
  other: {
    say: () => ["Con gusto le ayudamos.", "Escríbanos a info@transarchivos.com: si es estudiante o investigador, le compartimos recursos de archivística; si busca empleo, use el asunto «Candidatura espontánea»."],
    actions: () => [{ label: "Escribir a info@transarchivos.com", icon: "envelope-fill", href: "mailto:info@transarchivos.com" }],
    options: [{ label: "Volver al inicio", next: "reset" }],
  },
  fallback: {
    say: () => ["No estoy seguro de haber entendido. 🤔", "¿Le ayudo con alguna de estas opciones?"],
    options: [
      { label: "Cotizar un servicio", next: "q_service" },
      { label: "Conocer los servicios", next: "info_list" },
      { label: "Preguntas frecuentes", next: "faq_list" },
      { label: "Hablar con un asesor", next: "advisor" },
    ],
  },
};

// Texto libre → paso del guion según palabras clave.
function routeChat(text: string): { next: string; set?: ChatData } {
  const t = foldChat(text);
  const svc = (slug: string) => ({ next: "info_detail", set: { service: slug } });
  if (/cotiz|precio|cuanto cuesta|costo|valor|tarifa/.test(t)) return { next: "q_service" };
  if (/diagnost/.test(t)) return svc("diagnostico");
  if (/digitaliz|escane|ocr/.test(t)) return svc("digitalizacion-de-documentos");
  if (/microfil/.test(t)) return svc("microfilmacion-de-archivos");
  if (/destru|triturar|eliminar/.test(t)) return svc("destruccion-de-documentos");
  if (/cinta|magnetic|disco|backup|respaldo/.test(t)) return svc("custodia-de-medios-magneticos");
  if (/custod|bodega|guardar|almacen/.test(t)) return svc("custodia-de-archivos");
  if (/inventario|clasific|organiz|cajas/.test(t)) return svc("levantamiento-de-inventario");
  if (/pgd|programa de gestion|trd|retencion/.test(t)) return svc("programa-de-gestion-documental");
  if (/inhouse|in house|sede|instalaciones/.test(t)) return svc("servicio-inhouse");
  if (/urgente|inmediat|express|rapido/.test(t)) return svc("servicio-inmediato");
  if (/bogota|ciudad|medellin|cali|barranquilla|pais|cobertura/.test(t)) return { next: "faq_answer", set: { faq: "3" } };
  if (/norma|ley|agn|594|legal/.test(t)) return { next: "faq_answer", set: { faq: "4" } };
  if (/asesor|humano|persona|llamar|telefono|correo|contacto/.test(t)) return { next: "advisor" };
  if (/empleo|trabajo|practica|estudiante|investig/.test(t)) return { next: "other" };
  if (/^(hola|buenas|buenos|hey)/.test(t)) return { next: "start" };
  return { next: "fallback" };
}

function ChatBubble({ msg }: { msg: ChatMsg }) {
  const bot = msg.from === "bot";
  return (
    <div className={`flex items-end gap-2 ${bot ? "justify-start" : "justify-end"}`} style={{ animation: "fadeInUp 0.3s ease both" }}>
      {bot && <ChatAvatarFace size={24} round />}
      <div className={`max-w-[82%] ${bot ? "" : "text-right"}`}>
        <div className="inline-block whitespace-pre-line px-3.5 py-2.5 text-left text-[13.5px] leading-relaxed"
          style={bot
            ? { background: "#fff", color: "#37352F", border: "1px solid #E4E6F7", borderRadius: "4px 16px 16px 16px", boxShadow: "0 1px 2px rgba(10,13,61,0.05)" }
            : { background: "#272B7C", color: "#fff", borderRadius: "16px 16px 4px 16px" }}>
          {msg.text}
        </div>
        {msg.actions && (
          <div className="mt-2 flex flex-col gap-1.5">
            {msg.actions.map(a => {
              const cls = "inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-[13px] font-semibold transition-colors bg-[#272B7C]/[0.07] text-[#272B7C] hover:bg-[#272B7C] hover:text-white";
              return a.to
                ? <Link key={a.label} to={a.to} className={cls} style={{ textDecoration: "none" }}><Bi n={a.icon} size={14} /> {a.label}</Link>
                : <a key={a.label} href={a.href} className={cls} style={{ textDecoration: "none" }}><Bi n={a.icon} size={14} /> {a.label}</a>;
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// "open"/"setOpen" viven en LandingPage para que el menú de soporte y la caja
// del hero también puedan abrir el chat. "seed": pregunta escrita en la caja
// del hero (con id para que dos preguntas iguales cuenten como distintas).
function ChatBot({ open, setOpen, seed }: { open: boolean; setOpen: (v: boolean | ((prev: boolean) => boolean)) => void; seed?: { text: string; id: number } | null }) {
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [stepId, setStepId] = useState("start");
  const [data, setData] = useState<ChatData>({});
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState("");
  const [teaser, setTeaser] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timers = useRef<number[]>([]);
  const seedHandled = useRef(0);
  const step = CHAT_STEPS[stepId];

  // Muestra los mensajes de un paso uno a uno, con indicador de "escribiendo".
  const goTo = (id: string, d: ChatData) => {
    const target = id === "reset" ? "start" : id;
    const nextData = id === "reset" ? {} : d;
    if (id === "reset") setMsgs([]);
    setData(nextData);
    setStepId(target);
    const s = CHAT_STEPS[target];
    const lines = s.say(nextData);
    setTyping(true);
    let delay = 0;
    lines.forEach((line, i) => {
      delay += Math.min(1100, 450 + line.length * 6);
      const last = i === lines.length - 1;
      timers.current.push(window.setTimeout(() => {
        setMsgs(m => [...m, { from: "bot", text: line, actions: last ? s.actions?.(nextData) : undefined }]);
        if (last) setTyping(false);
      }, delay));
    });
  };

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Al abrir: saludo la primera vez, o respuesta a la pregunta del hero.
  useEffect(() => {
    if (!open) return;
    setTeaser(false);
    if (seed && seed.id !== seedHandled.current) {
      seedHandled.current = seed.id;
      setMsgs(m => [...m, { from: "user", text: seed.text }]);
      const r = routeChat(seed.text);
      goTo(r.next, { ...data, ...r.set });
      return;
    }
    if (msgs.length === 0 && !typing) goTo("start", {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, seed]);

  // Invitación discreta a los 7 s, una sola vez por sesión.
  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem("ta-chat-teaser") === "1"; } catch { /* sin almacenamiento */ }
    if (seen) return;
    const id = window.setTimeout(() => {
      setTeaser(true);
      try { sessionStorage.setItem("ta-chat-teaser", "1"); } catch { /* sin almacenamiento */ }
    }, 7000);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [msgs, typing]);
  useEffect(() => { if (open && step.input && !typing) inputRef.current?.focus(); }, [open, step, typing]);

  const choose = (o: ChatOption) => {
    const d = { ...data, ...o.set };
    setMsgs(m => [...m, { from: "user", text: o.label }]);
    goTo(typeof o.next === "function" ? o.next(d) : o.next, d);
  };

  const send = () => {
    const value = text.trim();
    if (!value || typing) return;
    setText("");
    setMsgs(m => [...m, { from: "user", text: value }]);
    if (step.input) {
      const d = { ...data, [step.input.key]: value };
      goTo(step.input.next(d), d);
    } else {
      const r = routeChat(value);
      goTo(r.next, { ...data, ...r.set });
    }
  };

  const options = typeof step.options === "function" ? step.options(data) : (step.options ?? []);

  return (
    <>
      {/* Invitación: Joel se asoma junto al botón */}
      {teaser && !open && (
        <div className="fixed bottom-[76px] right-3 md:bottom-[88px] md:right-6 z-[60] flex items-end" style={{ animation: "fadeInUp 0.5s ease both" }}>
          <div className="relative mb-16 -mr-4 max-w-[230px] rounded-2xl rounded-br-sm bg-white px-4 py-3 text-[13.5px]"
            style={{ color: "#37352F", boxShadow: "0 20px 40px -16px rgba(10,13,61,0.35), 0 2px 8px rgba(10,13,61,0.08)" }}>
            <button onClick={() => setTeaser(false)} className="absolute right-2 top-1.5" aria-label="Cerrar invitación">
              <Bi n="x-lg" size={11} color="#9B9B9B" />
            </button>
            <button onClick={() => setOpen(true)} className="pr-3 text-left leading-relaxed">
              <b style={{ color: "#272B7C" }}>¡Hola! Soy Joel.</b> ¿Necesita organizar, digitalizar o custodiar su archivo? Le ayudo.
            </button>
          </div>
          <button onClick={() => setOpen(true)} aria-label="Hablar con Joel" className="shrink-0">
            <img src={avatarImg} alt="" draggable={false} className="h-[150px] md:h-[170px] w-auto select-none" style={{ filter: "drop-shadow(0 12px 18px rgba(29,32,80,0.25))" }} />
          </button>
        </div>
      )}

      {/* Botón flotante */}
      <button onClick={() => setOpen(o => !o)} aria-expanded={open}
        aria-label={open ? "Cerrar chat" : "Hablar con Joel, asesor virtual"}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[60] flex items-center gap-2.5 rounded-full p-1.5 md:pr-4 text-white transition-transform hover:-translate-y-0.5"
        style={{ background: "linear-gradient(135deg, #272B7C 0%, #1800AD 100%)", boxShadow: "0 16px 34px -10px rgba(39,43,124,0.6)" }}>
        {open ? (
          <span className="grid place-items-center rounded-full" style={{ width: 40, height: 40, background: "rgba(255,255,255,0.15)" }}>
            <Bi n="x-lg" size={16} color="#fff" />
          </span>
        ) : (
          <span className="relative">
            <span className="absolute inset-0 rounded-full" style={{ background: "rgba(255,222,89,0.45)", animation: "chatPing 2.4s cubic-bezier(0,0,0.2,1) infinite" }} />
            <ChatAvatarFace size={40} round />
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2" style={{ background: "#22c55e", borderColor: "#272B7C" }} />
          </span>
        )}
        <span className="hidden md:block text-left">
          <span className="flex items-center gap-1.5 text-[13px] font-semibold leading-tight" style={{ fontFamily: "Montserrat, sans-serif" }}>
            {open ? "Cerrar" : "Joel"}
            {!open && <span className="rounded-full px-1.5 py-px text-[9px] font-bold tracking-wide" style={{ background: "#FFDE59", color: "#272B7C" }}>IA</span>}
          </span>
          {!open && <span className="block text-[11.5px] leading-tight" style={{ color: "rgba(255,255,255,0.7)" }}>En línea</span>}
        </span>
      </button>

      {/* Ventana */}
      {open && (
        <section aria-label="Chat con Joel"
          className="fixed inset-x-3 bottom-[76px] top-20 sm:inset-x-auto sm:right-6 sm:top-auto sm:w-[400px] md:bottom-[92px] z-[60] flex flex-col overflow-hidden rounded-[24px] bg-white"
          style={{ height: undefined, maxHeight: "calc(100vh - 130px)", minHeight: 0, boxShadow: "0 40px 80px -30px rgba(39,43,124,0.5)", border: "1px solid rgba(39,43,124,0.1)", animation: "fadeInUp 0.3s ease both" }}>
          <div className="sm:h-[min(620px,calc(100vh-130px))] flex flex-col min-h-0 flex-1">
            <header className="relative flex items-center gap-3 overflow-hidden px-5 py-4" style={{ background: "linear-gradient(135deg, #272B7C 0%, #1800AD 100%)" }}>
              <span className="pointer-events-none absolute -right-14 -top-20 h-48 w-48 rounded-full" style={{ background: "radial-gradient(circle, rgba(255,222,89,0.3), transparent 70%)" }} />
              <span className="relative">
                <ChatAvatarFace size={42} round />
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2" style={{ background: "#22c55e", borderColor: "#272B7C" }} />
              </span>
              <div className="relative flex-1 min-w-0">
                <p className="flex items-center gap-2 font-semibold" style={{ color: "#fff", fontFamily: "Poppins, sans-serif" }}>
                  Joel
                  <span className="rounded-full px-2 py-px text-[10px] font-semibold uppercase tracking-wider" style={{ background: "rgba(255,255,255,0.15)", color: "#FFDE59" }}>Asesor virtual</span>
                </p>
                <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.7)" }}>Transarchivos · Responde al instante</p>
              </div>
              <button onClick={() => goTo("reset", {})} className="relative grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-white/15" aria-label="Reiniciar conversación" title="Reiniciar conversación">
                <Bi n="arrow-counterclockwise" size={15} color="rgba(255,255,255,0.85)" />
              </button>
              <button onClick={() => setOpen(false)} className="relative grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-white/15" aria-label="Cerrar chat">
                <Bi n="x-lg" size={14} color="rgba(255,255,255,0.85)" />
              </button>
            </header>

            <div className="flex-1 min-h-0 space-y-3 overflow-y-auto p-4" style={{ background: "#F6F7FD" }} aria-live="polite">
              {msgs.map((m, i) => <ChatBubble key={i} msg={m} />)}
              {typing && (
                <div className="flex items-end gap-2">
                  <ChatAvatarFace size={24} round />
                  <div className="flex gap-1 px-3.5 py-3" style={{ background: "#fff", border: "1px solid #E4E6F7", borderRadius: "4px 16px 16px 16px" }}>
                    {[0, 1, 2].map(i => <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(39,43,124,0.6)", animation: `chatBounce 1.4s ${i * 0.15}s infinite` }} />)}
                  </div>
                </div>
              )}
              {!typing && options.length > 0 && (
                <div className="flex flex-wrap justify-end gap-1.5 pt-1">
                  {options.map(o => (
                    <button key={o.label} onClick={() => choose(o)}
                      className="rounded-full border px-3.5 py-2 text-left text-[13px] font-semibold transition-colors border-[#272B7C]/25 bg-white text-[#272B7C] hover:border-[#272B7C] hover:bg-[#272B7C] hover:text-white"
                      style={{ animation: "fadeInUp 0.3s ease both", fontFamily: "Montserrat, sans-serif" }}>
                      {o.label}
                    </button>
                  ))}
                </div>
              )}
              <div ref={endRef} />
            </div>

            <form onSubmit={e => { e.preventDefault(); send(); }} className="flex items-center gap-2 bg-white p-3" style={{ borderTop: "1px solid #ECEEF6" }}>
              <input ref={inputRef} value={text} onChange={e => setText(e.target.value)}
                placeholder={step.input?.placeholder ?? "Escriba su mensaje…"} aria-label="Mensaje"
                className="min-w-0 flex-1 rounded-full px-4 py-2.5 text-[14px] outline-none transition focus:bg-white"
                style={{ border: "1px solid #E4E6F7", background: "#F6F7FD", color: "#272B7C" }} />
              <button type="submit" disabled={!text.trim() || typing} aria-label="Enviar"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full transition-opacity disabled:opacity-40" style={{ background: "#FFDE59" }}>
                <Bi n="send-fill" size={15} color="#272B7C" />
              </button>
            </form>
          </div>
        </section>
      )}
    </>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

// Toda la página principal (antes era el App exportado directamente). Ahora
// App es un enrutador liviano: esto vive en "/", y cada card de servicio
// enlaza a su propia página en "/servicios/:slug" (ver ServiceDetailPage).
// ─── Soporte (ícono de audífonos del header) ────────────────────────────────
// Tarjeta flotante bajo el ícono, abierta hacia la derecha (hacia el margen,
// para no tapar el contenido del hero; si no cabe, se corre a la izquierda):
// chat con Joel, teléfono, correo y enlace a las preguntas frecuentes. Se dibuja con position: fixed (el pill del
// header recorta lo que sobresale) y se cierra al hacer clic fuera o scroll.

function SupportPopover({ anchor, onClose, onChat, onHoverIn, onHoverOut }: { anchor: DOMRect; onClose: () => void; onChat: () => void; onHoverIn?: () => void; onHoverOut?: () => void }) {
  const items = [
    { ic: "chat-dots", t: "Chatee con Joel", d: "Asesor con IA, responde al instante", onClick: () => { onChat(); onClose(); } },
    { ic: "telephone", t: "Llámenos", d: "(601) 316-4530", href: "tel:+576013164530" },
    { ic: "envelope", t: "Escríbanos", d: "info@transarchivos.com", href: "mailto:info@transarchivos.com" },
  ];
  return (
    <div data-support-popover onMouseEnter={onHoverIn} onMouseLeave={onHoverOut} className="fixed z-[60] w-[340px] rounded-3xl overflow-hidden"
      style={{ top: anchor.bottom + 12, left: Math.max(16, Math.min(anchor.left - 8, window.innerWidth - 340 - 16)), background: "#fff", boxShadow: "0 30px 60px -20px rgba(10,13,61,0.35), 0 4px 14px rgba(10,13,61,0.08)", animation: "fadeInUp 0.2s ease both" }}>
      <div className="relative px-6 pt-5 pb-5 overflow-hidden" style={{ background: "linear-gradient(135deg, #14163F 0%, #272B7C 100%)" }}>
        <span className="absolute pointer-events-none" style={{ top: -30, right: -30, width: 110, height: 110, background: "rgba(255,222,89,0.18)", transform: "rotate(45deg)", borderRadius: 18 }} />
        <p className="relative flex items-center gap-2 text-base font-bold" style={{ color: "#fff", fontFamily: "Poppins, sans-serif" }}>
          <Bi n="headset" size={17} color="#FFDE59" /> Soporte Transarchivos
        </p>
        <p className="relative text-sm mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>¿Necesita ayuda con su archivo o su solicitud?</p>
      </div>
      <div className="py-2">
        {items.map(it => {
          const inner = (
            <>
              <span className="flex items-center justify-center rounded-xl shrink-0" style={{ width: 40, height: 40, background: "#F2F3FA" }}>
                <Bi n={it.ic} size={17} color="#272B7C" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif" }}>{it.t}</span>
                <span className="block text-xs truncate" style={{ color: "#8A8A8A" }}>{it.d}</span>
              </span>
            </>
          );
          const cls = "w-full flex items-center gap-3.5 px-6 py-3 text-left transition-colors hover:bg-[#F7F8FF]";
          return it.href
            ? <a key={it.t} href={it.href} className={cls} style={{ textDecoration: "none" }} onClick={onClose}>{inner}</a>
            : <button key={it.t} type="button" className={cls} onClick={it.onClick}>{inner}</button>;
        })}
      </div>
      <a href="#faq" onClick={onClose} className="flex items-center justify-between px-6 py-4 text-sm font-bold transition-colors hover:bg-[#F7F8FF]"
        style={{ borderTop: "1px solid #ECEEF6", color: "#272B7C", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
        Ver preguntas frecuentes <Bi n="question-circle" size={16} color="#272B7C" />
      </a>
    </div>
  );
}

// ─── Preguntas frecuentes ───────────────────────────────────────────────────
// Respuestas basadas en el contenido real del sitio (servicios, normativa,
// cobertura). Acordeón: una abierta a la vez.

const FAQS = [
  { q: "¿Por qué empezar con un diagnóstico documental?", a: "Porque antes de mover un solo papel conviene saber qué está pasando con su archivo: volumen, estado, espacio que ocupa, organización, riesgos y oportunidades. Con esa información usted decide qué servicios necesita, en lugar de partir de suposiciones." },
  { q: "¿Cómo solicito una cotización?", a: "En la sección «Solicite su cotización» elige el servicio, responde unas preguntas sobre su archivo y deja sus datos de contacto. Al final se genera un correo con la solicitud lista para enviar, y un asesor le responde con el alcance y las condiciones. Si no conoce algún dato, puede marcar «No lo sé»." },
  { q: "¿Cómo se calcula el costo de los servicios?", a: "Depende del servicio, del volumen y de las condiciones de su archivo. En custodia, por ejemplo, el costo es variable y escalable: paga por el volumen que custodia, sin costos fijos de espacio o personal. Por eso cada cotización se arma con la información de su caso." },
  { q: "¿Atienden empresas fuera de Bogotá?", a: "Operamos principalmente en Bogotá, donde están nuestra sede y nuestras bodegas de custodia. Estamos abiertos a atender empresas en otras ciudades de Colombia según el alcance del proyecto." },
  { q: "¿Qué normativa cumplen?", a: "Trabajamos bajo la Ley General de Archivos (Ley 594 de 2000) y la normativa del Archivo General de la Nación, además de la Ley 1581 de 2012 de protección de datos personales, entre otras normas aplicables a la gestión documental." },
  { q: "¿Cómo protegen los documentos que custodian?", a: "Nuestro centro documental cuenta con vigilancia 24 horas con CCTV, control de acceso y monitoreo ambiental permanente. Además, puede consultar y recuperar sus documentos cuando los necesite." },
  { q: "¿La digitalización tiene validez legal?", a: "Sí. La conversión de documentos físicos a digitales se realiza con captura, indexación y OCR opcional, en el marco de la Ley 527 de 1999, que reconoce la validez de los documentos electrónicos." },
  { q: "¿Entregan constancia cuando destruyen documentos?", a: "Sí. La destrucción es segura y trazable, y se entrega con acta de eliminación y certificado de destrucción, alineada con la Ley 594 de 2000." },
  { q: "¿Pueden trabajar dentro de nuestras instalaciones?", a: "Sí, con el Servicio Inhouse: personal técnico de archivo trabaja en su sede, capacitado y supervisado por Transarchivos." },
];

function FaqSection({ onChat }: { onChat: () => void }) {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="py-20" style={{ background: "#F7F8FF", scrollMarginTop: 80 }}>
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[340px_minmax(0,1fr)] gap-10 items-start">
        <div className="lg:sticky lg:top-28">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#C8960A", fontFamily: "Montserrat, sans-serif" }}>Preguntas frecuentes</p>
          <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: "Poppins, sans-serif", color: "#272B7C", lineHeight: 1.2 }}>Resolvemos sus dudas</h2>
          <p className="text-sm mb-7" style={{ color: "#6B6B6B", lineHeight: 1.65 }}>Lo que más nos preguntan sobre nuestros servicios. Si no encuentra su respuesta, hable con nosotros.</p>
          <div className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid #E4E6F7", boxShadow: "0 20px 40px -30px rgba(39,43,124,0.35)" }}>
            <p className="text-sm font-bold mb-3" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>¿Necesita ayuda?</p>
            <button type="button" onClick={onChat} className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 mb-2 text-left transition-colors hover:opacity-90" style={{ background: "#272B7C" }}>
              <ChatAvatarFace size={30} ring="light" />
              <span className="text-sm font-bold" style={{ color: "#fff", fontFamily: "Montserrat, sans-serif" }}>Chatee con Joel</span>
            </button>
            <a href="tel:+576013164530" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-[#F7F8FF]" style={{ color: "#272B7C", textDecoration: "none" }}>
              <Bi n="telephone" size={15} color="#272B7C" /> (601) 316-4530
            </a>
            <a href="mailto:info@transarchivos.com" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-[#F7F8FF]" style={{ color: "#272B7C", textDecoration: "none" }}>
              <Bi n="envelope" size={15} color="#272B7C" /> info@transarchivos.com
            </a>
          </div>
        </div>

        <div className="space-y-3">
          {FAQS.map((f, i) => {
            const on = open === i;
            return (
              <div key={f.q} className="rounded-2xl overflow-hidden transition-shadow" style={{ background: "#fff", border: `1px solid ${on ? "#C9CDEE" : "#E4E6F7"}`, boxShadow: on ? "0 18px 36px -28px rgba(39,43,124,0.45)" : "none" }}>
                <button type="button" onClick={() => setOpen(on ? -1 : i)} aria-expanded={on}
                  className="w-full flex items-center justify-between gap-4 px-5 md:px-6 py-4 text-left">
                  <span className="text-sm md:text-[15px] font-bold" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif" }}>{f.q}</span>
                  <span className="flex items-center justify-center rounded-full shrink-0 transition-transform" style={{ width: 28, height: 28, background: on ? "#272B7C" : "#F2F3FA", transform: on ? "rotate(45deg)" : "none" }}>
                    <Bi n="plus-lg" size={13} color={on ? "#fff" : "#272B7C"} />
                  </span>
                </button>
                <div className="grid transition-all duration-300" style={{ gridTemplateRows: on ? "1fr" : "0fr" }}>
                  <div className="overflow-hidden">
                    <p className="px-5 md:px-6 pb-5 text-sm" style={{ color: "#6B6B6B", lineHeight: 1.7 }}>{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Aparición al hacer scroll ──────────────────────────────────────────────
// Mismo efecto que en Transpack: cada bloque entra con un fundido y un leve
// desplazamiento hacia arriba cuando aparece en pantalla al bajar. Se aplica
// solo a las secciones debajo del hero, recorriendo su contenido: entra en
// los contenedores (max-w / mx-auto) y, si encuentra una grilla, anima cada
// tarjeta por separado y escalonada. Respeta "reducir movimiento".

function useScrollReveal(rootRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items: HTMLElement[] = [];
    const collect = (el: Element, depth: number) => {
      let k = 0;
      for (const child of Array.from(el.children) as HTMLElement[]) {
        const cs = getComputedStyle(child);
        if (cs.position === "absolute" || cs.position === "fixed" || cs.display === "none") continue;
        const cls = typeof child.className === "string" ? child.className : "";
        const isWrapper = depth < 3 && (/\bmax-w-|\bmx-auto\b/.test(cls) || (child.children.length === 1 && child.tagName === "DIV" && !/\bgrid\b|rounded/.test(cls)));
        if (isWrapper) { collect(child, depth + 1); continue; }
        if (/\bgrid\b/.test(cls) && child.children.length > 1 && child.children.length <= 12) {
          (Array.from(child.children) as HTMLElement[]).forEach((g, i) => { g.style.transitionDelay = `${Math.min(i, 5) * 90}ms`; items.push(g); });
          continue;
        }
        child.style.transitionDelay = `${Math.min(k, 3) * 80}ms`;
        items.push(child);
        k++;
      }
    };
    root.querySelectorAll(":scope > section, :scope > div > section").forEach((sec, i) => { if (i > 0) collect(sec, 0); });

    items.forEach(el => el.classList.add("reveal"));
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target as HTMLElement;
        el.classList.add("is-visible");
        io.unobserve(el);
        // Quita el retraso una vez visible para no frenar los efectos hover.
        window.setTimeout(() => { el.style.transitionDelay = ""; }, 1300);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [rootRef]);
}

function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  // Si el navegador restaura el scroll al recargar, el header arranca ya en
  // su estado final (sin animar el cambio).
  const [scrolled, setScrolled] = useState(() => typeof window !== "undefined" && window.scrollY > 24);
  // Al cargar, el ancho del botón CTA se mide cuando terminan de cargar las
  // fuentes y eso movía los elementos del navbar. Hasta pasado ese momento
  // se desactivan las transiciones del header (clase nav-preload), así el
  // navbar aparece estático; después vuelven los efectos normales.
  const [navReady, setNavReady] = useState(false);
  useEffect(() => {
    // document.fonts.ready a veces se resuelve antes de que llegue la hoja de
    // Google Fonts, así que además se espera un mínimo de 1,5 s.
    let alive = true;
    const minWait = new Promise(r => window.setTimeout(r, 1500));
    const fonts = document.fonts?.ready ?? Promise.resolve();
    Promise.all([minWait, fonts]).then(() => { if (alive) setNavReady(true); });
    return () => { alive = false; };
  }, []);
  // Un solo dropdown abierto a la vez en el pill ("Servicios" o "Nosotros",
  // antes solo existía "Servicios" con un boolean — ahora que hay dos, se
  // necesita saber CUÁL está abierto, no solo si algo está abierto).
  const [openMenu, setOpenMenu] = useState<"servicios" | "nosotros" | "blog" | null>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  // Estado del chat en App (no dentro de ChatBot): así el avatar del hero
  // también puede abrirlo con un clic, no solo el botón flotante.
  const [chatOpen, setChatOpen] = useState(false);
  const [chatSeed, setChatSeed] = useState<{ text: string; id: number } | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  // Animación de entrada (solo la carpeta): solo la primera carga de la sesión
  // y nunca con "reducir movimiento". El estado final es la página normal.
  const [intro] = useState(() => {
    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
      if (sessionStorage.getItem("ta-intro") === "1") return false;
      sessionStorage.setItem("ta-intro", "1");
    } catch { /* sin almacenamiento: se anima igual */ }
    return true;
  });
  useScrollReveal(pageRef);
  const askJoel = (text: string) => { setChatSeed({ text, id: Date.now() }); setChatOpen(true); };

  // Tarjeta de soporte (audífonos): guarda la posición del botón al abrir.
  const supportBtnRef = useRef<HTMLButtonElement>(null);
  const [supportAnchor, setSupportAnchor] = useState<DOMRect | null>(null);
  const openSupport = () => {
    setOpenMenu(null); setSearchOpen(false);
    if (supportBtnRef.current) setSupportAnchor(supportBtnRef.current.getBoundingClientRect());
  };
  const toggleSupport = () => { if (supportAnchor) setSupportAnchor(null); else openSupport(); };
  // Se abre al pasar el cursor y se cierra al salir, con un pequeño margen
  // para alcanzar a cruzar el espacio entre el botón y la tarjeta.
  const supportLeaveTimer = useRef<number | undefined>(undefined);
  const supportHoverIn = () => { clearTimeout(supportLeaveTimer.current); if (!supportAnchor) openSupport(); };
  const supportHoverOut = () => { clearTimeout(supportLeaveTimer.current); supportLeaveTimer.current = window.setTimeout(() => setSupportAnchor(null), 220); };
  useEffect(() => {
    if (!supportAnchor) return;
    const close = () => setSupportAnchor(null);
    const onDown = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest("[data-support-popover]") && !supportBtnRef.current?.contains(t)) close();
    };
    window.addEventListener("scroll", close, { passive: true });
    window.addEventListener("resize", close);
    document.addEventListener("mousedown", onDown);
    return () => { window.removeEventListener("scroll", close); window.removeEventListener("resize", close); document.removeEventListener("mousedown", onDown); };
  }, [supportAnchor]);

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
    { label: "Contacto", href: "#faq" },
  ];

  return (
    <div ref={pageRef} className="min-h-full" style={{ background: "#ffffff", fontFamily: "Inter, sans-serif", color: "#37352F" }}>

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
        className={`fixed top-0 left-0 right-0 z-50 pb-3 min-h-[72px] md:min-h-0 flex items-center justify-center ${navReady ? "" : "nav-preload"}`}
        style={{
          // Sin borderBottom: una línea de 1px sólida se ve dura/"cortada" al
          // volver de scrolled a flotante — una sombra suave, sin borde, separa
          // igual de bien pero con un degradado, más estético.
          background: scrolled ? "#ffffff" : "transparent",
          boxShadow: scrolled ? "0 4px 20px rgba(10,13,61,0.12)" : "none",
          // Arriba del todo, la barra flota separada del borde superior; al
          // hacer scroll se pega arriba y pasa a barra completa.
          paddingTop: scrolled ? 0 : 18,
          transition: "background 0.3s ease, box-shadow 0.3s ease, padding-top 0.3s ease",
        }}
      >
        {/* Logo — suelto, alineado con el borde del bloque de texto del hero (no
            pegado al borde real de la pantalla) */}
        {/* top fijo en vez de top-1/2 (que centra respecto al header completo): al
            abrirse "Servicios" el header crece en alto, y con top-1/2 el logo se
            iba arrastrando hacia el centro nuevo en vez de quedarse arriba, fijo
            junto a la fila 1 del navbar. */}
        <a href="#" className="absolute z-10 left-4 md:left-28" style={{ top: scrolled ? 5 : 12, transition: "top 0.3s ease" }}>
          <HeaderLogo scrolled={scrolled} size={scrolled ? 50 : 64} />
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
                  {[{ label: "Contacto", href: "#faq" }].map(l => (
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
            <button ref={supportBtnRef} type="button" onClick={toggleSupport} onMouseEnter={supportHoverIn} onMouseLeave={supportHoverOut} aria-label="Soporte" title="Soporte" aria-expanded={!!supportAnchor}
              className="flex items-center justify-center rounded-full shrink-0 transition-transform hover:scale-105 active:scale-95"
              style={{ width: 36, height: 36, background: supportAnchor ? "#272B7C" : "#fff", border: `1.5px solid ${supportAnchor ? "#272B7C" : "#E4E6F7"}`, marginLeft: 6, marginRight: scrolled ? 8 : 0 }}>
              <Bi n="headset" size={15} color={supportAnchor ? "#fff" : "#272B7C"} />
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

      {/* ── HERO ────────────────────────────────────────────────────────────
          Centrado sobre los videos de fondo: insignia, título, bajada y una
          caja para escribirle directo a Joel. Debajo, la franja navy con una
          muesca recortada (a través de ella se ven los videos) y la sección
          "Dónde operamos". */}
      <section className="relative overflow-hidden" style={{ background: "#3a3c56" }}>
        <HeroVideoBackground />
        <div className="relative">
        <div className="relative max-w-2xl mx-auto px-6 pt-28 md:pt-44 pb-6 text-center flex flex-col justify-center md:min-h-[72vh]">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5" style={{ fontFamily: "Poppins, sans-serif", color: "#fff", lineHeight: 1.15, textShadow: "0 2px 18px rgba(10,13,61,0.45)" }}>
            Sus archivos,<br />
            bajo{" "}
            <span className="inline-block rounded-xl md:rounded-2xl px-3 md:px-4 align-middle" style={{ background: "#FFDE59", color: "#272B7C", textShadow: "none", paddingBottom: "0.12em" }}>resguardo</span>.
          </h1>

          <p className="text-base max-w-2xl mx-auto mb-7" style={{ color: "rgba(255,255,255,0.85)", textWrap: "balance", textShadow: "0 1px 10px rgba(10,13,61,0.5)" }}>
            Clasificamos, digitalizamos, custodiamos y destruimos legalmente sus documentos
          </p>

          <HeroAskJoel onAsk={askJoel} />
        </div>
        </div>

        {/* Carpeta: cuerpo de un solo color (mismo tono claro de la sección de blog, #FBFBF8) con una pestaña
            arriba a la izquierda, como una carpeta de archivo, sobre los videos. */}
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 mt-24 md:mt-36">
          <div className={`relative h-[130px] md:h-[170px] ${intro ? "folder-intro" : ""}`}>
            {/* La pestaña baja 3 px por dentro del cuerpo (se solapan) para que
                nunca se vea una línea de corte entre ambos durante la animación. */}
            <svg className="folder-tab absolute left-0 block" width="280" height="49" viewBox="0 0 280 49" aria-hidden="true" style={{ bottom: "calc(100% - 3px)" }}>
              <path d="M0 49 V18 Q0 0 18 0 H196 Q209 0 217 10 L242 38 Q249 46 262 46 H280 V49 Z" fill="#FBFBF8" />
            </svg>
            <div className="absolute inset-0" style={{ background: "#FBFBF8", borderRadius: "0 28px 0 0" }} />
          </div>
        </div>

        {/* Bottom trust bar */}
        <div className="relative border-t py-4" style={{ borderColor: "#E9E9E7", background: "#fff" }}>
          <div className="max-w-6xl mx-auto px-8 flex flex-wrap justify-center md:justify-between items-center gap-4">
            {["Ley 594 de 2000", "Norma AGN", "Certificado de destrucción", "Custodia con vigilancia 24 h"].map(t => (
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
      <section id="diagnostico" className="relative overflow-hidden py-16" style={{ background: "#fff", scrollMarginTop: 80 }}>
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="relative overflow-hidden rounded-3xl grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]"
            style={{ background: "#fff", border: "1.5px solid #E4E6F7", boxShadow: "0 30px 60px -34px rgba(39,43,124,0.3)" }}>

            {/* Izquierda: propuesta + proceso */}
            <div className="relative p-6 md:p-10">
              <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-4"
                style={{ background: "linear-gradient(135deg, #272B7C, #1800AD)", color: "#fff", fontFamily: "Montserrat, sans-serif", boxShadow: "0 8px 16px -8px rgba(39,43,124,0.5)" }}>
                Diagnóstico documental
              </span>
              <h3 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif", lineHeight: 1.2 }}>
                La <span style={{ background: "linear-gradient(transparent 62%, #FFDE59 62%)" }}>radiografía completa</span> de su archivo, antes de mover un solo papel
              </h3>
              <p className="text-sm mb-8" style={{ color: "#6B6B6B", lineHeight: 1.65 }}>
                No le preguntamos qué servicio quiere: le mostramos qué está pasando hoy con su archivo, para que decida con información real — no con suposiciones.
              </p>

              {/* Proceso en 4 pasos (línea de tiempo vertical) */}
              <ol className="relative mb-9">
                <span className="absolute w-0.5 rounded-full" style={{ left: 15, top: 16, bottom: 16, background: "#E4E6F7" }} />
                {[
                  { t: "Diagnóstico", d: "Revisamos su archivo tal como está hoy." },
                  { t: "Hallazgos", d: "Identificamos volumen, estado, riesgos y oportunidades." },
                  { t: "Plan de acción", d: "Priorizamos qué hacer primero y con qué servicios." },
                  { t: "Propuesta", d: "Recibe una propuesta clara, con alcance y tiempos." },
                ].map((st, i) => (
                  <li key={st.t} className="relative flex items-start gap-4 pb-5 last:pb-0">
                    <span className="relative flex items-center justify-center rounded-full font-bold text-xs shrink-0"
                      style={{ width: 32, height: 32, background: i === 0 ? "#272B7C" : "#fff", color: i === 0 ? "#fff" : "#272B7C", border: "2px solid #272B7C", fontFamily: "Poppins, sans-serif" }}>
                      {i + 1}
                    </span>
                    <div className="pt-1">
                      <p className="text-sm font-bold" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>{st.t}</p>
                      <p className="text-xs mt-0.5" style={{ color: "#8A8A8A" }}>{st.d}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <a href="#cotizador" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95"
                style={{ background: "#272B7C", color: "#fff", fontFamily: "Montserrat, sans-serif", textDecoration: "none", boxShadow: "0 14px 28px -10px rgba(39,43,124,0.45)" }}>
                Solicitar diagnóstico <Bi n="arrow-right" size={15} color="#fff" />
              </a>
            </div>

            {/* Derecha: "informe" con lo que identifica */}
            <div className="relative p-6 md:p-10 flex items-center" style={{ background: "#F7F8FF" }}>
              <Bi n="search" size={260} color="#272B7C"
                className="hidden md:block absolute pointer-events-none select-none"
                style={{ top: -40, right: -40, opacity: 0.04, transform: "rotate(12deg)" }} />
              <div className="relative w-full rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1px solid #E4E6F7", boxShadow: "0 24px 48px -28px rgba(39,43,124,0.35)" }}>
                <div className="flex items-center justify-between gap-3 px-5 py-4" style={{ borderBottom: "1px solid #ECEEF6" }}>
                  <span className="flex items-center gap-3">
                    <BiTile n="file-earmark-text" size={36} accent="#1800AD" />
                    <span>
                      <span className="block text-sm font-bold" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>Informe de diagnóstico</span>
                      <span className="block text-[11px]" style={{ color: "#9B9B9B" }}>Lo que identificamos en su archivo</span>
                    </span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0" style={{ background: "#FFF6D6", color: "#8a6d00", fontFamily: "Montserrat, sans-serif" }}>7 puntos</span>
                </div>
                <ul className="px-5 py-1.5">
                  {[
                    { i: "stack", t: "Volumen y estado documental", d: "Cuántos documentos tiene y en qué condición se encuentran" },
                    { i: "rulers", t: "Espacio ocupado", d: "Metros lineales o cúbicos que ocupa su archivo hoy" },
                    { i: "list-check", t: "Inventario y organización", d: "Cómo están clasificados y si siguen la TRD vigente" },
                    { i: "upc-scan", t: "Oportunidades de digitalización", d: "Qué series pueden pasar a un flujo digital" },
                    { i: "shield-check", t: "Necesidades de custodia", d: "Qué debe resguardarse bajo condiciones controladas" },
                    { i: "hourglass-bottom", t: "Disposición final", d: "Qué documentos ya cumplieron su tiempo de retención" },
                    { i: "exclamation-triangle", t: "Riesgos y oportunidades de mejora", d: "Vacíos normativos y puntos por optimizar" },
                  ].map((f, k) => (
                    <li key={f.t} className="flex items-center gap-3 py-2.5" style={{ borderTop: k ? "1px solid #F1F2F8" : "none" }}>
                      <BiTile n={f.i} size={32} accent="#272B7C" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-semibold leading-snug" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif" }}>{f.t}</p>
                        <p className="text-[11px] leading-snug" style={{ color: "#8A8A8A" }}>{f.d}</p>
                      </div>
                      <Bi n="check-circle-fill" size={15} color="#16a34a" />
                    </li>
                  ))}
                </ul>
              </div>
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
            {services.map(s => <ServiceCard key={s.title} service={s} />)}
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
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true" style={{ zIndex: 0 }}>
          {/* Un resplandor navy sutil (se quitó el dorado — se veía como una
              mancha amarilla pegada a la esquina). */}
          <div className="absolute rounded-full" style={{ width: 560, height: 560, top: "58%", left: "-10%", background: "radial-gradient(circle, rgba(24,0,173,0.08) 0%, transparent 70%)" }} />

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
                items: [{ i: "search", l: "Diagnóstico documental", href: "#cotizador" }, { i: "list-columns-reverse", l: "Levantamiento de inventario", to: "/servicios/levantamiento-de-inventario" }] },
              { n: 2, t: "Solución", k: "Transformación", ic: "gear-wide-connected", c: "#272B7C", d: "Resolvemos el problema documental con un proyecto a la medida.", g: "linear-gradient(135deg, #272B7C 0%, #4B50A0 100%)",
                items: [{ i: "upc-scan", l: "Digitalización", to: "/servicios/digitalizacion-de-documentos" }, { i: "folder2-open", l: "Programa de Gestión Documental", to: "/servicios/programa-de-gestion-documental" }] },
              { n: 3, t: "Protección", k: "Recurrencia", ic: "shield-fill-check", c: "#1800AD", d: "Protegemos su información y la mantenemos disponible cuando la necesite.", g: "linear-gradient(135deg, #1800AD 0%, #5B3FD4 100%)",
                items: [{ i: "archive", l: "Custodia de archivos", to: "/servicios/custodia-de-archivos" }, { i: "hdd-stack", l: "Custodia de medios magnéticos", to: "/servicios/custodia-de-medios-magneticos" }] },
              { n: 4, t: "Expansión", k: "Nuevos proyectos", ic: "rocket-takeoff-fill", c: "#272B7C", d: "Cerramos el ciclo de vida documental y ampliamos el valor de la relación.", g: "linear-gradient(135deg, #14163F 0%, #272B7C 100%)",
                items: [{ i: "file-earmark-x", l: "Destrucción legal", to: "/servicios/destruccion-de-documentos" }, { i: "lightning-charge", l: "Servicio inmediato", to: "/servicios/servicio-inmediato" }, { i: "person-badge", l: "Servicio Inhouse", to: "/servicios/servicio-inhouse" }] },
            ].map((st, idx, arr) => (
              <div key={st.n} className="group relative rounded-3xl flex flex-col transition-all hover:-translate-y-2"
                // z-index decreciente: cada tarjeta queda por encima de la
                // siguiente, así su flecha amarilla (que se monta sobre el borde
                // de la tarjeta de al lado) siempre se ve completa, incluso al
                // pasar el mouse.
                style={{ background: "#fff", border: "1.5px solid #E4E6F7", boxShadow: "0 18px 40px -24px rgba(39,43,124,0.4)", zIndex: arr.length - idx }}>
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
                            <Bi n={it.i} size={17} color="#272B7C" />
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

      <FaqSection onChat={() => setChatOpen(true)} />

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
              { ic: "shield-check", t: "Cumplimiento normativo", d: "Operamos bajo la Ley 594 de 2000 y la normativa del AGN." },
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
                  { label: "Preguntas frecuentes", to: "/#faq" },
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

      {supportAnchor && <SupportPopover anchor={supportAnchor} onClose={() => setSupportAnchor(null)} onChat={() => setChatOpen(true)} onHoverIn={supportHoverIn} onHoverOut={supportHoverOut} />}

      <ChatBot open={chatOpen} setOpen={setChatOpen} seed={chatSeed} />
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
      <BiTile n={icon} size={40} accent="#1800AD" />
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
    { l: "Cumplimiento normativo", a: "certificados" },
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

          <div className="grid grid-cols-2 gap-4 mt-10 max-w-sm">
            {[["40+", "Años de experiencia"], ["1983", "Año de fundación"]].map(([v, l]) => (
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
          <NosotrosKicker icon="clock-history" label="Nuestra historia" />
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
          <NosotrosKicker icon="bullseye" label="Misión y visión" />
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
          <NosotrosKicker icon="people" label="Nuestro equipo" />
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
          <NosotrosKicker icon="heart" label="Cultura organizacional" />
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
          <NosotrosKicker icon="briefcase" label="Nuestros principales clientes" />
          <p className="text-sm max-w-2xl mt-4 mb-6" style={{ color: "#6B6B6B" }}>
            Atendemos multinacionales, pymes y microempresas, y también compañías en liquidación o reestructuración, en estos sectores:
          </p>
          <div className="grid grid-cols-3 gap-3 mb-4 max-w-2xl">
            {[
              { icon: "bank", label: "Financiero y aseguradoras" },
              { icon: "heart-pulse", label: "Salud y laboratorios" },
              { icon: "minecart-loaded", label: "Petróleo y minería" },
            ].map(s => (
              <div key={s.label} className="flex flex-col items-center text-center gap-3 rounded-2xl px-3 py-5 transition-all hover:-translate-y-1 cursor-default"
                style={{ background: "#F7F8FF", border: "1.5px solid #E4E6F7" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#272B7C"; e.currentTarget.style.boxShadow = "0 14px 28px -14px rgba(39,43,124,0.35)"; e.currentTarget.style.background = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#E4E6F7"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.background = "#F7F8FF"; }}>
                <div className="flex items-center justify-center rounded-2xl" style={{ width: 60, height: 60, background: "#fff", boxShadow: "0 6px 16px -8px rgba(39,43,124,0.25)" }}>
                  <Bi n={s.icon} size={26} color="#272B7C" />
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
          <NosotrosKicker icon="cpu" label="Tecnología y seguridad" />
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
          <NosotrosKicker icon="patch-check" label="Cumplimiento normativo" />
          <p className="text-xs font-bold uppercase tracking-wider mt-6 mb-3" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif" }}>Marco normativo con el que operamos</p>
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
          <Link to="/#faq" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold transition-all hover:scale-105"
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
            <Bi n={service.icon} size={32} color={service.accent} />
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
            <Link to="/#faq" style={{ color: "#1800AD", fontWeight: 600 }}>contactarnos</Link> directamente.
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
              <a href="/#faq" className="inline-flex px-6 py-3 rounded-xl text-sm font-bold transition-all hover:scale-105"
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
