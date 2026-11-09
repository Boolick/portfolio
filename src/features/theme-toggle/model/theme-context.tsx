"use client";

import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const THEME_EVENT = "theme-change";

function subscribeTheme(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(THEME_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(THEME_EVENT, callback);
  };
}

function getThemeSnapshot(): Theme {
  if (typeof window === "undefined") return "dark";
  try {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      return stored;
    }
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  } catch {
    return "dark";
  }
}

function getThemeServerSnapshot(): Theme {
  return "dark";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getThemeServerSnapshot
  );

  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains("is-theme-dragging")) return;
    const isDark = theme === "dark";
    root.classList.toggle("dark", isDark);
    root.style.setProperty("--theme-mix", isDark ? "100%" : "0%");
    root.style.setProperty("--wheel-pos", isDark ? "1" : "0");
    root.style.setProperty("--wheel-offset", isDark ? "88px" : "0px");
    root.style.colorScheme = isDark ? "dark" : "light";
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    try {
      localStorage.setItem("theme", next);
    } catch {}
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      const isDark = next === "dark";
      root.classList.toggle("dark", isDark);
      root.style.setProperty("--theme-mix", isDark ? "100%" : "0%");
      root.style.setProperty("--wheel-pos", isDark ? "1" : "0");
      root.style.setProperty("--wheel-offset", isDark ? "88px" : "0px");
      root.style.colorScheme = isDark ? "dark" : "light";
    }
    window.dispatchEvent(new CustomEvent("theme-wheel-set", { detail: next }));
    window.dispatchEvent(new Event(THEME_EVENT));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
