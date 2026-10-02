"use client";

import { useState } from "react";
import { ConDatos } from "@/components/con-datos";
import { PildoraCotizacion } from "@/components/pildora-cotizacion";
import { Aviso, Boton, CLASE_CAMPO, Encabezado, Etiqueta, Monto, Segmento, Tarjeta } from "@/components/ui";
import { confirmar } from "@/lib/confirmacion";
import { corregirSaldo, crearLugar, editarLugar } from "@/lib/datos/almacen";
import { patrimonio, type LugarConSaldo } from "@/lib/datos/calculos";
import type { Datos, Grupo, Moneda } from "@/lib/datos/tipos";
import { fechaHoy, leerMonto, monto, numero, SIGNO } from "@/lib/formato";
import { useCotizacion } from "@/lib/usar-cotizacion";

export default function PaginaPlata() {
  return <ConDatos>{(datos) => <Plata datos={datos} />}</ConDatos>;
}

function Plata({ datos }: { datos: Datos }) {
  const vigente = useCotizacion(datos);
  const moneda = datos.preferencias.monedaTotal;
  const p = patrimonio(datos, moneda, vigente.valor);
  const [abierto, setAbierto] = useState<string | null>(null);
  const [agregando, setAgregando] = useState<Grupo | null>(null);

  return (
    <div className="grid gap-5">
      <Encabezado titulo="Mi plata" />
      <div className="grid gap-2">
        {p.total !== null && <Monto centavos={p.total} moneda={moneda} conCentavos={false} className="text-4xl font-semibold" />}
        <div>
          <PildoraCotizacion vigente={vigente} />
        </div>
      </div>

      {(["disponible", "invertido"] as const).map((grupo) => {
        const total = grupo === "disponible" ? p.disponible : p.invertido;
        return (
          <section key={grupo} className="grid gap-2">
            <div className="flex items-baseline justify-between">
              <h2 className="font-semibold">{grupo === "disponible" ? "Disponible" : "Invertido"}</h2>
              {total !== null && <Monto centavos={total} moneda={moneda} conCentavos={false} className="font-semibold" />}
            </div>
            <Tarjeta className="divide-y divide-linea">
              {p.lugares[grupo].map((l) => (
                <FilaLugar key={l.id} lugar={l} abierto={abierto === l.id} onAbrir={() => setAbierto(abierto === l.id ? null : l.id)} />
              ))}
              {agregando === grupo ? (
                <NuevoLugar grupo={grupo} onListo={() => setAgregando(null)} />
              ) : (
                <button type="button" onClick={() => setAgregando(grupo)} className="flex min-h-12 w-full items-center px-4 text-sm font-medium text-primario">
                  + Agregar {grupo === "disponible" ? "cuenta, efectivo o billetera" : "plazo fijo, fondo, acciones…"}
                </button>
              )}
            </Tarjeta>
          </section>
        );
      })}
      <p className="text-sm text-texto-2">Los saldos se cargan a mano: Gastoico no se conecta con ningún banco.</p>
    </div>
  );
}

function FilaLugar({ lugar, abierto, onAbrir }: { lugar: LugarConSaldo; abierto: boolean; onAbrir: () => void }) {
  const [nombre, setNombre] = useState(lugar.nombre);
  const [saldo, setSaldo] = useState(numero(lugar.saldo));
  const [error, setError] = useState<string | null>(null);

  function guardar() {
    const nuevo = leerMonto(saldo.replace(/^-/, ""));
    if (nuevo === null) return setError("Escribí el saldo de hoy.");
    const conSigno = saldo.trim().startsWith("-") ? -nuevo : nuevo;
    if (nombre.trim() && nombre.trim() !== lugar.nombre) editarLugar(lugar.id, { nombre: nombre.trim() });
    corregirSaldo(lugar.id, conSigno - lugar.saldo, fechaHoy());
    confirmar(`Listo: ${nombre.trim() || lugar.nombre} tiene ${monto(conSigno, lugar.moneda)}.`);
    onAbrir();
  }

  return (
    <div>
      <button type="button" onClick={onAbrir} aria-expanded={abierto} className="flex min-h-13 w-full items-center justify-between gap-3 px-4 text-left">
        <span className="grid">
          <span>{lugar.nombre}</span>
          {lugar.moneda !== "ARS" && <span className="text-xs text-texto-2">En dólares</span>}
        </span>
        <Monto centavos={lugar.saldo} moneda={lugar.moneda} conCentavos={false} className="font-medium" />
      </button>
      {abierto && (
        <div className="grid gap-3 px-4 pb-4">
          <div className="grid gap-1.5">
            <Etiqueta htmlFor={`nombre-${lugar.id}`}>Nombre</Etiqueta>
            <input id={`nombre-${lugar.id}`} className={CLASE_CAMPO} value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={40} />
          </div>
          <div className="grid gap-1.5">
            <Etiqueta htmlFor={`saldo-${lugar.id}`}>Saldo de hoy ({SIGNO[lugar.moneda]})</Etiqueta>
            <input id={`saldo-${lugar.id}`} className={`${CLASE_CAMPO} cifra`} inputMode="decimal" value={saldo} onChange={(e) => (setSaldo(e.target.value), setError(null))} />
            <span className="text-xs text-texto-2">Si cambió solo (intereses, suba de las acciones), poné el saldo nuevo: se guarda la diferencia.</span>
          </div>
          {error && <Aviso tono="error">{error}</Aviso>}
          <div className="flex flex-wrap gap-2">
            <Boton onClick={guardar}>Guardar</Boton>
            <Boton
              variante="secundario"
              onClick={() => {
                editarLugar(lugar.id, { archivado: true });
                confirmar(lugar.saldo === 0 ? `Listo: archivaste ${lugar.nombre}.` : `Listo: archivaste ${lugar.nombre}. Su saldo sigue sumando hasta que quede en cero.`);
              }}
            >
              Archivar
            </Boton>
          </div>
        </div>
      )}
    </div>
  );
}

function NuevoLugar({ grupo: grupoInicial, onListo }: { grupo: Grupo; onListo: () => void }) {
  const [nombre, setNombre] = useState("");
  const [grupo, setGrupo] = useState<Grupo>(grupoInicial);
  const [moneda, setMoneda] = useState<Moneda>("ARS");
  const [saldo, setSaldo] = useState("");
  const [error, setError] = useState<string | null>(null);

  function crear() {
    if (!nombre.trim()) return setError("Poné un nombre, por ejemplo «Mercado Pago» o «Plazo fijo».");
    crearLugar({ nombre: nombre.trim(), grupo, moneda, saldoInicial: leerMonto(saldo) ?? 0 });
    confirmar(`Listo: agregaste ${nombre.trim()}.`);
    onListo();
  }

  return (
    <div className="grid gap-3 p-4">
      <div className="grid gap-1.5">
        <Etiqueta htmlFor="lugar-nombre">Nombre</Etiqueta>
        <input id="lugar-nombre" autoFocus className={CLASE_CAMPO} placeholder={grupo === "disponible" ? "Mercado Pago, caja de ahorro…" : "Plazo fijo, FCI, CEDEARs…"} value={nombre} onChange={(e) => (setNombre(e.target.value), setError(null))} maxLength={40} />
      </div>
      <div className="flex flex-wrap gap-3">
        <Segmento etiqueta="Grupo" valor={grupo} onCambio={setGrupo} opciones={[{ valor: "disponible", texto: "Disponible" }, { valor: "invertido", texto: "Invertido" }]} />
        <Segmento etiqueta="Moneda" valor={moneda} onCambio={setMoneda} opciones={[{ valor: "ARS", texto: "$ Pesos" }, { valor: "USD", texto: "US$ Dólares" }]} />
      </div>
      <div className="grid gap-1.5">
        <Etiqueta htmlFor="lugar-saldo">Cuánto hay hoy ({SIGNO[moneda]})</Etiqueta>
        <input id="lugar-saldo" className={`${CLASE_CAMPO} cifra`} inputMode="decimal" placeholder="0" value={saldo} onChange={(e) => setSaldo(e.target.value)} />
      </div>
      {error && <Aviso tono="error">{error}</Aviso>}
      <div className="flex gap-2">
        <Boton onClick={crear}>Agregar</Boton>
        <Boton variante="fantasma" onClick={onListo}>
          Cancelar
        </Boton>
      </div>
    </div>
  );
}
