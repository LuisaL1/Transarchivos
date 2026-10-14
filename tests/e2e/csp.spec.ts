import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

// Aplica las cabeceras de vercel.json (que `vite preview` no envía) y verifica
// que la Política de Seguridad de Contenido no bloquee nada del sitio.
const cfg = JSON.parse(readFileSync("vercel.json", "utf8"));
const pick = (src: string): Record<string, string> => Object.fromEntries(
  cfg.headers.find((h: { source: string }) => h.source === src).headers
    .filter((h: { key: string }) => h.key !== "Strict-Transport-Security")
    .map((h: { key: string; value: string }) => [h.key, h.key === "Content-Security-Policy" ? h.value.replace("; upgrade-insecure-requests", "") : h.value]),
);
// El sitio y la página aislada del chat con un asesor tienen cabeceras distintas
const site = pick("/((?!chat-asesor).*)");
const helper = pick("/chat-asesor.html");
const headersFor = (url: string) => (url.includes("/chat-asesor") ? helper : site);
const withHeaders = (page: import("@playwright/test").Page) => page.route("**/*", async r => {
  // Solo las páginas del sitio (los iframes de YouTube traen sus propias cabeceras)
  // fallback(): deja que otros interceptores (p. ej. el Zoho simulado) atiendan lo demás
  if (r.request().resourceType() !== "document" || !r.request().url().startsWith("http://localhost")) return r.fallback();
  const res = await r.fetch();
  await r.fulfill({ response: res, headers: { ...res.headers(), ...headersFor(r.request().url()) } });
});

for (const route of ["/", "/servicios/custodia-de-archivos", "/blog/mido-software-gestion-documental"]) {
  test(`CSP no bloquea recursos en ${route}`, async ({ page }) => {
    const blocked: string[] = [];
    page.on("console", m => { if (/Content Security Policy|Refused to/i.test(m.text())) blocked.push(m.text()); });
    await withHeaders(page);
    await page.goto(route);
    await page.mouse.wheel(0, 4000);
    await page.waitForTimeout(1500);
    expect(blocked).toEqual([]);
  });
}

test("CSP permite cargar el chat con un asesor (Zoho SalesIQ) en su página aislada", async ({ page, isMobile }) => {
  test.skip(isMobile, "Basta con revisarlo una vez");
  const blocked: string[] = [];
  page.on("console", m => { if (/Content Security Policy|Refused to/i.test(m.text())) blocked.push(m.text()); });
  let loaded = false;
  await page.route("https://salesiq.zohopublic.com/**", r => {
    // Script de Zoho simulado (no se carga el real en las pruebas)
    loaded = true;
    return r.fulfill({ contentType: "text/javascript", body: "window.$zoho.salesiq.floatwindow={visible(){}};window.$zoho.salesiq.ready();" });
  });
  await withHeaders(page);
  await page.route("**/api/advisor", r => r.fulfill({ json: { configured: false } }));
  await page.goto("/");
  await page.locator("[data-chat-launcher]").first().click();
  const chat = page.getByRole("region", { name: "Chat con Joel" });
  await chat.getByRole("button", { name: "Hablar con un asesor" }).click({ timeout: 10_000 });
  const input = chat.getByRole("textbox", { name: "Mensaje" });
  await input.fill("Hola");
  await input.press("Enter");
  await expect.poll(() => loaded, { timeout: 15_000 }).toBe(true);
  await page.waitForTimeout(500);
  expect(blocked).toEqual([]);
});
