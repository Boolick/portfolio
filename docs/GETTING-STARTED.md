<!-- generated-by: gsd-doc-writer -->
# Getting Started

## Prerequisites

Ensure your development environment meets the following requirements before proceeding:

- **Node.js**: `>= 20.0.0` (LTS recommended)
- **Package Manager**: `npm >= 9.0.0` (or compatible `pnpm` / `yarn`)
- **Git**: `>= 2.30.0`

## Installation Steps

Follow these steps to clone and set up the project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/aliaksandrbullo/resume-site.git
   cd resume-site
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Prepare your local environment configuration:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` to populate any optional Telegram or Supabase keys if you plan to test integration features. For basic UI development and static resume viewing, the application runs with default fallback configurations without external credentials.

## First Run

Launch the local development server:

```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

The application will start with Next.js Turbopack fast refresh enabled.

## Common Setup Issues

### 1. Port 3000 In Use
If port 3000 is occupied by another local service:
```bash
npm run dev -- -p 3001
```

### 2. Telegram Notifications Skipped
If visit tracking notifications do not appear in Telegram during local testing:
- Verify that `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` are configured in `.env.local`.
- Check that your bot is started in Telegram by sending `/start` to your bot.

### 3. Node.js Version Incompatibility
If you experience dependency installation issues or compiler errors, verify your active Node runtime:
```bash
node -v
```
If your Node version is below `20.0.0`, update your runtime or switch versions using `nvm use 20`.

## Next Steps

Explore the following documentation files for in-depth workflows:

- [ARCHITECTURE.md](ARCHITECTURE.md) — Architectural patterns and Feature-Sliced Design layers.
- [DEVELOPMENT.md](DEVELOPMENT.md) — Build scripts, code style, and contribution workflows.
- [CONFIGURATION.md](CONFIGURATION.md) — Comprehensive environment variables and configuration reference.
- [API.md](API.md) — Route handlers, authentication, webhooks, and tracking endpoints.
- [TESTING.md](TESTING.md) — Testing conventions and validation procedures.
