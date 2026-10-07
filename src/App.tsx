import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { trackVisit } from "@/lib/joel";
import { AnalyticsTracker, CookieBanner } from "@/components/layout/Analytics";
import { SeoHead } from "@/components/layout/SeoHead";
import { ContactModal } from "@/components/layout/ContactModal";
import { ArticlePage } from "@/pages/ArticlePage";
import { HomePage } from "@/pages/HomePage";
import { NosotrosPage } from "@/pages/NosotrosPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { PrivacyPage } from "@/pages/PrivacyPage";
import { ServiceDetailPage } from "@/pages/ServiceDetailPage";

export default function App() {
  useEffect(() => { trackVisit(); }, []);
  return (
    <>
    <SeoHead />
    <AnalyticsTracker />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/nosotros" element={<NosotrosPage />} />
      <Route path="/servicios/:slug" element={<ServiceDetailPage />} />
      <Route path="/blog/:slug" element={<ArticlePage />} />
      <Route path="/privacidad" element={<PrivacyPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    <CookieBanner />
    <ContactModal />
    </>
  );
}
