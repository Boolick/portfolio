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
    <div className="chassis-module flex flex-col justify-between h-full">
      {/* Category Header */}
      <div className="chassis-header bg-muted">
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
          {name}
        </span>
        <span className="font-mono text-[10px] text-muted-foreground">
          [{category.skills.length} UNITS]
        </span>
      </div>

      {/* Skills Matrix Registers */}
      <div className="p-4 flex flex-wrap gap-1.5 flex-1 content-start">
        {category.skills.map((skill) => (
          <span
            key={skill}
            className="font-mono text-[11px] px-2 py-0.5 border border-border bg-card text-foreground font-medium"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
