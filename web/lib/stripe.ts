import Stripe from "stripe";
import { stripeSecretKey } from "@/lib/env";

let cached: Stripe | null = null;

/** Cliente de Stripe — solo servidor (Server Actions y Route Handlers). */
export function getStripe(): Stripe {
  if (!cached) cached = new Stripe(stripeSecretKey());
  return cached;
}
