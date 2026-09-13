"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { MessageCircle, Trash2, UserPlus, Users } from "lucide-react";
import { deleteInvite, inviteTeammate, removeTeamMember } from "@/lib/data/actions";
import type { InviteFormState, TeamInvite, TeamMember, TeamRole } from "@/lib/data/types";

const initial: InviteFormState = { error: null };

function shareUrl(email: string, t: (k: string, v?: Record<string, string>) => string) {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://juaoses.vercel.app";
  const msg = t("shareMessage", { url: `${origin}/entrar`, email });
  return `https://wa.me/?text=${encodeURIComponent(msg)}`;
}

function RoleBadge({ role, t }: { role: TeamRole; t: (k: string) => string }) {
  return (
    <span className="rounded-full bg-surface-2 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.04em] text-ink-2">
      {t(`role.${role}`)}
    </span>
  );
}

export default function EquipoUI({
  team,
  invites,
  myUserId,
  canManage,
}: {
  team: TeamMember[];
  invites: TeamInvite[];
  myUserId: string;
  myRole: TeamRole | null;
  canManage: boolean;
}) {
  const t = useTranslations("team");
  const [state, formAction, pending] = useActionState(inviteTeammate, initial);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"member" | "admin">("member");
  const [seenNonce, setSeenNonce] = useState<string | undefined>(undefined);

  if (state.nonce && state.nonce !== seenNonce) {
    setSeenNonce(state.nonce);
    setEmail("");
    setRole("member");
  }

  return (
    <div>
      <h1 className="mt-2 font-display text-[16px] font-semibold">{t("title")}</h1>
      <p className="text-[10px] text-ink-3">
        {t("subtitle", { count: team.length })}
      </p>

      {canManage && (
        <form action={formAction} className="mt-3 space-y-2 rounded-[12px] border bg-surface p-3 shadow-[var(--shadow-1)]">
          <div className="font-display text-[13px] font-semibold">{t("inviteTitle")}</div>
          <div className="flex gap-2">
            <input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("emailPlaceholder")}
              className="min-w-0 flex-1 rounded-[10px] border bg-bg px-3 py-2 text-[13px] outline-none placeholder:text-ink-3"
            />
            <select
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value === "admin" ? "admin" : "member")}
              className="flex-none rounded-[10px] border bg-bg px-2 py-2 text-[12px] outline-none"
            >
              <option value="member">{t("role.member")}</option>
              <option value="admin">{t("role.admin")}</option>
            </select>
          </div>
          {state.error && <p className="text-[11px] text-[var(--crit)]">{state.error}</p>}
          <button
            type="submit"
            disabled={pending || !email}
            className="inline-flex h-9 items-center gap-1.5 rounded-btn bg-accent px-3 text-[12px] font-bold text-accent-ink disabled:opacity-50"
          >
            <UserPlus className="h-3.5 w-3.5" strokeWidth={2.4} />
            {pending ? t("inviting") : t("invite")}
          </button>
        </form>
      )}

      {invites.length > 0 && (
        <>
          <p className="mx-0.5 mb-2 mt-5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.1em] text-ink-3">
            {t("pending")}
          </p>
          <div className="overflow-hidden rounded-[12px] border bg-surface shadow-[var(--shadow-1)]">
            {invites.map((i) => (
              <div key={i.id} className="flex items-center gap-2.5 border-b px-3 py-2.5 text-[12.5px] last:border-b-0">
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold">{i.email}</div>
                  <div className="mt-0.5">
                    <RoleBadge role={i.role} t={t} />
                  </div>
                </div>
                <a
                  href={shareUrl(i.email, (k, v) => t(k, v))}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("shareAria")}
                  className="grid h-8 w-8 flex-none place-items-center rounded-full text-accent hover:bg-[var(--chip)]"
                >
                  <MessageCircle className="h-4 w-4" strokeWidth={2.2} />
                </a>
                {canManage && (
                  <form action={deleteInvite} className="flex-none">
                    <input type="hidden" name="id" value={i.id} />
                    <button
                      type="submit"
                      aria-label={t("cancelInviteAria")}
                      className="grid h-8 w-8 place-items-center rounded-full text-ink-3 hover:text-[var(--crit)]"
                    >
                      <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                    </button>
                  </form>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      <p className="mx-0.5 mb-2 mt-5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.1em] text-ink-3">
        {t("members")}
      </p>
      {team.length === 0 ? (
        <div className="mt-2 grid place-items-center rounded-[12px] border border-dashed bg-surface py-8 text-center">
          <Users className="mx-auto h-8 w-8 text-ink-3" strokeWidth={1.5} />
        </div>
      ) : (
        <div className="overflow-hidden rounded-[12px] border bg-surface shadow-[var(--shadow-1)]">
          {team.map((m) => (
            <div key={m.userId} className="flex items-center gap-2.5 border-b px-3 py-2.5 text-[12.5px] last:border-b-0">
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold">
                  {m.userId === myUserId ? t("you") : (m.email ?? t("noEmail"))}
                </div>
                <div className="mt-0.5">
                  <RoleBadge role={m.role} t={t} />
                </div>
              </div>
              {canManage && m.role !== "owner" && m.userId !== myUserId && (
                <form action={removeTeamMember} className="flex-none">
                  <input type="hidden" name="userId" value={m.userId} />
                  <button
                    type="submit"
                    aria-label={t("removeAria")}
                    className="grid h-8 w-8 place-items-center rounded-full text-ink-3 hover:text-[var(--crit)]"
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="mt-4 rounded-[10px] border border-dashed bg-surface px-3 py-2 text-[10px] leading-relaxed text-ink-3">
        {t("howNote")}
      </p>
    </div>
  );
}
