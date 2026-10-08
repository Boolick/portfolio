"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, Cpu, MoveUp, MoveDown, X } from "lucide-react";
import { getSupabaseBrowserClient } from "@/shared/api/supabase";
import { type SkillCategory, fallbackSkillCategories } from "@/entities/skill";
import {
  Button,
  Input,
  Label,
  Badge,
  toast,
} from "@/shared/ui";
import { revalidatePortfolio } from "@/shared/api/revalidate";

export function AdminSkillsView() {
  const [items, setItems] = useState<SkillCategory[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [newSkillInput, setNewSkillInput] = useState<Record<string, string>>({});

  const supabase = getSupabaseBrowserClient();

  const reload = useCallback(async () => {
    const { data, error } = await supabase
      .from("skill_categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      toast.error("Error loading skills: " + error.message);
    } else if (data && data.length > 0) {
      setItems(data as SkillCategory[]);
    } else {
      setItems([]);
    }
  }, [supabase]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const update = (id: string, patch: Partial<SkillCategory>) => {
    setItems((arr) => arr.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const addSkillTag = (catId: string) => {
    const text = (newSkillInput[catId] ?? "").trim();
    if (!text) return;
    setItems((arr) =>
      arr.map((item) => {
        if (item.id !== catId) return item;
        if (item.skills.includes(text)) return item;
        return { ...item, skills: [...item.skills, text] };
      })
    );
    setNewSkillInput((prev) => ({ ...prev, [catId]: "" }));
  };

  const removeSkillTag = (catId: string, skillToRemove: string) => {
    setItems((arr) =>
      arr.map((item) => {
        if (item.id !== catId) return item;
        return { ...item, skills: item.skills.filter((s) => s !== skillToRemove) };
      })
    );
  };

  const save = async (cat: SkillCategory) => {
    setBusyId(cat.id);
    try {
      const { id, created_at: _c, updated_at: _u, ...payload } = cat;
      const { error } = await supabase.from("skill_categories").update(payload).eq("id", id);
      if (error) {
        toast.error("Failed to save: " + error.message);
      } else {
        toast.success(`Category "${cat.name_en}" saved!`);
        void revalidatePortfolio("/");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error saving category");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;
    try {
      const { error } = await supabase.from("skill_categories").delete().eq("id", id);
      if (error) {
        toast.error("Delete failed: " + error.message);
      } else {
        toast.success("Category deleted");
        void revalidatePortfolio("/");
        void reload();
      }
    } catch {
      toast.error("Delete error");
    }
  };

  const create = async () => {
    const newCat = {
      name_en: "New Category",
      name_ru: "Новая категория",
      skills: ["Skill 1", "Skill 2"],
      sort_order: items.length + 1,
    };

    const { data, error } = await supabase
      .from("skill_categories")
      .insert(newCat)
      .select()
      .single();

    if (error) {
      toast.error("Failed to create category: " + error.message);
    } else if (data) {
      toast.success("New skill category created!");
      setItems((prev) => [...prev, data as SkillCategory]);
      void revalidatePortfolio("/");
    }
  };

  const seed = async () => {
    if (!confirm("This will populate your database with default skill categories. Continue?")) return;
    try {
      const payloads = fallbackSkillCategories.map(({ id: _id, ...rest }, idx) => ({
        ...rest,
        sort_order: idx + 1,
      }));

      const { error } = await supabase.from("skill_categories").insert(payloads);
      if (error) {
        toast.error("Seed error: " + error.message);
      } else {
        toast.success("Default skills seeded successfully!");
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

    const updated = newItems.map((item, idx) => ({ ...item, sort_order: idx + 1 }));
    setItems(updated);

    for (const it of updated) {
      await supabase.from("skill_categories").update({ sort_order: it.sort_order }).eq("id", it.id);
    }
    toast.success("Order updated");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Skill Categories</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Organize tech stack and skill competencies with bilingual category headers.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {items.length === 0 && (
            <Button variant="outline" onClick={seed}>
              Seed default data
            </Button>
          )}
          <Button onClick={create} className="gap-2">
            <Plus className="w-4 h-4" /> Add Category
          </Button>
        </div>
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="text-center py-16 border border-dashed border-border rounded-2xl bg-card/40">
          <Cpu className="w-12 h-12 mx-auto text-muted-foreground/60 mb-3" />
          <h3 className="text-lg font-medium text-foreground">No skill categories</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1 mb-4">
            Create categories for your Frontend, Backend, Tools, etc., or seed from existing CV data.
          </p>
          <div className="flex justify-center gap-3">
            <Button onClick={seed} variant="outline">
              Seed from CV
            </Button>
            <Button onClick={create}>Add Category</Button>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="space-y-6">
        {items.map((cat, index) => {
          const isBusy = busyId === cat.id;

          return (
            <div
              key={cat.id}
              className="p-6 rounded-2xl border border-border bg-card/60 backdrop-blur-sm space-y-6 transition-all hover:border-primary/30"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
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
                  <span className="text-base font-semibold text-foreground">
                    {cat.name_en || "Untitled Category"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({cat.skills.length} skills)
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                  onClick={() => void remove(cat.id, cat.name_en)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Bilingual Category Names */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Category Name (EN)</Label>
                  <Input
                    value={cat.name_en}
                    onChange={(e) => update(cat.id, { name_en: e.target.value })}
                    placeholder="e.g. Core Frontend & Frameworks"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Category Name (RU)</Label>
                  <Input
                    value={cat.name_ru}
                    onChange={(e) => update(cat.id, { name_ru: e.target.value })}
                    placeholder="например, Основной фронтенд и фреймворки"
                  />
                </div>
              </div>

              {/* Skills Tags Manager */}
              <div className="space-y-3">
                <Label className="text-xs">Skills in this category</Label>
                <div className="flex flex-wrap gap-2 min-h-[38px] p-3 rounded-xl border border-border bg-background/60">
                  {cat.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="gap-1.5 py-1 px-2.5 text-xs font-medium"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkillTag(cat.id, skill)}
                        className="text-muted-foreground hover:text-foreground ml-0.5 rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                  {cat.skills.length === 0 && (
                    <span className="text-xs text-muted-foreground italic py-1">
                      No skills added yet
                    </span>
                  )}
                </div>

                {/* Add new skill input */}
                <div className="flex gap-2">
                  <Input
                    value={newSkillInput[cat.id] ?? ""}
                    onChange={(e) =>
                      setNewSkillInput((prev) => ({ ...prev, [cat.id]: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkillTag(cat.id);
                      }
                    }}
                    placeholder="Type skill name and press Enter or click Add (e.g. Next.js 15)"
                    className="text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addSkillTag(cat.id)}
                    className="shrink-0"
                  >
                    Add Skill
                  </Button>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-2">
                <Button onClick={() => void save(cat)} disabled={isBusy}>
                  {isBusy ? "Saving..." : "Save category"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
