import fs from "node:fs/promises";
import path from "node:path";

export function getPublicBotToken(): string {
  return process.env.TELEGRAM_BOT_TOKEN || "";
}

export function getAlertBotToken(): string {
  return process.env.TELEGRAM_ALERT_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN || "";
}

export interface TelegramApiResponse<T = unknown> {
  ok: boolean;
  description?: string;
  error_code?: number;
  result?: T;
}

const API_TIMEOUT_MS = 8000;

async function callTelegramApi<T = unknown>(
  token: string,
  method: string,
  body: BodyInit,
  headers?: Record<string, string>
): Promise<TelegramApiResponse<T>> {
  if (!token) {
    return { ok: false, description: "Missing Telegram bot token" };
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: "POST",
      headers,
      body,
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });

    const data = (await res.json()) as TelegramApiResponse<T>;
    if (!res.ok) {
      // Safe error logging: log method and error description without exposing the token URL
      console.warn(`[Telegram Bot API] ${method} returned error ${res.status}:`, data.description);
    }
    return data;
  } catch (error) {
    console.error(`[Telegram Bot API] ${method} failed:`, error instanceof Error ? error.message : error);
    return { ok: false, description: error instanceof Error ? error.message : "Network error" };
  }
}

export interface SendMessagePayload {
  chat_id: number | string;
  text: string;
  parse_mode?: "HTML";
  disable_web_page_preview?: boolean;
  reply_markup?: unknown;
}

export async function tgSendMessage(
  token: string,
  payload: SendMessagePayload
): Promise<TelegramApiResponse> {
  return callTelegramApi(
    token,
    "sendMessage",
    JSON.stringify(payload),
    { "Content-Type": "application/json" }
  );
}

export interface SendDocumentPayload {
  chat_id: number | string;
  document: string; // URL or local public file name like 'cv_en.pdf'
  caption?: string;
  parse_mode?: "HTML";
  reply_markup?: unknown;
  outgoingFilename?: string;
}

export async function tgSendDocument(
  token: string,
  payload: SendDocumentPayload
): Promise<TelegramApiResponse> {
  const isHttpUrl = /^https?:\/\//i.test(payload.document);

  if (isHttpUrl) {
    return callTelegramApi(
      token,
      "sendDocument",
      JSON.stringify(payload),
      { "Content-Type": "application/json" }
    );
  }

  // Local filesystem PDF delivery via multipart FormData
  try {
    const rawName = path.basename(payload.document);
    const filePath = path.join(process.cwd(), "public", rawName);
    const fileBuffer = await fs.readFile(filePath);

    const outgoingFilename =
      payload.outgoingFilename ||
      (rawName.includes("resume_ru") ? "Resume_Aliaksandr_Bullo_RU.pdf" : "CV_Aliaksandr_Bullo_EN.pdf");

    const formData = new FormData();
    formData.append("chat_id", String(payload.chat_id));
    formData.append(
      "document",
      new Blob([fileBuffer], { type: "application/pdf" }),
      outgoingFilename
    );

    if (payload.caption) {
      formData.append("caption", payload.caption);
    }
    if (payload.parse_mode) {
      formData.append("parse_mode", payload.parse_mode);
    }
    if (payload.reply_markup) {
      formData.append(
        "reply_markup",
        typeof payload.reply_markup === "string"
          ? payload.reply_markup
          : JSON.stringify(payload.reply_markup)
      );
    }

    return callTelegramApi(token, "sendDocument", formData);
  } catch (err) {
    console.error("[Telegram Bot API] Failed reading local PDF for sendDocument:", err);
    return { ok: false, description: "Local document read error" };
  }
}

export interface AnswerInlineQueryPayload {
  inline_query_id: string;
  results: unknown[];
  cache_time?: number;
  is_personal?: boolean;
}

export async function tgAnswerInlineQuery(
  token: string,
  payload: AnswerInlineQueryPayload
): Promise<TelegramApiResponse> {
  return callTelegramApi(
    token,
    "answerInlineQuery",
    JSON.stringify(payload),
    { "Content-Type": "application/json" }
  );
}

export interface AnswerCallbackQueryPayload {
  callback_query_id: string;
  text?: string;
  show_alert?: boolean;
}

export async function tgAnswerCallbackQuery(
  token: string,
  payload: AnswerCallbackQueryPayload
): Promise<TelegramApiResponse> {
  return callTelegramApi(
    token,
    "answerCallbackQuery",
    JSON.stringify(payload),
    { "Content-Type": "application/json" }
  );
}
