"use client";

import Link from "next/link";
import { LogIn, LayoutDashboard, FileDown } from "lucide-react";
import { ThemeThumbwheel } from "@/features/theme-toggle";
import { LanguageSwitcher, useLanguage } from "@/features/language-switcher";
import { useAuth } from "@/features/auth";
import { MobileSectionNav } from "@/widgets/mobile-section-nav/ui/mobile-section-nav";

interface SiteHeaderProps {
  isAdmin?: boolean;
}

export function SiteHeader({ isAdmin: propsIsAdmin }: SiteHeaderProps) {
  const { lang, t } = useLanguage();
  const { isAdmin: authIsAdmin, session } = useAuth();

  const isAdmin = propsIsAdmin ?? authIsAdmin;
  const pdfUrl = lang === "ru" ? "/resume_ru.pdf" : "/cv_en.pdf";
  const pdfFileName =
    lang === "ru"
      ? "Resume_Aliaksandr_Bullo_RU.pdf"
      : "CV_Aliaksandr_Bullo_EN.pdf";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background web-only">
      {/* Row 1: Main Brand & Global Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-12 sm:h-14 flex items-center justify-between gap-2 sm:gap-4">
        {/* Identity / Logo */}
        <Link
          href="/"
          className="font-sans font-bold text-sm sm:text-base tracking-[-0.02em] text-foreground hover:text-primary transition-colors shrink-0 min-h-11 inline-flex items-center"
        >
          {t("Aliaksandr Bullo", "Александр Булло")}
        </Link>

        {/* Functional Controls */}
        <nav className="flex items-center gap-2 sm:gap-3 font-mono text-xs">
          <Link
            href="/#projects"
            className="hidden md:inline-flex items-center min-h-8 px-1.5 text-muted-foreground hover:text-foreground uppercase tracking-wider transition-colors"
          >
            {t("Projects", "Проекты")}
          </Link>

          <Link
            href="/#contact"
            className="hidden sm:inline-flex items-center min-h-8 px-1.5 text-muted-foreground hover:text-primary uppercase tracking-wider transition-colors font-semibold"
          >
            {t("Contact", "Контакты")}
          </Link>

          <a
            href={pdfUrl}
            download={pdfFileName}
            className="tactile-btn hidden sm:inline-flex items-center gap-1.5 border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground hover:border-primary hover:text-primary uppercase tracking-wider sm:min-h-8"
          >
            <FileDown className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <span>{t("CV PDF", "Резюме PDF")}</span>
          </a>

          <LanguageSwitcher />
          <ThemeThumbwheel />

          {isAdmin ? (
            <Link
              href="/admin"
              className="tactile-btn inline-flex items-center justify-center min-h-11 min-w-11 sm:min-h-8 sm:min-w-8 border border-primary bg-primary text-primary-foreground px-2.5 py-1 text-xs font-bold uppercase tracking-wider"
            >
              <LayoutDashboard className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline ml-1">{t("Admin", "Админ")}</span>
            </Link>
          ) : session ? (
            <Link
              href="/admin"
              className="tactile-btn inline-flex items-center justify-center min-h-11 min-w-11 sm:min-h-8 sm:min-w-8 border border-border bg-card p-1.5 text-muted-foreground hover:text-foreground"
              aria-label="Dashboard"
            >
              <LayoutDashboard className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          ) : (
            <Link
              href="/login"
              className="tactile-btn inline-flex items-center justify-center min-h-11 min-w-11 sm:min-h-8 sm:min-w-8 border border-border bg-card p-1.5 text-muted-foreground hover:text-foreground"
              aria-label={t("Login", "Войти")}
            >
              <LogIn className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          )}
        </nav>
      </div>

      {/* Row 2: Mobile Section Jump Strip */}
      <MobileSectionNav variant="web" />
    </header>
  );
}
