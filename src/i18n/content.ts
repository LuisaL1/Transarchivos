// Contenido del sitio por idioma. El español (src/data/*.ts) es la fuente de
// verdad; los archivos *.en.ts traducen solo los textos y conservan slugs,
// íconos e imágenes. Los componentes piden el contenido con useContent() (o
// getContent(lang) fuera de React) y no importan los datos directamente, así
// la misma página sirve en los dos idiomas.
import { blogPosts } from "@/data/blog";
import { blogPostsEn } from "@/data/blog.en";
import { CONTACT_REASONS } from "@/data/contact";
import { FAQS } from "@/data/faqs";
import { nosotrosGroups } from "@/data/nosotros";
import { QUOTE_SECTORS, quoteConfig } from "@/data/quote";
import { QUOTE_SECTORS_EN, quoteConfigEn } from "@/data/quote.en";
import { SERVICE_DETAILS } from "@/data/serviceDetails";
import { SERVICE_DETAILS_EN } from "@/data/serviceDetails.en";
import { SERVICE_FAQS } from "@/data/serviceFaqs";
import { SERVICE_FAQS_EN } from "@/data/serviceFaqs.en";
import { norms, serviceItems, services } from "@/data/services";
import { CONTACT_REASONS_EN, faqsEn, normsEn, nosotrosGroupsEn, serviceItemsEn, servicesEn, solutionsEn, statsEn } from "@/data/services.en";
import { SOLUTIONS } from "@/data/solutions";
import { STATS } from "@/data/stats";
import { useLang, type Lang } from "@/i18n";

const es = {
  services, serviceItems, norms, solutions: SOLUTIONS, faqs: FAQS, nosotrosGroups, stats: STATS,
  serviceDetails: SERVICE_DETAILS, serviceFaqs: SERVICE_FAQS, blogPosts, quoteConfig, quoteSectors: QUOTE_SECTORS, contactReasons: CONTACT_REASONS,
};
export type Content = typeof es;
const en: Content = {
  services: servicesEn, serviceItems: serviceItemsEn, norms: normsEn, solutions: solutionsEn, faqs: faqsEn, nosotrosGroups: nosotrosGroupsEn, stats: statsEn,
  serviceDetails: SERVICE_DETAILS_EN, serviceFaqs: SERVICE_FAQS_EN, blogPosts: blogPostsEn, quoteConfig: quoteConfigEn, quoteSectors: QUOTE_SECTORS_EN, contactReasons: CONTACT_REASONS_EN,
};
const CONTENT: Record<Lang, Content> = { es, en };

export const getContent = (lang: Lang): Content => CONTENT[lang];
export function useContent(): Content { return CONTENT[useLang().lang]; }
