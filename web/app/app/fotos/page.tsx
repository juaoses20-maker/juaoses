import { getUserContext } from "@/lib/supabase/context";
import { createClient } from "@/lib/supabase/server";
import { getActiveProject, listPhotos } from "@/lib/data/queries";
import NoProject from "@/components/app/NoProject";
import FotosUI from "./FotosUI";

export default async function FotosPage() {
  const [ctx, project] = await Promise.all([getUserContext(), getActiveProject()]);
  if (!ctx?.companyId) return <NoProject what="fotos" />;
  if (!project) return <NoProject what="fotos" />;

  const supabase = await createClient();
  const [{ data: company }, photos] = await Promise.all([
    supabase.from("companies").select("name").eq("id", ctx.companyId).maybeSingle(),
    listPhotos(project.id),
  ]);

  return (
    <FotosUI
      companyId={ctx.companyId}
      companyName={company?.name ?? "Mi empresa"}
      projectId={project.id}
      projectName={project.name}
      photos={photos}
    />
  );
}
