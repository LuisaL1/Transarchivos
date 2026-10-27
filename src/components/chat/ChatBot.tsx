// ─── Joel, asesor virtual: interfaz del chat ────────────────────────────────
// Invitación que asoma a los 7 s (una vez por sesión), botón flotante y
// ventana con encabezado, mensajes, opciones rápidas (lista con ícono) y
// campo de texto. La conversación está en src/data/chat.ts y la lógica en
// src/hooks/useAdvisorChat.ts. No usa IA externa: sigue un guion y el cerebro
// local de Joel (src/lib/joel.ts).
import { Link } from "react-router-dom";
import avatarImg from "@/assets/images/joel.webp";
import { NAME, type ChatMsg } from "@/data/chat";
import { useAdvisorChat, type ChatSeed } from "@/hooks/useAdvisorChat";
import { requestAdvisorChat, requestQuoteToAdvisor } from "@/lib/advisorEvents";
import { ChatAvatarFace } from "@/components/ui/Brand";
import { Bi, MenuIcon } from "@/components/ui/Icons";
import { C } from "@/styles/tokens";

const CARD = { background: "#fff", border: "1px solid #E4E6F7" } as const;

// Mensaje del chat: de Joel o de un asesor (izquierda, con acciones opcionales
// en lista con ícono) o del visitante (derecha)
export function ChatBubble({ msg }: { msg: ChatMsg }) {
  const agent = msg.from === "agent";
  const bot = msg.from === "bot" || agent;
  return (
    <div className={`flex items-end gap-2 ${bot ? "justify-start" : "justify-end"}`} style={{ animation: "fadeInUp 0.3s ease both" }}>
      {agent ? (
        // Asesor de Transarchivos: ícono de audífonos en lugar de la foto de Joel
        <span className="grid shrink-0 place-items-center rounded-full" style={{ width: 24, height: 24, background: C.indigo }}><Bi n="headset" size={12} color={C.yellow} /></span>
      ) : bot && <ChatAvatarFace size={24} round />}
      <div className={`max-w-[82%] ${bot ? "" : "text-right"}`}>
        {agent && msg.name && <p className="mb-1 text-[11px] font-semibold" style={{ color: C.indigo, fontFamily: "Montserrat, sans-serif" }}>{msg.name}</p>}
        <div className="inline-block whitespace-pre-line px-3.5 py-2.5 text-left text-[13.5px] leading-relaxed"
          style={bot
            ? { ...CARD, color: "#37352F", borderRadius: "4px 16px 16px 16px", boxShadow: "0 1px 2px rgba(10,13,61,0.05)" }
            : { background: C.indigo, color: "#fff", borderRadius: "16px 16px 4px 16px" }}>
          {msg.text}
        </div>
        {msg.actions && (
          <div className="mt-2 rounded-2xl p-1.5" style={CARD}>
            {msg.actions.map(a => {
              const cls = "group flex items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-hielo";
              const inner = (
                <>
                  <MenuIcon n={a.icon} size={30} />
                  <span className="flex-1 text-[13px] font-semibold" style={{ color: C.indigo, fontFamily: "Montserrat, sans-serif" }}>{a.label}</span>
                  <Bi n="arrow-up-right" size={11} color={C.faint} />
                </>
              );
              // "Enviar a un asesor" y "Chatear con un asesor": los atiende useAdvisorChat
              if (a.sendQuote || a.crm) return <button key={a.label} type="button" onClick={a.sendQuote ? requestQuoteToAdvisor : requestAdvisorChat} className={`${cls} w-full`}>{inner}</button>;
              return a.to
                ? <Link key={a.label} to={a.to} className={cls} style={{ textDecoration: "none" }}>{inner}</Link>
                : <a key={a.label} href={a.href} {...(/^https?:/.test(a.href ?? "") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={cls} style={{ textDecoration: "none" }}>{inner}</a>;
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// "open"/"setOpen" viven en la página para que el menú de soporte y la caja
// del hero también puedan abrir el chat. "seed": pregunta escrita en la caja
// del hero (con id para que dos preguntas iguales cuenten como distintas).
export function ChatBot({ open, setOpen, seed, heroJoel = false }: { open: boolean; setOpen: (v: boolean | ((prev: boolean) => boolean)) => void; seed?: ChatSeed; heroJoel?: boolean }) {
  const { msgs, typing, text, setText, step, options, choose, send, restart, teaser, setTeaser, endRef, inputRef, advisor, live, endAdvisor, ui: T, optionIcon } = useAdvisorChat({ open, setOpen, seed, heroJoel });

  return (
    <>
      {/* Invitación: Joel se asoma junto al botón */}
      {teaser && !open && advisor === "idle" && (
        <div data-chat-launcher className="fixed bottom-[68px] right-4 sm:bottom-[76px] sm:right-3 md:bottom-[88px] md:right-6 z-[60] flex items-end" style={{ animation: "fadeInUp 0.5s ease both" }}>
          <div className="relative sm:mb-16 sm:-mr-4 max-w-[230px] rounded-2xl rounded-br-sm bg-white px-4 py-3 text-[13.5px]"
            style={{ color: "#37352F", boxShadow: "0 20px 40px -16px rgba(10,13,61,0.35), 0 2px 8px rgba(10,13,61,0.08)" }}>
            <button onClick={() => setTeaser(false)} className="absolute right-2 top-1.5" aria-label={T.closeTeaser}>
              <Bi n="x-lg" size={11} color={C.faint} />
            </button>
            <button onClick={() => setOpen(true)} className="pr-3 text-left leading-relaxed">
              <b style={{ color: C.indigo }}>{T.hello}</b> {T.teaser}
            </button>
          </div>
          <button onClick={() => setOpen(true)} aria-label={T.talk} className="shrink-0">
            <img loading="lazy" decoding="async" src={avatarImg} alt="" draggable={false} className="hidden sm:block h-[150px] md:h-[170px] w-auto select-none" style={{ filter: "drop-shadow(0 12px 18px rgba(29,32,80,0.25))" }} />
          </button>
        </div>
      )}

      {/* Botón flotante (con la ventana de Zoho abierta se usa su propio botón de cerrar) */}
      {advisor !== "open" && <button data-chat-launcher onClick={() => setOpen(o => !o)} aria-expanded={open} aria-busy={advisor === "loading"}
        aria-label={open ? T.closeChat : T.openChat}
        className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[60] items-center gap-2.5 rounded-full p-1.5 md:pr-4 text-white transition-transform hover:-translate-y-0.5 ${open ? "hidden sm:flex" : "flex"}`}
        style={{ background: C.indigo, boxShadow: "0 16px 34px -10px rgba(24,0,173,0.6)" }}>
        {open ? (
          <span className="grid place-items-center rounded-full" style={{ width: 40, height: 40, background: "rgba(255,255,255,0.15)" }}>
            <Bi n="x-lg" size={16} color="#fff" />
          </span>
        ) : (
          <span className="relative">
            <span className="absolute inset-0 rounded-full" style={{ background: "rgba(255,222,89,0.45)", animation: "chatPing 2.4s cubic-bezier(0,0,0.2,1) infinite" }} />
            <ChatAvatarFace size={40} round />
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2" style={{ background: "#22c55e", borderColor: C.indigo }} />
          </span>
        )}
        <span className="hidden md:block text-left">
          <span className="flex items-center gap-1.5 text-[13px] font-semibold leading-tight" style={{ fontFamily: "Montserrat, sans-serif" }}>
            {open ? T.close : NAME}
            {!open && <span className="rounded-full px-1.5 py-px text-[9px] font-bold tracking-wide" style={{ background: C.yellow, color: C.indigo }}>{T.ai}</span>}
          </span>
          {!open && <span className="block text-[11.5px] leading-tight" style={{ color: "rgba(255,255,255,0.7)" }}>{advisor === "loading" ? T.connecting : T.online}</span>}
        </span>
      </button>}

      {/* Ventana */}
      {open && (
        <section aria-label={T.window}
          // Celular: pantalla completa (más cómodo para escribir). Desde sm:
          // ventana flotante sobre el botón.
          className="fixed inset-0 sm:inset-auto sm:right-6 sm:bottom-[92px] sm:w-[400px] sm:max-h-[calc(100vh-130px)] z-[70] flex flex-col overflow-hidden rounded-none sm:rounded-[24px] bg-white sm:border sm:border-indigo/10"
          style={{ minHeight: 0, boxShadow: "0 40px 80px -30px rgba(24,0,173,0.5)", animation: "fadeInUp 0.3s ease both" }}>
          <div className="h-[100dvh] sm:h-[min(620px,calc(100vh-130px))] flex flex-col min-h-0 flex-1">
            {/* shrink-0 en encabezado, aviso y barra de escritura: con una
                conversación larga (p. ej. el resumen de la cotización) solo
                se desplaza la lista de mensajes; antes el encabezado se
                aplastaba. */}
            <header className="relative shrink-0 flex items-center gap-3.5 overflow-hidden px-5 py-4 min-h-[76px]" style={{ background: C.indigo, paddingTop: "max(16px, env(safe-area-inset-top))" }}>
              <span aria-hidden="true" className="pointer-events-none absolute" style={{ right: -48, top: -48, width: 90, height: 90, transform: "rotate(45deg)", borderRadius: 15, background: "rgba(255,222,89,0.22)" }} />
              <span className="relative">
                <ChatAvatarFace size={46} round />
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2" style={{ background: "#22c55e", borderColor: C.indigo }} />
              </span>
              <div className="relative flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase leading-none mb-1" style={{ color: C.yellow, letterSpacing: "0.16em", fontFamily: "Montserrat, sans-serif" }}>{T.role}</p>
                <p className="text-[17px] font-semibold leading-tight" style={{ color: "#fff", fontFamily: "Poppins, sans-serif" }}>{NAME}</p>
                <p className="flex items-center gap-1.5 text-[12px] mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.7)" }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#22c55e" }} /> {T.status}
                </p>
              </div>
              <button onClick={restart} className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-colors bg-white/10 hover:bg-white/20" aria-label={T.restart} title={T.restart}>
                <Bi n="arrow-counterclockwise" size={15} color="rgba(255,255,255,0.85)" />
              </button>
              <button onClick={() => setOpen(false)} className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-colors bg-white/10 hover:bg-white/20" aria-label={T.closeChat}>
                <Bi n="x-lg" size={14} color="rgba(255,255,255,0.85)" />
              </button>
            </header>

            {/* Chat con un asesor dentro de Joel */}
            {live !== "off" && (
              <div className="shrink-0 flex items-center gap-2 px-4 py-2 text-[12.5px] font-semibold" style={{ background: "#FBFBF8", borderBottom: "1px solid #E4E6F7", color: C.indigo, fontFamily: "Montserrat, sans-serif" }}>
                <Bi n="headset" size={14} color={C.gold} />
                <span className="flex-1">{T.advisorBanner}</span>
                <button type="button" onClick={endAdvisor} className="rounded-lg px-2 py-1 underline-offset-2 hover:underline" style={{ color: C.indigo }}>{T.advisorEnd}</button>
              </div>
            )}

            <div className="flex-1 min-h-0 space-y-3 overflow-y-auto p-4" style={{ background: "#F6F7FD" }} aria-live="polite">
              {msgs.map((m, i) => <ChatBubble key={i} msg={m} />)}
              {typing && (
                <div className="flex items-end gap-2">
                  <ChatAvatarFace size={24} round />
                  <div className="flex gap-1 px-3.5 py-3" style={{ ...CARD, borderRadius: "4px 16px 16px 16px" }}>
                    {[0, 1, 2].map(i => <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(24,0,173,0.6)", animation: `chatBounce 1.4s ${i * 0.15}s infinite` }} />)}
                  </div>
                </div>
              )}
              {!typing && options.length > 0 && (
                <div className="rounded-2xl p-1.5 ml-8" style={{ ...CARD, animation: "fadeInUp 0.3s ease both" }}>
                  {options.map(o => (
                    <button key={o.label} type="button" onClick={() => choose(o)} className="group w-full flex items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-hielo">
                      <MenuIcon n={optionIcon(o.label)} size={32} />
                      <span className="flex-1 text-[13px] font-semibold" style={{ color: C.indigo, fontFamily: "Montserrat, sans-serif" }}>{o.label}</span>
                      <Bi n="chevron-right" size={12} color={C.faint} className="transition-transform group-hover:translate-x-0.5" />
                    </button>
                  ))}
                </div>
              )}
              <div ref={endRef} />
            </div>

            <form onSubmit={e => { e.preventDefault(); send(); }} className="shrink-0 flex items-center gap-2 bg-white p-3" style={{ borderTop: "1px solid #ECEEF6", paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
              <input ref={inputRef} value={text} onChange={e => setText(e.target.value)}
                placeholder={live !== "off" ? T.advisorPlaceholder : (step.input?.placeholder ?? T.placeholder)} aria-label={T.message}
                className="min-w-0 flex-1 rounded-full px-4 py-2.5 text-[14px] outline-none transition focus:bg-white"
                style={{ border: "1px solid #E4E6F7", background: "#F6F7FD", color: C.indigo }} />
              <button type="submit" disabled={!text.trim() || typing} aria-label={T.send}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full transition-opacity disabled:opacity-40" style={{ background: C.yellow }}>
                <Bi n="send-fill" size={15} color={C.indigo} />
              </button>
            </form>
          </div>
        </section>
      )}
    </>
  );
}
