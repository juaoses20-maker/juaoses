"use client";

import { useActionState, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ExternalLink, Hexagon, Pencil, Plus, Trash2, TriangleAlert } from "lucide-react";
import { Btn } from "@/components/site/ui";
import { createTicket, updateTicket, deleteTicket } from "@/lib/data/actions";
import { isoPlusDays, ticketStatus, type Ticket811, type TicketFormState, type TicketStatus } from "@/lib/data/types";

const initial: TicketFormState = { error: null };

const STRIPE: Record<TicketStatus, string> = {
  activo: "border-l-accent-2",
  "por-vencer": "border-l-warn",
  vencido: "border-l-crit",
  cerrado: "border-l-line",
};
const PILL: Record<TicketStatus, string> = {
  activo: "bg-[color-mix(in_oklab,var(--accent-2)_16%,transparent)] text-accent-2",
  "por-vencer": "bg-[color-mix(in_oklab,var(--warn)_15%,transparent)] text-warn",
  vencido: "bg-[color-mix(in_oklab,var(--crit)_13%,transparent)] text-crit",
  cerrado: "bg-surface-2 text-ink-3",
};

function Field({
  name,
  label,
  type = "text",
  defaultValue,
  placeholder,
  required,
}: {
  name: string;
  label: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold text-ink-2">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-1 w-full rounded-[10px] border bg-surface px-3 py-2 text-[13px] outline-none placeholder:text-ink-3"
      />
    </label>
  );
}

function TicketForm({
  projectId,
  ticket,
  onDone,
}: {
  projectId: string;
  ticket?: Ticket811;
  onDone: () => void;
}) {
  const t = useTranslations("tickets");
  const tc = useTranslations("common");
  const [state, action, pending] = useActionState(ticket ? updateTicket : createTicket, initial);
  useEffect(() => {
    if (state.ok) onDone();
  }, [state.ok, onDone]);

  return (
    <form action={action} className="space-y-2">
      {ticket ? (
        <input type="hidden" name="id" value={ticket.id} />
      ) : (
        <input type="hidden" name="projectId" value={projectId} />
      )}
      <Field name="number" label={t("form.number")} defaultValue={ticket?.number} placeholder={t("form.numberPlaceholder")} required />
      <Field name="location" label={t("form.location")} defaultValue={ticket?.location ?? ""} placeholder={t("form.locationPlaceholder")} />
      <div className="grid grid-cols-2 gap-2">
        <Field
          name="dig_start"
          label={t("form.digStart")}
          type="date"
          defaultValue={ticket?.dig_start ?? isoPlusDays(0)}
        />
        <Field
          name="expiration"
          label={t("form.expiration")}
          type="date"
          defaultValue={ticket?.expiration ?? isoPlusDays(21)}
        />
      </div>
      <p className="text-[10px] text-ink-3">{t("form.expirationHint")}</p>
      <Field
        name="plan_page"
        label={t("form.planPage")}
        defaultValue={ticket?.plan_page ?? ""}
        placeholder={t("form.planPagePlaceholder")}
      />
      {ticket && (
        <label className="flex items-center gap-2 text-[12px] font-semibold text-ink-2">
          <input type="checkbox" name="closed" defaultChecked={ticket.status_manual === "cerrado"} />
          {t("form.closed")}
        </label>
      )}
      {state.error && <p className="text-[11px] text-[var(--crit)]">{state.error}</p>}
      <div className="flex gap-2 pt-0.5">
        <button
          type="submit"
          disabled={pending}
          className="h-9 rounded-btn bg-accent px-3 text-[12px] font-bold text-accent-ink disabled:opacity-50"
        >
          {pending ? tc("saving") : ticket ? tc("save") : t("form.save")}
        </button>
        <button type="button" onClick={onDone} className="h-9 px-3 text-[12px] font-semibold text-ink-3">
          {tc("cancel")}
        </button>
      </div>
    </form>
  );
}

export default function TicketsUI({
  projectId,
  projectName,
  tickets,
}: {
  projectId: string;
  projectName: string;
  tickets: Ticket811[];
}) {
  const t = useTranslations("tickets");
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const withStatus = tickets.map((tk) => ({ tk, s: ticketStatus(tk) }));
  const atRisk = withStatus.filter((x) => x.s.status === "por-vencer" || x.s.status === "vencido").length;

  return (
    <div className="relative">
      <div className="mt-2 flex flex-col">
        <h1 className="font-display text-[16px] font-semibold">{t("title")}</h1>
        <p className="text-[10px] text-ink-3">
          {tickets.length === 0 ? projectName : t("subtitle", { count: tickets.length, project: projectName })}
        </p>
      </div>

      {atRisk > 0 && (
        <div className="my-2 flex items-start gap-2 rounded-[12px] bg-[color-mix(in_oklab,var(--warn)_14%,transparent)] px-2.5 py-2.5 text-[11px] text-warn">
          <TriangleAlert className="h-4 w-4 flex-none" strokeWidth={2.2} />
          <span>{t("atRisk", { count: atRisk })}</span>
        </div>
      )}

      {tickets.length === 0 && !creating && (
        <div className="mt-8 grid place-items-center py-12 text-center">
          <div>
            <Hexagon className="mx-auto h-9 w-9 text-ink-3" strokeWidth={1.5} />
            <div className="mt-2.5 font-display text-[15px] font-semibold">{t("empty.title")}</div>
            <p className="mx-auto mt-1.5 max-w-[28ch] text-[11.5px] text-ink-2">{t("empty.body")}</p>
            <button
              onClick={() => setCreating(true)}
              className="mt-3.5 inline-flex h-[38px] items-center gap-1.5 rounded-btn bg-accent px-4 text-[12px] font-bold text-accent-ink"
            >
              <Plus className="h-4 w-4" strokeWidth={2.6} /> {t("new")}
            </button>
          </div>
        </div>
      )}

      <div className="mt-2 overflow-hidden rounded-[12px] border bg-surface shadow-[var(--shadow-1)] empty:hidden">
        {withStatus.map(({ tk, s }) =>
          editing === tk.id ? (
            <div key={tk.id} className="border-b p-3 last:border-b-0">
              <TicketForm projectId={projectId} ticket={tk} onDone={() => setEditing(null)} />
            </div>
          ) : (
            <div
              key={tk.id}
              className={"flex flex-col gap-0.5 border-b border-l-[3px] px-3 py-2.5 last:border-b-0 " + STRIPE[s.status]}
            >
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[12px] font-semibold">#{tk.number}</span>
                <span className={"ml-auto rounded-full px-2 py-0.5 font-mono text-[8.5px] font-semibold " + PILL[s.status]}>
                  {t(`status.${s.status}`)}
                </span>
                <button
                  onClick={() => setEditing(tk.id)}
                  className="grid h-6 w-6 place-items-center rounded-[6px] text-ink-3 hover:text-ink"
                  aria-label={t("editAria")}
                >
                  <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
                <form action={deleteTicket}>
                  <input type="hidden" name="id" value={tk.id} />
                  <button
                    type="submit"
                    className="grid h-6 w-6 place-items-center rounded-[6px] text-ink-3 hover:text-[var(--crit)]"
                    aria-label={t("deleteAria")}
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                  </button>
                </form>
              </div>
              {tk.location && <div className="text-[11px] font-medium">{tk.location}</div>}
              <div className="flex flex-wrap gap-2 text-[9.5px] text-ink-2">
                {tk.dig_start && <span>{t("startedOn", { date: tk.dig_start })}</span>}
                {tk.expiration && <span>{t("expiresOn", { date: tk.expiration })}</span>}
                {tk.plan_page && <span>{t("planPage", { page: tk.plan_page })}</span>}
                {s.daysLeft !== null && s.status !== "cerrado" && (
                  <span>
                    {s.daysLeft < 0
                      ? t("daysAgo", { days: -s.daysLeft })
                      : t("daysLeft", { days: s.daysLeft })}
                  </span>
                )}
              </div>
              {s.status !== "cerrado" && (
                <a
                  href="https://ky.itic.occinc.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 self-start rounded-full border [border-color:color-mix(in_oklab,var(--accent)_30%,transparent)] px-2.5 py-1 text-[10px] font-semibold text-accent"
                >
                  <ExternalLink className="h-3 w-3" strokeWidth={2.4} /> {t("renew")}
                </a>
              )}
            </div>
          ),
        )}
      </div>

      {creating && (
        <div className="mt-2 rounded-[12px] border bg-surface p-3 shadow-[var(--shadow-1)]">
          <div className="mb-2 font-display text-[13px] font-semibold">{t("newTitle")}</div>
          <TicketForm projectId={projectId} onDone={() => setCreating(false)} />
        </div>
      )}

      {!creating && tickets.length > 0 && (
        <Btn className="mt-3" onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" strokeWidth={2.6} /> {t("new")}
        </Btn>
      )}

      <p className="mt-3 rounded-[10px] border border-dashed bg-surface px-3 py-2 text-[10px] leading-relaxed text-ink-3">
        {t("disclaimer")}
      </p>
    </div>
  );
}
