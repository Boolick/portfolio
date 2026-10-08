"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, Briefcase, MoveUp, MoveDown } from "lucide-react";
import { getSupabaseBrowserClient } from "@/shared/api/supabase";
import { type Experience, fallbackExperiences } from "@/entities/experience";
import {
  Button,
  Input,
  Label,
  Textarea,
  Switch,
  toast,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/shared/ui";
import { revalidatePortfolio } from "@/shared/api/revalidate";

export function AdminExperiencesView() {
  const [items, setItems] = useState<Experience[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [langTabs, setLangTabs] = useState<Record<string, "en" | "ru">>({});

  const supabase = getSupabaseBrowserClient();

  const reload = useCallback(async () => {
    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      toast.error("Error loading experiences: " + error.message);
    } else if (data && data.length > 0) {
      setItems(data as Experience[]);
    } else {
      setItems([]);
    }
  }, [supabase]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const update = (id: string, patch: Partial<Experience>) => {
    setItems((arr) => arr.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const getLangTab = (id: string) => langTabs[id] ?? "en";
  const setLangTab = (id: string, tab: "en" | "ru") => {
    setLangTabs((prev) => ({ ...prev, [id]: tab }));
  };

  const save = async (exp: Experience) => {
    setBusyId(exp.id);
    try {
      const { id, created_at: _c, updated_at: _u, ...payload } = exp;
      const { error } = await supabase.from("experiences").update(payload).eq("id", id);
      if (error) {
        toast.error("Failed to save: " + error.message);
      } else {
        toast.success(`Experience at "${exp.company}" saved!`);
        void revalidatePortfolio("/");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error saving experience");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id: string, company: string) => {
    if (!confirm(`Are you sure you want to delete experience at "${company}"?`)) return;
    try {
      const { error } = await supabase.from("experiences").delete().eq("id", id);
      if (error) {
        toast.error("Delete failed: " + error.message);
      } else {
        toast.success("Experience deleted");
        void revalidatePortfolio("/");
        void reload();
      }
    } catch {
      toast.error("Delete error");
    }
  };

  const create = async () => {
    const newExp = {
      company: "Company Name",
      title_en: "Senior Frontend Engineer",
      title_ru: "Ведущий фронтенд-разработчик",
      period_en: "2024 — Present",
      period_ru: "2024 — Наст. время",
      location_en: "Remote",
      location_ru: "Удаленно",
      description_en: ["Led development of web applications", "Improved performance and DX"],
      description_ru: ["Руководил разработкой веб-приложений", "Улучшил производительность и DX"],
      stack: ["React", "TypeScript", "Next.js"],
      is_commercial: true,
      sort_order: items.length + 1,
    };

    const { data, error } = await supabase
      .from("experiences")
      .insert(newExp)
      .select()
      .single();

    if (error) {
      toast.error("Failed to create experience: " + error.message);
    } else if (data) {
      toast.success("New experience added!");
      setItems((prev) => [...prev, data as Experience]);
      void revalidatePortfolio("/");
    }
  };

  const seed = async () => {
    if (!confirm("This will populate the database with default experience records from your CV. Continue?")) return;
    try {
      const payloads = fallbackExperiences.map(({ id: _id, ...rest }, idx) => ({
        ...rest,
        sort_order: idx + 1,
      }));

      const { error } = await supabase.from("experiences").insert(payloads);
      if (error) {
        toast.error("Seed error: " + error.message);
      } else {
        toast.success("Default experiences seeded!");
        void revalidatePortfolio("/");
        void reload();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Seed failed");
    }
  };

  const moveOrder = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    // Re-assign sort_orders
    const updated = newItems.map((item, idx) => ({ ...item, sort_order: idx + 1 }));
    setItems(updated);

    // Save sort orders to database
    for (const it of updated) {
      await supabase.from("experiences").update({ sort_order: it.sort_order }).eq("id", it.id);
    }
    toast.success("Order updated");
  };

  return (
    <div className="space-y-8">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Work Experience</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your career history with dedicated English and Russian translations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {items.length === 0 && (
            <Button variant="outline" onClick={seed}>
              Seed default data
            </Button>
          )}
          <Button onClick={create} className="gap-2">
            <Plus className="w-4 h-4" /> Add Experience
          </Button>
        </div>
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="text-center py-16 border border-dashed border-border rounded-2xl bg-card/40">
          <Briefcase className="w-12 h-12 mx-auto text-muted-foreground/60 mb-3" />
          <h3 className="text-lg font-medium text-foreground">No experiences found</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1 mb-4">
            Your database table is currently empty. You can add a new job or seed it with existing CV entries.
          </p>
          <div className="flex justify-center gap-3">
            <Button onClick={seed} variant="outline">
              Seed from CV
            </Button>
            <Button onClick={create}>Add first experience</Button>
          </div>
        </div>
      )}

      {/* Experience list */}
      <div className="space-y-6">
        {items.map((exp, index) => {
          const activeTab = getLangTab(exp.id);
          const isBusy = busyId === exp.id;

          return (
            <div
              key={exp.id}
              className="p-6 rounded-2xl border border-border bg-card/60 backdrop-blur-sm space-y-6 transition-all hover:border-primary/30"
            >
              {/* Card top bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => void moveOrder(index, "up")}
                      className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 rounded hover:bg-card transition-colors"
                      title="Move Up"
                    >
                      <MoveUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={index === items.length - 1}
                      onClick={() => void moveOrder(index, "down")}
                      className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 rounded hover:bg-card transition-colors"
                      title="Move Down"
                    >
                      <MoveDown className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <span className="text-base font-semibold text-foreground">
                      {exp.company || "Untitled Company"}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">
                      ({exp.title_en || exp.title_ru})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 pr-2 border-r border-border">
                    <Switch
                      id={`comm-${exp.id}`}
                      checked={exp.is_commercial}
                      onCheckedChange={(checked) => update(exp.id, { is_commercial: checked })}
                    />
                    <Label htmlFor={`comm-${exp.id}`} className="text-xs cursor-pointer">
                      Commercial
                    </Label>
                  </div>

                  <Tabs
                    value={activeTab}
                    onValueChange={(val) => setLangTab(exp.id, val as "en" | "ru")}
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

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                    onClick={() => void remove(exp.id, exp.company)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Shared fields: Company & Tech Stack */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Company Name</Label>
                  <Input
                    value={exp.company}
                    onChange={(e) => update(exp.id, { company: e.target.value })}
                    placeholder="e.g. Acme Corp"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Tech Stack (comma separated)</Label>
                  <Input
                    value={exp.stack.join(", ")}
                    onChange={(e) =>
                      update(exp.id, {
                        stack: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="React, TypeScript, Next.js, Tailwind"
                  />
                </div>
              </div>

              {/* Bilingual Fields */}
              {activeTab === "en" ? (
                <div className="space-y-4 p-4 rounded-xl bg-muted/20 border border-border/50">
                  <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
                    🇬🇧 English Content
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Job Title (EN)</Label>
                      <Input
                        value={exp.title_en}
                        onChange={(e) => update(exp.id, { title_en: e.target.value })}
                        placeholder="e.g. Senior Frontend Engineer"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Period (EN)</Label>
                      <Input
                        value={exp.period_en}
                        onChange={(e) => update(exp.id, { period_en: e.target.value })}
                        placeholder="e.g. 2022 — Present"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Location (EN)</Label>
                      <Input
                        value={exp.location_en}
                        onChange={(e) => update(exp.id, { location_en: e.target.value })}
                        placeholder="e.g. Remote / Berlin"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">
                      Key Responsibilities & Achievements (EN) — one bullet point per line
                    </Label>
                    <Textarea
                      rows={4}
                      value={exp.description_en.join("\n")}
                      onChange={(e) =>
                        update(exp.id, {
                          description_en: e.target.value
                            .split("\n")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        })
                      }
                      placeholder="Spearheaded the redesign...&#10;Mentored 4 junior engineers...&#10;Boosted Lighthouse performance score to 98"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 p-4 rounded-xl bg-muted/20 border border-border/50">
                  <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
                    🇷🇺 Русская версия
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Должность (RU)</Label>
                      <Input
                        value={exp.title_ru}
                        onChange={(e) => update(exp.id, { title_ru: e.target.value })}
                        placeholder="например, Ведущий фронтенд-разработчик"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Период (RU)</Label>
                      <Input
                        value={exp.period_ru}
                        onChange={(e) => update(exp.id, { period_ru: e.target.value })}
                        placeholder="например, 2022 — Наст. время"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Локация (RU)</Label>
                      <Input
                        value={exp.location_ru}
                        onChange={(e) => update(exp.id, { location_ru: e.target.value })}
                        placeholder="например, Удаленно"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">
                      Обязанности и достижения (RU) — по одному пункту на строке
                    </Label>
                    <Textarea
                      rows={4}
                      value={exp.description_ru.join("\n")}
                      onChange={(e) =>
                        update(exp.id, {
                          description_ru: e.target.value
                            .split("\n")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        })
                      }
                      placeholder="Руководил проектированием архитектуры...&#10;Оптимизировал скорость загрузки до 98 баллов Lighthouse"
                    />
                  </div>
                </div>
              )}

              {/* Action Save button */}
              <div className="flex justify-end gap-3 pt-2">
                <Button onClick={() => void save(exp)} disabled={isBusy}>
                  {isBusy ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
