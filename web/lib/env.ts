import { z } from "zod";

/** Validación fail-closed de las variables de entorno (51 §6).
 *  Si falta una requerida, la app crashea al arrancar en vez de correr rota. */
const schema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
});

const parsed = schema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
});

if (!parsed.success) {
  throw new Error(
    "Faltan variables de entorno de Supabase. Copia web/.env.example a web/.env.local y complétalas.\n" +
      JSON.stringify(parsed.error.flatten().fieldErrors, null, 2),
  );
}

export const env = parsed.data;

/** Solo servidor — nunca se importa desde un componente de cliente. */
export function serverEnv() {
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!secret) throw new Error("Falta SUPABASE_SECRET_KEY (solo servidor).");
  return { SUPABASE_SECRET_KEY: secret };
}

/** Variables de Stripe — solo servidor. Cada una se valida donde se usa (no todas hacen falta siempre). */
export function stripeSecretKey(): string {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Falta STRIPE_SECRET_KEY (solo servidor).");
  return key;
}

export function stripeWebhookSecret(): string {
  const key = process.env.STRIPE_WEBHOOK_SECRET;
  if (!key) throw new Error("Falta STRIPE_WEBHOOK_SECRET (solo servidor).");
  return key;
}

export function stripePriceId(): string {
  const id = process.env.STRIPE_PRICE_ID;
  if (!id) throw new Error("Falta STRIPE_PRICE_ID (solo servidor).");
  return id;
}
