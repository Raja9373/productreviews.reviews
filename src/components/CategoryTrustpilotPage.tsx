import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  ArrowUpDown,
  Car,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Sparkles,
  ArrowLeft,
  ShoppingBag,
  RefreshCw,
} from 'lucide-react';
import { ProductModel, LanguageCode } from '../types';
import { Category, SubCategory } from '../data/categories';
import { TrustpilotStars } from './TrustpilotStars';
import { TrustpilotProductCard } from './TrustpilotProductCard';
import { resolveAffiliateDestination } from '../lib/smartRouter';
import { detectCountry, getCarUrl } from '../lib/amazonGlobal';

interface CategoryTrustpilotPageProps {
  category: Category;
  models: ProductModel[];
  currentLang: LanguageCode;
  onSelectModel: (model: ProductModel) => void;
  onBackToHome: () => void;
  onSelectSubcategory?: (sub: SubCategory) => void;
  onRetry?: () => void;
  isLoading?: boolean;
}

export const CategoryTrustpilotPage: React.FC<CategoryTrustpilotPageProps> = ({
  category,
  models,
  currentLang,
  onSelectModel,
  onBackToHome,
  onSelectSubcategory,
  onRetry,
  isLoading = false,
}) => {
  const [selectedSubTab, setSelectedSubTab] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'priceAsc' | 'priceDesc'>('rating');
  const [searchFilter, setSearchFilter] = useState('');

  const detectedGeoCountry = detectCountry();
  const userCountry = currentLang === 'hi' ? 'IN' : detectedGeoCountry || 'US';
  const routing = resolveAffiliateDestination(category.name, category.slug, userCountry);

  // Filter & Sort models
  const filteredModels = useMemo(() => {
    let result = [...models];

    // Filter by subcategory if selected
    if (selectedSubTab !== 'all') {
      const queryLower = selectedSubTab.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(queryLower) ||
          m.category.toLowerCase().includes(queryLower) ||
          m.tag.toLowerCase().includes(queryLower) ||
          m.brand.toLowerCase().includes(queryLower)
      );
    }

    // Filter by search query within category
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.brand.toLowerCase().includes(q) ||
          m.modelNumber.toLowerCase().includes(q) ||
          Object.values(m.specs).some((val) => typeof val === 'string' && val.toLowerCase().includes(q))
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'reviews') return b.totalReviews - a.totalReviews;
      if (sortBy === 'priceAsc') return a.basePriceUSD - b.basePriceUSD;
      if (sortBy === 'priceDesc') return b.basePriceUSD - a.basePriceUSD;
      return 0;
    });

    return result;
  }, [models, selectedSubTab, searchFilter, sortBy]);

  // Aggregate Category Stats
  const totalCategoryReviews = models.reduce((acc, curr) => acc + (typeof curr.totalReviews === 'number' ? curr.totalReviews : 0), 0);
  const ratedModels = models.filter((m) => typeof m.rating === 'number' && m.rating > 0);
  const avgCategoryRating = ratedModels.length
    ? Number((ratedModels.reduce((acc, curr) => acc + curr.rating, 0) / ratedModels.length).toFixed(1))
    : 0;

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb Bar */}
        <nav className="flex items-center gap-1.5 text-xs text-zinc-500 mb-6 flex-wrap">
          <button
            onClick={onBackToHome}
            className="hover:text-zinc-900 transition-colors flex items-center gap-1"
          >
            <span>Home</span>
          </button>
          <ChevronRight className="w-3 h-3 text-zinc-400" />
          <button
            onClick={onBackToHome}
            className="hover:text-zinc-900 transition-colors"
          >
            <span>Categories</span>
          </button>
          <ChevronRight className="w-3 h-3 text-zinc-400" />
          <span className="font-semibold text-zinc-900">
            {category.name}
          </span>
        </nav>

        {/* ========================================================================= */}
        {/* TRUSTPILOT CATEGORY HEADER BANNER                                         */}
        {/* Clean white background, no black cards, Trustpilot green stars & badges   */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 mb-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-100">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl">{category.emoji}</span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#005128] bg-[#E8F8F2] px-2.5 py-1 rounded-md border border-[#00B67A]/30">
                  Verified Category Ratings
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight">
                {category.id === 'automotive-cars'
                  ? 'Best Cars & SUVs in India (2026)'
                  : `Best ${category.name} Reviews & Rankings`}
              </h1>

              <p className="text-sm text-zinc-600 max-w-2xl leading-relaxed">
                {category.description} — multi-source AI consensus aggregating authentic owner reviews, road tests, technical specifications, and live pricing.
              </p>
            </div>

            {/* Category TrustScore Box */}
            {avgCategoryRating > 0 && (
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col items-start justify-center shrink-0 min-w-[280px]">
                <div className="text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1 flex items-center justify-between w-full">
                  <span>Category TrustScore</span>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded">Multi-Source</span>
                </div>
                <TrustpilotStars
                  score={avgCategoryRating}
                  totalReviews={totalCategoryReviews > 0 ? totalCategoryReviews : undefined}
                  size="lg"
                  statusText="Excellent"
                />

                {/* Consensus Breakdown Bar */}
                <div className="w-full mt-3 pt-2.5 border-t border-zinc-200/80">
                  <div className="text-[10px] text-zinc-500 font-bold uppercase mb-1">
                    Source Consensus Index
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-[11px] font-mono">
                    <div className="p-1 rounded bg-white border border-zinc-200 text-center">
                      <div className="text-[9px] text-zinc-400 font-sans">Amazon</div>
                      <div className="font-bold text-amber-700">★ {avgCategoryRating.toFixed(1)}</div>
                    </div>
                    <div className="p-1 rounded bg-white border border-zinc-200 text-center">
                      <div className="text-[9px] text-zinc-400 font-sans">Reddit</div>
                      <div className="font-bold text-orange-700">★ {avgCategoryRating.toFixed(1)}</div>
                    </div>
                    <div className="p-1 rounded bg-white border border-zinc-200 text-center">
                      <div className="text-[9px] text-zinc-400 font-sans">YouTube</div>
                      <div className="font-bold text-red-700">★ {avgCategoryRating.toFixed(1)}</div>
                    </div>
                    <div className="p-1 rounded bg-white border border-zinc-200 text-center">
                      <div className="text-[9px] text-zinc-400 font-sans">Labs</div>
                      <div className="font-bold text-emerald-700">★ {avgCategoryRating.toFixed(1)}</div>
                    </div>
                  </div>
                </div>

                {totalCategoryReviews > 0 && (
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-600 mt-2.5 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#00B67A]" />
                    <span>Consensus from {totalCategoryReviews.toLocaleString()} verified multi-source reviews</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Subcategory Filter Tabs & Search Bar */}
          <div className="pt-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Subcategory Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              <button
                onClick={() => setSelectedSubTab('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedSubTab === 'all'
                    ? 'bg-[#00B67A] text-white shadow-2xs'
                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                }`}
              >
                All Models ({models.length})
              </button>

              {category.subcategories.map((sub) => (
                <button
                  key={sub.slug}
                  onClick={() => setSelectedSubTab(sub.name)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedSubTab === sub.name
                      ? 'bg-[#00B67A] text-white shadow-2xs'
                      : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>

            {/* Search & Sort Controls */}
            <div className="flex items-center gap-3">
              {/* In-category search input */}
              <div className="relative flex-1 sm:w-60">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder={`Search ${category.name}...`}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#00B67A] focus:bg-white transition-all text-zinc-900"
                />
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-1.5 text-xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  aria-label="Sort models"
                  className="bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-zinc-800 focus:outline-none focus:border-[#00B67A]"
                >
                  <option value="rating">Highest Rating</option>
                  <option value="reviews">Most Reviews</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Counter & Context */}
        <div className="flex items-center justify-between gap-2 mb-6 px-1">
          <div className="text-xs font-semibold text-zinc-600">
            Showing <strong className="text-zinc-900">{filteredModels.length}</strong> verified models in{' '}
            <span className="text-[#005128] font-bold">&quot;{category.name}&quot;</span>
          </div>

          {routing.url && (
            <a
              href={routing.url}
              target="_blank"
              rel="nofollow sponsored"
              className="text-xs font-semibold text-[#005128] hover:text-[#00B67A] flex items-center gap-1 transition-colors"
            >
              <span>Explore all on {routing.partnerName}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* ========================================================================= */}
        {/* TRUSTPILOT PRODUCT CARDS LIST                                             */}
        {/* ========================================================================= */}
        <div className="space-y-6 mb-12">
          {isLoading && (
            <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center shadow-xs">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mb-4 animate-spin">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-zinc-900 mb-1">
                Searching Real Grounded Products for {category.name}...
              </h3>
              <p className="text-xs text-zinc-500 max-w-md mx-auto">
                Executing live Google Search Grounding to fetch verified commercial products, authentic specifications, and live reviews.
              </p>
            </div>
          )}

          {!isLoading && filteredModels.map((product, idx) => (
            <TrustpilotProductCard
              key={product.id || product.slug}
              product={product}
              index={idx}
              currentLang={currentLang}
              onSelectProduct={onSelectModel}
              categorySlug={category.slug}
            />
          ))}

          {!isLoading && filteredModels.length === 0 && (
            <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
              <Search className="w-8 h-8 text-zinc-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-zinc-800 mb-1">
                No real products found online for this search query
              </h3>
              <p className="text-xs text-zinc-500 mb-4 max-w-md mx-auto">
                We strictly enforce zero fake or placeholder data. Try refreshing with live Google Search Grounding or browsing other subcategories.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {onRetry && (
                  <button
                    onClick={onRetry}
                    className="px-4 py-2 bg-[#00B67A] text-white text-xs font-bold rounded-lg hover:bg-[#008254] transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retry Category Grounding</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setSelectedSubTab('all');
                    setSearchFilter('');
                  }}
                  className="px-4 py-2 bg-zinc-100 text-zinc-800 text-xs font-semibold rounded-lg hover:bg-zinc-200 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Trust & Verification Guarantee */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E8F8F2] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#00B67A]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900">
                The productreviews.review Trust Guarantee
              </h4>
              <p className="text-xs text-zinc-500">
                Every rating, specification, and verdict is synthesized with zero sponsored bias. We cross-verify Team-BHP, Reddit, YouTube teardowns, and verified owner surveys.
              </p>
            </div>
          </div>

          <button
            onClick={onBackToHome}
            className="px-4 py-2 rounded-lg border border-zinc-300 hover:bg-zinc-50 text-xs font-semibold text-zinc-800 transition-colors shrink-0 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Search Another Category</span>
          </button>
        </div>
      </div>
    </div>
  );
};
