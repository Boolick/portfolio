"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

export interface HomeSectionMeta {
  id: string;
  num: string;
  en: string;
  ru: string;
  tmaCore: boolean;
}

export const HOME_SECTIONS: readonly HomeSectionMeta[] = [
  { id: "profile", num: "01", en: "Profile", ru: "Профиль", tmaCore: true },
  { id: "projects", num: "02", en: "Projects", ru: "Проекты", tmaCore: true },
  { id: "approach", num: "03", en: "Approach", ru: "Подход", tmaCore: true },
  { id: "experience", num: "04", en: "Resume", ru: "Резюме", tmaCore: true },
  { id: "contact", num: "05", en: "Contact", ru: "Контакты", tmaCore: true },
] as const;

type Listener = () => void;
const listeners = new Set<Listener>();

let currentActiveId = "profile";
let sharedObserver: IntersectionObserver | null = null;
const sectionRatios = new Map<string, number>();

function setupObserver() {
  if (typeof window === "undefined" || sharedObserver) return;

  sharedObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const id = entry.target.id;
        sectionRatios.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
      }

      let bestId = currentActiveId;
      let maxRatio = 0.05;

      for (const sec of HOME_SECTIONS) {
        const ratio = sectionRatios.get(sec.id) || 0;
        if (ratio > maxRatio) {
          maxRatio = ratio;
          bestId = sec.id;
        }
      }

      if (bestId !== currentActiveId) {
        currentActiveId = bestId;
        listeners.forEach((l) => l());
      }
    },
    {
      rootMargin: "-15% 0px -50% 0px",
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
    }
  );

  for (const s of HOME_SECTIONS) {
    const el = document.getElementById(s.id);
    if (el) sharedObserver.observe(el);
  }
}

export function rebindObserver() {
  if (typeof window === "undefined") return;
  if (sharedObserver) {
    sharedObserver.disconnect();
    sharedObserver = null;
    sectionRatios.clear();
  }
  if (listeners.size > 0) {
    setupObserver();
  }
}

function teardownObserver() {
  if (sharedObserver) {
    sharedObserver.disconnect();
    sharedObserver = null;
    sectionRatios.clear();
  }
}

function subscribe(callback: Listener) {
  listeners.add(callback);
  if (listeners.size === 1) {
    setupObserver();
  }
  return () => {
    listeners.delete(callback);
    if (listeners.size === 0) {
      teardownObserver();
    }
  };
}

function getSnapshot(): string {
  return currentActiveId;
}

function getServerSnapshot(): string {
  return "profile";
}

/**
 * Shared singleton IntersectionObserver hook for tracking active home section.
 * Spawns at most ONE observer regardless of how many components subscribe.
 * Re-binds observer when returning to "/" from subpages like /projects/[slug].
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
