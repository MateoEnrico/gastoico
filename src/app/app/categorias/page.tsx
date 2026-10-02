"use client";

import { useState } from "react";
import { NuevaCategoria, SelectorColor } from "@/components/categorias";
import { ConDatos } from "@/components/con-datos";
import { Boton, CLASE_CAMPO, Encabezado, Etiqueta, Tarjeta } from "@/components/ui";
import { confirmar } from "@/lib/confirmacion";
import { editarCategoria } from "@/lib/datos/almacen";
import type { Categoria, Datos } from "@/lib/datos/tipos";

export default function PaginaCategorias() {
  return <ConDatos>{(datos) => <Categorias datos={datos} />}</ConDatos>;
}

function Categorias({ datos }: { datos: Datos }) {
  const [abierta, setAbierta] = useState<string | null>(null);
  const [creando, setCreando] = useState(false);
  const activas = datos.categorias.filter((c) => !c.archivada);
  const archivadas = datos.categorias.filter((c) => c.archivada);

  return (
    <div className="grid gap-5">
      <Encabezado titulo="Categorías" volver="/app/ajustes" />
      <p className="text-texto-2">Renombralas, cambiales el color o creá las tuyas. Archivar una la saca de la carga, pero los gastos viejos la conservan.</p>
      <Tarjeta className="divide-y divide-linea">
        {activas.map((c) => (
          <FilaCategoria key={c.id} categoria={c} abierta={abierta === c.id} onAbrir={() => setAbierta(abierta === c.id ? null : c.id)} />
        ))}
      </Tarjeta>
      {creando ? (
        <NuevaCategoria onCreada={() => setCreando(false)} onCancelar={() => setCreando(false)} />
      ) : (
        <Boton variante="secundario" onClick={() => setCreando(true)}>
          + Nueva categoría
        </Boton>
      )}
      {archivadas.length > 0 && (
        <section className="grid gap-2">
          <h2 className="text-sm font-medium text-texto-2">Archivadas</h2>
          <Tarjeta className="divide-y divide-linea">
            {archivadas.map((c) => (
              <div key={c.id} className="flex min-h-12 items-center justify-between gap-3 px-4">
                <span className="flex items-center gap-2.5 text-texto-2">
                  <span className="size-3 rounded-[4px]" style={{ background: c.color }} />
                  {c.nombre}
                </span>
                <button type="button" onClick={() => (editarCategoria(c.id, { archivada: false }), confirmar(`Listo: ${c.nombre} vuelve a aparecer al cargar.`))} className="text-sm font-medium text-primario">
                  Recuperar
                </button>
              </div>
            ))}
          </Tarjeta>
        </section>
      )}
    </div>
  );
}

function FilaCategoria({ categoria, abierta, onAbrir }: { categoria: Categoria; abierta: boolean; onAbrir: () => void }) {
  const [nombre, setNombre] = useState(categoria.nombre);
  const [color, setColor] = useState(categoria.color);

  return (
    <div>
      <button type="button" onClick={onAbrir} aria-expanded={abierta} className="flex min-h-12 w-full items-center gap-3 px-4 text-left">
        <span className="size-3.5 rounded-[4px]" style={{ background: categoria.color }} />
        {categoria.nombre}
      </button>
      {abierta && (
        <div className="grid gap-3 px-4 pb-4">
          <div className="grid gap-1.5">
            <Etiqueta htmlFor={`cat-${categoria.id}`}>Nombre</Etiqueta>
            <input id={`cat-${categoria.id}`} className={CLASE_CAMPO} value={nombre} maxLength={30} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <SelectorColor valor={color} onCambio={setColor} />
          <div className="flex flex-wrap gap-2">
            <Boton onClick={() => (editarCategoria(categoria.id, { nombre: nombre.trim() || categoria.nombre, color }), confirmar("Listo: guardaste la categoría."), onAbrir())}>Guardar</Boton>
            <Boton variante="secundario" onClick={() => (editarCategoria(categoria.id, { archivada: true }), confirmar(`Listo: archivaste ${categoria.nombre}.`))}>
              Archivar
            </Boton>
          </div>
        </div>
      )}
    </div>
  );
}
