/**
 * Pure, framework-agnostic typewriter animation engine.
 * Computes durations and visible character counts with zero external dependencies
 * so that it can run directly in Node test environments and browser rAF loops.
 */

export function computeDuration(
  charCount: number,
  msPerChar = 12,
  minMs = 400,
  maxMs = 800
): number {
  if (charCount <= 0) return 0;
  return Math.min(maxMs, Math.max(minMs, charCount * msPerChar));
}

export function computeVisibleChars(
  totalChars: number,
  elapsedMs: number,
  durationMs: number
): number {
  if (totalChars <= 0) return 0;
  if (durationMs <= 0 || elapsedMs >= durationMs) return totalChars;
  if (elapsedMs <= 0) return 0;
  return Math.min(totalChars, Math.ceil(totalChars * (elapsedMs / durationMs)));
}

export interface TypewriterEngineOptions {
  text: string;
  delayMs?: number;
  msPerChar?: number;
  minDurationMs?: number;
  maxDurationMs?: number;
  onFrame: (slice: string, progress: number) => void;
  onDone: () => void;
  now?: () => number;
  raf?: (cb: (t: number) => void) => number;
  caf?: (id: number) => void;
}

export class TypewriterEngine {
  private readonly text: string;
  private readonly delayMs: number;
  private readonly durationMs: number;
  private readonly onFrame: (slice: string, progress: number) => void;
  private readonly onDone: () => void;
  private readonly now: () => number;
  private readonly raf: (cb: (t: number) => void) => number;
  private readonly caf: (id: number) => void;

  private startTime: number | null = null;
  private rafId: number | null = null;
  private lastCharsEmitted = -1;
  private finished = false;
  private destroyed = false;

  constructor(options: TypewriterEngineOptions) {
    this.text = options.text;
    this.delayMs = Math.max(0, options.delayMs ?? 0);
    this.durationMs = computeDuration(
      this.text.length,
      options.msPerChar ?? 12,
      options.minDurationMs ?? 400,
      options.maxDurationMs ?? 800
    );
    this.onFrame = options.onFrame;
    this.onDone = options.onDone;
    this.now =
      options.now ??
      (() =>
        typeof performance !== "undefined" ? performance.now() : Date.now());
    this.raf =
      options.raf ??
      ((cb) =>
        typeof requestAnimationFrame !== "undefined"
          ? requestAnimationFrame(cb)
          : (setTimeout(() => cb(this.now()), 16) as unknown as number));
    this.caf =
      options.caf ??
      ((id) =>
        typeof cancelAnimationFrame !== "undefined"
          ? cancelAnimationFrame(id)
          : clearTimeout(id));
  }

  public isRunning(): boolean {
    return !this.finished && !this.destroyed && this.startTime !== null;
  }

  public start(): void {
    if (this.finished || this.destroyed) return;

    if (this.text.length === 0) {
      this.finished = true;
      this.onFrame("", 1);
      this.onDone();
      return;
    }

    const baseTime = this.now();
    this.startTime = baseTime + this.delayMs;

    const tick = (currentTime: number) => {
      if (this.destroyed || this.finished) return;

      if (currentTime < (this.startTime ?? 0)) {
        if (this.lastCharsEmitted !== 0) {
          this.lastCharsEmitted = 0;
          this.onFrame("", 0);
        }
        this.rafId = this.raf(tick);
        return;
      }

      const elapsed = currentTime - (this.startTime ?? 0);
      const chars = computeVisibleChars(
        this.text.length,
        elapsed,
        this.durationMs
      );

      if (chars !== this.lastCharsEmitted) {
        this.lastCharsEmitted = chars;
        const progress = Math.min(1, elapsed / this.durationMs);
        this.onFrame(this.text.slice(0, chars), progress);
      }

      if (chars >= this.text.length || elapsed >= this.durationMs) {
        this.finished = true;
        this.onDone();
        return;
      }

      this.rafId = this.raf(tick);
    };

    this.rafId = this.raf(tick);
  }

  public finish(): void {
    if (this.destroyed || this.finished) return;
    this.cancelPending();
    this.finished = true;
    this.lastCharsEmitted = this.text.length;
    this.onFrame(this.text, 1);
    this.onDone();
  }

  public destroy(): void {
    this.cancelPending();
    this.destroyed = true;
  }

  private cancelPending(): void {
    if (this.rafId !== null) {
      this.caf(this.rafId);
      this.rafId = null;
    }
  }
}
