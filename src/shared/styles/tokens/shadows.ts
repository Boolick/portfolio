/**
 * Shadow Design Tokens — Mechanical Framing & Tactile Offset Shadows
 */

export const shadows = {
  none: "none",
  tactile: "var(--shadow-tactile)",
  xs: "var(--shadow-tactile)",
  sm: "var(--shadow-tactile)",
  md: "var(--shadow-tactile)",
  lg: "var(--shadow-tactile)",
  xl: "var(--shadow-tactile)",
  "2xl": "var(--shadow-tactile)",
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
  shadow: "var(--shadow-tactile)",
  shadowSm: "var(--shadow-tactile)",
  shadowMd: "var(--shadow-tactile)",
  shadowLg: "var(--shadow-tactile)",
  shadowAccent: "var(--shadow-tactile)",
} as const;

export type Shadow = keyof typeof shadows;
export type Glow = keyof typeof glows;
