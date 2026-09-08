import Link from "next/link";
import { PencilRuler, BarChart3, Plus } from "lucide-react";
import { PLANS, PLAN_MARKS } from "@/lib/seed";

function EmptyPlanos() {
  return (
    <div className="grid flex-1 place-items-center py-16 text-center">
      <div>
        <PencilRuler className="mx-auto h-9 w-9 text-ink-3" strokeWidth={1.5} />
        <div className="mt-2.5 font-display text-[15px] font-semibold">Sube tu primer plano</div>
        <p className="mx-auto mt-1.5 max-w-[24ch] text-[11.5px] text-ink-2">
          PDF o foto. Después marcas encima los tramos construidos.
        </p>
        <Link
          href="/probar"
          className="mt-3.5 inline-flex h-[38px] items-center rounded-btn bg-[linear-gradient(180deg,color-mix(in_oklab,#fff_20%,var(--accent)),var(--accent))] px-4 text-[12px] font-bold text-accent-ink shadow-[0_6px_16px_color-mix(in_oklab,var(--accent)_32%,transparent)]"
        >
          Subir plano
        </Link>
      </div>
    </div>
  );
}

export default function PlanosPage() {
  if (PLANS.length === 0) return <EmptyPlanos />;
  const plan = PLANS[0];

  return (
    <div className="relative">
      <div className="mt-2">
        <h1 className="font-display text-[16px] font-semibold">{plan.name}</h1>
        <p className="text-[10px] text-ink-3">
          {plan.marks} marcas · {new Intl.NumberFormat("en-US").format(plan.ftMarked)} ft marcados
        </p>
      </div>

      <div className="mt-2.5 flex gap-1.5">
        <span className="rounded-full border border-accent bg-accent px-2.5 py-1.5 text-[11px] font-semibold text-accent-ink">
          Marcar tramo
        </span>
        <span className="rounded-full border bg-surface px-2.5 py-1.5 text-[11px] font-semibold text-ink-2">Punto</span>
        <span className="ml-auto rounded-full border bg-surface px-2.5 py-1.5 text-[11px] font-semibold text-ink-2">
          Marcas
        </span>
      </div>

      <div className="mt-2 overflow-hidden rounded-[12px] border bg-white">
        <svg viewBox="0 0 272 150" className="block w-full">
          <rect width="272" height="150" fill="#fff" />
          <g stroke="#ece4d7" strokeWidth="1">
            <path d="M0 44H272M0 88H272M0 120H272M66 0V150M150 0V150M214 0V150" />
          </g>
          <text x="12" y="18" fontFamily="monospace" fontSize="7" fill="#8d8271">
            SHEET C-3 · OSP PLAN &amp; PROFILE · 1&apos;=40ft
          </text>
          <path d="M16 74H252" stroke="#cbb9a3" strokeWidth="2" strokeDasharray="6 4" />
          <path d="M16 74H150" stroke="#e8590c" strokeWidth="5" strokeLinecap="round" />
          <circle cx="16" cy="74" r="4.5" fill="#e8590c" />
          <circle cx="150" cy="74" r="4.5" fill="#e8590c" />
          <text x="60" y="66" fontFamily="monospace" fontSize="8.5" fill="#e8590c" textAnchor="middle">
            1 850 ft
          </text>
          <rect x="122" y="66" width="14" height="14" fill="#e8590c" fillOpacity="0.2" stroke="#e8590c" strokeWidth="1.6" />
          <text x="16" y="112" fontFamily="monospace" fontSize="7.5" fill="#c0562f">
            HH-12 · set a grade
          </text>
        </svg>
      </div>

      <p className="mx-0.5 mb-2 mt-5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.1em] text-ink-3">
        Marcas de producción
      </p>
      <div className="overflow-hidden rounded-[12px] border bg-surface px-3 shadow-[var(--shadow-1)]">
        {PLAN_MARKS.map((m, i) => (
          <div key={i} className="flex items-center gap-2.5 border-b py-2.5 text-[11.5px] last:border-b-0">
            <span className="grid h-6 w-6 flex-none place-items-center rounded-[7px] border bg-surface-2">
              {m.kind === "seg" ? (
                <BarChart3 className="h-3.5 w-3.5 text-accent" strokeWidth={2} />
              ) : (
                <span className="h-2.5 w-2.5 rounded-[2px] bg-accent" />
              )}
            </span>
            <div>
              <div className="font-semibold">{m.label}</div>
              <div className="text-[10px] text-ink-2">{m.sub}</div>
            </div>
            <span className="ml-auto text-ink-3">›</span>
          </div>
        ))}
      </div>

      <Link
        href="/probar"
        aria-label="Nueva marca"
        className="fixed bottom-[76px] right-[calc(50%-230px+16px)] grid h-[46px] w-[46px] place-items-center rounded-full bg-[linear-gradient(180deg,color-mix(in_oklab,#fff_20%,var(--accent)),var(--accent))] text-accent-ink shadow-[0_10px_22px_color-mix(in_oklab,var(--accent)_38%,transparent)] max-[460px]:right-4"
      >
        <Plus className="h-[22px] w-[22px]" strokeWidth={2.6} />
      </Link>
    </div>
  );
}
