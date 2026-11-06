// Poses de Joel (kit de marca en alta resolución, recortadas a 2000 px en WebP).
import cajas from "@/assets/images/joel/joel-moviendo-cajas.webp";
import trd from "@/assets/images/joel/joel-trd.webp";
import apuntes from "@/assets/images/joel/joel-apuntes.webp";
import documento from "@/assets/images/joel/joel-documento.webp";
import clasificando from "@/assets/images/joel/joel-clasificando.webp";
import microfilmando from "@/assets/images/joel/joel-microfilmando.webp";
import digitalizando from "@/assets/images/joel/joel-digitalizando.webp";
import triturando from "@/assets/images/joel/joel-triturando.webp";
import telefono from "@/assets/images/joel/joel-telefono.webp";
import estanteria from "@/assets/images/joel/joel-estanteria.webp";
import levantandoCajas from "@/assets/images/joel/joel-levantando-cajas.webp";
import bata from "@/assets/images/joel/joel-bata.webp";
import notas from "@/assets/images/joel/joel-notas.webp";
import legal from "@/assets/images/joel/joel-legal.webp";
// Joel leyendo la historia de Transarchivos junto a la biblioteca (imagen del cliente, oct. 2026; fondo recortado)
import historia from "@/assets/images/joel/joel-historia.webp";

export const JOEL = { cajas, trd, apuntes, documento, clasificando, levantandoCajas, bata, notas, legal, telefono, historia };

// Pose de cada servicio en su página ("Joel en acción"). `height` = alto de la
// figura en px: las escenas anchas (escritorio con equipo) van un poco más bajas.
export const SERVICE_JOEL: Record<string, { src: string; height: number }> = {
  "levantamiento-de-inventario": { src: clasificando, height: 300 },
  "programa-de-gestion-documental": { src: trd, height: 270 },
  "custodia-de-medios-magneticos": { src: bata, height: 300 },
  "custodia-de-archivos": { src: levantandoCajas, height: 310 },
  "digitalizacion-de-documentos": { src: digitalizando, height: 280 },
  "destruccion-de-documentos": { src: triturando, height: 300 },
  "microfilmacion-de-archivos": { src: microfilmando, height: 270 },
  "servicio-inhouse": { src: apuntes, height: 300 },
  // Joel al teléfono junto a la estantería con cajas (imagen del cliente, oct. 2026): escena ancha, un poco más baja
  "servicio-inmediato": { src: estanteria, height: 280 },
};
