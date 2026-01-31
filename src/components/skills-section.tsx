'use client';

import { motion } from 'framer-motion';
import type { SkillCategory } from '@/data/resume-data';

interface SkillsSectionProps {
  title: string;
  categories: SkillCategory[];
  index?: number;
}

export function SkillsSection({ title, categories, index = 0 }: SkillsSectionProps) {
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2 print:gap-2">
        {categories.map((category) => (
          <div key={category.name} className="print:break-inside-avoid">
            <h3 className="text-sm font-semibold text-slate-700 mb-2 print:text-xs print:mb-1">
              {category.name}
            </h3>
            <div className="flex flex-wrap gap-2 print:gap-1">
              {category.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors print:px-2 print:py-0.5 print:text-xs print:rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
