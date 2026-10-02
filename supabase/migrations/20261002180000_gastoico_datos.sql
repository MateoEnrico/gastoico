-- Para aplicar en el proyecto qvcwijdcjzxqpusnkgld ("Gastoico"), el mismo de Gastagro.
-- Gastoico: todo lo de cada persona (lugares, categorías, movimientos, preferencias) como un documento.
-- Una fila por usuario, igual que public.gastagro_campos. La tabla public.gastos de la beta no se toca.
create table public.gastoico_datos (
  user_id uuid primary key references auth.users (id) on delete cascade,
  datos jsonb not null,
  actualizado timestamptz not null default now(),
  creado timestamptz not null default now()
);

comment on table public.gastoico_datos is 'Gastoico: Datos v1 de cada usuario (ver gastoico/src/lib/datos/tipos.ts).';

alter table public.gastoico_datos enable row level security;

create policy "gastoico: cada uno ve sus datos" on public.gastoico_datos
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "gastoico: cada uno crea sus datos" on public.gastoico_datos
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "gastoico: cada uno cambia sus datos" on public.gastoico_datos
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "gastoico: cada uno borra sus datos" on public.gastoico_datos
  for delete to authenticated using ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.gastoico_datos to authenticated;
revoke all on public.gastoico_datos from anon;
