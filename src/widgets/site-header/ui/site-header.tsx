"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogIn, LayoutDashboard, FileDown } from "lucide-react";
import { ThemeToggle } from "@/features/theme-toggle";
import { LanguageSwitcher, useLanguage } from "@/features/language-switcher";
import { useAuth } from "@/features/auth";

interface SiteHeaderProps {
  isAdmin?: boolean;
}

export function SiteHeader({ isAdmin: propsIsAdmin }: SiteHeaderProps) {
  const { lang, t } = useLanguage();
  const { isAdmin: authIsAdmin, session } = useAuth();
  const [hanoiTime, setHanoiTime] = useState<string>("14:32:00");

  const isAdmin = propsIsAdmin ?? authIsAdmin;
  const pdfUrl = lang === "ru" ? "/resume_ru.pdf" : "/cv_en.pdf";
  const pdfFileName =
    lang === "ru"
      ? "Resume_Aliaksandr_Bullo_RU.pdf"
      : "CV_Aliaksandr_Bullo_EN.pdf";

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      // Calculate UTC+7 (Hanoi)
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const hanoiDate = new Date(utc + 3600000 * 7);
      const hours = String(hanoiDate.getHours()).padStart(2, "0");
      const minutes = String(hanoiDate.getMinutes()).padStart(2, "0");
      const seconds = String(hanoiDate.getSeconds()).padStart(2, "0");
      setHanoiTime(`${hours}:${minutes}:${seconds}`);
    }
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95">
      {/* 1. HARDWARE TOP BAR (INSTRUMENT STATUS BAR) */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-y-2 font-mono">
        {/* System identifier & breadcrumb */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="tactile-btn flex items-center gap-1.5 px-2 py-0.5 bg-foreground text-background dark:bg-primary dark:text-primary-foreground font-bold text-[11px] tracking-wider uppercase"
          >
            <span>AB_SYSTEMS</span>
            <span className="opacity-50">{"//"}</span>
            <span>2026.DEV</span>
          </Link>
          <span className="hidden sm:inline-block text-muted-foreground text-[10px]">
            BENCH_REV: 04.91
          </span>
        </div>

        {/* Live telemetry markers & controls */}
        <div className="flex items-center gap-2 sm:gap-3 text-[11px] tracking-tight">
          {/* Status indicator with physical LED */}
          <div className="flex items-center gap-2 border border-border px-2 py-0.5 bg-card">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-ok opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-status-ok" />
            </span>
            <span className="font-bold text-foreground uppercase tracking-wider text-[10px]">
              {t("STATUS: OPEN_TO_WORK", "СТАТУС: В ПОИСКЕ")}
            </span>
          </div>

          {/* Location & UTC+7 Time */}
          <div className="hidden md:flex items-center gap-1 text-muted-foreground text-[10px]">
            <span>LOC:</span>
            <span className="text-foreground font-semibold">UTC+7 [HANOI]</span>
            <span className="text-primary font-bold ml-1">{hanoiTime}</span>
          </div>

          {/* Resume PDF Download */}
          <a
            href={pdfUrl}
            download={pdfFileName}
            className="tactile-btn hidden lg:inline-flex items-center gap-1 border border-border bg-card px-2 py-0.5 text-[10px] font-bold text-foreground hover:bg-primary hover:text-primary-foreground uppercase"
          >
            <FileDown className="h-3 w-3 text-primary" />
            <span>[ CV_PDF ↓ ]</span>
          </a>

          {/* Switchers */}
          <LanguageSwitcher />
          <ThemeToggle />

          {/* Admin / Login */}
          {isAdmin ? (
            <Link
              href="/admin"
              className="tactile-btn inline-flex items-center gap-1 border border-primary bg-primary text-primary-foreground px-2 py-0.5 text-[10px] font-bold uppercase"
            >
              <LayoutDashboard className="h-3 w-3" />
              <span className="hidden sm:inline">{t("ADMIN", "АДМИН")}</span>
            </Link>
          ) : session ? (
            <Link
              href="/admin"
              className="tactile-btn inline-flex items-center border border-border bg-card p-1 text-muted-foreground hover:text-foreground"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <Link
              href="/login"
              className="tactile-btn inline-flex items-center border border-border bg-card p-1 text-muted-foreground hover:text-foreground"
              aria-label={t("Login", "Войти")}
            >
              <LogIn className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* 2. TECHNICAL CALIBRATION LINE */}
      <div className="w-full border-t border-border bg-card px-4 py-1 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <span>SCALE: 1:1 CALIBRATED</span>
            <span className="hidden md:inline">TOLERANCE: ±0.001ms</span>
            <span className="hidden sm:inline">STATE_ENGINE: FSM // IDEMPOTENT</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="ruler-x w-20 sm:w-32 hidden sm:block" />
            <span className="text-primary font-bold">SYS // READY</span>
          </div>
        </div>
      </div>
    </header>
  );
}
