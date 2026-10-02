"use client";

import { avisarCambios, guardadoLocal, traerDeLaNube } from "../datos/almacen";
import type { Datos } from "../datos/tipos";
import { nube } from "./cliente";

/**
 * Los datos en la nube: una fila por usuario en `public.gastoico_datos`, con todo `Datos` como JSON.
 * La app guarda primero en el dispositivo (anda sin señal) y sube cada cambio cuando puede. Gana lo
 * más nuevo. Es el mismo esquema que Gastagro (`public.gastagro_campos`).
 */
const TABLA = "gastoico_datos";
const CLAVE_PENDIENTE = "gastoico:nube:pendiente";
const CLAVE_USUARIO = "gastoico:nube:usuario";

let usuario: string | null = null;
let espera: ReturnType<typeof setTimeout> | null = null;

function leer(clave: string): string | null {
  try {
    return localStorage.getItem(clave);
  } catch {
    return null;
  }
}

function poner(clave: string, valor: string | null) {
  try {
    if (valor === null) localStorage.removeItem(clave);
    else localStorage.setItem(clave, valor);
  } catch {
    // Sin almacenamiento.
  }
}

async function subir(datos: Datos | null, actualizado: string): Promise<boolean> {
  const cliente = nube();
  if (!cliente || !usuario) return false;
  const { error } = datos
    ? await cliente.from(TABLA).upsert({ user_id: usuario, datos, actualizado })
    : await cliente.from(TABLA).delete().eq("user_id", usuario);
  poner(CLAVE_PENDIENTE, error ? "1" : null);
  return !error;
}

/** Sube lo del dispositivo, esperando un momento para juntar cambios seguidos. */
function programarSubida() {
  poner(CLAVE_PENDIENTE, "1");
  if (espera) clearTimeout(espera);
  espera = setTimeout(() => {
    const { datos, actualizado } = guardadoLocal();
    void subir(datos, actualizado ?? new Date().toISOString());
  }, 800);
}

/**
 * Al entrar: trae lo de la nube o sube lo del dispositivo, según qué sea más nuevo. Si en este
 * dispositivo había otro usuario, lo suyo no se mezcla: se reemplaza por lo de la nube.
 */
export async function sincronizarAlEntrar(id: string): Promise<void> {
  const cliente = nube();
  if (!cliente) return;
  const anterior = leer(CLAVE_USUARIO);
  usuario = id;
  poner(CLAVE_USUARIO, id);
  avisarCambios(() => programarSubida());

  const { data, error } = await cliente.from(TABLA).select("datos, actualizado").eq("user_id", id).maybeSingle();
  if (error) return; // Sin señal: se sigue con lo del dispositivo y se sube después.

  const local = guardadoLocal();
  const remoto = data as { datos: Datos; actualizado: string } | null;

  if (anterior !== null && anterior !== id) {
    traerDeLaNube(remoto?.datos ?? null, remoto?.actualizado ?? new Date().toISOString());
    return;
  }
  if (remoto && (!local.datos || !local.actualizado || remoto.actualizado >= local.actualizado)) {
    const pendienteMasNuevo = leer(CLAVE_PENDIENTE) && local.actualizado && local.actualizado > remoto.actualizado;
    if (!pendienteMasNuevo) {
      traerDeLaNube(remoto.datos, remoto.actualizado);
      poner(CLAVE_PENDIENTE, null);
      return;
    }
  }
  if (local.datos) await subir(local.datos, local.actualizado ?? new Date().toISOString());
}

export function reintentarAlVolverLaSenal(): () => void {
  const alVolver = () => {
    if (leer(CLAVE_PENDIENTE)) programarSubida();
  };
  window.addEventListener("online", alVolver);
  return () => window.removeEventListener("online", alVolver);
}

/** Al salir, lo del dispositivo se borra: el próximo que entre no ve lo de otro. */
export function olvidarAlSalir() {
  usuario = null;
  avisarCambios(null);
  poner(CLAVE_USUARIO, null);
  poner(CLAVE_PENDIENTE, null);
  traerDeLaNube(null, new Date().toISOString());
}
