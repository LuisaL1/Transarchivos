import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { HOST_ID, SALESIQ_SRC, loadCrmChat, openCrmChat, resetCrmChatForTests, setZohoHostForTests, styleChatWindow } from "@/lib/crmChat";
import { CRM_CHAT_EVENT } from "@/lib/advisorEvents";

// Cargador del chat de Zoho SalesIQ (sin cargar el script real). En el sitio,
// Zoho vive en una página aislada (iframe); aquí esa página es la ventana de
// prueba (jsdom no carga iframes).
beforeEach(() => setZohoHostForTests(window));
afterEach(() => {
  resetCrmChatForTests();
  document.getElementById("zsiqscript")?.remove();
  delete window.$zoho;
  document.getElementById("siq_chatwindow")?.remove();
});

// Simula lo que hace el script de Zoho al cargar: completa la API y llama a ready()
function zohoLoads() {
  const calls: string[] = [];
  const z = window.$zoho!.salesiq!;
  Object.assign(z, {
    language: (l: string) => calls.push(`language:${l}`),
    floatbutton: { visible: (v: string) => calls.push(`button:${v}`) },
    floatwindow: { visible: (v: string) => calls.push(`window:${v}`), open: () => {}, close: () => {}, minimize: () => {} },
  });
  z.ready!();
  return calls;
}

describe("chat de Zoho SalesIQ", () => {
  it("no hace nada hasta que se pide abrir el chat", () => {
    expect(document.getElementById("zsiqscript")).toBeNull();
    expect(window.$zoho).toBeUndefined();
    expect(document.getElementById(HOST_ID)).toBeNull();
  });

  it("carga el script una sola vez, en español y sin el botón de Zoho", async () => {
    const p = loadCrmChat();
    expect(loadCrmChat()).toBe(p);
    await Promise.resolve();
    await Promise.resolve();
    const s = document.getElementById("zsiqscript") as HTMLScriptElement;
    expect(s.src).toBe(SALESIQ_SRC);
    expect(document.querySelectorAll("#zsiqscript")).toHaveLength(1);
    const calls = zohoLoads();
    await p;
    expect(calls).toEqual(["language:es", "button:hide"]);
  });

  it("abre la ventana y avisa al sitio", async () => {
    const events: boolean[] = [];
    const on = (e: Event) => events.push((e as CustomEvent<{ open: boolean }>).detail.open);
    window.addEventListener(CRM_CHAT_EVENT, on);
    const p = openCrmChat();
    await Promise.resolve();
    await Promise.resolve();
    const calls = zohoLoads();
    await p;
    expect(calls).toContain("window:show");
    expect(events).toEqual([true]);
    expect(document.documentElement.classList.contains("ta-zoho-open")).toBe(true);
    window.removeEventListener(CRM_CHAT_EVENT, on);
    document.documentElement.classList.remove("ta-zoho-open");
  });

  it("si el script no carga, falla y permite reintentar", async () => {
    const p = loadCrmChat();
    await Promise.resolve();
    await Promise.resolve();
    document.getElementById("zsiqscript")!.dispatchEvent(new Event("error"));
    await expect(p).rejects.toThrow("load");
    expect(document.getElementById("zsiqscript")).toBeNull();
    expect(loadCrmChat()).not.toBe(p);
  });

  it("si Zoho no responde a tiempo, falla", async () => {
    vi.useFakeTimers();
    const p = loadCrmChat();
    await vi.advanceTimersByTimeAsync(15_000);
    await expect(p).rejects.toThrow("timeout");
    vi.useRealTimers();
  });
});

describe("chat de Zoho SalesIQ · diseño del sitio", () => {
  it("aplica los estilos del sitio dentro de la ventana de Zoho, una sola vez", () => {
    expect(styleChatWindow()).toBe(false); // todavía no existe la ventana
    const frame = document.createElement("iframe");
    frame.id = "siq_chatwindow";
    document.body.appendChild(frame);
    expect(styleChatWindow()).toBe(true);
    styleChatWindow();
    expect(frame.contentDocument!.querySelectorAll("#ta-chat-style")).toHaveLength(1);
  });

  it("la hoja de estilos usa la marca: índigo, cuadrado amarillo girado, sin degradados y la foto de Joel", () => {
    // Vitest no procesa CSS (css: false): se revisa el archivo directamente
    const css = readFileSync("src/styles/zoho-chat.css", "utf8");
    expect(css).toContain("--siqcw-custom-bg-color: #1800ad");
    expect(css).toContain("rgba(255, 222, 89, 0.22)");
    expect(css).toContain("rotate(45deg)");
    expect(css).not.toMatch(/#356b58|#272b7c|#ff7619/i);
    expect(css).not.toMatch(/linear-gradient/);
    expect(css).toMatch(/\.siqcw-bot-logo \{[^}]*url\("\/brand\/joel\.webp"\)/);
    expect(existsSync("public/brand/joel.webp")).toBe(true);
    expect(readFileSync("public/chat-asesor.html", "utf8")).toMatch(/noindex/);
  });
});
