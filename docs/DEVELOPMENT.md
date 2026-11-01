<!-- generated-by: gsd-doc-writer -->
# Development Guide

## Local Setup

Follow these instructions to set up an active development environment:

1. Clone the repository and navigate into the project root:
   ```bash
   git clone https://github.com/aliaksandrbullo/resume-site.git
   cd resume-site
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Build Commands

All project lifecycle scripts defined in `package.json`:

| Command | Description |
|---------|-------------|
| `npm run dev` | Starts the Next.js development server on `http://localhost:3000` with hot-module reloading. |
| `npm run build` | Compiles and builds the production application with Next.js App Router optimization. |
| `npm run start` | Boots the built production Next.js server locally for pre-flight testing. |
| `npm run lint` | Runs ESLint analysis across the repository to verify code quality and style compliance. |

Additional operational scripts:

| Command | Description |
|---------|-------------|
| `node --env-file=.env.local scripts/set-webhook.mjs set` | Registers the `/api/telegram/webhook` endpoint with Telegram Cloud Bot API. |
| `node --env-file=.env.local scripts/set-webhook.mjs info` | Inspects active Telegram webhook status and pending update counts. |
| `node --env-file=.env.local scripts/set-webhook.mjs delete` | Deregisters the active Telegram webhook. |

## Code Style

- **Linter**: ESLint 9 using Next.js core vitals and flat configuration (`eslint.config.mjs`). Run checks via `npm run lint`.
- **TypeScript**: Strict mode enabled in `tsconfig.json`. Absolute path alias `@/*` maps to `./src/*`.
- **Styling**: Tailwind CSS v4 integrated via PostCSS (`postcss.config.mjs`) and `@tailwindcss/postcss`. No arbitrary utility sprawl; adhere to theme tokens defined in `src/shared/styles/themes/default.css`.
- **Component Design**: Accessible primitives powered by Radix UI (`@radix-ui/react-*`), motion animated via `framer-motion`, and Lucide icons (`lucide-react`).

## Branch Conventions

Contributors should structure git branches according to the following conventions:

- `feat/feature-name` — New feature or UI module
- `fix/issue-description` — Bug fix or regression patch
- `refactor/scope-name` — Code reorganization without functional changes
- `perf/optimization-target` — Performance and bundle optimization
- `docs/doc-update` — Documentation updates and additions

The primary production branch is `main`.

## PR Process

1. **Branch Off `main`**: Ensure your local working branch is up to date with the latest `main`.
2. **Implement Changes**: Maintain Clean Architecture principles and respect Feature-Sliced Design layer boundaries (`shared` -> `entities` -> `features` -> `widgets` -> `views` -> `app`).
3. **Verify Locally**:
   - Run `npm run lint` to confirm no ESLint errors.
   - Run `npm run build` to ensure clean TypeScript compilation without broken routes.
4. **Submit PR**: Open a pull request against `main` detailing the architectural scope, changes made, and verification steps taken.
