// Genera public/brand/email-header.png: el banner de los correos del sitio
// (api/contact.ts). Es una IMAGEN porque Gmail en modo oscuro invierte los
// colores del HTML y los clientes de correo ignoran las transformaciones CSS
// (el cuadrado girado no se puede hacer en el correo). Ver docs/07-formularios.md.
//
// Uso: pnpm email:header
// Después de regenerarlo, subir el "?v=" de la imagen en api/contact.ts para
// que Gmail no muestre la copia vieja en caché.
//
// Mismos elementos del sitio: fondo índigo de marca, logo en blanco (como en
// el pie de página), el cuadrado amarillo translúcido girado 45° con puntas
// redondeadas (detalle del chat y del menú) y el patrón de puntos.
import { chromium } from "@playwright/test";
import fs from "node:fs";

const OUT = "public/brand/email-header.png";
const INDIGO = "#1800AD";
const logo = fs.readFileSync("public/brand/logo.png").toString("base64");

// 560 × 110 px de CSS, renderizado a 2x → 1120 × 220 px
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  html, body { margin: 0; }
  .banner { position: relative; width: 560px; height: 110px; overflow: hidden; background: ${INDIGO}; }
  .dots { position: absolute; left: 381px; top: 21px; width: 96px; height: 48px;
    background-image: radial-gradient(rgba(255,255,255,.22) 1.1px, transparent 1.5px); background-size: 13px 13px; }
  /* Cuadrado del chat y del menú: amarillo al 22 %, girado 45°, puntas redondeadas (radio ≈ 17 % del lado) */
  .square { position: absolute; right: -28px; top: -30px; width: 100px; height: 100px;
    transform: rotate(45deg); border-radius: 17%; background: rgba(255,222,89,.22); }
  /* Logo en blanco: el PNG es azul; se vuelve blanco con el mismo filtro del pie de página */
  .logo { position: absolute; left: 29px; top: 29px; height: 52px; filter: brightness(0) invert(1); }
</style></head><body>
<div class="banner"><div class="dots"></div><div class="square"></div><img class="logo" src="data:image/png;base64,${logo}" alt=""></div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 560, height: 110 }, deviceScaleFactor: 2 });
await page.setContent(html, { waitUntil: "load" });
await page.locator(".banner").screenshot({ path: OUT });
await browser.close();
console.log(`${OUT}: ${(fs.statSync(OUT).size / 1024).toFixed(1)} KB`);
