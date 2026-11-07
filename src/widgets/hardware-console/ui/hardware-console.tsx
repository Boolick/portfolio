"use client";

import { Send, Mail, Linkedin, FileDown, ArrowDown } from "lucide-react";
import { useLanguage } from "@/features/language-switcher";
import { pickLocale, pickLocaleArr, pluralizeRu, smoothScrollTo } from "@/shared/lib";
import { HardwareImage } from "@/shared/ui";
import { openTelegramUrl } from "@/shared/lib/telegram/links";
import { tmaHaptics } from "@/shared/lib/telegram/haptics";
import type { Profile } from "@/entities/profile";
import { ProjectCard, type Project } from "@/entities/project";
import { ExperienceItem, type Experience } from "@/entities/experience";
import { SkillCategoryCard, type SkillCategory } from "@/entities/skill";
import type { Education } from "@/entities/education";
import type { Language } from "@/entities/language";
import { EngineeringChronicle } from "@/widgets/engineering-chronicle";

export interface HardwareConsoleProps {
  profile: Profile;
  projects: Project[];
  experiences: Experience[];
  skills: SkillCategory[];
  education: Education | null;
  languages: Language[];
}

export function HardwareConsole({
  profile,
  projects,
  experiences,
  skills,
  education,
  languages,
}: HardwareConsoleProps) {
  const { lang, t } = useLanguage();

  const name = pickLocale(profile, "name", lang) || "Aliaksandr Bullo";
  const title =
    pickLocale(profile, "title", lang) ||
    "Fullstack Software Engineer (Node.js, NestJS, React, TypeScript)";
  const summary =
    pickLocale(profile, "summary", lang) ||
    "Fullstack software engineer focused on React, Next.js, TypeScript and Node.js. 11-year industrial engineering leadership background bringing deterministic systems discipline, scalable FSD architecture, and fault-tolerant real-time UX.";
  const location =
    pickLocale(profile, "location", lang) || "Hanoi, Vietnam (UTC+7) · Remote";

  const commercialCount = experiences.filter((e) => e.is_commercial).length;
  const pdfUrl = lang === "ru" ? "/resume_ru.pdf" : "/cv_en.pdf";
  const pdfFileName =
    lang === "ru"
      ? "Resume_Aliaksandr_Bullo_RU.pdf"
      : "CV_Aliaksandr_Bullo_EN.pdf";

  return (
    <div className="divide-y divide-border">
      {/* ======================================================== */}
      {/* 01. ENGINEER PROFILE (HERO)                              */}
      {/* ======================================================== */}
      <section
        id="profile"
        className="pt-2 sm:pt-4 lg:pt-6 pb-8 sm:pb-10 lg:pb-12"
      >
        <div className="flex items-baseline gap-3 sm:gap-4 mb-3 sm:mb-4">
          <span className="font-sans text-xl sm:text-2xl font-bold tracking-[-0.02em] text-accent-aa tabular-nums shrink-0">
            01
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-[-0.02em] text-foreground">
            {t("Engineer Profile", "Профиль инженера")}
          </h2>
        </div>

        <div className="border border-border bg-card grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Item 1: Identity & Role (Mobile: 1st, Desktop: Left Column Top) */}
          <div className="order-1 lg:col-span-7 xl:col-span-8 lg:row-start-1 lg:col-start-1 p-5 sm:p-6 lg:p-8 pb-3 lg:pb-4 lg:border-r border-border flex flex-col gap-3 sm:gap-4">
            <div className="space-y-2">
              {/* Mono Kicker with Role Title */}
              <div className="font-mono text-xs uppercase tracking-wider text-accent-aa font-semibold">
                {title}
              </div>

              {/* Single Page H1 */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[40px] font-bold tracking-[-0.03em] text-foreground font-sans leading-tight">
                {name}
              </h1>

              {/* Concrete Commercial Offer Line */}
              <p className="text-sm sm:text-base lg:text-lg text-foreground font-sans tracking-[-0.02em] font-medium leading-snug">
                {t(
                  "Design and delivery of fault-tolerant web systems, Telegram Mini Apps and B2B platforms — end to end.",
                  "Проектирование и разработка отказоустойчивых веб-систем, Telegram Mini Apps и B2B-платформ под ключ."
                )}
              </p>
            </div>
          </div>

          {/* Item 2: Uncropped Portrait & Telemetry (Mobile: 2nd, Desktop: Spans Rows 1 & 2 on Right) */}
          <div className="order-2 lg:order-3 lg:col-span-5 xl:col-span-4 lg:row-start-1 lg:row-span-2 lg:col-start-8 xl:col-start-9 bg-muted/20 flex flex-col justify-between border-t lg:border-t-0 border-border">
            {/* Uncropped Blueprint Illustration Container */}
            <div className="p-4 sm:p-5 lg:p-6 flex-1 flex items-center justify-center">
              <div className="border border-border bg-[#f6f4ee] dark:bg-[#15171c] w-full max-w-[280px] sm:max-w-[320px] lg:max-w-none mx-auto overflow-hidden flex items-center justify-center p-3 sm:p-4">
                <HardwareImage
                  fileName="Image_1.png"
                  alt={name}
                  width={896}
                  height={1200}
                  sizes="(max-width: 767px) 280px, (max-width: 1023px) 320px, 420px"
                  priority
                  className="w-full h-auto max-h-[360px] sm:max-h-[420px] lg:max-h-[460px] object-contain mx-auto"
                />
              </div>
            </div>

            {/* Engineering Telemetry / Metrics Table */}
            <div className="border-t border-border bg-card dark:bg-card p-4 sm:p-5">
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2.5 font-semibold flex items-center justify-between">
                <span>{t("ENGINEERING SPECS", "ПАРАМЕТРЫ ИНЖЕНЕРА")}</span>
                <span className="text-accent-aa tabular-nums">01 / SPEC</span>
              </div>
              <table className="w-full text-left border-collapse font-mono text-xs">
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="py-1.5 text-muted-foreground uppercase tracking-wider">
                      {t("Experience", "Опыт")}
                    </td>
                    <td className="py-1.5 text-right font-bold text-foreground tabular-nums">
                      {t("4+ yrs IT / 11 yrs Ind.", "4+ года IT / 11 лет произв.")}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-muted-foreground uppercase tracking-wider">
                      {t("Commercial", "Коммерческие")}
                    </td>
                    <td className="py-1.5 text-right font-bold text-foreground tabular-nums">
                      {lang === "ru"
                        ? `${pluralizeRu(commercialCount, ["система", "системы", "систем"])}\u00A0в\u00A0продакшне`
                        : `${commercialCount} ${commercialCount === 1 ? "Production System" : "Production Systems"}`}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-muted-foreground uppercase tracking-wider">
                      {t("Focus", "Специализация")}
                    </td>
                    <td className="py-1.5 text-right font-bold text-foreground">
                      {t("Fault-Tolerant / FSM", "Отказоустойчивость / FSM")}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-muted-foreground uppercase tracking-wider">
                      {t("Location", "Локация")}
                    </td>
                    <td className="py-1.5 text-right font-bold text-accent-aa">
                      {location}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Item 3: Stack, Summary & Action CTAs (Mobile: 3rd, Desktop: Left Column Bottom) */}
          <div className="order-3 lg:order-2 lg:col-span-7 xl:col-span-8 lg:row-start-2 lg:col-start-1 p-5 sm:p-6 lg:p-8 pt-3 lg:pt-4 lg:border-r border-t lg:border-t-0 border-border flex flex-col justify-between gap-6">
            <div className="space-y-4">
              {/* Clean Pipe-Separated Stack */}
              <div className="border-y border-border py-2.5 font-mono text-xs leading-relaxed">
                <span className="text-muted-foreground uppercase tracking-wider mr-2 font-semibold">
                  {t("Stack:", "Стек:")}
                </span>
                <span className="text-foreground">
                  TypeScript | React | Next.js | Node.js | NestJS | PostgreSQL | Redis | WebSockets | FSM
                </span>
              </div>

              {/* Engineering Background & Summary */}
              <div className="space-y-2.5 font-sans text-xs sm:text-sm leading-relaxed text-foreground">
                <p className="font-medium text-foreground">
                  {t(
                    "11 years managing industrial manufacturing operations before transitioning into distributed web systems engineering.",
                    "11 лет руководил промышленным производством до перехода в разработку распределенных веб-систем."
                  )}
                </p>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {summary}
                </p>
              </div>
            </div>

            {/* CTAs: Deduplicated for .web-only and .tma-only */}
            <div className="pt-4 border-t border-border">
              {/* Web Browser CTAs */}
              <div className="web-only flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 font-mono text-xs uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => openTelegramUrl("https://t.me/AlexanderBullo")}
                  className="tactile-btn w-full sm:w-auto h-11 px-5 bg-primary text-primary-foreground font-bold flex items-center justify-center border border-border cursor-pointer hover:opacity-90 whitespace-nowrap shrink-0"
                >
                  <span>{t("DISCUSS A PROJECT", "ОБСУДИТЬ ПРОЕКТ")}</span>
                </button>

                <div className="grid grid-cols-2 sm:flex gap-2 min-w-0">
                  <a
                    href={pdfUrl}
                    download={pdfFileName}
                    className="tactile-btn h-11 px-3 sm:px-4 flex items-center justify-center gap-1.5 bg-background text-foreground border border-border font-bold hover:border-primary hover:text-primary whitespace-nowrap shrink-0 text-center text-xs"
                  >
                    <FileDown className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
                    <span>{t("DOWNLOAD CV", "СКАЧАТЬ РЕЗЮМЕ")}</span>
                  </a>

                  <a
                    href="#projects"
                    onClick={(e) => {
                      e.preventDefault();
                      smoothScrollTo("projects");
                    }}
                    className="tactile-btn h-11 px-3 sm:px-4 flex items-center justify-center gap-1.5 border border-border bg-background text-foreground font-semibold hover:border-primary whitespace-nowrap shrink-0 text-center text-xs"
                  >
                    <span>{t("PROJECTS", "ПРОЕКТЫ")}</span>
                    <ArrowDown className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
                  </a>
                </div>
              </div>

              {/* Telegram Mini App Single Primary CTA */}
              <div className="tma-only">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    tmaHaptics.selection();
                    smoothScrollTo("projects");
                  }}
                  className="tactile-btn w-full h-11 border border-border bg-background hover:border-primary font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center cursor-pointer"
                >
                  <span>{t("VIEW PRODUCTION CASES", "СМОТРЕТЬ ПРОДАКШН-КЕЙСЫ")}</span>
                  <ArrowDown className="h-3.5 w-3.5 text-primary ml-1.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 02. TECHNICAL STACK & SPECIFICATIONS                     */}
      {/* ======================================================== */}
      <section id="stack" className="py-8 sm:py-10 lg:py-12">
        <div className="flex items-baseline gap-3 sm:gap-4 mb-4 sm:mb-5">
          <span className="font-sans text-xl sm:text-2xl font-bold tracking-[-0.02em] text-accent-aa tabular-nums shrink-0">
            02
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-[-0.02em] text-foreground">
            {t("Technical Specifications", "Технический стек и компетенции")}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((category) => (
            <SkillCategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 03. SELECTED PROJECTS (ENGINEERING SPEC SHEETS)          */}
      {/* ======================================================== */}
      <section id="projects" className="py-8 sm:py-10 lg:py-12">
        <div className="flex flex-wrap items-baseline justify-between gap-4 mb-4 sm:mb-5">
          <div className="flex items-baseline gap-3 sm:gap-4">
            <span className="font-sans text-xl sm:text-2xl font-bold tracking-[-0.02em] text-accent-aa tabular-nums shrink-0">
              03
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-[-0.02em] text-foreground">
              {t("Selected Projects", "Избранные проекты")}
            </h2>
          </div>
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground tabular-nums">
            {lang === "ru"
              ? `${pluralizeRu(projects.length, ["проект", "проекта", "проектов"])}\u00A0в\u00A0продакшне`
              : `${projects.length} ${projects.length === 1 ? "Production System" : "Production Systems"}`}
          </span>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i + 1} />
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 04. ENGINEERING APPROACH & FSM (COMIC 1-2-1-2 GRID)      */}
      {/* ======================================================== */}
      <EngineeringChronicle />

      {/* ======================================================== */}
      {/* 05. EXPERIENCE & CAREER TIMELINE                         */}
      {/* ======================================================== */}
      <section id="experience" className="py-8 sm:py-10 lg:py-12">
        <div className="flex items-baseline gap-3 sm:gap-4 mb-4 sm:mb-5">
          <span className="font-sans text-xl sm:text-2xl font-bold tracking-[-0.02em] text-accent-aa tabular-nums shrink-0">
            05
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-[-0.02em] text-foreground">
            {t("Career Timeline & Experience", "Опыт работы и карьера")}
          </h2>
        </div>

        {/* Mobile Summary Cards (< 768px, md:hidden) */}
        <div className="md:hidden space-y-3 mb-5">
          <div className="border border-border bg-card p-4 space-y-2">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-accent-aa font-bold tabular-nums">2022 — 2026</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Fullstack</span>
            </div>
            <h3 className="font-sans font-bold text-sm text-foreground">
              {t("Fullstack Software Engineer", "Fullstack-инженер")}
            </h3>
            <p className="font-sans text-xs text-muted-foreground leading-relaxed">
              {t(
                "Distributed web applications, B2B platforms, Telegram Mini Apps, real-time trading interfaces.",
                "Распределенные веб-сервисы, B2B-платформы, Telegram Mini Apps, торговые интерфейсы реального времени."
              )}
            </p>
            <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-foreground pt-1 border-t border-border/50">
              {t("99.9% Uptime · Zero Deadlocks", "99.9% Uptime · Без состояний гонки")}
            </div>
          </div>

          <div className="border border-border bg-card p-4 space-y-2">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-accent-aa font-bold tabular-nums">2011 — 2022</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Operations</span>
            </div>
            <h3 className="font-sans font-bold text-sm text-foreground">
              {t("Head of Production / Director", "Начальник производства / Директор")}
            </h3>
            <p className="font-sans text-xs text-muted-foreground leading-relaxed">
              {t(
                "11 years leading industrial manufacturing: end-to-end quality control, unit economics, CNC automation.",
                "11 лет руководства промышленным производством: сквозной контроль качества, расчет себестоимости, ЧПУ."
              )}
            </p>
            <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-foreground pt-1 border-t border-border/50">
              {t("+180% Output Efficiency", "+180% к эффективности выпуска")}
            </div>
          </div>
        </div>

        {/* Desktop Career Summary Data Table (>= 768px, hidden md:block) */}
        <div className="hidden md:block border border-border bg-card overflow-x-auto mb-6">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead className="bg-muted/50 border-b border-border font-mono text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-4 font-semibold">{t("Period", "Период")}</th>
                <th className="p-4 font-semibold">{t("Role", "Роль")}</th>
                <th className="p-4 font-semibold">{t("Domain & Focus", "Область ответственности")}</th>
                <th className="p-4 font-semibold">{t("Key Outcome", "Результат")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-sans text-sm">
              <tr>
                <td className="p-4 font-mono text-xs uppercase tracking-wider font-bold text-accent-aa whitespace-nowrap tabular-nums">
                  2022 — 2026
                </td>
                <td className="p-4 font-bold text-foreground whitespace-nowrap">
                  {t("Fullstack Software Engineer", "Fullstack-инженер")}
                </td>
                <td className="p-4 text-muted-foreground">
                  {t(
                    "Distributed web applications, B2B platforms, Telegram Mini Apps, real-time trading interfaces.",
                    "Распределенные веб-сервисы, B2B-платформы, Telegram Mini Apps, торговые интерфейсы реального времени."
                  )}
                </td>
                <td className="p-4 font-mono text-xs uppercase tracking-wider font-bold text-foreground whitespace-nowrap">
                  {t("99.9% Uptime · Zero Deadlocks", "99.9% Uptime · Без состояний гонки")}
                </td>
              </tr>
              <tr>
                <td className="p-4 font-mono text-xs uppercase tracking-wider font-bold text-accent-aa whitespace-nowrap tabular-nums">
                  2011 — 2022
                </td>
                <td className="p-4 font-bold text-foreground whitespace-nowrap">
                  {t("Head of Production / Director", "Начальник производства / Директор")}
                </td>
                <td className="p-4 text-muted-foreground">
                  {t(
                    "11 years leading industrial manufacturing: end-to-end quality control, unit economics, CNC automation.",
                    "11 лет руководства промышленным производством: сквозной контроль качества, расчет себестоимости, ЧПУ."
                  )}
                </td>
                <td className="p-4 font-mono text-xs uppercase tracking-wider font-bold text-foreground whitespace-nowrap">
                  {t("+180% Output Efficiency", "+180% к эффективности выпуска")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Detailed Experience List */}
        <div className="space-y-6">
          {experiences.map((exp, idx) => (
            <ExperienceItem key={exp.id} experience={exp} index={idx} />
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 06. EDUCATION & LANGUAGES                                */}
      {/* ======================================================== */}
      <section id="education" className="py-8 sm:py-10 lg:py-12">
        <div className="flex items-baseline gap-3 sm:gap-4 mb-4 sm:mb-5">
          <span className="font-sans text-xl sm:text-2xl font-bold tracking-[-0.02em] text-accent-aa tabular-nums shrink-0">
            06
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-[-0.02em] text-foreground">
            {t("Education & Languages", "Образование и языки")}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Education */}
          <div className="lg:col-span-7 border border-border bg-card p-5 sm:p-7 space-y-5">
            <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground border-b border-border pb-3">
              {t("Academic Credentials & Certifications", "Высшее образование и сертификации")}
            </h3>

            {education ? (
              <div className="space-y-5">
                <div>
                  <h4 className="font-sans font-bold text-lg text-foreground tracking-[-0.02em]">
                    {pickLocale(education, "degree", lang)}
                  </h4>
                  <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mt-1 tabular-nums">
                    {pickLocale(education, "institution", lang)} · {education.year}
                  </p>
                </div>

                {pickLocaleArr(education, "additional", lang).length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-border">
                    <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground block">
                      {t("Additional Engineering Training", "Дополнительная подготовка")}
                    </span>
                    <ul className="space-y-2 text-sm font-sans text-foreground">
                      {pickLocaleArr(education, "additional", lang).map((add, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="text-primary font-mono text-xs mt-1">—</span>
                          <span>{add}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="font-mono text-xs text-muted-foreground">
                {t("No education data", "Нет данных об образовании")}
              </div>
            )}
          </div>

          {/* Languages */}
          <div className="lg:col-span-5 border border-border bg-card p-5 sm:p-7 space-y-5">
            <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground border-b border-border pb-3">
              {t("Languages", "Владение языками")}
            </h3>

            <ul className="divide-y divide-border font-sans text-sm">
              {languages.map((l) => (
                <li
                  key={l.id}
                  className="flex justify-between items-center py-2.5 first:pt-0 last:pb-0"
                >
                  <span className="font-bold text-foreground">
                    {pickLocale(l, "name", lang)}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    {pickLocale(l, "level", lang)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 07. CONTACT                                              */}
      {/* ======================================================== */}
      <section id="contact" className="py-8 sm:py-10 lg:py-12">
        <div className="flex items-baseline gap-3 sm:gap-4 mb-4 sm:mb-5">
          <span className="font-sans text-xl sm:text-2xl font-bold tracking-[-0.02em] text-accent-aa tabular-nums shrink-0">
            07
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-[-0.02em] text-foreground">
            {t("Contact", "Контакты")}
          </h2>
        </div>

        <div className="border border-border bg-card p-5 sm:p-8 space-y-6">
          <p className="font-sans text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            {t(
              "Have a development task or an open engineering role? Let's discuss.",
              "Есть задача на разработку или проектная позиция? Давайте обсудим."
            )}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            {profile.telegram && (
              <button
                type="button"
                onClick={() => openTelegramUrl(profile.telegram!)}
                className="tactile-btn border border-border bg-background p-4 hover:border-primary flex items-center justify-between text-left cursor-pointer min-h-12"
              >
                <div className="flex items-center gap-2">
                  <Send className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  <span className="text-muted-foreground uppercase tracking-wider">
                    Telegram
                  </span>
                </div>
                <span className="font-bold text-foreground">@AlexanderBullo</span>
              </button>
            )}

            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="tactile-btn border border-border bg-background p-4 hover:border-primary flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 min-h-12"
              >
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  <span className="text-muted-foreground uppercase tracking-wider">
                    Email
                  </span>
                </div>
                <span className="font-bold text-foreground break-all sm:break-normal sm:truncate sm:ml-2">
                  {profile.email}
                </span>
              </a>
            )}

            {profile.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="tactile-btn border border-border bg-background p-4 hover:border-primary flex items-center justify-between min-h-12"
              >
                <div className="flex items-center gap-2">
                  <Linkedin className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  <span className="text-muted-foreground uppercase tracking-wider">
                    LinkedIn
                  </span>
                </div>
                <span className="font-bold text-foreground">alexander-bullo</span>
              </a>
            )}

            <a
              href={pdfUrl}
              download={pdfFileName}
              className="tactile-btn bg-primary text-primary-foreground font-bold p-4 flex items-center justify-between uppercase tracking-wider hover:opacity-90 min-h-12"
            >
              <div className="flex items-center gap-2">
                <FileDown className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{t("Resume PDF", "Резюме PDF")}</span>
              </div>
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
