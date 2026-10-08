import { getSupabasePublicClient } from "@/shared/api/supabase";
import type { Language } from "../model/types";
import { resumeData } from "@/data/resume-data";

export const fallbackLanguages: Language[] = resumeData.en.languages.map((l, idx) => {
  const ru = resumeData.ru.languages[idx];
  return {
    id: `lang-${idx}`,
    name_en: l.name,
    name_ru: ru?.name ?? l.name,
    level_en: l.level,
    level_ru: ru?.level ?? l.level,
    sort_order: idx,
  };
});

export async function getLanguages(): Promise<Language[]> {
  try {
    const supabase = getSupabasePublicClient();
    const { data, error } = await supabase
      .from("languages")
      .select("*")
      .order("sort_order", { ascending: true });

    if (!error && data && data.length > 0) {
      return data as Language[];
    }
  } catch (err) {
    console.warn("Using fallback languages data due to fetch error:", err);
  }

  return fallbackLanguages;
}
