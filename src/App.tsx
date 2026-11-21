import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ThreeHeartCanvas } from './components/ThreeHeartCanvas';
import { RomanticMusicPlayer } from './components/RomanticMusicPlayer';
import { EnchantedRose3D } from './components/EnchantedRose3D';
import { LoveLetter3D } from './components/LoveLetter3D';
import { MemoryCarousel3D } from './components/MemoryCarousel3D';
import { LoveJar } from './components/LoveJar';
import { LoveCoupons3D } from './components/LoveCoupons3D';
import { CustomizerModal } from './components/CustomizerModal';
import type { RomanticConfig } from './types';
import { soundEngine } from './utils/audio';
import { Heart } from 'lucide-react';

const defaultConfig: RomanticConfig = {
  recipientName: 'My Beautiful Love',
  senderName: 'Forever Yours',
  startDate: '2024-02-14',
  letterText: `From the very first moment you walked into my life, everything became so much brighter and softer.\n\nYour laughter is my favorite sound in the world, your kindness inspires me every single day, and the way your eyes crinkle when you smile is something I wouldn't trade for anything in this universe.\n\nThank you for being my best friend, my safe haven, and my favorite adventure. No matter where life takes us, I promise to always cheer for you, hold your hand, and love you more than yesterday.`,
  musicEnabled: false,
};

export default function App() {
  const [config, setConfig] = useState<RomanticConfig>(defaultConfig);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // Load from URL hash or localStorage on mount
  useEffect(() => {
    try {
      if (window.location.hash) {
        const hash = window.location.hash.slice(1);
        const params = new URLSearchParams(hash);
        const her = params.get('her');
        const me = params.get('me');
        const since = params.get('since');
        if (her || me || since) {
          setConfig((prev) => ({
            ...prev,
            recipientName: her || prev.recipientName,
            senderName: me || prev.senderName,
            startDate: since || prev.startDate,
          }));
          return;
        }
      }

      const saved = localStorage.getItem('impress_romantic_config');
      if (saved) {
        setConfig(JSON.parse(saved));
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleSaveConfig = (newConfig: RomanticConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem('impress_romantic_config', JSON.stringify(newConfig));
    } catch {
      // Ignore
    }
  };

  const toggleMusic = () => {
    const nextState = soundEngine.toggleAmbientMusic();
    setIsMusicPlaying(nextState);
  };

  return (
    <div className="min-h-screen bg-[#090514] text-rose-100 flex flex-col font-sans selection:bg-rose-500/30 selection:text-rose-200">
      {/* Navigation & Header */}
      <Navbar
        recipientName={config.recipientName}
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={toggleMusic}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
      />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-16">
        {/* 1. Main 3D Three.js Hero Canvas (Fully Responsive) */}
        <section>
          <ThreeHeartCanvas recipientName={config.recipientName} />
        </section>

        {/* 2. Romantic English Love Songs & 3D Vinyl Player */}
        <section>
          <RomanticMusicPlayer recipientName={config.recipientName} />
        </section>

        {/* 3. 3D Enchanted Eternal Rose with Secret Petal Notes */}
        <section>
          <EnchantedRose3D recipientName={config.recipientName} />
        </section>

        {/* 4. 3D Origami Love Letter with Wax Seal */}
        <section>
          <LoveLetter3D
            recipientName={config.recipientName}
            senderName={config.senderName}
            defaultText={config.letterText}
            onSaveText={(newText) => handleSaveConfig({ ...config, letterText: newText })}
          />
        </section>

        {/* 5. 3D Memory Card Carousel */}
        <section>
          <MemoryCarousel3D />
        </section>

        {/* 6. Jar of Love Notes & Compliments */}
        <section>
          <LoveJar recipientName={config.recipientName} />
        </section>

        {/* 7. 3D Love Coupons & Redeemable Vouchers */}
        <section>
          <LoveCoupons3D recipientName={config.recipientName} />
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-rose-500/20 py-8 px-4 text-center text-xs text-rose-300/60 bg-[#06020c]">
        <div className="flex items-center justify-center gap-1.5 font-medium text-rose-200">
          <span>Made for {config.recipientName} with all my love</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
        </div>
        <p className="mt-1 text-rose-400/50">
          Created by {config.senderName} • Forever & Always
        </p>
      </footer>

      {/* Customizer Modal */}
      <CustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        config={config}
        onSave={handleSaveConfig}
      />
    </div>
  );
}
