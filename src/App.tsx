import React, { useState, useEffect } from "react";
import { contentRepository, ReviewRecord } from "./content/store/contentRepository";
import { WirecutterHome } from "./components/WirecutterHome";
import { PublishedContentView } from "./components/PublishedContentView";
import { ComparisonView } from "./components/ComparisonView";
import { WirecutterView } from "./components/WirecutterView";
import { SEOStatusIndicator } from "./components/seo/SEOStatusIndicator";
import { SUPPORTED_MARKETS, resolveTargetMarket } from "./localization/markets";
import { ShieldCheck, Compass, ExternalLink, Globe } from "lucide-react";

export function App() {
  const [currentMarket, setCurrentMarket] = useState<string>("US");
  const [selectedProduct, setSelectedProduct] = useState<ReviewRecord | null>(null);
  const [compareProducts, setCompareProducts] = useState<[ReviewRecord, ReviewRecord] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div
            onClick={handleBackToHome}
            className="flex items-center gap-2 cursor-pointer group select-none"
          >
            <div className="w-8 h-8 rounded-lg bg-stone-900 flex items-center justify-center text-amber-400 font-black text-sm group-hover:scale-105 transition-transform">
              P
            </div>
            <div>
              <span className="font-black text-base tracking-tight text-stone-900 group-hover:text-amber-600 transition-colors">
                productreviews.review
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold text-stone-400 ml-2 tracking-widest">
                Lab Tested Gear
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
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
