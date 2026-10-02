import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { IBM_Plex_Mono, Onest, Young_Serif } from "next/font/google";
import { AvisoConexion } from "@/components/aviso-conexion";
import { RegistrarSW } from "@/components/registrar-sw";
import "./globals.css";

const youngSerif = Young_Serif({ variable: "--font-young-serif", subsets: ["latin"], weight: "400" });
const onest = Onest({ variable: "--font-onest", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const plexMono = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400", "500"] });

export const metadata: Metadata = {
  title: { default: "Gastoico", template: "%s · Gastoico" },
  description: "Tu plata, en pesos y en dólares, con calma. Gastos, ingresos, ahorros e inversiones, con la cotización del día.",
  applicationName: "Gastoico",
  appleWebApp: { capable: true, title: "Gastoico", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eef0ec" },
    { media: "(prefers-color-scheme: dark)", color: "#111614" },
  ],
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-AR" className={`${youngSerif.variable} ${onest.variable} ${plexMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <AvisoConexion />
        {children}
        <RegistrarSW />
      </body>
    </html>
  );
}
