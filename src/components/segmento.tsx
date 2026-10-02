"use client";

import { motion, useReducedMotion } from "motion/react";
import { useId, useRef, type KeyboardEvent } from "react";

/**
 * Elegir entre pocas opciones: Pesos / Dólares, Gasto / Ingreso. La pastilla se desliza a la opción
 * elegida (la idea de `halo-segmented` de cult-ui, con los colores de la marca y sin degradés).
 * Con las flechas del teclado se cambia de opción, como un grupo de radios.
 */
export function Segmento<T extends string>({
  opciones,
  valor,
  onCambio,
  etiqueta,
  chico = false,
}: {
  opciones: { valor: T; texto: string }[];
  valor: T;
  onCambio: (v: T) => void;
  etiqueta: string;
  chico?: boolean;
}) {
  const id = useId();
  const reducir = useReducedMotion();
  const botones = useRef<(HTMLButtonElement | null)[]>([]);

  function teclas(evento: KeyboardEvent, indice: number) {
    const paso = evento.key === "ArrowRight" || evento.key === "ArrowDown" ? 1 : evento.key === "ArrowLeft" || evento.key === "ArrowUp" ? -1 : 0;
    if (!paso) return;
    evento.preventDefault();
    const siguiente = (indice + paso + opciones.length) % opciones.length;
    onCambio(opciones[siguiente].valor);
    botones.current[siguiente]?.focus();
  }

  return (
    <div role="radiogroup" aria-label={etiqueta} className={`inline-flex rounded-[11px] bg-primario-suave ${chico ? "p-0.5" : "p-1"}`}>
      {opciones.map((o, i) => {
        const activo = valor === o.valor;
        return (
          <button
            key={o.valor}
            ref={(el) => {
              botones.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={activo}
            tabIndex={activo ? 0 : -1}
            onClick={() => onCambio(o.valor)}
            onKeyDown={(e) => teclas(e, i)}
            className={`presionable relative rounded-chico font-medium ${chico ? "min-h-8 px-3 text-[13px]" : "min-h-9 px-3.5 text-sm"}`}
          >
            {activo && (
              <motion.span
                layoutId={`segmento-${id}`}
                className="absolute inset-0 rounded-chico bg-primario"
                transition={reducir ? { duration: 0 } : { type: "spring", duration: 0.3, bounce: 0 }}
              />
            )}
            <span className={`relative transition-colors duration-200 ${activo ? "text-sobre-primario" : "text-texto-2"}`}>{o.texto}</span>
          </button>
        );
      })}
    </div>
  );
}
