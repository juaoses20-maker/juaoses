import { getActiveProject } from "@/lib/data/queries";
import NoProject from "@/components/app/NoProject";
import FotosUI from "./FotosUI";

export default async function FotosPage() {
  const project = await getActiveProject();
  if (!project) return <NoProject what="fotos" />;
  return <FotosUI />;
}
