import { MarketCode, LanguageCode } from '../types';
import { getStoreConfig, GLOBAL_STORE_CONFIGS } from '../affiliate/affiliateConfig';

export interface DetectedGeoInfo {
  market: MarketCode;
  language: LanguageCode;
  currency: string;
  currencySymbol: string;
  countryName: string;
  source: 'stored' | 'timezone' | 'locale' | 'server' | 'default';
}

/**
 * Maps IANA TimeZone identifier to primary country
 */
function mapTimeZoneToMarket(timeZone: string): MarketCode | null {
  const tz = timeZone.toLowerCase();

  // India
  if (tz.includes('kolkata') || tz.includes('calcutta') || tz === 'ist') {
    return 'IN';
  }

  // Japan
  if (tz.includes('tokyo') || tz === 'jst') {
    return 'JP';
  }

  // United Kingdom
  if (tz.includes('london') || tz.includes('belfast') || tz === 'gmt' || tz === 'bst') {
    return 'UK';
  }

  // Germany
  if (tz.includes('berlin') || tz.includes('busingen')) {
    return 'DE';
  }

  // France
  if (tz.includes('paris')) {
    return 'FR';
  }

  // Spain
  if (tz.includes('madrid') || tz.includes('canary') || tz.includes('ceuta')) {
    return 'ES';
  }

  // Italy
  if (tz.includes('rome')) {
    return 'IT';
  }

  // Canada
  if (
    tz.includes('toronto') ||
    tz.includes('vancouver') ||
    tz.includes('montreal') ||
    tz.includes('edmonton') ||
    tz.includes('winnipeg') ||
    tz.includes('halifax') ||
    tz.includes('st_johns') ||
    tz.includes('regina')
  ) {
    return 'CA';
  }

  // United States
  if (
    tz.includes('new_york') ||
    tz.includes('chicago') ||
    tz.includes('los_angeles') ||
    tz.includes('denver') ||
    tz.includes('phoenix') ||
    tz.includes('detroit') ||
    tz.includes('indiana') ||
    tz.includes('honolulu') ||
    tz.includes('anchorage') ||
    tz.includes('boise')
  ) {
    return 'US';
  }

  return null;
}

/**
 * Maps browser language tags (e.g. ja-JP, de-DE, fr-FR) to primary country
 */
function mapLocaleToMarket(locale: string): MarketCode | null {
  const norm = locale.toLowerCase();
  const parts = norm.split('-');
  const lang = parts[0];
  const region = parts[1] || '';

  if (region === 'in' || lang === 'hi') return 'IN';
  if (region === 'jp' || lang === 'ja') return 'JP';
  if (region === 'gb' || region === 'uk') return 'UK';
  if (region === 'de' || (lang === 'de' && !region)) return 'DE';
  if (region === 'fr' || (lang === 'fr' && region !== 'ca')) return 'FR';
  if (region === 'es' || (lang === 'es' && region === 'es')) return 'ES';
  if (region === 'it' || lang === 'it') return 'IT';
  if (region === 'ca') return 'CA';
  if (region === 'us') return 'US';
  if (region === 'au') return 'AU';

  // Generic language checks
  if (lang === 'ja') return 'JP';
  if (lang === 'de') return 'DE';
  if (lang === 'it') return 'IT';
  if (lang === 'fr') return 'FR';

  return null;
}

/**
 * Primary Geo detection function:
 * 1. Checks user saved preference
 * 2. Checks browser IANA Timezone
 * 3. Checks browser navigator languages
 * 4. Defaults to United States or appropriate country
 */
export function detectUserCountry(): DetectedGeoInfo {
  // 1. User manual selection stored in localStorage
  try {
    const savedMarket = localStorage.getItem('pr_market') as MarketCode;
    const savedLang = localStorage.getItem('pr_lang') as LanguageCode;
    if (savedMarket && GLOBAL_STORE_CONFIGS[savedMarket]) {
      const cfg = getStoreConfig(savedMarket);
      return {
        market: savedMarket,
        language: savedLang || cfg.defaultLang,
        currency: cfg.currency,
        currencySymbol: cfg.currencySymbol,
        countryName: cfg.name,
        source: 'stored',
      };
    }
  } catch {}

  // 2. Timezone Detection
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz) {
      const tzMarket = mapTimeZoneToMarket(tz);
      if (tzMarket && GLOBAL_STORE_CONFIGS[tzMarket]) {
        const cfg = getStoreConfig(tzMarket);
        return {
          market: tzMarket,
          language: cfg.defaultLang,
          currency: cfg.currency,
          currencySymbol: cfg.currencySymbol,
          countryName: cfg.name,
          source: 'timezone',
        };
      }
    }
  } catch {}

  // 3. Locale / Language List Detection
  try {
    if (typeof navigator !== 'undefined') {
      const langs = navigator.languages || [navigator.language];
      for (const l of langs) {
        const lMarket = mapLocaleToMarket(l);
        if (lMarket && GLOBAL_STORE_CONFIGS[lMarket]) {
          const cfg = getStoreConfig(lMarket);
          return {
            market: lMarket,
            language: cfg.defaultLang,
            currency: cfg.currency,
            currencySymbol: cfg.currencySymbol,
            countryName: cfg.name,
            source: 'locale',
          };
        }
      }
    }
  } catch {}

  // 4. Default: United States
  const usConfig = GLOBAL_STORE_CONFIGS.US;
  return {
    market: 'US',
    language: usConfig.defaultLang,
    currency: usConfig.currency,
    currencySymbol: usConfig.currencySymbol,
    countryName: usConfig.name,
    source: 'default',
  };
}
