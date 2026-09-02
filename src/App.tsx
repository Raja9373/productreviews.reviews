/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { HeroSearch } from './components/HeroSearch';
import { TrendingSearches } from './components/TrendingSearches';
import { ModelSelector } from './components/ModelSelector';
import { CategoryTrustpilotPage } from './components/CategoryTrustpilotPage';
import { CountdownScanner } from './components/CountdownScanner';
import { ReportView } from './components/ReportView';
import { AboutPage } from './components/pages/AboutPage';
import { ContactPage } from './components/pages/ContactPage';
import { PrivacyPage } from './components/pages/PrivacyPage';
import { TermsPage } from './components/pages/TermsPage';
import { DisclaimerPage } from './components/pages/DisclaimerPage';
import { AffiliateSettingsPage } from './components/pages/AffiliateSettingsPage';
import { FooterGeoAffiliateScript } from './components/FooterGeoAffiliateScript';
import { AdUnit } from './components/AdUnit';
import { TrustpilotComparisonBanner } from './components/TrustpilotComparisonBanner';
import { ProductFinderChat } from './components/ProductFinderChat';
import { ProductModel, DetailedReport, LanguageCode } from './types';
import { LANGUAGES } from './data/languages';
import {
  getInitialLanguage,
  saveLanguagePreference,
} from './utils/languageDetector';
import { generateDetailedReport } from './utils/reportGenerator';
import { CATEGORIES, Category, SubCategory, matchCategoryFromQuery } from './data/categories';
import { EdgeRedisCache } from './utils/cacheManager';
import { fetchGroundedProducts, GroundingSource, generateIntentAwareQueries } from './utils/groundedSearchClient';

type AppScreen =
  | 'HERO'
  | 'MODEL_SELECTOR'
  | 'CATEGORY'
  | 'SCANNING'
  | 'REPORT'
  | 'ABOUT'
  | 'CONTACT'
  | 'PRIVACY'
  | 'TERMS'
  | 'DISCLAIMER'
  | 'AFFILIATE_SETTINGS';

export default function App() {
  const [currentLang, setCurrentLang] = useState<LanguageCode>(getInitialLanguage());
  const [screen, setScreen] = useState<AppScreen>('HERO');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [matchingModels, setMatchingModels] = useState<ProductModel[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductModel | null>(null);
  const [activeReport, setActiveReport] = useState<DetailedReport | null>(null);
  const [isGroundedSearching, setIsGroundedSearching] = useState(false);
  const [isCategorySearching, setIsCategorySearching] = useState(false);
  const [groundingChunks, setGroundingChunks] = useState<GroundingSource[]>([]);
  const [searchQueriesRun, setSearchQueriesRun] = useState<string[]>([]);
  const [groundingError, setGroundingError] = useState<string | undefined>(undefined);

  // Sync RTL / LTR and document lang tag
  useEffect(() => {
    const langDef = LANGUAGES.find((l) => l.code === currentLang);
    if (langDef) {
      document.documentElement.lang = langDef.code;
      document.documentElement.dir = langDef.dir;
    }
  }, [currentLang]);

  // URL Hash & Pathname Routing Support: e.g. /category/mobile-communication, /about, /review/[slug]
  const parseUrlRoute = useCallback(() => {
    try {
      const hash = window.location.hash.replace(/^#\/?/, '');
      const pathname = window.location.pathname.replace(/^\/+|\/+$/g, '');
      const activeRoute = hash || pathname;

      if (!activeRoute) {
        if (screen !== 'HERO' && screen !== 'MODEL_SELECTOR' && screen !== 'SCANNING' && screen !== 'REPORT') {
          setScreen('HERO');
        }
        return;
      }

      // Check direct static pages: about, contact, privacy, terms, disclaimer, settings/affiliate
      const cleanPath = activeRoute.toLowerCase().replace(/^\/+/, '');
      if (cleanPath === 'about' || cleanPath.endsWith('/about')) {
        setScreen('ABOUT');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (cleanPath === 'contact' || cleanPath.endsWith('/contact')) {
        setScreen('CONTACT');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (cleanPath === 'privacy' || cleanPath.endsWith('/privacy')) {
        setScreen('PRIVACY');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (cleanPath === 'terms' || cleanPath.endsWith('/terms')) {
        setScreen('TERMS');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (cleanPath === 'disclaimer' || cleanPath.endsWith('/disclaimer')) {
        setScreen('DISCLAIMER');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (
        cleanPath === 'settings/affiliate' ||
        cleanPath === 'settings' ||
        cleanPath.endsWith('/settings/affiliate') ||
        cleanPath.endsWith('/settings')
      ) {
        setScreen('AFFILIATE_SETTINGS');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // Check category route: e.g. /category/[slug] or #/category/[slug]
      if (cleanPath.startsWith('category/') || cleanPath.includes('/category/')) {
        const catSlug = cleanPath.split('category/')[1]?.split('/')[0];
        if (catSlug) {
          const matchedCat = CATEGORIES.find((c) => c.slug === catSlug || c.id === catSlug);
          if (matchedCat) {
            setSelectedCategory(matchedCat);
            setSearchQuery(matchedCat.name);
            setMatchingModels([]);
            setIsCategorySearching(true);
            setScreen('CATEGORY');

            fetchGroundedProducts(matchedCat.name, currentLang)
              .then((res) => {
                setIsCategorySearching(false);
                if (res && res.success && res.products.length > 0) {
                  setMatchingModels(res.products);
                } else {
                  setMatchingModels([]);
                }
              })
              .catch(() => {
                setIsCategorySearching(false);
                setMatchingModels([]);
              });
            return;
          }
        }
      }

      // Check standalone language route: e.g. /es or /fr or /ja
      const matchedLang = LANGUAGES.find((l) => l.code.toLowerCase() === cleanPath.toLowerCase());
      if (matchedLang) {
        setCurrentLang(matchedLang.code);
        setScreen('HERO');
        return;
      }

      // Dynamic product report route: e.g. /review/samsung-7kg-ai-washing-machine or /#/en/panasonic-tv-th55mx800 or /#/review/[slug]
      let normalizedRoute = activeRoute;
      if (normalizedRoute.startsWith('review/')) {
        normalizedRoute = normalizedRoute.replace(/^review\//, '');
      }

      const parts = normalizedRoute.split('/');
      let targetLang = currentLang;
      let slug = '';

      if (parts.length >= 2) {
        const urlLang = parts[0] as LanguageCode;
        if (LANGUAGES.some((l) => l.code === urlLang)) {
          targetLang = urlLang;
          setCurrentLang(urlLang);
          slug = parts.slice(1).join('/');
        } else {
          slug = parts.join('/');
        }
      } else {
        slug = parts[0];
      }

      if (slug.startsWith('review/')) {
        slug = slug.replace(/^review\//, '');
      }

      if (!slug) return;

      // Check if report already exists in Edge Cache
      const cached = EdgeRedisCache.get(slug);
      if (cached) {
        setActiveReport(cached);
        setSelectedProduct(cached);
        setScreen('REPORT');
        return;
      }

      // Fetch grounded product live for direct URL
      const queryFromSlug = slug.replace(/[-_]+/g, ' ');
      fetchGroundedProducts(queryFromSlug, targetLang || currentLang).then((res) => {
        if (res.success && res.products.length > 0) {
          const found = res.products.find((m) => m.slug === slug || m.id === slug) || res.products[0];
          setSelectedProduct(found);
          const generated = generateDetailedReport(found, targetLang || currentLang);
          EdgeRedisCache.set(found.slug, generated);
          setActiveReport(generated);
          setScreen('REPORT');
        }
      }).catch((err) => {
        console.warn('[App] Direct route grounded search notice:', err);
      });
    } catch {
      // ignore
    }
  }, [currentLang, screen]);

  useEffect(() => {
    parseUrlRoute();
    window.addEventListener('hashchange', parseUrlRoute);
    return () => window.removeEventListener('hashchange', parseUrlRoute);
  }, [parseUrlRoute]);

  // Sync URL when Report or page is active
  useEffect(() => {
    if (screen === 'REPORT' && activeReport) {
      const newHash = `#/${currentLang}/${activeReport.slug}`;
      if (window.location.hash !== newHash) {
        window.history.pushState(null, '', newHash);
      }
    } else if ((screen === 'CATEGORY' || screen === 'MODEL_SELECTOR') && selectedCategory) {
      window.history.pushState(null, '', `#/category/${selectedCategory.slug}`);
    } else if (screen === 'ABOUT') {
      window.history.pushState(null, '', `#/about`);
    } else if (screen === 'CONTACT') {
      window.history.pushState(null, '', `#/contact`);
    } else if (screen === 'PRIVACY') {
      window.history.pushState(null, '', `#/privacy`);
    } else if (screen === 'TERMS') {
      window.history.pushState(null, '', `#/terms`);
    } else if (screen === 'DISCLAIMER') {
      window.history.pushState(null, '', `#/disclaimer`);
    } else if (screen === 'AFFILIATE_SETTINGS') {
      window.history.pushState(null, '', `#/settings/affiliate`);
    } else if (screen === 'HERO' && window.location.hash && !window.location.hash.startsWith('#/')) {
      window.history.pushState(null, '', window.location.pathname);
    }
  }, [screen, activeReport, currentLang, selectedCategory]);

  // Language Change Handler
  const handleSelectLanguage = (lang: LanguageCode, manual = false) => {
    setCurrentLang(lang);
    if (manual) {
      saveLanguagePreference(lang);
    }

    // If report is active, regenerate or load from cache with new language instantly
    if (activeReport && selectedProduct) {
      const updated = generateDetailedReport(selectedProduct, lang);
      EdgeRedisCache.set(selectedProduct.slug, updated);
      setActiveReport(updated);
    }
  };

  // Category Selection Handler (from Mega Menu or Category links)
  const handleSelectCategory = (category: Category, subcategory?: SubCategory) => {
    setSelectedCategory(category);
    const searchTarget = subcategory ? subcategory.searchQuery : category.name;
    setSearchQuery(searchTarget);

    // Enter CATEGORY screen with active live Google Search Grounding
    setMatchingModels([]);
    setIsCategorySearching(true);
    setScreen('CATEGORY');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Live Google Search Grounding for Category discovery
    fetchGroundedProducts(searchTarget, currentLang)
      .then((res) => {
        setIsCategorySearching(false);
        if (res && res.success && res.products.length > 0) {
          setMatchingModels(res.products);
        } else {
          setMatchingModels([]);
        }
      })
      .catch((err) => {
        console.warn('[App] Category Grounded fetch notice:', err);
        setIsCategorySearching(false);
        setMatchingModels([]);
      });
  };

  // Search Submission Handler - Google Search Grounding Powered
  const handleSearchSubmit = (query: string, queryDetectedLang?: LanguageCode) => {
    const targetLang = queryDetectedLang || currentLang;
    if (queryDetectedLang && queryDetectedLang !== currentLang) {
      setCurrentLang(queryDetectedLang);
    }

    const trimmed = query.trim();
    if (!trimmed) return;

    setSearchQuery(trimmed);

    // Check matched category if any
    const matchResult = matchCategoryFromQuery(trimmed);
    const matchedCategory = matchResult?.category || null;
    setSelectedCategory(matchedCategory);

    // Enter Model Selector screen with active Google Search Grounding loading status
    setMatchingModels([]);
    setIsGroundedSearching(true);
    setGroundingError(undefined);
    const initialQueries = generateIntentAwareQueries(trimmed);
    setSearchQueriesRun(initialQueries);
    setGroundingChunks([]);
    setScreen('MODEL_SELECTOR');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Execute server-side Google Search Grounding tool
    fetchGroundedProducts(trimmed, targetLang)
      .then((res) => {
        setIsGroundedSearching(false);
        if (res.success && res.products.length > 0) {
          setMatchingModels(res.products);
          setGroundingChunks(res.groundingChunks || []);
          setSearchQueriesRun(res.searchQueriesRun || initialQueries);
        } else {
          // If no real products found, strictly show empty state without mock data
          setMatchingModels([]);
          setGroundingError(
            res.errorMessage || `No real products found online for "${trimmed}".`
          );
          setGroundingChunks(res.groundingChunks || []);
        }
      })
      .catch((err) => {
        console.error('[App] Google Search Grounding error:', err);
        setIsGroundedSearching(false);
        setMatchingModels([]);
        setGroundingError(`No real products found online for "${trimmed}".`);
      });
  };

  // Model Selection Handler
  const handleSelectModel = (model: ProductModel, langOverride?: LanguageCode) => {
    setSelectedProduct(model);
    const lang = langOverride || currentLang;

    // Check Edge Redis Cache
    const cached = EdgeRedisCache.get(model.slug);
    if (cached) {
      // Cache hit: instant display
      setActiveReport(cached);
      setScreen('REPORT');
    } else {
      // Cache miss: run 5-7s countdown scanner
      setScreen('SCANNING');
    }
  };

  // Scanner Complete Handler (after 5-7s countdown)
  const handleScanComplete = () => {
    if (!selectedProduct) return;
    const report = generateDetailedReport(selectedProduct, currentLang);
    EdgeRedisCache.set(selectedProduct.slug, report);
    setActiveReport(report);
    setScreen('REPORT');
  };

  const handleResetToHome = () => {
    setScreen('HERO');
    setSelectedProduct(null);
    setActiveReport(null);
    setSelectedCategory(null);
    setSearchQuery('');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigatePage = (target: AppScreen) => {
    setScreen(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50/50 text-zinc-900 selection:bg-zinc-900 selection:text-white">
      {/* Universal Header */}
      <Header
        currentLang={currentLang}
        onSelectLanguage={handleSelectLanguage}
        onResetToHome={handleResetToHome}
        onSelectCategory={handleSelectCategory}
        currentSlug={activeReport?.slug}
      />

      {/* Main Content Body */}
      <main className="flex-1 flex flex-col items-center justify-start w-full">
        {screen === 'HERO' && (
          <>
            <HeroSearch
              currentLang={currentLang}
              onSearchSubmit={handleSearchSubmit}
              onDetectedLanguageChange={(detected) => setCurrentLang(detected)}
              initialQuery={searchQuery}
            />
            {/* Trustpilot Killer Comparison Banner (100% Unbiased Guarantee) */}
            <TrustpilotComparisonBanner />
            <TrendingSearches
              currentLang={currentLang}
              onSelectSearch={(query) => handleSearchSubmit(query)}
            />
            {/* Ad: Homepage placement - 1 ad AFTER TrendingSearches (format auto, max 1) */}
            <AdUnit id="ad-homepage-after-trending" format="auto" responsive={true} className="mb-8" />
          </>
        )}

        {screen === 'CATEGORY' && selectedCategory && (
          <CategoryTrustpilotPage
            category={selectedCategory}
            models={matchingModels}
            currentLang={currentLang}
            onSelectModel={(m) => handleSelectModel(m)}
            onBackToHome={handleResetToHome}
            onRetry={() => handleSelectCategory(selectedCategory)}
            isLoading={isCategorySearching}
          />
        )}

        {screen === 'MODEL_SELECTOR' && (
          <ModelSelector
            query={searchQuery}
            models={matchingModels}
            currentLang={currentLang}
            onSelectModel={(m) => handleSelectModel(m)}
            onBackToSearch={handleResetToHome}
            onRetry={() => handleSearchSubmit(searchQuery, currentLang)}
            categoryContext={selectedCategory}
            isLoadingGrounded={isGroundedSearching}
            groundingChunks={groundingChunks}
            searchQueriesRun={searchQueriesRun}
            groundingErrorMessage={groundingError}
          />
        )}

        {screen === 'SCANNING' && selectedProduct && (
          <CountdownScanner
            product={selectedProduct}
            currentLang={currentLang}
            onComplete={handleScanComplete}
            durationSeconds={6}
          />
        )}

        {screen === 'REPORT' && activeReport && (
          <ReportView
            report={activeReport}
            currentLang={currentLang}
            onBackToSearch={handleResetToHome}
            onSelectLanguage={handleSelectLanguage}
          />
        )}

        {screen === 'ABOUT' && <AboutPage onBackToHome={handleResetToHome} />}
        {screen === 'CONTACT' && <ContactPage onBackToHome={handleResetToHome} />}
        {screen === 'PRIVACY' && <PrivacyPage onBackToHome={handleResetToHome} />}
        {screen === 'TERMS' && <TermsPage onBackToHome={handleResetToHome} />}
        {screen === 'DISCLAIMER' && <DisclaimerPage onBackToHome={handleResetToHome} />}
        {screen === 'AFFILIATE_SETTINGS' && <AffiliateSettingsPage onBackToHome={handleResetToHome} />}
      </main>

      {/* Clean Minimalism Footer */}
      <footer className="w-full border-t border-zinc-100 bg-white py-8 px-4 sm:px-8 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col space-y-6">
          {/* Top Footer Row: Branding & Compulsory Navigation Links */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-zinc-100">
            <button
              onClick={handleResetToHome}
              className="text-sm font-bold text-zinc-900 tracking-tight hover:opacity-80 transition-opacity"
            >
              productreviews<span className="text-zinc-400">.review</span>
            </button>

            {/* 5 Compulsory Routes + Affiliate Configuration Link */}
            <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-zinc-600">
              <button
                id="footer-about-link"
                onClick={() => handleNavigatePage('ABOUT')}
                className={`hover:text-zinc-950 transition-colors ${
                  screen === 'ABOUT' ? 'text-zinc-950 font-bold underline underline-offset-4' : ''
                }`}
              >
                About Us
              </button>
              <button
                id="footer-contact-link"
                onClick={() => handleNavigatePage('CONTACT')}
                className={`hover:text-zinc-950 transition-colors ${
                  screen === 'CONTACT' ? 'text-zinc-950 font-bold underline underline-offset-4' : ''
                }`}
              >
                Contact Us
              </button>
              <button
                id="footer-privacy-link"
                onClick={() => handleNavigatePage('PRIVACY')}
                className={`hover:text-zinc-950 transition-colors ${
                  screen === 'PRIVACY' ? 'text-zinc-950 font-bold underline underline-offset-4' : ''
                }`}
              >
                Privacy Policy
              </button>
              <button
                id="footer-terms-link"
                onClick={() => handleNavigatePage('TERMS')}
                className={`hover:text-zinc-950 transition-colors ${
                  screen === 'TERMS' ? 'text-zinc-950 font-bold underline underline-offset-4' : ''
                }`}
              >
                Terms of Use
              </button>
              <button
                id="footer-disclaimer-link"
                onClick={() => handleNavigatePage('DISCLAIMER')}
                className={`hover:text-zinc-950 transition-colors ${
                  screen === 'DISCLAIMER' ? 'text-zinc-950 font-bold underline underline-offset-4' : ''
                }`}
              >
                Affiliate &amp; AI Disclaimer
              </button>
              <button
                id="footer-affiliate-settings-link"
                onClick={() => handleNavigatePage('AFFILIATE_SETTINGS')}
                className={`hover:text-zinc-950 transition-colors flex items-center gap-1 ${
                  screen === 'AFFILIATE_SETTINGS' ? 'text-zinc-950 font-bold underline underline-offset-4' : 'text-zinc-400'
                }`}
              >
                <span>Affiliate Settings</span>
              </button>
            </nav>
          </div>

          {/* Bottom Footer Row: Technology badges & Copyright */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
            <div className="flex flex-wrap items-center justify-center gap-3 text-[11px]">
              <span>⚡ Edge Redis Cached</span>
              <span>•</span>
              <span>33 Categories Live Grounding</span>
              <span>•</span>
              <span>40 Languages Pre-translated</span>
              <span>•</span>
              <span>Zero Affiliate Bias</span>
            </div>

            <div className="text-[11px] font-mono text-zinc-400">
              © {new Date().getFullYear()} productreviews.review. All rights reserved.
            </div>
          </div>

          {/* Jai Guruji - Global Geo-Affiliate Site-wide Script & Runtime Link Rewriter */}
          <FooterGeoAffiliateScript />
        </div>
      </footer>

      {/* Feature 5: AI Product Finder Interactive Chat Assistant */}
      <ProductFinderChat
        currentLang={currentLang}
        onSearchProduct={(q) => handleSearchSubmit(q)}
      />
    </div>
  );
}
