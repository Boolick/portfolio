"use client";

import { motion } from "framer-motion";

interface AvatarProps {
  initials: string;
  size?: "sm" | "md" | "lg" | "xl";
  /** Enable glow animation */
  glow?: boolean;
  imageSrc?: string;
  className?: string;
}

const sizeClasses = {
  sm: "w-16 h-16 text-lg",
  md: "w-24 h-24 text-2xl",
  lg: "w-32 h-32 md:w-40 md:h-40 text-3xl md:text-4xl",
  xl: "w-44 h-44 md:w-56 md:h-56 lg:w-64 lg:h-64 text-4xl md:text-5xl lg:text-6xl",
};

/**
 * Avatar component with optional glow effect.
 * Uses design system tokens for consistent styling.
 */
export function Avatar({
  initials,
  size = "lg",
  glow = true,
  imageSrc,
  className = "",
}: AvatarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className={`shrink-0 ${className}`}
    >
      <div
        className={`
          relative
          ${sizeClasses[size]}
          rounded-full 
          bg-[var(--color-accent)]/20 
          flex items-center justify-center 
          p-1
          border-[3px] border-[var(--color-accent)]
          shadow-xl print:shadow-none
          overflow-hidden
          ${glow ? "animate-pulse-glow print:animate-none" : ""}
        `}
        style={
          glow
            ? {
                boxShadow:
                  "0 0 30px rgba(252, 163, 17, 0.3), 0 0 60px rgba(252, 163, 17, 0.1)",
              }
            : undefined
        }
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={initials}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <div
            className={`
              w-full h-full rounded-full 
              bg-gradient-to-br from-slate-700 to-slate-900 
              flex items-center justify-center 
              font-bold text-[var(--color-accent)]
              ${sizeClasses[size].split(" ").pop()}
            `}
          >
            {initials}
          </div>
        )}
      </div>
    </motion.div>
  );
}
