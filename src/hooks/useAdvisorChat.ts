// Lógica del chat de Joel: estado de la conversación, mensajes uno a uno con
// indicador de "escribiendo", invitación una vez por sesión y pregunta escrita
// en la caja del hero ("seed").
// · Los botones (menú, servicios, preguntas frecuentes y cotización guiada) se
//   resuelven aquí con los pasos de src/data/chat.ts.
// · Lo que el visitante ESCRIBE lo responde Zoho SalesIQ: su bot, con los
//   artículos y preguntas frecuentes configurados allá, o un asesor si el bot
//   lo transfiere. Por /api/advisor si está configurado (el navegador no carga
//   Zoho); si no, por el puente con el widget de Zoho escondido
//   (src/lib/zohoBridge.ts), que se prepara al abrir el chat.
// · Si Zoho no responde, Joel lo dice y ofrece WhatsApp y el formulario.
// La interfaz está en src/components/chat/ChatBot.tsx. Ver docs/08-chat-asesor.md.
import { useEffect, useRef, useState } from "react";
import { CHAT_STEPS, CHAT_TEXT as t, NAME, teamQuoteMessage, type ChatData, type ChatMsg, type ChatOption, type ChatStep } from "@/data/chat";
import { greeting } from "@/lib/joel";
import { trackEvent } from "@/lib/analytics";
import { CRM_CHAT_EVENT, QUOTE_EVENT } from "@/lib/advisorEvents";
import { advisorAvailable, loadSaved, pollAdvisor, POLL_MS, REPLY_MS, save, sendToAdvisor, startAdvisor } from "@/lib/advisorChat";
import { contactHref, whatsappUrl } from "@/data/contact";
import { services } from "@/data/services";
import { track } from "@/lib/visitor";

export type ChatSeed = { text: string; id: number } | null | undefined;
type Bridge = import("@/lib/zohoBridge").Bridge;

export function useAdvisorChat({ open, setOpen, seed, heroJoel = false }: {
  open: boolean;
  setOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
  seed?: ChatSeed;
  heroJoel?: boolean;
}) {
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
  // Paso "dinámico": el saludo, o lo que se muestra mientras se habla con Zoho.
  const dyn = useRef<ChatStep | null>(null);
  const step = (stepId === "dyn" && dyn.current) ? dyn.current : CHAT_STEPS[stepId];

  const say = (text: string, actions?: ChatMsg["actions"]) => setMsgs(m => [...m, { from: "bot", text, actions }]);

  // Muestra los mensajes de un paso uno a uno, con indicador de "escribiendo".
  const goTo = (id: string, d: ChatData) => {
    // Cotización nueva: su resumen se podrá enviar a un asesor
    if (id === "reset" || id === "q_service" || id === "q_volume") quoteSent.current = "";
    let target = id === "reset" ? "start" : id;
    const nextData = id === "reset" ? {} : d;
    if (id === "reset") { setMsgs([]); setLiveOptions([]); stopWaiting(); }
    // El saludo se arma según lo que el visitante ha hecho en el sitio.
    if (target === "start") { const g = greeting(services); dyn.current = { say: () => g.say, options: g.options }; target = "dyn"; }
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
  // También se prepara Zoho (puente) para que la primera respuesta llegue antes.
  useEffect(() => {
    if (!open) return;
    setTeaser(false);
    void getMode().then(m => { if (m === "bridge") getBridge().catch(() => { /* se reintenta al escribir */ }); });
    if (seed && seed.id !== seedHandled.current) {
      seedHandled.current = seed.id;
      setMsgs(m => [...m, { from: "user", text: seed.text }]);
      void askZoho(seed.text);
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
    // Si Joel ya aparece en el hero (pantallas medianas y grandes), no se
    // repite la invitación con su figura.
    if (seen || (heroJoel && window.matchMedia("(min-width: 768px)").matches)) return;
    const id = window.setTimeout(() => {
      setTeaser(true);
      try { sessionStorage.setItem("ta-chat-teaser", "1"); } catch { /* sin almacenamiento */ }
    }, 7000);
    return () => clearTimeout(id);
  }, [heroJoel]);

  // ─── Respuestas de Zoho SalesIQ ────────────────────────────────────────
  // advisor: la ventana de Zoho a la vista ("open"), solo para llenar un
  // formulario que Zoho no deja omitir.
  const [advisor, setAdvisor] = useState<"idle" | "open">("idle");
  // Esperando la respuesta de Zoho (indicador de "escribiendo")
  const [waiting, setWaiting] = useState(false);
  const waitTimer = useRef(0);
  // Respuestas sugeridas por el bot o el asesor de Zoho (botones)
  const [liveOptions, setLiveOptions] = useState<string[]>([]);
  // Canal: la API (/api/advisor) si está configurada; si no, el puente
  const mode = useRef<Promise<"api" | "bridge"> | null>(null);
  const getMode = () => (mode.current ??= advisorAvailable().then(ok => (ok ? "api" : "bridge")));
  const bridge = useRef<Promise<Bridge> | null>(null);
  const bridgeReady = useRef<Bridge | null>(null);
  // Modo API: pase de la conversación abierta en Zoho
  const pass = useRef<{ token: string; after: number } | null>(null);
  const [polling, setPolling] = useState(false);
  // Cotización enviada al equipo ("" | "sending" | "sent")
  const quoteSent = useRef("");
  const otherChannels = (): ChatMsg["actions"] => [
    { label: t.crmWhatsapp, icon: "whatsapp", href: whatsappUrl() },
    { label: t.crmForm, icon: "envelope-fill", href: contactHref() },
  ];

  const stopWaiting = () => { window.clearTimeout(waitTimer.current); setWaiting(false); };
  const startWaiting = () => {
    window.clearTimeout(waitTimer.current);
    setWaiting(true);
    // Si tarda, se avisa; la respuesta se sigue mostrando si llega después
    waitTimer.current = window.setTimeout(() => { setWaiting(false); say(t.zohoSlow, otherChannels()); }, REPLY_MS);
  };
  useEffect(() => () => window.clearTimeout(waitTimer.current), []);

  // Respuesta de Zoho: con el nombre de Joel (o sin nombre) se ve como Joel;
  // con otro nombre, como un asesor
  const onReply = (name: string, text: string, options: string[] = []) => {
    stopWaiting();
    setMsgs(list => [...list, !name || name === NAME ? { from: "bot", text } : { from: "agent", text, name }]);
    setLiveOptions(options);
  };

  // Puente: carga Zoho escondido una vez; si falla, se reintenta en el próximo mensaje
  const getBridge = () => {
    if (!bridge.current) {
      const p = import("@/lib/zohoBridge").then(m => m.openBridge({
        onMessage: m => onReply(m.name, m.text, m.options),
        onForm: ({ canSkip }) => {
          stopWaiting();
          say(t.advisorForm);
          setLiveOptions(canSkip ? [t.advisorFormFill, t.advisorFormSkip] : [t.advisorFormFill]);
        },
      }));
      bridge.current = p;
      p.then(b => { bridgeReady.current = b; }, () => { if (bridge.current === p) bridge.current = null; });
    }
    return bridge.current;
  };

  // Entrega un texto a Zoho (por el canal activo). Devuelve si Zoho lo recibió.
  const deliver = async (value: string, name?: string): Promise<boolean> => {
    if ((await getMode()) === "bridge") {
      try { return await (await getBridge()).send(value); } catch { return false; }
    }
    if (pass.current) return (await sendToAdvisor(pass.current.token, value)).ok;
    const r = await startAdvisor(value, name);
    if (!r.ok || !r.token) return false;
    pass.current = { token: r.token, after: 0 };
    save(pass.current);
    setPolling(true);
    return true;
  };

  // Texto del visitante → Zoho SalesIQ → respuesta en Joel
  const askZoho = async (value: string) => {
    trackEvent("chat_message");
    setLiveOptions([]);
    dyn.current = { say: () => [], options: [{ label: t.backToStart, next: "reset" }] };
    setStepId("dyn");
    startWaiting();
    if (!(await deliver(value, data.name))) { stopWaiting(); say(t.zohoError, otherChannels()); }
  };

  // Ventana de Zoho a la vista (formulario) o escondida otra vez
  useEffect(() => {
    const onChange = (e: Event) => {
      const isOpen = (e as CustomEvent<{ open: boolean }>).detail.open;
      setAdvisor(isOpen ? "open" : "idle");
      if (isOpen) setOpen(false);
      // Al cerrarla vuelve a esconderse y la conversación sigue en Joel
      else if (bridgeReady.current) { bridgeReady.current.hideWindow(); setOpen(true); }
    };
    window.addEventListener(CRM_CHAT_EVENT, onChange);
    return () => window.removeEventListener(CRM_CHAT_EVENT, onChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Conversación en curso (modo API) tras recargar o cambiar de página
  useEffect(() => {
    const s = loadSaved();
    if (!s) return;
    pass.current = s;
    setPolling(true);
  }, []);

  // Respuestas de Zoho (modo API): se preguntan cada pocos segundos
  useEffect(() => {
    if (!polling) return;
    let stop = false;
    const end = () => { pass.current = null; save(null); setPolling(false); };
    const tick = async () => {
      const p = pass.current;
      if (!p || stop) return;
      const r = await pollAdvisor(p.token, p.after);
      if (stop) return;
      // Pase vencido: el próximo mensaje abre otra conversación
      if (!r.ok) { if (r.error === "token") end(); return; }
      for (const m of r.messages ?? []) {
        p.after = Math.max(p.after, m.seq);
        if (m.from === "system" && m.text === "joined") say(t.advisorJoined(m.name));
        else if (m.from === "system" && m.text === "ended") { stopWaiting(); say(t.advisorEnded); end(); return; }
        else if (m.from !== "system") onReply(m.from === "bot" ? m.name : m.name || t.advisorLabel, m.text);
      }
      save(p);
    };
    const id = window.setInterval(tick, POLL_MS);
    void tick();
    return () => { stop = true; clearInterval(id); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [polling]);

  // ─── Cotización terminada → chat de los asesores para seguimiento ────────
  // Con "Enviar a un asesor" (resumen), Joel envía la cotización (con nombre y
  // celular) a Zoho SalesIQ marcada como "NUEVA COTIZACIÓN para seguimiento", en
  // la misma conversación; si el asesor responde, aparece en Joel.
  const sendQuoteToTeam = async (d: ChatData) => {
    const ok = await deliver(teamQuoteMessage(d), d.name);
    if (ok) {
      trackEvent("generate_lead", { method: "chat_advisor", service: d.service ?? "" });
      say(t.quoteSent(d.phone ?? ""));
    } else say(t.quoteSendFail);
    return ok;
  };
  // Botón "Enviar a un asesor" del resumen: una vez por cotización (se puede
  // volver a enviar si falló o si se hace otra cotización, aunque sea igual)
  const dataRef = useRef(data);
  dataRef.current = data;
  useEffect(() => {
    const onQuote = () => {
      if (quoteSent.current) return;
      quoteSent.current = "sending";
      setMsgs(m => [...m, { from: "user", text: t.sendToAdvisor }]);
      void sendQuoteToTeam(dataRef.current).then(ok => { quoteSent.current = ok ? "sent" : ""; });
    };
    window.addEventListener(QUOTE_EVENT, onQuote);
    return () => window.removeEventListener(QUOTE_EVENT, onQuote);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [msgs, typing, waiting]);
  useEffect(() => { if (open && step.input && !typing) inputRef.current?.focus(); }, [open, step, typing]);

  const choose = (o: ChatOption) => {
    setMsgs(m => [...m, { from: "user", text: o.label }]);
    // Respuesta sugerida por Zoho (botones de su bot o del asesor)
    if (o.next === "live") {
      setLiveOptions([]);
      const b = bridgeReady.current;
      if (o.label === t.advisorFormFill) b?.showWindow();
      else if (o.label === t.advisorFormSkip) { if (!b?.skip()) b?.showWindow(); }
      else if (b?.choose(o.label)) startWaiting();
      else void askZoho(o.label);
      return;
    }
    const d = { ...data, ...o.set };
    const next = typeof o.next === "function" ? o.next(d) : o.next;
    // "Hablar con un asesor": el bot de Zoho transfiere a un asesor
    if (next === "human") { trackEvent("contact_click", { method: "advisor_chat" }); setData(d); void askZoho(t.humanRequest); return; }
    if (next === "zoho") { setData(d); void askZoho(o.label); return; }
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
      void askZoho(value);
    }
  };

  // Con botones sugeridos por Zoho, se muestran esos en lugar de los del paso
  const options: ChatOption[] = liveOptions.length
    ? liveOptions.map(label => ({ label, next: "live" }))
    : typeof step.options === "function" ? step.options(data) : (step.options ?? []);

  return {
    msgs, typing, waiting, text, setText, step, options, choose, send,
    restart: () => goTo("reset", {}),
    teaser, setTeaser, endRef, inputRef, advisor,
  };
}
