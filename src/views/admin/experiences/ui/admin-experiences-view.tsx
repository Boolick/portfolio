"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, Briefcase, MoveUp, MoveDown } from "lucide-react";
import { type Experience, fallbackExperiences } from "@/entities/experience";
import {
  getAdminExperiences,
  saveAdminExperience,
  deleteAdminExperience,
} from "@/features/admin";
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

export function AdminExperiencesView() {
  const [items, setItems] = useState<Experience[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [langTabs, setLangTabs] = useState<Record<string, "en" | "ru">>({});

  const reload = useCallback(async () => {
    const res = await getAdminExperiences();
    if (!res.success) {
      toast.error(res.error.message);
      setItems([]);
    } else {
      setItems(res.data);
    }
  }, []);

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
      const res = await saveAdminExperience(exp);
      if (!res.success) {
        toast.error(res.error.message);
      } else {
        toast.success(`Experience at "${exp.company}" saved!`);
        void reload();
      }
    } catch {
      toast.error("Error saving experience");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id: string, company: string) => {
    if (!confirm(`Are you sure you want to delete experience at "${company}"?`)) return;
    try {
      const res = await deleteAdminExperience(id);
      if (!res.success) {
        toast.error(res.error.message);
      } else {
        toast.success("Experience deleted");
        void reload();
      }
    } catch {
      toast.error("Delete error");
    }
  };

  const create = async () => {
    const newExp: Partial<Experience> = {
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

    const res = await saveAdminExperience(newExp);
    if (!res.success) {
      toast.error(res.error.message);
    } else {
      toast.success("New experience added!");
      void reload();
    }
  };

  const seed = async () => {
    if (!confirm("Populate database with default experience records from CV?")) return;
    try {
      for (const exp of fallbackExperiences) {
        const { id: _id, ...rest } = exp;
        await saveAdminExperience(rest);
      }
      toast.success("Default experiences seeded!");
      void reload();
    } catch {
      toast.error("Seed failed");
    }
  };

  const moveOrder = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    const updated = newItems.map((item, idx) => ({ ...item, sort_order: idx + 1 }));
    setItems(updated);

    for (const it of updated) {
      await saveAdminExperience({ id: it.id, sort_order: it.sort_order });
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
          <Button onClick={create} className="gap-2 cursor-pointer">
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
        {items.map((exp, idx) => {
          const tab = getLangTab(exp.id);
          const isBusy = busyId === exp.id;

          return (
            <div
              key={exp.id}
              className="p-6 rounded-2xl border border-border bg-card/60 backdrop-blur-sm space-y-6 shadow-sm"
            >
              {/* Top Row: Meta Controls & Sorting */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/50 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground font-semibold">
                    #{exp.sort_order}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      disabled={idx === 0}
                      onClick={() => void moveOrder(idx, "up")}
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      disabled={idx === items.length - 1}
                      onClick={() => void moveOrder(idx, "down")}
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Switch
                      id={`comm-${exp.id}`}
                      checked={exp.is_commercial}
                      onCheckedChange={(checked) => update(exp.id, { is_commercial: checked })}
                    />
                    <Label htmlFor={`comm-${exp.id}`} className="text-xs text-muted-foreground">
                      Commercial project
                    </Label>
                  </div>

                  <Tabs
                    value={tab}
                    onValueChange={(val) => setLangTab(exp.id, val as "en" | "ru")}
                    className="w-[200px]"
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="en">English</TabsTrigger>
                      <TabsTrigger value="ru">Русский</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>

              {/* Company & Stack (Language agnostic) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Company Name</Label>
                  <Input
                    value={exp.company}
                    onChange={(e) => update(exp.id, { company: e.target.value })}
                    placeholder="e.g. DKMline or Tower Empire"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Tech Stack (comma separated)</Label>
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
                    placeholder="React, TypeScript, Redux, WebSocket"
                  />
                </div>
              </div>

              {/* Localized Content Area */}
              {tab === "en" ? (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Job Title (EN)</Label>
                      <Input
                        value={exp.title_en}
                        onChange={(e) => update(exp.id, { title_en: e.target.value })}
                        placeholder="e.g. Core Frontend Engineer"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Period (EN)</Label>
                      <Input
                        value={exp.period_en}
                        onChange={(e) => update(exp.id, { period_en: e.target.value })}
                        placeholder="e.g. 2023 — 2025"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Location (EN)</Label>
                      <Input
                        value={exp.location_en}
                        onChange={(e) => update(exp.id, { location_en: e.target.value })}
                        placeholder="e.g. Remote"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">
                      Key Highlights & Accomplishments (EN) — one bullet per line
                    </Label>
                    <Textarea
                      rows={5}
                      value={exp.description_en.join("\n")}
                      onChange={(e) =>
                        update(exp.id, {
                          description_en: e.target.value.split("\n").filter(Boolean),
                        })
                      }
                      className="font-sans text-sm leading-relaxed"
                      placeholder="Bullet 1&#10;Bullet 2&#10;Bullet 3"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Должность (RU)</Label>
                      <Input
                        value={exp.title_ru}
                        onChange={(e) => update(exp.id, { title_ru: e.target.value })}
                        placeholder="напр. Ведущий разработчик интерфейсов"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Период работы (RU)</Label>
                      <Input
                        value={exp.period_ru}
                        onChange={(e) => update(exp.id, { period_ru: e.target.value })}
                        placeholder="напр. 2023 — 2025"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Локация (RU)</Label>
                      <Input
                        value={exp.location_ru}
                        onChange={(e) => update(exp.id, { location_ru: e.target.value })}
                        placeholder="напр. Удалённо"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">
                      Обязанности и достижения (RU) — по одному пункту на строку
                    </Label>
                    <Textarea
                      rows={5}
                      value={exp.description_ru.join("\n")}
                      onChange={(e) =>
                        update(exp.id, {
                          description_ru: e.target.value.split("\n").filter(Boolean),
                        })
                      }
                      className="font-sans text-sm leading-relaxed"
                      placeholder="Пункт 1&#10;Пункт 2&#10;Пункт 3"
                    />
                  </div>
                </div>
              )}

              {/* Actions Footer */}
              <div className="flex items-center justify-between border-t border-border/50 pt-4">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => void remove(exp.id, exp.company)}
                  className="gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" /> Delete Experience
                </Button>
                <Button
                  size="sm"
                  disabled={isBusy}
                  onClick={() => void save(exp)}
                  className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0 cursor-pointer shadow-md"
                >
                  {isBusy ? "Saving…" : "Save Experience"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
