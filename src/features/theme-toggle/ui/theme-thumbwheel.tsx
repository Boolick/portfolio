"use client";

import { useEffect, useRef, useCallback, useSyncExternalStore } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { ThemeWheelEngine, type ThemeMode } from "../model/wheel-engine";

interface ThemeThumbwheelProps {
  className?: string;
  showLabels?: boolean;
  showSoundToggle?: boolean;
}

const SOUND_MUTE_EVENT = "theme-sound-mute-change";

function subscribeSoundMute(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(SOUND_MUTE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(SOUND_MUTE_EVENT, callback);
  };
}

function getSoundMuteSnapshot(): boolean {
  try {
    return localStorage.getItem("theme-sound-mute") === "1";
  } catch {
    return false;
  }
}

function getSoundMuteServerSnapshot(): boolean {
  return false;
}

export function ThemeThumbwheel({
  className = "",
  showLabels = true,
  showSoundToggle = true,
}: ThemeThumbwheelProps) {
  const slotRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<ThemeWheelEngine | null>(null);

  // SSR-safe external store subscription (uses server snapshot during hydration -> 0 mismatch)
  const isMuted = useSyncExternalStore(
    subscribeSoundMute,
    getSoundMuteSnapshot,
    getSoundMuteServerSnapshot
  );

  // Initialize pure TS engine once on mount
  useEffect(() => {
    const initialMuted = getSoundMuteSnapshot();

    const updateAria = (pos: number, mode: ThemeMode) => {
      if (!slotRef.current) return;
      slotRef.current.setAttribute("aria-valuenow", String(Math.round(pos * 100)));
      slotRef.current.setAttribute(
        "aria-valuetext",
        mode === "dark" ? "Matte Hardware Rack (Dark)" : "Technical Paper Manual (Light)"
      );
    };

    const engine = new ThemeWheelEngine({
      detentSteps: 24,
      hysteresisLow: 0.42,
      hysteresisHigh: 0.58,
      springTension: 140,
      springDamping: 19,
      travelDistancePx: 88,
      soundEnabled: !initialMuted,
      onPositionChange: (pos) => {
        if (slotRef.current) {
          slotRef.current.setAttribute("aria-valuenow", String(Math.round(pos * 100)));
        }
      },
      onModeChange: (newMode) => {
        updateAria(engine.getPosition(), newMode);
      },
      onSettled: (settledMode) => {
        updateAria(engine.getPosition(), settledMode);
      },
    });

    engineRef.current = engine;
    updateAria(engine.getPosition(), engine.getMode());

    // Listen to external theme changes (cross-tab storage or programmatic context calls)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "theme" && (e.newValue === "light" || e.newValue === "dark")) {
        engine.setMode(e.newValue, true);
      }
    };

    const handleProgrammaticSet = (e: Event) => {
      const custom = e as CustomEvent<ThemeMode>;
      if (custom.detail === "light" || custom.detail === "dark") {
        engine.setMode(custom.detail, true);
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("theme-wheel-set", handleProgrammaticSet);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("theme-wheel-set", handleProgrammaticSet);
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!engineRef.current || !slotRef.current) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    engineRef.current.onPointerDown(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!engineRef.current || !slotRef.current) return;
    const rect = slotRef.current.getBoundingClientRect();
    engineRef.current.onPointerMove(e.clientX, rect.width);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!engineRef.current) return;
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {}
    engineRef.current.onPointerUp();
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!engineRef.current) return;
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {}
    engineRef.current.onPointerCancel();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!engineRef.current) return;

    switch (e.key) {
      case "ArrowRight":
      case "ArrowUp":
        e.preventDefault();
        engineRef.current.step(0.1);
        break;
      case "ArrowLeft":
      case "ArrowDown":
        e.preventDefault();
        engineRef.current.step(-0.1);
        break;
      case "Home":
        e.preventDefault();
        engineRef.current.setMode("light", true);
        break;
      case "End":
        e.preventDefault();
        engineRef.current.setMode("dark", true);
        break;
      case " ":
      case "Enter":
        e.preventDefault();
        engineRef.current.toggle();
        break;
    }
  };

  const toggleSound = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !getSoundMuteSnapshot();
    try {
      localStorage.setItem("theme-sound-mute", next ? "1" : "0");
    } catch {}
    if (engineRef.current) {
      engineRef.current.audio.setMuted(next);
      if (!next) {
        engineRef.current.audio.playTick(1.5, true);
      }
    }
    window.dispatchEvent(new Event(SOUND_MUTE_EVENT));
  }, []);

  return (
    <div
      className={`inline-flex items-center gap-1.5 sm:gap-2 font-mono select-none ${className}`}
      data-testid="theme-thumbwheel-wrapper"
    >
      {/* 1. Light Mode Button */}
      {showLabels && (
        <button
          type="button"
          onClick={() => engineRef.current?.setMode("light", true)}
          className="tactile-btn text-[10px] px-1.5 py-0.5 border transition-colors cursor-pointer text-primary font-bold border-border bg-card dark:text-muted-foreground dark:font-normal dark:border-transparent dark:bg-transparent dark:hover:text-foreground"
          title="Light Theme"
        >
          <span>LIGHT</span>
        </button>
      )}

      {/* 2. Constructivist Linear Slider Track */}
      <div
        ref={slotRef}
        role="slider"
        tabIndex={0}
        aria-label="Theme slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
        aria-valuetext="Theme slider"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onLostPointerCapture={handlePointerCancel}
        onKeyDown={handleKeyDown}
        style={{ touchAction: "none" }}
        className="relative flex items-center w-[72px] sm:w-[88px] h-[22px] border border-border bg-muted cursor-ew-resize focus-visible:ring-1 focus-visible:ring-primary outline-none overflow-hidden"
      >
        {/* Center reference line */}
        <div className="absolute inset-x-2 h-[1px] bg-border pointer-events-none" />

        {/* Signal Orange Indicator Pip */}
        <div className="absolute inset-y-0 left-[6px] right-[6px] pointer-events-none z-20">
          <div
            className="absolute top-[2px] bottom-[2px] w-[4px] bg-primary"
            style={{
              left: "calc(var(--wheel-pos, 0) * 100%)",
              transform: "translate3d(-50%, 0, 0)",
            }}
          />
        </div>
      </div>

      {/* 3. Dark Mode Button */}
      {showLabels && (
        <button
          type="button"
          onClick={() => engineRef.current?.setMode("dark", true)}
          className="tactile-btn text-[10px] px-1.5 py-0.5 border border-transparent text-muted-foreground hover:text-foreground transition-colors cursor-pointer dark:text-primary dark:font-bold dark:border-border dark:bg-card"
          title="Dark Theme"
        >
          <span>DARK</span>
        </button>
      )}

      {/* 4. Mechanical Audio Ticks Toggle */}
      {showSoundToggle && (
        <button
          type="button"
          onClick={toggleSound}
          aria-label={isMuted ? "Unmute mechanical dial ticks" : "Mute mechanical dial ticks"}
          title={
            isMuted
              ? "Sound: OFF (Click to enable mechanical audio clicks)"
              : "Sound: ON (Click to mute mechanical audio clicks)"
          }
          className="tactile-btn p-1 border border-border bg-card text-muted-foreground hover:text-foreground cursor-pointer flex items-center justify-center h-[22px] w-[22px]"
        >
          {isMuted ? (
            <VolumeX className="w-3 h-3 text-muted-foreground" />
          ) : (
            <Volume2 className="w-3 h-3 text-primary" />
          )}
        </button>
      )}
    </div>
  );
}
