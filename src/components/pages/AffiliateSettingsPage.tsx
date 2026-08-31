import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Save,
  RotateCcw,
  Check,
  Globe,
  ExternalLink,
  ShieldCheck,
  Tag,
  Zap,
  Layers,
  Sparkles,
  Search,
  Code
} from 'lucide-react';
import {
  AMAZON_MARKETPLACES,
  AffiliateSettings,
  getAffiliateSettings,
  saveAffiliateSettings,
  resetAffiliateSettings,
  buildAmazonAffiliateUrl,
  getAffiliateLink,
} from '../../utils/affiliateManager';
import { LANGUAGES } from '../../data/languages';
import { LanguageCode } from '../../types';

interface AffiliateSettingsPageProps {
  onBackToHome: () => void;
}

export const AffiliateSettingsPage: React.FC<AffiliateSettingsPageProps> = ({ onBackToHome }) => {
  const [settings, setSettings] = useState<AffiliateSettings>(getAffiliateSettings());
  const [isSaved, setIsSaved] = useState(false);
  const [testCountry, setTestCountry] = useState('IN');
  const [testLang, setTestLang] = useState<LanguageCode>('hi');
  const [testProduct, setTestProduct] = useState('Panasonic 55" 4K Google TV');
  const [testModel, setTestModel] = useState('TH-55MX800');
  const [testAsin, setTestAsin] = useState('B0C4Z57P8M');

  useEffect(() => {
    const handleStorageUpdate = () => {
      setSettings(getAffiliateSettings());
    };
    window.addEventListener('affiliate_settings_updated', handleStorageUpdate);
    return () => window.removeEventListener('affiliate_settings_updated', handleStorageUpdate);
  }, []);

  const handleTagChange = (countryCode: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      tags: {
        ...prev.tags,
        [countryCode]: value.trim(),
      },
    }));
    setIsSaved(false);
  };

  const handleSave = () => {
    saveAffiliateSettings(settings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Reset all 13 Amazon affiliate IDs back to factory default tags?')) {
      const defaults = resetAffiliateSettings();
      setSettings(defaults);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  const testResult = buildAmazonAffiliateUrl(
    testProduct,
    testModel,
    testLang,
    testCountry,
    testAsin
  );
  const directAsinResult = getAffiliateLink(testAsin);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-300">
      {/* Top Breadcrumb Bar */}
      <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-zinc-100">
        <button
          id="affiliate-settings-back-btn"
          onClick={onBackToHome}
          className="px-3.5 py-1.5 rounded-full border border-zinc-200 hover:bg-zinc-50 text-zinc-700 hover:text-zinc-950 transition-colors flex items-center gap-1.5 text-xs font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Engine</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 font-mono">Route:</span>
          <span className="px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-800 text-xs font-semibold border border-zinc-200">
            /settings/affiliate
          </span>
        </div>
      </div>

      {/* Main Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
            Admin Configuration
          </span>
          <span className="text-xs text-zinc-400 font-mono">13 Amazon Marketplaces</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
          Auto Geo-Affiliate Settings
        </h1>
        <p className="text-sm text-zinc-600 mt-2 max-w-3xl leading-relaxed">
          Configure country-specific Amazon Associate Store IDs. Visitors from India are routed to Amazon India (<code>amazon.in?tag=jaiguruji00-21</code>), while USA and global international visitors are routed to Amazon US (<code>amazon.com?tag=jaiguruji00-20</code>) with Amazon Global Earning coverage.
        </p>
      </div>

      {/* Jai Guruji Global Geo-Affiliate System Status Card */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 mb-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg shrink-0">
              ⚡
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <span>Jai Guruji Global Geo-Affiliate System</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                  ACTIVE IN FOOTER
                </span>
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Zero external dependencies. Pure client-side browser timezone (Asia/Kolkata / Asia/Calcutta) &amp; ASIN auto-rewriting.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-600 shrink-0">
            <Code className="w-3.5 h-3.5 text-zinc-400" />
            <span>Site-Wide Hook</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">India Storefront</span>
            <code className="text-[11px] font-mono text-zinc-800 break-all mt-1 block">
              amazon.in/dp/{'{ASIN}'}?tag=jaiguruji00-21
            </code>
          </div>
          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">USA &amp; Global Earning</span>
            <code className="text-[11px] font-mono text-zinc-800 break-all mt-1 block">
              amazon.com/dp/{'{ASIN}'}?tag=jaiguruji00-20
            </code>
          </div>
          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Detection Logic</span>
            <span className="text-[11px] font-semibold text-zinc-800 mt-1 block">
              Asia/Kolkata or Asia/Calcutta
            </span>
          </div>
        </div>
      </div>

      {/* 13 Country Affiliate IDs Table */}
      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-xs mb-8">
        <div className="p-5 bg-zinc-50/70 border-b border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-2">
              <Tag className="w-4 h-4 text-zinc-600" />
              13 Country Amazon Associate Store IDs
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Enter your official Amazon Associates tracking ID for each regional marketplace.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="affiliate-reset-btn"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl border border-zinc-200 hover:bg-white text-xs font-semibold text-zinc-600 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Defaults</span>
            </button>

            <button
              id="affiliate-save-btn"
              onClick={handleSave}
              className="px-4 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
              <span>{isSaved ? 'Saved to LocalStorage!' : 'Save All IDs'}</span>
            </button>
          </div>
        </div>

        <div className="divide-y divide-zinc-100 overflow-x-auto">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-zinc-50 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
            <div className="col-span-3 sm:col-span-3">Country / Region</div>
            <div className="col-span-3 sm:col-span-2">Storefront</div>
            <div className="col-span-6 sm:col-span-4">Your Affiliate Associate Tag</div>
            <div className="hidden sm:block sm:col-span-3 text-right">Mapped Languages</div>
          </div>

          {AMAZON_MARKETPLACES.map((market) => {
            const currentVal = settings.tags[market.countryCode] || market.defaultTag;
            const isCustomized = currentVal !== market.defaultTag;

            return (
              <div
                key={market.countryCode}
                className="grid grid-cols-12 gap-4 px-6 py-3.5 items-center hover:bg-zinc-50/50 transition-colors"
              >
                {/* Country Name */}
                <div className="col-span-3 sm:col-span-3 flex items-center gap-2">
                  <span className="text-lg select-none">{market.flag}</span>
                  <div>
                    <span className="text-xs font-bold text-zinc-900 block leading-tight">
                      {market.countryName}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      {market.countryCode} • {market.currencySymbol} {market.currencyCode}
                    </span>
                  </div>
                </div>

                {/* Domain */}
                <div className="col-span-3 sm:col-span-2">
                  <a
                    href={`https://www.${market.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-zinc-600 hover:text-zinc-950 flex items-center gap-1 hover:underline"
                  >
                    <span>{market.domain}</span>
                    <ExternalLink className="w-3 h-3 text-zinc-300" />
                  </a>
                </div>

                {/* Input Field */}
                <div className="col-span-6 sm:col-span-4">
                  <div className="relative flex items-center">
                    <input
                      id={`affiliate-tag-${market.countryCode.toLowerCase()}`}
                      type="text"
                      value={currentVal}
                      onChange={(e) => handleTagChange(market.countryCode, e.target.value)}
                      placeholder={market.defaultTag}
                      className="w-full px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-mono text-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 focus:bg-white transition-all font-semibold"
                    />
                    {isCustomized && (
                      <span className="absolute right-2 text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                        Custom
                      </span>
                    )}
                  </div>
                </div>

                {/* Mapped Languages */}
                <div className="hidden sm:block sm:col-span-3 text-right">
                  <div className="text-[11px] text-zinc-500 font-medium">
                    {market.associatedLangs.length > 0
                      ? market.associatedLangs.join(', ')
                      : 'International Fallback'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Affiliate Link Tester & Simulator */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs">
        <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-zinc-600" />
          Interactive Geo-Link Simulator &amp; Tester
        </h2>
        <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
          Simulate a user query from any country or language to inspect the generated Amazon affiliate URL and tracking parameter.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-6">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              Simulated Country
            </label>
            <select
              value={testCountry}
              onChange={(e) => setTestCountry(e.target.value)}
              className="w-full p-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-800"
            >
              {AMAZON_MARKETPLACES.map((m) => (
                <option key={m.countryCode} value={m.countryCode}>
                  {m.flag} {m.countryName} ({m.countryCode})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              User Language
            </label>
            <select
              value={testLang}
              onChange={(e) => setTestLang(e.target.value as LanguageCode)}
              className="w-full p-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-800"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.name} ({l.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              Product Name
            </label>
            <input
              type="text"
              value={testProduct}
              onChange={(e) => setTestProduct(e.target.value)}
              className="w-full p-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-800"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              Model Number
            </label>
            <input
              type="text"
              value={testModel}
              onChange={(e) => setTestModel(e.target.value)}
              className="w-full p-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-800"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              Amazon ASIN
            </label>
            <input
              type="text"
              value={testAsin}
              onChange={(e) => setTestAsin(e.target.value)}
              placeholder="e.g. B0C4Z57P8M"
              className="w-full p-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono font-medium text-zinc-800"
            />
          </div>
        </div>

        {/* Output Result Box */}
        <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 text-white font-mono text-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-800 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Target Marketplace:</span>
              <span className="text-emerald-400 font-bold">
                {testResult.geoTarget.flag} {testResult.geoTarget.countryName} ({testResult.geoTarget.domain})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Active Tag:</span>
              <span className="text-yellow-400 font-bold">?tag={testResult.geoTarget.affiliateTag}</span>
            </div>
            <div>
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px]">
                {testResult.geoTarget.shipsToText}
              </span>
            </div>
          </div>

          <div>
            <div className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider mb-1">
              Generated Product Link (with ASIN Direct DP):
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-emerald-300 break-all text-[11px]">
                {testResult.url}
              </span>
              <a
                id="test-affiliate-link-btn"
                href={testResult.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold shrink-0 transition-colors flex items-center gap-1.5"
              >
                <span>Test Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-800/80">
            <div className="text-[10px] text-amber-400 uppercase font-bold tracking-wider mb-1">
              Direct Browser Detection Result (Jai Guruji Auto-Geo):
            </div>
            <div className="flex items-center justify-between gap-3 text-[11px]">
              <span className="text-amber-200/90 break-all">
                {directAsinResult}
              </span>
              <a
                href={directAsinResult}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-[10px] font-bold shrink-0 transition-colors flex items-center gap-1"
              >
                <span>Open Direct</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
