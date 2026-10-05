import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { services, serviceItems } from "@/data/services";
import { SERVICE_DETAILS } from "@/data/serviceDetails";
import { SERVICE_JOEL } from "@/data/joelPoses";
import { quoteConfig } from "@/data/quote";
import { SOLUTIONS } from "@/data/solutions";
import { blogPosts } from "@/data/blog";
import { FAQS } from "@/data/faqs";

// Integridad del contenido (src/data) y reglas de negocio de AGENTS.md.
const files = (dir: string): string[] => readdirSync(dir).flatMap(f => { const p = join(dir, f); return statSync(p).isDirectory() ? files(p) : [p]; });
const SRC = files("src").filter(f => /\.(tsx?|css)$/.test(f));
const all = SRC.map(f => [f, readFileSync(f, "utf8")] as const);

describe("Servicios", () => {
  const slugs = services.map(s => s.slug);
  it("tienen slugs únicos", () => expect(new Set(slugs).size).toBe(slugs.length));
  it("cada servicio tiene página de detalle, pose de Joel y cotizador", () => {
    for (const s of slugs) {
      expect(SERVICE_DETAILS[s], `detalle de ${s}`).toBeDefined();
      expect(SERVICE_JOEL[s], `Joel de ${s}`).toBeDefined();
      expect(quoteConfig[s], `cotizador de ${s}`).toBeDefined();
    }
  });
  it("el menú apunta a servicios existentes", () => {
    for (const i of serviceItems) expect(slugs).toContain(i.slug);
  });
  it("las soluciones apuntan a servicios existentes", () => {
    for (const sol of SOLUTIONS) for (const s of sol.slugs) expect(slugs).toContain(s);
  });
});

describe("Blog y preguntas frecuentes", () => {
  it("artículos con slug único, portada y contenido", () => {
    expect(new Set(blogPosts.map(p => p.slug)).size).toBe(blogPosts.length);
    for (const p of blogPosts) { expect(p.cover).toBeTruthy(); expect(p.blocks.length).toBeGreaterThan(0); }
  });
  it("preguntas frecuentes con pregunta y respuesta", () => {
    for (const f of FAQS) { expect(f.q.trim().endsWith("?")).toBe(true); expect(f.a.length).toBeGreaterThan(20); }
  });
});

describe("Reglas de contenido", () => {
  it("no se afirma ISO 9001 (la empresa no la tiene)", () => {
    for (const [f, s] of all) expect(s, f).not.toMatch(/ISO\s?9001/i);
  });
  it("no quedan textos de relleno", () => {
    for (const [f, s] of all) expect(s, f).not.toMatch(/lorem ipsum|TODO:|FIXME/i);
  });
});

describe("Diseño", () => {
  // Paleta del manual de identidad + neutros ya usados. Para añadir un color,
  // agréguelo aquí a propósito (y en AGENTS.md).
  const ALLOWED = new Set(["#272B7C", "#1800AD", "#FFDE59", "#C8960A", "#EAEAEA", "#FFFFFF", "#FBFBF8", "#F1F3FB",
    "#E4E6F7", "#6B6B6B", "#9B9B9B", "#F7F8FF", "#ECEEF6", "#8A8A8A", "#DDE0F2", "#16A34A", "#F2F3FA", "#37352F", "#F0F1FA",
    "#E9E9E7", "#FFF6D6", "#22C55E", "#15803D", "#FF9F1C", "#FAFBFF", "#F6F7FD", "#EEF0FB", "#C9CDEE", "#B5B9D6", "#8A6D00",
    "#FFE39A", "#F1F2F8", "#EAF7EE", "#E5AE1A", "#C3C7E8", "#B8860B", "#6B7280", "#666666", "#4B4B4B", "#1A1A2E"]);
  it("solo se usan colores de la paleta", () => {
    for (const [f, s] of all) for (const c of s.match(/#[0-9a-fA-F]{6}\b/g) ?? []) expect(ALLOWED.has(c.toUpperCase()), `${c} en ${f}`).toBe(true);
  });
  it("sin degradados de color (solo la sombra del hero, patrones de puntos y subrayados)", () => {
    for (const [f, s] of all) {
      for (const g of s.match(/linear-gradient\([^)]*\)[^"]*/g) ?? []) {
        // Cortes duros (subrayado amarillo, línea punteada) no son degradados.
        const ok = /transparent \d/.test(g) || /rgba\(0,0,0/.test(g);
        expect(ok, `${g.slice(0, 60)} en ${f}`).toBe(true);
      }
    }
  });
});
