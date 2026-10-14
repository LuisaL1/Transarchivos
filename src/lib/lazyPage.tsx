import { lazy, type ComponentType } from "react";

// Componentes de carga perezosa (code-splitting) compatibles con la
// pre-generación: en el navegador se comportan como React.lazy (el trozo se
// descarga al navegar; mientras tanto la hidratación conserva el HTML ya
// generado). En el servidor, scripts/prerender.mjs llama antes a preload()
// de cada uno, así nada queda en suspenso y el HTML sale completo, sin los
// <script> en línea que React agrega para destapar contenido tardío (la
// Política de Seguridad de Contenido del sitio los prohíbe).
const loaded = new Map<string, ComponentType<never>>();

export function lazyNamed<P extends object = object>(key: string, load: () => Promise<Record<string, unknown>>, name: string) {
  const Lazy = lazy(async () => ({ default: (await load())[name] as ComponentType<P> }));
  function Loaded(props: P) {
    const Ready = loaded.get(key) as ComponentType<P> | undefined;
    return Ready ? <Ready {...props} /> : <Lazy {...props} />;
  }
  Loaded.preload = async () => { loaded.set(key, (await load())[name] as ComponentType<never>); };
  return Loaded;
}
