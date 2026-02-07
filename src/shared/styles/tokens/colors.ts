/**
 * Color Design Tokens
 * 
 * Raw color palette and semantic color tokens for theming.
 * Use semantic tokens (colors) in components for theme support.
 */

// ============================================
// RAW COLOR PALETTE
// ============================================

export const palette = {
  // Navy - Primary dark colors
  navy: {
    900: '#0a192f',
    800: '#112240',
    700: '#1d3557',
    600: '#233554',
  },
  
  // Amber - Accent colors
  amber: {
    600: '#d97706',
    500: '#fca311',
    400: '#fdb93e',
    300: '#ffc966',
    200: '#ffe4a0',
  },
  
  // Slate - Neutral grays
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  
  // Gray - Alt neutrals for light theme
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  // Status colors
  green: {
    500: '#22c55e',
    600: '#16a34a',
  },
  red: {
    500: '#ef4444',
    600: '#dc2626',
  },
  blue: {
    500: '#3b82f6',
    600: '#2563eb',
  },
  
  // White & Black
  white: '#ffffff',
  black: '#000000',
} as const;

// ============================================
// SEMANTIC COLOR TOKENS (CSS Variables)
// ============================================

/**
 * Semantic colors that reference CSS custom properties.
 * These colors adapt based on the active theme.
 */
export const colors = {
  // Primary brand colors
  primary: 'var(--color-primary)',
  primaryLight: 'var(--color-primary-light)',
  primaryDark: 'var(--color-primary-dark)',
  
  // Accent (CTA, highlights)
  accent: 'var(--color-accent)',
  accentHover: 'var(--color-accent-hover)',
  accentMuted: 'var(--color-accent-muted)',
  
  // Backgrounds
  background: 'var(--color-background)',
  surface: 'var(--color-surface)',
  surfaceElevated: 'var(--color-surface-elevated)',
  sidebar: 'var(--color-sidebar)',
  
  // Text
  foreground: 'var(--color-foreground)',
  muted: 'var(--color-muted)',
  onPrimary: 'var(--color-on-primary)',
  onAccent: 'var(--color-on-accent)',
  
  // Borders
  border: 'var(--color-border)',
  borderLight: 'var(--color-border-light)',
  
  // Selection
  selection: 'var(--color-selection)',
} as const;

// Type exports for TypeScript support
export type PaletteColor = keyof typeof palette;
export type SemanticColor = keyof typeof colors;
