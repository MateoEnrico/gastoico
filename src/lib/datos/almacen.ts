"use client";

import { useSyncExternalStore } from "react";

import { datosIniciales, nuevoId } from "./iniciales";
import type { Categoria, Datos, Gasto, Ingreso, Lugar, Moneda, Movida, Movimiento, Preferencias } from "./tipos";

/**
 * Dónde viven los datos en el dispositivo (localStorage). Las pantallas no saben nada de esto: leen
 * con `useDatos()` y cambian con las funciones de abajo. La nube escucha con `avisarCambios`.
 */
const CLAVE = "gastoico:datos:v1";
const CLAVE_ACTUALIZADO = "gastoico:datos:actualizado";

let cache: { crudo: string | null; datos: Datos } | null = null;
let alGuardar: (() => void) | null = null;
const oyentes = new Set<() => void>();

function leerCrudo(): string | null {
  try {
    return localStorage.getItem(CLAVE);
  } catch {
    return null;
  }
}

/** Completa lo que falte en datos guardados por una versión anterior. */
export function completar(guardado: Partial<Datos> | null): Datos {
  const base = datosIniciales();
  if (!guardado || guardado.version !== 1) return base;
  return {
    ...base,
    ...guardado,
    preferencias: { ...base.preferencias, ...guardado.preferencias },
    ultimo: { ...base.ultimo, ...guardado.ultimo },
  };
}

function snapshot(): Datos {
  const crudo = leerCrudo();
  if (cache && cache.crudo === crudo) return cache.datos;
  let datos: Datos;
  try {
    datos = completar(crudo ? JSON.parse(crudo) : null);
  } catch {
    datos = datosIniciales();
  }
  cache = { crudo, datos };
  return datos;
}

function avisar() {
  oyentes.forEach((fn) => fn());
}

function escribir(datos: Datos | null, actualizado = new Date().toISOString()) {
  try {
    if (datos) localStorage.setItem(CLAVE, JSON.stringify(datos));
    else localStorage.removeItem(CLAVE);
    localStorage.setItem(CLAVE_ACTUALIZADO, actualizado);
  } catch {
    // Sin almacenamiento (modo privado lleno): queda solo en memoria hasta recargar.
    cache = { crudo: null, datos: datos ?? datosIniciales() };
  }
  avisar();
}

function suscribir(fn: () => void) {
  oyentes.add(fn);
  const deOtraPestana = (e: StorageEvent) => e.key === CLAVE && fn();
  window.addEventListener("storage", deOtraPestana);
  return () => {
    oyentes.delete(fn);
    window.removeEventListener("storage", deOtraPestana);
  };
}

/** Los datos, o null mientras se renderiza en el servidor (ahí no hay localStorage). */
export function useDatos(): Datos | null {
  return useSyncExternalStore(suscribir, snapshot, () => null);
}

export function leerDatos(): Datos {
  return snapshot();
}

// —— Para la nube ——

export function avisarCambios(fn: (() => void) | null) {
  alGuardar = fn;
}

export function guardadoLocal(): { datos: Datos | null; actualizado: string | null } {
  try {
    const crudo = localStorage.getItem(CLAVE);
    return { datos: crudo ? completar(JSON.parse(crudo)) : null, actualizado: localStorage.getItem(CLAVE_ACTUALIZADO) };
  } catch {
    return { datos: null, actualizado: null };
  }
}

/** Reemplaza lo del dispositivo por lo de la nube (o lo borra, al salir). No vuelve a subir. */
export function traerDeLaNube(datos: Datos | null, actualizado: string) {
  escribir(datos ? completar(datos) : null, actualizado);
}

// —— Cambios ——

export function actualizar(cambio: (datos: Datos) => Datos) {
  escribir(cambio(snapshot()));
  alGuardar?.();
}

export function empezar(lugares: Omit<Lugar, "id">[]) {
  actualizar((d) => {
    const nuevos = lugares.map((l) => ({ ...l, id: nuevoId() }));
    const ars = nuevos.find((l) => l.moneda === "ARS" && l.grupo === "disponible");
    const usd = nuevos.find((l) => l.moneda === "USD" && l.grupo === "disponible");
    return {
      ...d,
      empezado: true,
      lugares: [...d.lugares, ...nuevos],
      ultimo: { ...d.ultimo, lugarARS: d.ultimo.lugarARS ?? ars?.id ?? null, lugarUSD: d.ultimo.lugarUSD ?? usd?.id ?? null },
    };
  });
}

type SinBase<T> = Omit<T, "id" | "creado">;

export function cargarGasto(gasto: SinBase<Gasto>): Gasto {
  const nuevo: Gasto = { ...gasto, id: nuevoId(), creado: new Date().toISOString() };
  actualizar((d) => ({ ...d, movimientos: [...d.movimientos, nuevo], ultimo: recordar(d.ultimo, gasto.moneda, gasto.lugarId) }));
  return nuevo;
}

export function cargarIngreso(ingreso: SinBase<Ingreso>): Ingreso {
  const nuevo: Ingreso = { ...ingreso, id: nuevoId(), creado: new Date().toISOString() };
  actualizar((d) => ({ ...d, movimientos: [...d.movimientos, nuevo] }));
  return nuevo;
}

export function cargarMovida(movida: SinBase<Movida>): Movida {
  const nueva: Movida = { ...movida, id: nuevoId(), creado: new Date().toISOString() };
  actualizar((d) => ({ ...d, movimientos: [...d.movimientos, nueva] }));
  return nueva;
}

function recordar(ultimo: Datos["ultimo"], moneda: Moneda, lugarId: string | null): Datos["ultimo"] {
  return { moneda, lugarARS: moneda === "ARS" ? lugarId : ultimo.lugarARS, lugarUSD: moneda === "USD" ? lugarId : ultimo.lugarUSD };
}

export function editarMovimiento(movimiento: Movimiento) {
  actualizar((d) => ({ ...d, movimientos: d.movimientos.map((m) => (m.id === movimiento.id ? movimiento : m)) }));
}

/** Vuelve a poner un movimiento borrado (para "Deshacer"). */
export function restaurarMovimiento(movimiento: Movimiento) {
  actualizar((d) => (d.movimientos.some((m) => m.id === movimiento.id) ? d : { ...d, movimientos: [...d.movimientos, movimiento] }));
}

export function borrarMovimiento(id: string) {
  actualizar((d) => ({ ...d, movimientos: d.movimientos.filter((m) => m.id !== id) }));
}

/** Pone el saldo de un lugar en un valor: guarda la diferencia como ajuste. */
export function corregirSaldo(lugarId: string, diferencia: number, fecha: string, nota?: string): string | null {
  if (diferencia === 0) return null;
  const id = nuevoId();
  actualizar((d) => ({
    ...d,
    movimientos: [...d.movimientos, { tipo: "ajuste", id, creado: new Date().toISOString(), fecha, lugarId, diferencia, nota }],
  }));
  return id;
}

export function crearLugar(lugar: Omit<Lugar, "id">): Lugar {
  const nuevo = { ...lugar, id: nuevoId() };
  actualizar((d) => ({ ...d, lugares: [...d.lugares, nuevo] }));
  return nuevo;
}

export function editarLugar(id: string, cambios: Partial<Omit<Lugar, "id" | "moneda">>) {
  actualizar((d) => ({ ...d, lugares: d.lugares.map((l) => (l.id === id ? { ...l, ...cambios } : l)) }));
}

export function crearCategoria(nombre: string, color: string): Categoria {
  const nueva = { id: nuevoId(), nombre: nombre.trim(), color };
  actualizar((d) => ({ ...d, categorias: [...d.categorias, nueva] }));
  return nueva;
}

export function editarCategoria(id: string, cambios: Partial<Omit<Categoria, "id">>) {
  actualizar((d) => ({ ...d, categorias: d.categorias.map((c) => (c.id === id ? { ...c, ...cambios } : c)) }));
}

export function cambiarPreferencias(cambios: Partial<Preferencias>) {
  actualizar((d) => ({ ...d, preferencias: { ...d.preferencias, ...cambios } }));
}

