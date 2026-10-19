import { CLIENTS } from "@/data/clients";
import { C } from "@/styles/tokens";

// Carrusel de clientes históricos (mismo recurso de Transpack): dos filas que
// se desplazan en sentidos opuestos, logos en escala de grises que recuperan su
// color al pasar el mouse, bordes desvanecidos y pausa al pasar el mouse.
// Con "reducir movimiento" las filas quedan quietas y se desplazan a mano.
const LOGOS = import.meta.glob<string>("@/assets/images/clientes/*.webp", { eager: true, import: "default" });
const src = (file: string) => LOGOS[`/src/assets/images/clientes/${file}.webp`];

// Caja de cada logo: iguala el peso visual
// (los logos anchos se ven más bajos) sin salirse de la ficha.
function logoBox(ratio: number) {
  let h = Math.min(52, Math.max(26, Math.sqrt(4200 / ratio)));
  let w = h * ratio;
  if (w > 136) { w = 136; h = w / ratio; }
  return { w: Math.round(w), h: Math.round(h) };
}

const ROWS = [CLIENTS.filter((_, i) => i % 2 === 0), CLIENTS.filter((_, i) => i % 2 === 1)];

export function ClientsMarquee() {
  return (
    <section aria-label="Empresas que han confiado en Transarchivos" className="relative pt-10 pb-8 md:pt-12 md:pb-10" style={{ background: "#FFFFFF" }}>
      <p className="mb-2 text-center text-xs font-bold uppercase tracking-widest" style={{ color: C.gold, fontFamily: "Montserrat, sans-serif" }}>Nuestros clientes</p>
      <p className="mb-8 px-6 mx-auto max-w-4xl text-center text-xl md:text-2xl font-bold" style={{ color: C.indigo, fontFamily: "Poppins, sans-serif" }}>
        Más de 4.000 compañías garantizan su cumplimiento normativo y seguridad documental con Transarchivos
      </p>
      {/* Franja blanca (única sección clara del sitio): los logos van
          directamente sobre el fondo, en gris, y recuperan su color al pasar
          el mouse. */}
      <div className="space-y-6">
        {ROWS.map((row, r) => (
          // Región desplazable (con "reducir movimiento"): debe poder enfocarse con teclado (WCAG).
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          <div key={r} className="marquee flex overflow-hidden py-2" dir="ltr" role="region" tabIndex={0} aria-label={`Logos de clientes, fila ${r + 1}`}>
            {[0, 1].map(k => (
              <div key={k} aria-hidden={k === 1} className={`marquee-track flex shrink-0 items-center gap-12 pr-12 md:gap-14 md:pr-14 ${r ? "marquee-reverse" : ""}`}
                style={{ animationDuration: `${row.length * 3.2}s` }}>
                {row.map(c => {
                  const { w, h } = logoBox(c.ratio);
                  return (
                    <img key={c.file} src={src(c.file)} alt={k === 0 ? c.name : ""} title={c.name} loading="lazy" decoding="async" draggable={false}
                      width={w} height={h} className="client-logo shrink-0 select-none object-contain" style={{ width: w, height: h }} />
                  );
                })}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
