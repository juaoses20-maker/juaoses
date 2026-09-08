import { redirect } from "next/navigation";
import { getUserContext } from "@/lib/supabase/context";
import NuevaEmpresaForm from "./nueva-empresa-form";

export const metadata = { title: "Crea tu empresa — EA Fiber Track" };

export default async function BienvenidoPage() {
  const ctx = await getUserContext();
  if (!ctx) redirect("/entrar");
  if (ctx.companyId) redirect("/app");

  return (
    <main className="flex min-h-dvh flex-col bg-bg text-ink">
      <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center px-6 pb-10 pt-[max(14px,env(safe-area-inset-top))]">
        <span className="grid h-10 w-10 place-items-center rounded-[11px] bg-accent">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round">
            <path d="M4 20V10l8-6 8 6v10" />
            <path d="M4 20h16" />
          </svg>
        </span>

        <h1 className="mt-4 font-display text-[24px] font-semibold leading-tight">
          Primero, tu empresa.
        </h1>
        <p className="mt-2 text-[13px] text-ink-2">
          Todo lo que registres —proyectos, cuadrillas, planos, fotos y tickets 811— queda guardado
          bajo tu empresa. Solo tú y tu equipo lo ven.
        </p>

        <NuevaEmpresaForm />
      </div>
    </main>
  );
}
