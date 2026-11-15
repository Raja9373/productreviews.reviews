import React from "react";
import { ReviewRecord, contentRepository } from "../../content/store/contentRepository";
import { FlashHero } from "./FlashHero";
import { FlashPrependDemo } from "./FlashPrependDemo";
import { FlashFeaturedGrid } from "./FlashFeaturedGrid";
import { FlashBuyerResearchHub } from "./FlashBuyerResearchHub";
import { FlashDecisionTools } from "./FlashDecisionTools";
import { COMPARISON_PAIRS, ComparisonPair } from "./FlashComparisonView";
import { FlashEmailSection } from "./FlashEmailSection";
import { FlashOrderTracker } from "./FlashOrderTracker";
import { FlashRewardsSection } from "./FlashRewardsSection";
import { Zap, Scale, ArrowRight } from "lucide-react";

interface FlashHomeProps {
  products: ReviewRecord[];
  currentMarket: string;
  onSelectProduct: (record: ReviewRecord) => void;
  onSelectComparison?: (comp: ComparisonPair) => void;
  onOpenEmailModal: () => void;
}

export const FlashHome: React.FC<FlashHomeProps> = ({
  products,
  currentMarket,
  onSelectProduct,
  onSelectComparison,
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
            Independent Testing Standards & Editorial Principles:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-8 font-bold text-zinc-400 text-xs tracking-tight opacity-85">
            <span className="hover:text-white transition-colors">100% Retail-Purchased Units</span>
            <span className="hover:text-white transition-colors">Zero Sponsored Ratings</span>
            <span className="hover:text-white transition-colors">14-Country Amazon ASIN Tracking</span>
            <span className="hover:text-white transition-colors">FLIR Thermal & Battery Loops</span>
          </div>
        </div>
      </div>

      {/* 2. Trending Hardware Analyzed by Flash AI */}
      <FlashFeaturedGrid
        products={products}
        currentMarket={currentMarket}
        onSelectProduct={onSelectProduct}
      />

      {/* 3. Head-to-Head Hardware Shootout Hub (Crawlable Internal Links) */}
      <section id="comparison-shootouts" className="py-16 px-4 sm:px-8 max-w-6xl mx-auto border-t border-zinc-900">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#FFE600] uppercase tracking-wider mb-2 font-mono">
              <Scale className="w-4 h-4" />
              <span>Head-to-Head Hardware Shootouts</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Direct Flagship & Mid-Range Comparisons
            </h2>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            Side-by-side lab specs, battery loops & real winner verdicts
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {COMPARISON_PAIRS.map((comp) => (
            <article
              key={comp.slug}
              className="bg-zinc-950/90 border border-zinc-800/90 hover:border-[#FFE600]/60 rounded-3xl p-6 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono uppercase font-bold text-[#FFE600] bg-[#FFE600]/10 border border-[#FFE600]/20 px-2.5 py-1 rounded-md">
                    VS Shootout
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500">
                    {comp.keyDifferences.length} Tested Dimensions
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-white group-hover:text-[#FFE600] transition-colors mb-2 leading-snug">
                  <a
                    href={`/compare/${comp.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectComparison?.(comp);
                    }}
                    className="block"
                  >
                    {comp.title}
                  </a>
                </h3>
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-4">
                  {comp.metaDescription}
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-900 flex items-center justify-between">
                <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                  ✓ Lab Winner Declared
                </span>
                <a
                  href={`/compare/${comp.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectComparison?.(comp);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FFE600] group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Compare Specs & Verdict</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 4. Interactive Deal Authenticity & 3-Year Cost Calculators */}
      <FlashDecisionTools currentMarket={currentMarket} />

      {/* 5. Prepend signature Browser Demo */}
      <FlashPrependDemo onSelectProduct={onSelectProduct} />

      {/* 6. High-Intent Buyer Research & People Also Ask Knowledge Hub */}
      <FlashBuyerResearchHub
        currentMarket={currentMarket}
        onSelectProductBySlug={(slug) => {
          const rec = contentRepository.getBySlug(slug);
          if (rec) onSelectProduct(rec);
        }}
      />

      {/* 7. The Free @productreviews.review Shopping Identity & Live Inbox */}
      <FlashEmailSection />

      {/* 8. Universal Cross-Store Order Tracker */}
      <FlashOrderTracker />

      {/* 9. Flash Coins & Shopping Rewards */}
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
            Cut through fake marketplace reviews, verify real 90-day Amazon deal history, and keep your personal inbox 100% spam-free.
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
