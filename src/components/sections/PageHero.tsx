import type { ReactNode } from "react";
import { FolderDivider } from "@/components/ui/SectionDecor";
import { C } from "@/styles/tokens";

// Encabezado de las páginas internas (servicio, Nosotros, artículo, políticas):
// imagen de fondo bajo un velo índigo y, como base, la pestaña de carpeta que
// separa las secciones. El contenido (migas, título, tarjeta…) lo pone cada página.
export function PageHero({ children, image = "/videos/page-hero.jpg", id, scrollMarginTop }: {
  children: ReactNode; image?: string; id?: string; scrollMarginTop?: number;
}) {
  return (
    <section id={id} className="relative isolate overflow-hidden" style={{ backgroundColor: C.indigo, scrollMarginTop }}>
      <div aria-hidden="true" className="absolute inset-0" style={{ zIndex: -1, backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPosition: "center" }} />
      <div aria-hidden="true" className="absolute inset-0" style={{ zIndex: -1, background: "rgba(24,0,173,0.85)" }} />
      {children}
      <FolderDivider color={C.cream} />
    </section>
  );
}
