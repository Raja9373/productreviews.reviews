import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { LanguageCode, MarketCode } from '../types';
import { SUPPORTED_LANGUAGES, getTranslation } from '../localization/languages';
import { SUPPORTED_MARKETS } from '../localization/markets';

interface HeaderProps {
  currentLang: LanguageCode;
  currentMarket: MarketCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  onSelectMarket: (market: MarketCode) => void;
  onResetToHome: () => void;
  onSearch?: (query: string) => void;
  initialQuery?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  currentMarket,
  onSelectLanguage,
  onSelectMarket,
  onResetToHome,
  onSearch,
  initialQuery = '',
}) => {
  const [headerQuery, setHeaderQuery] = useState(initialQuery);
  const t = getTranslation(currentLang);

  useEffect(() => {
    setHeaderQuery(initialQuery);
  }, [initialQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerQuery.trim() && onSearch) {
      onSearch(headerQuery.trim());
    }
  };

  return (
    <header className="w-full bg-white border-b border-zinc-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand Logo: PR productreviews.review (Wirecutter exact style) */}
        <button
          onClick={onResetToHome}
          className="flex items-center gap-2 text-left group focus:outline-none shrink-0 cursor-pointer"
          aria-label="productreviews.review Homepage"
        >
          <div className="w-8 h-8 bg-zinc-950 text-white flex items-center justify-center font-bold text-xs font-serif tracking-tight">
            PR
          </div>
          <div className="flex items-baseline">
            <span className="text-base sm:text-lg font-bold text-zinc-950 font-serif-wirecutter tracking-tight">
              productreviews
            </span>
            <span className="text-zinc-500 font-serif text-sm">.review</span>
          </div>
        </button>

        {/* Header Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 max-w-md hidden sm:flex items-center bg-zinc-50 border border-zinc-300 focus-within:border-zinc-900 rounded-md px-2.5 py-1.5 transition-colors"
        >
          <Search className="w-4 h-4 text-zinc-400 mr-2 shrink-0" />
          <input
            type="text"
            id="search-input-header"
            value={headerQuery}
            onChange={(e) => setHeaderQuery(e.target.value)}
            placeholder="Search reviews, e.g. Best phone under 30000"
            className="w-full bg-transparent text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
          />
          <button
            type="submit"
            className="text-[11px] font-bold text-zinc-700 hover:text-zinc-950 px-2 py-0.5 uppercase tracking-wider shrink-0"
          >
            Find
          </button>
        </form>

        {/* IN (₹) Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <label htmlFor="market-select" className="sr-only">
              Market / Currency Selector
            </label>
            <select
              id="market-select"
              value={currentMarket}
              onChange={(e) => onSelectMarket(e.target.value as MarketCode)}
              className="appearance-none bg-white hover:bg-zinc-50 border border-zinc-300 rounded px-3 py-1.5 pr-8 text-xs font-bold text-zinc-900 cursor-pointer focus:outline-none focus:border-zinc-900 transition-colors"
            >
              {SUPPORTED_MARKETS.map((m) => (
                <option key={m.code} value={m.code}>
                  {m.flag} {m.code} ({m.currencySymbol})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-500">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar Row */}
      <div className="sm:hidden px-4 pb-2.5 pt-0">
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center bg-zinc-50 border border-zinc-300 focus-within:border-zinc-900 rounded px-2.5 py-1.5"
        >
          <Search className="w-3.5 h-3.5 text-zinc-400 mr-2 shrink-0" />
          <input
            type="text"
            value={headerQuery}
            onChange={(e) => setHeaderQuery(e.target.value)}
            placeholder="Search gear, e.g. Best phone under 30000"
            className="w-full bg-transparent text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
          />
          <button
            type="submit"
            className="text-[11px] font-bold text-zinc-700 hover:text-zinc-950 uppercase shrink-0"
          >
            Find
          </button>
        </form>
      </div>
    </header>
  );
};
