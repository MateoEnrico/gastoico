"use client";

import { useCotizaciones } from "./cotizaciones";
import { cotizacionVigente, type CotizacionVigente } from "./datos/calculos";
import type { Datos } from "./datos/tipos";

/** La cotización que usa esta persona ahora: la propia, la del día o la última guardada. */
export function useCotizacion(datos: Datos): CotizacionVigente & { mercado: ReturnType<typeof useCotizaciones>["casas"] } {
  const { casas, alDia } = useCotizaciones();
  return { ...cotizacionVigente(datos, casas, alDia), mercado: casas };
}
