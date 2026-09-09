"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type CrearEmpresaState = { error: string | null; ok?: boolean };

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
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) {
    return {
      error: "Tu sesión no está activa. Cierra esta página, vuelve a entrar con tu correo e inténtalo otra vez.",
    };
  }

  const { data: companyId, error } = await supabase.rpc("create_company", {
    p_name: name,
    p_location: location || null,
  });

  if (error) {
    return { error: `No se pudo crear la empresa (${error.code ?? "?"}): ${error.message}` };
  }
  if (!companyId) {
    return { error: "No se pudo crear la empresa: la base de datos no devolvió un identificador." };
  }

  revalidatePath("/app", "layout");
  return { error: null, ok: true };
}
