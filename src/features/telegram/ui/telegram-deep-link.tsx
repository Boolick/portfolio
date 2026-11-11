"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTelegram } from "../model/telegram-context";
import { parseStartParam } from "@/shared/lib/telegram/start-param";
import { smoothScrollTo } from "@/shared/lib/scroll";

/**
 * Headless controller for session-once Telegram Mini App deep link routing.
 * Parses start_param (`case_<slug>` or `section_<id>`) and dispatches immediate
 * routing or smooth scrolling.
 */
export function TelegramDeepLink() {
  const { isTma, startParam, markDeepLinkReplace } = useTelegram();
  const router = useRouter();
  const pathname = usePathname();
  const hasHandledRef = useRef<boolean>(false);

  useEffect(() => {
    if (!isTma || !startParam || hasHandledRef.current) return;

    try {
      if (sessionStorage.getItem("tma_deeplink_handled") === "1") {
        hasHandledRef.current = true;
        return;
      }
    } catch {}

    const parsed = parseStartParam(startParam);
    if (parsed.type === "none") return;

    hasHandledRef.current = true;
    try {
      sessionStorage.setItem("tma_deeplink_handled", "1");
    } catch {}

    if (parsed.type === "case") {
      markDeepLinkReplace();
      const targetPath = `/projects/${parsed.slug}`;
      if (pathname !== targetPath) {
        router.replace(targetPath);
      }
    } else if (parsed.type === "section") {
      requestAnimationFrame(() => {
        void smoothScrollTo(parsed.sectionId, { updateHash: false });
      });
    }
  }, [isTma, startParam, pathname, router, markDeepLinkReplace]);

  return null;
}
