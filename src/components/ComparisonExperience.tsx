import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ShieldCheck,
  Tag,
  ChevronDown,
  ChevronUp,
  Scale,
} from 'lucide-react';
import { ProductModel, LanguageCode } from '../types';
import { LANGUAGES } from '../data/languages';
import { resolveAffiliateDestination } from '../lib/smartRouter';
import { detectCountry, getAmazonUrl, getCarUrl } from '../lib/amazonGlobal';
import { ProductThumbnail } from './ProductThumbnail';

interface ComparisonExperienceProps {
  itemA: ProductModel;
  itemB: ProductModel;
  currentLang: LanguageCode;
  onSelectProduct: (product: ProductModel) => void;
  onBackToSearch?: () => void;
}

export const ComparisonExperience: React.FC<ComparisonExperienceProps> = ({
  itemA,
  itemB,
  currentLang,
  onSelectProduct,
  onBackToSearch,
}) => {
  const [showDeepSpecs, setShowDeepSpecs] = useState(false);

  const currentLangDef = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];
  const detectedGeoCountry = detectCountry();
  const userCountry = currentLang === 'hi' ? 'IN' : detectedGeoCountry || 'US';

  const routingA = resolveAffiliateDestination(itemA.name, itemA.category, userCountry);
  const routingB = resolveAffiliateDestination(itemB.name, itemB.category, userCountry);

  const formatPrice = (usd: number) => {
    if (usd >= 5000 && currentLang === 'hi') {
      const inrValueLakh = (usd * currentLangDef.currencyRate) / 100000;
      return `₹${inrValueLakh.toFixed(1)} Lakh (approx)`;
    }
    if (usd === 0) return 'Free / Trial';
    const local = Math.round(usd * currentLangDef.currencyRate);
    return `${currentLangDef.currencySymbol}${local.toLocaleString()}`;
  };

  const getUrl = (product: ProductModel, routing: any) => {
    if (routing.partnerKey === 'amazon') return getAmazonUrl(product.name, userCountry);
    if (routing.partnerKey === 'cardekho') return getCarUrl(product.name, userCountry).url;
    return routing.url || getAmazonUrl(product.name, userCountry);
  };

  // Compare ratings & prices
  const priceDiff = itemA.basePriceUSD - itemB.basePriceUSD;
  const ratingDiff = Number((itemA.rating - itemB.rating).toFixed(1));

  // Determine comparison summary
  const isAValue = itemA.basePriceUSD < itemB.basePriceUSD;
  const isAHigherRated = itemA.rating >= itemB.rating;

  const comparisonRows = [
    {
      metric: 'Primary Strength',
      valA: itemA.whyDemandReason || (Object.values(itemA.specs)[0] || 'High customer satisfaction'),
      valB: itemB.whyDemandReason || (Object.values(itemB.specs)[0] || 'Refined build & performance'),
    },
    {
      metric: 'Best For',
      valA: isAValue ? 'Value seekers & everyday workflows' : 'Pro enthusiasts & heavy multitaskers',
      valB: !isAValue ? 'Value seekers & everyday workflows' : 'Pro enthusiasts & heavy multitaskers',
    },
    {
      metric: 'Main Trade-off',
      valA: isAValue ? 'Fewer niche enthusiast extras' : 'Higher investment required',
      valB: !isAValue ? 'Fewer niche enthusiast extras' : 'Higher investment required',
    },
    {
      metric: 'Customer Rating',
      valA: `★ ${itemA.rating}/5.0 (${itemA.totalReviews.toLocaleString()} reviews)`,
      valB: `★ ${itemB.rating}/5.0 (${itemB.totalReviews.toLocaleString()} reviews)`,
    },
    {
      metric: 'Reference Price',
      valA: formatPrice(itemA.basePriceUSD),
      valB: formatPrice(itemB.basePriceUSD),
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-3">
          <Scale className="w-3.5 h-3.5 text-[#00B67A]" />
          <span>Decision Matrix • Side-by-Side Comparison</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
          {itemA.name} <span className="text-zinc-400 font-light">vs</span> {itemB.name}
        </h1>
        <p className="mt-2 text-sm text-zinc-600 max-w-2xl mx-auto">
          Evidence-grounded comparison across verified owner feedback, technical specifications, and market pricing.
        </p>
      </div>

      {/* Decision Verdict Box (THE PRIMARY ANSWER) */}
      <div className="bg-zinc-900 text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-md border border-zinc-800">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400 mb-3">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>The Bottom Line Verdict</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 pt-4 border-t border-zinc-800">
          {/* Verdict A */}
          <div className="p-4 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-zinc-100">{itemA.name}</span>
                <span className="text-xs font-mono text-emerald-400 font-bold">{formatPrice(itemA.basePriceUSD)}</span>
              </div>
              <div className="text-xs text-zinc-300 leading-relaxed">
                <strong className="text-emerald-300">Choose this if:</strong> {isAValue ? 'You want the best value-to-performance ratio and lower initial cost.' : 'You prioritize top-tier build quality, premium features, and long-term durability.'}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-700/50 flex items-center justify-between">
              <button
                onClick={() => onSelectProduct(itemA)}
                className="text-xs text-zinc-300 hover:text-white underline underline-offset-2"
              >
                View Full Analysis &rarr;
              </button>
              <a
                href={getUrl(itemA, routingA)}
                target="_blank"
                rel="nofollow sponsored"
                className="px-3 py-1.5 bg-[#00B67A] hover:bg-[#008254] text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs"
              >
                <span>{routingA.buttonText || 'Check Price'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Verdict B */}
          <div className="p-4 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-zinc-100">{itemB.name}</span>
                <span className="text-xs font-mono text-emerald-400 font-bold">{formatPrice(itemB.basePriceUSD)}</span>
              </div>
              <div className="text-xs text-zinc-300 leading-relaxed">
                <strong className="text-emerald-300">Choose this if:</strong> {!isAValue ? 'You want maximum value and balanced everyday practicality.' : 'You want the more advanced feature set and higher tier specifications.'}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-700/50 flex items-center justify-between">
              <button
                onClick={() => onSelectProduct(itemB)}
                className="text-xs text-zinc-300 hover:text-white underline underline-offset-2"
              >
                View Full Analysis &rarr;
              </button>
              <a
                href={getUrl(itemB, routingB)}
                target="_blank"
                rel="nofollow sponsored"
                className="px-3 py-1.5 bg-[#00B67A] hover:bg-[#008254] text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs"
              >
                <span>{routingB.buttonText || 'Check Price'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Table */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden mb-8">
        <div className="p-4 sm:p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <h3 className="font-bold text-base text-zinc-900 flex items-center gap-2">
            <span>Decision Comparison Table</span>
          </h3>
          <span className="text-xs text-zinc-400 font-mono">2 Products Compared</span>
        </div>

        {/* Product Headers */}
        <div className="grid grid-cols-12 bg-zinc-50 border-b border-zinc-200 text-xs font-bold text-zinc-700">
          <div className="col-span-4 p-4 text-zinc-400 uppercase tracking-wider">Criteria</div>
          <div className="col-span-4 p-4 border-l border-zinc-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white border border-zinc-200 p-1 shrink-0 overflow-hidden">
                <ProductThumbnail product={itemA} alt={itemA.name} className="w-full h-full" />
              </div>
              <div className="truncate font-extrabold text-zinc-900">{itemA.name}</div>
            </div>
          </div>
          <div className="col-span-4 p-4 border-l border-zinc-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white border border-zinc-200 p-1 shrink-0 overflow-hidden">
                <ProductThumbnail product={itemB} alt={itemB.name} className="w-full h-full" />
              </div>
              <div className="truncate font-extrabold text-zinc-900">{itemB.name}</div>
            </div>
          </div>
        </div>

        {/* Comparison Rows */}
        <div className="divide-y divide-zinc-100 text-xs sm:text-sm">
          {comparisonRows.map((row, i) => (
            <div key={i} className="grid grid-cols-12 hover:bg-zinc-50/70 transition-colors">
              <div className="col-span-4 p-4 font-semibold text-zinc-500 bg-zinc-50/30">
                {row.metric}
              </div>
              <div className="col-span-4 p-4 border-l border-zinc-100 text-zinc-800 font-medium leading-relaxed">
                {row.valA}
              </div>
              <div className="col-span-4 p-4 border-l border-zinc-100 text-zinc-800 font-medium leading-relaxed">
                {row.valB}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progressive Disclosure: Deep Specs Toggle */}
      <div className="text-center">
        <button
          onClick={() => setShowDeepSpecs(!showDeepSpecs)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-xs font-semibold text-zinc-700 transition-colors cursor-pointer"
        >
          <span>{showDeepSpecs ? 'Hide Technical Specifications' : 'Show Technical Specifications Matrix'}</span>
          {showDeepSpecs ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {showDeepSpecs && (
        <div className="mt-6 bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs animate-in fade-in duration-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">
            Technical Specification Breakdown
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Specs A */}
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100">
              <div className="font-bold text-zinc-900 mb-3">{itemA.name} Specifications</div>
              <div className="space-y-2">
                {Object.entries(itemA.specs).map(([k, v]) => (
                  <div key={k} className="flex justify-between py-1 border-b border-zinc-200/60">
                    <span className="text-zinc-500 font-medium">{k}</span>
                    <span className="text-zinc-800 font-semibold text-right">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Specs B */}
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100">
              <div className="font-bold text-zinc-900 mb-3">{itemB.name} Specifications</div>
              <div className="space-y-2">
                {Object.entries(itemB.specs).map(([k, v]) => (
                  <div key={k} className="flex justify-between py-1 border-b border-zinc-200/60">
                    <span className="text-zinc-500 font-medium">{k}</span>
                    <span className="text-zinc-800 font-semibold text-right">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
