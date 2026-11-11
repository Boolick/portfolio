import { tmaHaptics } from "./haptics";

export interface OpenTelegramOptions {
  /** Dismisses the Mini App sheet shortly after opening the chat so mobile clients surface the target dialog */
  closeAfter?: boolean;
  /** Skip triggering impact haptic if caller already triggered it */
  skipHaptic?: boolean;
}

/**
 * Opens a Telegram deep link or chat inside Telegram if within TMA,
 * otherwise opens in a standard browser new tab.
 */
export function openTelegramUrl(
  url: string,
  options?: OpenTelegramOptions
): void {
  if (typeof window === "undefined") return;

  const webApp = window.Telegram?.WebApp;
  if (webApp && url.startsWith("https://t.me/")) {
    if (!options?.skipHaptic) {
      tmaHaptics.impact("medium");
    }

    let dispatched = false;
    if (typeof webApp.openTelegramLink === "function") {
      try {
        webApp.openTelegramLink(url);
        dispatched = true;
      } catch {
        dispatched = false;
      }
    }

    if (!dispatched && typeof webApp.openLink === "function") {
      try {
        webApp.openLink(url);
        dispatched = true;
      } catch {
        dispatched = false;
      }
    }

    if (dispatched) {
      if (options?.closeAfter && typeof webApp.close === "function") {
        // Yield a brief tick so the native IPC bridge dispatches openTelegramLink before closing BotWebViewSheet
        window.setTimeout(() => {
          try {
            webApp.close();
          } catch {}
        }, 150);
      }
      return;
    }
  }

  window.open(url, "_blank", "noopener,noreferrer");
}

/**
 * Opens an external web link using Telegram WebApp openLink (instant view disabled)
 * or standard browser window.open.
 */
export function openExternalUrl(url: string): void {
  if (typeof window === "undefined") return;

  if (url.startsWith("https://t.me/")) {
    openTelegramUrl(url);
    return;
  }

  const webApp = window.Telegram?.WebApp;
  if (webApp && typeof webApp.openLink === "function") {
    tmaHaptics.impact("light");
    webApp.openLink(url, { try_instant_view: false });
    return;
  }

  window.open(url, "_blank", "noopener,noreferrer");
}

/**
 * Downloads the localized CV PDF using Telegram WebApp native downloadFile (API 8.0+)
 * with graceful fallback to openLink on older Telegram clients.
 */
export function downloadTmaPdf(lang: "en" | "ru"): void {
  if (typeof window === "undefined") return;

  const webApp = window.Telegram?.WebApp;
  const isRu = lang === "ru";
  const pdfPath = isRu ? "/resume_ru.pdf" : "/cv_en.pdf";
  const url = `${window.location.origin}${pdfPath}`;
  const fileName = isRu
    ? "Resume_Aliaksandr_Bullo_RU.pdf"
    : "CV_Aliaksandr_Bullo_EN.pdf";

  if (webApp) {
    if (
      typeof webApp.isVersionAtLeast === "function" &&
      webApp.isVersionAtLeast("8.0") &&
      typeof webApp.downloadFile === "function"
    ) {
      webApp.downloadFile({ url, file_name: fileName }, (accepted) => {
        if (accepted) {
          tmaHaptics.notify("success");
        }
      });
      return;
    }

    if (typeof webApp.openLink === "function") {
      webApp.openLink(url);
      return;
    }
  }

  window.open(url, "_blank", "noopener,noreferrer");
}
