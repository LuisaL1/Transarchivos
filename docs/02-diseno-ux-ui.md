# 2 · Diseño UX/UI

Basado en el **Manual de Identidad Visual** (`RecursosTransarchivos/`) y en las
decisiones tomadas con el cliente durante el prototipo (ver 05).

## Principios

1. **Corporativo y moderno, no "plantilla de IA":** pocos elementos, jerarquía
   clara, nada de adornos genéricos.
2. **Cero degradados.** En su lugar se usa el **detalle de esquina**: un cuadrado
   amarillo translúcido girado 45° asomando por la esquina superior derecha. Es
   el mismo del menú y el chat. Única excepción: la sombra negra superior del
   hero de inicio, pedida por el cliente.
3. **Sin caricaturas, excepto Joel**, el personaje de la marca.
4. **El motivo gráfico es la carpeta:**
   - pestaña de carpeta en la división del hero;
   - borde inferior con forma de carpeta en los heroes internos;
   - pestaña sobre los llamados finales;
   - carpetas en contorno como marca de agua.
5. **Un solo azul principal** (`#272B7C`) donde haya azul de marca, sobre todo en
   el menú. Nada "payaseado": no mezclar tonos de azul.
6. **Contenido real:** sin cifras, testimonios ni certificaciones inventadas.

## Tokens

### Color
| Token | Hex | Uso |
| --- | --- | --- |
| Azul marino (primario) | `#272B7C` | Fondos de marca, botones principales, títulos, menú |
| Índigo | `#1800AD` | Enlaces secundarios y acentos puntuales (nunca en el menú) |
| Amarillo | `#FFDE59` | Botón principal sobre azul, resaltados, detalle de esquina, palabra rotativa |
| Dorado | `#C8960A` | Rótulos (kickers) y paso 1 del modelo |
| Crema | `#FBFBF8` | Fondo de sección alterno |
| Lavanda | `#F1F3FB` / `#F7F8FF` | Fondo de sección alterno, pie de página |
| Borde | `#E4E6F7` | Borde de tarjetas |
| Texto | `#37352F` cuerpo · `#6B6B6B` secundario · `#9B9B9B` terciario | |
| Éxito | `#16A34A` sobre `#EAF7EE` | Checks de beneficios |

La lista completa de colores permitidos está en `tests/unit/content.test.ts`.
La prueba falla si aparece un color nuevo.

### Tipografía
| Rol | Fuente | Estilo |
| --- | --- | --- |
| Títulos | Poppins | 700; H1 `text-4xl md:text-5xl` (heroes internos), H2 `text-2xl md:text-3xl`, interlineado 1.1–1.2 |
| Rótulos y botones | Montserrat | 600–800; rótulo = `text-xs` mayúsculas, `tracking-widest`, dorado |
| Texto | Inter | 400–500; `text-sm`/`text-base`, interlineado 1.6–1.8 |

Resaltado de palabra clave en títulos: subrayado amarillo de corte duro
(`linear-gradient(transparent 62%, #FFDE59 62%)`). No se considera un degradado.

### Forma, sombra y espacio
- **Radios:**
  - tarjetas `rounded-2xl`/`rounded-3xl`;
  - botones `rounded-xl`;
  - etiquetas y píldoras `rounded-full`;
  - llamado final `rounded-[0_28px_28px_28px]` (la esquina recta es la de la pestaña).
- **Tarjeta estándar:** fondo blanco, borde de 1–1,5 px `#E4E6F7`, sombra suave
  azulada (`0 14px 30px -26px rgba(39,43,124,.45)`). Al pasar el mouse sube 4–6 px (`card-lift`).
- **Secciones:** `py-16`/`py-20`, contenedor `max-w-6xl px-6`. Se alternan
  crema y lavanda, separadas por `Divider` (línea de 1 px).
- **Navbar:** píldora blanca flotante sobre el hero. Al hacer scroll pasa a barra
  blanca completa de 64 px, con logo, enlaces, botón y los íconos de búsqueda y
  soporte centrados en la misma línea.

### Movimiento
| Animación | Dónde | Detalle |
| --- | --- | --- |
| Palabra rotativa | Título del hero | control · custodia · orden · legalidad · resguardo · protección, cada 2,6 s; el ancho de la píldora se ajusta |
| Aparición al hacer scroll | Secciones bajo el hero | Fundido + desplazamiento, escalonado en grillas |
| Mapa → video | `MapReveal` | Atado al scroll: mapa, pin pulsante en Bogotá y revelado circular del video |
| Indicador de pestañas | Selector del hero | Fondo amarillo que se desliza |
| Entrada de Joel | Poses entre secciones | Deslizamiento al entrar en pantalla |

Todo respeta `prefers-reduced-motion`.

## Estructura de páginas

### Inicio (`/`), en orden
1. **Hero** (pantalla dividida 50/50 desde `md`):
   - **Izquierda (panel azul):**
     - título "Sus archivos, bajo [palabra]" y subtítulo;
     - selector **"¿Qué necesitas hoy?"**: 4 pestañas (Organizar, Digitalizar,
       Custodiar, Destruir), cada una con detalle, "Ver servicio" y "Cotizar este servicio";
     - Joel de cuerpo entero junto al selector, desde `xl`, con la mano sobre la tarjeta.
       Solo su cuerpo recibe el clic, que abre el chat.
   - **Derecha:** videos del archivo.
   - **Unión:** pestaña de carpeta y carpeta en contorno recortada a la forma azul.
   - **Celular:** una sola columna, con el video detrás bajo un velo azul.
2. **Barra de confianza:** Ley 594 de 2000 · Norma AGN · Certificado de destrucción · Custodia con vigilancia 24 h.
3. **Mapa → video** (cobertura en Bogotá), con la silueta de Joel en súper zoom a la izquierda.
4. **Diagnóstico documental** (producto de entrada): propuesta, 4 pasos e "informe" de hallazgos.
5. **Servicios:** grilla de 9 tarjetas, luego la pose de Joel con cajas.
6. **Soluciones:** por necesidad del cliente; cada tarjeta lleva al cotizador con contexto.
7. **Modelo de trabajo:** 4 pasos (Diagnóstico → Solución → Protección → Expansión), luego Joel con iPad.
8. **Cotizador** (`#cotizador`).
9. **Blog:** artículo destacado + lista + suscripción.
10. **Videos y redes** (YouTube embebido en modo de privacidad).
11. **Preguntas frecuentes** (`#faq`), en acordeón con acceso al chat.
12. **Por qué Transarchivos** y **pie de página**.

### Páginas internas: formato común (servicios, Nosotros y artículos)
- Navbar en barra blanca (`SiteHeader solid`).
- **Hero azul** con foto de fondo bajo velo (`rgba(39,43,124,.88)`). Lleva:
  - botón de volver y ruta de navegación;
  - etiqueta amarilla, H1 y bajada amarilla;
  - dos botones: primario amarillo y secundario de contorno blanco;
  - a la derecha, una tarjeta translúcida de cifras o datos;
  - abajo, el borde con forma de carpeta.
- **Secciones** con rótulo dorado + H2 y tarjetas blancas; Joel en una pose
  relacionada con el tema (`SERVICE_JOEL` en `data/joelPoses.ts`).
- **Llamado final:** bloque azul con pestaña de carpeta, silueta de Joel,
  "Solicitar cotización" y teléfono.
- **Por página:**
  - **Servicio:** beneficios · proceso paso a paso · diferenciales · modalidades o
    público · normativa · servicios relacionados.
  - **Nosotros:** historia · misión y visión · equipo · cultura · clientes ·
    tecnología y seguridad · marco normativo.
  - **Artículo:**
    - cuerpo en una tarjeta blanca;
    - columna lateral con índice, "Más del blog" y preguntas frecuentes
      relacionadas con el tema. La tarjeta de diagnóstico y Joel quedan fijos
      al hacer scroll;
    - barra amarilla de progreso de lectura.

## Patrones de interacción
- **Megamenús:**
  - tarjeta destacada azul a la izquierda (con detalle de esquina) y opciones con ícono a la derecha;
  - abren al pasar el mouse y con clic. El menú de celular (panel) se cierra con Esc.
  - Pendiente de accesibilidad: cerrar también los megamenús de escritorio con Esc.
- **Buscador:**
  - ventana tipo "command palette" sobre fondo oscurecido, con atajos (Servicios, Soluciones, Cotizar, FAQ);
  - busca sin tildes, desde 2 caracteres, máximo 7 resultados.
- **Soporte (audífonos):** tarjeta con chat, teléfono, correo y preguntas frecuentes.
- **Chat de Joel:**
  - botón flotante abajo a la derecha, con ventana de mensajes uno a uno e
    indicador de "escribiendo";
  - opciones rápidas y texto libre;
  - invitación a los 7 s, una vez por sesión y solo cuando Joel no está visible en el hero.
- **Cotizador:** ver 03.

## Responsive
| Punto | Ancho | Cambios principales |
| --- | --- | --- |
| base | < 640 | Una columna; navbar con menú de panel; chat ocupa la pantalla; Joel oculto |
| `md` | ≥ 768 | Hero dividido 50/50, pestaña de carpeta y silueta del mapa visibles |
| `lg` | ≥ 1024 | Grillas de 3–4 columnas, columna lateral del artículo, poses de Joel en páginas |
| `xl` | ≥ 1280 | Navbar de escritorio completa; Joel junto al selector del hero |

Verificado en 390, 1024, 1280, 1440 y 1920 px.

## Accesibilidad
- `lang="es"`, jerarquía de encabezados, textos alternativos (las imágenes
  decorativas llevan `alt=""` y `aria-hidden`).
- Foco visible con anillo de 2 px. El selector del hero usa el patrón ARIA de
  pestañas (`tablist`/`tab`/`tabpanel`).
- Formularios con `label` asociado. Los diálogos (buscador, aviso de cookies) llevan `role="dialog"`.
- Las capas ocultas usan `inert`, y el movimiento se reduce con `prefers-reduced-motion`.
- **Pendiente:** contraste AA de los rótulos dorados y de algunos grises
  terciarios (tabla en `TESTING.md`). Requiere aprobación del cliente.
