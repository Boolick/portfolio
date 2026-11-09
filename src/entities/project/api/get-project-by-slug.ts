import { getSupabasePublicClient } from "@/shared/api/supabase";
import type { Project } from "../model/types";
import { fallbackProjects } from "./get-projects";

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const supabase = getSupabasePublicClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (!error && data) {
      return data as Project;
    }
  } catch (err) {
    console.warn(`Using fallback for project slug "${slug}" due to fetch error:`, err);
  }

  const fallback = fallbackProjects.find((p) => p.slug === slug);
  return fallback ?? null;
}
