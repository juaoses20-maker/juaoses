import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { env, serverEnv } from "@/lib/env";

/**
 * Cliente con la clave de servicio: se salta RLS. Úsalo SOLO en el webhook de Stripe
 * (no tiene sesión de usuario para que RLS valide `auth.uid()`, pero la firma de Stripe
 * ya verificó que la petición es legítima). Nunca lo importes desde código que atiende
 * al usuario directamente.
 */
export function createAdminClient() {
  const { SUPABASE_SECRET_KEY } = serverEnv();
  return createSupabaseClient(env.NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, {
    auth: { persistSession: false },
  });
}
