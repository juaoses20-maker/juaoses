import { getUserContext } from "@/lib/supabase/context";
import { getActiveProject, listPlans } from "@/lib/data/queries";
import NoProject from "@/components/app/NoProject";
import PlanosUI from "./PlanosUI";

export default async function PlanosPage() {
  const [ctx, project] = await Promise.all([getUserContext(), getActiveProject()]);
  if (!ctx?.companyId || !project) return <NoProject what="planos" />;

  const plans = await listPlans(project.id);
  return (
    <PlanosUI
      companyId={ctx.companyId}
      projectId={project.id}
      projectName={project.name}
      plans={plans}
    />
  );
}
