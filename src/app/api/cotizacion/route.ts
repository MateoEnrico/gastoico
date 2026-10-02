import type { CotizacionMercado } from "@/lib/datos/calculos";
import type { TipoDolar } from "@/lib/datos/tipos";

/**
 * GET /api/cotizacion → las cotizaciones del dólar de hoy (oficial, blue, MEP, tarjeta, cripto).
 * Fuente: dolarapi.com (gastoico-brain/wiki/decisiones/gastoico-arranca-con-gastagro-en-prueba.md).
 * Se guarda 15 minutos en el servidor para no pedirle de más.
 */
const FUENTE = "https://dolarapi.com/v1/dolares";
const CASAS: TipoDolar[] = ["oficial", "blue", "bolsa", "tarjeta", "cripto"];

interface DeDolarApi {
  casa: string;
  nombre: string;
  compra: number;
  venta: number;
  fechaActualizacion: string;
}

export async function GET() {
  try {
    const res = await fetch(FUENTE, { next: { revalidate: 900 }, signal: AbortSignal.timeout(6000) });
    if (!res.ok) throw new Error(String(res.status));
    const lista = (await res.json()) as DeDolarApi[];
    const casas: CotizacionMercado[] = lista
      .filter((c): c is DeDolarApi & { casa: TipoDolar } => CASAS.includes(c.casa as TipoDolar) && c.venta > 0)
      .map((c) => ({ casa: c.casa, nombre: c.nombre, compra: c.compra, venta: c.venta, fecha: c.fechaActualizacion }));
    if (casas.length === 0) throw new Error("vacía");
    return Response.json({ casas }, { headers: { "Cache-Control": "public, max-age=300" } });
  } catch {
    return Response.json({ error: "No se pudo consultar el dólar" }, { status: 502 });
  }
}
