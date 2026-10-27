import { Suspense, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { trackVisit } from "@/lib/visitor";
import { AnalyticsTracker, CookieBanner } from "@/components/layout/Analytics";
import { SeoHead } from "@/components/layout/SeoHead";
import { ContactModal } from "@/components/layout/ContactModal";
import { HomePage } from "@/pages/HomePage";
import { lazyNamed } from "@/lib/lazyPage";
import { LANGS, localize } from "@/i18n";

// Solo el inicio viaja en el paquete principal; las demás páginas se cargan
// al navegar (code-splitting). Ver lib/lazyPage.tsx para la pre-generación.
export const NosotrosPage = lazyNamed("nosotros", () => import("@/pages/NosotrosPage"), "NosotrosPage");
export const ServiceDetailPage = lazyNamed("servicio", () => import("@/pages/ServiceDetailPage"), "ServiceDetailPage");
export const ArticlePage = lazyNamed("articulo", () => import("@/pages/ArticlePage"), "ArticlePage");
export const PrivacyPage = lazyNamed("privacidad", () => import("@/pages/PrivacyPage"), "PrivacyPage");
export const PoliciesPage = lazyNamed("politicas", () => import("@/pages/PoliciesPage"), "PoliciesPage");
export const VideosPage = lazyNamed("videos", () => import("@/pages/VideosPage"), "VideosPage");
export const NotFoundPage = lazyNamed("404", () => import("@/pages/NotFoundPage"), "NotFoundPage");

// Las mismas páginas en cada idioma: el español en la raíz y los demás con su
// prefijo y sus secciones traducidas (/en/services/:slug). Ver src/i18n.
const PAGES: [string, () => React.JSX.Element][] = [
  ["/", () => <HomePage />],
  ["/nosotros", () => <NosotrosPage />],
  ["/servicios/:slug", () => <ServiceDetailPage />],
  ["/blog/:slug", () => <ArticlePage />],
  ["/privacidad", () => <PrivacyPage />],
  ["/politicas", () => <PoliciesPage />],
  ["/videos", () => <VideosPage />],
];

export default function App() {
  useEffect(() => { trackVisit(); }, []);
  return (
    <>
    <SeoHead />
    <AnalyticsTracker />
    <Suspense fallback={null}>
    <Routes>
      {LANGS.flatMap(l => [
        ...PAGES.map(([path, el]) => <Route key={`${l}${path}`} path={localize(path, l)} element={el()} />),
        <Route key={`${l}-404`} path={l === "es" ? "*" : `${localize("/", l)}/*`} element={<NotFoundPage />} />,
      ])}
    </Routes>
    </Suspense>
    <CookieBanner />
    <ContactModal />
    </>
  );
}
