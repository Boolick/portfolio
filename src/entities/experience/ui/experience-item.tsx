"use client";

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
    <article className="border border-border bg-card">
      {/* Header Row */}
      <div className="border-b border-border px-6 py-4 flex flex-wrap items-baseline justify-between gap-2 bg-muted/40">
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="font-mono text-xs uppercase tracking-wider text-primary font-bold">
            {period}
          </span>
          <span className="font-sans font-bold text-base text-foreground tracking-[-0.02em]">
            {experience.company}
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {location && <span>{location}</span>}
          {experience.is_commercial && (
            <span className="text-foreground font-semibold">
              {t("Commercial", "Коммерческий опыт")}
            </span>
          )}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-6 space-y-5">
        <h4 className="text-lg font-bold font-sans text-foreground tracking-[-0.02em]">
          {title}
        </h4>

        <ul className="space-y-2.5 text-sm sm:text-base font-sans text-foreground/90 leading-relaxed">
          {descriptions.map((desc, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="text-primary font-mono text-xs mt-1.5 shrink-0">
                —
              </span>
              <span>{desc}</span>
            </li>
          ))}
        </ul>

        {experience.stack.length > 0 && (
          <div className="pt-4 border-t border-border font-mono text-xs">
            <span className="text-muted-foreground uppercase tracking-wider mr-2">
              {t("Stack:", "Стек:")}
            </span>
            <span className="text-foreground">{experience.stack.join(" | ")}</span>
          </div>
        )}
      </div>
    </article>
  );
}
