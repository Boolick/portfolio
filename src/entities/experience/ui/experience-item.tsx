"use client";

import { Badge } from "@/shared/ui";
import { useLanguage } from "@/features/language-switcher";
import { pickLocale, pickLocaleArr } from "@/shared/lib";
import type { Experience } from "../model/types";

interface ExperienceItemProps {
  experience: Experience;
}

export function ExperienceItem({ experience }: ExperienceItemProps) {
  const { lang, t } = useLanguage();
  const title = pickLocale(experience, "title", lang);
  const location = pickLocale(experience, "location", lang);
  const period = pickLocale(experience, "period", lang);
  const descriptions = pickLocaleArr(experience, "description", lang);

  return (
    <div className="bento-card p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div>
          <h3 className="text-xl font-bold tracking-tight">
            {title} · <span className="text-primary">{experience.company}</span>
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {location} · {period}
          </p>
        </div>
        {experience.is_commercial && (
          <Badge variant="outline" className="border-accent/40 text-accent w-fit shrink-0">
            {t("Commercial", "Коммерческий")}
          </Badge>
        )}
      </div>
      <ul className="space-y-2 mb-6 text-sm text-foreground/85 leading-relaxed">
        {descriptions.map((desc, idx) => (
          <li key={idx} className="flex gap-3">
            <span className="text-primary mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
            <span>{desc}</span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-1.5 pt-4 border-t border-border/40">
        {experience.stack.map((tech) => (
          <span
            key={tech}
            className="font-mono text-[10px] uppercase px-2 py-1 rounded bg-secondary text-secondary-foreground"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
