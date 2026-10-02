// Service worker de Gastoico: que la app instalada abra y funcione sin señal.
// Los datos viven en localStorage; acá solo se guardan páginas, JS, CSS, fuentes e íconos.
// Al cambiar este archivo, subir VERSION: así el celular instala la nueva y muestra "Actualizar".

const VERSION = "gastoico-v1";
const SIN_CONEXION = "/sin-conexion";
const ESPERA_RED_MS = 3000;

const PAGINAS = ["/app", "/app/cargar", "/app/movimientos", "/app/plata", "/app/categorias", "/app/ajustes", "/app/empezar", "/", SIN_CONEXION];
const ARCHIVOS = ["/manifest.webmanifest", "/iconos/icono-192.png", "/iconos/icono-512.png", "/iconos/icono-maskable-512.png"];
const RUTA_ESTATICA = /\/_next\/static\/[^"'\s\\()<>&]+/g;

self.addEventListener("install", (event) => {
  event.waitUntil(precargar());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const nombres = await caches.keys();
      await Promise.all(nombres.filter((n) => n.startsWith("gastoico-") && n !== VERSION).map((n) => caches.delete(n)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return; // La cotización siempre de la red.
  if (request.mode === "navigate") return event.respondWith(navegar(request));
  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/iconos/")) return event.respondWith(primeroCache(request));
  event.respondWith(primeroRed(request));
});

async function precargar() {
  const cache = await caches.open(VERSION);
  const estaticos = new Set();
  for (const pagina of PAGINAS) {
    try {
      const res = await fetch(pagina, { cache: "reload" });
      if (!res.ok) continue;
      const html = await res.clone().text();
      for (const ruta of html.match(RUTA_ESTATICA) ?? []) estaticos.add(ruta);
      await cache.put(pagina, res);
    } catch {
      // Sin señal al instalar: se completa a medida que se navega.
    }
  }
  await Promise.all([...ARCHIVOS, ...estaticos].map((ruta) => cache.add(ruta).catch(() => {})));
}

function conTiempoLimite(promesa) {
  return Promise.race([promesa, new Promise((resolver) => setTimeout(() => resolver(null), ESPERA_RED_MS))]);
}

async function navegar(request) {
  const cache = await caches.open(VERSION);
  try {
    const res = await conTiempoLimite(fetch(request));
    if (res && res.ok) {
      cache.put(new URL(request.url).pathname, res.clone());
      return res;
    }
    if (res) return res;
  } catch {
    // Sin señal.
  }
  const ruta = new URL(request.url).pathname;
  return (await cache.match(ruta)) ?? (await cache.match(SIN_CONEXION)) ?? Response.error();
}

async function primeroCache(request) {
  const guardada = await caches.match(request);
  if (guardada) return guardada;
  const res = await fetch(request);
  if (res.ok) (await caches.open(VERSION)).put(request, res.clone());
  return res;
}

async function primeroRed(request) {
  try {
    const res = await conTiempoLimite(fetch(request));
    if (res && res.ok) {
      (await caches.open(VERSION)).put(request, res.clone());
      return res;
    }
    if (res) return res;
  } catch {
    // Sin señal.
  }
  return (await caches.match(request)) ?? Response.error();
}
