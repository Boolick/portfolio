import { getSupabasePublicClient } from "@/shared/api/supabase";
import type { SkillCategory } from "../model/types";
import { resumeData } from "@/data/resume-data";

export const fallbackSkillCategories: SkillCategory[] = resumeData.en.skills.map(
  (s, idx) => {
    const ru = resumeData.ru.skills[idx];
    return {
      id: `skill-cat-${idx}`,
      name_en: s.name,
      name_ru: ru?.name ?? s.name,
      skills: s.skills,
      sort_order: idx,
    };
  }
);

export async function getSkillCategories(): Promise<SkillCategory[]> {
  try {
    const supabase = getSupabasePublicClient();
    const { data, error } = await supabase
      .from("skill_categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (!error && data && data.length > 0) {
      return data as SkillCategory[];
    }
  } catch (err) {
    console.warn("Using fallback skills data due to fetch error:", err);
  }

  return fallbackSkillCategories;
}
