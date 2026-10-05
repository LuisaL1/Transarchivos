import { useLayoutEffect, useState } from "react";

// "Reducir movimiento" del sistema. Empieza en false (igual que el HTML
// pre-generado en el servidor) y se lee del navegador antes de pintar, para
// que la hidratación no encuentre diferencias.
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useLayoutEffect(() => { setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches); }, []);
  return reduced;
}
