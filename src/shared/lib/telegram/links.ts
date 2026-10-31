import { tmaHaptics } from "./haptics";

/**
 * Opens a Telegram deep link or chat inside Telegram if within TMA,
 * otherwise opens in a standard browser new tab.
 */
export function openTelegramUrl(url: string): void {
  if (typeof window === "undefined") return;

  const webApp = window.Telegram?.WebApp;
  if (webApp && typeof webApp.openTelegramLink === "function" && url.startsWith("https://t.me/")) {
    tmaHaptics.impact("medium");
    webApp.openTelegramLink(url);
    return;
  }

  window.open(url, "_blank", "noopener,noreferrer");
}

/**
 * Opens an external web link using Telegram WebApp openLink (instant view disabled)
 * or standard browser window.open.
 */
export function openExternalUrl(url: string): void {
  if (typeof window === "undefined") return;

  const webApp = window.Telegram?.WebApp;
  if (webApp && typeof webApp.openLink === "function") {
    tmaHaptics.impact("light");
    webApp.openLink(url, { try_instant_view: false });
    return;
  }

  window.open(url, "_blank", "noopener,noreferrer");
}
