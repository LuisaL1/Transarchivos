import { afterEach, describe, expect, it, vi } from "vitest";
import { localize, trimTrailingSlashes } from "@/i18n";
import { clip } from "@/seo/meta";
import { POST as postContact, resetRateLimit as resetContact } from "../../api/contact.mjs";
import { POST as postTicket, resetForTests as resetTicket } from "../../api/ticket.mjs";

// Rutas y validación de correo: casos límite que antes usaban expresiones
// regulares con retrocesos largos (hallazgo de SonarQube, ver docs/10-sonarqube.md).
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); resetContact(); resetTicket(); });

describe("trimTrailingSlashes", () => {
  it("quita las barras finales y deja el resto", () => {
    expect(trimTrailingSlashes("/nosotros/")).toBe("/nosotros");
    expect(trimTrailingSlashes("/en/about///")).toBe("/en/about");
    expect(trimTrailingSlashes("/")).toBe("");
    expect(trimTrailingSlashes("")).toBe("");
    expect(trimTrailingSlashes("/a/b")).toBe("/a/b");
  });
  it("es lineal con entradas largas", () => {
    const t = performance.now();
    trimTrailingSlashes("/".repeat(200_000) + "x" + "/".repeat(200_000));
    expect(performance.now() - t).toBeLessThan(200);
  });
});

describe("localize", () => {
  it("conserva la consulta y el ancla al cambiar de idioma", () => {
    expect(localize("/nosotros?a=1#historia", "en")).toBe("/en/about?a=1#historia");
    expect(localize("/?servicio=x#cotizador", "en")).toBe("/en?servicio=x#cotizador");
    expect(localize("/#faq", "en")).toBe("/en#faq");
    expect(localize("/nosotros", "es")).toBe("/nosotros");
  });
});

describe("clip", () => {
  it("recorta en límite de palabra y sin signos al final", () => {
    expect(clip("uno dos tres cuatro, cinco seis", 20)).toBe("uno dos tres…");
    expect(clip("corto", 20)).toBe("corto");
  });
});

describe("validación de correo en las funciones de servidor", () => {
  const body = (email: string) => JSON.stringify({
    kind: "contacto", subject: "x", replyTo: { email },
    fields: { Motivo: "m", Nombre: "n", "Autorización de datos": "Sí" },
    contact: { email, name: "n" }, subject2: "x",
  });
  const mk = (url: string, email: string) => new Request(url, { method: "POST", headers: { "Content-Type": "application/json", host: "www.transarchivos.com" }, body: body(email) });
  const status = async (fn: typeof postContact, url: string, email: string) => {
    vi.stubEnv("BREVO_API_KEY", "k");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 201 })));
    return (await fn(mk(url, email))).status;
  };
  it.each([
    ["correo válido", "ana@empresa.com", true],
    ["subdominios", "ana.perez@mail.empresa.com.co", true],
    ["sin arroba", "anaempresa.com", false],
    ["sin punto en el dominio", "ana@empresa", false],
    ["dominio con puntos seguidos", "ana@empresa..com", false],
    ["extensión de una letra", "ana@empresa.c", false],
    ["con espacio", "ana @empresa.com", false],
  ])("contacto: %s", async (_n, email, ok) => {
    const s = await status(postContact, "https://www.transarchivos.com/api/contact", email);
    if (ok) expect(s).not.toBe(422); else expect(s).toBe(422);
  });
  it("es lineal con un dominio larguísimo y un espacio al final (caso que hacía la regex antigua cuadrática)", async () => {
    const malo = "a@" + "b.".repeat(30_000) + " ";
    const t = performance.now();
    expect(await status(postContact, "https://www.transarchivos.com/api/contact", malo)).toBe(422);
    expect(await status(postTicket, "https://www.transarchivos.com/api/ticket", malo)).toBe(422);
    expect(performance.now() - t).toBeLessThan(400);
  });
});

describe("preguntas frecuentes del servicio: bloques", () => {
  it("agrupa los pasos numerados en una lista y deja el resto como párrafos", async () => {
    const { blocks } = await import("@/components/sections/ServiceFaqs");
    expect(blocks(["Intro", "1. Primero", "2.   Segundo", "Cierre"])).toEqual([
      { t: "p", s: "Intro" }, { t: "ol", items: ["Primero", "Segundo"] }, { t: "p", s: "Cierre" },
    ]);
  });
  it("no se bloquea con muchos espacios seguidos", async () => {
    const { blocks } = await import("@/components/sections/ServiceFaqs");
    const t = performance.now();
    blocks(["1." + " ".repeat(50_000) + "\n"]);
    expect(performance.now() - t).toBeLessThan(300);
  });
});
