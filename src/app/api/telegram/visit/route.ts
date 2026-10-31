import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { verifyTelegramInitData } from "@/shared/lib/telegram/verify-init-data";
import { escapeHtml } from "@/shared/lib/telegram/escape-html";
import { getPublicBotToken, getAlertBotToken, tgSendMessage } from "@/shared/lib/telegram/bot-api";

const VisitSchema = z.object({
  initData: z.string().min(1).max(4096),
  path: z.string().min(1).max(200),
  startParam: z.string().max(64).optional().nullable(),
  event: z.enum(["view", "download_cv", "share_case", "cta_click"]).default("view"),
  meta: z.string().max(120).optional(),
});

// In-memory IP rate limiter: 20 req / 60s
interface RateLimitEntry {
  count: number;
  resetAt: number;
}
const ipRateLimits = new Map<string, RateLimitEntry>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20;

// In-memory event deduplication: 10 minutes per (userId + event + path)
const recentEvents = new Map<string, number>();
const DEDUP_WINDOW_MS = 10 * 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  if (ipRateLimits.size > 500) {
    for (const [key, entry] of ipRateLimits.entries()) {
      if (now > entry.resetAt) ipRateLimits.delete(key);
    }
  }

  const current = ipRateLimits.get(ip);
  if (!current || now > current.resetAt) {
    ipRateLimits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (current.count >= RATE_LIMIT_MAX) {
    return false;
  }

  current.count++;
  return true;
}

function checkDeduplication(key: string): boolean {
  const now = Date.now();
  if (recentEvents.size > 500) {
    for (const [k, timestamp] of recentEvents.entries()) {
      if (now - timestamp > DEDUP_WINDOW_MS) recentEvents.delete(k);
    }
  }

  const lastSeen = recentEvents.get(key);
  if (lastSeen && now - lastSeen < DEDUP_WINDOW_MS) {
    return true; // Already recorded recently
  }

  recentEvents.set(key, now);
  return false;
}

export async function POST(req: NextRequest) {
  const clientIp =
    req.headers.get("x-nf-client-connection-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";

  if (!checkRateLimit(clientIp)) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    );
  }

  let body: z.infer<typeof VisitSchema>;
  try {
    const json = await req.json();
    body = VisitSchema.parse(json);
  } catch {
    return NextResponse.json(
      { error: "Invalid payload format" },
      { status: 400 }
    );
  }

  const publicBotToken = getPublicBotToken();
  const alertBotToken = getAlertBotToken();
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!publicBotToken || !chatId) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  // Cryptographic HMAC-SHA256 verification
  const verifyResult = verifyTelegramInitData(body.initData, publicBotToken, 86400);
  if (!verifyResult.ok) {
    return NextResponse.json(
      { error: "Unauthorized initData", reason: verifyResult.reason },
      { status: 401 }
    );
  }

  const user = verifyResult.user;
  const userId = user ? String(user.id) : "anonymous";
  const dedupKey = `${userId}:${body.event}:${body.path}`;

  if (checkDeduplication(dedupKey)) {
    return NextResponse.json({ ok: true, deduplicated: true });
  }

  // Format clean HTML Telegram alert for owner
  const eventLabels: Record<string, string> = {
    view: "TMA Portfolio View",
    download_cv: "CV Download Request",
    share_case: "Case Study Share",
    cta_click: "CTA Engagement",
  };

  const safeEvent = escapeHtml(eventLabels[body.event] || body.event);
  const safePath = escapeHtml(body.path);
  const safeParam = escapeHtml(body.startParam || "none");
  const safeMeta = body.meta ? escapeHtml(body.meta) : null;
  const time = new Date().toLocaleString("ru-RU", { timeZone: "UTC" }) + " UTC";

  let userInfo = `<b>User ID:</b> <code>${escapeHtml(userId)}</code>`;
  if (user) {
    const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ");
    const usernameTag = user.username ? ` (@${escapeHtml(user.username)})` : "";
    userInfo = [
      `<b>User:</b> ${escapeHtml(fullName)}${usernameTag} [<code>${user.id}</code>]`,
      `<b>Lang:</b> <code>${escapeHtml(user.language_code || "unknown")}</code>${user.is_premium ? " [★ Premium]" : ""}`,
    ].join("\n");
  }

  const lines = [
    `<b>📱 ${safeEvent}</b>`,
    ``,
    userInfo,
    `<b>Path:</b> <code>${safePath}</code>`,
    `<b>Start Param:</b> <code>${safeParam}</code>`,
  ];

  if (safeMeta) {
    lines.push(`<b>Meta:</b> <code>${safeMeta}</code>`);
  }
  lines.push(`<b>Time:</b> ${time}`);

  await tgSendMessage(alertBotToken, {
    chat_id: chatId,
    text: lines.join("\n"),
    parse_mode: "HTML",
    disable_web_page_preview: true,
  });

  return NextResponse.json({ ok: true });
}
