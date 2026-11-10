"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useTelegram } from "../model/telegram-context";
import { useLanguage } from "@/features/language-switcher";
import { useTheme } from "@/features/theme-toggle";
import { useActiveSection } from "@/shared/lib/use-active-section";
import { tmaHaptics } from "@/shared/lib/telegram/haptics";
import { openTelegramUrl, downloadTmaPdf } from "@/shared/lib/telegram/links";
import { reportTmaEvent } from "../lib/report-tma-event";

/**
 * Section- and route-aware native Telegram MainButton and SecondaryButton controller.
 * Provides maximum contrast (#ff5c00 on #0e0f12 = 6.21:1 AA) with zero emojis,
 * contextual Telegram messaging prefill, and native PDF CV download (API 8.0+ downloadFile).
 */
export function TelegramMainButton() {
  const { isTma, webApp } = useTelegram();
  const { lang, t } = useLanguage();
  const { theme } = useTheme();
  const activeSection = useActiveSection();
  const pathname = usePathname();

  const isProjectDetail = pathname.startsWith("/projects/");
  const slug = isProjectDetail ? pathname.replace("/projects/", "").split("/")[0] : "";
  const isProjectsSection = pathname === "/" && activeSection === "projects";
  const isProjectIntent = isProjectDetail || isProjectsSection;

  // Zero emojis in all labels
  const mainLabel = isProjectIntent
    ? t("Order a similar project", "Заказать похожий проект")
    : t("Message in Telegram", "Написать в Telegram");

  const secLabel = t("CV PDF", "Резюме PDF");

  let prefill = "";
  if (isProjectDetail) {
    const slugUpper = slug.toUpperCase();
    prefill =
      lang === "ru"
        ? `Здравствуйте, Александр! Посмотрел кейс ${slugUpper} в вашем Telegram Mini App — хочу обсудить похожую задачу.`
        : `Hello Aliaksandr! Saw the ${slugUpper} case in your Telegram Mini App — let's discuss a similar project.`;
  } else if (isProjectsSection) {
    prefill =
      lang === "ru"
        ? "Здравствуйте, Александр! Ознакомился с вашими проектами в Telegram Mini App — хочу обсудить сотрудничество."
        : "Hello Aliaksandr! Checked out your projects in the Telegram Mini App — let's discuss collaboration.";
  } else {
    prefill =
      lang === "ru"
        ? "Здравствуйте, Александр! Открыл ваш профиль в Telegram Mini App — хочу связаться."
        : "Hello Aliaksandr! Found your portfolio in Telegram Mini App — wanted to connect.";
  }

  const pathnameRef = useRef(pathname);
  const isProjectIntentRef = useRef(isProjectIntent);
  const prefillRef = useRef(prefill);
  const langRef = useRef(lang);

  useEffect(() => {
    pathnameRef.current = pathname;
    isProjectIntentRef.current = isProjectIntent;
    prefillRef.current = prefill;
    langRef.current = lang;
  });

  // Attach click listeners to native buttons
  useEffect(() => {
    if (!isTma || !webApp) return;

    const mainBtn = webApp.MainButton;
    const secBtn = webApp.SecondaryButton;

    const handleMainClick = () => {
      tmaHaptics.impact("medium");
      reportTmaEvent("cta_click", {
        path: pathnameRef.current,
        meta: isProjectIntentRef.current ? "order_project" : "message_owner",
      });
      const url =
        "https://t.me/AlexanderBullo?text=" +
        encodeURIComponent(prefillRef.current);
      openTelegramUrl(url, { closeAfter: true, skipHaptic: true });
    };

    const handleSecondaryClick = () => {
      tmaHaptics.impact("medium");
      const currentLang = langRef.current;
      reportTmaEvent("download_cv", {
        path: pathnameRef.current,
        meta: currentLang,
      });

      downloadTmaPdf(currentLang);
    };

    try {
      mainBtn?.onClick(handleMainClick);
    } catch {}

    try {
      secBtn?.onClick(handleSecondaryClick);
    } catch {}

    return () => {
      try {
        mainBtn?.offClick(handleMainClick);
      } catch {}
      try {
        secBtn?.offClick(handleSecondaryClick);
      } catch {}
    };
  }, [isTma, webApp]);

  // Synchronize button text, colors, and visibility
  useEffect(() => {
    if (!isTma || !webApp) return;

    const isAdminOrLogin =
      pathname.startsWith("/admin") || pathname.startsWith("/login");

    if (isAdminOrLogin) {
      try {
        webApp.MainButton?.hide();
        webApp.SecondaryButton?.hide();
      } catch {}
      return;
    }

    try {
      if (webApp.MainButton) {
        webApp.MainButton.setParams({
          text: mainLabel,
          color: "#ff5c00",
          text_color: "#0e0f12",
          has_shine_effect: false,
          is_active: true,
          is_visible: true,
        });
        webApp.MainButton.show();
      }
    } catch (e) {
      console.warn("MainButton parameter configuration failed:", e);
    }

    const supportsSecondary =
      typeof webApp.isVersionAtLeast === "function" &&
      webApp.isVersionAtLeast("7.10") &&
      Boolean(webApp.SecondaryButton);

    if (supportsSecondary && webApp.SecondaryButton) {
      try {
        const secBg = theme === "dark" ? "#15171c" : "#ebe5da";
        const secFg = theme === "dark" ? "#f4f0e8" : "#0e0f12";
        webApp.SecondaryButton.setParams({
          text: secLabel,
          position: "left",
          color: secBg,
          text_color: secFg,
          has_shine_effect: false,
          is_active: true,
          is_visible: true,
        });
        webApp.SecondaryButton.show();
      } catch (e) {
        console.warn("SecondaryButton parameter configuration failed:", e);
      }
    }
  }, [isTma, webApp, pathname, mainLabel, secLabel, theme]);

  return null;
}
