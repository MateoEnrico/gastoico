import type { Centavos, Cotizacion, Datos, Grupo, Lugar, Moneda, Movimiento, TipoDolar } from "./tipos";

/** Pasa un monto de una moneda a otra. Sin cotización no se puede: devuelve null. */
export function convertir(centavos: Centavos, de: Moneda, a: Moneda, cot: Cotizacion | null): Centavos | null {
  if (de === a) return centavos;
  if (!cot || cot <= 0) return null;
  return de === "USD" ? Math.round(centavos * cot) : Math.round(centavos / cot);
}

/** Cuánto mueve un movimiento el saldo de un lugar. */
function efectoEnLugar(m: Movimiento, lugarId: string): Centavos {
  switch (m.tipo) {
    case "gasto":
      return m.lugarId === lugarId ? -m.monto : 0;
    case "ingreso":
      return m.lugarId === lugarId ? m.monto : 0;
    case "movida":
      return (m.hastaLugarId === lugarId ? m.montoHasta : 0) - (m.desdeLugarId === lugarId ? m.montoDesde : 0);
    case "ajuste":
      return m.lugarId === lugarId ? m.diferencia : 0;
  }
}

export function saldoLugar(datos: Datos, lugar: Lugar): Centavos {
  return datos.movimientos.reduce((suma, m) => suma + efectoEnLugar(m, lugar.id), lugar.saldoInicial);
}

export interface LugarConSaldo extends Lugar {
  saldo: Centavos;
  /** El saldo en la moneda de los totales, o null si falta la cotización. */
  saldoEnTotal: Centavos | null;
}

export interface Patrimonio {
  moneda: Moneda;
  total: Centavos | null;
  disponible: Centavos | null;
  invertido: Centavos | null;
  lugares: Record<Grupo, LugarConSaldo[]>;
}

/**
 * Cuánta plata hay, en la moneda elegida y con la cotización de hoy. Los lugares archivados con saldo
 * cero no se muestran; con saldo, siguen contando.
 */
export function patrimonio(datos: Datos, moneda: Moneda, cot: Cotizacion | null): Patrimonio {
  const lugares: Record<Grupo, LugarConSaldo[]> = { disponible: [], invertido: [] };
  const sumas: Record<Grupo, Centavos | null> = { disponible: 0, invertido: 0 };
  for (const lugar of datos.lugares) {
    const saldo = saldoLugar(datos, lugar);
    if (lugar.archivado && saldo === 0) continue;
    const saldoEnTotal = convertir(saldo, lugar.moneda, moneda, cot);
    lugares[lugar.grupo].push({ ...lugar, saldo, saldoEnTotal });
    const previa = sumas[lugar.grupo];
    sumas[lugar.grupo] = previa === null || saldoEnTotal === null ? null : previa + saldoEnTotal;
  }
  const { disponible, invertido } = sumas;
  return { moneda, total: disponible === null || invertido === null ? null : disponible + invertido, disponible, invertido, lugares };
}

export interface ResumenMes {
  mes: string;
  moneda: Moneda;
  total: Centavos;
  ingresos: Centavos;
  /** Lo que entró menos lo que se gastó en el mes. Negativo si se gastó más de lo que entró. */
  balance: Centavos;
  porCategoria: { categoriaId: string; total: Centavos }[];
  cantidad: number;
  /** Gastos que no se pudieron pasar a la moneda del total (cargados sin cotización). */
  sinConvertir: number;
}

/**
 * Los gastos de un mes en una moneda. Cada gasto se convierte con la cotización que tenía al
 * cargarlo, así el resumen de septiembre no cambia cuando sube el dólar en octubre.
 */
export function resumenMes(datos: Datos, mes: string, moneda: Moneda, cotHoy: Cotizacion | null): ResumenMes {
  const porCategoria = new Map<string, Centavos>();
  let total = 0;
  let ingresos = 0;
  let cantidad = 0;
  let sinConvertir = 0;
  for (const m of datos.movimientos) {
    if ((m.tipo !== "gasto" && m.tipo !== "ingreso") || !m.fecha.startsWith(mes)) continue;
    const enTotal = convertir(m.monto, m.moneda, moneda, m.cotizacion ?? cotHoy);
    if (enTotal === null) {
      sinConvertir++;
      continue;
    }
    if (m.tipo === "ingreso") {
      ingresos += enTotal;
      continue;
    }
    total += enTotal;
    cantidad++;
    porCategoria.set(m.categoriaId, (porCategoria.get(m.categoriaId) ?? 0) + enTotal);
  }
  return {
    mes,
    moneda,
    total,
    ingresos,
    balance: ingresos - total,
    cantidad,
    sinConvertir,
    porCategoria: [...porCategoria].map(([categoriaId, t]) => ({ categoriaId, total: t })).sort((a, b) => b.total - a.total),
  };
}

/** Los movimientos del más nuevo al más viejo. */
export function ordenados(movimientos: Movimiento[]): Movimiento[] {
  return [...movimientos].sort((a, b) => (a.fecha === b.fecha ? b.creado.localeCompare(a.creado) : b.fecha.localeCompare(a.fecha)));
}

/** La cotización real de una compra o venta de dólares (pesos por dólar), o null si no es un cambio. */
export function cotizacionDeMovida(datos: Datos, desdeLugarId: string, montoDesde: Centavos, hastaLugarId: string, montoHasta: Centavos): Cotizacion | null {
  const desde = datos.lugares.find((l) => l.id === desdeLugarId);
  const hasta = datos.lugares.find((l) => l.id === hastaLugarId);
  if (!desde || !hasta || desde.moneda === hasta.moneda || montoDesde <= 0 || montoHasta <= 0) return null;
  const pesos = desde.moneda === "ARS" ? montoDesde : montoHasta;
  const dolares = desde.moneda === "USD" ? montoDesde : montoHasta;
  return Math.round((pesos / dolares) * 100) / 100;
}

export interface CotizacionMercado {
  casa: TipoDolar;
  nombre: string;
  compra: number;
  venta: number;
  /** ISO, de cuándo es el valor. */
  fecha: string;
}

export interface CotizacionVigente {
  valor: Cotizacion | null;
  /** "propia": la puso la persona. "mercado": la del día. "guardada": la última que se pudo traer. */
  origen: "propia" | "mercado" | "guardada" | "ninguna";
  tipo: TipoDolar;
  fecha: string | null;
}

export const NOMBRE_DOLAR: Record<TipoDolar, string> = {
  oficial: "Dólar oficial",
  blue: "Dólar blue",
  bolsa: "Dólar MEP",
  tarjeta: "Dólar tarjeta",
  cripto: "Dólar cripto",
};

/** Qué cotización usar: la propia si existe; si no, la del mercado del tipo elegido (valor de venta). */
export function cotizacionVigente(datos: Datos, mercado: CotizacionMercado[] | null, alDia: boolean): CotizacionVigente {
  const { tipoDolar, cotizacionPropia } = datos.preferencias;
  if (cotizacionPropia) return { valor: cotizacionPropia, origen: "propia", tipo: tipoDolar, fecha: null };
  const delTipo = mercado?.find((c) => c.casa === tipoDolar);
  if (!delTipo) return { valor: null, origen: "ninguna", tipo: tipoDolar, fecha: null };
  return { valor: delTipo.venta, origen: alDia ? "mercado" : "guardada", tipo: tipoDolar, fecha: delTipo.fecha };
}
