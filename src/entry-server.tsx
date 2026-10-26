// Entrada para la pre-generación de HTML en el build (scripts/prerender.mjs).
// No se usa en el navegador.
import { StrictMode } from "react";
import { prerender } from "react-dom/static";
import { StaticRouter } from "react-router-dom";
import App, { ArticlePage, NosotrosPage, NotFoundPage, PoliciesPage, PrivacyPage, ServiceDetailPage, VideosPage } from "./App";
import { preloadChat } from "@/components/chat/LazyChatBot";

export { getPageMeta, renderHeadTags, PUBLIC_ROUTES } from "@/seo/meta";
export { INDEXABLE, SITE_URL } from "@/seo/site";

/** Carga las páginas y el chat (perezosos en el navegador) para que la
 *  pre-generación no deje nada en suspenso ni agregue <script> en línea. */
export async function preload() {
  await Promise.all([NosotrosPage, ServiceDetailPage, ArticlePage, PrivacyPage, PoliciesPage, VideosPage, NotFoundPage].map(p => p.preload()).concat(preloadChat()));
}

// prerender() espera cualquier resto en suspenso antes de devolver el HTML.
// progressiveChunkSize: React "externaliza" (emite tarde, con <script>) los
// límites de Suspense anidados cuando el HTML ya emitido supera 12,8 KB, para
// priorizar el esqueleto en streaming. Aquí no hay streaming: con un umbral
// enorme todo queda en línea.
export async function render(url: string): Promise<string> {
  const { prelude } = await prerender(<StrictMode><StaticRouter location={url}><App /></StaticRouter></StrictMode>, { progressiveChunkSize: 1e9 });
  let html = "";
  const reader = prelude.getReader(); const dec = new TextDecoder();
  for (;;) { const { done, value } = await reader.read(); if (done) break; html += dec.decode(value, { stream: true }); }
  return html;
}
