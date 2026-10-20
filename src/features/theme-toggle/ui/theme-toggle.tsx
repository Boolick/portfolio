"use client";

import { useTheme } from "../model/theme-context";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle operating environment theme"
      title="Switch Operating Environment"
      className="tactile-btn inline-flex items-center border border-border bg-card p-0.5 font-mono text-[10px] sm:text-[11px] cursor-pointer"
    >
      <span
        className={
          !isDark
            ? "px-1.5 sm:px-2 py-0.5 bg-primary text-primary-foreground font-bold"
            : "px-1.5 sm:px-2 py-0.5 text-muted-foreground hover:text-foreground font-medium"
        }
      >
        [ <span className="hidden md:inline">MANUAL: </span>LIGHT ]
      </span>
      <span
        className={
          isDark
            ? "px-1.5 sm:px-2 py-0.5 bg-primary text-primary-foreground font-bold"
            : "px-1.5 sm:px-2 py-0.5 text-muted-foreground hover:text-foreground font-medium"
        }
      >
        [ <span className="hidden md:inline">RACK: </span>DARK ]
      </span>
    </button>
  );
}
