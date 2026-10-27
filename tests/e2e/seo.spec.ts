import { expect, test } from "@playwright/test";

// SEO en el navegador: contenido sin JavaScript (lo que ve un rastreador
// simple o una red social) y etiquetas que se actualizan al navegar.
test.describe("sin JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  for (const [route, h1] of [["/", /Protegemos la memoria/], ["/nosotros", /Pioneros/], ["/servicios/custodia-de-archivos", /Custodia de archivos/], ["/blog/mido-software-gestion-documental", /Mido/], ["/en", /We protect your company/], ["/en/services/records-storage", /Records storage/]] as const) {
    test(`${route} trae título, H1 y canónica en el HTML`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator("h1")).toHaveText(h1);
      await expect(page).toHaveTitle(/Transarchivos/);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`^https://www\\.transarchivos\\.com${route === "/" ? "/$" : route + "$"}`));
      expect(await page.locator('script[type="application/ld+json"]').count()).toBeGreaterThan(0);
      // Cada página enlaza su versión en el otro idioma (hreflang) y declara su idioma
      await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute("href", /\/en/);
      await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveCount(1);
      await expect(page.locator("html")).toHaveAttribute("lang", route.startsWith("/en") ? "en-US" : "es-CO");
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
