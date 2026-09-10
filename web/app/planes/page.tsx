"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { Btn, TopBar } from "@/components/site/ui";

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

export default function PlanesPage() {
  const [page, setPage] = useState(1);

  return (
    <main className="flex min-h-dvh flex-col bg-bg text-ink">
      <div className="mx-auto flex w-full max-w-[460px] flex-1 flex-col px-5 pb-8 pt-[max(14px,env(safe-area-inset-top))]">
        <TopBar onClose={page > 1 ? () => setPage((p) => p - 1) : undefined} href={page === 1 ? "/probar" : undefined} />

        {/* PAGE 1 — recap */}
        {page === 1 && (
          <div className="flex flex-1 flex-col">
            <h1 className="mt-6 text-[24px] font-semibold">Guarda esta prueba. Suma toda tu obra.</h1>
            <p className="mt-2 text-[13px] text-ink-2">
              Ya armaste una. En EA Fiber Track cada tramo, cada cuadrilla y cada ticket 811 quedan juntos — en un toque.
            </p>

            <div className="mt-3.5 rounded-[12px] border bg-surface p-3 text-[12px] text-ink-2">
              Tu primera Prueba de Campo: <b className="font-semibold text-ink">1 850 ft · HDD Bore</b> · STA 12+00→30+50 · 811 #2024-2210455
            </div>

            <div className="mt-4 flex flex-col gap-2.5">
              <Feat>Planos, fotos GPS, 811 y cuadrillas — sin límite de personas</Feat>
              <Feat>El día de hoy: pies por cuadrilla, sin llamar a nadie</Feat>
              <Feat>Alertas antes de que venza un ticket 811</Feat>
            </div>

            <div className="mt-auto pt-6">
              <Btn onClick={() => setPage(2)}>Ver mi prueba gratis</Btn>
              <Link href="/" className="mt-3 block text-center text-[12px] font-semibold text-ink-3">
                Ahora no
              </Link>
            </div>
          </div>
        )}

        {/* PAGE 2 — trial timeline */}
        {page === 2 && (
          <div className="flex flex-1 flex-col">
            <h1 className="mt-6 text-[24px] font-semibold">14 días gratis. Sin sorpresas.</h1>
            <p className="mt-2 text-[13px] text-ink-2">
              Pruébalo un contrato entero. Te avisamos antes de cualquier cobro.
            </p>

            <div className="mt-4 flex flex-col">
              {[
                { on: true, t: "Hoy — empiezas gratis", s: "Acceso completo. Sin cargo." },
                { on: false, t: "Día 12 — te escribimos", s: "“Tu prueba termina en 2 días.”" },
                { on: false, t: "Día 14 — se cobra el plan", s: "Solo si no cancelaste. Un correo lo cancela." },
              ].map((r, i, arr) => (
                <div key={r.t} className="grid grid-cols-[16px_1fr] gap-2.5 pb-3.5">
                  <div className="relative flex flex-col items-center">
                    <span
                      className={
                        "mt-0.5 h-2.5 w-2.5 rounded-full border-2 " +
                        (r.on ? "border-accent bg-accent" : "border-line bg-surface-2")
                      }
                    />
                    {i < arr.length - 1 && <span className="mt-0.5 w-px flex-1 bg-line" />}
                  </div>
                  <div>
                    <div className="text-[12.5px] font-semibold">{r.t}</div>
                    <div className="mt-0.5 text-[10.5px] text-ink-3">{r.s}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-6">
              <Btn onClick={() => setPage(3)}>Ver los planes</Btn>
              <Link href="/" className="mt-3 block text-center text-[12px] font-semibold text-ink-3">
                Ahora no
              </Link>
            </div>
          </div>
        )}

        {/* PAGE 3 — price */}
        {page === 3 && (
          <div className="flex flex-1 flex-col">
            <h1 className="mt-6 text-[24px] font-semibold">
              Un precio. <span className="text-accent">Sin letra chica.</span>
            </h1>

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

            <div className="mt-auto pt-6">
              <Btn href="/entrar">
                Empezar mis 14 días gratis <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
              </Btn>
              <p className="mt-2.5 text-center font-mono text-[10px] text-ink-3">
                No se cobra hoy · cancela con un correo · pago por Stripe
              </p>
              <Link href="/" className="mt-2 block text-center text-[12px] font-semibold text-ink-3">
                Ahora no — seguir mirando
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
