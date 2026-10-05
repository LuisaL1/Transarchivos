import { expect, test } from "@playwright/test";

// SEO en el navegador: contenido sin JavaScript (lo que ve un rastreador
// simple o una red social) y etiquetas que se actualizan al navegar.
test.describe("sin JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  for (const [route, h1] of [["/", /Sus archivos/], ["/nosotros", /Pioneros/], ["/servicios/custodia-de-archivos", /Custodia de Archivos/], ["/blog/mido-software-gestion-documental", /Mido/]] as const) {
    test(`${route} trae título, H1 y canónica en el HTML`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator("h1")).toHaveText(h1);
      await expect(page).toHaveTitle(/Transarchivos/);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`^https://www\\.transarchivos\\.com${route === "/" ? "/$" : route + "$"}`));
      expect(await page.locator('script[type="application/ld+json"]').count()).toBeGreaterThan(0);
    });
  }
});

test("al navegar se actualizan título, descripción y canónica", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Ver servicio/ }).first().click();
  await expect(page).toHaveURL(/\/servicios\//);
  const slug = new URL(page.url()).pathname;
  await expect(page).toHaveTitle(/en Bogotá \| Transarchivos/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://www.transarchivos.com${slug}`);
  await expect(page.locator('head meta[name="description"]')).toHaveCount(1);
  await expect(page.locator('head title')).toHaveCount(1);
});
