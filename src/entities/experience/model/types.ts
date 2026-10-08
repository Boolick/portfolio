export interface Experience {
  id: string;
  title_en: string;
  title_ru: string;
  company: string;
  location_en: string;
  location_ru: string;
  period_en: string;
  period_ru: string;
  description_en: string[];
  description_ru: string[];
  stack: string[];
  is_commercial: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}
