// ─── Joel: saludo personalizado ─────────────────────────────────────────────
// Lo que el visitante escribe lo responde Zoho SalesIQ (useAdvisorChat); aquí
// solo se arma el saludo con el menú de botones, según lo que el visitante ha
// hecho en el sitio (perfil en su navegador: src/lib/visitor.ts): interés por
// un servicio, visitante técnico que solo lee contenido, listo para cotizar o
// recurrente.
import type { ChatOption } from "@/data/chat";
import { getInsight } from "@/lib/visitor";

export type JoelGreeting = { say: string[]; options: ChatOption[] };

/** Saludo según el comportamiento del visitante en el sitio. */
export function greeting(services: { slug: string; title: string }[]): JoelGreeting {
  const ins = getInsight();
  const svc = (slug: string) => services.find(s => s.slug === slug);
  const lc = (s: string) => s.toLowerCase();
  const base: ChatOption[] = [
    { label: "Cotizar un servicio", next: "q_service" }, { label: "Conocer los servicios", next: "info_list" },
    { label: "Preguntas frecuentes", next: "faq_list" }, { label: "Hablar con un asesor", next: "human" },
  ];
  const top = ins.topServices[0] ? svc(ins.topServices[0]) : undefined;
  if (top && ins.segment === "comprador") return { say: [ins.returning ? "¡Qué bueno verle de nuevo! Soy Joel, el asesor virtual de Transarchivos. 👋" : "¡Hola! Soy Joel, el asesor virtual de Transarchivos. 👋", `Veo que le interesa ${top.title}. ¿Le ayudo a terminar su solicitud de cotización?`], options: [{ label: `Cotizar ${top.title}`, next: "q_volume", set: { service: top.slug } }, ...base.slice(1, 4)] };
  // "Dudas de normativa" (next: "zoho") se le pregunta a Zoho SalesIQ
  if (ins.segment === "tecnico") return { say: ["¡Hola! Soy Joel, el asesor virtual de Transarchivos. 👋", top ? `Veo que ha revisado contenido técnico sobre ${lc(top.title)}. Puedo resolver dudas de normativa o ayudarle a llevarlo a la práctica en su empresa.` : "Veo que le interesa el contenido técnico. Puedo resolver dudas de normativa o ayudarle a llevarlo a la práctica en su empresa."], options: [{ label: "Dudas de normativa", next: "zoho" }, { label: "Empezar con un diagnóstico", next: "q_volume", set: { service: "diagnostico" } }, ...base.slice(1, 3)] };
  if (top) return { say: [ins.returning ? "¡Qué bueno verle de nuevo! Soy Joel. 👋" : "¡Hola! Soy Joel, el asesor virtual de Transarchivos. 👋", `Noto que ha estado revisando ${top.title}. ¿Quiere que le cuente cómo funciona o prefiere cotizarlo?`], options: [{ label: `Conocer ${top.title}`, next: "info_detail", set: { service: top.slug } }, { label: `Cotizar ${top.title}`, next: "q_volume", set: { service: top.slug } }, ...base.slice(2, 4)] };
  if (ins.returning) return { say: ["¡Qué bueno verle de nuevo! Soy Joel, el asesor virtual de Transarchivos. 👋", "¿En qué le puedo ayudar hoy? También puede escribirme su caso con sus palabras."], options: base };
  return { say: ["¡Hola! Soy Joel, el asesor virtual de Transarchivos. 👋", "¿En qué le puedo ayudar hoy? Puede elegir una opción o contarme su caso con sus palabras."], options: base };
}
