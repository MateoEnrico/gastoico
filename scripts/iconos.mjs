// Genera el favicon y los PNG para instalar la app (PWA) a partir del símbolo de la marca.
// Uso: node scripts/iconos.mjs
import { writeFileSync } from "node:fs";
import sharp from "sharp";

const CIPRES = "#24493F";
const BRONCE = "#C8892B";
// La "g" de Young Serif pasada a curvas: la misma que src/lib/marca.ts.
const { LETRA_G } = await import("../src/lib/marca.ts").catch(async () => {
  const fuente = (await import("node:fs")).readFileSync(new URL("../src/lib/marca.ts", import.meta.url), "utf8");
  return { LETRA_G: fuente.match(/LETRA_G =\s*"([^"]+)"/)[1] };
});

const moneda = `<circle cx="24" cy="24" r="15" fill="${BRONCE}"/><circle cx="24" cy="24" r="12" fill="none" stroke="${CIPRES}" stroke-opacity=".4" stroke-width="1.1"/><path d="${LETRA_G}" fill="${CIPRES}"/>`;
const svg = (viewBox, fondo) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${fondo}${moneda}</svg>`;

// Con esquinas redondeadas: navegador y Android.
const redondeado = svg("0 0 48 48", `<rect width="48" height="48" rx="12" fill="${CIPRES}"/>`);
// A sangre: iOS recorta el ícono a su forma.
const cuadrado = svg("0 0 48 48", `<rect width="48" height="48" fill="${CIPRES}"/>`);
// "Maskable": la moneda dentro de la zona segura, por si Android lo recorta en círculo.
const maskable = svg("-8 -8 64 64", `<rect x="-8" y="-8" width="64" height="64" fill="${CIPRES}"/>`);

writeFileSync("src/app/icon.svg", redondeado);
const salidas = [
  [redondeado, 192, "public/iconos/icono-192.png"],
  [redondeado, 512, "public/iconos/icono-512.png"],
  [maskable, 512, "public/iconos/icono-maskable-512.png"],
  [cuadrado, 180, "src/app/apple-icon.png"],
];
for (const [contenido, lado, archivo] of salidas) {
  await sharp(Buffer.from(contenido), { density: 72 * (lado / 48) * 2 }).resize(lado, lado).png().toFile(archivo);
  console.log(archivo);
}
