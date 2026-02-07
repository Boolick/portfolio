'use client';

import { motion, type MotionProps } from 'framer-motion';

interface SectionBadgeProps {
  children: React.ReactNode;
  /** Animation delay in seconds */
  delay?: number;
  className?: string;
}

/**
 * Section badge component - the colored tab that extends from the left edge.
 * Uses design system tokens for consistent styling.
 */
export function SectionBadge({ 
  children, 
  delay = 0,
  className = '' 
}: SectionBadgeProps) {
  return (
    <div className="flex items-center mb-8 print:mb-3">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay, duration: 0.4 }}
        className={`
          bg-[var(--color-accent)] text-[var(--color-on-accent)]
          px-6 py-2 rounded-r-full -ml-6 md:-ml-10 lg:-ml-12
          font-bold text-base shadow-sm section-badge
          print:ml-0 print:rounded-none print:px-3 print:py-1
          ${className}
        `}
      >
        {children}
      </motion.div>
    </div>
  );
}
