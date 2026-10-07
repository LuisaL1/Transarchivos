// Pose de Joel (kit de marca) asociada a cada servicio.
import cajas from "@/assets/images/joel/joel-moviendo-cajas.webp";
import ipad from "@/assets/images/joel/joel-ipad.webp";
import conCajas from "@/assets/images/joel/joel-con-cajas.webp";
import copia from "@/assets/images/joel/joel-copia.png";
import trd from "@/assets/images/joel/joel-trd.webp";
import apuntes from "@/assets/images/joel/joel-apuntes.webp";
import escaneando from "@/assets/images/joel/joel-escaneando.png";
import documento from "@/assets/images/joel/joel-documento.webp";
import clasificando from "@/assets/images/joel/joel-clasificando.webp";
import microfilmando from "@/assets/images/joel/joel-microfilmando.webp";
import digitalizando from "@/assets/images/joel/joel-digitalizando.webp";
import triturando from "@/assets/images/joel/joel-triturando.webp";
import telefono from "@/assets/images/joel/joel-telefono.webp";
import levantandoCajas from "@/assets/images/joel/joel-levantando-cajas.webp";

export const JOEL = { cajas, ipad, conCajas, copia, trd, apuntes, escaneando, documento, clasificando };

// Pose de cada servicio en su página ("Joel en acción"). `height` = alto de la
// figura en px: las escenas anchas (escritorio con equipo) van un poco más bajas.
export const SERVICE_JOEL: Record<string, { src: string; height: number }> = {
  "levantamiento-de-inventario": { src: clasificando, height: 300 },
  "programa-de-gestion-documental": { src: trd, height: 270 },
  "custodia-de-medios-magneticos": { src: ipad, height: 300 },
  "custodia-de-archivos": { src: levantandoCajas, height: 310 },
  "digitalizacion-de-documentos": { src: digitalizando, height: 280 },
  "destruccion-de-documentos": { src: triturando, height: 300 },
  "microfilmacion-de-archivos": { src: microfilmando, height: 270 },
  "servicio-inhouse": { src: apuntes, height: 300 },
  "servicio-inmediato": { src: telefono, height: 310 },
};
