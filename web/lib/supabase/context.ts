import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

export type UserContext = {
  user: User;
  /** Empresa activa del usuario (primera membresía). `null` si aún no creó/entró a ninguna. */
  companyId: string | null;
  role: "owner" | "admin" | "member" | null;
};

/**
 * Sesión + empresa del usuario para Server Components y Route Handlers.
 * Devuelve `null` si no hay sesión.
 */
export async function getUserContext(): Promise<UserContext | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: membership } = await supabase
    .from("memberships")
    .select("company_id, role")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  return {
    user,
    companyId: membership?.company_id ?? null,
    role: (membership?.role as UserContext["role"]) ?? null,
  };
}
