import React, { useState } from 'react';
import { Ticket, Sparkles, Check, Heart } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';

interface LoveCoupon {
  id: string;
  title: string;
  emoji: string;
  benefit: string;
  terms: string;
  color: string;
}

const defaultCoupons: LoveCoupon[] = [
  {
    id: 'c1',
    title: 'Movie Night & Blanket Fort',
    emoji: '🎬🍿',
    benefit: 'You pick the movie, unlimited snacks, and zero complaints from me!',
    terms: 'Valid on any evening. Popcorn refills strictly mandatory.',
    color: 'from-pink-950 to-rose-900',
  },
  {
    id: 'c2',
    title: 'Breakfast in Bed & Coffee',
    emoji: '🥞☕',
    benefit: 'Warm pancakes/waffles, fresh strawberries, and your favorite hot drink.',
    terms: 'Valid on any weekend morning. You don\'t even have to leave bed.',
    color: 'from-amber-950 to-rose-950',
  },
  {
    id: 'c3',
    title: 'One Free Wildcard Wish',
    emoji: '✨👑',
    benefit: 'Ask for literally anything you want, and I will happily make it happen!',
    terms: 'No expiration date. Redeemable anytime without questions asked.',
    color: 'from-purple-950 to-rose-950',
  },
  {
    id: 'c4',
    title: 'Late Night Drive & Ice Cream',
    emoji: '🚗🍦',
    benefit: 'Window down, our favorite music blasting, and two scoops of your favorite flavor.',
    terms: 'Night owl approved. We stay out as long as you want.',
    color: 'from-indigo-950 to-pink-950',
  },
  {
    id: 'c5',
    title: 'Relaxing Massage & Spa Night',
    emoji: '💆‍♀️🕯️',
    benefit: 'Scented candles, relaxing music, and a full stress-relief back and shoulder rub.',
    terms: 'Minimum 30 minutes. Guaranteed to melt all your stress away.',
    color: 'from-rose-950 to-fuchsia-950',
  },
  {
    id: 'c6',
    title: 'You Call All The Shots Day',
    emoji: '💖🥂',
    benefit: 'For one entire day, you decide where we go, what we eat, and what we do!',
    terms: 'My only answer today will be "Yes, my love!"',
    color: 'from-rose-900 to-amber-950',
  },
];

export const LoveCoupons3D: React.FC<{ recipientName: string }> = ({ recipientName }) => {
  const [redeemed, setRedeemed] = useState<Record<string, boolean>>({});
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});

  const handleFlip = (id: string) => {
    soundEngine.playChime();
    setFlipped((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRedeem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    soundEngine.playSparkle();
    setRedeemed((prev) => ({ ...prev, [id]: true }));

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff1e56', '#ffd166', '#a2d2ff', '#ffffff'],
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-12 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium">
          <Ticket className="w-3.5 h-3.5 text-rose-400" />
          Redeemable Vouchers
        </span>
        <h2 className="mt-2 text-2xl sm:text-4xl font-serif font-bold text-rose-100">
          Love Coupons for {recipientName}
        </h2>
        <p className="text-xs sm:text-sm text-rose-300/70 mt-1 max-w-md mx-auto">
          Hover and click any coupon to flip in 3D • Click "Redeem" whenever you want to cash it in!
        </p>
      </div>

      {/* Grid of 3D Flip Coupons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 perspective-[1200px]">
        {defaultCoupons.map((coupon) => {
          const isFlipped = !!flipped[coupon.id];
          const isRedeemed = !!redeemed[coupon.id];

          return (
            <div
              key={coupon.id}
              onClick={() => handleFlip(coupon.id)}
              className="relative h-60 w-full cursor-pointer group select-none"
              style={{ perspective: '1000px' }}
            >
              {/* Inner 3D Flip Card */}
              <div
                className={`w-full h-full rounded-2xl transition-transform duration-700 relative preserve-3d shadow-xl shadow-rose-950/40 ${
                  isFlipped ? 'rotate-y-180' : 'group-hover:-translate-y-1'
                }`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* FRONT FACE */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${coupon.color} border border-rose-500/40 p-5 flex flex-col justify-between backface-hidden`}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  {/* Decorative Ticket Perforated border */}
                  <div className="absolute inset-2 border border-dashed border-rose-400/30 rounded-xl pointer-events-none" />

                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-2xl">{coupon.emoji}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/30">
                      Love Voucher
                    </span>
                  </div>

                  <div className="relative z-10 text-left my-auto">
                    <h4 className="text-lg font-serif font-bold text-rose-100">
                      {coupon.title}
                    </h4>
                    <p className="text-xs text-rose-200/80 mt-1 line-clamp-2 leading-relaxed">
                      {coupon.benefit}
                    </p>
                  </div>

                  <div className="relative z-10 flex items-center justify-between text-[11px] text-rose-400/80 pt-2 border-t border-rose-500/20">
                    <span>Click to flip & see terms</span>
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  </div>
                </div>

                {/* BACK FACE */}
                <div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#1e0724] to-[#110314] border border-rose-500/50 p-5 flex flex-col justify-between backface-hidden rotate-y-180 text-left"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <div className="border-b border-rose-500/30 pb-1.5 flex items-center justify-between">
                    <span className="text-xs font-serif font-bold text-rose-200">
                      Voucher Details
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  </div>

                  <div className="my-auto">
                    <p className="text-xs text-rose-200/90 leading-relaxed font-sans">
                      {coupon.terms}
                    </p>
                    <p className="text-[11px] text-rose-400/80 italic mt-2 font-serif">
                      Issuer: Forever Yours ❤️
                    </p>
                  </div>

                  {/* Redeem Button / Stamp */}
                  <div className="pt-2 border-t border-rose-500/20 flex items-center justify-between">
                    {isRedeemed ? (
                      <span className="w-full py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-400/60 text-emerald-200 text-xs font-bold text-center flex items-center justify-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        REDEEMED WITH LOVE ❤️
                      </span>
                    ) : (
                      <button
                        onClick={(e) => handleRedeem(e, coupon.id)}
                        className="w-full py-1.5 rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-semibold shadow-md transition active:scale-95"
                      >
                        Redeem This Coupon Now ✨
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
