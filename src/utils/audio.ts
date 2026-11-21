// Pure Web Audio API Synthesizer for Romantic Music Box & Sparkling Chimes
// Zero external asset dependencies - plays smoothly on any browser!

class RomanticSoundEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timer: number | null = null;
  private masterGain: GainNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a single dreamy music-box note
  playPluck(freq: number, time: number, duration: number = 2.2, volume: number = 0.25) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Warm music-box bell tone: Sine + Soft Triangle
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(freq * 2, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2400, time);
    filter.frequency.exponentialRampToValueAtTime(400, time + duration);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(volume, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(filter);
    subOsc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    subOsc.start(time);
    osc.stop(time + duration);
    subOsc.stop(time + duration);
  }

  // Trigger high magical sparkle sound when clicking 3D hearts or buttons
  playSparkle() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const pentatonic = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98]; // C5, E5, G5, C6, E6, G6
      pentatonic.forEach((freq, idx) => {
        this.playPluck(freq, now + idx * 0.065, 0.8, 0.2);
      });
    } catch {
      // Audio context might be restricted before interaction
    }
  }

  // Soft romantic pop/chime for love notes
  playChime() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      this.playPluck(587.33, now, 1.2, 0.2); // D5
      this.playPluck(880.0, now + 0.1, 1.6, 0.25); // A5
      this.playPluck(1174.66, now + 0.2, 2.0, 0.2); // D6
    } catch {
      // Ignore
    }
  }

  // Continuous dreamy ambient melody (Canon in D / Romantic Lofi Chord Progression)
  toggleAmbientMusic(enable?: boolean): boolean {
    this.initContext();
    if (!this.ctx) return false;

    const shouldPlay = enable !== undefined ? enable : !this.isPlaying;

    if (!shouldPlay) {
      if (this.timer) {
        window.clearTimeout(this.timer);
        this.timer = null;
      }
      this.isPlaying = false;
      return false;
    }

    this.isPlaying = true;

    // Romantic Chord progression: Cmaj7 -> Am9 -> Fmaj7 -> Gsus4 / Em7
    // Arpeggio notes (Frequencies in Hz)
    const progression: number[][] = [
      // Cmaj7 (C4, G4, B4, E5, G5)
      [261.63, 392.0, 493.88, 659.25, 783.99, 659.25, 493.88, 392.0],
      // Am9 (A3, E4, G4, C5, B5)
      [220.0, 329.63, 392.0, 523.25, 493.88, 392.0, 523.25, 329.63],
      // Fmaj7 (F3, C4, E4, A4, C5)
      [174.61, 261.63, 329.63, 440.0, 523.25, 440.0, 329.63, 261.63],
      // G7sus (G3, D4, F4, B4, D5)
      [196.0, 293.66, 349.23, 493.88, 587.33, 493.88, 349.23, 293.66],
      // Em7 (E3, B3, D4, G4, B4)
      [164.81, 246.94, 293.66, 392.0, 493.88, 392.0, 293.66, 246.94],
      // Fmaj9
      [174.61, 261.63, 329.63, 440.0, 659.25, 523.25, 440.0, 329.63],
    ];

    let chordIndex = 0;
    let stepIndex = 0;

    const playStep = () => {
      if (!this.isPlaying || !this.ctx) return;

      const currentChord = progression[chordIndex];
      const noteFreq = currentChord[stepIndex];
      const now = this.ctx.currentTime;

      // Soft music box touch
      this.playPluck(noteFreq, now, 1.8, 0.16);

      // Add gentle bass octave on 1st beat
      if (stepIndex === 0) {
        this.playPluck(noteFreq * 0.5, now, 2.5, 0.22);
      }

      stepIndex++;
      if (stepIndex >= currentChord.length) {
        stepIndex = 0;
        chordIndex = (chordIndex + 1) % progression.length;
      }

      // 360ms per note (~83 BPM arpeggiator)
      this.timer = window.setTimeout(playStep, 360);
    };

    playStep();
    return true;
  }

  isMusicPlaying() {
    return this.isPlaying;
  }
}

export const soundEngine = new RomanticSoundEngine();
