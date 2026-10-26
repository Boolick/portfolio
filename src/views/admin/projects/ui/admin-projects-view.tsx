"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Plus, Trash2, Upload, Image as ImageIcon } from "lucide-react";
import { type Project, fallbackProjects } from "@/entities/project";
import {
  getAdminProjects,
  saveAdminProject,
  deleteAdminProject,
  uploadAdminProjectImage,
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

export function AdminProjectsView() {
  const [items, setItems] = useState<Project[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [langTabs, setLangTabs] = useState<Record<string, "en" | "ru">>({});

  const reload = useCallback(async () => {
    const res = await getAdminProjects();
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

  const update = (id: string, patch: Partial<Project>) => {
    setItems((arr) => arr.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  const getLangTab = (id: string) => langTabs[id] ?? "en";
  const setLangTab = (id: string, tab: "en" | "ru") => {
    setLangTabs((prev) => ({ ...prev, [id]: tab }));
  };

  const save = async (project: Project) => {
    setBusyId(project.id);
    try {
      const res = await saveAdminProject(project);
      if (!res.success) {
        toast.error(res.error.message);
      } else {
        toast.success(`Project "${project.title_en}" saved!`);
        void reload();
      }
    } catch {
      toast.error("Error saving project");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await deleteAdminProject(id);
      if (!res.success) {
        toast.error(res.error.message);
      } else {
        toast.success("Project deleted");
        void reload();
      }
    } catch {
      toast.error("Delete error");
    }
  };

  const create = async () => {
    const slug = `project-${Date.now()}`;
    const newProj: Partial<Project> = {
      slug,
      title_en: "New Project",
      title_ru: "Новый проект",
      description_en: "Project description",
      description_ru: "Описание проекта",
      long_description_en: "Detailed project case study...",
      long_description_ru: "Подробный кейс проекта...",
      link: "",
      image_url: "",
      tags: ["React", "TypeScript"],
      sort_order: items.length + 1,
      published: false,
    };

    const res = await saveAdminProject(newProj);
    if (!res.success) {
      toast.error(res.error.message);
    } else {
      toast.success("New project draft created");
      void reload();
    }
  };

  const seedFromDefaults = async () => {
    if (!confirm("Populate Supabase with standard initial projects from portfolio?")) return;
    setBusyId("seed");
    try {
      for (const p of fallbackProjects) {
        const { id: _id, ...rest } = p;
        await saveAdminProject(rest);
      }
      toast.success("Projects populated successfully!");
      void reload();
    } catch {
      toast.error("Seed error");
    } finally {
      setBusyId(null);
    }
  };

  const uploadImage = async (project: Project, file: File) => {
    setBusyId(project.id);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await uploadAdminProjectImage(formData);
      if (!uploadRes.success) {
        toast.error(uploadRes.error.message);
        return;
      }

      const publicUrl = uploadRes.data;
      await saveAdminProject({ ...project, image_url: publicUrl });
      update(project.id, { image_url: publicUrl });
      toast.success("Image uploaded to project-images storage!");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-mono uppercase tracking-tight">Projects Management</h2>
          <p className="text-xs font-mono text-muted-foreground mt-0.5">
            Create, edit, localize, and publish portfolio modules.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono">
          {items.length === 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={seedFromDefaults}
              disabled={busyId === "seed"}
              className="text-xs uppercase tracking-wider rounded-none"
            >
              Seed Initial Projects
            </Button>
          )}
          <Button onClick={create} size="sm" className="gap-1.5 cursor-pointer tactile-btn text-xs uppercase tracking-wider">
            <Plus className="h-4 w-4" /> Add Project
          </Button>
        </div>
      </div>

      {items.length === 0 && (
        <div className="chassis-module p-12 text-center space-y-3 font-mono">
          <p className="text-muted-foreground text-xs uppercase">No projects found in Supabase.</p>
          <Button onClick={create} size="sm" className="tactile-btn text-xs uppercase tracking-wider">
            Create First Project
          </Button>
        </div>
      )}

      {items.map((project) => {
        const lang = getLangTab(project.id);
        const isBusy = busyId === project.id;

        return (
          <div key={project.id} className="chassis-module p-6 sm:p-8 space-y-5">
            {/* Top row: Slug, Order, Published switch */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-mono uppercase text-muted-foreground">
                    URL Slug
                  </Label>
                  <Input
                    value={project.slug}
                    onChange={(e) => update(project.id, { slug: e.target.value })}
                    className="mt-1 font-mono text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs font-mono uppercase text-muted-foreground">
                    Sort Order
                  </Label>
                  <Input
                    type="number"
                    value={project.sort_order}
                    onChange={(e) =>
                      update(project.id, { sort_order: Number(e.target.value) })
                    }
                    className="mt-1 font-mono text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  checked={project.published}
                  onCheckedChange={(checked) => update(project.id, { published: checked })}
                />
                <span className="text-xs font-medium text-muted-foreground">
                  {project.published ? "Published (Visible)" : "Draft (Hidden)"}
                </span>
              </div>
            </div>

            {/* Language Switcher Tabs for EN / RU editing */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Content Localization
              </span>
              <Tabs
                value={lang}
                onValueChange={(val) => setLangTab(project.id, val as "en" | "ru")}
              >
                <TabsList>
                  <TabsTrigger value="en">🇬🇧 English</TabsTrigger>
                  <TabsTrigger value="ru">🇷🇺 Русский</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* English Fields */}
            {lang === "en" && (
              <div className="space-y-4">
                <div>
                  <Label className="text-xs font-mono uppercase text-muted-foreground">
                    Title (EN)
                  </Label>
                  <Input
                    value={project.title_en}
                    onChange={(e) => update(project.id, { title_en: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label className="text-xs font-mono uppercase text-muted-foreground">
                    Short Description (EN)
                  </Label>
                  <Textarea
                    value={project.description_en}
                    onChange={(e) => update(project.id, { description_en: e.target.value })}
                    rows={2}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label className="text-xs font-mono uppercase text-muted-foreground">
                    Detailed Description / Case Study (EN)
                  </Label>
                  <Textarea
                    value={project.long_description_en}
                    onChange={(e) =>
                      update(project.id, { long_description_en: e.target.value })
                    }
                    rows={4}
                    className="mt-1.5"
                  />
                </div>
              </div>
            )}

            {/* Russian Fields */}
            {lang === "ru" && (
              <div className="space-y-4">
                <div>
                  <Label className="text-xs font-mono uppercase text-muted-foreground">
                    Название (RU)
                  </Label>
                  <Input
                    value={project.title_ru}
                    onChange={(e) => update(project.id, { title_ru: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label className="text-xs font-mono uppercase text-muted-foreground">
                    Краткое описание (RU)
                  </Label>
                  <Textarea
                    value={project.description_ru}
                    onChange={(e) => update(project.id, { description_ru: e.target.value })}
                    rows={2}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label className="text-xs font-mono uppercase text-muted-foreground">
                    Подробное описание / Кейс (RU)
                  </Label>
                  <Textarea
                    value={project.long_description_ru}
                    onChange={(e) =>
                      update(project.id, { long_description_ru: e.target.value })
                    }
                    rows={4}
                    className="mt-1.5"
                  />
                </div>
              </div>
            )}

            {/* General Meta: Link & Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-border/40">
              <div>
                <Label className="text-xs font-mono uppercase text-muted-foreground">
                  Live Project URL
                </Label>
                <Input
                  value={project.link}
                  onChange={(e) => update(project.id, { link: e.target.value })}
                  className="mt-1.5"
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label className="text-xs font-mono uppercase text-muted-foreground">
                  Tags (comma separated)
                </Label>
                <Input
                  value={project.tags.join(", ")}
                  onChange={(e) =>
                    update(project.id, {
                      tags: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="mt-1.5 font-mono text-sm"
                  placeholder="React, Next.js, Supabase"
                />
              </div>
            </div>

            {/* Media / Storage Image Upload */}
            <div className="pt-2">
              <Label className="text-xs font-mono uppercase text-muted-foreground">
                Project Screenshot / Cover Image
              </Label>
              <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {project.image_url ? (
                  <div className="relative w-32 h-20 rounded-none overflow-hidden border border-border bg-muted shrink-0">
                    <Image
                      src={project.image_url}
                      alt={project.title_en}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-20 rounded-none border border-dashed border-border bg-muted/40 flex items-center justify-center text-muted-foreground shrink-0">
                    <ImageIcon className="h-6 w-6 opacity-40" />
                  </div>
                )}
                <div className="flex-1 w-full space-y-2">
                  <div className="flex gap-2 font-mono">
                    <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-none border border-input bg-card hover:bg-muted cursor-pointer text-xs uppercase tracking-wider font-mono transition-colors">
                      <Upload className="h-3.5 w-3.5" /> Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) void uploadImage(project, file);
                        }}
                      />
                    </label>
                    <Input
                      value={project.image_url}
                      onChange={(e) => update(project.id, { image_url: e.target.value })}
                      placeholder="Or enter image URL directly"
                      className="flex-1 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons: Delete & Save */}
            <div className="flex items-center justify-between pt-4 border-t border-border font-mono">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => void remove(project.id, project.title_en)}
                className="gap-1.5 cursor-pointer text-xs uppercase tracking-wider rounded-none"
              >
                <Trash2 className="h-4 w-4" /> Delete Project
              </Button>
              <Button
                size="sm"
                disabled={isBusy}
                onClick={() => void save(project)}
                className="tactile-btn text-xs uppercase tracking-wider cursor-pointer"
              >
                {isBusy ? "SAVING..." : "SAVE PROJECT"}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
