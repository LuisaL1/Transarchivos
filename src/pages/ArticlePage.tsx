import { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { track } from "@/lib/visitor";
import { ChatBot } from "@/components/chat/LazyChatBot";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Bi } from "@/components/ui/Icons";
import { JoelFigure } from "@/components/ui/JoelBridge";
import { SectionDecor } from "@/components/ui/SectionDecor";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { JOEL } from "@/data/joelPoses";
import { type Item, type Post, blogPosts, readMinutes } from "@/data/blog";
import { FAQS } from "@/data/faqs";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { C } from "@/styles/tokens";

// Detalle de esquina (el mismo del chat y del menú): un cuadrado amarillo
// translúcido girado 45° asomando por la esquina superior derecha.
function Corner({ size = 104, offset = -36, alpha = 0.25 }: { size?: number; offset?: number; alpha?: number }) {
  return (
    <span aria-hidden="true" className="absolute pointer-events-none"
      style={{ right: offset, top: offset, width: size, height: size, transform: "rotate(45deg)", borderRadius: Math.max(4, Math.round(size * 0.17)), background: `rgba(255,222,89,${alpha})` }} />
  );
}

// Preguntas frecuentes que más se relacionan con el artículo: cada pregunta
// suma puntos por las palabras de su tema que aparecen en el texto.
const FAQ_TOPICS: string[][] = [
  ["diagnóstico", "inventario", "organiz"],
  ["cotiza", "solicit"],
  ["costo", "precio", "ahorro", "escalable"],
  ["bogotá", "ciudad", "colombia"],
  ["ley", "norma", "agn", "cumplimiento"],
  ["custodia", "bodega", "segur", "vigilancia", "proteg"],
  ["digital", "software", "electrónic", "ocr", "tecnolog"],
  ["destruc", "reciclaje", "papel", "eliminación", "sostenib", "ambiental"],
  ["instalaciones", "inhouse", "sede", "personal"],
];
function relatedFaqs(post: Post, n = 4) {
  const text = [post.title, post.excerpt, ...post.blocks.map(b => "text" in b ? b.text : "")].join(" ").toLowerCase();
  return FAQS.map((f, i) => ({ f, i, score: FAQ_TOPICS[i].reduce((acc, k) => acc + text.split(k).length - 1, 0) }))
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .slice(0, n)
    .map(x => x.f);
}

export function ArticlePage() {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);
  const pageRef = useRef<HTMLDivElement>(null);
  useScrollReveal(pageRef);
  const navigate = useNavigate();
  // Volver / "Blog": siempre a la sección del blog en la portada.
  const goBack = () => navigate("/#blog");
  const [chatOpen, setChatOpen] = useState(false);
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
        <p className="text-2xl font-bold" style={{ color: C.indigo, fontFamily: "Poppins, sans-serif" }}>Artículo no encontrado</p>
        <Link to="/#blog" className="text-sm font-semibold" style={{ color: C.indigo, textDecoration: "none" }}>← Volver al blog</Link>
      </div>
    );
  }

  const others = blogPosts.filter(p => p.slug !== post.slug).slice(0, 3);
  const faqs = relatedFaqs(post);
  const renderItem = (i: Item) => typeof i === "string" ? i : <><strong style={{ color: C.indigo }}>{i.b}.</strong> {i.t}</>;
  const firstP = post.blocks.findIndex(b => b.t === "p");
  const toc = post.blocks.map((b, i) => b.t === "h2" ? { id: `sec-${i}`, text: b.text } : null).filter(Boolean) as { id: string; text: string }[];
  const goTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div ref={pageRef} className="min-h-full" style={{ background: C.cream, fontFamily: "Inter, sans-serif", color: "#37352F" }}>
      {/* Barra de progreso de lectura */}
      <div aria-hidden="true" className="fixed top-0 left-0 right-0 z-[60]" style={{ height: 3 }}>
        <div style={{ width: `${progress}%`, height: "100%", background: C.yellow, transition: "width 0.1s linear" }} />
      </div>

      {/* El mismo navbar del sitio, en su versión de barra blanca. */}
      <SiteHeader solid onChat={() => setChatOpen(true)} />
      <div aria-hidden="true" style={{ height: 60 }} />

      {/* Hero: portada del artículo bajo un velo navy, con la carpeta como base */}
      <PageHero image={post.cover}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-10 items-center pt-12 pb-24">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <button type="button" onClick={goBack} aria-label="Volver al blog" title="Volver al blog"
                  className="grid place-items-center rounded-full shrink-0 transition-colors hover:bg-white/20"
                  style={{ width: 36, height: 36, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)" }}>
                  <Bi n="arrow-left" size={15} color="#fff" />
                </button>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "Montserrat, sans-serif" }}>
                  <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>Inicio</Link> / <button type="button" onClick={goBack} style={{ color: "inherit" }}>Blog</button> / <span style={{ color: C.yellow }}>{post.cat}</span>
                </p>
              </div>
              <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-5" style={{ background: "rgba(255,255,255,0.1)", color: C.yellow, border: "1px solid rgba(255,222,89,0.35)", fontFamily: "Montserrat, sans-serif" }}>
                <Bi n="journal-text" size={13} color={C.yellow} /> {post.cat}
              </span>
              <h1 className="text-3xl md:text-[2.6rem] font-bold mb-5" style={{ color: "#fff", fontFamily: "Poppins, sans-serif", lineHeight: 1.15 }}>{post.title}</h1>
              <p className="text-base max-w-xl mb-8 line-clamp-4" style={{ color: "rgba(255,255,255,0.78)", lineHeight: 1.7 }}>{post.excerpt}</p>
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={() => goTo(toc[0]?.id ?? "articulo")} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold transition-transform hover:scale-[1.03]"
                  style={{ background: C.yellow, color: C.indigo, fontFamily: "Montserrat, sans-serif" }}>
                  Leer artículo <Bi n="arrow-down" size={14} color={C.indigo} />
                </button>
                <button type="button" onClick={() => setChatOpen(true)} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold"
                  style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", fontFamily: "Montserrat, sans-serif" }}>
                  <Bi n="chat-dots" size={14} color="#fff" /> Preguntarle a Joel
                </button>
              </div>
            </div>

            {/* Tarjeta con la portada y los datos del artículo */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl p-3" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.16)", backdropFilter: "blur(10px)" }}>
                <div className="relative overflow-hidden rounded-2xl" style={{ aspectRatio: "16 / 10" }}>
                  <img src={post.cover} alt={post.title} fetchPriority="high" className="w-full h-full" style={{ objectFit: "cover" }} />
                  <Corner size={110} offset={-44} alpha={0.35} />
                </div>
                <div className="grid grid-cols-3 gap-2 px-3 pt-5 pb-3">
                  {[
                    { ic: "calendar3", l: "Publicado", v: post.date },
                    { ic: "clock", l: "Lectura", v: `${readMinutes(post)} min` },
                    { ic: "building", l: "Autor", v: "Transarchivos" },
                  ].map(x => (
                    <div key={x.l} className="min-w-0">
                      <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "rgba(255,255,255,0.55)", fontFamily: "Montserrat, sans-serif" }}>
                        <Bi n={x.ic} size={11} color={C.yellow} /> {x.l}
                      </p>
                      <p className="text-sm font-semibold truncate" style={{ color: "#fff", fontFamily: "Poppins, sans-serif" }}>{x.v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageHero>

      {/* Contenido + índice lateral */}
      <section id="articulo" className="relative isolate overflow-hidden py-16" style={{ scrollMarginTop: 80 }}>
        <SectionDecor variant="light" />
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[minmax(0,1fr)_300px] gap-10 items-start">
          <article className="rounded-3xl p-7 sm:p-10 md:p-12" style={{ background: "#fff", border: "1.5px solid #E4E6F7", boxShadow: "0 30px 60px -40px rgba(24,0,173,0.35)" }}>
            <div className="space-y-6 text-base md:text-[17px]" style={{ color: "#4B4B4B", lineHeight: 1.8 }}>
              {post.blocks.map((b, i) => {
                if (b.t === "h2") return (
                  <h2 key={i} id={`sec-${i}`} className="flex items-start gap-3 text-xl md:text-2xl font-bold pt-6" style={{ color: C.indigo, fontFamily: "Poppins, sans-serif", lineHeight: 1.3, scrollMarginTop: 90 }}>
                    <span className="shrink-0 rounded-full" style={{ width: 6, height: 30, background: C.yellow, marginTop: 2 }} />
                    {b.text}
                  </h2>
                );
                if (b.t === "p") {
                  const lead = i === firstP && !b.lead;
                  return (
                    <p key={i} className={lead ? "text-lg md:text-xl" : ""} style={lead ? { color: C.indigo, fontFamily: "Poppins, sans-serif", fontWeight: 500, lineHeight: 1.6 } : undefined}>
                      {b.lead && <strong style={{ color: C.indigo }}>{b.lead} </strong>}
                      {b.text}
                    </p>
                  );
                }
                if (b.t === "ul") return (
                  <ul key={i} className="grid gap-3">
                    {b.items.map((it, j) => (
                      <li key={j} className="flex items-start gap-3 rounded-2xl p-4 text-[15px]" style={{ background: "#fff", border: "1px solid #E4E6F7", boxShadow: "0 14px 30px -26px rgba(24,0,173,0.45)", lineHeight: 1.65 }}>
                        <span className="grid place-items-center rounded-lg shrink-0" style={{ width: 28, height: 28, background: "#EAF7EE", marginTop: 1 }}>
                          <Bi n="check-lg" size={14} color="#16a34a" />
                        </span>
                        <span>{renderItem(it)}</span>
                      </li>
                    ))}
                  </ul>
                );
                if (b.t === "ol") return (
                  <ol key={i} className="grid gap-3">
                    {b.items.map((it, j) => (
                      <li key={j} className="flex items-start gap-3.5 rounded-2xl p-4 text-[15px]" style={{ background: "#fff", border: "1px solid #E4E6F7", lineHeight: 1.65 }}>
                        <span className="grid place-items-center rounded-full font-bold shrink-0" style={{ width: 30, height: 30, background: j === 0 ? C.indigo : "#fff", color: j === 0 ? C.yellow : C.indigo, border: "2px solid #1800AD", fontSize: 13, fontFamily: "Poppins, sans-serif" }}>{j + 1}</span>
                        <span>{renderItem(it)}</span>
                      </li>
                    ))}
                  </ol>
                );
                if (b.t === "img") return (
                  <figure key={i} className="-mx-2 sm:-mx-4">
                    <img loading="lazy" decoding="async" src={b.src} alt={b.alt} className="w-full rounded-2xl" style={{ boxShadow: "0 24px 50px -28px rgba(24,0,173,0.5)" }} />
                    <figcaption className="text-xs text-center mt-3" style={{ color: C.faint, fontFamily: "Montserrat, sans-serif" }}>{b.alt}</figcaption>
                  </figure>
                );
                return (
                  <div key={i} className="overflow-x-auto rounded-2xl" style={{ border: "1.5px solid #E4E6F7" }}>
                    <table className="w-full text-sm" style={{ borderCollapse: "collapse", minWidth: 560, lineHeight: 1.5 }}>
                      <thead>
                        <tr style={{ background: C.indigo, color: "#fff" }}>
                          {b.head.map(h => <th key={h} className="text-left px-4 py-3.5 font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>{h}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {b.rows.map((r, ri) => (
                          <tr key={ri} style={{ background: ri % 2 ? "#F7F8FF" : "#fff", borderTop: "1px solid #E4E6F7" }}>
                            {r.map((c, ci) => <td key={ci} className="px-4 py-3.5 align-top" style={ci === 0 ? { fontWeight: 700, color: C.indigo } : undefined}>{c}</td>)}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          </article>

          {/* Lateral: índice, más del blog, preguntas frecuentes, llamado corto y Joel */}
          <aside className="lg:self-stretch flex flex-col gap-5">
            {toc.length > 0 && (
              <div className="rounded-3xl p-6" style={{ background: "#fff", border: "1px solid #E4E6F7", boxShadow: "0 14px 30px -26px rgba(24,0,173,0.45)" }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: C.gold, fontFamily: "Montserrat, sans-serif" }}>En este artículo</p>
                <ol className="space-y-1">
                  {toc.map((t, n) => (
                    <li key={t.id}>
                      <button type="button" onClick={() => goTo(t.id)} className="group w-full flex items-start gap-3 text-left rounded-xl px-2 py-2 transition-colors hover:bg-niebla">
                        <span className="text-xs font-bold shrink-0 mt-0.5" style={{ color: C.faint, fontFamily: "Poppins, sans-serif", minWidth: 18 }}>{String(n + 1).padStart(2, "0")}</span>
                        <span className="text-[13px] font-semibold leading-snug" style={{ color: C.indigo }}>{t.text}</span>
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
            )}
            <div className="rounded-3xl p-6" style={{ background: "#fff", border: "1px solid #E4E6F7", boxShadow: "0 14px 30px -26px rgba(24,0,173,0.45)" }}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: C.gold, fontFamily: "Montserrat, sans-serif" }}>Más del blog</p>
                <Link to="/#blog" className="inline-flex items-center gap-1 text-[11px] font-bold" style={{ color: C.indigo, fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
                  Ver todos <Bi n="arrow-right" size={11} color={C.indigo} />
                </Link>
              </div>
              <div className="space-y-1">
                {others.map(o => (
                  <Link key={o.slug} to={`/blog/${o.slug}`} className="group flex items-start gap-3 rounded-xl p-2 -mx-2 transition-colors hover:bg-niebla" style={{ textDecoration: "none" }}>
                    <span className="relative overflow-hidden rounded-xl shrink-0" style={{ width: 64, height: 64 }}>
                      <img loading="lazy" decoding="async" src={o.cover} alt="" className="w-full h-full transition-transform duration-500 group-hover:scale-110" style={{ objectFit: "cover" }} />
                      <Corner size={34} offset={-17} alpha={0.4} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: C.gold, fontFamily: "Montserrat, sans-serif" }}>{o.cat}</span>
                      <span className="block text-[13px] font-bold leading-snug line-clamp-3" style={{ color: C.indigo, fontFamily: "Poppins, sans-serif" }}>{o.title}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="rounded-3xl p-6" style={{ background: "#fff", border: "1px solid #E4E6F7", boxShadow: "0 14px 30px -26px rgba(24,0,173,0.45)" }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: C.gold, fontFamily: "Montserrat, sans-serif" }}>Preguntas frecuentes</p>
              <div>
                {faqs.map((f, n) => (
                  <details key={f.q} className="group py-3" style={{ borderTop: n ? "1px solid #F0F1FA" : "none" }}>
                    <summary className="flex items-start justify-between gap-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                      <span className="text-[13px] font-semibold leading-snug" style={{ color: C.indigo }}>{f.q}</span>
                      <span className="grid place-items-center rounded-full shrink-0 transition-transform group-open:rotate-45" style={{ width: 22, height: 22, background: "#F2F3FA" }}>
                        <Bi n="plus" size={14} color={C.indigo} />
                      </span>
                    </summary>
                    <p className="text-[12.5px] mt-2" style={{ color: C.muted, lineHeight: 1.6 }}>{f.a}</p>
                  </details>
                ))}
              </div>
              <Link to="/#faq" className="group mt-2 pt-3 flex items-center gap-1.5 text-[12px] font-bold" style={{ color: C.indigo, fontFamily: "Montserrat, sans-serif", textDecoration: "none", borderTop: "1px solid #F0F1FA" }}>
                Ver todas las preguntas <Bi n="arrow-right" size={12} color={C.indigo} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            {/* Lo de abajo acompaña la lectura (se queda fijo al hacer scroll) */}
            <div className="lg:sticky lg:top-24 space-y-5">
            <div className="relative flex flex-col overflow-hidden rounded-3xl p-6" style={{ background: C.indigo }}>
              <Corner />
              <p className="relative mb-2 text-[10.5px] font-bold uppercase" style={{ letterSpacing: "0.16em", color: C.yellow, fontFamily: "Montserrat, sans-serif" }}>Diagnóstico documental</p>
              <p className="relative mb-2 text-[17px] font-bold leading-snug" style={{ color: "#fff", fontFamily: "Poppins, sans-serif" }}>¿Le pasa esto a su archivo?</p>
              <p className="relative mb-5 text-[12.5px] leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>Le mostramos qué está pasando hoy con su archivo antes de mover un solo papel.</p>
              <Link to="/#cotizador" className="group relative inline-flex items-center gap-1.5 text-[13px] font-semibold" style={{ color: "#fff", textDecoration: "none", fontFamily: "Montserrat, sans-serif" }}>
                Solicitar diagnóstico <Bi n="arrow-right" size={13} color={C.yellow} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="pl-6"><JoelFigure src={JOEL.documento} height={220} /></div>
            </div>
          </aside>
        </div>
      </section>

      {/* Llamado final (mismo de las páginas de servicio) */}
      <CtaBand title="¿Hablamos de la gestión documental de su empresa?" text="Agende su diagnóstico documental con el equipo de especialistas de Transarchivos." />
      <ChatBot open={chatOpen} setOpen={setChatOpen} />
    </div>
  );
}
