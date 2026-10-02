"use client";

import { useState } from "react";
import { crearCategoria } from "@/lib/datos/almacen";
import { COLORES_CATEGORIA } from "@/lib/datos/iniciales";
import { confirmar } from "@/lib/confirmacion";
import { Aviso, Boton, CLASE_CAMPO, Etiqueta } from "./ui";

/** Crear una categoría sin salir de la carga: nombre y uno de los doce colores. */
export function NuevaCategoria({ onCreada, onCancelar }: { onCreada: (id: string) => void; onCancelar: () => void }) {
  const [nombre, setNombre] = useState("");
  const [color, setColor] = useState<string>(COLORES_CATEGORIA[8]);
  const [error, setError] = useState<string | null>(null);

  function crear() {
    if (!nombre.trim()) return setError("Poné un nombre.");
    onCreada(crearCategoria(nombre, color).id);
    confirmar(`Listo: creaste ${nombre.trim()}. Ya aparece al cargar.`);
  }

  return (
    <div className="mt-1 grid gap-3 rounded-tarjeta border border-linea bg-superficie p-4">
      <div className="grid gap-1.5">
        <Etiqueta htmlFor="nueva-categoria">Nombre</Etiqueta>
        <input
          id="nueva-categoria"
          className={CLASE_CAMPO}
          autoFocus
          placeholder="Mascotas, gimnasio…"
          maxLength={30}
          value={nombre}
          onChange={(e) => (setNombre(e.target.value), setError(null))}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              crear();
            }
          }}
        />
      </div>
      <SelectorColor valor={color} onCambio={setColor} />
      {error && <Aviso tono="error">{error}</Aviso>}
      <div className="flex gap-2">
        <Boton onClick={crear}>Crear categoría</Boton>
        <Boton variante="fantasma" onClick={onCancelar}>
          Cancelar
        </Boton>
      </div>
    </div>
  );
}

export function SelectorColor({ valor, onCambio }: { valor: string; onCambio: (c: string) => void }) {
  return (
    <div className="grid gap-1.5">
      <span className="text-sm text-texto-2">Color</span>
      <div role="radiogroup" aria-label="Color" className="grid grid-cols-6 gap-2 sm:flex sm:flex-wrap">
        {COLORES_CATEGORIA.map((c) => (
          <button
            key={c}
            type="button"
            role="radio"
            aria-checked={valor === c}
            aria-label={`Color ${c}`}
            onClick={() => onCambio(c)}
            className={`size-9 rounded-[10px] ${valor === c ? "outline-2 outline-offset-2 outline-texto" : ""}`}
            style={{ background: c }}
          />
        ))}
      </div>
    </div>
  );
}

