import { NextResponse, type NextRequest } from "next/server";
import crypto from "node:crypto";
import { parseStartParam } from "@/shared/lib/telegram/start-param";
import { escapeHtml } from "@/shared/lib/telegram/escape-html";
import {
  getPublicBotToken,
  getAlertBotToken,
  tgSendMessage,
  tgSendDocument,
  tgAnswerInlineQuery,
  tgAnswerCallbackQuery,
} from "@/shared/lib/telegram/bot-api";

// Flood protection for non-command lead forwarding: max 3 messages per 10 min per user
interface FloodEntry {
  count: number;
  resetAt: number;
}
const leadFloodMap = new Map<number, FloodEntry>();
const FLOOD_WINDOW_MS = 10 * 60_000;
const MAX_FLOOD_COUNT = 3;

function checkLeadFlood(userId: number): boolean {
  const now = Date.now();
  if (leadFloodMap.size > 500) {
    for (const [id, entry] of leadFloodMap.entries()) {
      if (now > entry.resetAt) leadFloodMap.delete(id);
    }
  }

  const current = leadFloodMap.get(userId);
  if (!current || now > current.resetAt) {
    leadFloodMap.set(userId, { count: 1, resetAt: now + FLOOD_WINDOW_MS });
    return true;
  }

  if (current.count >= MAX_FLOOD_COUNT) {
    return false;
  }

  current.count++;
  return true;
}

interface TelegramUpdate {
  update_id?: number;
  inline_query?: {
    id: string;
    query: string;
    from: {
      id: number;
      first_name?: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
  };
  callback_query?: {
    id: string;
    data?: string;
    from?: {
      id: number;
      language_code?: string;
    };
    message?: {
      chat?: {
        id: number | string;
      };
    };
  };
  message?: {
    message_id?: number;
    text?: string;
    caption?: string;
    contact?: {
      phone_number?: string;
    };
    chat?: {
      id: number | string;
      type: string;
    };
    from?: {
      id: number;
      first_name?: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
  };
}

export async function POST(req: NextRequest) {
  // Constant-time validation of X-Telegram-Bot-Api-Secret-Token
  const incomingSecret = req.headers.get("x-telegram-bot-api-secret-token");
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;

  if (!expectedSecret || !incomingSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const incBuf = Buffer.from(incomingSecret);
  const expBuf = Buffer.from(expectedSecret);

  if (incBuf.length !== expBuf.length || !crypto.timingSafeEqual(incBuf, expBuf)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let update: TelegramUpdate;
  try {
    update = (await req.json()) as TelegramUpdate;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const botToken = getPublicBotToken();
  const alertToken = getAlertBotToken();
  const ownerChatId = process.env.TELEGRAM_CHAT_ID;
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://resumeportfoliocv.netlify.app").replace(/\/$/, "");
  const botUsername = process.env.NEXT_PUBLIC_TG_BOT_USERNAME || "aliaksandr_bullo_bot";
  const appShortName = process.env.NEXT_PUBLIC_TG_APP_SHORTNAME || "app";

  if (!botToken) {
    return NextResponse.json({ ok: true, skipped: "bot_token_missing" });
  }

  // 1. Handle Inline Queries
  if (update.inline_query) {
    const iq = update.inline_query;
    const q = (iq.query || "").trim().toLowerCase();

    const articles = [
      {
        id: "general_portfolio",
        title: "Aliaksandr Bullo — Engineering Portfolio",
        description: "Senior Fullstack Engineer (11+ yrs). Node.js, NestJS, React, Next.js, TypeScript.",
        thumb_url: `${siteUrl}/images/Image_1.png`,
        startParam: "section_profile",
        text: `<b>Aliaksandr Bullo — Senior Fullstack Engineer</b>\n11+ years industrial engineering experience.\nHigh-load backend & modern frontend architecture.\n\n🌐 <a href="${siteUrl}/?platform=tg">Open Interactive Portfolio</a>`,
      },
      {
        id: "case_dkmline",
        title: "Case: DKMLINE",
        description: "B2B Polymer Raw Materials Platform & Logistics ERP. Node.js & React.",
        thumb_url: `${siteUrl}/projects/dkmline.png`,
        startParam: "case_dkmline",
        text: `<b>Case Study: DKMLINE</b>\nHigh-load B2B platform with real-time supply logistics and order management.\n\n🔗 <a href="${siteUrl}/projects/dkmline?platform=tg">View Architecture Blueprint</a>`,
      },
      {
        id: "case_dexsa",
        title: "Case: DEXSA",
        description: "Industrial Telemetry & IoT Gateway. WebSockets, high throughput.",
        thumb_url: `${siteUrl}/projects/dexsa.png`,
        startParam: "case_dexsa",
        text: `<b>Case Study: DEXSA</b>\nIndustrial telemetry platform handling sub-second sensor streams and fault-tolerant reporting.\n\n🔗 <a href="${siteUrl}/projects/dexsa?platform=tg">View Architecture Blueprint</a>`,
      },
      {
        id: "case_tower_empire",
        title: "Case: TOWER EMPIRE",
        description: "High-Concurrency Simulation Engine & Telegram WebApp.",
        thumb_url: `${siteUrl}/projects/tower-empire.png`,
        startParam: "case_tower-empire",
        text: `<b>Case Study: TOWER EMPIRE</b>\nReal-time simulation engine with deterministic state machines and low-latency client sync.\n\n🔗 <a href="${siteUrl}/projects/tower-empire?platform=tg">View Architecture Blueprint</a>`,
      },
      {
        id: "case_portfolio",
        title: "Case: ENGINEERING PORTFOLIO",
        description: "Constructivist Architecture Blueprint & Mini App. Next.js App Router.",
        thumb_url: `${siteUrl}/projects/portfolio.png`,
        startParam: "case_portfolio",
        text: `<b>Case Study: Engineering Portfolio & TMA</b>\nDeterministic FSD architecture, zero-dependency Telegram runtime, and Swiss typography.\n\n🔗 <a href="${siteUrl}/projects/portfolio?platform=tg">View Architecture Blueprint</a>`,
      },
    ];

    const filtered = articles.filter(
      (a) => !q || a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)
    );

    const results = filtered.slice(0, 5).map((item) => ({
      type: "article",
      id: item.id,
      title: item.title,
      description: item.description,
      thumb_url: item.thumb_url,
      input_message_content: {
        message_text: item.text,
        parse_mode: "HTML",
        disable_web_page_preview: false,
      },
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Launch Mini App",
              url: `https://t.me/${botUsername}/${appShortName}?startapp=${item.startParam}`,
            },
          ],
        ],
      },
    }));

    await tgAnswerInlineQuery(botToken, {
      inline_query_id: iq.id,
      results,
      cache_time: 60,
      is_personal: false,
    });

    return NextResponse.json({ ok: true });
  }

  // 2. Handle Callback Queries (from inline buttons)
  if (update.callback_query) {
    const cb = update.callback_query;
    const data = cb.data || "";
    const chatId = cb.message?.chat?.id;
    const isRu = /^(ru|be|uk|kk)/i.test(cb.from?.language_code || "");

    await tgAnswerCallbackQuery(botToken, { callback_query_id: cb.id });

    if (!chatId) return NextResponse.json({ ok: true });

    if (data === "cmd:projects") {
      await sendProjectsOverview(botToken, chatId, isRu, siteUrl);
      return NextResponse.json({ ok: true });
    }

    if (data === "cmd:cv" || data === "cv:ru" || data === "cv:en") {
      const sendRu = data === "cv:ru" || (data === "cmd:cv" && isRu);
      await sendCvDocument(botToken, chatId, sendRu, siteUrl);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
  }

  // 3. Handle Messages
  const message = update.message;
  if (!message || !message.chat) {
    return NextResponse.json({ ok: true });
  }

  const chatId = message.chat.id;
  const isPrivate = message.chat.type === "private";
  const user = message.from;
  const isRu = /^(ru|be|uk|kk)/i.test(user?.language_code || "");
  const text = (message.text || message.caption || "").trim();

  // Command: /start [payload]
  if (text.startsWith("/start")) {
    const payload = text.split(/\s+/)[1] || null;
    let targetUrl = `${siteUrl}/?platform=tg`;

    if (payload) {
      const parsed = parseStartParam(payload);
      if (parsed.type === "case") {
        targetUrl = `${siteUrl}/projects/${parsed.slug}?platform=tg`;
      } else if (parsed.type === "section") {
        targetUrl = `${siteUrl}/?platform=tg#${parsed.sectionId}`;
      }
    }

    const greetingEn = [
      `<b>Aliaksandr Bullo — Senior Fullstack Software Engineer</b>`,
      ``,
      `11+ years of industrial leadership, high-load architecture, and scalable fullstack systems (Node.js, NestJS, React, Next.js, TypeScript, PostgreSQL, Docker).`,
      ``,
      `Explore verified production case studies, system blueprints, and architecture competencies inside the interactive Telegram Mini App.`,
    ].join("\n");

    const greetingRu = [
      `<b>Александр Булло — Senior Fullstack Software Engineer</b>`,
      ``,
      `11+ лет опыта инженерного лидерства, проектирования высоконагруженных систем и современной веб-разработки (Node.js, NestJS, React, Next.js, TypeScript, PostgreSQL, Docker).`,
      ``,
      `Изучите подтвержденные производственные кейсы, архитектурные чертежи и компетенции в интерактивном Telegram Mini App.`,
    ].join("\n");

    await tgSendMessage(botToken, {
      chat_id: chatId,
      text: isRu ? greetingRu : greetingEn,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: isRu ? "Открыть портфолио" : "Open Engineering Portfolio",
              web_app: { url: targetUrl },
            },
          ],
          [
            {
              text: isRu ? "Кейсы" : "Production Cases",
              callback_data: "cmd:projects",
            },
            {
              text: isRu ? "Резюме PDF" : "CV PDF",
              callback_data: "cmd:cv",
            },
          ],
          [
            {
              text: isRu ? "Написать лично" : "Message Directly",
              url: "https://t.me/AlexanderBullo",
            },
          ],
        ],
      },
    });

    return NextResponse.json({ ok: true });
  }

  // Command: /projects
  if (text.startsWith("/projects")) {
    await sendProjectsOverview(botToken, chatId, isRu, siteUrl);
    return NextResponse.json({ ok: true });
  }

  // Command: /cv
  if (text.startsWith("/cv")) {
    await sendCvDocument(botToken, chatId, isRu, siteUrl);
    return NextResponse.json({ ok: true });
  }

  // Command: /contact
  if (text.startsWith("/contact")) {
    const contactText = isRu
      ? [
          `<b>Контакты для связи</b>`,
          ``,
          `• <b>Telegram:</b> @AlexanderBullo`,
          `• <b>Email:</b> alexanderbullo@gmail.com`,
          `• <b>LinkedIn:</b> <a href="https://linkedin.com/in/alexander-bullo">linkedin.com/in/alexander-bullo</a>`,
          `• <b>Формат:</b> Remote (UTC+7 / CET compatible)`,
          `• <b>Стек:</b> Node.js, NestJS, TypeScript, React, Next.js, PostgreSQL`,
        ].join("\n")
      : [
          `<b>Contact Information</b>`,
          ``,
          `• <b>Telegram:</b> @AlexanderBullo`,
          `• <b>Email:</b> alexanderbullo@gmail.com`,
          `• <b>LinkedIn:</b> <a href="https://linkedin.com/in/alexander-bullo">linkedin.com/in/alexander-bullo</a>`,
          `• <b>Format:</b> Remote (UTC+7 / CET compatible)`,
          `• <b>Core Stack:</b> Node.js, NestJS, TypeScript, React, Next.js, PostgreSQL`,
        ].join("\n");

    await tgSendMessage(botToken, {
      chat_id: chatId,
      text: contactText,
      parse_mode: "HTML",
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: isRu ? "Написать в Telegram" : "Chat on Telegram",
              url: "https://t.me/AlexanderBullo",
            },
          ],
          [
            {
              text: isRu ? "Открыть портфолио" : "Open Portfolio",
              web_app: { url: `${siteUrl}/?platform=tg#contact` },
            },
          ],
        ],
      },
    });

    return NextResponse.json({ ok: true });
  }

  // 4. Free-Text and Contact Lead Forwarding (Non-command updates in private chat)
  if (isPrivate && ownerChatId && String(chatId) !== String(ownerChatId)) {
    const userId = user?.id || 0;
    if (checkLeadFlood(userId)) {
      const senderName = [user?.first_name, user?.last_name].filter(Boolean).join(" ") || "Unknown";
      const username = user?.username ? `@${escapeHtml(user.username)}` : "none";
      const contactPhone = message.contact?.phone_number
        ? escapeHtml(message.contact.phone_number)
        : null;
      const safeContent = escapeHtml(text.slice(0, 1500));

      const leadLines = [
        `<b>📬 New Client / Recruiter Message!</b>`,
        ``,
        `<b>From:</b> ${escapeHtml(senderName)} (${username}) [<code>${userId}</code>]`,
        contactPhone ? `<b>Phone:</b> <code>${contactPhone}</code>` : null,
        `<b>Language:</b> <code>${escapeHtml(user?.language_code || "unknown")}</code>`,
        ``,
        `<b>Message Content:</b>`,
        safeContent ? `<code>${safeContent}</code>` : `<i>[Non-text media / file attached]</i>`,
      ]
        .filter(Boolean)
        .join("\n");

      await tgSendMessage(alertToken, {
        chat_id: ownerChatId,
        text: leadLines,
        parse_mode: "HTML",
      });

      // Polite automated acknowledgment
      const ackText = isRu
        ? `Спасибо за сообщение! Оно успешно доставлено Александру Булло. Для срочной связи вы также можете написать лично: @AlexanderBullo.`
        : `Thank you for your message! It has been forwarded directly to Aliaksandr Bullo. For urgent matters, you can message directly: @AlexanderBullo.`;

      await tgSendMessage(botToken, {
        chat_id: chatId,
        text: ackText,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: isRu ? "Написать лично" : "Message Directly",
                url: "https://t.me/AlexanderBullo",
              },
              {
                text: isRu ? "Открыть портфолио" : "Open Portfolio",
                web_app: { url: `${siteUrl}/?platform=tg` },
              },
            ],
          ],
        },
      });
    }
  }

  return NextResponse.json({ ok: true });
}

async function sendProjectsOverview(
  botToken: string,
  chatId: number | string,
  isRu: boolean,
  siteUrl: string
) {
  const text = isRu
    ? [
        `<b>Подтвержденные производственные кейсы:</b>`,
        ``,
        `1. <b>DKMLINE</b> — B2B-платформа поставок полимерного сырья и логистическая ERP.`,
        `2. <b>DEXSA</b> — Промышленная телеметрия, IoT-шлюзы и обработка потоков через WebSockets.`,
        `3. <b>TOWER EMPIRE</b> — Высоконагруженная симуляционная игра с детерминированным FSM.`,
        `4. <b>PORTFOLIO</b> — Конструктивистская Next.js + Supabase FSD архитектура и Mini App.`,
        ``,
        `Выберите кейс для открытия в Mini App:`,
      ].join("\n")
    : [
        `<b>Verified Production Case Studies:</b>`,
        ``,
        `1. <b>DKMLINE</b> — B2B Polymer Platform & Logistics ERP with real-time supply matching.`,
        `2. <b>DEXSA</b> — Industrial Telemetry & IoT Gateway with sub-second WebSocket streams.`,
        `3. <b>TOWER EMPIRE</b> — High-Concurrency Simulation Engine & Deterministic State Machine.`,
        `4. <b>PORTFOLIO</b> — Constructivist Next.js + Supabase Architecture Blueprint.`,
        ``,
        `Select a case to launch in the Mini App:`,
      ].join("\n");

  await tgSendMessage(botToken, {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "DKMLINE ERP",
            web_app: { url: `${siteUrl}/projects/dkmline?platform=tg` },
          },
          {
            text: "DEXSA Telemetry",
            web_app: { url: `${siteUrl}/projects/dexsa?platform=tg` },
          },
        ],
        [
          {
            text: "TOWER EMPIRE",
            web_app: { url: `${siteUrl}/projects/tower-empire?platform=tg` },
          },
          {
            text: "PORTFOLIO",
            web_app: { url: `${siteUrl}/projects/portfolio?platform=tg` },
          },
        ],
        [
          {
            text: isRu ? "Резюме PDF" : "Download CV PDF",
            callback_data: "cmd:cv",
          },
        ],
      ],
    },
  });
}

async function sendCvDocument(
  botToken: string,
  chatId: number | string,
  isRu: boolean,
  siteUrl: string
) {
  const docFile = isRu ? "resume_ru.pdf" : "cv_en.pdf";
  const outgoingFilename = isRu
    ? "Resume_Aliaksandr_Bullo_RU.pdf"
    : "CV_Aliaksandr_Bullo_EN.pdf";

  const caption = isRu
    ? `Резюме: Александр Булло — Senior Fullstack Software Engineer (11+ лет опыта, Node.js, NestJS, React, Next.js, PostgreSQL).`
    : `Curriculum Vitae: Aliaksandr Bullo — Senior Fullstack Software Engineer (11+ yrs, Node.js, NestJS, React, Next.js, PostgreSQL).`;

  await tgSendDocument(botToken, {
    chat_id: chatId,
    document: docFile,
    outgoingFilename,
    caption,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: isRu ? "Download English CV" : "Скачать русское резюме",
            callback_data: isRu ? "cv:en" : "cv:ru",
          },
          {
            text: isRu ? "Открыть портфолио" : "Open Portfolio",
            web_app: { url: `${siteUrl}/?platform=tg` },
          },
        ],
      ],
    },
  });
}
