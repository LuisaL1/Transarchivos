// Paleta del sitio (manual de marca de Transarchivos). Única fuente de verdad
// para los colores en el código: estilos en línea usan C.x; las clases de
// Tailwind usan los mismos tokens definidos en styles/index.css (@theme).
// Para cambiar un color del sitio, cámbielo aquí y en index.css.
export const C = {
  indigo: "#1800AD",   // índigo vivo: fondos, textos sobre blanco, botones, menú
  yellow: "#FFDE59",   // amarillo: botones de acción y acentos
  gold: "#C8960A",     // dorado: rótulos sobre fondo claro
  cream: "#FBFBF8",    // crema: secciones claras
  lavender: "#F1F3FB", // lavanda: fondos suaves
  border: "#E4E6F7",   // borde fino de tarjetas
  muted: "#6B6B6B",    // texto secundario
  faint: "#9B9B9B",    // texto terciario (fechas, notas)
  navy: "#272B7C",     // azul marino del manual: logo, correos y pasos 2 del modelo "Cómo trabajamos"
  navyDark: "#14163F", // azul marino oscuro: paso 4 del modelo "Cómo trabajamos"
} as const;
