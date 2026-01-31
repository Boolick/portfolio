'use client';

import { motion } from 'framer-motion';
import { MapPin, Mail } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { resumeData, uiStrings } from '@/data/resume-data';

export function MobileContent() {
  const { locale } = useLanguage();
  const data = resumeData[locale];
  const ui = uiStrings[locale];

  const coreSkills = [
    { name: locale === 'en' ? 'Frontend Architecture' : 'Frontend-архитектура', level: 95 },
    { name: 'React / Next.js', level: 90 },
    { name: locale === 'en' ? 'Team Leadership' : 'Лидерство команды', level: 100 },
  ];

  return (
    <main className="min-h-screen bg-white ml-14 p-6 md:hidden print:hidden">
      {/* Header with Portfolio badge */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 rounded-md bg-[#0a192f] flex items-center justify-center text-[#fca311] font-serif text-xs font-bold">
          AB
        </div>
        <span className="text-sm font-bold tracking-wider text-gray-600">PORTFOLIO</span>
      </div>

      {/* About Section - immediate animation */}
      <section id="about" className="mb-10 scroll-mt-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-4xl font-serif font-bold text-[#0a192f] leading-tight">
            {data.name.split(' ')[0]}
            <br />
            <span className="text-[#fca311]">{data.name.split(' ')[1]}</span>
          </h1>
          <p className="text-sm text-[#fca311] font-semibold tracking-wider uppercase mt-2">
            {data.title.split('|')[0].trim()}
          </p>
        </motion.div>

        <div className="mt-4 text-gray-600 text-sm leading-relaxed border-l-3 border-[#fca311] pl-4">
          <p>{data.summary.split('\n\n')[0]}</p>
        </div>

        {/* Contact Info */}
        <div className="mt-4 space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-[#fca311]" />
            <span>{data.contacts.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-[#fca311]" />
            <span>{data.contacts.email}</span>
          </div>
        </div>
      </section>

      {/* Core Skills - immediate animation */}
      <section id="skills" className="mb-10 scroll-mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <div className="inline-block bg-[#fca311] text-[#0a192f] px-4 py-1 rounded-r-full font-bold text-sm mb-6 -ml-6">
            {locale === 'en' ? 'CORE SKILLS' : 'НАВЫКИ'}
          </div>

          <div className="space-y-4">
            {coreSkills.map((skill, idx) => (
              <div key={skill.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-gray-800 uppercase">{skill.name}</span>
                  <span className="text-gray-500">{skill.level}%</span>
                </div>
                <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ delay: 0.2 + idx * 0.1, duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-[#fca311] rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Work Experience - immediate animation */}
      <section id="experience" className="mb-10 scroll-mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="inline-block bg-[#fca311] text-[#0a192f] px-4 py-1 rounded-r-full font-bold text-sm mb-6 -ml-6">
            {ui.experience.toUpperCase()}
          </div>

          <div className="space-y-6">
            {data.experience.slice(0, 2).map((exp, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.1, duration: 0.4 }}
                className="relative pl-6"
              >
                <div className="absolute left-0 top-2 w-2 h-2 rounded-full bg-[#fca311]" />
                <p className="text-xs text-gray-400 uppercase tracking-wide">{exp.period}</p>
                <h3 className="font-bold text-gray-900">{exp.title}</h3>
                <p className="text-sm text-gray-500 italic">{exp.company}</p>
                <p className="text-sm text-gray-600 mt-1">{exp.description[0]}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Education - immediate animation */}
      <section id="education" className="mb-10 scroll-mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <div className="inline-block bg-[#fca311] text-[#0a192f] px-4 py-1 rounded-r-full font-bold text-sm mb-6 -ml-6">
            {ui.education.toUpperCase()}
          </div>

          <div className="relative pl-6">
            <div className="absolute left-0 top-2 w-2 h-2 rounded-full bg-[#fca311]" />
            <h3 className="font-bold text-gray-900">{data.education.degree}</h3>
            <p className="text-sm text-gray-500">{data.education.institution} | {data.education.year}</p>
          </div>
        </motion.div>
      </section>

      {/* Languages - immediate animation */}
      <section id="languages" className="mb-10 scroll-mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <h3 className="text-lg font-bold text-[#0a192f] border-b border-gray-100 pb-2 mb-4">
            {ui.languages}
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.languages.map((lang) => (
              <div
                key={lang.name}
                className="px-3 py-1.5 bg-gray-50 rounded-lg border-l-2 border-[#0a192f] text-sm"
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
