"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { ConDatos } from "@/components/con-datos";
import { FilaMovimiento } from "@/components/fila-movimiento";
import { Encabezado, Monto, Tarjeta } from "@/components/ui";
import { ordenados, resumenMes } from "@/lib/datos/calculos";
import type { Datos, Movimiento } from "@/lib/datos/tipos";
import { fechaCorta, fechaHoy, mesAnterior, mesDe, nombreMes } from "@/lib/formato";
import { useCotizacion } from "@/lib/usar-cotizacion";

export default function PaginaMovimientos() {
  return <ConDatos>{(datos) => <Movimientos datos={datos} />}</ConDatos>;
}

function Movimientos({ datos }: { datos: Datos }) {
  const vigente = useCotizacion(datos);
  const hoy = mesDe(fechaHoy());
  const [mes, setMes] = useState(hoy);
  const [filtro, setFiltro] = useState<string | null>(null);
  const moneda = datos.preferencias.monedaTotal;
  const resumen = resumenMes(datos, mes, moneda, vigente.valor);
  const delMes = ordenados(datos.movimientos).filter((m) => m.fecha.startsWith(mes) && (!filtro || (m.tipo === "gasto" && m.categoriaId === filtro)));
  const porDia = agrupar(delMes);
  const maximo = resumen.porCategoria[0]?.total ?? 0;

  return (
    <div className="grid gap-5">
      <Encabezado titulo="Movimientos" />

      <div className="flex items-center justify-between">
        <button type="button" onClick={() => (setMes(mesAnterior(mes)), setFiltro(null))} className="grid size-10 place-items-center rounded-full hover:bg-primario-suave" aria-label="Mes anterior">
          <ChevronLeft className="size-5" strokeWidth={1.75} aria-hidden="true" />
        </button>
        <span className="font-semibold capitalize">{nombreMes(mes)}</span>
        <button
          type="button"
          onClick={() => (setMes(mesAnterior(mes, -1)), setFiltro(null))}
          disabled={mes >= hoy}
          className="grid size-10 place-items-center rounded-full hover:bg-primario-suave disabled:opacity-30"
          aria-label="Mes siguiente"
        >
          <ChevronRight className="size-5" strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>

      <Tarjeta className="grid gap-4 p-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="grid gap-0.5">
            <span className="text-sm text-texto-2">Gastaste</span>
            <Monto centavos={resumen.total} moneda={moneda} conCentavos={false} className="text-3xl font-semibold" />
          </div>
          {resumen.ingresos > 0 && (
            <div className="grid justify-items-end gap-0.5">
              <span className="text-sm text-texto-2">Entraron</span>
              <Monto centavos={resumen.ingresos} moneda={moneda} conCentavos={false} signoIngreso className="text-lg font-semibold text-primario" />
            </div>
          )}
        </div>
        {resumen.porCategoria.length > 0 && (
          <ul className="grid gap-2.5">
            {resumen.porCategoria.map((c) => {
              const cat = datos.categorias.find((x) => x.id === c.categoriaId);
              const activo = filtro === c.categoriaId;
              return (
                <li key={c.categoriaId}>
                  <button
                    type="button"
                    onClick={() => setFiltro(activo ? null : c.categoriaId)}
                    aria-pressed={activo}
                    className={`grid w-full gap-1 rounded-chico px-1 py-0.5 text-left ${filtro && !activo ? "opacity-45" : ""}`}
                  >
                    <span className="flex items-baseline justify-between gap-3 text-sm">
                      <span className="flex items-center gap-2">
                        <span className="size-2.5 rounded-[3px]" style={{ background: cat?.color ?? "#7D8781" }} />
                        {cat?.nombre ?? "Sin categoría"}
                        <span className="text-xs text-texto-2">{Math.round((c.total / resumen.total) * 100)}%</span>
                      </span>
                      <Monto centavos={c.total} moneda={moneda} conCentavos={false} />
                    </span>
                    <span className="h-1.5 overflow-hidden rounded-full bg-primario-suave">
                      <span className="block h-full rounded-full" style={{ width: `${(c.total / maximo) * 100}%`, background: cat?.color ?? "#7D8781" }} />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        {resumen.sinConvertir > 0 && <p className="text-xs text-texto-2">{resumen.sinConvertir} movimiento(s) en otra moneda no se suman: falta la cotización.</p>}
        {filtro && (
          <button type="button" onClick={() => setFiltro(null)} className="justify-self-start text-sm font-medium text-primario">
            Ver todos los movimientos
          </button>
        )}
      </Tarjeta>

      {porDia.length === 0 ? (
        <p className="text-texto-2">{mes === hoy ? "Todavía no cargaste nada este mes." : `No hay movimientos en ${nombreMes(mes, { conAnio: false })}.`}</p>
      ) : (
        porDia.map(([fecha, movs]) => (
          <section key={fecha} className="grid">
            <h2 className="text-xs font-medium tracking-wide text-texto-2 uppercase">{fechaCorta(fecha)}</h2>
            <div className="divide-y divide-linea">
              {movs.map((m) => (
                <FilaMovimiento key={m.id} m={m} datos={datos} conFecha={false} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}

function agrupar(movimientos: Movimiento[]): [string, Movimiento[]][] {
  const grupos = new Map<string, Movimiento[]>();
  for (const m of movimientos) grupos.set(m.fecha, [...(grupos.get(m.fecha) ?? []), m]);
  return [...grupos];
}
