import { CLIENTS } from "@/data/clients";

// Carrusel de clientes históricos (mismo recurso de Transpack): dos filas que
// se desplazan en sentidos opuestos, logos en escala de grises que recuperan su
// color al pasar el mouse, bordes desvanecidos y pausa al pasar el mouse.
// Con "reducir movimiento" las filas quedan quietas y se desplazan a mano.
const LOGOS = import.meta.glob<string>("@/assets/images/clientes/*.webp", { eager: true, import: "default" });
const src = (file: string) => LOGOS[`/src/assets/images/clientes/${file}.webp`];

// Alto que iguala el peso visual de cada logo (los anchos se ven más bajos)
const logoHeight = (ratio: number) => Math.round(Math.min(48, Math.max(22, Math.sqrt(3800 / ratio))));

const ROWS = [CLIENTS.filter((_, i) => i % 2 === 0), CLIENTS.filter((_, i) => i % 2 === 1)];

export function ClientsMarquee() {
  return (
    <section aria-label="Empresas que han confiado en Transarchivos" className="relative bg-white pt-10 pb-8 md:pt-12 md:pb-10">
      <p className="mb-2 text-center text-xs font-bold uppercase tracking-widest" style={{ color: "#C8960A", fontFamily: "Montserrat, sans-serif" }}>Nuestros clientes</p>
      <p className="mb-8 px-6 text-center text-xl md:text-2xl font-bold" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>
        Más de {Math.floor(CLIENTS.length / 10) * 10} empresas han confiado su información en nosotros
      </p>
      <div className="space-y-6">
        {ROWS.map((row, r) => (
          // Región desplazable (con "reducir movimiento"): debe poder enfocarse con teclado (WCAG).
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          <div key={r} className="marquee flex overflow-hidden" dir="ltr" role="region" tabIndex={0} aria-label={`Logos de clientes, fila ${r + 1}`}>
            {[0, 1].map(k => (
              <div key={k} aria-hidden={k === 1} className={`marquee-track flex shrink-0 items-center gap-14 pr-14 ${r ? "marquee-reverse" : ""}`}
                style={{ animationDuration: `${row.length * 3.2}s` }}>
                {row.map(c => {
                  const h = logoHeight(c.ratio);
                  return (
                    <img key={c.file} src={src(c.file)} alt={k === 0 ? c.name : ""} title={c.name} loading="lazy" decoding="async" draggable={false}
                      width={Math.round(h * c.ratio)} height={h}
                      className="client-logo shrink-0 select-none object-contain" style={{ height: h, width: Math.round(h * c.ratio) }} />
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
