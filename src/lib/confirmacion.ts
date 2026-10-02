"use client";

import { useSyncExternalStore } from "react";

/** El "Listo: …" que aparece abajo después de guardar algo. Dura unos segundos. */
let actual: { texto: string; id: number } | null = null;
let espera: ReturnType<typeof setTimeout> | null = null;
const oyentes = new Set<() => void>();
const avisar = () => oyentes.forEach((fn) => fn());

export function confirmar(texto: string) {
  actual = { texto, id: Date.now() };
  avisar();
  if (espera) clearTimeout(espera);
  espera = setTimeout(() => {
    actual = null;
    avisar();
  }, 3500);
}

export function useConfirmacion() {
  return useSyncExternalStore(
    (fn) => {
      oyentes.add(fn);
      return () => oyentes.delete(fn);
    },
    () => actual,
    () => null,
  );
}
