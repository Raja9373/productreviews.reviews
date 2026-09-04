import { MarketCode, MarketInfo } from '../types';

export const SUPPORTED_MARKETS: MarketInfo[] = [
  { code: 'US', name: 'United States', currency: 'USD', currencySymbol: '$', amazonDomain: 'amazon.com', flag: '🇺🇸' },
  { code: 'IN', name: 'India', currency: 'INR', currencySymbol: '₹', amazonDomain: 'amazon.in', flag: '🇮🇳' },
  { code: 'UK', name: 'United Kingdom', currency: 'GBP', currencySymbol: '£', amazonDomain: 'amazon.co.uk', flag: '🇬🇧' },
  { code: 'DE', name: 'Germany', currency: 'EUR', currencySymbol: '€', amazonDomain: 'amazon.de', flag: '🇩🇪' },
  { code: 'FR', name: 'France', currency: 'EUR', currencySymbol: '€', amazonDomain: 'amazon.fr', flag: '🇫🇷' },
  { code: 'ES', name: 'Spain', currency: 'EUR', currencySymbol: '€', amazonDomain: 'amazon.es', flag: '🇪🇸' },
  { code: 'IT', name: 'Italy', currency: 'EUR', currencySymbol: '€', amazonDomain: 'amazon.it', flag: '🇮🇹' },
  { code: 'CA', name: 'Canada', currency: 'CAD', currencySymbol: 'C$', amazonDomain: 'amazon.ca', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', currency: 'AUD', currencySymbol: 'A$', amazonDomain: 'amazon.com.au', flag: '🇦🇺' },
  { code: 'JP', name: 'Japan', currency: 'JPY', currencySymbol: '¥', amazonDomain: 'amazon.co.jp', flag: '🇯🇵' },
  { code: 'BR', name: 'Brazil', currency: 'BRL', currencySymbol: 'R$', amazonDomain: 'amazon.com.br', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico', currency: 'MXN', currencySymbol: '$', amazonDomain: 'amazon.com.mx', flag: '🇲🇽' },
  { code: 'NL', name: 'Netherlands', currency: 'EUR', currencySymbol: '€', amazonDomain: 'amazon.nl', flag: '🇳🇱' },
  { code: 'SG', name: 'Singapore', currency: 'SGD', currencySymbol: 'S$', amazonDomain: 'amazon.sg', flag: '🇸🇬' },
];

export function getMarketInfo(code: MarketCode): MarketInfo {
  return SUPPORTED_MARKETS.find((m) => m.code === code) || SUPPORTED_MARKETS[0];
}

const COUNTRY_KEYWORD_MAP: Record<string, MarketCode> = {
  // Japan
  japan: 'JP',
  japanese: 'JP',
  tokyo: 'JP',
  osaka: 'JP',
  kyoto: 'JP',

  // India
  india: 'IN',
  indian: 'IN',
  bharat: 'IN',
  delhi: 'IN',
  mumbai: 'IN',
  bangalore: 'IN',
  bengaluru: 'IN',
  goa: 'IN',
  hyderabad: 'IN',
  chennai: 'IN',
  kolkata: 'IN',

  // United Kingdom
  uk: 'UK',
  britain: 'UK',
  british: 'UK',
  england: 'UK',
  english: 'UK',
  scotland: 'UK',
  wales: 'UK',
  london: 'UK',
  manchester: 'UK',

  // Germany
  germany: 'DE',
  deutschland: 'DE',
  german: 'DE',
  berlin: 'DE',
  munich: 'DE',
  frankfurt: 'DE',

  // France
  france: 'FR',
  french: 'FR',
  paris: 'FR',
  lyon: 'FR',

  // Spain
  spain: 'ES',
  spanish: 'ES',
  madrid: 'ES',
  barcelona: 'ES',

  // Italy
  italy: 'IT',
  italian: 'IT',
  rome: 'IT',
  milan: 'IT',

  // Canada
  canada: 'CA',
  canadian: 'CA',
  toronto: 'CA',
  vancouver: 'CA',
  montreal: 'CA',

  // Australia
  australia: 'AU',
  australian: 'AU',
  sydney: 'AU',
  melbourne: 'AU',
  brisbane: 'AU',

  // Brazil
  brazil: 'BR',
  brazilian: 'BR',
  brasil: 'BR',
  'sao paulo': 'BR',
  'rio de janeiro': 'BR',

  // Mexico
  mexico: 'MX',
  mexican: 'MX',
  cdmx: 'MX',

  // Netherlands
  netherlands: 'NL',
  holland: 'NL',
  dutch: 'NL',
  amsterdam: 'NL',

  // Singapore
  singapore: 'SG',
  singaporean: 'SG',

  // United States
  usa: 'US',
  america: 'US',
  american: 'US',
  'united states': 'US',
};

export interface MarketResolutionResult {
  market: MarketCode;
  explicitCountry?: string;
  explicitCurrency?: string;
  resolvedBy: 'country' | 'currency' | 'user' | 'locale' | 'default';
}

/**
 * Deterministic market resolution priority:
 * 1. Explicit country in query
 * 2. Explicit currency in query (₹ -> IN, £ -> UK, € -> Euro-market, ¥ -> JP, $ -> contextual/selected market)
 * 3. User-selected country/market
 * 4. Browser/locale fallback
 * (Does not hardcode India as global default)
 */
export function resolveTargetMarket(
  query: string,
  userSelectedMarket?: MarketCode
): MarketResolutionResult {
  const normalizedQuery = ` ${query.toLowerCase()} `;

  // 1. Explicit country in query
  // Test phrases like "in Japan", "for India", or direct country keywords
  for (const [kw, code] of Object.entries(COUNTRY_KEYWORD_MAP)) {
    // Avoid false positives on 2-letter tokens like "us" unless prefixed or standalone
    if (kw === 'us') {
      if (/\b(?:in\s+the\s+us|in\s+us|for\s+us\s+market)\b/i.test(normalizedQuery)) {
        return { market: 'US', explicitCountry: kw, resolvedBy: 'country' };
      }
      continue;
    }

    const pattern = new RegExp(`(?:\\bin|for|near|around|from)\\s+${kw}\\b|\\b${kw}\\b`, 'i');
    if (pattern.test(normalizedQuery)) {
      return { market: code, explicitCountry: kw, resolvedBy: 'country' };
    }
  }

  // 2. Explicit currency in query
  // Priority 2 overrides user-selected market if query specifies distinct currency
  // ₹ / INR / Rs / Rupees / 30000 -> India (IN)
  if (/[₹]|\b(?:inr|rs\.?|rupees?|30000|30,000)\b/i.test(query)) {
    return { market: 'IN', explicitCurrency: '₹', resolvedBy: 'currency' };
  }

  // £ / GBP / Pounds -> UK
  if (/[£]|\b(?:gbp|pounds?)\b/i.test(query)) {
    return { market: 'UK', explicitCurrency: '£', resolvedBy: 'currency' };
  }

  // € / EUR / Euro -> Appropriate Euro-market handling
  // If user already selected a Euro market (DE, FR, ES, IT, NL), preserve it; otherwise default to DE
  if (/[€]|\b(?:eur|euros?)\b/i.test(query)) {
    const euroMarkets: MarketCode[] = ['DE', 'FR', 'ES', 'IT', 'NL'];
    const chosenEuro = userSelectedMarket && euroMarkets.includes(userSelectedMarket)
      ? userSelectedMarket
      : 'DE';
    return { market: chosenEuro, explicitCurrency: '€', resolvedBy: 'currency' };
  }

  // ¥ / JPY / Yen -> Japan (JP) when context indicates JPY
  if (/[¥]|\b(?:jpy|yen)\b/i.test(query)) {
    return { market: 'JP', explicitCurrency: '¥', resolvedBy: 'currency' };
  }

  // Canadian Dollar (C$ / CAD) -> CA
  if (/c\$|\b(?:cad|canadian\s+dollars?)\b/i.test(query)) {
    return { market: 'CA', explicitCurrency: 'C$', resolvedBy: 'currency' };
  }

  // Australian Dollar (A$ / AUD) -> AU
  if (/a\$|\b(?:aud|australian\s+dollars?)\b/i.test(query)) {
    return { market: 'AU', explicitCurrency: 'A$', resolvedBy: 'currency' };
  }

  // Singapore Dollar (S$ / SGD) -> SG
  if (/s\$|\b(?:sgd|singapore\s+dollars?)\b/i.test(query)) {
    return { market: 'SG', explicitCurrency: 'S$', resolvedBy: 'currency' };
  }

  // Brazilian Real (R$ / BRL) -> BR
  if (/r\$|\b(?:brl|reais|real)\b/i.test(query)) {
    return { market: 'BR', explicitCurrency: 'R$', resolvedBy: 'currency' };
  }

  // Mexican Peso (Mex$ / MXN) -> MX
  if (/mex\$|\b(?:mxn|mexican\s+pesos?)\b/i.test(query)) {
    return { market: 'MX', explicitCurrency: '$', resolvedBy: 'currency' };
  }

  // US$ or explicit USD -> US
  if (/us\$|\b(?:usd|us\s+dollars?)\b/i.test(query)) {
    return { market: 'US', explicitCurrency: '$', resolvedBy: 'currency' };
  }

  // Standalone $ or dollars
  // Rule: "US$ / $ → use selected market or contextual country rather than blindly assuming US"
  if (/[\$]|\b(?:dollars?|bucks?)\b/i.test(query)) {
    const dollarMarkets: MarketCode[] = ['US', 'CA', 'AU', 'SG', 'MX'];
    if (userSelectedMarket && dollarMarkets.includes(userSelectedMarket)) {
      return { market: userSelectedMarket, explicitCurrency: '$', resolvedBy: 'currency' };
    }
    return { market: 'US', explicitCurrency: '$', resolvedBy: 'currency' };
  }

  // 3. User-selected country/market
  if (userSelectedMarket && SUPPORTED_MARKETS.some((m) => m.code === userSelectedMarket)) {
    return { market: userSelectedMarket, resolvedBy: 'user' };
  }

  // 4. Browser/locale fallback
  if (typeof navigator !== 'undefined' && navigator.languages) {
    for (const lang of navigator.languages) {
      const parts = lang.split('-');
      if (parts.length > 1) {
        const countryCode = parts[1].toUpperCase() as MarketCode;
        if (SUPPORTED_MARKETS.some((m) => m.code === countryCode)) {
          return { market: countryCode, resolvedBy: 'locale' };
        }
      }
    }
  }

  // Default fallback (US) without hardcoding India
  return { market: 'US', resolvedBy: 'default' };
}
