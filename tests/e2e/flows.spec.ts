import { expect, test, type Locator, type Page } from "@playwright/test";

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
  await page.goto("/?servicio=diagnostico#cotizador");
  await page.locator("#cot-volume").fill("100 cajas");
  await page.getByRole("button", { name: /Continuar|Siguiente/ }).first().click();
  for (const [id, v] of [["cot-empresa", "Empresa"], ["cot-nombre", "Ana"], ["cot-cargo", "Gerente"], ["cot-email", "ana@empresa.com"], ["cot-telefono", "3000000000"]]) await page.locator(`#${id}`).fill(v);
  await page.locator("#cot-sector").selectOption({ index: 1 });
  await page.getByRole("button", { name: /Ver resumen/ }).click();
  await expect(page.locator("#cot-autorizacion")).toBeVisible();
  expect(await page.locator("#cot-autorizacion").evaluate(el => (el as HTMLInputElement).validity.valueMissing)).toBe(true);
  await page.locator("#cot-autorizacion").check();
  await page.getByRole("button", { name: /Ver resumen/ }).click();
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

test("cotizador: envía la solicitud directamente", async ({ page }) => {
  let sent: { kind?: string; fields?: Record<string, string> } | null = null;
  await page.route("**/api/contact", async r => { sent = r.request().postDataJSON(); await r.fulfill({ json: { ok: true } }); });
  await page.goto("/?servicio=diagnostico#cotizador");
  await page.locator("#cot-volume").fill("100 cajas");
  await page.getByRole("button", { name: /Continuar/ }).first().click();
  for (const [id, v] of [["cot-empresa", "Empresa"], ["cot-nombre", "Ana"], ["cot-cargo", "Gerente"], ["cot-email", "ana@empresa.com"], ["cot-telefono", "3000000000"]]) await page.locator(`#${id}`).fill(v);
  await page.locator("#cot-sector").selectOption({ index: 1 });
  await page.locator("#cot-autorizacion").check();
  await page.getByRole("button", { name: /Ver resumen/ }).click();
  await expect(page.getByRole("link", { name: /Enviar por WhatsApp/ })).toHaveAttribute("href", /wa.me\/573243586973\?text=.*Programa|wa.me\/573243586973\?text=/);
  await page.getByRole("button", { name: /Enviar por correo/ }).click();
  await expect(page.getByText(/Recibimos su solicitud/)).toBeVisible();
  expect(sent!.kind).toBe("cotizacion");
  expect(sent!.fields!["Autorización de datos"]).toBe("Sí");
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

// ─── Chat con un asesor (Zoho SalesIQ) ──────────────────────────────────────
// Zoho simulado: nunca se carga el script real. Imita la API que usa
// src/lib/crmChat.ts y deja registro en window.__zoho (de la página aislada
// public/chat-asesor.html, donde corre el widget).
const ZOHO_STUB = `(() => {
  const z = window.$zoho.salesiq, log = (window.__zoho = { calls: [], sent: [] }), cb = {};
  z.language = (l) => log.calls.push("language:" + l);
  z.floatbutton = { visible: (v) => log.calls.push("button:" + v) };
  z.floatwindow = {
    visible: (v) => { log.calls.push("window:" + v); if (v === "show") cb.open && cb.open(); if (v === "hide") cb.close && cb.close(); },
    open: (f) => (cb.open = f), close: (f) => (cb.close = f), minimize: (f) => (cb.min = f),
  };
  // Ventana de Zoho falsa (iframe del mismo origen, como la real): inicio con
  // "Chatee con nosotros ahora"; al escribir, responde una asesora de prueba.
  const f = document.createElement("iframe"); f.id = "siq_chatwindow"; document.body.appendChild(f);
  const d = f.contentDocument;
  d.body.innerHTML = '<div class="home-icon-optns"><em class="siqico-chat-start"></em>Chatee con nosotros ahora</div><div id="scroll-container"></div>';
  d.querySelector(".home-icon-optns").addEventListener("click", () => {
    const ta = d.createElement("textarea"); ta.className = "siqcw-textarea"; d.body.appendChild(ta);
    ta.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      log.sent.push(ta.value);
      const v = d.createElement("div"); v.setAttribute("data-zsqa", "visitor_msg message_bubble");
      v.innerHTML = '<span data-zsqa="msg"></span>'; v.firstChild.textContent = ta.value;
      d.getElementById("scroll-container").appendChild(v);
      if (log.sent.length > 1) return;
      setTimeout(() => {
        const g = d.createElement("div"); g.className = "siqcw-agentmsg-grp";
        g.innerHTML = '<div class="siqcw-name-div">Laura</div><div class="chat-bubble-cont" id="a1" data-zsqa="agent_msg message_bubble"><span data-zsqa="msg">¡Hola! Soy Laura. ¿En qué le ayudo?</span><div class="tag-div">Custodia de archivos</div></div>';
        d.getElementById("scroll-container").appendChild(g);
      }, 300);
    });
  });
  setTimeout(() => z.ready && z.ready(), 50);
})();`;

async function mockZoho(page: Page) {
  const requests: string[] = [];
  await page.route("https://salesiq.zohopublic.com/**", r => { requests.push(r.request().url()); return r.fulfill({ contentType: "text/javascript", body: ZOHO_STUB }); });
  return requests;
}
// Registro del Zoho simulado, dentro de la página aislada
const zohoLog = (page: Page) => page.evaluate(() => ((document.getElementById("ta-zoho-frame") as HTMLIFrameElement | null)?.contentWindow as unknown as { __zoho?: { calls: string[]; sent: string[] } } | null)?.__zoho);
async function openJoel(page: Page) {
  await page.goto("/");
  const banner = page.getByRole("dialog", { name: "Aviso de cookies" });
  if (await banner.isVisible()) await banner.getByRole("button", { name: "Rechazar" }).click();
  await page.locator("[data-chat-launcher]").first().click();
  const chat = page.getByRole("region", { name: "Chat con Joel" });
  await expect(chat).toBeVisible();
  return chat;
}
// Escribe y envía cuando Joel terminó de "escribir" (mientras tanto el envío se descarta)
const sendText = async (chat: Locator, text: string) => {
  const input = chat.getByRole("textbox", { name: "Mensaje" });
  await input.fill(text);
  await expect(chat.getByRole("button", { name: "Enviar" })).toBeEnabled({ timeout: 10_000 });
  await input.press("Enter");
};

test("sin API, el chat con un asesor va por el puente con Zoho, dentro de Joel", async ({ page }) => {
  await page.route("**/api/advisor", r => r.fulfill({ json: { configured: false } }));
  const requests = await mockZoho(page);
  const chat = await openJoel(page);
  // Joel funciona sin cargar Zoho
  expect(requests).toEqual([]);
  // "Hablar con un asesor" conecta de una vez, sin explicaciones ni la plataforma
  await chat.getByRole("button", { name: "Hablar con un asesor" }).click({ timeout: 10_000 });
  await expect(chat.getByText(/Le conecto con un asesor/)).toBeVisible({ timeout: 10_000 });
  await expect(chat.getByText("Chat con un asesor de Transarchivos")).toBeVisible();
  await expect(chat).not.toContainText(/Zoho/);
  expect(requests).toEqual([]);
  // La pregunta abre la conversación en el Zoho escondido
  await sendText(chat, "Quiero cotizar custodia de archivos");
  await expect.poll(() => requests.length).toBe(1);
  await expect.poll(async () => (await zohoLog(page))?.sent).toEqual(["Quiero cotizar custodia de archivos"]);
  expect((await zohoLog(page))?.calls).toEqual(expect.arrayContaining(["language:es", "button:hide"]));
  await expect(chat.getByText(/un asesor le responderá aquí/)).toBeVisible();
  // Zoho trabaja en la página aislada, escondida; Joel sigue a la vista
  await expect(page.locator("#ta-zoho-frame")).toBeAttached();
  await expect(page.locator("html")).not.toHaveClass(/ta-zoho-open/);
  await expect(chat).toBeVisible();
  // La respuesta de Zoho aparece en Joel, con el nombre y sus opciones
  await expect(chat.getByText("¡Hola! Soy Laura. ¿En qué le ayudo?")).toBeVisible({ timeout: 10_000 });
  await expect(chat.getByText("Laura", { exact: true })).toBeVisible();
  await chat.getByRole("button", { name: "Custodia de archivos" }).click();
  // Lo que el visitante escribe después va a Zoho
  await sendText(chat, "Tenemos 300 cajas");
  await expect.poll(async () => (await zohoLog(page))?.sent.at(-1)).toBe("Tenemos 300 cajas");
  // Volver con Joel termina el puente (la ventana de Zoho no se muestra)
  await chat.getByRole("button", { name: "Volver con Joel" }).click();
  await expect(chat.getByText(/Volvió conmigo/)).toBeVisible();
  await expect(chat.getByText("Chat con un asesor de Transarchivos")).toBeHidden();
  await expect(page.locator("html")).not.toHaveClass(/ta-zoho-open/);
});

test("escribir que se quiere un asesor conecta de una vez (sin pasos intermedios)", async ({ page }) => {
  await page.route("**/api/advisor", r => r.fulfill({ json: { configured: false } }));
  await mockZoho(page);
  const chat = await openJoel(page);
  await sendText(chat, "quiero hablar con un asesor");
  await expect(chat.getByText(/Le conecto con un asesor/)).toBeVisible({ timeout: 10_000 });
  await expect(chat.getByRole("textbox", { name: "Mensaje" })).toHaveAttribute("placeholder", /mensaje al asesor/);
});

test("al terminar una cotización con Joel, llega al chat de los asesores para seguimiento", async ({ page }) => {
  await page.route("**/api/advisor", r => r.fulfill({ json: { configured: false } }));
  const requests = await mockZoho(page);
  const chat = await openJoel(page);
  await chat.getByRole("button", { name: "Cotizar un servicio" }).click({ timeout: 10_000 });
  await chat.getByRole("button", { name: "Custodia de archivos" }).click({ timeout: 10_000 });
  await chat.getByRole("button", { name: "Entre 100 y 1.000 cajas" }).click({ timeout: 10_000 });
  await chat.getByRole("button", { name: "Urgente" }).click({ timeout: 10_000 });
  await expect(chat.getByText(/¿Cuál es su nombre\?/)).toBeVisible({ timeout: 10_000 });
  await sendText(chat, "Luisa");
  await expect(chat.getByText(/¿De qué empresa nos escribe\?/)).toBeVisible({ timeout: 10_000 });
  await sendText(chat, "Acme S.A.S.");
  await expect(chat.getByText(/¿A qué número de celular o WhatsApp/)).toBeVisible({ timeout: 10_000 });
  await sendText(chat, "123");
  await expect(chat.getByText(/Ese número no parece completo/)).toBeVisible({ timeout: 10_000 });
  await sendText(chat, "300 123 4567");
  await expect(chat.getByText(/Este es el resumen de su solicitud/)).toBeVisible({ timeout: 10_000 });
  // Nada se envía hasta que la persona elige "Enviar a un asesor"
  await page.waitForTimeout(1000);
  expect(requests).toEqual([]);
  await chat.getByRole("button", { name: "Enviar a un asesor" }).click({ timeout: 10_000 });
  // Joel envía la cotización al chat de los asesores (Zoho escondido)
  await expect.poll(() => requests.length, { timeout: 15_000 }).toBe(1);
  await expect.poll(async () => (await zohoLog(page))?.sent[0] ?? "", { timeout: 15_000 }).toContain("NUEVA COTIZACIÓN para seguimiento");
  const msg = (await zohoLog(page))!.sent[0];
  expect(msg).toContain("Cliente: Luisa");
  expect(msg).toContain("Celular / WhatsApp: 300 123 4567");
  expect(msg).toContain("• Servicio: Custodia de archivos");
  expect(msg).toContain("• Empresa: Acme S.A.S.");
  // Solo dice "Listo" cuando Zoho confirmó la recepción
  await expect(chat.getByText(/Le contactará al 300 123 4567/)).toBeVisible();
  // La ventana queda escuchando: la respuesta del asesor aparece en Joel
  await expect(chat.getByText("¡Hola! Soy Laura. ¿En qué le ayudo?")).toBeVisible({ timeout: 10_000 });
  await expect(page.locator("html")).not.toHaveClass(/ta-zoho-open/);
  // Una cotización se envía una sola vez
  await chat.getByRole("button", { name: "Enviar a un asesor" }).click();
  await page.waitForTimeout(800);
  expect((await zohoLog(page))!.sent.filter(s => s.includes("NUEVA COTIZACIÓN"))).toHaveLength(1);
});

test("si el chat con un asesor no carga, Joel ofrece WhatsApp y el formulario", async ({ page }) => {
  await page.route("**/api/advisor", r => r.fulfill({ json: { configured: false } }));
  await page.route("https://salesiq.zohopublic.com/**", r => r.abort());
  const chat = await openJoel(page);
  await chat.getByRole("button", { name: "Hablar con un asesor" }).click({ timeout: 10_000 });
  await sendText(chat, "Hola");
  await expect(chat.getByText("No pudimos abrir el chat con un asesor")).toBeVisible({ timeout: 20_000 });
  await expect(chat.getByRole("link", { name: /Escribir por WhatsApp/ }).last()).toHaveAttribute("href", /wa\.me/);
  await chat.getByRole("link", { name: /Dejar un mensaje/ }).click();
  await expect(page.getByRole("dialog", { name: "Escríbanos" })).toBeVisible();
});

test("chat con un asesor por la API: se escribe y se responde dentro de Joel, sin cargar Zoho", async ({ page }) => {
  const calls: { action?: string; question?: string; text?: string }[] = [];
  let polls = 0;
  await page.route("**/api/advisor", async r => {
    if (r.request().method() === "GET") return r.fulfill({ json: { configured: true } });
    const b = r.request().postDataJSON();
    calls.push(b);
    if (b.action === "start") return r.fulfill({ json: { ok: true, token: "pase.prueba" } });
    if (b.action === "poll" && ++polls === 2)
      return r.fulfill({ json: { ok: true, messages: [
        { id: "1", seq: 1, from: "system", name: "Laura", text: "joined", time: 1 },
        { id: "2", seq: 2, from: "operator", name: "Laura", text: "¡Hola! ¿En qué le ayudo?", time: 2 },
      ] } });
    return r.fulfill({ json: { ok: true, messages: [] } });
  });
  let zoho = 0;
  await page.route("https://salesiq.zohopublic.com/**", r => (zoho++, r.abort()));
  const chat = await openJoel(page);
  await chat.getByRole("button", { name: "Hablar con un asesor" }).click({ timeout: 10_000 });
  await expect(chat.getByText(/Le conecto con un asesor/)).toBeVisible({ timeout: 10_000 });
  await sendText(chat, "Quiero cotizar la custodia de 500 cajas");
  await expect(chat.getByText(/un asesor le responderá aquí/)).toBeVisible();
  expect(calls.find(c => c.action === "start")?.question).toBe("Quiero cotizar la custodia de 500 cajas");
  await expect(chat.getByText("Laura se unió a la conversación.")).toBeVisible({ timeout: 15_000 });
  await expect(chat.getByText("¡Hola! ¿En qué le ayudo?")).toBeVisible();
  await sendText(chat, "Somos una empresa de Bogotá");
  await expect.poll(() => calls.find(c => c.action === "send")?.text).toBe("Somos una empresa de Bogotá");
  expect(zoho).toBe(0);
  await chat.getByRole("button", { name: "Volver con Joel" }).click();
  await expect(chat.getByText(/Volvió conmigo/)).toBeVisible();
});
