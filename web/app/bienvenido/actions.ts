"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type CrearEmpresaState = { error: string | null };

/** Crea la empresa del usuario y lo deja como owner (RPC create_company). */
export async function crearEmpresa(
  _prev: CrearEmpresaState,
  formData: FormData,
): Promise<CrearEmpresaState> {
  const name = String(formData.get("name") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();

  if (name.length < 2) {
    return { error: "Escribe el nombre de tu empresa." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/entrar");

  const { error } = await supabase.rpc("create_company", {
    p_name: name,
    p_location: location || null,
  });

  if (error) {
    return { error: "No pudimos crear la empresa. Inténtalo de nuevo." };
  }

  redirect("/app");
}
