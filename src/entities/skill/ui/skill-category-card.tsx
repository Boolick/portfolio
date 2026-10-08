"use client";

import { Badge } from "@/shared/ui";
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
    <div className="bento-card p-6 flex flex-col justify-between h-full">
      <h3 className="font-mono text-xs uppercase tracking-widest text-primary mb-4 font-semibold">
        {name}
      </h3>
      <div className="flex flex-wrap gap-2">
        {category.skills.map((skill) => (
          <Badge
            key={skill}
            variant="secondary"
            className="font-mono text-xs py-1 px-2.5 bg-secondary/80 text-secondary-foreground hover:bg-secondary"
          >
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  );
}
