# 3 · Conversión y analítica

## Estrategia
El producto de entrada es el **diagnóstico documental**: el cliente aún no sabe
qué necesita, y el diagnóstico baja la fricción ("antes de mover un solo papel").
Todo el sitio empuja hacia **una solicitud de cotización con datos útiles para
Comercial** (variables tomadas de "LÓGICA DE COTIZACIÓN TRANSARCHIVOS").

```
Visita ─► Interés (servicio, solución, artículo, mapa)
       ─► Intención ("Cotizar este servicio", chat, buscador)
       ─► Cotizador (4 pasos) o chat (guion de cotización)
       ─► Correo prellenado a info@transarchivos.com  ◄── conversión (generate_lead / contact_click)
```

## Puntos de conversión

| Punto | Dónde | Destino |
| --- | --- | --- |
| "Solicitar cotización" | Navbar (siempre visible), heroes internos, llamados finales | `#cotizador` |
| Selector "¿Qué necesitas hoy?" | Hero | Página del servicio o cotizador con el servicio elegido |
| Tarjetas de servicio | Inicio, servicios relacionados | Página del servicio |
| "Cotizar esta solución" | Soluciones (toda la tarjeta es clicable) | Cotizador con servicio y solución |
| Diagnóstico documental | Sección propia, tarjeta del menú, columna del artículo | Cotizador |
| Chat de Joel | Botón flotante, Joel del hero, FAQ, soporte | Guion de cotización o asesor |
| WhatsApp y correo | Navbar (soporte), menú de celular, chat de Joel, FAQ, pie, llamados finales | `https://wa.me/576013164530` con mensaje prellenado (`data/contact.ts`) / `mailto:` |
| Suscripción al blog | Sección Blog | **Sin conectar** (solo muestra un mensaje de éxito) |

## Cotizador (`QuoteSimulator`)
Cuatro pasos con barra de progreso: **Servicio → Detalles → Contacto → Resumen**.

1. **Servicio:** el diagnóstico o uno de los 9 servicios. Cambiar de servicio borra las respuestas.
2. **Detalles:**
   - volumen y preguntas propias del servicio (`data/quote.ts`), ubicación,
     urgencia y requerimientos especiales;
   - cada pregunta admite "No lo sé", para no frenar al usuario;
   - un medidor de **completitud** en vivo muestra qué tan lista está la
     solicitud. No es un precio: el sitio no muestra precios porque no existen tarifas oficiales.
3. **Contacto:** empresa, sector, nombre, cargo, correo y teléfono (requeridos).
4. **Resumen:**
   - todo lo ingresado;
   - ubicación en el modelo (Entrada/Solución/Protección/Expansión) y servicios complementarios sugeridos;
   - **siguiente paso** calculado:
     - *Completar la información:* falta el volumen o hay 2 o más "No lo sé";
     - *Validación de Operaciones:* es urgente o tiene requerimientos especiales;
     - *Cotización según parámetros:* en cualquier otro caso.
   - botón que abre un **correo prellenado** a info@transarchivos.com.

Se puede entrar directo al paso 2 con `?servicio=<slug>&solucion=<id>#cotizador`.

## Chat de Joel como canal de conversión
- **Inicio:** cotizar · conocer servicios · preguntas frecuentes · hablar con un asesor.
- **Guion de cotización:** servicio → volumen → urgencia → nombre → empresa →
  resumen con correo prellenado.
- **Texto libre:** `lib/joel.ts` detecta la intención y ofrece la acción adecuada
  ("Cotizar este servicio", ver página, asesor). Ante objeciones responde con
  argumentos de los documentos fuente.
- **Saludo personalizado según el perfil:**
  - comprador: "¿retomamos su cotización de X?";
  - técnico: enfocado en contenido;
  - recurrente: le da la bienvenida de nuevo.

## Analítica (GA4)
- **Propiedad:** ID de medición `G-PNPFD16QSZ`. Local: `.env.production.local` (no versionado; `pnpm dev` no envía datos). Producción: variable `VITE_GA_MEASUREMENT_ID` en Vercel (entorno Production). Verificación automática: `pnpm test:ga`.
- Se activa solo con `VITE_GA_MEASUREMENT_ID`. Sin la variable no se carga nada.
- **Consent Mode v2:** analítica denegada por defecto hasta que el visitante
  acepta en el aviso de cookies (Ley 1581 de 2012). La publicidad siempre queda denegada.
- La SPA envía `page_view` manualmente en cada cambio de ruta.

| Evento | Cuándo | Parámetros |
| --- | --- | --- |
| `page_view` | Cada ruta | `page_path`, `page_location`, `page_title` |
| `generate_lead` | Clic en "enviar" del resumen del cotizador | `method: "cotizador"`, `service`, `solution` |
| `contact_click` | Cualquier enlace de WhatsApp, `tel:` o `mailto:` del sitio | `method`: `whatsapp` · `phone` · `email` · `email_quote` (correo con asunto, del chat o del cotizador) |
| `chat_open` | Se abre el chat | — |
| `search` | Se elige un resultado del buscador | `search_term` |

**Recomendado al conectar GA4:**
- marcar `generate_lead` y `contact_click` como eventos clave (conversiones);
- crear un embudo: page_view → (chat_open | search) → generate_lead.

**Brechas conocidas (para el backlog):**
- El comentario de `lib/analytics.ts` menciona "preguntas a Joel", pero ese
  evento no existe. Propuesta: `chat_message` con la intención detectada (sin
  el texto del usuario, por privacidad).
- Faltan eventos de embudo del cotizador (`quote_step` con el paso y el
  servicio) para medir el abandono por paso.
- La conversión real ocurre en el cliente de correo del visitante. Con un
  backend se podría medir el envío efectivo.

## Señales de confianza usadas
- Normativa real (Ley 594 de 2000, AGN, Ley 1581, Ley 527).
- Más de 40 años de trayectoria (desde 1983).
- Vigilancia 24 h y certificado de destrucción.
- Sede en Bogotá.
- Software propio (Mido).

**No usar:** ISO 9001, testimonios o logos de clientes sin autorización, ni cifras
que no estén en los documentos.

## Protección de datos (Ley 1581 de 2012)
- Política del sitio en `/privacidad` (`PrivacyPage`): qué datos recoge cada canal, finalidad, cookies, derechos y plazos (consultas 10 días hábiles, reclamos 15).
- Autorización obligatoria y sin marcar por defecto en el cotizador (paso Contacto) y en la suscripción; el correo de cotización incluye la constancia.
- El chat informa el uso de los datos antes de pedir el nombre.
- El aviso de cookies enlaza a la política; desde ella el visitante puede cambiar su decisión (`resetConsent`).
