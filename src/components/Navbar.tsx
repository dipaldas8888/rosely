import React from 'react';
import { Heart, Sparkles, Settings } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';

interface NavbarProps {
  recipientName: string;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  onOpenCustomizer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  recipientName,
  isMusicPlaying,
  onToggleMusic,
  onOpenCustomizer,
}) => {
  const triggerConfetti = () => {
    soundEngine.playSparkle();
    confetti({
      particleCount: 70,
      spread: 90,
      origin: { y: 0.1, x: 0.8 },
      colors: ['#ff1e56', '#ffd166', '#f72585', '#ffffff'],
    });
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#090514]/75 border-b border-rose-500/20 px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Brand / Title */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-500 to-amber-400 p-0.5 shadow-lg shadow-rose-950 flex items-center justify-center">
            <Heart className="w-5 h-5 text-white fill-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-serif font-bold text-rose-100 leading-tight">
              A Special Universe
            </h1>
            <p className="text-[11px] text-rose-300/70 font-medium">
              Dedicated to <span className="text-rose-200 font-semibold">{recipientName}</span> ✨
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Ambient Music Player Toggle */}
          <button
            onClick={onToggleMusic}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl border text-xs font-semibold flex items-center gap-2 transition-all duration-300 shadow-md ${
              isMusicPlaying
                ? 'bg-rose-500/25 border-rose-400/60 text-rose-100 shadow-rose-900/40 ring-2 ring-rose-500/30'
                : 'bg-black/30 border-rose-500/20 text-rose-300/80 hover:text-white hover:bg-white/5'
            }`}
            title={isMusicPlaying ? 'Pause Melody' : 'Play Romantic Music Box'}
          >
            {/* Spinning vinyl disc icon */}
            <div
              className={`w-4 h-4 rounded-full border border-rose-300/60 flex items-center justify-center transition-transform ${
                isMusicPlaying ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '4s' }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            </div>

            <span className="hidden sm:inline">
              {isMusicPlaying ? 'Melody Playing' : 'Music Box'}
            </span>
          </button>

          {/* Quick Confetti Burst */}
          <button
            onClick={triggerConfetti}
            className="p-2 sm:px-3 sm:py-2 rounded-2xl bg-gradient-to-r from-rose-600/80 to-pink-600/80 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-semibold border border-rose-400/30 shadow-md transition hover:scale-105 active:scale-95 flex items-center gap-1.5"
            title="Shower with Love"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="hidden md:inline">Shower Love</span>
          </button>

          {/* Settings / Personalize Modal trigger */}
          <button
            onClick={onOpenCustomizer}
            className="p-2 rounded-2xl bg-black/30 hover:bg-white/10 border border-rose-500/20 text-rose-300 hover:text-white transition"
            title="Personalize Names & Letter"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
