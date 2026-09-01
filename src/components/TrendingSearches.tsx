import React, { useState } from 'react';
import {
  TrendingUp,
  Sparkles,
  Flame,
  ArrowRight,
  Smartphone,
  Laptop,
  Camera,
  Tv,
  Car,
  Headphones,
  Home,
  ShieldCheck,
  Star,
  Zap,
  Tag,
  Search,
} from 'lucide-react';
import { LanguageCode } from '../types';

interface TrendingSearchesProps {
  currentLang: LanguageCode;
  onSelectSearch: (query: string) => void;
}

interface TrendingItem {
  id: string;
  name: string;
  query: string;
  category: string;
  iconType: 'phone' | 'laptop' | 'camera' | 'tv' | 'auto' | 'audio' | 'home';
  image: string;
  badge: string;
  rating: number;
  reviews: string;
  subtitle: string;
  searchVolume: string;
  tagType: 'hot' | 'top' | 'value' | 'new';
}

type FilterCategory = 'all' | 'phones' | 'laptops' | 'cameras' | 'appliances' | 'auto' | 'audio';

export const TrendingSearches: React.FC<TrendingSearchesProps> = ({
  currentLang,
  onSelectSearch,
}) => {
  const [activeTab, setActiveTab] = useState<FilterCategory>('all');

  const categories: { id: FilterCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: currentLang === 'hi' ? '🔥 सभी ट्रेंडिंग' : '🔥 All Trending', icon: <Flame className="w-3.5 h-3.5" /> },
    { id: 'phones', label: currentLang === 'hi' ? 'स्मार्टफ़ोन' : 'Phones & Tech', icon: <Smartphone className="w-3.5 h-3.5" /> },
    { id: 'cameras', label: currentLang === 'hi' ? 'कैमरा' : 'Cameras', icon: <Camera className="w-3.5 h-3.5" /> },
    { id: 'laptops', label: currentLang === 'hi' ? 'लैपटॉप' : 'Laptops & IT', icon: <Laptop className="w-3.5 h-3.5" /> },
    { id: 'appliances', label: currentLang === 'hi' ? 'होम अप्लायंसेज' : 'Home Appliances', icon: <Home className="w-3.5 h-3.5" /> },
    { id: 'audio', label: currentLang === 'hi' ? 'ऑडियो' : 'Audio & Wearables', icon: <Headphones className="w-3.5 h-3.5" /> },
    { id: 'auto', label: currentLang === 'hi' ? 'कार और बाइक' : 'Cars & Bikes', icon: <Car className="w-3.5 h-3.5" /> },
  ];

  const quickPills = [
    { query: 'sony camera', label: 'Sony Alpha 7 IV', badge: 'Trending' },
    { query: 'iphone 15 pro', label: 'iPhone 15 Pro', badge: 'Flagship' },
    { query: 'samsung s24 ultra', label: 'Galaxy S24 Ultra', badge: 'AI Phone' },
    { query: 'panasonic tv', label: 'Panasonic 4K TV', badge: 'Top Rated' },
    { query: 'macbook pro m3', label: 'MacBook Pro M3', badge: 'Pro IT' },
    { query: 'dyson vacuum', label: 'Dyson V15 Detect', badge: 'Smart Home' },
    { query: 'thar roxx', label: 'Mahindra Thar Roxx', badge: 'Auto' },
    { query: 'sony wh-1000xm5', label: 'Sony WH-1000XM5', badge: 'Best Audio' },
    { query: 'washing machine', label: 'Front Load Washing Machine', badge: 'Appliances' },
    { query: 'royal enfield classic 350', label: 'RE Classic 350', badge: 'Motorcycle' },
  ];

  const trendingItems: TrendingItem[] = [
    {
      id: 'trend-sony-a7iv',
      name: 'Sony Alpha 7 IV Full-Frame Camera',
      query: 'sony camera',
      category: 'cameras',
      iconType: 'camera',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80',
      badge: '🔥 #1 In Cameras',
      rating: 4.8,
      reviews: '4,890',
      subtitle: '33MP Exmor R CMOS & 4K 60p 10-Bit Video',
      searchVolume: '14.2k scans today',
      tagType: 'hot',
    },
    {
      id: 'trend-iphone-15',
      name: 'Apple iPhone 15 Pro Max',
      query: 'iphone 15 pro',
      category: 'phones',
      iconType: 'phone',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
      badge: '⚡ Flagship Benchmark',
      rating: 4.9,
      reviews: '18,400',
      subtitle: 'Titanium chassis, A17 Pro & 5x optical telephoto',
      searchVolume: '28.5k scans today',
      tagType: 'top',
    },
    {
      id: 'trend-s24-ultra',
      name: 'Samsung Galaxy S24 Ultra',
      query: 'samsung galaxy s24 ultra',
      category: 'phones',
      iconType: 'phone',
      image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
      badge: '🤖 Galaxy AI Powered',
      rating: 4.8,
      reviews: '12,300',
      subtitle: 'Snapdragon 8 Gen 3, 200MP camera & built-in S-Pen',
      searchVolume: '19.8k scans today',
      tagType: 'hot',
    },
    {
      id: 'trend-macbook-m3',
      name: 'Apple MacBook Pro 16" (M3 Max)',
      query: 'macbook pro m3',
      category: 'laptops',
      iconType: 'laptop',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
      badge: '💻 Pro Creative Power',
      rating: 4.9,
      reviews: '3,250',
      subtitle: '16-Core CPU, Liquid Retina XDR & 22h battery life',
      searchVolume: '9.4k scans today',
      tagType: 'top',
    },
    {
      id: 'trend-dyson-v15',
      name: 'Dyson V15 Detect Cordless Vacuum',
      query: 'dyson vacuum',
      category: 'appliances',
      iconType: 'home',
      image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80',
      badge: '✨ Laser Illumination',
      rating: 4.7,
      reviews: '8,920',
      subtitle: 'Piezo sensor particle counter & 230AW suction',
      searchVolume: '11.1k scans today',
      tagType: 'value',
    },
    {
      id: 'trend-panasonic-tv',
      name: 'Panasonic 65" 4K OLED Smart TV',
      query: 'panasonic tv',
      category: 'appliances',
      iconType: 'tv',
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&auto=format&fit=crop&q=80',
      badge: '🎬 Hollywood Tuned OLED',
      rating: 4.8,
      reviews: '5,120',
      subtitle: 'HCX Pro AI Processor, Dolby Vision IQ & Atmos',
      searchVolume: '8.7k scans today',
      tagType: 'top',
    },
    {
      id: 'trend-sony-xm5',
      name: 'Sony WH-1000XM5 Noise Cancelling',
      query: 'sony headphones',
      category: 'audio',
      iconType: 'audio',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      badge: '🎧 Industry Leading ANC',
      rating: 4.8,
      reviews: '24,100',
      subtitle: 'Auto NC Optimizer, 8 microphones & 30h battery',
      searchVolume: '16.3k scans today',
      tagType: 'hot',
    },
    {
      id: 'trend-thar-roxx',
      name: 'Mahindra Thar Roxx 4x4 SUV',
      query: 'thar roxx',
      category: 'auto',
      iconType: 'auto',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&auto=format&fit=crop&q=80',
      badge: '🚗 Trending Auto Search',
      rating: 4.8,
      reviews: '1,420 specs',
      subtitle: 'Panoramic Sunroof, Level-2 ADAS & mStallion Turbo',
      searchVolume: '32.1k queries today',
      tagType: 'new',
    },
    {
      id: 'trend-re-classic',
      name: 'Royal Enfield Classic 350',
      query: 'royal enfield classic 350',
      category: 'auto',
      iconType: 'auto',
      image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop&q=80',
      badge: '🏍️ Top Cruiser Bike',
      rating: 4.7,
      reviews: '2,900 specs',
      subtitle: 'J-Series 349cc Engine, Dual Channel ABS & Classic Styling',
      searchVolume: '18.4k queries today',
      tagType: 'top',
    },
    {
      id: 'trend-front-load',
      name: 'Samsung 8kg AI Front Load Washer',
      query: 'washing machine',
      category: 'appliances',
      iconType: 'home',
      image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=80',
      badge: '💧 EcoBubble Steam Wash',
      rating: 4.7,
      reviews: '7,400',
      subtitle: 'AI Control with smart Wi-Fi integration & hygiene steam',
      searchVolume: '10.5k scans today',
      tagType: 'value',
    },
    {
      id: 'trend-sony-zve10',
      name: 'Sony Alpha ZV-E10 Vlog Camera',
      query: 'sony zv-e10',
      category: 'cameras',
      iconType: 'camera',
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&auto=format&fit=crop&q=80',
      badge: '📹 Creator Best Seller',
      rating: 4.6,
      reviews: '8,340',
      subtitle: 'Product Showcase mode & Directional 3-capsule mic',
      searchVolume: '7.9k scans today',
      tagType: 'hot',
    },
    {
      id: 'trend-asus-rog',
      name: 'ASUS ROG Zephyrus G16 Gaming',
      query: 'asus rog laptop',
      category: 'laptops',
      iconType: 'laptop',
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80',
      badge: '⚡ RTX 4080 Gaming',
      rating: 4.8,
      reviews: '1,980',
      subtitle: 'Intel Core Ultra 9, 2.5K OLED 240Hz & CNC Aluminium',
      searchVolume: '6.4k scans today',
      tagType: 'new',
    },
  ];

  const filteredItems = activeTab === 'all'
    ? trendingItems
    : trendingItems.filter((item) => item.category === activeTab);

  const getCategoryIcon = (type: TrendingItem['iconType']) => {
    switch (type) {
      case 'phone':
        return <Smartphone className="w-3.5 h-3.5 text-zinc-600" />;
      case 'laptop':
        return <Laptop className="w-3.5 h-3.5 text-zinc-600" />;
      case 'camera':
        return <Camera className="w-3.5 h-3.5 text-zinc-600" />;
      case 'tv':
        return <Tv className="w-3.5 h-3.5 text-zinc-600" />;
      case 'auto':
        return <Car className="w-3.5 h-3.5 text-zinc-600" />;
      case 'audio':
        return <Headphones className="w-3.5 h-3.5 text-zinc-600" />;
      case 'home':
        return <Home className="w-3.5 h-3.5 text-zinc-600" />;
      default:
        return <Tag className="w-3.5 h-3.5 text-zinc-600" />;
    }
  };

  return (
    <section id="trending-searches-section" className="w-full max-w-6xl mx-auto px-4 sm:px-6 pb-16">
      {/* Header with Market Activity Status */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-zinc-200/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200/60 text-xs font-semibold tracking-wide mb-2.5">
            <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
            <span>
              {currentLang === 'hi' ? 'आज के सबसे लोकप्रिय सर्च' : 'Trending Product Scans'}
            </span>
            <span className="w-1 h-1 rounded-full bg-amber-400" />
            <span className="text-amber-700 font-mono text-[11px]">Real-Time Verified</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 tracking-tight">
            {currentLang === 'hi' ? (
              <>लोग आज सबसे ज्यादा क्या <span className="underline decoration-zinc-300 underline-offset-4">रिसर्च</span> कर रहे हैं?</>
            ) : (
              <>What Buyers Are <span className="underline decoration-zinc-300 underline-offset-4">Researching</span> Right Now</>
            )}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            {currentLang === 'hi'
              ? 'किसी भी प्रोडक्ट पर क्लिक करके तुरंत मल्टी-सोर्स AI रिव्यू और मॉडल तुलना देखें'
              : 'Click any trending product to instantly generate a cross-verified multi-source review & price breakdown'}
          </p>
        </div>

        {/* Real-time Counter Badge */}
        <div className="flex items-center gap-2 self-start md:self-auto px-3.5 py-2 bg-zinc-900 text-white rounded-xl text-xs font-medium shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono text-zinc-300">1,420+</span>
          <span>models analyzed today</span>
        </div>
      </div>

      {/* Quick Pills Carousel / Grid */}
      <div className="mt-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
          <span className="text-xs font-bold text-zinc-400 shrink-0 uppercase tracking-wider flex items-center gap-1 mr-1">
            <Zap className="w-3 h-3 text-amber-500" />
            Quick:
          </span>
          {quickPills.map((pill) => (
            <button
              key={pill.query}
              id={`quick-pill-${pill.query.replace(/\s+/g, '-')}`}
              onClick={() => onSelectSearch(pill.query)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-zinc-200 hover:border-zinc-900 hover:bg-zinc-50 text-xs font-medium text-zinc-800 transition-all shrink-0 shadow-2xs group"
            >
              <Search className="w-3 h-3 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
              <span>{pill.label}</span>
              <span className="text-[10px] text-zinc-400 bg-zinc-100 px-1.5 py-0.2 rounded font-mono">
                {pill.badge}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Category Tab Filters */}
      <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-zinc-100">
        {categories.map((cat) => {
          const isSelected = activeTab === cat.id;
          return (
            <button
              key={cat.id}
              id={`trending-filter-tab-${cat.id}`}
              onClick={() => setActiveTab(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-zinc-100/80 text-zinc-600 hover:bg-zinc-200/80 hover:text-zinc-900'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Product Cards Grid */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            id={`trending-card-${item.id}`}
            onClick={() => onSelectSearch(item.query)}
            className="group relative bg-white rounded-2xl border border-zinc-200/90 hover:border-zinc-900 p-4 transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col justify-between"
          >
            {/* Top Row: Category icon & Badge */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium bg-zinc-50 px-2 py-1 rounded-md border border-zinc-100">
                  {getCategoryIcon(item.iconType)}
                  <span className="capitalize">{item.category}</span>
                </div>

                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                    item.tagType === 'hot'
                      ? 'bg-red-50 text-red-700 border-red-200/70'
                      : item.tagType === 'top'
                      ? 'bg-amber-50 text-amber-800 border-amber-200/70'
                      : item.tagType === 'new'
                      ? 'bg-blue-50 text-blue-700 border-blue-200/70'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200/70'
                  }`}
                >
                  {item.badge}
                </span>
              </div>

              {/* Product Thumbnail + Title */}
              <div className="flex gap-3 items-start">
                <div className="w-16 h-16 rounded-xl bg-zinc-100 border border-zinc-100 overflow-hidden shrink-0 relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-zinc-900 group-hover:text-zinc-700 transition-colors line-clamp-2 leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-zinc-500 line-clamp-2 mt-1 leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Row: Rating, Verified Count & Arrow CTA */}
            <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs font-bold text-zinc-900 bg-amber-50/80 px-1.5 py-0.5 rounded border border-amber-200/50">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>{item.rating}</span>
                </div>
                <span className="text-[11px] text-zinc-400">
                  ({item.reviews})
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-zinc-900 group-hover:translate-x-0.5 transition-transform">
                <span className="text-[11px] text-zinc-500 group-hover:text-zinc-900">Scan</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-900" />
              </div>
            </div>

            {/* Subtle Search Volume Tag at Bottom */}
            <div className="mt-2 text-[10px] font-mono text-zinc-400 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-zinc-400" />
              <span>{item.searchVolume}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Live Market Insights Ticker / Banner in Clean Trustpilot Style */}
      <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-white border border-zinc-200 text-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="w-10 h-10 rounded-full bg-[#E8F8F2] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-[#00B67A]" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-zinc-900">
              Unbiased AI Verdicts Across 40+ Regional Languages
            </h4>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              We aggregate verified customer sentiment, Reddit community threads, and teardowns with TrustScore consensus.
            </p>
          </div>
        </div>

        <button
          id="trending-explore-all-btn"
          onClick={() => onSelectSearch('best electronics 2026')}
          className="px-4.5 py-2.5 bg-[#00B67A] hover:bg-[#008254] text-white rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 shadow-2xs cursor-pointer"
        >
          <span>Explore All Reviews</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
};
