"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { type Lang, typograf } from "@/shared/lib";

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
  if (typeof window === "undefined") return "en";
  try {
    const stored = localStorage.getItem("lang");
    if (stored === "ru" || stored === "en") return stored;
    // Auto-detect from Telegram if available and not manually chosen
    const isTma = document.documentElement.getAttribute("data-tma") === "1";
    const tmaCode = window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code;
    if (isTma && tmaCode && !localStorage.getItem("lang_manual")) {
      return /^(ru|be|uk|kk)/i.test(tmaCode) ? "ru" : "en";
    }
    if (typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("ru")) {
      return "ru";
    }
    return "en";
  } catch {
    return "en";
  }
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
    try {
      localStorage.setItem("lang_manual", "1");
      localStorage.setItem("lang", nextLang);
      if (typeof document !== "undefined") {
        document.documentElement.lang = nextLang;
      }
    } catch {}
    window.dispatchEvent(new Event(LANG_EVENT));
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === "en" ? "ru" : "en");
  }, [lang, setLang]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  useEffect(() => {
    function checkTelegramLanguage() {
      try {
        if (localStorage.getItem("lang_manual")) return;
        const isTma = document.documentElement.getAttribute("data-tma") === "1";
        const code = window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code;
        if (isTma && code) {
          const resolved: Lang = /^(ru|be|uk|kk)/i.test(code) ? "ru" : "en";
          const current = localStorage.getItem("lang");
          if (current !== resolved) {
            localStorage.setItem("lang", resolved);
            window.dispatchEvent(new Event(LANG_EVENT));
          }
        }
      } catch {}
    }

    checkTelegramLanguage();
    window.addEventListener("tma-sdk-loaded", checkTelegramLanguage);
    return () => {
      window.removeEventListener("tma-sdk-loaded", checkTelegramLanguage);
    };
  }, []);

  const t = useCallback(
    (en: string, ru: string) => typograf(lang === "ru" ? ru : en),
    [lang]
  );

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
