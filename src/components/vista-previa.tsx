"use client";

import { useState } from "react";
import { convertir, patrimonio } from "@/lib/datos/calculos";
import { datosIniciales } from "@/lib/datos/iniciales";
import type { Datos, Moneda } from "@/lib/datos/tipos";
import { cotizacion, monto } from "@/lib/formato";
import { Simbolo } from "./marca";
import { Monto, Segmento } from "./ui";

/** Los números de ejemplo del manual de marca, con el MEP a $ 1.230. */
const COTIZACION_EJEMPLO = 1230;
const EJEMPLO: Datos = {
  ...datosIniciales(),
  empezado: true,
  lugares: [
    { id: "banco", nombre: "Banco", grupo: "disponible", moneda: "ARS", saldoInicial: 41_230_000 },
    { id: "efectivo", nombre: "Efectivo", grupo: "disponible", moneda: "ARS", saldoInicial: 3_850_000 },
    { id: "dolares", nombre: "Dólares", grupo: "disponible", moneda: "USD", saldoInicial: 85_000 },
    { id: "pf", nombre: "Plazo fijo", grupo: "invertido", moneda: "ARS", saldoInicial: 60_000_000 },
    { id: "fci", nombre: "Fondo común", grupo: "invertido", moneda: "ARS", saldoInicial: 25_000_000 },
    { id: "acciones", nombre: "Acciones", grupo: "invertido", moneda: "USD", saldoInicial: 200_000 },
  ],
};

/**
 * El inicio de la app con datos de ejemplo, hecho con los mismos componentes y el mismo cálculo que la
 * app de verdad. Se puede tocar $ / US$ para ver el total en la otra moneda.
 */
export function VistaPrevia() {
  const [moneda, setMoneda] = useState<Moneda>("ARS");
  const p = patrimonio(EJEMPLO, moneda, COTIZACION_EJEMPLO);
  const otra: Moneda = moneda === "ARS" ? "USD" : "ARS";
  const enOtra = p.total === null ? null : convertir(p.total, moneda, otra, COTIZACION_EJEMPLO);

  return (
    <figure className="grid gap-3">
      <div className="mx-auto grid w-full max-w-[330px] gap-4 rounded-[34px] border border-linea bg-fondo p-5 shadow-[0_24px_60px_-30px_rgb(23_32_29/0.35)]">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Simbolo className="size-6" />
            <span className="font-marca text-lg leading-none">gastoico</span>
          </span>
          <Segmento
            chico
            etiqueta="Ver el ejemplo en"
            valor={moneda}
            onCambio={setMoneda}
            opciones={[
              { valor: "ARS", texto: "$" },
              { valor: "USD", texto: "US$" },
            ]}
          />
        </div>
        <div className="grid gap-1">
          <span className="text-xs text-texto-2">Tu plata hoy</span>
          {p.total !== null && <Monto centavos={p.total} moneda={moneda} conCentavos={false} className="text-4xl leading-none font-semibold" />}
          {enOtra !== null && <span className="cifra text-xs text-texto-2">≈ {monto(enOtra, otra, { conCentavos: false })}</span>}
        </div>
        <span className="inline-flex items-center gap-2 justify-self-start rounded-full border border-linea bg-superficie px-3 py-1 text-xs">
          Dólar MEP <b className="cifra font-semibold">{cotizacion(COTIZACION_EJEMPLO)}</b>
        </span>
        {(["disponible", "invertido"] as const).map((grupo) => (
          <div key={grupo} className="grid gap-1.5 rounded-2xl bg-superficie p-3 text-sm">
            <div className="flex justify-between border-b border-linea pb-1.5 font-semibold">
              <span>{grupo === "disponible" ? "Disponible" : "Invertido"}</span>
              {(grupo === "disponible" ? p.disponible : p.invertido) !== null && (
                <Monto centavos={(grupo === "disponible" ? p.disponible : p.invertido)!} moneda={moneda} conCentavos={false} />
              )}
            </div>
            {p.lugares[grupo].map((l) => (
              <div key={l.id} className="flex justify-between text-texto-2">
                <span>{l.nombre}</span>
                <Monto centavos={l.saldo} moneda={l.moneda} conCentavos={false} className="text-texto" />
              </div>
            ))}
          </div>
        ))}
      </div>
      <figcaption className="text-center text-xs text-texto-2">Números de ejemplo. Tocá $ o US$.</figcaption>
    </figure>
  );
}
