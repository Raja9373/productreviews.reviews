import React from 'react';
import { LanguageCode, MarketCode } from '../types';
import { SUPPORTED_LANGUAGES, getTranslation } from '../localization/languages';
import { SUPPORTED_MARKETS } from '../localization/markets';

interface HeaderProps {
  currentLang: LanguageCode;
  currentMarket: MarketCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  onSelectMarket: (market: MarketCode) => void;
  onResetToHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  currentMarket,
  onSelectLanguage,
  onSelectMarket,
  onResetToHome,
}) => {
  const t = getTranslation(currentLang);

  return (
    <header className="w-full bg-white border-b border-zinc-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          onClick={onResetToHome}
          className="flex items-center gap-2 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 rounded"
          aria-label="ProductReviews.review Home"
        >
          <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold text-sm tracking-tighter">
            PR
          </div>
          <div>
            <span className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight">
              productreviews<span className="text-zinc-400 font-normal">.review</span>
            </span>
          </div>
        </button>

        {/* Global Controls: Market / Country & Language */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Market / Country Picker */}
          <div className="relative">
            <label htmlFor="market-select" className="sr-only">
              {t.marketLabel}
            </label>
            <select
              id="market-select"
              value={currentMarket}
              onChange={(e) => onSelectMarket(e.target.value as MarketCode)}
              className="appearance-none bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg px-2.5 py-1.5 pr-7 text-xs font-medium text-zinc-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-colors"
            >
              {SUPPORTED_MARKETS.map((m) => (
                <option key={m.code} value={m.code}>
                  {m.flag} {m.code} ({m.currencySymbol})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-zinc-400">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          {/* Language Selector */}
          <div className="relative">
            <label htmlFor="language-select" className="sr-only">
              {t.languageLabel}
            </label>
            <select
              id="language-select"
              value={currentLang}
              onChange={(e) => onSelectLanguage(e.target.value as LanguageCode)}
              className="appearance-none bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg px-2.5 py-1.5 pr-7 text-xs font-medium text-zinc-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-colors"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.nativeName}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-zinc-400">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
