"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Btn } from "@/components/site/ui";
import { createClient } from "@/lib/supabase/client";

export default function EntrarPage() {
  const t = useTranslations("entrar");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(() =>
    typeof window === "undefined"
      ? null
      : new URLSearchParams(window.location.search).get("error"),
  );

  useEffect(() => {
    createClient()
      .auth.getSession()
      .then(({ data }) => {
        if (data.session) window.location.replace("/app");
      });
  }, []);

  async function sendLink() {
    if (!email.includes("@") || busy) return;
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setBusy(false);
    if (error) {
      setError(t("errorLink"));
      return;
    }
    setSent(true);
  }

  async function withGoogle() {
    if (busy) return;
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setBusy(false);
      setError(t("errorGoogle"));
    }
  }

  return (
    <main className="flex min-h-dvh flex-col bg-bg text-ink">
      <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center px-6 pb-10 pt-[max(14px,env(safe-area-inset-top))] text-center">
        <span className="mx-auto grid h-10 w-10 place-items-center rounded-[11px] bg-accent">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round">
            <path d="M4 20V10l8-6 8 6v10" />
            <path d="M4 20h16" />
          </svg>
        </span>

        {!sent ? (
          <>
            <h1 className="mt-4 text-[22px] font-semibold">{t("title")}</h1>
            <p className="mt-2 text-[13px] text-ink-2">{t("body")}</p>

            {error && (
              <p className="mt-4 rounded-[10px] border border-[color:color-mix(in_oklab,var(--crit)_40%,transparent)] bg-[color:color-mix(in_oklab,var(--crit)_8%,transparent)] px-3 py-2 text-[12px] text-[var(--crit)]">
                {error}
              </p>
            )}

            <button
              onClick={withGoogle}
              disabled={busy}
              className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-btn border bg-white text-[14px] font-bold text-[#3c4043] shadow-[var(--shadow-1)] disabled:opacity-60"
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.6a4.8 4.8 0 0 1-2 3.2v2.6h3.3c2-1.8 3.1-4.5 3.1-7.6z" />
                <path fill="#34A853" d="M12 23c2.7 0 5-.9 6.6-2.4l-3.3-2.6c-.9.6-2 1-3.3 1-2.6 0-4.7-1.7-5.5-4H3.1v2.7A10 10 0 0 0 12 23z" />
                <path fill="#FBBC05" d="M6.5 14a6 6 0 0 1 0-3.8V7.5H3.1a10 10 0 0 0 0 9z" />
                <path fill="#EA4335" d="M12 5.4c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.5l3.4 2.7C7.3 7.1 9.4 5.4 12 5.4z" />
              </svg>
              {t("google")}
            </button>

            <div className="my-4 flex items-center gap-2 text-[11px] text-ink-3 before:h-px before:flex-1 before:bg-line after:h-px after:flex-1 after:bg-line">
              {t("orEmail")}
            </div>

            <input
              type="email"
              inputMode="email"
              placeholder={t("emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendLink()}
              className="w-full rounded-[10px] border bg-surface px-3 py-2.5 text-center text-[14px] outline-none placeholder:text-ink-3"
            />
            <div className="mt-2.5">
              <Btn onClick={sendLink} disabled={!email.includes("@") || busy}>
                {busy ? t("sending") : t("sendLink")}
              </Btn>
            </div>

            <p className="mt-4 text-[10px] text-ink-3">
              {t.rich("legal", {
                terms: (c) => (
                  <Link href="/legal/terminos" className="underline underline-offset-2">
                    {c}
                  </Link>
                ),
                privacy: (c) => (
                  <Link href="/legal/privacidad" className="underline underline-offset-2">
                    {c}
                  </Link>
                ),
              })}
            </p>
          </>
        ) : (
          <>
            <h1 className="mt-4 text-[22px] font-semibold">{t("sentTitle")}</h1>
            <p className="mt-2 text-[13px] text-ink-2">
              {t.rich("sentBody", {
                email,
                b: (c) => <b className="font-semibold text-ink">{c}</b>,
              })}
            </p>
            <button
              onClick={() => {
                setSent(false);
                setError(null);
              }}
              className="mt-5 text-[12px] font-semibold text-ink-3 underline underline-offset-2"
            >
              {t("otherEmail")}
            </button>
          </>
        )}
      </div>
    </main>
  );
}
