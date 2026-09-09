import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

export type UserContext = {
  user: User;
  /** Empresa activa del usuario (primera membresía). `null` si aún no creó/entró a ninguna. */
  companyId: string | null;
  role: "owner" | "admin" | "member" | null;
};

/**
 * Sesión + empresa del usuario para Server Components / Route Handlers / Server Actions.
 * Usa la sesión de la cookie (sin refrescar: eso lo hace `proxy.ts` en cada request).
 * La seguridad real de los datos la impone RLS con `auth.uid()`.
 */
export async function getUserContext(): Promise<UserContext | null> {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) return null;

  const { data: membership } = await supabase
    .from("memberships")
    .select("company_id, role")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  return {
    user: session.user,
    companyId: membership?.company_id ?? null,
    role: (membership?.role as UserContext["role"]) ?? null,
  };
}
