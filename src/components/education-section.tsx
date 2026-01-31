'use client';

import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

interface EducationSectionProps {
  title: string;
  education: {
    degree: string;
    institution: string;
    year: string;
  };
  index?: number;
}

export function EducationSection({ title, education, index = 0 }: EducationSectionProps) {
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

      <div className="flex items-start gap-3">
        <div className="p-2 bg-slate-100 rounded-lg print:p-1">
          <GraduationCap size={24} className="text-slate-600 print:w-4 print:h-4" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800 print:text-base">
            {education.degree}
          </h3>
          <p className="text-slate-600 print:text-sm">
            {education.institution}
          </p>
          <p className="text-sm text-slate-500 print:text-xs">
            {education.year}
          </p>
        </div>
      </div>
    </motion.section>
  );
}
