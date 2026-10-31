"use client";

import { useEffect, useRef } from "react";
import { useTelegram } from "../model/telegram-context";
import { useTheme } from "@/features/theme-toggle";

/**
 * Headless controller for bidirectional Telegram WebApp chrome color synchronization.
 * Syncs Telegram colorScheme into React theme context and pushes exact #f4f0e8 / #0e0f12
 * background hex tokens to Telegram header, background, and bottom bar.
 */
export function TelegramThemeSync() {
  const { isTma, webApp, colorScheme } = useTelegram();
  const { theme, setTheme } = useTheme();
  const lastSyncedTgScheme = useRef<"light" | "dark" | null>(null);

  // 1. Sync Telegram OS colorScheme changes into React theme context
  useEffect(() => {
    if (!isTma || !colorScheme) return;

    if (colorScheme !== lastSyncedTgScheme.current) {
      lastSyncedTgScheme.current = colorScheme;
      setTheme(colorScheme);
    }
  }, [isTma, colorScheme, setTheme]);

  // 2. Push exact theme background tokens to Telegram chrome
  useEffect(() => {
    if (!isTma || !webApp) return;

    const bgHex = theme === "dark" ? "#0e0f12" : "#f4f0e8";

    try {
      webApp.setHeaderColor(bgHex);
      webApp.setBackgroundColor(bgHex);

      if (
        typeof webApp.isVersionAtLeast === "function" &&
        webApp.isVersionAtLeast("7.10") &&
        typeof webApp.setBottomBarColor === "function"
      ) {
        webApp.setBottomBarColor(bgHex);
      }
    } catch (e) {
      console.warn("TelegramThemeSync chrome color update failed:", e);
    }

    // Mirror safe area insets to CSS variables if exposed as JS objects
    if (typeof document !== "undefined") {
      try {
        if (webApp.safeAreaInset?.bottom !== undefined) {
          document.documentElement.style.setProperty(
            "--tg-safe-area-inset-bottom",
            `${webApp.safeAreaInset.bottom}px`
          );
        }
        if (webApp.contentSafeAreaInset?.top !== undefined) {
          document.documentElement.style.setProperty(
            "--tg-content-safe-area-inset-top",
            `${webApp.contentSafeAreaInset.top}px`
          );
        }
      } catch {}
    }
  }, [isTma, webApp, theme]);

  return null;
}
