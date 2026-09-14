import { redirect } from "next/navigation";
import { Check } from "lucide-react";
import { Btn, TopBar } from "@/components/site/ui";
import { getUserContext } from "@/lib/supabase/context";
import { createClient } from "@/lib/supabase/server";
import { startCheckout } from "./actions";

function Feat({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-[12px]">
      <span className="mt-0.5 grid h-4 w-4 flex-none place-items-center rounded-full bg-[color-mix(in_oklab,var(--accent-2)_18%,transparent)]">
        <Check className="h-2.5 w-2.5 text-accent-2" strokeWidth={3.4} />
      </span>
      <span className="flex-1">{children}</span>
    </div>
  );
}

export const metadata = { title: "Activa tu plan — EA Fiber Track" };

export default async function SuscripcionPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const ctx = await getUserContext();
  if (!ctx) redirect("/entrar");
  if (!ctx.companyId) redirect("/bienvenido");

  const supabase = await createClient();
  const { data: company } = await supabase
    .from("companies")
    .select("subscription_status")
    .eq("id", ctx.companyId)
    .single();

  if (company?.subscription_status === "active" || company?.subscription_status === "trialing") {
    redirect("/app");
  }

  const vencida = company?.subscription_status === "past_due" || company?.subscription_status === "canceled";

  return (
    <main className="flex min-h-dvh flex-col bg-bg text-ink">
      <div className="mx-auto flex w-full max-w-[460px] flex-1 flex-col px-5 pb-8 pt-[max(14px,env(safe-area-inset-top))]">
        <TopBar />

        <div className="flex flex-1 flex-col">
          <h1 className="mt-6 text-[24px] font-semibold">
            {vencida ? "Reactiva tu plan" : "Activa tu plan para entrar"}
          </h1>
          <p className="mt-2 text-[13px] text-ink-2">
            {vencida
              ? "Tu suscripción no está activa. Reactívala para seguir viendo tus planos, fotos y tickets 811."
              : "Un paso más: activa tus 14 días gratis para entrar a tu app."}
          </p>

          <div
            className="mt-4 rounded-card border-[1.5px] border-transparent p-4 shadow-[var(--shadow-2)]"
            style={{
              background:
                "linear-gradient(var(--bg),var(--bg)) padding-box, linear-gradient(135deg, color-mix(in oklab,var(--accent) 55%,transparent), transparent 62%) border-box",
            }}
          >
            <span className="inline-flex rounded-full bg-[var(--chip)] px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.07em] text-accent">
              Toda la empresa
            </span>
            <div className="mt-2 font-display text-[34px] font-bold leading-none tnum">
              $30<span className="font-body text-[13px] font-semibold text-ink-2"> /mes</span>
            </div>
            <p className="mt-1 text-[11.5px] text-ink-2">
              Un solo plan. Cuadrillas y personas ilimitadas. Cancela cuando quieras.
            </p>
            <div className="mt-3 flex flex-col gap-2">
              <Feat>Todo EA Fiber Track · personas ilimitadas</Feat>
              <Feat>Sin cobro por trabajador ni por cuadrilla</Feat>
              <Feat>Alertas antes de que venza un ticket 811</Feat>
            </div>
          </div>

          {error && (
            <p className="mt-3 rounded-[10px] border border-[color:color-mix(in_oklab,var(--crit)_40%,transparent)] bg-[color:color-mix(in_oklab,var(--crit)_8%,transparent)] px-3 py-2 text-[12px] text-[var(--crit)]">
              No se pudo abrir el pago: {error}
            </p>
          )}

          <div className="mt-auto pt-6">
            <form action={startCheckout}>
              <Btn type="submit">
                {vencida ? "Reactivar mi plan" : "Empezar mis 14 días gratis"}
              </Btn>
            </form>
            <p className="mt-2.5 text-center font-mono text-[10px] text-ink-3">
              {vencida ? "Pago por Stripe" : "No se cobra hoy · cancela con un correo · pago por Stripe"}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
