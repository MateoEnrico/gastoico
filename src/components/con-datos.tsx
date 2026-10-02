"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useDatos } from "@/lib/datos/almacen";
import type { Datos } from "@/lib/datos/tipos";
import { Cargando } from "./con-sesion";

/** Espera los datos del dispositivo. La primera vez manda a la bienvenida. */
export function ConDatos({ children }: { children: (datos: Datos) => ReactNode }) {
  const datos = useDatos();
  const router = useRouter();
  const ruta = usePathname();
  const faltaEmpezar = datos !== null && !datos.empezado && !ruta.startsWith("/app/empezar");

  useEffect(() => {
    if (faltaEmpezar) router.replace("/app/empezar");
  }, [faltaEmpezar, router]);

  if (!datos || faltaEmpezar) return <Cargando />;
  return <>{children(datos)}</>;
}
