"use client";

import { useLanguage } from "@/features/language-switcher";
import { HardwareImage, TypewriterText } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";
import type { ChroniclePanelData } from "../model/panels";

interface ChroniclePanelProps {
  panel: ChroniclePanelData;
}

export function ChroniclePanel({ panel }: ChroniclePanelProps) {
  const { lang } = useLanguage();
  const title = panel.title[lang];
  const punchline = panel.punchline[lang];
  const caption = panel.caption[lang];

  return (
    <article
      className={cn(
        "border border-border bg-card flex flex-col justify-between overflow-hidden",
        panel.variant === "wide" ? "md:col-span-2" : "col-span-1"
      )}
    >
      {/* Frame Visual with source-accurate aspect ratio and embedded narrator box overlay */}
      <div
        className={cn(
          "relative w-full bg-[#f6f4ee] overflow-hidden",
          panel.aspectRatioClass
        )}
      >
        <HardwareImage
          fileName={panel.fileName}
          alt={`${panel.num} — ${title}`}
          fill
          sizes={
            panel.variant === "wide"
              ? "(min-width: 1280px) 1232px, 100vw"
              : "(min-width: 768px) 50vw, 100vw"
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
          <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
            <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#d9531e]">
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
            className="font-sans font-bold text-xs sm:text-sm md:text-base leading-tight text-neutral-900 tracking-tight"
          />
        </div>
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
