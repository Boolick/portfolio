"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/widgets/site-header";
import { SiteFooter } from "@/widgets/site-footer";
import { useLanguage } from "@/features/language-switcher";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <SiteHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 flex-1 flex items-center justify-center w-full">
        <div className="w-full max-w-xl border border-border bg-card p-6 sm:p-10 flex flex-col items-center text-center space-y-6">
          {/* Status Kicker */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-2xl sm:text-3xl font-bold tracking-wider text-accent-aa">
              404
            </span>
            <span className="h-4 w-[1px] bg-border" aria-hidden="true" />
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {t("Error Code: Not Found", "Код ошибки: Не найдено")}
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="font-sans font-bold text-2xl sm:text-3xl text-foreground tracking-[-0.02em]">
              {t("Page not found", "Страница не найдена")}
            </h1>
            <p className="font-sans text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md">
              {t(
                "The requested route does not exist or has been relocated within the engineering specifications.",
                "Запрошенный маршрут не существует или был перемещен в спецификации."
              )}
            </p>
          </div>

          {/* Constructivist Action Button */}
          <Link
            href="/"
            className="tactile-btn min-h-12 px-6 bg-primary text-primary-foreground font-mono text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 cursor-pointer transition-opacity hover:opacity-90 border border-border"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>{t("RETURN TO PORTFOLIO", "НА ГЛАВНУЮ")}</span>
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
