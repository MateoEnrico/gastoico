"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { ConDatos } from "@/components/con-datos";
import { FilaMovimiento } from "@/components/fila-movimiento";
import { Logo } from "@/components/marca";
import { MisApps } from "@/components/mis-apps";
import { OfrecerInstalar } from "@/components/ofrecer-instalar";
import { PildoraCotizacion } from "@/components/pildora-cotizacion";
import { Monto, Segmento, Tarjeta } from "@/components/ui";
import { cambiarPreferencias } from "@/lib/datos/almacen";
import { convertir, ordenados, patrimonio, resumenMes, type LugarConSaldo } from "@/lib/datos/calculos";
import type { Datos, Moneda } from "@/lib/datos/tipos";
import { fechaHoy, mesAnterior, mesDe, monto, nombreMes } from "@/lib/formato";
import { useCotizacion } from "@/lib/usar-cotizacion";

export default function PaginaInicio() {
  return <ConDatos>{(datos) => <Inicio datos={datos} />}</ConDatos>;
}

function Inicio({ datos }: { datos: Datos }) {
  const vigente = useCotizacion(datos);
  const moneda = datos.preferencias.monedaTotal;
  const otra: Moneda = moneda === "ARS" ? "USD" : "ARS";
  const p = patrimonio(datos, moneda, vigente.valor);
  const enOtra = p.total === null ? null : convertir(p.total, moneda, otra, vigente.valor);
  const mes = mesDe(fechaHoy());
  const resumen = resumenMes(datos, mes, moneda, vigente.valor);
  const anterior = resumenMes(datos, mesAnterior(mes), moneda, vigente.valor);
  const ultimos = ordenados(datos.movimientos).slice(0, 5);
  const mezclaMonedas = datos.lugares.some((l) => l.moneda !== moneda);

  return (
    <div className="grid gap-5">
      <header className="flex items-center justify-between pt-3 lg:hidden">
        <Logo tamano="text-xl" simbolo="size-7" />
        <MisApps />
      </header>
      <div className="hidden justify-end lg:flex">
        <MisApps />
      </div>

      <section className="grid gap-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-texto-2">Tu plata hoy</span>
          <Segmento
            chico
            etiqueta="Ver los totales en"
            valor={moneda}
            onCambio={(m) => cambiarPreferencias({ monedaTotal: m })}
            opciones={[
              { valor: "ARS", texto: "$" },
              { valor: "USD", texto: "US$" },
            ]}
          />
        </div>
        <CambioSuave clave={moneda}>
          {p.total === null ? (
            <p className="text-texto-2">Para sumar pesos y dólares hace falta una cotización.</p>
          ) : (
            <div className="grid gap-1">
              <Monto centavos={p.total} moneda={moneda} conCentavos={false} className="text-[40px] leading-none font-semibold sm:text-5xl" />
              {mezclaMonedas && enOtra !== null && <span className="cifra text-sm text-texto-2">≈ {monto(enOtra, otra, { conCentavos: false })}</span>}
            </div>
          )}
        </CambioSuave>
        <div>
          <PildoraCotizacion vigente={vigente} />
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        <Grupo titulo="Disponible" total={p.disponible} moneda={moneda} lugares={p.lugares.disponible} />
        <Grupo titulo="Invertido" total={p.invertido} moneda={moneda} lugares={p.lugares.invertido} />
      </div>

      <Tarjeta className="grid gap-3 p-4">
        <Link href="/app/movimientos" className="fila-presionable -m-2 flex items-baseline justify-between gap-3 rounded-chico p-2">
          <span className="font-semibold">Gastos de {nombreMes(mes, { conAnio: false })}</span>
          <Monto centavos={resumen.total} moneda={moneda} conCentavos={false} className="text-lg font-semibold" />
        </Link>
        {resumen.total > 0 && (
          <div className="flex h-2.5 gap-0.5 overflow-hidden rounded-full" role="img" aria-label="Gastos del mes por categoría">
            {resumen.porCategoria.map((c) => (
              <span key={c.categoriaId} style={{ flex: c.total, background: datos.categorias.find((x) => x.id === c.categoriaId)?.color ?? "#7D8781" }} />
            ))}
          </div>
        )}
        <Comparacion actual={resumen.total} anterior={anterior.total} mesAnterior={mesAnterior(mes)} moneda={moneda} categorias={datos} />
      </Tarjeta>

      <OfrecerInstalar />

      <section className="grid gap-1">
        <h2 className="text-sm font-medium text-texto-2">Últimos movimientos</h2>
        {ultimos.length === 0 ? (
          <Tarjeta className="grid gap-2 p-4">
            <p>Todavía no cargaste nada. Empezá por el último gasto que hiciste.</p>
            <Link href="/app/cargar" className="font-semibold text-primario">
              Cargar un gasto
            </Link>
          </Tarjeta>
        ) : (
          <div className="divide-y divide-linea">
            {ultimos.map((m) => (
              <FilaMovimiento key={m.id} m={m} datos={datos} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Grupo({ titulo, total, moneda, lugares }: { titulo: string; total: number | null; moneda: Moneda; lugares: LugarConSaldo[] }) {
  return (
    <Tarjeta className="grid content-start gap-2 p-4">
      <Link href="/app/plata" className="flex min-h-9 items-baseline justify-between gap-3 border-b border-linea pb-2">
        <span className="font-semibold">{titulo}</span>
        {total !== null && <Monto centavos={total} moneda={moneda} conCentavos={false} className="font-semibold" />}
      </Link>
      {lugares.length === 0 ? (
        <Link href="/app/plata" className="text-sm text-texto-2">
          {titulo === "Invertido" ? "¿Plazo fijo, fondos, acciones? Agregalos." : "Agregá dónde tenés tu plata."}
        </Link>
      ) : (
        lugares.map((l) => (
          <Link key={l.id} href={`/app/plata#${l.id}`} className="fila-presionable -mx-2 flex min-h-9 items-center justify-between gap-3 rounded-chico px-2 text-sm">
            <span className="truncate text-texto-2">{l.nombre}</span>
            <Monto centavos={l.saldo} moneda={l.moneda} conCentavos={false} />
          </Link>
        ))
      )}
    </Tarjeta>
  );
}

/** "Llevás $ 32.000 más que en septiembre." Sin alarma: es un dato. */
function Comparacion({ actual, anterior, mesAnterior: mes, moneda }: { actual: number; anterior: number; mesAnterior: string; moneda: Moneda; categorias: Datos }) {
  if (actual === 0) return <p className="text-sm text-texto-2">Todavía no cargaste gastos este mes.</p>;
  if (anterior === 0) return null;
  const diferencia = actual - anterior;
  const nombre = nombreMes(mes, { conAnio: false });
  if (Math.abs(diferencia) < 100) return <p className="text-sm text-texto-2">Vas igual que en {nombre}.</p>;
  return (
    <p className="text-sm text-texto-2">
      Llevás {monto(Math.abs(diferencia), moneda, { conCentavos: false })} {diferencia > 0 ? "más" : "menos"} que en todo {nombre}.
    </p>
  );
}

/**
 * Cuando se cambia de pesos a dólares, el total no cuenta hacia arriba (se mira muchas veces por día):
 * se funde en 200 ms, con un desenfoque mínimo que tapa el cambio de cifras.
 */
function CambioSuave({ clave, children }: { clave: string; children: React.ReactNode }) {
  const reducir = useReducedMotion();
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={clave}
        initial={reducir ? { opacity: 0 } : { opacity: 0, filter: "blur(2px)", y: 4 }}
        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        exit={reducir ? { opacity: 0 } : { opacity: 0, filter: "blur(2px)", y: -4 }}
        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
