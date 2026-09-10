"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Pencil, Plus } from "lucide-react";
import { Btn } from "@/components/site/ui";
import { createProject, renameProject, setActiveProject } from "@/lib/data/actions";
import type { Project, ProjectFormState } from "@/lib/data/types";

const initial: ProjectFormState = { error: null };

function Field({
  name,
  label,
  defaultValue,
  placeholder,
  required,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold text-ink-2">{label}</span>
      <input
        name={name}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-1 w-full rounded-[10px] border bg-surface px-3 py-2 text-[13px] outline-none placeholder:text-ink-3"
      />
    </label>
  );
}

function EditForm({ project, onDone }: { project: Project; onDone: () => void }) {
  const t = useTranslations("projects");
  const tc = useTranslations("common");
  const [state, action, pending] = useActionState(renameProject, initial);
  return (
    <form action={action} className="mt-2 space-y-2 border-t pt-2.5">
      <input type="hidden" name="id" value={project.id} />
      <Field name="name" label={t("form.name")} defaultValue={project.name} required />
      <Field name="client" label={t("form.client")} defaultValue={project.client ?? ""} placeholder={t("form.clientPlaceholder")} />
      <Field name="location" label={t("form.location")} defaultValue={project.location ?? ""} placeholder={t("form.locationPlaceholder")} />
      {state.error && <p className="text-[11px] text-[var(--crit)]">{state.error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="h-9 rounded-btn bg-accent px-3 text-[12px] font-bold text-accent-ink disabled:opacity-50"
        >
          {pending ? tc("saving") : tc("save")}
        </button>
        <button type="button" onClick={onDone} className="h-9 px-3 text-[12px] font-semibold text-ink-3">
          {tc("close")}
        </button>
      </div>
    </form>
  );
}

export default function ProyectosUI({
  projects,
  activeId,
}: {
  projects: Project[];
  activeId: string | null;
}) {
  const t = useTranslations("projects");
  const tc = useTranslations("common");
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(projects.length === 0);
  const [createState, createAction, creatingPending] = useActionState(createProject, initial);

  return (
    <div>
      <h1 className="mt-2 font-display text-[16px] font-semibold">{t("title")}</h1>
      <p className="text-[10px] text-ink-3">
        {projects.length === 0 ? t("emptySubtitle") : t("subtitle", { count: projects.length })}
      </p>

      <div className="mt-3 flex flex-col gap-2">
        {projects.map((p) => {
          const active = p.id === activeId;
          return (
            <div
              key={p.id}
              className={
                "rounded-[12px] border bg-surface p-3 shadow-[var(--shadow-1)] " +
                (active ? "border-accent" : "")
              }
            >
              <div className="flex items-center gap-2">
                <h3 className="font-display text-[13px] font-semibold">{p.name}</h3>
                {active && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_oklab,var(--accent)_14%,transparent)] px-2 py-0.5 font-mono text-[8.5px] font-semibold text-accent">
                    <Check className="h-2.5 w-2.5" strokeWidth={3} /> {t("active")}
                  </span>
                )}
                <button
                  onClick={() => setEditing(editing === p.id ? null : p.id)}
                  className="ml-auto grid h-7 w-7 place-items-center rounded-[7px] text-ink-3 hover:text-ink"
                  aria-label={t("editAria")}
                >
                  <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
              </div>
              {(p.client || p.location) && (
                <div className="mt-0.5 text-[10.5px] text-ink-2">
                  {[p.client, p.location].filter(Boolean).join(" · ")}
                </div>
              )}

              {!active && editing !== p.id && (
                <form action={setActiveProject} className="mt-2">
                  <input type="hidden" name="id" value={p.id} />
                  <button
                    type="submit"
                    className="h-8 rounded-full border [border-color:color-mix(in_oklab,var(--accent)_30%,transparent)] px-3 text-[11px] font-semibold text-accent"
                  >
                    {t("use")}
                  </button>
                </form>
              )}

              {editing === p.id && <EditForm project={p} onDone={() => setEditing(null)} />}
            </div>
          );
        })}
      </div>

      {creating ? (
        <form
          action={createAction}
          className="mt-3 space-y-2 rounded-[12px] border bg-surface p-3 shadow-[var(--shadow-1)]"
        >
          <div className="font-display text-[13px] font-semibold">{t("new")}</div>
          <Field name="name" label={t("form.name")} placeholder={t("form.namePlaceholder")} required />
          <Field name="client" label={t("form.client")} placeholder={t("form.clientPlaceholder")} />
          <Field name="location" label={t("form.location")} placeholder={t("form.locationPlaceholder")} />
          {createState.error && <p className="text-[11px] text-[var(--crit)]">{createState.error}</p>}
          <div className="flex gap-2 pt-0.5">
            <Btn type="submit" disabled={creatingPending}>
              {creatingPending ? tc("creating") : t("createCta")}
            </Btn>
            {projects.length > 0 && (
              <button
                type="button"
                onClick={() => setCreating(false)}
                className="h-12 px-3 text-[12px] font-semibold text-ink-3"
              >
                {tc("cancel")}
              </button>
            )}
          </div>
        </form>
      ) : (
        <button
          onClick={() => setCreating(true)}
          className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-btn border border-dashed [border-color:color-mix(in_oklab,var(--accent)_40%,var(--line))] text-[13px] font-semibold text-accent"
        >
          <Plus className="h-4 w-4" strokeWidth={2.4} /> {t("new")}
        </button>
      )}
    </div>
  );
}
