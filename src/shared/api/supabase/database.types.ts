export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      education: {
        Row: {
          additional_en: string[];
          additional_ru: string[];
          degree_en: string;
          degree_ru: string;
          id: string;
          institution_en: string;
          institution_ru: string;
          updated_at: string;
          year: string;
        };
        Insert: {
          additional_en?: string[];
          additional_ru?: string[];
          degree_en?: string;
          degree_ru?: string;
          id?: string;
          institution_en?: string;
          institution_ru?: string;
          updated_at?: string;
          year?: string;
        };
        Update: {
          additional_en?: string[];
          additional_ru?: string[];
          degree_en?: string;
          degree_ru?: string;
          id?: string;
          institution_en?: string;
          institution_ru?: string;
          updated_at?: string;
          year?: string;
        };
        Relationships: [];
      };
      experiences: {
        Row: {
          company: string;
          created_at: string;
          description_en: string[];
          description_ru: string[];
          id: string;
          is_commercial: boolean;
          location_en: string;
          location_ru: string;
          period_en: string;
          period_ru: string;
          sort_order: number;
          stack: string[];
          title_en: string;
          title_ru: string;
          updated_at: string;
        };
        Insert: {
          company?: string;
          created_at?: string;
          description_en?: string[];
          description_ru?: string[];
          id?: string;
          is_commercial?: boolean;
          location_en?: string;
          location_ru?: string;
          period_en?: string;
          period_ru?: string;
          sort_order?: number;
          stack?: string[];
          title_en?: string;
          title_ru?: string;
          updated_at?: string;
        };
        Update: {
          company?: string;
          created_at?: string;
          description_en?: string[];
          description_ru?: string[];
          id?: string;
          is_commercial?: boolean;
          location_en?: string;
          location_ru?: string;
          period_en?: string;
          period_ru?: string;
          sort_order?: number;
          stack?: string[];
          title_en?: string;
          title_ru?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      languages: {
        Row: {
          created_at: string;
          id: string;
          level_en: string;
          level_ru: string;
          name_en: string;
          name_ru: string;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          level_en?: string;
          level_ru?: string;
          name_en?: string;
          name_ru?: string;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          level_en?: string;
          level_ru?: string;
          name_en?: string;
          name_ru?: string;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      profile: {
        Row: {
          email: string;
          id: string;
          linkedin: string;
          location_en: string;
          location_ru: string;
          name_en: string;
          name_ru: string;
          summary_en: string;
          summary_ru: string;
          telegram: string;
          title_en: string;
          title_ru: string;
          updated_at: string;
          why_me_en: string;
          why_me_ru: string;
        };
        Insert: {
          email?: string;
          id?: string;
          linkedin?: string;
          location_en?: string;
          location_ru?: string;
          name_en?: string;
          name_ru?: string;
          summary_en?: string;
          summary_ru?: string;
          telegram?: string;
          title_en?: string;
          title_ru?: string;
          updated_at?: string;
          why_me_en?: string;
          why_me_ru?: string;
        };
        Update: {
          email?: string;
          id?: string;
          linkedin?: string;
          location_en?: string;
          location_ru?: string;
          name_en?: string;
          name_ru?: string;
          summary_en?: string;
          summary_ru?: string;
          telegram?: string;
          title_en?: string;
          title_ru?: string;
          updated_at?: string;
          why_me_en?: string;
          why_me_ru?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          created_at: string;
          description_en: string;
          description_ru: string;
          id: string;
          image_url: string;
          link: string;
          long_description_en: string;
          long_description_ru: string;
          outcomes_en: string;
          outcomes_ru: string;
          published: boolean;
          slug: string;
          sort_order: number;
          tags: string[];
          title_en: string;
          title_ru: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description_en?: string;
          description_ru?: string;
          id?: string;
          image_url?: string;
          link?: string;
          long_description_en?: string;
          long_description_ru?: string;
          outcomes_en?: string;
          outcomes_ru?: string;
          published?: boolean;
          slug: string;
          sort_order?: number;
          tags?: string[];
          title_en?: string;
          title_ru?: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description_en?: string;
          description_ru?: string;
          id?: string;
          image_url?: string;
          link?: string;
          long_description_en?: string;
          long_description_ru?: string;
          outcomes_en?: string;
          outcomes_ru?: string;
          published?: boolean;
          slug?: string;
          sort_order?: number;
          tags?: string[];
          title_en?: string;
          title_ru?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      skill_categories: {
        Row: {
          created_at: string;
          id: string;
          name_en: string;
          name_ru: string;
          skills: string[];
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name_en?: string;
          name_ru?: string;
          skills?: string[];
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name_en?: string;
          name_ru?: string;
          skills?: string[];
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: "admin" | "user";
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: "admin" | "user";
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: "admin" | "user";
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      has_role: {
        Args: {
          _role: "admin" | "user";
          _user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: "admin" | "user";
    };
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
