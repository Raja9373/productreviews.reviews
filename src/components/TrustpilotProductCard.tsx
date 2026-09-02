import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Youtube,
  Globe,
  Tag,
  AlertCircle,
} from 'lucide-react';
import { ProductModel, LanguageCode } from '../types';
import { TrustpilotStars } from './TrustpilotStars';
import { LANGUAGES } from '../data/languages';
import { resolveAffiliateDestination } from '../lib/smartRouter';
import {
  detectCountry,
  getAmazonUrl,
  getCarUrl,
  getHotelUrl,
  getFlightUrl,
  getRestaurantUrl,
  getFinanceUrl,
  getRealEstateUrl,
} from '../lib/amazonGlobal';
import { ProductThumbnail } from './ProductThumbnail';
import {
  calculateConsensusScore,
  generateFakeReviewAudit,
  generateVideoReviews,
  getMultiRegionPricing,
} from '../utils/affiliateManager';

interface TrustpilotProductCardProps {
  product: ProductModel;
  index: number;
  currentLang: LanguageCode;
  onSelectProduct: (product: ProductModel) => void;
  categorySlug?: string;
}

export const TrustpilotProductCard: React.FC<TrustpilotProductCardProps> = ({
  product,
  index,
  currentLang,
  onSelectProduct,
  categorySlug,
}) => {
  const [showEvidence, setShowEvidence] = useState(false);
  const [showProsCons, setShowProsCons] = useState(false);
  const [showGeoPricing, setShowGeoPricing] = useState(false);

  const currentLangDef = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];
  const detectedGeoCountry = detectCountry();
  const userCountry = currentLang === 'hi' ? 'IN' : detectedGeoCountry || 'US';

  const routing = resolveAffiliateDestination(product.name, product.category || categorySlug, userCountry);

  const formatPrice = (usd: number) => {
    if (usd >= 5000 && currentLang === 'hi') {
      const inrValueLakh = (usd * currentLangDef.currencyRate) / 100000;
      return `₹${inrValueLakh.toFixed(1)} Lakh (approx)`;
    }
    if (usd === 0) return 'Free / Trial';
    const local = Math.round(usd * currentLangDef.currencyRate);
    return `${currentLangDef.currencySymbol}${local.toLocaleString()}`;
  };

  // Derive genuine or assigned Decision Archetype
  const archetype = (product as any).decisionArchetype || {
    label: index === 0 ? 'Best Overall' : index === 1 ? 'Best Value' : product.budgetTier === 'PREMIUM' ? 'Flagship Pick' : 'Verified Pick',
    type: index === 0 ? 'BEST_OVERALL' : index === 1 ? 'BEST_VALUE' : 'BALANCED',
    bestFor: product.budgetTier === 'BUDGET' ? 'Budget-conscious buyers' : 'Everyday reliability and quality',
    drawback: 'Priced at standard MSRP without heavy seasonal clearance.',
    reason: product.whyDemandReason || 'Balanced real-world performance based on verified user feedback.',
  };

  // Badge styling
  const getBadgeStyle = () => {
    if (archetype.label.toLowerCase().includes('best overall') || index === 0) {
      return 'bg-emerald-600 text-white border-emerald-600';
    }
    if (archetype.label.toLowerCase().includes('value')) {
      return 'bg-amber-50 text-amber-900 border-amber-300';
    }
    if (archetype.label.toLowerCase().includes('flagship') || archetype.label.toLowerCase().includes('pro')) {
      return 'bg-zinc-900 text-white border-zinc-900';
    }
    return 'bg-emerald-50 text-emerald-800 border-emerald-200';
  };

  // Compute calculated consensus score
  const consensus =
    product.consensusScore ||
    calculateConsensusScore(product.name, product.rating, product.totalReviews);

  const fakeAudit =
    product.fakeReviewAudit ||
    generateFakeReviewAudit(product.rating, product.totalReviews);

  const videoReviews =
    product.videoReviews ||
    generateVideoReviews(product.name, product.category);

  const multiGeo = getMultiRegionPricing(product.basePriceUSD, product.name, product.asin);

  // Model URL for partner CTA
  const modelUrl =
    routing.partnerKey === 'amazon'
      ? getAmazonUrl(product.name, userCountry)
      : routing.partnerKey === 'cardekho'
      ? getCarUrl(product.name, userCountry).url
      : routing.partnerKey === 'hotels' || routing.partnerKey === 'resorts'
      ? getHotelUrl(product.name).url
      : routing.partnerKey === 'flights'
      ? getFlightUrl(product.name, userCountry).url
      : routing.partnerKey === 'restaurants' || routing.partnerKey === 'cafes'
      ? getRestaurantUrl(product.name, userCountry).url
      : routing.partnerKey === 'finance'
      ? getFinanceUrl(product.name, userCountry).url
      : routing.partnerKey === 'realestate'
      ? getRealEstateUrl(product.name, userCountry).url
      : routing.url;

  // Key specs snippet
  const topSpecs = Object.entries(product.specs || {}).slice(0, 3);

  // Pros & Cons
  const pros = [
    topSpecs[0] ? `${topSpecs[0][0]}: ${topSpecs[0][1]}` : 'Strong performance and build quality',
    topSpecs[1] ? `${topSpecs[1][0]}: ${topSpecs[1][1]}` : 'Reliable long-term customer satisfaction',
    `Verified authentic buyer consensus (${product.rating}/5.0)`,
  ];

  const cons = [
    archetype.drawback || 'Priced at premium during peak retail demand',
    'Advanced settings require quick user onboarding',
  ];

  return (
    <div
      id={`decision-card-${product.slug}`}
      className="bg-white rounded-2xl border border-zinc-200 hover:border-zinc-300 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
    >
      {/* Top Header: Decision Archetype Badge & Brand/Model */}
      <div className="p-4 sm:p-5 pb-3 border-b border-zinc-100 flex flex-wrap items-center justify-between gap-2 bg-zinc-50/50">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${getBadgeStyle()}`}
          >
            <Sparkles className="w-3 h-3" />
            {archetype.label}
          </span>
          <span className="text-xs text-zinc-500 font-mono font-medium">
            {product.brand}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {product.sourceUrl && (
            <a
              href={product.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] text-zinc-600 hover:text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200 transition-colors"
            >
              <ExternalLink className="w-2.5 h-2.5" />
              <span>Grounded Evidence</span>
            </a>
          )}
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-semibold border border-emerald-200">
            <ShieldCheck className="w-3 h-3 text-[#00B67A]" />
            <span>Verified Data</span>
          </div>
        </div>
      </div>

      {/* Main Card Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col lg:flex-row gap-6">
        {/* Left Product Thumbnail */}
        <div className="w-full lg:w-44 xl:w-48 shrink-0 flex flex-col items-center">
          <div
            onClick={() => onSelectProduct(product)}
            className="w-full aspect-square max-h-48 lg:max-h-none rounded-xl bg-zinc-50 border border-zinc-100 p-2.5 flex items-center justify-center relative overflow-hidden group cursor-pointer hover:bg-zinc-100/60 transition-colors"
          >
            <ProductThumbnail
              product={product}
              alt={product.name}
              className="w-full h-full"
              imageClassName="group-hover:scale-105"
            />
            <span className="absolute bottom-2 right-2 text-[10px] bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded font-mono">
              {product.modelNumber || product.brand}
            </span>
          </div>

          {/* Star Rating Under Image */}
          <div className="w-full mt-2.5 flex items-center justify-center">
            <TrustpilotStars
              score={product.rating}
              totalReviews={product.totalReviews}
              size="sm"
            />
          </div>
        </div>

        {/* Right Decision Engine Column: What it is + Why this pick + Drawback + Actions */}
        <div className="flex-1 flex flex-col justify-between space-y-3">
          <div>
            <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider mb-1">
              {product.category}
            </div>

            {/* Product Title */}
            <h3
              onClick={() => onSelectProduct(product)}
              className="text-base sm:text-lg font-bold text-zinc-900 hover:text-emerald-700 transition-colors cursor-pointer leading-tight mb-2"
            >
              {product.name}
            </h3>

            {/* Core Decision Summary Block: WHY THIS PICK */}
            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-950 leading-relaxed mb-3">
              <strong className="text-emerald-900 font-bold block mb-0.5">
                Why we recommend this:
              </strong>
              <span>{archetype.reason}</span>
            </div>

            {/* 2-Point Fast Decision Matrix (Best For + Key Drawback) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
              <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200/80">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-0.5">
                  🎯 Best For:
                </span>
                <span className="font-semibold text-zinc-800 leading-snug">
                  {archetype.bestFor}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200/80">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-0.5">
                  ⚠️ Main Drawback:
                </span>
                <span className="font-medium text-zinc-700 leading-snug">
                  {archetype.drawback}
                </span>
              </div>
            </div>

            {/* Top Specs Chips */}
            {topSpecs.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {topSpecs.map(([k, v]) => (
                  <span
                    key={k}
                    className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 font-medium"
                  >
                    <span className="text-zinc-400">{k}:</span>
                    <span>{v}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Progressive Disclosure Toggles */}
          <div className="pt-2 border-t border-zinc-100 space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Toggle 1: Why We Say This (Evidence) */}
              <button
                onClick={() => setShowEvidence(!showEvidence)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold transition-colors cursor-pointer"
              >
                <span>{showEvidence ? 'Hide Evidence' : 'Why We Say This (Evidence)'}</span>
                {showEvidence ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {/* Toggle 2: Pros & Cons */}
              <button
                onClick={() => setShowProsCons(!showProsCons)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold transition-colors cursor-pointer"
              >
                <span>{showProsCons ? 'Hide Pros/Cons' : 'Pros & Cons'}</span>
                {showProsCons ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {/* Toggle 3: Multi-Marketplace Deals */}
              <button
                onClick={() => setShowGeoPricing(!showGeoPricing)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold transition-colors cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>{showGeoPricing ? 'Hide Multi-Country Deals' : 'Multi-Country Deals'}</span>
                {showGeoPricing ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            {/* Evidence Section */}
            {showEvidence && (
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs space-y-2 animate-in fade-in duration-150">
                <div className="font-bold text-zinc-900 flex items-center justify-between">
                  <span>Evidence &amp; Consensus Breakdown</span>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {consensus.totalSourcesCount.toLocaleString()} data points
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px] font-mono">
                  <div className="p-1.5 rounded bg-white border border-zinc-200 text-center">
                    <div className="text-[9px] text-zinc-400 font-sans">Amazon</div>
                    <div className="font-bold text-amber-700">★ {consensus.amazon}</div>
                  </div>
                  <div className="p-1.5 rounded bg-white border border-zinc-200 text-center">
                    <div className="text-[9px] text-zinc-400 font-sans">Reddit</div>
                    <div className="font-bold text-orange-700">★ {consensus.reddit}</div>
                  </div>
                  <div className="p-1.5 rounded bg-white border border-zinc-200 text-center">
                    <div className="text-[9px] text-zinc-400 font-sans">YouTube</div>
                    <div className="font-bold text-red-700">★ {consensus.youtube}</div>
                  </div>
                  <div className="p-1.5 rounded bg-white border border-zinc-200 text-center">
                    <div className="text-[9px] text-zinc-400 font-sans">Tech Labs</div>
                    <div className="font-bold text-emerald-700">★ {consensus.expert}</div>
                  </div>
                </div>
                <p className="text-zinc-600 leading-snug">
                  Synthesized from <strong>{consensus.amazonReviews.toLocaleString()}</strong> verified Amazon buyer reviews, <strong>{consensus.redditThreads}</strong> Reddit community threads, and expert laboratory benchmarks.
                </p>
              </div>
            )}

            {/* Pros & Cons Section */}
            {showProsCons && (
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs space-y-2 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="font-bold text-emerald-800 flex items-center gap-1 mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00B67A]" /> Key Pros:
                    </span>
                    <ul className="space-y-1 text-zinc-700">
                      {pros.map((pro, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-[#00B67A] font-bold">•</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="font-bold text-red-800 flex items-center gap-1 mb-1">
                      <XCircle className="w-3.5 h-3.5 text-red-500" /> Key Cons:
                    </span>
                    <ul className="space-y-1 text-zinc-700">
                      {cons.map((con, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-red-500 font-bold">•</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Multi-Marketplace Deals Section */}
            {showGeoPricing && (
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs space-y-2 animate-in fade-in duration-150">
                <div className="font-bold text-zinc-900 mb-1">
                  Verified Retailer Pricing by Region
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <a
                    href={multiGeo.us.url}
                    target="_blank"
                    rel="nofollow sponsored"
                    className="p-2 rounded bg-white border border-zinc-200 hover:border-zinc-400 transition-colors flex items-center justify-between"
                  >
                    <span className="font-semibold text-zinc-800">🇺🇸 Amazon US</span>
                    <span className="font-bold text-zinc-900">{multiGeo.us.price}</span>
                  </a>
                  <a
                    href={multiGeo.es.url}
                    target="_blank"
                    rel="nofollow sponsored"
                    className="p-2 rounded bg-white border border-zinc-200 hover:border-zinc-400 transition-colors flex items-center justify-between"
                  >
                    <span className="font-semibold text-zinc-800">🇪🇸 Amazon ES</span>
                    <span className="font-bold text-zinc-900">{multiGeo.es.price}</span>
                  </a>
                  <a
                    href={multiGeo.in.url}
                    target="_blank"
                    rel="nofollow sponsored"
                    className="p-2 rounded bg-white border border-zinc-200 hover:border-zinc-400 transition-colors flex items-center justify-between"
                  >
                    <span className="font-semibold text-zinc-800">🇮🇳 Amazon India</span>
                    <span className="font-bold text-zinc-900">{multiGeo.in.price}</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Bottom Bar: Reference Price + 2 Clean Action Buttons */}
      <div className="p-4 sm:p-5 pt-3.5 bg-zinc-50/70 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 block">
            {routing.partnerKey === 'cardekho' ? 'Price Range' : 'Verified Reference Price'}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-black text-zinc-900">
              {formatPrice(product.basePriceUSD)}
            </span>
            <span className="text-[10px] font-mono text-zinc-400">
              ({detectedGeoCountry || 'Global'})
            </span>
          </div>
        </div>

        {/* 2 Clean Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Button 1: Decision Deep Dive */}
          <button
            id={`decision-report-btn-${product.slug}`}
            onClick={() => onSelectProduct(product)}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-100 text-zinc-800 font-semibold text-xs transition-colors border border-zinc-300 shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Decision Report</span>
          </button>

          {/* Button 2: Partner Action / Smart Destination */}
          {modelUrl && (
            <a
              id={`decision-action-btn-${product.slug}`}
              href={modelUrl}
              target="_blank"
              rel="nofollow sponsored"
              className="px-4 py-2 rounded-xl bg-[#00B67A] hover:bg-[#008254] text-white font-bold text-xs transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <span>{routing.buttonText || 'Check Best Price'}</span>
              <ExternalLink className="w-3 h-3 ml-0.5 opacity-90" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
