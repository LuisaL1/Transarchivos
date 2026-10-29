

// Las 3 columnas del dropdown "Nosotros". Cada ítem enlaza a su propia
// sección en /nosotros. La sección "Tecnología y seguridad" se retiró a pedido
// del cliente (documento del 29 de octubre de 2026).
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
    { label: "Normativa", icon: "patch-check", anchor: "certificados" },
  ] },
];
