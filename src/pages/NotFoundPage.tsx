import { useState } from "react";
import { Link } from "react-router-dom";
import { ChatBot } from "@/components/chat/ChatBot";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Bi } from "@/components/ui/Icons";
import { services } from "@/data/services";

// Página 404: Vercel la sirve con estado 404 para cualquier URL que no exista
// (404.html pre-generado). Ofrece salidas útiles en vez de un callejón sin salida.
export function NotFoundPage() {
  const [chatOpen, setChatOpen] = useState(false);
  return (
    <div className="min-h-full" style={{ background: "#FBFBF8", fontFamily: "Inter, sans-serif", color: "#37352F" }}>
      <SiteHeader solid onChat={() => setChatOpen(true)} />
      <div aria-hidden="true" style={{ height: 60 }} />
      <main className="max-w-3xl mx-auto px-6 py-20 text-center">
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#6B6B6B", fontFamily: "Montserrat, sans-serif" }}>Error 404</p>
        <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif", lineHeight: 1.15 }}>No encontramos esta página</h1>
        <p className="text-base mb-8" style={{ color: "#6B6B6B", lineHeight: 1.7 }}>Puede que la dirección haya cambiado. Estos enlaces le pueden servir:</p>
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold" style={{ background: "#272B7C", color: "#fff", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
            <Bi n="house" size={14} color="#FFDE59" /> Ir al inicio
          </Link>
          <Link to="/#cotizador" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold" style={{ background: "#FFDE59", color: "#272B7C", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
            Solicitar cotización <Bi n="arrow-right" size={14} color="#272B7C" />
          </Link>
        </div>
        <nav aria-label="Servicios" className="grid sm:grid-cols-3 gap-3 text-left">
          {services.map(s => (
            <Link key={s.slug} to={`/servicios/${s.slug}`} className="flex items-center gap-3 rounded-2xl p-4 card-lift" style={{ background: "#fff", border: "1px solid #E4E6F7", textDecoration: "none" }}>
              <Bi n={s.icon} size={16} color="#272B7C" />
              <span className="text-sm font-semibold" style={{ color: "#272B7C" }}>{s.title}</span>
            </Link>
          ))}
        </nav>
      </main>
      <ChatBot open={chatOpen} setOpen={setChatOpen} />
    </div>
  );
}
