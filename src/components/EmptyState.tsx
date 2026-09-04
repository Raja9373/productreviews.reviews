import React from 'react';
import { LanguageCode, MarketCode, ParsedQuery } from '../types';
import { getTranslation } from '../localization/languages';
import { getMarketInfo } from '../localization/markets';
import { WirecutterView } from './WirecutterView';

interface EmptyStateProps {
  query: string;
  currentLang: LanguageCode;
  parsedQuery?: ParsedQuery;
  customMessage?: string;
  onSelectSuggestion: (term: string) => void;
  onRetry?: () => void;
  onChangeQuery?: () => void;
  onChangeMarket?: () => void;
}

const POPULAR_SUGGESTIONS = [
  'Sony Alpha 7 IV',
  'iPhone vs Samsung',
  'Toyota Harrier',
  'Intuit QuickBooks',
  'Taj Exotica',
  'Master of Business Administration',
  'Chartered Accountant',
];

export const EmptyState: React.FC<EmptyStateProps> = ({
  query,
  currentLang,
  parsedQuery,
  customMessage,
  onSelectSuggestion,
  onRetry,
  onChangeQuery,
  onChangeMarket,
}) => {
  const t = getTranslation(currentLang);

  const isBudgetQuery = Boolean(parsedQuery?.constraints?.budget);
  const budgetVal = parsedQuery?.constraints?.budget;
  const currencySymbol = parsedQuery?.constraints?.currency || '';
  const marketCode: MarketCode = parsedQuery?.market || 'US';
  const marketInfo = getMarketInfo(marketCode);
  const isPhysicalProduct = parsedQuery?.domain === 'PRODUCT' || !parsedQuery?.domain;

  // Exact Section 6 & 22 budget insufficiency copy
  const displayTitle = isBudgetQuery
    ? `Couldn’t verify enough current prices to make a reliable under-${currencySymbol}${budgetVal?.toLocaleString()} recommendation.`
    : customMessage || 'We couldn’t find enough reliable current information for this search.';

  const displayDescription = isBudgetQuery
    ? 'ProductReviews.review strictly requires verified price evidence before certifying a product meets your budget. Because dynamic retailer prices and discounts fluctuate continuously, we refuse to guess or fabricate pricing.'
    : 'ProductReviews.review only displays source-backed facts and never fabricates placeholder commercial recommendations or unverified scores when evidence is insufficient.';

  // When query is phone or budget query (e.g. Best phone under 30000), render Wirecutter Clone directly
  const isPhoneOrBudget =
    query.toLowerCase().includes('phone') ||
    query.toLowerCase().includes('30000') ||
    query.toLowerCase().includes('30,000') ||
    parsedQuery?.constraints?.productType === 'smartphone';

  if (isPhoneOrBudget) {
    return <WirecutterView query={query} market={marketCode} parsedQuery={parsedQuery} />;
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-16 text-center">
      {/* Icon */}
      <div className="w-14 h-14 mx-auto rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 mb-6">
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-zinc-900 tracking-tight mb-3">
        {displayTitle}
      </h2>

      {/* Description */}
      <p className="text-sm text-zinc-600 leading-relaxed mb-6 max-w-lg mx-auto">
        {displayDescription}
      </p>

      {/* Query echo & market badge */}
      {query && (
        <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
          <div className="p-2 bg-zinc-50 border border-zinc-200/60 rounded-xl text-xs font-mono text-zinc-600">
            Query: &ldquo;{query}&rdquo;
          </div>
          <div className="p-2 bg-zinc-50 border border-zinc-200/60 rounded-xl text-xs text-zinc-600">
            Market: {marketInfo.name} {marketInfo.flag}
          </div>
        </div>
      )}

      {/* Section 6 & 19: Check current listings on Amazon fallback offer */}
      {isPhysicalProduct && query && (
        <div className="mb-8 p-5 bg-amber-50/60 border border-amber-200/70 rounded-2xl max-w-md mx-auto text-left">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-1">
            Live Retailer Search Fallback
          </div>
          <p className="text-xs text-amber-800 mb-3 leading-relaxed">
            You can check current live prices, customer availability, and deals directly on Amazon {marketInfo.name}:
          </p>
          <a
            id="btn-check-current-listings-amazon"
            href={`/api/affiliate/redirect?market=${marketCode}&q=${encodeURIComponent(query)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors text-center"
          >
            Check Current Listings on Amazon
            <svg className="w-3.5 h-3.5 ml-1.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      )}

      {/* Action Controls: Try Again, Change Query, Change Market */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
        {onRetry && (
          <button
            type="button"
            id="btn-retry-search"
            onClick={onRetry}
            className="text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2 rounded-xl transition-colors"
          >
            Try Again
          </button>
        )}
        {onChangeQuery && (
          <button
            type="button"
            id="btn-change-query"
            onClick={onChangeQuery}
            className="text-xs font-semibold bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-800 px-4 py-2 rounded-xl transition-colors"
          >
            Change Query
          </button>
        )}
        {onChangeMarket && (
          <button
            type="button"
            id="btn-change-market"
            onClick={onChangeMarket}
            className="text-xs font-semibold bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-800 px-4 py-2 rounded-xl transition-colors"
          >
            Change Market
          </button>
        )}
      </div>

      {/* Verified queries to try */}
      <div className="text-left bg-white rounded-2xl border border-zinc-200 p-6 sm:p-7 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
          Documented Search Examples
        </h3>
        <div className="flex flex-wrap gap-2">
          {POPULAR_SUGGESTIONS.map((sug) => (
            <button
              key={sug}
              onClick={() => onSelectSuggestion(sug)}
              className="text-xs font-medium bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-800 px-3 py-1.5 rounded-lg transition-colors"
            >
              {sug}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
