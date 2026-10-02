/**
 * El símbolo de Gastoico: moneda de bronce con la "g" de Young Serif, ya pasada a curvas, en un
 * cuadrado ciprés de radio 12 (gastoico-brain/wiki/decisiones/identidad-visual.md).
 */
export const CIPRES = "#24493F";
export const BRONCE = "#C8892B";
export const PIEDRA = "#EEF0EC";

export const LETRA_G =
  "M27.43 16.81L28.97 16.47Q29.05 16.45 29.13 16.45Q29.24 16.45 29.24 16.76Q29.24 17.79 28.85 18.36Q28.46 18.93 27.75 18.93Q28.25 19.77 28.25 20.86Q28.25 21.97 27.70 22.89Q27.14 23.80 26.11 24.33Q25.08 24.87 23.63 24.87Q22.16 24.87 21.09 24.28Q20.82 24.49 20.82 24.81Q20.82 25.12 21.05 25.34Q21.28 25.56 21.94 25.70Q22.60 25.84 23.88 25.90Q24.81 25.94 25.68 26.09Q26.55 26.24 27.24 26.56Q27.94 26.89 28.35 27.47Q28.76 28.06 28.76 29.01Q28.76 29.87 28.30 30.47Q27.85 31.07 27.09 31.42Q26.32 31.78 25.40 31.95Q24.47 32.12 23.53 32.12Q22.25 32.12 21.16 31.84Q20.08 31.57 19.42 31.00Q18.76 30.44 18.76 29.55Q18.76 28.86 19.13 28.37Q19.50 27.87 20.02 27.58Q18.95 26.91 18.95 25.67Q18.95 24.95 19.32 24.45Q19.68 23.95 20.25 23.71Q19.01 22.58 19.01 20.86Q19.01 19.75 19.57 18.83Q20.13 17.92 21.16 17.37Q22.20 16.83 23.63 16.83Q24.51 16.83 25.24 17.05Q25.96 17.27 26.53 17.65Q26.64 17.71 26.71 17.72Q26.78 17.73 26.82 17.73Q26.99 17.73 27.10 17.61Q27.20 17.50 27.20 17.18L27.20 17.12Q27.20 16.85 27.43 16.81ZM23.63 18.09Q22.83 18.09 22.38 18.53Q21.93 18.97 21.75 19.61Q21.57 20.25 21.57 20.86Q21.57 21.47 21.75 22.11Q21.93 22.75 22.38 23.19Q22.83 23.63 23.63 23.63Q24.43 23.63 24.84 23.19Q25.25 22.75 25.40 22.11Q25.54 21.47 25.54 20.86Q25.54 20.25 25.40 19.61Q25.25 18.97 24.84 18.53Q24.43 18.09 23.63 18.09ZM23.55 30.67Q25.10 30.67 25.93 30.37Q26.76 30.08 26.76 29.60Q26.76 28.92 25.88 28.70Q25.00 28.48 23.40 28.40Q22.27 28.34 21.45 28.15Q20.86 28.55 20.86 29.26Q20.86 29.57 21.09 29.90Q21.32 30.23 21.91 30.45Q22.50 30.67 23.55 30.67Z";

/** El símbolo como SVG suelto (para los íconos y el favicon). */
export function simboloSvg({ redondeado = true, margen = 0 }: { redondeado?: boolean; margen?: number } = {}): string {
  const caja = 48 + margen * 2;
  const fondo = redondeado ? `<rect x="${-margen}" y="${-margen}" width="${caja}" height="${caja}" rx="${12 + margen / 4}" fill="${CIPRES}"/>` : `<rect x="${-margen}" y="${-margen}" width="${caja}" height="${caja}" fill="${CIPRES}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-margen} ${-margen} ${caja} ${caja}">${fondo}<circle cx="24" cy="24" r="15" fill="${BRONCE}"/><circle cx="24" cy="24" r="12" fill="none" stroke="${CIPRES}" stroke-opacity=".4" stroke-width="1.1"/><path d="${LETRA_G}" fill="${CIPRES}"/></svg>`;
}
