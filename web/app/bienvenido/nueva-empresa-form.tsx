"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Btn } from "@/components/site/ui";
import { crearEmpresa, type CrearEmpresaState } from "./actions";

const initial: CrearEmpresaState = { error: null };

export default function NuevaEmpresaForm() {
  const t = useTranslations("welcome");
  const tc = useTranslations("common");
  const router = useRouter();
  const [state, formAction, pending] = useActionState(crearEmpresa, initial);

  useEffect(() => {
    if (state.ok) {
      router.replace("/app");
      router.refresh();
    }
  }, [state.ok, router]);

  return (
    <form action={formAction} className="mt-6 space-y-3 text-left">
      <label className="block">
        <span className="text-[12px] font-semibold text-ink-2">{t("nameLabel")}</span>
        <input
          name="name"
          required
          autoFocus
          defaultValue="Advanced Solutions"
          placeholder={t("namePlaceholder")}
          className="mt-1 w-full rounded-[10px] border bg-surface px-3 py-2.5 text-[14px] outline-none placeholder:text-ink-3"
        />
      </label>

      <label className="block">
        <span className="text-[12px] font-semibold text-ink-2">
          {t("zoneLabel")} <span className="font-normal text-ink-3">{t("zoneOptional")}</span>
        </span>
        <input
          name="location"
          placeholder={t("zonePlaceholder")}
          className="mt-1 w-full rounded-[10px] border bg-surface px-3 py-2.5 text-[14px] outline-none placeholder:text-ink-3"
        />
      </label>

      {state.error && (
        <p className="rounded-[10px] border border-[color:color-mix(in_oklab,var(--crit)_40%,transparent)] bg-[color:color-mix(in_oklab,var(--crit)_8%,transparent)] px-3 py-2 text-[12px] text-[var(--crit)]">
          {state.error}
        </p>
      )}

      <div className="pt-1">
        <Btn type="submit" disabled={pending || state.ok}>
          {state.ok ? t("entering") : pending ? tc("creating") : t("submit")}
        </Btn>
      </div>
    </form>
  );
}
