import { Link } from "react-router-dom";
import { Bi, MenuIcon } from "@/components/ui/Icons";
import { useLang } from "@/i18n";
import { useContent } from "@/i18n/content";
import { useUi } from "@/i18n/ui";
import { C } from "@/styles/tokens";

// Solo el botón disparador. El contenido del menú vive dentro del propio pill
// (ver SiteHeader), como una segunda fila que aparece cuando "open" es true.
export function NavDropdownTrigger({ label, open, setOpen }: { label: string; open: boolean; setOpen: (v: boolean | ((prev: boolean) => boolean)) => void }) {
  return (
    <button
      // Solo abre (no alterna): con mouse, el hover ya lo abre antes de que el
      // click llegue a disparar. Para cerrar: mover el cursor fuera del pill, o clic afuera.
      onClick={() => setOpen(true)}
      onMouseEnter={() => setOpen(true)}
      className="flex items-center gap-1 px-2 2xl:px-2.5 py-2 rounded-full text-sm 2xl:text-[15px] font-bold transition-colors whitespace-nowrap"
      style={{
        color: open ? "#ffffff" : C.indigo,
        background: open ? C.indigo : "transparent",
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
// A la izquierda una columna destacada (índigo, cuadro amarillo girado, rótulo,
// título, texto y llamado a la acción); a la derecha las opciones, con íconos
// que se rellenan de azul al pasar el mouse. Textos en src/i18n/ui.ts.

function MenuFeature({ kicker, title, text, cta, href, onClick }: { kicker: string; title: string; text: string; cta: string; href: string; onClick: () => void }) {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl p-5" style={{ background: C.indigo }}>
      <span aria-hidden="true" className="absolute pointer-events-none" style={{ right: -36, top: -36, width: 104, height: 104, transform: "rotate(45deg)", borderRadius: 18, background: "rgba(255,222,89,0.25)" }} />
      <p className="relative mb-2 text-[10.5px] font-bold uppercase" style={{ letterSpacing: "0.16em", color: C.yellow, fontFamily: "Montserrat, sans-serif" }}>{kicker}</p>
      <p className="relative mb-2 text-[17px] font-bold leading-snug" style={{ color: "#fff", fontFamily: "Poppins, sans-serif" }}>{title}</p>
      <p className="relative mb-5 text-[12.5px] leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>{text}</p>
      <a href={href} onClick={onClick} className="group relative mt-auto inline-flex items-center gap-1.5 text-[13px] font-semibold" style={{ color: "#fff", textDecoration: "none", fontFamily: "Montserrat, sans-serif" }}>
        {cta} <Bi n="arrow-right" size={13} color={C.yellow} className="transition-transform group-hover:translate-x-1" />
      </a>
    </div>
  );
}

// Línea superior + aire: separa el menú de la fila del navbar.
const menuShell = "grid grid-cols-[220px_minmax(0,1fr)] gap-3 px-3 pb-3 pt-3 mt-2 border-t border-indigo/10";
const menuItemCls = "group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-hielo";

export function ServicesPanelContent({ setOpen }: { setOpen: (v: boolean) => void }) {
  const close = () => setOpen(false);
  const { lp } = useLang();
  const m = useUi().menus.services;
  const { serviceItems } = useContent();
  return (
    <div className={menuShell} style={{ animation: "fadeInUp 0.25s ease both" }}>
      <MenuFeature kicker={m.kicker} title={m.title} text={m.text} cta={m.cta} href="#diagnostico" onClick={close} />
      <div className="py-1">
        <div className="grid grid-cols-3 gap-0.5">
          {serviceItems.map(s => (
            <Link key={s.slug} to={lp(`/servicios/${s.slug}`)} onClick={close} className={menuItemCls} style={{ textDecoration: "none" }}>
              <MenuIcon n={s.icon} />
              <span className="min-w-0">
                <span className="block text-[13px] font-semibold leading-tight" style={{ color: C.indigo, fontFamily: "Montserrat, sans-serif" }}>{s.title}</span>
                <span className="block text-[11px] leading-snug mt-0.5 line-clamp-3" style={{ color: "#8A8A8A" }}>{s.desc}</span>
              </span>
            </Link>
          ))}
        </div>
        <div className="flex items-center justify-between mt-1.5 pt-2.5 px-2.5" style={{ borderTop: "1px solid #ECEEF6" }}>
          <span className="text-[11px]" style={{ color: C.faint }}>{m.foot}</span>
          <a href="#servicios" onClick={close} className="text-xs font-semibold inline-flex items-center gap-1" style={{ color: C.indigo, fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
            {m.all} <Bi n="arrow-right" size={12} color={C.indigo} />
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Soluciones ─────────────────────────────────────────────────────────────
// Organizadas por la NECESIDAD del cliente (no por servicio): cada solución
// combina los servicios que la resuelven (src/data/solutions.ts).
export function SolucionesPanelContent({ setOpen }: { setOpen: (v: boolean) => void }) {
  const close = () => setOpen(false);
  const m = useUi().menus.solutions;
  const { solutions } = useContent();
  return (
    <div className={menuShell} style={{ animation: "fadeInUp 0.25s ease both" }}>
      <MenuFeature kicker={m.kicker} title={m.title} text={m.text} cta={m.cta} href="#soluciones" onClick={close} />
      {/* content-center: con 4 soluciones las filas no se estiran al alto de la tarjeta índigo. */}
      <div className="grid grid-cols-2 content-center gap-x-0.5 gap-y-1 py-1">
        {solutions.map(sol => (
          <a key={sol.id} href={`#sol-${sol.id}`} onClick={close} className={menuItemCls} style={{ textDecoration: "none" }}>
            <MenuIcon n={sol.icon} />
            <span className="min-w-0">
              <span className="block text-[13px] font-semibold leading-tight" style={{ color: C.indigo, fontFamily: "Montserrat, sans-serif" }}>{sol.title}</span>
              <span className="block text-[11px] leading-snug mt-1 line-clamp-2" style={{ color: "#8A8A8A" }}>{sol.problem}</span>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

export function NosotrosPanelContent({ setOpen }: { setOpen: (v: boolean) => void }) {
  const close = () => setOpen(false);
  const { lp } = useLang();
  const m = useUi().menus.about;
  const { nosotrosGroups } = useContent();
  return (
    <div className={menuShell} style={{ animation: "fadeInUp 0.25s ease both" }}>
      <MenuFeature kicker={m.kicker} title={m.title} text={m.text} cta={m.cta} href={lp("/nosotros#historia")} onClick={close} />
      <div className="grid grid-cols-3 gap-3 py-1">
        {nosotrosGroups.map(g => (
          <div key={g.heading}>
            <p className="text-[10.5px] font-bold uppercase mb-1.5 px-2 whitespace-nowrap" style={{ letterSpacing: "0.12em", color: C.faint, fontFamily: "Montserrat, sans-serif" }}>{g.heading}</p>
            <div className="flex flex-col">
              {g.items.map(item => (
                <Link key={item.anchor} to={lp(`/nosotros#${item.anchor}`)} onClick={close} className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-hielo" style={{ textDecoration: "none" }}>
                  <MenuIcon n={item.icon} size={34} />
                  <span className="text-[13px] font-semibold whitespace-nowrap" style={{ color: C.indigo, fontFamily: "Montserrat, sans-serif" }}>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Menú "Blog": los 3 artículos más recientes y la página de videos del canal.
export function BlogPanelContent({ setOpen }: { setOpen: (v: boolean) => void }) {
  const close = () => setOpen(false);
  const { lp } = useLang();
  const m = useUi().menus.blog;
  const { blogPosts } = useContent();
  const recent = blogPosts.slice(0, 3);
  return (
    <div className={menuShell} style={{ animation: "fadeInUp 0.25s ease both" }}>
      <MenuFeature kicker={m.kicker} title={m.title} text={m.text} cta={m.cta} href="#blog" onClick={close} />
      <div className="py-1 pr-2 min-w-0">
        <div className="grid grid-cols-1 gap-0.5">
          {recent.map(p => (
            <Link key={p.slug} to={lp(`/blog/${p.slug}`)} onClick={close} className={`${menuItemCls} items-center`} style={{ textDecoration: "none" }}>
              <img loading="lazy" decoding="async" src={p.cover} alt="" className="shrink-0 rounded-lg object-cover" style={{ width: 64, height: 48 }} />
              <span className="min-w-0 flex-1 pr-2">
                <span className="block text-[10.5px] font-bold uppercase" style={{ letterSpacing: "0.1em", color: C.gold, fontFamily: "Montserrat, sans-serif" }}>{p.cat}</span>
                <span className="block text-[13px] font-semibold line-clamp-2" title={p.title} style={{ color: C.indigo, fontFamily: "Montserrat, sans-serif" }}>{p.title}</span>
              </span>
            </Link>
          ))}
        </div>
        <Link to={lp("/videos")} onClick={close}
          className={`${menuItemCls} items-center mt-1.5`} style={{ borderTop: "1px solid #ECEEF6", borderRadius: 0, textDecoration: "none" }}>
          <MenuIcon n="youtube" size={34} />
          <span className="flex-1 text-[13px] font-semibold" style={{ color: C.indigo, fontFamily: "Montserrat, sans-serif" }}>{m.videos}</span>
          <Bi n="chevron-right" size={12} color={C.faint} />
        </Link>
      </div>
    </div>
  );
}
