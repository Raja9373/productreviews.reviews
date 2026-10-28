import React, { useState } from "react";
import { X, Mail, Zap, CheckCircle2, ShieldCheck } from "lucide-react";

interface FlashEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FlashEmailModal: React.FC<FlashEmailModalProps> = ({ isOpen, onClose }) => {
  const [handle, setHandle] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (handle.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-md p-6 sm:p-8 relative shadow-2xl text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-10 h-10 rounded-2xl bg-[#FFE600] text-black font-black flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(255,230,0,0.3)]">
          <Mail className="w-5 h-5 fill-black" />
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
          Claim Your Free Shopping Email
        </h3>

        <p className="text-xs text-zinc-400 leading-relaxed mb-6">
          One identity for Amazon, Flipkart, Nike, and global stores. No marketing spam, instant order tracking.
        </p>

        {submitted ? (
          <div className="bg-emerald-950/40 border border-emerald-800 rounded-2xl p-4 text-emerald-400 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Identity Reserved!</span>
            </div>
            <p className="text-xs text-zinc-300">
              Welcome to productreviews.review. Your address <span className="font-mono text-[#FFE600] font-bold">{handle}@productreviews.review</span> is ready.
            </p>
            <button
              onClick={onClose}
              className="mt-2 w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Start Browsing
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5 font-mono">
                Choose Handle
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, ""))}
                  placeholder="yourname"
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-4 pr-36 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFE600]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-500 pointer-events-none">
                  @productreviews.review
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#FFE600] hover:bg-[#ffe81a] text-black font-extrabold text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(255,230,0,0.3)] cursor-pointer active:scale-95"
            >
              Activate My Free Inbox
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
