import React, { useState } from 'react';
import { Camera, ChevronLeft, ChevronRight, Heart, Sparkles, Plus } from 'lucide-react';
import type { MemoryItem } from '../types';
import { soundEngine } from '../utils/audio';

const defaultMemories: MemoryItem[] = [
  {
    id: '1',
    title: 'The First Time We Talked',
    date: 'A day I will never forget',
    description: 'You made me laugh so effortlessly, and from that exact conversation I already knew you were someone extraordinarily rare.',
    imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
    tag: 'Spark ✨',
  },
  {
    id: '2',
    title: 'Your Contagious Smile',
    date: 'Every single day',
    description: 'Whenever you smile with your whole face, the whole room lights up. It instantly erases any bad day I could ever have.',
    imageUrl: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80',
    tag: 'Pure Joy 🥰',
  },
  {
    id: '3',
    title: 'Late Night Talks & Stargazing',
    date: 'Under the quiet skies',
    description: 'Talking about everything and nothing until 3 AM, lost in our own little universe where time completely stopped existing.',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    tag: 'Magic 🌙',
  },
  {
    id: '4',
    title: 'Our Cozy Coffee & Food Adventures',
    date: 'Our favorite moments',
    description: 'Stealing bites off each other’s plates, giggling over inside jokes, and realizing that ordinary moments with you are pure luxury.',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    tag: 'Sweet Life ☕',
  },
  {
    id: '5',
    title: 'Growing & Dreaming Together',
    date: 'Right now & forever',
    description: 'I love who I am when I am with you, and I cannot wait for all the unwritten chapters, travels, and laughs ahead of us.',
    imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
    tag: 'Forever 💫',
  },
];

export const MemoryCarousel3D: React.FC = () => {
  const [memories, setMemories] = useState<MemoryItem[]>(defaultMemories);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // New Memory Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newImg, setNewImg] = useState('');

  const nextSlide = () => {
    soundEngine.playChime();
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % memories.length);
  };

  const prevSlide = () => {
    soundEngine.playChime();
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + memories.length) % memories.length);
  };

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: MemoryItem = {
      id: Date.now().toString(),
      title: newTitle,
      date: newDate || 'A Special Day',
      description: newDesc || 'Another beautiful memory added to our collection.',
      imageUrl:
        newImg.trim() ||
        'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80',
      tag: 'Our Memory 💖',
    };

    setMemories([newItem, ...memories]);
    setCurrentIndex(0);
    setShowAddModal(false);
    setNewTitle('');
    setNewDate('');
    setNewDesc('');
    setNewImg('');
    soundEngine.playSparkle();
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium">
            <Camera className="w-3.5 h-3.5 text-rose-400" />
            Polaroid Snapshots
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-serif font-bold text-rose-100">
            Our 3D Memory Gallery
          </h2>
          <p className="text-xs sm:text-sm text-rose-300/70 mt-1">
            Hover & flip each card in 3D space to read sweet memories
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-rose-900/40 flex items-center gap-2 transition hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Memory</span>
        </button>
      </div>

      {/* 3D Stage for Carousel */}
      <div className="relative min-h-[440px] flex items-center justify-center perspective-[1400px]">
        {/* Navigation arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 z-30 p-3 rounded-full bg-black/60 hover:bg-rose-950/80 text-rose-200 border border-rose-500/30 backdrop-blur-md shadow-xl transition-all hover:scale-110 active:scale-95"
          aria-label="Previous Memory"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 z-30 p-3 rounded-full bg-black/60 hover:bg-rose-950/80 text-rose-200 border border-rose-500/30 backdrop-blur-md shadow-xl transition-all hover:scale-110 active:scale-95"
          aria-label="Next Memory"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* 3D Stack of Cards */}
        <div className="relative w-72 sm:w-84 md:w-96 h-[420px] flex items-center justify-center">
          {memories.map((mem, index) => {
            const offset = (index - currentIndex + memories.length) % memories.length;
            // Visible stack range
            const isCurrent = offset === 0;
            const isNext = offset === 1;
            const isPrev = offset === memories.length - 1;

            if (offset > 2 && offset < memories.length - 2) return null;

            let transform = '';
            let zIndex = 10;
            let opacity = 0;

            if (isCurrent) {
              transform = `translateZ(40px) scale(1)`;
              zIndex = 20;
              opacity = 1;
            } else if (isNext) {
              transform = `translateX(60%) translateZ(-80px) rotateY(-22deg) scale(0.85)`;
              zIndex = 10;
              opacity = 0.55;
            } else if (isPrev) {
              transform = `translateX(-60%) translateZ(-80px) rotateY(22deg) scale(0.85)`;
              zIndex = 10;
              opacity = 0.55;
            }

            return (
              <div
                key={mem.id}
                onClick={() => {
                  if (isCurrent) {
                    setIsFlipped(!isFlipped);
                    soundEngine.playChime();
                  } else {
                    setCurrentIndex(index);
                  }
                }}
                className={`absolute inset-0 cursor-pointer transition-all duration-700 ease-out select-none ${
                  isCurrent ? 'cursor-pointer' : 'cursor-pointer'
                }`}
                style={{
                  transform,
                  zIndex,
                  opacity,
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* The Flippable 3D Card Inner */}
                <div
                  className={`w-full h-full rounded-3xl transition-transform duration-700 relative preserve-3d shadow-2xl ${
                    isCurrent && isFlipped ? 'rotate-y-180' : ''
                  }`}
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* FRONT: Polaroid Style */}
                  <div
                    className="absolute inset-0 rounded-3xl bg-gradient-to-b from-[#1c0822] to-[#120417] border border-rose-500/40 p-4 flex flex-col justify-between backface-hidden shadow-2xl shadow-rose-950/60"
                    style={{
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    {/* Image with glossy frame */}
                    <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-black/40 border border-rose-500/20 group">
                      <img
                        src={mem.imageUrl}
                        alt={mem.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-semibold text-rose-200 border border-rose-500/30">
                        {mem.tag}
                      </span>
                    </div>

                    {/* Captions */}
                    <div className="mt-3 text-left">
                      <p className="text-xs text-rose-400 font-medium">{mem.date}</p>
                      <h4 className="text-lg font-serif font-bold text-rose-100 truncate mt-0.5">
                        {mem.title}
                      </h4>
                      <p className="text-xs text-rose-300/80 line-clamp-2 mt-1 leading-relaxed">
                        {mem.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-rose-500/20 flex items-center justify-between text-[11px] text-rose-400/80">
                      <span>Click to flip card & read secret note</span>
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
                    </div>
                  </div>

                  {/* BACK: Love Note on Parchment */}
                  <div
                    className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#2b0820] via-[#1a0515] to-[#10030d] border border-rose-500/50 p-6 flex flex-col justify-between backface-hidden rotate-y-180 shadow-2xl shadow-rose-950/80 text-left"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between border-b border-rose-500/30 pb-2">
                        <span className="text-xs font-serif italic text-rose-300">Secret Note</span>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                      </div>
                      <h4 className="text-xl font-serif font-bold text-rose-100 mt-3">{mem.title}</h4>
                      <p className="text-xs sm:text-sm text-rose-200/90 font-sans mt-3 leading-relaxed whitespace-pre-line">
                        "{mem.description}"
                      </p>
                    </div>

                    <div className="text-center pt-3 border-t border-rose-500/30">
                      <p className="text-xs text-rose-400 font-serif italic">
                        Every single second with you is a treasure.
                      </p>
                      <span className="text-[10px] text-rose-300/60 mt-1 block">Click again to flip back</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination indicator dots */}
      <div className="flex justify-center items-center gap-2 mt-6">
        {memories.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrentIndex(idx);
              setIsFlipped(false);
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentIndex === idx ? 'w-8 bg-rose-500 shadow-md shadow-rose-500/50' : 'w-2 bg-rose-500/30'
            }`}
          />
        ))}
      </div>

      {/* Add Memory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-[#1a0624] border border-rose-500/40 p-6 shadow-2xl">
            <h3 className="text-xl font-serif font-bold text-rose-100 mb-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" /> Add a Precious Memory
            </h3>
            <p className="text-xs text-rose-300/70 mb-4">
              Add a real moment or inside joke between the two of you.
            </p>

            <form onSubmit={handleAddMemory} className="space-y-3">
              <div>
                <label className="text-xs text-rose-300 font-medium block mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. That rainy evening in the car"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl bg-black/40 border border-rose-500/30 text-rose-100 focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="text-xs text-rose-300 font-medium block mb-1">Date / Place</label>
                <input
                  type="text"
                  placeholder="e.g. October 14, by the lake"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl bg-black/40 border border-rose-500/30 text-rose-100 focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="text-xs text-rose-300 font-medium block mb-1">Why it meant so much</label>
                <textarea
                  rows={3}
                  placeholder="What made this moment unforgettable..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl bg-black/40 border border-rose-500/30 text-rose-100 focus:outline-none focus:border-rose-400 resize-none"
                />
              </div>

              <div>
                <label className="text-xs text-rose-300 font-medium block mb-1">Photo Image URL (optional)</label>
                <input
                  type="url"
                  placeholder="https://... (leave empty for romantic default)"
                  value={newImg}
                  onChange={(e) => setNewImg(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl bg-black/40 border border-rose-500/30 text-rose-100 focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-rose-300/80 hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-semibold shadow-lg shadow-rose-900/50 transition"
                >
                  Save Memory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
