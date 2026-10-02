import { Minus, Plus } from "lucide-react";
import Link from "next/link";
import type { ResumenMes } from "@/lib/datos/calculos";
import type { Categoria } from "@/lib/datos/tipos";
import { nombreMes } from "@/lib/formato";
import { Monto, Tarjeta } from "./ui";

/**
 * El mes en una tarjeta: lo que entró, lo que se gastó y lo que queda. Un balance negativo no se pinta
 * de rojo (la marca no reta): se dice con palabras.
 */
export function BalanceMes({ resumen, categorias, acciones = false, enlace }: { resumen: ResumenMes; categorias: Categoria[]; acciones?: boolean; enlace?: string }) {
  const { moneda, ingresos, total, balance, porCategoria, mes } = resumen;
  const nombre = nombreMes(mes, { conAnio: false });
  const titulo = <span className="font-semibold capitalize">{nombre}</span>;

  return (
    <Tarjeta className="grid gap-3 p-4">
      <div className="flex items-baseline justify-between gap-3">
        {enlace ? (
          <Link href={enlace} className="fila-presionable -m-1 rounded-chico p-1">
            {titulo}
          </Link>
        ) : (
          titulo
        )}
        {enlace && (
          <Link href={enlace} className="text-sm font-medium text-primario">
            Ver movimientos
          </Link>
        )}
      </div>

      <dl className="grid gap-1.5 text-[15px]">
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-texto-2">Entraron</dt>
          <dd>{ingresos > 0 ? <Monto centavos={ingresos} moneda={moneda} conCentavos={false} signoIngreso className="font-medium text-primario" /> : <span className="text-texto-2">—</span>}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-texto-2">Gastaste</dt>
          <dd>
            <Monto centavos={total} moneda={moneda} conCentavos={false} className="font-medium" />
          </dd>
        </div>
        {total > 0 && (
          <div className="my-0.5 flex h-2 gap-0.5 overflow-hidden rounded-full" role="img" aria-label="Lo gastado por categoría">
            {porCategoria.map((c) => (
              <span key={c.categoriaId} style={{ flex: c.total, background: categorias.find((x) => x.id === c.categoriaId)?.color ?? "#7D8781" }} />
            ))}
          </div>
        )}
        <div className="flex items-baseline justify-between gap-3 border-t border-linea pt-2">
          <dt className="font-semibold">{balance >= 0 ? "Te quedan" : "Gastaste de más"}</dt>
          <dd>
            <Monto centavos={Math.abs(balance)} moneda={moneda} conCentavos={false} className="text-xl font-semibold" />
          </dd>
        </div>
      </dl>

      {ingresos === 0 && <p className="text-sm text-texto-2">¿Cobraste en {nombre}? Cargá lo que entró y vas a ver cuánto te queda.</p>}
      {ingresos > 0 && balance < 0 && <p className="text-sm text-texto-2">En {nombre} salió más de lo que entró. La diferencia vino de lo que ya tenías.</p>}

      {acciones && (
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Link href="/app/cargar?tipo=ingreso" className="presionable flex min-h-11 items-center justify-center gap-1.5 rounded-chico bg-primario-suave text-sm font-semibold text-texto">
            <Plus className="size-4 text-primario" strokeWidth={2} aria-hidden="true" />
            Ingreso
          </Link>
          <Link href="/app/cargar" className="presionable flex min-h-11 items-center justify-center gap-1.5 rounded-chico bg-primario-suave text-sm font-semibold text-texto">
            <Minus className="size-4 text-texto-2" strokeWidth={2} aria-hidden="true" />
            Gasto
          </Link>
        </div>
      )}
    </Tarjeta>
  );
}
