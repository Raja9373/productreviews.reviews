import React from "react";
import { ReviewRecord } from "../content/store/contentRepository";
import { ProductReviewSchemaInjector } from "./seo/ProductReviewSchemaInjector";
import { useDocumentMeta } from "../seo/metaManager";
import { getMarketInfo } from "../localization/markets";
import { Star, ShieldCheck, ArrowLeft } from "lucide-react";

interface WirecutterViewProps {
  category: string;
  products: ReviewRecord[];
  currentMarket: string;
  onSelectProduct: (record: ReviewRecord) => void;
  onBack: () => void;
}

export const WirecutterView: React.FC<WirecutterViewProps> = ({
  category,
  products,
  currentMarket,
  onSelectProduct,
  onBack
}) => {
  const market = getMarketInfo(currentMarket);
  const filtered = products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  const topPick = filtered[0] || products[0];

  const title = `The Best ${category} of 2026: Tested Reviews`;
  const desc = `Independent lab tests, benchmark rankings, and Amazon pricing across global stores to find the absolute best ${category.toLowerCase()} for your needs.`;
  const canonicalUrl = `https://productreviews.review/?category=${encodeURIComponent(category.toLowerCase())}`;

  useDocumentMeta({
    title,
    description: desc,
    canonical: canonicalUrl,
    robots: "index, follow",
    ogTitle: title,
    ogDescription: desc
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {topPick && (
        <ProductReviewSchemaInjector
          productName={topPick.name}
          category={topPick.category}
          brand={topPick.brand}
          ratingValue={topPick.rating}
          reviewCount={topPick.reviewCount}
          reviewTitle={`Best ${category} Category Review`}
          reviewBody={topPick.verdict}
          authorName="Editorial Research Board"
          canonicalUrl={canonicalUrl}
          breadcrumbs={[
            { name: "Home", url: "https://productreviews.review/" },
            { name: category, url: canonicalUrl }
          ]}
        />
      )}

      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>

      <header className="mb-8 border-b border-stone-200 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider bg-stone-900 text-white px-2.5 py-1 rounded">
            Category Guide
          </span>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Benchmarks Verified
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
          The Best {category} of 2026: Tested Reviews
        </h1>

        <p className="text-stone-600 text-sm sm:text-base mt-2">
          After extensive laboratory evaluations and real-world testing, here are our tested recommendations for {category.toLowerCase()} across {market.name}.
        </p>
      </header>

      {/* Top Pick Highlight */}
      {topPick && (
        <div className="bg-amber-50/70 border-2 border-amber-400 p-6 rounded-2xl mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-800 block mb-1">
            Our Top Recommended Pick
          </span>
          <h2 className="text-2xl font-black text-stone-900 mb-2">{topPick.name}</h2>
          <p className="text-sm text-stone-700 leading-relaxed mb-4">{topPick.verdict}</p>
          <button
            onClick={() => onSelectProduct(topPick)}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Read Complete Review
          </button>
        </div>
      )}

      {/* Product List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.slug}
            className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-stone-500 uppercase">{item.brand}</span>
                <span className="text-stone-300">•</span>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{item.rating}</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-stone-900">{item.name}</h3>
              <p className="text-xs text-stone-600 mt-1 max-w-xl">{item.summary}</p>
            </div>

            <button
              onClick={() => onSelectProduct(item)}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xl font-semibold text-xs transition-colors shrink-0 cursor-pointer"
            >
              View Evidence
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WirecutterView;
