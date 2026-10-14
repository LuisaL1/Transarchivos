import { Link } from "react-router-dom";
import { JoelSilhouette } from "@/components/ui/Brand";
import { Bi } from "@/components/ui/Icons";
import { whatsappUrl } from "@/data/contact";
import { C } from "@/styles/tokens";

// Llamado final de las páginas internas: tarjeta índigo con pestaña de carpeta,
// silueta de Joel, botón amarillo al cotizador y WhatsApp.
export function CtaBand({ title, text, to = "/#cotizador" }: { title: string; text: string; to?: string }) {
  return (
    <section className="py-16" style={{ background: C.cream }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="relative">
          <svg aria-hidden="true" className="absolute left-0 bottom-full block" width="220" height="36" viewBox="0 0 280 46" preserveAspectRatio="none">
            <path d="M0 46 V18 Q0 0 18 0 H196 Q209 0 217 10 L242 38 Q249 46 262 46 Z" fill={C.indigo} />
          </svg>
          <div className="relative overflow-hidden rounded-[0_28px_28px_28px] p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-6" style={{ background: C.indigo }}>
            <JoelSilhouette style={{ height: 300, bottom: -40, right: 40, opacity: 0.28, background: "#FFFFFF" }} />
            <div className="relative max-w-xl">
              <p className="text-2xl md:text-3xl font-bold mb-2" style={{ color: "#fff", fontFamily: "Poppins, sans-serif", lineHeight: 1.2 }}>{title}</p>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.72)" }}>{text}</p>
            </div>
            <div className="relative flex flex-wrap gap-3">
              <Link to={to} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold transition-transform hover:scale-[1.03]"
                style={{ background: C.yellow, color: C.indigo, fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
                Solicitar cotización <Bi n="arrow-right" size={14} color={C.indigo} />
              </Link>
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold"
                style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
                <Bi n="whatsapp" size={14} color="#fff" /> Escribir por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
