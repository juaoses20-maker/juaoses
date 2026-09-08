"use client";

import { useActionState, useEffect, useState } from "react";
import { Pencil, Plus, Trash2, Users } from "lucide-react";
import { Btn } from "@/components/site/ui";
import { createCrew, updateCrew, deleteCrew } from "@/lib/data/actions";
import type { Crew, CrewFormState } from "@/lib/data/types";

const initial: CrewFormState = { error: null };

function Field({
  name,
  label,
  defaultValue,
  placeholder,
  type = "text",
  required,
}: {
  name: string;
  label: string;
  defaultValue?: string | number;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold text-ink-2">{label}</span>
      <input
        name={name}
        type={type}
        inputMode={type === "number" ? "numeric" : undefined}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-1 w-full rounded-[10px] border bg-surface px-3 py-2 text-[13px] outline-none placeholder:text-ink-3"
      />
    </label>
  );
}

function CrewForm({
  projectId,
  crew,
  onDone,
}: {
  projectId: string;
  crew?: Crew;
  onDone: () => void;
}) {
  const [state, action, pending] = useActionState(crew ? updateCrew : createCrew, initial);

  useEffect(() => {
    if (state.ok) onDone();
  }, [state.ok, onDone]);

  return (
    <form action={action} className="space-y-2">
      {crew ? (
        <input type="hidden" name="id" value={crew.id} />
      ) : (
        <input type="hidden" name="projectId" value={projectId} />
      )}
      <Field name="name" label="Nombre" defaultValue={crew?.name} placeholder="Ej. Cuadrilla A — Bore" required />
      <Field name="foreman" label="Capataz" defaultValue={crew?.foreman ?? ""} placeholder="Ej. Miguel Santos" />
      <Field name="people" label="Personas" type="number" defaultValue={crew?.people ?? 0} />
      <Field
        name="equipment"
        label="Equipo (separado por comas)"
        defaultValue={crew?.equipment.join(", ") ?? ""}
        placeholder="Ej. Vermeer D24x40, Vac-Tron"
      />
      {state.error && <p className="text-[11px] text-[var(--crit)]">{state.error}</p>}
      <div className="flex gap-2 pt-0.5">
        <button
          type="submit"
          disabled={pending}
          className="h-9 rounded-btn bg-accent px-3 text-[12px] font-bold text-accent-ink disabled:opacity-50"
        >
          {pending ? "Guardando…" : crew ? "Guardar" : "Crear cuadrilla"}
        </button>
        <button type="button" onClick={onDone} className="h-9 px-3 text-[12px] font-semibold text-ink-3">
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default function CuadrillasUI({
  projectId,
  projectName,
  crews,
}: {
  projectId: string;
  projectName: string;
  crews: Crew[];
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div className="relative">
      <h1 className="mt-2 font-display text-[16px] font-semibold">Cuadrillas</h1>
      <p className="text-[10px] text-ink-3">
        {crews.length === 0
          ? projectName
          : `${crews.length} ${crews.length === 1 ? "cuadrilla" : "cuadrillas"} · ${projectName}`}
      </p>

      {crews.length === 0 && !creating && (
        <div className="mt-8 grid place-items-center py-12 text-center">
          <div>
            <Users className="mx-auto h-9 w-9 text-ink-3" strokeWidth={1.5} />
            <div className="mt-2.5 font-display text-[15px] font-semibold">Agrega tu primera cuadrilla</div>
            <p className="mx-auto mt-1.5 max-w-[26ch] text-[11.5px] text-ink-2">
              Capataz, gente y equipo. Después les asignas producción sobre el plano.
            </p>
            <button
              onClick={() => setCreating(true)}
              className="mt-3.5 inline-flex h-[38px] items-center gap-1.5 rounded-btn bg-accent px-4 text-[12px] font-bold text-accent-ink"
            >
              <Plus className="h-4 w-4" strokeWidth={2.6} /> Nueva cuadrilla
            </button>
          </div>
        </div>
      )}

      <div className="mt-2 flex flex-col gap-2">
        {crews.map((c) =>
          editing === c.id ? (
            <div key={c.id} className="rounded-[12px] border bg-surface p-3 shadow-[var(--shadow-1)]">
              <CrewForm projectId={projectId} crew={c} onDone={() => setEditing(null)} />
            </div>
          ) : (
            <div key={c.id} className="rounded-[12px] border bg-surface p-3 shadow-[var(--shadow-1)]">
              <div className="flex items-center gap-2">
                <span className="h-[11px] w-[11px] flex-none rounded-[3px]" style={{ background: c.color }} />
                <h3 className="font-display text-[13px] font-semibold">{c.name}</h3>
                <button
                  onClick={() => setEditing(c.id)}
                  className="ml-auto grid h-7 w-7 place-items-center rounded-[7px] text-ink-3 hover:text-ink"
                  aria-label="Editar cuadrilla"
                >
                  <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
                <form action={deleteCrew}>
                  <input type="hidden" name="id" value={c.id} />
                  <button
                    type="submit"
                    className="grid h-7 w-7 place-items-center rounded-[7px] text-ink-3 hover:text-[var(--crit)]"
                    aria-label="Eliminar cuadrilla"
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                  </button>
                </form>
              </div>
              <div className="mt-1 text-[10.5px] text-ink-2">
                {c.foreman ? `Capataz ${c.foreman} · ` : ""}
                {c.people} {c.people === 1 ? "persona" : "personas"}
              </div>
              {c.equipment.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {c.equipment.map((e) => (
                    <span
                      key={e}
                      className="rounded-full border bg-surface-2 px-1.5 py-0.5 text-[9px] font-semibold text-ink-2"
                    >
                      {e}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ),
        )}
      </div>

      {creating && (
        <div className="mt-2 rounded-[12px] border bg-surface p-3 shadow-[var(--shadow-1)]">
          <div className="mb-2 font-display text-[13px] font-semibold">Nueva cuadrilla</div>
          <CrewForm projectId={projectId} onDone={() => setCreating(false)} />
        </div>
      )}

      {!creating && crews.length > 0 && (
        <Btn className="mt-3" onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" strokeWidth={2.6} /> Nueva cuadrilla
        </Btn>
      )}
    </div>
  );
}
