/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** ID de medición de Google Analytics 4 (G-XXXXXXXXXX). Opcional. */
  readonly VITE_GA_MEASUREMENT_ID?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
