import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BlogPanelContent, NavDropdownTrigger, NosotrosPanelContent, ServicesPanelContent, SolucionesPanelContent } from "@/components/layout/NavMenus";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { SupportPopover } from "@/components/layout/SupportPopover";
import { HeaderLogo } from "@/components/ui/Brand";
import { Bi, MenuIcon } from "@/components/ui/Icons";
import { serviceItems } from "@/data/services";
import { SOLUTIONS } from "@/data/solutions";
import { nosotrosGroups } from "@/data/nosotros";
import { searchContent } from "@/data/search";

// ─── Navbar del sitio ─────────────────────────────────────────────────────────
// Mismo navbar en todas las páginas (logo, menús desplegables, botón de
// cotización, búsqueda y soporte). "solid": siempre en su versión de barra
// blanca (páginas internas, sin el hero oscuro de la principal). Los enlaces
// "#sección" funcionan también fuera de la página principal: se redirigen a
// "/#sección".
export function SiteHeader({ solid = false, onChat }: { solid?: boolean; onChat: () => void }) {
  const navigateTo = useNavigate();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  // Si el navegador restaura el scroll al recargar, el header arranca ya en
  // su estado final (sin animar el cambio).
  const [scrolledRaw, setScrolled] = useState(() => typeof window !== "undefined" && window.scrollY > 24);
  const scrolled = solid || scrolledRaw;
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
  const [openMenu, setOpenMenu] = useState<"servicios" | "soluciones" | "nosotros" | "blog" | null>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);

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
      const t = e.target as Node;
      if (pillRef.current && !pillRef.current.contains(t) && !toolsRef.current?.contains(t)) { setOpenMenu(null); }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);



  const onAnchorClick = (e: React.MouseEvent) => {
    if (pathname === "/") return;
    const a = (e.target as HTMLElement).closest("a");
    const href = a?.getAttribute("href");
    if (a && href && href.startsWith("#") && href.length > 1) { e.preventDefault(); navigateTo("/" + href); }
  };

  return (
    <div onClickCapture={onAnchorClick} style={{ display: "contents" }}>
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
        className={`fixed top-0 left-0 right-0 z-50 pb-3 min-h-[72px] xl:min-h-0 flex items-center justify-center ${navReady ? "" : "nav-preload"}`}
        style={{
          // Sin borderBottom: una línea de 1px sólida se ve dura/"cortada" al
          // volver de scrolled a flotante — una sombra suave, sin borde, separa
          // igual de bien pero con un degradado, más estético.
          background: scrolled || mobileOpen ? "#ffffff" : "transparent",
          boxShadow: scrolled || mobileOpen ? "0 4px 20px rgba(10,13,61,0.12)" : "none",
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
        <a href="#" className="absolute z-10 left-4 md:left-12 2xl:left-28" style={{ top: scrolled ? 5 : 12, transition: "top 0.3s ease" }}>
          <HeaderLogo scrolled={scrolled || mobileOpen} size={scrolled || mobileOpen ? 50 : 64} />
        </a>

        {/* Búsqueda y soporte — fuera del pill, a la derecha (simétricos al
            logo de la izquierda), centrados con la fila del navbar. */}
        <div ref={toolsRef} className="hidden xl:flex absolute z-10 right-4 md:right-12 2xl:right-28 items-center gap-2.5" style={{ top: scrolled ? 10 : 24, transition: "top 0.3s ease" }}>
          <button type="button" onClick={toggleSearch} aria-label={searchOpen ? "Cerrar búsqueda" : "Buscar"} title={searchOpen ? "Cerrar búsqueda" : "Buscar"}
            className="flex items-center justify-center rounded-full shrink-0 transition-transform hover:scale-105 active:scale-95"
            style={{ width: 40, height: 40, background: searchOpen ? "#1800AD" : "#fff", border: `1.5px solid ${searchOpen ? "#1800AD" : "#E4E6F7"}`, boxShadow: scrolled ? "none" : "0 8px 20px -8px rgba(10,13,61,0.35)" }}>
            <Bi n={searchOpen ? "x-lg" : "search"} size={searchOpen ? 14 : 15} color={searchOpen ? "#fff" : "#272B7C"} />
          </button>
          <button ref={supportBtnRef} type="button" onClick={toggleSupport} onMouseEnter={supportHoverIn} onMouseLeave={supportHoverOut} aria-label="Soporte" title="Soporte" aria-expanded={!!supportAnchor}
            className="flex items-center justify-center rounded-full shrink-0 transition-transform hover:scale-105 active:scale-95"
            style={{ width: 40, height: 40, background: supportAnchor ? "#272B7C" : "#fff", border: `1.5px solid ${supportAnchor ? "#272B7C" : "#E4E6F7"}`, boxShadow: scrolled ? "none" : "0 8px 20px -8px rgba(10,13,61,0.35)" }}>
            <Bi n="headset" size={16} color={supportAnchor ? "#fff" : "#272B7C"} />
          </button>
        </div>

        {/* Pill / barra — una sola figura que se ENSANCHA (crece en alto) cuando
            "Servicios" está abierto, en vez de abrir un panel aparte pegado debajo.
            Al ser un único elemento con un solo border-radius, no hay costura ni
            huecos que tapar: el radio de 9999px se recorta solo a un valor normal
            de "tarjeta redondeada" en cuanto la caja es más alta que ancha/2. */}
        <div
          ref={pillRef}
          onMouseLeave={() => setOpenMenu(null)}
          className="hidden xl:flex relative flex-col"
          style={{
            zIndex: 1,
            // Ancho FIJO (no depende de openMenu): antes el pill se angostaba al
            // cerrar y se ensanchaba al abrir cada dropdown, y como la fila 1 usa
            // "mx-auto" para centrarse, ese cambio de ancho hacía que el texto
            // (Servicios/Nosotros/Blog/Contacto) se recorriera visiblemente en
            // cada apertura — el ancho ya es el máximo que necesita el dropdown
            // más ancho (Servicios), así que abrir/cerrar nunca mueve la fila 1.
            // Deja libre a cada lado el ancho del logo (izq.) y de los íconos (der.).
            // En ambos estados el pill se queda entre el logo y los íconos
            // (nunca pasa por debajo de la lupa/soporte), así la transición al
            // hacer scroll en cualquier dirección no los superpone.
            width: "min(860px, calc(100vw - 520px))",
            // Un radio de 9999px NO se recorta a "tarjeta redondeada" al crecer:
            // en CSS, un radio uniforme en las 4 esquinas siempre se limita a
            // min(ancho, alto)/2 — con el pill más ancho que alto se veía como un
            // óvalo gigante. Por eso acá, abierto, se usa un radio fijo normal.
            // Siempre redondeado (también en la barra completa, donde el pill ya
            // no ocupa todo el ancho): pasar de 0 a 9999px no se puede animar
            // y por un instante se veían esquinas cuadradas al subir.
            borderRadius: openMenu ? "28px" : "9999px",
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

            

            {/* Desktop nav — centrado dentro del espacio que sobra entre los dos
                huecos iguales (izquierdo y el que ocupa el CTA a la derecha).
                Con la búsqueda abierta, el nav se reemplaza por el input
                (mismo espacio, mismo centrado) en vez de convivir los dos. */}
            <div className="flex-1 flex justify-center min-w-0 px-2">
              {(
                <nav className="flex items-center gap-0.5 shrink-0">
                  <NavDropdownTrigger label="Servicios" open={openMenu === "servicios"} setOpen={() => setOpenMenu("servicios")} />
                  <NavDropdownTrigger label="Soluciones" open={openMenu === "soluciones"} setOpen={() => setOpenMenu("soluciones")} />
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
            <a href="#cotizador"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-transform hover:scale-105 active:scale-95 shrink-0"
              style={{ background: "#272B7C", color: "#ffffff", fontFamily: "Montserrat, sans-serif" }}>
              Simular cotización
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M3 11L11 3M11 3H5M11 3V9" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>

          </div>

          {/* Fila 2: contenido de "Servicios"/"Nosotros"/búsqueda — el pill
              crece para incluirla (mutuamente excluyentes). */}
          {openMenu === "servicios" && <ServicesPanelContent setOpen={() => setOpenMenu(null)} />}
          {openMenu === "nosotros" && <NosotrosPanelContent setOpen={() => setOpenMenu(null)} />}
          {openMenu === "soluciones" && <SolucionesPanelContent setOpen={() => setOpenMenu(null)} />}
          {openMenu === "blog" && <BlogPanelContent setOpen={() => setOpenMenu(null)} />}
        </div>

        {/* Menú móvil/tablet (< 1280 px): botón hamburguesa animado */}
        <button type="button" onClick={() => setMobileOpen(o => !o)} aria-expanded={mobileOpen} aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          className="xl:hidden absolute z-10 right-4 md:right-8 grid place-items-center rounded-full transition-colors"
          style={{ top: 14, width: 44, height: 44, background: mobileOpen ? "#272B7C" : "#ffffff", boxShadow: "0 6px 18px rgba(10,13,61,0.18)" }}>
          <span className="relative block" style={{ width: 18, height: 14 }}>
            {[0, 1, 2].map(i => (
              <span key={i} className="absolute left-0 block rounded-full transition-all duration-300"
                style={{
                  width: 18, height: 2, background: mobileOpen ? "#fff" : "#272B7C",
                  top: mobileOpen ? 6 : i * 6,
                  opacity: mobileOpen && i === 1 ? 0 : 1,
                  transform: mobileOpen ? (i === 0 ? "rotate(45deg)" : i === 2 ? "rotate(-45deg)" : "none") : "none",
                }} />
            ))}
          </span>
        </button>

        {mobileOpen && (
          <MobileMenu
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
}

// ─── Menú móvil ───────────────────────────────────────────────────────────────
// Panel a pantalla completa debajo de la barra: accesos rápidos (buscar, Joel,
// llamar), secciones desplegables con los mismos contenidos de los menús de
// escritorio y el botón de cotización fijo abajo. Bloquea el scroll de la
// página y se cierra con Esc o al elegir una opción.

function MobileMenu({ onClose, onSearch, onChat }: { onClose: () => void; onSearch: () => void; onChat: () => void }) {
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
    { id: "servicios", label: "Servicios", icon: "grid", items: serviceItems.map(s => ({ label: s.title, icon: s.icon, to: `/servicios/${s.slug}` })) },
    { id: "soluciones", label: "Soluciones", icon: "lightbulb", items: SOLUTIONS.map(s => ({ label: s.title, icon: s.icon, href: `#sol-${s.id}` })) },
    { id: "nosotros", label: "Nosotros", icon: "building", items: nosotrosGroups.flatMap(g => g.items).map(i => ({ label: i.label, icon: i.icon, to: `/nosotros#${i.anchor}` })) },
  ];
  const rowCls = "group w-full flex items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors hover:bg-[#F7F8FF]";
  const rowText = { color: "#272B7C", fontFamily: "Montserrat, sans-serif", textDecoration: "none" } as const;

  return (
    <div className="xl:hidden fixed inset-x-0 bottom-0 top-[72px] flex flex-col" style={{ background: "#fff", animation: "fadeInUp 0.25s ease both" }}>
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-4 max-w-xl w-full mx-auto">
        {/* Accesos rápidos */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { ic: "search", t: "Buscar", onClick: onSearch },
            { ic: "chat-dots", t: "Chat con Joel", onClick: onChat },
            { ic: "telephone", t: "Llamar", href: "tel:+576013164530" },
          ].map(q => {
            const inner = (<><Bi n={q.ic} size={18} color="#272B7C" /><span className="text-[11px] font-semibold" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif" }}>{q.t}</span></>);
            const cls = "flex flex-col items-center gap-1.5 rounded-2xl py-3 transition-colors hover:bg-[#EEF0FB]";
            return q.href
              ? <a key={q.t} href={q.href} className={cls} style={{ background: "#F7F8FF", textDecoration: "none" }}>{inner}</a>
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
                <Bi n="chevron-down" size={14} color="#272B7C" style={{ transition: "transform 0.25s", transform: on ? "rotate(180deg)" : "none" }} />
              </button>
              <div className="grid transition-all duration-300" style={{ gridTemplateRows: on ? "1fr" : "0fr" }}>
                <div className="overflow-hidden">
                  <div className="pl-4 pb-2">
                    {g.items.map(it => {
                      const inner = (<><Bi n={it.icon} size={15} color="#1800AD" /><span className="text-sm" style={{ ...rowText, fontWeight: 500 }}>{it.label}</span></>);
                      const cls = "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[#F7F8FF]";
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
        {[{ label: "Blog", icon: "journal-text", href: "#blog" }, { label: "Contacto y preguntas frecuentes", icon: "question-circle", href: "#faq" }].map(l => (
          <a key={l.label} href={l.href} onClick={onClose} className={`${rowCls} border-b`} style={{ ...rowText, borderColor: "#F0F1FA" }}>
            <MenuIcon n={l.icon} size={36} />
            <span className="flex-1 text-[15px] font-semibold">{l.label}</span>
            <Bi n="chevron-right" size={13} color="#9B9B9B" />
          </a>
        ))}

        <div className="mt-5 rounded-2xl p-4 flex flex-col gap-2" style={{ background: "#F7F8FF" }}>
          <a href="mailto:info@transarchivos.com" className="flex items-center gap-2.5 text-sm" style={{ color: "#272B7C", textDecoration: "none" }}><Bi n="envelope" size={14} color="#C8960A" /> info@transarchivos.com</a>
          <span className="flex items-center gap-2.5 text-sm" style={{ color: "#6B6B6B" }}><Bi n="geo-alt" size={14} color="#C8960A" /> Cl. 21 # 39A-40, Bogotá</span>
        </div>
      </div>

      {/* Botón principal fijo abajo */}
      <div className="px-4 py-3 border-t" style={{ borderColor: "#ECEEF6", paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
        <a href="#cotizador" onClick={onClose} className="max-w-xl mx-auto flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold"
          style={{ background: "#272B7C", color: "#fff", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
          Simular cotización <Bi n="arrow-up-right" size={13} color="#fff" />
        </a>
      </div>
    </div>
  );
}
