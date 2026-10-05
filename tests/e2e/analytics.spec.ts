import { expect, test } from "@playwright/test";

// Google Analytics 4 con Consent Mode v2. Se ejecuta con `pnpm test:ga`
// (compila con VITE_GA_MEASUREMENT_ID); en `pnpm test:e2e` se omite.
test("GA4: respeta el consentimiento y envía datos al aceptar", async ({ page }) => {
  const hits: string[] = [];
  page.on("request", r => { if (/google-analytics\.com\/(g\/)?collect/.test(r.url())) hits.push(r.url()); });
  await page.goto("/");
  const gaId = await page.evaluate(() => (document.querySelector('script[src*="googletagmanager.com/gtag/js"]') as HTMLScriptElement | null)?.src.split("id=")[1]);
  test.skip(!gaId, "Build sin VITE_GA_MEASUREMENT_ID");

  // Antes de decidir: aviso visible y almacenamiento analítico denegado.
  const banner = page.getByRole("dialog", { name: "Aviso de cookies" });
  await expect(banner).toBeVisible();
  const consentDefault = await page.evaluate(() => JSON.stringify((window.dataLayer ?? []).find(e => (e as unknown[])[0] === "consent")));
  expect(consentDefault).toContain('"analytics_storage":"denied"');
  expect(await page.evaluate(() => document.cookie)).not.toMatch(/_ga=/);

  // Al aceptar: se actualiza el consentimiento, se crean cookies y se envían datos.
  await banner.getByRole("button", { name: "Aceptar" }).click();
  await expect(banner).toBeHidden();
  await page.getByRole("link", { name: /Ver servicio/ }).first().click();
  await expect.poll(() => page.evaluate(() => document.cookie), { timeout: 15_000 }).toMatch(/_ga=/);
  await expect.poll(() => hits.length, { timeout: 15_000 }).toBeGreaterThan(0);
  expect(hits.some(u => u.includes(`tid=${gaId}`))).toBe(true);
});
