"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight, Maximize2, RotateCcw } from "lucide-react";
import { useLanguage } from "@/features/language-switcher";
import { playTactileFeedback, typograf } from "@/shared/lib";
import { tmaHaptics } from "@/shared/lib/telegram/haptics";
import { cn } from "@/shared/lib/utils";
import { CHRONICLE_PANELS } from "../model/panels";
import {
  clampSlideIndex,
  getAdjacentSlideIndex,
  resolveActiveSlideIndex,
} from "../model/slider-navigation";
import { ChroniclePanel } from "./chronicle-panel";

// Lazy load the full pinch-zoom modal so 0 bytes of modal code ship in initial bundle
const ChronicleZoomModal = dynamic(
  () => import("./chronicle-zoom-modal").then((m) => m.ChronicleZoomModal),
  { ssr: false }
);

export function EngineeringChronicle() {
  const { lang, t } = useLanguage();
  const isRu = lang === "ru";
  const totalPanels = CHRONICLE_PANELS.length;
  const totalLabel = String(totalPanels).padStart(2, "0");

  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const activeIndexRef = useRef(0);
  const programmaticTargetRef = useRef<number | null>(null);
  const programmaticTimerRef = useRef<number | null>(null);
  const scrollRafRef = useRef<number | null>(null);

  const clearProgrammaticLock = useCallback(() => {
    programmaticTargetRef.current = null;
    if (programmaticTimerRef.current !== null) {
      window.clearTimeout(programmaticTimerRef.current);
      programmaticTimerRef.current = null;
    }
  }, []);

  const goToSlide = useCallback(
    (rawIndex: number, options?: { instant?: boolean; silent?: boolean }) => {
      const target = clampSlideIndex(rawIndex, totalPanels);

      if (!options?.silent && target !== activeIndexRef.current) {
        playTactileFeedback("tap");
      }

      activeIndexRef.current = target;
      setActiveIndex(target);

      const track = trackRef.current;
      if (!track) return;

      const prefersReduced =
        typeof window !== "undefined" &&
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const instant = Boolean(options?.instant || prefersReduced);
      clearProgrammaticLock();

      if (!instant) {
        programmaticTargetRef.current = target;
        programmaticTimerRef.current = window.setTimeout(() => {
          programmaticTargetRef.current = null;
          programmaticTimerRef.current = null;
        }, 650);
      }

      track.scrollTo({
        left: target * track.clientWidth,
        behavior: instant ? "auto" : "smooth",
      });
    },
    [clearProgrammaticLock, totalPanels]
  );

  const handleTrackScroll = useCallback(() => {
    if (scrollRafRef.current !== null) return;

    scrollRafRef.current = window.requestAnimationFrame(() => {
      scrollRafRef.current = null;
      const track = trackRef.current;
      if (!track) return;

      const slideWidth = track.clientWidth;
      if (slideWidth <= 0) return;

      if (programmaticTargetRef.current !== null) {
        const expectedLeft = programmaticTargetRef.current * slideWidth;
        if (Math.abs(track.scrollLeft - expectedLeft) <= 2) {
          clearProgrammaticLock();
        }
        return;
      }

      const resolved = resolveActiveSlideIndex(
        track.scrollLeft,
        slideWidth,
        totalPanels
      );

      if (resolved !== activeIndexRef.current) {
        activeIndexRef.current = resolved;
        setActiveIndex(resolved);
        tmaHaptics.selection();
      }
    });
  }, [clearProgrammaticLock, totalPanels]);

  // Keep active slide snapped cleanly when viewport or container width changes
  useEffect(() => {
    const track = trackRef.current;
    if (!track || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => {
      const width = track.clientWidth;
      if (width > 0) {
        track.scrollTo({
          left: activeIndexRef.current * width,
          behavior: "auto",
        });
      }
    });

    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  // Cleanup any pending animation frame or timer on unmount
  useEffect(() => {
    return () => {
      clearProgrammaticLock();
      if (scrollRafRef.current !== null) {
        window.cancelAnimationFrame(scrollRafRef.current);
      }
    };
  }, [clearProgrammaticLock]);

  const handleSliderKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isZoomOpen) return;

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (activeIndex > 0) {
        goToSlide(getAdjacentSlideIndex(activeIndex, "prev", totalPanels, false));
      }
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      if (activeIndex < totalPanels - 1) {
        goToSlide(getAdjacentSlideIndex(activeIndex, "next", totalPanels, false));
      }
    } else if (e.key === "Home") {
      e.preventDefault();
      goToSlide(0);
    } else if (e.key === "End") {
      e.preventDefault();
      goToSlide(totalPanels - 1);
    }
  };

  const handleZoomOpen = useCallback(() => {
    setIsZoomOpen(true);
  }, []);

  const handleZoomStep = useCallback(
    (direction: "prev" | "next") => {
      const next = getAdjacentSlideIndex(
        activeIndexRef.current,
        direction,
        totalPanels,
        false
      );
      goToSlide(next, { instant: true, silent: true });
    },
    [goToSlide, totalPanels]
  );

  const activePanel = CHRONICLE_PANELS[activeIndex] ?? CHRONICLE_PANELS[0];
  const activeTitle = typograf(activePanel.title[lang]);
  const activeCaption = typograf(activePanel.caption[lang]);
  const isFirst = activeIndex === 0;
  const isLast = activeIndex === totalPanels - 1;

  return (
    <section id="approach" className="py-8 sm:py-10 lg:py-12">
      <div className="flex flex-wrap items-baseline justify-between gap-4 mb-3 sm:mb-4">
        <h2 className="text-xl sm:text-2xl lg:text-[26px] font-bold tracking-[-0.02em] text-foreground">
          {t(
            "Engineering Standard: Why My Systems Don't Lose Money or Data",
            "Инженерный стандарт: почему системы не теряют деньги и данные"
          )}
        </h2>
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {t(
            "From race conditions to deterministic state",
            "От гонки состояний к детерминированной системе"
          )}
        </p>
      </div>

      {/* Human-friendly editorial lead-in */}
      <p className="font-sans text-sm sm:text-base text-muted-foreground max-w-3xl leading-relaxed mb-6">
        {t(
          "The costliest bugs happen in everyday moments — like a customer on a weak elevator signal tapping \"Pay\" three times in a row. A 6-panel breakdown of how deterministic architecture protects business revenue and saves engineering teams from 3 AM incidents.",
          "Самые дорогие ошибки случаются в бытовых мелочах — например, когда покупатель едет в лифте со слабой связью и трижды нажимает кнопку «Оплатить». Короткая история в 6 кадрах о том, как продуманная архитектура защищает выручку бизнеса и избавляет команду от ночных аварий."
        )}
      </p>

      {/* Unified Constructivist Slider Chassis */}
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={t(
          "6-panel engineering chronicle",
          "Инженерный комикс из 6 кадров"
        )}
        tabIndex={0}
        onKeyDown={handleSliderKeyDown}
        className="border border-border bg-card focus-visible:outline-1 focus-visible:outline-ring focus-visible:outline-offset-2"
      >
        {/* Top Telemetry & Title Strip */}
        <div className="px-3.5 py-2 sm:px-5 sm:py-2.5 border-b border-border bg-muted/40 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="font-mono text-xs font-bold tabular-nums text-accent-aa shrink-0">
              {activePanel.num} / {totalLabel}
            </span>
            <span className="text-muted-foreground/50 font-mono text-xs shrink-0" aria-hidden="true">
              ·
            </span>
            <h3 className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground truncate">
              {activeTitle}
            </h3>
          </div>

          <button
            type="button"
            onClick={() => {
              tmaHaptics.impact("light");
              handleZoomOpen();
            }}
            aria-label={
              isRu
                ? `Увеличить иллюстрацию кадра ${activePanel.num}`
                : `Zoom panel ${activePanel.num} illustration`
            }
            className="tactile-btn inline-flex items-center justify-center gap-1.5 min-h-9 min-w-9 px-2 sm:px-3 border border-border bg-card text-foreground hover:border-primary hover:text-primary font-mono text-[11px] font-semibold uppercase tracking-wider transition-colors cursor-pointer shrink-0"
          >
            <Maximize2 className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">{t("Zoom", "Увеличить")}</span>
          </button>
        </div>

        {/* Horizontal Scroll-Snap Passe-Partout Stage */}
        <div
          ref={trackRef}
          onScroll={handleTrackScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden touch-pan-x bg-secondary"
        >
          {CHRONICLE_PANELS.map((panel, index) => (
            <ChroniclePanel
              key={panel.num}
              panel={panel}
              isActive={index === activeIndex}
              eager={Math.abs(index - activeIndex) <= 1}
              onZoom={handleZoomOpen}
            />
          ))}
        </div>

        {/* Fixed-Height Architectural Caption Strip */}
        <div className="border-t border-border bg-card px-4 py-3 sm:px-5 sm:py-3.5 min-h-[4.75rem] sm:min-h-[3.75rem] flex items-center">
          <p
            aria-live="polite"
            className="font-mono text-xs sm:text-[13px] text-muted-foreground leading-relaxed"
          >
            {activeCaption}
          </p>
        </div>

        {/* Bottom Constructivist Navigation Deck */}
        <div className="border-t border-border bg-muted/40 p-2 sm:px-4 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3">
          {/* Prev Button */}
          <button
            type="button"
            disabled={isFirst}
            onClick={() => goToSlide(activeIndex - 1)}
            aria-label={t("Previous slide", "Предыдущий кадр")}
            className="tactile-btn inline-flex items-center justify-center gap-1.5 h-10 min-w-10 px-2 sm:px-3.5 border border-border bg-card text-foreground hover:border-primary hover:text-primary disabled:opacity-35 disabled:pointer-events-none cursor-pointer shrink-0"
          >
            <ChevronLeft className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline font-mono text-xs font-semibold uppercase tracking-wider">
              {t("Prev", "Назад")}
            </span>
          </button>

          {/* 01..06 Preset Selector Strip */}
          <div
            role="group"
            aria-label={t("Slide selector", "Выбор кадра")}
            className="flex-1 max-w-md mx-auto grid grid-cols-6 border border-border divide-x divide-border bg-card"
          >
            {CHRONICLE_PANELS.map((panel, index) => {
              const isCurrent = index === activeIndex;
              const panelTitle = typograf(panel.title[lang]);

              return (
                <button
                  key={panel.num}
                  type="button"
                  onClick={() => goToSlide(index)}
                  aria-label={
                    isRu
                      ? `Кадр ${panel.num}: ${panelTitle}`
                      : `Slide ${panel.num}: ${panelTitle}`
                  }
                  aria-current={isCurrent ? "step" : undefined}
                  title={`${panel.num} — ${panelTitle}`}
                  className={cn(
                    "tactile-btn h-10 flex items-center justify-center font-mono text-xs tabular-nums transition-colors cursor-pointer",
                    isCurrent
                      ? "bg-primary text-primary-foreground font-bold"
                      : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground font-medium"
                  )}
                >
                  {panel.num}
                </button>
              );
            })}
          </div>

          {/* Next / Restart Button */}
          <button
            type="button"
            onClick={() => goToSlide(isLast ? 0 : activeIndex + 1)}
            aria-label={
              isLast
                ? t("Restart from slide 01", "Начать с первого кадра")
                : t("Next slide", "Следующий кадр")
            }
            className="tactile-btn inline-flex items-center justify-center gap-1.5 h-10 min-w-10 px-2 sm:px-3.5 border border-border bg-card text-foreground hover:border-primary hover:text-primary cursor-pointer shrink-0"
          >
            <span className="hidden sm:inline font-mono text-xs font-semibold uppercase tracking-wider">
              {isLast ? t("Restart", "Сначала") : t("Next", "Далее")}
            </span>
            {isLast ? (
              <RotateCcw className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
            ) : (
              <ChevronRight className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Fullscreen Pinch-Zoom Modal */}
      {isZoomOpen && (
        <ChronicleZoomModal
          panel={activePanel}
          currentIndex={activeIndex}
          totalPanels={totalPanels}
          open={isZoomOpen}
          onOpenChange={setIsZoomOpen}
          onStep={handleZoomStep}
        />
      )}
    </section>
  );
}
