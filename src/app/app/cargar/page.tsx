"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useRef, useState, type ReactNode } from "react";
import { ConDatos } from "@/components/con-datos";
import { Cargando } from "@/components/con-sesion";
import { NuevaCategoria } from "@/components/categorias";
import { Aviso, Boton, ChipCategoria, CLASE_CAMPO, Etiqueta, Segmento } from "@/components/ui";
import {
  borrarMovimiento,
  restaurarMovimiento,
  cargarGasto,
  cargarIngreso,
  cargarMovida,
  crearLugar,
  editarMovimiento,
} from "@/lib/datos/almacen";
import { convertir, NOMBRE_DOLAR, saldoLugar } from "@/lib/datos/calculos";
import type { Ajuste, Datos, Gasto, Ingreso, Lugar, Moneda, Movida, Movimiento } from "@/lib/datos/tipos";
import { confirmar } from "@/lib/confirmacion";
import { cotizacion, fechaHoy, formatearEntrada, leerCotizacion, leerMonto, monto, numero, SIGNO } from "@/lib/formato";
import { useCotizacion } from "@/lib/usar-cotizacion";

type Tipo = "gasto" | "ingreso" | "dolares" | "mover";

export default function PaginaCargar() {
  return (
    <Suspense fallback={<Cargando />}>
      <ConDatos>{(datos) => <Cargar datos={datos} />}</ConDatos>
    </Suspense>
  );
}

function tipoDe(m: Movimiento, datos: Datos): Tipo | "ajuste" {
  if (m.tipo !== "movida") return m.tipo;
  const desde = datos.lugares.find((l) => l.id === m.desdeLugarId);
  const hasta = datos.lugares.find((l) => l.id === m.hastaLugarId);
  return desde && hasta && desde.moneda !== hasta.moneda ? "dolares" : "mover";
}

function Cargar({ datos }: { datos: Datos }) {
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get("id");
  const existente = id ? datos.movimientos.find((m) => m.id === id) : undefined;
  const pedido = params.get("tipo");
  const [tipo, setTipo] = useState<Tipo>(pedido === "ingreso" || pedido === "dolares" || pedido === "mover" ? pedido : "gasto");

  /** Guardado: avisa (con "Deshacer") y vuelve a la pantalla de la que se vino. */
  function terminar(texto: string, deshacer?: () => void) {
    confirmar(texto, deshacer);
    navigator.vibrate?.(10);
    if (window.history.length > 1) router.back();
    else router.replace("/app");
  }

  if (id && !existente) {
    return (
      <Marco titulo="No está">
        <p className="text-texto-2">Ese movimiento ya no existe. Puede que lo hayas borrado desde otro dispositivo.</p>
      </Marco>
    );
  }

  if (existente) {
    const t = tipoDe(existente, datos);
    const titulo = { gasto: "Editar gasto", ingreso: "Editar ingreso", dolares: "Editar cambio", mover: "Editar movimiento", ajuste: "Saldo actualizado" }[t];
    return (
      <Marco titulo={titulo}>
        {t === "gasto" && <FormGasto datos={datos} existente={existente as Gasto} onListo={terminar} />}
        {t === "ingreso" && <FormIngreso datos={datos} existente={existente as Ingreso} onListo={terminar} />}
        {t === "dolares" && <FormDolares datos={datos} existente={existente as Movida} onListo={terminar} />}
        {t === "mover" && <FormMover datos={datos} existente={existente as Movida} onListo={terminar} />}
        {t === "ajuste" && <FormAjuste datos={datos} existente={existente as Ajuste} onListo={terminar} />}
        <Boton
          variante="peligro"
          onClick={() => {
            borrarMovimiento(existente.id);
            terminar("Listo: lo borraste.", () => restaurarMovimiento(existente));
          }}
        >
          Borrar
        </Boton>
      </Marco>
    );
  }

  return (
    <Marco titulo={{ gasto: "Nuevo gasto", ingreso: "Nuevo ingreso", dolares: "Dólares", mover: "Mover plata" }[tipo]}>
      <div className="flex justify-center">
        <Segmento
          etiqueta="Qué querés cargar"
          valor={tipo}
          onCambio={setTipo}
          opciones={[
            { valor: "gasto", texto: "Gasto" },
            { valor: "ingreso", texto: "Ingreso" },
            { valor: "dolares", texto: "Dólares" },
            { valor: "mover", texto: "Mover" },
          ]}
        />
      </div>
      {tipo === "gasto" && <FormGasto key="g" datos={datos} onListo={terminar} />}
      {tipo === "ingreso" && <FormIngreso key="i" datos={datos} onListo={terminar} />}
      {tipo === "dolares" && <FormDolares key="d" datos={datos} onListo={terminar} />}
      {tipo === "mover" && <FormMover key="m" datos={datos} onListo={terminar} />}
    </Marco>
  );
}

function Marco({ titulo, children }: { titulo: string; children: ReactNode }) {
  const router = useRouter();
  return (
    <div className="grid gap-5 pt-[env(safe-area-inset-top)]">
      <header className="grid grid-cols-[1fr_auto_1fr] items-center pt-3">
        <button type="button" onClick={() => (window.history.length > 1 ? router.back() : router.push("/app"))} className="presionable -ml-2 min-h-11 justify-self-start rounded-chico px-2 text-[15px] text-texto-2">
          Cancelar
        </button>
        <h1 className="text-[15px] font-semibold">{titulo}</h1>
        <span />
      </header>
      {children}
    </div>
  );
}

// —— Piezas comunes ——

function CampoMonto({
  moneda,
  valor,
  onCambio,
  etiqueta,
  autoFocus,
  error,
}: {
  moneda: Moneda;
  valor: string;
  onCambio: (v: string) => void;
  etiqueta: string;
  autoFocus?: boolean;
  error?: string | null;
}) {
  return (
    <div className="grid justify-items-center gap-1">
    <div className="flex items-baseline justify-center gap-2 py-2">
      <span className="text-2xl font-medium text-texto-2">{SIGNO[moneda]}</span>
      <input
        id="monto"
        aria-label={etiqueta}
        autoFocus={autoFocus}
        inputMode="decimal"
        enterKeyHint="next"
        autoComplete="off"
        placeholder="0"
        value={valor}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "monto-error" : undefined}
        onChange={(e) => onCambio(formatearEntrada(e.target.value))}
        className={`cifra w-full max-w-[11ch] bg-transparent text-center leading-none font-semibold caret-acento outline-none focus-visible:outline-none placeholder:text-texto-2/40 ${valor.length > 12 ? "text-[34px]" : valor.length > 8 ? "text-[42px]" : "text-[52px]"}`}
      />
    </div>
      {error && (
        <p id="monto-error" className="text-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
}

function SelectorMoneda({ valor, onCambio }: { valor: Moneda; onCambio: (m: Moneda) => void }) {
  return (
    <div className="flex justify-center">
      <Segmento
        etiqueta="Moneda"
        valor={valor}
        onCambio={onCambio}
        opciones={[
          { valor: "ARS", texto: "$ Pesos" },
          { valor: "USD", texto: "US$ Dólares" },
        ]}
      />
    </div>
  );
}

function lugaresDe(datos: Datos, moneda: Moneda, incluir?: string | null): Lugar[] {
  return datos.lugares.filter((l) => l.moneda === moneda && (!l.archivado || l.id === incluir));
}

function SelectorLugar({ id, etiqueta, lugares, valor, onCambio, sinLugar, nuevo }: { id: string; etiqueta: string; lugares: Lugar[]; valor: string; onCambio: (v: string) => void; sinLugar?: boolean; nuevo?: string }) {
  return (
    <div className="grid gap-1.5">
      <Etiqueta htmlFor={id}>{etiqueta}</Etiqueta>
      <select id={id} className={CLASE_CAMPO} value={valor} onChange={(e) => onCambio(e.target.value)}>
        {sinLugar && <option value="">Sin lugar (no mueve ningún saldo)</option>}
        {lugares.map((l) => (
          <option key={l.id} value={l.id}>
            {l.nombre}
            {l.grupo === "invertido" ? " · invertido" : ""}
          </option>
        ))}
        {nuevo && <option value="__nuevo">{nuevo} (nuevo)</option>}
      </select>
    </div>
  );
}

function FechaYNota({ fecha, setFecha, nota, setNota, placeholder }: { fecha: string; setFecha: (v: string) => void; nota: string; setNota: (v: string) => void; placeholder: string }) {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
      <div className="grid gap-1.5">
        <Etiqueta htmlFor="fecha">Fecha</Etiqueta>
        <input id="fecha" type="date" className={CLASE_CAMPO} value={fecha} onChange={(e) => setFecha(e.target.value || fechaHoy())} />
      </div>
      <div className="grid gap-1.5">
        <Etiqueta htmlFor="nota">Nota</Etiqueta>
        <input id="nota" className={CLASE_CAMPO} placeholder={placeholder} value={nota} onChange={(e) => setNota(e.target.value)} maxLength={80} enterKeyHint="done" />
      </div>
    </div>
  );
}

function Guardar({ children, error }: { children: ReactNode; error: string | null }) {
  return (
    <div className="sticky bottom-0 grid gap-2 bg-fondo pt-2 pb-[calc(env(safe-area-inset-bottom)_+_0.5rem)]">
      {error && <Aviso tono="error">{error}</Aviso>}
      <Boton type="submit" className="w-full">
        {children}
      </Boton>
    </div>
  );
}

// —— Gasto ——

function FormGasto({ datos, existente, onListo }: { datos: Datos; existente?: Gasto; onListo: (texto: string, deshacer?: () => void) => void }) {
  const vigente = useCotizacion(datos);
  const [moneda, setMoneda] = useState<Moneda>(existente?.moneda ?? datos.ultimo.moneda);
  const [texto, setTexto] = useState(existente ? numero(existente.monto) : "");
  const [categoriaId, setCategoriaId] = useState<string | null>(existente?.categoriaId ?? null);
  const [fecha, setFecha] = useState(existente?.fecha ?? fechaHoy());
  const [nota, setNota] = useState(existente?.nota ?? "");
  const [lugarId, setLugarId] = useState<string>(existente ? (existente.lugarId ?? "") : lugarRecordado(datos, datos.ultimo.moneda));
  const [error, setError] = useState<{ campo: "monto" | "categoria"; texto: string } | null>(null);
  const [creando, setCreando] = useState(false);
  const unaVez = useUnaVez();

  const categorias = datos.categorias.filter((c) => !c.archivada || c.id === categoriaId);
  const centavos = leerMonto(texto);
  const enPesos = moneda === "USD" && centavos ? convertir(centavos, "USD", "ARS", vigente.valor) : null;

  function cambiarMoneda(m: Moneda) {
    setMoneda(m);
    setLugarId(lugarRecordado(datos, m));
  }

  function guardar(e: React.FormEvent) {
    e.preventDefault();
    if (!centavos || centavos <= 0) return setError({ campo: "monto", texto: "Escribí cuánto gastaste." });
    if (!categoriaId) return setError({ campo: "categoria", texto: "Elegí en qué fue." });
    const cat = datos.categorias.find((c) => c.id === categoriaId);
    const datosGasto = {
      tipo: "gasto" as const,
      monto: centavos,
      moneda,
      categoriaId,
      lugarId: lugarId || null,
      fecha,
      nota: nota.trim() || undefined,
      cotizacion: existente && existente.moneda === moneda ? existente.cotizacion : vigente.valor,
    };
    unaVez(() => {
      const aviso = `Listo: ${monto(centavos, moneda)} en ${cat?.nombre ?? "la categoría"}.`;
      if (existente) {
        editarMovimiento({ ...existente, ...datosGasto });
        onListo(aviso, () => editarMovimiento(existente));
      } else {
        const nuevo = cargarGasto(datosGasto);
        onListo(aviso, () => borrarMovimiento(nuevo.id));
      }
    });
  }

  return (
    <form onSubmit={guardar} noValidate className="grid gap-5">
      <SelectorMoneda valor={moneda} onCambio={cambiarMoneda} />
      <div className="grid justify-items-center gap-1">
        <CampoMonto moneda={moneda} valor={texto} onCambio={(v) => (setTexto(v), setError(null))} etiqueta="Cuánto gastaste" autoFocus={!existente} error={error?.campo === "monto" ? error.texto : null} />
        {enPesos !== null && vigente.valor && (
          <span className="cifra text-sm text-texto-2">
            ≈ {monto(enPesos, "ARS", { conCentavos: false })} · {vigente.origen === "propia" ? "tu dólar" : NOMBRE_DOLAR[vigente.tipo].replace("Dólar ", "")} {cotizacion(vigente.valor)}
          </span>
        )}
      </div>

      <div className="grid gap-2">
        <span id="categoria-titulo" className="text-sm text-texto-2">
          ¿En qué?
        </span>
        <div className="flex flex-wrap gap-2">
          {categorias.map((c) => (
            <ChipCategoria key={c.id} nombre={c.nombre} color={c.color} activo={c.id === categoriaId} onClick={() => (setCategoriaId(c.id), setError(null))} />
          ))}
          <button type="button" onClick={() => setCreando(true)} className="min-h-10 rounded-full border border-dashed border-linea px-3.5 text-sm text-texto-2">
            + Nueva
          </button>
        </div>
        {error?.campo === "categoria" && <p className="text-sm text-error">{error.texto}</p>}
        {creando && (
          <NuevaCategoria
            onCreada={(id) => {
              setCategoriaId(id);
              setCreando(false);
            }}
            onCancelar={() => setCreando(false)}
          />
        )}
      </div>

      <SelectorLugar id="lugar" etiqueta="¿De dónde salió?" lugares={lugaresDe(datos, moneda, existente?.lugarId)} valor={lugarId} onCambio={setLugarId} sinLugar />
      <FechaYNota fecha={fecha} setFecha={setFecha} nota={nota} setNota={setNota} placeholder="Verdulería, nafta…" />
      <Guardar error={null}>{existente ? "Guardar cambios" : "Guardar gasto"}</Guardar>
    </form>
  );
}

/** Que un doble toque en Guardar no cargue dos veces lo mismo. */
function useUnaVez() {
  const hecho = useRef(false);
  return (accion: () => void) => {
    if (hecho.current) return;
    hecho.current = true;
    accion();
  };
}

function lugarRecordado(datos: Datos, moneda: Moneda): string {
  const recordado = moneda === "ARS" ? datos.ultimo.lugarARS : datos.ultimo.lugarUSD;
  const opciones = lugaresDe(datos, moneda);
  if (recordado && opciones.some((l) => l.id === recordado)) return recordado;
  return opciones.find((l) => l.grupo === "disponible")?.id ?? "";
}

// —— Ingreso ——

function FormIngreso({ datos, existente, onListo }: { datos: Datos; existente?: Ingreso; onListo: (texto: string, deshacer?: () => void) => void }) {
  const vigente = useCotizacion(datos);
  const [moneda, setMoneda] = useState<Moneda>(existente?.moneda ?? "ARS");
  const [texto, setTexto] = useState(existente ? numero(existente.monto) : "");
  const [lugarId, setLugarId] = useState<string>(existente ? (existente.lugarId ?? "") : lugarRecordado(datos, "ARS"));
  const [fecha, setFecha] = useState(existente?.fecha ?? fechaHoy());
  const [nota, setNota] = useState(existente?.nota ?? "");
  const [error, setError] = useState<string | null>(null);
  const unaVez = useUnaVez();

  function guardar(e: React.FormEvent) {
    e.preventDefault();
    const centavos = leerMonto(texto);
    if (!centavos || centavos <= 0) return setError("Escribí cuánto entró.");
    const datosIngreso = {
      tipo: "ingreso" as const,
      monto: centavos,
      moneda,
      lugarId: lugarId || null,
      fecha,
      nota: nota.trim() || undefined,
      cotizacion: existente && existente.moneda === moneda ? existente.cotizacion : vigente.valor,
    };
    const lugar = datos.lugares.find((l) => l.id === lugarId);
    const aviso = `Listo: entraron ${monto(centavos, moneda)}${lugar ? ` en ${lugar.nombre}` : ""}.`;
    unaVez(() => {
      if (existente) {
        editarMovimiento({ ...existente, ...datosIngreso });
        onListo(aviso, () => editarMovimiento(existente));
      } else {
        const nuevo = cargarIngreso(datosIngreso);
        onListo(aviso, () => borrarMovimiento(nuevo.id));
      }
    });
  }

  return (
    <form onSubmit={guardar} noValidate className="grid gap-5">
      <SelectorMoneda valor={moneda} onCambio={(m) => (setMoneda(m), setLugarId(lugarRecordado(datos, m)))} />
      <CampoMonto moneda={moneda} valor={texto} onCambio={(v) => (setTexto(v), setError(null))} etiqueta="Cuánto entró" autoFocus={!existente} error={error} />
      <SelectorLugar id="lugar" etiqueta="¿Adónde entró?" lugares={lugaresDe(datos, moneda, existente?.lugarId)} valor={lugarId} onCambio={setLugarId} sinLugar />
      <FechaYNota fecha={fecha} setFecha={setFecha} nota={nota} setNota={setNota} placeholder="Sueldo, un cobro, un regalo…" />
      <Guardar error={null}>{existente ? "Guardar cambios" : "Guardar ingreso"}</Guardar>
    </form>
  );
}

// —— Compra o venta de dólares ——

function FormDolares({ datos, existente, onListo }: { datos: Datos; existente?: Movida; onListo: (texto: string, deshacer?: () => void) => void }) {
  const vigente = useCotizacion(datos);
  const lugarDe = (id: string) => datos.lugares.find((l) => l.id === id);
  const compraInicial = existente ? lugarDe(existente.hastaLugarId)?.moneda === "USD" : true;
  const dolaresIni = existente ? (compraInicial ? existente.montoHasta : existente.montoDesde) : null;
  const pesosIni = existente ? (compraInicial ? existente.montoDesde : existente.montoHasta) : null;

  const [compra, setCompra] = useState(compraInicial);
  const [dolares, setDolares] = useState(dolaresIni ? numero(dolaresIni) : "");
  const [cotTexto, setCotTexto] = useState(
    pesosIni && dolaresIni ? numero(Math.round((pesosIni / dolaresIni) * 100)) : vigente.valor ? numero(Math.round(vigente.valor * 100)) : "",
  );
  const [pesosTexto, setPesosTexto] = useState<string | null>(null);
  const [lugarARS, setLugarARS] = useState(existente ? (compraInicial ? existente.desdeLugarId : existente.hastaLugarId) : lugarRecordado(datos, "ARS") || "__nuevo");
  const [lugarUSD, setLugarUSD] = useState(existente ? (compraInicial ? existente.hastaLugarId : existente.desdeLugarId) : lugarRecordado(datos, "USD") || "__nuevo");
  const [fecha, setFecha] = useState(existente?.fecha ?? fechaHoy());
  const [nota, setNota] = useState(existente?.nota ?? "");
  const [error, setError] = useState<string | null>(null);
  const unaVez = useUnaVez();

  const usd = leerMonto(dolares);
  const cot = leerCotizacion(cotTexto);
  // Si la persona escribe los pesos, la cotización sale de ahí; si no, los pesos salen de la cotización.
  const pesos = pesosTexto !== null ? leerMonto(pesosTexto) : usd && cot ? Math.round(usd * cot) : null;
  const cotReal = pesosTexto !== null && usd && pesos ? Math.round((pesos / usd) * 100) / 100 : cot;
  const lugaresARS = lugaresDe(datos, "ARS", lugarARS);
  const lugaresUSD = lugaresDe(datos, "USD", lugarUSD);

  function guardar(e: React.FormEvent) {
    e.preventDefault();
    if (!usd || usd <= 0) return setError("Escribí cuántos dólares.");
    if (!pesos || pesos <= 0) return setError("Falta la cotización o cuántos pesos fueron.");
    unaVez(() => guardarCambio(usd, pesos));
  }

  function guardarCambio(usd: number, pesos: number) {
    const ars = lugarARS === "__nuevo" ? crearLugar({ nombre: "Efectivo", grupo: "disponible", moneda: "ARS", saldoInicial: 0 }).id : lugarARS;
    const dol = lugarUSD === "__nuevo" ? crearLugar({ nombre: "Dólares", grupo: "disponible", moneda: "USD", saldoInicial: 0 }).id : lugarUSD;
    const movida = compra
      ? { desdeLugarId: ars, montoDesde: pesos, hastaLugarId: dol, montoHasta: usd }
      : { desdeLugarId: dol, montoDesde: usd, hastaLugarId: ars, montoHasta: pesos };
    const datosMovida = { tipo: "movida" as const, ...movida, fecha, nota: nota.trim() || undefined };
    let deshacer: () => void;
    if (existente) {
      editarMovimiento({ ...existente, ...datosMovida });
      deshacer = () => editarMovimiento(existente);
    } else {
      const nueva = cargarMovida(datosMovida);
      deshacer = () => borrarMovimiento(nueva.id);
    }
    const nombreUSD = lugarUSD === "__nuevo" ? "Dólares" : lugarDe(dol)?.nombre;
    const nombreARS = lugarARS === "__nuevo" ? "Efectivo" : lugarDe(ars)?.nombre;
    onListo(
      compra
        ? `Listo: compraste ${monto(usd, "USD")} a ${cotizacion(cotReal ?? 0)}. Quedan en ${nombreUSD}.`
        : `Listo: vendiste ${monto(usd, "USD")} a ${cotizacion(cotReal ?? 0)}. Los pesos quedan en ${nombreARS}.`,
      deshacer,
    );
  }

  return (
    <form onSubmit={guardar} noValidate className="grid gap-5">
      <div className="flex justify-center">
        <Segmento
          etiqueta="Compra o venta"
          valor={compra ? "compra" : "venta"}
          onCambio={(v) => setCompra(v === "compra")}
          opciones={[
            { valor: "compra", texto: "Compré" },
            { valor: "venta", texto: "Vendí" },
          ]}
        />
      </div>
      <CampoMonto moneda="USD" valor={dolares} onCambio={(v) => (setDolares(v), setError(null))} etiqueta="Cuántos dólares" autoFocus={!existente} error={error?.startsWith("Escribí") ? error : null} />

      <div className="grid gap-3 rounded-tarjeta border border-linea bg-superficie p-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-1.5">
            <Etiqueta htmlFor="cotizacion">Cotización</Etiqueta>
            <input
              id="cotizacion"
              className={`${CLASE_CAMPO} cifra`}
              inputMode="decimal"
              value={pesosTexto !== null && cotReal ? numero(Math.round(cotReal * 100)) : cotTexto}
              onChange={(e) => (setCotTexto(formatearEntrada(e.target.value)), setPesosTexto(null), setError(null))}
            />
          </div>
          <div className="grid gap-1.5">
            <Etiqueta htmlFor="pesos">{compra ? "Pagaste" : "Recibiste"} ($)</Etiqueta>
            <input
              id="pesos"
              className={`${CLASE_CAMPO} cifra`}
              inputMode="decimal"
              value={pesosTexto ?? (pesos ? numero(pesos) : "")}
              onChange={(e) => (setPesosTexto(formatearEntrada(e.target.value)), setError(null))}
            />
          </div>
        </div>
        <p className="text-xs text-texto-2">
          {vigente.valor
            ? `${vigente.origen === "propia" ? "Tu dólar" : NOMBRE_DOLAR[vigente.tipo]} hoy: ${cotizacion(vigente.valor)}. Si te lo dieron a otro precio, cambialo acá.`
            : "Poné la cotización a la que compraste o cuántos pesos pagaste."}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <SelectorLugar id="lugar-ars" etiqueta={compra ? "Los pesos salieron de" : "Los pesos entraron a"} lugares={lugaresARS} valor={lugarARS} onCambio={setLugarARS} nuevo={lugaresARS.length === 0 ? "Efectivo" : undefined} />
        <SelectorLugar id="lugar-usd" etiqueta={compra ? "Los dólares van a" : "Los dólares salieron de"} lugares={lugaresUSD} valor={lugarUSD} onCambio={setLugarUSD} nuevo={lugaresUSD.length === 0 ? "Dólares" : undefined} />
      </div>
      <FechaYNota fecha={fecha} setFecha={setFecha} nota={nota} setNota={setNota} placeholder="MEP en el banco, cueva…" />
      <p className="text-xs text-texto-2">No es un gasto: la plata cambia de moneda y tu total no se mueve.</p>
      <Guardar error={error?.startsWith("Escribí") ? null : error}>{existente ? "Guardar cambios" : compra ? "Guardar compra" : "Guardar venta"}</Guardar>
    </form>
  );
}

// —— Mover entre lugares de la misma moneda ——

function FormMover({ datos, existente, onListo }: { datos: Datos; existente?: Movida; onListo: (texto: string, deshacer?: () => void) => void }) {
  const activos = datos.lugares.filter((l) => !l.archivado || l.id === existente?.desdeLugarId || l.id === existente?.hastaLugarId);
  const [desde, setDesde] = useState(existente?.desdeLugarId ?? activos[0]?.id ?? "");
  const lugarDesde = datos.lugares.find((l) => l.id === desde);
  const destinos = activos.filter((l) => l.id !== desde && l.moneda === lugarDesde?.moneda);
  const [hasta, setHasta] = useState(existente?.hastaLugarId ?? destinos[0]?.id ?? "");
  const [texto, setTexto] = useState(existente ? numero(existente.montoDesde) : "");
  const [fecha, setFecha] = useState(existente?.fecha ?? fechaHoy());
  const [nota, setNota] = useState(existente?.nota ?? "");
  const [error, setError] = useState<string | null>(null);
  const unaVez = useUnaVez();

  if (activos.length < 2) {
    return (
      <div className="grid gap-3 rounded-tarjeta border border-linea bg-superficie p-4">
        <p>Para mover plata necesitás al menos dos lugares en la misma moneda, por ejemplo Banco y Plazo fijo.</p>
        <Link href="/app/plata" className="font-semibold text-primario">
          Agregar un lugar
        </Link>
      </div>
    );
  }

  function guardar(e: React.FormEvent) {
    e.preventDefault();
    const centavos = leerMonto(texto);
    if (!centavos || centavos <= 0) return setError("Escribí cuánto moviste.");
    if (!hasta || !destinos.some((l) => l.id === hasta)) return setError("Elegí adónde va la plata.");
    const datosMovida = { tipo: "movida" as const, desdeLugarId: desde, montoDesde: centavos, hastaLugarId: hasta, montoHasta: centavos, fecha, nota: nota.trim() || undefined };
    const destino = datos.lugares.find((l) => l.id === hasta);
    const aviso = `Listo: pasaste ${monto(centavos, lugarDesde!.moneda)} de ${lugarDesde!.nombre} a ${destino?.nombre}.`;
    unaVez(() => {
      if (existente) {
        editarMovimiento({ ...existente, ...datosMovida });
        onListo(aviso, () => editarMovimiento(existente));
      } else {
        const nueva = cargarMovida(datosMovida);
        onListo(aviso, () => borrarMovimiento(nueva.id));
      }
    });
  }

  return (
    <form onSubmit={guardar} noValidate className="grid gap-5">
      <CampoMonto moneda={lugarDesde?.moneda ?? "ARS"} valor={texto} onCambio={(v) => (setTexto(v), setError(null))} etiqueta="Cuánto moviste" autoFocus={!existente} />
      {lugarDesde && <p className="-mt-3 text-center text-sm text-texto-2">En {lugarDesde.nombre} hay {monto(saldoLugar(datos, lugarDesde), lugarDesde.moneda, { conCentavos: false })}</p>}
      <div className="grid gap-3 sm:grid-cols-2">
        <SelectorLugar
          id="desde"
          etiqueta="Desde"
          lugares={activos}
          valor={desde}
          onCambio={(v) => {
            setDesde(v);
            const m = datos.lugares.find((l) => l.id === v)?.moneda;
            setHasta(activos.find((l) => l.id !== v && l.moneda === m)?.id ?? "");
          }}
        />
        {destinos.length > 0 ? (
          <SelectorLugar id="hasta" etiqueta="Hacia" lugares={destinos} valor={hasta} onCambio={setHasta} />
        ) : (
          <p className="self-end text-sm text-texto-2">No hay otro lugar en {lugarDesde?.moneda === "USD" ? "dólares" : "pesos"}. Para cambiar de moneda usá «Dólares».</p>
        )}
      </div>
      <FechaYNota fecha={fecha} setFecha={setFecha} nota={nota} setNota={setNota} placeholder="Renové el plazo fijo…" />
      <Guardar error={error}>{existente ? "Guardar cambios" : "Mover"}</Guardar>
    </form>
  );
}

// —— Ajuste de saldo ——

function FormAjuste({ datos, existente, onListo }: { datos: Datos; existente: Ajuste; onListo: (texto: string, deshacer?: () => void) => void }) {
  const lugar = datos.lugares.find((l) => l.id === existente.lugarId);
  const [texto, setTexto] = useState(numero(Math.abs(existente.diferencia)));
  const [suma, setSuma] = useState(existente.diferencia >= 0);
  const [nota, setNota] = useState(existente.nota ?? "");
  const [fecha, setFecha] = useState(existente.fecha);
  const [error, setError] = useState<string | null>(null);

  function guardar(e: React.FormEvent) {
    e.preventDefault();
    const centavos = leerMonto(texto);
    if (!centavos) return setError("Escribí la diferencia.");
    editarMovimiento({ ...existente, diferencia: suma ? centavos : -centavos, nota: nota.trim() || undefined, fecha });
    onListo("Listo: guardaste el cambio.", () => editarMovimiento(existente));
  }

  return (
    <form onSubmit={guardar} noValidate className="grid gap-5">
      <p className="text-center text-texto-2">{lugar ? `El saldo de ${lugar.nombre} cambió solo (intereses, cotización de las acciones…).` : "El saldo de un lugar cambió solo."}</p>
      <div className="flex justify-center">
        <Segmento
          etiqueta="Subió o bajó"
          valor={suma ? "subio" : "bajo"}
          onCambio={(v) => setSuma(v === "subio")}
          opciones={[
            { valor: "subio", texto: "Subió" },
            { valor: "bajo", texto: "Bajó" },
          ]}
        />
      </div>
      <CampoMonto moneda={lugar?.moneda ?? "ARS"} valor={texto} onCambio={setTexto} etiqueta="Cuánto" error={error} />
      <FechaYNota fecha={fecha} setFecha={setFecha} nota={nota} setNota={setNota} placeholder="Intereses de octubre…" />
      <Guardar error={null}>Guardar cambios</Guardar>
    </form>
  );
}
