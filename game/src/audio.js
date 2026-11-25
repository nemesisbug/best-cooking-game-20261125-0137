// Ember & Oak — sound: tiny WebAudio synth blips, no audio files.
// Everything is generated, so the game loads nothing over the network.

export class SoundBank {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  blip(freq, dur, type = 'sine', vol = 0.12, slideTo = null) {
    if (this.muted || !this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slideTo !== null) osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t + dur);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  chop() { this.blip(180, 0.09, 'triangle', 0.2, 70); }
  pickup() { this.blip(520, 0.07, 'sine', 0.1, 760); }
  place() { this.blip(300, 0.08, 'sine', 0.12, 210); }
  sizzle() { this.blip(900, 0.12, 'sawtooth', 0.05, 1400); }
  bellows() { this.blip(140, 0.25, 'sawtooth', 0.08, 320); }
  error() { this.blip(160, 0.22, 'square', 0.1, 110); }
  tick() { this.blip(980, 0.05, 'sine', 0.06); }

  serve() {
    this.blip(660, 0.12, 'sine', 0.14);
    setTimeout(() => this.blip(880, 0.18, 'sine', 0.14), 90);
    setTimeout(() => this.blip(1320, 0.22, 'sine', 0.1), 190);
  }

  orderIn() {
    this.blip(440, 0.1, 'triangle', 0.1);
    setTimeout(() => this.blip(587, 0.14, 'triangle', 0.1), 110);
  }

  rush() {
    this.blip(392, 0.14, 'square', 0.08);
    setTimeout(() => this.blip(523, 0.14, 'square', 0.08), 140);
    setTimeout(() => this.blip(659, 0.2, 'square', 0.08), 280);
  }
}
