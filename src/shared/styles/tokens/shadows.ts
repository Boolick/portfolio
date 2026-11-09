/**
 * Shadow Design Tokens — Zero Shadows (Depth via 1px Borders & Surface Contrast)
 */

export const shadows = {
  none: "none",
  tactile: "none",
  xs: "none",
  sm: "none",
  md: "none",
  lg: "none",
  xl: "none",
  "2xl": "none",
  inner: "none",
  innerMd: "none",
} as const;

export const glows = {
  accent: "none",
  accentStrong: "none",
  accentSubtle: "none",
  ring: "0 0 0 1px var(--ring)",
  ringSubtle: "0 0 0 1px var(--ring)",
  avatar: "none",
} as const;

export const themeShadows = {
  shadow: "none",
  shadowSm: "none",
  shadowMd: "none",
  shadowLg: "none",
  shadowAccent: "none",
} as const;

export type Shadow = keyof typeof shadows;
export type Glow = keyof typeof glows;
