"use client";

import { useLanguage } from "@/features/language-switcher";
import { pickLocale } from "@/shared/lib";
import type { SkillCategory } from "../model/types";

interface SkillCategoryCardProps {
  category: SkillCategory;
}

export function SkillCategoryCard({ category }: SkillCategoryCardProps) {
  const { lang } = useLanguage();
  const name = pickLocale(category, "name", lang);

  return (
    <div className="border border-border bg-card p-6 flex flex-col justify-between gap-4">
      <h3 className="font-sans text-base font-bold tracking-[-0.02em] text-foreground border-b border-border pb-3">
        {name}
      </h3>
      <div className="font-mono text-xs text-muted-foreground leading-relaxed">
        <span className="text-foreground">{category.skills.join(" | ")}</span>
      </div>
    </div>
  );
}
