import { CLIENTS } from "@/data/clients";
import { useUi } from "@/i18n/ui";
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

// "contained": solo las dos filas de logos, dentro del ancho del contenido y
// con los bordes desvanecidos (reseña histórica de Nosotros; pedido del
// cliente, oct. 2026: centrados y no de lado a lado como en el inicio).
export function ClientsMarquee({ contained = false }: { contained?: boolean }) {
  const u = useUi().clients;
  if (contained) return (
    <div aria-label={u.aria} role="region" className="max-w-6xl mx-auto px-6">
      <div className="space-y-4 rounded-3xl py-2" style={{ maskImage: "linear-gradient(90deg, rgba(0,0,0,0), #000 8%, #000 92%, rgba(0,0,0,0))", WebkitMaskImage: "linear-gradient(90deg, rgba(0,0,0,0), #000 8%, #000 92%, rgba(0,0,0,0))" }}>
        {rows(u)}
      </div>
    </div>
  );
  return (
    <section aria-label={u.aria} className="relative pt-10 pb-8 md:pt-12 md:pb-10" style={{ background: "#FFFFFF" }}>
      <p className="mb-2 text-center text-xs font-bold uppercase tracking-widest" style={{ color: C.gold, fontFamily: "Montserrat, sans-serif" }}>{u.kicker}</p>
      <p className="mb-8 px-6 mx-auto max-w-4xl text-center text-xl md:text-2xl font-bold" style={{ color: C.indigo, fontFamily: "Poppins, sans-serif" }}>
        {u.title}
      </p>
      {/* Franja blanca (única sección clara del sitio): los logos van
          directamente sobre el fondo, en gris, y recuperan su color al pasar
          el mouse. */}
      <div className="space-y-6">{rows(u)}</div>
    </section>
  );
}

function rows(u: { row: (n: number) => string }) {
  return (
    <>
        {ROWS.map((row, r) => (
          // Región desplazable (con "reducir movimiento"): debe poder enfocarse con teclado (WCAG).
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          <div key={r} className="marquee flex overflow-hidden py-2" dir="ltr" role="region" tabIndex={0} aria-label={u.row(r + 1)}>
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
    </>
  );
}
