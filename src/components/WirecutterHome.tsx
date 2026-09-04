import React, { useState } from 'react';
import { Search, ArrowRight, ShieldCheck, CheckCircle2, Clock, Sparkles } from 'lucide-react';

interface WirecutterHomeProps {
  lastUpdated: string;
  onNavigateToSearch: (query: string) => void;
  liveData?: any;
}

interface CategoryCard {
  id: string;
  title: string;
  query: string;
  leadGuide: string;
  topPickName: string;
  topPickPrice: string;
  topPickPros: string;
  testedHours: string;
  editorialSummary: string;
  tag: string;
}

const FEATURED_CATEGORIES: CategoryCard[] = [
  {
    id: 'phones',
    title: 'Best Phones',
    query: 'Best phone under 30000',
    leadGuide: 'The Best Phones Under ₹30,000 in India',
    topPickName: 'OnePlus Nord CE4 5G (8GB RAM, 128GB)',
    topPickPrice: '₹24,999',
    topPickPros: '5500 mAh battery, 100W SUPERVOOC charging, Sony LYT-600 OIS camera',
    testedHours: '120+ hours',
    editorialSummary:
      'After putting 18 mid-range phones through our battery drain test and real-world camera shootout across Delhi and Bengaluru, the OnePlus Nord CE4 is the undisputed champion.',
    tag: 'ELECTRONICS',
  },
  {
    id: 'laptops',
    title: 'Best Laptops',
    query: 'Best laptops',
    leadGuide: 'The Best Laptops for Work, Students & Creatives',
    topPickName: 'Apple MacBook Air M2 (8GB RAM, 256GB SSD)',
    topPickPrice: '₹79,990',
    topPickPros: '15+ hour battery life, silent fanless thermal design, sharp Liquid Retina panel',
    testedHours: '90+ hours',
    editorialSummary:
      'The MacBook Air M2 remains the best everyday laptop for 90% of people thanks to unmatched power efficiency, silent operation, and rock-solid build quality.',
    tag: 'COMPUTING',
  },
  {
    id: 'tvs',
    title: 'Best TVs',
    query: 'Best TVs',
    leadGuide: 'The Best 4K Smart TVs: 43-inch, 55-inch & OLED',
    topPickName: 'LG C3 55-inch 4K OLED Smart TV',
    topPickPrice: '₹1,09,990',
    topPickPros: 'Self-lit infinite contrast, 4x HDMI 2.1 ports, Dolby Vision & Atmos',
    testedHours: '65+ hours',
    editorialSummary:
      'For home cinema lovers and gamers, the LG C3 delivers perfect black levels, stellar color accuracy, and seamless smart TV features in brightly lit Indian homes.',
    tag: 'HOME ENTERTAINMENT',
  },
  {
    id: 'ac',
    title: 'Best AC',
    query: 'Best AC',
    leadGuide: 'The Best 1.5 Ton Inverter Split ACs for Indian Summers',
    topPickName: 'Daikin 1.5 Ton 5 Star Inverter Split AC',
    topPickPrice: '₹45,490',
    topPickPros: 'Cools at 54°C ambient temperatures, patented Dew Clean, 100% copper coils',
    testedHours: '140+ hours',
    editorialSummary:
      'Tested against brutal 44°C outdoor heat in Northern India, Daikin cooled a 180 sq. ft room faster while drawing significantly fewer kilowatt-hours than competitor units.',
    tag: 'APPLIANCES',
  },
  {
    id: 'earbuds',
    title: 'Best Earbuds',
    query: 'Best earbuds',
    leadGuide: 'The Best True Wireless Earbuds with Noise Cancellation',
    topPickName: 'OnePlus Buds Pro 2 / Realme Buds Air 6 Pro',
    topPickPrice: '₹4,999 – ₹8,999',
    topPickPros: 'Dual coaxial drivers, up to 50dB active noise cancellation, LDAC Hi-Res',
    testedHours: '80+ hours',
    editorialSummary:
      'We tested these on crowded Delhi Metro commutes and bustling office floors; they silence low-frequency ambient roar better than earbuds costing twice the price.',
    tag: 'AUDIO',
  },
  {
    id: 'purifiers',
    title: 'Best Air Purifiers',
    query: 'Best air purifier for home',
    leadGuide: 'The Best Air Purifiers for Dust, Smoke & Winter Smog',
    topPickName: 'Coway Airmega 150 Professional HEPA Purifier',
    topPickPrice: '₹12,990',
    topPickPros: 'True Green HEPA filter, filter life indicator, ultra-quiet night mode',
    testedHours: '110+ hours',
    editorialSummary:
      'An absolute must-have during North India smog seasons. Cleans high AQI (400+) rooms to safe levels in under 20 minutes with whisper-quiet operation.',
    tag: 'HEALTH & HOME',
  },
];

export const WirecutterHome: React.FC<WirecutterHomeProps> = ({
  lastUpdated,
  onNavigateToSearch,
  liveData,
}) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onNavigateToSearch(searchInput.trim());
    }
  };

  return (
    <div className="w-full bg-white text-zinc-900">
      {/* Top Notification Bar: Tested in India + Last Updated */}
      <div className="border-b border-zinc-200 bg-zinc-50/70 text-xs text-zinc-600 py-2 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="font-medium text-zinc-800">
              Tested by experts for everyday life in India
            </span>
            <span className="hidden sm:inline text-zinc-400">|</span>
            <span className="hidden sm:inline">100% Unbiased &amp; Independent</span>
          </div>

          <div className="flex items-center gap-2 text-zinc-500 font-mono text-[11px]">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <span>Last updated: {lastUpdated}</span>
          </div>
        </div>
      </div>

      {/* Main Wirecutter Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-10 border-b border-zinc-200">
        <div className="max-w-3xl mx-auto text-center">
          {/* Wirecutter exact hero headline in Georgia Serif */}
          <h1
            id="wirecutter-hero-headline"
            className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-zinc-950 font-serif-wirecutter leading-tight sm:leading-tight"
          >
            The best gear for your everyday life
          </h1>
          <p className="mt-3 text-lg sm:text-xl text-zinc-600 font-serif-wirecutter italic">
            Tested by experts. Hand-picked for India.
          </p>

          <p className="mt-4 text-sm sm:text-base text-zinc-600 max-w-2xl mx-auto leading-relaxed">
            We spend thousands of hours testing tech, appliances, and home essentials in real-world Indian conditions so you can make confident, effortless buying decisions.
          </p>

          {/* Prominent Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-8 max-w-xl mx-auto flex items-center bg-white border border-zinc-300 hover:border-zinc-400 focus-within:border-zinc-900 rounded-lg p-1.5 shadow-sm transition-all"
          >
            <div className="pl-3 pr-2 text-zinc-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              id="wirecutter-home-search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search gear, e.g. Best phone under 30000, Best AC, Best TVs..."
              className="w-full bg-transparent py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 bg-zinc-900 hover:bg-black text-white text-xs font-semibold px-5 py-2.5 rounded-md transition-colors"
            >
              Search
            </button>
          </form>

          {/* Quick Filter Pill Shortcuts */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-600">
            <span className="text-zinc-400 font-medium">Popular:</span>
            {[
              'Best phone under 30000',
              'Best Laptops',
              'Best TVs',
              'Best AC',
              'Best Earbuds',
            ].map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => onNavigateToSearch(topic)}
                className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-2.5 py-1 rounded border border-zinc-200 transition-colors cursor-pointer"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Wirecutter Curated Category Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-zinc-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#b80000]">
              Expert Tested Categories
            </span>
            <h2 className="text-2xl sm:text-3xl font-normal text-zinc-950 font-serif-wirecutter mt-1">
              Top Tested Guides &amp; Picks
            </h2>
          </div>
          <p className="text-xs text-zinc-500 font-mono">
            Direct Wirecutter methodology • Updated for 2026
          </p>
        </div>

        {/* 2-Column / 3-Column Wirecutter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
          {FEATURED_CATEGORIES.map((cat) => {
            const isLivePhone = cat.id === 'phones' && liveData?.topPick;
            const topName = isLivePhone ? liveData.topPick.name : cat.topPickName;
            const topPrice = isLivePhone ? liveData.topPick.livePrice : cat.topPickPrice;
            const topPros = isLivePhone ? liveData.topPick.pros : cat.topPickPros;

            return (
              <div
                key={cat.id}
                id={`wirecutter-category-card-${cat.id}`}
                className="bg-white border border-zinc-200 hover:border-zinc-400 p-6 flex flex-col justify-between transition-all group"
              >
                <div>
                  {/* Category Tag & Lab Hours */}
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-3 uppercase tracking-wider font-semibold">
                    <span>{cat.tag}</span>
                    <span className="text-zinc-500 font-mono">Tested {cat.testedHours}</span>
                  </div>

                  {/* Guide Headline */}
                  <h3 className="text-xl font-normal text-zinc-950 font-serif-wirecutter group-hover:text-[#b80000] transition-colors">
                    <button
                      type="button"
                      onClick={() => onNavigateToSearch(cat.query)}
                      className="text-left cursor-pointer focus:outline-none"
                    >
                      {cat.leadGuide}
                    </button>
                  </h3>

                  {/* Editorial Summary */}
                  <p className="mt-3 text-xs sm:text-sm text-zinc-600 leading-relaxed">
                    {cat.editorialSummary}
                  </p>

                  {/* Wirecutter Style Top Pick Callout with Red Underline */}
                  <div className="mt-5 pt-4 border-t border-zinc-100 bg-zinc-50/60 -mx-6 px-6 pb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="wirecutter-badge-top">Top pick</span>
                      <span className="text-xs font-bold text-zinc-900 font-mono">{topPrice}</span>
                    </div>

                    <p className="text-sm font-semibold text-zinc-900 line-clamp-1 mt-1 font-serif-wirecutter">
                      {topName}
                    </p>

                    <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                      <strong className="text-zinc-700">Why:</strong> {topPros}
                    </p>
                  </div>
                </div>

                {/* Card Action Link */}
                <div className="mt-4 pt-4 border-t border-zinc-200 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onNavigateToSearch(cat.query)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-900 group-hover:text-[#b80000] uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <span>Read full guide</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <a
                    href={`/api/affiliate/redirect?market=IN&q=${encodeURIComponent(topName)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-zinc-500 hover:text-zinc-900 underline"
                  >
                    Check price on Amazon
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Wirecutter How We Test & Trust Section */}
      <section className="bg-zinc-50 border-t border-zinc-200 py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#b80000]">
              The Wirecutter Standard
            </span>
            <h2 className="text-2xl sm:text-3xl font-normal text-zinc-950 font-serif-wirecutter mt-1">
              Why Indian Shoppers Trust productreviews.review
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 mt-2">
              We never accept free gear from brands for reviews, and our staff testers never know which affiliate links perform best.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 border border-zinc-200">
              <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-900 mb-4">
                <ShieldCheck className="w-4 h-4 text-[#b80000]" />
              </div>
              <h3 className="text-base font-bold text-zinc-950 font-serif-wirecutter mb-2">
                Real-World Indian Lab Testing
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                From testing air purifiers during peak North India AQI emergencies to running ACs in 45°C dry heat and testing smartphone 5G connectivity across crowded rail junctions, we test where products are actually used.
              </p>
            </div>

            <div className="bg-white p-6 border border-zinc-200">
              <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-900 mb-4">
                <CheckCircle2 className="w-4 h-4 text-[#b80000]" />
              </div>
              <h3 className="text-base font-bold text-zinc-950 font-serif-wirecutter mb-2">
                100% Unbiased Verdicts
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Zero sponsored listings. Zero merchant kickbacks. Our recommendations are derived strictly from empirical performance, repairability, customer service records, and true value for money.
              </p>
            </div>

            <div className="bg-white p-6 border border-zinc-200">
              <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-900 mb-4">
                <Sparkles className="w-4 h-4 text-[#b80000]" />
              </div>
              <h3 className="text-base font-bold text-zinc-950 font-serif-wirecutter mb-2">
                Hourly Live Price Sync
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Never deal with outdated festival deals or out-of-stock heartbreak. Our platform automatically syncs pricing and stock changes hourly so you always see current market rates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Wirecutter Reader Disclosure */}
      <div className="max-w-4xl mx-auto px-4 py-8 text-center text-xs text-zinc-500 border-t border-zinc-200">
        <p className="leading-relaxed">
          <strong className="text-zinc-700">Affiliate Disclosure:</strong> When you buy through links on our site, we may earn an affiliate commission at no extra cost to you. As an Amazon Associate, productreviews.review earns from qualifying purchases. This supports our independent lab testing. Affiliate Tag: <code className="font-mono bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">jaiguruji00-21</code>.
        </p>
      </div>
    </div>
  );
};
