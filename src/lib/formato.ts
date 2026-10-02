import type { Centavos, Cotizacion, Fecha, Moneda } from "./datos/tipos";

const ENTERO = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });
const CON_CENTAVOS = new Intl.NumberFormat("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const SIGNO: Record<Moneda, string> = { ARS: "$", USD: "US$" };

/** El número sin signo: "186.400", o "4.200,50" si hay centavos y se piden. */
export function numero(centavos: Centavos, { conCentavos = true }: { conCentavos?: boolean } = {}): string {
  const absoluto = Math.abs(centavos);
  const texto = conCentavos && absoluto % 100 !== 0 ? CON_CENTAVOS.format(absoluto / 100) : ENTERO.format(Math.round(absoluto / 100));
  return centavos < 0 ? `-${texto}` : texto;
}

/**
 * "$ 186.400", "US$ 1.250", "$ 4.200,50". Los centavos aparecen solo si existen; en los totales se
 * piden sin centavos. El espacio es fino y no se corta.
 */
export function monto(centavos: Centavos, moneda: Moneda, opciones: { conCentavos?: boolean } = {}): string {
  return `${SIGNO[moneda]} ${numero(centavos, opciones)}`;
}

/** "$ 1.553,20" → la cotización con sus decimales si los tiene. */
export function cotizacion(valor: Cotizacion): string {
  return `$ ${numero(Math.round(valor * 100))}`;
}

/**
 * Lo que escribe la persona → centavos. Acepta "4200", "4.200", "4200,50", "4.200,5" y también
 * "4200.50" (punto como decimal si tiene uno o dos dígitos después). Devuelve null si no es un monto.
 */
export function leerMonto(texto: string): Centavos | null {
  const limpio = texto.replace(/[\s$US]/g, "");
  if (!limpio) return null;
  let normal: string;
  if (limpio.includes(",")) {
    normal = limpio.replace(/\./g, "").replace(",", ".");
  } else {
    const puntos = limpio.split(".");
    const ultimo = puntos[puntos.length - 1];
    normal = puntos.length === 2 && ultimo.length > 0 && ultimo.length <= 2 ? limpio : limpio.replace(/\./g, "");
  }
  if (!/^\d+(\.\d{0,2})?$/.test(normal)) return null;
  const valor = Math.round(Number(normal) * 100);
  return Number.isFinite(valor) ? valor : null;
}

/** Lo mismo para una cotización (pesos por dólar). */
export function leerCotizacion(texto: string): Cotizacion | null {
  const centavos = leerMonto(texto);
  return centavos && centavos > 0 ? centavos / 100 : null;
}

/** Hoy en Argentina, AAAA-MM-DD. */
export function fechaHoy(ahora: Date = new Date()): Fecha {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Argentina/Buenos_Aires" }).format(ahora);
}

export function mesDe(fecha: Fecha): string {
  return fecha.slice(0, 7);
}

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

/** "2026-10" → "octubre 2026". */
export function nombreMes(mes: string, { conAnio = true }: { conAnio?: boolean } = {}): string {
  const [anio, numeroMes] = mes.split("-").map(Number);
  const nombre = MESES[numeroMes - 1] ?? mes;
  return conAnio ? `${nombre} ${anio}` : nombre;
}

export function mesAnterior(mes: string, cuantos = 1): string {
  const [anio, numeroMes] = mes.split("-").map(Number);
  const d = new Date(Date.UTC(anio, numeroMes - 1 - cuantos, 1));
  return d.toISOString().slice(0, 7);
}

/** "Hoy", "Ayer" o "lun 28/9". */
export function fechaCorta(fecha: Fecha, hoy: Fecha = fechaHoy()): string {
  if (fecha === hoy) return "Hoy";
  const ayer = new Date(`${hoy}T12:00:00Z`);
  ayer.setUTCDate(ayer.getUTCDate() - 1);
  if (fecha === ayer.toISOString().slice(0, 10)) return "Ayer";
  const d = new Date(`${fecha}T12:00:00Z`);
  const dia = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"][d.getUTCDay()];
  return `${dia} ${d.getUTCDate()}/${d.getUTCMonth() + 1}`;
}
