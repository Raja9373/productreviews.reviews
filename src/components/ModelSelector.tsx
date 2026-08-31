import React from 'react';
import {
  Star,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Tag,
  Scale,
  Gem,
  ShoppingBag,
  ExternalLink,
  Flame,
  CreditCard,
  PhoneCall,
  Info,
  Car,
  Plane,
  Hotel,
  Utensils,
  Home,
  Building,
  GraduationCap,
  HeartPulse,
  Coffee,
  PartyPopper,
} from 'lucide-react';
import { ProductModel, LanguageCode } from '../types';
import { LANGUAGES, TRANSLATIONS } from '../data/languages';
import { Category } from '../data/categories';
import { resolveAffiliateDestination, detectUserIntent } from '../lib/smartRouter';
import {
  detectCountry,
  getAmazonUrl,
  getCarUrl,
  getHotelUrl,
  getFlightUrl,
  getRestaurantUrl,
  getFinanceUrl,
  getRealEstateUrl,
  getHealthcareUrl,
} from '../lib/amazonGlobal';

interface ModelSelectorProps {
  query: string;
  models: ProductModel[];
  currentLang: LanguageCode;
  onSelectModel: (model: ProductModel) => void;
  onBackToSearch: () => void;
  categoryContext?: Category | null;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  query,
  models,
  currentLang,
  onSelectModel,
  onBackToSearch,
  categoryContext,
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const currentLangDef = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];
  const detectedGeoCountry = detectCountry();
  const userCountry = currentLang === 'hi' ? 'IN' : detectedGeoCountry || 'US';

  // Smart Affiliate Destination resolution
  const routing = resolveAffiliateDestination(query, categoryContext?.slug, userCountry);
  const intent = detectUserIntent(query, categoryContext?.slug);

  const formatPrice = (usd: number) => {
    // For automotive prices (> $5,000 / ₹4 Lakhs), format in Lakhs if INR
    if (usd >= 5000 && currentLang === 'hi') {
      const inrValueLakh = (usd * currentLangDef.currencyRate) / 100000;
      return `₹${inrValueLakh.toFixed(1)} Lakh approx.`;
    }
    if (usd === 0) {
      return 'Free OPD / Govt / Clinical';
    }
    const local = Math.round(usd * currentLangDef.currencyRate);
    return `${currentLangDef.currencySymbol}${local.toLocaleString()}`;
  };

  // Find Trending / Top Demand Model
  const trendingModel = models.find((m) => m.budgetTier === 'TRENDING') || models[0];
  const otherModels = models.filter((m) => m.id !== trendingModel?.id);

  const getPartnerIcon = () => {
    switch (routing.partnerKey) {
      case 'cardekho':
        return <Car className="w-4 h-4 text-orange-400" />;
      case 'flights':
        return <Plane className="w-4 h-4 text-sky-400" />;
      case 'hotels':
      case 'resorts':
        return <Hotel className="w-4 h-4 text-emerald-400" />;
      case 'restaurants':
        return <Utensils className="w-4 h-4 text-rose-400" />;
      case 'cafes':
        return <Coffee className="w-4 h-4 text-amber-400" />;
      case 'villas':
        return <Home className="w-4 h-4 text-pink-400" />;
      case 'banquets':
        return <PartyPopper className="w-4 h-4 text-purple-400" />;
      case 'finance':
        return <CreditCard className="w-4 h-4 text-blue-400" />;
      case 'healthcare':
        return <HeartPulse className="w-4 h-4 text-red-400" />;
      case 'realestate':
        return <Building className="w-4 h-4 text-indigo-400" />;
      case 'education':
        return <GraduationCap className="w-4 h-4 text-teal-400" />;
      default:
        return <ShoppingBag className="w-4 h-4 text-amber-400" />;
    }
  };

  const getBudgetTierBadge = (model: ProductModel, idx: number) => {
    if (routing.partnerKey === 'cardekho') {
      if (model.budgetTier === 'BUDGET' || idx === 0) {
        return {
          label: 'Value Pick (Under ₹15 Lakh)',
          icon: <Tag className="w-3 h-3 text-emerald-600" />,
          className: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        };
      }
      if (model.budgetTier === 'BALANCED' || idx === 1 || idx === 2) {
        return {
          label: 'Executive Pick (₹15L - ₹25L)',
          icon: <Scale className="w-3 h-3 text-blue-600" />,
          className: 'bg-blue-50 text-blue-800 border-blue-200',
        };
      }
      return {
        label: 'Flagship Luxury (₹25L+)',
        icon: <Gem className="w-3 h-3 text-purple-600" />,
        className: 'bg-purple-50 text-purple-800 border-purple-200',
      };
    }

    if (model.budgetTier === 'BUDGET' || idx === 0) {
      return {
        label: currentLang === 'hi' ? 'बजट विकल्प' : 'Budget Choice',
        icon: <Tag className="w-3 h-3 text-emerald-600" />,
        className: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      };
    }
    if (model.budgetTier === 'BALANCED' || idx === 1 || idx === 2) {
      return {
        label: currentLang === 'hi' ? 'बैलेंस्ड विकल्प' : 'Balanced Choice',
        icon: <Scale className="w-3 h-3 text-blue-600" />,
        className: 'bg-blue-50 text-blue-800 border-blue-200',
      };
    }
    return {
      label: currentLang === 'hi' ? 'प्रीमियम विकल्प' : 'Premium Pick',
      icon: <Gem className="w-3 h-3 text-purple-600" />,
      className: 'bg-purple-50 text-purple-800 border-purple-200',
    };
  };

  const renderPartnerActionButton = (model: ProductModel, isHero = false) => {
    // If info only (e.g. Healthcare)
    if (routing.infoOnly || !routing.url) {
      return (
        <button
          onClick={() => onSelectModel(model)}
          className={
            isHero
              ? 'px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white font-semibold text-xs transition-colors border border-zinc-700 flex items-center justify-center gap-1.5'
              : 'px-3 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold text-xs transition-colors border border-zinc-200 flex items-center justify-center gap-1'
          }
        >
          <Info className="w-3.5 h-3.5 text-zinc-400" />
          <span>{routing.buttonText}</span>
        </button>
      );
    }

    // Dynamic target URL based on item query and country
    const modelUrl =
      routing.partnerKey === 'amazon'
        ? getAmazonUrl(model.name, userCountry)
        : routing.partnerKey === 'cardekho'
        ? getCarUrl(model.name, userCountry).url
        : routing.partnerKey === 'hotels' || routing.partnerKey === 'resorts'
        ? getHotelUrl(model.name).url
        : routing.partnerKey === 'flights'
        ? getFlightUrl(model.name, userCountry).url
        : routing.partnerKey === 'restaurants' || routing.partnerKey === 'cafes'
        ? getRestaurantUrl(model.name, userCountry).url
        : routing.partnerKey === 'finance'
        ? getFinanceUrl(model.name, userCountry).url
        : routing.partnerKey === 'realestate'
        ? getRealEstateUrl(model.name, userCountry).url
        : routing.url;

    // Distinct styled action buttons per affiliate partner
    if (routing.partnerKey === 'cardekho') {
      return (
        <a
          id={`partner-action-${model.slug}`}
          href={modelUrl!}
          target="_blank"
          rel="nofollow sponsored"
          className={
            isHero
              ? 'px-4 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition-all shadow-md shadow-orange-600/30 flex items-center justify-center gap-1.5'
              : 'px-3 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-950 font-bold text-xs transition-colors border border-orange-300 flex items-center justify-center gap-1'
          }
        >
          <Car className="w-3.5 h-3.5" />
          <span>{routing.buttonText} on CarDekho</span>
          <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
        </a>
      );
    }

    if (routing.partnerKey === 'hotels' || routing.partnerKey === 'resorts') {
      return (
        <a
          id={`partner-action-${model.slug}`}
          href={modelUrl!}
          target="_blank"
          rel="nofollow sponsored"
          className={
            isHero
              ? 'px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5'
              : 'px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-950 font-bold text-xs transition-colors border border-blue-300 flex items-center justify-center gap-1'
          }
        >
          <Hotel className="w-3.5 h-3.5" />
          <span>{routing.buttonText}</span>
          <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
        </a>
      );
    }

    if (routing.partnerKey === 'restaurants' || routing.partnerKey === 'cafes') {
      return (
        <a
          id={`partner-action-${model.slug}`}
          href={modelUrl!}
          target="_blank"
          rel="nofollow sponsored"
          className={
            isHero
              ? 'px-4 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5'
              : 'px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-950 font-bold text-xs transition-colors border border-rose-300 flex items-center justify-center gap-1'
          }
        >
          <Utensils className="w-3.5 h-3.5" />
          <span>{routing.buttonText}</span>
          <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
        </a>
      );
    }

    // Default: Amazon Retail
    return (
      <a
        id={`partner-action-${model.slug}`}
        href={modelUrl!}
        target="_blank"
        rel="nofollow sponsored"
        className={
          isHero
            ? 'px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white font-semibold text-xs transition-colors border border-zinc-700 flex items-center justify-center gap-1.5'
            : 'px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold text-xs transition-colors border border-amber-200 flex items-center justify-center gap-1'
        }
      >
        <ShoppingBag className={`w-3.5 h-3.5 ${isHero ? 'text-amber-400' : 'text-amber-700'}`} />
        <span>{routing.buttonText}</span>
        <ExternalLink className="w-3 h-3 text-zinc-400" />
      </a>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 animate-in fade-in duration-200">
      {/* Top Navigation & Query Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-200">
        <div className="flex items-center gap-3">
          <button
            id="back-to-search-btn"
            onClick={onBackToSearch}
            className="px-3.5 py-1.5 rounded-full border border-zinc-300 hover:bg-zinc-100 text-zinc-700 hover:text-zinc-950 transition-colors flex items-center gap-1.5 text-xs font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.changeQuery || 'Change Query'}</span>
          </button>

          <div>
            <div className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
              {categoryContext?.emoji && <span>{categoryContext.emoji}</span>}
              <span>Category: &quot;{categoryContext?.name || query}&quot;</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 tracking-tight">
              {routing.partnerKey === 'cardekho'
                ? 'Best SUVs & Cars in India 2026 - On-Road Prices & Specs'
                : routing.partnerKey === 'hotels' || routing.partnerKey === 'resorts'
                ? 'Top Verified Hotels & Luxury Stays'
                : routing.partnerKey === 'restaurants'
                ? 'Legendary Eateries & Dining Destinations'
                : routing.partnerKey === 'healthcare'
                ? 'Premier Medical Institutes & Specialty Hospitals'
                : currentLang === 'hi'
                ? 'चुनिंदा मॉडल्स & बेस्ट सेलर्स'
                : 'Top Verified Models & Choices'}
            </h2>
          </div>
        </div>

        {/* Dynamic Partner CTA Header Pill if non-amazon */}
        {routing.url && routing.partnerKey !== 'amazon' && (
          <a
            id="partner-top-header-pill"
            href={routing.url}
            target="_blank"
            rel="nofollow sponsored"
            className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 transition-colors shadow-xs w-fit"
          >
            {getPartnerIcon()}
            <span>
              {routing.buttonText} on {routing.partnerName}
            </span>
            <ExternalLink className="w-3 h-3 text-zinc-400 ml-0.5" />
          </a>
        )}
      </div>

      {/* ========================================================================= */}
      {/* SMART PARTNER BANNER (Context Aware - Only Amazon gets Amazon banner)      */}
      {/* ========================================================================= */}
      {routing.showAmazonBanner ? (
        <div
          id="amazon-live-results-banner"
          className="mb-8 p-3.5 px-4 rounded-2xl bg-zinc-900 text-zinc-100 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md"
        >
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold tracking-wide text-zinc-200">
              Showing live results from Amazon
            </span>
            <span className="hidden sm:inline-block text-[11px] text-zinc-400 border-l border-zinc-700 pl-2">
              PA-API v5 Synced &bull; Real Pricing &amp; Ratings
            </span>
          </div>

          <a
            id="amazon-banner-explore-btn"
            href={routing.url!}
            target="_blank"
            rel="nofollow sponsored"
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 transition-all shadow-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-zinc-950" />
            <span>Have a Look - Explore all {query} on Amazon</span>
            <ExternalLink className="w-3 h-3 text-zinc-900 ml-0.5" />
          </a>
        </div>
      ) : routing.partnerKey === 'cardekho' ? (
        <div
          id="cardekho-verified-banner"
          className="mb-8 p-3.5 px-4 rounded-2xl bg-gradient-to-r from-zinc-900 via-orange-950 to-zinc-900 text-zinc-100 border border-orange-900/50 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md"
        >
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-orange-600/30 border border-orange-500/40 text-orange-400">
              <Car className="w-4 h-4" />
            </span>
            <div>
              <div className="text-xs font-bold tracking-wide text-orange-200 flex items-center gap-2">
                <span>CarDekho Verified Comparison</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 font-mono">
                  Team-BHP &amp; YouTube Validated
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                On-road prices, ARAI mileage, safety crash test scores &amp; real owner complaints
              </p>
            </div>
          </div>

          <a
            id="cardekho-banner-cta"
            href={routing.url!}
            target="_blank"
            rel="nofollow sponsored"
            className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white transition-all shadow-xs shrink-0"
          >
            <span>Compare On-Road Prices</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>
        </div>
      ) : routing.partnerKey === 'hotels' || routing.partnerKey === 'resorts' ? (
        <div
          id="booking-verified-banner"
          className="mb-8 p-3.5 px-4 rounded-2xl bg-blue-950 text-blue-100 border border-blue-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md"
        >
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-blue-600/30 border border-blue-500/40 text-blue-300">
              <Hotel className="w-4 h-4" />
            </span>
            <div>
              <div className="text-xs font-bold tracking-wide text-blue-200">
                Booking.com Verified Stays &amp; Luxury Deals
              </div>
              <p className="text-[11px] text-blue-300/80">
                Direct beachfront villas, free cancellation &amp; verified guest reviews
              </p>
            </div>
          </div>

          <a
            id="booking-banner-cta"
            href={routing.url!}
            target="_blank"
            rel="nofollow sponsored"
            className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-xs shrink-0"
          >
            <span>Check Availability on Booking.com</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>
        </div>
      ) : routing.partnerKey === 'restaurants' || routing.partnerKey === 'cafes' ? (
        <div
          id="zomato-verified-banner"
          className="mb-8 p-3.5 px-4 rounded-2xl bg-rose-950 text-rose-100 border border-rose-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md"
        >
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-rose-600/30 border border-rose-500/40 text-rose-300">
              <Utensils className="w-4 h-4" />
            </span>
            <div>
              <div className="text-xs font-bold tracking-wide text-rose-200">
                Zomato Curated Menus &amp; Table Reservations
              </div>
              <p className="text-[11px] text-rose-300/80">
                Authentic customer ratings, signature dishes &amp; live offers
              </p>
            </div>
          </div>

          <a
            id="zomato-banner-cta"
            href={routing.url!}
            target="_blank"
            rel="nofollow sponsored"
            className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-xs shrink-0"
          >
            <span>View Menu &amp; Reserve on Zomato</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>
        </div>
      ) : routing.partnerKey === 'healthcare' ? (
        <div
          id="healthcare-info-banner"
          className="mb-8 p-3.5 px-4 rounded-2xl bg-zinc-900 text-zinc-200 border border-zinc-800 flex items-center justify-between gap-3 shadow-md"
        >
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-red-950 border border-red-800 text-red-400">
              <HeartPulse className="w-4 h-4" />
            </span>
            <div className="text-xs text-zinc-300 leading-snug">
              <strong className="text-zinc-100">Clinical Directory (Information Only):</strong> Verified rankings, doctor specialities &amp; emergency infrastructure. Please consult licensed medical professionals for urgent care.
            </div>
          </div>
        </div>
      ) : null}

      {/* ========================================================================= */}
      {/* 1. TOP HERO SECTION - "Demand me hai" / "Aaj Kal Sabse Zyada Bik Raha Hai" */}
      {/* ========================================================================= */}
      {trendingModel && (
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 shadow-xs animate-pulse">
              <Flame className="w-4 h-4 text-rose-600 fill-rose-500" />
              <span>
                {routing.partnerKey === 'cardekho'
                  ? '🔥 Most In-Demand & Demanded SUV in India'
                  : currentLang === 'hi'
                  ? '🔥 आज कल सबसे ज़्यादा बिक रहा है (Demand Me Hai)'
                  : '🔥 Top Verified Benchmark Choice'}
              </span>
            </span>
          </div>

          <div
            id={`hero-trending-card-${trendingModel.slug}`}
            className="group bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 text-white rounded-3xl p-6 sm:p-8 border border-zinc-800 shadow-xl relative overflow-hidden transition-all hover:border-zinc-700"
          >
            {/* Subtle background glow effect */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 -mb-20 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center relative z-10">
              {/* Left Column: Product Image */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div
                  onClick={() => onSelectModel(trendingModel)}
                  className="w-full h-64 sm:h-72 rounded-2xl bg-zinc-800/80 border border-zinc-700/50 p-4 flex items-center justify-center relative overflow-hidden group-hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <img
                    src={trendingModel.image}
                    alt={trendingModel.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-rose-600/90 backdrop-blur-xs text-[11px] font-bold tracking-wide text-white uppercase flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-white" />
                    #1 Top Choice
                  </div>
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-xs text-[11px] font-mono text-zinc-300">
                    {trendingModel.brand}
                  </div>
                </div>
              </div>

              {/* Right Column: Title, Real Reason, Specs, Price, CTAs */}
              <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-zinc-800 text-zinc-300 text-xs font-mono">
                      {trendingModel.modelNumber}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-zinc-800 text-zinc-300 text-xs">
                      {trendingModel.category}
                    </span>
                  </div>

                  <h3
                    onClick={() => onSelectModel(trendingModel)}
                    className="text-2xl sm:text-3xl font-extrabold text-white hover:text-rose-300 transition-colors cursor-pointer leading-tight mb-2"
                  >
                    {trendingModel.name}
                  </h3>

                  {/* Real Verified Reason Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-950/50 border border-rose-800/60 text-rose-200 text-xs font-medium mb-4">
                    <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>
                      {trendingModel.whyDemandReason ||
                        `${trendingModel.totalReviews.toLocaleString()} verified reviews`}
                    </span>
                  </div>

                  {/* Rating & Reviews Stars */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400 font-bold text-sm">
                      <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                      <span>{trendingModel.rating} / 5.0</span>
                    </div>
                    <span className="text-xs text-zinc-400 font-medium">
                      ({trendingModel.totalReviews.toLocaleString()} Verified Owner &amp; User Ratings)
                    </span>
                  </div>

                  {/* Key Specifications Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs py-3 px-4 rounded-xl bg-zinc-800/60 border border-zinc-700/40 text-zinc-300 mb-4">
                    {Object.entries(trendingModel.specs)
                      .slice(0, 4)
                      .map(([key, val]) => (
                        <div key={key} className="flex justify-between items-center py-0.5">
                          <span className="text-zinc-400 font-normal">{key}:</span>
                          <span className="font-semibold text-white truncate max-w-[170px]">
                            {val}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Pricing & Double Action Buttons */}
                <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-[11px] font-semibold uppercase text-zinc-400">
                      {routing.partnerKey === 'cardekho' ? 'Price Range (Ex-Showroom)' : 'Pricing / Indicative Rate'}
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-white">
                      {formatPrice(trendingModel.basePriceUSD)}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                    {/* Primary Button: View Full AI Review */}
                    <button
                      id={`hero-select-btn-${trendingModel.slug}`}
                      onClick={() => onSelectModel(trendingModel)}
                      className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm transition-all shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{currentLang === 'hi' ? 'पूरा AI रिव्यू पढ़ें' : 'View Full AI Analysis'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    {/* Secondary Partner Action Button */}
                    {renderPartnerActionButton(trendingModel, true)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. BELOW GRID - "Aapke liye aur options" / "More Options in Your Budget"  */}
      {/* ========================================================================= */}
      {otherModels.length > 0 && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 pb-2 border-b border-zinc-200">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                {currentLang === 'hi' ? 'अन्य विकल्प' : 'Alternative Choices in This Category'}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-zinc-900">
                {currentLang === 'hi'
                  ? 'आपके लिए और विकल्प (Budget, Balanced & Premium)'
                  : `More Options for "${query}"`}
              </h3>
            </div>

            <p className="text-xs text-zinc-500">
              Compare verified real models across 3 distinct budget tiers
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherModels.map((model, idx) => {
              const tierBadge = getBudgetTierBadge(model, idx);

              return (
                <div
                  key={model.id}
                  id={`model-card-${model.slug}`}
                  className="group bg-white rounded-2xl border border-zinc-200 hover:border-zinc-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden p-5 relative"
                >
                  {/* Top Budget Tier Pill */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${tierBadge.className}`}
                    >
                      {tierBadge.icon}
                      <span>{tierBadge.label}</span>
                    </span>
                    <span className="text-[11px] font-mono text-zinc-400 uppercase">
                      {model.modelNumber}
                    </span>
                  </div>

                  {/* Product Image */}
                  <div
                    onClick={() => onSelectModel(model)}
                    className="w-full h-44 rounded-xl bg-zinc-50 border border-zinc-100 overflow-hidden mb-3 relative flex items-center justify-center p-3 cursor-pointer group-hover:bg-zinc-100/60 transition-colors"
                  >
                    <img
                      src={model.image}
                      alt={model.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-medium text-white">
                      {model.brand}
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col">
                    <h4
                      onClick={() => onSelectModel(model)}
                      className="font-bold text-sm text-zinc-900 group-hover:text-rose-600 transition-colors line-clamp-2 mb-1.5 cursor-pointer leading-snug"
                    >
                      {model.name}
                    </h4>

                    {/* Reason or Tag */}
                    <div className="text-[11px] text-zinc-500 font-medium line-clamp-1 mb-2.5">
                      ✓ {model.whyDemandReason || model.tag}
                    </div>

                    {/* Specs Preview */}
                    <div className="space-y-1 mb-3 py-2 px-2.5 rounded-lg bg-zinc-50 text-[11px] text-zinc-600 border border-zinc-100">
                      {Object.entries(model.specs)
                        .slice(0, 2)
                        .map(([key, val]) => (
                          <div key={key} className="flex justify-between items-center">
                            <span className="text-zinc-400">{key}:</span>
                            <span className="font-medium text-zinc-800 truncate max-w-[130px]">
                              {val}
                            </span>
                          </div>
                        ))}
                    </div>

                    {/* Rating & Reviews */}
                    <div className="flex items-center justify-between text-xs mb-4">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                        <span>{model.rating}</span>
                      </div>
                      <span className="text-zinc-400 text-[11px]">
                        {model.totalReviews.toLocaleString()} reviews
                      </span>
                    </div>
                  </div>

                  {/* Card Bottom: Price + Action Button */}
                  <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
                    <div>
                      <div className="text-[10px] text-zinc-400 font-medium uppercase">Price</div>
                      <div className="text-base font-extrabold text-zinc-900">
                        {formatPrice(model.basePriceUSD)}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onSelectModel(model)}
                        className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs transition-colors flex items-center gap-1"
                      >
                        <span>AI Review</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>

                      {renderPartnerActionButton(model, false)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TERTIARY SMALL CAR ACCESSORIES LINK (Common Sense Rule for SUV / Cars) */}
      {/* ========================================================================= */}
      {routing.showAmazonAccessoryLink && (
        <div
          id="car-accessories-tertiary-link"
          className="mt-12 p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-900 shrink-0">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-800">
                Looking for Car Accessories &amp; Essentials?
              </div>
              <p className="text-[11px] text-zinc-500">
                Explore 4K Dashcams, Tyre Inflators, Floor Mats, Cleaning Shampoos &amp; Mobile Holders on Amazon
              </p>
            </div>
          </div>

          <a
            href="https://www.amazon.in/s?k=car+accessories&tag=jaiguruji00-21&linkCode=ll2&ref=as_li_ss_tl"
            target="_blank"
            rel="nofollow sponsored"
            className="text-xs font-semibold text-amber-900 hover:text-amber-950 px-3.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 transition-colors shrink-0 flex items-center gap-1"
          >
            <span>Car Accessories on Amazon</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
};
