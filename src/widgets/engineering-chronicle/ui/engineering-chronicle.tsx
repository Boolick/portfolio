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
