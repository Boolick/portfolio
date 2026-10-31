"use client";

import { useEffect } from "react";

export function RefTracker() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Skip tracking for Telegram Mini App visits to avoid duplicate unverified web pings
    if (document.documentElement.getAttribute("data-tma") === "1") return;

    // Do not track visits inside administrative or auth routes
    const pathname = window.location.pathname;
    if (
      pathname.startsWith("/admin") ||
      pathname.startsWith("/login") ||
      pathname.startsWith("/api")
    ) {
      return;
    }

    try {
      const searchParams = new URLSearchParams(window.location.search);
      const explicitRef = searchParams.get("ref");

      let source = explicitRef;
      if (!source) {
        if (document.referrer) {
          try {
            source = new URL(document.referrer).hostname || "referrer";
          } catch {
            source = "referrer";
          }
        } else {
          source = "direct";
        }
      }

      // Deduplicate tracking in the same session
      const cacheKey = `tracked_visit_${source}`;
      if (sessionStorage.getItem(cacheKey)) return;
      sessionStorage.setItem(cacheKey, "true");

      const trackUrl = `/api/track-visit?ref=${encodeURIComponent(
        `${source} (${pathname})`
      )}`;

      fetch(trackUrl)
        .then((res) => {
          if (res.ok && explicitRef && window.history.replaceState) {
            // Clean the ref parameter from the browser URL bar smoothly
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
          }
        })
        .catch((err) => {
          console.debug("Track visit network notice:", err);
        });
    } catch {
      // Ignore sessionStorage errors
    }
  }, []);

  return null;
}
