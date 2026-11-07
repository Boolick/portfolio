# Aliaksandr Bullo — Engineering Portfolio & Blueprint

High-performance personal portfolio, interactive engineering showcase, and Telegram Mini App for **Aliaksandr Bullo**, Senior Fullstack Software Engineer.

The application presents verified production case studies, system architecture patterns, and technical competencies in an authentic Swiss / Constructivist typography aesthetic.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router, Server Actions, Route Handlers)
- **UI & Runtimes:** React 19, TypeScript, Tailwind CSS v4
- **State & Fonts:** Native Contexts, Google Manrope & JetBrains Mono
- **Data & Performance:** Edge caching, Server-Side Rendering (SSR/SSG), strict TypeScript data contracts
- **Ergonomics:** Telegram Mini App 8.0+ native shell, tactile haptics, spring smooth scroll engine

---

## Architectural Principles

1. **Feature-Sliced Design (FSD):** Strict layering across `app`, `views`, `widgets`, `features`, `entities`, and `shared`.
2. **Security-First (OWASP):** 
   - Zero credential or token leakage to client-side bundles.
   - Strict Origin & CSRF validation on mutating API route handlers.
   - Cryptographic HMAC-SHA256 signature verification for Telegram Mini App telemetry.
3. **Deterministic Performance:**
   - 0ms layout shift (CLS = 0) with pre-calibrated aspect ratios and font fallback metrics.
   - WebP-first asset delivery with SVG/monogram fallbacks.
   - Complete WCAG 2.2 AA contrast compliance across light and dark themes.

---

## Project Structure

```text
src/
├── app/                  # Next.js App Router entrypoints, route handlers & global styles
├── views/                # Composite page views (Home, Projects, Not-Found)
├── widgets/              # Autonomous UI widgets (HardwareConsole, SiteHeader, SiteFooter)
├── features/             # Interactive UI features (ThemeToggle, LanguageSwitcher, Analytics)
├── entities/             # Business models & domain entities (Profile, Project, Experience)
└── shared/               # Reusable primitives, UI design system tokens & utility engines
public/                   # Static assets, WebP images, and downloadable CV PDFs
scripts/                  # DevOps & webhook management utilities
```

---

## Getting Started

### Prerequisites

- Node.js >= 20.x
- npm >= 10.x

### Installation

```bash
npm install
```

### Local Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Quality Gates & Testing

Run unit tests, linting, and type checking:

```bash
npm test             # Run Node.js native test runner (37 tests)
npm run lint         # Run ESLint checks
npx tsc --noEmit     # TypeScript typecheck
npm run build        # Production Next.js build
```

---

## Environment Configuration

Configuration template is available in `.env.example`. Copy it to `.env.local`:

```bash
cp .env.example .env.local
```

Populate the required environment variables in your deployment dashboard or local environment.

---

## License

Private repository. Copyright © Aliaksandr Bullo. All rights reserved.
