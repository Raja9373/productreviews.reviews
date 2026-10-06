/**
 * ProductReviews.review — Market Context Foundation
 * Provides market-neutral defaults and deterministic country/regional resolution.
 */

import { MarketCode } from '../../types';
import { resolveTargetMarket, getMarketInfo, SUPPORTED_MARKETS } from '../../localization/markets';

export interface MarketContext {
  countryCode: string;
  marketName: string;
  region?: string;
  currency: string;
  language: string;
  amazonMarketplace?: string;
  terminologyLocale?: string;
  availabilityContext: 'LOCAL' | 'REGIONAL' | 'GLOBAL' | 'UNKNOWN';
  regulatoryContext?: string;
  marketConfidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';
  isExplicitInQuery: boolean;
}

const MARKET_METADATA: Record<string, {
  name: string;
  region: string;
  currency: string;
  defaultLang: string;
  amazonDomain: string;
  terminologyLocale: string;
  regulatoryContext: string;
}> = {
  US: { name: 'United States', region: 'North America', currency: 'USD', defaultLang: 'en', amazonDomain: 'amazon.com', terminologyLocale: 'en-US', regulatoryContext: 'FCC / FDA' },
  GB: { name: 'United Kingdom', region: 'Europe', currency: 'GBP', defaultLang: 'en', amazonDomain: 'amazon.co.uk', terminologyLocale: 'en-GB', regulatoryContext: 'UKCA / BSI' },
  UK: { name: 'United Kingdom', region: 'Europe', currency: 'GBP', defaultLang: 'en', amazonDomain: 'amazon.co.uk', terminologyLocale: 'en-GB', regulatoryContext: 'UKCA / BSI' },
  IN: { name: 'India', region: 'South Asia', currency: 'INR', defaultLang: 'en', amazonDomain: 'amazon.in', terminologyLocale: 'en-IN', regulatoryContext: 'BIS / TRAI' },
  CA: { name: 'Canada', region: 'North America', currency: 'CAD', defaultLang: 'en', amazonDomain: 'amazon.ca', terminologyLocale: 'en-CA', regulatoryContext: 'ISED' },
  AU: { name: 'Australia', region: 'Oceania', currency: 'AUD', defaultLang: 'en', amazonDomain: 'amazon.com.au', terminologyLocale: 'en-AU', regulatoryContext: 'ACMA' },
  DE: { name: 'Germany', region: 'European Union', currency: 'EUR', defaultLang: 'de', amazonDomain: 'amazon.de', terminologyLocale: 'de-DE', regulatoryContext: 'CE / DIN' },
  FR: { name: 'France', region: 'European Union', currency: 'EUR', defaultLang: 'fr', amazonDomain: 'amazon.fr', terminologyLocale: 'fr-FR', regulatoryContext: 'CE / AFNOR' },
  IT: { name: 'Italy', region: 'European Union', currency: 'EUR', defaultLang: 'it', amazonDomain: 'amazon.it', terminologyLocale: 'it-IT', regulatoryContext: 'CE / UNI' },
  ES: { name: 'Spain', region: 'European Union', currency: 'EUR', defaultLang: 'es', amazonDomain: 'amazon.es', terminologyLocale: 'es-ES', regulatoryContext: 'CE / UNE' },
  NL: { name: 'Netherlands', region: 'European Union', currency: 'EUR', defaultLang: 'nl', amazonDomain: 'amazon.nl', terminologyLocale: 'nl-NL', regulatoryContext: 'CE' },
  SG: { name: 'Singapore', region: 'Southeast Asia', currency: 'SGD', defaultLang: 'en', amazonDomain: 'amazon.sg', terminologyLocale: 'en-SG', regulatoryContext: 'IMDA' },
  JP: { name: 'Japan', region: 'East Asia', currency: 'JPY', defaultLang: 'ja', amazonDomain: 'amazon.co.jp', terminologyLocale: 'ja-JP', regulatoryContext: 'VCCI / PSE' },
  BR: { name: 'Brazil', region: 'Latin America', currency: 'BRL', defaultLang: 'pt', amazonDomain: 'amazon.com.br', terminologyLocale: 'pt-BR', regulatoryContext: 'Anatel' },
  MX: { name: 'Mexico', region: 'Latin America', currency: 'MXN', defaultLang: 'es', amazonDomain: 'amazon.com.mx', terminologyLocale: 'es-MX', regulatoryContext: 'NOM' }
};

/**
 * Global Market-Neutral Fallback Context
 */
export const GLOBAL_MARKET_CONTEXT: MarketContext = {
  countryCode: 'GLOBAL',
  marketName: 'Global Market',
  region: 'International',
  currency: 'USD', // Standard international reference
  language: 'en',
  availabilityContext: 'GLOBAL',
  marketConfidence: 'HIGH',
  isExplicitInQuery: false
};

/**
 * Resolves MarketContext using strict priority rules:
 * EXPLICIT QUERY > EXPLICIT USER MARKET > EXPLICIT LOCALE > SAFE GLOBAL DEFAULT
 */
export function resolveMarketContext(
  query: string,
  explicitUserMarket?: MarketCode,
  explicitLocale?: string
): MarketContext {
  const cleanQ = (query || '').trim();

  // 1. Check for Explicit Country / Market in Query
  const { market, explicitCountry, explicitCurrency } = resolveTargetMarket(cleanQ, explicitUserMarket);

  if (explicitCountry || explicitCurrency) {
    const code = market === 'UK' ? 'GB' : market;
    const meta = MARKET_METADATA[code] || MARKET_METADATA[market] || MARKET_METADATA['US'];
    return {
      countryCode: code,
      marketName: meta.name,
      region: meta.region,
      currency: explicitCurrency || meta.currency,
      language: meta.defaultLang,
      amazonMarketplace: meta.amazonDomain,
      terminologyLocale: meta.terminologyLocale,
      availabilityContext: 'LOCAL',
      regulatoryContext: meta.regulatoryContext,
      marketConfidence: 'HIGH',
      isExplicitInQuery: true
    };
  }

  // 2. Check for Explicit User Market Parameter
  if (explicitUserMarket) {
    const code = explicitUserMarket === 'UK' ? 'GB' : explicitUserMarket;
    const meta = MARKET_METADATA[code] || MARKET_METADATA[explicitUserMarket];
    if (meta) {
      return {
        countryCode: code,
        marketName: meta.name,
        region: meta.region,
        currency: meta.currency,
        language: meta.defaultLang,
        amazonMarketplace: meta.amazonDomain,
        terminologyLocale: meta.terminologyLocale,
        availabilityContext: 'LOCAL',
        regulatoryContext: meta.regulatoryContext,
        marketConfidence: 'HIGH',
        isExplicitInQuery: false
      };
    }
  }

  // 3. Check for Explicit Application Locale (e.g. "de-DE", "ja-JP", "en-GB")
  if (explicitLocale && explicitLocale.includes('-')) {
    const regionPart = explicitLocale.split('-')[1]?.toUpperCase();
    if (regionPart && MARKET_METADATA[regionPart]) {
      const meta = MARKET_METADATA[regionPart];
      return {
        countryCode: regionPart,
        marketName: meta.name,
        region: meta.region,
        currency: meta.currency,
        language: meta.defaultLang,
        amazonMarketplace: meta.amazonDomain,
        terminologyLocale: meta.terminologyLocale,
        availabilityContext: 'LOCAL',
        regulatoryContext: meta.regulatoryContext,
        marketConfidence: 'MEDIUM',
        isExplicitInQuery: false
      };
    }
  }

  // 4. Safe Default: Market-Neutral Global Context (Never silently force US or India)
  return GLOBAL_MARKET_CONTEXT;
}
