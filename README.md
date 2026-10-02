# Gastoico

Tu plata, en pesos y en dólares, con calma. La app gratis de gastos personales de gastoico.com, y la
landing de la marca.

- `/`: landing de la marca (Gastoico, Gastagro, Gastemprende).
- `/app`: la app (con sesión). Instalable en el celular (PWA).

El brain del proyecto (qué es, decisiones, estado) está en `../gastoico-brain`. Empezá por su `BRIEF.md`.

## Para levantarla

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # motor de cálculo y formatos
node scripts/iconos.mjs   # regenera favicon e íconos desde src/lib/marca.ts
```

Sin `.env.local` la app anda solo en el dispositivo, sin cuenta. Con `NEXT_PUBLIC_SUPABASE_URL` y
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (el Supabase "Gastoico", el mismo de Gastagro) pide entrar y
sincroniza con `public.gastoico_datos` (migración en `supabase/migrations/`).

## Dónde está cada cosa

- `src/lib/datos/`: tipos, motor de cálculo puro (`calculos.ts`, con tests) y almacenamiento local.
- `src/lib/nube/`: Supabase y la sincronización (primero el dispositivo, después la nube).
- `src/app/api/cotizacion`: dólar del día desde dolarapi.com (valor de venta).
- `src/components/`: interfaz. Tokens de la marca en `src/app/globals.css`.

La beta de costeo para emprendedores quedó en la rama `emprendedores-v1`.
