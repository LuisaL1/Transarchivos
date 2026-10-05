# 4 · Calidad, pruebas y seguridad

La guía operativa (comandos, primer uso) está en `TESTING.md`. Este documento
explica la **estrategia**.

## Pirámide de pruebas

```
            ┌───────────────────────────┐
            │  E2E + accesibilidad + CSP │  Playwright · axe   (tests/e2e)
            ├───────────────────────────┤
            │  Componentes               │  Testing Library    (tests/unit/components)
            ├───────────────────────────┤
            │  Lógica · contenido ·      │  Vitest             (tests/unit, tests/security)
            │  seguridad estática        │
            ├───────────────────────────┤
            │  Tipos · lint              │  tsc · ESLint
            └───────────────────────────┘
```

| Capa | Qué protege | Archivo(s) |
| --- | --- | --- |
| Tipos | Contratos entre datos y componentes | `tsconfig.json` (estricto) |
| Lint | Calidad, hooks de React, accesibilidad en JSX (jsx-a11y), patrones inseguros (eslint-plugin-security); prohíbe `dangerouslySetInnerHTML` y `eval` | `eslint.config.js` |
| Joel | Entiende texto libre y errores de tipeo; no inventa precios ni ISO 9001; responde Bogotá; rechaza inyección y temas ajenos; no repite HTML | `tests/unit/joel.test.ts` |
| Buscador | Sin tildes, mínimo 2 caracteres, máximo 7 resultados, todos con destino | `tests/unit/search.test.ts` |
| Contenido | Integridad de `src/data` y reglas de negocio y de marca (ver abajo) | `tests/unit/content.test.ts` |
| Componentes | El selector del hero cambia de servicio y apunta a la cotización correcta | `tests/unit/components.test.tsx` |
| Seguridad estática | Sin inyección de HTML, enlaces externos seguros, sin `http://`, sin secretos, solo variables `VITE_` permitidas, sin `.env` versionado, cabeceras completas | `tests/security/static.test.ts` |
| E2E | Rutas sin errores de consola ni recursos rotos; recorridos principales | `tests/e2e/smoke.spec.ts`, `flows.spec.ts` |
| CSP real | Aplica las cabeceras de `vercel.json` sobre el build y falla si el navegador bloquea algo | `tests/e2e/csp.spec.ts` |
| Accesibilidad | WCAG 2.1 A/AA con axe, en escritorio y celular | `tests/e2e/a11y.spec.ts` |

### Reglas de negocio y marca automatizadas
`content.test.ts` falla si:
- algún texto dice "ISO 9001";
- hay textos de relleno (lorem ipsum, TODO, FIXME);
- aparece un color fuera de la lista blanca;
- aparece un degradado de color (se permiten los subrayados y líneas punteadas de corte duro);
- un servicio no tiene página de detalle, pose de Joel o configuración del cotizador;
- una solución o el menú apunta a un servicio inexistente.

## Seguridad

| Medida | Implementación |
| --- | --- |
| CSP | `default-src 'self'`; scripts solo propios y de Google Tag Manager (sin `unsafe-inline` ni `unsafe-eval`); iframes solo de youtube-nocookie; `object-src 'none'`; `frame-ancestors 'none'` |
| Transporte | HSTS de 2 años con `preload`; `upgrade-insecure-requests` |
| Otras cabeceras | `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (cámara, micrófono, ubicación, pagos y USB desactivados), `Cross-Origin-Opener-Policy: same-origin` |
| Datos personales | No se envían a ningún servidor: el cotizador y el chat arman un `mailto:`. El perfil de Joel queda solo en el navegador del visitante. GA4 sin cookies hasta el consentimiento. |
| Dependencias | `pnpm test:deps` (auditoría alta/crítica) en local y en CI; Dependabot semanal |
| Secretos | Prueba estática + gitleaks sobre todo el historial en CI |

**Al agregar un backend o un servicio de formularios:**
1. Agregar su dominio a `connect-src` (y `form-action` si aplica) en `vercel.json`.
2. Validar y sanear en el servidor. No confiar en las validaciones del navegador.
3. Agregar protección anti-spam (honeypot o captcha) y límite de solicitudes.
4. Actualizar el aviso de privacidad (Ley 1581 de 2012).

## Integración continua (`.github/workflows/ci.yml`)
Corre en cada push y pull request a `main`:

1. **Calidad:** typecheck → lint → pruebas con cobertura → build → control de
   tamaño (falla si un JS supera 600 KB).
2. **Seguridad:** auditoría de dependencias → pruebas de seguridad → gitleaks.
3. **E2E:** instala Chromium → Playwright (escritorio y celular) → sube el
   reporte HTML como artefacto (14 días).

## Definición de "terminado"
- [ ] `pnpm check:all` en verde.
- [ ] Contenido nuevo en `src/data/`, respaldado por `RecursosTransarchivos/`.
- [ ] Lógica nueva con prueba unitaria; página o recorrido nuevo con prueba E2E y de accesibilidad.
- [ ] Revisado en 390 px y 1440 px.
- [ ] Sin colores nuevos ni degradados (o lista blanca actualizada con aprobación).
- [ ] Servicio externo nuevo agregado a la CSP.
