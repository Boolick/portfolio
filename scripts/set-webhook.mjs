#!/usr/bin/env node

/**
 * ============================================================================
 * Telegram Bot Webhook Management CLI
 * Zero-dependency utility for registering, inspecting, and deleting webhooks.
 *
 * Usage:
 *   node scripts/set-webhook.mjs --help
 *   node --env-file=.env.local scripts/set-webhook.mjs set
 *   node --env-file=.env.local scripts/set-webhook.mjs info
 *   node --env-file=.env.local scripts/set-webhook.mjs delete
 * ============================================================================
 */

const command = process.argv[2] || "set";

if (command === "--help" || command === "-h" || command === "help") {
  console.log(`
Telegram Bot Webhook CLI

Commands:
  set     Register Next.js /api/telegram/webhook endpoint with Telegram (default)
  info    Display current webhook registration details and error status
  delete  Remove current webhook registration from Telegram

Usage:
  node --env-file=.env.local scripts/set-webhook.mjs [set|info|delete]

Environment Variables Required:
  TELEGRAM_BOT_TOKEN       BotFather authentication token (required for all)
  TELEGRAM_WEBHOOK_SECRET  Secret header token sent with updates (required for set)
  NEXT_PUBLIC_SITE_URL     Public HTTPS URL of your deployed site (required for set)
`);
  process.exit(0);
}

const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
const secret = process.env.TELEGRAM_WEBHOOK_SECRET?.trim();
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").trim().replace(/\/$/, "");

function printUsageAndExit(missingVar) {
  console.error(`\x1b[31m[ERROR]\x1b[0m Missing required environment variable: ${missingVar}`);
  console.error(`Please provide it via --env-file=.env.local or your shell environment.`);
  console.error(`Run "node scripts/set-webhook.mjs --help" for more details.`);
  process.exit(1);
}

if (!token) {
  printUsageAndExit("TELEGRAM_BOT_TOKEN");
}

function redactToken(rawToken) {
  const parts = rawToken.split(":");
  if (parts.length === 2) {
    return `${parts[0]}:${"*".repeat(8)}`;
  }
  return "REDACTED";
}

async function run() {
  const redacted = redactToken(token);
  console.log(`\x1b[36m[TMA BOT]\x1b[0m Operating on bot token: ${redacted}`);

  if (command === "set") {
    if (!secret) {
      printUsageAndExit("TELEGRAM_WEBHOOK_SECRET");
    }
    if (!siteUrl) {
      printUsageAndExit("NEXT_PUBLIC_SITE_URL");
    }

    const webhookUrl = `${siteUrl}/api/telegram/webhook`;
    console.log(`\x1b[36m[TMA BOT]\x1b[0m Registering webhook URL: ${webhookUrl}`);

    const payload = {
      url: webhookUrl,
      secret_token: secret,
      allowed_updates: [
        "message",
        "inline_query",
        "chosen_inline_result",
        "callback_query",
      ],
      drop_pending_updates: false,
    };

    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.ok) {
        console.log(`\x1b[32m[SUCCESS]\x1b[0m Webhook successfully registered: ${data.description}`);
      } else {
        console.error(`\x1b[31m[FAILED]\x1b[0m Telegram error: ${data.description} (code ${data.error_code})`);
        process.exit(1);
      }
    } catch (err) {
      console.error(`\x1b[31m[NETWORK ERROR]\x1b[0m Could not connect to api.telegram.org:`, err.message);
      process.exit(1);
    }
  } else if (command === "info") {
    console.log(`\x1b[36m[TMA BOT]\x1b[0m Querying webhook info...`);

    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`);
      const data = await res.json();

      if (data.ok) {
        const info = data.result;
        console.log(`\x1b[32m[STATUS]\x1b[0m Webhook Information:`);
        console.log(`  - URL:                     ${info.url || "(none)"}`);
        console.log(`  - Custom Certificate:      ${info.has_custom_certificate}`);
        console.log(`  - Pending Updates:         ${info.pending_update_count}`);
        console.log(`  - Max Connections:         ${info.max_connections ?? "default (40)"}`);
        console.log(`  - Allowed Updates:         ${(info.allowed_updates || []).join(", ") || "all"}`);
        if (info.last_error_date) {
          const errDate = new Date(info.last_error_date * 1000).toISOString();
          console.log(`  - \x1b[31mLast Error (${errDate})\x1b[0m: ${info.last_error_message}`);
        } else {
          console.log(`  - Last Error:              None`);
        }
      } else {
        console.error(`\x1b[31m[FAILED]\x1b[0m Telegram error: ${data.description}`);
        process.exit(1);
      }
    } catch (err) {
      console.error(`\x1b[31m[NETWORK ERROR]\x1b[0m Could not connect to api.telegram.org:`, err.message);
      process.exit(1);
    }
  } else if (command === "delete") {
    console.log(`\x1b[36m[TMA BOT]\x1b[0m Deleting webhook registration...`);

    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/deleteWebhook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drop_pending_updates: false }),
      });

      const data = await res.json();
      if (data.ok) {
        console.log(`\x1b[32m[SUCCESS]\x1b[0m Webhook deleted: ${data.description}`);
      } else {
        console.error(`\x1b[31m[FAILED]\x1b[0m Telegram error: ${data.description}`);
        process.exit(1);
      }
    } catch (err) {
      console.error(`\x1b[31m[NETWORK ERROR]\x1b[0m Could not connect to api.telegram.org:`, err.message);
      process.exit(1);
    }
  } else {
    console.error(`\x1b[31m[ERROR]\x1b[0m Unknown command: "${command}". Use "set", "info", or "delete".`);
    process.exit(1);
  }
}

run();
