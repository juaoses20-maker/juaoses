import { getUserContext } from "@/lib/supabase/context";
import { getActiveProject, listPhotos } from "@/lib/data/queries";
import NoProject from "@/components/app/NoProject";
import FotosUI from "./FotosUI";

export default async function FotosPage() {
  const [ctx, project] = await Promise.all([getUserContext(), getActiveProject()]);
  if (!ctx?.companyId) return <NoProject what="fotos" />;
  if (!project) return <NoProject what="fotos" />;

  const photos = await listPhotos(project.id);
  return (
    <FotosUI
      companyId={ctx.companyId}
      projectId={project.id}
      projectName={project.name}
      photos={photos}
    />
  );
}
