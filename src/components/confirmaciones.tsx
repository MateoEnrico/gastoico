"use client";

import { Toaster } from "sonner";

/**
 * Los avisos de "Listo". Abajo y al centro, por encima de la barra de navegación en el celular.
 * Sonner ya anuncia cada aviso a los lectores de pantalla sin robar el foco.
 */
export function Confirmaciones() {
  return (
    <Toaster
      position="bottom-center"
      theme="system"
      offset={{ bottom: 24 }}
      mobileOffset={{ bottom: "calc(env(safe-area-inset-bottom) + 5.75rem)", left: 16, right: 16 }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "flex w-full items-center gap-3 rounded-tarjeta bg-cipres px-4 py-3 text-sm text-piedra shadow-lg font-sans",
          content: "flex-1",
          title: "leading-snug",
          actionButton: "presionable shrink-0 rounded-chico bg-piedra/10 px-3 py-1.5 font-semibold text-bronce",
        },
      }}
    />
  );
}
