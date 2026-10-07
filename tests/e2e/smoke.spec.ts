import { expect, test } from "@playwright/test";

// Todas las rutas cargan, sin errores de JavaScript ni recursos rotos.
const ROUTES = ["/", "/nosotros", "/privacidad", "/servicios/custodia-de-archivos", "/servicios/digitalizacion-de-documentos", "/blog/mido-software-gestion-documental"];

for (const route of ROUTES) {
  test(`carga ${route} sin errores`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", e => errors.push(e.message));
    page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
    page.on("response", r => { if (r.status() >= 400 && new URL(r.url()).origin === new URL(page.url() || "http://x").origin) errors.push(`${r.status()} ${r.url()}`); });
    const res = await page.goto(route);
    expect(res?.status()).toBeLessThan(400);
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page).toHaveTitle(/Transarchivos/);
    expect(errors).toEqual([]);
  });
}

test("una ruta inexistente de servicio muestra aviso", async ({ page }) => {
  await page.goto("/servicios/no-existe");
  await expect(page.getByText("Servicio no encontrado")).toBeVisible();
});
