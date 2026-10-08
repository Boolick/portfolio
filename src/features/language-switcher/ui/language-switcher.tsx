"use client";

import { Button } from "@/shared/ui";
import { useLanguage } from "../model/language-context";

export function LanguageSwitcher() {
  const { lang, toggleLang } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLang}
      className="font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground cursor-pointer"
      aria-label="Switch language"
    >
      {lang === "en" ? "RU" : "EN"}
    </Button>
  );
}
