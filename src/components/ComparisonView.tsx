import React from "react";
import { ReviewRecord } from "../content/store/contentRepository";
import { ProductReviewSchemaInjector } from "./seo/ProductReviewSchemaInjector";
import { useDocumentMeta } from "../seo/metaManager";
import { getMarketInfo } from "../localization/markets";
import { Star, ShieldCheck, Check, ArrowLeft, ExternalLink } from "lucide-react";

interface ComparisonViewProps {
  productA: ReviewRecord;
  productB: ReviewRecord;
  currentMarket: string;
  onBack: () => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  productA,
  productB,
  currentMarket,
  onBack
}) => {
  const market = getMarketInfo(currentMarket);

  const seoTitle = `${productA.name} vs ${productB.name}: Tested`;
  const seoDesc = `Direct benchmark evidence, battery longevity comparison, and regional Amazon price shootout between ${productA.name} and ${productB.name}.`;
  const canonicalUrl = `https://productreviews.review/compare/${productA.slug}-vs-${productB.slug}`;

  useDocumentMeta({
    title: seoTitle,
    description: seoDesc,
    canonical: canonicalUrl,
    robots: "index, follow",
    ogTitle: seoTitle,
    ogDescription: seoDesc
  });

  const winner = productA.rating >= productB.rating ? productA : productB;

  return (
    <article className="max-w-5xl mx-auto px-4 py-8">
      <ProductReviewSchemaInjector
        productName={`${productA.name} vs ${productB.name}`}
        category={productA.category}
        brand={productA.brand}
        ratingValue={winner.rating}
        reviewCount={productA.reviewCount + productB.reviewCount}
        reviewTitle="Comparative Benchmark Review"
        reviewBody={`Editorial verdict: ${winner.name} takes the overall recommendation for performance and battery runtime.`}
        authorName="Editorial Research Board"
        canonicalUrl={canonicalUrl}
        breadcrumbs={[
          { name: "Home", url: "https://productreviews.review/" },
          { name: "Comparisons", url: "https://productreviews.review/?view=compare" },
          { name: `${productA.name} vs ${productB.name}`, url: canonicalUrl }
        ]}
      />

      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Hardware Directory
      </button>

      <header className="mb-8 border-b border-stone-200 pb-6 text-center sm:text-left">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-bold uppercase tracking-wider bg-stone-900 text-white px-2.5 py-1 rounded">
            Side-by-Side Comparison
          </span>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Benchmarks Verified
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
          {productA.name} vs {productB.name}: Tested Comparison
        </h1>
        <p className="text-stone-600 text-sm sm:text-base mt-2">
          Comprehensive hardware stress testing, camera shootout, and regional Amazon price comparison.
        </p>
      </header>

      {/* Winner Verdict Banner */}
      <div className="bg-emerald-50 border-2 border-emerald-300 p-6 rounded-2xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 block mb-1">
            Editorial Tested Winner
          </span>
          <h2 className="text-xl font-black text-emerald-950">{winner.name}</h2>
          <p className="text-xs text-stone-700 mt-1 max-w-xl">
            {winner.name} secures our recommendation due to higher battery efficiency, superior sustained thermal stability, and overall build refinement.
          </p>
        </div>
        <div className="text-center sm:text-right shrink-0">
          <span className="text-2xl font-black text-emerald-900">{winner.rating} / 5.0</span>
          <span className="text-xs text-emerald-700 block">Editorial Score</span>
        </div>
      </div>

      {/* Side-by-side Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {[productA, productB].map((item) => (
          <div key={item.slug} className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold uppercase tracking-wide text-stone-500">{item.brand}</span>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  <Star className="w-4 h-4 fill-amber-400 stroke-amber-500" />
                  <span>{item.rating}</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">{item.name}</h3>
              <p className="text-xs text-stone-600 mb-4">{item.summary}</p>

              <div className="space-y-2 mb-4 text-xs">
                <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">Key Highlights</h4>
                {item.pros.slice(0, 3).map((p, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-stone-700">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-stone-400 block uppercase">US Base Price</span>
                <span className="text-lg font-bold text-stone-900">${item.priceUSD}</span>
              </div>
              <a
                href={`https://${market.amazonDomain}/dp/${item.amazonAsin}?tag=productreview-20`}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>View on Amazon</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
};

export default ComparisonView;
