"use client";

import { useLanguage } from "@/features/language-switcher";
import { HardwareImage, TypewriterText } from "@/shared/ui";
import { tmaHaptics } from "@/shared/lib/telegram/haptics";
import { typograf } from "@/shared/lib";
import { cn } from "@/shared/lib/utils";
import type { ChroniclePanelData } from "../model/panels";

interface ChroniclePanelProps {
  panel: ChroniclePanelData;
  isActive?: boolean;
  eager?: boolean;
  onZoom?: (panel: ChroniclePanelData) => void;
}

export function ChroniclePanel({
  panel,
  isActive = true,
  eager = true,
  onZoom,
}: ChroniclePanelProps) {
  const { lang, t } = useLanguage();
  const title = typograf(panel.title[lang]);
  const punchline = typograf(panel.punchline[lang]);

  const handleZoom = () => {
    tmaHaptics.impact("light");
    onZoom?.(panel);
  };

  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={`${t("Slide", "Кадр")} ${panel.num}: ${title}`}
      className="w-full shrink-0 snap-center snap-always bg-secondary"
    >
      {/* Uniform Passe-Partout Stage: equal outer margins across wide/tall/square frames */}
      <div
        onClick={handleZoom}
        className="w-full h-[360px] sm:h-[460px] lg:h-[520px] p-3 sm:p-5 lg:p-6 cursor-pointer sm:cursor-zoom-in"
      >
        <div className="w-full h-full flex items-center justify-center [container-type:size]">
          {/* Exact aspect-ratio frame locked to container bounds so panel.box always matches artwork */}
          <div
            className="relative shrink-0 overflow-hidden bg-[#f6f4ee] border border-border"
            style={{
              width: `min(100cqw, calc(100cqh * ${panel.dimensions.width} / ${panel.dimensions.height}))`,
              height: `min(100cqh, calc(100cqw * ${panel.dimensions.height} / ${panel.dimensions.width}))`,
            }}
          >
            <HardwareImage
              fileName={panel.fileName}
              alt={`${panel.num} — ${title}`}
              fill
              loading={eager ? "eager" : "lazy"}
              sizes="(max-width: 767px) 100vw, 900px"
              className="w-full h-full object-contain pointer-events-none select-none"
            />

            {/* Narrative Typewriter text aligned inside the illustration's drawn narrator box */}
            <div
              className={cn(
                "absolute z-10 flex flex-col justify-center px-2.5 sm:px-5 py-0.5 pointer-events-none select-text"
              )}
              style={{
                top: panel.box.top,
                left: panel.box.left,
                width: panel.box.width,
                height: panel.box.height,
              }}
            >
              <TypewriterText
                as="p"
                text={punchline}
                delayMs={panel.delayMs}
                active={isActive}
                className="font-sans font-bold text-[10px] leading-[1.16] sm:text-xs md:text-[13.5px] lg:text-[14px] lg:leading-[1.2] text-neutral-900 tracking-tight"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
