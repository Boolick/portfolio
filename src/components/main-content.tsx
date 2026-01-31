'use client';

import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { resumeData, uiStrings } from '@/data/resume-data';
import { TimelineItem } from './ui/timeline-item';
import { SkillBar } from './ui/skill-bar';

export function MainContent() {
  const { locale } = useLanguage();
  const data = resumeData[locale];
  const ui = uiStrings[locale];

  const coreSkills = [
    { name: locale === 'en' ? 'Frontend Architecture' : 'Frontend-архитектура', level: 95 },
    { name: 'React / Next.js', level: 90 },
    { name: 'TypeScript', level: 85 },
    { name: locale === 'en' ? 'Node.js & GraphQL' : 'Node.js и GraphQL', level: 80 },
    { name: locale === 'en' ? 'Team Leadership' : 'Лидерство команды', level: 100 },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="flex-grow bg-white p-6 md:p-10 lg:p-12">
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
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#0a192f] tracking-tight leading-tight">
              {data.name.split(' ')[0]}
              <br />
              <span className="text-[#0a192f]">{data.name.split(' ')[1]}</span>
            </h1>
            <p className="text-base md:text-lg text-gray-500 font-light tracking-wide uppercase mt-3">
              {data.title}
            </p>

            {/* Download Button - BELOW title */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={handlePrint}
              className="mt-4 flex items-center gap-2 px-5 py-2 bg-[#0a192f] hover:bg-slate-800 text-white text-sm font-bold uppercase tracking-wide rounded-full transition-all shadow-md hover:shadow-lg print:hidden"
            >
              <Download size={16} />
              <span>Download PDF</span>
            </motion.button>
          </div>

          {/* Right: Avatar - LARGER */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="shrink-0"
          >
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#fca311]/20 flex items-center justify-center p-1.5 border-3 border-[#fca311] shadow-xl">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-3xl md:text-4xl font-serif text-[#fca311]">
                AB
              </div>
            </div>
          </motion.div>
        </div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="mt-6 text-gray-600 leading-relaxed max-w-2xl border-l-4 border-[#fca311] pl-5"
        >
          <p>{data.summary.split('\n\n')[0]}</p>
        </motion.div>
      </motion.header>

      {/* Core Skills - NOW IN MAIN CONTENT */}
      <motion.section
        id="desktop-skills"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="mb-10 scroll-mt-6"
      >
        <div className="flex items-center mb-8">
          <div className="bg-[#fca311] text-[#0a192f] px-6 py-2 rounded-r-full -ml-6 md:-ml-10 lg:-ml-12 font-bold text-base shadow-sm section-badge">
            {locale === 'en' ? 'Core Skills' : 'Ключевые навыки'}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {coreSkills.map((skill, idx) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + idx * 0.05, duration: 0.3 }}
            >
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-gray-800">{skill.name}</span>
                <span className="text-gray-500">{skill.level}%</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ delay: 0.3 + idx * 0.05, duration: 0.6, ease: "easeOut" }}
                  className="h-full bg-[#fca311] rounded-full"
                />
              </div>
            </motion.div>
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
        <div className="flex items-center mb-8">
          <div className="bg-[#fca311] text-[#0a192f] px-6 py-2 rounded-r-full -ml-6 md:-ml-10 lg:-ml-12 font-bold text-base shadow-sm section-badge">
            {locale === 'en' ? 'Work Experience' : 'Опыт работы'}
          </div>
        </div>
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

      {/* Education */}
      <motion.section
        id="desktop-education"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mb-10 scroll-mt-6"
      >
        <div className="flex items-center mb-8">
          <div className="bg-[#fca311] text-[#0a192f] px-6 py-2 rounded-r-full -ml-6 md:-ml-10 lg:-ml-12 font-bold text-base shadow-sm section-badge">
            {ui.education}
          </div>
        </div>
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
      </motion.section>

      {/* Languages */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="mb-10"
      >
        <h3 className="text-xl font-bold text-[#0a192f] border-b-2 border-gray-100 pb-2 mb-5">
          {ui.languages}
        </h3>
        <div className="flex flex-wrap gap-3 languages-container">
          {data.languages.map((lang, idx) => (
            <motion.div
              key={lang.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + idx * 0.1, duration: 0.3 }}
              className="px-4 py-2 bg-gray-50 rounded-lg border-l-4 border-[#0a192f]"
            >
              <span className="font-bold text-[#0a192f]">{lang.name}</span>
              <span className="text-gray-500 ml-2 text-sm">— {lang.level}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-gray-100 text-center md:text-left text-xs text-gray-400">
        <p>© {new Date().getFullYear()} {data.name}. {locale === 'en' ? 'References available upon request.' : 'Рекомендации предоставляются по запросу.'}</p>
      </footer>
    </main>
  );
}
