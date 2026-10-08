import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ref = searchParams.get("ref");

  if (!ref) {
    return NextResponse.json({ error: "Missing ref parameter" }, { status: 400 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    // If not configured in environment, skip gracefully without crashing
    return NextResponse.json(
      { message: "Telegram tracking skipped (credentials not set)" },
      { status: 200 }
    );
  }

  const userAgent = req.headers.get("user-agent") || "Unknown";

  // Filter out automated bot crawlers
  const botKeywords = [
    "bot",
    "spider",
    "crawl",
    "googlebot",
    "bingbot",
    "yandex",
    "duckduckbot",
    "slurp",
    "lighthouse",
    "headless",
  ];
  if (botKeywords.some((kw) => userAgent.toLowerCase().includes(kw))) {
    return NextResponse.json({ message: "Bot visit skipped" }, { status: 200 });
  }

  // Extract client geolocation and IP
  const country =
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("x-country") ||
    req.headers.get("cf-ipcountry") ||
    "Unknown";

  const city =
    req.headers.get("x-vercel-ip-city") ||
    req.headers.get("x-city") ||
    "Unknown";

  const rawIp =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    req.headers.get("cf-connecting-ip") ||
    "Unknown IP";

  // HTML sanitization helper
  const esc = (text: string) =>
    text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const safeRef = esc(ref);
  const safeCity = esc(city);
  const safeCountry = esc(country);
  const safeIp = esc(rawIp);
  const safeUa = esc(userAgent.slice(0, 150));
  const time = new Date().toLocaleString("ru-RU", { timeZone: "UTC" }) + " UTC";

  const message = [
    `<b>🚀 New Portfolio Visit!</b>`,
    ``,
    `<b>Source:</b> <code>${safeRef}</code>`,
    `<b>Location:</b> ${safeCity}, ${safeCountry}`,
    `<b>IP:</b> <code>${safeIp}</code>`,
    `<b>Device:</b> <code>${safeUa}</code>`,
    `<b>Time:</b> ${time}`,
  ].join("\n");

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn("Telegram API response error:", errText);
      return NextResponse.json({ error: "Failed to forward to Telegram" }, { status: 502 });
    }

    return NextResponse.json({ success: true, ref: safeRef });
  } catch (error) {
    console.error("Error sending Telegram visit alert:", error);
    return NextResponse.json({ error: "Internal tracking error" }, { status: 500 });
  }
}
