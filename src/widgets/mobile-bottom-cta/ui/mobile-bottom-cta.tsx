"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/features/language-switcher";
import { useActiveSection } from "@/shared/lib/use-active-section";
import { openTelegramUrl } from "@/shared/lib/telegram/links";
import { cn } from "@/shared/lib/utils";

export function MobileBottomCta() {
  const { lang } = useLanguage();
  const activeSection = useActiveSection();
  const [isVisible, setIsVisible] = useState(false);
  const isRu = lang === "ru";

  const pdfUrl = isRu ? "/resume_ru.pdf" : "/cv_en.pdf";
  const pdfFileName = isRu
    ? "Resume_Aliaksandr_Bullo_RU.pdf"
    : "CV_Aliaksandr_Bullo_EN.pdf";

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsVisible(window.scrollY > 360);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTelegramClick = () => {
    openTelegramUrl("https://t.me/AlexanderBullo");
  };

  const primaryLabel =
    activeSection === "projects"
      ? isRu
        ? "ЗАКАЗАТЬ ПРОЕКТ"
        : "ORDER A PROJECT"
      : isRu
      ? "НАПИСАТЬ В TELEGRAM"
      : "MESSAGE IN TELEGRAM";

  return (
    <div
      className={cn(
        "md:hidden web-only fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur-xs transition-transform duration-200 ease-out",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
      style={{
        paddingBottom: "max(env(safe-area-inset-bottom, 0px), 8px)",
      }}
    >
      <div className="flex items-stretch gap-2 p-2 max-w-lg mx-auto">
        {/* Primary Lead Action: Signal Orange background (#ff5c00) + Black text (#0e0f12) */}
        <button
          type="button"
          onClick={handleTelegramClick}
          className="tactile-btn flex-1 min-h-12 px-3 flex items-center justify-center font-mono text-xs font-bold uppercase tracking-wider text-center leading-tight bg-primary text-primary-foreground border border-border cursor-pointer"
        >
          <span>{primaryLabel}</span>
        </button>

        {/* Secondary Action: CV PDF Download */}
        <a
          href={pdfUrl}
          download={pdfFileName}
          className="tactile-btn min-h-12 px-4 flex items-center justify-center font-mono text-xs font-medium uppercase tracking-wider text-center leading-tight border border-border bg-card text-foreground hover:border-primary transition-colors"
        >
          <span>{isRu ? "Резюме PDF" : "CV PDF"}</span>
        </a>
      </div>
    </div>
  );
}
