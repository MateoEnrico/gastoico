import Link from "next/link";
import { Logo, Simbolo } from "@/components/marca";

/** gastoico.com: la vidriera de la marca. Muestra la app gratis y los demás productos. */
export default function Landing() {
  return (
    <div className="mx-auto grid w-full max-w-5xl gap-20 px-5 pt-[calc(env(safe-area-inset-top)_+_1.25rem)] pb-16 sm:px-8">
      <header className="flex items-center justify-between">
        <Logo />
        <Link href="/app" className="min-h-10 rounded-chico border border-linea px-4 py-2 text-sm font-semibold">
          Entrar
        </Link>
      </header>

      <section className="grid items-center gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="grid gap-6">
          <h1 className="font-marca text-[44px] leading-[1.05] tracking-[-0.02em] text-balance sm:text-6xl">
            Tu plata, en pesos y en dólares, <span className="text-primario">con calma</span>.
          </h1>
          <p className="max-w-[46ch] text-lg text-texto-2">
            Cargá un gasto en dos toques, mirá cuánto tenés disponible y cuánto invertido, y sumá pesos y dólares con la cotización del día. Gratis.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/app" className="inline-flex min-h-13 items-center rounded-chico bg-primario px-6 font-semibold text-sobre-primario">
              Empezar gratis
            </Link>
            <span className="text-sm text-texto-2">En la compu o instalada en el celular.</span>
          </div>
        </div>
        <EjemploInicio />
      </section>

      <section className="grid gap-8 sm:grid-cols-3">
        {[
          ["Dos monedas, siempre", "Cada monto dice si es en pesos o en dólares. La cotización (MEP, oficial, blue o la tuya) está a un toque."],
          ["Disponible e invertido", "Banco, efectivo y billeteras por un lado; plazo fijo, fondos y acciones por el otro. Y el total."],
          ["Sin culpa", "Un gasto es un dato, no un error. Nada de rojo ni de alarmas: ves en qué se fue y seguís."],
        ].map(([titulo, texto]) => (
          <div key={titulo} className="grid content-start gap-2 border-t-2 border-primario pt-4">
            <h2 className="font-marca text-xl">{titulo}</h2>
            <p className="text-texto-2">{texto}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6">
        <div className="grid gap-2">
          <h2 className="font-marca text-3xl">Herramientas simples para entender tus números</h2>
          <p className="text-texto-2">Una sola cuenta para todos los productos de Gastoico.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Producto nombre="gastoico" color="#24493F" texto="Tu plata personal: gastos, ingresos, ahorros e inversiones." enlace={{ href: "/app", texto: "Empezar gratis" }} />
          <Producto nombre="gastagro" color="#6B4F2A" texto="Los costos de tu campo: cuánto te cuesta producir y cuánto necesitás sacar." enlace={{ href: "https://gastagro.vercel.app", texto: "Conocer Gastagro" }} />
          <Producto nombre="gastemprende" color="#4B4F9C" texto="Costeo para los que fabrican y venden. Próximamente." />
        </div>
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-linea pt-6 text-sm text-texto-2">
        <Logo tamano="text-lg" simbolo="size-6" />
        <span>Hecho en Argentina.</span>
      </footer>
    </div>
  );
}

function Producto({ nombre, color, texto, enlace }: { nombre: string; color: string; texto: string; enlace?: { href: string; texto: string } }) {
  return (
    <div className="grid content-start gap-3 rounded-tarjeta border border-linea bg-superficie p-5">
      <span className="flex items-center gap-2.5">
        <svg viewBox="0 0 48 48" className="size-8" aria-hidden="true">
          <rect width="48" height="48" rx="12" fill={color} />
          <circle cx="24" cy="24" r="15" fill="#C8892B" />
        </svg>
        <span className="font-marca text-2xl leading-none">{nombre}</span>
      </span>
      {nombre !== "gastoico" && <span className="-mt-2 pl-[42px] text-xs text-texto-2">de Gastoico</span>}
      <p className="text-sm text-texto-2">{texto}</p>
      {enlace ? (
        <Link href={enlace.href} className="text-sm font-semibold text-primario">
          {enlace.texto} →
        </Link>
      ) : (
        <span className="text-sm text-texto-2">Próximamente</span>
      )}
    </div>
  );
}

/** Cómo se ve el inicio de la app, con números de ejemplo. */
function EjemploInicio() {
  const filas: [string, string, string][] = [
    ["Banco", "$", "412.300"],
    ["Efectivo", "$", "38.500"],
    ["Dólares", "US$", "850"],
  ];
  return (
    <figure className="grid gap-3">
      <div className="mx-auto grid w-full max-w-[320px] gap-4 rounded-[34px] border border-linea bg-superficie p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <Simbolo className="size-6" />
          <span className="font-marca text-lg">gastoico</span>
        </div>
        <div className="grid gap-1">
          <span className="text-xs text-texto-2">Tu plata hoy · en pesos</span>
          <span className="cifra text-4xl font-semibold">
            <span className="mr-1 text-xl font-medium opacity-70">$</span>4.806.300
          </span>
          <span className="cifra text-xs text-texto-2">≈ US$ 3.908</span>
        </div>
        <span className="inline-flex items-center gap-2 justify-self-start rounded-full border border-linea px-3 py-1 text-xs">
          <span className="size-1.5 rounded-full bg-primario" />
          Dólar MEP <b className="cifra font-semibold">$ 1.230</b>
        </span>
        <div className="grid gap-1.5 rounded-2xl bg-fondo p-3 text-sm">
          <div className="flex justify-between border-b border-linea pb-1.5 font-semibold">
            <span>Disponible</span>
            <span className="cifra">$ 1.496.300</span>
          </div>
          {filas.map(([n, s, v]) => (
            <div key={n} className="flex justify-between text-texto-2">
              <span>{n}</span>
              <span className="cifra text-texto">
                {s} {v}
              </span>
            </div>
          ))}
        </div>
      </div>
      <figcaption className="text-center text-xs text-texto-2">Números de ejemplo</figcaption>
    </figure>
  );
}
