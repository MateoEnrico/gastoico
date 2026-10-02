"use client";

import { useSyncExternalStore } from "react";

/**
 * Si Gastoico se puede instalar como app. Chrome y Android avisan una sola vez, al cargar la página
 * (`beforeinstallprompt`): se escucha acá, apenas se carga este archivo, para no perder el aviso si el
 * botón aparece después (por ejemplo, recién al entrar a la cuenta).
 */
interface PedidoInstalar extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export type Instalacion = "servidor" | "instalada" | "boton" | "iphone" | "no-se-puede";

let pedido: PedidoInstalar | null = null;
let instalada = false;
const oyentes = new Set<() => void>();
const avisar = () => oyentes.forEach((fn) => fn());

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (evento) => {
    evento.preventDefault();
    pedido = evento as PedidoInstalar;
    avisar();
  });
  window.addEventListener("appinstalled", () => {
    pedido = null;
    instalada = true;
    avisar();
  });
}

function estado(): Instalacion {
  if (instalada || window.matchMedia("(display-mode: standalone)").matches) return "instalada";
  if (pedido) return "boton";
  // En iPhone no hay botón: se explica cómo agregarla al inicio desde Safari.
  if (/iPhone|iPad|iPod/.test(navigator.userAgent)) return "iphone";
  return "no-se-puede";
}

export function useInstalacion(): Instalacion {
  return useSyncExternalStore(
    (fn) => {
      oyentes.add(fn);
      return () => oyentes.delete(fn);
    },
    estado,
    () => "servidor",
  );
}

/** Abre el cartel del navegador para instalar. */
export async function instalar() {
  const actual = pedido;
  if (!actual) return;
  await actual.prompt();
  pedido = null;
  avisar();
}
