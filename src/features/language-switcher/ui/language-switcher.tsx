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
    <div className="relative inline-flex items-center justify-center min-h-11 min-w-11">
      <button
        type="button"
        onClick={handleClick}
        aria-label={isRu ? "Переключить язык на English" : "Switch language to Russian"}
        title={isRu ? "Переключить язык" : "Switch Language"}
        className="tactile-btn inline-flex items-center h-7 border border-border bg-card p-0.5 font-mono text-[10px] sm:text-[11px] cursor-pointer after:absolute after:inset-0 after:content-['']"
      >
        <span
          className={
            !isRu
              ? "px-1.5 py-0.5 bg-primary text-primary-foreground font-bold"
              : "px-1.5 py-0.5 text-muted-foreground hover:text-foreground font-medium"
          }
        >
          EN
        </span>
        <span
          className={
            isRu
              ? "px-1.5 py-0.5 bg-primary text-primary-foreground font-bold"
              : "px-1.5 py-0.5 text-muted-foreground hover:text-foreground font-medium"
          }
        >
          RU
        </span>
      </button>
    </div>
  );
}
