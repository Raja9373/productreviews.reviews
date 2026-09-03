import React from 'react';
import { LanguageCode } from '../types';
import { getTranslation } from '../localization/languages';

interface EmptyStateProps {
  query: string;
  currentLang: LanguageCode;
  onSelectSuggestion: (term: string) => void;
}

const POPULAR_SUGGESTIONS = [
  'Best phone under ₹30,000',
  'Best camera under ₹50,000',
  'Sony Alpha 7 IV',
  'Best SUV for a family',
  'Best accounting software',
  'Best hotel in Goa',
  'CA near me',
  'iPhone vs Samsung',
  'Sony A7 IV vs Canon R6',
];

export const EmptyState: React.FC<EmptyStateProps> = ({
  query,
  currentLang,
  onSelectSuggestion,
}) => {
  const t = getTranslation(currentLang);

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
        {t.noResultsTitle}
      </h2>

      {/* Description */}
      <p className="text-sm text-zinc-600 leading-relaxed mb-8 max-w-lg mx-auto">
        {t.noResultsDesc}
      </p>

      {/* Query echo */}
      {query && (
        <div className="mb-8 p-3 bg-zinc-50 border border-zinc-200/60 rounded-xl inline-block text-xs font-mono text-zinc-600">
          Query: &ldquo;{query}&rdquo;
        </div>
      )}

      {/* Verified queries to try */}
      <div className="text-left bg-white rounded-2xl border border-zinc-200 p-6 sm:p-7 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
          Explore Verified Benchmark Searches
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
