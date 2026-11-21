import React, { useState } from 'react';
import { Sparkles, Heart, Gift, MessageCircleHeart } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';

interface LoveJarProps {
  recipientName: string;
}

const loveReasons = [
  "The adorable way you get excited over the smallest little things.",
  "How safe and completely peaceful I feel whenever I am with you.",
  "Your beautiful laugh that can instantly turn around my darkest day.",
  "The kindness and pure empathy you show to everyone around you.",
  "How gorgeous you look first thing in the morning with messy hair.",
  "The fact that you are not only the love of my life, but my best friend.",
  "The little hugs and cute touches when you think nobody is watching.",
  "How passionately you speak about things you truly care about.",
  "The cute little voice you use when you want something.",
  "The way you remember tiny details about me that I didn't even notice.",
  "Your brilliant intelligence and your sharp, witty sense of humor.",
  "How your hand feels so perfectly made to fit into mine.",
  "The way you make even grocery shopping feel like a fun romantic date.",
  "Your warmth, your heart of pure gold, and your gentle soul.",
  "How proud I feel whenever I tell someone that you are mine.",
  "The way you look at me across a crowded room and make my heart skip.",
  "Your resilience, courage, and how you inspire me to be a better person.",
  "Every single sweet text message you send that makes me smile like an idiot.",
  "The comfort of resting my head on your chest and hearing your heartbeat.",
  "Because loving you is the easiest, most natural thing I have ever done."
];

export const LoveJar: React.FC<LoveJarProps> = ({ recipientName }) => {
  const [currentNote, setCurrentNote] = useState<string | null>(null);
  const [openedCount, setOpenedCount] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);

  const drawNote = () => {
    if (isDrawing) return;
    setIsDrawing(true);
    soundEngine.playChime();

    // Pick random reason
    const randomReason = loveReasons[Math.floor(Math.random() * loveReasons.length)];

    setTimeout(() => {
      setCurrentNote(randomReason);
      setOpenedCount((c) => c + 1);
      setIsDrawing(false);
      soundEngine.playSparkle();

      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#ff4d6d', '#ff758f', '#ffb3c1', '#ffd166'],
      });
    }, 450);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-12 p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-[#1b0825] via-[#100318] to-[#0a0210] border border-rose-500/30 shadow-2xl relative overflow-hidden text-center">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-rose-500/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium uppercase tracking-wider">
        <Gift className="w-3.5 h-3.5 text-rose-400" />
        Infinite Compliments Capsule
      </span>

      <h2 className="mt-3 text-3xl sm:text-4xl font-serif font-bold text-rose-100">
        The Jar of Love Notes for {recipientName}
      </h2>
      <p className="text-xs sm:text-sm text-rose-300/70 mt-1 max-w-md mx-auto">
        Whenever you need a reminder of how cherished and loved you are, draw a note from this magical bottle.
      </p>

      {/* 3D Glass Jar Graphic Representation */}
      <div className="relative my-8 flex flex-col items-center justify-center">
        {/* The 3D Glowing Glass Jar Container */}
        <div
          onClick={drawNote}
          className={`relative w-44 h-60 sm:w-52 sm:h-68 rounded-b-[4rem] rounded-t-2xl bg-gradient-to-b from-white/10 via-rose-500/10 to-rose-600/20 backdrop-blur-md border-2 border-white/30 shadow-[0_0_50px_rgba(244,63,94,0.3)] cursor-pointer transition-all duration-300 group hover:scale-105 ${
            isDrawing ? 'animate-bounce' : ''
          }`}
        >
          {/* Jar cork / wooden lid with cute ribbon */}
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-28 sm:w-32 h-6 rounded-t-lg bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 border border-amber-500/40 shadow-md">
            {/* Red bow ribbon tie */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-1 w-12 h-3 bg-rose-600 rounded-full flex items-center justify-center">
              <Heart className="w-2.5 h-2.5 text-white fill-white" />
            </div>
          </div>

          {/* Glass specular reflection highlights */}
          <div className="absolute top-4 left-3 w-3 h-48 rounded-full bg-white/25 blur-[1px] pointer-events-none" />
          <div className="absolute top-8 right-3 w-1.5 h-36 rounded-full bg-white/15 blur-[1px] pointer-events-none" />

          {/* Floating glowing folded origami stars inside jar */}
          <div className="absolute inset-x-4 bottom-4 top-10 flex flex-wrap gap-2 items-center justify-center p-2 overflow-hidden pointer-events-none">
            {[...Array(14)].map((_, i) => (
              <span
                key={i}
                className="inline-block transform animate-pulse transition-all duration-700"
                style={{
                  fontSize: `${12 + (i % 6) * 3}px`,
                  animationDelay: `${(i * 0.2).toFixed(1)}s`,
                  transform: `rotate(${(i * 37) % 360}deg)`,
                }}
              >
                {i % 3 === 0 ? '✨' : i % 2 === 0 ? '💖' : '⭐'}
              </span>
            ))}
          </div>

          {/* Click me badge on jar */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-max px-3 py-1 rounded-full bg-black/60 border border-rose-400/40 text-[10px] sm:text-xs font-semibold text-rose-200 backdrop-blur-md group-hover:bg-rose-600 group-hover:text-white transition">
            Tap Jar to Draw 💌
          </div>
        </div>

        {/* Drawn Note Card Display */}
        {currentNote && (
          <div className="mt-6 w-full max-w-lg p-6 rounded-2xl bg-gradient-to-r from-rose-950/80 via-[#270822] to-rose-950/80 border border-rose-400/40 shadow-2xl animate-fade-in relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-rose-600 text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 shadow">
              <MessageCircleHeart className="w-3 h-3" />
              Reason #{openedCount}
            </div>

            <p className="mt-2 text-base sm:text-lg font-serif italic text-rose-100 leading-relaxed">
              "{currentNote}"
            </p>

            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                onClick={drawNote}
                className="px-4 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Draw Another Reason
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-rose-300/60 font-light">
        Notes opened today: <span className="font-semibold text-rose-300">{openedCount}</span>
      </p>
    </div>
  );
};
