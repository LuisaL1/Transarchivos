import { useState } from "react";
import { Link } from "react-router-dom";
import { ChatBot } from "@/components/chat/LazyChatBot";
import { HEADER_SPACE, SiteHeader } from "@/components/layout/SiteHeader";
import { Bi } from "@/components/ui/Icons";
import { SectionDecor } from "@/components/ui/SectionDecor";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { VIDEOS, YOUTUBE_CHANNEL_URL, type Video } from "@/data/videos";
import { useLang } from "@/i18n";
import { usePagesUi } from "@/i18n/pages";
import { C } from "@/styles/tokens";

// ─── "Da play al conocimiento": todos los videos del canal ─────────────────
// Página pedida por el cliente (oct. 2026) con los videos horizontales del
// canal de YouTube (src/data/videos.ts). Cada tarjeta muestra la miniatura de
// YouTube y solo al pulsar "play" carga el reproductor (youtube-nocookie, sin
// cookies hasta que el visitante decide ver el video); así la página no
// descarga 28 reproductores de entrada. Los videos están en español; en la
// versión en inglés se avisa.

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

function VideoCard({ v, watch, play }: { v: Video; watch: string; play: (t: string) => string }) {
  const [playing, setPlaying] = useState(false);
  // Miniatura estándar de YouTube (480×360, siempre existe; las de mayor
  // resolución responden 404 en varios videos). Es 4:3 con franjas negras: el
  // recorte 16:9 las elimina.
  const thumb = `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`;
  return (
    <article className="rounded-2xl overflow-hidden bg-white flex flex-col" style={{ border: "1px solid #E4E6F7", boxShadow: "0 20px 40px -24px rgba(24,0,173,0.25)" }}>
      <div className="relative w-full" style={{ paddingTop: "56.25%", background: C.indigo }}>
        {playing ? (
          <iframe className="absolute inset-0 w-full h-full" src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`} title={v.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
        ) : (
          <button type="button" onClick={() => setPlaying(true)} aria-label={play(v.title)} className="group absolute inset-0 w-full h-full">
            <img src={thumb} alt="" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
            <span aria-hidden="true" className="absolute inset-0 transition-colors" style={{ background: "rgba(0,0,0,0.22)" }} />
            <span aria-hidden="true" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 grid place-items-center rounded-full transition-transform group-hover:scale-110"
              style={{ width: 64, height: 64, background: C.yellow, boxShadow: "0 14px 28px -10px rgba(0,0,0,0.55)" }}>
              <Bi n="play-fill" size={30} color={C.indigo} />
            </span>
            <span aria-hidden="true" className="absolute right-3 bottom-3 text-[11px] font-bold px-2 py-0.5 rounded-md" style={{ background: "rgba(0,0,0,0.7)", color: "#fff", fontFamily: "Montserrat, sans-serif" }}>
              {mmss(v.duration)}
            </span>
          </button>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col gap-3">
        <h3 className="text-sm font-semibold leading-snug flex-1" lang="es" style={{ color: C.indigo, fontFamily: "Montserrat, sans-serif" }}>{v.title}</h3>
        <a href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold self-start" style={{ color: C.muted, textDecoration: "none" }}>
          <Bi n="youtube" size={14} color={C.muted} /> {watch}
        </a>
      </div>
    </article>
  );
}

export function VideosPage() {
  const [chatOpen, setChatOpen] = useState(false);
  const u = usePagesUi();
  const v = u.videos;
  const { lp } = useLang();
  return (
    <div className="min-h-full" style={{ background: C.cream, fontFamily: "Inter, sans-serif", color: "#37352F" }}>
      <SiteHeader solid onChat={() => setChatOpen(true)} />
      <div aria-hidden="true" style={{ height: HEADER_SPACE }} />

      <PageHero>
        <div className="max-w-6xl mx-auto px-6 pt-12 pb-24">
          <p className="text-xs mb-6" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "Montserrat, sans-serif" }}>
            <Link to={lp("/")} style={{ color: "inherit", textDecoration: "none" }}>{u.common.home}</Link> / <span style={{ color: C.yellow }}>{v.title}</span>
          </p>
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-5" style={{ background: "rgba(255,255,255,0.1)", color: C.yellow, border: "1px solid rgba(255,222,89,0.35)", fontFamily: "Montserrat, sans-serif" }}>
            <Bi n="youtube" size={13} color={C.yellow} /> {v.badge}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#fff", fontFamily: "Poppins, sans-serif", lineHeight: 1.1 }}>{v.title}</h1>
          <p className="text-lg md:text-xl font-semibold mb-4 max-w-2xl" style={{ color: C.yellow, fontFamily: "Poppins, sans-serif", lineHeight: 1.35 }}>{v.tagline}</p>
          <p className="text-base max-w-2xl" style={{ color: "rgba(255,255,255,0.78)", lineHeight: 1.7 }}>{v.text}</p>
        </div>
      </PageHero>

      <section className="relative isolate overflow-hidden py-16">
        <SectionDecor variant="light" />
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <p className="text-sm" style={{ color: C.muted }}>{v.count(VIDEOS.length)}{v.note && <> · {v.note}</>}</p>
            <a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-transform hover:scale-[1.03]"
              style={{ background: C.indigo, color: "#fff", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
              <Bi n="youtube" size={16} color={C.yellow} /> {v.subscribe}
            </a>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {VIDEOS.map(x => <VideoCard key={x.id} v={x} watch={v.watch} play={v.play} />)}
          </div>
        </div>
      </section>

      <CtaBand title={v.cta} />
      <ChatBot open={chatOpen} setOpen={setChatOpen} />
    </div>
  );
}
