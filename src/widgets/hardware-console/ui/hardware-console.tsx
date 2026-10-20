"use client";

import { Send, Mail, Linkedin, FileDown } from "lucide-react";
import { useLanguage } from "@/features/language-switcher";
import { pickLocale, pickLocaleArr } from "@/shared/lib";
import { HardwareImage } from "@/shared/ui";
import type { Profile } from "@/entities/profile";
import { ProjectCard, type Project } from "@/entities/project";
import { ExperienceItem, type Experience } from "@/entities/experience";
import { SkillCategoryCard, type SkillCategory } from "@/entities/skill";
import type { Education } from "@/entities/education";
import type { Language } from "@/entities/language";

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
    "Principal Hardware-Minded Software Engineer (Node.js, NestJS, React, TypeScript)";
  const summary =
    pickLocale(profile, "summary", lang) ||
    "Fullstack software engineer focused on React, Next.js, TypeScript and Node.js. 11-year industrial engineering leadership background bringing deterministic systems discipline, scalable FSD architecture, and fault-tolerant real-time UX.";
  const location = pickLocale(profile, "location", lang) || "Hanoi, Vietnam (UTC+7) · Remote";

  const commercialCount = experiences.filter((e) => e.is_commercial).length;
  const pdfUrl = lang === "ru" ? "/resume_ru.pdf" : "/cv_en.pdf";
  const pdfFileName =
    lang === "ru"
      ? "Resume_Aliaksandr_Bullo_RU.pdf"
      : "CV_Aliaksandr_Bullo_EN.pdf";

  return (
    <div className="space-y-12 py-6 sm:py-8">
      {/* ======================================================== */}
      {/* 1. HERO: PERSONNEL DOSSIER & MANIFESTO                   */}
      {/* ======================================================== */}
      <section className="chassis-module p-6 md:p-8 crosshair-corner crosshair-tl crosshair-tr">
        {/* Module Header Bar */}
        <div className="flex flex-wrap items-center justify-between border-b border-border pb-3 mb-6 font-mono text-[11px] gap-2">
          <div className="flex items-center gap-2">
            <span className="text-primary font-bold">[ SPEC // SECTION 01 ]</span>
            <span className="text-muted-foreground">PERSONNEL // DOSSIER</span>
          </div>
          <div className="text-muted-foreground flex items-center gap-3">
            <span>IND_CODE: ENG_ARCH_91</span>
            <span>UNIT_ID: #4092-AB</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Identity, Manifesto, Actions */}
          <div className="lg:col-span-8 space-y-5">
            <div className="space-y-1">
              <div className="font-mono text-xs text-primary font-bold uppercase tracking-widest flex items-center gap-2">
                <span>● {t("PRINCIPAL HARDWARE-MINDED SOFTWARE DEV", "ВЕДУЩИЙ ИНЖЕНЕР РАСПРЕДЕЛЕННЫХ СИСТЕМ")}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground font-sans">
                {name.toUpperCase()}{" "}
                <span className="text-muted-foreground font-normal text-xl sm:text-2xl block sm:inline">
                  / {title}
                </span>
              </h1>
            </div>

            {/* Core Spec Bar */}
            <div className="recessed-well text-[11px] sm:text-xs">
              <span className="text-primary font-bold mr-2">CORE_SPEC:</span>
              <span className="text-foreground">
                TypeScript // React // Next.js (AppRouter) // Node.js // NestJS // PostgreSQL // Redis // WebSockets // FSM
              </span>
            </div>

            {/* Engineering Manifesto */}
            <div className="space-y-3 font-sans text-sm md:text-base leading-relaxed text-foreground">
              <p className="font-semibold text-base md:text-lg">
                {t(
                  "11 years managing heavy industrial manufacturing before transitioning into distributed web systems architecture.",
                  "11 лет управлял тяжелым промышленным производством до перехода в разработку распределенных веб-систем.",
                )}
              </p>
              <p className="text-muted-foreground text-xs md:text-sm font-mono border-l-2 border-primary pl-3 py-1">
                «{summary}»
              </p>
            </div>

            {/* Hardware Quick Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5 font-mono text-xs">
              <a
                href="#chronicle"
                className="tactile-btn inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background dark:bg-primary dark:text-primary-foreground font-bold uppercase tracking-wider"
              >
                <span>{t("ANATOMY OF A GLITCH (CHRONICLE)", "АНАТОМИЯ СБОЯ (ХРОНИКА)")}</span>
                <span>↓</span>
              </a>

              <a
                href="#rack-modules"
                className="tactile-btn inline-flex items-center gap-2 px-4 py-2 bg-card text-foreground border border-border font-bold uppercase tracking-wider hover:border-primary"
              >
                <span>{t("[ MOD_01..04 : PROJECTS ]", "[ MOD_01..04 : ПРОЕКТЫ ]")}</span>
              </a>

              {profile.telegram && (
                <a
                  href={profile.telegram}
                  target="_blank"
                  rel="noreferrer"
                  className="tactile-btn inline-flex items-center gap-1.5 px-3 py-2 border border-border bg-muted text-foreground font-bold uppercase text-[11px]"
                >
                  <Send className="h-3.5 w-3.5 text-primary" />
                  <span>TELEGRAM</span>
                </a>
              )}

              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="tactile-btn inline-flex items-center gap-1.5 px-3 py-2 border border-border bg-muted text-foreground font-bold uppercase text-[11px]"
                >
                  <Mail className="h-3.5 w-3.5 text-primary" />
                  <span>EMAIL</span>
                </a>
              )}
            </div>
          </div>

          {/* Right Column: FIG. 00-A Blueprint Portrait Card */}
          <div className="lg:col-span-4 recessed-well p-4 font-mono text-[11px] relative">
            <div className="flex items-center justify-between border-b border-border pb-2 mb-3">
              <span className="text-primary font-bold">UNIT_CALIBRATION</span>
              <span className="text-muted-foreground">FIG. 00-A</span>
            </div>

            {/* Image 1 from Supabase S3 with fallback */}
            <div className="relative border border-border overflow-hidden bg-card mb-3">
              <HardwareImage
                fileName="Image_1.png"
                alt="Alex Bullo Engineer Blueprint"
                width={800}
                height={1000}
                priority
                className="w-full h-auto object-cover filter contrast-[1.03]"
              />
              <div className="absolute bottom-1 right-1 bg-foreground/90 text-background text-[9px] px-1.5 py-0.5">
                PASS_ID: 01-ENG
              </div>
            </div>

            {/* Calibration Telemetry Table */}
            <table className="w-full text-left border-collapse text-[10px]">
              <tbody>
                <tr className="border-b border-border/30">
                  <td className="py-1 text-muted-foreground">EXPERIENCE:</td>
                  <td className="py-1 text-right font-bold text-foreground">
                    11 YRS PROD + 4 YRS DEV
                  </td>
                </tr>
                <tr className="border-b border-border/30">
                  <td className="py-1 text-muted-foreground">COMMERCIAL:</td>
                  <td className="py-1 text-right font-bold text-foreground">
                    {commercialCount} DEPLOYED SYSTEMS
                  </td>
                </tr>
                <tr className="border-b border-border/30">
                  <td className="py-1 text-muted-foreground">ARCHITECTURE:</td>
                  <td className="py-1 text-right font-bold text-status-ok">
                    FAULT-TOLERANT / FSM
                  </td>
                </tr>
                <tr>
                  <td className="py-1 text-muted-foreground">LOCATION:</td>
                  <td className="py-1 text-right font-bold text-primary">
                    {location}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. COMIC CHRONICLE: ANATOMY OF A GLITCH (6 PANELS)       */}
      {/*    Replaces "Why Me" with Image_2..Image_7 in sequence   */}
      {/* ======================================================== */}
      <section id="chronicle" className="space-y-4 pt-4">
        {/* Section Instrument Header */}
        <div className="chassis-module px-4 py-3 flex flex-wrap items-center justify-between font-mono text-xs gap-2">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 bg-primary text-primary-foreground font-bold">
              [ STRIP // 06 ]
            </span>
            <span className="font-bold text-foreground uppercase tracking-wide">
              {t(
                "CHRONICLE: ANATOMY OF A GLITCH // WHY ARCHITECTURE MATTERS",
                "ХРОНИКА: АНАТОМИЯ СБОЯ // ПОЧЕМУ АРХИТЕКТУРА ИМЕЕТ ЗНАЧЕНИЕ",
              )}
            </span>
          </div>
          <div className="text-muted-foreground flex items-center gap-4 text-[11px]">
            <span>SEQUENCE: 01 → 06</span>
            <span className="text-status-ok font-bold">STATUS: DIAGNOSED</span>
          </div>
        </div>

        {/* 6 Comic Panels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* PANEL 01: Image_2.png (Illusion of Speed / Vibe-coding comfort) */}
          <article className="md:col-span-6 lg:col-span-6 chassis-module flex flex-col justify-between relative">
            <div className="chassis-header bg-muted text-[11px]">
              <span className="text-primary font-bold">PANEL // 01: ILLUSION OF SPEED</span>
              <span className="text-muted-foreground">AI_AGENT: IDLE_COMFORT</span>
            </div>

            <div className="relative p-2 bg-muted/30">
              <HardwareImage
                fileName="Image_2.png"
                alt="Panel 01: Illusion of speed with AI coding agent"
                width={1280}
                height={720}
                className="border border-border"
              />
              <div className="absolute top-4 left-4 right-4 bg-card/95 border border-border p-2 font-mono text-[10px] leading-tight shadow-tactile">
                <span className="text-primary font-bold">VIBE_DEV:</span> «
                {t(
                  "AI agent writes code while I listen to synths. Who needs transaction locks or state contracts anyway?",
                  "Агент сам пишет код, пока я пью кофе под синтезаторы. Зачем вообще думать про архитектуру и блокировки?",
                )}
                »
              </div>
            </div>

            <div className="p-3 border-t border-border font-mono text-[11px] space-y-1 bg-card">
              <div className="text-primary font-bold flex items-center gap-1 text-[10px]">
                <span>▲ ZERO CONCURRENCY DESIGN</span>
              </div>
              <p className="text-muted-foreground text-[10px]">
                {t(
                  "The illusion of rapid prototyping shatters against lack of distributed state understanding.",
                  "Иллюзия быстрого прототипирования разбивается об отсутствие понимания конкурентности.",
                )}
              </p>
            </div>
          </article>

          {/* PANEL 02: Image_3.png (The Trigger / Subway User repeated taps) */}
          <article className="md:col-span-6 lg:col-span-6 chassis-module flex flex-col justify-between relative">
            <div className="chassis-header bg-muted text-[11px]">
              <span className="text-primary font-bold">PANEL // 02: THE TRIGGER</span>
              <span className="text-muted-foreground">LATENCY: +850MS</span>
            </div>

            <div className="relative p-2 bg-muted/30">
              <HardwareImage
                fileName="Image_3.png"
                alt="Panel 02: Subway user repeated button taps"
                width={1280}
                height={720}
                className="border border-border"
              />
              <div className="absolute top-4 left-4 right-4 bg-card/95 border border-border p-2 font-mono text-[10px] leading-tight shadow-tactile">
                <span className="text-primary font-bold">USER_ACTION:</span> «
                {t(
                  "Subway network flickered. BUY NOW button is spinning... I'll smash it 5 more times!",
                  "Связь в вагоне метро мигнула. Кнопка BUY NOW крутит спиннер... Нажму ещё 5 раз!",
                )}
                »
              </div>
            </div>

            <div className="p-3 border-t border-border font-mono text-[11px] space-y-1 bg-card">
              <div className="text-destructive font-bold flex items-center gap-1 text-[10px]">
                <span>▲ UNHANDLED MULTI-SUBMIT</span>
              </div>
              <p className="text-muted-foreground text-[10px]">
                {t(
                  "Client without local debounce and Idempotency-Key floods backend with concurrent duplicate mutations.",
                  "Клиент без локального блокиратора и без Idempotency-Key спамит бэкенд параллельными мутациями.",
                )}
              </p>
            </div>
          </article>

          {/* PANEL 03: Image_4.png (Pipeline Rupture / Deadlock / Balance -1200) */}
          <article className="md:col-span-6 lg:col-span-6 chassis-module flex flex-col justify-between relative">
            <div className="chassis-header bg-muted text-[11px]">
              <span className="text-primary font-bold">PANEL // 03: PIPELINE RUPTURE</span>
              <span className="text-destructive font-bold">DB: DEADLOCK</span>
            </div>

            <div className="relative p-2 bg-muted/30">
              <HardwareImage
                fileName="Image_4.png"
                alt="Panel 03: Database Pipeline Rupture Deadlock"
                width={1280}
                height={720}
                className="border border-border"
              />
              <div className="absolute top-4 left-4 right-4 bg-card/95 border border-destructive p-2 font-mono text-[10px] leading-tight shadow-tactile">
                <span className="text-destructive font-bold">INFRA_LOG:</span>{" "}
                REQUEST 1, 2, 3 collided without idempotency key. Balance: -1200 // HTTP 429 RATE LIMIT EXCEEDED.
              </div>
            </div>

            <div className="p-3 border-t border-border font-mono text-[11px] bg-card">
              <div className="text-foreground font-bold text-[10px]">
                {t(
                  "ROOT CAUSE: Lack of database transaction isolation and distributed locks corrupts data integrity.",
                  "ПРИЧИНА СБОЯ: Отсутствие изоляции транзакций и распределенного мьютекса разрушает данные.",
                )}
              </div>
            </div>
          </article>

          {/* PANEL 04: Image_5.png (Vibe-code Panic / Swarm Alert & Clatter) */}
          <article className="md:col-span-6 lg:col-span-6 chassis-module flex flex-col justify-between relative">
            <div className="chassis-header bg-muted text-[11px]">
              <span className="text-primary font-bold">PANEL // 04: VIBE-CODE PANIC</span>
              <span className="text-destructive font-bold">ALERT: CLATTER</span>
            </div>

            <div className="relative p-2 bg-muted/30">
              <HardwareImage
                fileName="Image_5.png"
                alt="Panel 04: Vibe coder in panic"
                width={1280}
                height={720}
                className="border border-border"
              />
              <div className="absolute top-4 left-4 right-4 bg-card/95 border border-destructive p-2 font-mono text-[10px] leading-tight shadow-tactile">
                <span className="text-destructive font-bold">SWARM_ALERT:</span> «
                {t(
                  "AI agent generated 20 state files, balance is negative $1200! WHAT IS HAPPENING?!",
                  "А-а-а! Агент нагенерил 20 файлов стейта, терминалы красные, баланс в минусе! ЧТО ПРОИСХОДИТ?!",
                )}
                »
              </div>
            </div>

            <div className="p-3 border-t border-border font-mono text-[11px] bg-card flex justify-between items-center">
              <span className="text-foreground text-[10px] font-bold">
                {t("SYMPTOM: Blind AI generation cannot fix race conditions.", "СИМПТОМ: Слепой AI-генератор не лечит гонку состояний.")}
              </span>
              <span className="text-[9px] bg-destructive/10 text-destructive border border-destructive px-1.5 py-0.5 font-bold">
                NO TRANSACTION LOCK
              </span>
            </div>
          </article>

          {/* PANEL 05: Image_6.png (Engineering Intervention / FSM Engine) */}
          <article className="md:col-span-6 lg:col-span-6 chassis-module flex flex-col justify-between relative">
            <div className="chassis-header bg-muted text-[11px]">
              <span className="text-primary font-bold">PANEL // 05: FSM SPECIFICATION</span>
              <span className="text-status-ok font-bold">ALGORITHM: DETERMINISTIC</span>
            </div>

            <div className="relative p-2 bg-muted/30">
              <HardwareImage
                fileName="Image_6.png"
                alt="Panel 05: Engineer architecting Finite State Machine"
                width={1280}
                height={720}
                className="border border-border"
              />
              <div className="absolute top-4 left-4 right-4 bg-card/95 border border-status-ok p-2 font-mono text-[10px] leading-tight shadow-tactile">
                <span className="text-status-ok font-bold">ENGINEER:</span> «
                {t(
                  "Calm down. Introducing Finite State Machine (FSM), UUID Idempotency-Key, and Retry Queue with Exponential Backoff.",
                  "Спокойно. Вводим конечный автомат (FSM), UUID идемпотентности и Exponential Backoff в очередь ретраев.",
                )}
                »
              </div>
            </div>

            <div className="p-3 border-t border-border font-mono text-[11px] bg-card">
              <div className="text-foreground font-bold text-[10px]">
                {t(
                  "SOLUTION: Mathematical state model replaces chaotic useEffects and boolean loading flags.",
                  "РЕШЕНИЕ: Четкая математическая модель состояний вместо хаотичных useEffect и флагов загрузки.",
                )}
              </div>
            </div>
          </article>

          {/* PANEL 06: Image_7.png (Verification / The Springboard to Projects) */}
          <article className="md:col-span-6 lg:col-span-6 chassis-module-double border-2 border-primary flex flex-col justify-between relative">
            <div className="chassis-header bg-primary text-primary-foreground text-[11px]">
              <span className="font-bold">PANEL // 06: VERIFICATION // SPRINGBOARD</span>
              <span className="text-[10px]">200 OK // STATE CONSISTENT</span>
            </div>

            <div className="relative p-2 bg-muted/30">
              <HardwareImage
                fileName="Image_7.png"
                alt="Panel 06: Engineer points directly down to projects"
                width={1280}
                height={720}
                className="border border-border"
              />
              <div className="absolute top-4 left-4 right-4 bg-card/95 border border-primary p-2 font-mono text-[10px] leading-tight shadow-tactile">
                <span className="text-primary font-bold">ALEX B.:</span> «
                {t(
                  "System restored. See how these deterministic principles work in production systems below ↓",
                  "Смотри, как эти принципы работают в боевых системах прямо сейчас. Модули стойки ниже ↓",
                )}
                »
              </div>
            </div>

            <div className="p-3 border-t border-border font-mono text-[11px] bg-muted flex items-center justify-between">
              <span className="text-foreground font-bold uppercase text-[10px]">
                {t("PROCEED TO RACK MODULES:", "ПЕРЕХОД К РЭКОВЫМ МОДУЛЯМ:")}
              </span>
              <a
                href="#rack-modules"
                className="tactile-btn px-3 py-1 bg-primary text-primary-foreground font-bold text-[10px] uppercase"
              >
                {t("VIEW PROJECTS ↓", "ПЕРЕЙТИ К ПРОЕКТАМ ↓")}
              </a>
            </div>
          </article>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. PROJECTS AS 19-INCH EURORACK MODULES                  */}
      {/* ======================================================== */}
      <section id="rack-modules" className="space-y-6 pt-4">
        {/* Rack Enclosure Header Beam */}
        <div className="border border-border bg-foreground text-background dark:bg-card dark:text-foreground px-4 py-3 flex flex-wrap items-center justify-between font-mono text-xs gap-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="rack-bolt" />
              <div className="rack-bolt" />
            </div>
            <span className="text-primary font-bold">[ RACK_MOUNT: 19-INCH // 3U ]</span>
            <span className="font-bold uppercase tracking-wider">
              {t("PRODUCTION ENGINEERING BENCH", "СТЕНД ПРОИЗВОДСТВЕННОЙ ИНЖЕНЕРИИ")} {"//"} {projects.length} ACTIVE MODULES
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-status-ok font-bold">BUS: 100% OPERATIONAL</span>
            <div className="flex items-center gap-1.5">
              <div className="rack-bolt" />
              <div className="rack-bolt" />
            </div>
          </div>
        </div>

        {/* Stack of Eurorack Project Modules */}
        <div className="space-y-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i + 1} />
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. SKILLS & COMPETENCY MATRIX                            */}
      {/* ======================================================== */}
      <section className="space-y-4 pt-4">
        <div className="chassis-module px-4 py-3 flex flex-wrap items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="text-primary font-bold">[ SPEC // SECTION 04 ]</span>
            <span className="font-bold text-foreground uppercase tracking-wide">
              {t("COMPETENCY MATRIX // SYSTEM CAPABILITIES", "МАТРИЦА КОМПЕТЕНЦИЙ // ВОЗМОЖНОСТИ СИСТЕМЫ")}
            </span>
          </div>
          <span className="text-muted-foreground text-[10px]">
            {skills.length} FUNCTIONAL BANKS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {skills.map((category) => (
            <SkillCategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. DATA SHEET & REVISION LOG (EXPERIENCE, EDU, LANGS)    */}
      {/* ======================================================== */}
      <section id="spec-terminal" className="space-y-6 pt-4">
        {/* Section Header */}
        <div className="chassis-module px-4 py-3 flex flex-wrap items-center justify-between font-mono text-xs gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-foreground text-background dark:bg-primary dark:text-primary-foreground font-bold">
              [ DATA SHEET // REV_LOG ]
            </span>
            <span className="font-bold text-foreground uppercase tracking-wider">
              {t("PRODUCTION BACKGROUND & TIMELINE", "ПРОИЗВОДСТВЕННЫЙ & ИНЖЕНЕРНЫЙ ТАЙМЛАЙН")}
            </span>
          </div>
          <span className="text-muted-foreground text-[10px]">STANDARDS: ISO-9001 / CLEAN_CODE</span>
        </div>

        {/* Historical Epochs Summary Table */}
        <div className="chassis-module overflow-x-auto">
          <table className="w-full text-left font-mono text-[11px] border-collapse">
            <thead className="bg-muted border-b border-border text-muted-foreground">
              <tr>
                <th className="p-2.5 font-bold">REVISION / EPOCH</th>
                <th className="p-2.5 font-bold">ROLE & SYSTEM</th>
                <th className="p-2.5 font-bold">CORE DISCIPLINE</th>
                <th className="p-2.5 font-bold">OUTCOME / METRIC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              <tr className="hover:bg-muted/40 transition-colors">
                <td className="p-2.5 font-bold text-primary">REV 2022 — 2026</td>
                <td className="p-2.5 font-bold text-foreground">FULLSTACK ARCHITECT & DEV</td>
                <td className="p-2.5 text-muted-foreground">
                  {t(
                    "Distributed web architectures, B2B platforms, Telegram Mini Apps, high-frequency trade terminals.",
                    "Распределенные веб-сервисы, B2B-платформы, Telegram Mini Apps, торговые терминалы.",
                  )}
                </td>
                <td className="p-2.5 font-bold text-status-ok">99.9% UPTIME // ZERO DEADLOCKS</td>
              </tr>
              <tr className="hover:bg-muted/40 transition-colors">
                <td className="p-2.5 font-bold text-foreground">REV 2011 — 2022</td>
                <td className="p-2.5 font-bold text-foreground">HEAD OF PRODUCTION / DIRECTOR</td>
                <td className="p-2.5 text-muted-foreground">
                  {t(
                    "11 years leading heavy industrial manufacturing plant: total quality control, cost calculations, CNC automation.",
                    "11 лет руководства крупным производственным цехом: сквозной контроль качества, расчет себестоимости, станки с ЧПУ.",
                  )}
                </td>
                <td className="p-2.5 font-bold text-foreground">+180% OUTPUT EFFICIENCY</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Detailed Experience Items */}
        <div className="space-y-4">
          {experiences.map((exp) => (
            <ExperienceItem key={exp.id} experience={exp} />
          ))}
        </div>

        {/* Credentials & Communication Protocols (Education & Languages) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-2">
          {/* Education Module */}
          <div className="lg:col-span-7 chassis-module flex flex-col justify-between">
            <div className="chassis-header bg-muted">
              <span className="font-mono text-xs font-bold uppercase text-primary">
                [ SPEC // SECTION 05 ] EDUCATION_CREDENTIALS
              </span>
              <span className="text-[10px] text-muted-foreground">DEGREE: VERIFIED</span>
            </div>

            <div className="p-5 sm:p-6 space-y-4 flex-1">
              {education ? (
                <>
                  <div>
                    <h4 className="font-sans font-bold text-base text-foreground uppercase tracking-tight">
                      {pickLocale(education, "degree", lang)}
                    </h4>
                    <p className="font-mono text-xs text-muted-foreground mt-0.5">
                      {pickLocale(education, "institution", lang)} · {education.year}
                    </p>
                  </div>

                  {pickLocaleArr(education, "additional", lang).length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-border">
                      <span className="text-[10px] font-mono text-muted-foreground uppercase block">
                        SPECIALIZED ENGINEERING CERTIFICATIONS:
                      </span>
                      <ul className="space-y-1.5 text-xs font-mono text-foreground">
                        {pickLocaleArr(education, "additional", lang).map((add, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-primary font-bold">+</span>
                            <span>{add}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <div className="font-mono text-xs text-muted-foreground">NO EDUCATION DATA</div>
              )}
            </div>

            <div className="chassis-footer">
              <span>ACADEMIC_BASE: BSTU MINSK (2006-2011)</span>
              <span>CONTINUOUS_LEARNING: ACTIVE</span>
            </div>
          </div>

          {/* Languages Module */}
          <div className="lg:col-span-5 chassis-module flex flex-col justify-between">
            <div className="chassis-header bg-muted">
              <span className="font-mono text-xs font-bold uppercase text-primary">
                [ SPEC // SECTION 06 ] COMM_PROTOCOLS
              </span>
              <span className="text-[10px] text-muted-foreground">LANGUAGES: {languages.length}</span>
            </div>

            <div className="p-5 sm:p-6 space-y-3 flex-1">
              <ul className="space-y-2.5 font-mono text-xs">
                {languages.map((l) => (
                  <li
                    key={l.id}
                    className="flex justify-between items-center pb-2 border-b border-border/40 last:border-0"
                  >
                    <span className="font-bold text-foreground uppercase">
                      {pickLocale(l, "name", lang)}
                    </span>
                    <span className="text-muted-foreground text-[11px]">
                      {pickLocale(l, "level", lang)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="chassis-footer">
              <span>CROSS_BORDER_READY: YES</span>
              <span>ASYNC_COMM: NOMINAL</span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. I/O BUS TERMINAL (CONTACTS & PROTOCOLS)               */}
      {/* ======================================================== */}
      <section className="border border-border bg-terminal text-terminal-foreground p-6 font-mono space-y-4">
        {/* Terminal Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-terminal-border pb-3 text-xs text-terminal-muted gap-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-terminal-foreground font-bold tracking-wider">
              I/O BUS TERMINAL // CONNECT_INTERFACE
            </span>
          </div>
          <span className="text-status-ok font-bold">ONLINE: READY_FOR_DISPATCH</span>
        </div>

        <p className="text-xs text-terminal-muted leading-relaxed">
          {t(
            "Direct channel for senior fullstack roles, high-load architecture consultation, and deterministic product systems.",
            "Прямой канал связи для Senior Fullstack вакансий, архитектурных консультаций и надежных продуктовых систем.",
          )}
        </p>

        {/* 4 Hardware Port Actuators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {profile.telegram && (
            <a
              href={profile.telegram}
              target="_blank"
              rel="noreferrer"
              className="tactile-btn border border-terminal-border bg-card/5 p-3 hover:border-primary hover:bg-card/10 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <Send className="h-3.5 w-3.5 text-primary" />
                <span className="text-terminal-muted">TELEGRAM:</span>
              </div>
              <span className="font-bold text-primary">@AlexanderBullo</span>
            </a>
          )}

          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              className="tactile-btn border border-terminal-border bg-card/5 p-3 hover:border-primary hover:bg-card/10 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-primary" />
                <span className="text-terminal-muted">EMAIL:</span>
              </div>
              <span className="font-bold text-terminal-foreground truncate ml-2">
                {profile.email}
              </span>
            </a>
          )}

          {profile.linkedin && (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="tactile-btn border border-terminal-border bg-card/5 p-3 hover:border-primary hover:bg-card/10 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <Linkedin className="h-3.5 w-3.5 text-primary" />
                <span className="text-terminal-muted">LINKEDIN:</span>
              </div>
              <span className="font-bold text-terminal-foreground">alexander-bullo</span>
            </a>
          )}

          <a
            href={pdfUrl}
            download={pdfFileName}
            className="tactile-btn bg-primary text-primary-foreground font-bold p-3 flex items-center justify-between text-xs uppercase"
          >
            <div className="flex items-center gap-2">
              <FileDown className="h-3.5 w-3.5" />
              <span>RESUME (PDF):</span>
            </div>
            <span>DOWNLOAD ↓</span>
          </a>
        </div>
      </section>
    </div>
  );
}
