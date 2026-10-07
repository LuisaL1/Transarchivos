import { STATS } from "@/data/stats";

// Franja de indicadores bajo el hero (mismo formato que en Transpack): tarjeta
// blanca redondeada, cifras grandes en azul de marca con el "+" en dorado y
// divisiones finas. Datos en src/data/stats.ts.
export function Stats() {
  return (
    <section aria-label="Nuestra experiencia en cifras" className="py-8 md:py-10" style={{ background: "#FBFBF8" }}>
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="grid sm:grid-cols-3 overflow-hidden rounded-[22px] bg-white"
          style={{ border: "1px solid #E4E6F7", boxShadow: "0 24px 50px -34px rgba(39,43,124,0.45)" }}>
          {STATS.map((s, i) => (
            <div key={s.label} className={`flex flex-col gap-1.5 px-6 py-6 sm:px-8 sm:py-8 ${i ? "border-t sm:border-t-0 sm:border-l" : ""}`} style={{ borderColor: "#ECEEF6" }}>
              <span className="font-semibold leading-none" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif", fontSize: "clamp(2.1rem, 1.6rem + 1.6vw, 3rem)" }}>
                <span style={{ color: "#C8960A" }}>{s.prefix}</span>{s.value}
                {s.unit && <span className="ml-2 align-middle text-base sm:text-lg font-semibold">{s.unit}</span>}
              </span>
              <span className="text-[0.88rem] font-medium" style={{ color: "#6B6B6B" }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
