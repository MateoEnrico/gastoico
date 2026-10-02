import Link from "next/link";
import { NOMBRE_DOLAR, type CotizacionVigente } from "@/lib/datos/calculos";
import { cotizacion } from "@/lib/formato";

function hora(iso: string): string {
  const d = new Date(iso);
  const hoy = new Date().toDateString() === d.toDateString();
  const hhmm = d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: "America/Argentina/Buenos_Aires" });
  return hoy ? `hoy ${hhmm}` : d.toLocaleDateString("es-AR", { day: "numeric", month: "numeric" });
}

/**
 * La cotización como la define el manual: tipo, valor y de cuándo es. Punto ciprés si es la del día;
 * bronce si la puso la persona ("tuya") o si es la última guardada sin señal.
 */
export function PildoraCotizacion({ vigente }: { vigente: CotizacionVigente }) {
  const { valor, origen, tipo, fecha } = vigente;
  const punto = origen === "mercado" ? "bg-primario" : "bg-acento";
  return (
    <Link href="/app/ajustes#cotizacion" className="inline-flex min-h-9 flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-linea bg-superficie px-3 py-1.5 text-sm">
      <span className={`size-2 rounded-full ${punto}`} aria-hidden="true" />
      {valor === null ? (
        <span className="text-texto-2">Sin cotización: tocá para ponerla</span>
      ) : (
        <>
          <span>{origen === "propia" ? "Dólar" : NOMBRE_DOLAR[tipo]}</span>
          <b className="cifra font-semibold">{cotizacion(valor)}</b>
          <span className="font-mono text-[11px] text-texto-2">{origen === "propia" ? "tuya" : fecha ? hora(fecha) : ""}</span>
        </>
      )}
      <span className="font-medium text-primario">Cambiar</span>
    </Link>
  );
}
