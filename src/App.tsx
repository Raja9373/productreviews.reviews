/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { HeroSearch } from './components/HeroSearch';
import { TrendingSearches } from './components/TrendingSearches';
import { ModelSelector } from './components/ModelSelector';
import { CountdownScanner } from './components/CountdownScanner';
import { ReportView } from './components/ReportView';
import { AboutPage } from './components/pages/AboutPage';
import { ContactPage } from './components/pages/ContactPage';
import { PrivacyPage } from './components/pages/PrivacyPage';
import { TermsPage } from './components/pages/TermsPage';
import { DisclaimerPage } from './components/pages/DisclaimerPage';
import { AffiliateSettingsPage } from './components/pages/AffiliateSettingsPage';
import { FooterGeoAffiliateScript } from './components/FooterGeoAffiliateScript';
import { AdSlot } from './components/AdSlot';
import { ProductModel, DetailedReport, LanguageCode } from './types';
import { LANGUAGES, TRANSLATIONS } from './data/languages';
import {
  getInitialLanguage,
  saveLanguagePreference,
} from './utils/languageDetector';
import { getMockResults, generateDetailedReport, CURATED_PRODUCT_DATABASES } from './data/mockProducts';
import { CATEGORIES, Category, SubCategory, matchCategoryFromQuery } from './data/categories';
import { EdgeRedisCache } from './utils/cacheManager';
import { searchAmazonProducts, fetchCategoryProducts } from './utils/paapiClient';
import { getAffiliatePartner } from './lib/smartRouter';

type AppScreen =
  | 'HERO'
  | 'MODEL_SELECTOR'
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
            const models = getMockResults(matchedCat.name);
            setMatchingModels(models);
            setScreen('MODEL_SELECTOR');
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

      // Search in curated databases
      let foundMatch: ProductModel | undefined;
      for (const key in CURATED_PRODUCT_DATABASES) {
        const match = CURATED_PRODUCT_DATABASES[key].find((m) => m.slug === slug || m.id === slug);
        if (match) {
          foundMatch = match;
          break;
        }
      }

      // If not in curated, generate dynamically from slug words
      if (!foundMatch) {
        const queryFromSlug = slug.replace(/[-_]+/g, ' ');
        const models = getMockResults(queryFromSlug);
        foundMatch = models.find((m) => m.slug === slug || m.id === slug) || models[0];
      }

      if (foundMatch) {
        setSelectedProduct(foundMatch);
        const generated = generateDetailedReport(foundMatch, targetLang || currentLang);
        EdgeRedisCache.set(foundMatch.slug, generated);
        setActiveReport(generated);
        setScreen('REPORT');
        return;
      }
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
    } else if (screen === 'MODEL_SELECTOR' && selectedCategory) {
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

    // Instant local results
    const initialModels = getMockResults(searchTarget);
    setMatchingModels(initialModels);
    setScreen('MODEL_SELECTOR');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Live PA-API fetch ONLY if this category routes to Amazon
    if (category.ctaType === 'amazon' || !category.ctaType) {
      fetchCategoryProducts(category.slug).then((res) => {
        if (res && res.items && res.items.length > 0) {
          setMatchingModels(res.items);
        }
      }).catch((err) => {
        console.warn('[App] Category PA-API fetch notice:', err);
      });
    }
  };

  // Search Submission Handler
  const handleSearchSubmit = (query: string, queryDetectedLang?: LanguageCode) => {
    const targetLang = queryDetectedLang || currentLang;
    if (queryDetectedLang && queryDetectedLang !== currentLang) {
      setCurrentLang(queryDetectedLang);
    }

    const trimmed = query.trim();
    setSearchQuery(trimmed);

    // Check matched category if any
    const matchResult = matchCategoryFromQuery(trimmed);
    const matchedCategory = matchResult?.category || null;
    setSelectedCategory(matchedCategory);

    // Immediate display with initial curated catalog
    const initialModels = getMockResults(trimmed);

    // If query was exact match or only 1 model found or user searched exact slug
    const normalized = trimmed.toLowerCase();
    const exactMatch = initialModels.find(
      (m) =>
        m.name.toLowerCase() === normalized ||
        m.modelNumber.toLowerCase() === normalized ||
        m.slug === normalized
    );

    if (exactMatch) {
      // Direct jump to 5-7s scan
      handleSelectModel(exactMatch, targetLang);
    } else {
      // Show models selector
      setMatchingModels(initialModels);
      setScreen('MODEL_SELECTOR');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Check affiliate partner: ONLY call Amazon PA-API if partner is Amazon
      const partner = getAffiliatePartner(trimmed, matchedCategory?.slug);
      if (partner === 'amazon') {
        searchAmazonProducts(trimmed).then((res) => {
          if (res && res.items && res.items.length > 0) {
            setMatchingModels(res.items);
          }
        }).catch((err) => {
          console.warn('[App] Search PA-API notice:', err);
        });
      }
    }
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

      {/* Ad 1: After header, 728x90 Leaderboard */}
      <div className="w-full px-4 pt-4 flex justify-center">
        <AdSlot id="ad-slot-leaderboard-top" type="leaderboard" className="my-2" />
      </div>

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
            <TrendingSearches
              currentLang={currentLang}
              onSelectSearch={(query) => handleSearchSubmit(query)}
            />
          </>
        )}

        {screen === 'MODEL_SELECTOR' && (
          <ModelSelector
            query={searchQuery}
            models={matchingModels}
            currentLang={currentLang}
            onSelectModel={(m) => handleSelectModel(m)}
            onBackToSearch={handleResetToHome}
            categoryContext={selectedCategory}
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

      {/* Ad 4: Before footer, full width responsive banner */}
      <div className="w-full px-4 pb-2 flex justify-center">
        <AdSlot id="ad-slot-footer-banner" type="footerBanner" className="my-4" />
      </div>

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
              <span>33 Categories Hub</span>
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
    </div>
  );
}
