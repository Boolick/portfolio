"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTelegram } from "../model/telegram-context";
import { tmaHaptics } from "@/shared/lib/telegram/haptics";

/**
 * Stack- and modal-aware native Telegram BackButton controller.
 * Prioritizes dismissing open modals (ChronicleZoomModal) via consumeModalBack()
 * before triggering Next.js routing. Preserves scroll history via router.back()
 * or falls back to router.replace("/") on direct deep links.
 */
export function TelegramBackButton() {
  const { isTma, webApp, hasInAppHistory, modalStackDepth, consumeModalBack } = useTelegram();
  const pathname = usePathname();
  const router = useRouter();

  // Use refs for callbacks to avoid re-subscribing Telegram event handlers on state changes
  const hasInAppHistoryRef = useRef(hasInAppHistory);
  const pathnameRef = useRef(pathname);
  const consumeModalBackRef = useRef(consumeModalBack);

  useEffect(() => {
    hasInAppHistoryRef.current = hasInAppHistory;
  }, [hasInAppHistory]);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    consumeModalBackRef.current = consumeModalBack;
  }, [consumeModalBack]);

  // Manage native BackButton visibility
  useEffect(() => {
    if (!isTma || !webApp?.BackButton) return;

    const shouldShow = modalStackDepth > 0 || pathname !== "/";

    try {
      if (shouldShow) {
        webApp.BackButton.show();
      } else {
        webApp.BackButton.hide();
      }
    } catch (e) {
      console.warn("Telegram BackButton visibility update failed:", e);
    }
  }, [isTma, webApp, modalStackDepth, pathname]);

  // Attach single stable BackButton click handler
  useEffect(() => {
    if (!isTma || !webApp?.BackButton) return;

    const handleBackClick = () => {
      tmaHaptics.impact("light");

      // 1. Prioritize modal closure
      if (consumeModalBackRef.current()) {
        return;
      }

      // 2. Route navigation
      if (pathnameRef.current !== "/") {
        if (hasInAppHistoryRef.current) {
          router.back();
        } else {
          router.replace("/");
        }
      }
    };

    try {
      webApp.BackButton.onClick(handleBackClick);
    } catch (e) {
      console.warn("Telegram BackButton.onClick attachment failed:", e);
    }

    return () => {
      try {
        webApp.BackButton.offClick(handleBackClick);
      } catch {}
    };
  }, [isTma, webApp, router]);

  return null;
}
