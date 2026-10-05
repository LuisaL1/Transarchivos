// ─── Blog / contenido especializado ─────────────────────────────────────────
// Artículos reales de la carpeta RecursosTransarchivos (ver src/data/blog.ts).

import { useState } from "react";
import { Link } from "react-router-dom";
import { Bi } from "@/components/ui/Icons";
import { SectionDecor } from "@/components/ui/SectionDecor";
import { blogCatColor, blogPosts, readMinutes } from "@/data/blog";

export function BlogSection() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const [featured, ...rest] = blogPosts;

  return (
    <section id="blog" className="relative isolate overflow-hidden">
      <SectionDecor variant="cream" folder={false} />

      <div className="relative max-w-6xl mx-auto px-6 py-20">
        {/* Encabezado: solo título, centrado. */}
        <div className="mb-12 pb-8 flex flex-col items-center justify-center" style={{ borderBottom: "1.5px solid #E4E6F7" }}>
          <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#C8960A", fontFamily: "Montserrat, sans-serif" }}>Blog y novedades</p>
          <h2 className="text-3xl md:text-[44px] font-bold max-w-2xl mx-auto" style={{ fontFamily: "Poppins, sans-serif", color: "#272B7C", lineHeight: 1.15 }}>
            Conocimiento que protege<br />
            <span style={{ background: "linear-gradient(transparent 62%, #FFDE59 62%)" }}>la memoria de su empresa</span>
          </h2>
          </div>
        </div>

        {/* Bento: destacado grande a la izquierda (tarjeta "portada") +
            columna de tarjetas compactas apiladas a la derecha — tarjetas
            otra vez, pero organizadas como hero + sidebar en vez de un
            grid parejo de 3 columnas. */}
        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-6 mb-10">
          {featured && (() => { const fc = blogCatColor(featured.cat); return (
            <Link to={`/blog/${featured.slug}`}
              className="group flex flex-col rounded-3xl overflow-hidden transition-all hover:-translate-y-1.5"
              style={{ background: "#fff", border: "1.5px solid #E4E6F7", boxShadow: `0 24px 50px -28px ${fc}66`, textDecoration: "none" }}>
              <div className="relative overflow-hidden" style={{ height: 300 }}>
                <img loading="lazy" decoding="async" src={featured.cover} alt="" className="w-full h-full" style={{ objectFit: "cover" }} />
                <span aria-hidden="true" className="absolute pointer-events-none" style={{ right: -44, top: -44, width: 110, height: 110, transform: "rotate(45deg)", background: "rgba(255,222,89,0.35)" }} />
                <span className="absolute top-4 left-4 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full" style={{ background: fc, color: "#fff", fontFamily: "Montserrat, sans-serif" }}>
                  Destacado · {featured.cat}
                </span>
              </div>
              <div className="flex flex-col flex-1 p-7 md:p-8">
                <h3 className="text-2xl font-bold mb-3 transition-colors" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif", lineHeight: 1.25 }}>{featured.title}</h3>
                <p className="text-sm mb-6" style={{ color: "#6B6B6B", lineHeight: 1.65 }}>{featured.excerpt}</p>
                <div className="mt-auto pt-5 flex items-center justify-between text-xs" style={{ borderTop: "1px solid #F0F1FA", color: "#9B9B9B" }}>
                  <span>{featured.date} · {readMinutes(featured)} min</span>
                  <span className="font-bold inline-flex items-center gap-1.5 transition-transform group-hover:translate-x-0.5" style={{ color: fc }}>
                    Leer artículo <Bi n="arrow-right" size={13} color={fc} />
                  </span>
                </div>
              </div>
            </Link>
          ); })()}

          <div className="relative flex flex-col justify-center gap-4">
            {/* Un solo cuadrado mostaza semi-torcido detrás de las 3
                tarjetas juntas — mismo lenguaje que los acentos cuadrados
                amarillos de los elementos gráficos. */}
            <div className="hidden sm:block absolute pointer-events-none"
              style={{ top: 30, bottom: 30, left: -3, right: -3, background: "#FFDE59", borderRadius: 24, transform: "rotate(-2deg)", zIndex: 0 }} />
            {rest.map(p => {
              const pc = blogCatColor(p.cat);
              return (
                <Link key={p.slug} to={`/blog/${p.slug}`}
                  className="group relative flex gap-4 rounded-2xl p-3 transition-all hover:-translate-y-1"
                  style={{ background: "#fff", border: "1.5px solid #E4E6F7", boxShadow: `0 10px 24px -20px ${pc}80`, textDecoration: "none" }}>
                  <div className="relative overflow-hidden rounded-xl shrink-0" style={{ width: 100, height: 100 }}>
                    <img loading="lazy" decoding="async" src={p.cover} alt="" className="w-full h-full" style={{ objectFit: "cover" }} />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center py-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: pc, fontFamily: "Montserrat, sans-serif" }}>{p.cat}</span>
                    <h4 className="text-sm font-bold mb-1.5 line-clamp-2" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif", lineHeight: 1.3 }}>{p.title}</h4>
                    <span className="text-[11px]" style={{ color: "#9B9B9B" }}>{p.date} · {readMinutes(p)} min</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Suscripción, también como tarjeta — igual lenguaje que el resto
            de la sección. */}
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5 rounded-3xl p-7 md:px-9"
          style={{ background: "#fff", border: "1.5px solid #E4E6F7", boxShadow: "0 14px 34px -24px rgba(39,43,124,0.25)" }}>
          <div className="flex items-center gap-4">
            <span className="relative overflow-hidden flex items-center justify-center rounded-2xl shrink-0" style={{ width: 44, height: 44, background: "#272B7C" }}>
              <span aria-hidden="true" className="absolute pointer-events-none" style={{ right: -16, top: -16, width: 30, height: 30, transform: "rotate(45deg)", background: "rgba(255,222,89,0.3)" }} />
              <Bi n="envelope-paper" size={19} color="#FFDE59" className="relative" />
            </span>
            <div>
              <p className="font-bold text-base" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>Reciba novedades y guías en su correo</p>
              <p className="text-xs mt-0.5" style={{ color: "#9B9B9B" }}>Contenido sobre gestión documental y novedades de Transarchivos.</p>
            </div>
          </div>
          {sent ? (
            <p className="text-sm font-semibold" style={{ color: "#15803d", fontFamily: "Montserrat, sans-serif" }}>
              <Bi n="check-circle-fill" size={14} color="#15803d" className="mr-1.5" />¡Gracias! Le avisaremos cuando publiquemos.
            </p>
          ) : (
            <form className="flex gap-3 md:w-[380px]" onSubmit={e => { e.preventDefault(); if (email.trim()) setSent(true); }}>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="su@correo.com"
                className="flex-1 min-w-0 px-4 py-2.5 rounded-full text-sm outline-none"
                style={{ background: "#fff", border: "1.5px solid #E4E6F7", color: "#272B7C" }} />
              <button type="submit" className="px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all hover:opacity-85 cursor-pointer"
                style={{ background: "#272B7C", color: "#fff", fontFamily: "Montserrat, sans-serif" }}>Suscribirme</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
