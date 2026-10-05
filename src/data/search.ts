import { blogPosts } from "@/data/blog";
import { services } from "@/data/services";

// ─── Búsqueda del header ────────────────────────────────────────────────────
// Índice combinado de servicios, artículos del blog y secciones de la propia
// landing, para que la lupa del navbar busque sobre contenido real del sitio
// en vez de ser un campo decorativo sin función.
export type SearchResult = { kind: "Servicio" | "Artículo" | "Sección"; title: string; desc: string; to?: string; href?: string };

export const searchIndex: SearchResult[] = [
  { kind: "Sección", title: "Diagnóstico documental", desc: "Empiece por saber qué está pasando con su archivo, antes de mover un solo papel", href: "#cotizador" },
  { kind: "Sección", title: "Soluciones", desc: "Cumplimiento normativo, respaldo ante desastres, oficina cero papel, espacio y auditorías", href: "#soluciones" },
  { kind: "Sección", title: "Cómo trabajamos", desc: "Nuestro modelo de 4 pasos: diagnóstico, solución, protección y expansión", href: "#modelo" },
  { kind: "Sección", title: "Preguntas frecuentes", desc: "Cotización, costos, cobertura, normativa, custodia y más", href: "#faq" },
  { kind: "Sección", title: "Blog", desc: "Artículos y guías sobre gestión documental, tecnología y sostenibilidad", href: "#blog" },
  { kind: "Sección", title: "Solicitar cotización", desc: "Elija su servicio y responda unas preguntas para armar su solicitud", href: "#cotizador" },
  ...services.map(s => ({ kind: "Servicio" as const, title: s.title, desc: s.desc, to: `/servicios/${s.slug}` })),
  ...blogPosts.map(p => ({ kind: "Artículo" as const, title: p.title, desc: p.excerpt, to: `/blog/${p.slug}` })),
];

// Sin tildes ni diéresis: quien escribe rápido en un buscador casi nunca
// tipea acentos ("digitalizacion" debe encontrar "Digitalización").
export const foldAccents = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "");

export function searchContent(query: string): SearchResult[] {
  const q = foldAccents(query.trim().toLowerCase());
  // Con 1 sola letra casi cualquier palabra matchea (demasiado ruido para ser
  // útil) — se pide un mínimo de 2 caracteres antes de mostrar resultados.
  if (q.length < 2) return [];
  return searchIndex.filter(r => foldAccents(r.title.toLowerCase()).includes(q) || foldAccents(r.desc.toLowerCase()).includes(q)).slice(0, 7);
}
