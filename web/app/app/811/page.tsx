import { TriangleAlert, Plus } from "lucide-react";
import { TICKETS, TICKETS_AT_RISK, type Ticket } from "@/lib/seed";
import { getActiveProject } from "@/lib/data/queries";
import NoProject from "@/components/app/NoProject";
import DemoBadge from "@/components/app/DemoBadge";

const STRIPE: Record<Ticket["status"], string> = {
  activo: "border-l-accent-2",
  "por-vencer": "border-l-warn",
  vencido: "border-l-crit",
};
const PILL: Record<string, string> = {
  Activo: "bg-[color-mix(in_oklab,var(--accent-2)_16%,transparent)] text-accent-2",
  "Por vencer": "bg-[color-mix(in_oklab,var(--warn)_15%,transparent)] text-warn",
  Vencido: "bg-[color-mix(in_oklab,var(--crit)_13%,transparent)] text-crit",
  Cerrado: "bg-surface-2 text-ink-3",
};

export default async function TicketsPage() {
  const project = await getActiveProject();
  if (!project) return <NoProject what="tickets 811" />;

  return (
    <div className="relative">
      <div className="mt-2 flex flex-col">
        <h1 className="font-display text-[16px] font-semibold">Tickets 811</h1>
        <p className="text-[10px] text-ink-3">{TICKETS.length} tickets · Kentucky 811</p>
        <DemoBadge />
      </div>

      {TICKETS_AT_RISK > 0 && (
        <div className="my-2 flex items-start gap-2 rounded-[12px] bg-[color-mix(in_oklab,var(--warn)_14%,transparent)] px-2.5 py-2.5 text-[11px] text-warn">
          <TriangleAlert className="h-4 w-4 flex-none" strokeWidth={2.2} />
          <span>
            <b className="font-semibold">{TICKETS_AT_RISK} tickets</b> vencen en 3 días o menos. Verifica el estado con
            Kentucky 811 antes de excavar.
          </span>
        </div>
      )}

      <div className="overflow-hidden rounded-[12px] border bg-surface shadow-[var(--shadow-1)]">
        {TICKETS.map((t) => (
          <div key={t.number} className={"flex flex-col gap-0.5 border-b border-l-[3px] px-3 py-2.5 last:border-b-0 " + STRIPE[t.status]}>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[12px] font-semibold">#{t.number}</span>
              <span className={"ml-auto rounded-full px-2 py-0.5 font-mono text-[8.5px] font-semibold " + (PILL[t.detail] ?? PILL.Cerrado)}>
                {t.detail}
              </span>
            </div>
            <div className="text-[11px] font-medium">{t.location}</div>
            <div className="flex gap-2 text-[9.5px] text-ink-2">
              {t.meta.map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
            {t.renewable && (
              <button className="mt-1 self-start rounded-full border [border-color:color-mix(in_oklab,var(--accent)_30%,transparent)] px-2.5 py-1 text-[10px] font-semibold text-accent">
                Renovar +21 d
              </button>
            )}
          </div>
        ))}
      </div>

      <p className="mt-3 rounded-[10px] border border-dashed bg-surface px-3 py-2 text-[10px] leading-relaxed text-ink-3">
        EA Fiber Track no reemplaza la llamada al 811. Verifica el estado oficial del locate con Kentucky 811 antes de excavar.
      </p>

      <button
        aria-label="Nuevo ticket 811"
        className="fixed bottom-[76px] right-[calc(50%-230px+16px)] grid h-[46px] w-[46px] place-items-center rounded-full bg-[linear-gradient(180deg,color-mix(in_oklab,#fff_20%,var(--accent)),var(--accent))] text-accent-ink shadow-[0_10px_22px_color-mix(in_oklab,var(--accent)_38%,transparent)] max-[460px]:right-4"
      >
        <Plus className="h-[22px] w-[22px]" strokeWidth={2.6} />
      </button>
    </div>
  );
}
