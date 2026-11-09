"use client";

import { tmaHaptics } from "@/shared/lib/telegram/haptics";

/**
 * Precision Web Audio Mechanical Click Synthesizer & Haptic Engine
 * Generates an authentic mechanical relay/switch click with dual-layer sound:
 * 1) Pitch-swept micro-transient (triangle wave impulse)
 * 2) Textured metallic noise burst (bandpass filtered noise)
 * Paired with native haptic feedback (TMA API + Web Vibration API).
 */

class MechanicalClickEngine {
  private ctx: AudioContext | null = null;
  private noiseBuffer: AudioBuffer | null = null;

  private isMuted(): boolean {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem("theme-sound-mute") === "1";
    } catch {
      return false;
    }
  }

  private ensureAudioContext(): AudioContext | null {
    if (typeof window === "undefined") return null;

    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        try {
          this.ctx = new AudioCtx();
        } catch {
          this.ctx = null;
        }
      }
    }

    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }

    if (this.ctx && !this.noiseBuffer) {
      try {
        const sampleRate = this.ctx.sampleRate;
        const bufferLength = Math.max(1, Math.floor(sampleRate * 0.005));
        const buffer = this.ctx.createBuffer(1, bufferLength, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferLength; i++) {
          const t = i / sampleRate;
          data[i] = (Math.random() * 2 - 1) * Math.exp(-t / 0.0016);
        }
        this.noiseBuffer = buffer;
      } catch {
        this.noiseBuffer = null;
      }
    }

    return this.ctx;
  }

  public playSound(action: "open" | "close" | "tap" = "tap"): void {
    if (this.isMuted()) return;

    const ctx = this.ensureAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime + 0.002;

      // Layer 1: Core mechanical switch transient
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = "triangle";

      // Volume calibrated to comfortable ~55% level for headphones and speakers
      const volumeScale = 0.55;

      // "open" has an energetic switch-on rise/drop; "close" has a solid lower detent latch
      const startFreq = action === "open" ? 1850 : action === "close" ? 1320 : 1600;
      const endFreq = action === "open" ? 340 : action === "close" ? 210 : 280;
      const duration = action === "open" ? 0.0075 : 0.0065;
      const peakGain = (action === "open" ? 0.35 : 0.28) * volumeScale;

      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

      oscGain.gain.setValueAtTime(peakGain, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration + 0.002);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.003);

      // Layer 2: Metallic body contact burst
      if (this.noiseBuffer) {
        const noise = ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;

        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(action === "open" ? 2400 : 1800, now);
        filter.Q.setValueAtTime(2.2, now);

        const noiseGain = ctx.createGain();
        const noisePeak = 0.22 * volumeScale;
        noiseGain.gain.setValueAtTime(noisePeak, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.0055);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);

        noise.start(now);
        noise.stop(now + 0.006);
      }
    } catch {
      // Graceful fallback on audio restrictions
    }
  }

  public triggerHaptics(action: "open" | "close" | "tap" = "tap"): void {
    if (typeof window === "undefined") return;

    // Respect user reduced motion preference
    if (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    // 1. Telegram WebApp native haptic feedback
    if (action === "open") {
      tmaHaptics.impact("medium");
    } else if (action === "close") {
      tmaHaptics.impact("light");
    } else {
      tmaHaptics.selection();
    }

    // 2. Standard Web Vibration API for Android / Chrome mobile web
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      try {
        const vibrationMs = action === "open" ? 18 : action === "close" ? 12 : 8;
        navigator.vibrate(vibrationMs);
      } catch {
        // Safe no-op if vibration blocked by browser permissions
      }
    }
  }

  public playTactile(action: "open" | "close" | "tap" = "tap"): void {
    this.playSound(action);
    this.triggerHaptics(action);
  }
}

export const mechanicalClick = new MechanicalClickEngine();

/**
 * Triggers unified audio click + haptic pulse feedback
 */
export function playTactileFeedback(action: "open" | "close" | "tap" = "tap"): void {
  mechanicalClick.playTactile(action);
}
