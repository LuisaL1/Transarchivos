import { expect, test, type Page } from "@playwright/test";

// El widget de Zoho SalesIQ se carga en cada página: en las pruebas nunca el
// real: un script vacío (las que lo necesitan registran después su Zoho
// simulado, que tiene prioridad).
test.beforeEach(({ page }) => page.route("https://salesiq.zohopublic.com/**", r => r.fulfill({ contentType: "text/javascript", body: "" })));

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
  await page.getByRole("link", { name: /Custodia de archivos/ }).first().click();
  await expect(page).toHaveURL(/\/servicios\/custodia-de-archivos/);
  await expect(page.locator("h1")).toContainText("Custodia");
});

test("buscador encuentra un servicio sin tildes", async ({ page, isMobile }) => {
  test.skip(isMobile, "La lupa está en la barra de escritorio");
  await page.goto("/");
  await page.getByRole("button", { name: /Buscar/ }).first().click();
  await page.getByRole("dialog", { name: /Buscar/ }).locator("input").fill("digitalizacion");
  await expect(page.getByRole("dialog").getByText(/Digitalización de documentos/).first()).toBeVisible();
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
  await page.getByRole("link", { name: /Custodia de archivos/ }).first().click();
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

test("el cotizador exige la autorización de tratamiento de datos", async ({ page }) => {
  await page.route("**/api/ticket", r => r.fulfill({ json: { ok: true } }));
  await page.goto("/?servicio=diagnostico#cotizador");
  await page.locator("#cot-volume").fill("100 cajas");
  await page.getByRole("button", { name: /Continuar|Siguiente/ }).first().click();
  for (const [id, v] of [["cot-empresa", "Empresa"], ["cot-nombre", "Ana"], ["cot-cargo", "Gerente"], ["cot-email", "ana@empresa.com"], ["cot-telefono", "3000000000"]]) await page.locator(`#${id}`).fill(v);
  await page.locator("#cot-sector").selectOption({ index: 1 });
  await page.getByRole("button", { name: /^Enviar/ }).click();
  await expect(page.locator("#cot-autorizacion")).toBeVisible();
  expect(await page.locator("#cot-autorizacion").evaluate(el => (el as HTMLInputElement).validity.valueMissing)).toBe(true);
  await page.locator("#cot-autorizacion").check();
  await page.getByRole("button", { name: /^Enviar/ }).click();
  await expect(page.locator("#cot-autorizacion")).toHaveCount(0);
});

test("formulario de contacto: se abre desde soporte, exige autorización y envía", async ({ page, isMobile }) => {
  test.skip(isMobile, "El ícono de soporte está en la barra de escritorio");
  let sent: Record<string, unknown> | null = null;
  await page.route("**/api/contact", async r => { sent = r.request().postDataJSON(); await r.fulfill({ json: { ok: true } }); });
  await page.goto("/");
  await page.getByRole("button", { name: /Contacto directo/ }).first().click();
  await page.locator("[data-support-popover]").getByRole("link", { name: /Escríbanos Formulario/ }).click();
  const dlg = page.getByRole("dialog", { name: "Escríbanos" });
  await expect(dlg).toBeVisible();
  await dlg.locator("#ct-nombre").fill("Ana Prueba");
  await dlg.locator("#ct-email").fill("ana@empresa.com");
  await dlg.locator("#ct-mensaje").fill("Quisiera información.");
  await dlg.getByRole("button", { name: /Enviar mensaje/ }).click();
  expect(await dlg.locator("#ct-autorizacion").evaluate(el => (el as HTMLInputElement).validity.valueMissing)).toBe(true);
  await dlg.locator("#ct-autorizacion").check();
  await dlg.getByRole("button", { name: /Enviar mensaje/ }).click();
  await expect(dlg.getByText("¡Mensaje enviado!")).toBeVisible();
  expect(sent).toMatchObject({ kind: "contacto", replyTo: { email: "ana@empresa.com" } });
});

test("cotizador: «Enviar» crea el ticket en Zoho Desk y el resumen pasa de «Enviando…» a «Enviado»", async ({ page }) => {
  let sent: { subject?: string; contact?: { email?: string }; fields?: Record<string, string> } | null = null;
  let release!: () => void;
  const answered = new Promise<void>(r => { release = r; });
  // El ticket responde solo cuando la prueba ya vio «Enviando…»
  await page.route("**/api/ticket", async r => { sent = r.request().postDataJSON(); await answered; await r.fulfill({ json: { ok: true } }); });
  await page.goto("/?servicio=diagnostico#cotizador");
  await page.locator("#cot-volume").fill("100 cajas");
  await page.getByRole("button", { name: /Continuar/ }).first().click();
  for (const [id, v] of [["cot-empresa", "Empresa"], ["cot-nombre", "Ana"], ["cot-cargo", "Gerente"], ["cot-email", "ana@empresa.com"], ["cot-telefono", "3000000000"]]) await page.locator(`#${id}`).fill(v);
  await page.locator("#cot-sector").selectOption({ index: 1 });
  await page.locator("#cot-autorizacion").check();
  await page.getByRole("button", { name: /^Enviar/ }).click();
  await expect(page.getByText("Resumen de su solicitud")).toBeVisible();
  await expect(page.getByText("Enviando…")).toBeVisible();
  release();
  await expect(page.getByText("Enviado", { exact: true })).toBeVisible();
  await expect(page.getByText(/Recibimos su solicitud/)).toBeVisible();
  // Ya no se ofrece enviar por correo ni por WhatsApp
  await expect(page.getByRole("link", { name: /Enviar por WhatsApp/ })).toHaveCount(0);
  expect(sent!.subject).toMatch(/^Solicitud de cotización/);
  expect(sent!.contact!.email).toBe("ana@empresa.com");
  expect(sent!.fields!["Autorización de datos"]).toBe("Sí");
});

test("cotizador: si el ticket falla, avisa y permite reintentar", async ({ page }) => {
  let calls = 0;
  await page.route("**/api/ticket", r => { calls++; return r.fulfill(calls === 1 ? { status: 502, json: { ok: false, error: "provider" } } : { json: { ok: true } }); });
  await page.goto("/?servicio=diagnostico#cotizador");
  await page.locator("#cot-volume").fill("100 cajas");
  await page.getByRole("button", { name: /Continuar/ }).first().click();
  for (const [id, v] of [["cot-empresa", "Empresa"], ["cot-nombre", "Ana"], ["cot-cargo", "Gerente"], ["cot-email", "ana@empresa.com"], ["cot-telefono", "3000000000"]]) await page.locator(`#${id}`).fill(v);
  await page.locator("#cot-sector").selectOption({ index: 1 });
  await page.locator("#cot-autorizacion").check();
  await page.getByRole("button", { name: /^Enviar/ }).click();
  await expect(page.getByRole("alert")).toContainText("No pudimos enviar la solicitud");
  await page.getByRole("button", { name: /Reintentar/ }).click();
  await expect(page.getByText("Enviado", { exact: true })).toBeVisible();
  expect(calls).toBe(2);
});

test("suscripción al blog: exige autorización y envía", async ({ page }) => {
  let sent: { kind?: string } | null = null;
  await page.route("**/api/contact", async r => { sent = r.request().postDataJSON(); await r.fulfill({ json: { ok: true } }); });
  await page.goto("/#blog");
  await page.getByPlaceholder("su@correo.com").fill("ana@empresa.com");
  await page.locator("#sub-autorizacion").check();
  await page.getByRole("button", { name: "Suscribirme" }).click();
  await expect(page.getByText(/Le enviamos la confirmación/)).toBeVisible();
  expect(sent!.kind).toBe("suscripcion");
});

test("privacidad: el botón de cookies siempre responde (sin analítica explica que no hay cookies)", async ({ page }) => {
  await page.goto("/privacidad");
  const gaId = await page.evaluate(() => (document.querySelector('script[src*="googletagmanager.com/gtag/js"]') as HTMLScriptElement | null)?.src);
  test.skip(!!gaId, "Build con Google Analytics: lo cubre analytics.spec.ts");
  await page.getByRole("button", { name: /Cambiar mi decisión sobre cookies/ }).click();
  await expect(page.getByRole("status")).toContainText(/no tiene activas cookies/);
});

// ─── Chat: widget de Zoho SalesIQ ───────────────────────────────────────────
// El chat es el widget de Zoho (botón flotante y ventana), dentro de la página
// aislada public/chat-asesor.html. Zoho simulado: nunca se carga el script
// real. Imita la API que usa src/lib/crmChat.ts y deja registro en
// window.__zoho (de la página aislada).
const ZOHO_STUB = `(() => {
  const z = window.$zoho.salesiq, log = (window.__zoho = { calls: [] }), cb = {};
  z.language = (l) => log.calls.push("language:" + l);
  z.floatbutton = { visible: (v) => log.calls.push("button:" + v) };
  z.floatwindow = {
    visible: (v) => { log.calls.push("window:" + v); if (v === "show") cb.open && cb.open(); if (v === "hide") cb.close && cb.close(); },
    open: (f) => (cb.open = f), close: (f) => (cb.close = f), minimize: (f) => (cb.min = f),
  };
  setTimeout(() => z.ready && z.ready(), 50);
})();`;

async function mockZoho(page: Page) {
  const requests: string[] = [];
  await page.route("https://salesiq.zohopublic.com/**", r => { requests.push(r.request().url()); return r.fulfill({ contentType: "text/javascript", body: ZOHO_STUB }); });
  return requests;
}
// Registro del Zoho simulado, dentro de la página aislada
const zohoLog = (page: Page) => page.evaluate(() => ((document.getElementById("ta-zoho-frame") as HTMLIFrameElement | null)?.contentWindow as unknown as { __zoho?: { calls: string[] } } | null)?.__zoho);

test("el widget de Zoho SalesIQ se carga al entrar, en español y sin su botón (se usa el de Joel)", async ({ page }) => {
  const requests = await mockZoho(page);
  await page.goto("/");
  await expect.poll(() => requests.length, { timeout: 15_000 }).toBe(1);
  await expect.poll(async () => (await zohoLog(page))?.calls ?? []).toEqual(["language:es", "button:hide"]);
  await expect(page.locator("html")).toHaveClass(/ta-zoho-ready/);
  // Con la ventana cerrada, el iframe espera fuera de la pantalla y se ve el botón de Joel
  const box = await page.locator("#ta-zoho-frame").boundingBox();
  expect(box!.x + box!.width).toBeLessThan(0);
  await expect(page.locator("html")).not.toHaveClass(/ta-zoho-open/);
  await expect(page.getByRole("button", { name: "Hablar con Joel, asesor virtual" })).toBeVisible();
});

test("«Chatee con Joel» abre la ventana del widget de Zoho", async ({ page }) => {
  await mockZoho(page);
  await page.goto("/");
  const banner = page.getByRole("dialog", { name: "Aviso de cookies" });
  if (await banner.isVisible()) await banner.getByRole("button", { name: "Rechazar" }).click();
  await expect(page.locator("html")).toHaveClass(/ta-zoho-ready/, { timeout: 15_000 });
  await page.getByRole("button", { name: "Chatee con Joel" }).click();
  await expect.poll(async () => (await zohoLog(page))?.calls ?? []).toContain("window:show");
  await expect(page.locator("html")).toHaveClass(/ta-zoho-open/);
});

test("el botón de Joel abre y cierra la ventana del widget de Zoho", async ({ page, isMobile }) => {
  await mockZoho(page);
  await page.goto("/");
  const banner = page.getByRole("dialog", { name: "Aviso de cookies" });
  if (await banner.isVisible()) await banner.getByRole("button", { name: "Rechazar" }).click();
  await expect(page.locator("html")).toHaveClass(/ta-zoho-ready/, { timeout: 15_000 });
  await page.getByRole("button", { name: "Hablar con Joel, asesor virtual" }).click();
  await expect(page.locator("html")).toHaveClass(/ta-zoho-open/);
  await expect(page.locator("#ta-zoho-frame")).toBeInViewport();
  // En celular la ventana ocupa la pantalla y se cierra desde la de Zoho
  test.skip(isMobile, "En celular el botón se esconde con la ventana abierta");
  await page.getByRole("button", { name: "Cerrar chat" }).click();
  await expect.poll(async () => (await zohoLog(page))?.calls ?? []).toContain("window:hide");
  await expect(page.locator("html")).not.toHaveClass(/ta-zoho-open/);
});

test("al abrir otra página desde el pie, se muestra desde arriba", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(1500);
  await page.locator("footer").getByRole("link", { name: /Da play al conocimiento/ }).click();
  await expect(page).toHaveURL(/\/videos/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(5);
});
