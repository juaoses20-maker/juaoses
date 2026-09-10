"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isLocale, LOCALE_COOKIE, type Locale } from "@/lib/i18n";

/** Guarda el idioma elegido en cookie (siempre) y en el perfil del usuario si hay sesión. */
export async function setLanguage(locale: Locale): Promise<void> {
  if (!isLocale(locale)) return;

  const store = await cookies();
  store.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) await supabase.auth.updateUser({ data: { lang: locale } });
  } catch {
    // sin sesión o sin conexión: la cookie basta
  }

  revalidatePath("/", "layout");
}
