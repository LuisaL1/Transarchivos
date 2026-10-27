import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bi } from "@/components/ui/Icons";
import { LANG_INFO, LANGS, useLang, type Lang } from "@/i18n";
import { C } from "@/styles/tokens";

// ─── Franja superior de idioma ──────────────────────────────────────────────
// Una opción por idioma del sitio, nombrada por la región que lo usa (como en
// Transpack): "Latinoamérica y España (Español)" e "International (English)".
// Va fija arriba del header; al hacer scroll se recoge para ganar espacio. En
// índigo corporativo (el único azul del sitio), con el globo en amarillo.
export const LANG_BAR_HEIGHT = 36;

export function LangBar({ hidden }: { hidden: boolean }) {
  const { lang, tr, switchTo } = useLang();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open]);
  useEffect(() => { if (hidden) setOpen(false); }, [hidden]);

  const choose = (l: Lang) => { setOpen(false); if (l !== lang) navigate(switchTo(l)); };
  const label = (l: Lang) => `${LANG_INFO[l].region} (${LANG_INFO[l].name})`;

  return (
    <div aria-hidden={hidden} className="fixed top-0 left-0 right-0 z-[55] overflow-visible"
      style={{ height: LANG_BAR_HEIGHT, background: C.indigo, borderBottom: "1px solid rgba(255,255,255,0.14)", boxSizing: "border-box", transform: hidden ? `translateY(-${LANG_BAR_HEIGHT}px)` : "none", opacity: hidden ? 0 : 1, transition: "transform 0.3s ease, opacity 0.3s ease", pointerEvents: hidden ? "none" : "auto" }}>
      <div className="h-full max-w-[1320px] mx-auto px-4 md:px-12 2xl:px-28 flex items-center justify-end">
        <div ref={ref} className="relative">
          <button type="button" onClick={() => setOpen(v => !v)} aria-expanded={open} aria-haspopup="listbox" aria-label={tr("Elegir idioma", "Choose language")} tabIndex={hidden ? -1 : 0}
            className="inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[12.5px] transition-colors hover:bg-white/10"
            style={{ color: "rgba(255,255,255,0.9)", fontFamily: "Montserrat, sans-serif" }}>
            <Bi n="globe2" size={13} color={C.yellow} />
            <span>{LANG_INFO[lang].region} <span style={{ color: "rgba(255,255,255,0.6)" }}>({LANG_INFO[lang].name})</span></span>
            <Bi n="chevron-down" size={10} color="#fff" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
          </button>
          {open && (
            <div role="listbox" aria-label={tr("Idiomas disponibles", "Available languages")}
              className="absolute right-0 top-[calc(100%+8px)] min-w-[270px] rounded-2xl py-1.5 overflow-hidden"
              style={{ background: "#fff", boxShadow: "0 24px 48px -16px rgba(10,13,61,0.35)", border: "1px solid #E4E6F7", animation: "fadeInUp 0.2s ease both" }}>
              {LANGS.map(l => {
                const on = l === lang;
                return (
                  <button key={l} role="option" aria-selected={on} lang={LANG_INFO[l].locale} onClick={() => choose(l)}
                    className="block w-full px-5 py-3 text-left text-sm font-semibold transition-colors hover:bg-hielo"
                    style={{ color: C.indigo, fontFamily: "Montserrat, sans-serif", background: on ? "#F1F3FB" : "transparent", textDecoration: on ? "underline" : "none", textUnderlineOffset: 4, textDecorationThickness: 2 }}>
                    {label(l)}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
