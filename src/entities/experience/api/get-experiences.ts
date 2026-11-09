import { getSupabasePublicClient } from "@/shared/api/supabase";
import type { Experience } from "../model/types";
import { resumeData } from "@/data/resume-data";

export const fallbackExperiences: Experience[] = resumeData.en.experience.map((e, idx) => {
  const ru = resumeData.ru.experience[idx];
  return {
    id: `exp-${idx}`,
    title_en: e.title,
    title_ru: ru?.title ?? e.title,
    company: e.company,
    location_en: e.location,
    location_ru: ru?.location ?? e.location,
    period_en: e.period,
    period_ru: ru?.period ?? e.period,
    description_en: e.description,
    description_ru: ru?.description ?? e.description,
    stack: e.stack,
    is_commercial: e.isCommercial ?? true,
    sort_order: idx,
  };
});

export async function getExperiences(): Promise<Experience[]> {
  try {
    const supabase = getSupabasePublicClient();
    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .order("sort_order", { ascending: true });

    if (!error && data && data.length > 0) {
      return data as Experience[];
    }
  } catch (err) {
    console.warn("Using fallback experiences data due to fetch error:", err);
  }

  return fallbackExperiences;
}
