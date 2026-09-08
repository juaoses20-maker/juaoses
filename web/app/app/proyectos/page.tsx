import { listProjects, getActiveProject } from "@/lib/data/queries";
import ProyectosUI from "./ProyectosUI";

export const metadata = { title: "Proyectos — EA Fiber Track" };

export default async function ProyectosPage() {
  const [projects, active] = await Promise.all([listProjects(), getActiveProject()]);
  return <ProyectosUI projects={projects} activeId={active?.id ?? null} />;
}
