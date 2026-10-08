"use client";

import { motion } from "framer-motion";
import { cn } from "@/shared/styles";

type GlassVariant = "light" | "dark" | "accent";

interface GlassCardProps {
  children: React.ReactNode;
  variant?: GlassVariant;
  /** Enable hover lift effect */
  hover?: boolean;
  /** Animation delay in seconds */
  delay?: number;
  className?: string;
}

const variantStyles: Record<GlassVariant, string> = {
  light: `
    bg-gradient-to-br from-slate-50 to-white
    border border-gray-100
    hover:border-[var(--color-accent)]/50
  `,
  dark: `
    bg-gradient-to-br from-[var(--color-primary)] to-slate-800
    border border-white/10
    hover:border-[var(--color-accent)]/50
  `,
  accent: `
    bg-[var(--color-accent)]/10
    border border-[var(--color-accent)]/30
    hover:border-[var(--color-accent)]
  `,
};

/**
 * Glass card component with glassmorphism effect.
 * Supports light, dark, and accent variants.
 */
export function GlassCard({
  children,
  variant = "light",
  hover = true,
  delay = 0,
  className = "",
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className={cn(
        "group p-4 rounded-xl transition-all duration-300 min-w-0 overflow-hidden",
        variantStyles[variant],
        hover && "hover:shadow-lg hover:scale-[1.02] cursor-pointer",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
