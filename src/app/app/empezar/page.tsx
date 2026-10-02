"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Logo } from "@/components/marca";
import { Boton, CLASE_CAMPO } from "@/components/ui";
import { empezar } from "@/lib/datos/almacen";
import type { Grupo, Moneda } from "@/lib/datos/tipos";
import { leerMonto, SIGNO } from "@/lib/formato";

interface Fila {
  clave: number;
  nombre: string;
  grupo: Grupo;
  moneda: Moneda;
  monto: string;
}

const SUGERENCIAS: Omit<Fila, "clave" | "monto">[] = [
  { nombre: "Plazo fijo", grupo: "invertido", moneda: "ARS" },
  { nombre: "Fondo común", grupo: "invertido", moneda: "ARS" },
  { nombre: "Acciones", grupo: "invertido", moneda: "USD" },
  { nombre: "Cripto", grupo: "invertido", moneda: "USD" },
  { nombre: "Billetera virtual", grupo: "disponible", moneda: "ARS" },
];

let siguiente = 10;

/** La primera vez: dónde tenés tu plata hoy. Todo es opcional y se cambia después. */
export default function Empezar() {
  const router = useRouter();
  const [filas, setFilas] = useState<Fila[]>([
    { clave: 1, nombre: "Banco", grupo: "disponible", moneda: "ARS", monto: "" },
    { clave: 2, nombre: "Efectivo", grupo: "disponible", moneda: "ARS", monto: "" },
    { clave: 3, nombre: "Dólares", grupo: "disponible", moneda: "USD", monto: "" },
  ]);

  function cambiar(clave: number, cambios: Partial<Fila>) {
    setFilas((fs) => fs.map((f) => (f.clave === clave ? { ...f, ...cambios } : f)));
  }

  function terminar(evento?: FormEvent) {
    evento?.preventDefault();
    const lugares = filas
      .filter((f) => f.nombre.trim())
      .map((f) => ({ nombre: f.nombre.trim(), grupo: f.grupo, moneda: f.moneda, saldoInicial: leerMonto(f.monto) ?? 0 }));
    empezar(lugares);
    router.replace("/app");
  }

  const faltan = SUGERENCIAS.filter((s) => !filas.some((f) => f.nombre === s.nombre));

  return (
    <form onSubmit={terminar} className="mx-auto grid max-w-md gap-6 py-8">
      <Logo tamano="text-2xl" />
      <div className="grid gap-2">
        <h1 className="font-marca text-[30px] leading-tight text-balance">¿Dónde tenés tu plata hoy?</h1>
        <p className="text-texto-2">Poné lo que tengas en cada lugar, más o menos. Lo podés cambiar cuando quieras; si no sabés, dejalo vacío.</p>
      </div>

      <div className="grid gap-3">
        {filas.map((f) => (
          <div key={f.clave} className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 rounded-tarjeta border border-linea bg-superficie p-3">
            <input
              id={`nombre-${f.clave}`}
              aria-label="Nombre del lugar"
              className="min-h-9 bg-transparent font-medium outline-none"
              value={f.nombre}
              onChange={(e) => cambiar(f.clave, { nombre: e.target.value })}
            />
            <button type="button" aria-label={`Sacar ${f.nombre}`} onClick={() => setFilas((fs) => fs.filter((x) => x.clave !== f.clave))} className="grid size-9 place-items-center text-texto-2">
              <X className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </button>
            <div className="col-span-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => cambiar(f.clave, { moneda: f.moneda === "ARS" ? "USD" : "ARS" })}
                className="min-h-11 shrink-0 rounded-chico border border-linea px-3 text-sm font-medium"
                aria-label={`Moneda: ${f.moneda === "ARS" ? "pesos" : "dólares"}. Tocá para cambiar.`}
              >
                {SIGNO[f.moneda]}
              </button>
              <input
                id={`monto-${f.clave}`}
                aria-label={`Cuánto hay en ${f.nombre}`}
                className={`${CLASE_CAMPO} cifra`}
                inputMode="decimal"
                placeholder="0"
                value={f.monto}
                onChange={(e) => cambiar(f.clave, { monto: e.target.value })}
              />
            </div>
            <span className="col-span-2 text-xs text-texto-2">{f.grupo === "disponible" ? "Disponible" : "Invertido"}</span>
          </div>
        ))}
      </div>

      {faltan.length > 0 && (
        <div className="grid gap-2">
          <p className="text-sm text-texto-2">¿Tenés plata en otro lado?</p>
          <div className="flex flex-wrap gap-2">
            {faltan.map((s) => (
              <button key={s.nombre} type="button" onClick={() => setFilas((fs) => [...fs, { ...s, clave: siguiente++, monto: "" }])} className="min-h-10 rounded-full border border-dashed border-linea px-3.5 text-sm">
                + {s.nombre}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-2">
        <Boton type="submit">Empezar</Boton>
        <Boton variante="fantasma" onClick={() => (empezar([{ nombre: "Efectivo", grupo: "disponible", moneda: "ARS", saldoInicial: 0 }]), router.replace("/app"))}>
          Lo cargo después
        </Boton>
      </div>
    </form>
  );
}
