/**
 * ============================================================================
 * JAPANESE VINTAGE HARDWARE WHEEL ENGINE (PURE TYPESCRIPT)
 * Architecture: Isolated, Framework-Agnostic, Zero-React-State during motion
 * Inspired by: 1980s Sony Walkman / Panasonic precision knurled thumbwheels
 * ============================================================================
 */

export type ThemeMode = "light" | "dark";

export interface WheelEngineConfig {
  detentSteps?: number;
  hysteresisLow?: number;
  hysteresisHigh?: number;
  springTension?: number;
  springDamping?: number;
  travelDistancePx?: number;
  soundEnabled?: boolean;
  onPositionChange?: (position: number, themeMix: number, wheelOffsetPx: number) => void;
  onModeChange?: (mode: ThemeMode) => void;
  onSettled?: (mode: ThemeMode) => void;
  onTick?: (direction: 1 | -1, speed: number) => void;
}

/**
 * Web Audio Precision Mechanical Click Synthesizer
 * Generates a realistic two-layered mechanical detent click:
 * 1) High-transient pawl impact impulse (triangle pitch drop)
 * 2) Resonant metallic body micro-burst (bandpass filtered noise)
 */
class HardwareAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private lastTickTime = 0;
  private isMuted = false;

  constructor(initialMuted = false) {
    this.isMuted = initialMuted;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Lazily initializes or wakes AudioContext on user gesture
   */
  public ensureContext(): AudioContext | null {
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
        // 6ms crisp transient noise burst
        const bufferLength = Math.max(1, Math.floor(sampleRate * 0.006));
        const buffer = this.ctx.createBuffer(1, bufferLength, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferLength; i++) {
          const t = i / sampleRate;
          const envelope = Math.exp(-t / 0.0018);
          data[i] = (Math.random() * 2 - 1) * envelope;
        }
        this.noiseBuffer = buffer;
      } catch {
        this.noiseBuffer = null;
      }
    }

    return this.ctx;
  }

  /**
   * Triggers a crisp, audible mechanical ratchet click.
   * Modulates pitch and resonance based on rotation speed.
   */
  public playTick(velocity = 1, isThresholdSnap = false): void {
    if (this.isMuted) return;

    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    // Rate-limit to max 1 click per 14ms so fast spins sound like a clean mechanical zipper
    if (!isThresholdSnap && now - this.lastTickTime < 14) return;
    this.lastTickTime = now;

    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const clampedVel = Math.min(Math.max(velocity, 0.2), 4.0);
      // Schedule slightly ahead if context is just waking up from suspended state
      const startTime = ctx.currentTime + 0.002;

      // Layer 1: Crisp mechanical pawl impact (short pitch-dropping impulse)
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = "triangle";

      const baseFreq = isThresholdSnap ? 1950 : 1450 + clampedVel * 140;
      osc.frequency.setValueAtTime(baseFreq, startTime);
      osc.frequency.exponentialRampToValueAtTime(280, startTime + 0.0055);

      const impactPeak = isThresholdSnap ? 0.42 : 0.28;
      oscGain.gain.setValueAtTime(impactPeak, startTime);
      oscGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.006);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.0065);

      // Layer 2: Metallic knurled body texture (bandpass noise transient)
      if (this.noiseBuffer) {
        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = this.noiseBuffer;

        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(1600 + clampedVel * 180, startTime);
        filter.Q.setValueAtTime(1.8, startTime);

        const noiseGain = ctx.createGain();
        const noisePeak = isThresholdSnap ? 0.38 : 0.24;
        noiseGain.gain.setValueAtTime(noisePeak, startTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.0055);

        noiseSource.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);

        noiseSource.start(startTime);
        noiseSource.stop(startTime + 0.006);
      }
    } catch {
      // Never throw on audio hardware restrictions
    }
  }

  public dispose(): void {
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch {}
      this.ctx = null;
      this.noiseBuffer = null;
    }
  }
}

/**
 * Mobile Haptic Vibration Driver
 * Supports Android Chrome navigator.vibrate & best-effort iOS 17.4+ switch trigger
 */
class HardwareHapticsDriver {
  private iosSwitchEl: HTMLInputElement | null = null;

  constructor() {
    if (typeof document !== "undefined") {
      this.initIosElement();
    }
  }

  private initIosElement(): void {
    try {
      const existing = document.getElementById("hw-taptic-switch") as HTMLInputElement | null;
      if (existing) {
        this.iosSwitchEl = existing;
      } else if (document.body) {
        const input = document.createElement("input");
        input.type = "checkbox";
        input.id = "hw-taptic-switch";
        input.setAttribute("switch", "");
        input.setAttribute("aria-hidden", "true");
        input.tabIndex = -1;
        input.style.cssText =
          "position:fixed;top:-9999px;left:-9999px;opacity:0;pointer-events:none;width:1px;height:1px;";
        document.body.appendChild(input);
        this.iosSwitchEl = input;
      }
    } catch {}
  }

  public vibrateDetent(): void {
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      try {
        navigator.vibrate(4);
      } catch {}
    }
  }

  public vibrateThreshold(): void {
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      try {
        navigator.vibrate(10);
      } catch {}
    }
    if (this.iosSwitchEl) {
      try {
        this.iosSwitchEl.click();
      } catch {}
    }
  }
}

/**
 * Main Pure TypeScript Wheel Engine
 */
export class ThemeWheelEngine {
  private position = 0; // Normalized physical wheel position [0.0 = Light, 1.0 = Dark]
  private targetPosition = 0;
  private velocity = 0;
  private currentMode: ThemeMode = "light";

  // Physics & quantization parameters
  private detentSteps = 24;
  private hysteresisLow = 0.42;
  private hysteresisHigh = 0.58;
  private springTension = 140;
  private springDamping = 19;
  private travelDistancePx = 88;

  // Interaction state
  private isDragging = false;
  private dragStartX = 0;
  private dragStartPosition = 0;
  private maxDragDeltaPx = 0;
  private lastDragTimestamp = 0;
  private lastDragPosition = 0;
  private lastDetentIndex = 0;

  // Animation loop state
  private rafId: number | null = null;
  private lastRafTime = 0;

  // Subsystems
  public readonly audio: HardwareAudioSynthesizer;
  private readonly haptics: HardwareHapticsDriver;

  // Callbacks
  private onPositionChange?: (position: number, themeMix: number, wheelOffsetPx: number) => void;
  private onModeChange?: (mode: ThemeMode) => void;
  private onSettled?: (mode: ThemeMode) => void;
  private onTick?: (direction: 1 | -1, speed: number) => void;

  constructor(config: WheelEngineConfig = {}) {
    this.detentSteps = config.detentSteps ?? 24;
    this.hysteresisLow = config.hysteresisLow ?? 0.42;
    this.hysteresisHigh = config.hysteresisHigh ?? 0.58;
    this.springTension = config.springTension ?? 140;
    this.springDamping = config.springDamping ?? 19;
    this.travelDistancePx = config.travelDistancePx ?? 88;

    this.onPositionChange = config.onPositionChange;
    this.onModeChange = config.onModeChange;
    this.onSettled = config.onSettled;
    this.onTick = config.onTick;

    const isMuted = config.soundEnabled === false;
    this.audio = new HardwareAudioSynthesizer(isMuted);
    this.haptics = new HardwareHapticsDriver();

    this.initInitialState();
  }

  private initInitialState(): void {
    if (typeof window === "undefined") return;

    let initialMode: ThemeMode = "light";
    try {
      const stored = localStorage.getItem("theme");
      if (stored === "dark" || stored === "light") {
        initialMode = stored;
      } else if (
        document.documentElement.classList.contains("dark") ||
        (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)
      ) {
        initialMode = "dark";
      }
    } catch {}

    this.currentMode = initialMode;
    this.position = initialMode === "dark" ? 1.0 : 0.0;
    this.targetPosition = this.position;
    this.lastDetentIndex = Math.floor(this.position * this.detentSteps);
    this.applyToDOM(this.position, false);
  }

  /**
   * Continuous Transfer Curve (Transfer Function)
   * - 0.00 .. 0.40: Light zone (0% -> 20% theme-mix)
   * - 0.40 .. 0.60: Smooth C1 Hermite S-curve across threshold (20% -> 80%)
   * - 0.60 .. 1.00: Dark zone (80% -> 100% theme-mix)
   */
  public transferCurve(pos: number): number {
    const x = Math.max(0, Math.min(1, pos));
    if (x <= 0.4) {
      return Number(((x / 0.4) * 20).toFixed(4));
    }
    if (x >= 0.6) {
      return Number((80 + ((x - 0.6) / 0.4) * 20).toFixed(4));
    }
    const t = (x - 0.4) / 0.2;
    const s = t * t * (3 - 2 * t);
    return Number((20 + s * 60).toFixed(4));
  }

  /**
   * Synchronously writes CSS custom properties to document.documentElement
   * with zero React state overhead.
   */
  public applyToDOM(pos: number, isInteractive = true): void {
    const clampedPos = Math.max(0, Math.min(1, pos));
    const themeMix = this.transferCurve(clampedPos);
    const offsetPx = clampedPos * this.travelDistancePx;

    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.style.setProperty("--theme-mix", `${themeMix.toFixed(2)}%`);
      root.style.setProperty("--wheel-pos", clampedPos.toFixed(4));
      root.style.setProperty("--wheel-offset", `${offsetPx.toFixed(2)}px`);
    }

    if (this.onPositionChange) {
      this.onPositionChange(clampedPos, themeMix, offsetPx);
    }

    // Schmitt trigger with hysteresis (58% Light->Dark, 42% Dark->Light)
    let nextMode = this.currentMode;
    if (this.currentMode === "light" && clampedPos >= this.hysteresisHigh) {
      nextMode = "dark";
    } else if (this.currentMode === "dark" && clampedPos <= this.hysteresisLow) {
      nextMode = "light";
    }

    if (nextMode !== this.currentMode) {
      this.currentMode = nextMode;
      const isDark = nextMode === "dark";

      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("dark", isDark);
        document.documentElement.style.colorScheme = nextMode;
      }

      if (isInteractive) {
        this.audio.playTick(2.5, true);
        this.haptics.vibrateThreshold();
      }

      if (this.onModeChange) {
        this.onModeChange(nextMode);
      }
    }

    // Detent Quantizer: emit ticks for every discrete step boundary crossed
    const currentDetent = Math.max(
      0,
      Math.min(this.detentSteps, Math.floor(clampedPos * this.detentSteps))
    );
    if (currentDetent !== this.lastDetentIndex) {
      const direction: 1 | -1 = currentDetent > this.lastDetentIndex ? 1 : -1;
      const now = typeof performance !== "undefined" ? performance.now() : Date.now();
      const dt = Math.max(1, now - this.lastDragTimestamp);
      const dx = Math.abs(clampedPos - this.lastDragPosition);
      const speed = (dx / dt) * 1000;

      if (isInteractive) {
        this.audio.playTick(speed, false);
        this.haptics.vibrateDetent();
      }

      if (this.onTick) {
        this.onTick(direction, speed);
      }

      this.lastDetentIndex = currentDetent;
      this.lastDragTimestamp = now;
      this.lastDragPosition = clampedPos;
    }
  }

  // ==========================================================================
  // POINTER & TOUCH GESTURE HANDLERS
  // ==========================================================================

  public onPointerDown(clientX: number): void {
    this.stopSpring();
    this.audio.ensureContext();

    this.isDragging = true;
    this.dragStartX = clientX;
    this.dragStartPosition = this.position;
    this.maxDragDeltaPx = 0;
    this.lastDragTimestamp = typeof performance !== "undefined" ? performance.now() : Date.now();
    this.lastDragPosition = this.position;

    if (typeof document !== "undefined") {
      document.documentElement.classList.add("is-theme-dragging");
    }
  }

  public onPointerMove(clientX: number, trackWidthPx?: number): void {
    if (!this.isDragging) return;

    const effectiveWidth = Math.max(48, (trackWidthPx ?? this.travelDistancePx) * 0.85);
    const deltaX = clientX - this.dragStartX;
    this.maxDragDeltaPx = Math.max(this.maxDragDeltaPx, Math.abs(deltaX));

    const deltaPos = deltaX / effectiveWidth;
    const newPos = Math.max(0, Math.min(1, this.dragStartPosition + deltaPos));

    this.position = newPos;
    this.applyToDOM(this.position, true);
  }

  public onPointerUp(): void {
    if (!this.isDragging) return;
    this.isDragging = false;

    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("is-theme-dragging");
    }

    // Distinguish single tap/click (< 5px pointer movement) from analog drag
    const isClick = this.maxDragDeltaPx < 5;

    if (isClick) {
      const targetMode: ThemeMode = this.currentMode === "dark" ? "light" : "dark";
      this.targetPosition = targetMode === "dark" ? 1.0 : 0.0;
      const dir = this.targetPosition > this.position ? 1 : -1;
      // Play initial engage click immediately
      this.audio.playTick(1.8, false);
      // Launch smooth motorized spin toward opposite stop
      this.velocity = dir * 2.4;
    } else {
      // Snap to whichever side the Schmitt trigger currently holds
      this.targetPosition = this.currentMode === "dark" ? 1.0 : 0.0;
      this.velocity = 0;
    }

    this.startSpring();
  }

  public onPointerCancel(): void {
    if (!this.isDragging) return;
    this.isDragging = false;
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("is-theme-dragging");
    }
    this.targetPosition = this.currentMode === "dark" ? 1.0 : 0.0;
    this.velocity = 0;
    this.startSpring();
  }

  // ==========================================================================
  // SPRING DAMPER SIMULATION (rAF with delta-time integration)
  // ==========================================================================

  private startSpring(): void {
    this.stopSpring();

    this.lastRafTime = typeof performance !== "undefined" ? performance.now() : Date.now();
    const reqAnim =
      typeof requestAnimationFrame !== "undefined"
        ? requestAnimationFrame
        : (cb: FrameRequestCallback) => setTimeout(() => cb(Date.now()), 16) as unknown as number;

    const loop = (now: number) => {
      const rawDt = (now - this.lastRafTime) / 1000;
      this.lastRafTime = now;
      // Clamp dt to 24ms max so tab switches never cause huge jumps
      const dt = Math.min(Math.max(rawDt, 0.001), 0.024);

      const displacement = this.position - this.targetPosition;
      const springForce = -this.springTension * displacement;
      const dampingForce = -this.springDamping * this.velocity;
      const acceleration = springForce + dampingForce;

      this.velocity += acceleration * dt;
      const nextPos = this.position + this.velocity * dt;

      // Hard mechanical end-stop at 0.0 and 1.0
      if (
        (this.targetPosition === 1 && nextPos >= 0.995) ||
        (this.targetPosition === 0 && nextPos <= 0.005) ||
        (Math.abs(nextPos - this.targetPosition) < 0.005 && Math.abs(this.velocity) < 0.05)
      ) {
        this.position = this.targetPosition;
        this.velocity = 0;
        this.applyToDOM(this.position, true);
        this.onSpringSettled();
        return;
      }

      this.position = Math.max(0, Math.min(1, nextPos));
      this.applyToDOM(this.position, true);

      this.rafId = reqAnim(loop);
    };

    this.rafId = reqAnim(loop);
  }

  private stopSpring(): void {
    if (this.rafId !== null) {
      if (typeof cancelAnimationFrame !== "undefined") {
        cancelAnimationFrame(this.rafId);
      } else {
        clearTimeout(this.rafId);
      }
      this.rafId = null;
    }
  }

  private onSpringSettled(): void {
    this.stopSpring();

    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("is-theme-dragging");
    }

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("theme", this.currentMode);
        window.dispatchEvent(new Event("theme-change"));
      } catch {}
    }

    if (this.onSettled) {
      this.onSettled(this.currentMode);
    }
  }

  // ==========================================================================
  // PROGRAMMATIC & KEYBOARD CONTROLS
  // ==========================================================================

  public setMode(mode: ThemeMode, animate = true): void {
    this.audio.ensureContext();
    this.targetPosition = mode === "dark" ? 1.0 : 0.0;

    if (animate && Math.abs(this.position - this.targetPosition) > 0.01) {
      const dir = this.targetPosition > this.position ? 1 : -1;
      this.audio.playTick(1.8, false);
      this.velocity = dir * 2.4;
      this.startSpring();
    } else {
      this.stopSpring();
      this.position = this.targetPosition;
      this.applyToDOM(this.position, false);
      this.onSpringSettled();
    }
  }

  public step(deltaFraction: number): void {
    this.audio.ensureContext();
    this.position = Math.max(0, Math.min(1, this.position + deltaFraction));
    this.targetPosition = this.position >= 0.5 ? 1.0 : 0.0;
    this.applyToDOM(this.position, true);
    this.startSpring();
  }

  public toggle(): void {
    this.setMode(this.currentMode === "dark" ? "light" : "dark", true);
  }

  public getPosition(): number {
    return this.position;
  }

  public getMode(): ThemeMode {
    return this.currentMode;
  }

  public dispose(): void {
    this.stopSpring();
    this.audio.dispose();
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("is-theme-dragging");
    }
  }
}
