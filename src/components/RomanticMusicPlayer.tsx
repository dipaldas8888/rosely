import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Music,
  Disc,
  Sparkles,
  Upload,
  Heart,
} from 'lucide-react';
import { romanticSongs, soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';

interface RomanticMusicPlayerProps {
  recipientName: string;
}

export const RomanticMusicPlayer: React.FC<RomanticMusicPlayerProps> = ({ recipientName }) => {
  const [currentSongIdx, setCurrentSongIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [customSongName, setCustomSongName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentSong = romanticSongs[currentSongIdx];

  // Track timer for progress bar & lyrics sync
  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= currentSong.duration) {
            // Next song
            handleNextSong();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSongIdx, currentSong.duration]);

  const togglePlay = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    if (nextState) {
      soundEngine.playSongMelody(currentSongIdx);
      soundEngine.playSparkle();
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#ff4d6d', '#ffd166', '#f72585'],
      });
    } else {
      soundEngine.pauseAudio();
    }
  };

  const handleNextSong = () => {
    const nextIdx = (currentSongIdx + 1) % romanticSongs.length;
    setCurrentSongIdx(nextIdx);
    setCurrentTime(0);
    setCustomSongName(null);
    soundEngine.playSongMelody(nextIdx);
    setIsPlaying(true);
  };

  const handlePrevSong = () => {
    const prevIdx = (currentSongIdx - 1 + romanticSongs.length) % romanticSongs.length;
    setCurrentSongIdx(prevIdx);
    setCurrentTime(0);
    setCustomSongName(null);
    soundEngine.playSongMelody(prevIdx);
    setIsPlaying(true);
  };

  const handleSongSelect = (idx: number) => {
    setCurrentSongIdx(idx);
    setCurrentTime(0);
    setCustomSongName(null);
    soundEngine.playSongMelody(idx);
    setIsPlaying(true);
    soundEngine.playSparkle();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    soundEngine.setVolume(val);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomSongName(file.name.replace(/\.[^/.]+$/, ''));
      soundEngine.playAudioFile(url, handleNextSong);
      setIsPlaying(true);
      setCurrentTime(0);
      soundEngine.playSparkle();
    }
  };

  // Find active lyric line based on currentTime
  const currentLyric = currentSong.lyrics
    .slice()
    .reverse()
    .find((l) => currentTime >= l.time) || currentSong.lyrics[0];

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-10 p-5 sm:p-8 md:p-10 rounded-3xl bg-gradient-to-b from-[#1b0826] via-[#110419] to-[#090210] border border-rose-500/30 shadow-2xl relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-rose-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="text-center sm:text-left">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium">
            <Music className="w-3.5 h-3.5 text-rose-400" />
            Our Romantic English Love Songs
          </span>
          <h2 className="mt-2 text-2xl sm:text-4xl font-serif font-bold text-rose-100 flex items-center justify-center sm:justify-start gap-2">
            <span>Soundtrack of Our Love</span>
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse" />
          </h2>
          <p className="text-xs sm:text-sm text-rose-300/70 mt-1">
            Dedicated to {recipientName} • Put on headphones and sing along
          </p>
        </div>

        {/* Custom MP3 Upload button */}
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="audio/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-rose-500/30 text-rose-200 text-xs font-semibold flex items-center gap-2 transition hover:scale-105 active:scale-95"
            title="Upload your own romantic song MP3"
          >
            <Upload className="w-4 h-4 text-rose-400" />
            <span>Play Her Favorite MP3</span>
          </button>
        </div>
      </div>

      {/* Main Player Grid: 3D Vinyl Turntable + Controls & Lyrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: 3D Rotating Vinyl Turntable (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-60 h-60 sm:w-72 sm:h-72 flex items-center justify-center perspective-[1000px]">
            {/* Turntable Base Platter */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#14061a] via-[#22092c] to-[#100315] border-2 border-rose-500/30 shadow-[0_0_40px_rgba(244,63,94,0.25)] flex items-center justify-center" />

            {/* Tonearm (Vinyl Needle) */}
            <div
              className={`absolute top-2 right-4 z-20 w-24 h-3 origin-top-right transition-transform duration-700 ease-in-out pointer-events-none ${
                isPlaying ? 'rotate-20' : '-rotate-12'
              }`}
            >
              {/* Arm metal rod */}
              <div className="w-full h-1 bg-gradient-to-r from-amber-400 via-rose-300 to-amber-200 rounded-full shadow-lg" />
              {/* Needle head */}
              <div className="absolute -left-1 -top-1 w-3 h-3 rounded-full bg-rose-500 border border-amber-300 shadow-md" />
            </div>

            {/* The 3D Spinning Vinyl Record */}
            <div
              className={`relative w-52 h-52 sm:w-64 sm:h-64 rounded-full bg-[#0d0d11] border-4 border-[#24242e] shadow-2xl flex items-center justify-center transition-transform ${
                isPlaying ? 'animate-spin' : ''
              }`}
              style={{
                animationDuration: '6s',
                animationTimingFunction: 'linear',
                animationIterationCount: 'infinite',
                background:
                  'radial-gradient(circle, #1a0b22 0%, #0d0612 40%, #15091e 41%, #0a030f 70%, #14081c 71%, #050108 100%)',
              }}
            >
              {/* Vinyl Groove Rings */}
              <div className="absolute inset-4 rounded-full border border-white/5 pointer-events-none" />
              <div className="absolute inset-8 rounded-full border border-white/5 pointer-events-none" />
              <div className="absolute inset-14 rounded-full border border-white/5 pointer-events-none" />

              {/* Center Album Art Label */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-amber-300/60 shadow-inner flex items-center justify-center group">
                <img
                  src={currentSong.coverUrl}
                  alt={currentSong.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 backdrop-blur-[0.5px]" />
                {/* Center Spindle Hole */}
                <div className="relative z-10 w-4 h-4 rounded-full bg-gradient-to-tr from-amber-400 to-rose-400 border border-white shadow flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-black" />
                </div>
              </div>
            </div>
          </div>

          {/* Equalizer Wave Visualizer when playing */}
          <div className="flex items-center gap-1.5 mt-4 h-6">
            {[40, 75, 55, 90, 60, 85, 45, 95, 65, 80].map((h, i) => (
              <div
                key={i}
                className="w-1 bg-gradient-to-t from-rose-500 to-amber-300 rounded-full transition-all duration-300"
                style={{
                  height: isPlaying ? `${Math.max(15, (h * (0.6 + Math.sin(currentTime * 2 + i) * 0.4)))}%` : '20%',
                }}
              />
            ))}
          </div>
        </div>

        {/* Right: Song Info, Live Romantic Lyrics, and Controls (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          {/* Song Metadata */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-400/10 border border-amber-400/20">
                Track {currentSongIdx + 1} of {romanticSongs.length}
              </span>
              <span className="text-xs text-rose-300/60 font-light">• High Fidelity Romance</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-rose-100 mt-2 truncate">
              {customSongName || currentSong.title}
            </h3>
            <p className="text-sm text-rose-300 font-medium">
              {customSongName ? 'Custom Dedicated Track' : currentSong.artist}
            </p>
          </div>

          {/* Synchronized Romantic English Lyrics Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-rose-500/20 backdrop-blur-md relative overflow-hidden min-h-[90px] flex flex-col justify-center">
            <div className="absolute top-2 right-3 flex items-center gap-1 text-[10px] text-rose-400/80 uppercase font-semibold">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Romantic Lyrics</span>
            </div>
            <p className="text-base sm:text-lg font-serif italic text-rose-100 text-center sm:text-left leading-relaxed animate-fade-in">
              "{currentLyric.text}"
            </p>
            <p className="text-[11px] text-rose-300/60 text-center sm:text-left mt-1">
              Words that remind me of you every time I hear them.
            </p>
          </div>

          {/* Progress Scrub Bar */}
          <div className="space-y-1.5">
            <div className="relative w-full h-2 rounded-full bg-rose-950/60 overflow-hidden cursor-pointer group">
              <div
                className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-300 transition-all duration-300 rounded-full"
                style={{ width: `${(currentTime / currentSong.duration) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-rose-300/70 font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(currentSong.duration)}</span>
            </div>
          </div>

          {/* Playback Controls & Volume */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-rose-500/20">
            {/* Play/Pause/Skip */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrevSong}
                className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-rose-200 transition active:scale-95"
                title="Previous Song"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={togglePlay}
                className="w-13 h-13 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 hover:from-rose-500 hover:to-pink-400 text-white shadow-lg shadow-rose-900/60 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                title={isPlaying ? 'Pause' : 'Play Song'}
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
              </button>

              <button
                onClick={handleNextSong}
                className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-rose-200 transition active:scale-95"
                title="Next Song"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const nextMuted = !isMuted;
                  setIsMuted(nextMuted);
                  soundEngine.setVolume(nextMuted ? 0 : volume);
                }}
                className="text-rose-300 hover:text-white transition"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 sm:w-24 accent-rose-500 cursor-pointer h-1.5 rounded-lg bg-rose-950"
              />
            </div>
          </div>

          {/* Quick Playlist Track Chips */}
          <div className="flex flex-wrap gap-2 pt-2">
            {romanticSongs.map((song, i) => (
              <button
                key={song.id}
                onClick={() => handleSongSelect(i)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                  currentSongIdx === i && !customSongName
                    ? 'bg-rose-500/25 border border-rose-400 text-rose-100 shadow'
                    : 'bg-black/30 border border-rose-500/20 text-rose-300/80 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Disc className="w-3.5 h-3.5 text-rose-400" />
                <span>{song.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
