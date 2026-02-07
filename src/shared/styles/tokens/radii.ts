/**
 * Border Radius Design Tokens
 * 
 * Consistent corner radius values.
 */

// ============================================
// BORDER RADIUS SCALE
// ============================================

export const radii = {
  none: '0',
  sm: '0.25rem',     // 4px
  md: '0.375rem',    // 6px
  DEFAULT: '0.5rem', // 8px
  lg: '0.75rem',     // 12px
  xl: '1rem',        // 16px
  '2xl': '1.5rem',   // 24px
  '3xl': '2rem',     // 32px
  full: '9999px',    // Pill shape
} as const;

// ============================================
// SEMANTIC RADII
// ============================================

export const semanticRadii = {
  // UI Components
  button: radii.lg,
  buttonSm: radii.md,
  buttonPill: radii.full,
  
  card: radii.xl,
  cardSm: radii.lg,
  
  badge: radii.full,
  tag: radii.md,
  
  input: radii.lg,
  
  // Icons & Avatars
  icon: radii.md,
  iconLg: radii.lg,
  avatar: radii.full,
  
  // Containers
  modal: radii['2xl'],
  tooltip: radii.lg,
} as const;

// Type exports
export type Radius = keyof typeof radii;
