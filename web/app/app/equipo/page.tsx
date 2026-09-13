import { redirect } from "next/navigation";
import { getUserContext } from "@/lib/supabase/context";
import { listInvites, listTeam } from "@/lib/data/queries";
import EquipoUI from "./EquipoUI";

export const metadata = { title: "Equipo — EA Fiber Track" };

export default async function EquipoPage() {
  const ctx = await getUserContext();
  if (!ctx) redirect("/entrar");
  if (!ctx.companyId) redirect("/bienvenido");

  const [team, invites] = await Promise.all([
    listTeam(ctx.companyId),
    listInvites(ctx.companyId),
  ]);

  return (
    <EquipoUI
      team={team}
      invites={invites}
      myUserId={ctx.user.id}
      myRole={ctx.role}
      canManage={ctx.role === "owner" || ctx.role === "admin"}
    />
  );
}
