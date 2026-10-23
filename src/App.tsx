import React, { useState, useEffect } from "react";
import { contentRepository, ReviewRecord } from "./content/store/contentRepository";
import { WirecutterHome } from "./components/WirecutterHome";
import { PublishedContentView } from "./components/PublishedContentView";
import { ComparisonView } from "./components/ComparisonView";
import { WirecutterView } from "./components/WirecutterView";
import { SEOStatusIndicator } from "./components/seo/SEOStatusIndicator";
import { HreflangInjector } from "./components/seo/HreflangInjector";
import { ProductReviewSchemaInjector } from "./components/seo/ProductReviewSchemaInjector";
import { GlobalSearchBar } from "./components/common/GlobalSearchBar";
import { SUPPORTED_MARKETS, resolveTargetMarket } from "./localization/markets";
import { ShieldCheck, Compass, ExternalLink, Globe, Search } from "lucide-react";

export function App() {
  const [currentMarket, setCurrentMarket] = useState<string>("US");
  const [selectedProduct, setSelectedProduct] = useState<ReviewRecord | null>(null);
  const [compareProducts, setCompareProducts] = useState<[ReviewRecord, ReviewRecord] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [mobileSearchResults, setMobileSearchResults] = useState<ReviewRecord[]>([]);

  // Initialize market from browser environment / location
  useEffect(() => {
    try {
      const resolved = resolveTargetMarket("", "");
      if (resolved && resolved.market) {
        setCurrentMarket(resolved.market);
      }
    } catch {}

    // Check if initial URL points to a specific review or compare
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      if (path.startsWith("/review/")) {
        const slug = path.replace("/review/", "").replace(/\/+$/, "");
        const record = contentRepository.getBySlug(slug);
        if (record) {
          setSelectedProduct(record);
        }
      } else if (path.startsWith("/compare/")) {
        const all = contentRepository.getAll();
        if (all.length >= 2) {
          setCompareProducts([all[0], all[1]]);
        }
      }
    }
  }, []);

  const allProducts = contentRepository.getAll();

  const handleSelectProduct = (record: ReviewRecord) => {
    setSelectedProduct(record);
    setCompareProducts(null);
    setSelectedCategory(null);
    setIsMobileSearchOpen(false);
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", `/review/${record.slug}`);
    }
  };

  const handleCompare = (prodA: ReviewRecord, prodB: ReviewRecord) => {
    setCompareProducts([prodA, prodB]);
    setSelectedProduct(null);
    setSelectedCategory(null);
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", `/compare/${prodA.slug}-vs-${prodB.slug}`);
    }
  };

  const handleBackToHome = () => {
    setSelectedProduct(null);
    setCompareProducts(null);
    setSelectedCategory(null);
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", "/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-amber-200">
      <HreflangInjector currentMarket={currentMarket} />
      {selectedProduct && (
        <ProductReviewSchemaInjector
          productName={selectedProduct.name}
          category={selectedProduct.category}
          brand={selectedProduct.brand}
          ratingValue={selectedProduct.rating}
          reviewCount={selectedProduct.reviewCount}
          reviewTitle="Hardware Review"
          reviewBody={selectedProduct.verdict}
          authorName="Editorial Research Board"
          canonicalUrl={`https://productreviews.review/review/${selectedProduct.slug}`}
          faqs={selectedProduct.faqList?.map((f) => ({ question: f.question, answer: f.answer }))}
        />
      )}
      {compareProducts && (
        <ProductReviewSchemaInjector
          productName={`${compareProducts[0].name} vs ${compareProducts[1].name}`}
          category="Comparisons"
          brand="Editorial Comparison Desk"
          ratingValue="4.8"
          reviewCount="210"
          reviewTitle="Side-by-Side Comparison"
          reviewBody={`Comparative benchmarking analysis between ${compareProducts[0].name} and ${compareProducts[1].name}.`}
          authorName="Editorial Research Board"
          canonicalUrl={`https://productreviews.review/compare/${compareProducts[0].slug}-vs-${compareProducts[1].slug}`}
          breadcrumbs={[
            { name: "Home", url: "https://productreviews.review/" },
            { name: "Comparisons", url: "https://productreviews.review/" },
            { name: `${compareProducts[0].name} vs ${compareProducts[1].name}`, url: `https://productreviews.review/compare/${compareProducts[0].slug}-vs-${compareProducts[1].slug}` }
          ]}
        />
      )}
      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div
            onClick={handleBackToHome}
            className="flex items-center gap-2 cursor-pointer group select-none shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-stone-900 flex items-center justify-center text-amber-400 font-black text-sm group-hover:scale-105 transition-transform">
              P
            </div>
            <div>
              <span className="font-black text-base tracking-tight text-stone-900 group-hover:text-amber-600 transition-colors">
                productreviews.review
              </span>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <GlobalSearchBar onSelectProduct={handleSelectProduct} />

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="sm:hidden p-2 hover:bg-stone-100 rounded-lg text-stone-600"
            >
              <Search className="w-5 h-5" />
            </button>
            {/* Quick Market Pill */}
            <div className="flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-200 px-2.5 py-1 rounded-xl text-xs font-semibold cursor-pointer">
              <Globe className="w-3.5 h-3.5 text-stone-600" />
              <select
                value={currentMarket}
                onChange={(e) => setCurrentMarket(e.target.value)}
                className="bg-transparent border-none text-xs font-bold text-stone-800 cursor-pointer focus:outline-none"
              >
                {SUPPORTED_MARKETS.map((m) => (
                  <option key={m.code} value={m.code}>
                    {m.flag} {m.code} ({m.currencySymbol})
                  </option>
                ))}
              </select>
            </div>

            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-stone-900"
            >
              <span>Sitemap</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
        
        {/* Mobile Search Overlay */}
        {isMobileSearchOpen && (
          <div className="sm:hidden absolute top-full left-0 w-full bg-white border-b border-stone-200 p-4 animate-in slide-in-from-top-2 duration-200 shadow-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                autoFocus
                type="text"
                placeholder="Search reviews..."
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.trim().length > 0) {
                    const filtered = contentRepository.search(val);
                    setMobileSearchResults(filtered.slice(0, 10));
                  } else {
                    setMobileSearchResults([]);
                  }
                }}
                className="w-full bg-stone-100 border border-stone-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
              <button 
                onClick={() => {
                  setIsMobileSearchOpen(false);
                  setMobileSearchResults([]);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-stone-400 uppercase tracking-wider hover:text-stone-600"
              >
                Close
              </button>
            </div>
            
            {/* Simple Mobile Results */}
            <div className="mt-4 space-y-1 max-h-[60vh] overflow-y-auto">
              {mobileSearchResults.length > 0 ? (
                mobileSearchResults.map(record => (
                  <button
                    key={record.slug}
                    onClick={() => handleSelectProduct(record)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-amber-50 rounded-xl transition-colors text-left border border-transparent hover:border-amber-100 group"
                  >
                    <div className="w-8 h-8 rounded bg-stone-100 group-hover:bg-amber-100 group-hover:text-amber-600 flex items-center justify-center text-stone-400 shrink-0 transition-colors">
                      <Package className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-stone-900 truncate">{record.name}</p>
                      <p className="text-[10px] text-stone-500 uppercase tracking-tight">{record.category} • {record.brand}</p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="py-12 text-center">
                  <p className="text-xs text-stone-400">Type to search across all reviews...</p>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1">
        {selectedProduct ? (
          <PublishedContentView
            record={selectedProduct}
            currentMarket={currentMarket}
            onMarketChange={setCurrentMarket}
            onBack={handleBackToHome}
          />
        ) : compareProducts ? (
          <ComparisonView
            productA={compareProducts[0]}
            productB={compareProducts[1]}
            currentMarket={currentMarket}
            onBack={handleBackToHome}
          />
        ) : selectedCategory ? (
          <WirecutterView
            category={selectedCategory}
            products={allProducts}
            currentMarket={currentMarket}
            onSelectProduct={handleSelectProduct}
            onBack={handleBackToHome}
          />
        ) : (
          <WirecutterHome
            products={allProducts}
            currentMarket={currentMarket}
            onMarketChange={setCurrentMarket}
            onSelectProduct={handleSelectProduct}
            onCompare={handleCompare}
          />
        )}
      </main>

      {/* Floating Deep SEO Auditor Widget */}
      <SEOStatusIndicator />

      {/* Authoritative Editorial Footer */}
      <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 pt-12 pb-8 px-4 mt-20 text-xs">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded bg-amber-400 text-stone-950 font-black text-xs flex items-center justify-center">
                P
              </div>
              <span className="font-bold text-sm text-white">productreviews.review</span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed">
              Independent laboratory benchmarks, rigorous hardware longevity testing, and verified Amazon price tracking
              across 14 international regional storefronts.
            </p>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider text-white text-[11px] mb-3">Top Tested Categories</h4>
            <ul className="space-y-2 text-stone-400">
              <li><button onClick={() => { setSelectedCategory("Smartphones"); setSelectedProduct(null); }} className="hover:text-white cursor-pointer">Smartphones & Flagships</button></li>
              <li><button onClick={() => { setSelectedCategory("Audio"); setSelectedProduct(null); }} className="hover:text-white cursor-pointer">Headphones & ANC Earbuds</button></li>
              <li><button onClick={() => { setSelectedCategory("Laptops"); setSelectedProduct(null); }} className="hover:text-white cursor-pointer">Workstations & Laptops</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider text-white text-[11px] mb-3">Search & Crawlers</h4>
            <ul className="space-y-2 text-stone-400">
              <li><a href="/sitemap.xml" className="hover:text-white">XML Sitemap Index</a></li>
              <li><a href="/sitemap-main.xml" className="hover:text-white">Canonical URL Set</a></li>
              <li><a href="/robots.txt" className="hover:text-white">Robots Directives</a></li>
              <li><a href="/faq-manifest.json" className="hover:text-white">FAQ Schema Manifest</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider text-white text-[11px] mb-3">Compliance & Ethics</h4>
            <p className="text-stone-400 text-[11px] leading-relaxed mb-3">
              We participate in the Amazon Services LLC Associates Program and international affiliate advertising programs.
              Editorial verdicts and benchmark scores remain entirely independent.
            </p>
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
              <ShieldCheck className="w-4 h-4" /> Editorial Integrity Policy
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-stone-500 gap-4">
          <p>© 2026 productreviews.review. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-stone-300">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-stone-300">Terms of Use</span>
            <span>•</span>
            <span className="hover:text-stone-300">Affiliate Disclosure</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
