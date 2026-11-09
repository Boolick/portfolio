/**
 * Color Design Tokens — Technical Manual & Hardware Console
 *
 * Raw color palette and semantic color tokens for dual-theme hardware UI.
 */

export const palette = {
  // Light Theme: "Paper Manual / EP-133"
  craft: {
    bg: "#f4f0e8",
    surface: "#ffffff",
    border: "#1a1a1a",
    ink: "#121212",
    meta: "#666660",
    dim: "#ebe5d8",
  },

  // Dark Theme: "Matte Hardware Rack"
  rack: {
    bg: "#0e0f12",
    surface: "#15171c",
    border: "#2d3139",
    titanium: "#e6e6e6",
    meta: "#8b909a",
    dim: "#1f232b",
  },

  // Operational Signal Spectrum
  signal: {
    orange: "#ff5c00",
    greenLight: "#059669",
    greenDark: "#10b981",
    redLight: "#dc2626",
    redDark: "#ef4444",
  },

  white: "#ffffff",
  black: "#000000",
} as const;

export const colors = {
  background: "var(--color-background)",
  foreground: "var(--color-foreground)",
  card: "var(--color-card)",
  cardForeground: "var(--color-card-foreground)",
  primary: "var(--color-primary)",
  primaryForeground: "var(--color-primary-foreground)",
  secondary: "var(--color-secondary)",
  secondaryForeground: "var(--color-secondary-foreground)",
  muted: "var(--color-muted)",
  mutedForeground: "var(--color-muted-foreground)",
  accent: "var(--color-accent)",
  accentForeground: "var(--color-accent-foreground)",
  destructive: "var(--color-destructive)",
  destructiveForeground: "var(--color-destructive-foreground)",
  statusOk: "var(--color-status-ok)",
  terminal: "var(--color-terminal)",
  terminalForeground: "var(--color-terminal-foreground)",
  terminalBorder: "var(--color-terminal-border)",
  terminalMuted: "var(--color-terminal-muted)",
  border: "var(--color-border)",
  input: "var(--color-input)",
  ring: "var(--color-ring)",
} as const;

export type PaletteColor = keyof typeof palette;
export type SemanticColor = keyof typeof colors;
