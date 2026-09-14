import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { stripeWebhookSecret } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/**
 * Recibe los avisos de Stripe (pago, cancelación, cobro fallido) y actualiza la
 * suscripción de la empresa. Firma verificada + idempotente (tabla stripe_events):
 * si Stripe reintenta el mismo evento, la segunda vez no hace nada.
 */
export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  const body = await req.text();

  let event: Stripe.Event;
  try {
    if (!signature) throw new Error("Falta la firma stripe-signature.");
    event = getStripe().webhooks.constructEvent(body, signature, stripeWebhookSecret());
  } catch (err) {
    const msg = err instanceof Error ? err.message : "firma inválida";
    return new Response(`Webhook inválido: ${msg}`, { status: 400 });
  }

  const admin = createAdminClient();

  // Idempotencia: si ya vimos este evento, no lo procesamos de nuevo.
  const { error: dupError } = await admin.from("stripe_events").insert({ id: event.id });
  if (dupError) return new Response("ya procesado", { status: 200 });

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const companyId = session.client_reference_id;
      if (companyId && session.customer && session.subscription) {
        await admin
          .from("companies")
          .update({
            stripe_customer_id: String(session.customer),
            stripe_subscription_id: String(session.subscription),
            subscription_status: "trialing",
          })
          .eq("id", companyId);
      }
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const status = sub.status as
        | "trialing"
        | "active"
        | "past_due"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "unpaid"
        | "paused";
      const mapped = status === "trialing" || status === "active" || status === "past_due" ? status : "canceled";
      await admin
        .from("companies")
        .update({
          subscription_status: mapped,
          trial_ends_at: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null,
          current_period_end: sub.items.data[0]?.current_period_end
            ? new Date(sub.items.data[0].current_period_end * 1000).toISOString()
            : null,
        })
        .eq("stripe_subscription_id", sub.id);
      break;
    }

    default:
      break;
  }

  return new Response("ok", { status: 200 });
}
