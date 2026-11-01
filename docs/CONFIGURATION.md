<!-- generated-by: gsd-doc-writer -->
# Configuration Guide

## Environment Variables

The application relies on environment variables for service bindings, external APIs, and site canonical URLs. Reference `.env.example` as the canonical template for local development.

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Optional | `https://resumeportfoliocv.netlify.app` | Canonical public site URL used for metadata, social sharing, and Telegram webhooks. |
| `NEXT_PUBLIC_SUPABASE_URL` | Optional | `""` | Supabase project URL for dynamic database access and storage. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional | `""` | Public client anonymous key for browser-level Supabase queries. |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | `""` | Privileged secret key for server-side administrative access and revalidation fallback. |
| `TELEGRAM_BOT_TOKEN` | Optional | `""` | Telegram Bot token provided by @BotFather. Required for Telegram webhook and bot responses. |
| `TELEGRAM_ALERT_BOT_TOKEN` | Optional | `""` | Optional dedicated alert bot token. Defaults to `TELEGRAM_BOT_TOKEN` if omitted. |
| `TELEGRAM_CHAT_ID` | Optional | `""` | Numeric Telegram chat ID of the administrator/owner for conversion alerts and visitor tracking. |
| `TELEGRAM_WEBHOOK_SECRET` | Optional | `""` | 32-byte secret token validating `X-Telegram-Bot-Api-Secret-Token` header on incoming webhooks. |
| `NEXT_PUBLIC_TG_BOT_USERNAME` | Optional | `bullo_dev_bot` | Public Telegram bot username without the `@` symbol used for client-side deep links. |
| `NEXT_PUBLIC_TG_APP_SHORTNAME` | Optional | `app` | Telegram Mini App short name configured in BotFather for direct in-app launching. |
| `REVALIDATE_SECRET` | Optional | `""` | Secret token required to authenticate on-demand ISR purge requests at `/api/revalidate`. |

<!-- VERIFY: Production hosting environment secrets configured in hosting platform dashboard (Netlify / Vercel / Cloudflare). -->

## Config File Format

The project leverages standard TypeScript and JavaScript configuration files across tooling layers:

### Next.js (`next.config.ts`)

Configures image optimization domains (e.g., Supabase storage buckets `**.supabase.co`) and custom HTTP download headers for static PDF exports (`/cv_en.pdf`, `/resume_ru.pdf`).

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/cv_en.pdf",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Content-Disposition", value: 'attachment; filename="CV_Aliaksandr_Bullo_EN.pdf"' },
        ],
      },
    ];
  },
};

export default nextConfig;
```

### TypeScript (`tsconfig.json`)

Enforces strict type checking with path aliases configured to `@/*` pointing to `./src/*`:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### ESLint (`eslint.config.mjs`) and Tailwind CSS (`postcss.config.mjs`)

Modern flat configuration using Next.js core vitals and Tailwind CSS v4 via `@tailwindcss/postcss`.

## Required vs Optional Settings

- **Non-Fatal Graceful Degradation**: Core portfolio browsing operates independently of external credentials. If `NEXT_PUBLIC_SUPABASE_URL` is omitted, data falls back gracefully to static local datasets in `src/data/resume-data.ts`.
- **Telegram Notification Prerequisites**: When `TELEGRAM_BOT_TOKEN` or `TELEGRAM_CHAT_ID` are missing, referral tracking via `GET /api/track-visit` returns `{ message: "Telegram tracking skipped (credentials not set)" }` with HTTP status `200` without throwing server exceptions.
- **Webhook Security**: In production webhook operations, missing `TELEGRAM_WEBHOOK_SECRET` causes webhook verification failure (`HTTP 401 Unauthorized`). CLI registration via `scripts/set-webhook.mjs` requires `TELEGRAM_BOT_TOKEN`, `TELEGRAM_WEBHOOK_SECRET`, and `NEXT_PUBLIC_SITE_URL`.

## Defaults

| Setting | Default Value | Source Location |
|---------|---------------|-----------------|
| Canonical Site URL | `https://resumeportfoliocv.netlify.app` | `src/app/api/telegram/webhook/route.ts` |
| Bot Username | `bullo_dev_bot` | `src/app/api/telegram/webhook/route.ts` |
| Mini App Short Name | `app` | `src/app/api/telegram/webhook/route.ts` |
| Image Formats | `["image/avif", "image/webp"]` | `next.config.ts` |
| Rate Limit Window | `60_000` ms (60 seconds) | `src/app/api/telegram/visit/route.ts` |
| Rate Limit Max | `20` requests / window | `src/app/api/telegram/visit/route.ts` |

## Per-Environment Overrides

- **Development**: Create a `.env.local` file in the project root. Next.js automatically loads `.env.local` during `npm run dev`.
- **Production**: Configure environment variables in the hosting provider's management console (e.g., Netlify Environment Variables, Vercel Project Settings).
- **Security Guardrail**: Never commit `.env` or `.env.local` files containing live credentials to version control. Both are ignored in `.gitignore`.
