import { describe, expect, it } from "vitest";
import { fechaCorta, fechaHoy, formatearEntrada, leerCotizacion, leerMonto, mesAnterior, monto, nombreMes } from "./formato";

describe("monto", () => {
  it("escribe pesos y dólares como dice el manual", () => {
    expect(monto(18_640_000, "ARS")).toBe("$ 186.400");
    expect(monto(125_000, "USD")).toBe("US$ 1.250");
  });
  it("muestra centavos solo si existen", () => {
    expect(monto(420_050, "ARS")).toBe("$ 4.200,50");
    expect(monto(420_000, "ARS")).toBe("$ 4.200");
    expect(monto(420_050, "ARS", { conCentavos: false })).toBe("$ 4.201");
  });
});

describe("leerMonto", () => {
  it.each([
    ["4200", 420_000],
    ["4.200", 420_000],
    ["4200,50", 420_050],
    ["4.200,5", 420_050],
    ["4200.50", 420_050],
    ["1.234.567", 123_456_700],
    ["$ 300", 30_000],
  ])("%s", (texto, esperado) => expect(leerMonto(texto)).toBe(esperado));
  it("rechaza lo que no es un monto", () => {
    expect(leerMonto("")).toBeNull();
    expect(leerMonto("abc")).toBeNull();
    expect(leerMonto("4,2,0")).toBeNull();
  });
  it("lee cotizaciones con decimales", () => {
    expect(leerCotizacion("1553,2")).toBe(1553.2);
    expect(leerCotizacion("0")).toBeNull();
  });
});

describe("fechas", () => {
  it("hoy es la fecha de Argentina, no la de UTC", () => {
    expect(fechaHoy(new Date("2026-10-03T01:30:00Z"))).toBe("2026-10-02");
  });
  it("nombra meses y cuenta hacia atrás cruzando el año", () => {
    expect(nombreMes("2026-10")).toBe("octubre 2026");
    expect(mesAnterior("2026-01")).toBe("2025-12");
  });
  it("dice Hoy y Ayer", () => {
    expect(fechaCorta("2026-10-02", "2026-10-02")).toBe("Hoy");
    expect(fechaCorta("2026-10-01", "2026-10-02")).toBe("Ayer");
    expect(fechaCorta("2026-09-28", "2026-10-02")).toBe("lun 28/9");
  });
});

describe("formatearEntrada", () => {
  it.each([
    ["4200", "4.200"],
    ["1234567", "1.234.567"],
    ["4200,5", "4.200,5"],
    ["4200,567", "4.200,56"],
    ["4.2001", "42.001"],
    ["4200.", "4.200,"],
    [",5", "0,5"],
    ["007", "7"],
    ["$ 300", "300"],
    ["", ""],
  ])("%s → %s", (texto, esperado) => expect(formatearEntrada(texto)).toBe(esperado));
  it("lo que muestra se vuelve a leer igual", () => {
    for (const t of ["4200", "1234567,89", "300,5"]) expect(leerMonto(formatearEntrada(t))).toBe(leerMonto(t.replace(",", ",")));
  });
  it("deja el menos solo si se pide", () => {
    expect(formatearEntrada("-5000", { negativo: true })).toBe("-5.000");
    expect(formatearEntrada("-5000")).toBe("5.000");
  });
});
