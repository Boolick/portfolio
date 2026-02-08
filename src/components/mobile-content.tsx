"use client";

import { motion } from "framer-motion";
import { MapPin, Mail, ArrowUpRight } from "lucide-react";
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

      {/* About Section */}
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

        <div className="mt-3 text-gray-600 text-sm leading-relaxed border-l-2 border-[#fca311] pl-3">
          <p>{data.summary.split("\n\n")[0]}</p>
        </div>

        {/* Contact Info */}
        <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <MapPin size={12} className="text-[#fca311]" />
            <span>{data.contacts.location}</span>
          </div>
          <a
            href={CONTACT.MAILTO[locale]}
            className="flex items-center gap-1 hover:text-[#fca311] transition-colors"
          >
            <Mail size={12} className="text-[#fca311]" />
            <span>{data.contacts.email}</span>
          </a>
        </div>
      </section>

      {/* Why Me Section - Competitive Advantage */}
      {data.whyMe && (
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
                <p className="text-xs text-gray-500 italic mb-2">
                  {exp.company}
                </p>
                <ul className="space-y-1 text-xs text-gray-600">
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
              <motion.a
                key={project.id}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 + idx * 0.08, duration: 0.3 }}
                className={`relative block rounded-xl overflow-hidden 
                           bg-gradient-to-br from-[#0a192f] to-slate-800 
                           border border-white/10 p-3
                           ${idx === 0 ? "row-span-2" : ""}`}
              >
                {/* Project initials */}
                <div
                  className={`absolute top-2 right-2 ${idx === 0 ? "text-4xl" : "text-2xl"} font-bold text-white/5`}
                >
                  {project.title.slice(0, 2).toUpperCase()}
                </div>

                <div className="relative z-10 h-full flex flex-col justify-end">
                  <div className="flex items-start justify-between gap-1">
                    <h4
                      className={`font-bold text-white ${idx === 0 ? "text-sm" : "text-xs"}`}
                    >
                      {project.title}
                    </h4>
                    <ArrowUpRight
                      className="text-white/30 shrink-0"
                      size={12}
                    />
                  </div>
                  <p
                    className={`text-gray-400 mt-1 line-clamp-2 ${idx === 0 ? "text-xs" : "text-[10px]"}`}
                  >
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.tags.slice(0, idx === 0 ? 3 : 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.5 text-[9px] bg-white/10 text-gray-300 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Education */}
      <section id="education" className="mb-8 scroll-mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <div className="inline-block bg-[#fca311] text-[#0a192f] px-3 py-1 rounded-r-full font-bold text-xs mb-4 -ml-4">
            {ui.education.toUpperCase()}
          </div>

          <div className="relative pl-4">
            <div className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-[#fca311]" />
            <h3 className="font-bold text-gray-900 text-sm">
              {data.education.degree}
            </h3>
            <p className="text-xs text-gray-500">
              {data.education.institution} | {data.education.year}
            </p>
          </div>

          {/* Professional Development / Courses */}
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
