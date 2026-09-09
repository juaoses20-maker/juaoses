"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
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
  if (!user) {
    return { error: "Tu sesión se cerró. Cierra esta página, vuelve a entrar con tu correo y prueba de nuevo." };
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
  redirect("/app");
}
