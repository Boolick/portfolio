/**
 * Border Radius Design Tokens — Sharp Industrial Geometry (0px)
 */

export const radii = {
  none: "0px",
  sm: "0px",
  md: "0px",
  DEFAULT: "0px",
  lg: "0px",
  xl: "0px",
  "2xl": "0px",
  "3xl": "0px",
  full: "9999px",
} as const;

export const semanticRadii = {
  button: radii.none,
  buttonSm: radii.none,
  buttonPill: radii.none,
  card: radii.none,
  cardSm: radii.none,
  badge: radii.none,
  tag: radii.none,
  input: radii.none,
  icon: radii.none,
  iconLg: radii.none,
  avatar: radii.none,
  modal: radii.none,
  tooltip: radii.none,
} as const;

export type Radius = keyof typeof radii;
