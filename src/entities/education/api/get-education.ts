import { getSupabasePublicClient } from "@/shared/api/supabase";
import type { Education } from "../model/types";
import { resumeData } from "@/data/resume-data";

export const fallbackEducation: Education = {
  id: "default-edu",
  degree_en: resumeData.en.education.degree,
  degree_ru: resumeData.ru.education.degree,
  institution_en: resumeData.en.education.institution,
  institution_ru: resumeData.ru.education.institution,
  year: resumeData.en.education.year,
  additional_en: resumeData.en.education.additional ?? [],
  additional_ru: resumeData.ru.education.additional ?? [],
};

export async function getEducation(): Promise<Education> {
  try {
    const supabase = getSupabasePublicClient();
    const { data, error } = await supabase
      .from("education")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (!error && data && data.degree_en) {
      return data as Education;
    }
  } catch (err) {
    console.warn("Using fallback education data due to fetch error:", err);
  }

  return fallbackEducation;
}
