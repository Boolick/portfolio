"use client";

import { useLanguage } from "@/features/language-switcher";

export function SiteFooter() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border bg-background pt-8 pb-24 md:py-8 px-4 sm:px-6 font-mono text-xs text-muted-foreground web-only">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <div>
          © {new Date().getFullYear()} Aliaksandr Bullo.{" "}
          {t("Fullstack Software Engineer.", "Fullstack-инженер.")}
        </div>
        <div className="uppercase tracking-wider">
          {t("Hanoi, Vietnam (UTC+7) · Remote", "Ханой, Вьетнам (UTC+7) · Удаленно")}
        </div>
      </div>
    </footer>
  );
}
