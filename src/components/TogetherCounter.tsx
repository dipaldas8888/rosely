import React, { useState, useEffect } from 'react';
import { Heart, Flame } from 'lucide-react';

interface TogetherCounterProps {
  startDateStr: string; // "YYYY-MM-DD"
  recipientName: string;
}

export const TogetherCounter: React.FC<TogetherCounterProps> = ({
  startDateStr,
  recipientName,
}) => {
  const [timePassed, setTimePassed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      // Default to 1 year ago if date is invalid or empty
      const parsedDate = new Date(startDateStr);
      const start = isNaN(parsedDate.getTime()) ? new Date(Date.now() - 365 * 24 * 3600 * 1000) : parsedDate;
      const now = new Date();
      const diffMs = Math.max(0, now.getTime() - start.getTime());

      const seconds = Math.floor((diffMs / 1000) % 60);
      const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
      const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      setTimePassed({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [startDateStr]);

  return (
    <div className="w-full max-w-4xl mx-auto my-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-pink-950/40 backdrop-blur-xl border border-rose-500/20 shadow-2xl relative overflow-hidden">
      {/* Background glowing orbs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Text */}
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium">
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>Every Second With You Counts</span>
          </div>
          <h3 className="mt-2 text-2xl sm:text-3xl font-serif font-bold text-rose-100 flex items-center justify-center md:justify-start gap-2">
            <span>Our Journey Together</span>
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
          </h3>
          <p className="text-xs sm:text-sm text-rose-300/70 mt-1">
            Loving {recipientName} has been the best part of every day.
          </p>
        </div>

        {/* 4 Time Digit Cards with 3D hover */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 w-full md:w-auto">
          {[
            { label: 'Days', value: timePassed.days },
            { label: 'Hours', value: timePassed.hours },
            { label: 'Mins', value: timePassed.minutes },
            { label: 'Secs', value: timePassed.seconds },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-black/40 border border-rose-500/30 shadow-lg group hover:border-rose-400/60 hover:-translate-y-1 transition-all duration-300"
            >
              <span className="text-xl sm:text-3xl md:text-4xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-b from-white via-rose-100 to-rose-300 drop-shadow">
                {String(item.value).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs text-rose-300/70 uppercase tracking-wider mt-1 font-medium">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
