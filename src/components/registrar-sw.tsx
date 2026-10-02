"use client";

// Empieza a escuchar si la app se puede instalar desde que carga cualquier página.
import "@/lib/instalar";

import { useEffect, useState } from "react";

/** Registra el service worker (solo en producción) y avisa cuando hay una versión nueva. */
export function RegistrarSW() {
  const [nueva, setNueva] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") {
      // Que un service worker de probar el build no sirva páginas viejas mientras se programa.
      navigator.serviceWorker.getRegistrations().then((rs) => rs.forEach((r) => r.unregister()));
      if ("caches" in window) caches.keys().then((ns) => ns.filter((n) => n.startsWith("gastoico-")).forEach((n) => caches.delete(n))).catch(() => {});
      return;
    }
    let vigente = true;
    const avisar = (sw: ServiceWorker | null) => {
      if (vigente && sw && navigator.serviceWorker.controller) setNueva(sw);
    };
    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .then((registro) => {
        avisar(registro.waiting);
        registro.addEventListener("updatefound", () => {
          const instalando = registro.installing;
          instalando?.addEventListener("statechange", () => {
            if (instalando.state === "installed") avisar(instalando);
          });
        });
      })
      .catch(() => {});
    return () => {
      vigente = false;
    };
  }, []);

  if (!nueva) return null;

  function actualizar() {
    navigator.serviceWorker.addEventListener("controllerchange", () => window.location.reload(), { once: true });
    nueva?.postMessage({ type: "SKIP_WAITING" });
  }

  return (
    <div
      role="status"
      className="fixed inset-x-4 bottom-[calc(env(safe-area-inset-bottom)_+_5.5rem)] z-50 mx-auto flex max-w-md items-center justify-between gap-3 rounded-tarjeta bg-cipres py-2 pr-2 pl-4 text-sm text-piedra shadow-lg lg:right-6 lg:bottom-6 lg:left-auto lg:mx-0"
    >
      <span>Hay una versión nueva de Gastoico</span>
      <button type="button" onClick={actualizar} className="min-h-10 shrink-0 rounded-chico bg-bronce px-4 font-semibold text-[#17201d]">
        Actualizar
      </button>
    </div>
  );
}
