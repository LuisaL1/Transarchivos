# Entorno de pruebas

Cubre calidad de código, contenido, funcionamiento, accesibilidad y seguridad.
Todo corre en local con un comando, y en GitHub Actions en cada push y en cada
pull request a `main` (`.github/workflows/ci.yml`).

## Primer uso

```bash
pnpm install
pnpm exec playwright install chromium   # navegador para las pruebas de extremo a extremo
```

## Comandos

| Comando | Qué revisa | Tiempo aprox. |
| --- | --- | --- |
| `pnpm check` | Tipos + lint + pruebas unitarias + build. **Correr antes de cada commit.** | ~10 s |
| `pnpm check:all` | Lo anterior + auditoría de dependencias + extremo a extremo | ~1 min |
| `pnpm typecheck` | TypeScript estricto | |
| `pnpm lint` | ESLint: calidad, hooks de React, accesibilidad (jsx-a11y) y patrones inseguros (eslint-plugin-security) | |
| `pnpm test` | Pruebas unitarias, de contenido y de seguridad estática (Vitest) | |
| `pnpm test:watch` | Igual, en modo observación mientras se desarrolla | |
| `pnpm test:coverage` | Igual, con cobertura de `src/lib`, `src/data` y `src/hooks` (reporte en `coverage/`) | |
| `pnpm test:security` | Solo las pruebas de seguridad estática | |
| `pnpm test:deps` | Vulnerabilidades conocidas en todas las dependencias (nivel alto o crítico) | |
| `pnpm test:e2e` | Playwright sobre el build de producción, en escritorio (1440 px) y celular (Pixel 7) | ~30 s |

Para probar las pruebas de extremo a extremo contra otro entorno (por ejemplo,
una URL de Vercel Preview): `BASE_URL=https://su-preview.vercel.app pnpm test:e2e`.
El reporte HTML queda en `playwright-report/` (`pnpm exec playwright show-report`).

## Qué cubre cada capa

### 1. Calidad de código
- **TypeScript estricto** (`tsconfig.json`).
- **ESLint** (`eslint.config.js`): reglas recomendadas de JS y TypeScript, reglas
  de hooks de React, accesibilidad en JSX y patrones inseguros. Prohíbe
  `dangerouslySetInnerHTML` y `eval`.
- **Build** sin errores. En CI falla si un bundle JS pasa de 600 KB.

### 2. Lógica y contenido (`tests/unit/`)
- `joel.test.ts`: el asesor virtual entiende texto libre y errores de tipeo, no
  inventa precios ni certificaciones, responde que operan en Bogotá, rechaza
  intentos de manipulación (*prompt injection*), redirige temas ajenos y no
  repite HTML/scripts del visitante.
- `search.test.ts`: buscador del header (sin tildes, mínimo 2 letras, máximo 7
  resultados, todos con destino).
- `content.test.ts`: integridad de `src/data/` (slugs únicos; cada servicio con
  página, pose de Joel y cotizador; soluciones y menú apuntan a servicios
  existentes) y reglas de negocio de `AGENTS.md`:
  - nunca "ISO 9001";
  - sin textos de relleno;
  - **solo colores de la paleta** (lista blanca: para añadir un color hay que
    agregarlo a propósito);
  - **sin degradados de color**.
- `components.test.tsx`: el selector "¿Qué necesitas hoy?" cambia de servicio
  y apunta a la cotización correcta.

### 3. Seguridad
- **Estática** (`tests/security/static.test.ts`):
  - sin inyección de HTML ni `eval`;
  - enlaces externos con `rel="noreferrer"`;
  - sin `http://` inseguro;
  - sin credenciales ni llaves en el código;
  - solo la variable de entorno pública permitida (`VITE_GA_MEASUREMENT_ID`);
  - ningún `.env` real versionado;
  - cabeceras de seguridad presentes en `vercel.json`.
- **Cabeceras HTTP** (`vercel.json`): Content-Security-Policy, HSTS,
  `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`,
  `Permissions-Policy` y `Cross-Origin-Opener-Policy`. La CSP no permite
  scripts en línea ni `eval`. Solo autoriza: Google Analytics/Tag Manager,
  Google Fonts, miniaturas de YouTube y el reproductor de youtube-nocookie.
- **CSP en el navegador** (`tests/e2e/csp.spec.ts`): aplica las cabeceras de
  `vercel.json` sobre el build y falla si el navegador bloquea algún recurso.
  **Si agrega un servicio externo** (formulario, mapa, chat, CDN), añádalo a la
  CSP de `vercel.json`, o esta prueba fallará.
- **Dependencias**:
  - `pnpm test:deps` en local y en CI;
  - Dependabot (`.github/dependabot.yml`) abre PRs semanales de actualización;
  - en CI, **gitleaks** busca secretos en todo el historial de git.

### 4. Funcionamiento de extremo a extremo (`tests/e2e/`)
- `smoke.spec.ts`: cada ruta carga sin errores de JavaScript, sin recursos
  rotos, con título y `<h1>`; una ruta inexistente muestra su aviso.
- `flows.spec.ts`:
  - pestañas del hero;
  - menú Servicios → página del servicio;
  - buscador sin tildes;
  - chat de Joel con texto libre;
  - índice del artículo y preguntas frecuentes.

### 5. Accesibilidad (`tests/e2e/a11y.spec.ts`)
axe-core con WCAG 2.1 A/AA en inicio, Nosotros, un servicio y un artículo.
Bloquea con cualquier problema crítico o grave. Para que axe vea todo el
contenido, las animaciones se desactivan (`prefers-reduced-motion`).

**Pendiente conocido: contraste de color.** Hoy se reporta como anotación
"pendiente", sin bloquear, porque depende de colores del diseño que debe
aprobar el cliente:

| Elemento | Color actual | Contraste | Mínimo AA |
| --- | --- | --- | --- |
| Rótulos dorados ("Lo que obtiene", "Siga leyendo"…) | `#C8960A` sobre claro | ~2.5:1 | 4.5:1 |
| Textos secundarios pequeños (descripciones, fechas, notas) | `#9B9B9B` / `#8A8A8A` sobre blanco | 2.7–3.5:1 | 4.5:1 |
| Encabezado del paso 1 del modelo (texto blanco) | blanco sobre `#C8960A` | 2.7:1 | 3:1 (texto grande) |

Una vez corregido, active el modo estricto (`A11Y_STRICT=1 pnpm test:e2e`) y
déjelo fijo en `tests/e2e/a11y.spec.ts`.

## Al agregar funcionalidad
1. Contenido nuevo → en `src/data/` (las pruebas de contenido lo validan solas).
2. Lógica nueva en `src/lib/` → prueba en `tests/unit/`.
3. Página o recorrido nuevo → agregue la ruta a `smoke.spec.ts` y `a11y.spec.ts`
   y, si tiene interacción, un caso en `flows.spec.ts`.
4. Servicio externo nuevo → CSP en `vercel.json`.
5. `pnpm check:all` en verde antes de abrir el PR.
