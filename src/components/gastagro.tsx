import { Atkinson_Hyperlegible_Next } from "next/font/google";

/** La letra del nombre de Gastagro: la misma que usa su app. Solo se carga donde aparece el logo. */
const atkinson = Atkinson_Hyperlegible_Next({ subsets: ["latin"], weight: "800", display: "swap" });

/**
 * El logo de Gastagro tal cual está en su repo (gastagro/src/app/icon.svg y `NombreGastagro`): tres
 * surcos que crecen y también son un gráfico de barras. Si cambia allá, se cambia acá.
 */
export function SimboloGastagro({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#1F4A2E" />
      <rect x="14" y="34" width="9" height="16" rx="4.5" fill="#EFAC3B" />
      <rect x="27.5" y="25" width="9" height="25" rx="4.5" fill="#EFAC3B" />
      <rect x="41" y="14" width="9" height="36" rx="4.5" fill="#EFAC3B" />
    </svg>
  );
}

export function LogoGastagro({ tamano = "text-2xl", simbolo = "size-8" }: { tamano?: string; simbolo?: string }) {
  return (
    <span className="inline-flex items-center gap-2.5" aria-label="Gastagro">
      <SimboloGastagro className={simbolo} />
      <span className={`${atkinson.className} leading-none font-extrabold tracking-tight ${tamano}`} aria-hidden="true">
        <span className="text-gastagro-gast">gast</span>
        <span className="text-gastagro-agro">agro</span>
      </span>
    </span>
  );
}
