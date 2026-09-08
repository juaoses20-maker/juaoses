import { notFound } from "next/navigation";
import { getActiveProject, getPlan, listCrews } from "@/lib/data/queries";
import PlanEditor from "./PlanEditor";

export default async function PlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getPlan(id);
  if (!data) notFound();

  const project = await getActiveProject();
  const crews = project ? await listCrews(project.id) : [];

  return <PlanEditor plan={data.plan} marks={data.marks} crews={crews} />;
}
