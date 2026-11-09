export interface Project {
  id: string;
  slug: string;
  title_en: string;
  title_ru: string;
  description_en: string;
  description_ru: string;
  long_description_en: string;
  long_description_ru: string;
  outcomes_en?: string;
  outcomes_ru?: string;
  link: string;
  image_url: string;
  tags: string[];
  sort_order: number;
  published: boolean;
  created_at?: string;
  updated_at?: string;
}
