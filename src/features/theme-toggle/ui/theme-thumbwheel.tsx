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
      {/* 1. Light Mode Marker / Label (CSS-driven via .dark to guarantee zero hydration mismatch) */}
      {showLabels && (
        <button
          type="button"
          onClick={() => engineRef.current?.setMode("light", true)}
          className="tactile-btn text-[10px] px-1.5 py-0.5 border transition-colors cursor-pointer text-primary font-bold border-border bg-card dark:text-muted-foreground dark:font-normal dark:border-transparent dark:bg-transparent dark:hover:text-foreground"
          title="Switch to Technical Paper Manual (Light)"
        >
          <span className="hidden md:inline">MANUAL:</span>
          <span>LIGHT</span>
        </button>
      )}

      {/* 2. Recessed Japanese 1980s Knurled Thumbwheel */}
      <div
        ref={slotRef}
        role="slider"
        tabIndex={0}
        aria-label="Theme calibration thumbwheel (Sony Walkman style)"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
        aria-valuetext="Theme calibration thumbwheel"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onLostPointerCapture={handlePointerCancel}
        onKeyDown={handleKeyDown}
        style={{ touchAction: "none" }}
        className="relative flex items-center w-[96px] sm:w-[108px] h-[22px] border border-border bg-[#0a0b0d] cursor-ew-resize focus-visible:ring-1 focus-visible:ring-primary outline-none overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.75),inset_0_-1px_1px_rgba(255,255,255,0.1)]"
      >
        {/* Recessed mechanical well floor */}
        <div className="absolute inset-0 bg-[#0d0f13] pointer-events-none" />

        {/* Center Knurling Ribs (Wide pitch, full speed in center of cylinder) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundPosition: "var(--wheel-offset, 0px) 0px",
            backgroundImage: `repeating-linear-gradient(
              90deg,
              rgba(245, 242, 235, 0.58) 0px,
              rgba(245, 242, 235, 0.58) 1.5px,
              rgba(30, 33, 40, 0.95) 1.5px,
              rgba(30, 33, 40, 0.95) 3.5px,
              rgba(0, 0, 0, 0.98) 3.5px,
              rgba(0, 0, 0, 0.98) 5.5px
            )`,
          }}
        />

        {/* Edge Foreshortened Knurling (Sine-projection compression near left & right cylinder edges) */}
        <div
          className="absolute inset-y-0 left-0 w-[26%] pointer-events-none opacity-85"
          style={{
            backgroundPosition: "calc(var(--wheel-offset, 0px) * 0.45) 0px",
            backgroundImage: `repeating-linear-gradient(
              90deg,
              rgba(200, 200, 200, 0.4) 0px,
              rgba(200, 200, 200, 0.4) 1px,
              rgba(0, 0, 0, 0.95) 1px,
              rgba(0, 0, 0, 0.95) 3px
            )`,
          }}
        />
        <div
          className="absolute inset-y-0 right-0 w-[26%] pointer-events-none opacity-85"
          style={{
            backgroundPosition: "calc(var(--wheel-offset, 0px) * 0.45) 0px",
            backgroundImage: `repeating-linear-gradient(
              90deg,
              rgba(200, 200, 200, 0.4) 0px,
              rgba(200, 200, 200, 0.4) 1px,
              rgba(0, 0, 0, 0.95) 1px,
              rgba(0, 0, 0, 0.95) 3px
            )`,
          }}
        />

        {/* 3D Convex Cylinder Lighting & Deep Recessed Side Shadows */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(90deg, rgba(0, 0, 0, 0.92) 0%, rgba(0, 0, 0, 0.45) 16%, transparent 38%, transparent 62%, rgba(0, 0, 0, 0.45) 84%, rgba(0, 0, 0, 0.92) 100%),
              linear-gradient(180deg, rgba(255, 255, 255, 0.16) 0%, transparent 28%, rgba(0, 0, 0, 0.55) 100%)
            `,
          }}
        />

        {/* Top & Bottom chassis bezel lips */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-black/90 pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-[1px] bg-white/10 pointer-events-none" />

        {/* Sub-scale calibration ticks on bezel */}
        <div className="absolute bottom-[1px] inset-x-[7px] flex justify-between pointer-events-none opacity-45 z-10">
          <div className="w-[1px] h-1 bg-white" />
          <div className="w-[1px] h-1.5 bg-[#ff5c00]" />
          <div className="w-[1px] h-1 bg-white" />
        </div>

        {/* Fluorescent Safety Orange Indicator Track & Pip (Pure CSS variable driven) */}
        <div className="absolute inset-y-0 left-[7px] right-[7px] pointer-events-none z-20">
          <div
            className="absolute top-[1px] bottom-[1px] w-[3.5px] bg-[#ff5c00] shadow-[0_0_8px_#ff5c00,0_0_2px_rgba(255,255,255,0.9)]"
            style={{
              left: "calc(var(--wheel-pos, 0) * 100%)",
              transform: "translate3d(-50%, 0, 0)",
            }}
          >
            <div className="absolute inset-y-[2px] left-[1px] w-[1px] bg-white/90" />
          </div>
        </div>
      </div>

      {/* 3. Dark Mode Marker / Label (CSS-driven via .dark to guarantee zero hydration mismatch) */}
      {showLabels && (
        <button
          type="button"
          onClick={() => engineRef.current?.setMode("dark", true)}
          className="tactile-btn text-[10px] px-1.5 py-0.5 border border-transparent text-muted-foreground hover:text-foreground transition-colors cursor-pointer dark:text-primary dark:font-bold dark:border-border dark:bg-card"
          title="Switch to Matte Hardware Rack (Dark)"
        >
          <span className="hidden md:inline">RACK:</span>
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
