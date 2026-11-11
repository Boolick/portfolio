"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/features/language-switcher";
import {
  HOME_SECTIONS,
  useActiveSection,
  type HomeSectionMeta,
} from "@/shared/lib/use-active-section";
import { tmaHaptics } from "@/shared/lib/telegram/haptics";
import { cn } from "@/shared/lib/utils";
import { smoothScrollTo } from "@/shared/lib/scroll";
import { computeNavCenterScrollLeft } from "../model/nav-scroll";

interface MobileSectionNavProps {
  variant?: "web" | "tma";
  className?: string;
}

export function MobileSectionNav({
  variant = "web",
  className,
}: MobileSectionNavProps) {
  const pathname = usePathname();
  const { lang } = useLanguage();
  const activeSection = useActiveSection();
  const isRu = lang === "ru";
  const isTma = variant === "tma";

  const [isCollapsed, setIsCollapsed] = useState(false);
  const isCollapsedRef = useRef(false);
  const lastScrollYRef = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const activeItemRef = useRef<HTMLAnchorElement | null>(null);

  // In 5-stage Kaizen architecture, all sections are core and shared
  const sections: readonly HomeSectionMeta[] = HOME_SECTIONS;

  // Keep TMA header height constant inside sticky TelegramShell so document flow never jumps 40px
  const effectiveCollapsed = isTma ? false : isCollapsed;

  // Handle auto-hide on downward scroll for web header only
  useEffect(() => {
    if (isTma) return;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          const delta = currentY - lastScrollYRef.current;

          if (currentY <= 80) {
            if (isCollapsedRef.current) {
              isCollapsedRef.current = false;
              setIsCollapsed(false);
            }
          } else if (currentY > 120) {
            if (delta > 24 && !isCollapsedRef.current) {
              isCollapsedRef.current = true;
              setIsCollapsed(true);
            } else if (delta < -8 && isCollapsedRef.current) {
              isCollapsedRef.current = false;
              setIsCollapsed(false);
            }
          }

          lastScrollYRef.current = currentY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isTma]);

  // Smoothly center the active section item strictly inside the horizontal scroll strip
  // (never using Element.scrollIntoView, which can hijack window vertical smooth scroll)
  useEffect(() => {
    if (effectiveCollapsed) return;
    const container = scrollContainerRef.current;
    const item = activeItemRef.current;
    if (!container || !item) return;

    const targetLeft = computeNavCenterScrollLeft(
      item.offsetLeft,
      item.offsetWidth,
      container.clientWidth,
      container.scrollWidth
    );

    if (targetLeft !== null) {
      container.scrollTo({ left: targetLeft, behavior: "smooth" });
    }
  }, [activeSection, effectiveCollapsed]);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault();
      tmaHaptics.selection();
      smoothScrollTo(id);
    },
    []
  );

  if (pathname !== "/") return null;

  return (
    <div
      data-collapsed={effectiveCollapsed}
      className={cn(
        isTma ? "relative" : "md:hidden relative",
        "border-t border-border bg-background/95 backdrop-blur-xs transition-all duration-180 ease-out overflow-hidden",
        effectiveCollapsed
          ? "-translate-y-full opacity-0 pointer-events-none h-0 border-t-0"
          : "translate-y-0 opacity-100 h-10",
        className
      )}
    >
      {/* Scrollable item strip */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-1 overflow-x-auto px-2 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden touch-pan-x touch-pan-y h-full"
      >
        {sections.map((sec) => {
          const isActive = activeSection === sec.id;
          const label = isRu ? sec.ru : sec.en;

          return (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              ref={isActive ? activeItemRef : null}
              onClick={(e) => handleNavClick(e, sec.id)}
              className={cn(
                "tactile-btn relative flex items-center gap-1.5 px-2.5 sm:px-3 min-h-10 text-xs font-mono whitespace-nowrap shrink-0 transition-colors cursor-pointer",
                isActive
                  ? "text-foreground font-bold"
                  : "text-muted-foreground hover:text-foreground font-medium"
              )}
            >
              <span>{label}</span>

              {/* Constructivist 2px active indicator bar */}
              {isActive && (
                <span className="absolute bottom-0 inset-x-2 h-[2px] bg-primary pointer-events-none" />
              )}
            </a>
          );
        })}
      </div>

      {/* Right-edge fade mask indicating horizontal scrollability */}
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}
