import React, { useState } from 'react';
import { LanguageCode } from '../types';
import { getTranslation } from '../localization/languages';

interface HeroSearchProps {
  currentLang: LanguageCode;
  onSearch: (query: string) => void;
  initialQuery?: string;
}

const SEARCH_EXAMPLES = [
  'Best phone under ₹30,000',
  'Best camera under ₹50,000',
  'Sony Alpha 7 IV',
  'Best SUV for a family',
  'Best accounting software',
  'Best hotel in Goa',
  'CA near me',
];

const POPULAR_TRENDS = [
  'iPhone vs Samsung',
  'Sony A7 IV vs Canon R6',
  'OnePlus Nord 4 5G',
  'Zoho Books',
];

export const HeroSearch: React.FC<HeroSearchProps> = ({
  currentLang,
  onSearch,
  initialQuery = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const t = getTranslation(currentLang);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleChipClick = (example: string) => {
    setQuery(example);
    onSearch(example);
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-12 flex flex-col items-center text-center">
      {/* Category domain pill */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 text-xs font-medium mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>Universal Decision Engine</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-zinc-900 tracking-tight leading-[1.1] max-w-3xl">
        {t.headline}
      </h1>

      {/* Supporting Text */}
      <p className="mt-4 sm:mt-6 text-base sm:text-lg text-zinc-600 max-w-2xl leading-relaxed">
        {t.supportingText}
      </p>

      {/* Primary Search Box */}
      <form onSubmit={handleSubmit} className="w-full max-w-2xl mt-8 sm:mt-10">
        <div className="relative flex items-center shadow-sm hover:shadow transition-shadow rounded-2xl bg-white border border-zinc-300 focus-within:border-zinc-900 focus-within:ring-2 focus-within:ring-zinc-900/10 p-1.5">
          <div className="pl-3.5 pr-2 text-zinc-400">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            id="main-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-transparent py-3 pr-3 text-base text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
            autoComplete="off"
          />
          <button
            id="hero-search-button"
            type="submit"
            className="shrink-0 bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-950 text-white font-medium text-sm px-5 py-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-900"
          >
            {t.searchButton}
          </button>
        </div>
      </form>

      {/* Search Examples */}
      <div className="w-full max-w-2xl mt-6 flex flex-col items-center">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2.5">
          {t.searchExamplesLabel}
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {SEARCH_EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => handleChipClick(example)}
              className="inline-flex items-center text-xs font-medium text-zinc-600 hover:text-zinc-900 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-lg px-3 py-1.5 transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Popular Trending Queries */}
      <div className="w-full max-w-2xl mt-4 pt-4 border-t border-zinc-100 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs text-zinc-400">
        <span className="font-medium text-zinc-500">{t.trendingLabel}</span>
        {POPULAR_TRENDS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => handleChipClick(item)}
            className="text-zinc-600 hover:text-zinc-900 underline underline-offset-2 transition-colors"
          >
            {item}
          </button>
        ))}
      </div>
    </section>
  );
};
