import React, { useState } from 'react';
import { Mail, Heart, Sparkles, Edit3, Check, RotateCcw } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';

interface LoveLetter3DProps {
  recipientName: string;
  senderName: string;
  defaultText?: string;
  onSaveText?: (newText: string) => void;
}

export const LoveLetter3D: React.FC<LoveLetter3DProps> = ({
  recipientName,
  senderName,
  defaultText,
  onSaveText,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [letterContent, setLetterContent] = useState(
    defaultText ||
      `From the very first moment you walked into my life, everything became so much brighter and softer.\n\nYour laughter is my favorite sound in the world, your kindness inspires me every single day, and the way your eyes crinkle when you smile is something I wouldn't trade for anything in this universe.\n\nThank you for being my best friend, my safe haven, and my favorite adventure. No matter where life takes us, I promise to always cheer for you, hold your hand, and love you more than yesterday.`
  );

  const toggleOpen = () => {
    if (!isOpen) {
      soundEngine.playChime();
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#fb7185', '#ffe4e6', '#f59e0b'],
      });
    }
    setIsOpen(!isOpen);
  };

  const handleSave = () => {
    setIsEditing(false);
    if (onSaveText) onSaveText(letterContent);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-10 px-4">
      {/* Header Prompt */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium uppercase tracking-wider">
          <Mail className="w-3.5 h-3.5 text-rose-400" />
          Handwritten with Care
        </span>
        <h2 className="mt-3 text-3xl sm:text-4xl font-serif font-bold text-rose-100">
          A Letter For {recipientName}
        </h2>
        <p className="text-rose-300/70 text-sm mt-1 max-w-md mx-auto">
          {isOpen ? 'Tap the letter to close it back safely.' : 'Click the wax seal to unfold this 3D letter.'}
        </p>
      </div>

      {/* 3D Envelope Container with CSS 3D perspective */}
      <div className="relative w-full max-w-lg min-h-[460px] flex items-center justify-center perspective-[1200px]">
        {/* The 3D Envelope Frame */}
        <div
          onClick={!isEditing ? toggleOpen : undefined}
          className={`relative w-80 sm:w-96 h-56 rounded-2xl cursor-pointer transition-all duration-700 ease-out preserve-3d shadow-2xl ${
            isOpen ? 'translate-y-40 sm:translate-y-48 scale-95' : 'hover:scale-105 hover:-translate-y-1'
          }`}
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Back pocket of the envelope */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-rose-950 via-[#2a0818] to-[#1a0510] border border-rose-500/30 shadow-2xl shadow-rose-950/70" />

          {/* Golden envelope trims */}
          <div className="absolute inset-1.5 rounded-xl border border-dashed border-rose-400/20 pointer-events-none" />

          {/* Letter parchment paper that slides out in 3D */}
          <div
            onClick={(e) => {
              if (isOpen) e.stopPropagation();
            }}
            className={`absolute left-4 right-4 sm:left-6 sm:right-6 rounded-xl bg-[#fffaf5] text-stone-800 p-6 sm:p-7 shadow-2xl transition-all duration-700 ease-out border border-amber-200/80 cursor-default ${
              isOpen
                ? 'opacity-100 -translate-y-56 sm:-translate-y-64 scale-100 z-30 pointer-events-auto'
                : 'opacity-0 translate-y-0 scale-90 z-0 pointer-events-none'
            }`}
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 40px rgba(244, 63, 94, 0.15)',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Subtle vintage paper texture styling */}
            <div className="absolute top-3 right-4 flex items-center gap-1.5 text-xs text-rose-500/60 font-serif italic">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Forever & Always</span>
            </div>

            <div className="text-left font-serif">
              <h3 className="text-xl sm:text-2xl font-bold text-rose-900 border-b border-rose-200/60 pb-2">
                Dearest {recipientName},
              </h3>

              {isEditing ? (
                <div className="mt-3">
                  <textarea
                    value={letterContent}
                    onChange={(e) => setLetterContent(e.target.value)}
                    rows={8}
                    className="w-full text-xs sm:text-sm p-3 rounded-lg border border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-stone-800 bg-amber-50/50 resize-none font-sans"
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={handleSave}
                      className="px-3 py-1.5 rounded-md bg-rose-600 text-white text-xs font-semibold flex items-center gap-1 hover:bg-rose-700 transition"
                    >
                      <Check className="w-3.5 h-3.5" /> Save Note
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-3 text-xs sm:text-sm text-stone-700 leading-relaxed font-sans whitespace-pre-line max-h-60 overflow-y-auto pr-1">
                  {letterContent}
                </div>
              )}

              <div className="mt-5 pt-3 border-t border-rose-200/60 flex items-center justify-between">
                <div>
                  <p className="text-xs text-stone-500">With all my love,</p>
                  <p className="text-sm sm:text-base font-bold text-rose-900 font-serif italic">
                    {senderName || 'Your Favorite Person'} ❤️
                  </p>
                </div>

                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition text-xs flex items-center gap-1"
                    title="Edit message"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span className="text-[10px] sm:text-xs">Personalize</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Envelope Front Left & Right flaps (3D folded visual) */}
          <div className="absolute inset-0 pointer-events-none z-20">
            {/* Left triangle */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: 'polygon(0 0, 0 100%, 50% 55%)',
                background: 'linear-gradient(135deg, #3d0c24 0%, #220514 100%)',
              }}
            />
            {/* Right triangle */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: 'polygon(100% 0, 100% 100%, 50% 55%)',
                background: 'linear-gradient(225deg, #3a0b22 0%, #1c0310 100%)',
              }}
            />
            {/* Bottom triangle */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: 'polygon(0 100%, 100% 100%, 50% 55%)',
                background: 'linear-gradient(0deg, #4c0f2e 0%, #280717 100%)',
                borderBottom: '1px solid rgba(244, 63, 94, 0.4)',
              }}
            />
          </div>

          {/* Envelope Top Flap with 3D Rotate Animation */}
          <div
            className={`absolute top-0 inset-x-0 h-28 origin-top transition-transform duration-700 ease-in-out pointer-events-none z-30 ${
              isOpen ? '-rotate-x-180 z-0' : 'rotate-x-0'
            }`}
            style={{
              transformOrigin: 'top',
              transformStyle: 'preserve-3d',
            }}
          >
            <div
              className="w-full h-full shadow-lg"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                background: 'linear-gradient(180deg, #5c1439 0%, #3a0b22 100%)',
                borderTop: '1px solid rgba(244, 63, 94, 0.4)',
              }}
            />
          </div>

          {/* Golden Wax Seal with Heart Logo */}
          <div
            className={`absolute top-24 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 transition-all duration-500 flex flex-col items-center ${
              isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100 hover:scale-110'
            }`}
          >
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-rose-700 via-red-600 to-rose-500 p-0.5 shadow-xl shadow-rose-950 flex items-center justify-center border-2 border-amber-300/60 ring-4 ring-rose-900/50">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-amber-200 fill-amber-200 drop-shadow" />
              <div className="absolute inset-0 rounded-full border border-amber-300/40 animate-ping opacity-25" />
            </div>
            <span className="mt-2 text-[11px] font-semibold tracking-wider text-rose-300/90 uppercase drop-shadow bg-black/40 px-2 py-0.5 rounded-full border border-rose-500/20">
              Open Me
            </span>
          </div>
        </div>
      </div>

      {/* Helper trigger when open */}
      {isOpen && (
        <button
          onClick={toggleOpen}
          className="mt-6 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Fold letter back into envelope</span>
        </button>
      )}
    </div>
  );
};
