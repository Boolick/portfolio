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
          <h2 className="text-xl font-bold font-mono uppercase tracking-tight text-foreground">Skill Categories</h2>
          <p className="text-xs font-mono text-muted-foreground mt-1">
            Organize tech stack and skill competencies with bilingual category headers.
          </p>
        </div>
        <div className="flex items-center gap-3 font-mono">
          {items.length === 0 && (
            <Button variant="outline" onClick={seed} size="sm" className="text-xs uppercase tracking-wider rounded-none">
              Seed default data
            </Button>
          )}
          <Button onClick={create} size="sm" className="gap-2 cursor-pointer tactile-btn text-xs uppercase tracking-wider">
            <Plus className="w-4 h-4" /> Add Category
          </Button>
        </div>
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="text-center py-16 chassis-module font-mono space-y-3">
          <Cpu className="w-10 h-10 mx-auto text-muted-foreground/60 mb-2" />
          <h3 className="text-base font-bold uppercase text-foreground">No skill categories</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-4">
            Create categories for your Frontend, Backend, Tools, etc., or seed from existing CV data.
          </p>
          <div className="flex justify-center gap-3">
            <Button onClick={seed} variant="outline" size="sm" className="text-xs uppercase tracking-wider rounded-none">
              Seed from CV
            </Button>
            <Button onClick={create} size="sm" className="tactile-btn text-xs uppercase tracking-wider">
              Add Category
            </Button>
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
              className="chassis-module p-6 space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="chassis-header -mx-6 -mt-6 mb-2 px-4 py-2 flex items-center justify-between border-b border-border bg-muted/40 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary inline-block" />
                    REG_BANK // {cat.name_en || "CATEGORY"}
                  </span>
                  <span>[ #{cat.sort_order} ]</span>
                </div>

                {/* Order and Delete top bar */}
                <div className="flex items-center justify-between border-b border-border pb-3">
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
                  <Label className="text-xs font-mono uppercase text-muted-foreground">Skills List ({cat.skills.length})</Label>
                  <div className="flex flex-wrap gap-1.5 min-h-[40px] p-2 border border-border bg-muted/20 font-mono text-xs">
                    {cat.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="gap-1 pl-2 pr-1 py-0.5 text-xs font-mono rounded-none"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => removeSkillTag(cat.id, skill)}
                          className="hover:bg-muted-foreground/20 p-0.5 text-muted-foreground hover:text-foreground cursor-pointer"
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
                <div className="flex gap-2 font-mono">
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
                    className="text-xs font-mono rounded-none"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => addSkillTag(cat.id)}
                    className="shrink-0 text-xs font-mono uppercase tracking-wider rounded-none"
                  >
                    Add
                  </Button>
                </div>
              </div>

              {/* Save Footer */}
              <div className="pt-3 border-t border-border flex justify-end font-mono">
                <Button
                  size="sm"
                  disabled={isBusy}
                  onClick={() => void save(cat)}
                  className="tactile-btn text-xs uppercase tracking-wider cursor-pointer"
                >
                  {isBusy ? "SAVING..." : "SAVE CATEGORY"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
