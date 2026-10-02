"use client";

import { ChevronRight, LogOut, Tags } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ConDatos } from "@/components/con-datos";
import { salir } from "@/components/con-sesion";
import { OfrecerInstalar } from "@/components/ofrecer-instalar";
import { Aviso, Boton, CLASE_CAMPO, Encabezado, Etiqueta, Segmento, Tarjeta } from "@/components/ui";
import { confirmar } from "@/lib/confirmacion";
import { cambiarPreferencias } from "@/lib/datos/almacen";
import { NOMBRE_DOLAR } from "@/lib/datos/calculos";
import type { Datos, TipoDolar } from "@/lib/datos/tipos";
import { cotizacion, formatearEntrada, leerCotizacion, numero } from "@/lib/formato";
import { nube } from "@/lib/nube/cliente";
import { useCotizacion } from "@/lib/usar-cotizacion";

const TIPOS: TipoDolar[] = ["bolsa", "oficial", "blue", "tarjeta", "cripto"];

export default function PaginaAjustes() {
  return <ConDatos>{(datos) => <Ajustes datos={datos} />}</ConDatos>;
}

function Ajustes({ datos }: { datos: Datos }) {
  const vigente = useCotizacion(datos);
  const { preferencias } = datos;
  const [propia, setPropia] = useState(preferencias.cotizacionPropia ? numero(Math.round(preferencias.cotizacionPropia * 100)) : "");
  const [error, setError] = useState<string | null>(null);
  const [mail, setMail] = useState<string | null>(null);

  useEffect(() => {
    void nube()?.auth.getUser().then(({ data }) => setMail(data.user?.email ?? null));
  }, []);

  function guardarPropia() {
    const valor = leerCotizacion(propia);
    if (!valor) return setError("Escribí cuántos pesos vale un dólar, por ejemplo 1.550.");
    cambiarPreferencias({ cotizacionPropia: valor });
    setError(null);
    confirmar(`Listo: usás tu dólar a ${cotizacion(valor)}.`);
  }

  return (
    <div className="grid gap-6">
      <Encabezado titulo="Ajustes" />

      <section className="grid gap-2">
        <h2 className="font-semibold">Totales</h2>
        <Tarjeta className="flex flex-wrap items-center justify-between gap-3 p-4">
          <span className="text-sm text-texto-2">Mostrar los totales en</span>
          <Segmento
            etiqueta="Moneda de los totales"
            valor={preferencias.monedaTotal}
            onCambio={(m) => cambiarPreferencias({ monedaTotal: m })}
            opciones={[
              { valor: "ARS", texto: "Pesos" },
              { valor: "USD", texto: "Dólares" },
            ]}
          />
        </Tarjeta>
      </section>

      <section id="cotizacion" className="grid scroll-mt-6 gap-2">
        <h2 className="font-semibold">Cotización del dólar</h2>
        <Tarjeta className="grid gap-4 p-4">
          <p className="text-sm text-texto-2">Se usa para sumar pesos y dólares. Gastoico trae la del día (valor de venta); elegí cuál.</p>
          <div role="radiogroup" aria-label="Tipo de dólar" className="grid gap-1.5">
            {TIPOS.map((t) => {
              const delMercado = vigente.mercado?.find((c) => c.casa === t);
              const activo = !preferencias.cotizacionPropia && preferencias.tipoDolar === t;
              return (
                <button
                  key={t}
                  type="button"
                  role="radio"
                  aria-checked={activo}
                  onClick={() => (cambiarPreferencias({ tipoDolar: t, cotizacionPropia: null }), setPropia(""))}
                  className={`presionable flex min-h-12 items-center justify-between rounded-chico border px-3.5 text-left ${activo ? "border-primario bg-primario-suave" : "border-linea"}`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className={`grid size-4 place-items-center rounded-full border-[1.5px] ${activo ? "border-primario" : "border-texto-2"}`}>{activo && <span className="size-2 rounded-full bg-primario" />}</span>
                    {NOMBRE_DOLAR[t]}
                  </span>
                  <span className="cifra text-sm text-texto-2">{delMercado ? cotizacion(delMercado.venta) : "—"}</span>
                </button>
              );
            })}
          </div>
          <div className="grid gap-1.5 border-t border-linea pt-4">
            <Etiqueta htmlFor="cotizacion-propia">O usá tu propia cotización</Etiqueta>
            <div className="flex gap-2">
              <input
                id="cotizacion-propia"
                className={`${CLASE_CAMPO} cifra`}
                inputMode="decimal"
                placeholder="Pesos por dólar"
                value={propia}
                enterKeyHint="done"
                onChange={(e) => (setPropia(formatearEntrada(e.target.value)), setError(null))}
              />
              <Boton onClick={guardarPropia} className="shrink-0">
                Usar
              </Boton>
            </div>
            {preferencias.cotizacionPropia && (
              <p className="flex flex-wrap items-center gap-2 text-sm">
                <span className="size-2 rounded-full bg-acento" aria-hidden="true" />
                Estás usando tu dólar: {cotizacion(preferencias.cotizacionPropia)}.
                <button type="button" onClick={() => (cambiarPreferencias({ cotizacionPropia: null }), setPropia(""))} className="font-medium text-primario">
                  Volver a {NOMBRE_DOLAR[preferencias.tipoDolar].replace("Dólar ", "")}
                </button>
              </p>
            )}
            {error && <Aviso tono="error">{error}</Aviso>}
          </div>
        </Tarjeta>
      </section>

      <section className="grid gap-2">
        <h2 className="font-semibold">Para cargar</h2>
        <Tarjeta>
          <Link href="/app/categorias" className="fila-presionable flex min-h-13 items-center justify-between rounded-tarjeta px-4">
            <span className="flex items-center gap-3">
              <Tags className="size-5 text-texto-2" strokeWidth={1.75} aria-hidden="true" />
              Categorías
            </span>
            <span className="flex items-center gap-1 text-sm text-texto-2">
              {datos.categorias.filter((c) => !c.archivada).length}
              <ChevronRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </span>
          </Link>
        </Tarjeta>
      </section>

      <OfrecerInstalar />

      {mail && (
        <section className="grid gap-2">
          <h2 className="font-semibold">Cuenta</h2>
          <Tarjeta className="grid gap-3 p-4">
            <p className="text-sm text-texto-2">
              Entraste como <b className="font-medium text-texto">{mail}</b>. Es la misma cuenta para Gastoico y Gastagro.
            </p>
            <Boton variante="secundario" onClick={() => void salir()} className="justify-self-start">
              <LogOut className="size-4" strokeWidth={1.75} aria-hidden="true" />
              Salir
            </Boton>
          </Tarjeta>
        </section>
      )}
    </div>
  );
}
