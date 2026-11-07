"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useLanguage } from "@/features/language-switcher";
import { CHRONICLE_PANELS, type ChroniclePanelData } from "../model/panels";
import { ChroniclePanel } from "./chronicle-panel";

// Lazy load the full pinch-zoom modal so 0 bytes of modal code ship in initial bundle
const ChronicleZoomModal = dynamic(
  () => import("./chronicle-zoom-modal").then((m) => m.ChronicleZoomModal),
  { ssr: false }
);

export function EngineeringChronicle() {
  const { t } = useLanguage();
  const [zoomedPanel, setZoomedPanel] = useState<ChroniclePanelData | null>(null);

  return (
    <section id="approach" className="py-8 sm:py-10 lg:py-12">
      <div className="flex flex-wrap items-baseline justify-between gap-4 mb-4 sm:mb-6">
        <div className="flex items-baseline gap-3 sm:gap-4">
          <span className="font-sans text-xl sm:text-2xl font-bold tracking-[-0.02em] text-accent-aa tabular-nums shrink-0">
            04
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-[-0.02em] text-foreground">
            {t(
              "Engineering Philosophy: Why Architecture Matters",
              "Инженерный подход: почему архитектура имеет значение"
            )}
          </h2>
        </div>
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {t(
            "From race conditions to deterministic state",
            "От гонки состояний к детерминированной системе"
          )}
        </p>
      </div>

      {/* Graphic Novel 1-2-1-2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CHRONICLE_PANELS.map((panel) => (
          <ChroniclePanel
            key={panel.num}
            panel={panel}
            onZoom={setZoomedPanel}
          />
        ))}
      </div>

      {/* Fullscreen Pinch-Zoom Modal */}
      {zoomedPanel && (
        <ChronicleZoomModal
          panel={zoomedPanel}
          open={Boolean(zoomedPanel)}
          onOpenChange={(open) => {
            if (!open) setZoomedPanel(null);
          }}
        />
      )}
    </section>
  );
}
