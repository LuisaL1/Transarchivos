import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), {
    // En desarrollo (pnpm dev) /api/contact se simula: no envía correos.
    name: 'dev-contact-mock',
    configureServer(server) {
      server.middlewares.use('/api/contact', (req, res) => {
        let body = ''
        req.on('data', c => { body += c })
        req.on('end', () => {
          console.log('[dev] /api/contact (simulado):', body.slice(0, 400))
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ ok: true, simulated: true }))
        })
      })
    },
  }, {
    // En desarrollo, /api/advisor responde "no configurado" (como el sitio
    // publicado hoy: se usa el puente con Zoho). Con ADVISOR_MOCK=1 pnpm dev
    // se simula la API: un "asesor" de prueba responde a los pocos segundos.
    // Ver docs/08-chat-asesor.md.
    name: 'dev-advisor-mock',
    configureServer(server) {
      const mock = process.env.ADVISOR_MOCK === '1'
      let started = 0
      let sent = false
      server.middlewares.use('/api/advisor', (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        if (req.method === 'GET') return res.end(JSON.stringify({ configured: mock }))
        if (!mock) { res.statusCode = 503; return res.end(JSON.stringify({ ok: false, error: 'not-configured' })) }
        let body = ''
        req.on('data', c => { body += c })
        req.on('end', () => {
          const b = JSON.parse(body || '{}') as { action?: string; after?: number }
          console.log('[dev] /api/advisor (simulado):', body.slice(0, 300))
          if (b.action === 'start') { started = Date.now(); sent = false; return res.end(JSON.stringify({ ok: true, token: 'dev.token' })) }
          if (b.action === 'poll' && !sent && Date.now() - started > 5000) {
            sent = true
            const now = Date.now()
            return res.end(JSON.stringify({ ok: true, messages: [
              { id: '1', seq: 1, from: 'system', name: 'Laura (prueba)', text: 'joined', time: now },
              { id: '2', seq: 2, from: 'operator', name: 'Laura (prueba)', text: '¡Hola! Soy Laura, asesora de Transarchivos (mensaje simulado). ¿En qué le ayudo?', time: now },
            ] }))
          }
          res.end(JSON.stringify({ ok: true, messages: [] }))
        })
      })
    },
  }],
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
