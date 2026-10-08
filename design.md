# Design System Specification

This document specifies the design tokens, themes, animations, and utility functions powering the portfolio resume website. The design system is modularly organized in the directory `src/shared/styles` and serves as the single source of truth for the site's styling.

---

## 📂 Architecture and Directory Structure

The design system is split into tokens, themes, animations, and utility helpers:

```
src/shared/styles/
├── tokens/               # Pure JSON-like design variables
│   ├── colors.ts         # Color palette (raw and semantic)
│   ├── typography.ts     # Font weights, sizes, styles, leading, tracking
│   ├── spacing.ts        # Spacing scale and layout constraints
│   ├── shadows.ts        # Depth shadows and glowing accent effects
│   └── radii.ts          # Border radius scale and component mappings
├── themes/               # Theme sheets containing CSS custom variables
│   └── default.css       # Default theme definitions and sidebar overrides
├── effects.ts            # Transitions, keyframe definitions, hover/glass styles
├── utils.ts              # Tailwind merger and design helper utilities
└── index.ts              # Global entry point and token export
```

---

## 🎨 Color Palette & Semantics

Defined in [`src/shared/styles/tokens/colors.ts`](file:///G:/Работа%20моей%20мечты/CV/resume-site/src/shared/styles/tokens/colors.ts).

### 1. Raw Palette
The raw palette defines the exact hex codes used across the website:
- **Navy (Primary Brand):**
  - `navy.900`: `#0a192f`
  - `navy.800`: `#112240`
  - `navy.700`: `#1d3557`
  - `navy.600`: `#233554`
- **Amber (Accent Highlights):**
  - `amber.600`: `#d97706`
  - `amber.500`: `#fca311` (Default Accent)
  - `amber.400`: `#fdb93e`
  - `amber.300`: `#ffc966`
  - `amber.200`: `#ffe4a0`
- **Slate (Neutral Grays - Base/Sidebar):**
  - `slate.50` to `slate.900` (Standard Tailwind scale, from `#f8fafc` to `#0f172a`)
- **Gray (Alternative Neutrals - Light Theme):**
  - `gray.50` to `gray.900` (Standard Tailwind scale, from `#f9fafb` to `#111827`)
- **Status Indicators:**
  - **Success:** Green (`#22c55e`, `#16a34a`)
  - **Danger:** Red (`#ef4444`, `#dc2626`)
  - **Info:** Blue (`#3b82f6`, `#2563eb`)

### 2. Semantic Color Mappings
Components reference semantic tokens mapped to CSS variables, enabling instant theme changes:

| Semantic Key | CSS Variable Reference | Default Light Theme Value | Usage Description |
| :--- | :--- | :--- | :--- |
| `primary` | `var(--color-primary)` | `#0a192f` | Dark brand color (Headings/Sidebar bg) |
| `primaryLight` | `var(--color-primary-light)` | `#112240` | Lighter primary variant |
| `primaryDark` | `var(--color-primary-dark)` | `#071222` | Darker primary variant |
| `accent` | `var(--color-accent)` | `#fca311` | Primary CTA, badges, highlights (Amber) |
| `accentHover` | `var(--color-accent-hover)` | `#e59400` | Accent hover state |
| `accentMuted` | `var(--color-accent-muted)` | `rgba(252, 163, 17, 0.2)` | Faded accent background |
| `background` | `var(--color-background)` | `#f3f4f6` | Global page body background |
| `surface` | `var(--color-surface)` | `#ffffff` | Primary container card background |
| `surfaceElevated` | `var(--color-surface-elevated)`| `#ffffff` | Modals, popovers, dropdown backgrounds |
| `sidebar` | `var(--color-sidebar)` | `#0a192f` | Left sidebar background |
| `foreground` | `var(--color-foreground)` | `#333333` | Main readable body text |
| `muted` | `var(--color-muted)` | `#64748b` | Subtitles, helper text, captions |
| `onPrimary` | `var(--color-on-primary)` | `#ffffff` | Text written on top of primary color |
| `onAccent` | `var(--color-on-accent)` | `#0a192f` | Text written on top of accent color |
| `border` | `var(--color-border)` | `#e5e7eb` | Standard layout borders |
| `borderLight` | `var(--color-border-light)` | `rgba(255, 255, 255, 0.1)` | Subtle/semi-transparent borders |
| `selection` | `var(--color-selection)` | `rgba(252, 163, 17, 0.3)` | Selection highlight background |

---

## 🔤 Typography

Defined in [`src/shared/styles/tokens/typography.ts`](file:///G:/Работа%20моей%20мечты/CV/resume-site/src/shared/styles/tokens/typography.ts).

- **Font Families:**
  - `sans`: `var(--font-sans)` (Maps to Geist Sans / Inter / System UI sans-serif)
  - `mono`: `var(--font-mono)` (Maps to Geist Mono / Fira Code / Consolas)
  - `display`: `var(--font-display)` (Maps to display/heading font)
- **Sizes:**
  - `2xs` (10px), `xs` (12px), `sm` (14px), `base` (16px), `lg` (18px), `xl` (20px), `2xl` (24px), `3xl` (30px), `4xl` (36px), `5xl` (48px)
- **Weights:**
  - `light`: 300, `normal`: 400, `medium`: 500, `semibold`: 600, `bold`: 700, `extrabold`: 800
- **Line Heights:**
  - `none`: 1, `tight`: 1.25, `snug`: 1.375, `normal`: 1.5, `relaxed`: 1.625, `loose`: 2

### Text Style Presets

The typography module exports predefined styles for text nodes:
- `h1`: `36px` / bold / tight line height / tight letter spacing
- `h2`: `24px` / semibold / tight line height
- `h3`: `20px` / semibold / snug line height
- `h4`: `18px` / medium / snug line height
- `body`: `16px` / normal / relaxed line height
- `bodySmall`: `14px` / normal / normal line height
- `label`: `14px` / medium / normal line height
- `caption`: `12px` / normal / normal line height
- `overline`: `12px` / semibold / wider tracking / uppercase

---

## 📏 Spacing & Layout Constraints

Defined in [`src/shared/styles/tokens/spacing.ts`](file:///G:/Работа%20моей%20мечты/CV/resume-site/src/shared/styles/tokens/spacing.ts).

The spacing system relies on a **4px base unit (`0.25rem`)**.

### 1. Spacing Scale

| Token Key | Rem Value | Pixel Value | Typical Application |
| :--- | :--- | :--- | :--- |
| `0.5` | `0.125rem` | 2px | Micro alignments |
| `1` | `0.25rem` | 4px | Small labels gap |
| `2` | `0.5rem` | 8px | Close badges/tags gap |
| `3` | `0.75rem` | 12px | Component inner spacing (small) |
| `4` | `1rem` | 16px | Container padding, standard margins |
| `6` | `1.5rem` | 24px | Main sidebar padding, section gaps |
| `8` | `2rem` | 32px | Outer layout margins |
| `12` | `3rem` | 48px | Large block margins |
| `16` | `4rem` | 64px | Main section vertical spacing |

### 2. Layout Width Constraints
- `contentMaxWidth`: `1280px` (Outer boundary of desktop container layout)
- `sidebarWidth`: `280px` (Desktop sidebar width)

---

## 🌗 Themes (CSS Custom Properties)

Defined in [`src/shared/styles/themes/default.css`](file:///G:/Работа%20моей%20мечты/CV/resume-site/src/shared/styles/themes/default.css).

The default stylesheet registers CSS custom variables on the `:root` pseudo-class (for global styling) and overrides specific variables inside `.sidebar-theme` to generate a dark sidebar on a light site layout.

### Sidebar Theme Context Override (`.sidebar-theme`)
The sidebar is styled with an inverted theme context by overriding standard CSS color variables:
```css
.sidebar-theme {
   --color-background: var(--color-sidebar); /* Inverted background */
   --color-foreground: #ffffff;              /* Crisp white text */
   --color-muted: #94a3b8;                   /* Light slate subtexts */
   --color-border: rgba(255, 255, 255, 0.1);  /* Transparent borders */
   --color-surface: rgba(255, 255, 255, 0.05);/* Glassy container surfaces */
}
```

---

## ☀️ Depth (Shadows & Accent Glows)

Defined in [`src/shared/styles/tokens/shadows.ts`](file:///G:/Работа%20моей%20мечты/CV/resume-site/src/shared/styles/tokens/shadows.ts).

Depth is styled using structural shadows and colored ambient glow drop-shadows:
- **Base shadows:**
  - `xs` (1px elevation), `sm` (small cards), `md` (dropdowns/floating elements), `lg` (large banners), `xl` (active/lifted states), `2xl` (overlays/modals).
  - `inner` / `innerMd` (embedded fields).
- **Accent glow effects (Amber themed):**
  - `glows.accent`: `0 0 20px rgba(252, 163, 17, 0.3)`
  - `glows.accentStrong`: `0 0 30px rgba(252, 163, 17, 0.5)`
  - `glows.accentSubtle`: `0 0 10px rgba(252, 163, 17, 0.2)`
- **Interactive UI focus/active glow rings:**
  - `glows.ring`: `0 0 0 3px rgba(252, 163, 17, 0.4)` (Standard focus outline glow)
  - `glows.avatar`: `0 0 0 4px rgba(252, 163, 17, 0.3), 0 0 20px rgba(252, 163, 17, 0.2)`

---

## 🔲 Border Radii

Defined in [`src/shared/styles/tokens/radii.ts`](file:///G:/Работа%20моей%20мечты/CV/resume-site/src/shared/styles/tokens/radii.ts).

Allows consistent corner rounding across interactive buttons and cards:
- **Base scale:**
  - `sm` (4px), `md` (6px), `DEFAULT` (8px), `lg` (12px), `xl` (16px), `2xl` (24px), `3xl` (32px), `full` (9999px / pills / circles)
- **Component specific semantic mappings:**
  - `button`: `radii.lg` (12px rounded)
  - `buttonSm`: `radii.md` (6px rounded)
  - `card`: `radii.xl` (16px rounded)
  - `badge` & `avatar`: `radii.full` (Circle)
  - `modal`: `radii.2xl` (24px rounded)

---

## 🌀 Transitions & Effects

Defined in [`src/shared/styles/effects.ts`](file:///G:/Работа%20моей%20мечты/CV/resume-site/src/shared/styles/effects.ts).

### 1. Motion Transitions
- **Durations:** `instant` (0ms), `fast` (100ms), `normal` (200ms), `slow` (300ms), `slower` (500ms)
- **Curves:** `linear`, `in` (accelerated), `out` (decelerated), `inOut` (standard ease), `bounce` (snappy spring curve)
- **Transition presets:**
  - `transitionPresets.colors`: Applies ease-in-out colors transition (100ms).
  - `transitionPresets.default`: Full `all 200ms ease-in-out`.
  - `transitionPresets.transformFast`: Smooth `transform 100ms ease-out`.

### 2. CSS Keyframes & Animations
The system registers reusable CSS keyframe strings including:
- `fadeIn`/`fadeOut` (Opacity transition)
- `slideInFromLeft` / `slideInFromRight` / `slideInFromTop` / `slideInFromBottom` (Translating slides)
- `pulse` & `spin` (Standard spin/infinite loading state)
- `ping` & `bounce` (Visual alerts)

### 3. Glassmorphism Specifications
Pre-packaged CSS objects for glassmorphic containers:
- `effects.glass` (Dark/Sidebar context):
  - `background`: `rgba(255, 255, 255, 0.1)`
  - `backdropFilter`: `blur(10px)`
  - `border`: `1px solid rgba(255, 255, 255, 0.2)`
- `effects.glassLight` (Light/Content context):
  - `background`: `rgba(255, 255, 255, 0.8)`
  - `backdropFilter`: `blur(10px)`
  - `border`: `1px solid rgba(0, 0, 0, 0.1)`

---

## 🛠️ Style Utilities & Helpers

Defined in [`src/shared/styles/utils.ts`](file:///G:/Работа%20моей%20мечты/CV/resume-site/src/shared/styles/utils.ts).

### Helper Functions

#### 1. `cn(...inputs: ClassValue[]): string`
A wrapper around `clsx` and `tailwind-merge`. Deduplicates overlapping Tailwind classes and resolves conditional styling.
```typescript
// Usage Example
cn('px-4 py-2 text-gray-500', isActive && 'text-amber-500 font-bold', className)
```

#### 2. `cssVar(name: string): string`
Returns a `var(--[name])` CSS variable string.
```typescript
cssVar('color-primary') // returns 'var(--color-primary)'
```

#### 3. `cssVarWithFallback(name: string, fallback: string): string`
Returns a CSS variable reference with a default value.
```typescript
cssVarWithFallback('color-primary', '#0a192f') // returns 'var(--color-primary, #0a192f)'
```

#### 4. `createStyles(variables: Record<string, string | number>): React.CSSProperties`
A lightweight type-helper cast to construct React inline CSS variable properties.

---

### Common Utility CSS Classes
Pre-compiled classes exported as strings to ensure visual consistency:

- **`focusRingClass` (WCAG Accessibility Compliance):**
  Ensures clear, visible focus rings on elements navigation via keyboard tab:
  `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]`
- **`disabledClass`:**
  `disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed`
- **`srOnlyClass` (Accessibility/SEO):**
  Hides labels visually but keeps them readable for screen readers:
  `absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0 [clip:rect(0,0,0,0)]`
- **`interactiveClass`:**
  Smooth transitions for links, buttons, and items:
  `transition-all duration-200 ease-in-out cursor-pointer`
