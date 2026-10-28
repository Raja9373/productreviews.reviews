import React, { useState, useEffect, useRef } from "react";
import { Search, Zap, ArrowRight, Sparkles, ExternalLink } from "lucide-react";
import { ReviewRecord, contentRepository } from "../../content/store/contentRepository";

interface FlashHeroProps {
  onSelectProduct: (record: ReviewRecord) => void;
  onOpenPrependDemo: () => void;
  onOpenEmailModal: () => void;
}

export const FlashHero: React.FC<FlashHeroProps> = ({
  onSelectProduct,
  onOpenPrependDemo,
  onOpenEmailModal
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ReviewRecord[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length > 0) {
      let cleanQuery = query.trim();
      if (cleanQuery.includes("amazon.") || cleanQuery.includes("flipkart.") || cleanQuery.includes("http")) {
        if (cleanQuery.toLowerCase().includes("oneplus") || cleanQuery.toLowerCase().includes("ce4")) {
          cleanQuery = "OnePlus Nord CE4";
        } else if (cleanQuery.toLowerCase().includes("iphone") || cleanQuery.toLowerCase().includes("16")) {
          cleanQuery = "iPhone 16 Pro Max";
        } else if (cleanQuery.toLowerCase().includes("sony") || cleanQuery.toLowerCase().includes("1000xm5")) {
          cleanQuery = "Sony WH-1000XM5";
        } else if (cleanQuery.toLowerCase().includes("macbook")) {
          cleanQuery = "MacBook Pro";
        } else if (cleanQuery.toLowerCase().includes("galaxy") || cleanQuery.toLowerCase().includes("s24")) {
          cleanQuery = "Samsung Galaxy S24 Ultra";
        } else if (cleanQuery.toLowerCase().includes("dell") || cleanQuery.toLowerCase().includes("xps")) {
          cleanQuery = "Dell XPS 15";
        }
      }

      const matches = contentRepository.search(cleanQuery);
      setResults(matches);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (record: ReviewRecord) => {
    onSelectProduct(record);
    setQuery("");
    setIsOpen(false);
  };

  const handleQuickPick = (slug: string) => {
    const item = contentRepository.getBySlug(slug);
    if (item) {
      onSelectProduct(item);
    }
  };

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-[#09090b]">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#FFE600]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs font-semibold text-zinc-300 mb-6 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#FFE600] animate-pulse" />
          <span className="text-[#FFE600] font-bold">productreviews.review</span>
          <span className="text-zinc-600">·</span>
          <span>Unbiased AI Shopping & Hardware Benchmarks</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.08] text-balance">
          Shop smarter with <span className="text-[#FFE600] drop-shadow-[0_0_35px_rgba(255,230,0,0.3)]">productreviews.review</span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Type <span className="font-mono text-zinc-200 bg-zinc-800 px-2 py-0.5 rounded text-sm font-semibold border border-zinc-700">productreviews.review/</span> in front of any shopping link, or paste a URL below to get an instant unbiased Flash Score, real pros & cons, and verified lowest prices.
        </p>

        {/* Global Search & Link Analyzer */}
        <div ref={dropdownRef} className="max-w-2xl mx-auto relative mb-6">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FFE600]/40 to-amber-500/40 rounded-2xl blur opacity-75 group-focus-within:opacity-100 transition duration-300" />
            
            <div className="relative flex items-center bg-zinc-950 border border-zinc-800 rounded-2xl p-2 shadow-2xl focus-within:border-[#FFE600]/80 transition-colors">
              <div className="pl-3.5 pr-2 text-zinc-400 group-focus-within:text-[#FFE600] transition-colors">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && results.length > 0) {
                    handleSelect(results[0]);
                  }
                }}
                placeholder="Paste Amazon, Flipkart URL or search any product (e.g. OnePlus Nord CE4)..."
                className="w-full bg-transparent text-sm sm:text-base text-white placeholder-zinc-500 focus:outline-none py-2 px-1"
              />
              <button
                onClick={() => {
                  if (results.length > 0) handleSelect(results[0]);
                }}
                className="bg-[#FFE600] hover:bg-[#ffe81a] text-black font-extrabold text-xs sm:text-sm px-4 sm:px-6 py-2.5 rounded-xl transition-all shadow-[0_0_20px_rgba(255,230,0,0.35)] cursor-pointer active:scale-95 flex items-center gap-1.5 shrink-0"
              >
                <span>Analyze</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Real-time search dropdown results */}
          {isOpen && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-50 text-left divide-y divide-zinc-900 max-h-80 overflow-y-auto animate-in fade-in duration-150">
              <div className="px-4 py-2 text-[10px] uppercase font-mono font-bold text-zinc-500 bg-zinc-900/50">
                Verified Product Matches ({results.length})
              </div>
              {results.map((rec) => (
                <div
                  key={rec.slug}
                  onClick={() => handleSelect(rec)}
                  className="p-3.5 hover:bg-zinc-900 flex items-center justify-between gap-3 cursor-pointer transition-colors group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white group-hover:text-[#FFE600] transition-colors">
                        {rec.name}
                      </span>
                      <span className="text-[10px] font-mono bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">
                        {rec.brand}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                      {rec.summary}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-block bg-[#FFE600] text-black text-xs font-black px-2 py-0.5 rounded-md">
                      {Math.round(rec.rating * 20)}
                    </span>
                    <span className="block text-[10px] text-zinc-500 font-mono mt-0.5">
                      ${rec.priceUSD}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Popular Quick Picks */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-500 mb-8">
          <span className="font-semibold text-zinc-400">Trending Benchmarks:</span>
          {[
            { label: "OnePlus Nord CE4 5G", slug: "best-oneplus-nord-ce4-review-2026" },
            { label: "iPhone 16 Pro Max", slug: "apple-iphone-16-pro-max" },
            { label: "Galaxy S24 Ultra", slug: "samsung-galaxy-s24-ultra" },
            { label: "Sony WH-1000XM5", slug: "sony-wh-1000xm5" },
            { label: "MacBook Pro M3 Max", slug: "macbook-pro-16-m3-max" }
          ].map((item) => (
            <button
              key={item.slug}
              onClick={() => handleQuickPick(item.slug)}
              className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-[#FFE600] border border-zinc-800 px-3 py-1 rounded-full transition-colors cursor-pointer flex items-center gap-1 font-mono text-[11px]"
            >
              <span>{item.label}</span>
              <ArrowRight className="w-3 h-3 opacity-60" />
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};
