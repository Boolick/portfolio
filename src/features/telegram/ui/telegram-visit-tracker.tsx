"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTelegram } from "../model/telegram-context";
import { reportTmaEvent } from "../lib/report-tma-event";

/**
 * Headless controller for tracking verified Telegram Mini App route views.
 * Dispatches cryptographically signed conversion pings to /api/telegram/visit.
 * Excludes administrative and login routes.
 */
export function TelegramVisitTracker() {
  const { isTma, webApp, startParam } = useTelegram();
  const pathname = usePathname();

  useEffect(() => {
    if (!isTma || !webApp?.initData) return;

    if (
      pathname.startsWith("/admin") ||
      pathname.startsWith("/login") ||
      pathname.startsWith("/api")
    ) {
      return;
    }

    reportTmaEvent("view", {
      path: pathname,
      startParam,
    });
  }, [isTma, webApp?.initData, pathname, startParam]);

  return null;
}
