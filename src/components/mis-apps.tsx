/** El selector de apps de la marca: misma cuenta, otro producto. */
export function MisApps() {
  return (
    <details className="group relative">
      <summary className="flex min-h-9 cursor-pointer list-none items-center gap-1 rounded-full border border-linea px-3 text-xs text-texto-2 [&::-webkit-details-marker]:hidden">
        Mis apps
        <svg viewBox="0 0 24 24" className="size-3.5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>
      <div className="absolute right-0 z-20 mt-2 grid w-64 gap-1 rounded-tarjeta border border-linea bg-superficie p-2 shadow-lg">
        <span className="rounded-chico bg-primario-suave px-3 py-2.5 text-sm">
          <b className="block font-semibold">Gastoico</b>
          <span className="text-xs text-texto-2">Tu plata. Estás acá.</span>
        </span>
        <a href="https://gastagro.vercel.app/app" className="rounded-chico px-3 py-2.5 text-sm hover:bg-primario-suave">
          <b className="block font-semibold">Gastagro</b>
          <span className="text-xs text-texto-2">Los costos de tu campo, con la misma cuenta.</span>
        </a>
      </div>
    </details>
  );
}
