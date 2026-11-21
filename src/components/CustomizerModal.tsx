import React, { useState } from 'react';
import { Settings, X, Heart, Check, Share2 } from 'lucide-react';
import type { RomanticConfig } from '../types';
import { soundEngine } from '../utils/audio';

interface CustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: RomanticConfig;
  onSave: (newConfig: RomanticConfig) => void;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
}) => {
  const [formData, setFormData] = useState<RomanticConfig>(config);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    soundEngine.playSparkle();
    onClose();
  };

  const copyShareableLink = () => {
    const params = new URLSearchParams();
    params.set('her', formData.recipientName);
    params.set('me', formData.senderName);
    params.set('since', formData.startDate);
    const fullUrl = `${window.location.origin}${window.location.pathname}#${params.toString()}`;

    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    soundEngine.playSparkle();
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-[#170520] border border-rose-500/40 p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-rose-300 hover:text-white hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Settings className="w-4 h-4" /> Personalize Her Experience
        </div>
        <h3 className="text-2xl font-serif font-bold text-rose-100">
          Make It Truly Yours 💖
        </h3>
        <p className="text-xs text-rose-300/70 mt-1 mb-6">
          Customize the names, relationship anniversary, and sweet love note.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-rose-200 font-medium block mb-1.5">
              Her Name or Nickname
            </label>
            <input
              type="text"
              required
              value={formData.recipientName}
              onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
              placeholder="e.g. My Princess, Sarah, Baby"
              className="w-full text-sm px-4 py-2.5 rounded-xl bg-black/40 border border-rose-500/30 text-rose-100 focus:outline-none focus:border-rose-400"
            />
          </div>

          <div>
            <label className="text-xs text-rose-200 font-medium block mb-1.5">
              Your Name or Nickname
            </label>
            <input
              type="text"
              required
              value={formData.senderName}
              onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
              placeholder="e.g. Forever Yours, Alex"
              className="w-full text-sm px-4 py-2.5 rounded-xl bg-black/40 border border-rose-500/30 text-rose-100 focus:outline-none focus:border-rose-400"
            />
          </div>

          <div>
            <label className="text-xs text-rose-200 font-medium block mb-1.5">
              Anniversary / Day You Met (for the Live Counter)
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full text-sm px-4 py-2.5 rounded-xl bg-black/40 border border-rose-500/30 text-rose-100 focus:outline-none focus:border-rose-400"
            />
          </div>

          <div>
            <label className="text-xs text-rose-200 font-medium block mb-1.5">
              Secret 3D Letter Message
            </label>
            <textarea
              rows={4}
              value={formData.letterText}
              onChange={(e) => setFormData({ ...formData, letterText: e.target.value })}
              placeholder="Write your sweet love letter here..."
              className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl bg-black/40 border border-rose-500/30 text-rose-100 focus:outline-none focus:border-rose-400 resize-none font-sans"
            />
          </div>

          {/* Share link action */}
          <div className="pt-2">
            <button
              type="button"
              onClick={copyShareableLink}
              className="w-full py-2.5 px-4 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-200 text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-rose-400" />}
              <span>{copied ? 'Link Copied to Clipboard!' : 'Copy Link With These Settings To Send Her'}</span>
            </button>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-rose-500/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-rose-300/80 hover:bg-white/5 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-rose-900/50 flex items-center gap-2 transition"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Apply & Save</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
