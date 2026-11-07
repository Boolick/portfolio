"use client";

import { useLanguage } from "../model/language-context";
import { tmaHaptics } from "@/shared/lib/telegram/haptics";

export function LanguageSwitcher() {
  const { lang, toggleLang } = useLanguage();
  const isRu = lang === "ru";

  const handleClick = () => {
    tmaHaptics.selection();
    toggleLang();
  };

  return (
    <div className="relative inline-flex items-center shrink-0">
      <button
        type="button"
        onClick={handleClick}
        aria-label={isRu ? "Переключить язык на English" : "Switch language to Russian"}
        title={isRu ? "Переключить язык" : "Switch Language"}
        className="tactile-btn inline-flex items-center h-8 border border-border bg-card p-0.5 font-mono text-xs cursor-pointer shrink-0 select-none"
      >
        <span
          className={
            !isRu
              ? "h-full px-2 inline-flex items-center justify-center bg-primary text-primary-foreground font-bold whitespace-nowrap"
              : "h-full px-2 inline-flex items-center justify-center text-muted-foreground hover:text-foreground font-medium whitespace-nowrap"
          }
        >
          EN
        </span>
        <span
          className={
            isRu
              ? "h-full px-2 inline-flex items-center justify-center bg-primary text-primary-foreground font-bold whitespace-nowrap"
              : "h-full px-2 inline-flex items-center justify-center text-muted-foreground hover:text-foreground font-medium whitespace-nowrap"
          }
        >
          RU
        </span>
      </button>
    </div>
  );
}
