# Documentación técnica · Sitio web Transarchivos

Documentación de entrega para el equipo de desarrollo. Complementa (no
reemplaza) a los documentos de la raíz del repositorio:

| Documento | Para qué sirve |
| --- | --- |
| `README.md` (raíz) | Instalación, comandos, despliegue y **pendientes de desarrollo** |
| `AGENTS.md` (raíz) | Reglas cortas del proyecto (también las leen los asistentes de IA) |
| `TESTING.md` (raíz) | Guía operativa del entorno de pruebas |
| `docs/01-arquitectura.md` | Stack, estructura de carpetas, rutas, flujo de datos, componentes clave, Joel |
| `docs/02-diseno-ux-ui.md` | Sistema de diseño, estructura de cada página, patrones de interacción, responsive, accesibilidad |
| `docs/03-conversion-y-analitica.md` | Embudo, puntos de conversión, cotizador, chat, eventos de GA4 y consentimiento |
| `docs/04-calidad-pruebas-y-seguridad.md` | Estrategia de calidad: qué se prueba, por qué y cómo extenderla |
| `docs/05-decisiones-y-pendientes.md` | Decisiones tomadas con el cliente (no revertir) y trabajo pendiente priorizado |

**Fuente de verdad del contenido:** `RecursosTransarchivos/` (documentos del
cliente). Todo texto del sitio sale de ahí y vive en `src/data/`.

**Estado (octubre de 2026):** prototipo funcional completo, sin backend. El
sitio está marcado `noindex` hasta su publicación oficial.
