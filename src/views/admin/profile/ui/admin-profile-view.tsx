"use client";

import { useEffect, useState, type FormEvent } from "react";
import { getSupabaseBrowserClient } from "@/shared/api/supabase";
import { type Profile, fallbackProfile } from "@/entities/profile";
import { Button, Input, Label, Textarea, toast, Tabs, TabsList, TabsTrigger } from "@/shared/ui";
import { revalidatePortfolio } from "@/shared/api/revalidate";

export function AdminProfileView() {
  const [data, setData] = useState<Profile | null>(null);
  const [busy, setBusy] = useState(false);
  const [activeLangTab, setActiveLangTab] = useState<"en" | "ru">("en");

  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    supabase
      .from("profile")
      .select("*")
      .limit(1)
      .maybeSingle()
      .then(({ data: row, error }) => {
        if (error) {
          toast.error("Failed to load profile: " + error.message);
          setData(fallbackProfile);
        } else if (row) {
          setData(row as Profile);
        } else {
          // Empty DB, use fallback as initial template
          setData(fallbackProfile);
        }
      });
  }, [supabase]);

  const update = (patch: Partial<Profile>) => {
    setData((prev) => (prev ? { ...prev, ...patch } : prev));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!data) return;
    setBusy(true);

    try {
      const { id: _id, ...payload } = data;

      // Check if profile row exists
      const { data: existing } = await supabase.from("profile").select("id").limit(1).maybeSingle();

      let error;
      if (existing) {
        const res = await supabase.from("profile").update(payload).eq("id", existing.id);
        error = res.error;
      } else {
        const res = await supabase.from("profile").insert(payload);
        error = res.error;
      }

      if (error) {
        toast.error("Save error: " + error.message);
      } else {
        toast.success("Profile saved successfully");
        void revalidatePortfolio("/");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error saving profile");
    } finally {
      setBusy(false);
    }
  };

  if (!data) {
    return <div className="text-muted-foreground font-mono text-sm">Loading profile…</div>;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="bento-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border/40">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Profile Information</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your personal info, job title, summary, and links.
            </p>
          </div>
          <Tabs value={activeLangTab} onValueChange={(v) => setActiveLangTab(v as "en" | "ru")}>
            <TabsList>
              <TabsTrigger value="en">🇬🇧 English</TabsTrigger>
              <TabsTrigger value="ru">🇷🇺 Русский</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Multilingual Tab: English */}
        {activeLangTab === "en" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs uppercase font-mono text-muted-foreground">Name (EN)</Label>
                <Input
                  value={data.name_en}
                  onChange={(e) => update({ name_en: e.target.value })}
                  className="mt-1.5"
                  placeholder="Alexander Bullo"
                />
              </div>
              <div>
                <Label className="text-xs uppercase font-mono text-muted-foreground">Job Title (EN)</Label>
                <Input
                  value={data.title_en}
                  onChange={(e) => update({ title_en: e.target.value })}
                  className="mt-1.5"
                  placeholder="Frontend Developer · React · Next.js · TypeScript"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs uppercase font-mono text-muted-foreground">Location (EN)</Label>
              <Input
                value={data.location_en}
                onChange={(e) => update({ location_en: e.target.value })}
                className="mt-1.5"
                placeholder="Hanoi, Vietnam (GMT+7)"
              />
            </div>

            <div>
              <Label className="text-xs uppercase font-mono text-muted-foreground">Summary (EN)</Label>
              <Textarea
                value={data.summary_en}
                onChange={(e) => update({ summary_en: e.target.value })}
                rows={3}
                className="mt-1.5 leading-relaxed"
              />
            </div>

            <div>
              <Label className="text-xs uppercase font-mono text-muted-foreground">Why Me / Approach (EN)</Label>
              <Textarea
                value={data.why_me_en}
                onChange={(e) => update({ why_me_en: e.target.value })}
                rows={5}
                className="mt-1.5 leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* Multilingual Tab: Russian */}
        {activeLangTab === "ru" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs uppercase font-mono text-muted-foreground">Имя (RU)</Label>
                <Input
                  value={data.name_ru}
                  onChange={(e) => update({ name_ru: e.target.value })}
                  className="mt-1.5"
                  placeholder="Александр Булло"
                />
              </div>
              <div>
                <Label className="text-xs uppercase font-mono text-muted-foreground">Должность (RU)</Label>
                <Input
                  value={data.title_ru}
                  onChange={(e) => update({ title_ru: e.target.value })}
                  className="mt-1.5"
                  placeholder="Frontend-разработчик · React · Next.js · TypeScript"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs uppercase font-mono text-muted-foreground">Локация (RU)</Label>
              <Input
                value={data.location_ru}
                onChange={(e) => update({ location_ru: e.target.value })}
                className="mt-1.5"
                placeholder="Ханой, Вьетнам (GMT+7)"
              />
            </div>

            <div>
              <Label className="text-xs uppercase font-mono text-muted-foreground">О себе / Summary (RU)</Label>
              <Textarea
                value={data.summary_ru}
                onChange={(e) => update({ summary_ru: e.target.value })}
                rows={3}
                className="mt-1.5 leading-relaxed"
              />
            </div>

            <div>
              <Label className="text-xs uppercase font-mono text-muted-foreground">Почему я / Подход (RU)</Label>
              <Textarea
                value={data.why_me_ru}
                onChange={(e) => update({ why_me_ru: e.target.value })}
                rows={5}
                className="mt-1.5 leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* Shared Contact Links */}
        <div className="pt-4 border-t border-border/40">
          <h3 className="text-sm font-semibold uppercase font-mono text-muted-foreground mb-3">
            Contact & Social Links
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label className="text-xs font-mono text-muted-foreground">Email</Label>
              <Input
                type="email"
                value={data.email}
                onChange={(e) => update({ email: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label className="text-xs font-mono text-muted-foreground">Telegram URL</Label>
              <Input
                value={data.telegram}
                onChange={(e) => update({ telegram: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label className="text-xs font-mono text-muted-foreground">LinkedIn URL</Label>
              <Input
                value={data.linkedin}
                onChange={(e) => update({ linkedin: e.target.value })}
                className="mt-1.5"
              />
            </div>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={busy}
        size="lg"
        className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0 cursor-pointer shadow-md"
      >
        {busy ? "Saving Profile…" : "Save Profile"}
      </Button>
    </form>
  );
}
