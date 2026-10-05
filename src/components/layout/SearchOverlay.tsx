import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";
import { Link } from "react-router-dom";
import { trackSearch } from "@/lib/joel";
import { Bi, MenuIcon } from "@/components/ui/Icons";
import { type SearchResult } from "@/data/search";

export const SEARCH_SHORTCUTS = [
  { ic: "grid", label: "Servicios", href: "#servicios" },
  { ic: "lightbulb", label: "Soluciones", href: "#soluciones" },
  { ic: "ui-checks", label: "Solicitar cotización", href: "#cotizador" },
  { ic: "question-circle", label: "Preguntas frecuentes", href: "#faq" },
];

export const KIND_ICON: Record<SearchResult["kind"], string> = { "Servicio": "briefcase", "Artículo": "journal-text", "Sección": "signpost-2" };

export function SearchOverlay({ query, setQuery, results, hasQuery, inputRef, onClose }: {
  query: string; setQuery: (v: string) => void; results: SearchResult[]; hasQuery: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>; onClose: () => void;
}) {
  // Solo al abrir/cerrar (no en cada tecla): bloquea el scroll de la página,
  // enfoca el campo y escucha Esc.
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeRef.current(); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => inputRef.current?.focus());
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [inputRef]);

  const itemCls = "group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[#F7F8FF]";
  const pickResult = () => { trackSearch(query); trackEvent("search", { search_term: query }); onClose(); };
  return (
    <div data-search-overlay className="fixed inset-0 z-[70] flex justify-center px-4" style={{ paddingTop: "12vh" }}>
      <div className="absolute inset-0" onClick={onClose}
        style={{ background: "rgba(10,13,61,0.5)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", animation: "searchFade 0.25s ease both" }} />
      <div role="dialog" aria-label="Buscar en el sitio" className="relative w-full max-w-[640px] self-start rounded-3xl overflow-hidden"
        style={{ background: "#fff", boxShadow: "0 40px 90px -30px rgba(10,13,61,0.6)", animation: "searchDrop 0.35s cubic-bezier(0.2, 0.9, 0.3, 1.1) both" }}>
        <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid #ECEEF6" }}>
          <Bi n="search" size={18} color="#272B7C" />
          <input ref={inputRef} type="text" value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Buscar servicios, soluciones, artículos…" aria-label="Buscar"
            className="flex-1 min-w-0 bg-transparent outline-none text-base" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif" }} />
          <span className="hidden sm:inline text-[10px] font-semibold px-2 py-1 rounded-md" style={{ background: "#F2F3FA", color: "#8A8A8A" }}>Esc</span>
          <button type="button" onClick={onClose} aria-label="Cerrar búsqueda" className="grid place-items-center rounded-full transition-colors hover:bg-[#F2F3FA]" style={{ width: 32, height: 32 }}>
            <Bi n="x-lg" size={14} color="#272B7C" />
          </button>
        </div>

        <div className="max-h-[56vh] overflow-y-auto p-3">
          {!hasQuery ? (
            <>
              <p className="px-3 pt-1 pb-2 text-[10.5px] font-bold uppercase" style={{ letterSpacing: "0.12em", color: "#9B9B9B", fontFamily: "Montserrat, sans-serif" }}>Accesos rápidos</p>
              <div className="grid sm:grid-cols-2 gap-1">
                {SEARCH_SHORTCUTS.map(sc => (
                  <a key={sc.label} href={sc.href} onClick={onClose} className={itemCls} style={{ textDecoration: "none" }}>
                    <MenuIcon n={sc.ic} size={34} />
                    <span className="text-sm font-semibold" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif" }}>{sc.label}</span>
                  </a>
                ))}
              </div>
            </>
          ) : results.length === 0 ? (
            <div className="py-10 text-center">
              <Bi n="search" size={22} color="#C3C7E8" />
              <p className="text-sm mt-3" style={{ color: "#6B6B6B" }}>Sin resultados para "{query}".</p>
              <p className="text-xs mt-1" style={{ color: "#9B9B9B" }}>Pruebe con otra palabra, o pregúntele a Joel en el chat.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-0.5">
              {results.map(r => {
                const inner = (
                  <>
                    <MenuIcon n={KIND_ICON[r.kind]} size={34} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold truncate" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif" }}>{r.title}</span>
                      <span className="block text-xs truncate" style={{ color: "#8A8A8A" }}>{r.desc}</span>
                    </span>
                    <span className="text-[10px] font-bold uppercase shrink-0" style={{ letterSpacing: "0.08em", color: "#C8960A", fontFamily: "Montserrat, sans-serif" }}>{r.kind}</span>
                  </>
                );
                return r.to
                  ? <Link key={r.title} to={r.to} onClick={pickResult} className={itemCls} style={{ textDecoration: "none" }}>{inner}</Link>
                  : <a key={r.title} href={r.href} onClick={pickResult} className={itemCls} style={{ textDecoration: "none" }}>{inner}</a>;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Fondos decorativos de sección ─────────────────────────────────────────
// Capa detrás del contenido (z-index -1; la sección lleva "isolate"): un
// color plano de la paleta (sin amarillo ni degradados), un parche de puntos y, en algunas, la silueta de la carpeta del hero en
// contorno como marca de agua. Variantes: lavanda y crema.
