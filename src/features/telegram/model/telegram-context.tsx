"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { usePathname } from "next/navigation";
import type { TelegramWebApp } from "@/shared/lib/telegram/types";

export interface TelegramContextValue {
  isTma: boolean;
  isReady: boolean;
  webApp: TelegramWebApp | null;
  startParam: string | null;
  colorScheme: "light" | "dark" | null;
  hasInAppHistory: boolean;
  modalStackDepth: number;
  registerModalBackHandler: (closer: () => void) => () => void;
  consumeModalBack: () => boolean;
  markDeepLinkReplace: () => void;
}

const defaultContext: TelegramContextValue = {
  isTma: false,
  isReady: false,
  webApp: null,
  startParam: null,
  colorScheme: null,
  hasInAppHistory: false,
  modalStackDepth: 0,
  registerModalBackHandler: () => () => {},
  consumeModalBack: () => false,
  markDeepLinkReplace: () => {},
};

const TelegramContext = createContext<TelegramContextValue>(defaultContext);

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [isTma, setIsTma] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [startParam, setStartParam] = useState<string | null>(null);
  const [colorScheme, setColorScheme] = useState<"light" | "dark" | null>(null);
  const [hasInAppHistory, setHasInAppHistory] = useState<boolean>(false);
  const [modalStackDepth, setModalStackDepth] = useState<number>(0);

  const pathname = usePathname();
  const initialPathnameRef = useRef<string | null>(null);
  const isDeepLinkRedirectRef = useRef<boolean>(false);
  const modalStackRef = useRef<Array<() => void>>([]);

  // Track client navigation transitions
  useEffect(() => {
    if (!pathname) return;

    if (initialPathnameRef.current === null) {
      initialPathnameRef.current = pathname;
      return;
    }

    if (isDeepLinkRedirectRef.current) {
      isDeepLinkRedirectRef.current = false;
      return;
    }

    if (pathname !== initialPathnameRef.current) {
      queueMicrotask(() => {
        setHasInAppHistory(true);
      });
    }
  }, [pathname]);

  const markDeepLinkReplace = useCallback(() => {
    isDeepLinkRedirectRef.current = true;
  }, []);

  const registerModalBackHandler = useCallback((closer: () => void) => {
    modalStackRef.current.push(closer);
    setModalStackDepth(modalStackRef.current.length);

    return () => {
      const idx = modalStackRef.current.lastIndexOf(closer);
      if (idx !== -1) {
        modalStackRef.current.splice(idx, 1);
        setModalStackDepth(modalStackRef.current.length);
      }
    };
  }, []);

  const consumeModalBack = useCallback((): boolean => {
    const closer = modalStackRef.current.pop();
    setModalStackDepth(modalStackRef.current.length);

    if (closer) {
      closer();
      return true;
    }
    return false;
  }, []);

  // Initialize Telegram WebApp SDK if running within Telegram Mini App
  useEffect(() => {
    const initSdk = () => {
      if (typeof window === "undefined") return;

      const isTmaAttr = document.documentElement.getAttribute("data-tma") === "1";
      const app = window.Telegram?.WebApp;

      if (!isTmaAttr && !app) return;

      setIsTma(true);

      if (app) {
        setWebApp(app);
        setColorScheme(app.colorScheme || "dark");

        try {
          app.ready();
          app.expand();

          if (
            typeof app.isVersionAtLeast === "function" &&
            app.isVersionAtLeast("7.7") &&
            typeof app.disableVerticalSwipes === "function"
          ) {
            app.disableVerticalSwipes();
          }
        } catch (e) {
          console.warn("Telegram WebApp initialization error:", e);
        }

        // Extract start_param with fallbacks to search queries
        const search = new URLSearchParams(window.location.search);
        const resolvedStartParam =
          app.initDataUnsafe?.start_param ||
          search.get("tgWebAppStartParam") ||
          search.get("startapp") ||
          null;

        setStartParam(resolvedStartParam);
        setIsReady(true);

        const handleThemeChange = () => {
          setColorScheme(app.colorScheme || "dark");
        };

        if (typeof app.onEvent === "function") {
          app.onEvent("themeChanged", handleThemeChange);
        }

        return () => {
          if (typeof app.offEvent === "function") {
            app.offEvent("themeChanged", handleThemeChange);
          }
        };
      }
    };

    const cleanup = initSdk();

    window.addEventListener("tma-sdk-loaded", initSdk);

    return () => {
      window.removeEventListener("tma-sdk-loaded", initSdk);
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <TelegramContext.Provider
      value={{
        isTma,
        isReady,
        webApp,
        startParam,
        colorScheme,
        hasInAppHistory,
        modalStackDepth,
        registerModalBackHandler,
        consumeModalBack,
        markDeepLinkReplace,
      }}
    >
      {children}
    </TelegramContext.Provider>
  );
}

export function useTelegram(): TelegramContextValue {
  return useContext(TelegramContext);
}
