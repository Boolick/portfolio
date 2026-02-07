/**
 * Spacing Design Tokens
 * 
 * Consistent spacing scale for margins, paddings, and gaps.
 * Based on 4px base unit (0.25rem).
 */

// ============================================
// SPACING SCALE
// ============================================

export const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
} as const;

// ============================================
// SEMANTIC SPACING
// ============================================

export const semanticSpacing = {
  // Component internal spacing
  componentXs: spacing[2],     // 8px - tight elements
  componentSm: spacing[3],     // 12px - small padding
  componentMd: spacing[4],     // 16px - default padding
  componentLg: spacing[6],     // 24px - large padding
  componentXl: spacing[8],     // 32px - extra large padding
  
  // Section spacing
  sectionSm: spacing[8],       // 32px
  sectionMd: spacing[12],      // 48px
  sectionLg: spacing[16],      // 64px
  
  // Gap between items
  gapXs: spacing[1],           // 4px
  gapSm: spacing[2],           // 8px
  gapMd: spacing[4],           // 16px
  gapLg: spacing[6],           // 24px
  
  // Page layout
  pageInset: spacing[6],       // 24px - page edge padding
  contentMaxWidth: '1280px',   // max content width
  sidebarWidth: '280px',       // sidebar width
} as const;

// Type exports
export type SpacingKey = keyof typeof spacing;
