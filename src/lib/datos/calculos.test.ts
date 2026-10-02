import { describe, expect, it } from "vitest";
import { convertir, cotizacionDeMovida, cotizacionVigente, patrimonio, resumenMes, saldoLugar } from "./calculos";
import { datosIniciales } from "./iniciales";
import type { Datos, Movimiento } from "./tipos";

/** El ejemplo del manual de marca, con el MEP a $ 1.230. */
function ejemplo(): Datos {
  const d = datosIniciales();
  d.lugares = [
    { id: "banco", nombre: "Banco", grupo: "disponible", moneda: "ARS", saldoInicial: 78_130_000 },
    { id: "efectivo", nombre: "Efectivo", grupo: "disponible", moneda: "ARS", saldoInicial: 3_850_000 },
    { id: "dolares", nombre: "Dólares", grupo: "disponible", moneda: "USD", saldoInicial: 55_000 },
    { id: "pf", nombre: "Plazo fijo", grupo: "invertido", moneda: "ARS", saldoInicial: 60_000_000 },
    { id: "fci", nombre: "Fondo común", grupo: "invertido", moneda: "ARS", saldoInicial: 25_000_000 },
    { id: "acciones", nombre: "Acciones", grupo: "invertido", moneda: "USD", saldoInicial: 200_000 },
  ];
  const base = { creado: "2026-10-02T12:00:00Z" };
  const movs: Movimiento[] = [
    // Compró US$ 300 a $ 1.230 con plata del banco.
    { ...base, id: "m1", tipo: "movida", fecha: "2026-10-01", desdeLugarId: "banco", montoDesde: 36_900_000, hastaLugarId: "dolares", montoHasta: 30_000 },
  ];
  d.movimientos = movs;
  return d;
}

describe("convertir", () => {
  it("pasa de dólares a pesos y vuelta", () => {
    expect(convertir(30_000, "USD", "ARS", 1230)).toBe(36_900_000);
    expect(convertir(36_900_000, "ARS", "USD", 1230)).toBe(30_000);
  });
  it("sin cotización no inventa", () => {
    expect(convertir(100, "USD", "ARS", null)).toBeNull();
    expect(convertir(100, "ARS", "ARS", null)).toBe(100);
  });
});

describe("saldos y patrimonio", () => {
  it("comprar dólares mueve los saldos pero no cambia el total", () => {
    const d = ejemplo();
    const sinCompra = { ...d, movimientos: [] };
    expect(saldoLugar(d, d.lugares[0])).toBe(41_230_000);
    expect(saldoLugar(d, d.lugares[2])).toBe(85_000);
    expect(patrimonio(d, "ARS", 1230).total).toBe(patrimonio(sinCompra, "ARS", 1230).total);
  });
  it("da los números del manual de marca", () => {
    const p = patrimonio(ejemplo(), "ARS", 1230);
    expect(p.disponible).toBe(149_630_000);
    expect(p.invertido).toBe(331_000_000);
    expect(p.total).toBe(480_630_000);
  });
  it("sin cotización, los totales que mezclan monedas quedan sin calcular", () => {
    const p = patrimonio(ejemplo(), "ARS", null);
    expect(p.total).toBeNull();
    expect(p.lugares.disponible[0].saldoEnTotal).toBe(41_230_000);
  });
  it("un gasto baja el saldo del lugar y un ajuste lo corrige", () => {
    const d = ejemplo();
    d.movimientos.push(
      { id: "g", tipo: "gasto", fecha: "2026-10-02", creado: "x", monto: 420_000, moneda: "ARS", categoriaId: "super", lugarId: "efectivo", cotizacion: 1230 },
      { id: "a", tipo: "ajuste", fecha: "2026-10-02", creado: "x", lugarId: "pf", diferencia: 1_500_000 },
    );
    expect(saldoLugar(d, d.lugares[1])).toBe(3_430_000);
    expect(saldoLugar(d, d.lugares[3])).toBe(61_500_000);
  });
});

describe("resumen del mes", () => {
  it("suma pesos y dólares con la cotización de cada gasto", () => {
    const d = ejemplo();
    d.movimientos.push(
      { id: "g1", tipo: "gasto", fecha: "2026-10-02", creado: "a", monto: 420_000, moneda: "ARS", categoriaId: "super", lugarId: null, cotizacion: 1200 },
      { id: "g2", tipo: "gasto", fecha: "2026-10-05", creado: "b", monto: 1_000, moneda: "USD", categoriaId: "salidas", lugarId: null, cotizacion: 1200 },
      { id: "g3", tipo: "gasto", fecha: "2026-09-30", creado: "c", monto: 999_900, moneda: "ARS", categoriaId: "super", lugarId: null, cotizacion: 1200 },
      { id: "i1", tipo: "ingreso", fecha: "2026-10-01", creado: "d", monto: 95_000_000, moneda: "ARS", lugarId: null, cotizacion: 1200 },
    );
    // Aunque hoy el dólar esté a 2000, el gasto en dólares vale lo que valía al cargarlo.
    const r = resumenMes(d, "2026-10", "ARS", 2000);
    expect(r.total).toBe(420_000 + 1_200_000);
    expect(r.cantidad).toBe(2);
    expect(r.ingresos).toBe(95_000_000);
    expect(r.balance).toBe(95_000_000 - 1_620_000);
    // De mayor a menor, y la compra de dólares no aparece: no es un gasto.
    expect(r.porCategoria).toEqual([
      { categoriaId: "salidas", total: 1_200_000 },
      { categoriaId: "super", total: 420_000 },
    ]);
  });
});

describe("cotización", () => {
  const mercado = [
    { casa: "bolsa" as const, nombre: "Bolsa", compra: 1550.1, venta: 1553.2, fecha: "2026-10-02T15:56:00Z" },
    { casa: "blue" as const, nombre: "Blue", compra: 1540, venta: 1560, fecha: "2026-10-02T15:56:00Z" },
  ];
  it("usa el valor de venta del tipo elegido", () => {
    expect(cotizacionVigente(datosIniciales(), mercado, true)).toMatchObject({ valor: 1553.2, origen: "mercado", tipo: "bolsa" });
  });
  it("la propia manda", () => {
    const d = datosIniciales();
    d.preferencias.cotizacionPropia = 1600;
    expect(cotizacionVigente(d, mercado, true)).toMatchObject({ valor: 1600, origen: "propia" });
  });
  it("la cotización real de una compra sale de los dos montos", () => {
    const d = ejemplo();
    expect(cotizacionDeMovida(d, "banco", 36_900_000, "dolares", 30_000)).toBe(1230);
    expect(cotizacionDeMovida(d, "banco", 100, "efectivo", 100)).toBeNull();
  });
});
