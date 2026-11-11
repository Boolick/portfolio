"use client";

import { useEffect } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useLanguage } from "@/features/language-switcher";
import { useTelegram } from "@/features/telegram";
import { HardwareImage } from "@/shared/ui";
import { tmaHaptics } from "@/shared/lib/telegram/haptics";
import { typograf } from "@/shared/lib";
import type { ChroniclePanelData } from "../model/panels";

interface ChronicleZoomModalProps {
  panel: ChroniclePanelData | null;
  currentIndex?: number;
  totalPanels?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStep?: (direction: "prev" | "next") => void;
}

export function ChronicleZoomModal({
  panel,
  currentIndex = 0,
  totalPanels = 6,
  open,
  onOpenChange,
  onStep,
}: ChronicleZoomModalProps) {
  const { lang, t } = useLanguage();
  const { registerModalBackHandler } = useTelegram();

  // Register with Telegram BackButton modal stack (LIFO)
  useEffect(() => {
    if (!open) return;
    return registerModalBackHandler(() => {
      onOpenChange(false);
    });
  }, [open, onOpenChange, registerModalBackHandler]);

  // Keyboard navigation inside zoom view
  useEffect(() => {
    if (!open || !onStep) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        tmaHaptics.selection();
        onStep("prev");
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        tmaHaptics.selection();
        onStep("next");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onStep]);

  if (!panel) return null;

  const title = typograf(panel.title[lang]);
  const punchline = typograf(panel.punchline[lang]);
  const caption = typograf(panel.caption[lang]);

  const handleClose = () => {
    tmaHaptics.impact("light");
    onOpenChange(false);
  };

  const handleStep = (direction: "prev" | "next") => {
    tmaHaptics.selection();
    onStep?.(direction);
  };

  const totalLabel = String(totalPanels).padStart(2, "0");
  const isFirst = currentIndex <= 0;
  const isLast = currentIndex >= totalPanels - 1;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        {/* Dark Constructivist Scrim */}
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/92 backdrop-blur-xs transition-opacity duration-150 animate-in fade-in" />

        <DialogPrimitive.Content
          className="fixed inset-0 z-50 flex flex-col justify-between bg-black text-white focus:outline-none overflow-hidden select-none"
          style={{
            paddingTop: "max(var(--tg-content-safe-area-inset-top, 0px), 0px)",
            paddingBottom:
              "max(var(--tg-content-safe-area-inset-bottom, 0px), env(safe-area-inset-bottom, 0px))",
          }}
        >
          {/* Top Utility Bar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/15 bg-black/80 z-10 shrink-0">
            <div className="flex items-center gap-2.5 font-mono text-xs min-w-0">
              <span className="font-bold text-[#ff5c00] tabular-nums shrink-0">
                {panel.num} / {totalLabel}
              </span>
              <DialogPrimitive.Title className="font-bold uppercase tracking-wider text-neutral-200 text-xs sm:text-sm truncate max-w-[200px] sm:max-w-md">
                {title}
              </DialogPrimitive.Title>
            </div>

            <button
              type="button"
              onClick={handleClose}
              aria-label={t("Close zoom view", "Закрыть увеличение")}
              className="tactile-btn flex items-center justify-center min-h-11 min-w-11 text-white hover:text-[#ff5c00] transition-colors cursor-pointer shrink-0"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <DialogPrimitive.Description className="sr-only">
            {title}: {caption}
          </DialogPrimitive.Description>

          {/* Pinch-zoomable / Scrollable Artwork Viewport */}
          <div
            className="flex-1 overflow-auto flex items-center justify-center p-3 sm:p-6"
            style={{
              touchAction: "pinch-zoom pan-x pan-y",
            }}
          >
            <div className="relative w-full max-w-4xl max-h-[72vh] flex items-center justify-center">
              <HardwareImage
                fileName={panel.fileName}
                alt={`${panel.num} — ${title}`}
                width={panel.dimensions.width}
                height={panel.dimensions.height}
                sizes="100vw"
                className="max-h-[68vh] w-auto h-auto object-contain border border-white/20"
              />
            </div>
          </div>

          {/* Bottom Architectural Narrative Caption + Modal Step Controls */}
          <div className="border-t border-white/15 bg-neutral-950/95 p-4 sm:px-6 sm:py-4 shrink-0 z-10 space-y-3">
            <div className="space-y-1 max-w-4xl mx-auto">
              <p className="font-sans font-bold text-sm sm:text-base text-neutral-100 leading-snug">
                {punchline}
              </p>
              <p className="font-mono text-xs text-neutral-400 leading-relaxed">
                {caption}
              </p>
            </div>

            {onStep && (
              <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10 max-w-4xl mx-auto font-mono text-xs uppercase tracking-wider">
                <button
                  type="button"
                  disabled={isFirst}
                  onClick={() => handleStep("prev")}
                  aria-label={t("Previous slide", "Предыдущий кадр")}
                  className="tactile-btn inline-flex items-center justify-center gap-1.5 h-10 px-3.5 border border-white/20 bg-neutral-900 text-neutral-200 hover:border-[#ff5c00] hover:text-[#ff5c00] disabled:opacity-35 disabled:pointer-events-none cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  <span>{t("Prev", "Назад")}</span>
                </button>

                <span className="text-neutral-400 tabular-nums">
                  {panel.num} / {totalLabel}
                </span>

                <button
                  type="button"
                  disabled={isLast}
                  onClick={() => handleStep("next")}
                  aria-label={t("Next slide", "Следующий кадр")}
                  className="tactile-btn inline-flex items-center justify-center gap-1.5 h-10 px-3.5 border border-white/20 bg-neutral-900 text-neutral-200 hover:border-[#ff5c00] hover:text-[#ff5c00] disabled:opacity-35 disabled:pointer-events-none cursor-pointer"
                >
                  <span>{t("Next", "Далее")}</span>
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
