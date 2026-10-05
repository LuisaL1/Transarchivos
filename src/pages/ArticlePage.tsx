import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import logoImg from "@/assets/images/logo.png";
import { track } from "@/lib/joel";
import { ChatAvatarFace } from "@/components/ui/Brand";
import { Bi } from "@/components/ui/Icons";
import { type Item, blogPosts, readMinutes } from "@/data/blog";

export function ArticlePage() {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);
  const [progress, setProgress] = useState(0);

  useEffect(() => { if (slug) track("article", slug); }, [slug]);
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center gap-4 px-6 text-center" style={{ fontFamily: "Inter, sans-serif" }}>
        <p className="text-2xl font-bold" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>Artículo no encontrado</p>
        <a href="/#blog" className="text-sm font-semibold" style={{ color: "#1800AD", textDecoration: "none" }}>← Volver al blog</a>
      </div>
    );
  }

  const others = blogPosts.filter(p => p.slug !== post.slug).slice(0, 3);
  const renderItem = (i: Item) => typeof i === "string" ? i : <><strong style={{ color: "#272B7C" }}>{i.b}.</strong> {i.t}</>;
  const firstP = post.blocks.findIndex(b => b.t === "p");

  return (
    <div className="min-h-full" style={{ background: "#F7F8FF", fontFamily: "Inter, sans-serif", color: "#37352F" }}>
      <div className="fixed top-0 left-0 right-0 z-40" style={{ height: 4, background: "rgba(255,255,255,0.15)" }}>
        <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, #FFDE59, #FF9F1C)", transition: "width 0.1s linear" }} />
      </div>

      {/* Portada */}
      <div className="relative overflow-hidden" style={{ minHeight: 520 }}>
        <img src={post.cover} alt="" className="absolute inset-0 w-full h-full" style={{ objectFit: "cover" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(20,22,63,0.72) 0%, rgba(20,22,63,0.55) 35%, rgba(20,22,63,0.96) 100%)" }} />
        <div className="absolute pointer-events-none rounded-full" style={{ width: 560, height: 560, top: -220, right: -160, background: "radial-gradient(circle, rgba(255,222,89,0.28) 0%, transparent 70%)" }} />

        <div className="relative max-w-4xl mx-auto px-6 pt-6 pb-28 flex flex-col" style={{ minHeight: 520 }}>
          <div className="flex items-center justify-between">
            <Link to="/" className="rounded-xl px-3 py-1.5" style={{ background: "rgba(255,255,255,0.95)" }}>
              <img src={logoImg} alt="Transarchivos" style={{ height: 30, width: "auto" }} />
            </Link>
            <a href="/#blog" className="text-xs font-bold px-4 py-2 rounded-full transition-all hover:scale-105"
              style={{ background: "rgba(255,255,255,0.14)", color: "#fff", border: "1px solid rgba(255,255,255,0.35)", fontFamily: "Montserrat, sans-serif", textDecoration: "none", backdropFilter: "blur(6px)" }}>
              <Bi n="arrow-left" size={13} color="#fff" className="mr-1.5" style={{ verticalAlign: "-1px" }} />Volver al blog
            </a>
          </div>

          <div className="mt-auto pt-20">
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-5"
              style={{ background: "#FFDE59", color: "#1800AD", fontFamily: "Montserrat, sans-serif" }}>{post.cat}</span>
            <h1 className="text-3xl md:text-5xl font-bold max-w-3xl" style={{ color: "#fff", fontFamily: "Poppins, sans-serif", lineHeight: 1.15 }}>{post.title}</h1>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-6 text-sm" style={{ color: "rgba(255,255,255,0.8)", fontFamily: "Montserrat, sans-serif" }}>
              <span className="flex items-center gap-2">
                <span className="flex items-center justify-center rounded-full font-bold" style={{ width: 30, height: 30, background: "#fff", color: "#272B7C", fontSize: 13 }}>T</span>
                Transarchivos Ltda.
              </span>
              <span className="flex items-center gap-1.5"><Bi n="calendar3" size={14} color="#FFDE59" />{post.date}</span>
              <span className="flex items-center gap-1.5"><Bi n="clock-fill" size={14} color="#FFDE59" />{readMinutes(post)} min de lectura</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <article className="relative max-w-3xl mx-auto px-4 sm:px-6" style={{ marginTop: -72 }}>
        <div className="rounded-3xl p-7 sm:p-10 md:p-14" style={{ background: "#fff", boxShadow: "0 40px 80px -40px rgba(39,43,124,0.4)", border: "1.5px solid #E4E6F7" }}>
          <div className="space-y-6 text-base md:text-[17px]" style={{ color: "#4B4B4B", lineHeight: 1.8 }}>
            {post.blocks.map((b, i) => {
              if (b.t === "h2") return (
                <h2 key={i} className="flex items-start gap-3 text-xl md:text-2xl font-bold pt-8" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif", lineHeight: 1.3 }}>
                  <span className="shrink-0 rounded-full" style={{ width: 6, height: 30, background: "linear-gradient(#FFDE59, #FF9F1C)", marginTop: 2 }} />
                  {b.text}
                </h2>
              );
              if (b.t === "p") {
                const lead = i === firstP && !b.lead;
                return (
                  <p key={i} className={lead ? "text-lg md:text-xl" : ""} style={lead ? { color: "#272B7C", fontFamily: "Poppins, sans-serif", fontWeight: 500, lineHeight: 1.6 } : undefined}>
                    {b.lead && <strong style={{ color: "#272B7C" }}>{b.lead} </strong>}
                    {b.text}
                  </p>
                );
              }
              if (b.t === "ul") return (
                <ul key={i} className="space-y-3">
                  {b.items.map((it, j) => (
                    <li key={j} className="flex gap-3.5 rounded-2xl p-4 text-[15px]" style={{ background: "#F7F8FF", border: "1px solid #E4E6F7", lineHeight: 1.65 }}>
                      <span className="shrink-0 flex items-center justify-center rounded-full" style={{ width: 22, height: 22, background: "#FFDE59", marginTop: 2 }}><Bi n="check-lg" size={13} color="#1800AD" style={{ WebkitTextStroke: "0.7px #1800AD" }} /></span>
                      <span>{renderItem(it)}</span>
                    </li>
                  ))}
                </ul>
              );
              if (b.t === "ol") return (
                <ol key={i} className="space-y-3">
                  {b.items.map((it, j) => (
                    <li key={j} className="flex gap-3.5 rounded-2xl p-4 text-[15px]" style={{ background: "#F7F8FF", border: "1px solid #E4E6F7", lineHeight: 1.65 }}>
                      <span className="shrink-0 flex items-center justify-center rounded-full font-bold" style={{ width: 28, height: 28, background: "#272B7C", color: "#FFDE59", fontSize: 13, fontFamily: "Poppins, sans-serif" }}>{j + 1}</span>
                      <span>{renderItem(it)}</span>
                    </li>
                  ))}
                </ol>
              );
              if (b.t === "img") return (
                <figure key={i} className="-mx-2 sm:-mx-6 md:-mx-8">
                  <img src={b.src} alt={b.alt} className="w-full rounded-2xl" style={{ boxShadow: "0 24px 50px -28px rgba(39,43,124,0.5)" }} />
                  <figcaption className="text-xs text-center mt-3" style={{ color: "#9B9B9B", fontFamily: "Montserrat, sans-serif" }}>{b.alt}</figcaption>
                </figure>
              );
              return (
                <div key={i} className="overflow-x-auto rounded-2xl" style={{ border: "1.5px solid #E4E6F7" }}>
                  <table className="w-full text-sm" style={{ borderCollapse: "collapse", minWidth: 560, lineHeight: 1.5 }}>
                    <thead>
                      <tr style={{ background: "linear-gradient(135deg, #272B7C, #1800AD)", color: "#fff" }}>
                        {b.head.map(h => <th key={h} className="text-left px-4 py-3.5 font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {b.rows.map((r, ri) => (
                        <tr key={ri} style={{ background: ri % 2 ? "#F7F8FF" : "#fff", borderTop: "1px solid #E4E6F7" }}>
                          {r.map((c, ci) => <td key={ci} className="px-4 py-3.5 align-top" style={ci === 0 ? { fontWeight: 700, color: "#272B7C" } : undefined}>{c}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>

          {/* Llamado a la acción */}
          <div className="mt-14 rounded-3xl p-7 md:p-9 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center gap-6"
            style={{ background: "linear-gradient(135deg, #14163F 0%, #272B7C 55%, #1800AD 100%)" }}>
            <div className="absolute pointer-events-none rounded-full" style={{ width: 320, height: 320, top: -120, right: -80, background: "radial-gradient(circle, rgba(255,222,89,0.28) 0%, transparent 70%)" }} />
            <div className="relative shrink-0"><ChatAvatarFace size={72} ring="light" /></div>
            <div className="relative flex-1">
              <p className="text-lg md:text-xl font-bold mb-1" style={{ color: "#fff", fontFamily: "Poppins, sans-serif", lineHeight: 1.3 }}>¿Hablamos de la gestión documental de su empresa?</p>
              <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.75)" }}>Agende su diagnóstico documental con el equipo de especialistas de Transarchivos.</p>
              <a href="/#faq" className="inline-flex px-6 py-3 rounded-xl text-sm font-bold transition-all hover:scale-105"
                style={{ background: "#FFDE59", color: "#1800AD", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>Agendar diagnóstico</a>
            </div>
          </div>
        </div>
      </article>

      {/* Más del blog */}
      <section className="pt-20 pb-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#9B9B9B", fontFamily: "Montserrat, sans-serif" }}>Siga leyendo</p>
              <p className="text-2xl font-bold" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>Más del blog</p>
            </div>
            <a href="/#blog" className="text-sm font-semibold hidden sm:block" style={{ color: "#1800AD", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>Ver todos →</a>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {others.map(o => (
              <Link key={o.slug} to={`/blog/${o.slug}`} className="group block rounded-3xl overflow-hidden bg-white transition-all hover:-translate-y-1.5"
                style={{ border: "1.5px solid #E4E6F7", textDecoration: "none", boxShadow: "0 14px 34px -22px rgba(39,43,124,0.35)" }}>
                <div className="overflow-hidden" style={{ height: 150 }}>
                  <img src={o.cover} alt="" className="w-full h-full transition-transform duration-500 group-hover:scale-105" style={{ objectFit: "cover" }} />
                </div>
                <div className="p-5">
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "#1800AD", fontFamily: "Montserrat, sans-serif" }}>{o.cat}</p>
                  <p className="text-sm font-bold" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif", lineHeight: 1.4 }}>{o.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── App (enrutador) ────────────────────────────────────────────────────────────
