import { describe, expect, it } from "vitest";
import { CHAT_STEPS, teamQuoteMessage, validPhone } from "@/data/chat";

// Cotización hecha con Joel → mensaje para el chat de los asesores (seguimiento)
const d = { service: "custodia-de-archivos", volume: "Entre 100 y 1.000 cajas", urgency: "Urgente", name: "Luisa", company: "Acme S.A.S.", phone: "300 123 4567" };

describe("cotización del chat → equipo comercial", () => {
  it("el mensaje para el equipo va marcado como nueva cotización, con nombre, celular y todas las respuestas", () => {
    const m = teamQuoteMessage(d);
    expect(m).toMatch(/^🆕 NUEVA COTIZACIÓN para seguimiento/);
    expect(m).toContain("Cliente: Luisa");
    expect(m).toContain("Celular / WhatsApp: 300 123 4567");
    expect(m).toContain("• Servicio: Custodia de archivos");
    expect(m).toContain("• Volumen: Entre 100 y 1.000 cajas");
    expect(m).toContain("• Urgencia: Urgente");
    expect(m).toContain("• Empresa: Acme S.A.S.");
    expect(m).toContain("contactar al cliente");
    // El celular no se repite dentro del resumen
    expect(m.match(/300 123 4567/g)).toHaveLength(1);
  });

  it("pide el celular después de la empresa y valida que esté completo", () => {
    expect(CHAT_STEPS.q_company.input!.next({ company: "Acme" })).toBe("q_phone");
    expect(CHAT_STEPS.q_phone.input!.next({ phone: "300 123 4567" })).toBe("q_done");
    expect(CHAT_STEPS.q_phone.input!.next({ phone: "123" })).toBe("q_phone_retry");
    expect(CHAT_STEPS.q_phone_retry.input!.next({ phone: "+1 (555) 123-4567" })).toBe("q_done");
    expect(validPhone("abc")).toBe(false);
  });

  it("el resumen ofrece primero «Enviar a un asesor» y nada se envía solo", () => {
    const actions = CHAT_STEPS.q_done.actions!(d);
    expect(actions[0]).toMatchObject({ label: "Enviar a un asesor", sendQuote: true });
    expect(actions.map(a => a.label)).toEqual(["Enviar a un asesor", "Escribir por WhatsApp", "Enviar por correo"]);
    expect(actions[1].href).toMatch(/wa\.me/);
    expect(actions[2].href).toMatch(/^#contacto/);
  });
});
