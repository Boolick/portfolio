/**
 * Design System - Main Export
 * 
 * Import design tokens and utilities from this file:
 * import { colors, spacing, cn } from '@/shared/styles';
 */

// ============================================
// DESIGN TOKENS
// ============================================

// Colors
export { palette, colors } from './tokens/colors';
export type { PaletteColor, SemanticColor } from './tokens/colors';

// Typography
export { 
  fontFamily, 
  fontSize, 
  fontWeight, 
  lineHeight, 
  letterSpacing,
  textStyles 
} from './tokens/typography';
export type { FontSize, FontWeight, TextStyle } from './tokens/typography';

// Spacing
export { spacing, semanticSpacing } from './tokens/spacing';
export type { SpacingKey } from './tokens/spacing';

// Shadows
export { shadows, glows, themeShadows } from './tokens/shadows';
export type { Shadow, Glow } from './tokens/shadows';

// Border Radius
export { radii, semanticRadii } from './tokens/radii';
export type { Radius } from './tokens/radii';

// ============================================
// EFFECTS & ANIMATIONS
// ============================================

export { 
  transitions,
  transitionPresets,
  keyframes,
  animationClasses,
  effects 
} from './effects';
export type { TransitionDuration, TransitionEase } from './effects';

// ============================================
// UTILITIES
// ============================================

export { 
  cn,
  cssVar,
  cssVarWithFallback,
  createStyles,
  focusRingClass,
  disabledClass,
  srOnlyClass,
  interactiveClass
} from './utils';

// ============================================
// THEME CSS PATHS (for reference)
// ============================================

/**
 * Theme CSS files to import in globals.css:
 * - themes/default.css   - Main theme (required)
 * - themes/dark.css      - Dark theme override (optional, future)
 * - themes/light.css     - Light theme override (optional, future)
 */
export const THEME_PATHS = {
  default: '@/shared/styles/themes/default.css',
} as const;
