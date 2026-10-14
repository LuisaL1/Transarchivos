import { Suspense, type ComponentProps } from "react";
import type { ChatBot as ChatBotType } from "./ChatBot";
import { lazyNamed } from "@/lib/lazyPage";

// El chat (ventana + cerebro de Joel + su conocimiento) es la pieza de código
// más grande del sitio y no hace falta para pintar la página: se descarga
// aparte. El HTML pre-generado ya trae el botón de Joel; mientras llega el
// trozo, la hidratación lo deja tal cual (sin fallback).
const ChatBotImpl = lazyNamed<ComponentProps<typeof ChatBotType>>("chat", () => import("./ChatBot"), "ChatBot");

export function ChatBot(props: ComponentProps<typeof ChatBotImpl>) {
  return <Suspense fallback={null}><ChatBotImpl {...props} /></Suspense>;
}
export const preloadChat = ChatBotImpl.preload;
