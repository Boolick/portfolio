"use client";

import { useEffect } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useLanguage } from "@/features/language-switcher";
import { useTelegram } from "@/features/telegram";
import { HardwareImage } from "@/shared/ui";
import { tmaHaptics } from "@/shared/lib/telegram/haptics";
import { typograf } from "@/shared/lib";
import type { ChroniclePanelData } from "../model/panels";

interface ChronicleZoomModalProps {
  panel: ChroniclePanelData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChronicleZoomModal({
  panel,
  open,
  onOpenChange,
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

  if (!panel) return null;

  const title = typograf(panel.title[lang]);
  const punchline = typograf(panel.punchline[lang]);
  const caption = typograf(panel.caption[lang]);

  const handleClose = () => {
    tmaHaptics.impact("light");
    onOpenChange(false);
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        {/* Dark Constructivist Scrim */}
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/92 backdrop-blur-xs transition-opacity duration-150 animate-in fade-in" />

        <DialogPrimitive.Content
          className="fixed inset-0 z-50 flex flex-col justify-between bg-black text-white focus:outline-none overflow-hidden select-none"
          style={{
            paddingTop: "max(var(--tg-content-safe-area-inset-top, 0px), 0px)",
            paddingBottom: "max(var(--tg-content-safe-area-inset-bottom, 0px), env(safe-area-inset-bottom, 0px))",
          }}
        >
          {/* Top Utility Bar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/15 bg-black/80 z-10 shrink-0">
            <div className="flex items-center gap-2.5 font-mono text-xs">
              <span className="font-bold text-[#ff5c00] tabular-nums">
                {panel.num}
              </span>
              <DialogPrimitive.Title className="font-bold uppercase tracking-wider text-neutral-200 text-xs sm:text-sm truncate max-w-[220px] sm:max-w-md">
                {title}
              </DialogPrimitive.Title>
            </div>

            <button
              type="button"
              onClick={handleClose}
              aria-label={t("Close zoom view", "Закрыть увеличение")}
              className="tactile-btn flex items-center justify-center min-h-12 min-w-12 text-white hover:text-[#ff5c00] transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <DialogPrimitive.Description className="sr-only">
            {title}: {caption}
          </DialogPrimitive.Description>

          {/* Pinch-zoomable / Scrollable Artwork Viewport */}
          <div
            className="flex-1 overflow-auto flex items-center justify-center p-2 sm:p-4"
            style={{
              touchAction: "pinch-zoom pan-x pan-y",
            }}
          >
            <div className="relative w-full max-w-4xl max-h-[75vh] flex items-center justify-center">
              <HardwareImage
                fileName={panel.fileName}
                alt={`${panel.num} — ${title}`}
                width={1376}
                height={768}
                sizes="100vw"
                className="max-h-[72vh] w-auto h-auto object-contain border border-white/20"
              />
            </div>
          </div>

          {/* Bottom Architectural Narrative Caption */}
          <div className="border-t border-white/15 bg-neutral-950/90 p-4 sm:p-5 shrink-0 z-10 space-y-1.5">
            <p className="font-sans font-bold text-sm sm:text-base text-neutral-100 leading-snug">
              {punchline}
            </p>
            <p className="font-mono text-xs text-neutral-400 leading-relaxed">
              {caption}
            </p>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
