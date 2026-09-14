"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getStripe } from "@/lib/stripe";
import { stripePriceId } from "@/lib/env";
import { getUserContext } from "@/lib/supabase/context";
import { createClient } from "@/lib/supabase/server";

async function siteUrl(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

/** Abre el checkout de Stripe (14 días gratis, luego $30/mes) para la empresa del usuario. */
export async function startCheckout(): Promise<void> {
  const ctx = await getUserContext();
  if (!ctx) redirect("/entrar");
  if (!ctx.companyId) redirect("/bienvenido");

  const supabase = await createClient();
  const { data: company } = await supabase
    .from("companies")
    .select("stripe_customer_id, subscription_status")
    .eq("id", ctx.companyId)
    .single();

  if (company?.subscription_status === "active" || company?.subscription_status === "trialing") {
    redirect("/app");
  }

  const base = await siteUrl();
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: company?.stripe_customer_id ?? undefined,
    customer_email: company?.stripe_customer_id ? undefined : (ctx.user.email ?? undefined),
    client_reference_id: ctx.companyId,
    line_items: [{ price: stripePriceId(), quantity: 1 }],
    subscription_data: {
      trial_period_days: 14,
      metadata: { company_id: ctx.companyId },
    },
    success_url: `${base}/app?checkout=success`,
    cancel_url: `${base}/suscripcion`,
  });

  if (!session.url) throw new Error("Stripe no devolvió una URL de checkout.");
  redirect(session.url);
}
