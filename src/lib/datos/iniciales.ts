import type { Categoria, Datos } from "./tipos";

/** Las doce de la paleta: las ocho de las categorías que vienen y cuatro más para las propias. */
export const COLORES_CATEGORIA = [
  "#D08C2E",
  "#4E8B5C",
  "#3B7EA1",
  "#6A6FB0",
  "#C2566B",
  "#8A5BA8",
  "#B4663A",
  "#7D8781",
  "#2F8F8A",
  "#A0527F",
  "#8C7A2E",
  "#5C6B7A",
] as const;

export const CATEGORIAS_INICIALES: Categoria[] = [
  { id: "super", nombre: "Súper y comida", color: "#D08C2E" },
  { id: "casa", nombre: "Casa", color: "#4E8B5C" },
  { id: "transporte", nombre: "Transporte", color: "#3B7EA1" },
  { id: "servicios", nombre: "Servicios", color: "#6A6FB0" },
  { id: "salud", nombre: "Salud", color: "#C2566B" },
  { id: "salidas", nombre: "Salidas", color: "#8A5BA8" },
  { id: "compras", nombre: "Compras", color: "#B4663A" },
  { id: "otros", nombre: "Otros", color: "#7D8781" },
];

export function datosIniciales(): Datos {
  return {
    version: 1,
    empezado: false,
    categorias: CATEGORIAS_INICIALES.map((c) => ({ ...c })),
    lugares: [],
    movimientos: [],
    preferencias: { monedaTotal: "ARS", tipoDolar: "bolsa", cotizacionPropia: null },
    ultimo: { moneda: "ARS", lugarARS: null, lugarUSD: null },
  };
}

export function nuevoId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
