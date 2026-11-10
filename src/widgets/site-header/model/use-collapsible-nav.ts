"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import {
  isNavOpen,
  reduceCloseNavState,
  reduceScrollNavState,
} from "./collapsible-nav-state";

export interface CollapsibleNavState {
  /** True when the page has scrolled past the hero header zone (> 60px) */
  isScrolled: boolean;
  /** True when the menu is collapsed into the compact trigger button */
  isCollapsed: boolean;
  /** True when the user manually toggled the menu open while scrolled */
  isManualOpen: boolean;
  /** Effective open state: true if at top, auto-expanded, or manually expanded */
  isOpen: boolean;
  /** Toggle manual expansion when scrolled */
  toggleManualOpen: () => void;
  /** Close expanded menu when scrolled */
  closeManualOpen: () => void;
  /** Open manual expansion */
  openManualOpen: () => void;
  /** Ref to attach to the header element for click-outside detection */
  headerRef: React.RefObject<HTMLElement | null>;
}

export function useCollapsibleNav(): CollapsibleNavState {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement | null>(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);

  const isScrolledRef = useRef(false);
  const isCollapsedRef = useRef(false);
  const isManualOpenRef = useRef(false);
  const lastScrollYRef = useRef(0);

  const applyState = useCallback(
    (next: { isScrolled: boolean; isCollapsed: boolean; isManualOpen: boolean }) => {
      if (isScrolledRef.current !== next.isScrolled) {
        isScrolledRef.current = next.isScrolled;
        setIsScrolled(next.isScrolled);
      }
      if (isCollapsedRef.current !== next.isCollapsed) {
        isCollapsedRef.current = next.isCollapsed;
        setIsCollapsed(next.isCollapsed);
      }
      if (isManualOpenRef.current !== next.isManualOpen) {
        isManualOpenRef.current = next.isManualOpen;
        setIsManualOpen(next.isManualOpen);
      }
    },
    []
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    let ticking = false;
    lastScrollYRef.current = window.scrollY;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = Math.max(0, window.scrollY);
          const delta = currentY - lastScrollYRef.current;

          const next = reduceScrollNavState(
            {
              isScrolled: isScrolledRef.current,
              isCollapsed: isCollapsedRef.current,
              isManualOpen: isManualOpenRef.current,
            },
            currentY,
            delta
          );
          applyState(next);

          lastScrollYRef.current = currentY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [applyState]);

  // Close manual expansion on click outside the header
  useEffect(() => {
    if (!isManualOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        isManualOpenRef.current = false;
        setIsManualOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        isManualOpenRef.current = false;
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

  useEffect(() => {
    isManualOpenRef.current = isManualOpen;
  }, [isManualOpen]);

  // Reset manual state on route/pathname change
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsManualOpen(false);
  }

  const toggleManualOpen = useCallback(() => {
    setIsManualOpen((prev) => {
      const next = !prev;
      isManualOpenRef.current = next;
      return next;
    });
  }, []);

  const closeManualOpen = useCallback(() => {
    const scrollY = typeof window !== "undefined" ? Math.max(0, window.scrollY) : 0;
    applyState(reduceCloseNavState(scrollY));
  }, [applyState]);

  const openManualOpen = useCallback(() => {
    isManualOpenRef.current = true;
    setIsManualOpen(true);
  }, []);

  const isOpen = isNavOpen({ isCollapsed, isManualOpen });

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
