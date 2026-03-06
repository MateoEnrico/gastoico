import { createClient } from '@supabase/supabase-js';

/*
 * ─── SETUP (una sola vez) ────────────────────────────────────────────────────
 *
 * 1. Creá un proyecto en https://supabase.com
 *
 * 2. Ejecutá este SQL en el Editor SQL de tu proyecto:
 *
 *   create table gastos (
 *     id text primary key,
 *     user_id uuid references auth.users on delete cascade not null,
 *     tipo text default '', mes text default '',
 *     precio numeric default 0, guardado boolean default false
 *   );
 *   create table manos_obra (
 *     id text primary key,
 *     user_id uuid references auth.users on delete cascade not null,
 *     area text default '', costo_x_hora numeric default 0,
 *     cant_horas numeric default 0, cant_dias numeric default 0,
 *     empleados numeric default 0, guardado boolean default false
 *   );
 *   create table materias_primas (
 *     id text primary key,
 *     user_id uuid references auth.users on delete cascade not null,
 *     tipo text default '', nombre text default '',
 *     unidades_x_paquete numeric default 0, tipo_unidad text default '',
 *     precio_x_paquete numeric default 0, cantidad_paquetes numeric default 0,
 *     guardado boolean default false
 *   );
 *   create table servicios (
 *     id text primary key,
 *     user_id uuid references auth.users on delete cascade not null,
 *     nombre text default '', unidad text default '',
 *     cantidad_uni numeric default 0, precio_x_uni numeric default 0,
 *     guardado boolean default false
 *   );
 *   create table impuestos (
 *     id text primary key,
 *     user_id uuid references auth.users on delete cascade not null,
 *     nombre text default '', porcentaje numeric default 0,
 *     guardado boolean default false
 *   );
 *   create table productos (
 *     id text primary key,
 *     user_id uuid references auth.users on delete cascade not null,
 *     nombre text default '', precio_venta numeric default 0,
 *     cantidad numeric default 0,
 *     materias_primas_seleccionadas text[] default '{}',
 *     fijos_seleccionados text[] default '{}',
 *     mano_obra_seleccionada text[] default '{}',
 *     mano_variable_seleccionada text[] default '{}',
 *     impuestos_seleccionados text[] default '{}',
 *     precio_costo numeric default 0, guardado boolean default false
 *   );
 *   alter table gastos           enable row level security;
 *   alter table manos_obra       enable row level security;
 *   alter table materias_primas  enable row level security;
 *   alter table servicios        enable row level security;
 *   alter table impuestos        enable row level security;
 *   alter table productos        enable row level security;
 *
 *   create policy "own_gastos"          on gastos          for all using (auth.uid() = user_id);
 *   create policy "own_manos_obra"      on manos_obra      for all using (auth.uid() = user_id);
 *   create policy "own_materias_primas" on materias_primas for all using (auth.uid() = user_id);
 *   create policy "own_servicios"       on servicios       for all using (auth.uid() = user_id);
 *   create policy "own_impuestos"       on impuestos       for all using (auth.uid() = user_id);
 *   create policy "own_productos"       on productos       for all using (auth.uid() = user_id);
 *
 * 3. Para Google OAuth:
 *    Dashboard → Authentication → Providers → Google → Enable
 *    (necesitás un Client ID y Secret de Google Cloud Console)
 *
 * 4. Creá un archivo .env en la raíz del proyecto:
 *    REACT_APP_SUPABASE_URL=https://xxxx.supabase.co
 *    REACT_APP_SUPABASE_ANON_KEY=sb_publishable_...
 * ────────────────────────────────────────────────────────────────────────────
 */

const url = process.env.REACT_APP_SUPABASE_URL;
const key = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.warn(
    '⚠️  Supabase no configurado — la app funciona en modo offline.\n' +
    '   Agregá REACT_APP_SUPABASE_URL y REACT_APP_SUPABASE_ANON_KEY a tu .env'
  );
}

export const supabase = url && key ? createClient(url, key) : null;
