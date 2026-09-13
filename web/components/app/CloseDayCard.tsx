"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, Flame } from "lucide-react";
import { closeDailyReport, type CloseDayState } from "@/lib/data/actions";
import type { TodayRecap, TodayStatus } from "@/lib/data/types";

const initial: CloseDayState = { error: null };
const nf = new Intl.NumberFormat("en-US");

export default function CloseDayCard({
  projectId,
  status,
  recap,
}: {
  projectId: string;
  status: TodayStatus;
  recap: TodayRecap;
}) {
  const t = useTranslations("dailyReport");
  const [state, formAction, pending] = useActionState(closeDailyReport, initial);
  const [note, setNote] = useState("");

  if (status.closedToday) {
    return (
      <div className="mt-3 flex items-center gap-2.5 rounded-[12px] border bg-surface p-3 shadow-[var(--shadow-1)]">
        <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-[color-mix(in_oklab,var(--accent-2)_16%,transparent)] text-accent-2">
          <CheckCircle2 className="h-5 w-5" strokeWidth={2.2} />
        </span>
        <div className="min-w-0">
          <div className="text-[13px] font-semibold">{t("closedToday")}</div>
          <div className="mt-0.5 flex items-center gap-1 text-[11px] text-ink-2">
            <Flame className="h-3.5 w-3.5 text-warn" strokeWidth={2.2} />
            {t("streak", { count: status.streak })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="mt-3 space-y-2.5 rounded-[12px] border bg-surface p-3 shadow-[var(--shadow-1)]"
    >
      <input type="hidden" name="projectId" value={projectId} />
      <div className="flex items-center justify-between gap-2">
        <div className="text-[13px] font-semibold">{t("title")}</div>
        {status.streak > 0 && (
          <span className="flex flex-none items-center gap-1 font-mono text-[11px] font-semibold text-warn">
            <Flame className="h-3.5 w-3.5" strokeWidth={2.2} /> {t("streakShort", { count: status.streak })}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-ink-2">
        <span>
          <b className="font-mono font-semibold text-ink">{nf.format(recap.ftMarked)}</b> {t("recap.ft")}
        </span>
        <span>
          <b className="font-mono font-semibold text-ink">{recap.markCount}</b> {t("recap.marks")}
        </span>
        <span>
          <b className="font-mono font-semibold text-ink">{recap.photoCount}</b> {t("recap.photos")}
        </span>
      </div>
      <input
        name="note"
        value={note}
        onChange={(e) => setNote(e.target.value.slice(0, 140))}
        placeholder={t("notePlaceholder")}
        className="w-full rounded-[10px] border bg-bg px-3 py-2 text-[12.5px] outline-none placeholder:text-ink-3"
      />
      {state.error && <p className="text-[11px] text-[var(--crit)]">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="h-9 w-full rounded-btn bg-accent text-[12.5px] font-bold text-accent-ink disabled:opacity-50"
      >
        {pending ? t("closing") : t("cta")}
      </button>
    </form>
  );
}
