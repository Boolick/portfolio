"use client";

import React from "react";
import { Share2 } from "lucide-react";
import { useTelegram } from "../model/telegram-context";
import { useLanguage } from "@/features/language-switcher";
import { tmaHaptics } from "@/shared/lib/telegram/haptics";
import { openTelegramUrl } from "@/shared/lib/telegram/links";
import { reportTmaEvent } from "../lib/report-tma-event";
import { toast } from "@/shared/ui";

interface ShareCaseButtonProps {
  slug: string;
  title: string;
}

/**
 * Constructivist viral case study sharing button for TMA and Web.
 * Inside TMA, routes to native Telegram chat share with direct `startapp=case_<slug>` deep link.
 * On standard Web, uses Web Share API or copies link to clipboard with toast notification.
 */
export function ShareCaseButton({ slug, title }: ShareCaseButtonProps) {
  const { isTma, webApp } = useTelegram();
  const { lang, t } = useLanguage();

  const handleShare = async () => {
    const botUser = process.env.NEXT_PUBLIC_TG_BOT_USERNAME || "aliaksandr_bullo_bot";
    const appName = process.env.NEXT_PUBLIC_TG_APP_SHORTNAME || "app";
    const deepLink = `https://t.me/${botUser}/${appName}?startapp=case_${slug}`;

    const isRu = lang === "ru";
    const shareText = isRu
      ? `Посмотри инженерный кейс ${title} (Aliaksandr Bullo):`
      : `Check out the engineering case study for ${title} (Aliaksandr Bullo):`;

    if (isTma && webApp) {
      tmaHaptics.impact("medium");
      reportTmaEvent("share_case", {
        path: `/projects/${slug}`,
        meta: slug,
      });

      const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(
        deepLink
      )}&text=${encodeURIComponent(shareText)}`;
      openTelegramUrl(shareUrl, { skipHaptic: true, closeAfter: false });
      return;
    }

    // Regular Web fallback
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title,
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard if share dialog was dismissed
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success(t("Case link copied", "Ссылка на кейс скопирована"));
      } catch {
        // Ignore clipboard failure
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="tactile-btn w-full sm:w-auto min-h-12 px-4 border border-border bg-card hover:border-primary text-foreground font-mono text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 cursor-pointer transition-colors text-center"
    >
      <Share2 className="h-4 w-4" aria-hidden="true" strokeWidth={1.75} />
      <span>{t("SHARE CASE STUDY", "ПОДЕЛИТЬСЯ КЕЙСОМ")}</span>
    </button>
  );
}
