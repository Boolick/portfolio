/**
 * Style Utilities
 * 
 * Helper functions for working with design tokens.
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ============================================
// CLASS NAME UTILITY
// ============================================

/**
 * Combines class names with tailwind-merge for deduplication.
 * Use this for conditional class names and to merge Tailwind classes.
 * 
 * @example
 * cn('px-4 py-2', isActive && 'bg-primary', className)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ============================================
// CSS VARIABLE HELPERS
// ============================================

/**
 * Creates a CSS variable reference.
 * 
 * @example
 * cssVar('color-primary') // returns 'var(--color-primary)'
 */
export function cssVar(name: string): string {
  return `var(--${name})`;
}

/**
 * Creates a CSS variable reference with a fallback value.
 * 
 * @example
 * cssVarWithFallback('color-primary', '#0a192f')
 * // returns 'var(--color-primary, #0a192f)'
 */
export function cssVarWithFallback(name: string, fallback: string): string {
  return `var(--${name}, ${fallback})`;
}

// ============================================
// STYLE OBJECT HELPERS
// ============================================

/**
 * Creates inline style object with CSS variables.
 * 
 * @example
 * createStyles({
 *   '--custom-color': colors.accent,
 *   '--custom-spacing': spacing[4],
 * })
 */
export function createStyles(
  variables: Record<string, string | number>
): React.CSSProperties {
  return variables as React.CSSProperties;
}

// ============================================
// COMMON STYLE PATTERNS
// ============================================

/**
 * Focus ring styles for accessibility.
 */
export const focusRingClass = cn(
  'focus-visible:outline-none',
  'focus-visible:ring-2',
  'focus-visible:ring-[var(--color-accent)]',
  'focus-visible:ring-offset-2',
  'focus-visible:ring-offset-[var(--color-background)]'
);

/**
 * Disabled state styles.
 */
export const disabledClass = cn(
  'disabled:pointer-events-none',
  'disabled:opacity-50',
  'disabled:cursor-not-allowed'
);

/**
 * Screen reader only (visually hidden).
 */
export const srOnlyClass = cn(
  'absolute',
  'w-px',
  'h-px',
  'p-0',
  '-m-px',
  'overflow-hidden',
  'whitespace-nowrap',
  'border-0',
  '[clip:rect(0,0,0,0)]'
);

/**
 * Smooth transition for interactive elements.
 */
export const interactiveClass = cn(
  'transition-all',
  'duration-200',
  'ease-in-out',
  'cursor-pointer'
);
