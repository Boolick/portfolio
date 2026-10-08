"use client";

import { motion } from "framer-motion";
import { MapPin, Mail, ArrowUpRight, Briefcase, Rocket } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { resumeData, uiStrings } from "@/data/resume-data";
import { CONTACT } from "@/shared/constants/social-links";

export function MobileContent() {
  const { locale } = useLanguage();
  const data = resumeData[locale];
  const ui = uiStrings[locale];

  return (
    <main className="min-h-screen bg-white ml-16 p-4 md:hidden print:hidden">
      {/* Header with Portfolio badge */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-md bg-[#0a192f] flex items-center justify-center text-[#fca311] text-xs font-bold">
          AB
        </div>
        <span className="text-sm font-bold tracking-wider text-gray-600">
          PORTFOLIO
        </span>
      </div>

      {/* ═══ HERO SECTION — Sales Funnel ═══ */}
      <section id="about" className="mb-8 scroll-mt-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold text-[#0a192f] leading-tight">
            {data.name.split(" ")[0]}
            <br />
            <span className="text-[#fca311]">{data.name.split(" ")[1]}</span>
          </h1>
          <p className="text-xs text-[#fca311] font-semibold tracking-wider uppercase mt-2">
            {data.title.split("·")[0].trim()}
          </p>
        </motion.div>

        {/* ── Status Badges — instant HR answers ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="flex flex-wrap items-center gap-1.5 mt-3"
        >
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-[#fca311]/10 text-[#0a192f] border border-[#fca311]/20">
            <MapPin size={10} className="shrink-0 text-[#fca311]" />
            {data.statusBadge.location}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-gray-50 text-gray-700 border border-gray-200">
            <Briefcase size={10} className="shrink-0 text-[#fca311]" />
            {data.statusBadge.format}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Rocket size={10} className="shrink-0" />
            {data.statusBadge.availability}
          </span>
        </motion.div>

        {/* Summary — short hook */}
        <div className="mt-3 text-gray-600 text-sm leading-relaxed border-l-2 border-[#fca311] pl-3">
          <p>{data.summary}</p>
        </div>

        {/* Contact Info */}
        <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-600">
          <a
            href={CONTACT.MAILTO[locale]}
            className="flex items-center gap-1 hover:text-[#fca311] transition-colors"
          >
            <Mail size={12} className="text-[#fca311]" />
            <span>{data.contacts.email}</span>
          </a>
        </div>
      </section>

      {/* ═══ WHY ME — Structured Bullet Cards ═══ */}
      {data.whyMePoints && data.whyMePoints.length > 0 && (
        <section id="whyme" className="mb-8 scroll-mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.4 }}
          >
            <div className="inline-block bg-[#fca311] text-[#0a192f] px-3 py-1 rounded-r-full font-bold text-xs mb-4 -ml-4">
              {ui.whyMe}
            </div>

            {/* Scannable bullet cards */}
            <div className="space-y-2">
              {data.whyMePoints.map((point, idx) => (
                <motion.div
                  key={point.title}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.12 + idx * 0.06, duration: 0.3 }}
                  className="p-3 rounded-xl bg-gradient-to-br from-[#fca311]/10 to-[#fca311]/5 border border-[#fca311]/20"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="text-xl leading-none mt-0.5 shrink-0" role="img" aria-hidden="true">
                      {point.icon}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-[#0a192f] mb-0.5">
                        {point.title}
                      </h4>
                      <p className="text-[10px] text-slate-800 leading-relaxed">
                        {point.text}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* Fallback: legacy whyMe paragraph */}
      {data.whyMe && (!data.whyMePoints || data.whyMePoints.length === 0) && (
        <section id="whyme" className="mb-8 scroll-mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.4 }}
          >
            <div className="inline-block bg-[#fca311] text-[#0a192f] px-3 py-1 rounded-r-full font-bold text-xs mb-4 -ml-4">
              {ui.whyMe}
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#fca311]/10 to-[#fca311]/5 border border-[#fca311]/20">
              <p className="text-gray-600 text-sm leading-relaxed">
                {data.whyMe}
              </p>
            </div>
          </motion.div>
        </section>
      )}

      {/* Tech Stack - Bento Grid */}
      <section id="skills" className="mb-8 scroll-mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <div className="inline-block bg-[#fca311] text-[#0a192f] px-3 py-1 rounded-r-full font-bold text-xs mb-4 -ml-4">
            {locale === "en" ? "TECH STACK" : "ТЕХНОЛОГИИ"}
          </div>

          {/* Bento Grid - 2 columns */}
          <div className="grid grid-cols-2 gap-2">
            {data.skills.map((category, catIdx) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 + catIdx * 0.05, duration: 0.3 }}
                className="p-3 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-gray-100"
              >
                <h4 className="text-[10px] font-bold text-[#fca311] uppercase tracking-wider mb-2">
                  {category.name}
                </h4>
                <div className="flex flex-wrap gap-1">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-1.5 py-0.5 bg-[#0a192f]/5 text-[#0a192f] rounded text-[10px] font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Work Experience */}
      <section id="experience" className="mb-8 scroll-mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="inline-block bg-[#fca311] text-[#0a192f] px-3 py-1 rounded-r-full font-bold text-xs mb-4 -ml-4">
            {ui.experience.toUpperCase()}
          </div>

          <div className="space-y-5">
            {data.experience.map((exp, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.1, duration: 0.4 }}
                className="relative pl-4 border-l-2 border-[#fca311]/30"
              >
                <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-[#fca311]" />
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                  {exp.period}
                </p>
                <h3 className="font-bold text-gray-900 text-sm">{exp.title}</h3>
                <p className="text-xs text-gray-500 italic mb-3">
                  {exp.company}
                </p>
                <ul className="space-y-2 text-xs text-gray-600">
                  {exp.description.slice(0, 2).map((desc, i) => (
                    <li key={i} className="flex gap-1.5">
                      <span className="text-[#fca311] mt-0.5">•</span>
                      <span>{desc}</span>
                    </li>
                  ))}
                </ul>
                {/* Tech stack */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {exp.stack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-1.5 py-0.5 text-[9px] bg-gray-100 text-gray-600 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Projects - Bento Grid */}
      <section id="projects" className="mb-8 scroll-mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <div className="inline-block bg-[#fca311] text-[#0a192f] px-3 py-1 rounded-r-full font-bold text-xs mb-4 -ml-4">
            {ui.projects.toUpperCase()}
          </div>

          {/* Bento Grid - 2 columns */}
          <div className="grid grid-cols-2 gap-2">
            {data.projects.slice(0, 4).map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 + idx * 0.08, duration: 0.3 }}
                className={`group relative block rounded-xl overflow-hidden 
                           bg-[#0a192f]
                           border border-white/10
                           ${idx === 0 ? "row-span-2" : ""}
                           ${idx === 3 ? "col-span-2" : ""}`}
              >
                {/* Background preview image */}
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${project.image})` }}
                />
                
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 z-10 group-hover:from-black/100 group-hover:via-black/90 group-hover:to-black/70 transition-all duration-300" />

                <div className="relative z-20 h-full flex flex-col justify-end p-3">
                  <a 
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-1 cursor-pointer w-full group/link pb-1"
                    aria-label={`View project: ${project.title}`}
                  >
                    <h4
                      className={`font-bold text-white group-hover/link:text-[#fca311] transition-colors drop-shadow-lg ${idx === 0 ? "text-sm" : "text-xs"}`}
                    >
                      {project.title}
                    </h4>
                    <ArrowUpRight
                      className="text-white/30 group-hover/link:text-[#fca311] group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all duration-200 shrink-0 drop-shadow-lg"
                      size={12}
                    />
                  </a>
                  
                  <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-300 opacity-0 group-hover:opacity-100 mt-0 group-hover:mt-1">
                    <div className="overflow-hidden">
                      <p
                        className={`text-gray-300 drop-shadow-md pb-1 ${idx === 0 ? "text-xs" : "text-[10px]"}`}
                      >
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {project.tags.slice(0, idx === 0 ? 3 : 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-1.5 py-0.5 text-[9px] bg-black/40 text-gray-200 rounded backdrop-blur-sm border border-white/5"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══ EDUCATION — No course dates ═══ */}
      <section id="education" className="mb-8 scroll-mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <div className="inline-block bg-[#fca311] text-[#0a192f] px-3 py-1 rounded-r-full font-bold text-xs mb-4 -ml-4">
            {ui.education.toUpperCase()}
          </div>

          {/* Higher Education */}
          <h4 className="text-[10px] font-bold text-[#fca311] uppercase tracking-wider mb-2">
            {ui.educationHigher}
          </h4>
          <div className="relative pl-4">
            <div className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-[#fca311]" />
            <h3 className="font-bold text-gray-900 text-sm">
              {data.education.degree}
            </h3>
            <p className="text-xs text-gray-500">
              {data.education.institution} | {data.education.year}
            </p>
          </div>

          {/* Professional Development / Courses — NO DATES */}
          {data.education.additional &&
            data.education.additional.length > 0 && (
              <div className="mt-4">
                <h4 className="text-xs font-bold text-[#fca311] uppercase tracking-wider mb-2">
                  {ui.additionalEducation}
                </h4>
                <ul className="space-y-2">
                  {data.education.additional.map((course, idx) => (
                    <li
                      key={idx}
                      className="
                      pl-3 py-1.5
                      border-l-2 border-[#fca311]/50
                      bg-gradient-to-r from-[#fca311]/5 to-transparent
                      rounded-r text-xs text-gray-600
                    "
                    >
                      {course}
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </motion.div>
      </section>

      {/* Languages */}
      <section id="languages" className="mb-8 scroll-mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <h3 className="text-sm font-bold text-[#0a192f] border-b border-gray-100 pb-2 mb-3">
            {ui.languages}
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.languages.map((lang) => (
              <div
                key={lang.name}
                className="px-2 py-1 bg-gray-50 rounded-lg border-l-2 border-[#0a192f] text-xs"
              >
                <span className="font-bold text-[#0a192f]">{lang.name}</span>
                <span className="text-gray-500 ml-1">— {lang.level}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </main>
  );
}
