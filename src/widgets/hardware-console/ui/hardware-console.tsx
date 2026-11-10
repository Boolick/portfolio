"use client";

import Link from "next/link";
import { Send, Mail, Linkedin, FileDown, ArrowDown } from "lucide-react";
import { useLanguage } from "@/features/language-switcher";
import { pickLocale, pickLocaleArr, smoothScrollTo } from "@/shared/lib";
import { HardwareImage } from "@/shared/ui";
import { openTelegramUrl } from "@/shared/lib/telegram/links";
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
  const summary =
    pickLocale(profile, "summary", lang) ||
    (lang === "ru"
      ? "Проектирую и запускаю веб-платформы, B2B-сервисы и Telegram Mini Apps полного цикла — от быстрого интерфейса до надёжного бэкенда, платежей и выкладки в продакшн."
      : "I design and ship end-to-end web platforms, B2B services, and Telegram Mini Apps — from responsive interfaces to resilient backends, payment flows, and production deployment.");
  const whyMe =
    pickLocale(profile, "why_me", lang) ||
    (lang === "ru"
      ? "Отношусь к разработке как к созданию надёжной инженерной системы: продукт должен быстро загружаться, не терять данные и деньги при сбоях сети и спокойно масштабироваться с ростом бизнеса. Сочетаю коммерческую fullstack-разработку с многолетним опытом управления реальным производством — одинаково хорошо понимаю и архитектуру кода, и экономику продукта."
      : "I approach software as a dependable engineering system: a product must load fast, protect transactions and data on unstable networks, and scale cleanly as the business grows. Combining commercial fullstack engineering with an industrial operations leadership background, I bridge clean code architecture with real business economics.");
  const location =
    pickLocale(profile, "location", lang) ||
    (lang === "ru" ? "Удалённо · Ханой (UTC+7)" : "Remote · Hanoi (UTC+7)");

  // Separate main featured commercial projects from platform colophon
  const featuredProjects = projects.filter((p) => p.slug !== "portfolio");
  const portfolioProject = projects.find(
    (p) => p.slug === "portfolio" && p.published
  );

  const pdfUrl = lang === "ru" ? "/resume_ru.pdf" : "/cv_en.pdf";
  const pdfFileName =
    lang === "ru"
      ? "Resume_Aliaksandr_Bullo_RU.pdf"
      : "CV_Aliaksandr_Bullo_EN.pdf";

  return (
    <div className="divide-y divide-border">
      {/* ======================================================== */}
      {/* ENGINEER HERO CARD                                       */}
      {/* ======================================================== */}
      <section
        id="profile"
        className="pt-4 sm:pt-6 pb-6 sm:pb-8 lg:pb-10"
      >
        <div className="border border-border bg-card grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Item 1: Identity & Offer (Mobile: 1st, Desktop: Left Column Top) */}
          <div className="order-1 lg:col-span-7 xl:col-span-8 lg:row-start-1 lg:col-start-1 p-5 sm:p-6 lg:p-7 pb-3 sm:pb-4 lg:pb-4 lg:border-r border-border flex flex-col justify-center gap-3">
            <h1 className="text-2xl sm:text-3xl lg:text-[36px] xl:text-[40px] font-bold tracking-[-0.03em] text-foreground font-sans leading-tight">
              {name}
            </h1>

            {/* Concrete Commercial Offer Line from profile.summary */}
            <p className="text-sm sm:text-base lg:text-[16px] text-foreground font-sans tracking-[-0.02em] font-medium leading-relaxed">
              {summary}
            </p>
          </div>

          {/* Item 2: Uncropped Portrait & Telemetry (Mobile: 2nd, Desktop: Spans Rows 1 & 2 on Right) */}
          <div className="order-2 lg:order-3 lg:col-span-5 xl:col-span-4 lg:row-start-1 lg:row-span-2 lg:col-start-8 xl:col-start-9 bg-muted/20 flex flex-col justify-between border-t lg:border-t-0 border-border">
            {/* Uncropped Blueprint Illustration Container */}
            <div className="p-3 sm:p-4 lg:p-4 flex-1 flex items-center justify-center">
              <div className="border border-border bg-[#f6f4ee] dark:bg-[#181a20] w-full max-w-[220px] sm:max-w-[260px] lg:max-w-none mx-auto overflow-hidden flex items-center justify-center p-2.5 sm:p-3">
                <HardwareImage
                  fileName="Image_1.png"
                  alt={name}
                  width={896}
                  height={1200}
                  sizes="(max-width: 767px) 280px, (max-width: 1023px) 320px, 420px"
                  priority
                  className="w-full h-auto max-h-[220px] sm:max-h-[260px] lg:max-h-[280px] object-contain mx-auto dark:brightness-[0.92] dark:contrast-[1.02]"
                />
              </div>
            </div>

            {/* Engineering Telemetry / Metrics Table */}
            <div className="border-t border-border bg-card dark:bg-card p-3 sm:p-3.5">
              <table className="w-full text-left border-collapse font-mono text-[11px] sm:text-xs">
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="py-1.5 text-muted-foreground uppercase tracking-wider">
                      {t("Format", "Формат")}
                    </td>
                    <td className="py-1.5 text-right font-bold text-foreground">
                      {t("Full-time / B2B Contract", "Full-time / Проектный контракт")}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-muted-foreground uppercase tracking-wider">
                      {t("Shipped", "В продакшне")}
                    </td>
                    <td className="py-1.5 text-right font-bold text-foreground">
                      {t("B2B · TMA · Real-Time", "B2B · TMA · Real-Time")}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-muted-foreground uppercase tracking-wider">
                      {t("Focus", "Специализация")}
                    </td>
                    <td className="py-1.5 text-right font-bold text-foreground">
                      {t("Reliability · Speed · UX", "Надёжность · Скорость · UX")}
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

          {/* Item 3: Stack, Positioning & Action CTAs (Mobile: 3rd, Desktop: Left Column Bottom) */}
          <div className="order-3 lg:order-2 lg:col-span-7 xl:col-span-8 lg:row-start-2 lg:col-start-1 p-5 sm:p-6 lg:p-7 pt-3 sm:pt-4 lg:pt-4 lg:border-r border-t lg:border-t-0 border-border flex flex-col justify-between gap-4">
            <div className="space-y-4">
              {/* Clean Pipe-Separated / Mid-Dot Stack */}
              <div className="border-y border-border py-2.5 font-mono text-[11px] sm:text-xs leading-relaxed text-foreground overflow-x-auto whitespace-nowrap scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden touch-pan-x">
                <span className="font-medium">TypeScript</span>
                <span className="mx-1.5 text-muted-foreground/60">·</span>
                <span className="font-medium">React</span>
                <span className="mx-1.5 text-muted-foreground/60">·</span>
                <span className="font-medium">Next.js</span>
                <span className="mx-1.5 text-muted-foreground/60">·</span>
                <span className="font-medium">Node.js</span>
                <span className="mx-1.5 text-muted-foreground/60">·</span>
                <span className="font-medium">NestJS</span>
                <span className="mx-1.5 text-muted-foreground/60">·</span>
                <span className="font-medium">PostgreSQL</span>
                <span className="mx-1.5 text-muted-foreground/60">·</span>
                <span className="font-medium">Redis</span>
                <span className="mx-1.5 text-muted-foreground/60">·</span>
                <span className="font-medium">WebSockets</span>
              </div>

              {/* Engineering Background & Positioning */}
              <div className="font-sans leading-relaxed">
                <p className="text-sm sm:text-base lg:text-[15px] xl:text-[16px] text-foreground/90 font-normal leading-relaxed">
                  {whyMe}
                </p>
              </div>
            </div>

            {/* CTAs: Deduplicated for .web-only and .tma-only */}
            <div className="pt-3 border-t border-border">
              {/* Web Browser CTAs */}
              <div className="web-only flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 font-mono text-xs uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => openTelegramUrl("https://t.me/AlexanderBullo")}
                  className="tactile-btn w-full sm:w-auto h-10 sm:h-10.5 px-5 bg-primary text-primary-foreground font-bold flex items-center justify-center border border-border cursor-pointer hover:opacity-90 whitespace-nowrap shrink-0"
                >
                  <span>{t("DISCUSS A TASK", "ОБСУДИТЬ ЗАДАЧУ")}</span>
                </button>

                <div className="grid grid-cols-2 sm:flex gap-2 min-w-0">
                  <a
                    href={pdfUrl}
                    download={pdfFileName}
                    className="tactile-btn h-10 sm:h-10.5 px-3 sm:px-4 flex items-center justify-center gap-1.5 bg-background text-foreground border border-border font-bold hover:border-primary hover:text-primary whitespace-nowrap shrink-0 text-center text-xs"
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
                    className="tactile-btn h-10 sm:h-10.5 px-3 sm:px-4 flex items-center justify-center gap-1.5 border border-border bg-background text-foreground font-semibold hover:border-primary whitespace-nowrap shrink-0 text-center text-xs"
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
      {/* SELECTED PROJECTS (COMMERCIAL BLUEPRINTS)                */}
      {/* ======================================================== */}
      <section id="projects" className="py-8 sm:py-10 lg:py-12">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl lg:text-[26px] font-bold tracking-[-0.02em] text-foreground">
            {t("Selected Projects", "Избранные проекты")}
          </h2>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {featuredProjects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i + 1} />
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 03. ENGINEERING STANDARD & CHRONICLE (COMIC 1-2-1-2 GRID)*/}
      {/* ======================================================== */}
      <EngineeringChronicle />

      {/* ======================================================== */}
      {/* QUALIFICATIONS: STACK, EXPERIENCE & CREDENTIALS          */}
      {/* ======================================================== */}
      <section id="experience" className="py-8 sm:py-10 lg:py-12">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl lg:text-[26px] font-bold tracking-[-0.02em] text-foreground">
            {t("Qualifications & Experience", "Квалификация и опыт работы")}
          </h2>
        </div>

        {/* 4 Consolidated Skill Categories */}
        <div id="stack" className="mb-8">
          <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3 font-semibold">
            {t("Core Competencies & Stack", "Ключевые компетенции и стек")}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {skills.map((category) => (
              <SkillCategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>

        {/* Detailed Experience Timeline (Including dynamic manufacturing leadership) */}
        <div className="space-y-4 mb-8">
          <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3 font-semibold">
            {t("Work Experience Timeline", "Хронология опыта работы")}
          </div>
          <div className="space-y-6">
            {experiences.map((exp, idx) => (
              <ExperienceItem key={exp.id} experience={exp} index={idx} />
            ))}
          </div>
        </div>

        {/* Education & Languages */}
        <div id="education" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Education */}
          <div className="lg:col-span-7 border border-border bg-card p-5 sm:p-7 space-y-5">
            <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground border-b border-border pb-3">
              {t("Academic Credentials & Training", "Высшее образование и подготовка")}
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
                      {t("Professional Development", "Повышение квалификации")}
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
      {/* PLATFORM COLOPHON (ABOUT THIS APP)                       */}
      {/* ======================================================== */}
      {portfolioProject && (
        <section className="py-6 sm:py-8">
          <div className="border border-border bg-card/60 p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="font-mono text-[10px] uppercase tracking-wider text-accent-aa font-bold">
                {t("ABOUT THIS PLATFORM", "ОБ ЭТОЙ ПЛАТФОРМЕ")}
              </div>
              <h3 className="font-sans font-bold text-base text-foreground tracking-[-0.02em]">
                {pickLocale(portfolioProject, "title", lang)}
              </h3>
              <p className="font-sans text-xs text-muted-foreground leading-relaxed">
                {pickLocale(portfolioProject, "description", lang)}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href={`/projects/${portfolioProject.slug}`}
                className="tactile-btn min-h-10 px-4 flex items-center justify-center border border-border bg-background text-foreground font-mono text-xs uppercase tracking-wider font-semibold hover:border-primary hover:text-primary"
              >
                <span>{t("VIEW BLUEPRINT", "РАЗБОР АРХИТЕКТУРЫ")}</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* CONTACT                                                  */}
      {/* ======================================================== */}
      <section id="contact" className="py-8 sm:py-10 lg:py-12">
        <div className="mb-4 sm:mb-5">
          <h2 className="text-xl sm:text-2xl lg:text-[26px] font-bold tracking-[-0.02em] text-foreground">
            {t("Contact", "Контакты")}
          </h2>
        </div>

        <div className="border border-border bg-card p-5 sm:p-8 space-y-6">
          <p className="font-sans text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            {t(
              "Discussing a new product build, strengthening an engineering team, or tackling a complex technical challenge? Reach out via Telegram or email — I reply promptly and to the point.",
              "Обсуждаете запуск нового продукта, усиление инженерной команды или сложную техническую задачу? Напишите в Telegram или на почту — отвечу предметно и по делу."
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
