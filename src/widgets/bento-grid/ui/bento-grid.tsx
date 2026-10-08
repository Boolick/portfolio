"use client";

import {
  Send,
  Mail,
  Linkedin,
  MapPin,
  Sparkles,
  Briefcase,
  GraduationCap,
  Languages as LangIcon,
} from "lucide-react";
import { Button, Reveal } from "@/shared/ui";
import { useLanguage } from "@/features/language-switcher";
import { pickLocale, pickLocaleArr } from "@/shared/lib";
import type { Profile } from "@/entities/profile";
import { ProjectCard, type Project } from "@/entities/project";
import { ExperienceItem, type Experience } from "@/entities/experience";
import { SkillCategoryCard, type SkillCategory } from "@/entities/skill";
import type { Education } from "@/entities/education";
import type { Language } from "@/entities/language";

export interface BentoGridProps {
  profile: Profile;
  projects: Project[];
  experiences: Experience[];
  skills: SkillCategory[];
  education: Education | null;
  languages: Language[];
}

export function BentoGrid({
  profile,
  projects,
  experiences,
  skills,
  education,
  languages,
}: BentoGridProps) {
  const { lang, t } = useLanguage();

  const name = pickLocale(profile, "name", lang);
  const title = pickLocale(profile, "title", lang);
  const summary = pickLocale(profile, "summary", lang);
  const whyMe = pickLocale(profile, "why_me", lang);
  const location = pickLocale(profile, "location", lang);

  const commercialCount = experiences.filter((e) => e.is_commercial).length;

  return (
    <div className="space-y-12">
      {/* 1. HERO SECTION */}
      <section className="pt-6 sm:pt-12 grid grid-cols-1 lg:grid-cols-12 gap-4">
        <Reveal className="lg:col-span-8 bento-card bento-card-glow p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute inset-0 grain opacity-30 pointer-events-none" />
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
            {t("Portfolio · 2026", "Портфолио · 2026")}
          </p>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
            {name || "Alexander Bullo"}
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-muted-foreground max-w-2xl">
            {title || "Frontend Developer · React · Next.js · TypeScript"}
          </p>
          <p className="mt-6 text-base text-foreground/85 max-w-2xl leading-relaxed">
            {summary}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {profile.telegram && (
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0 cursor-pointer shadow-md"
              >
                <a href={profile.telegram} target="_blank" rel="noreferrer">
                  <Send className="h-4 w-4" />
                  {t("Telegram", "Telegram")}
                </a>
              </Button>
            )}
            {profile.email && (
              <Button asChild size="lg" variant="outline" className="cursor-pointer">
                <a href={`mailto:${profile.email}`}>
                  <Mail className="h-4 w-4" />
                  {t("Get in touch", "Связаться")}
                </a>
              </Button>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-4 bento-card p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-mono text-xs uppercase tracking-widest">
                {t("At a glance", "Кратко")}
              </span>
            </div>
            <ul className="space-y-3.5 text-sm">
              <li className="flex justify-between items-center pb-2 border-b border-border/40">
                <span className="text-muted-foreground">{t("Experience", "Опыт")}</span>
                <span className="font-mono font-medium">3+ {t("yrs", "года")}</span>
              </li>
              <li className="flex justify-between items-center pb-2 border-b border-border/40">
                <span className="text-muted-foreground">
                  {t("Commercial projects", "Коммерческих проектов")}
                </span>
                <span className="font-mono font-medium">{commercialCount}</span>
              </li>
              <li className="flex justify-between items-center pb-2 border-b border-border/40">
                <span className="text-muted-foreground">{t("Stack focus", "Стек")}</span>
                <span className="font-mono text-right font-medium">React · TS · Next</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-muted-foreground">{t("Location", "Локация")}</span>
                <span className="font-mono text-right text-xs font-medium">{location || "Remote"}</span>
              </li>
            </ul>
          </div>
          <div className="mt-6 pt-6 border-t border-border/60 text-xs text-muted-foreground font-mono flex items-center justify-between">
            <span>{t("Available for projects", "Открыт к предложениям")}</span>
            <span className="flex items-center gap-1.5 text-primary">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              {t("online", "на связи")}
            </span>
          </div>
        </Reveal>
      </section>

      {/* 2. ABOUT & APPROACH */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <Reveal className="lg:col-span-7 bento-card p-8">
          <h2 className="text-2xl font-bold mb-4 tracking-tight">{t("Why me", "Почему я")}</h2>
          <p className="text-foreground/85 leading-relaxed text-base">
            {whyMe}
          </p>
        </Reveal>
        <Reveal
          delay={0.1}
          className="lg:col-span-5 bento-card p-8 bg-gradient-to-br from-card to-secondary/40"
        >
          <h2 className="text-2xl font-bold mb-4 tracking-tight">{t("Approach", "Подход")}</h2>
          <ul className="space-y-3.5 text-sm text-foreground/85">
            <li className="flex gap-3">
              <span className="text-primary font-mono font-bold">01</span>
              <span>{t("Engineering discipline first", "Сначала инженерная дисциплина")}</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-mono font-bold">02</span>
              <span>{t("Strict types, predictable state", "Строгие типы, предсказуемое состояние")}</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-mono font-bold">03</span>
              <span>{t("Real-time, fault-tolerant UX", "Real-time и отказоустойчивый UX")}</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-mono font-bold">04</span>
              <span>{t("Ship — measure — iterate", "Релиз — метрики — итерация")}</span>
            </li>
          </ul>
        </Reveal>
      </section>

      {/* 3. SKILLS GRID */}
      <section>
        <Reveal className="mb-4">
          <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            {t("Skills & Competencies", "Навыки и компетенции")}
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {skills.map((cat, i) => (
            <Reveal key={cat.id} delay={i * 0.05}>
              <SkillCategoryCard category={cat} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* 4. PROJECTS */}
      <section className="pt-4">
        <Reveal>
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                {t("Featured Projects", "Избранные проекты")}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {t(
                  "Production applications, architectures, and performance optimizations",
                  "Продакшн-приложения, архитектура и оптимизация производительности"
                )}
              </p>
            </div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground hidden sm:block">
              {projects.length} {t("selected", "проектов")}
            </p>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.05}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* 5. EXPERIENCE */}
      <section className="pt-4">
        <Reveal>
          <div className="flex items-center gap-3 mb-6">
            <Briefcase className="h-6 w-6 text-primary" />
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {t("Experience", "Опыт работы")}
            </h2>
          </div>
        </Reveal>
        <div className="space-y-4">
          {experiences.map((exp, i) => (
            <Reveal key={exp.id} delay={i * 0.05}>
              <ExperienceItem experience={exp} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* 6. EDUCATION & LANGUAGES */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-4">
        <Reveal className="lg:col-span-7 bento-card p-8">
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold tracking-tight">{t("Education", "Образование")}</h2>
          </div>
          {education && (
            <>
              <p className="font-bold text-base">{pickLocale(education, "degree", lang)}</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {pickLocale(education, "institution", lang)} · {education.year}
              </p>
              {pickLocaleArr(education, "additional", lang).length > 0 && (
                <ul className="mt-5 space-y-2 text-sm text-foreground/85">
                  {pickLocaleArr(education, "additional", lang).map((add, i) => (
                    <li key={i} className="flex gap-2.5">
                      <span className="text-primary font-bold">+</span>
                      <span>{add}</span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-5 bento-card p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <LangIcon className="h-5 w-5 text-accent" />
              <h2 className="text-xl font-bold tracking-tight">{t("Languages", "Языки")}</h2>
            </div>
            <ul className="space-y-3.5 text-sm">
              {languages.map((l) => (
                <li
                  key={l.id}
                  className="flex justify-between items-center pb-2 border-b border-border/40 last:border-0"
                >
                  <span className="font-medium">{pickLocale(l, "name", lang)}</span>
                  <span className="text-muted-foreground text-right text-xs font-mono">
                    {pickLocale(l, "level", lang)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      {/* 7. CONTACT / CTA */}
      <section className="pt-4">
        <Reveal className="bento-card bento-card-glow p-8 sm:p-14 text-center">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
            {t("Let's build something", "Соберём что-нибудь")}{" "}
            <span className="text-gradient">{t("real.", "настоящее.")}</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-base">
            {t(
              "Open to senior frontend roles, product architecture, and ambitious collaborations.",
              "Открыт к Senior Frontend ролям, продуктовой архитектуре и амбициозным проектам."
            )}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {profile.telegram && (
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0 cursor-pointer shadow-md"
              >
                <a href={profile.telegram} target="_blank" rel="noreferrer">
                  <Send className="h-4 w-4" /> Telegram
                </a>
              </Button>
            )}
            {profile.email && (
              <Button asChild size="lg" variant="outline" className="cursor-pointer">
                <a href={`mailto:${profile.email}`}>
                  <Mail className="h-4 w-4" /> {profile.email}
                </a>
              </Button>
            )}
            {profile.linkedin && (
              <Button asChild size="lg" variant="ghost" className="cursor-pointer">
                <a href={profile.linkedin} target="_blank" rel="noreferrer">
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </a>
              </Button>
            )}
          </div>
          {profile.location_en && (
            <p className="mt-6 text-xs font-mono uppercase tracking-widest text-muted-foreground inline-flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              {location}
            </p>
          )}
        </Reveal>
      </section>
    </div>
  );
}
