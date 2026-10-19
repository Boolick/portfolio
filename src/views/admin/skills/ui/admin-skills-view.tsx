"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, Cpu, MoveUp, MoveDown, X } from "lucide-react";
import { type SkillCategory, fallbackSkillCategories } from "@/entities/skill";
import {
  getAdminSkills,
  saveAdminSkillCategory,
  deleteAdminSkillCategory,
} from "@/features/admin";
import {
  Button,
  Input,
  Label,
  Badge,
  toast,
} from "@/shared/ui";

export function AdminSkillsView() {
  const [items, setItems] = useState<SkillCategory[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [newSkillInput, setNewSkillInput] = useState<Record<string, string>>({});

  const reload = useCallback(async () => {
    const res = await getAdminSkills();
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
      const res = await saveAdminSkillCategory(cat);
      if (!res.success) {
        toast.error(res.error.message);
      } else {
        toast.success(`Category "${cat.name_en}" saved!`);
        void reload();
      }
    } catch {
      toast.error("Error saving category");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;
    try {
      const res = await deleteAdminSkillCategory(id);
      if (!res.success) {
        toast.error(res.error.message);
      } else {
        toast.success("Category deleted");
        void reload();
      }
    } catch {
      toast.error("Delete error");
    }
  };

  const create = async () => {
    const newCat: Partial<SkillCategory> = {
      name_en: "New Category",
      name_ru: "Новая категория",
      skills: ["Skill 1", "Skill 2"],
      sort_order: items.length + 1,
    };

    const res = await saveAdminSkillCategory(newCat);
    if (!res.success) {
      toast.error(res.error.message);
    } else {
      toast.success("New skill category created!");
      void reload();
    }
  };

  const seed = async () => {
    if (!confirm("Populate your database with default skill categories? Continue?")) return;
    try {
      for (const cat of fallbackSkillCategories) {
        const { id: _id, ...rest } = cat;
        await saveAdminSkillCategory(rest);
      }
      toast.success("Default skills seeded successfully!");
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
      await saveAdminSkillCategory({ id: it.id, sort_order: it.sort_order });
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
          <Button onClick={create} className="gap-2 cursor-pointer">
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

      {/* Categories list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((cat, idx) => {
          const isBusy = busyId === cat.id;

          return (
            <div
              key={cat.id}
              className="p-6 rounded-2xl border border-border bg-card/60 backdrop-blur-sm space-y-5 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Order and Delete top bar */}
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground font-semibold">
                      #{cat.sort_order}
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

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    onClick={() => void remove(cat.id, cat.name_en)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Name EN & RU */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Category Name (EN)</Label>
                    <Input
                      value={cat.name_en}
                      onChange={(e) => update(cat.id, { name_en: e.target.value })}
                      placeholder="e.g. Core Frontend"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Category Name (RU)</Label>
                    <Input
                      value={cat.name_ru}
                      onChange={(e) => update(cat.id, { name_ru: e.target.value })}
                      placeholder="e.g. Основной фронтенд"
                    />
                  </div>
                </div>

                {/* Badges / Chips list */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Skills List ({cat.skills.length})</Label>
                  <div className="flex flex-wrap gap-1.5 min-h-[40px] p-2 rounded-lg border border-input bg-background/50">
                    {cat.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="gap-1 pl-2.5 pr-1 py-1 text-xs font-normal"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => removeSkillTag(cat.id, skill)}
                          className="hover:bg-muted-foreground/20 rounded-full p-0.5 text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                    {cat.skills.length === 0 && (
                      <span className="text-xs text-muted-foreground p-1">No skills added yet</span>
                    )}
                  </div>
                </div>

                {/* Add new skill inline */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add skill (e.g. Next.js, Redux)..."
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
                    className="text-xs"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => addSkillTag(cat.id)}
                    className="shrink-0 text-xs"
                  >
                    Add
                  </Button>
                </div>
              </div>

              {/* Save Footer */}
              <div className="pt-3 border-t border-border/50 flex justify-end">
                <Button
                  size="sm"
                  disabled={isBusy}
                  onClick={() => void save(cat)}
                  className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0 cursor-pointer shadow-md"
                >
                  {isBusy ? "Saving…" : "Save Category"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
