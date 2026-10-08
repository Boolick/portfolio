"use client";

import { useEffect, useState, useCallback, type FormEvent } from "react";
import { Plus, Trash2, GraduationCap, Globe, MoveUp, MoveDown } from "lucide-react";
import { getSupabaseBrowserClient } from "@/shared/api/supabase";
import { type Education, fallbackEducation } from "@/entities/education";
import { type Language, fallbackLanguages } from "@/entities/language";
import {
  Button,
  Input,
  Label,
  Textarea,
  toast,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/shared/ui";
import { revalidatePortfolio } from "@/shared/api/revalidate";

export function AdminEducationView() {
  const [edu, setEdu] = useState<Education | null>(null);
  const [eduBusy, setEduBusy] = useState(false);
  const [eduTab, setEduTab] = useState<"en" | "ru">("en");

  const [languages, setLanguages] = useState<Language[]>([]);
  const [langBusyId, setLangBusyId] = useState<string | null>(null);

  const supabase = getSupabaseBrowserClient();

  // Load Education & Languages
  const reload = useCallback(async () => {
    // Education
    const { data: eduData, error: eduError } = await supabase
      .from("education")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (eduError) {
      toast.error("Failed to load education: " + eduError.message);
    } else if (eduData) {
      setEdu(eduData as Education);
    } else {
      setEdu(fallbackEducation);
    }

    // Languages
    const { data: langData, error: langError } = await supabase
      .from("languages")
      .select("*")
      .order("sort_order", { ascending: true });

    if (langError) {
      toast.error("Failed to load languages: " + langError.message);
    } else if (langData && langData.length > 0) {
      setLanguages(langData as Language[]);
    } else {
      setLanguages([]);
    }
  }, [supabase]);

  useEffect(() => {
    void reload();
  }, [reload]);

  // Save Education
  const saveEducation = async (e: FormEvent) => {
    e.preventDefault();
    if (!edu) return;
    setEduBusy(true);

    try {
      const { id: _id, updated_at: _updated_at, ...payload } = edu;
      const { data: existing } = await supabase
        .from("education")
        .select("id")
        .limit(1)
        .maybeSingle();

      let error;
      if (existing) {
        const res = await supabase.from("education").update(payload).eq("id", existing.id);
        error = res.error;
      } else {
        const res = await supabase.from("education").insert(payload);
        error = res.error;
      }

      if (error) {
        toast.error("Education save failed: " + error.message);
      } else {
        toast.success("Education details updated!");
        void revalidatePortfolio("/");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error saving education");
    } finally {
      setEduBusy(false);
    }
  };

  // Seed Education
  const seedEducation = async () => {
    if (!confirm("Populate education with default CV data?")) return;
    setEdu(fallbackEducation);
    try {
      const { id: _id, ...payload } = fallbackEducation;
      await supabase.from("education").insert(payload);
      toast.success("Default education seeded!");
      void revalidatePortfolio("/");
      void reload();
    } catch {
      toast.error("Seed error");
    }
  };

  // Language CRUD
  const updateLanguage = (id: string, patch: Partial<Language>) => {
    setLanguages((arr) => arr.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  };

  const saveLanguage = async (item: Language) => {
    setLangBusyId(item.id);
    try {
      const { id, created_at: _c, updated_at: _u, ...payload } = item;
      const { error } = await supabase.from("languages").update(payload).eq("id", id);
      if (error) {
        toast.error("Failed to save language: " + error.message);
      } else {
        toast.success(`Language "${item.name_en}" saved!`);
        void revalidatePortfolio("/");
      }
    } catch {
      toast.error("Error saving language");
    } finally {
      setLangBusyId(null);
    }
  };

  const removeLanguage = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete language "${name}"?`)) return;
    try {
      const { error } = await supabase.from("languages").delete().eq("id", id);
      if (error) {
        toast.error("Delete failed: " + error.message);
      } else {
        toast.success("Language deleted");
        void revalidatePortfolio("/");
        void reload();
      }
    } catch {
      toast.error("Delete error");
    }
  };

  const createLanguage = async () => {
    const newLang = {
      name_en: "New Language",
      name_ru: "Новый язык",
      level_en: "Fluent / C1",
      level_ru: "Свободный / C1",
      sort_order: languages.length + 1,
    };

    const { data, error } = await supabase.from("languages").insert(newLang).select().single();
    if (error) {
      toast.error("Failed to add language: " + error.message);
    } else if (data) {
      toast.success("Language added!");
      setLanguages((prev) => [...prev, data as Language]);
      void revalidatePortfolio("/");
    }
  };

  const seedLanguages = async () => {
    if (!confirm("Populate languages with default CV data?")) return;
    try {
      const payloads = fallbackLanguages.map(({ id: _id, ...rest }, idx) => ({
        ...rest,
        sort_order: idx + 1,
      }));
      const { error } = await supabase.from("languages").insert(payloads);
      if (error) {
        toast.error("Seed error: " + error.message);
      } else {
        toast.success("Languages seeded!");
        void revalidatePortfolio("/");
        void reload();
      }
    } catch {
      toast.error("Seed error");
    }
  };

  const moveLangOrder = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= languages.length) return;

    const newItems = [...languages];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    const updated = newItems.map((item, idx) => ({ ...item, sort_order: idx + 1 }));
    setLanguages(updated);

    for (const it of updated) {
      await supabase.from("languages").update({ sort_order: it.sort_order }).eq("id", it.id);
    }
    toast.success("Order updated");
  };

  return (
    <div className="space-y-12">
      {/* SECTION 1: EDUCATION */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Education</h2>
              <p className="text-sm text-muted-foreground">
                Formal education, degree, university, and certifications.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={seedEducation}>
              Seed default
            </Button>
            <Tabs
              value={eduTab}
              onValueChange={(v) => setEduTab(v as "en" | "ru")}
              className="w-auto"
            >
              <TabsList className="h-8">
                <TabsTrigger value="en" className="text-xs px-2.5 py-1">
                  🇬🇧 English
                </TabsTrigger>
                <TabsTrigger value="ru" className="text-xs px-2.5 py-1">
                  🇷🇺 Russian
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {edu && (
          <form
            onSubmit={saveEducation}
            className="p-6 rounded-2xl border border-border bg-card/60 backdrop-blur-sm space-y-6"
          >
            {/* Year */}
            <div className="max-w-xs space-y-1.5">
              <Label className="text-xs">Graduation Year / Period</Label>
              <Input
                value={edu.year}
                onChange={(e) => setEdu({ ...edu, year: e.target.value })}
                placeholder="e.g. 2018 — 2022"
              />
            </div>

            {eduTab === "en" ? (
              <div className="space-y-4 p-4 rounded-xl bg-muted/20 border border-border/50">
                <div className="text-xs font-semibold text-primary uppercase tracking-wider">
                  🇬🇧 English Education Info
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Degree / Qualification (EN)</Label>
                    <Input
                      value={edu.degree_en}
                      onChange={(e) => setEdu({ ...edu, degree_en: e.target.value })}
                      placeholder="e.g. B.S. in Computer Science"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Institution / University (EN)</Label>
                    <Input
                      value={edu.institution_en}
                      onChange={(e) => setEdu({ ...edu, institution_en: e.target.value })}
                      placeholder="e.g. State University"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">
                    Additional Certifications / Courses (EN) — one per line
                  </Label>
                  <Textarea
                    rows={3}
                    value={edu.additional_en?.join("\n") ?? ""}
                    onChange={(e) =>
                      setEdu({
                        ...edu,
                        additional_en: e.target.value
                          .split("\n")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="AWS Certified Solutions Architect&#10;Google Professional Cloud Architect"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4 p-4 rounded-xl bg-muted/20 border border-border/50">
                <div className="text-xs font-semibold text-primary uppercase tracking-wider">
                  🇷🇺 Русская версия образования
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Степень / Специальность (RU)</Label>
                    <Input
                      value={edu.degree_ru}
                      onChange={(e) => setEdu({ ...edu, degree_ru: e.target.value })}
                      placeholder="например, Бакалавр информатики и ВТ"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Учебное заведение (RU)</Label>
                    <Input
                      value={edu.institution_ru}
                      onChange={(e) => setEdu({ ...edu, institution_ru: e.target.value })}
                      placeholder="например, Государственный университет"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">
                    Дополнительные курсы и сертификаты (RU) — по одному на строке
                  </Label>
                  <Textarea
                    rows={3}
                    value={edu.additional_ru?.join("\n") ?? ""}
                    onChange={(e) =>
                      setEdu({
                        ...edu,
                        additional_ru: e.target.value
                          .split("\n")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="Сертифицированный специалист по облачным технологиям"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={eduBusy}>
                {eduBusy ? "Saving..." : "Save Education"}
              </Button>
            </div>
          </form>
        )}
      </section>

      {/* SECTION 2: LANGUAGES */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <Globe className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Languages</h2>
              <p className="text-sm text-muted-foreground">
                Foreign language proficiencies and speaking capabilities.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {languages.length === 0 && (
              <Button variant="outline" size="sm" onClick={seedLanguages}>
                Seed default
              </Button>
            )}
            <Button onClick={createLanguage} className="gap-2" size="sm">
              <Plus className="w-4 h-4" /> Add Language
            </Button>
          </div>
        </div>

        {languages.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border rounded-2xl bg-card/40">
            <Globe className="w-10 h-10 mx-auto text-muted-foreground/60 mb-2" />
            <p className="text-sm text-muted-foreground mb-3">No languages defined yet.</p>
            <Button size="sm" variant="outline" onClick={seedLanguages}>
              Seed from CV
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {languages.map((item, index) => {
              const isBusy = langBusyId === item.id;

              return (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl border border-border bg-card/60 backdrop-blur-sm space-y-4 transition-all hover:border-primary/30"
                >
                  <div className="flex items-center justify-between border-b border-border/50 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => void moveLangOrder(index, "up")}
                          className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 rounded hover:bg-card transition-colors"
                          title="Move Up"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={index === languages.length - 1}
                          onClick={() => void moveLangOrder(index, "down")}
                          className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 rounded hover:bg-card transition-colors"
                          title="Move Down"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="font-semibold text-foreground text-sm">
                        {item.name_en} / {item.name_ru}
                      </span>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                      onClick={() => void removeLanguage(item.id, item.name_en)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Language (EN)</Label>
                      <Input
                        value={item.name_en}
                        onChange={(e) => updateLanguage(item.id, { name_en: e.target.value })}
                        placeholder="e.g. English"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Proficiency (EN)</Label>
                      <Input
                        value={item.level_en}
                        onChange={(e) => updateLanguage(item.id, { level_en: e.target.value })}
                        placeholder="e.g. Professional Working"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Язык (RU)</Label>
                      <Input
                        value={item.name_ru}
                        onChange={(e) => updateLanguage(item.id, { name_ru: e.target.value })}
                        placeholder="например, Английский"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Уровень (RU)</Label>
                      <Input
                        value={item.level_ru}
                        onChange={(e) => updateLanguage(item.id, { level_ru: e.target.value })}
                        placeholder="например, Профессиональный"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <Button
                      size="sm"
                      onClick={() => void saveLanguage(item)}
                      disabled={isBusy}
                    >
                      {isBusy ? "Saving..." : "Save Language"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
