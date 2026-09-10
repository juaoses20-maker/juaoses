import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { BarChart3, Camera, MapPin, PencilRuler } from "lucide-react";
import {
  getActiveProject,
  listCrews,
  listPhotos,
  listPlans,
  listRecentMarks,
  listTickets,
} from "@/lib/data/queries";
import { ticketStatus } from "@/lib/data/types";
import NoProject from "@/components/app/NoProject";

const nf = new Intl.NumberFormat("en-US");

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mx-0.5 mb-2 mt-5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.1em] text-ink-3">
      {children}
    </p>
  );
}

export default async function HoyPage() {
  const t = await getTranslations("hoy");
  const project = await getActiveProject();
  if (!project) return <NoProject what="registros" />;

  const [crews, tickets, plans, marks, photos] = await Promise.all([
    listCrews(project.id),
    listTickets(project.id),
    listPlans(project.id),
    listRecentMarks(project.id, 6),
    listPhotos(project.id),
  ]);

  const atRisk = tickets.filter((t) => {
    const s = ticketStatus(t).status;
    return s === "por-vencer" || s === "vencido";
  }).length;
  const ftMarked = plans.reduce((s, p) => s + p.ft_marked, 0);
  const nothingYet = plans.length === 0 && tickets.length === 0 && crews.length === 0;

  return (
    <div>
      <h1 className="mt-2 text-[22px] font-semibold">{t("title")}</h1>
      <p className="text-[10px] text-ink-3">{project.name}</p>

      <div className="mt-3 grid grid-cols-3 gap-1.5">
        {[
          { k: nf.format(ftMarked), l: t("stats.ftMarked"), cls: "text-accent" },
          { k: String(atRisk), l: t("stats.ticketsAtRisk"), cls: atRisk > 0 ? "text-warn" : "" },
          {
            k: String(crews.length),
            l: crews.length === 1 ? t("stats.crew") : t("stats.crews"),
            cls: "",
          },
        ].map((s) => (
          <div key={s.l} className="rounded-[12px] border bg-surface p-2 shadow-[var(--shadow-1)]">
            <div className={"font-display text-[19px] font-bold leading-none tnum " + s.cls}>{s.k}</div>
            <div className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.03em] text-ink-3">{s.l}</div>
          </div>
        ))}
      </div>

      {nothingYet && (
        <div className="mt-4 rounded-[12px] border border-dashed bg-surface p-4 text-center">
          <PencilRuler className="mx-auto h-8 w-8 text-ink-3" strokeWidth={1.5} />
          <div className="mt-2 font-display text-[14px] font-semibold">{t("start.title")}</div>
          <p className="mx-auto mt-1 max-w-[30ch] text-[11.5px] text-ink-2">{t("start.body")}</p>
          <Link
            href="/app/planos"
            className="mt-3 inline-flex h-[36px] items-center rounded-btn bg-accent px-4 text-[12px] font-bold text-accent-ink"
          >
            {t("start.cta")}
          </Link>
        </div>
      )}

      {marks.length > 0 && (
        <>
          <Eyebrow>{t("recentMarks")}</Eyebrow>
          <div className="overflow-hidden rounded-[12px] border bg-surface shadow-[var(--shadow-1)]">
            {marks.map((m) => (
              <Link
                key={m.id}
                href={`/app/planos/${m.plan_id}`}
                className="flex items-center gap-2.5 border-b px-3 py-2.5 last:border-b-0"
              >
                <span className="grid h-[30px] w-[30px] flex-none place-items-center rounded-[9px] border bg-surface-2">
                  {m.kind === "seg" ? (
                    <BarChart3 className="h-[15px] w-[15px] text-accent" strokeWidth={2} />
                  ) : (
                    <MapPin className="h-[15px] w-[15px] text-accent" strokeWidth={2} />
                  )}
                </span>
                <div className="min-w-0">
                  <div className="truncate text-[12.5px] font-semibold">
                    {m.kind === "seg"
                      ? t("ftActivity", { ft: nf.format(m.qty), activity: m.activity })
                      : m.activity}
                  </div>
                  <div className="mt-0.5 truncate text-[10px] text-ink-2">{m.plan_name}</div>
                </div>
                <span className="ml-auto text-ink-3">›</span>
              </Link>
            ))}
          </div>
        </>
      )}

      {photos.length > 0 && (
        <>
          <Eyebrow>{t("recentPhotos")}</Eyebrow>
          <div className="grid grid-cols-4 gap-[5px]">
            {photos.slice(0, 8).map((p) =>
              p.url ? (
                <Link
                  key={p.id}
                  href="/app/fotos"
                  className="relative aspect-square overflow-hidden rounded-[8px] border bg-surface-2"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.url} alt="" className="h-full w-full object-cover" loading="lazy" />
                </Link>
              ) : null,
            )}
          </div>
        </>
      )}

      {!nothingYet && marks.length === 0 && photos.length === 0 && (
        <div className="mt-4 flex flex-col gap-2">
          <Link
            href="/app/planos"
            className="flex items-center gap-2 rounded-[12px] border bg-surface px-3 py-3 text-[12.5px] font-semibold shadow-[var(--shadow-1)]"
          >
            <PencilRuler className="h-4 w-4 text-accent" strokeWidth={2} /> {t("quick.mark")}
          </Link>
          <Link
            href="/app/fotos"
            className="flex items-center gap-2 rounded-[12px] border bg-surface px-3 py-3 text-[12.5px] font-semibold shadow-[var(--shadow-1)]"
          >
            <Camera className="h-4 w-4 text-accent" strokeWidth={2} /> {t("quick.photo")}
          </Link>
        </div>
      )}
    </div>
  );
}
