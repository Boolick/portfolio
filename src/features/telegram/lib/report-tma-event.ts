export type TmaConversionEvent =
  | "view"
  | "download_cv"
  | "share_case"
  | "cta_click";

export interface ReportTmaEventOptions {
  path?: string;
  startParam?: string | null;
  meta?: string;
}

/**
 * Fire-and-forget client-side HMAC conversion telemetry helper for Telegram Mini Apps.
 * Reads cryptographically signed initData directly from window.Telegram.WebApp.
 * Gracefully no-ops in regular browsers or unsigned test sessions.
 */
export function reportTmaEvent(
  event: TmaConversionEvent,
  options?: ReportTmaEventOptions
): void {
  if (typeof window === "undefined") return;

  const webApp = window.Telegram?.WebApp;
  const initData = webApp?.initData;

  // Never attempt transmission if there is no cryptographic initData signature
  if (!initData) return;

  const currentPath =
    options?.path ?? (typeof window !== "undefined" ? window.location.pathname : "/");
  const startParam =
    options?.startParam ??
    webApp?.initDataUnsafe?.start_param ??
    null;
  const meta = options?.meta;

  // Session-level client deduplication to eliminate duplicate network traffic
  const dedupKey = `tma_evt_${event}:${currentPath}:${meta ?? ""}`;
  try {
    if (sessionStorage.getItem(dedupKey)) {
      return;
    }
    sessionStorage.setItem(dedupKey, "1");
  } catch {}

  const payload = {
    initData,
    path: currentPath,
    startParam,
    event,
    meta,
  };

  try {
    fetch("/api/telegram/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {
      // Fire-and-forget: ignore network errors
    });
  } catch {
    // Non-blocking
  }
}
