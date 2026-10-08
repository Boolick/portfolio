"use client";

import Link from "next/link";
import { LogIn, LayoutDashboard, FileDown } from "lucide-react";
import { Button } from "@/shared/ui";
import { ThemeToggle } from "@/features/theme-toggle";
import { LanguageSwitcher, useLanguage } from "@/features/language-switcher";
import { useAuth } from "@/features/auth";

interface SiteHeaderProps {
  isAdmin?: boolean;
}

export function SiteHeader({ isAdmin: propsIsAdmin }: SiteHeaderProps) {
  const { lang, t } = useLanguage();
  const { isAdmin: authIsAdmin, session } = useAuth();

  const isAdmin = propsIsAdmin ?? authIsAdmin;
  const pdfUrl = lang === "ru" ? "/resume_ru.pdf" : "/cv_en.pdf";
  const pdfFileName = lang === "ru" ? "Resume_Aliaksandr_Bullo_RU.pdf" : "CV_Aliaksandr_Bullo_EN.pdf";

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border/60">
      <div className="container mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold tracking-tight text-lg">
          AB<span className="text-gradient">.</span>
        </Link>
        <nav className="flex items-center gap-2">
          {/* Resume PDF Download */}
          <Button
            asChild
            variant="outline"
            size="sm"
            className="hidden sm:inline-flex gap-1.5 cursor-pointer text-xs font-medium"
          >
            <a href={pdfUrl} download={pdfFileName}>
              <FileDown className="h-3.5 w-3.5 text-primary" />
              {t("Download CV", "Скачать CV")}
            </a>
          </Button>

          <LanguageSwitcher />
          <ThemeToggle />

          {isAdmin ? (
            <Button asChild variant="outline" size="sm" className="gap-1.5 cursor-pointer">
              <Link href="/admin">
                <LayoutDashboard className="h-4 w-4 text-primary" />
                <span className="hidden sm:inline">{t("Admin", "Админка")}</span>
              </Link>
            </Button>
          ) : session ? (
            <Button asChild variant="ghost" size="sm" className="gap-1.5 cursor-pointer">
              <Link href="/admin">
                <LayoutDashboard className="h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button asChild variant="ghost" size="icon" aria-label={t("Login", "Войти")}>
              <Link href="/login">
                <LogIn className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
