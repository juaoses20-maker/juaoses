"use client";

import { useRef, useState } from "react";
import { Check, MapPin, Camera, Upload } from "lucide-react";
import { Btn, Progress, TopBar, ArrowRight } from "@/components/site/ui";

type Step = "upload" | "mark" | "detail" | "done";
type Pt = { x: number; y: number };

const ACTIVITIES = ["HDD Bore", "Zanja", "Tendido fibra"] as const;

export default function ProbarPage() {
  const [step, setStep] = useState<Step>("upload");
  const [pts, setPts] = useState<Pt[]>([]);
  const [activity, setActivity] = useState<(typeof ACTIVITIES)[number]>("HDD Bore");
  const [feet, setFeet] = useState("1 850");
  const [ticket, setTicket] = useState("2024-2210455");
  const [photo, setPhoto] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const pct = { upload: 33, mark: 66, detail: 100, done: 100 }[step];

  function tapPlan(e: React.MouseEvent<SVGSVGElement>) {
    if (pts.length >= 2) return;
    const svg = svgRef.current;
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 280;
    const y = ((e.clientY - r.top) / r.height) * 150;
    setPts((p) => [...p, { x: Math.round(x), y: Math.round(y) }]);
  }

  return (
    <main className="flex min-h-dvh flex-col bg-bg text-ink">
      <div className="mx-auto flex w-full max-w-[460px] flex-1 flex-col px-5 pb-6 pt-[max(14px,env(safe-area-inset-top))]">
        {step !== "done" && (
          <>
            <TopBar href="/" />
            <Progress pct={pct} />
          </>
        )}

        {/* STEP 1 — upload */}
        {step === "upload" && (
          <div className="flex flex-1 flex-col">
            <h1 className="mt-6 text-[24px] font-semibold">Prueba con tu plano. Sin crear cuenta.</h1>
            <p className="mt-2 text-[13px] text-ink-2">
              Sube el plano del tramo que ya construiste — PDF o foto. En 3 pasos ves tu primera prueba lista para mandar.
            </p>

            <button
              onClick={() => fileRef.current?.click()}
              className="mt-5 rounded-card border-[1.5px] border-dashed [border-color:color-mix(in_oklab,var(--accent)_40%,var(--line))] bg-surface px-4 py-7 text-center"
            >
              <Upload className="mx-auto mb-2 h-8 w-8 text-accent" strokeWidth={1.7} />
              <div className="text-[13px] font-semibold">Subir plano</div>
              <div className="mt-0.5 text-[11px] text-ink-3">PDF o foto, hasta 20 MB</div>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={() => setStep("mark")}
            />

            <div className="my-3 flex items-center gap-2 text-[11px] text-ink-3 before:h-px before:flex-1 before:bg-line after:h-px after:flex-1 after:bg-line">
              o
            </div>
            <Btn variant="ghost" onClick={() => setStep("mark")}>
              Usar un plano de ejemplo
            </Btn>
            <p className="mt-auto pt-6 text-center font-mono text-[11px] text-ink-3">
              Louisville, KY · el 811 de Kentucky
            </p>
          </div>
        )}

        {/* STEP 2 — mark */}
        {step === "mark" && (
          <div className="flex flex-1 flex-col">
            <h1 className="mt-6 text-[24px] font-semibold">Toca el tramo que construiste.</h1>
            <p className="mt-2 text-[13px] text-ink-2">Un toque en el inicio, otro en el final. Sobre el plano.</p>

            <div className="mt-4 overflow-hidden rounded-[12px] border bg-white">
              <svg
                ref={svgRef}
                viewBox="0 0 280 150"
                className="block w-full cursor-crosshair select-none"
                onClick={tapPlan}
              >
                <rect width="280" height="150" fill="#fff" />
                <g stroke="#ece4d7" strokeWidth="1">
                  <path d="M0 44H280M0 88H280M0 118H280M66 0V150M150 0V150M214 0V150" />
                </g>
                <text x="14" y="20" fontFamily="monospace" fontSize="8" fill="#8d8271">
                  SHEET C-3 · E COLFAX AVE
                </text>
                <path d="M18 74H262" stroke="#cbb9a3" strokeWidth="2" strokeDasharray="6 4" />
                <text x="18" y="64" fontFamily="monospace" fontSize="8.5" fill="#8d8271">
                  ruta propuesta · 2x2 pulg HDPE
                </text>
                {pts[0] && pts[1] && (
                  <>
                    <line
                      x1={pts[0].x}
                      y1={pts[0].y}
                      x2={pts[1].x}
                      y2={pts[1].y}
                      stroke="#e8590c"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                    <text
                      x={(pts[0].x + pts[1].x) / 2}
                      y={Math.min(pts[0].y, pts[1].y) - 8}
                      fontFamily="monospace"
                      fontSize="9"
                      fill="#e8590c"
                      textAnchor="middle"
                    >
                      {feet} ft
                    </text>
                  </>
                )}
                {pts.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r="5" fill="#e8590c" stroke="#fff" strokeWidth="1.5" />
                ))}
              </svg>
            </div>

            <div className="mt-2.5 flex items-center gap-2 rounded-[8px] bg-[var(--chip)] px-2.5 py-2 text-[11.5px] font-semibold text-accent">
              <MapPin className="h-3.5 w-3.5 flex-none" strokeWidth={2.4} />
              {pts.length === 0
                ? "Toca el inicio del tramo construido"
                : pts.length === 1
                  ? "Toca el final del tramo"
                  : "Tramo marcado · toca “Continuar”"}
            </div>

            <div className="mt-auto flex flex-col gap-2 pt-6">
              {pts.length > 0 && (
                <button
                  onClick={() => setPts([])}
                  className="self-center text-[12px] font-semibold text-ink-3 underline underline-offset-2"
                >
                  Volver a marcar
                </button>
              )}
              <Btn onClick={() => setStep("detail")} disabled={pts.length < 2}>
                Continuar
              </Btn>
            </div>
          </div>
        )}

        {/* STEP 3 — detail */}
        {step === "detail" && (
          <div className="flex flex-1 flex-col">
            <h1 className="mt-6 text-[24px] font-semibold">¿Qué se hizo en ese tramo?</h1>

            <label className="mt-5 block font-mono text-[9.5px] font-semibold uppercase tracking-[0.05em] text-ink-3">
              Actividad
            </label>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {ACTIVITIES.map((a) => (
                <button
                  key={a}
                  onClick={() => setActivity(a)}
                  className={
                    "rounded-full border px-3 py-1.5 text-[12.5px] font-semibold " +
                    (activity === a ? "border-accent bg-accent text-accent-ink" : "bg-surface text-ink-2")
                  }
                >
                  {a}
                </button>
              ))}
            </div>

            <label className="mt-4 block font-mono text-[9.5px] font-semibold uppercase tracking-[0.05em] text-ink-3">
              Pies construidos
            </label>
            <div className="mt-1.5 flex items-center justify-between rounded-[10px] border bg-surface px-3 py-2.5">
              <input
                inputMode="numeric"
                value={feet}
                onChange={(e) => setFeet(e.target.value)}
                className="w-full bg-transparent font-mono text-[15px] font-semibold outline-none"
              />
              <span className="font-mono text-[13px] text-ink-3">ft</span>
            </div>

            <label className="mt-4 block font-mono text-[9.5px] font-semibold uppercase tracking-[0.05em] text-ink-3">
              Ticket 811 (opcional)
            </label>
            <input
              value={ticket}
              onChange={(e) => setTicket(e.target.value)}
              placeholder="2024-0000000"
              className="mt-1.5 w-full rounded-[10px] border bg-surface px-3 py-2.5 font-mono text-[13px] font-semibold text-warn outline-none placeholder:text-ink-3"
            />

            <button
              onClick={() => setPhoto((v) => !v)}
              className={
                "mt-3 flex items-center gap-2 rounded-[10px] border px-3 py-2.5 text-[12px] " +
                (photo ? "border-accent-2 text-accent-2" : "border-dashed text-ink-2")
              }
            >
              {photo ? (
                <Check className="h-4 w-4 flex-none" strokeWidth={3} />
              ) : (
                <Camera className="h-4 w-4 flex-none text-accent" strokeWidth={2} />
              )}
              {photo ? "Foto con GPS añadida" : "Añadir foto con GPS"}
            </button>

            <div className="mt-auto pt-6">
              <Btn onClick={() => setStep("done")}>Armar mi Prueba de Campo</Btn>
            </div>
          </div>
        )}

        {/* RESULT — first victory */}
        {step === "done" && (
          <div className="flex flex-1 flex-col">
            <TopBar />
            <div className="mt-2 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_oklab,var(--accent-2)_15%,transparent)] px-2.5 py-1 font-mono text-[10px] font-semibold text-accent-2">
                <Check className="h-3 w-3" strokeWidth={3} /> Tu primera Prueba de Campo
              </span>
            </div>

            <div
              className="mt-3.5 overflow-hidden rounded-[14px] border bg-[linear-gradient(180deg,#fff,var(--surface))] shadow-[var(--shadow-2)]"
              style={{ clipPath: "polygon(0 0,calc(100% - 20px) 0,100% 20px,100% 100%,0 100%)" }}
            >
              <div className="flex items-center gap-1.5 px-3 pt-3 font-mono text-[9px] font-semibold uppercase tracking-[0.06em] text-accent">
                <Check className="h-2.5 w-2.5" strokeWidth={2.8} /> La Prueba de Campo · Hoy
              </div>
              <div className="mx-3 mt-2 overflow-hidden rounded-[10px] border bg-white">
                <svg viewBox="0 0 280 90" className="block w-full">
                  <rect width="280" height="90" fill="#fff" />
                  <g stroke="#ece4d7" strokeWidth="1">
                    <path d="M0 30H280M0 60H280M70 0V90M160 0V90" />
                  </g>
                  <path d="M18 46H262" stroke="#cbb9a3" strokeWidth="2" strokeDasharray="6 4" />
                  <line
                    x1={pts[0]?.x ?? 18}
                    y1="46"
                    x2={pts[1]?.x ?? 170}
                    y2="46"
                    stroke="#e8590c"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  <circle cx={pts[0]?.x ?? 18} cy="46" r="4" fill="#e8590c" />
                  <circle cx={pts[1]?.x ?? 170} cy="46" r="4" fill="#e8590c" />
                </svg>
              </div>
              <div className="flex items-center gap-2.5 px-3 pb-1 pt-2.5">
                <span className="h-11 w-11 flex-none rounded-[9px] border" style={{ background: "#b45a1e" }} />
                <div>
                  <div className="relative pl-2 font-display text-[24px] font-bold leading-none tnum before:absolute before:left-0 before:top-0.5 before:bottom-0.5 before:w-0.5 before:rounded-sm before:bg-[linear-gradient(180deg,var(--accent),transparent)]">
                    {feet} <span className="font-body text-[11px] font-semibold text-ink-2">pies · {activity}</span>
                  </div>
                  <div className="mt-1 text-[10px] text-ink-2">Cuadrilla A · Hoy</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 px-3 pb-3 pt-1">
                <span className="rounded-full bg-surface-2 px-2 py-[3px] font-mono text-[9px] font-medium text-ink-2">
                  38.2542, −85.7585
                </span>
                {ticket && (
                  <span className="rounded-full bg-[color-mix(in_oklab,var(--warn)_15%,transparent)] px-2 py-[3px] font-mono text-[9px] font-medium text-warn">
                    811 #{ticket} · vence 3 d
                  </span>
                )}
                {photo && (
                  <span className="rounded-full bg-[color-mix(in_oklab,var(--accent-2)_16%,transparent)] px-2 py-[3px] font-mono text-[9px] font-medium text-accent-2">
                    Foto GPS
                  </span>
                )}
              </div>
            </div>

            <p className="mt-3 text-center text-[13px] text-ink-2">
              Esto es lo que mandas al cliente o a la utility — en 30 segundos.
            </p>

            <div className="mt-auto pt-6">
              <Btn href="/planes">
                Guardar y ver mi obra completa <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
              </Btn>
              <button
                onClick={() => {
                  setStep("mark");
                  setPts([]);
                }}
                className="mt-3 w-full text-center text-[12px] font-semibold text-ink-3"
              >
                Marcar otro tramo
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
