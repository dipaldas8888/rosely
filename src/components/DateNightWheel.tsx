import React, { useState } from 'react';
import { Compass, Sparkles, Heart, CheckCircle2, PartyPopper } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';

const dateIdeas = [
  'Candlelight Dinner & Making Pasta Together 🍝',
  'Midnight Stargazing with Hot Cocoa ☕✨',
  'Cozy Movie Marathon in a Blanket Fort 🎬🍿',
  'Sunset Picnic at the Scenic Park 🍓🧺',
  'Baking Strawberry Cupcakes from Scratch 🧁',
  'Late Night Car Ride with Our Favorite Songs 🚗🎶',
  'Arcade Games, Photobooth & Ice Cream 🍦👾',
  'Spa & Massage Pamper Night at Home 💆‍♀️🕯️',
];

export const DateNightWheel: React.FC<{ recipientName: string }> = ({ recipientName }) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  // Playful Date Proposal
  const [noButtonPos, setNoButtonPos] = useState<{ x: number; y: number } | null>(null);
  const [hasSaidYes, setHasSaidYes] = useState(false);

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    soundEngine.playChime();

    // Random rotations + target slice
    const randomExtraDegrees = Math.floor(Math.random() * 360) + 1440; // 4+ full rotations
    const newTotalRotation = rotation + randomExtraDegrees;
    setRotation(newTotalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      // Determine slice
      const actualDegrees = (newTotalRotation % 360);
      const sliceSize = 360 / dateIdeas.length;
      // Invert for pointer at top (270 deg)
      const index = Math.floor(((360 - (actualDegrees % 360)) % 360) / sliceSize);
      const picked = dateIdeas[index % dateIdeas.length];
      setSelectedDate(picked);

      soundEngine.playSparkle();
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ff4d6d', '#ffd166', '#a2d2ff', '#b5179e'],
      });
    }, 3200);
  };

  const handleNoHover = () => {
    // Evasive button jumps to a random spot within container
    const randomX = (Math.random() - 0.5) * 260;
    const randomY = (Math.random() - 0.5) * 160;
    setNoButtonPos({ x: randomX, y: randomY });
    soundEngine.playChime();
  };

  const handleYesClick = () => {
    setHasSaidYes(true);
    soundEngine.playSparkle();
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#f43f5e', '#ec4899', '#ffd166', '#ffffff'],
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* 1. Date Night Spinner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#190623] to-[#0e0214] border border-rose-500/30 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium">
          <Compass className="w-3.5 h-3.5 text-rose-400" />
          Adventure Generator
        </span>
        <h3 className="mt-2 text-2xl sm:text-3xl font-serif font-bold text-rose-100">
          Our Next Date Night Wheel
        </h3>
        <p className="text-xs text-rose-300/70 mt-1 mb-6">
          Can't decide what to do? Let destiny choose our next romantic adventure!
        </p>

        {/* Spinner Graphic */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center my-2">
          {/* Wheel pointer at top */}
          <div className="absolute -top-3 z-20 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.8)]" />

          {/* The Spinning Wheel */}
          <div
            className="w-full h-full rounded-full border-4 border-amber-300/40 shadow-[0_0_40px_rgba(244,63,94,0.3)] relative overflow-hidden transition-transform ease-out"
            style={{
              transform: `rotate(${rotation}deg)`,
              transitionDuration: isSpinning ? '3.2s' : '0s',
              background: 'conic-gradient(#3d0c2c 0deg 45deg, #220619 45deg 90deg, #4c0f38 90deg 135deg, #2b0720 135deg 180deg, #3d0c2c 180deg 225deg, #220619 225deg 270deg, #4c0f38 270deg 315deg, #2b0720 315deg 360deg)',
            }}
          >
            {/* Slices icons & markers */}
            {dateIdeas.map((_, i) => (
              <div
                key={i}
                className="absolute inset-0 flex items-start justify-center pt-2 text-xs font-bold text-rose-200 pointer-events-none"
                style={{
                  transform: `rotate(${i * 45 + 22.5}deg)`,
                  transformOrigin: '50% 50%',
                }}
              >
                <span>{['🍝', '✨', '🎬', '🍓', '🧁', '🚗', '🍦', '💆‍♀️'][i]}</span>
              </div>
            ))}
          </div>

          {/* Center Spin Button */}
          <button
            onClick={spinWheel}
            disabled={isSpinning}
            className="absolute z-10 w-16 h-16 rounded-full bg-gradient-to-tr from-rose-600 via-pink-500 to-rose-400 border-2 border-amber-300 shadow-xl flex items-center justify-center font-bold text-xs text-white uppercase tracking-wider hover:scale-110 active:scale-95 transition-all disabled:opacity-80 disabled:scale-100"
          >
            {isSpinning ? '...' : 'SPIN'}
          </button>
        </div>

        {/* Result alert */}
        {selectedDate && (
          <div className="mt-6 w-full p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-100 text-xs sm:text-sm font-medium animate-fade-in flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300 flex-shrink-0" />
            <span>It's a date: <strong className="text-white">{selectedDate}</strong></span>
          </div>
        )}
      </div>

      {/* 2. Playful Date Proposal / Love Contract */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#1e0728] to-[#12031a] border border-rose-500/30 shadow-2xl flex flex-col justify-between relative overflow-hidden">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            A Serious Inquiry
          </span>
          <h3 className="mt-3 text-2xl sm:text-3xl font-serif font-bold text-rose-100">
            Will You Go On A Date With Me, {recipientName}?
          </h3>
          <p className="text-xs text-rose-300/70 mt-1 max-w-sm mx-auto">
            (Read carefully: terms include unlimited cuddles, yummy food, and free backrubs forever).
          </p>
        </div>

        {hasSaidYes ? (
          <div className="my-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-rose-950/60 border border-emerald-400/40 text-center animate-fade-in">
            <PartyPopper className="w-12 h-12 text-emerald-400 mx-auto mb-2 animate-bounce" />
            <h4 className="text-xl font-serif font-bold text-emerald-200">
              YAY! SHE SAID YES! 🥰💖
            </h4>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
              Official date contract signed and sealed! Get ready for the best time ever.
            </p>
          </div>
        ) : (
          <div className="relative min-h-[160px] flex items-center justify-center gap-6 my-6">
            {/* YES button */}
            <button
              onClick={handleYesClick}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-500 hover:from-rose-500 hover:to-pink-400 text-white font-bold text-base shadow-xl shadow-rose-900/50 transition-all hover:scale-110 active:scale-95 flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5 text-amber-200" />
              <span>YES, Absolutely! ❤️</span>
            </button>

            {/* Playful Evasive NO button */}
            <button
              onMouseEnter={handleNoHover}
              onTouchStart={handleNoHover}
              onClick={handleNoHover}
              style={
                noButtonPos
                  ? {
                      transform: `translate(${noButtonPos.x}px, ${noButtonPos.y}px)`,
                      transition: 'transform 0.15s ease-out',
                    }
                  : undefined
              }
              className="px-6 py-3.5 rounded-2xl bg-stone-800/80 hover:bg-stone-700/80 text-stone-300 text-xs sm:text-sm font-medium border border-stone-600 transition select-none"
            >
              No, I'm busy 😜
            </button>
          </div>
        )}

        <div className="text-center pt-4 border-t border-rose-500/20 text-xs text-rose-300/60">
          Tip: You cannot click 'No'. My heart simply won't allow it! 😉
        </div>
      </div>
    </div>
  );
};
