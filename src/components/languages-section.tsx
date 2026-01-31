'use client';

import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

interface LanguagesSectionProps {
  title: string;
  languages: {
    name: string;
    level: string;
  }[];
  index?: number;
}

export function LanguagesSection({ title, languages, index = 0 }: LanguagesSectionProps) {
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

      <div className="flex flex-wrap gap-4 print:gap-2">
        {languages.map((lang) => (
          <div
            key={lang.name}
            className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg print:px-2 print:py-1"
          >
            <Globe size={18} className="text-slate-500 print:w-3 print:h-3" />
            <div>
              <span className="font-medium text-slate-800 print:text-sm">{lang.name}</span>
              <span className="text-slate-500 ml-2 print:text-xs">— {lang.level}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
