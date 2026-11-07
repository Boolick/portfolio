"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileDown, Menu, X } from "lucide-react";
import { ThemeThumbwheel } from "@/features/theme-toggle";
import { LanguageSwitcher, useLanguage } from "@/features/language-switcher";
import { useAuth } from "@/features/auth";
import { MobileSectionNav } from "@/widgets/mobile-section-nav/ui/mobile-section-nav";
import { smoothScrollTo } from "@/shared/lib/scroll";
import { cn, playTactileFeedback } from "@/shared/lib";
import { useCollapsibleNav } from "../model/use-collapsible-nav";

interface SiteHeaderProps {
  isAdmin?: boolean;
}

export function SiteHeader({ isAdmin: propsIsAdmin }: SiteHeaderProps) {
  const pathname = usePathname();
  const { lang, t } = useLanguage();
  const { isAdmin: authIsAdmin, session } = useAuth();

  const {
    isScrolled,
    isOpen,
    isManualOpen,
    toggleManualOpen,
    closeManualOpen,
    headerRef,
  } = useCollapsibleNav();

  const handleNavAnchor = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    playTactileFeedback("tap");
    if (pathname === "/") {
      e.preventDefault();
      closeManualOpen();
      smoothScrollTo(id);
    }
  };

  const handleOpenMenu = () => {
    playTactileFeedback("open");
    toggleManualOpen();
  };

  const handleCloseMenu = () => {
    playTactileFeedback("close");
    closeManualOpen();
  };

  const isAdmin = propsIsAdmin ?? authIsAdmin;
  const pdfUrl = lang === "ru" ? "/resume_ru.pdf" : "/cv_en.pdf";
  const pdfFileName =
    lang === "ru"
      ? "Resume_Aliaksandr_Bullo_RU.pdf"
      : "CV_Aliaksandr_Bullo_EN.pdf";

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "fixed top-0 inset-x-0 z-50 web-only transition-all duration-300 ease-out",
          isOpen
            ? "border-b border-border bg-background/95 backdrop-blur-md shadow-sm pointer-events-auto"
            : "bg-transparent border-b border-transparent pointer-events-none shadow-none"
        )}
      >
        {/* Row 1: Main Brand & Collapsible Nav Controls */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-12 sm:h-14 flex items-center justify-end gap-2 sm:gap-4 relative">
          {/* Navigation & Controls Cluster */}
          <div className="flex items-center justify-end gap-2 flex-1 min-w-0">
            {/* Menu: Horizontally Unrolling Nav Container */}
            <div
              className={cn(
                "flex items-center justify-end overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu",
                isOpen
                  ? "max-w-[920px] opacity-100 translate-x-0 pointer-events-auto"
                  : "max-w-0 opacity-0 translate-x-6 pointer-events-none"
              )}
            >
              <nav className="flex items-center gap-1.5 sm:gap-2.5 font-mono text-xs shrink-0 py-1">
                <Link
                  href="/#projects"
                  onClick={(e) => handleNavAnchor(e, "projects")}
                  className="hidden md:inline-flex items-center h-8 px-2 text-muted-foreground hover:text-foreground uppercase tracking-wider transition-colors whitespace-nowrap shrink-0"
                >
                  {t("Projects", "Проекты")}
                </Link>

                <Link
                  href="/#approach"
                  onClick={(e) => handleNavAnchor(e, "approach")}
                  className="hidden lg:inline-flex items-center h-8 px-2 text-muted-foreground hover:text-foreground uppercase tracking-wider transition-colors whitespace-nowrap shrink-0"
                >
                  {t("Approach", "Подход")}
                </Link>

                <Link
                  href="/#experience"
                  onClick={(e) => handleNavAnchor(e, "experience")}
                  className="hidden md:inline-flex items-center h-8 px-2 text-muted-foreground hover:text-foreground uppercase tracking-wider transition-colors whitespace-nowrap shrink-0"
                >
                  {t("Experience", "Опыт")}
                </Link>

                <Link
                  href="/#contact"
                  onClick={(e) => handleNavAnchor(e, "contact")}
                  className="hidden sm:inline-flex items-center h-8 px-2 text-muted-foreground hover:text-primary uppercase tracking-wider transition-colors font-semibold whitespace-nowrap shrink-0"
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

                {/* Admin link shown only when authenticated */}
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
                ) : null}
              </nav>
            </div>

            {/* Button: Pure Icon Toggle (Burger / Cross, No Text Labels) */}
            <div
              className={cn(
                "transition-all duration-200 ease-out shrink-0",
                isScrolled
                  ? "opacity-100 scale-100 pointer-events-auto"
                  : "w-0 opacity-0 scale-90 pointer-events-none overflow-hidden"
              )}
            >
              {isManualOpen ? (
                <button
                  type="button"
                  onClick={handleCloseMenu}
                  className="tactile-btn inline-flex items-center justify-center h-8 w-8 sm:h-8.5 sm:w-8.5 border border-primary bg-primary text-primary-foreground cursor-pointer transition-colors shadow-xs pointer-events-auto"
                  aria-label={t("Close Menu", "Закрыть меню")}
                >
                  <X className="h-4 w-4 shrink-0" aria-hidden="true" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleOpenMenu}
                  className="tactile-btn inline-flex items-center justify-center h-8 w-8 sm:h-8.5 sm:w-8.5 border border-border bg-card/90 backdrop-blur-md text-foreground hover:border-primary hover:text-primary cursor-pointer transition-colors shadow-xs pointer-events-auto"
                  aria-label={t("Open Menu", "Открыть меню")}
                >
                  <Menu className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Row 2: Mobile Section Jump Strip (Visible only when header is expanded) */}
        <div
          className={cn(
            "transition-all duration-200",
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none h-0 overflow-hidden"
          )}
        >
          <MobileSectionNav variant="web" />
        </div>
      </header>

    {/* Persistent document flow spacer so fixed header never covers page content */}
    <div
      className={cn(
        "web-only shrink-0 pointer-events-none",
        pathname === "/" ? "h-[88px] md:h-14" : "h-12 sm:h-14"
      )}
      aria-hidden="true"
    />
  </>
  );
}
