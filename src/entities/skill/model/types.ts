export interface SkillCategory {
  id: string;
  name_en: string;
  name_ru: string;
  skills: string[];
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}
