import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { HeroQuickStart } from "@/components/home/Hero";

describe("Selector del hero (¿Qué necesitas hoy?)", () => {
  it("cambia de servicio y apunta a su cotización", async () => {
    render(<MemoryRouter><HeroQuickStart /></MemoryRouter>);
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(4);
    await userEvent.click(screen.getByRole("tab", { name: /Destruir/ }));
    expect(screen.getByRole("tab", { name: /Destruir/ })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("link", { name: /Cotizar este servicio/ }).getAttribute("href")).toMatch(/servicio=destruccion-de-documentos/);
  });
});
