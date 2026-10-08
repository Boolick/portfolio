import { getSupabasePublicClient } from "@/shared/api/supabase";
import type { Project } from "../model/types";
import { resumeData } from "@/data/resume-data";

export const fallbackProjects: Project[] = resumeData.en.projects.map((p, idx) => {
  const ru = resumeData.ru.projects.find((rp) => rp.id === p.id);
  return {
    id: p.id,
    slug: p.id,
    title_en: p.title,
    title_ru: ru?.title ?? p.title,
    description_en: p.description,
    description_ru: ru?.description ?? p.description,
    long_description_en: p.description,
    long_description_ru: ru?.description ?? p.description,
    link: p.link,
    image_url: p.image,
    tags: p.tags,
    sort_order: idx,
    published: true,
  };
});

export async function getProjects(includeUnpublished = false): Promise<Project[]> {
  try {
    const supabase = getSupabasePublicClient();
    let query = supabase.from("projects").select("*").order("sort_order", { ascending: true });
    if (!includeUnpublished) {
      query = query.eq("published", true);
    }
    const { data, error } = await query;

    if (!error && data && data.length > 0) {
      return data as Project[];
    }
  } catch (err) {
    console.warn("Using fallback projects data due to fetch error:", err);
  }

  return fallbackProjects;
}
