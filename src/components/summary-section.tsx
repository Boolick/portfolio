'use client';

import { motion } from 'framer-motion';

interface SummarySectionProps {
  title: string;
  content: string;
  index?: number;
}

export function SummarySection({ title, content, index = 0 }: SummarySectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * (index + 1), ease: 'easeOut' }}
      className="mb-8 print:mb-4"
    >
      <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200 print:text-xl print:mb-2">
        {title}
      </h2>
      <p className="text-slate-700 leading-relaxed whitespace-pre-line print:text-sm print:leading-normal">
        {content}
      </p>
    </motion.section>
  );
}
