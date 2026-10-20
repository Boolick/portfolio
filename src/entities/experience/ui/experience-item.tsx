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
    <article className="chassis-module relative overflow-hidden">
      {/* 1. TOP REVISION BAR */}
      <div className="chassis-header bg-muted">
        <div className="flex items-center gap-2">
          <span className="text-primary font-bold tracking-wider">
            REV {"//"} {period}
          </span>
          <span className="text-muted-foreground font-mono">{"//"}</span>
          <span className="font-bold text-foreground uppercase tracking-tight">
            {experience.company}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[10px]">
          <span className="text-muted-foreground hidden sm:inline">{location}</span>
          {experience.is_commercial && (
            <span className="px-1.5 py-0.5 border border-status-ok text-status-ok font-bold uppercase">
              {t("COMMERCIAL_DEPLOY", "КОММЕРЧЕСКИЙ ПРОДАКШН")}
            </span>
          )}
        </div>
      </div>

      {/* 2. BODY CONTENT */}
      <div className="p-5 sm:p-6 space-y-4">
        <div>
          <h4 className="text-base sm:text-lg font-bold font-sans text-foreground uppercase tracking-tight">
            {title}
          </h4>
        </div>

        {/* Deliverables / Accomplishments */}
        <ul className="space-y-2 text-xs sm:text-sm font-sans text-foreground/90 leading-relaxed">
          {descriptions.map((desc, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="text-primary font-mono font-bold text-xs mt-0.5 shrink-0">
                ■
              </span>
              <span>{desc}</span>
            </li>
          ))}
        </ul>

        {/* Technology Stack Registers */}
        <div className="pt-3 border-t border-border flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-mono text-muted-foreground uppercase mr-1">
            STACK_BUS:
          </span>
          {experience.stack.map((tech) => (
            <span
              key={tech}
              className="font-mono text-[10px] uppercase px-2 py-0.5 border border-border bg-muted text-foreground font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
