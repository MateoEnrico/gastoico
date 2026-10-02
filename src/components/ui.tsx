import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";
import type { Centavos, Moneda } from "@/lib/datos/tipos";
import { numero, SIGNO } from "@/lib/formato";

/** Un monto como dice el manual: el signo más chico que el número, cifras tabulares. */
export function Monto({
  centavos,
  moneda,
  conCentavos = true,
  signoIngreso = false,
  className = "",
}: {
  centavos: Centavos;
  moneda: Moneda;
  conCentavos?: boolean;
  signoIngreso?: boolean;
  className?: string;
}) {
  const texto = numero(Math.abs(centavos), { conCentavos });
  const [entero, decimales] = texto.split(",");
  return (
    <span className={`cifra whitespace-nowrap ${className}`}>
      {centavos < 0 && "−"}
      <span className="mr-[0.18em] text-[0.62em] font-medium opacity-70">
        {signoIngreso ? "+ " : ""}
        {SIGNO[moneda]}
      </span>
      {entero}
      {decimales && <span className="font-medium opacity-60">,{decimales}</span>}
    </span>
  );
}

type Variante = "primario" | "secundario" | "fantasma" | "peligro";

const VARIANTES: Record<Variante, string> = {
  primario: "bg-primario text-sobre-primario",
  secundario: "border border-linea bg-superficie text-texto",
  fantasma: "text-primario",
  peligro: "border border-linea bg-superficie text-error",
};

const BASE_BOTON =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-chico px-5 font-semibold transition-[scale,opacity] active:scale-[0.98] disabled:opacity-50";

export function Boton({ variante = "primario", className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variante?: Variante }) {
  return <button type="button" className={`${BASE_BOTON} ${VARIANTES[variante]} ${className}`} {...props} />;
}

export function BotonLink({ variante = "primario", className = "", ...props }: ComponentProps<typeof Link> & { variante?: Variante }) {
  return <Link className={`${BASE_BOTON} ${VARIANTES[variante]} ${className}`} {...props} />;
}

export function Tarjeta({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-tarjeta border border-linea bg-superficie ${className}`}>{children}</section>;
}

/** El encabezado de cada pantalla: título en la serif de la marca y, si hace falta, una acción. */
export function Encabezado({ titulo, accion, volver }: { titulo: string; accion?: ReactNode; volver?: string }) {
  return (
    <header className="flex items-center justify-between gap-3 pt-2 pb-4">
      <div className="flex min-w-0 items-center gap-2">
        {volver && (
          <Link href={volver} className="-ml-2 grid size-10 place-items-center rounded-full text-texto-2 hover:bg-primario-suave" aria-label="Volver">
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>
        )}
        <h1 className="truncate font-marca text-[28px] leading-tight">{titulo}</h1>
      </div>
      {accion}
    </header>
  );
}

export function Etiqueta({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="text-sm text-texto-2">
      {children}
    </label>
  );
}

export const CLASE_CAMPO =
  "min-h-12 w-full rounded-chico border-[1.5px] border-linea bg-superficie px-3.5 text-base text-texto outline-none placeholder:text-texto-2/70 focus:border-primario";

/** Elegir entre pocas opciones: Pesos / Dólares, Disponible / Invertido. */
export function Segmento<T extends string>({
  opciones,
  valor,
  onCambio,
  etiqueta,
}: {
  opciones: { valor: T; texto: string }[];
  valor: T;
  onCambio: (v: T) => void;
  etiqueta: string;
}) {
  return (
    <div role="radiogroup" aria-label={etiqueta} className="inline-flex rounded-[11px] bg-primario-suave p-1">
      {opciones.map((o) => (
        <button
          key={o.valor}
          type="button"
          role="radio"
          aria-checked={valor === o.valor}
          onClick={() => onCambio(o.valor)}
          className={`min-h-9 rounded-chico px-3.5 text-sm font-medium transition-colors ${valor === o.valor ? "bg-primario text-sobre-primario" : "text-texto-2"}`}
        >
          {o.texto}
        </button>
      ))}
    </div>
  );
}

/** Una categoría como chip: punto de color y nombre. */
export function ChipCategoria({ nombre, color, activo, onClick }: { nombre: string; color: string; activo?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-3.5 text-sm transition-colors ${
        activo ? "border-primario bg-primario text-sobre-primario" : "border-linea bg-superficie text-texto"
      }`}
    >
      <span className="size-2.5 shrink-0 rounded-[3px]" style={{ background: color }} />
      {nombre}
    </button>
  );
}

export function Aviso({ children, tono = "info" }: { children: ReactNode; tono?: "info" | "error" }) {
  return <p className={`rounded-chico p-3 text-sm ${tono === "error" ? "bg-error-suave text-error" : "bg-primario-suave text-texto"}`}>{children}</p>;
}
