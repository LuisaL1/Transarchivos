import { Link } from "react-router-dom";
import { Bi, MenuIcon } from "@/components/ui/Icons";
import { blogPosts } from "@/data/blog";
import { nosotrosGroups } from "@/data/nosotros";
import { serviceItems } from "@/data/services";
import { SOLUTIONS } from "@/data/solutions";

// Solo el botón disparador. El contenido del menú ya no es un panel aparte
// posicionado en "absolute" — vive dentro del propio pill (ver App), como una
// segunda fila que aparece cuando "open" es true. Así el pill literalmente
// crece para contenerlo: una sola figura, sin costuras ni huecos que tapar.
export function NavDropdownTrigger({ label, open, setOpen }: { label: string; open: boolean; setOpen: (v: boolean | ((prev: boolean) => boolean)) => void }) {
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
        background: open ? "#272B7C" : "transparent",
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

export function MenuFeature({ kicker, title, text, cta, href, onClick }: { kicker: string; title: string; text: string; cta: string; href: string; onClick: () => void }) {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl p-5" style={{ background: "#272B7C" }}>
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

// Línea superior + aire: separa el menú de la fila del navbar (y del logo,
// que en la barra completa queda justo encima de la columna destacada).
export const menuShell = "grid grid-cols-[220px_minmax(0,1fr)] gap-3 px-3 pb-3 pt-3 mt-2 border-t border-[#272B7C]/10";

export const menuItemCls = "group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-[#F7F8FF]";

export function ServicesPanelContent({ setOpen }: { setOpen: (v: boolean) => void }) {
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
          <a href="#servicios" onClick={close} className="text-xs font-semibold inline-flex items-center gap-1" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
            Ver todos <Bi n="arrow-right" size={12} color="#272B7C" />
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Soluciones ─────────────────────────────────────────────────────────────
// Organizadas por la NECESIDAD del cliente (no por servicio): cada solución
// combina los servicios que la resuelven. Contenido tomado del "Informe
// Documento maestro" (argumentos de venta de cada servicio) y de los sectores
// que la empresa reporta haber atendido.

export function SolucionesPanelContent({ setOpen }: { setOpen: (v: boolean) => void }) {
  const close = () => setOpen(false);
  return (
    <div className={menuShell} style={{ animation: "fadeInUp 0.25s ease both" }}>
      <MenuFeature kicker="Soluciones" title="Parta de su necesidad, no del servicio"
        text="Combinamos nuestros servicios según el reto de su empresa: cumplimiento, continuidad, digitalización, espacio o urgencias."
        cta="Ver todas las soluciones" href="#soluciones" onClick={close} />
      <div className="grid grid-cols-2 gap-0.5 py-1">
        {SOLUTIONS.map(sol => (
          <a key={sol.id} href={`#sol-${sol.id}`} onClick={close} className={menuItemCls} style={{ textDecoration: "none" }}>
            <MenuIcon n={sol.icon} />
            <span className="min-w-0">
              <span className="block text-[13px] font-semibold leading-tight" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif" }}>{sol.title}</span>
              <span className="block text-[11px] leading-snug mt-0.5" style={{ color: "#8A8A8A" }}>{sol.tag}</span>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

export function NosotrosPanelContent({ setOpen }: { setOpen: (v: boolean) => void }) {
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
export function BlogPanelContent({ setOpen }: { setOpen: (v: boolean) => void }) {
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
