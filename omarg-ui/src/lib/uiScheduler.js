export class RitualScheduler {
  constructor(beatMap, onSection) {
    this.map = beatMap;
    this.onSection = onSection;
    this.idx = 0;
    this.audioCtx = null;
    this.startTime = 0;
    this.running = false;
    this._tick = this._tick.bind(this);
  }

  /** Starts the scheduler using audioCtx.currentTime as sole clock source */
  start(audioCtx) {
    this.audioCtx = audioCtx;
    this.startTime = audioCtx.currentTime; // seconds
    this.idx = 0;
    this.running = true;
    requestAnimationFrame(this._tick);
  }

  stop() {
    this.running = false;
  }

  _tick() {
    if (!this.running || !this.audioCtx) return;

    const elapsed = this.audioCtx.currentTime - this.startTime; // seconds
    const sec = this.map.sections[this.idx];

    if (sec && elapsed >= sec.start) {
      this.onSection(sec);
      this.idx++;
    }

    if (this.idx < this.map.sections.length) {
      requestAnimationFrame(this._tick);
    }
  }
}
