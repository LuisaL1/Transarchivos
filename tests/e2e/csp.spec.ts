import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

// Aplica las cabeceras de vercel.json (que `vite preview` no envía) y verifica
// que la Política de Seguridad de Contenido no bloquee nada del sitio.
const cfg = JSON.parse(readFileSync("vercel.json", "utf8"));
const headers: Record<string, string> = Object.fromEntries(
  cfg.headers.find((h: { source: string }) => h.source === "/(.*)").headers
    .filter((h: { key: string }) => h.key !== "Strict-Transport-Security")
    .map((h: { key: string; value: string }) => [h.key, h.key === "Content-Security-Policy" ? h.value.replace("; upgrade-insecure-requests", "") : h.value]),
);

for (const route of ["/", "/servicios/custodia-de-archivos", "/blog/mido-software-gestion-documental"]) {
  test(`CSP no bloquea recursos en ${route}`, async ({ page }) => {
    const blocked: string[] = [];
    page.on("console", m => { if (/Content Security Policy|Refused to/i.test(m.text())) blocked.push(m.text()); });
    await page.route("**/*", async r => {
      if (r.request().resourceType() !== "document") return r.continue();
      const res = await r.fetch();
      await r.fulfill({ response: res, headers: { ...res.headers(), ...headers } });
    });
    await page.goto(route);
    await page.mouse.wheel(0, 4000);
    await page.waitForTimeout(1500);
    expect(blocked).toEqual([]);
  });
}
