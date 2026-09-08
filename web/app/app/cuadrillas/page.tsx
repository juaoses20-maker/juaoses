import { Plus } from "lucide-react";
import { CREWS, PROJECT } from "@/lib/seed";

export default function CuadrillasPage() {
  const nf = new Intl.NumberFormat("en-US");
  return (
    <div className="relative">
      <h1 className="mt-2 font-display text-[16px] font-semibold">Cuadrillas</h1>
      <p className="text-[10px] text-ink-3">
        {CREWS.length} cuadrillas · {PROJECT.name}
      </p>

      <div className="mt-2 flex flex-col gap-2">
        {CREWS.map((c) => (
          <div key={c.id} className="rounded-[12px] border bg-surface p-3 shadow-[var(--shadow-1)]">
            <div className="flex items-center gap-2">
              <span className="h-[11px] w-[11px] flex-none rounded-[3px]" style={{ background: c.color }} />
              <h3 className="font-display text-[13px] font-semibold">{c.name}</h3>
              <span className="ml-auto text-[9.5px] text-ink-3">{c.lastSeen}</span>
            </div>
            <div className="mt-1 text-[10.5px] text-ink-2">
              Foreman {c.foreman} · {c.people} personas
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {c.equipment.map((e) => (
                <span key={e} className="rounded-full border bg-surface-2 px-1.5 py-0.5 text-[9px] font-semibold text-ink-2">
                  {e}
                </span>
              ))}
            </div>
            <div className="mt-2 flex gap-3 font-mono text-[11px]">
              <span>
                <b className="font-semibold">{nf.format(c.ftToday)}</b> ft hoy
              </span>
              {c.extraToday && <span>{c.extraToday}</span>}
            </div>
          </div>
        ))}
      </div>

      <button
        aria-label="Nueva cuadrilla"
        className="fixed bottom-[76px] right-[calc(50%-230px+16px)] grid h-[46px] w-[46px] place-items-center rounded-full bg-[linear-gradient(180deg,color-mix(in_oklab,#fff_20%,var(--accent)),var(--accent))] text-accent-ink shadow-[0_10px_22px_color-mix(in_oklab,var(--accent)_38%,transparent)] max-[460px]:right-4"
      >
        <Plus className="h-[22px] w-[22px]" strokeWidth={2.6} />
      </button>
    </div>
  );
}
