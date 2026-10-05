import { describe, expect, it } from "vitest";
import { searchContent } from "@/data/search";

describe("Buscador del header", () => {
  it("encuentra sin tildes", () => {
    expect(searchContent("digitalizacion").some(r => r.title.includes("Digitalización"))).toBe(true);
  });
  it("pide al menos 2 caracteres", () => {
    expect(searchContent("a")).toEqual([]);
  });
  it("muestra como máximo 7 resultados", () => {
    expect(searchContent("de").length).toBeLessThanOrEqual(7);
  });
  it("cada resultado tiene un destino", () => {
    for (const r of searchContent("archivo")) expect(r.to ?? r.href).toBeTruthy();
  });
});
