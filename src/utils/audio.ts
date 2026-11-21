// Pure Web Audio API Synthesizer & Romantic Audio Engine
// Supports both synthesized romantic English love melodies and real audio playback!

export interface SongTrack {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  duration: number; // in seconds
  lyrics: { time: number; text: string }[];
  audioUrl?: string; // Optional real audio URL
}

export const romanticSongs: SongTrack[] = [
  {
    id: 'until-i-found-you',
    title: 'Until I Found You',
    artist: 'Stephen Sanchez',
    coverUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=400&q=80',
    duration: 178,
    lyrics: [
      { time: 0, text: 'Georgia, wrap me up in all your...' },
      { time: 6, text: 'I would never fall in love until I found her' },
      { time: 14, text: 'I said, "I would never fall unless it\'s you I fall into"' },
      { time: 23, text: 'I was lost within the darkness, but then I found her' },
      { time: 31, text: 'I found you... ✨' },
      { time: 40, text: 'Heaven when I held you again' },
      { time: 48, text: 'How could we ever just be friends?' },
      { time: 57, text: 'I would never fall in love until I found you 💖' },
    ],
  },
  {
    id: 'perfect',
    title: 'Perfect',
    artist: 'Ed Sheeran',
    coverUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=400&q=80',
    duration: 263,
    lyrics: [
      { time: 0, text: 'I found a love for me...' },
      { time: 7, text: 'Darling, just dive right in and follow my lead' },
      { time: 15, text: 'Well, I found a girl, beautiful and sweet' },
      { time: 23, text: 'Oh, I never knew you were the someone waiting for me' },
      { time: 32, text: '\'Cause we were just kids when we fell in love' },
      { time: 41, text: 'Not knowing what it was, I will not give you up this time' },
      { time: 51, text: 'Darling, you look perfect tonight 💕' },
    ],
  },
  {
    id: 'cant-help-falling-in-love',
    title: "Can't Help Falling in Love",
    artist: 'Elvis Presley / Acoustic',
    coverUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80',
    duration: 198,
    lyrics: [
      { time: 0, text: 'Wise men say...' },
      { time: 7, text: 'Only fools rush in' },
      { time: 16, text: 'But I can\'t help falling in love with you' },
      { time: 27, text: 'Shall I stay? Would it be a sin?' },
      { time: 40, text: 'If I can\'t help falling in love with you' },
      { time: 52, text: 'Like a river flows, surely to the sea' },
      { time: 64, text: 'Darling, so it goes, some things are meant to be 🌹' },
    ],
  },
  {
    id: 'golden-hour',
    title: 'Golden Hour',
    artist: 'JVKE',
    coverUrl: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=400&q=80',
    duration: 209,
    lyrics: [
      { time: 0, text: 'It was just two lovers, sittin\' in the car' },
      { time: 7, text: 'Listenin\' to Blonde, fallin\' for each other' },
      { time: 15, text: 'Pink and orange skies, feelin\' super enterprise' },
      { time: 24, text: 'Your eyes glitter in the daylight' },
      { time: 33, text: 'Glowin\' in the golden hour...' },
      { time: 44, text: 'You look like heaven right now ✨' },
    ],
  },
  {
    id: 'dandelions',
    title: 'Dandelions',
    artist: 'Ruth B.',
    coverUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    duration: 233,
    lyrics: [
      { time: 0, text: 'Maybe it\'s the way you say my name' },
      { time: 7, text: 'Maybe it\'s the way you play your game' },
      { time: 14, text: 'But it\'s so good, I\'ve never known anybody like you' },
      { time: 24, text: '\'Cause I\'m in a field of dandelions' },
      { time: 33, text: 'Wishin\' on every one that you\'d be mine, mine 🌼' },
      { time: 44, text: 'And I see forever in your eyes...' },
    ],
  },
];

class RomanticSoundEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timer: number | null = null;
  private masterGain: GainNode | null = null;
  private currentSongIndex = 0;
  private audioElement: HTMLAudioElement | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.22, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a single dreamy acoustic / music-box note
  playPluck(freq: number, time: number, duration: number = 2.2, volume: number = 0.25) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(freq * 2, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2600, time);
    filter.frequency.exponentialRampToValueAtTime(350, time + duration);

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

  playSparkle() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const pentatonic = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
      pentatonic.forEach((freq, idx) => {
        this.playPluck(freq, now + idx * 0.065, 0.8, 0.22);
      });
    } catch {
      // Ignored
    }
  }

  playChime() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      this.playPluck(587.33, now, 1.2, 0.2);
      this.playPluck(880.0, now + 0.1, 1.6, 0.25);
      this.playPluck(1174.66, now + 0.2, 2.0, 0.2);
    } catch {
      // Ignored
    }
  }

  // Play synthesized melody tailored to selected song style
  playSongMelody(songIndex: number) {
    this.initContext();
    if (!this.ctx) return;

    this.currentSongIndex = songIndex;
    this.stopSynthesizer();
    this.isPlaying = true;

    // Rich distinct chord progressions matching popular romantic English ballads:
    // 0: Until I Found You (C - Am - F - G7 - Em - Am)
    // 1: Perfect (Ab / G - Em - C - D)
    // 2: Can't Help Falling in Love (C - Em - Am - F - C - G)
    // 3: Golden Hour (Abmaj7 - Cm7 - Fm9 - Dbmaj7)
    // 4: Dandelions (F# - C# - D#m - B)
    const songProgressions: number[][][] = [
      // Until I Found You
      [
        [261.63, 329.63, 392.0, 523.25, 659.25, 523.25], // C
        [220.0, 261.63, 329.63, 440.0, 523.25, 440.0],   // Am
        [174.61, 220.0, 261.63, 349.23, 440.0, 349.23],  // F
        [196.0, 246.94, 293.66, 392.0, 493.88, 392.0],   // G
      ],
      // Perfect
      [
        [196.0, 246.94, 293.66, 392.0, 493.88, 392.0, 293.66, 246.94], // G
        [164.81, 196.0, 246.94, 329.63, 392.0, 329.63, 246.94, 196.0], // Em
        [130.81, 164.81, 196.0, 261.63, 329.63, 261.63, 196.0, 164.81], // C
        [146.83, 185.0, 220.0, 293.66, 369.99, 293.66, 220.0, 185.0],  // D
      ],
      // Can't Help Falling in Love
      [
        [261.63, 329.63, 392.0, 523.25], // C
        [164.81, 196.0, 246.94, 329.63], // Em
        [220.0, 261.63, 329.63, 440.0],  // Am
        [174.61, 220.0, 261.63, 349.23], // F
        [261.63, 329.63, 392.0, 523.25], // C
        [196.0, 246.94, 293.66, 392.0],  // G
      ],
      // Golden Hour
      [
        [207.65, 261.63, 311.13, 415.3, 523.25, 622.25, 523.25, 415.3],
        [174.61, 220.0, 261.63, 349.23, 440.0, 523.25, 440.0, 349.23],
        [138.59, 174.61, 207.65, 277.18, 349.23, 415.3, 349.23, 277.18],
        [155.56, 196.0, 233.08, 311.13, 392.0, 466.16, 392.0, 311.13],
      ],
      // Dandelions
      [
        [185.0, 233.08, 277.18, 369.99, 466.16, 369.99],
        [138.59, 174.61, 207.65, 277.18, 349.23, 277.18],
        [155.56, 185.0, 233.08, 311.13, 369.99, 311.13],
        [246.94, 311.13, 369.99, 493.88, 622.25, 493.88],
      ],
    ];

    const chords = songProgressions[songIndex % songProgressions.length];
    let chordIdx = 0;
    let stepIdx = 0;

    const step = () => {
      if (!this.isPlaying || !this.ctx) return;
      const currentChord = chords[chordIdx];
      const freq = currentChord[stepIdx];
      const now = this.ctx.currentTime;

      // Soft music box touch
      this.playPluck(freq, now, 1.9, 0.18);

      // Bass note on root
      if (stepIdx === 0) {
        this.playPluck(freq * 0.5, now, 2.6, 0.22);
      }

      stepIdx++;
      if (stepIdx >= currentChord.length) {
        stepIdx = 0;
        chordIdx = (chordIdx + 1) % chords.length;
      }

      const speedMs = songIndex === 3 ? 240 : 340;
      this.timer = window.setTimeout(step, speedMs);
    };

    step();
  }

  stopSynthesizer() {
    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
    this.isPlaying = false;
  }

  // Real Audio File Player (if user selects MP3 or custom URL)
  playAudioFile(url: string, onEnded?: () => void) {
    this.stopSynthesizer();
    if (!this.audioElement) {
      this.audioElement = new Audio();
    }
    this.audioElement.src = url;
    this.audioElement.play().catch(() => {});
    this.isPlaying = true;
    if (onEnded) {
      this.audioElement.onended = onEnded;
    }
  }

  pauseAudio() {
    this.stopSynthesizer();
    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.isPlaying = false;
  }

  resumeAudio() {
    if (this.audioElement && this.audioElement.src) {
      this.audioElement.play().catch(() => {});
      this.isPlaying = true;
    } else {
      this.playSongMelody(this.currentSongIndex);
    }
  }

  setVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(vol * 0.3, this.ctx.currentTime);
    }
    if (this.audioElement) {
      this.audioElement.volume = vol;
    }
  }

  toggleAmbientMusic(enable?: boolean): boolean {
    const shouldPlay = enable !== undefined ? enable : !this.isPlaying;
    if (shouldPlay) {
      this.playSongMelody(this.currentSongIndex);
      return true;
    } else {
      this.pauseAudio();
      return false;
    }
  }

  isMusicPlaying() {
    return this.isPlaying;
  }

  getCurrentSongIndex() {
    return this.currentSongIndex;
  }
}

export const soundEngine = new RomanticSoundEngine();
