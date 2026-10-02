"use client";

import { Smartphone, X } from "lucide-react";
import { useState } from "react";
import { instalar, useInstalacion } from "@/lib/instalar";

const CLAVE = "gastoico:instalar:descartado";
const DIAS_SIN_OFRECER = 7;

function descartadoHace(): number | null {
  try {
    const fecha = localStorage.getItem(CLAVE);
    return fecha ? (Date.now() - Date.parse(fecha)) / 86_400_000 : null;
  } catch {
    return null;
  }
}

/** Ofrece instalar Gastoico como app. No aparece si ya está instalada o si el navegador no deja. */
export function OfrecerInstalar() {
  const donde = useInstalacion();
  const [cerrado, setCerrado] = useState(() => {
    const hace = typeof window === "undefined" ? null : descartadoHace();
    return hace !== null && hace < DIAS_SIN_OFRECER;
  });
  if (cerrado || (donde !== "boton" && donde !== "iphone")) return null;

  function ahoraNo() {
    try {
      localStorage.setItem(CLAVE, new Date().toISOString());
    } catch {
      // Sin almacenamiento: se cierra hasta recargar.
    }
    setCerrado(true);
  }

  return (
    <section aria-label="Instalar la app" className="relative grid grid-cols-[auto_1fr] gap-x-3 gap-y-3 rounded-tarjeta bg-cipres p-4 text-piedra">
      <span className="grid size-10 place-items-center rounded-chico bg-piedra/10 text-bronce">
        <Smartphone className="size-5" strokeWidth={1.75} aria-hidden="true" />
      </span>
      <div className="grid gap-1 pr-8">
        <p className="font-semibold">Tené Gastoico en tu celular</p>
        <p className="text-sm text-piedra/80">
          {donde === "iphone" ? "En Safari, tocá Compartir y después «Agregar a inicio»." : "Queda en tu pantalla de inicio y abre de un toque, aunque no haya señal."}
        </p>
      </div>
      {donde === "boton" && (
        <button type="button" onClick={() => void instalar()} className="col-start-2 min-h-11 justify-self-start rounded-chico bg-bronce px-5 font-semibold text-[#17201d]">
          Instalar
        </button>
      )}
      <button type="button" onClick={ahoraNo} aria-label="Ahora no" className="absolute top-2 right-2 grid size-10 place-items-center rounded-full text-piedra/70 hover:text-piedra">
        <X className="size-5" strokeWidth={1.75} aria-hidden="true" />
      </button>
    </section>
  );
}
