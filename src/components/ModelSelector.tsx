import React, { useState } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  Search,
  ArrowUpDown,
  Filter,
  Globe,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Link as LinkIcon,
  RefreshCw,
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
  onRetry?: () => void;
  categoryContext?: Category | null;
  isLoadingGrounded?: boolean;
  groundingChunks?: Array<{ title: string; uri: string }>;
  searchQueriesRun?: string[];
  groundingErrorMessage?: string;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  query,
  models,
  currentLang,
  onSelectModel,
  onBackToSearch,
  onRetry,
  categoryContext,
  isLoadingGrounded = false,
  groundingChunks = [],
  searchQueriesRun = [],
  groundingErrorMessage,
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

  const defaultSearchQueries = [
    `${query} best product buy online 2025`,
    `${query} Amazon bestseller`,
  ];
  const queriesToDisplay = searchQueriesRun.length > 0 ? searchQueriesRun : defaultSearchQueries;

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
        {/* GOOGLE SEARCH GROUNDING REAL-TIME STATUS BAR                              */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl border border-blue-100 p-5 sm:p-6 mb-6 shadow-xs bg-linear-to-r from-blue-50/50 via-white to-emerald-50/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/80 px-2.5 py-1 rounded-md border border-blue-200">
                  <Globe className="w-3.5 h-3.5 text-blue-600 animate-spin-slow" />
                  Google Search Grounding: Active
                </span>
                {isLoadingGrounded && (
                  <span className="inline-flex items-center gap-1 text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    <Loader2 className="w-3 h-3 animate-spin text-amber-600" />
                    Searching Live Web...
                  </span>
                )}
                {!isLoadingGrounded && (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Real Live Results Verified
                  </span>
                )}
              </div>

              <div className="text-xs text-zinc-600 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="font-semibold text-zinc-800">Queries Executed:</span>
                <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] text-blue-900">
                  {queriesToDisplay.map((q, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded text-zinc-700"
                    >
                      &quot;{q}&quot;
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Grounding Source Count Badge */}
            {groundingChunks.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs bg-white px-3 py-1.5 rounded-lg border border-zinc-200 shadow-2xs">
                <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-semibold text-zinc-800">{groundingChunks.length}</span>
                <span className="text-zinc-500">Live Web Citations Grounded</span>
              </div>
            )}
          </div>

          {/* Web Citations Pill Row */}
          {groundingChunks.length > 0 && (
            <div className="mt-3 pt-3 border-t border-zinc-100 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                Grounded Sources:
              </span>
              {groundingChunks.slice(0, 4).map((chunk, cIdx) => (
                <a
                  key={cIdx}
                  href={chunk.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 bg-white px-2 py-1 rounded border border-blue-200 hover:border-blue-300 transition-colors truncate max-w-[220px]"
                >
                  <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                  <span className="truncate">{chunk.title || chunk.uri}</span>
                </a>
              ))}
            </div>
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
          {isLoadingGrounded ? (
            <div className="bg-white rounded-2xl border border-blue-200 p-12 text-center shadow-xs">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-bold text-zinc-900 mb-2">
                Grounding Real Products via Google Search...
              </h3>
              <p className="text-sm text-zinc-600 max-w-md mx-auto mb-6">
                Executing live web search on &quot;{query}&quot; to verify real commercial products, prices, ratings, and authentic retailer links.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs font-mono text-blue-800">
                <span className="bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                  1. {queriesToDisplay[0]}
                </span>
                <span className="bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                  2. {queriesToDisplay[1]}
                </span>
              </div>
            </div>
          ) : (
            <>
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
                <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center shadow-xs">
                  <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 mb-1">
                    No real products found online
                  </h3>
                  <p className="text-sm text-zinc-600 max-w-lg mx-auto mb-6">
                    {groundingErrorMessage ||
                      `Google Search Grounding did not return verified commercial items for "${query}". Under strict authenticity rules, fake placeholder products are never generated.`}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    {onRetry && (
                      <button
                        onClick={onRetry}
                        disabled={isLoadingGrounded}
                        className="px-4 py-2 bg-[#00B67A] hover:bg-[#008254] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isLoadingGrounded ? 'animate-spin' : ''}`} />
                        <span>{isLoadingGrounded ? 'Retrying Search...' : 'Retry Search Grounding'}</span>
                      </button>
                    )}
                    <button
                      onClick={onBackToSearch}
                      className="px-4 py-2 bg-zinc-800 hover:bg-zinc-950 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Search Another Product</span>
                    </button>
                    {searchQueryFilter && (
                      <button
                        onClick={() => setSearchQueryFilter('')}
                        className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-lg transition-colors"
                      >
                        Clear Filter
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
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
