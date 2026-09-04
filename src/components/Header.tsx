import React, { useState, useEffect } from 'react';
import { Search, Globe, ChevronDown, Flame, Sparkles } from 'lucide-react';
import { LanguageCode, MarketCode } from '../types';
import { SUPPORTED_LANGUAGES, getTranslation } from '../localization/languages';
import { SUPPORTED_MARKETS, getMarketInfo } from '../localization/markets';
import { getStoreConfig } from '../affiliate/affiliateConfig';

interface HeaderProps {
  currentLang: LanguageCode;
  currentMarket: MarketCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  onSelectMarket: (market: MarketCode) => void;
  onResetToHome: () => void;
  onSearch?: (query: string) => void;
  initialQuery?: string;
}

const CATEGORY_GUIDES = [
  { label: 'All Reviews', query: '' },
  { label: 'Smartphones', query: 'Best phones' },
  { label: 'Laptops', query: 'Best laptops' },
  { label: '4K OLED TVs', query: 'Best TVs' },
  { label: 'Kitchen & Home', query: 'Best juicer' },
  { label: 'Air Purifiers & AC', query: 'Best AC' },
  { label: 'Noise-Cancelling Audio', query: 'Best earbuds' },
];

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
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const t = getTranslation(currentLang);
  const marketInfo = getMarketInfo(currentMarket);
  const storeConfig = getStoreConfig(currentMarket);

  useEffect(() => {
    setHeaderQuery(initialQuery);
  }, [initialQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerQuery.trim() && onSearch) {
      onSearch(headerQuery.trim());
    }
  };

  const handleCategoryClick = (q: string) => {
    if (!q) {
      onResetToHome();
    } else if (onSearch) {
      onSearch(q);
    }
  };

  return (
    <header className="w-full bg-white border-b border-zinc-200 sticky top-0 z-40 shadow-xs">
      {/* Top Utility Bar: Trust Guarantee + Country / Language Switcher */}
      <div className="bg-zinc-950 text-zinc-300 text-[11px] py-1.5 px-4 border-b border-zinc-900">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-zinc-400 font-medium">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Independent Lab Testing &amp; Verified Reviews
            </span>
            <span className="hidden sm:inline text-zinc-600">|</span>
            <span className="text-zinc-300 truncate">
              Shopping on <strong className="text-white">{storeConfig.domain}</strong> ({marketInfo.currencySymbol} {marketInfo.currency})
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0 relative">
            <button
              type="button"
              onClick={() => setShowLocationMenu(!showLocationMenu)}
              className="flex items-center gap-1.5 hover:text-white bg-zinc-900 hover:bg-zinc-800 px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer"
              title="Change Country, Currency & Language"
            >
              <Globe className="w-3 h-3 text-zinc-400" />
              <span>{marketInfo.flag} {marketInfo.code}</span>
              <span className="text-zinc-500">({marketInfo.currencySymbol})</span>
              <ChevronDown className="w-3 h-3 text-zinc-400 ml-0.5" />
            </button>

            {/* Quick Country / Currency / Language Popover */}
            {showLocationMenu && (
              <div
                className="absolute right-0 top-full mt-2 w-72 bg-white text-zinc-900 rounded-lg shadow-xl border border-zinc-200 p-3 z-50 animate-in fade-in slide-in-from-top-1"
                onMouseLeave={() => setShowLocationMenu(false)}
              >
                <div className="pb-2 border-b border-zinc-100 mb-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                    Select Your Region &amp; Amazon Store
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                    {SUPPORTED_MARKETS.map((m) => (
                      <button
                        key={m.code}
                        type="button"
                        onClick={() => {
                          onSelectMarket(m.code);
                          setShowLocationMenu(false);
                        }}
                        className={`flex items-center gap-1.5 px-2 py-1.5 text-xs rounded text-left transition-colors cursor-pointer ${
                          currentMarket === m.code
                            ? 'bg-zinc-900 text-white font-bold'
                            : 'hover:bg-zinc-100 text-zinc-700'
                        }`}
                      >
                        <span className="text-sm">{m.flag}</span>
                        <div className="truncate">
                          <span className="block truncate leading-none">{m.name}</span>
                          <span className="text-[10px] opacity-75 font-mono">{m.currencySymbol} {m.currency}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                    Language
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          onSelectLanguage(lang.code);
                          setShowLocationMenu(false);
                        }}
                        className={`px-2 py-1 text-xs rounded transition-colors cursor-pointer ${
                          currentLang === lang.code
                            ? 'bg-[#b80000] text-white font-bold'
                            : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800'
                        }`}
                      >
                        {lang.nativeName}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand Logo: PR productreviews.review (Wirecutter exact style) */}
        <button
          onClick={onResetToHome}
          className="flex items-center gap-2.5 text-left group focus:outline-none shrink-0 cursor-pointer"
          aria-label="productreviews.review Homepage"
        >
          <div className="w-8 h-8 bg-[#b80000] text-white flex items-center justify-center font-bold text-xs font-serif tracking-tight rounded-xs shadow-xs group-hover:bg-[#990000] transition-colors">
            PR
          </div>
          <div className="flex items-baseline">
            <span className="text-base sm:text-xl font-bold text-zinc-950 font-serif-wirecutter tracking-tight">
              productreviews
            </span>
            <span className="text-[#b80000] font-serif text-sm font-semibold">.review</span>
          </div>
        </button>

        {/* Header Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 max-w-lg hidden sm:flex items-center bg-zinc-50 border border-zinc-300 focus-within:border-zinc-900 focus-within:bg-white rounded-md px-3 py-1.5 transition-all shadow-2xs"
        >
          <Search className="w-4 h-4 text-zinc-400 mr-2 shrink-0" />
          <input
            type="text"
            id="search-input-header"
            value={headerQuery}
            onChange={(e) => setHeaderQuery(e.target.value)}
            placeholder={`Search ${storeConfig.regionName} reviews, e.g. Best phone, Best laptop, TVs...`}
            className="w-full bg-transparent text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
          />
          <button
            type="submit"
            className="text-[11px] font-bold text-white bg-zinc-900 hover:bg-zinc-800 px-3 py-1 rounded uppercase tracking-wider shrink-0 transition-colors cursor-pointer"
          >
            Find
          </button>
        </form>

        {/* Top Right Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onSearch && onSearch('Best deals today')}
            className="hidden md:flex items-center gap-1.5 text-xs font-bold text-[#b80000] hover:text-[#990000] bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded transition-colors cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5 text-[#b80000]" />
            <span>Today's Deals</span>
          </button>

          {/* Location Picker Pill */}
          <button
            type="button"
            onClick={() => setShowLocationMenu(!showLocationMenu)}
            className="flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 rounded px-2.5 py-1.5 text-xs font-semibold cursor-pointer transition-colors"
          >
            <span className="text-sm leading-none">{marketInfo.flag}</span>
            <span className="hidden sm:inline font-mono">{marketInfo.currencySymbol}</span>
            <ChevronDown className="w-3 h-3 text-zinc-500" />
          </button>
        </div>
      </div>

      {/* Editorial Category Sub-Navigation Bar */}
      <nav className="border-t border-zinc-200 bg-white overflow-x-auto scrollbar-none">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center gap-1 text-xs font-medium text-zinc-600 whitespace-nowrap py-1">
          {CATEGORY_GUIDES.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleCategoryClick(item.query)}
              className="px-3 py-1.5 rounded hover:text-zinc-950 hover:bg-zinc-100 transition-colors cursor-pointer text-zinc-700"
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile Search Bar Row */}
      <div className="sm:hidden px-4 pb-2.5 pt-1 border-t border-zinc-100">
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center bg-zinc-50 border border-zinc-300 focus-within:border-zinc-900 rounded px-2.5 py-1.5"
        >
          <Search className="w-3.5 h-3.5 text-zinc-400 mr-2 shrink-0" />
          <input
            type="text"
            value={headerQuery}
            onChange={(e) => setHeaderQuery(e.target.value)}
            placeholder={`Search ${storeConfig.regionName} reviews...`}
            className="w-full bg-transparent text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
          />
          <button
            type="submit"
            className="text-[11px] font-bold text-white bg-zinc-900 hover:bg-zinc-800 px-2 py-0.5 rounded uppercase shrink-0"
          >
            Find
          </button>
        </form>
      </div>
    </header>
  );
};
