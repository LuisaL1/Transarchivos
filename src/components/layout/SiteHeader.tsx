import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BlogPanelContent, NavDropdownTrigger, NosotrosPanelContent, ServicesPanelContent, SolucionesPanelContent } from "@/components/layout/NavMenus";
import { LANG_BAR_HEIGHT, LangBar } from "@/components/layout/LangBar";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { SupportPopover } from "@/components/layout/SupportPopover";
import { HeaderLogo } from "@/components/ui/Brand";
import { Bi, MenuIcon } from "@/components/ui/Icons";
import { searchContent } from "@/data/search";
import { whatsappUrl } from "@/data/contact";
import { useLang } from "@/i18n";
import { useContent } from "@/i18n/content";
import { useUi } from "@/i18n/ui";
import { C } from "@/styles/tokens";

// Alto que las páginas internas reservan arriba (barra blanca + franja de idioma).
export const HEADER_SPACE = 60 + LANG_BAR_HEIGHT;

// ─── Navbar del sitio ─────────────────────────────────────────────────────────
// Mismo navbar en todas las páginas (logo, menús desplegables, "Solicitar
// cotización" como entrada del menú, botón azul "Contacto directo" que abre la
// tarjeta de contacto, y búsqueda; pedido del cliente, 29 oct. 2026), con la
// franja de idioma encima (se recoge al hacer scroll). "solid": siempre en su versión de barra blanca (páginas
// internas, sin el hero oscuro de la principal). Los enlaces "#sección"
// funcionan también fuera de la página principal: se redirigen a "/#sección"
// (en el idioma actual).
export function SiteHeader({ solid = false, onChat }: { solid?: boolean; onChat: () => void }) {
  const navigateTo = useNavigate();
  const { pathname } = useLocation();
  const { lang, lp } = useLang();
  const u = useUi();
  const c = useContent();
  const [mobileOpen, setMobileOpen] = useState(false);
  // Si el navegador restaura el scroll al recargar, el header arranca ya en
  // su estado final (sin animar el cambio).
  // false al inicio (como el HTML pre-generado); el efecto de scroll lo corrige al montar.
  const [scrolledRaw, setScrolled] = useState(false);
  const scrolled = solid || scrolledRaw;
  // Franja de idioma: visible arriba del todo; al hacer scroll se recoge y el
  // header sube a ocupar su lugar.
  const barOffset = scrolledRaw ? 0 : LANG_BAR_HEIGHT;
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
  // Un solo dropdown abierto a la vez en el pill.
  const [openMenu, setOpenMenu] = useState<"servicios" | "soluciones" | "nosotros" | "blog" | null>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);

  // Tarjeta de contacto directo (botón azul del pill): guarda la posición del botón al abrir.
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

  // Búsqueda del header (ventana propia); cierra el dropdown si estaba abierto.
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  // useMemo: evita recalcular el filtro en cada render del componente (p.ej.
  // al cruzar el umbral de "scrolled") cuando el texto de búsqueda no cambió.
  const searchResults = useMemo(() => searchContent(searchQuery, lang), [searchQuery, lang]);
  const searchHasQuery = searchQuery.trim().length >= 2;
  const toggleSearch = () => {
    setOpenMenu(null);
    setSearchOpen(o => !o);
    setSearchQuery("");
  };
  useEffect(() => {
    if (searchOpen) requestAnimationFrame(() => searchInputRef.current?.focus());
  }, [searchOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cierra el dropdown al hacer clic fuera del pill.
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (pillRef.current && !pillRef.current.contains(t) && !toolsRef.current?.contains(t)) { setOpenMenu(null); }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const home = lp("/");
  const onAnchorClick = (e: React.MouseEvent) => {
    if (pathname === home) return;
    const a = (e.target as HTMLElement).closest("a");
    const href = a?.getAttribute("href");
    if (a && href && href.startsWith("#") && href.length > 1) { e.preventDefault(); navigateTo(home + href); }
  };

  const navLinkCls = "px-2 2xl:px-2.5 py-2 rounded-full text-sm 2xl:text-[15px] font-bold transition-colors whitespace-nowrap";
  const navHover = {
    onMouseEnter: (e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.background = C.indigo; e.currentTarget.style.color = "#ffffff"; },
    onMouseLeave: (e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.indigo; },
  };

  return (
    <div onClickCapture={onAnchorClick} style={{ display: "contents" }}>
      <LangBar hidden={scrolledRaw} />
      {/* ── HEADER — pill flotante que se convierte en barra completa al hacer scroll ──
          fixed (no sticky): el header sale del flujo del documento para que el
          hero llegue hasta el borde real de arriba. Logo y botón móvil
          posicionados de forma absoluta, así el pill queda centrado. min-h: en
          móvil el pill queda vacío y sin alto mínimo el logo se cortaba. */}
      <header
        className={`fixed left-0 right-0 z-50 min-h-[72px] xl:min-h-0 flex items-center justify-center ${navReady ? "" : "nav-preload"}`}
        style={{
          top: barOffset,
          background: scrolled || mobileOpen ? "#ffffff" : "transparent",
          boxShadow: scrolled || mobileOpen ? "0 4px 20px rgba(10,13,61,0.12)" : "none",
          // Arriba del todo, la barra flota separada del borde superior; al
          // hacer scroll se pega arriba y pasa a barra completa.
          paddingTop: scrolled ? 6 : 18,
          paddingBottom: scrolled ? 6 : 12,
          transition: "top 0.3s ease, background 0.3s ease, box-shadow 0.3s ease, padding-top 0.3s ease, padding-bottom 0.3s ease",
        }}
      >
        {/* Logo — suelto, alineado con el borde del bloque de texto del hero */}
        {/* Logo más grande (pedido del cliente, oct. 2026) */}
        <Link to={home} aria-label={u.nav.logo} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="absolute z-10 left-4 md:left-12 2xl:left-28" style={{ top: scrolled ? 5 : 8, transition: "top 0.3s ease" }}>
          <HeaderLogo scrolled={scrolled || mobileOpen} size={scrolled || mobileOpen ? 58 : 76} />
        </Link>

        {/* Búsqueda — fuera del pill, a la derecha */}
        <div ref={toolsRef} className="hidden xl:flex absolute z-10 right-4 md:right-12 2xl:right-28 items-center gap-2.5" style={{ top: scrolled ? 12 : 24, transition: "top 0.3s ease" }}>
          <button type="button" onClick={toggleSearch} aria-label={searchOpen ? u.nav.closeSearch : u.nav.search} title={searchOpen ? u.nav.closeSearch : u.nav.search}
            className="flex items-center justify-center rounded-full shrink-0 transition-transform hover:scale-105 active:scale-95"
            style={{ width: 40, height: 40, background: searchOpen ? C.indigo : "#fff", border: `1.5px solid ${searchOpen ? C.indigo : C.border}`, boxShadow: scrolled ? "none" : "0 8px 20px -8px rgba(10,13,61,0.35)" }}>
            <Bi n={searchOpen ? "x-lg" : "search"} size={searchOpen ? 14 : 15} color={searchOpen ? "#fff" : C.indigo} />
          </button>
        </div>

        {/* Pill / barra — una sola figura que crece en alto cuando un menú está abierto. */}
        <div
          ref={pillRef}
          onMouseLeave={() => setOpenMenu(null)}
          // --pl / --pr: espacio reservado al logo (izquierda) y a los íconos
          // (derecha), cada uno con el mismo aire, así la píldora queda centrada
          // ENTRE el logo y los íconos (pedido del cliente, oct. 2026).
          className="hidden xl:flex relative flex-col [--pl:300px] [--pr:120px] 2xl:[--pl:360px] 2xl:[--pr:180px]"
          style={{
            zIndex: 1,
            left: "calc((var(--pl) - var(--pr)) / 2)",
            // Ancho FIJO (no depende de openMenu) para que la fila 1 no se mueva al abrir.
            width: "min(1040px, calc(100vw - var(--pl) - var(--pr)))",
            // Un radio de 9999px no se recorta bien al crecer: abierto, radio fijo.
            borderRadius: openMenu ? "28px" : "9999px",
            overflow: "hidden",
            background: "#ffffff",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "none",
            boxShadow: scrolled
              ? "none"
              : "0 12px 32px -8px rgba(10,13,61,0.18), 0 2px 8px rgba(10,13,61,0.10)",
            // Sin "border-radius" en la transición (provocaba hit-tests falsos al abrir).
            transition: "width 0.45s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s ease, border-color 0.3s ease",
          }}
        >
          {/* Fila 1: la barra de siempre */}
          <div className="flex items-center gap-2 pl-2 pr-2 py-2 md:pl-3 md:pr-3">
            <div className="flex-1 flex justify-center min-w-0 px-2">
              <nav className="flex items-center gap-0.5 shrink-0">
                <NavDropdownTrigger label={u.nav.services} open={openMenu === "servicios"} setOpen={() => setOpenMenu("servicios")} />
                <NavDropdownTrigger label={u.nav.solutions} open={openMenu === "soluciones"} setOpen={() => setOpenMenu("soluciones")} />
                <NavDropdownTrigger label={u.nav.about} open={openMenu === "nosotros"} setOpen={() => setOpenMenu("nosotros")} />
                <NavDropdownTrigger label={u.nav.blog} open={openMenu === "blog"} setOpen={() => setOpenMenu("blog")} />
                {/* Página de videos del canal (pedido del cliente, oct. 2026) */}
                <Link to={lp("/videos")} onClick={() => setOpenMenu(null)} className={navLinkCls} style={{ color: C.indigo, fontFamily: "Montserrat, sans-serif", textDecoration: "none" }} {...navHover}>
                  {u.nav.videos}
                </Link>
                {/* "Cotización" como entrada del menú, solo la palabra para no saturar (pedido del cliente, oct. 2026) */}
                <a href="#cotizador" className={navLinkCls} style={{ color: C.indigo, fontFamily: "Montserrat, sans-serif" }} {...navHover}>
                  {u.nav.quote}
                </a>
              </nav>
            </div>

            {/* Botón azul "Contacto directo" (reemplaza el ícono de audífonos):
                abre la tarjeta con chat, WhatsApp, teléfonos y formulario. */}
            <button ref={supportBtnRef} type="button" onClick={toggleSupport} onMouseEnter={supportHoverIn} onMouseLeave={supportHoverOut} aria-expanded={!!supportAnchor}
              className="inline-flex items-center gap-2 px-4 2xl:px-5 py-2.5 rounded-full text-sm 2xl:text-[15px] font-bold transition-transform hover:scale-105 active:scale-95 shrink-0 whitespace-nowrap"
              style={{ background: C.indigo, color: "#ffffff", fontFamily: "Montserrat, sans-serif", boxShadow: supportAnchor ? "0 0 0 3px rgba(255,222,89,0.6)" : "none" }}>
              <Bi n="headset" size={15} color={C.yellow} /> {u.nav.contactDirect}
            </button>
          </div>

          {/* Fila 2: contenido del menú abierto (el pill crece para incluirla) */}
          {openMenu === "servicios" && <ServicesPanelContent setOpen={() => setOpenMenu(null)} />}
          {openMenu === "nosotros" && <NosotrosPanelContent setOpen={() => setOpenMenu(null)} />}
          {openMenu === "soluciones" && <SolucionesPanelContent setOpen={() => setOpenMenu(null)} />}
          {openMenu === "blog" && <BlogPanelContent setOpen={() => setOpenMenu(null)} />}
        </div>

        {/* Menú móvil/tablet (< 1280 px): botón hamburguesa animado */}
        <button type="button" onClick={() => setMobileOpen(o => !o)} aria-expanded={mobileOpen} aria-label={mobileOpen ? u.nav.closeMenu : u.nav.openMenu}
          className="xl:hidden absolute z-10 right-4 md:right-8 grid place-items-center rounded-full transition-colors"
          style={{ top: 14, width: 44, height: 44, background: mobileOpen ? C.indigo : "#ffffff", boxShadow: "0 6px 18px rgba(10,13,61,0.18)" }}>
          <span className="relative block" style={{ width: 18, height: 14 }}>
            {[0, 1, 2].map(i => (
              <span key={i} className="absolute left-0 block rounded-full transition-all duration-300"
                style={{
                  width: 18, height: 2, background: mobileOpen ? "#fff" : C.indigo,
                  top: mobileOpen ? 6 : i * 6,
                  opacity: mobileOpen && i === 1 ? 0 : 1,
                  transform: mobileOpen ? (i === 0 ? "rotate(45deg)" : i === 2 ? "rotate(-45deg)" : "none") : "none",
                }} />
            ))}
          </span>
        </button>

        {mobileOpen && (
          <MobileMenu
            top={72 + barOffset}
            onClose={() => setMobileOpen(false)}
            onSearch={() => { setMobileOpen(false); setSearchOpen(true); }}
            onChat={() => { setMobileOpen(false); onChat(); }} />
        )}
      </header>

      {searchOpen && (
        <SearchOverlay query={searchQuery} setQuery={setSearchQuery} results={searchResults} hasQuery={searchHasQuery}
          inputRef={searchInputRef} onClose={() => { setSearchOpen(false); setSearchQuery(""); }} />
      )}

      {supportAnchor && <SupportPopover anchor={supportAnchor} onClose={() => setSupportAnchor(null)} onChat={onChat} onHoverIn={supportHoverIn} onHoverOut={supportHoverOut} />}

    </div>
  );

  // ─── Menú móvil ─────────────────────────────────────────────────────────
  // Panel a pantalla completa debajo de la barra: accesos rápidos (buscar, Joel,
  // WhatsApp), secciones desplegables con los mismos contenidos de los menús de
  // escritorio y el botón de cotización fijo abajo. Bloquea el scroll de la
  // página y se cierra con Esc o al elegir una opción.
  function MobileMenu({ top, onClose, onSearch, onChat }: { top: number; onClose: () => void; onSearch: () => void; onChat: () => void }) {
    const [open, setOpen] = useState<string | null>(null);
    useEffect(() => {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      document.body.classList.add("menu-open"); // oculta el botón flotante de Joel
      const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
      window.addEventListener("keydown", onKey);
      return () => { document.body.style.overflow = prev; document.body.classList.remove("menu-open"); window.removeEventListener("keydown", onKey); };
    }, [onClose]);

    const groups: { id: string; label: string; icon: string; items: { label: string; icon: string; to?: string; href?: string }[] }[] = [
      { id: "servicios", label: u.nav.services, icon: "grid", items: c.serviceItems.map(s => ({ label: s.title, icon: s.icon, to: lp(`/servicios/${s.slug}`) })) },
      { id: "soluciones", label: u.nav.solutions, icon: "lightbulb", items: c.solutions.map(s => ({ label: s.title, icon: s.icon, href: `#sol-${s.id}` })) },
      { id: "nosotros", label: u.nav.about, icon: "building", items: c.nosotrosGroups.flatMap(g => g.items).map(i => ({ label: i.label, icon: i.icon, to: lp(`/nosotros#${i.anchor}`) })) },
    ];
    const rowCls = "group w-full flex items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors hover:bg-hielo";
    const rowText = { color: C.indigo, fontFamily: "Montserrat, sans-serif", textDecoration: "none" } as const;

    return (
      <div className="xl:hidden fixed inset-x-0 bottom-0 flex flex-col" style={{ top, background: "#fff", animation: "fadeInUp 0.25s ease both" }}>
        <div className="flex-1 overflow-y-auto px-4 pt-3 pb-4 max-w-xl w-full mx-auto">
          {/* Accesos rápidos */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { ic: "search", t: u.nav.search, onClick: onSearch },
              { ic: "chat-dots", t: u.nav.chatJoel, onClick: onChat },
              { ic: "whatsapp", t: u.nav.whatsapp, href: whatsappUrl() },
            ].map(q => {
              const inner = (<><Bi n={q.ic} size={18} color={C.indigo} /><span className="text-[11px] font-semibold" style={{ color: C.indigo, fontFamily: "Montserrat, sans-serif" }}>{q.t}</span></>);
              const cls = "flex flex-col items-center gap-1.5 rounded-2xl py-3 transition-colors hover:bg-[#EEF0FB]";
              return q.href
                ? <a key={q.t} href={q.href} {...(/^https?:/.test(q.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={cls} style={{ background: "#F7F8FF", textDecoration: "none" }}>{inner}</a>
                : <button key={q.t} type="button" onClick={q.onClick} className={cls} style={{ background: "#F7F8FF" }}>{inner}</button>;
            })}
          </div>

          {/* Secciones desplegables */}
          {groups.map(g => {
            const on = open === g.id;
            return (
              <div key={g.id} className="border-b" style={{ borderColor: "#F0F1FA" }}>
                <button type="button" onClick={() => setOpen(on ? null : g.id)} aria-expanded={on} className={rowCls}>
                  <MenuIcon n={g.icon} size={36} />
                  <span className="flex-1 text-[15px] font-semibold" style={rowText}>{g.label}</span>
                  <Bi n="chevron-down" size={14} color={C.indigo} style={{ transition: "transform 0.25s", transform: on ? "rotate(180deg)" : "none" }} />
                </button>
                <div className="grid transition-all duration-300" style={{ gridTemplateRows: on ? "1fr" : "0fr" }}>
                  <div className="overflow-hidden">
                    <div className="pl-4 pb-2">
                      {g.items.map(it => {
                        const inner = (<><Bi n={it.icon} size={15} color={C.indigo} /><span className="text-sm" style={{ ...rowText, fontWeight: 500 }}>{it.label}</span></>);
                        const cls = "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-hielo";
                        return it.to
                          ? <Link key={it.label} to={it.to} onClick={onClose} className={cls} style={{ textDecoration: "none" }}>{inner}</Link>
                          : <a key={it.label} href={it.href} onClick={onClose} className={cls} style={{ textDecoration: "none" }}>{inner}</a>;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <Link to={lp("/videos")} onClick={onClose} className={`${rowCls} border-b`} style={{ ...rowText, borderColor: "#F0F1FA", textDecoration: "none" }}>
            <MenuIcon n="youtube" size={36} />
            <span className="flex-1 text-[15px] font-semibold">{u.nav.videos}</span>
            <Bi n="chevron-right" size={13} color={C.faint} />
          </Link>
          {[{ label: u.nav.blog, icon: "journal-text", href: "#blog" }, { label: u.nav.blogAndFaq, icon: "question-circle", href: "#faq" }].map(l => (
            <a key={l.label} href={l.href} onClick={onClose} className={`${rowCls} border-b`} style={{ ...rowText, borderColor: "#F0F1FA" }}>
              <MenuIcon n={l.icon} size={36} />
              <span className="flex-1 text-[15px] font-semibold">{l.label}</span>
              <Bi n="chevron-right" size={13} color={C.faint} />
            </a>
          ))}

          <div className="mt-5 rounded-2xl p-4 flex flex-col gap-2" style={{ background: "#F7F8FF" }}>
            <a href="#contacto" className="flex items-center gap-2.5 text-sm" style={{ color: C.indigo, textDecoration: "none" }}><Bi n="envelope" size={14} color={C.gold} /> info@transarchivos.com</a>
            <span className="flex items-center gap-2.5 text-sm" style={{ color: C.muted }}><Bi n="geo-alt" size={14} color={C.gold} /> {u.nav.address}</span>
          </div>
        </div>

        {/* Botón principal fijo abajo */}
        <div className="px-4 py-3 border-t" style={{ borderColor: "#ECEEF6", paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
          <a href="#cotizador" onClick={onClose} className="max-w-xl mx-auto flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold"
            style={{ background: C.indigo, color: "#fff", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
            {u.nav.quoteLong} <Bi n="arrow-up-right" size={13} color="#fff" />
          </a>
        </div>
      </div>
    );
  }
}
