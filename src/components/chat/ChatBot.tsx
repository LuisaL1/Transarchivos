import { useState, useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";
import { Link } from "react-router-dom";
import avatarImg from "@/assets/images/joel.png";
import { createJoel, newMemory, track, type JoelReply } from "@/lib/joel";
import { ChatAvatarFace } from "@/components/ui/Brand";
import { Bi, MenuIcon } from "@/components/ui/Icons";
import { blogPosts } from "@/data/blog";
import { FAQS } from "@/data/faqs";
import { QUOTE_UNIT, quoteConfig } from "@/data/quote";
import { SERVICE_DETAILS } from "@/data/serviceDetails";
import { services } from "@/data/services";
import { SOLUTIONS } from "@/data/solutions";

export type ChatData = Record<string, string>;

export type ChatAction = { label: string; icon: string; href?: string; to?: string };

export type ChatMsg = { from: "bot" | "user"; text: string; actions?: ChatAction[] };

export type ChatOption = { label: string; next: string | ((d: ChatData) => string); set?: ChatData };

export type ChatStep = {
  say: (d: ChatData) => string[];
  options?: ChatOption[] | ((d: ChatData) => ChatOption[]);
  input?: { key: string; placeholder: string; next: (d: ChatData) => string };
  actions?: (d: ChatData) => ChatAction[];
};

export const CHAT_UNITS = [
  { slug: "diagnostico", title: "Diagnóstico documental", desc: "Le mostramos qué está pasando hoy con su archivo (volumen, estado, riesgos y oportunidades) antes de mover un solo papel." },
  ...services.map(sv => ({ slug: sv.slug, title: sv.title, desc: sv.desc })),
];

export const unitBySlug = (slug: string) => CHAT_UNITS.find(u => u.slug === slug);

export const CHAT_VOLUMES = ["Menos de 100 cajas", "Entre 100 y 1.000 cajas", "Más de 1.000 cajas", "No lo sé"];

export const CHAT_URGENCY = ["Sin urgencia", "En las próximas semanas", "Urgente"];

export const CHAT_FAQ_COUNT = 6;

export const quoteMailto = (d: ChatData) => {
  const body = `Hola, Transarchivos. Quisiera una cotización.\n\n` +
    `- Servicio: ${unitBySlug(d.service)?.title ?? "—"}\n- Volumen aproximado: ${d.volume ?? "—"}\n- Urgencia: ${d.urgency ?? "—"}\n` +
    `- Nombre: ${d.name ?? "—"}\n- Empresa: ${d.company ?? "—"}\n\n(Solicitud iniciada con Joel, asesor virtual)`;
  return `mailto:info@transarchivos.com?subject=${encodeURIComponent("Solicitud de cotización — " + (unitBySlug(d.service)?.title ?? "Transarchivos"))}&body=${encodeURIComponent(body)}`;
};

export const CONTACT_ACTIONS: ChatAction[] = [
  { label: "Llamar al (601) 316-4530", icon: "telephone-fill", href: "tel:+576013164530" },
  { label: "Escribir a info@transarchivos.com", icon: "envelope-fill", href: "mailto:info@transarchivos.com" },
];

export const CHAT_STEPS: Record<string, ChatStep> = {
  start: {
    say: () => ["¡Hola! Soy Joel, el asesor virtual de Transarchivos. 👋", "¿En qué le puedo ayudar hoy?"],
    options: [
      { label: "Cotizar un servicio", next: "q_service" },
      { label: "Conocer los servicios", next: "info_list" },
      { label: "Preguntas frecuentes", next: "faq_list" },
      { label: "Hablar con un asesor", next: "advisor" },
    ],
  },

  // Cotización guiada
  q_service: {
    say: () => ["Con gusto. ¿Qué servicio necesita?", "Si no está seguro, el diagnóstico documental es el mejor punto de partida."],
    options: CHAT_UNITS.map(u => ({ label: u.title, next: "q_volume", set: { service: u.slug } })),
  },
  q_volume: {
    say: d => [`${unitBySlug(d.service)?.title}: buena elección.`, "¿Aproximadamente qué volumen de archivo tiene?"],
    options: CHAT_VOLUMES.map(v => ({ label: v, next: "q_urgency", set: { volume: v } })),
  },
  q_urgency: {
    say: () => ["¿Qué tan pronto lo necesita?"],
    options: CHAT_URGENCY.map(v => ({ label: v, next: "q_name", set: { urgency: v } })),
  },
  q_name: {
    say: () => ["Perfecto. ¿Cuál es su nombre?"],
    input: { key: "name", placeholder: "Escriba su nombre…", next: () => "q_company" },
  },
  q_company: {
    say: d => [`Gracias, ${d.name}. ¿De qué empresa nos escribe?`],
    input: { key: "company", placeholder: "Nombre de la empresa…", next: () => "q_done" },
  },
  q_done: {
    say: d => [
      `Listo, ${d.name}. Este es el resumen de su solicitud:`,
      `• Servicio: ${unitBySlug(d.service)?.title}\n• Volumen: ${d.volume}\n• Urgencia: ${d.urgency}\n• Empresa: ${d.company}`,
      d.urgency === "Urgente"
        ? "Como es urgente, le recomiendo llamarnos directamente. También puede enviarnos el resumen por correo:"
        : "Envíenos el resumen por correo y un asesor le responderá con el alcance y las condiciones. Si quiere dar más detalles, puede completar la cotización detallada:",
    ],
    actions: d => [
      { label: "Enviar solicitud por correo", icon: "envelope-arrow-up-fill", href: quoteMailto(d) },
      { label: "Completar cotización detallada", icon: "ui-checks", href: "#cotizador" },
      { label: "Llamar al (601) 316-4530", icon: "telephone-fill", href: "tel:+576013164530" },
    ],
    options: [{ label: "Volver al inicio", next: "reset" }],
  },

  // Servicios
  info_list: {
    say: () => ["Estos son nuestros servicios. ¿Sobre cuál quiere saber más?"],
    options: CHAT_UNITS.map(u => ({ label: u.title, next: "info_detail", set: { service: u.slug } })),
  },
  info_detail: {
    say: d => [unitBySlug(d.service)?.desc ?? ""],
    actions: d => d.service === "diagnostico"
      ? [{ label: "Ver el diagnóstico documental", icon: "search", href: "#cotizador" }]
      : [{ label: `Ver ${unitBySlug(d.service)?.title}`, icon: "box-arrow-up-right", to: `/servicios/${d.service}` }],
    options: [
      { label: "Cotizar este servicio", next: "q_volume" },
      { label: "Ver otro servicio", next: "info_list" },
      { label: "Volver al inicio", next: "reset" },
    ],
  },

  // Preguntas frecuentes
  faq_list: {
    say: () => ["Estas son algunas de las preguntas que más nos hacen:"],
    options: () => FAQS.slice(0, CHAT_FAQ_COUNT).map((f, i) => ({ label: f.q, next: "faq_answer", set: { faq: String(i) } })),
  },
  faq_answer: {
    say: d => [FAQS[Number(d.faq)]?.a ?? ""],
    actions: () => [{ label: "Ver todas las preguntas", icon: "question-circle", href: "#faq" }],
    options: [
      { label: "Otra pregunta", next: "faq_list" },
      { label: "Cotizar un servicio", next: "q_service" },
      { label: "Volver al inicio", next: "reset" },
    ],
  },

  // Contacto y otros
  advisor: {
    say: () => ["Claro. Puede comunicarse con un asesor de Transarchivos por estos medios:"],
    actions: () => CONTACT_ACTIONS,
    options: [{ label: "Volver al inicio", next: "reset" }],
  },
};

// Cerebro de Joel (src/joel.ts): se crea al usarse por primera vez, cuando
// ya existen todos los datos del sitio que usa como conocimiento.
export let joelBrain: ReturnType<typeof createJoel> | null = null;

export const getJoel = () => joelBrain ??= createJoel({
  services, details: SERVICE_DETAILS, faqs: FAQS, solutions: SOLUTIONS,
  posts: blogPosts, quote: quoteConfig, quoteUnit: QUOTE_UNIT,
});

// Opciones que, al elegirse después de algo que Joel no entendió, le enseñan
// a qué se refería el visitante.
export const LEARN_DEST: Record<string, string> = { q_service: "intent:cotizar", advisor: "intent:contacto", faq_list: "intent:normativa" };

// Íconos de las opciones principales del chat: cuando todas las opciones de
// un paso tienen ícono se muestran como lista (mismo estilo de los menús).
export const CHAT_OPTION_ICONS: Record<string, string> = {
  "Cotizar un servicio": "ui-checks", "Conocer los servicios": "grid", "Preguntas frecuentes": "question-circle",
  "Hablar con un asesor": "headset", "Volver al inicio": "arrow-counterclockwise",
  "Cotizar este servicio": "ui-checks", "Ver otro servicio": "grid", "Otra pregunta": "question-circle",
};

// Ícono para cualquier opción de navegación del chat (incluidas las que arma
// el cerebro de Joel, como "Cotizar Servicio Inmediato"). Las respuestas
// cortas (volumen, urgencia, servicio a elegir) no tienen ícono y se
// muestran como botones redondeados.
export function chatOptionIcon(label: string): string | undefined {
  if (CHAT_OPTION_ICONS[label]) return CHAT_OPTION_ICONS[label];
  if (/^Cotizar/.test(label)) return "ui-checks";
  if (/^(Solicitar|Empezar)/.test(label)) return "search";
  if (/^(Ver|Conocer)/.test(label)) return "box-arrow-up-right";
  if (/^Hablar/.test(label)) return "headset";
  if (/^Dudas|normativa/i.test(label)) return "shield-check";
  if (/^Contarle/.test(label)) return "chat-dots";
  if (/^¿/.test(label)) return "question-circle";
  return undefined;
}

export function ChatBubble({ msg }: { msg: ChatMsg }) {
  const bot = msg.from === "bot";
  return (
    <div className={`flex items-end gap-2 ${bot ? "justify-start" : "justify-end"}`} style={{ animation: "fadeInUp 0.3s ease both" }}>
      {bot && <ChatAvatarFace size={24} round />}
      <div className={`max-w-[82%] ${bot ? "" : "text-right"}`}>
        <div className="inline-block whitespace-pre-line px-3.5 py-2.5 text-left text-[13.5px] leading-relaxed"
          style={bot
            ? { background: "#fff", color: "#37352F", border: "1px solid #E4E6F7", borderRadius: "4px 16px 16px 16px", boxShadow: "0 1px 2px rgba(10,13,61,0.05)" }
            : { background: "#272B7C", color: "#fff", borderRadius: "16px 16px 4px 16px" }}>
          {msg.text}
        </div>
        {msg.actions && (
          <div className="mt-2 rounded-2xl p-1.5" style={{ background: "#fff", border: "1px solid #E4E6F7" }}>
            {msg.actions.map(a => {
              const cls = "group flex items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-[#F7F8FF]";
              const inner = (
                <>
                  <MenuIcon n={a.icon} size={30} />
                  <span className="flex-1 text-[13px] font-semibold" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif" }}>{a.label}</span>
                  <Bi n="arrow-up-right" size={11} color="#9B9B9B" />
                </>
              );
              return a.to
                ? <Link key={a.label} to={a.to} className={cls} style={{ textDecoration: "none" }}>{inner}</Link>
                : <a key={a.label} href={a.href} className={cls} style={{ textDecoration: "none" }}>{inner}</a>;
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// "open"/"setOpen" viven en LandingPage para que el menú de soporte y la caja
// del hero también puedan abrir el chat. "seed": pregunta escrita en la caja
// del hero (con id para que dos preguntas iguales cuenten como distintas).
export function ChatBot({ open, setOpen, seed }: { open: boolean; setOpen: (v: boolean | ((prev: boolean) => boolean)) => void; seed?: { text: string; id: number } | null }) {
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [stepId, setStepId] = useState("start");
  const [data, setData] = useState<ChatData>({});
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState("");
  const [teaser, setTeaser] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timers = useRef<number[]>([]);
  const seedHandled = useRef(0);
  const mem = useRef(newMemory());
  // Paso "dinámico": la respuesta que arma el cerebro de Joel a un texto libre.
  const dyn = useRef<ChatStep | null>(null);
  const step = (stepId === "dyn" && dyn.current) ? dyn.current : CHAT_STEPS[stepId];

  const toStep = (r: JoelReply): ChatStep => ({ say: () => r.say, actions: r.actions ? () => r.actions! : undefined, options: r.options });
  // Pasa un texto libre por el cerebro de Joel y muestra su respuesta.
  const think = (value: string, d: ChatData) => {
    const r = getJoel().respond(value, mem.current);
    if (r.service) { mem.current.lastService = r.service; track("service", r.service); }
    mem.current.lastIntent = r.intent;
    track("chat", r.intent);
    if (!r.intent.startsWith("fallback")) mem.current.unknownStreak = 0;
    dyn.current = toStep(r);
    goTo("dyn", { ...d, ...(r.service ? { service: r.service } : {}) });
  };

  // Muestra los mensajes de un paso uno a uno, con indicador de "escribiendo".
  const goTo = (id: string, d: ChatData) => {
    let target = id === "reset" ? "start" : id;
    const nextData = id === "reset" ? {} : d;
    if (id === "reset") { setMsgs([]); mem.current = newMemory(); }
    // El saludo se arma según lo que el visitante ha hecho en el sitio.
    if (target === "start") { dyn.current = toStep(getJoel().greeting()); target = "dyn"; }
    if (target === "info_detail" && nextData.service) track("service", nextData.service);
    setData(nextData);
    setStepId(target);
    const s = target === "dyn" && dyn.current ? dyn.current : CHAT_STEPS[target];
    const lines = s.say(nextData);
    setTyping(true);
    let delay = 0;
    lines.forEach((line, i) => {
      delay += Math.min(1100, 450 + line.length * 6);
      const last = i === lines.length - 1;
      timers.current.push(window.setTimeout(() => {
        setMsgs(m => [...m, { from: "bot", text: line, actions: last ? s.actions?.(nextData) : undefined }]);
        if (last) setTyping(false);
      }, delay));
    });
  };

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { if (open) trackEvent("chat_open"); }, [open]);

  // Al abrir: saludo la primera vez, o respuesta a la pregunta del hero.
  useEffect(() => {
    if (!open) return;
    setTeaser(false);
    if (seed && seed.id !== seedHandled.current) {
      seedHandled.current = seed.id;
      setMsgs(m => [...m, { from: "user", text: seed.text }]);
      think(seed.text, data);
      return;
    }
    if (msgs.length === 0 && !typing) goTo("start", {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, seed]);

  // En celular el chat ocupa toda la pantalla: la página de atrás no se mueve.
  useEffect(() => {
    if (!open || window.matchMedia("(min-width: 640px)").matches) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Invitación discreta a los 7 s, una sola vez por sesión.
  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem("ta-chat-teaser") === "1"; } catch { /* sin almacenamiento */ }
    if (seen) return;
    const id = window.setTimeout(() => {
      setTeaser(true);
      try { sessionStorage.setItem("ta-chat-teaser", "1"); } catch { /* sin almacenamiento */ }
    }, 7000);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [msgs, typing]);
  useEffect(() => { if (open && step.input && !typing) inputRef.current?.focus(); }, [open, step, typing]);

  const choose = (o: ChatOption) => {
    const d = { ...data, ...o.set };
    setMsgs(m => [...m, { from: "user", text: o.label }]);
    const next = typeof o.next === "function" ? o.next(d) : o.next;
    // Aprende de la elección si venía de algo que no entendió.
    const dest = o.set?.service ? `service:${o.set.service}` : LEARN_DEST[next];
    if (dest) getJoel().learn(mem.current, dest);
    if (next.startsWith("brain:")) { think(next.slice(6), d); return; }
    if (next === "q_volume" && d.service) track("quote", d.service);
    goTo(next, d);
  };

  const send = () => {
    const value = text.trim();
    if (!value || typing) return;
    setText("");
    setMsgs(m => [...m, { from: "user", text: value }]);
    if (step.input) {
      const d = { ...data, [step.input.key]: value };
      goTo(step.input.next(d), d);
    } else {
      think(value, data);
    }
  };

  const options = typeof step.options === "function" ? step.options(data) : (step.options ?? []);

  return (
    <>
      {/* Invitación: Joel se asoma junto al botón */}
      {teaser && !open && (
        <div data-chat-launcher className="fixed bottom-[68px] right-4 sm:bottom-[76px] sm:right-3 md:bottom-[88px] md:right-6 z-[60] flex items-end" style={{ animation: "fadeInUp 0.5s ease both" }}>
          <div className="relative sm:mb-16 sm:-mr-4 max-w-[230px] rounded-2xl rounded-br-sm bg-white px-4 py-3 text-[13.5px]"
            style={{ color: "#37352F", boxShadow: "0 20px 40px -16px rgba(10,13,61,0.35), 0 2px 8px rgba(10,13,61,0.08)" }}>
            <button onClick={() => setTeaser(false)} className="absolute right-2 top-1.5" aria-label="Cerrar invitación">
              <Bi n="x-lg" size={11} color="#9B9B9B" />
            </button>
            <button onClick={() => setOpen(true)} className="pr-3 text-left leading-relaxed">
              <b style={{ color: "#272B7C" }}>¡Hola! Soy Joel.</b> ¿Necesita organizar, digitalizar o custodiar su archivo? Le ayudo.
            </button>
          </div>
          <button onClick={() => setOpen(true)} aria-label="Hablar con Joel" className="shrink-0">
            <img src={avatarImg} alt="" draggable={false} className="hidden sm:block h-[150px] md:h-[170px] w-auto select-none" style={{ filter: "drop-shadow(0 12px 18px rgba(29,32,80,0.25))" }} />
          </button>
        </div>
      )}

      {/* Botón flotante */}
      <button data-chat-launcher onClick={() => setOpen(o => !o)} aria-expanded={open}
        aria-label={open ? "Cerrar chat" : "Hablar con Joel, asesor virtual"}
        className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[60] items-center gap-2.5 rounded-full p-1.5 md:pr-4 text-white transition-transform hover:-translate-y-0.5 ${open ? "hidden sm:flex" : "flex"}`}
        style={{ background: "#272B7C", boxShadow: "0 16px 34px -10px rgba(39,43,124,0.6)" }}>
        {open ? (
          <span className="grid place-items-center rounded-full" style={{ width: 40, height: 40, background: "rgba(255,255,255,0.15)" }}>
            <Bi n="x-lg" size={16} color="#fff" />
          </span>
        ) : (
          <span className="relative">
            <span className="absolute inset-0 rounded-full" style={{ background: "rgba(255,222,89,0.45)", animation: "chatPing 2.4s cubic-bezier(0,0,0.2,1) infinite" }} />
            <ChatAvatarFace size={40} round />
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2" style={{ background: "#22c55e", borderColor: "#272B7C" }} />
          </span>
        )}
        <span className="hidden md:block text-left">
          <span className="flex items-center gap-1.5 text-[13px] font-semibold leading-tight" style={{ fontFamily: "Montserrat, sans-serif" }}>
            {open ? "Cerrar" : "Joel"}
            {!open && <span className="rounded-full px-1.5 py-px text-[9px] font-bold tracking-wide" style={{ background: "#FFDE59", color: "#272B7C" }}>IA</span>}
          </span>
          {!open && <span className="block text-[11.5px] leading-tight" style={{ color: "rgba(255,255,255,0.7)" }}>En línea</span>}
        </span>
      </button>

      {/* Ventana */}
      {open && (
        <section aria-label="Chat con Joel"
          // Celular: pantalla completa (más cómodo para escribir). Desde sm:
          // ventana flotante sobre el botón.
          className="fixed inset-0 sm:inset-auto sm:right-6 sm:bottom-[92px] sm:w-[400px] sm:max-h-[calc(100vh-130px)] z-[70] flex flex-col overflow-hidden rounded-none sm:rounded-[24px] bg-white sm:border sm:border-[#272B7C]/10"
          style={{ minHeight: 0, boxShadow: "0 40px 80px -30px rgba(39,43,124,0.5)", animation: "fadeInUp 0.3s ease both" }}>
          <div className="h-[100dvh] sm:h-[min(620px,calc(100vh-130px))] flex flex-col min-h-0 flex-1">
            <header className="relative flex items-center gap-3 overflow-hidden px-5 py-4" style={{ background: "#272B7C", paddingTop: "max(16px, env(safe-area-inset-top))" }}>
              <span aria-hidden="true" className="pointer-events-none absolute" style={{ right: -48, top: -48, width: 90, height: 90, transform: "rotate(45deg)", background: "rgba(255,222,89,0.22)" }} />
              <span className="relative">
                <ChatAvatarFace size={42} round />
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2" style={{ background: "#22c55e", borderColor: "#272B7C" }} />
              </span>
              <div className="relative flex-1 min-w-0">
                <p className="flex items-center gap-2 font-semibold" style={{ color: "#fff", fontFamily: "Poppins, sans-serif" }}>
                  Joel
                  <span className="rounded-full px-2 py-px text-[10px] font-semibold uppercase tracking-wider" style={{ background: "rgba(255,255,255,0.15)", color: "#FFDE59" }}>Asesor virtual</span>
                </p>
                <p className="flex items-center gap-1.5 text-[12px]" style={{ color: "rgba(255,255,255,0.7)" }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#22c55e" }} /> En línea · Responde al instante
                </p>
              </div>
              <button onClick={() => goTo("reset", {})} className="relative grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-white/15" aria-label="Reiniciar conversación" title="Reiniciar conversación">
                <Bi n="arrow-counterclockwise" size={15} color="rgba(255,255,255,0.85)" />
              </button>
              <button onClick={() => setOpen(false)} className="relative grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-white/15" aria-label="Cerrar chat">
                <Bi n="x-lg" size={14} color="rgba(255,255,255,0.85)" />
              </button>
            </header>

            <div className="flex-1 min-h-0 space-y-3 overflow-y-auto p-4" style={{ background: "#F6F7FD" }} aria-live="polite">
              {msgs.map((m, i) => <ChatBubble key={i} msg={m} />)}
              {typing && (
                <div className="flex items-end gap-2">
                  <ChatAvatarFace size={24} round />
                  <div className="flex gap-1 px-3.5 py-3" style={{ background: "#fff", border: "1px solid #E4E6F7", borderRadius: "4px 16px 16px 16px" }}>
                    {[0, 1, 2].map(i => <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(39,43,124,0.6)", animation: `chatBounce 1.4s ${i * 0.15}s infinite` }} />)}
                  </div>
                </div>
              )}
              {!typing && options.length > 0 && options.every(o => chatOptionIcon(o.label)) && (
                <div className="rounded-2xl p-1.5 ml-8" style={{ background: "#fff", border: "1px solid #E4E6F7", animation: "fadeInUp 0.3s ease both" }}>
                  {options.map(o => (
                    <button key={o.label} type="button" onClick={() => choose(o)} className="group w-full flex items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-[#F7F8FF]">
                      <MenuIcon n={chatOptionIcon(o.label)!} size={32} />
                      <span className="flex-1 text-[13px] font-semibold" style={{ color: "#272B7C", fontFamily: "Montserrat, sans-serif" }}>{o.label}</span>
                      <Bi n="chevron-right" size={12} color="#9B9B9B" className="transition-transform group-hover:translate-x-0.5" />
                    </button>
                  ))}
                </div>
              )}
              {!typing && options.length > 0 && !options.every(o => chatOptionIcon(o.label)) && (
                <div className="flex flex-wrap justify-end gap-1.5 pt-1">
                  {options.map(o => (
                    <button key={o.label} onClick={() => choose(o)}
                      className="rounded-full border px-3.5 py-2 text-left text-[13px] font-semibold transition-colors border-[#272B7C]/25 bg-white text-[#272B7C] hover:border-[#272B7C] hover:bg-[#272B7C] hover:text-white"
                      style={{ animation: "fadeInUp 0.3s ease both", fontFamily: "Montserrat, sans-serif" }}>
                      {o.label}
                    </button>
                  ))}
                </div>
              )}
              <div ref={endRef} />
            </div>

            <form onSubmit={e => { e.preventDefault(); send(); }} className="flex items-center gap-2 bg-white p-3" style={{ borderTop: "1px solid #ECEEF6", paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
              <input ref={inputRef} value={text} onChange={e => setText(e.target.value)}
                placeholder={step.input?.placeholder ?? "Escriba su mensaje…"} aria-label="Mensaje"
                className="min-w-0 flex-1 rounded-full px-4 py-2.5 text-[14px] outline-none transition focus:bg-white"
                style={{ border: "1px solid #E4E6F7", background: "#F6F7FD", color: "#272B7C" }} />
              <button type="submit" disabled={!text.trim() || typing} aria-label="Enviar"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full transition-opacity disabled:opacity-40" style={{ background: "#FFDE59" }}>
                <Bi n="send-fill" size={15} color="#272B7C" />
              </button>
            </form>
          </div>
        </section>
      )}
    </>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

// Toda la página principal (antes era el App exportado directamente). Ahora
// App es un enrutador liviano: esto vive en "/", y cada card de servicio
// enlaza a su propia página en "/servicios/:slug" (ver ServiceDetailPage).
// ─── Soporte (ícono de audífonos del header) ────────────────────────────────
// Tarjeta flotante bajo el ícono, abierta hacia la derecha (hacia el margen,
// para no tapar el contenido del hero; si no cabe, se corre a la izquierda):
// chat con Joel, teléfono, correo y enlace a las preguntas frecuentes. Se dibuja con position: fixed (el pill del
// header recorta lo que sobresale) y se cierra al hacer clic fuera o scroll.
