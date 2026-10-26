"use client";

import { Send, Mail, Linkedin, FileDown, ArrowDown } from "lucide-react";
import { useLanguage } from "@/features/language-switcher";
import { pickLocale, pickLocaleArr } from "@/shared/lib";
import { HardwareImage } from "@/shared/ui";
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
        className="pt-1 sm:pt-2 md:pt-3 pb-6 sm:pb-8"
      >
        <div className="flex items-baseline gap-4 mb-2 sm:mb-3">
          <span className="font-mono text-xs uppercase tracking-wider text-primary font-bold">
            01
          </span>
          <h2 className="text-lg sm:text-xl font-bold tracking-[-0.02em] text-foreground">
            {t("Engineer Profile", "Профиль инженера")}
          </h2>
        </div>

        <div className="border border-border bg-card grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Identity, Offer, Stack, Actions */}
          <div className="lg:col-span-8 p-4 sm:p-5 lg:p-6 flex flex-col justify-between gap-4 border-b lg:border-b-0 lg:border-r border-border">
            <div className="space-y-3">
              <div className="space-y-1.5">
                {/* Mono Kicker with Role Title */}
                <div className="font-mono text-xs uppercase tracking-wider text-primary font-semibold">
                  {title}
                </div>

                {/* Single Page H1 */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-[-0.02em] text-foreground font-sans">
                  {name}
                </h1>

                {/* Concrete Commercial Offer Line */}
                <p className="text-sm sm:text-base text-foreground font-sans tracking-[-0.02em] font-medium leading-snug">
                  {t(
                    "Design and delivery of fault-tolerant web systems, Telegram Mini Apps and B2B platforms — end to end.",
                    "Проектирование и разработка отказоустойчивых веб-систем, Telegram Mini Apps и B2B-платформ под ключ."
                  )}
                </p>
              </div>

              {/* Clean Pipe-Separated Stack */}
              <div className="border-y border-border py-2 font-mono text-xs">
                <span className="text-muted-foreground uppercase tracking-wider mr-2">
                  {t("Stack:", "Стек:")}
                </span>
                <span className="text-foreground">
                  TypeScript | React | Next.js | Node.js | NestJS | PostgreSQL | Redis | WebSockets | FSM
                </span>
              </div>

              {/* Engineering Background & Summary */}
              <div className="space-y-2 font-sans text-xs sm:text-sm leading-relaxed text-foreground">
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

            {/* Primary Actions: Streamlined 3-Control Bar */}
            <div className="pt-3 border-t border-border flex flex-wrap items-center gap-2.5 font-mono text-xs uppercase tracking-wider">
              <a
                href="#contact"
                className="tactile-btn inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-bold hover:opacity-90"
              >
                <span>{t("Discuss a project", "Обсудить проект")}</span>
              </a>

              <a
                href={pdfUrl}
                download={pdfFileName}
                className="tactile-btn inline-flex items-center gap-2 px-3.5 py-2 bg-background text-foreground border border-border font-bold hover:border-primary hover:text-primary"
              >
                <FileDown className="h-3.5 w-3.5 text-primary" />
                <span>{t("Download CV", "Скачать резюме")}</span>
              </a>

              <a
                href="#projects"
                className="tactile-btn inline-flex items-center gap-2 px-3.5 py-2 border border-border bg-background text-foreground font-semibold hover:border-primary"
              >
                <span>{t("Selected projects", "Проекты")}</span>
                <ArrowDown className="h-3.5 w-3.5 text-primary" />
              </a>
            </div>
          </div>

          {/* Right Column: Portrait & Key Metrics */}
          <div className="lg:col-span-4 p-4 sm:p-5 bg-muted/30 flex flex-col justify-between gap-3">
            <div className="border border-border bg-[#f6f4ee] overflow-hidden max-w-[260px] sm:max-w-[300px] lg:max-w-none mx-auto w-full aspect-[896/1200] max-h-[300px] sm:max-h-[340px] lg:max-h-[360px] flex items-center justify-center">
              <HardwareImage
                fileName="Image_1.png"
                alt={name}
                width={896}
                height={1200}
                priority
                className="w-full h-full object-contain"
              />
            </div>

            <table className="w-full text-left border-collapse font-mono text-xs">
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-1.5 text-muted-foreground uppercase tracking-wider">
                    {t("Experience", "Опыт")}
                  </td>
                  <td className="py-1.5 text-right font-bold text-foreground">
                    {t("4+ yrs IT / 11 yrs Ind.", "4+ года IT / 11 лет произв.")}
                  </td>
                </tr>
                <tr>
                  <td className="py-1.5 text-muted-foreground uppercase tracking-wider">
                    {t("Commercial", "Коммерческие")}
                  </td>
                  <td className="py-1.5 text-right font-bold text-foreground">
                    {commercialCount} {t("Production Systems", "системы в продакшне")}
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
                  <td className="py-1.5 text-right font-bold text-primary">
                    {location}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 02. TECHNICAL STACK & SPECIFICATIONS                     */}
      {/* ======================================================== */}
      <section id="stack" className="py-6 md:py-8">
        <div className="flex items-baseline gap-4 mb-4 sm:mb-5">
          <span className="font-mono text-xs uppercase tracking-wider text-primary font-bold">
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
      <section id="projects" className="py-6 md:py-8">
        <div className="flex flex-wrap items-baseline justify-between gap-4 mb-4 sm:mb-5">
          <div className="flex items-baseline gap-4">
            <span className="font-mono text-xs uppercase tracking-wider text-primary font-bold">
              03
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-[-0.02em] text-foreground">
              {t("Selected Projects", "Избранные проекты")}
            </h2>
          </div>
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {projects.length} {t("Production Systems", "проекта в продакшне")}
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
      <section id="experience" className="py-6 md:py-8">
        <div className="flex items-baseline gap-4 mb-4 sm:mb-5">
          <span className="font-mono text-xs uppercase tracking-wider text-primary font-bold">
            05
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-[-0.02em] text-foreground">
            {t("Career Timeline & Experience", "Опыт работы и карьера")}
          </h2>
        </div>

        {/* Career Summary Data Table */}
        <div className="border border-border bg-card overflow-x-auto mb-6">
          <table className="w-full text-left border-collapse">
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
                <td className="p-4 font-mono text-xs uppercase tracking-wider font-bold text-primary whitespace-nowrap">
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
                <td className="p-4 font-mono text-xs uppercase tracking-wider font-bold text-foreground whitespace-nowrap">
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
          {experiences.map((exp) => (
            <ExperienceItem key={exp.id} experience={exp} />
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 06. EDUCATION & LANGUAGES                                */}
      {/* ======================================================== */}
      <section id="education" className="py-6 md:py-8">
        <div className="flex items-baseline gap-4 mb-4 sm:mb-5">
          <span className="font-mono text-xs uppercase tracking-wider text-primary font-bold">
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
                  <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mt-1">
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
      <section id="contact" className="py-6 md:py-8">
        <div className="flex items-baseline gap-4 mb-4 sm:mb-5">
          <span className="font-mono text-xs uppercase tracking-wider text-primary font-bold">
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
              <a
                href={profile.telegram}
                target="_blank"
                rel="noreferrer"
                className="tactile-btn border border-border bg-background p-4 hover:border-primary flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Send className="h-3.5 w-3.5 text-primary" />
                  <span className="text-muted-foreground uppercase tracking-wider">
                    Telegram
                  </span>
                </div>
                <span className="font-bold text-foreground">@AlexanderBullo</span>
              </a>
            )}

            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="tactile-btn border border-border bg-background p-4 hover:border-primary flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-primary" />
                  <span className="text-muted-foreground uppercase tracking-wider">
                    Email
                  </span>
                </div>
                <span className="font-bold text-foreground truncate ml-2">
                  {profile.email}
                </span>
              </a>
            )}

            {profile.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="tactile-btn border border-border bg-background p-4 hover:border-primary flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Linkedin className="h-3.5 w-3.5 text-primary" />
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
              className="tactile-btn bg-primary text-primary-foreground font-bold p-4 flex items-center justify-between uppercase tracking-wider hover:opacity-90"
            >
              <div className="flex items-center gap-2">
                <FileDown className="h-3.5 w-3.5" />
                <span>{t("Resume PDF", "Резюме PDF")}</span>
              </div>
              <span>↓</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
