import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { analyticsEnabled, getConsent, initAnalytics, setConsent, trackEvent, trackPageView } from "@/lib/analytics";

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
  // Se decide en el navegador (después de hidratar): el HTML pre-generado no lo incluye.
  const [visible, setVisible] = useState(false);
  useEffect(() => { setVisible(analyticsEnabled && getConsent() === null); }, []);
  useEffect(() => {
    document.body.classList.toggle("consent-open", visible);
    return () => document.body.classList.remove("consent-open");
  }, [visible]);
  if (!visible) return null;
  const decide = (v: "granted" | "denied") => { setConsent(v); setVisible(false); };
  return (
    <div role="dialog" aria-label="Aviso de cookies" className="fixed z-[65] left-4 right-4 bottom-4 sm:left-6 sm:right-auto sm:max-w-md rounded-2xl p-5"
      style={{ background: "#fff", border: "1px solid #E4E6F7", boxShadow: "0 24px 50px -20px rgba(10,13,61,0.4)", animation: "fadeInUp 0.3s ease both" }}>
      <p className="text-sm font-bold mb-1" style={{ color: "#272B7C", fontFamily: "Poppins, sans-serif" }}>Usamos cookies analíticas</p>
      <p className="text-xs mb-4" style={{ color: "#6B6B6B", lineHeight: 1.6 }}>
        Nos ayudan a entender cómo se usa el sitio para mejorarlo. No las usamos con fines publicitarios. Puede aceptarlas o rechazarlas;
        el sitio funciona igual. Más información en <Link to="/#faq" style={{ color: "#1800AD", fontWeight: 600 }}>contacto</Link>.
      </p>
      <div className="flex gap-2">
        <button type="button" onClick={() => decide("granted")} className="flex-1 py-2.5 rounded-xl text-sm font-bold"
          style={{ background: "#272B7C", color: "#fff", fontFamily: "Montserrat, sans-serif" }}>Aceptar</button>
        <button type="button" onClick={() => decide("denied")} className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: "#fff", color: "#272B7C", border: "1.5px solid #DDE0F2", fontFamily: "Montserrat, sans-serif" }}>Rechazar</button>
      </div>
    </div>
  );
}
