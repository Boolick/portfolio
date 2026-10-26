"use client";

import { useEffect, useState, useCallback, type FormEvent } from "react";
import { Plus, Trash2, GraduationCap, Globe, MoveUp, MoveDown } from "lucide-react";
import { type Education, fallbackEducation } from "@/entities/education";
import { type Language, fallbackLanguages } from "@/entities/language";
import {
  getAdminEducation,
  saveAdminEducation,
  getAdminLanguages,
  saveAdminLanguage,
  deleteAdminLanguage,
} from "@/features/admin";
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

export function AdminEducationView() {
  const [edu, setEdu] = useState<Education | null>(null);
  const [eduBusy, setEduBusy] = useState(false);
  const [eduTab, setEduTab] = useState<"en" | "ru">("en");

  const [languages, setLanguages] = useState<Language[]>([]);
  const [langBusyId, setLangBusyId] = useState<string | null>(null);

  // Load Education & Languages via BFF Server Actions
  const reload = useCallback(async () => {
    // Education
    const eduRes = await getAdminEducation();
    if (eduRes.success && eduRes.data) {
      setEdu(eduRes.data);
    } else {
      setEdu(fallbackEducation);
    }

    // Languages
    const langRes = await getAdminLanguages();
    if (langRes.success) {
      setLanguages(langRes.data);
    } else {
      setLanguages([]);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  // Save Education
  const handleSaveEducation = async (e: FormEvent) => {
    e.preventDefault();
    if (!edu) return;
    setEduBusy(true);

    try {
      const res = await saveAdminEducation(edu);
      if (!res.success) {
        toast.error(res.error.message);
      } else {
        setEdu(res.data);
        toast.success("Education details updated!");
      }
    } catch {
      toast.error("Error saving education");
    } finally {
      setEduBusy(false);
    }
  };

  // Seed Education
  const seedEducation = async () => {
    if (!confirm("Populate education with default CV data?")) return;
    try {
      const { id: _id, ...payload } = fallbackEducation;
      const res = await saveAdminEducation(payload);
      if (res.success) {
        setEdu(res.data);
        toast.success("Default education seeded!");
      }
    } catch {
      toast.error("Seed error");
    }
  };

  // Language CRUD
  const updateLanguage = (id: string, patch: Partial<Language>) => {
    setLanguages((arr) => arr.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  };

  const handleSaveLanguage = async (item: Language) => {
    setLangBusyId(item.id);
    try {
      const res = await saveAdminLanguage(item);
      if (!res.success) {
        toast.error(res.error.message);
      } else {
        toast.success(`Language "${item.name_en}" saved!`);
        void reload();
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
      const res = await deleteAdminLanguage(id);
      if (!res.success) {
        toast.error(res.error.message);
      } else {
        toast.success("Language deleted");
        void reload();
      }
    } catch {
      toast.error("Delete error");
    }
  };

  const createLanguage = async () => {
    const newLang: Partial<Language> = {
      name_en: "New Language",
      name_ru: "Новый язык",
      level_en: "Fluent / C1",
      level_ru: "Свободный / C1",
      sort_order: languages.length + 1,
    };

    const res = await saveAdminLanguage(newLang);
    if (!res.success) {
      toast.error(res.error.message);
    } else {
      toast.success("Language added!");
      void reload();
    }
  };

  const seedLanguages = async () => {
    if (!confirm("Populate languages with default CV data?")) return;
    try {
      for (const lang of fallbackLanguages) {
        const { id: _id, ...rest } = lang;
        await saveAdminLanguage(rest);
      }
      toast.success("Languages seeded!");
      void reload();
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
      await saveAdminLanguage({ id: it.id, sort_order: it.sort_order });
    }
    toast.success("Order updated");
  };

  return (
    <div className="space-y-12">
      {/* SECTION 1: EDUCATION */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4 font-mono">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-5 h-5 text-primary" />
            <div>
              <h2 className="text-xl font-bold uppercase tracking-tight text-foreground">Formal Education</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                University degree and additional specialized professional training courses.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!edu && (
              <Button variant="outline" size="sm" onClick={seedEducation} className="text-xs uppercase tracking-wider rounded-none">
                Seed default education
              </Button>
            )}
            <Tabs
              value={eduTab}
              onValueChange={(val) => setEduTab(val as "en" | "ru")}
              className="w-[200px]"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="ru">Русский</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {edu && (
          <form onSubmit={handleSaveEducation} className="chassis-module p-6 sm:p-8 space-y-6">
            {/* Year */}
            <div className="space-y-1.5 max-w-xs">
              <Label className="text-xs font-medium">Study Period / Year</Label>
              <Input
                value={edu.year}
                onChange={(e) => setEdu({ ...edu, year: e.target.value })}
                placeholder="2006 — 2011"
              />
            </div>

            {/* Language Tabs Area */}
            {eduTab === "en" ? (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Degree / Major (EN)</Label>
                    <Input
                      value={edu.degree_en}
                      onChange={(e) => setEdu({ ...edu, degree_en: e.target.value })}
                      placeholder="e.g. Higher Technical Education"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Institution / University (EN)</Label>
                    <Input
                      value={edu.institution_en}
                      onChange={(e) => setEdu({ ...edu, institution_en: e.target.value })}
                      placeholder="e.g. BSTU"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">
                    Additional Professional Courses (EN) — one bullet per line
                  </Label>
                  <Textarea
                    rows={4}
                    value={edu.additional_en.join("\n")}
                    onChange={(e) =>
                      setEdu({
                        ...edu,
                        additional_en: e.target.value.split("\n").filter(Boolean),
                      })
                    }
                    className="font-sans text-sm leading-relaxed"
                    placeholder="RS School — JavaScript / React&#10;SkyPro — Frontend"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Специальность / Степень (RU)</Label>
                    <Input
                      value={edu.degree_ru}
                      onChange={(e) => setEdu({ ...edu, degree_ru: e.target.value })}
                      placeholder="напр. Высшее техническое образование"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Учебное заведение (RU)</Label>
                    <Input
                      value={edu.institution_ru}
                      onChange={(e) => setEdu({ ...edu, institution_ru: e.target.value })}
                      placeholder="напр. БГТУ"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">
                    Курсы и повышение квалификации (RU) — по одному на строку
                  </Label>
                  <Textarea
                    rows={4}
                    value={edu.additional_ru.join("\n")}
                    onChange={(e) =>
                      setEdu({
                        ...edu,
                        additional_ru: e.target.value.split("\n").filter(Boolean),
                      })
                    }
                    className="font-sans text-sm leading-relaxed"
                    placeholder="RS School — JavaScript / React&#10;SkyPro — Фронтенд разработка"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-border font-mono">
              <Button
                type="submit"
                disabled={eduBusy}
                className="tactile-btn text-xs uppercase tracking-wider cursor-pointer"
              >
                {eduBusy ? "SAVING..." : "SAVE EDUCATION"}
              </Button>
            </div>
          </form>
        )}
      </section>

      {/* SECTION 2: LANGUAGES */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4 font-mono">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-primary" />
            <div>
              <h2 className="text-xl font-bold uppercase tracking-tight text-foreground">Languages</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Spoken and written language competencies with proficiency levels.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {languages.length === 0 && (
              <Button variant="outline" size="sm" onClick={seedLanguages} className="text-xs uppercase tracking-wider rounded-none">
                Seed default languages
              </Button>
            )}
            <Button onClick={createLanguage} size="sm" className="gap-1.5 cursor-pointer tactile-btn text-xs uppercase tracking-wider">
              <Plus className="w-4 h-4" /> Add Language
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {languages.map((lang, idx) => {
            const isBusy = langBusyId === lang.id;

            return (
              <div
                key={lang.id}
                className="chassis-module p-5 space-y-4"
              >
                {/* Header bar */}
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 bg-muted text-muted-foreground font-semibold">
                      #{lang.sort_order}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        disabled={idx === 0}
                        onClick={() => void moveLangOrder(idx, "up")}
                      >
                        <MoveUp className="w-3 h-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        disabled={idx === languages.length - 1}
                        onClick={() => void moveLangOrder(idx, "down")}
                      >
                        <MoveDown className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:bg-destructive/10"
                    onClick={() => void removeLanguage(lang.id, lang.name_en)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>

                {/* Inputs: EN vs RU */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-mono uppercase text-muted-foreground">Name (EN)</Label>
                    <Input
                      value={lang.name_en}
                      onChange={(e) => updateLanguage(lang.id, { name_en: e.target.value })}
                      placeholder="e.g. English"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-mono uppercase text-muted-foreground">Proficiency Level (EN)</Label>
                    <Input
                      value={lang.level_en}
                      onChange={(e) => updateLanguage(lang.id, { level_en: e.target.value })}
                      placeholder="e.g. B2 / Professional"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-mono uppercase text-muted-foreground">Название (RU)</Label>
                    <Input
                      value={lang.name_ru}
                      onChange={(e) => updateLanguage(lang.id, { name_ru: e.target.value })}
                      placeholder="напр. Английский"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-mono uppercase text-muted-foreground">Уровень владения (RU)</Label>
                    <Input
                      value={lang.level_ru}
                      onChange={(e) => updateLanguage(lang.id, { level_ru: e.target.value })}
                      placeholder="напр. B2 / Рабочий"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-3 border-t border-border font-mono">
                  <Button
                    size="sm"
                    disabled={isBusy}
                    onClick={() => void handleSaveLanguage(lang)}
                    className="tactile-btn text-xs uppercase tracking-wider cursor-pointer"
                  >
                    {isBusy ? "SAVING..." : "SAVE LANGUAGE"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
