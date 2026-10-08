"use client";

import { useLanguage } from "@/features/language-switcher";

export function SiteFooter() {
  const { t } = useLanguage();

  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="container mx-auto max-w-6xl px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Alexander Bullo</p>
        <p className="font-mono text-xs">
          {t(
            "Built with Next.js 16 · React 19 · Supabase · Tailwind v4",
            "Next.js 16 · React 19 · Supabase · Tailwind v4"
          )}
        </p>
      </div>
    </footer>
  );
}
