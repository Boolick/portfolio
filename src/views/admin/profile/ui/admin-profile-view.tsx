"use client";

import { useEffect, useState, type FormEvent } from "react";
import { type Profile, fallbackProfile } from "@/entities/profile";
import { getAdminProfile, saveAdminProfile } from "@/features/admin";
import { Button, Input, Label, Textarea, toast, Tabs, TabsList, TabsTrigger } from "@/shared/ui";

export function AdminProfileView() {
  const [data, setData] = useState<Profile | null>(null);
  const [busy, setBusy] = useState(false);
  const [activeLangTab, setActiveLangTab] = useState<"en" | "ru">("en");

  useEffect(() => {
    void getAdminProfile().then((res) => {
      if (res.success && res.data) {
        setData(res.data);
      } else {
        if (!res.success) {
          toast.error(res.error.message);
        }
        setData(fallbackProfile);
      }
    });
  }, []);

  const update = (patch: Partial<Profile>) => {
    setData((prev) => (prev ? { ...prev, ...patch } : prev));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!data) return;
    setBusy(true);

    try {
      const res = await saveAdminProfile(data);
      if (!res.success) {
        toast.error(res.error.message);
      } else {
        setData(res.data);
        toast.success("Profile saved successfully");
      }
    } catch {
      toast.error("Error saving profile");
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
                  placeholder="Aliaksandr Bullo"
                />
              </div>
              <div>
                <Label className="text-xs uppercase font-mono text-muted-foreground">Job Title (EN)</Label>
                <Input
                  value={data.title_en}
                  onChange={(e) => update({ title_en: e.target.value })}
                  className="mt-1.5"
                  placeholder="Fullstack Developer (Node.js, NestJS, React, TypeScript)"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs uppercase font-mono text-muted-foreground">Location (EN)</Label>
              <Input
                value={data.location_en}
                onChange={(e) => update({ location_en: e.target.value })}
                className="mt-1.5"
                placeholder="Hanoi, Vietnam (UTC+7) · Remote"
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
                  placeholder="Fullstack Developer · React / Next.js / Node.js / AI"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs uppercase font-mono text-muted-foreground">Локация (RU)</Label>
              <Input
                value={data.location_ru}
                onChange={(e) => update({ location_ru: e.target.value })}
                className="mt-1.5"
                placeholder="Ханой, Вьетнам (UTC+7) · Удалённо"
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
