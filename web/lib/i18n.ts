/** Constantes de idioma compartidas (sin dependencias de servidor). */
export const LOCALES = ["es", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "es";
export const LOCALE_COOKIE = "eaft_lang";

export function isLocale(v: unknown): v is Locale {
  return v === "es" || v === "en";
}
