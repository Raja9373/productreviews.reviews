export type LanguageCode =
  | 'en' | 'hi' | 'ja' | 'es' | 'de' | 'fr' | 'ar' | 'pt' | 'ru' | 'ko'
  | 'zh-CN' | 'zh-TW' | 'bn' | 'ta' | 'te' | 'mr' | 'ur' | 'it' | 'nl' | 'pl'
  | 'tr' | 'vi' | 'th' | 'id' | 'ms' | 'fil' | 'fa' | 'uk' | 'ro' | 'el'
  | 'sv' | 'no' | 'da' | 'fi' | 'cs' | 'hu' | 'he' | 'sw' | 'af';

export interface LanguageDef {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
  currency: string;
  currencySymbol: string;
  currencyRate: number; // relative to USD
}

export interface CouponData {
  code: string;
  discountPercent: number;
  discountText: string;
  expiryHours: number;
  store: string;
  verifiedToday: boolean;
}

export interface StorePrice {
  storeName: string;
  priceUSD: number;
  inStock: boolean;
  shipping: string;
  url: string;
}

export interface SentimentAnalysis {
  amazonScore: number;
  amazonReviewsCount: number;
  amazonSummary: string;
  redditSentiment: 'Extremely Positive' | 'Mostly Positive' | 'Mixed' | 'Negative';
  redditMentionCount: number;
  redditSummary: string;
  youtubeVideosAnalyzed: number;
  youtubeVerdict: string;
  expertScore: number; // out of 100
}

export interface ProductModel {
  id: string;
  slug: string;
  name: string;
  modelNumber: string;
  brand: string;
  category: string;
  image: string;
  basePriceUSD: number;
  rating: number;
  totalReviews: number;
  tag: string; // e.g. "Best Overall", "Top Value", "Flagship 2026", "Editor's Choice"
  specs: { [key: string]: string };
  asin?: string;
}

export interface DetailedReport extends ProductModel {
  verdict: 'BUY' | 'DONT_BUY' | 'CONSIDER_ALT';
  score: number; // out of 10
  scoreBreakdown: {
    performance: number;
    buildQuality: number;
    valueForMoney: number;
    features: number;
    reliability: number;
  };
  summary: { [lang in LanguageCode]?: string };
  pros: { [lang in LanguageCode]?: string[] };
  cons: { [lang in LanguageCode]?: string[] };
  bestFor: string[];
  coupon: CouponData;
  stores: StorePrice[];
  sentiment: SentimentAnalysis;
  cachedAt?: number;
  generatedInMs?: number;
}

export interface ScanStage {
  id: number;
  text: string;
  source: 'amazon' | 'youtube' | 'reddit' | 'tech' | 'coupons';
  durationMs: number;
}

export interface TranslationDictionary {
  siteTitle: string;
  tagline: string;
  searchPlaceholder: string;
  searchBtn: string;
  micListening: string;
  micPrompt: string;
  popularLabel: string;
  modelsFoundTitle: string;
  modelsFoundSubtitle: string;
  selectModelPrompt: string;
  changeQuery: string;
  analyzingTitle: string;
  analyzingSubtitle: string;
  verdictBuy: string;
  verdictDontBuy: string;
  verdictAlt: string;
  overallScoreLabel: string;
  prosTitle: string;
  consTitle: string;
  bestForTitle: string;
  keySpecsTitle: string;
  latestCouponTitle: string;
  copyCouponBtn: string;
  copiedToast: string;
  expiresInLabel: string;
  viewDealBtn: string;
  verifiedBuyerReviews: string;
  multiSourceAnalysis: string;
  amazonSentiment: string;
  redditConsensus: string;
  youtubeBreakdown: string;
  cachedAtBadge: string;
  seoUrlsTitle: string;
  shareReportBtn: string;
  backToSearch: string;
  currencyLabel: string;
}
