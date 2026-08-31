import React, { useState, useRef, useEffect } from 'react';
import { Globe, Search, ChevronDown, Check, Zap, MapPin, LayoutGrid } from 'lucide-react';
import { LanguageCode } from '../types';
import { LANGUAGES, TRANSLATIONS } from '../data/languages';
import { GEO_LOCATIONS, GeoLocationMock, getSimulatedGeoLocation, setSimulatedGeoLocation } from '../utils/languageDetector';
import { EdgeRedisCache, CacheStats } from '../utils/cacheManager';
import { CategoryMegaMenu } from './CategoryMegaMenu';
import { Category, SubCategory } from '../data/categories';

interface HeaderProps {
  currentLang: LanguageCode;
  onSelectLanguage: (lang: LanguageCode, manual?: boolean) => void;
  onResetToHome: () => void;
  onSelectCategory?: (category: Category, subcategory?: SubCategory) => void;
  currentSlug?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onSelectLanguage,
  onResetToHome,
  onSelectCategory,
  currentSlug,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [langSearch, setLangSearch] = useState('');
  const [showGeoModal, setShowGeoModal] = useState(false);
  const [simulatedGeo, setSimulatedGeo] = useState<GeoLocationMock>(getSimulatedGeoLocation());
  const [cacheStats, setCacheStats] = useState<CacheStats>(EdgeRedisCache.getStats(currentSlug));
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLangDef = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  useEffect(() => {
    setCacheStats(EdgeRedisCache.getStats(currentSlug));
  }, [currentSlug, currentLang]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredLanguages = LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(langSearch.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(langSearch.toLowerCase()) ||
      l.code.toLowerCase().includes(langSearch.toLowerCase())
  );

  const handleGeoChange = (geo: GeoLocationMock) => {
    setSimulatedGeo(geo);
    setSimulatedGeoLocation(geo.countryCode);
    onSelectLanguage(geo.suggestedLang, false);
    setShowGeoModal(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white border-b border-zinc-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          {/* Left: Brand & Categories Trigger */}
          <div className="flex items-center gap-4">
            <div
              id="header-brand"
              onClick={onResetToHome}
              className="flex items-center gap-3 cursor-pointer select-none"
            >
              <div className="text-xl font-bold tracking-tighter text-zinc-900">
                productreviews<span className="text-zinc-400">.review</span>
              </div>
              <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-widest text-zinc-400 border-l border-zinc-200 pl-3">
                {t.tagline}
              </span>
            </div>

            {/* Browse 33 Categories Button */}
            <button
              id="header-categories-btn"
              onClick={() => setIsMegaMenuOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-xs font-semibold text-zinc-800 transition-all shadow-2xs"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-zinc-600" />
              <span className="hidden sm:inline">Browse</span>
              <span>33 Categories</span>
            </button>
          </div>

          {/* Right Controls: Cache badge, Geo simulation, Language dropdown */}
          <div className="flex items-center gap-3">
            {/* Edge Cache Status Badge */}
            <div
              id="edge-cache-badge"
              title="Next.js + Edge Redis Multi-region Cache"
              className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-50 border border-zinc-200 text-xs font-mono text-zinc-600"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Edge:</span>
              <span className="font-semibold text-emerald-600">{cacheStats.lastAccessLatencyMs}ms</span>
            </div>

            {/* Geo IP Simulation Button */}
            <button
              id="geo-sim-btn"
              onClick={() => setShowGeoModal(!showGeoModal)}
              title={`Simulated IP Geo: ${simulatedGeo.countryName} (${simulatedGeo.ip})`}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 text-xs text-zinc-700 font-medium transition-colors shadow-xs"
            >
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              <span>{simulatedGeo.flag}</span>
              <span className="text-zinc-600 font-mono text-[11px]">{simulatedGeo.countryCode}</span>
            </button>

            {/* 40 Language Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                id="language-selector-btn"
                onClick={() => {
                  setIsOpen(!isOpen);
                  setLangSearch('');
                }}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 text-sm font-medium text-zinc-800 transition-colors shadow-xs"
              >
                <span className="text-base leading-none">{currentLangDef.flag}</span>
                <span className="max-w-[80px] sm:max-w-[120px] truncate">{currentLangDef.name}</span>
                <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isOpen && (
                <div
                  id="language-dropdown-menu"
                  className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-zinc-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="p-2 border-b border-zinc-100 flex items-center gap-2">
                    <Search className="w-4 h-4 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Search 40 languages..."
                      value={langSearch}
                      onChange={(e) => setLangSearch(e.target.value)}
                      autoFocus
                      className="w-full text-xs sm:text-sm bg-transparent outline-none placeholder:text-zinc-400 text-zinc-800"
                    />
                    <span className="text-[10px] bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded font-mono">
                      40
                    </span>
                  </div>

                  <div className="max-h-72 overflow-y-auto py-1 scrollbar-thin">
                    {filteredLanguages.map((lang) => {
                      const isSelected = lang.code === currentLang;
                      return (
                        <button
                          key={lang.code}
                          id={`lang-item-${lang.code}`}
                          onClick={() => {
                            onSelectLanguage(lang.code, true);
                            setIsOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs sm:text-sm transition-colors ${
                            isSelected
                              ? 'bg-zinc-900 text-white font-medium'
                              : 'hover:bg-zinc-50 text-zinc-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-base leading-none">{lang.flag}</span>
                            <div className="flex flex-col">
                              <span className="font-medium leading-tight">{lang.name}</span>
                              <span
                                className={`text-[11px] ${
                                  isSelected ? 'text-zinc-300' : 'text-zinc-500'
                                }`}
                              >
                                {lang.nativeName}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                                isSelected ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-600'
                              }`}
                            >
                              {lang.code}
                            </span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                          </div>
                        </button>
                      );
                    })}
                    {filteredLanguages.length === 0 && (
                      <div className="p-4 text-center text-xs text-zinc-500">
                        No matching language found
                      </div>
                    )}
                  </div>

                  <div className="p-2 border-t border-zinc-100 bg-zinc-50/70 rounded-b-xl flex items-center justify-between text-[11px] text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3 text-zinc-400" />
                      Auto-detect active
                    </span>
                    <span>Currency: {currentLangDef.currencySymbol} ({currentLangDef.currency})</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Simulated IP Geo Fallback Modal / Drawer */}
        {showGeoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-zinc-200 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-zinc-900">Simulate Visitor IP Location</h3>
                </div>
                <button
                  onClick={() => setShowGeoModal(false)}
                  className="text-zinc-600 hover:text-zinc-900 text-sm font-semibold p-1"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-zinc-600 mb-4 leading-relaxed">
                Test the requirement: <em>&quot;If Spain IP -&gt; auto open Spanish, no need to choose&quot;</em>. Select any simulated country location below:
              </p>

              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                {GEO_LOCATIONS.map((geo) => (
                  <button
                    key={geo.countryCode}
                    onClick={() => handleGeoChange(geo)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs transition-all ${
                      simulatedGeo.countryCode === geo.countryCode
                        ? 'border-zinc-950 bg-zinc-950 text-white shadow-xs'
                        : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-800'
                    }`}
                  >
                    <span className="text-lg">{geo.flag}</span>
                    <div className="truncate">
                      <div className="font-semibold truncate">{geo.countryName}</div>
                      <div
                        className={`text-[10px] font-mono ${
                          simulatedGeo.countryCode === geo.countryCode ? 'text-zinc-300' : 'text-zinc-600'
                        }`}
                      >
                        {geo.suggestedLang.toUpperCase()} • {geo.ip}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-100 flex justify-end">
                <button
                  onClick={() => setShowGeoModal(false)}
                  className="px-4 py-2 bg-zinc-900 text-white rounded-xl text-xs font-semibold hover:bg-zinc-800"
                >
                  Apply Location
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* 33-Category Mega Menu Overlay */}
      <CategoryMegaMenu
        isOpen={isMegaMenuOpen}
        onClose={() => setIsMegaMenuOpen(false)}
        onSelectCategory={(cat) => {
          if (onSelectCategory) {
            onSelectCategory(cat);
          }
        }}
        onSelectSubCategory={(cat, sub) => {
          if (onSelectCategory) {
            onSelectCategory(cat, sub);
          }
        }}
        currentLang={currentLang}
      />
    </>
  );
};
