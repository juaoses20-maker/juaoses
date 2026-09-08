"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FileText, PencilRuler, Plus, Trash2 } from "lucide-react";
import { savePlan, deletePlan, type PlanSaveState } from "@/lib/data/actions";
import { uploadPlan } from "@/lib/plan-upload";
import type { Plan } from "@/lib/data/types";

const initial: PlanSaveState = { error: null };
const nf = new Intl.NumberFormat("en-US");

export default function PlanosUI({
  companyId,
  projectId,
  projectName,
  plans,
}: {
  companyId: string;
  projectId: string;
  projectName: string;
  plans: Plan[];
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [state, formAction] = useActionState(savePlan, initial);
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (state.ok && state.planId) router.push(`/app/planos/${state.planId}`);
  }, [state.ok, state.planId, router]);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const name = (file.name.replace(/\.[^.]+$/, "") || "Plano").slice(0, 60);
    setUploading(true);
    setErr(null);
    try {
      const up = await uploadPlan(companyId, projectId, file);
      const fd = new FormData();
      fd.set("projectId", projectId);
      fd.set("storagePath", up.path);
      fd.set("name", name);
      if (up.width) fd.set("width", String(up.width));
      if (up.height) fd.set("height", String(up.height));
      startTransition(() => formAction(fd));
    } catch {
      setErr("No se pudo subir el plano. Revisa tu conexión e inténtalo de nuevo.");
    } finally {
      setUploading(false);
    }
  }

  const busy = uploading || isPending;

  return (
    <div className="relative">
      <div className="mt-2 flex flex-col">
        <h1 className="font-display text-[16px] font-semibold">Planos</h1>
        <p className="text-[10px] text-ink-3">
          {plans.length === 0
            ? projectName
            : `${plans.length} ${plans.length === 1 ? "plano" : "planos"} · ${projectName}`}
        </p>
      </div>

      {(err || state.error) && (
        <p className="mt-2 rounded-[10px] border border-[color:color-mix(in_oklab,var(--crit)_40%,transparent)] bg-[color:color-mix(in_oklab,var(--crit)_8%,transparent)] px-3 py-2 text-[12px] text-[var(--crit)]">
          {err ?? state.error}
        </p>
      )}

      {plans.length === 0 && !busy && (
        <div className="mt-8 grid place-items-center py-12 text-center">
          <div>
            <PencilRuler className="mx-auto h-9 w-9 text-ink-3" strokeWidth={1.5} />
            <div className="mt-2.5 font-display text-[15px] font-semibold">Sube tu primer plano</div>
            <p className="mx-auto mt-1.5 max-w-[26ch] text-[11.5px] text-ink-2">
              PDF o foto. Sobre una foto puedes marcar los tramos construidos.
            </p>
            <button
              onClick={() => fileRef.current?.click()}
              className="mt-3.5 inline-flex h-[38px] items-center gap-1.5 rounded-btn bg-accent px-4 text-[12px] font-bold text-accent-ink"
            >
              <Plus className="h-4 w-4" strokeWidth={2.6} /> Subir plano
            </button>
          </div>
        </div>
      )}

      {busy && (
        <div className="mt-3 flex items-center gap-2 rounded-[10px] border bg-surface px-3 py-2.5 text-[12px] text-ink-2">
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-line border-t-accent" />
          Subiendo plano…
        </div>
      )}

      <div className="mt-3 flex flex-col gap-2">
        {plans.map((p) => (
          <div key={p.id} className="flex gap-3 rounded-[12px] border bg-surface p-2.5 shadow-[var(--shadow-1)]">
            <Link
              href={`/app/planos/${p.id}`}
              className="grid h-16 w-16 flex-none place-items-center overflow-hidden rounded-[9px] border bg-white"
            >
              {p.is_pdf || !p.url ? (
                <FileText className="h-7 w-7 text-ink-3" strokeWidth={1.6} />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.url} alt="" className="h-full w-full object-cover" />
              )}
            </Link>
            <Link href={`/app/planos/${p.id}`} className="min-w-0 flex-1">
              <div className="truncate font-display text-[13px] font-semibold">{p.name}</div>
              <div className="mt-0.5 text-[10.5px] text-ink-2">
                {p.mark_count} {p.mark_count === 1 ? "marca" : "marcas"} · {nf.format(p.ft_marked)} ft marcados
              </div>
              {p.is_pdf && <div className="mt-0.5 font-mono text-[9px] text-ink-3">PDF</div>}
            </Link>
            <form action={deletePlan} className="flex-none self-start">
              <input type="hidden" name="id" value={p.id} />
              <input type="hidden" name="storagePath" value={p.storage_path} />
              <button
                type="submit"
                aria-label="Eliminar plano"
                className="grid h-7 w-7 place-items-center rounded-[7px] text-ink-3 hover:text-[var(--crit)]"
              >
                <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
            </form>
          </div>
        ))}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={onFile}
      />
      {plans.length > 0 && (
        <button
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          aria-label="Subir plano"
          className="fixed bottom-[76px] right-[calc(50%-230px+16px)] grid h-[46px] w-[46px] place-items-center rounded-full bg-[linear-gradient(180deg,color-mix(in_oklab,#fff_20%,var(--accent)),var(--accent))] text-accent-ink shadow-[0_10px_22px_color-mix(in_oklab,var(--accent)_38%,transparent)] disabled:opacity-50 max-[460px]:right-4"
        >
          <Plus className="h-[22px] w-[22px]" strokeWidth={2.6} />
        </button>
      )}
    </div>
  );
}
