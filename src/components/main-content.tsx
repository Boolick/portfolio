"use client";

import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { resumeData, uiStrings } from "@/data/resume-data";
import { TimelineItem } from "./ui/timeline-item";
import { SectionBadge } from "./ui/section-badge";
import { GlassCard } from "./ui/glass-card";
import { Avatar } from "./ui/avatar";
import { ProjectsSection } from "./projects-section";

export function MainContent() {
  const { locale } = useLanguage();
  const data = resumeData[locale];
  const ui = uiStrings[locale];

  const handlePrint = () => {
    window.print();
  };

  // Get initials from name
  const initials = data.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <main className="flex-grow bg-[var(--color-surface)] p-6 md:p-10 lg:p-12">
      {/* Header with Avatar on RIGHT */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
        id="desktop-about"
      >
        <div className="flex justify-between items-start gap-6">
          {/* Left: Name & Title */}
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-primary)] tracking-tight leading-tight">
              {data.name.split(" ")[0]}
              <br />
              <span className="text-4xl md:text-5xl text-[var(--color-primary)]">
                {data.name.split(" ")[1]}
              </span>
            </h1>
            <p className="text-base md:text-lg text-[var(--color-muted)] font-light tracking-wide uppercase mt-3">
              {data.title}
            </p>

            {/* Download Button - BELOW title */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={handlePrint}
              className="
                mt-4 flex items-center gap-2 px-5 py-2 
                bg-[var(--color-primary)] hover:bg-slate-800 
                text-[var(--color-on-primary)] text-sm font-bold uppercase tracking-wide 
                rounded-full transition-all duration-200
                shadow-md hover:shadow-lg hover:translate-y-[-1px]
                print:hidden
              "
              aria-label={ui.downloadPdf}
            >
              <Download size={16} />
              <span>Download PDF</span>
            </motion.button>
          </div>

          {/* Right: Avatar - with glow effect */}
          <div className="avatar-wrapper mr-12 lg:mr-16">
            <Avatar
              initials={initials}
              size="xl"
              glow
              imageSrc="/avatar_photo.png"
            />
          </div>
        </div>

        {/* Summary - with gradient border */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="
            mt-6 text-[var(--color-foreground)]/80 leading-relaxed max-w-2xl 
            border-l-4 border-[var(--color-accent)] pl-5
            bg-gradient-to-r from-[var(--color-accent)]/5 to-transparent
            py-3 rounded-r-lg
          "
        >
          <p>{data.summary.split("\n\n")[0]}</p>
        </motion.div>
      </motion.header>

      {/* Why Me Section - Competitive Advantage */}
      {data.whyMe && (
        <motion.section
          id="desktop-whyme"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.5 }}
          className="mb-10 scroll-mt-6"
        >
          <SectionBadge delay={0.08}>{ui.whyMe}</SectionBadge>

          <GlassCard variant="accent" delay={0.1}>
            <p className="text-[var(--color-foreground)]/80 leading-relaxed">
              {data.whyMe}
            </p>
          </GlassCard>
        </motion.section>
      )}

      {/* Tech Stack - Modern Bento Grid */}
      <motion.section
        id="desktop-skills"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="mb-10 scroll-mt-6"
      >
        <SectionBadge delay={0.1}>
          {locale === "en" ? "Tech Stack" : "Технологии"}
        </SectionBadge>

        {/* Bento Grid for Skills with Glassmorphism */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {data.skills.map((category, catIdx) => (
            <GlassCard
              key={category.name}
              variant="light"
              delay={0.15 + catIdx * 0.05}
            >
              <h4 className="text-xs font-bold text-[var(--color-accent)] uppercase tracking-wider mb-3">
                {category.name}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="
                      px-2 py-1 
                      bg-[var(--color-primary)]/5 text-[var(--color-primary)] 
                      rounded-md text-xs font-medium 
                      group-hover:bg-[var(--color-primary)]/10 
                      transition-colors duration-200
                    "
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      </motion.section>

      {/* Work Experience */}
      <motion.section
        id="desktop-experience"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
        className="mb-10 scroll-mt-6"
      >
        <SectionBadge delay={0.2}>
          {locale === "en" ? "Work Experience" : "Опыт работы"}
        </SectionBadge>
        <div className="relative timeline-line pl-2 space-y-8">
          {data.experience.map((exp, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + idx * 0.1, duration: 0.4 }}
            >
              <TimelineItem
                title={exp.title}
                company={exp.company}
                period={exp.period}
                description={exp.description}
                tags={exp.stack}
              />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Projects */}
      <ProjectsSection />

      {/* Education */}
      <motion.section
        id="desktop-education"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mb-10 scroll-mt-6"
      >
        <SectionBadge delay={0.45}>{ui.education}</SectionBadge>
        <div className="relative timeline-line pl-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <TimelineItem
              title={data.education.degree}
              company={data.education.institution}
              period={data.education.year}
              description={[]}
              isEducation
            />
          </motion.div>
        </div>

        {/* Professional Development / Courses */}
        {data.education.additional && data.education.additional.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-bold text-[var(--color-primary)] mb-3">
              {ui.additionalEducation}
            </h4>
            <ul className="space-y-2">
              {data.education.additional.map((course, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.65 + idx * 0.1, duration: 0.3 }}
                  className="
                    pl-4 py-2 
                    border-l-2 border-[var(--color-accent)]/50
                    bg-gradient-to-r from-[var(--color-accent)]/5 to-transparent
                    rounded-r-lg
                    text-sm text-[var(--color-foreground)]/80
                  "
                >
                  {course}
                </motion.li>
              ))}
            </ul>
          </div>
        )}
      </motion.section>

      {/* Languages */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="mb-10"
      >
        <h3 className="text-xl font-bold text-[var(--color-primary)] border-b-2 border-gray-100 pb-2 mb-5">
          {ui.languages}
        </h3>
        <div className="flex flex-wrap gap-3 languages-container">
          {data.languages.map((lang, idx) => (
            <motion.div
              key={lang.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + idx * 0.1, duration: 0.3 }}
              className="
                px-4 py-2 bg-gray-50 rounded-lg 
                border-l-4 border-[var(--color-primary)]
                hover:bg-gray-100 hover:shadow-sm
                transition-all duration-200
              "
            >
              <span className="font-bold text-[var(--color-primary)]">
                {lang.name}
              </span>
              <span className="text-[var(--color-muted)] ml-2 text-sm">
                — {lang.level}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-gray-100 text-center md:text-left text-xs text-[var(--color-muted)]">
        <p>
          © {new Date().getFullYear()} {data.name}.{" "}
          {locale === "en"
            ? "References available upon request."
            : "Рекомендации предоставляются по запросу."}
        </p>
      </footer>
    </main>
  );
}
