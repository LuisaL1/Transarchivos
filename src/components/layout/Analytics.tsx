import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { analyticsEnabled, getConsent, initAnalytics, setConsent, trackEvent, trackPageView } from "@/lib/analytics";
import { useLang } from "@/i18n";
import { useUi } from "@/i18n/ui";
import { C } from "@/styles/tokens";

// ─── Seguimiento de Google Analytics ───────────────────────────────────────
// Página vista en cada cambio de ruta + clics en teléfono y correo en todo el
// sitio. No dibuja nada.
export function AnalyticsTracker() {
  const { pathname, search } = useLocation();
  useEffect(() => { initAnalytics(); }, []);
  useEffect(() => { trackPageView(pathname + search); }, [pathname, search]);
  useEffect(() => {
    if (!analyticsEnabled) return;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a");
      const href = a?.getAttribute("href") ?? "";
      if (href.startsWith("tel:")) trackEvent("contact_click", { method: "phone" });
      else if (href.includes("wa.me/")) trackEvent("contact_click", { method: "whatsapp" });
      else if (href.startsWith("mailto:")) trackEvent("contact_click", { method: href.includes("subject=") ? "email_quote" : "email" });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}

// ─── Aviso de cookies ──────────────────────────────────────────────────────
// Solo aparece si Google Analytics está configurado y el visitante aún no ha
// decidido. Mientras está visible, en celular se oculta el botón de Joel.
export function CookieBanner() {
  const u = useUi().cookies;
  const { lp } = useLang();
  // Se decide en el navegador (después de hidratar): el HTML pre-generado no lo incluye.
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const check = () => setVisible(analyticsEnabled && getConsent() === null);
    check();
    window.addEventListener("ta-consent-reset", check);
    return () => window.removeEventListener("ta-consent-reset", check);
  }, []);
  useEffect(() => {
    document.body.classList.toggle("consent-open", visible);
    return () => document.body.classList.remove("consent-open");
  }, [visible]);
  if (!visible) return null;
  const decide = (v: "granted" | "denied") => { setConsent(v); setVisible(false); };
  return (
    <div role="dialog" aria-label={u.aria} className="fixed z-[65] left-4 right-4 bottom-4 sm:left-6 sm:right-auto sm:max-w-md rounded-2xl p-5"
      style={{ background: "#fff", border: "1px solid #E4E6F7", boxShadow: "0 24px 50px -20px rgba(10,13,61,0.4)", animation: "fadeInUp 0.3s ease both" }}>
      <p className="text-sm font-bold mb-1" style={{ color: C.indigo, fontFamily: "Poppins, sans-serif" }}>{u.title}</p>
      <p className="text-xs mb-4" style={{ color: C.muted, lineHeight: 1.6 }}>
        {u.text}<Link to={lp("/privacidad")} style={{ color: C.indigo, fontWeight: 600 }}>{u.policy}</Link>.
      </p>
      <div className="flex gap-2">
        <button type="button" onClick={() => decide("granted")} className="flex-1 py-2.5 rounded-xl text-sm font-bold"
          style={{ background: C.indigo, color: "#fff", fontFamily: "Montserrat, sans-serif" }}>{u.accept}</button>
        <button type="button" onClick={() => decide("denied")} className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: "#fff", color: C.indigo, border: "1.5px solid #DDE0F2", fontFamily: "Montserrat, sans-serif" }}>{u.reject}</button>
      </div>
    </div>
  );
}
