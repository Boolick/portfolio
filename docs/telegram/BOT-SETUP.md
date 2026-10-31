# Telegram Bot & Mini App Registration Runbook (@BotFather)

This runbook establishes a dedicated, search-discoverable public Telegram Bot and Telegram Mini App (TMA) entry point for the personal engineering portfolio of **Aliaksandr Bullo** (Senior Fullstack Software Engineer).

> **Aesthetic Rule (D-01):** Strictly zero structural emojis in bot titles, command descriptions, inline placeholders, and menu buttons. All labels follow clean Constructivist engineering terminology.

---

## 1. Bot Creation (`/newbot`)

Open Telegram and send `/newbot` to [`@BotFather`](https://t.me/BotFather).

1. **Bot Display Name:**
   ```text
   Aliaksandr Bullo | Fullstack Node.js React
   ```
   *(Alternative if needed: `Aliaksandr Bullo | Senior Software Engineer`)*

2. **Bot Username:**
   Choose an available username ending in `bot`:
   - Preferred: `bullo_dev_bot`
   - Alternative 1: `aliaksandr_bullo_bot`
   - Alternative 2: `abullo_fullstack_bot`

3. **Save Token:**
   BotFather will return an API token in the format:
   `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`
   Store this in your environment as `TELEGRAM_BOT_TOKEN`.

---

## 2. Global SEO & About Text (`/setabouttext`)

Displayed in Telegram global search results and on the bot's user profile:

Send `/setabouttext` to `@BotFather`, select your bot, and enter:
```text
Fullstack Engineer (Node.js, NestJS, React, Next.js, TypeScript). Production cases, architecture & CV.
```
*(Character count: 99 characters — strictly within the 120-character limit).*

---

## 3. Bilingual Pre-Start Description (`/setdescription`)

Displayed on the empty chat screen before the user taps **Start**:

Send `/setdescription` to `@BotFather`, select your bot, and enter:

```text
[EN] Interactive engineering portfolio and architecture blueprint of Aliaksandr Bullo — Senior Fullstack Software Engineer (11+ years experience).
- High-load backend: Node.js, NestJS, TypeScript, PostgreSQL, Redis, Docker
- Modern frontend: React, Next.js App Router, Tailwind CSS
- Verified case studies: DKMLINE (logistics ERP), DEXSA (fintech), TOWER EMPIRE (high-concurrency simulation), PORTFOLIO
- Tap "Open Portfolio" to launch the native Mini App, or use commands below to download CV and explore production systems.

[RU] Интерактивное инженерное портфолио и архитектурный чертеж Александра Булло — Senior Fullstack Software Engineer (11+ лет опыта).
- Высоконагруженный бэкенд: Node.js, NestJS, TypeScript, PostgreSQL, Redis, Docker
- Современный фронтенд: React, Next.js App Router, Tailwind CSS
- Подтвержденные кейсы: DKMLINE (ERP логистики), DEXSA (финтех), TOWER EMPIRE (симуляция высокой нагрузки), PORTFOLIO
- Нажмите «Open Portfolio» для запуска Mini App или используйте команды для скачивания резюме и контактов.
```

---

## 4. Bot Profile Avatar (`/setuserpic`)

Send `/setuserpic` to `@BotFather`, select your bot, and upload `Image_1.png` (or high-resolution portrait of Aliaksandr Bullo).

---

## 5. Bot Commands Menu (`/setcommands`)

Send `/setcommands` to `@BotFather`, select your bot, and paste the exact list below (zero emojis):

```text
start - Open interactive engineering portfolio
projects - View production case studies
cv - Download CV PDF (EN / RU)
contact - Direct Telegram, Email & LinkedIn
```

---

## 6. Mini App Creation (`/newapp`)

Create the direct Web App client linking Telegram to the portfolio:

1. Send `/newapp` to `@BotFather`.
2. Select your newly created bot.
3. **App Title:**
   ```text
   Aliaksandr Bullo Portfolio
   ```
4. **App Short Description:**
   ```text
   Interactive personal engineering showcase, architecture case studies, and CV.
   ```
5. **App Photo:** Upload a `640x360` preview image (banner/blueprint card).
6. **App Short Name:**
   ```text
   app
   ```
   *(Creates deep-link namespace: `https://t.me/<BOT_USERNAME>/app`)*
7. **Web App URL:**
   ```text
   https://resumeportfoliocv.netlify.app/?platform=tg
   ```

### Resulting Deep-Link Format
Recruiters and colleagues can be linked directly into specific case studies or views:
```text
https://t.me/bullo_dev_bot/app?startapp=case_dkmline
https://t.me/bullo_dev_bot/app?startapp=case_dexsa
https://t.me/bullo_dev_bot/app?startapp=cv
```

---

## 7. Persistent Menu Button (`/setmenubutton`)

Configure the dedicated bottom-left button in the chat interface:

1. Send `/setmenubutton` to `@BotFather`.
2. Select your bot.
3. Choose **Configure menu button**.
4. **Web App URL:**
   ```text
   https://resumeportfoliocv.netlify.app/?platform=tg
   ```
5. **Button Title (zero emojis):**
   ```text
   Open Portfolio
   ```

---

## 8. Inline Mode Configuration (`/setinline` & `/setinlinefeedback`)

Enable recruiters to share case studies inside any Telegram chat:

1. Send `/setinline` to `@BotFather`.
2. Select your bot.
3. **Inline Query Placeholder:**
   ```text
   Search case study (DKMLINE, DEXSA, NestJS...)
   ```
4. Send `/setinlinefeedback` to `@BotFather`, select your bot, and set to **Enabled** (or `100%`).

---

## 9. Dual-Bot Token Architecture (D-01)

The portfolio supports two Telegram bot tokens:

1. **`TELEGRAM_BOT_TOKEN` (Public Bot):**
   - Created via `/newbot` above.
   - Powers the public bot funnel: `/start`, `/projects`, `/cv`, `/contact`, inline queries.
   - Used on the server to cryptographically verify `initData` HMAC-SHA256 signatures from the Telegram Mini App.
   - Responds to recruiter commands and forwards messages to the owner.

2. **`TELEGRAM_ALERT_BOT_TOKEN` (Private Alert Channel - Optional):**
   - If you already run a private system bot for personal notifications, you can specify its token here.
   - All recruiter lead notifications (`POST /api/telegram/visit`, contact submissions, CV downloads) will route through this alert bot.
   - **Fallback:** If `TELEGRAM_ALERT_BOT_TOKEN` is unset or blank, the system automatically falls back to sending alerts through `TELEGRAM_BOT_TOKEN`.

---

## 10. Webhook Registration Secret

To protect the `POST /api/telegram/webhook` endpoint against spoofing (`T-05-02`), generate a 32-byte secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Save this value as `TELEGRAM_WEBHOOK_SECRET` in Netlify / `.env.local`. When registering the webhook URL via `scripts/set-webhook.mjs`, this secret is registered with Telegram's API via `secret_token`.
