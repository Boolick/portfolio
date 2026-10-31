"use client";

import { useState } from "react";
import { useLanguage } from "@/features/language-switcher";
import { pickLocale, pickLocaleArr } from "@/shared/lib";
import { tmaHaptics } from "@/shared/lib/telegram/haptics";
import { cn } from "@/shared/lib/utils";
import type { Experience } from "../model/types";

interface ExperienceItemProps {
  experience: Experience;
  index?: number;
}

export function ExperienceItem({ experience, index = 1 }: ExperienceItemProps) {
  const { lang, t } = useLanguage();
  const [expanded, setExpanded] = useState(index === 0);

  const title = pickLocale(experience, "title", lang);
  const location = pickLocale(experience, "location", lang);
  const period = pickLocale(experience, "period", lang);
  const descriptions = pickLocaleArr(experience, "description", lang);

  const hasExtraDescriptions = descriptions.length > 2;

  const handleToggle = () => {
    tmaHaptics.selection();
    setExpanded((prev) => !prev);
  };

  return (
    <article className="border border-border bg-card">
      {/* Header Row */}
      <div className="border-b border-border px-4 py-3 sm:px-6 sm:py-4 flex flex-wrap items-baseline justify-between gap-2 bg-muted/40">
        <div className="flex flex-wrap items-baseline gap-2.5 sm:gap-3">
          <span className="font-mono text-xs uppercase tracking-wider text-accent-aa font-bold tabular-nums">
            {period}
          </span>
          <span className="font-sans font-bold text-sm sm:text-base text-foreground tracking-[-0.02em]">
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
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
        <h4 className="text-base sm:text-lg font-bold font-sans text-foreground tracking-[-0.02em]">
          {title}
        </h4>

        {/* SEO-safe progressive disclosure: ALL descriptions stay in DOM */}
        <ul className="space-y-2.5 text-xs sm:text-sm md:text-base font-sans text-foreground/90 leading-relaxed">
          {descriptions.map((desc, idx) => {
            const isHiddenOnMobile = !expanded && idx >= 2;
            return (
              <li
                key={idx}
                className={cn(
                  "items-start gap-3",
                  isHiddenOnMobile ? "hidden md:flex" : "flex"
                )}
              >
                <span className="text-primary font-mono text-xs mt-1.5 shrink-0" aria-hidden="true">
                  —
                </span>
                <span>{desc}</span>
              </li>
            );
          })}
        </ul>

        {/* Mobile Progressive Disclosure Toggle */}
        {hasExtraDescriptions && (
          <button
            type="button"
            onClick={handleToggle}
            aria-expanded={expanded}
            className="tactile-btn md:hidden w-full min-h-11 mt-3 pt-2 border-t border-border flex items-center justify-between font-mono text-xs font-bold uppercase tracking-wider text-accent-aa cursor-pointer"
          >
            <span>
              {expanded
                ? t("Collapse details", "Свернуть детали")
                : t(
                    `Expand engineering details (+${descriptions.length - 2})`,
                    `Развернуть детали (+${descriptions.length - 2})`
                  )}
            </span>
            <span aria-hidden="true">{expanded ? "↑" : "↓"}</span>
          </button>
        )}

        {experience.stack.length > 0 && (
          <div className="pt-3 sm:pt-4 border-t border-border font-mono text-xs">
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
