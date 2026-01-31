'use client';

import { motion } from 'framer-motion';
import type { ExperienceItem } from '@/data/resume-data';

interface ResumeSectionProps {
  title: string;
  items: ExperienceItem[];
  index?: number;
}

export function ResumeSection({ title, items, index = 0 }: ResumeSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * (index + 1), ease: 'easeOut' }}
      className="mb-8 print:mb-4 print:break-inside-avoid"
    >
      <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200 print:text-xl print:mb-2">
        {title}
      </h2>

      <div className="space-y-6 print:space-y-3">
        {items.map((item, idx) => (
          <article
            key={idx}
            className="print:break-inside-avoid"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 print:mb-1">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 print:text-base">
                  {item.title}
                </h3>
                <p className="text-slate-600 print:text-sm">
                  {item.company} • {item.location}
                </p>
              </div>
              <span className="text-sm text-slate-500 mt-1 sm:mt-0 print:text-xs">
                {item.period}
              </span>
            </div>

            <ul className="list-disc list-outside ml-5 space-y-1 text-slate-700 print:text-sm print:space-y-0.5">
              {item.description.map((desc, descIdx) => (
                <li key={descIdx}>{desc}</li>
              ))}
            </ul>

            {item.stack.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 print:mt-2 print:gap-1">
                {item.stack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 text-xs font-medium text-slate-600 bg-slate-100 rounded print:px-1 print:py-0.5 print:text-[10px]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </motion.section>
  );
}
