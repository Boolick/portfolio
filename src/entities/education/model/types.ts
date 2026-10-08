export interface Education {
  id: string;
  degree_en: string;
  degree_ru: string;
  institution_en: string;
  institution_ru: string;
  year: string;
  additional_en: string[];
  additional_ru: string[];
  updated_at?: string;
}
