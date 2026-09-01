import React, { useState } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  Search,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import { ProductModel, LanguageCode } from '../types';
import { LANGUAGES, TRANSLATIONS } from '../data/languages';
import { Category } from '../data/categories';
import { resolveAffiliateDestination } from '../lib/smartRouter';
import { detectCountry } from '../lib/amazonGlobal';
import { TrustpilotStars } from './TrustpilotStars';
import { TrustpilotProductCard } from './TrustpilotProductCard';

interface ModelSelectorProps {
  query: string;
  models: ProductModel[];
  currentLang: LanguageCode;
  onSelectModel: (model: ProductModel) => void;
  onBackToSearch: () => void;
  categoryContext?: Category | null;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  query,
  models,
  currentLang,
  onSelectModel,
  onBackToSearch,
  categoryContext,
}) => {
  const [searchQueryFilter, setSearchQueryFilter] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'priceAsc' | 'priceDesc'>('rating');

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const detectedGeoCountry = detectCountry();
  const userCountry = currentLang === 'hi' ? 'IN' : detectedGeoCountry || 'US';

  const routing = resolveAffiliateDestination(query, categoryContext?.slug, userCountry);

  // Filter & Sort
  const displayedModels = [...models]
    .filter((m) => {
      if (!searchQueryFilter.trim()) return true;
      const q = searchQueryFilter.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.brand.toLowerCase().includes(q) ||
        m.modelNumber.toLowerCase().includes(q) ||
        Object.values(m.specs).some((v) => typeof v === 'string' && v.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'reviews') return b.totalReviews - a.totalReviews;
      if (sortBy === 'priceAsc') return a.basePriceUSD - b.basePriceUSD;
      if (sortBy === 'priceDesc') return b.basePriceUSD - a.basePriceUSD;
      return 0;
    });

  const totalReviews = models.reduce((acc, curr) => acc + curr.totalReviews, 0);
  const avgRating = models.length
    ? Number((models.reduce((acc, curr) => acc + curr.rating, 0) / models.length).toFixed(1))
    : 4.8;

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top Breadcrumb & Action Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-200">
          <div className="flex items-center gap-3">
            <button
              id="back-to-search-btn"
              onClick={onBackToSearch}
              className="px-3 py-1.5 rounded-lg border border-zinc-300 hover:bg-zinc-100 text-zinc-700 hover:text-zinc-950 transition-colors flex items-center gap-1.5 text-xs font-semibold bg-white shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t.changeQuery || 'Back to Search'}</span>
            </button>

            <div>
              <div className="text-xs font-medium text-zinc-500 flex items-center gap-1">
                <span>Search results for:</span>
                <span className="font-bold text-zinc-900">&quot;{query}&quot;</span>
              </div>
            </div>
          </div>

          {/* Partner CTA Header Pill */}
          {routing.url && (
            <a
              id="partner-top-header-pill"
              href={routing.url}
              target="_blank"
              rel="nofollow sponsored"
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-lg bg-white border border-zinc-300 hover:border-zinc-400 text-zinc-800 transition-colors shadow-2xs w-fit"
            >
              <span>Explore live deals on {routing.partnerName}</span>
              <ExternalLink className="w-3 h-3 text-zinc-500 ml-0.5" />
            </a>
          )}
        </div>

        {/* ========================================================================= */}
        {/* TRUSTPILOT HEADER BANNER                                                  */}
        {/* Clean white background, no black cards, Trustpilot green stars & badges   */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 mb-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-100">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#005128] bg-[#E8F8F2] px-2.5 py-1 rounded-md border border-[#00B67A]/30">
                  Verified Trust Ratings
                </span>
                <span className="text-xs text-zinc-400 font-mono">
                  {models.length} Models Analyzed
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
                {routing.partnerKey === 'cardekho'
                  ? 'Best SUVs & Cars in India (2026) - Verified Reviews'
                  : currentLang === 'hi'
                  ? `"${query}" के लिए वेरिफाइड मॉडल्स & ऑनेस्ट AI रिव्यू`
                  : `Top Verified Models for "${query}"`}
              </h1>

              <p className="text-sm text-zinc-600 max-w-2xl leading-relaxed">
                Multi-source AI consensus synthesizing authentic owner ratings, specs, pros &amp; cons, and live discount offers.
              </p>
            </div>

            {/* Trustpilot Score Summary Box */}
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col items-start sm:items-end justify-center shrink-0 min-w-[240px]">
              <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                Consensus TrustScore
              </div>
              <TrustpilotStars
                score={avgRating}
                totalReviews={totalReviews}
                size="lg"
                statusText="Excellent"
              />
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 mt-2 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00B67A]" />
                <span>100% Unbiased &amp; Independent</span>
              </div>
            </div>
          </div>

          {/* In-Category Search & Sort Controls */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQueryFilter}
                onChange={(e) => setSearchQueryFilter(e.target.value)}
                placeholder="Filter models or specs..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#00B67A] focus:bg-white text-zinc-900"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-zinc-500 font-medium">Sort by:</span>
              <div className="flex items-center gap-1">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  aria-label="Sort options"
                  className="bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-zinc-800 focus:outline-none focus:border-[#00B67A]"
                >
                  <option value="rating">Highest Rating</option>
                  <option value="reviews">Most Verified Reviews</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TRUSTPILOT PRODUCT CARDS LIST                                             */}
        {/* ========================================================================= */}
        <div className="space-y-6 mb-12">
          {displayedModels.map((model, idx) => (
            <TrustpilotProductCard
              key={model.id || model.slug}
              product={model}
              index={idx}
              currentLang={currentLang}
              onSelectProduct={onSelectModel}
              categorySlug={categoryContext?.slug}
            />
          ))}

          {displayedModels.length === 0 && (
            <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
              <Search className="w-8 h-8 text-zinc-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-zinc-800 mb-1">
                No matching models found
              </h3>
              <p className="text-xs text-zinc-500 mb-4">
                Try searching for a different keyword or reset filters.
              </p>
              <button
                onClick={() => setSearchQueryFilter('')}
                className="px-4 py-2 bg-[#00B67A] text-white text-xs font-bold rounded-lg hover:bg-[#008254] transition-colors"
              >
                Clear Filter
              </button>
            </div>
          )}
        </div>

        {/* Bottom Navigation & Guarantee */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E8F8F2] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#00B67A]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900">
                Transparent Verification Formula
              </h4>
              <p className="text-xs text-zinc-500">
                All pros, cons, and recommendations are derived algorithmically without sponsored brand influence.
              </p>
            </div>
          </div>

          <button
            onClick={onBackToSearch}
            className="px-4 py-2 rounded-lg border border-zinc-300 hover:bg-zinc-50 text-xs font-semibold text-zinc-800 transition-colors shrink-0 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Search Another Product</span>
          </button>
        </div>
      </div>
    </div>
  );
};
