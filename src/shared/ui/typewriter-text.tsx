"use client";

import { useEffect, useRef, type ElementType } from "react";
import { cn } from "@/shared/lib/utils";
import { TypewriterEngine } from "@/shared/lib/typewriter/typewriter-engine";
import { resolveTypewriterMode } from "@/shared/lib/typewriter/typewriter-lifecycle";

export interface TypewriterTextProps {
  text: string;
  delayMs?: number;
  active?: boolean;
  className?: string;
  as?: "p" | "span" | "div";
}

export function TypewriterText({
  text,
  delayMs = 0,
  active = true,
  className,
  as: Component = "p",
}: TypewriterTextProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const textNodeRef = useRef<HTMLSpanElement | null>(null);
  const cursorRef = useRef<HTMLSpanElement | null>(null);
  const hasTriggeredRef = useRef(false);
  const engineRef = useRef<TypewriterEngine | null>(null);

  useEffect(() => {
    const textNode = textNodeRef.current;
    const cursor = cursorRef.current;
    const container = containerRef.current;

    if (!textNode || !cursor || !container) return;

    const mediaQuery =
      typeof window !== "undefined" && window.matchMedia
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;

    const prefersReducedMotion = mediaQuery ? mediaQuery.matches : false;
    const hasIntersectionObserver = typeof IntersectionObserver !== "undefined";

    const mode = resolveTypewriterMode({
      hasTriggered: hasTriggeredRef.current,
      prefersReducedMotion,
      hasIntersectionObserver,
      active,
    });

    if (mode === "immediate") {
      textNode.textContent = text;
      cursor.setAttribute("data-state", "hidden");
      return;
    }

    // Arm the text node for animation without React overwriting imperative DOM frames
    textNode.textContent = "";
    cursor.setAttribute("data-state", "idle");

    if (mode === "idle") {
      return;
    }

    const onMotionChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        if (engineRef.current) {
          engineRef.current.finish();
        } else {
          textNode.textContent = text;
          cursor.setAttribute("data-state", "hidden");
        }
      }
    };

    if (mediaQuery?.addEventListener) {
      mediaQuery.addEventListener("change", onMotionChange);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry || !entry.isIntersecting) return;

        hasTriggeredRef.current = true;
        observer.disconnect();

        cursor.setAttribute("data-state", "typing");

        const engine = new TypewriterEngine({
          text,
          delayMs,
          onFrame: (slice) => {
            if (textNodeRef.current) {
              textNodeRef.current.textContent = slice;
            }
          },
          onDone: () => {
            if (cursorRef.current) {
              cursorRef.current.setAttribute("data-state", "done");
            }
          },
        });

        engineRef.current = engine;
        engine.start();
      },
      { threshold: 0.25 }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      if (mediaQuery?.removeEventListener) {
        mediaQuery.removeEventListener("change", onMotionChange);
      }
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
    };
  }, [text, delayMs, active]);

  const Tag = Component as ElementType;

  return (
    <Tag
      ref={containerRef}
      data-typewriter=""
      className={cn("grid [text-wrap:wrap]", className)}
    >
      {/* Screen reader full text representation */}
      <span className="sr-only">{text}</span>

      {/* Ghost copy: exactly reserves the final line count/height to prevent any layout shift (CLS: 0) */}
      <span
        aria-hidden="true"
        className="col-start-1 row-start-1 invisible select-none pointer-events-none"
      >
        {text}
        <span className="inline-block w-[0.55ch] ml-[2px]" />
      </span>

      {/* Animated text layer (owned imperatively by useEffect + TypewriterEngine) */}
      <span aria-hidden="true" className="col-start-1 row-start-1">
        <span ref={textNodeRef} />
        <span ref={cursorRef} data-state="idle" className="tw-cursor" />
      </span>
    </Tag>
  );
}
