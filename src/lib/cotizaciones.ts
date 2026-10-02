"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { CotizacionMercado } from "./datos/calculos";

/**
 * Las cotizaciones del día (`/api/cotizacion`). Se guardan en el dispositivo: sin señal se usa la
 * última que se pudo traer, marcada como "guardada".
 */
const CLAVE = "gastoico:cotizaciones";
const CADA_MS = 15 * 60_000;

interface Guardadas {
  casas: CotizacionMercado[];
  traidas: string;
}

let estado: { guardadas: Guardadas | null; alDia: boolean } | null = null;
let pidiendo: Promise<void> | null = null;
const oyentes = new Set<() => void>();
const SERVIDOR = { guardadas: null, alDia: false };

function leer(): Guardadas | null {
  try {
    const crudo = localStorage.getItem(CLAVE);
    return crudo ? (JSON.parse(crudo) as Guardadas) : null;
  } catch {
    return null;
  }
}

function snapshot() {
  estado ??= { guardadas: leer(), alDia: false };
  return estado;
}

async function traer() {
  try {
    const res = await fetch("/api/cotizacion", { cache: "no-store" });
    if (!res.ok) return;
    const { casas } = (await res.json()) as { casas: CotizacionMercado[] };
    if (!Array.isArray(casas) || casas.length === 0) return;
    const guardadas = { casas, traidas: new Date().toISOString() };
    try {
      localStorage.setItem(CLAVE, JSON.stringify(guardadas));
    } catch {
      // Sin almacenamiento: queda en memoria.
    }
    estado = { guardadas, alDia: true };
    oyentes.forEach((fn) => fn());
  } catch {
    // Sin señal: se sigue con la guardada.
  }
}

function pedir() {
  pidiendo ??= traer().finally(() => {
    pidiendo = null;
  });
  return pidiendo;
}

export function useCotizaciones(): { casas: CotizacionMercado[] | null; alDia: boolean } {
  const actual = useSyncExternalStore(
    (fn) => {
      oyentes.add(fn);
      return () => oyentes.delete(fn);
    },
    snapshot,
    () => SERVIDOR,
  );
  useEffect(() => {
    const viejas = !actual.guardadas || Date.now() - Date.parse(actual.guardadas.traidas) > CADA_MS;
    if (!actual.alDia || viejas) void pedir();
    window.addEventListener("online", pedir);
    return () => window.removeEventListener("online", pedir);
  }, [actual.alDia, actual.guardadas]);
  return { casas: actual.guardadas?.casas ?? null, alDia: actual.alDia };
}
