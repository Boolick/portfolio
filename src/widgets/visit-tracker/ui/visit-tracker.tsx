"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Only track public pages; ignore admin, auth, and api routes
    if (
      !pathname ||
      pathname.startsWith("/admin") ||
      pathname.startsWith("/login") ||
      pathname.startsWith("/api")
    ) {
      return;
    }

    try {
      const sessionKey = "cv_tracked_" + pathname;
      if (sessionStorage.getItem(sessionKey)) return;
      sessionStorage.setItem(sessionKey, "1");

      let ref = "direct";
      if (document.referrer) {
        try {
          ref = new URL(document.referrer).hostname || "referrer";
        } catch {
          ref = "referrer";
        }
      }

      const params = new URLSearchParams({
        ref: `${ref} -> ${pathname}`,
      });

      void fetch(`/api/track-visit?${params.toString()}`).catch(() => {
        // Silently ignore network failures for analytics
      });
    } catch {
      // Ignore storage errors in private mode
    }
  }, [pathname]);

  return null;
}
