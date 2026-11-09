"use server";

import { getSupabaseServerClient } from "@/shared/api/supabase/server";
import { mapBackendError, type NormalizedError } from "@/shared/lib/errors";
import { revalidatePortfolio } from "@/shared/api/revalidate";
import type { Profile } from "@/entities/profile";
import type { Project } from "@/entities/project";
import type { Experience } from "@/entities/experience";
import type { SkillCategory } from "@/entities/skill";
import type { Education } from "@/entities/education";
import type { Language } from "@/entities/language";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: NormalizedError };

async function getAuthenticatedAdminClient() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw { status: 401, message: "Unauthorized. Please log in." };
  }

  const { data: roleRow, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (roleError || !roleRow) {
    throw { status: 403, message: "Forbidden. Admin privileges required." };
  }

  return supabase;
}

// ==========================================
// 1. PROFILE
// ==========================================
export async function getAdminProfile(): Promise<ActionResult<Profile | null>> {
  try {
    const supabase = await getAuthenticatedAdminClient();
    const { data, error } = await supabase.from("profile").select("*").limit(1).maybeSingle();
    if (error) throw error;
    return { success: true, data: data as Profile | null };
  } catch (err) {
    return { success: false, error: mapBackendError(err) };
  }
}

export async function saveAdminProfile(
  payload: Partial<Profile>
): Promise<ActionResult<Profile>> {
  try {
    const supabase = await getAuthenticatedAdminClient();
    const { id: _id, updated_at: _u, ...cleanPayload } = payload;

    const { data: existing } = await supabase.from("profile").select("id").limit(1).maybeSingle();

    let data, error;
    if (existing) {
      const res = await supabase
        .from("profile")
        .update(cleanPayload)
        .eq("id", existing.id)
        .select()
        .single();
      data = res.data;
      error = res.error;
    } else {
      const res = await supabase.from("profile").insert(cleanPayload).select().single();
      data = res.data;
      error = res.error;
    }

    if (error) throw error;
    await revalidatePortfolio();
    return { success: true, data: data as Profile };
  } catch (err) {
    return { success: false, error: mapBackendError(err) };
  }
}

// ==========================================
// 2. PROJECTS
// ==========================================
export async function getAdminProjects(): Promise<ActionResult<Project[]>> {
  try {
    const supabase = await getAuthenticatedAdminClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return { success: true, data: (data || []) as Project[] };
  } catch (err) {
    return { success: false, error: mapBackendError(err) };
  }
}

export async function saveAdminProject(
  project: Partial<Project> & { id?: string }
): Promise<ActionResult<Project>> {
  try {
    const supabase = await getAuthenticatedAdminClient();
    const { id, created_at: _c, updated_at: _u, ...cleanPayload } = project;

    let data, error;
    if (id && !id.startsWith("new-")) {
      const res = await supabase.from("projects").update(cleanPayload).eq("id", id).select().single();
      data = res.data;
      error = res.error;
    } else {
      const slug =
        cleanPayload.slug ||
        cleanPayload.title_en?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") ||
        `project-${Date.now()}`;
      const insertPayload = {
        ...cleanPayload,
        slug,
      };
      const res = await supabase.from("projects").insert(insertPayload).select().single();
      data = res.data;
      error = res.error;
    }

    if (error) throw error;
    await revalidatePortfolio();
    return { success: true, data: data as Project };
  } catch (err) {
    return { success: false, error: mapBackendError(err) };
  }
}

export async function deleteAdminProject(id: string): Promise<ActionResult<void>> {
  try {
    const supabase = await getAuthenticatedAdminClient();
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) throw error;
    await revalidatePortfolio();
    return { success: true, data: undefined };
  } catch (err) {
    return { success: false, error: mapBackendError(err) };
  }
}

export async function uploadAdminProjectImage(formData: FormData): Promise<ActionResult<string>> {
  try {
    const supabase = await getAuthenticatedAdminClient();
    const file = formData.get("file") as File;
    if (!file) throw { status: 400, message: "No file provided" };

    const ext = file.name.split(".").pop() || "png";
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("project-images")
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data: publicData } = supabase.storage
      .from("project-images")
      .getPublicUrl(fileName);

    return { success: true, data: publicData.publicUrl };
  } catch (err) {
    return { success: false, error: mapBackendError(err) };
  }
}

// ==========================================
// 3. EXPERIENCES
// ==========================================
export async function getAdminExperiences(): Promise<ActionResult<Experience[]>> {
  try {
    const supabase = await getAuthenticatedAdminClient();
    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return { success: true, data: (data || []) as Experience[] };
  } catch (err) {
    return { success: false, error: mapBackendError(err) };
  }
}

export async function saveAdminExperience(
  exp: Partial<Experience> & { id?: string }
): Promise<ActionResult<Experience>> {
  try {
    const supabase = await getAuthenticatedAdminClient();
    const { id, created_at: _c, updated_at: _u, ...cleanPayload } = exp;

    let data, error;
    if (id && !id.startsWith("new-")) {
      const res = await supabase.from("experiences").update(cleanPayload).eq("id", id).select().single();
      data = res.data;
      error = res.error;
    } else {
      const res = await supabase.from("experiences").insert(cleanPayload).select().single();
      data = res.data;
      error = res.error;
    }

    if (error) throw error;
    await revalidatePortfolio();
    return { success: true, data: data as Experience };
  } catch (err) {
    return { success: false, error: mapBackendError(err) };
  }
}

export async function deleteAdminExperience(id: string): Promise<ActionResult<void>> {
  try {
    const supabase = await getAuthenticatedAdminClient();
    const { error } = await supabase.from("experiences").delete().eq("id", id);
    if (error) throw error;
    await revalidatePortfolio();
    return { success: true, data: undefined };
  } catch (err) {
    return { success: false, error: mapBackendError(err) };
  }
}

// ==========================================
// 4. SKILLS
// ==========================================
export async function getAdminSkills(): Promise<ActionResult<SkillCategory[]>> {
  try {
    const supabase = await getAuthenticatedAdminClient();
    const { data, error } = await supabase
      .from("skill_categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return { success: true, data: (data || []) as SkillCategory[] };
  } catch (err) {
    return { success: false, error: mapBackendError(err) };
  }
}

export async function saveAdminSkillCategory(
  category: Partial<SkillCategory> & { id?: string }
): Promise<ActionResult<SkillCategory>> {
  try {
    const supabase = await getAuthenticatedAdminClient();
    const { id, created_at: _c, updated_at: _u, ...cleanPayload } = category;

    let data, error;
    if (id && !id.startsWith("new-")) {
      const res = await supabase
        .from("skill_categories")
        .update(cleanPayload)
        .eq("id", id)
        .select()
        .single();
      data = res.data;
      error = res.error;
    } else {
      const res = await supabase.from("skill_categories").insert(cleanPayload).select().single();
      data = res.data;
      error = res.error;
    }

    if (error) throw error;
    await revalidatePortfolio();
    return { success: true, data: data as SkillCategory };
  } catch (err) {
    return { success: false, error: mapBackendError(err) };
  }
}

export async function deleteAdminSkillCategory(id: string): Promise<ActionResult<void>> {
  try {
    const supabase = await getAuthenticatedAdminClient();
    const { error } = await supabase.from("skill_categories").delete().eq("id", id);
    if (error) throw error;
    await revalidatePortfolio();
    return { success: true, data: undefined };
  } catch (err) {
    return { success: false, error: mapBackendError(err) };
  }
}

// ==========================================
// 5. EDUCATION & LANGUAGES
// ==========================================
export async function getAdminEducation(): Promise<ActionResult<Education | null>> {
  try {
    const supabase = await getAuthenticatedAdminClient();
    const { data, error } = await supabase.from("education").select("*").limit(1).maybeSingle();
    if (error) throw error;
    return { success: true, data: data as Education | null };
  } catch (err) {
    return { success: false, error: mapBackendError(err) };
  }
}

export async function saveAdminEducation(
  payload: Partial<Education>
): Promise<ActionResult<Education>> {
  try {
    const supabase = await getAuthenticatedAdminClient();
    const { id: _id, updated_at: _u, ...cleanPayload } = payload;

    const { data: existing } = await supabase.from("education").select("id").limit(1).maybeSingle();

    let data, error;
    if (existing) {
      const res = await supabase
        .from("education")
        .update(cleanPayload)
        .eq("id", existing.id)
        .select()
        .single();
      data = res.data;
      error = res.error;
    } else {
      const res = await supabase.from("education").insert(cleanPayload).select().single();
      data = res.data;
      error = res.error;
    }

    if (error) throw error;
    await revalidatePortfolio();
    return { success: true, data: data as Education };
  } catch (err) {
    return { success: false, error: mapBackendError(err) };
  }
}

export async function getAdminLanguages(): Promise<ActionResult<Language[]>> {
  try {
    const supabase = await getAuthenticatedAdminClient();
    const { data, error } = await supabase
      .from("languages")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return { success: true, data: (data || []) as Language[] };
  } catch (err) {
    return { success: false, error: mapBackendError(err) };
  }
}

export async function saveAdminLanguage(
  lang: Partial<Language> & { id?: string }
): Promise<ActionResult<Language>> {
  try {
    const supabase = await getAuthenticatedAdminClient();
    const { id, created_at: _c, updated_at: _u, ...cleanPayload } = lang;

    let data, error;
    if (id && !id.startsWith("new-")) {
      const res = await supabase.from("languages").update(cleanPayload).eq("id", id).select().single();
      data = res.data;
      error = res.error;
    } else {
      const res = await supabase.from("languages").insert(cleanPayload).select().single();
      data = res.data;
      error = res.error;
    }

    if (error) throw error;
    await revalidatePortfolio();
    return { success: true, data: data as Language };
  } catch (err) {
    return { success: false, error: mapBackendError(err) };
  }
}

export async function deleteAdminLanguage(id: string): Promise<ActionResult<void>> {
  try {
    const supabase = await getAuthenticatedAdminClient();
    const { error } = await supabase.from("languages").delete().eq("id", id);
    if (error) throw error;
    await revalidatePortfolio();
    return { success: true, data: undefined };
  } catch (err) {
    return { success: false, error: mapBackendError(err) };
  }
}
