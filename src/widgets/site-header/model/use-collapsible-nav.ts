"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";

export interface CollapsibleNavState {
  /** True when the page has scrolled past the hero header zone (> 60px) */
  isScrolled: boolean;
  /** True when the menu is collapsed into the compact trigger button */
  isCollapsed: boolean;
  /** True when the user manually toggled the menu open while scrolled */
  isManualOpen: boolean;
  /** Effective open state: true if at top OR manually expanded */
  isOpen: boolean;
  /** Toggle manual expansion when scrolled */
  toggleManualOpen: () => void;
  /** Close manual expansion */
  closeManualOpen: () => void;
  /** Open manual expansion */
  openManualOpen: () => void;
  /** Ref to attach to the header element for click-outside detection */
  headerRef: React.RefObject<HTMLElement | null>;
}

const SCROLL_THRESHOLD = 60;
const COLLAPSE_DELTA_DOWN = 8;
const EXPAND_DELTA_UP = -14;

export function useCollapsibleNav(): CollapsibleNavState {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement | null>(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);

  const isCollapsedRef = useRef(false);
  const isManualOpenRef = useRef(false);
  const lastScrollYRef = useRef(0);

  // Keep refs in sync with state for immediate access in rAF callback
  useEffect(() => {
    isCollapsedRef.current = isCollapsed;
  }, [isCollapsed]);

  useEffect(() => {
    isManualOpenRef.current = isManualOpen;
  }, [isManualOpen]);

  // Handle passive scroll with requestAnimationFrame for 60/120fps fluid transitions
  useEffect(() => {
    if (typeof window === "undefined") return;

    let ticking = false;
    lastScrollYRef.current = window.scrollY;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = Math.max(0, window.scrollY);
          const delta = currentY - lastScrollYRef.current;

          // Zone 1: At top of page (Hero header zone) -> Always fully expanded
          if (currentY <= SCROLL_THRESHOLD) {
            if (isCollapsedRef.current) {
              isCollapsedRef.current = false;
              setIsCollapsed(false);
            }
            if (isManualOpenRef.current) {
              isManualOpenRef.current = false;
              setIsManualOpen(false);
            }
            setIsScrolled(false);
          } else {
            // Zone 2: Scrolled down past threshold
            setIsScrolled(true);

            // Downward scroll -> collapse into compact nav button
            if (delta > COLLAPSE_DELTA_DOWN && !isCollapsedRef.current) {
              isCollapsedRef.current = true;
              setIsCollapsed(true);
              // Closing manual state on downward scroll
              if (isManualOpenRef.current) {
                isManualOpenRef.current = false;
                setIsManualOpen(false);
              }
            }
            // Upward scroll (swipe down gesture) -> smoothly unfold menu like TG header
            else if (delta < EXPAND_DELTA_UP && isCollapsedRef.current) {
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
  }, []);

  // Close manual expansion on click outside the header
  useEffect(() => {
    if (!isManualOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setIsManualOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsManualOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside, { passive: true });
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isManualOpen]);

  // Reset manual state on route/pathname change (React pattern for storing info from previous renders)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsManualOpen(false);
  }

  const toggleManualOpen = useCallback(() => {
    setIsManualOpen((prev) => !prev);
  }, []);

  const closeManualOpen = useCallback(() => {
    setIsManualOpen(false);
  }, []);

  const openManualOpen = useCallback(() => {
    setIsManualOpen(true);
  }, []);

  const isOpen = !isCollapsed || isManualOpen;

  return {
    isScrolled,
    isCollapsed,
    isManualOpen,
    isOpen,
    toggleManualOpen,
    closeManualOpen,
    openManualOpen,
    headerRef,
  };
}
