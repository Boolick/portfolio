"use client";

import { Maximize2 } from "lucide-react";
import { useLanguage } from "@/features/language-switcher";
import { HardwareImage, TypewriterText } from "@/shared/ui";
import { tmaHaptics } from "@/shared/lib/telegram/haptics";
import { cn } from "@/shared/lib/utils";
import type { ChroniclePanelData } from "../model/panels";

interface ChroniclePanelProps {
  panel: ChroniclePanelData;
  onZoom?: (panel: ChroniclePanelData) => void;
}

export function ChroniclePanel({ panel, onZoom }: ChroniclePanelProps) {
  const { lang, t } = useLanguage();
  const isRu = lang === "ru";
  const title = panel.title[lang];
  const punchline = panel.punchline[lang];
  const caption = panel.caption[lang];

  const handleZoom = () => {
    tmaHaptics.impact("light");
    onZoom?.(panel);
  };

  return (
    <article
      className={cn(
        "border border-border bg-card flex flex-col justify-between overflow-hidden",
        panel.variant === "wide" ? "md:col-span-2" : "col-span-1"
      )}
    >
      {/* Mobile-Only Header Strip (< 640px, sm:hidden) */}
      <div className="px-3.5 py-2 border-b border-border bg-muted/40 flex items-center justify-between gap-2 sm:hidden">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-mono text-xs font-bold tabular-nums text-accent-aa shrink-0">
            {panel.num}
          </span>
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-foreground truncate">
            {title}
          </h3>
        </div>

        <button
          type="button"
          onClick={handleZoom}
          aria-label={
            isRu
              ? `Увеличить иллюстрацию кадра ${panel.num}`
              : `Zoom panel ${panel.num} illustration`
          }
          className="tactile-btn flex items-center justify-center min-h-11 min-w-11 text-muted-foreground hover:text-primary transition-colors cursor-pointer shrink-0"
        >
          <Maximize2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* Frame Visual with source-accurate aspect ratio and embedded narrator box overlay */}
      <div
        onClick={handleZoom}
        className={cn(
          "relative w-full bg-[#f6f4ee] overflow-hidden cursor-pointer sm:cursor-default",
          panel.aspectRatioClass
        )}
      >
        <HardwareImage
          fileName={panel.fileName}
          alt={`${panel.num} — ${title}`}
          fill
          sizes={
            panel.variant === "wide"
              ? "(max-width: 767px) 100vw, 900px"
              : "(max-width: 767px) 100vw, 450px"
          }
          className="w-full h-full object-contain pointer-events-none select-none"
        />

        {/* Narrative Typewriter text positioned directly inside the artwork's drawn speech/narrator box */}
        <div
          className="absolute z-10 flex flex-col justify-center px-3 sm:px-6 py-1 pointer-events-none select-text"
          style={{
            top: panel.box.top,
            left: panel.box.left,
            width: panel.box.width,
            height: panel.box.height,
          }}
        >
          {/* Header row shown on sm+ (desktop keeps 2-line layout) */}
          <div className="hidden sm:flex items-center gap-2 mb-0.5 sm:mb-1">
            <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider text-accent-aa">
              {panel.num}
            </span>
            <span className="font-mono text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-600 line-clamp-1">
              {title}
            </span>
          </div>

          <TypewriterText
            as="p"
            text={punchline}
            delayMs={panel.delayMs}
            className="font-sans font-bold text-[10.5px] leading-[1.18] sm:text-sm md:text-base text-neutral-900 tracking-tight"
          />
        </div>

        {/* Desktop subtle hover zoom hint */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleZoom();
          }}
          aria-label={t("Zoom illustration", "Увеличить иллюстрацию")}
          className="tactile-btn hidden sm:flex items-center justify-center absolute top-2 right-2 p-1.5 border border-border bg-card/90 text-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer"
        >
          <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>

      {/* Bottom Architectural Caption */}
      <div className="px-4 py-2.5 sm:px-5 sm:py-3 bg-card border-t border-border">
        <p className="font-mono text-xs text-muted-foreground leading-relaxed">
          {caption}
        </p>
      </div>
    </article>
  );
}
