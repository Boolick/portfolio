"use client";

import {
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { Lang } from "@/shared/lib";

export type Locale = Lang;

interface LanguageContextType {
  lang: Lang;
  locale: Locale;
  setLang: (lang: Lang) => void;
  setLocale: (locale: Locale) => void;
  toggleLang: () => void;
  toggleLocale: () => void;
  t: (en: string, ru: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const LANG_EVENT = "lang-change";

function subscribeLang(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(LANG_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(LANG_EVENT, callback);
  };
}

function getLangSnapshot(): Lang {
  const stored = localStorage.getItem("lang");
  if (stored === "ru" || stored === "en") return stored;
  if (typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("ru")) {
    return "ru";
  }
  return "en";
}

function getLangServerSnapshot(): Lang {
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(
    subscribeLang,
    getLangSnapshot,
    getLangServerSnapshot
  );

  const setLang = useCallback((nextLang: Lang) => {
    localStorage.setItem("lang", nextLang);
    window.dispatchEvent(new Event(LANG_EVENT));
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === "en" ? "ru" : "en");
  }, [lang, setLang]);

  const t = useCallback((en: string, ru: string) => (lang === "ru" ? ru : en), [lang]);

  return (
    <LanguageContext.Provider
      value={{
        lang,
        locale: lang,
        setLang,
        setLocale: setLang,
        toggleLang,
        toggleLocale: toggleLang,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
