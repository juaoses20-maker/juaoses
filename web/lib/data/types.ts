export const ACTIVE_PROJECT_COOKIE = "eaft_project";

export const CREW_COLORS = ["#e8590c", "#3c6a89", "#5f7248", "#8a4f22", "#5a6b7a", "#7a5a1f"];

export type Project = {
  id: string;
  name: string;
  client: string | null;
  location: string | null;
  status: string;
};

export type Crew = {
  id: string;
  name: string;
  color: string;
  foreman: string | null;
  people: number;
  equipment: string[];
};

export type ProjectFormState = { error: string | null };
export type CrewFormState = { error: string | null; ok?: boolean };
