// Pose de Joel (kit de marca) asociada a cada servicio.
import cajas from "@/assets/images/joel/joel-moviendo-cajas.png";
import ipad from "@/assets/images/joel/joel-ipad.png";
import conCajas from "@/assets/images/joel/joel-con-cajas.png";
import copia from "@/assets/images/joel/joel-copia.png";
import trd from "@/assets/images/joel/joel-trd.png";
import apuntes from "@/assets/images/joel/joel-apuntes.png";
import escaneando from "@/assets/images/joel/joel-escaneando.png";
import documento from "@/assets/images/joel/joel-documento.png";
import clasificando from "@/assets/images/joel/joel-clasificando.png";

export const JOEL = { cajas, ipad, conCajas, copia, trd, apuntes, escaneando, documento, clasificando };

export const SERVICE_JOEL: Record<string, { src: string; height: number }> = {
  "levantamiento-de-inventario": { src: clasificando, height: 230 },
  "programa-de-gestion-documental": { src: trd, height: 200 },
  "custodia-de-medios-magneticos": { src: ipad, height: 250 },
  "custodia-de-archivos": { src: conCajas, height: 260 },
  "digitalizacion-de-documentos": { src: escaneando, height: 250 },
  "destruccion-de-documentos": { src: documento, height: 250 },
  "microfilmacion-de-archivos": { src: copia, height: 250 },
  "servicio-inhouse": { src: apuntes, height: 250 },
  "servicio-inmediato": { src: cajas, height: 240 },
};
