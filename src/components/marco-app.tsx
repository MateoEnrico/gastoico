"use client";

import { House, Plus, ReceiptText, Settings, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Logo } from "./marca";

const SECCIONES = [
  { href: "/app", texto: "Inicio", Icono: House },
  { href: "/app/movimientos", texto: "Movimientos", Icono: ReceiptText },
  { href: "/app/plata", texto: "Mi plata", Icono: Wallet },
  { href: "/app/ajustes", texto: "Ajustes", Icono: Settings },
];

function activa(ruta: string, href: string) {
  return href === "/app" ? ruta === "/app" : ruta.startsWith(href);
}

/**
 * El marco de la app: barra abajo en el celular (con el botón de cargar en el medio) y lateral en la
 * PC. En las pantallas de cargar y de bienvenida no hay barra: son de una sola tarea.
 */
export function MarcoApp({ children }: { children: ReactNode }) {
  const ruta = usePathname();
  const sinBarra = ruta.startsWith("/app/cargar") || ruta.startsWith("/app/empezar");

  if (sinBarra) return <div className="mx-auto w-full max-w-xl flex-1 px-4 pb-[calc(env(safe-area-inset-bottom)_+_1.5rem)]">{children}</div>;

  return (
    <div className="flex flex-1">
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col gap-8 border-r border-linea px-4 py-6 lg:flex">
        <Link href="/app" className="px-2">
          <Logo />
        </Link>
        <Link href="/app/cargar" className="presionable flex min-h-12 items-center justify-center gap-2 rounded-chico bg-primario font-semibold text-sobre-primario">
          <Plus className="size-5" strokeWidth={2} aria-hidden="true" />
          Cargar
        </Link>
        <nav className="grid gap-1" aria-label="Secciones">
          {SECCIONES.map(({ href, texto, Icono }) => (
            <Link
              key={href}
              href={href}
              aria-current={activa(ruta, href) ? "page" : undefined}
              className={`fila-presionable flex min-h-11 items-center gap-3 rounded-chico px-3 text-[15px] ${activa(ruta, href) ? "bg-primario-suave font-semibold text-texto" : "text-texto-2 hover:bg-primario-suave"}`}
            >
              <Icono className="size-5" strokeWidth={1.75} aria-hidden="true" />
              {texto}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="mx-auto w-full max-w-2xl flex-1 px-4 pt-[env(safe-area-inset-top)] pb-[calc(env(safe-area-inset-bottom)_+_6rem)] lg:px-8 lg:pt-6 lg:pb-12">{children}</div>

      <nav
        aria-label="Secciones"
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 items-end border-t border-linea bg-superficie/95 px-2 pt-1.5 pb-[calc(env(safe-area-inset-bottom)_+_0.4rem)] backdrop-blur lg:hidden"
      >
        {SECCIONES.slice(0, 2).map((s) => (
          <ItemBarra key={s.href} {...s} activo={activa(ruta, s.href)} />
        ))}
        <Link href="/app/cargar" aria-label="Cargar" className="presionable mx-auto -mt-5 grid size-14 place-items-center rounded-2xl bg-primario text-sobre-primario shadow-md">
          <Plus className="size-7" strokeWidth={2} aria-hidden="true" />
        </Link>
        {SECCIONES.slice(2).map((s) => (
          <ItemBarra key={s.href} {...s} activo={activa(ruta, s.href)} />
        ))}
      </nav>
    </div>
  );
}

function ItemBarra({ href, texto, Icono, activo }: (typeof SECCIONES)[number] & { activo: boolean }) {
  return (
    <Link href={href} aria-current={activo ? "page" : undefined} className={`presionable grid min-h-12 justify-items-center gap-0.5 py-1 text-[11px] ${activo ? "font-semibold text-primario" : "text-texto-2"}`}>
      <Icono className="size-6" strokeWidth={activo ? 2 : 1.75} aria-hidden="true" />
      {texto}
    </Link>
  );
}
