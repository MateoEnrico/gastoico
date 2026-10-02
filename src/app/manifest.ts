import type { MetadataRoute } from "next";

/** Lo que permite instalar Gastoico en el celular. Instalada, abre directo en la app. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/app",
    name: "Gastoico",
    short_name: "Gastoico",
    description: "Tu plata, en pesos y en dólares, con calma.",
    lang: "es-AR",
    start_url: "/app",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#eef0ec",
    theme_color: "#eef0ec",
    icons: [
      { src: "/iconos/icono-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/iconos/icono-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/iconos/icono-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
