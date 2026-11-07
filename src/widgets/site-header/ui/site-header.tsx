"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn, LayoutDashboard, FileDown } from "lucide-react";
import { ThemeThumbwheel } from "@/features/theme-toggle";
import { LanguageSwitcher, useLanguage } from "@/features/language-switcher";
import { useAuth } from "@/features/auth";
import { MobileSectionNav } from "@/widgets/mobile-section-nav/ui/mobile-section-nav";
import { smoothScrollTo } from "@/shared/lib/scroll";

interface SiteHeaderProps {
  isAdmin?: boolean;
}

export function SiteHeader({ isAdmin: propsIsAdmin }: SiteHeaderProps) {
  const pathname = usePathname();
  const { lang, t } = useLanguage();
  const { isAdmin: authIsAdmin, session } = useAuth();

  const handleNavAnchor = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (pathname === "/") {
      e.preventDefault();
      smoothScrollTo(id);
    }
  };

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
        <nav className="flex items-center gap-1.5 sm:gap-2.5 font-mono text-xs shrink-0">
          <Link
            href="/#projects"
            onClick={(e) => handleNavAnchor(e, "projects")}
            className="hidden lg:inline-flex items-center h-8 px-2 text-muted-foreground hover:text-foreground uppercase tracking-wider transition-colors whitespace-nowrap shrink-0"
          >
            {t("Projects", "Проекты")}
          </Link>

          <Link
            href="/#contact"
            onClick={(e) => handleNavAnchor(e, "contact")}
            className="hidden md:inline-flex items-center h-8 px-2 text-muted-foreground hover:text-primary uppercase tracking-wider transition-colors font-semibold whitespace-nowrap shrink-0"
          >
            {t("Contact", "Контакты")}
          </Link>

          <a
            href={pdfUrl}
            download={pdfFileName}
            className="tactile-btn hidden sm:inline-flex items-center gap-1.5 h-8 border border-border bg-card px-2.5 text-xs font-medium text-foreground hover:border-primary hover:text-primary uppercase tracking-wider whitespace-nowrap shrink-0"
          >
            <FileDown className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
            <span>{t("CV PDF", "Резюме PDF")}</span>
          </a>

          <LanguageSwitcher />
          <ThemeThumbwheel />

          {isAdmin ? (
            <Link
              href="/admin"
              className="tactile-btn inline-flex items-center justify-center h-8 border border-primary bg-primary text-primary-foreground px-2.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap shrink-0"
            >
              <LayoutDashboard className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline ml-1">{t("Admin", "Админ")}</span>
            </Link>
          ) : session ? (
            <Link
              href="/admin"
              className="tactile-btn inline-flex items-center justify-center h-8 w-8 border border-border bg-card text-muted-foreground hover:text-foreground shrink-0"
              aria-label="Dashboard"
            >
              <LayoutDashboard className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            </Link>
          ) : (
            <Link
              href="/login"
              className="tactile-btn inline-flex items-center justify-center h-8 w-8 border border-border bg-card text-muted-foreground hover:text-foreground shrink-0"
              aria-label={t("Login", "Войти")}
            >
              <LogIn className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            </Link>
          )}
        </nav>
      </div>

      {/* Row 2: Mobile Section Jump Strip */}
      <MobileSectionNav variant="web" />
    </header>
  );
}
