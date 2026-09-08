"use client";

import { useActionState, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, FileText, Trash2 } from "lucide-react";
import { addPlanMark, deletePlanMark, type MarkSaveState } from "@/lib/data/actions";
import { PLAN_ACTIVITIES, type Crew, type Plan, type PlanMark } from "@/lib/data/types";

const initial: MarkSaveState = { error: null };
const nf = new Intl.NumberFormat("en-US");
type Pt = { x: number; y: number };

function geomPoints(m: PlanMark): { a: Pt; b?: Pt } {
  if ("p" in m.geom) return { a: { x: m.geom.p[0], y: m.geom.p[1] } };
  return { a: { x: m.geom.a[0], y: m.geom.a[1] }, b: { x: m.geom.b[0], y: m.geom.b[1] } };
}

export default function PlanEditor({
  plan,
  marks,
  crews,
}: {
  plan: Plan;
  marks: PlanMark[];
  crews: Crew[];
}) {
  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const [mode, setMode] = useState<"seg" | "pt">("seg");
  const [pending, setPending] = useState<Pt[]>([]);
  const [activity, setActivity] = useState<string>(PLAN_ACTIVITIES[0]);
  const [feet, setFeet] = useState("");
  const [crewId, setCrewId] = useState("");
  const [state, formAction] = useActionState(addPlanMark, initial);
  const [seenNonce, setSeenNonce] = useState<string | undefined>(undefined);

  const colorOf = useMemo(() => {
    const map = new Map(crews.map((c) => [c.id, c.color]));
    return (id: string | null) => (id && map.get(id)) || "#e8590c";
  }, [crews]);

  // Reset comparando estado con estado (patrón React "no necesitas un efecto").
  if (state.nonce && state.nonce !== seenNonce) {
    setSeenNonce(state.nonce);
    setPending([]);
    setFeet("");
  }

  const complete = pending.length === (mode === "seg" ? 2 : 1);

  function tap(e: React.MouseEvent<HTMLDivElement>) {
    if (complete || plan.is_pdf) return;
    const r = surfaceRef.current?.getBoundingClientRect();
    if (!r) return;
    const x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    const y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    setPending((p) => (mode === "seg" ? [...p, { x, y }].slice(0, 2) : [{ x, y }]));
  }

  const geomJson =
    complete && mode === "seg"
      ? JSON.stringify({ a: [pending[0].x, pending[0].y], b: [pending[1].x, pending[1].y] })
      : complete
        ? JSON.stringify({ p: [pending[0].x, pending[0].y] })
        : "";

  return (
    <div className="pb-2">
      <div className="flex items-center gap-2 pt-1">
        <Link href="/app/planos" className="grid h-8 w-8 place-items-center rounded-[8px] text-ink-3 hover:text-ink">
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="truncate font-display text-[14px] font-semibold">{plan.name}</div>
          <div className="text-[10px] text-ink-3">
            {marks.length} {marks.length === 1 ? "marca" : "marcas"} · {nf.format(plan.ft_marked)} ft marcados
          </div>
        </div>
      </div>

      {plan.is_pdf ? (
        <div className="mt-3 rounded-[12px] border bg-surface p-4 text-center shadow-[var(--shadow-1)]">
          <FileText className="mx-auto h-9 w-9 text-ink-3" strokeWidth={1.5} />
          <p className="mx-auto mt-2 max-w-[30ch] text-[12px] text-ink-2">
            Este plano es un PDF. Para marcar tramos encima, súbelo como foto.
          </p>
          {plan.url && (
            <a
              href={plan.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-btn border px-3 text-[12px] font-semibold text-ink"
            >
              <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} /> Abrir PDF
            </a>
          )}
        </div>
      ) : (
        <>
          <div className="mt-2.5 flex gap-1.5">
            {(["seg", "pt"] as const).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setPending([]);
                }}
                className={
                  "rounded-full border px-2.5 py-1.5 text-[11px] font-semibold " +
                  (mode === m ? "border-accent bg-accent text-accent-ink" : "bg-surface text-ink-2")
                }
              >
                {m === "seg" ? "Marcar tramo" : "Punto"}
              </button>
            ))}
          </div>

          <div
            ref={surfaceRef}
            onClick={tap}
            className="relative mt-2 select-none overflow-hidden rounded-[12px] border bg-white"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={plan.url ?? ""} alt={plan.name} className="block w-full" draggable={false} />
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {marks.map((m) => {
                const g = geomPoints(m);
                const c = colorOf(m.crew_id);
                return g.b ? (
                  <line
                    key={m.id}
                    x1={g.a.x * 100}
                    y1={g.a.y * 100}
                    x2={g.b.x * 100}
                    y2={g.b.y * 100}
                    stroke={c}
                    strokeWidth={4}
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                ) : (
                  <circle key={m.id} cx={g.a.x * 100} cy={g.a.y * 100} r={1.3} fill={c} />
                );
              })}
              {pending.length === 2 && (
                <line
                  x1={pending[0].x * 100}
                  y1={pending[0].y * 100}
                  x2={pending[1].x * 100}
                  y2={pending[1].y * 100}
                  stroke="#e8590c"
                  strokeWidth={4}
                  strokeDasharray="4 3"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              )}
            </svg>
            {pending.map((p, i) => (
              <span
                key={i}
                className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-accent shadow"
                style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%` }}
              />
            ))}
          </div>

          {!complete && (
            <div className="mt-2 flex items-center gap-2 rounded-[8px] bg-[var(--chip)] px-2.5 py-2 text-[11.5px] font-semibold text-accent">
              {mode === "seg"
                ? pending.length === 0
                  ? "Toca el inicio del tramo construido"
                  : "Toca el final del tramo"
                : "Toca el punto (handhole, empalme…)"}
            </div>
          )}

          {complete && (
            <form action={formAction} className="mt-2 space-y-2 rounded-[12px] border bg-surface p-3 shadow-[var(--shadow-1)]">
              <input type="hidden" name="planId" value={plan.id} />
              <input type="hidden" name="kind" value={mode} />
              <input type="hidden" name="geom" value={geomJson} />
              <input type="hidden" name="activity" value={activity} />
              <input type="hidden" name="crewId" value={crewId} />
              <input type="hidden" name="qty" value={mode === "seg" ? feet.replace(/[^\d.]/g, "") || "0" : "0"} />

              <div className="font-display text-[13px] font-semibold">
                {mode === "seg" ? "¿Qué se hizo en ese tramo?" : "¿Qué es este punto?"}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {PLAN_ACTIVITIES.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setActivity(a)}
                    className={
                      "rounded-full border px-2.5 py-1.5 text-[12px] font-semibold " +
                      (activity === a ? "border-accent bg-accent text-accent-ink" : "bg-surface text-ink-2")
                    }
                  >
                    {a}
                  </button>
                ))}
              </div>

              {mode === "seg" && (
                <label className="block">
                  <span className="text-[11px] font-semibold text-ink-2">Pies construidos</span>
                  <input
                    inputMode="numeric"
                    value={feet}
                    onChange={(e) => setFeet(e.target.value)}
                    placeholder="0"
                    className="mt-1 w-full rounded-[10px] border bg-surface px-3 py-2 font-mono text-[14px] font-semibold outline-none placeholder:text-ink-3"
                  />
                </label>
              )}

              <label className="block">
                <span className="text-[11px] font-semibold text-ink-2">Cuadrilla</span>
                <select
                  value={crewId}
                  onChange={(e) => setCrewId(e.target.value)}
                  className="mt-1 w-full rounded-[10px] border bg-surface px-3 py-2 text-[13px] outline-none"
                >
                  <option value="">Sin asignar</option>
                  {crews.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>

              {state.error && <p className="text-[11px] text-[var(--crit)]">{state.error}</p>}

              <div className="flex gap-2 pt-0.5">
                <button
                  type="submit"
                  className="h-9 rounded-btn bg-accent px-3 text-[12px] font-bold text-accent-ink"
                >
                  Guardar marca
                </button>
                <button
                  type="button"
                  onClick={() => setPending([])}
                  className="h-9 px-3 text-[12px] font-semibold text-ink-3"
                >
                  Volver a marcar
                </button>
              </div>
            </form>
          )}
        </>
      )}

      {marks.length > 0 && (
        <>
          <p className="mx-0.5 mb-2 mt-5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.1em] text-ink-3">
            Marcas de producción
          </p>
          <div className="overflow-hidden rounded-[12px] border bg-surface shadow-[var(--shadow-1)]">
            {marks.map((m) => {
              const crew = crews.find((c) => c.id === m.crew_id);
              return (
                <div key={m.id} className="flex items-center gap-2.5 border-b px-3 py-2.5 text-[11.5px] last:border-b-0">
                  <span
                    className="h-2.5 w-2.5 flex-none rounded-[3px]"
                    style={{ background: colorOf(m.crew_id) }}
                  />
                  <div className="min-w-0">
                    <div className="font-semibold">
                      {m.kind === "seg" ? `${nf.format(m.qty)} ft · ${m.activity}` : m.activity}
                    </div>
                    <div className="text-[10px] text-ink-2">{crew ? crew.name : "Sin cuadrilla"}</div>
                  </div>
                  <form action={deletePlanMark} className="ml-auto flex-none">
                    <input type="hidden" name="id" value={m.id} />
                    <input type="hidden" name="planId" value={plan.id} />
                    <button
                      type="submit"
                      aria-label="Eliminar marca"
                      className="grid h-7 w-7 place-items-center rounded-[7px] text-ink-3 hover:text-[var(--crit)]"
                    >
                      <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                    </button>
                  </form>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
