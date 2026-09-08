import { Flame, BarChart3 } from "lucide-react";
import {
  CREWS,
  TODAY_ACTIVITY,
  FT_TODAY,
  TICKETS_AT_RISK,
  STREAK_DAYS,
} from "@/lib/seed";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mx-0.5 mb-2 mt-5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.1em] text-ink-3">
      {children}
    </p>
  );
}

export default function HoyPage() {
  const activeCrews = CREWS.filter((c) => c.ftToday > 0 || c.extraToday).length;
  const nf = new Intl.NumberFormat("en-US");

  return (
    <div>
      <h1 className="mt-2 text-[22px] font-semibold">El día de hoy</h1>

      <div className="mt-2 grid grid-cols-3 gap-1.5">
        {[
          { k: nf.format(FT_TODAY), l: "pies hoy", cls: "text-accent" },
          { k: String(TICKETS_AT_RISK), l: "811 x vencer", cls: "text-warn" },
          { k: `${activeCrews}/${CREWS.length}`, l: "cuadrillas", cls: "" },
        ].map((t) => (
          <div key={t.l} className="rounded-[12px] border bg-surface p-2 shadow-[var(--shadow-1)]">
            <div className={"font-display text-[19px] font-bold leading-none tnum " + t.cls}>{t.k}</div>
            <div className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.03em] text-ink-3">{t.l}</div>
          </div>
        ))}
      </div>

      {/* site map */}
      <div className="mt-2 overflow-hidden rounded-[12px] border bg-surface">
        <svg viewBox="0 0 272 116" className="block w-full">
          <rect width="272" height="116" fill="var(--surface)" />
          <g stroke="var(--line)" strokeWidth="1">
            <path d="M0 39H272M0 78H272M68 0V116M150 0V116M214 0V116" />
          </g>
          <path d="M20 52H180" stroke="#e8590c" strokeWidth="4" strokeLinecap="round" />
          <text x="20" y="44" fontFamily="monospace" fontSize="8" fill="#e8590c">1 850 ft</text>
          <path d="M40 92H230" stroke="#3c6a89" strokeWidth="4" strokeLinecap="round" />
          <text x="40" y="86" fontFamily="monospace" fontSize="8" fill="#3c6a89">2 400 ft</text>
          <circle cx="120" cy="30" r="4.5" fill="#e8590c" stroke="#fff" strokeWidth="1.5" />
          <text x="128" y="33" fontFamily="var(--font-fraunces),serif" fontSize="8" fill="var(--ink)">A</text>
          <circle cx="200" cy="70" r="4.5" fill="#3c6a89" stroke="#fff" strokeWidth="1.5" />
          <text x="208" y="73" fontFamily="var(--font-fraunces),serif" fontSize="8" fill="var(--ink)">B</text>
          <rect x="60" y="24" width="10" height="10" rx="1.5" fill="none" stroke="#b26a00" strokeWidth="1.6" strokeDasharray="2 1.5" />
        </svg>
        <div className="flex gap-2.5 border-t px-2.5 py-1.5 text-[9px] text-ink-2">
          <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-accent" />Cuadrilla</span>
          <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-accent-2" />Tramo probado</span>
          <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-[2px] bg-warn" />811</span>
        </div>
      </div>

      {/* streak */}
      <div className="mt-2 flex items-center gap-2.5 rounded-[12px] border bg-surface px-3 py-2.5 shadow-[var(--shadow-1)]">
        <span className="grid h-[30px] w-[30px] flex-none place-items-center rounded-[9px] bg-[color-mix(in_oklab,var(--accent-2)_16%,transparent)]">
          <Flame className="h-[15px] w-[15px] text-accent-2" strokeWidth={2} />
        </span>
        <div>
          <div className="text-[12px] font-semibold">{STREAK_DAYS} días con parte cerrado</div>
          <div className="text-[10px] text-ink-2">La cuadrilla no ha fallado un día</div>
        </div>
        <div className="ml-auto flex gap-[3px]">
          {Array.from({ length: 7 }).map((_, i) => (
            <span key={i} className={"h-[7px] w-[7px] rounded-full " + (i < STREAK_DAYS ? "bg-accent-2" : "bg-line")} />
          ))}
        </div>
      </div>

      <Eyebrow>Actividad de hoy</Eyebrow>
      <div className="overflow-hidden rounded-[12px] border bg-surface shadow-[var(--shadow-1)]">
        {TODAY_ACTIVITY.map((a) => (
          <div key={a.crew} className="flex items-center gap-2.5 border-b px-3 py-2.5 last:border-b-0">
            <span className="grid h-[30px] w-[30px] flex-none place-items-center rounded-[9px] border bg-surface-2">
              <BarChart3 className="h-[15px] w-[15px] text-accent" strokeWidth={2} />
            </span>
            <div>
              <div className="text-[12.5px] font-semibold">
                {a.activity} · {a.crew}
              </div>
              <div className="mt-0.5 text-[10px] text-ink-2">
                {a.sta} · {a.at}
              </div>
            </div>
            <span className="ml-auto font-mono text-[13px] font-semibold tnum">{nf.format(a.ft)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
