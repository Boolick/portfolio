"use client";

import { useLanguage } from "@/features/language-switcher";

export function SiteFooter() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border bg-card py-4 px-4 font-mono text-[10px] text-muted-foreground uppercase mt-20">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div>
          AB_SYSTEMS © {new Date().getFullYear()} {"// "}{" "}
          {t(
            "ALL MEASUREMENTS ARE HARDWARE-CALIBRATED",
            "ВСЕ ИЗМЕРЕНИЯ АППАРАТНО КАЛИБРОВАНЫ",
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">TEENAGE ENGINEERING / BRAUN ETHOS</span>
          <span className="text-status-ok font-bold">● STABLE MATRIX</span>
        </div>
      </div>
    </footer>
  );
}
