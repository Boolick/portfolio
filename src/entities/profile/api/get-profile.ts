import { getSupabasePublicClient } from "@/shared/api/supabase";
import type { Profile } from "../model/types";
import { resumeData } from "@/data/resume-data";

export const fallbackProfile: Profile = {
  id: "default-profile",
  name_en: resumeData.en.name,
  name_ru: resumeData.ru.name,
  title_en: resumeData.en.title,
  title_ru: resumeData.ru.title,
  summary_en: resumeData.en.summary,
  summary_ru: resumeData.ru.summary,
  why_me_en: resumeData.en.whyMe ?? "",
  why_me_ru: resumeData.ru.whyMe ?? "",
  email: resumeData.en.contacts.email,
  telegram: resumeData.en.contacts.telegram,
  linkedin: resumeData.en.contacts.linkedin,
  location_en: resumeData.en.contacts.location,
  location_ru: resumeData.ru.contacts.location,
};

export async function getProfile(): Promise<Profile> {
  try {
    const supabase = getSupabasePublicClient();
    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (!error && data && data.name_en) {
      return data as Profile;
    }
  } catch (err) {
    console.warn("Using fallback profile data due to fetch error:", err);
  }

  return fallbackProfile;
}
