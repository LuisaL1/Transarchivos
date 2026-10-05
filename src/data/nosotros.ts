

// Las 3 columnas del dropdown "Nosotros". Cada ítem enlaza a su propia
// sección en /nosotros (antes todos apuntaban al mismo #nosotros de la
// landing). "Aliados tecnológicos" se presenta en la página como "Tecnología
// y seguridad": no hay nombres de aliados/socios tecnológicos reales en los
// documentos fuente, así que el contenido real que sí existe (infraestructura
// de seguridad, control ambiental, air gap, nube) se muestra bajo un rótulo
// honesto, aunque el ancla se conserva como "aliados" por compatibilidad.
export const nosotrosGroups: { heading: string; items: { label: string; icon: string; anchor: string }[] }[] = [
  { heading: "La empresa", items: [
    { label: "Quiénes somos", icon: "building", anchor: "quienes-somos" },
    { label: "Nuestra historia", icon: "clock-history", anchor: "historia" },
    { label: "Misión y visión", icon: "bullseye", anchor: "mision-vision" },
  ] },
  { heading: "Equipo y cultura", items: [
    { label: "Nuestro equipo", icon: "people", anchor: "equipo" },
    { label: "Cultura", icon: "heart", anchor: "cultura" },
  ] },
  { heading: "Resultados", items: [
    { label: "Nuestros clientes", icon: "briefcase", anchor: "clientes" },
    { label: "Tecnología", icon: "cpu", anchor: "aliados" },
    { label: "Normativa", icon: "patch-check", anchor: "certificados" },
  ] },
];
