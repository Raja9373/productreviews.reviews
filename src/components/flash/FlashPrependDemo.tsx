import React, { useState } from "react";
import { Zap, Copy, Check, ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import { ReviewRecord, contentRepository } from "../../content/store/contentRepository";

interface FlashPrependDemoProps {
  onSelectProduct: (record: ReviewRecord) => void;
}

export const FlashPrependDemo: React.FC<FlashPrependDemoProps> = ({ onSelectProduct }) => {
  const [copied, setCopied] = useState(false);
  const sampleUrl = "https://amazon.in/dp/B0CX22P27G";
  const prependUrl = "productreviews.review/https://amazon.in/dp/B0CX22P27G";

  const handleCopy = () => {
    navigator.clipboard.writeText(prependUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTryNow = () => {
    const item = contentRepository.getBySlug("best-oneplus-nord-ce4-review-2026");
    if (item) onSelectProduct(item);
  };

  return (
    <section id="prepend-demo" className="py-20 bg-zinc-950/80 border-t border-b border-zinc-900 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE600]/10 border border-[#FFE600]/25 text-[#FFE600] text-xs font-mono font-bold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Signature Browser Magic</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
          How the <span className="text-[#FFE600]">Prepend Feature</span> Works
        </h2>

        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto mb-8 leading-relaxed">
          Browsing Amazon or Flipkart and want the honest truth? Just type <span className="font-mono text-white bg-zinc-800 px-2 py-0.5 rounded text-xs font-bold">productreviews.review/</span> before the URL in your address bar:
        </p>

        {/* Interactive URL Box Simulation */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 max-w-2xl mx-auto mb-6 text-left shadow-2xl">
          <div className="text-[11px] font-mono text-zinc-500 mb-1 flex items-center justify-between">
            <span>Browser Address Bar</span>
            <span className="text-[#FFE600]">Live Instant Lookup</span>
          </div>

          <div className="bg-black/90 rounded-xl p-3 border border-zinc-800 font-mono text-xs sm:text-sm text-zinc-300 break-all flex items-center justify-between gap-3">
            <div>
              <span className="text-[#FFE600] font-black">productreviews.review/</span>
              <span className="text-zinc-400">{sampleUrl}</span>
            </div>

            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors shrink-0 cursor-pointer"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          onClick={handleTryNow}
          className="bg-[#FFE600] hover:bg-[#ffe81a] text-black font-extrabold text-sm px-6 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(255,230,0,0.3)] cursor-pointer active:scale-95 inline-flex items-center gap-2"
        >
          <span>Test Prepend Live (OnePlus Nord CE4)</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </section>
  );
};
