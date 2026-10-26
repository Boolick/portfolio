"use client";

import { useLanguage } from "@/features/language-switcher";
import { CHRONICLE_PANELS } from "../model/panels";
import { ChroniclePanel } from "./chronicle-panel";

export function EngineeringChronicle() {
  const { t } = useLanguage();

  return (
    <section id="approach" className="py-8 md:py-10">
      <div className="flex flex-wrap items-baseline justify-between gap-4 mb-4 sm:mb-6">
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-xs uppercase tracking-wider text-primary font-bold">
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
          <ChroniclePanel key={panel.num} panel={panel} />
        ))}
      </div>
    </section>
  );
}
