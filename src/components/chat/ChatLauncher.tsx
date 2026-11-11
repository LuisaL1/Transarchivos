// ─── Botón flotante del chat (Joel) ─────────────────────────────────────────
// El mismo botón del chat de Joel: foto de Joel, "Joel · IA · En línea" y,
// con la ventana abierta, "Cerrar". Abre y cierra la ventana del widget de
// Zoho SalesIQ (src/lib/chatWidget.ts); el botón propio de Zoho se esconde.
import { useEffect, useState } from "react";
import { CHAT_EVENT, toggleChat } from "@/lib/chatWidget";
import { ChatAvatarFace } from "@/components/ui/Brand";
import { Bi } from "@/components/ui/Icons";
import { C } from "@/styles/tokens";

const NAME = "Joel";

export function ChatLauncher() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = (e: Event) => setOpen((e as CustomEvent<{ open: boolean }>).detail.open);
    window.addEventListener(CHAT_EVENT, on);
    return () => window.removeEventListener(CHAT_EVENT, on);
  }, []);

  return (
    <button type="button" data-chat-launcher onClick={toggleChat} aria-expanded={open}
      aria-label={open ? "Cerrar chat" : `Hablar con ${NAME}, asesor virtual`}
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
          {open ? "Cerrar" : NAME}
          {!open && <span className="rounded-full px-1.5 py-px text-[9px] font-bold tracking-wide" style={{ background: C.yellow, color: C.indigo }}>IA</span>}
        </span>
        {!open && <span className="block text-[11.5px] leading-tight" style={{ color: "rgba(255,255,255,0.7)" }}>En línea</span>}
      </span>
    </button>
  );
}
