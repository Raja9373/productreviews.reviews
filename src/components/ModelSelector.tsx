import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  Search,
  Loader2,
  RefreshCw,
  Globe,
  Scale,
  HelpCircle,
} from 'lucide-react';
import { ProductModel, LanguageCode } from '../types';
import { TRANSLATIONS } from '../data/languages';
import { Category } from '../data/categories';
import { resolveAffiliateDestination } from '../lib/smartRouter';
import { detectCountry } from '../lib/amazonGlobal';
import { TrustpilotStars } from './TrustpilotStars';
import { TrustpilotProductCard } from './TrustpilotProductCard';
import { ComparisonExperience } from './ComparisonExperience';
import { analyzeSearchIntent, assignDecisionArchetypes } from '../utils/intentDetector';

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
  groundingErrorMessage,
}) => {
  const [searchQueryFilter, setSearchQueryFilter] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'priceAsc' | 'priceDesc'>('rating');

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const detectedGeoCountry = detectCountry();
  const userCountry = currentLang === 'hi' ? 'IN' : detectedGeoCountry || 'US';

  const routing = resolveAffiliateDestination(query, categoryContext?.slug, userCountry);

  // Analyze search intent & constraints
  const intent = useMemo(() => {
    return analyzeSearchIntent(query, currentLang);
  }, [query, currentLang]);

  // Enrich models with decision archetypes
  const enrichedModels = useMemo(() => {
    return assignDecisionArchetypes(models, intent);
  }, [models, intent]);

  // Filter & Sort
  const displayedModels = useMemo(() => {
    return [...enrichedModels]
      .filter((m) => {
        if (!searchQueryFilter.trim()) return true;
        const q = searchQueryFilter.toLowerCase();
        return (
          m.name.toLowerCase().includes(q) ||
          m.brand.toLowerCase().includes(q) ||
          m.modelNumber.toLowerCase().includes(q) ||
          Object.values(m.specs || {}).some((v) => typeof v === 'string' && v.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'reviews') return b.totalReviews - a.totalReviews;
        if (sortBy === 'priceAsc') return a.basePriceUSD - b.basePriceUSD;
        if (sortBy === 'priceDesc') return b.basePriceUSD - a.basePriceUSD;
        return 0;
      });
  }, [enrichedModels, searchQueryFilter, sortBy]);

  const totalReviews = models.reduce(
    (acc, curr) => acc + (typeof curr.totalReviews === 'number' ? curr.totalReviews : 0),
    0
  );
  const modelsWithRating = models.filter((m) => typeof m.rating === 'number' && m.rating > 0);
  const avgRating = modelsWithRating.length
    ? Number((modelsWithRating.reduce((acc, curr) => acc + curr.rating, 0) / modelsWithRating.length).toFixed(1))
    : 0;

  // =========================================================================
  // 1. LOADING STATE
  // =========================================================================
  if (isLoadingGrounded) {
    return (
      <div className="w-full bg-[#FAFAFA] min-h-screen py-16 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-2xl border border-zinc-200 p-8 sm:p-12 text-center shadow-xs">
          <Loader2 className="w-9 h-9 text-[#00B67A] animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-bold text-zinc-900 mb-2">
            Synthesizing Decision Evidence...
          </h2>
          <p className="text-sm text-zinc-600 mb-6">
            Evaluating options, verified owner feedback, and real-world trade-offs for &quot;{query}&quot;
          </p>
          <button
            onClick={onBackToSearch}
            className="px-4 py-2 border border-zinc-300 hover:bg-zinc-50 text-zinc-700 text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. ZERO RESULTS EMPTY STATE (STRICT PURITY)
  // =========================================================================
  if (models.length === 0) {
    return (
      <div className="w-full bg-[#FAFAFA] min-h-screen py-16 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-2xl border border-zinc-200 p-8 sm:p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-4 text-zinc-500">
            <Search className="w-6 h-6" />
          </div>

          <h2 className="text-xl font-bold text-zinc-900 mb-2">
            No reliable evidence for &quot;{query}&quot;
          </h2>

          <p className="text-sm text-zinc-600 mb-6 max-w-md mx-auto leading-relaxed">
            {groundingErrorMessage ||
              `We couldn't verify enough authentic customer feedback or technical data to formulate a confident decision recommendation. Try another query.`}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-4 py-2 bg-[#00B67A] hover:bg-[#008254] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Search</span>
              </button>
            )}
            <button
              onClick={onBackToSearch}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Search Another Query</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. COMPARISON MODE (If user searched A vs B and >= 2 models available)
  // =========================================================================
  if (intent.mode === 'COMPARISON' && models.length >= 2) {
    return (
      <div className="w-full bg-[#FAFAFA] min-h-screen py-6 sm:py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-4">
            <button
              onClick={onBackToSearch}
              className="px-3 py-1.5 rounded-lg border border-zinc-300 hover:bg-zinc-100 text-zinc-700 transition-colors inline-flex items-center gap-1.5 text-xs font-semibold bg-white shadow-2xs cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Search</span>
            </button>
          </div>
          <ComparisonExperience
            itemA={models[0]}
            itemB={models[1]}
            currentLang={currentLang}
            onSelectProduct={onSelectModel}
            onBackToSearch={onBackToSearch}
          />
        </div>
      </div>
    );
  }

  // =========================================================================
  // 4. STANDARD DECISION ENGINE RESULTS VIEW
  // =========================================================================
  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top Breadcrumb Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-200">
          <div className="flex items-center gap-3">
            <button
              id="back-to-search-btn"
              onClick={onBackToSearch}
              className="px-3 py-1.5 rounded-lg border border-zinc-300 hover:bg-zinc-100 text-zinc-700 hover:text-zinc-950 transition-colors flex items-center gap-1.5 text-xs font-semibold bg-white shadow-2xs cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t.changeQuery || 'Back to Search'}</span>
            </button>

            <div>
              <div className="text-xs font-medium text-zinc-500 flex items-center gap-1">
                <span>Decision query:</span>
                <span className="font-bold text-zinc-900">&quot;{query}&quot;</span>
              </div>
            </div>
          </div>

          {/* Partner Action Pill */}
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

        {/* DECISION ENGINE INTENT HEADER */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 mb-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-100">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  {intent.mode === 'RECOMMENDATION_INTENT'
                    ? 'Targeted Intent Match'
                    : intent.mode === 'EXACT_PRODUCT'
                    ? 'Product Decision Summary'
                    : 'Decision Shortlist'}
                </span>
                <span className="text-xs text-zinc-500 font-medium">
                  {models.length} {models.length === 1 ? 'Option' : 'Curated Options'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
                {intent.suggestedHeading}
              </h1>

              <p className="text-sm text-zinc-600 max-w-2xl leading-relaxed">
                {intent.suggestedSubtitle}
              </p>

              {/* Primary User Question Prompt */}
              <div className="inline-flex items-center gap-1.5 text-xs text-zinc-700 bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-200 mt-1 font-medium">
                <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span><strong>Core Question:</strong> {intent.primaryQuestion}</span>
              </div>
            </div>

            {/* TrustScore Summary (if rating available) */}
            {avgRating > 0 && (
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col items-start sm:items-end justify-center shrink-0 min-w-[240px]">
                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                  Category TrustScore
                </div>
                <TrustpilotStars
                  score={avgRating}
                  totalReviews={totalReviews > 0 ? totalReviews : undefined}
                  size="lg"
                  statusText="Excellent"
                />
                <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 mt-2 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00B67A]" />
                  <span>Evidence-Backed Consensus</span>
                </div>
              </div>
            )}
          </div>

          {/* Filter & Sort Bar */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQueryFilter}
                onChange={(e) => setSearchQueryFilter(e.target.value)}
                placeholder="Filter by keyword, feature, or spec..."
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

        {/* CURATED DECISION CARDS */}
        <div className="space-y-6 mb-12">
          {displayedModels.map((model, idx) => (
            <TrustpilotProductCard
              key={model.id || model.slug || `model-${idx}`}
              product={model}
              index={idx}
              currentLang={currentLang}
              onSelectProduct={onSelectModel}
              categorySlug={categoryContext?.slug}
            />
          ))}

          {displayedModels.length === 0 && searchQueryFilter && (
            <div className="bg-white rounded-2xl border border-zinc-200 p-8 text-center shadow-xs">
              <p className="text-sm text-zinc-600 mb-4">
                No products match the filter &quot;{searchQueryFilter}&quot;.
              </p>
              <button
                onClick={() => setSearchQueryFilter('')}
                className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Clear Filter
              </button>
            </div>
          )}
        </div>

        {/* Understated Grounded Sources */}
        {groundingChunks.length > 0 && (
          <div className="bg-white rounded-xl border border-zinc-200 p-4 mb-6 shadow-2xs">
            <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#00B67A]" />
              <span>Grounded Web Citations</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {groundingChunks.slice(0, 4).map((chunk, cIdx) => (
                <a
                  key={cIdx}
                  href={chunk.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-zinc-600 hover:text-zinc-900 bg-zinc-50 hover:bg-zinc-100 px-2.5 py-1 rounded border border-zinc-200 transition-colors truncate max-w-[240px]"
                >
                  <ExternalLink className="w-2.5 h-2.5 shrink-0 text-zinc-400" />
                  <span className="truncate">{chunk.title || chunk.uri}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Navigation Box */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#00B67A]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900">
                Independent Decision Engine
              </h4>
              <p className="text-xs text-zinc-500">
                Evidence synthesized directly from authentic owner reviews, lab teardowns, and verified retail signals.
              </p>
            </div>
          </div>

          <button
            onClick={onBackToSearch}
            className="px-4 py-2 rounded-lg border border-zinc-300 hover:bg-zinc-50 text-xs font-semibold text-zinc-800 transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Search Another Query</span>
          </button>
        </div>
      </div>
    </div>
  );
};
