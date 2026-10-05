import { Link, useNavigate } from "react-router-dom";
import { Bi } from "@/components/ui/Icons";
import { SectionDecor } from "@/components/ui/SectionDecor";
import { services } from "@/data/services";
import { SOLUTIONS } from "@/data/solutions";

export function SolucionesSection() {
  const navigate = useNavigate();
  return (
    <section id="soluciones" className="relative isolate overflow-hidden py-20" style={{ scrollMarginTop: 80 }}>
      <SectionDecor variant="lavender" flip />
      <div className="relative max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#C8960A", fontFamily: "Montserrat, sans-serif" }}>Soluciones</p>
          <h2 className="text-3xl md:text-4xl font-bold max-w-3xl mx-auto" style={{ fontFamily: "Poppins, sans-serif", color: "#272B7C", lineHeight: 1.2 }}>
            Soluciones para <span style={{ background: "linear-gradient(transparent 62%, #FFDE59 62%)" }}>cada reto documental</span> de su empresa
          </h2>
          <p className="text-sm mt-4 max-w-2xl mx-auto" style={{ color: "#6B6B6B" }}>
            Empiece por lo que necesita resolver. Cada solución combina los servicios que la hacen posible.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SOLUTIONS.map(sol => (
            // Toda la tarjeta lleva a cotizar la solución (como las tarjetas de
            // servicios); los enlaces de adentro conservan su propio destino.
            <div key={sol.id} id={`sol-${sol.id}`} role="link" tabIndex={0}
              onClick={e => { if ((e.target as HTMLElement).closest("a")) return; navigate(`/?servicio=${sol.slugs[0]}&solucion=${sol.id}#cotizador`); }}
              onKeyDown={e => { if (e.key === "Enter") navigate(`/?servicio=${sol.slugs[0]}&solucion=${sol.id}#cotizador`); }}
              className="group relative flex flex-col rounded-3xl p-6 cursor-pointer card-lift border-[1.5px] border-[#E4E6F7] hover:border-[#272B7C]"
              style={{ background: "#fff", scrollMarginTop: 100 }}>
              <div className="flex items-center justify-between mb-4">
                <span className="grid place-items-center rounded-2xl transition-colors bg-[#272B7C]/[0.08] group-hover:bg-[#272B7C]" style={{ width: 48, height: 48 }}>
                  <i className={`bi bi-${sol.icon} text-[#272B7C] group-hover:text-[#FFDE59] transition-colors`} aria-hidden="true" style={{ fontSize: 21, lineHeight: 1 }} />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full" style={{ background: "#FFF6D6", color: "#8a6d00", fontFamily: "Montserrat, sans-serif" }}>{sol.tag}</span>
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif", lineHeight: 1.25 }}>{sol.title}</h3>
              <p className="text-[13px] italic mb-3 pl-3" style={{ color: "#6B6B6B", borderLeft: "3px solid #FFDE59" }}>“{sol.problem}”</p>
              <p className="text-sm mb-4" style={{ color: "#6B6B6B", lineHeight: 1.6 }}>{sol.desc}</p>
              <ul className="space-y-1.5 mb-5">
                {sol.points.map(pt => (
                  <li key={pt} className="flex items-start gap-2 text-xs" style={{ color: "#272B7C" }}>
                    <Bi n="check-circle-fill" size={12} color="#16a34a" style={{ marginTop: 2, flexShrink: 0 }} />{pt}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-4" style={{ borderTop: "1px solid #F0F1FA" }}>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "#9B9B9B", fontFamily: "Montserrat, sans-serif" }}>Servicios que la componen</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {sol.slugs.map(sl => {
                    const sv = services.find(x => x.slug === sl);
                    return sv ? (
                      <Link key={sl} to={`/servicios/${sl}`} className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors hover:bg-[#272B7C] hover:text-white"
                        style={{ background: "#F2F3FA", color: "#272B7C", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
                        {sv.title}
                      </Link>
                    ) : null;
                  })}
                </div>
                <Link to={`/?servicio=${sol.slugs[0]}&solucion=${sol.id}#cotizador`} className="inline-flex items-center gap-1.5 text-sm font-bold transition-transform group-hover:translate-x-0.5" style={{ color: "#1800AD", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
                  Cotizar esta solución <Bi n="arrow-right" size={14} color="#1800AD" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
