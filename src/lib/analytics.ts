// ─── Google Analytics 4 ─────────────────────────────────────────────────────
// Se activa solo si existe la variable de entorno VITE_GA_MEASUREMENT_ID
// (formato G-XXXXXXXXXX). Sin ella el sitio funciona igual y no se carga nada.
//
// · Es una SPA: las páginas vistas se envían a mano en cada cambio de ruta
//   (send_page_view: false), si no GA solo contaría la primera página.
// · Consent Mode v2: por defecto las cookies analíticas están DENEGADAS hasta
//   que el visitante acepta en el aviso de cookies (Ley 1581 de 2012). Mientras
//   tanto GA recibe solo señales sin cookies (modelado de conversiones).
// · Eventos clave: solicitud de cotización, clics en teléfono/correo, apertura
//   del chat, preguntas a Joel y búsquedas (ver trackEvent en el código).

type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window { dataLayer?: unknown[]; gtag?: Gtag }
}

const RAW_ID = (import.meta.env.VITE_GA_MEASUREMENT_ID ?? "").trim();
export const GA_ID = /^G-[A-Z0-9]+$/i.test(RAW_ID) ? RAW_ID.toUpperCase() : "";
export const analyticsEnabled = GA_ID !== "";

const CONSENT_KEY = "ta-analytics-consent";
export type Consent = "granted" | "denied" | null;

export function getConsent(): Consent {
  try { const v = localStorage.getItem(CONSENT_KEY); return v === "granted" || v === "denied" ? v : null; } catch { return null; }
}

let started = false;
function gtag(...args: unknown[]) {
  if (!analyticsEnabled || typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  // gtag necesita recibir el objeto "arguments", no un arreglo.
  // eslint-disable-next-line prefer-rest-params
  window.gtag = window.gtag || function () { window.dataLayer!.push(arguments); };
  window.gtag(...args);
}

/** Carga GA una sola vez (llamar al iniciar la app). */
export function initAnalytics() {
  if (!analyticsEnabled || started || typeof document === "undefined") return;
  started = true;
  const consent = getConsent();
  gtag("consent", "default", {
    analytics_storage: consent === "granted" ? "granted" : "denied",
    ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
    wait_for_update: 500,
  });
  gtag("js", new Date());
  gtag("config", GA_ID, { send_page_view: false });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
}

/** Guarda la decisión del aviso de cookies y la comunica a GA. */
export function setConsent(value: "granted" | "denied") {
  try { localStorage.setItem(CONSENT_KEY, value); } catch { /* sin almacenamiento */ }
  gtag("consent", "update", { analytics_storage: value });
}

/** Página vista (se llama en cada cambio de ruta). */
export function trackPageView(path: string) {
  gtag("event", "page_view", { page_path: path, page_location: window.location.href, page_title: document.title });
}

/** Evento personalizado. Nombres en snake_case (convención de GA4). */
export function trackEvent(name: string, params: Record<string, string | number | boolean | undefined> = {}) {
  gtag("event", name, params);
}
