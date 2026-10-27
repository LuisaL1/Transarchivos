import { useState } from "react";
import { Link } from "react-router-dom";
import { ChatBot } from "@/components/chat/LazyChatBot";
import { HEADER_SPACE, SiteHeader } from "@/components/layout/SiteHeader";
import { Bi } from "@/components/ui/Icons";
import { useLang } from "@/i18n";
import { useContent } from "@/i18n/content";
import { usePagesUi } from "@/i18n/pages";
import { C } from "@/styles/tokens";

// Página 404: Vercel la sirve con estado 404 para cualquier URL que no exista
// (404.html pre-generado). Ofrece salidas útiles en vez de un callejón sin salida.
export function NotFoundPage() {
  const [chatOpen, setChatOpen] = useState(false);
  const u = usePagesUi();
  const { lp } = useLang();
  const { services } = useContent();
  return (
    <div className="min-h-full" style={{ background: C.cream, fontFamily: "Inter, sans-serif", color: "#37352F" }}>
      <SiteHeader solid onChat={() => setChatOpen(true)} />
      <div aria-hidden="true" style={{ height: HEADER_SPACE }} />
      <main className="max-w-3xl mx-auto px-6 py-20 text-center">
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: C.gold, fontFamily: "Montserrat, sans-serif" }}>{u.notFound.kicker}</p>
        <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: C.indigo, fontFamily: "Poppins, sans-serif", lineHeight: 1.15 }}>{u.notFound.title}</h1>
        <p className="text-base mb-8" style={{ color: C.muted, lineHeight: 1.7 }}>{u.notFound.text}</p>
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <Link to={lp("/")} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold" style={{ background: C.indigo, color: "#fff", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
            <Bi n="house" size={14} color={C.yellow} /> {u.notFound.home}
          </Link>
          <Link to={lp("/#cotizador")} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold" style={{ background: C.yellow, color: C.indigo, fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
            {u.common.quote} <Bi n="arrow-right" size={14} color={C.indigo} />
          </Link>
        </div>
        <nav aria-label={u.notFound.nav} className="grid sm:grid-cols-3 gap-3 text-left">
          {services.map(s => (
            <Link key={s.slug} to={lp(`/servicios/${s.slug}`)} className="flex items-center gap-3 rounded-2xl p-4 card-lift" style={{ background: "#fff", border: "1px solid #E4E6F7", textDecoration: "none" }}>
              <Bi n={s.icon} size={16} color={C.indigo} />
              <span className="text-sm font-semibold" style={{ color: C.indigo }}>{s.title}</span>
            </Link>
          ))}
        </nav>
      </main>
      <ChatBot open={chatOpen} setOpen={setChatOpen} />
    </div>
  );
}
