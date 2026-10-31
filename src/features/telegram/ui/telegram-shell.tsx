"use client";

import React, { useCallback } from "react";
import { usePathname } from "next/navigation";
import { TelegramThemeSync } from "./telegram-theme-sync";
import { TelegramBackButton } from "./telegram-back-button";
import { TelegramDeepLink } from "./telegram-deep-link";
import { TelegramMainButton } from "./telegram-main-button";
import { TelegramVisitTracker } from "./telegram-visit-tracker";
import { LanguageSwitcher, useLanguage } from "@/features/language-switcher";
import { ThemeThumbwheel } from "@/features/theme-toggle";
import { MobileSectionNav } from "@/widgets/mobile-section-nav/ui/mobile-section-nav";
import { HOME_SECTIONS, useActiveSection } from "@/shared/lib/use-active-section";
import { tmaHaptics } from "@/shared/lib/telegram/haptics";

/**
 * Native Telegram Mini App shell.
 * Mounts headless runtime synchronization controllers and renders a deduplicated
 * utility bar (.tma-only) with live 01 / SECTION indicator, LanguageSwitcher,
 * and ThemeThumbwheel. Never duplicates "Aliaksandr Bullo" (already in native window header).
 */
export function TelegramShell() {
  const pathname = usePathname();
  const activeSection = useActiveSection();
  const { lang } = useLanguage();
  const isRu = lang === "ru";

  const isHome = pathname === "/";
  const isProject = pathname.startsWith("/projects/");
  const isAdminOrLogin =
    pathname.startsWith("/admin") || pathname.startsWith("/login");

  const handleLocationClick = useCallback(() => {
    tmaHaptics.selection();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  let locationContent: React.ReactNode = null;
  if (isHome) {
    const sec = HOME_SECTIONS.find((s) => s.id === activeSection) || HOME_SECTIONS[0];
    const activeSectionNumber = sec.num;
    const activeSectionLabel = (isRu ? sec.ru : sec.en).toUpperCase();

    locationContent = (
      <>
        <span className="text-accent-aa">{activeSectionNumber}</span>
        <span>/ {activeSectionLabel}</span>
      </>
    );
  } else if (isProject) {
    const slug = pathname.replace("/projects/", "").split("/")[0] || "CASE";
    locationContent = (
      <>
        <span className="text-accent-aa">CASE</span>
        <span>/ {slug.toUpperCase()}</span>
      </>
    );
  } else {
    locationContent = (
      <>
        <span className="text-accent-aa">INDEX</span>
        <span>/ RESUME</span>
      </>
    );
  }

  return (
    <>
      {/* Headless Telegram Runtime Controllers */}
      <TelegramThemeSync />
      <TelegramBackButton />
      <TelegramDeepLink />
      <TelegramMainButton />
      <TelegramVisitTracker />

      {/* Visual Telegram Utility Bar (Hidden on admin/login and standard web) */}
      {!isAdminOrLogin && (
        <header className="tma-only sticky top-0 z-50 border-b border-border bg-background pt-[var(--tg-content-safe-area-inset-top,0px)]">
          {/* Row 1: Interactive Location Indicator & Global Controls */}
          <div className="h-11 px-4 flex items-center justify-between gap-2 max-w-7xl mx-auto">
            {/* Left: Interactive Section / Case Indicator */}
            <button
              type="button"
              onClick={handleLocationClick}
              className="tactile-btn min-h-11 inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider tabular-nums text-foreground cursor-pointer"
              title="Scroll to top"
            >
              {locationContent}
            </button>

            {/* Right: Language Switcher and Compact Theme Thumbwheel */}
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <div className="relative inline-flex items-center min-h-11">
                <ThemeThumbwheel showLabels={false} showSoundToggle={false} />
              </div>
            </div>
          </div>

          {/* Row 2: 5-item Core Section Navigation */}
          <MobileSectionNav variant="tma" />
        </header>
      )}
    </>
  );
}
