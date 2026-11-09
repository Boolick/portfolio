import type {
  TelegramHapticImpactStyle,
  TelegramHapticNotificationType,
  TelegramWebApp,
} from "./types";

let lastSelectionTime = 0;
const SELECTION_THROTTLE_MS = 45;

function getHapticFeedback(): TelegramWebApp["HapticFeedback"] | null {
  if (typeof window === "undefined") return null;

  const webApp = window.Telegram?.WebApp;
  if (!webApp) return null;

  // HapticFeedback was introduced in Telegram WebApp API version 6.1
  if (typeof webApp.isVersionAtLeast === "function" && !webApp.isVersionAtLeast("6.1")) {
    return null;
  }

  // Respect OS reduced-motion accessibility preference
  if (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return null;
  }

  return webApp.HapticFeedback || null;
}

/**
 * Version- and accessibility-gated Telegram WebApp HapticFeedback helper.
 * Safe to invoke in any browser environment (gracefully no-ops outside TMA).
 */
export const tmaHaptics = {
  /**
   * Triggers selection feedback (e.g. thumbwheel ticks, tab switches).
   * Throttled to 45ms to protect the native IPC bridge during rapid wheel spins.
   */
  selection(): void {
    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    if (now - lastSelectionTime < SELECTION_THROTTLE_MS) return;
    lastSelectionTime = now;

    const feedback = getHapticFeedback();
    feedback?.selectionChanged();
  },

  /**
   * Triggers physical impact feedback (light, medium, heavy, rigid, soft).
   */
  impact(style: TelegramHapticImpactStyle = "light"): void {
    const feedback = getHapticFeedback();
    feedback?.impactOccurred(style);
  },

  /**
   * Triggers semantic notification feedback (success, warning, error).
   */
  notify(type: TelegramHapticNotificationType = "success"): void {
    const feedback = getHapticFeedback();
    feedback?.notificationOccurred(type);
  },
};
