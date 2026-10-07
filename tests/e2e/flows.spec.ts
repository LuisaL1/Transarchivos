import { expect, test } from "@playwright/test";

// Recorridos principales del visitante.
test("selector del hero: cada pestaña cambia el servicio", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("tab", { name: /Destruir/ }).click();
  await expect(page.getByRole("tab", { name: /Destruir/ })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("link", { name: /Cotizar este servicio/ })).toHaveAttribute("href", /destruccion-de-documentos/);
});

test("menú Servicios lleva a la página del servicio", async ({ page, isMobile }) => {
  test.skip(isMobile, "En celular el menú es un panel distinto");
  await page.goto("/");
  await page.getByRole("button", { name: /Servicios/ }).first().click();
  await page.getByRole("link", { name: /Custodia de Archivos/ }).first().click();
  await expect(page).toHaveURL(/\/servicios\/custodia-de-archivos/);
  await expect(page.locator("h1")).toContainText("Custodia");
});

test("buscador encuentra un servicio sin tildes", async ({ page, isMobile }) => {
  test.skip(isMobile, "La lupa está en la barra de escritorio");
  await page.goto("/");
  await page.getByRole("button", { name: /Buscar/ }).first().click();
  await page.getByRole("dialog", { name: /Buscar/ }).locator("input").fill("digitalizacion");
  await expect(page.getByRole("dialog").getByText(/Digitalización de Documentos/).first()).toBeVisible();
});

test("chat de Joel responde texto libre", async ({ page }) => {
  await page.goto("/");
  // Con GA activo, el aviso de cookies oculta el botón del chat en celular hasta decidir.
  const banner = page.getByRole("dialog", { name: "Aviso de cookies" });
  if (await banner.isVisible()) await banner.getByRole("button", { name: "Rechazar" }).click();
  await page.locator("[data-chat-launcher]").first().click();
  const input = page.getByPlaceholder(/Escriba|mensaje|pregunta/i).first();
  await input.fill("quiero digitalizar mis documentos");
  await input.press("Enter");
  await expect(page.getByText(/Digitalización/).last()).toBeVisible({ timeout: 15_000 });
});

test("artículo: el índice lleva a la sección", async ({ page, isMobile }) => {
  await page.goto("/blog/mido-software-gestion-documental");
  const toc = page.getByText("En este artículo").locator("..");
  const first = toc.getByRole("button").first();
  const title = (await first.textContent())!.replace(/^\d+/, "").trim();
  await first.click();
  await expect(page.getByRole("heading", { name: title })).toBeInViewport();
  if (!isMobile) await expect(page.getByText("Preguntas frecuentes").first()).toBeVisible();
});

test("desde un servicio, 'Servicios' lleva a la sección de servicios de la portada", async ({ page, isMobile }) => {
  test.skip(isMobile, "El menú de escritorio abre el servicio");
  await page.goto("/");
  await page.getByRole("button", { name: /Servicios/ }).first().click();
  await page.getByRole("link", { name: /Custodia de Archivos/ }).first().click();
  await expect(page).toHaveURL(/\/servicios\/custodia-de-archivos/);
  await page.getByRole("button", { name: "Servicios" }).last().click();
  await expect(page).toHaveURL(/\/#servicios$/);
  await expect.poll(async () => page.evaluate(() => Math.round(document.getElementById("servicios")?.getBoundingClientRect().top ?? 9999)), { timeout: 5000 }).toBeLessThan(120);
});

test("la flecha de volver de un servicio lleva a la sección de servicios", async ({ page }) => {
  await page.goto("/servicios/digitalizacion-de-documentos");
  await page.getByRole("button", { name: "Volver a servicios" }).click();
  await expect(page).toHaveURL(/\/#servicios$/);
  await expect.poll(async () => page.evaluate(() => Math.abs(Math.round(document.getElementById("servicios")?.getBoundingClientRect().top ?? 9999))), { timeout: 5000 }).toBeLessThan(120);
});
