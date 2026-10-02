import Link from "next/link";
import { Logo } from "@/components/marca";

export const metadata = { title: "Sin señal" };

export default function SinConexion() {
  return (
    <main className="mx-auto grid min-h-dvh max-w-sm content-center gap-5 px-5">
      <Logo />
      <h1 className="font-marca text-[28px] leading-tight">Sin señal</h1>
      <p className="text-texto-2">Esta pantalla todavía no estaba guardada en el dispositivo. Lo que ya cargaste está a salvo.</p>
      <Link href="/app" className="font-semibold text-primario">
        Volver al inicio
      </Link>
    </main>
  );
}
