import { getActiveProject, listCrews } from "@/lib/data/queries";
import NoProject from "@/components/app/NoProject";
import CuadrillasUI from "./CuadrillasUI";

export default async function CuadrillasPage() {
  const project = await getActiveProject();
  if (!project) return <NoProject what="cuadrillas" />;

  const crews = await listCrews(project.id);
  return <CuadrillasUI projectId={project.id} projectName={project.name} crews={crews} />;
}
