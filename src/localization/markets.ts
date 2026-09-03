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
  japan: 'JP',
  tokyo: 'JP',
  japanese: 'JP',
  india: 'IN',
  indian: 'IN',
  delhi: 'IN',
  mumbai: 'IN',
  bangalore: 'IN',
  goa: 'IN',
  usa: 'US',
  us: 'US',
  america: 'US',
  american: 'US',
  uk: 'UK',
  britain: 'UK',
  england: 'UK',
  london: 'UK',
  germany: 'DE',
  deutschland: 'DE',
  berlin: 'DE',
  german: 'DE',
  france: 'FR',
  paris: 'FR',
  french: 'FR',
  spain: 'ES',
  madrid: 'ES',
  barcelona: 'ES',
  spanish: 'ES',
  italy: 'IT',
  rome: 'IT',
  milan: 'IT',
  italian: 'IT',
  canada: 'CA',
  toronto: 'CA',
  canadian: 'CA',
  australia: 'AU',
  sydney: 'AU',
  australian: 'AU',
  brazil: 'BR',
  mexico: 'MX',
  netherlands: 'NL',
  holland: 'NL',
  amsterdam: 'NL',
  singapore: 'SG',
};

/**
 * Priority resolution:
 * 1. Explicit country in user query (e.g. "best SUV in Japan" -> JP)
 * 2. User-selected market
 * 3. Browser / locale fallback
 */
export function resolveTargetMarket(
  query: string,
  userSelectedMarket?: MarketCode
): { market: MarketCode; explicitCountry?: string } {
  const normalizedQuery = ` ${query.toLowerCase()} `;

  // 1. Explicit country check in query
  for (const [kw, code] of Object.entries(COUNTRY_KEYWORD_MAP)) {
    const pattern = new RegExp(`(?:\\bin|for|near|around)\\s+${kw}\\b|\\b${kw}\\b`, 'i');
    if (pattern.test(normalizedQuery)) {
      return { market: code, explicitCountry: kw };
    }
  }

  // 2. User-selected market
  if (userSelectedMarket) {
    return { market: userSelectedMarket };
  }

  // 3. Browser locale detection fallback
  if (typeof navigator !== 'undefined' && navigator.languages) {
    for (const lang of navigator.languages) {
      const parts = lang.split('-');
      if (parts.length > 1) {
        const countryCode = parts[1].toUpperCase() as MarketCode;
        if (SUPPORTED_MARKETS.some((m) => m.code === countryCode)) {
          return { market: countryCode };
        }
      }
    }
  }

  return { market: 'US' };
}
