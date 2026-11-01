# Resume Site

Interactive bilingual resume and portfolio site built with Next.js, React, TypeScript, and Framer Motion. The project is optimized for both screen presentation and clean PDF export, with static hosting plus a Netlify function for referral tracking.

## Stack

- Next.js 16 with App Router and static export
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- Netlify Functions

## Features

- English and Russian resume content
- Separate desktop and mobile layouts
- PDF-friendly print layout
- Project showcase with portfolio cards
- SEO metadata and JSON-LD schema
- Referral tracking via `/.netlify/functions/track-visit`

## Project Structure

```text
src/
  app/                 app router entrypoints and global styles
  components/          page sections and UI primitives
  context/             language state
  data/                resume content and localized UI copy
  shared/              theme tokens, helpers, constants
netlify/functions/     serverless tracking handler
public/                static assets and project previews
```

## Development

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Useful commands:

```bash
npm run lint
npm run build
```

App runs at `http://localhost:3000`.

## Content Editing

- Resume data and localized strings: `src/data/resume-data.ts`
- Social links and contact info: `src/shared/constants/social-links.ts`
- Theme variables: `src/shared/styles/themes/default.css`

## Build and Deploy

The app uses static export configured in `next.config.ts`.

- `npm run build` generates the production build
- Static files are emitted to `out/`
- Netlify can serve the exported app and `netlify/functions/*`

## Environment

For the tracking function, configure:

```bash
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

If those variables are missing, the tracking function returns a server configuration error.


## Usage Examples

### Running Local Development Server

Start the local server on `http://localhost:3000`:

```bash
npm run dev
```

### Managing Telegram Webhook via CLI

Register the Next.js `/api/telegram/webhook` endpoint with Telegram:

```bash
node --env-file=.env.local scripts/set-webhook.mjs set
```

Check the active webhook status and configuration:

```bash
node --env-file=.env.local scripts/set-webhook.mjs info
```

### Referral Visit Tracking

Visit notification triggered via referral query parameter:

```bash
curl -X GET "http://localhost:3000/api/track-visit?ref=github"
```

## License

Private repository. All rights reserved.
