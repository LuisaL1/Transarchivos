import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    // Los logos del carrusel de clientes nunca se incrustan en el JS (son 222
    // archivos pequeños: incrustados inflaban el bundle principal a más de 1 MB).
    assetsInlineLimit: (file: string) => (file.includes('/assets/images/clientes/') ? false : undefined),
    // Librerías en un archivo aparte: se guardan en caché entre versiones del sitio.
    rollupOptions: {
      output: {
        manualChunks: (id: string) => (/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(id) ? 'vendor' : undefined),
      },
    },
  },
  server: {
    port: 8443,
  },
})
