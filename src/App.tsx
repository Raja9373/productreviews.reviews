import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { HeroSearch } from './components/HeroSearch';
import { ResultCard } from './components/ResultCard';
import { ExactEntityView } from './components/ExactEntityView';
import { ComparisonView } from './components/ComparisonView';
import { EmptyState } from './components/EmptyState';
import { WirecutterView } from './components/WirecutterView';
import { WirecutterHome } from './components/WirecutterHome';
import { AffiliateDisclosure } from './components/AffiliateDisclosure';
import { CookieConsent } from './components/CookieConsent';
import { AdUnit } from './components/AdUnit';

// Legal & Informative Pages
import { AboutPage } from './components/pages/AboutPage';
import { ContactPage } from './components/pages/ContactPage';
import { PrivacyPage } from './components/pages/PrivacyPage';
import { TermsPage } from './components/pages/TermsPage';
import { DisclaimerPage } from './components/pages/DisclaimerPage';

import { DecisionResult, EntityItem, LanguageCode, MarketCode } from './types';
import { getTranslation } from './localization/languages';
import { resolveTargetMarket, SUPPORTED_MARKETS } from './localization/markets';
import { executeSearch } from './search/decisionEngine';
import { updateDocumentMeta } from './seo/metaManager';
import { trackEvent } from './analytics/tracker';

type Screen = 'HOME' | 'SEARCH' | 'DETAIL' | 'ABOUT' | 'CONTACT' | 'PRIVACY' | 'TERMS' | 'DISCLAIMER';

export default function App() {
  const [currentLang, setCurrentLang] = useState<LanguageCode>(() => {
    try {
      const savedLang = localStorage.getItem('pr_lang') as LanguageCode;
      if (savedLang && ['en', 'hi', 'es', 'it', 'fr', 'de', 'ja'].includes(savedLang)) {
        return savedLang;
      }
    } catch {
      // ignore
    }
    return 'en';
  });

  // Default to IN (India) for Exact Wirecutter Clone for India
  const [currentMarket, setCurrentMarket] = useState<MarketCode>(() => {
    try {
      const savedMarket = localStorage.getItem('pr_market') as MarketCode;
      if (savedMarket && SUPPORTED_MARKETS.some((m) => m.code === savedMarket)) {
        return savedMarket;
      }
    } catch {
      // ignore
    }
    return 'IN';
  });

  const [screen, setScreen] = useState<Screen>('HOME');
  const [query, setQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStage, setLoadingStage] = useState<'searching' | 'finding' | 'comparing'>('searching');
  const [decisionResult, setDecisionResult] = useState<DecisionResult | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<EntityItem | null>(null);

  // AUTO-UPDATE PATCH: Live Prices state from /api/live-prices
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Autoupdate price on page load
    fetch('/api/live-prices?q=Best phone under 30000&market=IN')
      .then((r) => r.json())
      .then(setData)
      .catch((err) => console.warn('[Auto-update live-prices fetch]', err));

    // Auto refresh every 6 hours without reload
    const intervalId = setInterval(() => {
      fetch('/api/live-prices?q=Best phone under 30000&market=IN')
        .then((r) => r.json())
        .then(setData)
        .catch(() => {});
    }, 1000 * 60 * 60 * 6);

    return () => clearInterval(intervalId);
  }, []);

  // Format current IST timestamp
  const defaultIST = (() => {
    try {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      return `${formatter.format(now)} IST`;
    } catch {
      return 'September 4, 2026, 3:30 PM IST';
    }
  })();

  const lastUpdated = data?.lastUpdated || defaultIST;

  // Active state references to prevent stale closures in event listeners
  const currentMarketRef = useRef<MarketCode>(currentMarket);
  currentMarketRef.current = currentMarket;
  const currentLangRef = useRef<LanguageCode>(currentLang);
  currentLangRef.current = currentLang;
  const activeSearchKeyRef = useRef<string>('');

  const handleSearch = useCallback(
    async (searchQuery: string, marketOverride?: MarketCode) => {
      // Deterministic market selection:
      // Priority 1: marketOverride (explicit parameter)
      // Priority 2: current user-selected UI market (currentMarketRef)
      const targetMarket = marketOverride || currentMarketRef.current;
      const searchKey = `${searchQuery}|${targetMarket}`;
      activeSearchKeyRef.current = searchKey;

      setIsLoading(true);
      setLoadingStage('searching');
      setQuery(searchQuery);
      setScreen('SEARCH');
      setSelectedEntity(null);

      // Preserve market in URL hash so reloads / direct navigation maintain market
      window.location.hash = `#/search?q=${encodeURIComponent(searchQuery)}&market=${targetMarket}`;

      // Step-by-step loading progression per Phase 3 Section 16
      const stageTimer1 = setTimeout(() => {
        setLoadingStage('finding');
      }, 700);

      const stageTimer2 = setTimeout(() => {
        setLoadingStage('comparing');
      }, 1600);

      updateDocumentMeta({
        title: searchQuery,
        description: `Objective decision results, pros and cons for "${searchQuery}" on ProductReviews.review.`,
        canonicalPath: `/search?q=${encodeURIComponent(searchQuery)}`,
      });

      trackEvent({ name: 'search_initiated', params: { query: searchQuery, market: targetMarket } });

      try {
        const res = await executeSearch(searchQuery, targetMarket, currentLangRef.current);
        setDecisionResult(res);

        // Deterministic market rule:
        // Only update UI market if query itself explicitly specified a different country or currency
        // e.g. "Sony Alpha 7 IV in USA" overrides UI India -> USA
        if (
          res.parsedQuery?.constraints?.explicitCountry ||
          res.parsedQuery?.constraints?.currency
        ) {
          if (res.parsedQuery.market && res.parsedQuery.market !== targetMarket) {
            setCurrentMarket(res.parsedQuery.market);
            currentMarketRef.current = res.parsedQuery.market;
            try {
              localStorage.setItem('pr_market', res.parsedQuery.market);
            } catch {
              // ignore
            }
          }
        }

        // Synchronize language if query had explicit language signals (e.g. hi, ja, es)
        if (res.parsedQuery?.language && res.parsedQuery.language !== currentLangRef.current) {
          setCurrentLang(res.parsedQuery.language);
          currentLangRef.current = res.parsedQuery.language;
        }

        // SEO Safety: Do not index thin, failed, or insufficient-data search results
        updateDocumentMeta({
          title: searchQuery,
          description: `Objective decision results, pros and cons for "${searchQuery}" on ProductReviews.review.`,
          canonicalPath: `/search?q=${encodeURIComponent(searchQuery)}`,
          noIndex: res.status !== 'SUCCESS' || res.items.length === 0,
        });

        trackEvent({
          name: 'search_completed',
          params: { query: searchQuery, status: res.status, count: res.items.length },
        });
      } catch (err) {
        updateDocumentMeta({
          title: searchQuery,
          noIndex: true,
        });
        setDecisionResult({
          parsedQuery: {
            rawQuery: searchQuery,
            cleanQuery: searchQuery,
            intent: 'GENERAL_LOOKUP',
            domain: 'GENERAL',
            market: targetMarket,
            language: currentLangRef.current,
            constraints: {},
          },
          status: 'ERROR',
          items: [],
          message: 'An unexpected issue occurred while processing your search.',
          retrievedAt: new Date().toISOString(),
        });
      } finally {
        clearTimeout(stageTimer1);
        clearTimeout(stageTimer2);
        setIsLoading(false);
      }
    },
    []
  );

  // Handle URL hash routing with current market preservation
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash || '';

      // Check for search queries: /#search?q=..., #/search?q=..., #search?q=...
      const isSearchHash =
        hash.startsWith('#/search?') ||
        hash.startsWith('#search?') ||
        hash.startsWith('/#search?') ||
        hash.startsWith('#/search=') ||
        hash.startsWith('#search=');

      if (isSearchHash) {
        const queryPart = hash
          .replace(/^#\/?search\??/, '')
          .replace(/^#search\??/, '')
          .replace(/^\/#search\??/, '')
          .replace(/^=/, '');
        const urlParams = new URLSearchParams(queryPart.startsWith('q=') ? queryPart : `q=${queryPart}`);
        let rawQ = (urlParams.get('q') || '').trim();
        // If query is empty in /#search?q=, use "Best phone under 30000" as default
        if (!rawQ) {
          rawQ = 'Best phone under 30000';
        }
        const marketParam = urlParams.get('market') as MarketCode | null;
        const validMarket =
          marketParam && SUPPORTED_MARKETS.some((m) => m.code === marketParam)
            ? marketParam
            : currentMarketRef.current;

        const searchKey = `${rawQ}|${validMarket}`;
        if (searchKey !== activeSearchKeyRef.current) {
          handleSearch(rawQ, validMarket);
        }
      } else if (hash === '#/about') {
        setScreen('ABOUT');
      } else if (hash === '#/contact') {
        setScreen('CONTACT');
      } else if (hash === '#/privacy') {
        setScreen('PRIVACY');
      } else if (hash === '#/terms') {
        setScreen('TERMS');
      } else if (hash === '#/affiliate-disclosure' || hash === '#/disclaimer') {
        setScreen('DISCLAIMER');
      } else if (!hash || hash === '#' || hash === '#/' || hash === '/' || hash === '') {
        // Wirecutter Homepage: On "/" or no query, DO NOT show "Best Phone under 30000".
        // Show Wirecutter.com exact homepage
        setScreen('HOME');
        setQuery('');
        setDecisionResult(null);
        setSelectedEntity(null);
        activeSearchKeyRef.current = '';
        updateDocumentMeta({
          title: 'productreviews.review — The best gear for your everyday life',
          description: 'Tested by experts. The exact Wirecutter clone for India with transparent ratings and unbiased reviews.',
          canonicalPath: '/',
        });
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [handleSearch]);

  const handleLanguageChange = (lang: LanguageCode) => {
    setCurrentLang(lang);
    currentLangRef.current = lang;
    try {
      localStorage.setItem('pr_lang', lang);
    } catch {
      // ignore
    }
    trackEvent({ name: 'change_language', params: { lang } });
  };

  const handleMarketChange = (market: MarketCode) => {
    setCurrentMarket(market);
    currentMarketRef.current = market;
    try {
      localStorage.setItem('pr_market', market);
    } catch {
      // ignore
    }
    trackEvent({ name: 'change_market', params: { market } });
    if (query) {
      handleSearch(query, market);
    }
  };

  const handleResetToHome = () => {
    setScreen('HOME');
    setQuery('');
    setDecisionResult(null);
    setSelectedEntity(null);
    activeSearchKeyRef.current = '';
    window.location.hash = '';
    updateDocumentMeta({});
  };

  const t = getTranslation(currentLang);

  return (
    <div className="min-h-screen bg-zinc-50/50 flex flex-col justify-between text-zinc-900 selection:bg-zinc-900 selection:text-white font-sans antialiased">
      {/* Top Header Navigation */}
      <Header
        currentLang={currentLang}
        currentMarket={currentMarket}
        onSelectLanguage={handleLanguageChange}
        onSelectMarket={handleMarketChange}
        onResetToHome={handleResetToHome}
        onSearch={handleSearch}
        initialQuery={query}
      />

      {/* Main App Content Body */}
      <main className="flex-1 w-full bg-white">
        {/* VIEW: HOME - Exact Wirecutter Homepage for India */}
        {screen === 'HOME' && (
          <WirecutterHome
            lastUpdated={lastUpdated}
            onNavigateToSearch={handleSearch}
            liveData={data}
          />
        )}

        {/* VIEW: SEARCH RESULTS */}
        {screen === 'SEARCH' && (
          <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
            {/* Search Bar at top of Results */}
            <div className="max-w-2xl mx-auto mb-8">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (query.trim()) handleSearch(query);
                }}
                className="flex items-center shadow-sm rounded-2xl bg-white border border-zinc-300 focus-within:border-zinc-900 p-1.5"
              >
                <div className="pl-3.5 pr-2 text-zinc-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  aria-label={t.searchPlaceholder}
                  className="w-full bg-transparent py-2 text-sm text-zinc-900 focus:outline-none"
                />
                <button
                  type="submit"
                  className="shrink-0 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                  {t.searchButton}
                </button>
              </form>
            </div>

            {/* Loading Indicator with Step Progression per Phase 3 Section 16 */}
            {isLoading && (
              <div className="py-20 flex flex-col items-center justify-center text-center">
                <div className="w-8 h-8 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin mb-4" />
                <span className="text-base font-semibold text-zinc-900 mb-1">
                  {loadingStage === 'searching' && 'Searching...'}
                  {loadingStage === 'finding' && 'Finding relevant options...'}
                  {loadingStage === 'comparing' && 'Comparing available information...'}
                </span>
                <span className="text-xs text-zinc-500">
                  Consulting permitted public sources &amp; directory records
                </span>
              </div>
            )}

            {/* Results Content */}
            {!isLoading && decisionResult && (
              <div>
                {/* 1. Comparison Intent */}
                {decisionResult.comparison ? (
                  <ComparisonView
                    comparison={decisionResult.comparison}
                    currentLang={currentLang}
                    onBack={handleResetToHome}
                  />
                ) : decisionResult.parsedQuery.intent === 'EXACT_ENTITY' &&
                  decisionResult.items.length > 0 ? (
                  /* 2. Exact Entity Intent */
                  <ExactEntityView
                    entity={decisionResult.items[0]}
                    alternatives={decisionResult.alternatives}
                    currentLang={currentLang}
                    market={decisionResult.parsedQuery.market}
                    onBack={handleResetToHome}
                    onSelectEntity={(ent) => {
                      setSelectedEntity(ent);
                      setScreen('DETAIL');
                    }}
                  />
                ) : (
                  /* Wirecutter Clone Direct Product Page View */
                  <WirecutterView
                    query={decisionResult.parsedQuery.cleanQuery || query}
                    market={decisionResult.parsedQuery.market || currentMarket}
                    parsedQuery={decisionResult.parsedQuery}
                    liveData={data}
                    lastUpdated={lastUpdated}
                    onBackToHome={handleResetToHome}
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* VIEW: DETAIL SCREEN */}
        {screen === 'DETAIL' && selectedEntity && (
          <ExactEntityView
            entity={selectedEntity}
            currentLang={currentLang}
            onBack={() => setScreen('SEARCH')}
          />
        )}

        {/* VIEW: ABOUT */}
        {screen === 'ABOUT' && <AboutPage onBackToHome={handleResetToHome} />}

        {/* VIEW: CONTACT */}
        {screen === 'CONTACT' && <ContactPage onBackToHome={handleResetToHome} />}

        {/* VIEW: PRIVACY */}
        {screen === 'PRIVACY' && <PrivacyPage onBackToHome={handleResetToHome} />}

        {/* VIEW: TERMS */}
        {screen === 'TERMS' && <TermsPage onBackToHome={handleResetToHome} />}

        {/* VIEW: DISCLAIMER / AFFILIATE */}
        {screen === 'DISCLAIMER' && <DisclaimerPage onBackToHome={handleResetToHome} />}

        {/* Non-intrusive AdSense Container */}
        <AdUnit className="max-w-4xl mx-auto px-4" />

        {/* Compliant Affiliate Disclosure Banner */}
        <AffiliateDisclosure
          currentLang={currentLang}
          onOpenDisclosurePage={() => setScreen('DISCLAIMER')}
        />
      </main>

      {/* Global Footer - Wirecutter Style */}
      <footer className="w-full bg-white border-t border-zinc-200 py-10 mt-16 text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="flex items-center gap-2">
              <span className="bg-zinc-900 text-white text-[11px] font-bold px-1.5 py-0.5 rounded-xs font-serif">
                PR
              </span>
              <span className="font-bold text-zinc-950 font-serif-wirecutter tracking-tight text-sm">
                productreviews.review
              </span>
            </div>
            <p className="text-zinc-500 text-center md:text-left mt-1 text-xs">
              The exact Wirecutter clone for India. Unbiased recommendations, tested by experts.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-medium text-zinc-700">
            <button
              onClick={() => {
                setScreen('ABOUT');
                window.location.hash = '#/about';
              }}
              className="hover:text-zinc-950 hover:underline transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => {
                setScreen('DISCLAIMER');
                window.location.hash = '#/affiliate-disclosure';
              }}
              className="hover:text-zinc-950 hover:underline transition-colors cursor-pointer"
            >
              Trust &amp; How We Test
            </button>
            <button
              onClick={() => {
                setScreen('CONTACT');
                window.location.hash = '#/contact';
              }}
              className="hover:text-zinc-950 hover:underline transition-colors cursor-pointer"
            >
              Contact
            </button>
            <button
              onClick={() => {
                setScreen('PRIVACY');
                window.location.hash = '#/privacy';
              }}
              className="hover:text-zinc-950 hover:underline transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => {
                setScreen('TERMS');
                window.location.hash = '#/terms';
              }}
              className="hover:text-zinc-950 hover:underline transition-colors cursor-pointer"
            >
              Terms
            </button>
            <button
              onClick={() => {
                setScreen('DISCLAIMER');
                window.location.hash = '#/affiliate-disclosure';
              }}
              className="hover:text-zinc-950 hover:underline transition-colors cursor-pointer"
            >
              Affiliate Disclosure
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6 pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-zinc-400 text-[11px]">
          <span>&copy; {new Date().getFullYear()} productreviews.review. All rights reserved.</span>
          <span>Amazon IN Tag: jaiguruji00-21 • Google AdSense Publisher: ca-pub-9048615701580913</span>
        </div>
      </footer>

      {/* Lightweight Cookie / Local Storage Consent */}
      <CookieConsent />
    </div>
  );
}
