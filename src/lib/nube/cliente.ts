"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * El Supabase de la marca (proyecto "Gastoico", compartido: ver
 * gastoico-brain/wiki/tecnico/arquitectura.md). Sin las variables de entorno la app
 * anda igual, solo en el dispositivo (así se prueba en local sin cuenta).
 */
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const CLAVE = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const nubeConfigurada = Boolean(URL && CLAVE);

let cliente: SupabaseClient | null = null;

export function nube(): SupabaseClient | null {
  if (!nubeConfigurada) return null;
  cliente ??= createClient(URL!, CLAVE!, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: "pkce" },
  });
  return cliente;
}
