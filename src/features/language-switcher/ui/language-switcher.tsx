"use client";

import { useLanguage } from "../model/language-context";

export function LanguageSwitcher() {
  const { lang, toggleLang } = useLanguage();
  const isRu = lang === "ru";

  return (
    <button
      type="button"
      onClick={toggleLang}
      aria-label="Switch language"
      title="Switch Language"
      className="tactile-btn inline-flex items-center border border-border bg-card p-0.5 font-mono text-[10px] sm:text-[11px] cursor-pointer"
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
  );
}
