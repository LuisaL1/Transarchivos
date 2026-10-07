// Canales de contacto. El número de WhatsApp es el mismo teléfono que muestra
// el sitio; cambiarlo aquí lo cambia en todo el sitio y en Joel.
export const WHATSAPP_NUMBER = "576013164530"; // +57 (601) 316-4530
export const WHATSAPP_LABEL = "(601) 316-4530";
const DEFAULT_MSG = "Hola, Transarchivos. Quisiera información sobre sus servicios de gestión documental.";

/** Enlace a WhatsApp con un mensaje ya escrito (wa.me abre la app o WhatsApp Web). */
export const whatsappUrl = (msg: string = DEFAULT_MSG) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
