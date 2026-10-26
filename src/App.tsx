import { Suspense, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { trackVisit } from "@/lib/visitor";
import { AnalyticsTracker, CookieBanner } from "@/components/layout/Analytics";
import { SeoHead } from "@/components/layout/SeoHead";
import { ContactModal } from "@/components/layout/ContactModal";
import { HomePage } from "@/pages/HomePage";
import { lazyNamed } from "@/lib/lazyPage";

// Solo el inicio viaja en el paquete principal; las demás páginas se cargan
// al navegar (code-splitting). Ver lib/lazyPage.tsx para la pre-generación.
export const NosotrosPage = lazyNamed("nosotros", () => import("@/pages/NosotrosPage"), "NosotrosPage");
export const ServiceDetailPage = lazyNamed("servicio", () => import("@/pages/ServiceDetailPage"), "ServiceDetailPage");
export const ArticlePage = lazyNamed("articulo", () => import("@/pages/ArticlePage"), "ArticlePage");
export const PrivacyPage = lazyNamed("privacidad", () => import("@/pages/PrivacyPage"), "PrivacyPage");
export const PoliciesPage = lazyNamed("politicas", () => import("@/pages/PoliciesPage"), "PoliciesPage");
export const VideosPage = lazyNamed("videos", () => import("@/pages/VideosPage"), "VideosPage");
export const NotFoundPage = lazyNamed("404", () => import("@/pages/NotFoundPage"), "NotFoundPage");

export default function App() {
  useEffect(() => { trackVisit(); }, []);
  return (
    <>
    <SeoHead />
    <AnalyticsTracker />
    <Suspense fallback={null}>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/nosotros" element={<NosotrosPage />} />
      <Route path="/servicios/:slug" element={<ServiceDetailPage />} />
      <Route path="/blog/:slug" element={<ArticlePage />} />
      <Route path="/privacidad" element={<PrivacyPage />} />
      <Route path="/politicas" element={<PoliciesPage />} />
      <Route path="/videos" element={<VideosPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </Suspense>
    <CookieBanner />
    <ContactModal />
    </>
  );
}
