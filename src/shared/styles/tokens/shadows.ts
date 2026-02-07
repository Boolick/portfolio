/**
 * Shadow Design Tokens
 * 
 * Box shadows and glow effects for depth and emphasis.
 */

// ============================================
// BASE SHADOWS
// ============================================

export const shadows = {
  none: 'none',
  
  // Elevation shadows (standard)
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  
  // Inner shadows
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  innerMd: 'inset 0 4px 6px -1px rgb(0 0 0 / 0.1)',
} as const;

// ============================================
// ACCENT GLOW EFFECTS
// ============================================

export const glows = {
  // Amber accent glows
  accent: '0 0 20px rgba(252, 163, 17, 0.3)',
  accentStrong: '0 0 30px rgba(252, 163, 17, 0.5)',
  accentSubtle: '0 0 10px rgba(252, 163, 17, 0.2)',
  
  // Ring glow (for focus states)
  ring: '0 0 0 3px rgba(252, 163, 17, 0.4)',
  ringSubtle: '0 0 0 2px rgba(252, 163, 17, 0.25)',
  
  // Avatar glow
  avatar: '0 0 0 4px rgba(252, 163, 17, 0.3), 0 0 20px rgba(252, 163, 17, 0.2)',
} as const;

// ============================================
// CSS VARIABLE SHADOWS
// ============================================

export const themeShadows = {
  shadow: 'var(--shadow)',
  shadowSm: 'var(--shadow-sm)',
  shadowMd: 'var(--shadow-md)',
  shadowLg: 'var(--shadow-lg)',
  shadowAccent: 'var(--shadow-accent)',
} as const;

// Type exports
export type Shadow = keyof typeof shadows;
export type Glow = keyof typeof glows;
