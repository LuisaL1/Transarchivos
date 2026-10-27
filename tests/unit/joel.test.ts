import { beforeEach, describe, expect, it } from "vitest";
import { greeting } from "@/lib/joel";
import { services } from "@/data/services";
import { track } from "@/lib/visitor";

// Saludo de Joel: menú de botones según lo que el visitante hizo en el sitio.
// (Lo que el visitante escribe lo responde Zoho SalesIQ: ver useAdvisorChat.)
beforeEach(() => localStorage.clear());

describe("Joel · saludo", () => {
  it("la primera vez ofrece el menú completo, con «Hablar con un asesor»", () => {
    const g = greeting(services);
    expect(g.say[0]).toMatch(/Soy Joel/);
    expect(g.options.map(o => o.label)).toEqual(["Cotizar un servicio", "Conocer los servicios", "Preguntas frecuentes", "Hablar con un asesor"]);
    expect(g.options.at(-1)).toMatchObject({ next: "human" });
  });

  it("si el visitante iba a cotizar un servicio, le ofrece terminar esa cotización", () => {
    track("quote", "custodia-de-archivos");
    const g = greeting(services);
    expect(g.say.join(" ")).toMatch(/Custodia de archivos/);
    expect(g.options[0]).toMatchObject({ label: "Cotizar Custodia de archivos", next: "q_volume", set: { service: "custodia-de-archivos" } });
  });

  it("al visitante técnico le ofrece resolver dudas de normativa con Zoho SalesIQ", () => {
    for (const s of ["faq", "modelo", "faq"]) track("section", s);
    const g = greeting(services);
    expect(g.options[0]).toMatchObject({ label: "Dudas de normativa", next: "zoho" });
  });
});
