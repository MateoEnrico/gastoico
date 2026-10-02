"use client";

import { useSyncExternalStore } from "react";

function suscribir(avisar: () => void) {
  window.addEventListener("online", avisar);
  window.addEventListener("offline", avisar);
  return () => {
    window.removeEventListener("online", avisar);
    window.removeEventListener("offline", avisar);
  };
}

/** Franja de arriba cuando no hay señal. */
export function AvisoConexion() {
  const conSenal = useSyncExternalStore(suscribir, () => navigator.onLine, () => true);
  if (conSenal) return null;
  return (
    <div
      role="status"
      className="sticky top-0 z-40 flex min-h-[calc(env(safe-area-inset-top)_+_2.25rem)] items-center justify-center border-b border-linea bg-superficie px-4 pt-[env(safe-area-inset-top)] text-center text-sm text-texto-2"
    >
      Sin señal. Lo que cargues se guarda en este dispositivo y se sube cuando vuelva.
    </div>
  );
}
