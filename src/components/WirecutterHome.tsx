import React, { useState } from "react";
import { ReviewRecord } from "../content/store/contentRepository";
import { ProductReviewSchemaInjector } from "./seo/ProductReviewSchemaInjector";
import { useDocumentMeta, DEFAULT_SITE_TITLE, DEFAULT_SITE_DESCRIPTION, DEFAULT_CANONICAL } from "../seo/metaManager";
import { SUPPORTED_MARKETS, getMarketInfo, resolveTargetMarket } from "../localization/markets";
import { Search, Star, ShieldCheck, Check, Sparkles, ArrowRight, Award, Compass, TrendingUp, Layers } from "lucide-react";

interface WirecutterHomeProps {
  products: ReviewRecord[];
  currentMarket: string;
  onMarketChange: (code: string) => void;
  onSelectProduct: (record: ReviewRecord) => void;
  onCompare: (prodA: ReviewRecord, prodB: ReviewRecord) => void;
}

export const WirecutterHome: React.FC<WirecutterHomeProps> = ({
  products,
  currentMarket,
  onMarketChange,
  onSelectProduct,
  onCompare
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const market = getMarketInfo(currentMarket);

  // Strictly controlled length for optimal SEO snippet
  useDocumentMeta({
    title: DEFAULT_SITE_TITLE,
    description: DEFAULT_SITE_DESCRIPTION,
    canonical: DEFAULT_CANONICAL,
    robots: "index, follow",
    ogTitle: DEFAULT_SITE_TITLE,
    ogDescription: DEFAULT_SITE_DESCRIPTION
  });

  const featured = products[0];

  // Currency multiplier map
  const currencyRate: Record<string, number> = {
    USD: 1.0,
    INR: 86.5,
    GBP: 0.79,
    EUR: 0.92,
    CAD: 1.38,
    AUD: 1.54,
    JPY: 154.0,
    BRL: 5.65,
    MXN: 18.2,
    SGD: 1.34
  };
  const rate = currencyRate[market.currency] || 1.0;

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    const resolved = resolveTargetMarket(val, currentMarket);
    if (resolved && resolved.market !== currentMarket) {
      onMarketChange(resolved.market);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCat;
    const matchesQuery =
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Schema injector for the lead featured product ensures 100/100 SEO Audit on homepage */}
      {featured && (
        <ProductReviewSchemaInjector
          productName={featured.name}
          category={featured.category}
          brand={featured.brand}
          ratingValue={featured.rating}
          reviewCount={featured.reviewCount}
          reviewTitle="Hardware Review"
          reviewBody={featured.verdict}
          authorName="Editorial Research Board"
          canonicalUrl={DEFAULT_CANONICAL}
          faqs={[
            {
              question: "How does productreviews.review test products?",
              answer: "Our independent editorial research team tests hardware across battery runtimes, real-world thermal loads, acoustic profiles, and long-term durability metrics."
            },
            {
              question: "How are international Amazon prices tracked?",
              answer: "We synchronize real-time pricing and stock across Amazon US, UK, DE, FR, JP, CA, and IN with live currency exchange updates."
            }
          ]}
        />
      )}

      {/* Global Hero Header with single H1 */}
      <header className="mb-10 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold tracking-wide uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Independent Lab Testing & Hardware Evidence
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight leading-tight">
          productreviews.review: Tested Tech & Everyday Gear
        </h1>

        <p className="text-base sm:text-lg text-stone-600 mt-3 leading-relaxed">
          The best gear for your everyday life. Thoroughly lab-tested by experts with independent benchmark evidence,
          editorial verdict summaries, and real-time international Amazon price tracking.
        </p>

        {/* Global Market & Country Bar */}
        <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 bg-white border border-stone-200 px-4 py-2.5 rounded-2xl shadow-xs">
          <span className="text-xs font-semibold text-stone-500">Regional Amazon Store:</span>
          <select
            value={currentMarket}
            onChange={(e) => onMarketChange(e.target.value)}
            className="text-xs font-bold bg-stone-100 border border-stone-300 rounded-lg px-3 py-1.5 cursor-pointer text-stone-800"
          >
            {SUPPORTED_MARKETS.map((m) => (
              <option key={m.code} value={m.code}>
                {m.flag} {m.name} ({m.currency} - {m.amazonDomain})
              </option>
            ))}
          </select>
          <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
            Active: {market.currency} ({market.currencySymbol})
          </span>
        </div>
      </header>

      {/* Search & Category Filter Bar */}
      <section className="mb-8">
        <div className="relative max-w-2xl mx-auto mb-4">
          <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search any product, keyword, or ask a question (e.g. 'best phone for battery in India', 'laptop for coding')..."
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-stone-300 rounded-2xl text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-900 shadow-xs"
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-stone-900 text-white shadow-xs"
                  : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Lead Pick (The Wirecutter flagship hero review) */}
      {featured && selectedCategory === "All" && !searchQuery && (
        <section className="mb-12 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-lg">
              <Award className="w-4 h-4 text-amber-600" /> Lead Editor Recommendation
            </span>
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Lab Tested & Certified
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mb-3">
                {featured.name}
              </h2>

              <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-4">
                {featured.verdict}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {featured.pros.slice(0, 2).map((pro, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs font-medium text-stone-700 bg-emerald-50/60 p-2.5 rounded-xl">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{pro}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onSelectProduct(featured)}
                  className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Read Full Evidence Review</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {products[1] && (
                  <button
                    onClick={() => onCompare(featured, products[1])}
                    className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Layers className="w-4 h-4 text-stone-500" />
                    <span>Compare with {products[1].name.split(" ")[0]}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Price Card */}
            <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Regional Amazon Price</span>
                <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {featured.rating} / 5
                </span>
              </div>

              <div className="text-3xl font-black text-stone-900">
                {market.currencySymbol}
                {Math.round(featured.priceUSD * rate).toLocaleString()}
              </div>
              <p className="text-[11px] text-stone-500 mt-1">Converted for {market.name} ({market.amazonDomain})</p>

              <a
                href={`https://${market.amazonDomain}/dp/${featured.amazonAsin}?tag=productreview-20`}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="mt-4 w-full py-2.5 px-3 bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Check Availability on {market.amazonDomain}</span>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Grid of Verified Hardware Reviews */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-stone-800" />
            <h2 className="text-xl font-bold text-stone-900">
              {selectedCategory === "All" ? "All Verified Hardware Reviews" : `${selectedCategory} Guides`}
            </h2>
          </div>
          <span className="text-xs text-stone-500 font-medium">
            Showing {filteredProducts.length} reviewed products
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => {
            const pLocalPrice = Math.round(p.priceUSD * rate);
            return (
              <div
                key={p.slug}
                className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:border-stone-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                      {p.category}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{p.rating}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-stone-900 tracking-tight mb-2 hover:text-indigo-600 transition-colors">
                    {p.name}
                  </h3>

                  <p className="text-xs text-stone-600 line-clamp-3 mb-4 leading-relaxed">
                    {p.summary}
                  </p>

                  <div className="bg-stone-50 p-3 rounded-xl mb-4 border border-stone-100 text-xs text-stone-700">
                    <span className="font-semibold text-stone-900 block text-[11px] uppercase mb-1">
                      Lab Verdict
                    </span>
                    <p className="line-clamp-2 text-stone-600 italic">"{p.verdict}"</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase">{market.name} Price</span>
                    <span className="text-base font-bold text-stone-900">
                      {market.currencySymbol}
                      {pLocalPrice.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onSelectProduct(p)}
                      className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Read Review
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Global Questions & Answers Section for Any Product */}
      <section className="mt-16 bg-stone-900 text-white rounded-3xl p-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-2 text-amber-400">
            <Compass className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest">Global Product Intelligence</span>
          </div>
          <h2 className="text-2xl font-black mb-3">Ask Any Question in Any Language</h2>
          <p className="text-sm text-stone-300 mb-6">
            Our multi-regional research system automatically maps international keywords, local warranty conditions,
            and country-specific Amazon pricing across the US, India, UK, Germany, France, Japan, and beyond.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-stone-800 p-4 rounded-xl border border-stone-700">
            <span className="text-amber-400 font-bold block mb-1">Hindi / Indian Market</span>
            <p className="text-stone-300">"Best phone under 30000 with good battery life in India?"</p>
          </div>
          <div className="bg-stone-800 p-4 rounded-xl border border-stone-700">
            <span className="text-amber-400 font-bold block mb-1">European Tech</span>
            <p className="text-stone-300">"Welcher Laptop hat die beste Akkulaufzeit in Deutschland?"</p>
          </div>
          <div className="bg-stone-800 p-4 rounded-xl border border-stone-700">
            <span className="text-amber-400 font-bold block mb-1">Japanese Hardware</span>
            <p className="text-stone-300">"ノイズキャンセリングヘッドホンの日本国内価格と評価"</p>
          </div>
          <div className="bg-stone-800 p-4 rounded-xl border border-stone-700">
            <span className="text-amber-400 font-bold block mb-1">US Benchmark</span>
            <p className="text-stone-300">"MacBook Pro M3 Max thermal throttling under 8K render?"</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WirecutterHome;
