import type { ReactNode } from "react";
import { C } from "@/styles/tokens";

// Rótulo y título de sección. Dos tonos, según el fondo de la sección:
// claro (rótulo dorado, título índigo) u oscuro (rótulo amarillo, título blanco).
function Kicker({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: dark ? C.yellow : C.gold, fontFamily: "Montserrat, sans-serif" }}>{children}</p>;
}
function SectionTitle({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return <h2 className="text-2xl md:text-3xl font-bold" style={{ color: dark ? "#fff" : C.indigo, fontFamily: "Poppins, sans-serif", lineHeight: 1.2 }}>{children}</h2>;
}
// Palabra destacada dentro de un título: subrayado amarillo en claro, texto amarillo en oscuro.
function Mark({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return <span style={dark ? { color: C.yellow } : { background: "linear-gradient(transparent 62%, #FFDE59 62%)" }}>{children}</span>;
}
// Atajos para las páginas que arman muchas secciones: kicker("…", dark) / h2(<>…</>, dark)
export const kicker = (t: ReactNode, dark = false) => <Kicker dark={dark}>{t}</Kicker>;
export const h2 = (c: ReactNode, dark = false) => <SectionTitle dark={dark}>{c}</SectionTitle>;
export const mark = (t: ReactNode, dark = false) => <Mark dark={dark}>{t}</Mark>;
