// Canales de contacto. El número de WhatsApp es el mismo teléfono que muestra
// el sitio; cambiarlo aquí lo cambia en todo el sitio y en Joel.
const WHATSAPP_NUMBER = "573243586973"; // +57 324 358 6973 (celular)
export const WHATSAPP_LABEL = "324 358 6973";
const DEFAULT_MSG = "Hola, Transarchivos. Quisiera información sobre sus servicios de gestión documental.";

/** Enlace a WhatsApp con un mensaje ya escrito (wa.me abre la app o WhatsApp Web). */
export const whatsappUrl = (msg: string = DEFAULT_MSG) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

// Teléfonos (Informe Documento maestro): fijo de la sede y celular.
export const PHONES = [
  { label: "(601) 316-4530", tel: "+576013164530" },
  { label: "324 358 6973", tel: "+573243586973" },
];

// Celular de oficina que se lista en la política de privacidad (en lugar del comercial; pedido del cliente, nov. 2026).
export const OFFICE_PHONE_LABEL = "321 811 5946";

// ─── Formulario de contacto ────────────────────────────────────────────────
// Las solicitudes (formulario de contacto y cotizador) se envían a la función
// del sitio /api/contact, que las manda por Brevo al correo de la empresa
// (variables de entorno en Vercel; ver docs/07-formularios.md).
export const CONTACT_REASONS = ["Solicitar una cotización", "Información sobre un servicio", "Soporte a un servicio contratado", "Peticiones, quejas o reclamos", "Datos personales (Ley 1581)", "Trabajar con nosotros", "Otro"];

