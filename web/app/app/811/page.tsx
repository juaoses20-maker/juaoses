import { getActiveProject, listTickets } from "@/lib/data/queries";
import NoProject from "@/components/app/NoProject";
import TicketsUI from "./TicketsUI";

export default async function TicketsPage() {
  const project = await getActiveProject();
  if (!project) return <NoProject what="tickets 811" />;

  const tickets = await listTickets(project.id);
  return <TicketsUI projectId={project.id} projectName={project.name} tickets={tickets} />;
}
