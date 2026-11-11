"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import {
  HOME_SECTIONS,
  resolveActiveSectionId,
  type HomeSectionMeta,
  type SectionMeasurement,
} from "./active-section-engine";

export { HOME_SECTIONS, type HomeSectionMeta };

type Listener = () => void;
const listeners = new Set<Listener>();

let currentActiveId = "";
let rafId: number | null = null;
let isListening = false;

function getStickyHeaderHeight(): number {
  if (typeof document === "undefined") return 56;
  const tmaHeader = document.querySelector<HTMLElement>("header.tma-only");
  if (tmaHeader && tmaHeader.offsetHeight > 0) {
    return tmaHeader.offsetHeight;
  }
  const webHeader = document.querySelector<HTMLElement>("header.fixed");
  if (webHeader && webHeader.offsetHeight > 0) {
    return webHeader.offsetHeight;
  }
  return 56;
}

function measureAndUpdate() {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const measurements: SectionMeasurement[] = [];
  for (const sec of HOME_SECTIONS) {
    const el = document.getElementById(sec.id);
    if (el) {
      measurements.push({
        id: sec.id,
        top: el.getBoundingClientRect().top,
      });
    }
  }

  if (measurements.length === 0) return;

  const nextId = resolveActiveSectionId(measurements, {
    viewportHeight: window.innerHeight,
    scrollY: window.scrollY,
    docHeight: document.documentElement.scrollHeight,
    headerHeight: getStickyHeaderHeight(),
  });

  if (nextId && nextId !== currentActiveId) {
    currentActiveId = nextId;
    listeners.forEach((l) => l());
  }
}

function scheduleUpdate() {
  if (typeof window === "undefined" || rafId !== null) return;
  rafId = window.requestAnimationFrame(() => {
    rafId = null;
    measureAndUpdate();
  });
}

function startListening() {
  if (typeof window === "undefined" || isListening) return;
  isListening = true;
  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate, { passive: true });
  measureAndUpdate();
}

function stopListening() {
  if (typeof window === "undefined" || !isListening) return;
  isListening = false;
  window.removeEventListener("scroll", scheduleUpdate);
  window.removeEventListener("resize", scheduleUpdate);
  if (rafId !== null) {
    window.cancelAnimationFrame(rafId);
    rafId = null;
  }
}

export function rebindObserver() {
  if (typeof window === "undefined") return;
  if (listeners.size > 0) {
    measureAndUpdate();
  }
}

function subscribe(callback: Listener) {
  listeners.add(callback);
  if (listeners.size === 1) {
    startListening();
  }
  return () => {
    listeners.delete(callback);
    if (listeners.size === 0) {
      stopListening();
    }
  };
}

function getSnapshot(): string {
  return currentActiveId;
}

function getServerSnapshot(): string {
  return "";
}

/**
 * Shared singleton scroll-spy hook for tracking the active home section.
 * Evaluates section positions in viewport coordinates so tall sections (e.g. comic chronicle)
 * remain active reliably across the full section span.
 */
export function useActiveSection(): string {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") {
      rebindObserver();
    }
  }, [pathname]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
