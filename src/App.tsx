import { Suspense, useEffect, useLayoutEffect } from "react";
import { Routes, Route, useLocation, useNavigationType } from "react-router-dom";
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

// Al entrar a otra página se abre desde arriba (de golpe, sin el desplazamiento
// suave del CSS). No actúa con "atrás/adelante" (cada página restaura su
// posición) ni con enlaces con ancla (#cotizador), que llevan a su sección.
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const navType = useNavigationType();
  useLayoutEffect(() => {
    if (navType === "POP" || hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

export default function App() {
  useEffect(() => { trackVisit(); }, []);
  return (
    <>
    <ScrollToTop />
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
