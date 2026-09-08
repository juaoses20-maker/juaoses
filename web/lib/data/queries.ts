import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { ACTIVE_PROJECT_COOKIE, type Crew, type Project } from "@/lib/data/types";

export async function listProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("id, name, client, location, status")
    .order("created_at", { ascending: false });
  return data ?? [];
}

/** Proyecto activo: la cookie si sigue siendo válida, si no el más reciente. */
export async function getActiveProject(): Promise<Project | null> {
  const projects = await listProjects();
  if (projects.length === 0) return null;
  const wanted = (await cookies()).get(ACTIVE_PROJECT_COOKIE)?.value;
  return projects.find((p) => p.id === wanted) ?? projects[0];
}

export async function listCrews(projectId: string): Promise<Crew[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("crews")
    .select("id, name, color, foreman, people, equipment")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });
  return (data ?? []) as Crew[];
}
