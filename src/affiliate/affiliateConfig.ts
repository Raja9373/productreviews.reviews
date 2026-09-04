import { MarketCode, LanguageCode } from '../types';

export interface MarketStoreConfig {
  code: MarketCode;
  name: string;
  nativeName: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  amazonDomain: string;
  domain?: string;
  affiliateTag: string;
  defaultLang: LanguageCode;
  supportedLanguages: LanguageCode[];
  regionName: string;
}

export const GLOBAL_STORE_CONFIGS: Record<MarketCode, MarketStoreConfig> = {
  IN: {
    code: 'IN',
    name: 'India',
    nativeName: 'भारत',
    flag: '🇮🇳',
    currency: 'INR',
    currencySymbol: '₹',
    amazonDomain: 'amazon.in',
    affiliateTag: 'jaiguruji00-21',
    defaultLang: 'en',
    supportedLanguages: ['en', 'hi'],
    regionName: 'India',
  },
  US: {
    code: 'US',
    name: 'United States',
    nativeName: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    currencySymbol: '$',
    amazonDomain: 'amazon.com',
    affiliateTag: 'jaiguruji00-20',
    defaultLang: 'en',
    supportedLanguages: ['en', 'es'],
    regionName: 'the United States',
  },
  UK: {
    code: 'UK',
    name: 'United Kingdom',
    nativeName: 'United Kingdom',
    flag: '🇬🇧',
    currency: 'GBP',
    currencySymbol: '£',
    amazonDomain: 'amazon.co.uk',
    affiliateTag: 'jaiguruji0002-21',
    defaultLang: 'en',
    supportedLanguages: ['en'],
    regionName: 'the United Kingdom',
  },
  JP: {
    code: 'JP',
    name: 'Japan',
    nativeName: '日本',
    flag: '🇯🇵',
    currency: 'JPY',
    currencySymbol: '¥',
    amazonDomain: 'amazon.co.jp',
    affiliateTag: 'jaiguruji00-22',
    defaultLang: 'ja',
    supportedLanguages: ['ja', 'en'],
    regionName: 'Japan',
  },
  DE: {
    code: 'DE',
    name: 'Germany',
    nativeName: 'Deutschland',
    flag: '🇩🇪',
    currency: 'EUR',
    currencySymbol: '€',
    amazonDomain: 'amazon.de',
    affiliateTag: 'jaiguruji0004-21',
    defaultLang: 'de',
    supportedLanguages: ['de', 'en'],
    regionName: 'Germany',
  },
  FR: {
    code: 'FR',
    name: 'France',
    nativeName: 'France',
    flag: '🇫🇷',
    currency: 'EUR',
    currencySymbol: '€',
    amazonDomain: 'amazon.fr',
    affiliateTag: 'jaiguruji0005-21',
    defaultLang: 'fr',
    supportedLanguages: ['fr', 'en'],
    regionName: 'France',
  },
  ES: {
    code: 'ES',
    name: 'Spain',
    nativeName: 'España',
    flag: '🇪🇸',
    currency: 'EUR',
    currencySymbol: '€',
    amazonDomain: 'amazon.es',
    affiliateTag: 'jaiguruji0008-21',
    defaultLang: 'es',
    supportedLanguages: ['es', 'en'],
    regionName: 'Spain',
  },
  IT: {
    code: 'IT',
    name: 'Italy',
    nativeName: 'Italia',
    flag: '🇮🇹',
    currency: 'EUR',
    currencySymbol: '€',
    amazonDomain: 'amazon.it',
    affiliateTag: 'jaiguruji0007-21',
    defaultLang: 'it',
    supportedLanguages: ['it', 'en'],
    regionName: 'Italy',
  },
  CA: {
    code: 'CA',
    name: 'Canada',
    nativeName: 'Canada',
    flag: '🇨🇦',
    currency: 'CAD',
    currencySymbol: 'C$',
    amazonDomain: 'amazon.ca',
    affiliateTag: 'jaiguruji000b-20',
    defaultLang: 'en',
    supportedLanguages: ['en', 'fr'],
    regionName: 'Canada',
  },
  AU: {
    code: 'AU',
    name: 'Australia',
    nativeName: 'Australia',
    flag: '🇦🇺',
    currency: 'AUD',
    currencySymbol: 'A$',
    amazonDomain: 'amazon.com.au',
    affiliateTag: 'jaiguruji00-20',
    defaultLang: 'en',
    supportedLanguages: ['en'],
    regionName: 'Australia',
  },
  BR: {
    code: 'BR',
    name: 'Brazil',
    nativeName: 'Brasil',
    flag: '🇧🇷',
    currency: 'BRL',
    currencySymbol: 'R$',
    amazonDomain: 'amazon.com.br',
    affiliateTag: 'jaiguruji00-20',
    defaultLang: 'en',
    supportedLanguages: ['en'],
    regionName: 'Brazil',
  },
  MX: {
    code: 'MX',
    name: 'Mexico',
    nativeName: 'México',
    flag: '🇲🇽',
    currency: 'MXN',
    currencySymbol: '$',
    amazonDomain: 'amazon.com.mx',
    affiliateTag: 'jaiguruji00-20',
    defaultLang: 'es',
    supportedLanguages: ['es', 'en'],
    regionName: 'Mexico',
  },
  NL: {
    code: 'NL',
    name: 'Netherlands',
    nativeName: 'Nederland',
    flag: '🇳🇱',
    currency: 'EUR',
    currencySymbol: '€',
    amazonDomain: 'amazon.nl',
    affiliateTag: 'jaiguruji0004-21',
    defaultLang: 'en',
    supportedLanguages: ['en', 'de'],
    regionName: 'the Netherlands',
  },
  SG: {
    code: 'SG',
    name: 'Singapore',
    nativeName: 'Singapore',
    flag: '🇸🇬',
    currency: 'SGD',
    currencySymbol: 'S$',
    amazonDomain: 'amazon.sg',
    affiliateTag: 'jaiguruji00-20',
    defaultLang: 'en',
    supportedLanguages: ['en'],
    regionName: 'Singapore',
  },
};

export function getStoreConfig(market: MarketCode): MarketStoreConfig & { domain: string } {
  const cfg = GLOBAL_STORE_CONFIGS[market] || GLOBAL_STORE_CONFIGS.US;
  return {
    ...cfg,
    domain: cfg.amazonDomain,
  };
}

export function buildAffiliateUrl(query: string, market: MarketCode, asin?: string): string {
  const config = getStoreConfig(market);
  const params = new URLSearchParams();
  params.set('q', query.trim());
  params.set('market', market);
  params.set('tag', config.affiliateTag);
  if (asin) {
    params.set('asin', asin.trim());
  }
  return `/api/affiliate/redirect?${params.toString()}`;
}
