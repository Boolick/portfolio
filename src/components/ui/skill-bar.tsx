'use client';

import { motion } from 'framer-motion';

interface SkillBarProps {
  name: string;
  level: number;
}

export function SkillBar({ name, level }: SkillBarProps) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-slate-200">{name}</span>
      </div>
      <div className="h-2 w-full rounded-full skill-bar-bg overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="h-full rounded-full skill-bar-fill"
        />
      </div>
    </div>
  );
}
