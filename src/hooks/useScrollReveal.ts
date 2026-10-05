import { useEffect } from "react";

export function useScrollReveal(rootRef: React.RefObject<HTMLElement | null>) {
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

// ─── Búsqueda (ventana propia) ──────────────────────────────────────────────
// Al tocar la lupa se abre una ventana centrada que baja desde arriba sobre
// un fondo oscurecido (estilo "command palette"), en vez de reemplazar el nav
// dentro de la barra. Se cierra con Esc, con la × o haciendo clic afuera.
