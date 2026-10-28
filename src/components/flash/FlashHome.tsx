import React from "react";
import { ReviewRecord } from "../../content/store/contentRepository";
import { FlashHero } from "./FlashHero";
import { FlashPrependDemo } from "./FlashPrependDemo";
import { FlashFeaturedGrid } from "./FlashFeaturedGrid";
import { FlashBuyerResearchHub } from "./FlashBuyerResearchHub";
import { FlashEmailSection } from "./FlashEmailSection";
import { FlashOrderTracker } from "./FlashOrderTracker";
import { FlashRewardsSection } from "./FlashRewardsSection";
import { contentRepository } from "../../content/store/contentRepository";
import { Zap } from "lucide-react";

interface FlashHomeProps {
  products: ReviewRecord[];
  currentMarket: string;
  onSelectProduct: (record: ReviewRecord) => void;
  onOpenEmailModal: () => void;
}

export const FlashHome: React.FC<FlashHomeProps> = ({
  products,
  currentMarket,
  onSelectProduct,
  onOpenEmailModal
}) => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-[#09090b] text-white">
      {/* 1. Main Hero & Super Search */}
      <FlashHero
        onSelectProduct={onSelectProduct}
        onOpenPrependDemo={() => scrollToSection("prepend-demo")}
        onOpenEmailModal={onOpenEmailModal}
      />

      {/* Trust Strip */}
      <div className="border-t border-b border-zinc-900 bg-zinc-950/60 py-6 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-zinc-500 text-xs">
          <span className="font-bold uppercase tracking-wider text-[11px] text-zinc-400">
            Backed by Top VCs & Featured In:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-8 font-bold text-zinc-400 text-sm tracking-tight opacity-80">
            <span className="hover:text-white transition-colors">TechCrunch</span>
            <span className="hover:text-white transition-colors">The Economic Times</span>
            <span className="hover:text-white transition-colors">Entrackr</span>
            <span className="hover:text-white transition-colors">YourStory</span>
            <span className="hover:text-white transition-colors">Forbes India</span>
          </div>
        </div>
      </div>

      {/* 2. Trending Hardware Analyzed by Flash AI */}
      <FlashFeaturedGrid
        products={products}
        currentMarket={currentMarket}
        onSelectProduct={onSelectProduct}
      />

      {/* 3. Prepend signature Browser Demo */}
      <FlashPrependDemo onSelectProduct={onSelectProduct} />

      {/* 4. High-Intent Buyer Research & People Also Ask Knowledge Hub */}
      <FlashBuyerResearchHub
        currentMarket={currentMarket}
        onSelectProductBySlug={(slug) => {
          const rec = contentRepository.getBySlug(slug);
          if (rec) onSelectProduct(rec);
        }}
      />

      {/* 5. The Free @productreviews.review Shopping Identity & Live Inbox */}
      <FlashEmailSection />

      {/* 6. Universal Cross-Store Order Tracker */}
      <FlashOrderTracker />

      {/* 7. Flash Coins & Shopping Rewards */}
      <FlashRewardsSection />

      {/* Final Call to Action */}
      <section className="py-20 bg-gradient-to-b from-zinc-950 to-[#09090b] border-t border-zinc-900 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-[#FFE600] text-black font-black flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(255,230,0,0.35)]">
            <Zap className="w-8 h-8 fill-black stroke-black" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Start shopping smarter with <span className="text-[#FFE600]">productreviews.review</span>
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto mb-8 leading-relaxed">
            Join over 250,000+ shoppers who never overpay, avoid biased influencer hype, and keep their personal inbox 100% spam-free.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenEmailModal}
              className="w-full sm:w-auto bg-[#FFE600] hover:bg-[#ffe81a] text-black font-extrabold text-sm px-8 py-3.5 rounded-xl transition-all shadow-[0_0_25px_rgba(255,230,0,0.3)] cursor-pointer active:scale-95 flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>Get Your Free @productreviews.review Email</span>
            </button>

            <button
              onClick={() => scrollToSection("prepend-demo")}
              className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm px-6 py-3.5 rounded-xl border border-zinc-800 transition-colors cursor-pointer"
            >
              Try Prepend Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
