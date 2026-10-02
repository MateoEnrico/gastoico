import { BRONCE, CIPRES, LETRA_G } from "@/lib/marca";

/** El símbolo: la moneda con la g. Los colores son fijos en los dos modos. */
export function Simbolo({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect width="48" height="48" rx="12" fill={CIPRES} />
      <circle cx="24" cy="24" r="15" fill={BRONCE} />
      <circle cx="24" cy="24" r="12" fill="none" stroke={CIPRES} strokeOpacity=".4" strokeWidth="1.1" />
      <path d={LETRA_G} fill={CIPRES} />
    </svg>
  );
}

export function Logo({ className = "", tamano = "text-2xl", simbolo = "size-8" }: { className?: string; tamano?: string; simbolo?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Simbolo className={simbolo} />
      <span className={`font-marca leading-none tracking-[-0.015em] ${tamano}`}>gastoico</span>
    </span>
  );
}
