/**
 * Lo que guarda Gastoico de cada persona. Todo en un documento: vive primero en el dispositivo y se
 * sube entero a `public.gastoico_datos` (ver gastoico-brain/wiki/tecnico/arquitectura.md).
 *
 * Los montos van en centavos enteros y siempre con su moneda: nunca se suman pesos con dólares sin
 * pasar por una cotización.
 */

export type Moneda = "ARS" | "USD";

/** Monto en centavos enteros (100 = $ 1). */
export type Centavos = number;

/** Pesos por dólar, con hasta dos decimales (por ejemplo 1553.2). */
export type Cotizacion = number;

/** Las cotizaciones del mercado que se pueden elegir. "bolsa" es el dólar MEP. */
export type TipoDolar = "oficial" | "blue" | "bolsa" | "tarjeta" | "cripto";

/** Fecha sin hora, AAAA-MM-DD, en la hora de Argentina. */
export type Fecha = string;

export interface Categoria {
  id: string;
  nombre: string;
  /** Uno de los doce de la paleta (`COLORES_CATEGORIA`). */
  color: string;
  archivada?: boolean;
}

/** Disponible: efectivo, banco, billetera. Invertido: plazo fijo, fondos, acciones, cripto. */
export type Grupo = "disponible" | "invertido";

/** Un lugar donde hay plata, en una sola moneda. */
export interface Lugar {
  id: string;
  nombre: string;
  grupo: Grupo;
  moneda: Moneda;
  /** Lo que había al crearlo. */
  saldoInicial: Centavos;
  archivado?: boolean;
}

interface Base {
  id: string;
  fecha: Fecha;
  nota?: string;
  /** Momento en que se cargó (ISO), para ordenar los del mismo día. */
  creado: string;
}

export interface Gasto extends Base {
  tipo: "gasto";
  monto: Centavos;
  moneda: Moneda;
  categoriaId: string;
  /** De dónde salió. Sin lugar, el gasto no mueve ningún saldo. */
  lugarId: string | null;
  /** La cotización de referencia al cargarlo: así el resumen del mes no cambia con el dólar. */
  cotizacion: Cotizacion | null;
}

export interface Ingreso extends Base {
  tipo: "ingreso";
  monto: Centavos;
  moneda: Moneda;
  lugarId: string | null;
  cotizacion: Cotizacion | null;
}

/**
 * Plata que pasa de un lugar a otro. Si las monedas son distintas es una compra o venta de dólares,
 * y la cotización real es la que sale de los dos montos. No es un gasto: el total no cambia.
 */
export interface Movida extends Base {
  tipo: "movida";
  desdeLugarId: string;
  montoDesde: Centavos;
  hastaLugarId: string;
  montoHasta: Centavos;
}

/** El saldo de un lugar cambió solo: intereses del plazo fijo, suba de las acciones, un error. */
export interface Ajuste extends Base {
  tipo: "ajuste";
  lugarId: string;
  diferencia: Centavos;
}

export type Movimiento = Gasto | Ingreso | Movida | Ajuste;

export interface Preferencias {
  /** En qué moneda se muestran los totales. */
  monedaTotal: Moneda;
  tipoDolar: TipoDolar;
  /** Si el usuario puso su propia cotización, manda sobre la del mercado. */
  cotizacionPropia: Cotizacion | null;
}

export interface Datos {
  version: 1;
  /** Ya pasó por la pantalla de bienvenida (o la salteó). */
  empezado: boolean;
  categorias: Categoria[];
  lugares: Lugar[];
  movimientos: Movimiento[];
  preferencias: Preferencias;
  /** Lo último elegido al cargar un gasto, para que la próxima vez sean dos toques. */
  ultimo: { moneda: Moneda; lugarARS: string | null; lugarUSD: string | null };
}
