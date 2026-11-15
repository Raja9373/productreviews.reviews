import React from "react";
import { ReviewRecord } from "../../content/store/contentRepository";
import { Zap, ArrowRight, ExternalLink, ShieldCheck, CheckCircle } from "lucide-react";
import { SUPPORTED_MARKETS } from "../../localization/markets";

interface FlashFeaturedGridProps {
  products: ReviewRecord[];
  currentMarket: string;
  onSelectProduct: (record: ReviewRecord) => void;
}

export const FlashFeaturedGrid: React.FC<FlashFeaturedGridProps> = ({
  products,
  currentMarket,
  onSelectProduct
}) => {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const market = SUPPORTED_MARKETS.find((m) => m.code === currentMarket) || SUPPORTED_MARKETS[0];

  const categories = ["All", "Smartphones", "Audio", "Laptops", "Wearables", "Smart Home"];

  const filteredProducts = React.useMemo(() => {
    if (selectedCategory === "All") return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  const formatPrice = (usd: number) => {
    switch (currentMarket) {
      case "IN":
        return `₹${(usd * 84).toLocaleString("en-IN")}`;
      case "UK":
        return `£${Math.round(usd * 0.79).toLocaleString()}`;
      case "DE":
      case "FR":
      case "ES":
      case "IT":
      case "NL":
        return `€${Math.round(usd * 0.92).toLocaleString()}`;
      case "JP":
        return `¥${Math.round(usd * 155).toLocaleString()}`;
      default:
        return `$${usd.toLocaleString()}`;
    }
  };

  return (
    <section id="featured-products" className="py-20 px-4 sm:px-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#FFE600] uppercase tracking-wider mb-2 font-mono">
            <Zap className="w-4 h-4 fill-[#FFE600]" />
            <span>Tested Hardware & Algorithmic Scores</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Trending Products Analyzed by Flash AI
          </h2>
        </div>
        <div className="text-xs text-zinc-400 font-mono">
          Showing regional prices for <span className="text-[#FFE600] font-bold">{market.name} ({market.code})</span>
        </div>
      </div>

      {/* Category Pillar Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-[#FFE600] text-black shadow-[0_0_15px_rgba(255,230,0,0.3)]"
                : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((item) => {
          const score = Math.round(item.rating * 20);
          const affiliateUrl = `/api/affiliate/redirect?market=${currentMarket}&asin=${item.amazonAsin}&q=${encodeURIComponent(item.name)}`;

          return (
            <article
              key={item.slug}
              className="bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700 rounded-3xl p-6 flex flex-col justify-between transition-all duration-200 group relative overflow-hidden shadow-xl"
            >
              <div>
                {/* Header: Brand & Score */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#FFE600] bg-[#FFE600]/10 border border-[#FFE600]/20 px-2.5 py-1 rounded-lg">
                      {item.brand}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {item.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-lg">
                    <span className="text-xs font-black text-white font-mono">{score}</span>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase">/ 100</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-[#FFE600] transition-colors mb-2 leading-snug">
                  <a
                    href={`/review/${item.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectProduct(item);
                    }}
                    className="block focus:outline-none"
                  >
                    {item.name}
                  </a>
                </h3>

                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-4">
                  {item.summary}
                </p>

                {/* Top strength bullet */}
                {item.pros && item.pros.length > 0 && (
                  <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/60 mb-4 text-xs text-zinc-300 flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{item.pros[0]}</span>
                  </div>
                )}
              </div>

              {/* Bottom: Price and Actions */}
              <div className="pt-4 border-t border-zinc-900 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase font-mono">Verified Price</span>
                  <span className="text-base font-black text-white font-mono">{formatPrice(item.priceUSD)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`/review/${item.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectProduct(item);
                    }}
                    className="text-xs font-bold text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    Full Review
                  </a>
                  <a
                    href={affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow sponsored"
                    className="text-xs font-extrabold bg-[#FFE600] hover:bg-[#ffe81a] text-black px-3 py-2 rounded-xl transition-all shadow-[0_0_15px_rgba(255,230,0,0.25)] flex items-center gap-1 active:scale-95"
                  >
                    <span>Amazon</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
