import Link from "next/link";
import type { ReactNode } from "react";
import { LogoGastagro } from "@/components/gastagro";
import { Logo } from "@/components/marca";
import { VistaPrevia } from "@/components/vista-previa";

/** gastoico.com: la vidriera de la marca. Muestra la app gratis y los demás productos. */
export default function Landing() {
  return (
    <div className="mx-auto grid w-full max-w-5xl gap-20 px-5 pt-[calc(env(safe-area-inset-top)_+_1.25rem)] pb-16 sm:px-8">
      <header className="flex items-center justify-between">
        <Logo />
        <Link href="/app" className="presionable inline-flex min-h-11 items-center rounded-chico border border-linea px-4 text-sm font-semibold">
          Entrar
        </Link>
      </header>

      <section className="grid items-center gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="grid gap-6">
          <h1 className="font-marca text-[44px] leading-[1.05] tracking-[-0.02em] text-balance sm:text-6xl">
            Tu plata, en pesos y en dólares, <span className="text-primario">con calma</span>.
          </h1>
          <p className="max-w-[40ch] text-lg text-pretty text-texto-2">Anotá un gasto en dos toques y mirá cuánto tenés, sumando pesos y dólares con la cotización del día.</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link href="/app" className="presionable inline-flex min-h-13 items-center rounded-chico bg-primario px-6 font-semibold text-sobre-primario">
              Empezar gratis
            </Link>
            <span className="text-sm text-texto-2">En la compu o instalada en el celular.</span>
          </div>
        </div>
        <VistaPrevia />
      </section>

      <section className="grid gap-10 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="grid content-start gap-3">
          <h2 className="font-marca text-3xl leading-tight text-balance sm:text-4xl">Pensada para la plata de acá</h2>
          <p className="max-w-[36ch] text-texto-2">Se cobra en pesos, se ahorra en dólares y el dólar cambia todos los días. Gastoico lo da por hecho.</p>
        </div>
        <dl className="divide-y divide-linea border-y border-linea">
          {[
            ["Las dos monedas, siempre", "Cada monto dice si es en pesos o en dólares. Elegís el MEP, el oficial, el blue o tu propia cotización."],
            ["Disponible e invertido", "Banco, efectivo y billeteras por un lado; plazo fijo, fondos y acciones por el otro. Y el total, en la moneda que quieras."],
            ["Sin culpa", "Un gasto es un dato, no un error. No hay rojo ni alarmas: ves en qué se fue la plata y seguís."],
          ].map(([titulo, texto]) => (
            <div key={titulo} className="grid gap-1 py-5 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-6">
              <dt className="font-semibold">{titulo}</dt>
              <dd className="text-texto-2">{texto}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="grid gap-6">
        <div className="grid gap-2">
          <h2 className="font-marca text-3xl">Herramientas simples para entender tus números</h2>
          <p className="text-texto-2">Una sola cuenta para todos los productos de Gastoico.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Producto logo={<Logo />} texto="Tu plata personal: gastos, ingresos, ahorros e inversiones." enlace={{ href: "/app", texto: "Abrir la app" }} />
          <Producto logo={<LogoGastagro />} deGastoico texto="Los costos de tu campo: cuánto te cuesta producir y cuánto necesitás sacar." enlace={{ href: "https://gastagro.vercel.app", texto: "Conocer Gastagro" }} />
          <Producto logo={<span className="font-marca text-2xl leading-8 text-texto-2">gastemprende</span>} deGastoico texto="Costeo para los que fabrican y venden." />
        </div>
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-linea pt-6 text-sm text-texto-2">
        <Logo tamano="text-lg" simbolo="size-6" />
        <span>Hecho en Argentina.</span>
      </footer>
    </div>
  );
}

function Producto({ logo, deGastoico, texto, enlace }: { logo: ReactNode; deGastoico?: boolean; texto: string; enlace?: { href: string; texto: string } }) {
  return (
    <div className="grid content-start gap-3 rounded-tarjeta border border-linea bg-superficie p-5">
      <div className="grid gap-1">
        {logo}
        {deGastoico && <span className="text-xs text-texto-2">de Gastoico</span>}
      </div>
      <p className="text-sm text-texto-2">{texto}</p>
      {enlace && enlace.href.startsWith("http") ? (
        // Otro producto de la marca: se abre en otra pestaña para no perder Gastoico.
        <a href={enlace.href} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primario">
          {enlace.texto} ↗
        </a>
      ) : enlace ? (
        <Link href={enlace.href} className="text-sm font-semibold text-primario">
          {enlace.texto} →
        </Link>
      ) : (
        <span className="text-sm text-texto-2">Próximamente</span>
      )}
    </div>
  );
}
