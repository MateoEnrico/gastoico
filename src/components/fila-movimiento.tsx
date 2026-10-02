import { ArrowRightLeft, TrendingUp } from "lucide-react";
import Link from "next/link";
import type { Datos, Movimiento } from "@/lib/datos/tipos";
import { cotizacion, fechaCorta, monto } from "@/lib/formato";
import { Monto } from "./ui";

/** Un movimiento en una lista. Tocarlo lo abre para editar. */
export function FilaMovimiento({ m, datos, conFecha = true }: { m: Movimiento; datos: Datos; conFecha?: boolean }) {
  const lugar = (id: string | null) => datos.lugares.find((l) => l.id === id);
  const detalle: string[] = [];
  if (conFecha) detalle.push(fechaCorta(m.fecha));
  let titulo: string;
  let marca: React.ReactNode;
  let valor: React.ReactNode;

  switch (m.tipo) {
    case "gasto": {
      const cat = datos.categorias.find((c) => c.id === m.categoriaId);
      titulo = m.nota || cat?.nombre || "Gasto";
      if (m.nota && cat) detalle.push(cat.nombre);
      if (lugar(m.lugarId)) detalle.push(lugar(m.lugarId)!.nombre);
      marca = <span className="size-2.5 rounded-[3px]" style={{ background: cat?.color ?? "#7D8781" }} />;
      valor = <Monto centavos={m.monto} moneda={m.moneda} className="font-medium" />;
      break;
    }
    case "ingreso":
      titulo = m.nota || "Ingreso";
      if (lugar(m.lugarId)) detalle.push(lugar(m.lugarId)!.nombre);
      marca = <span className="text-[13px] leading-none font-semibold text-primario">+</span>;
      valor = <Monto centavos={m.monto} moneda={m.moneda} signoIngreso className="font-medium text-primario" />;
      break;
    case "movida": {
      const desde = lugar(m.desdeLugarId);
      const hasta = lugar(m.hastaLugarId);
      const cambio = desde && hasta && desde.moneda !== hasta.moneda;
      if (cambio) {
        const compra = hasta.moneda === "USD";
        const dolares = compra ? m.montoHasta : m.montoDesde;
        const pesos = compra ? m.montoDesde : m.montoHasta;
        titulo = `${compra ? "Compraste" : "Vendiste"} ${monto(dolares, "USD")}`;
        detalle.push(`a ${cotizacion(Math.round((pesos / dolares) * 100) / 100)}`);
      } else {
        titulo = m.nota || "Movimiento entre lugares";
      }
      detalle.push(`${desde?.nombre ?? "?"} → ${hasta?.nombre ?? "?"}`);
      marca = <ArrowRightLeft className="size-3.5 text-acento-texto" strokeWidth={2} aria-hidden="true" />;
      valor = <Monto centavos={m.montoHasta} moneda={hasta?.moneda ?? "ARS"} className="text-texto-2" />;
      break;
    }
    case "ajuste":
      titulo = m.nota || "Saldo actualizado";
      detalle.push(lugar(m.lugarId)?.nombre ?? "");
      marca = <TrendingUp className="size-3.5 text-texto-2" strokeWidth={2} aria-hidden="true" />;
      valor = (
        <span className={m.diferencia >= 0 ? "text-primario" : "text-texto-2"}>
          {m.diferencia >= 0 ? "+" : "−"}
          <Monto centavos={Math.abs(m.diferencia)} moneda={lugar(m.lugarId)?.moneda ?? "ARS"} />
        </span>
      );
      break;
  }

  return (
    <Link href={`/app/cargar?id=${m.id}`} className="fila-presionable -mx-2 grid min-h-14 grid-cols-[14px_minmax(0,1fr)_auto] items-center gap-3 rounded-chico px-2 py-2.5">
      <span className="grid place-items-center">{marca}</span>
      <span className="grid min-w-0">
        <span className="truncate text-[15px]">{titulo}</span>
        <span className="truncate text-xs text-texto-2">{detalle.filter(Boolean).join(" · ")}</span>
      </span>
      <span className="text-[15px]">{valor}</span>
    </Link>
  );
}
