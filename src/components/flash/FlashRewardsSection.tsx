import React, { useState } from "react";
import { Award, Sparkles, Gift, CheckCircle2 } from "lucide-react";

export const FlashRewardsSection: React.FC = () => {
  const [scratched, setScratched] = useState(false);

  return (
    <section id="rewards" className="py-20 px-4 sm:px-8 max-w-6xl mx-auto border-t border-zinc-900">
      <div className="bg-gradient-to-b from-zinc-900/60 to-zinc-950 border border-zinc-800 rounded-3xl p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-2xl relative overflow-hidden">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE600]/10 border border-[#FFE600]/25 text-[#FFE600] text-xs font-mono font-bold uppercase tracking-wider mb-4">
          <Award className="w-3.5 h-3.5" />
          <span>Shopping Cashback & Coins</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
          Earn <span className="text-[#FFE600]">Flash Coins</span> on Every Amazon Purchase
        </h2>

        <p className="text-sm text-zinc-400 mb-8 max-w-xl mx-auto leading-relaxed">
          Shop through productreviews.review to earn 2X Flash Coins. Redeemable for Amazon gift vouchers, tech accessories, and exclusive hardware mystery boxes.
        </p>

        {/* Interactive Scratch Card Simulation */}
        <div className="max-w-sm mx-auto bg-zinc-950 border-2 border-dashed border-[#FFE600]/40 rounded-2xl p-6 relative">
          {scratched ? (
            <div className="space-y-2 animate-in zoom-in-95 duration-200">
              <span className="text-3xl">🎉</span>
              <div className="text-xl font-black text-[#FFE600] font-mono">+500 FLASH COINS</div>
              <p className="text-xs text-zinc-300">Welcome bonus unlocked! Credited to your shopping identity.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <Gift className="w-10 h-10 text-[#FFE600] mx-auto animate-bounce" />
              <div className="text-sm font-bold text-white">Tap to reveal mystery shopper welcome reward</div>
              <button
                onClick={() => setScratched(true)}
                className="bg-[#FFE600] hover:bg-[#ffe81a] text-black font-extrabold text-xs px-5 py-2 rounded-xl transition-transform active:scale-95 cursor-pointer shadow-lg"
              >
                Scratch to Win
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
