import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Google Analytics se descarga cuando la página ya cargó y el navegador está
// libre, no al arrancar; los eventos previos quedan en dataLayer.
const gaScripts = () => document.querySelectorAll('script[src*="googletagmanager.com"]');

async function cargar() {
  vi.resetModules();
  return import("@/lib/analytics");
}

describe("carga diferida de Google Analytics", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubEnv("VITE_GA_MEASUREMENT_ID", "G-TEST123");
    document.head.innerHTML = "";
    delete window.dataLayer; delete window.gtag; delete window.requestIdleCallback;
  });
  afterEach(() => { vi.useRealTimers(); vi.unstubAllEnvs(); vi.restoreAllMocks(); });

  it("con la página ya cargada, espera un momento antes de pedir el script", async () => {
    const { initAnalytics, trackPageView } = await cargar();
    initAnalytics();
    trackPageView("/");
    expect(gaScripts()).toHaveLength(0);
    expect(window.dataLayer?.length).toBeGreaterThanOrEqual(3); // consent, js, config, page_view
    vi.advanceTimersByTime(2100);
    expect(gaScripts()).toHaveLength(1);
    expect((gaScripts()[0] as HTMLScriptElement).src).toContain("id=G-TEST123");
  });

  it("usa requestIdleCallback cuando existe y carga el script una sola vez", async () => {
    const idle = vi.fn((cb: () => void) => { cb(); return 1; });
    window.requestIdleCallback = idle as unknown as typeof window.requestIdleCallback;
    const { initAnalytics } = await cargar();
    initAnalytics(); initAnalytics();
    expect(idle).toHaveBeenCalledTimes(1);
    expect(gaScripts()).toHaveLength(1);
  });

  it("si la página sigue cargando, espera al evento load", async () => {
    vi.spyOn(document, "readyState", "get").mockReturnValue("loading");
    const { initAnalytics } = await cargar();
    initAnalytics();
    vi.advanceTimersByTime(5000);
    expect(gaScripts()).toHaveLength(0);
    window.dispatchEvent(new Event("load"));
    vi.advanceTimersByTime(2100);
    expect(gaScripts()).toHaveLength(1);
  });

  it("sin identificador no carga nada", async () => {
    vi.stubEnv("VITE_GA_MEASUREMENT_ID", "");
    const { initAnalytics } = await cargar();
    initAnalytics();
    vi.advanceTimersByTime(5000);
    expect(gaScripts()).toHaveLength(0);
  });
});
