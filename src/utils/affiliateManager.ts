import { LanguageCode } from '../types';
import { getSimulatedGeoLocation } from './languageDetector';

export interface AmazonMarketplace {
  countryCode: string;
  countryName: string;
  flag: string;
  domain: string;
  defaultTag: string;
  currencySymbol: string;
  currencyCode: string;
  associatedLangs: LanguageCode[];
}

export const AMAZON_MARKETPLACES: AmazonMarketplace[] = [
  {
    countryCode: 'US',
    countryName: 'United States',
    flag: '🇺🇸',
    domain: 'amazon.com',
    defaultTag: 'jaiguruji00-20',
    currencySymbol: '$',
    currencyCode: 'USD',
    associatedLangs: ['en', 'sw', 'af', 'he'],
  },
  {
    countryCode: 'IN',
    countryName: 'India',
    flag: '🇮🇳',
    domain: 'amazon.in',
    defaultTag: 'jaiguruji00-21',
    currencySymbol: '₹',
    currencyCode: 'INR',
    associatedLangs: ['hi', 'ta', 'te', 'mr', 'bn', 'ur'],
  },
  {
    countryCode: 'JP',
    countryName: 'Japan',
    flag: '🇯🇵',
    domain: 'amazon.co.jp',
    defaultTag: 'jaiguruji00-22',
    currencySymbol: '¥',
    currencyCode: 'JPY',
    associatedLangs: ['ja'],
  },
  {
    countryCode: 'ES',
    countryName: 'Spain',
    flag: '🇪🇸',
    domain: 'amazon.es',
    defaultTag: 'jaiguruji0008-21',
    currencySymbol: '€',
    currencyCode: 'EUR',
    associatedLangs: ['es'],
  },
  {
    countryCode: 'UK',
    countryName: 'United Kingdom',
    flag: '🇬🇧',
    domain: 'amazon.co.uk',
    defaultTag: 'jaiguruji0002-21',
    currencySymbol: '£',
    currencyCode: 'GBP',
    associatedLangs: [],
  },
  {
    countryCode: 'DE',
    countryName: 'Germany',
    flag: '🇩🇪',
    domain: 'amazon.de',
    defaultTag: 'jaiguruji0004-21',
    currencySymbol: '€',
    currencyCode: 'EUR',
    associatedLangs: ['de', 'cs', 'pl', 'nl', 'hu'],
  },
  {
    countryCode: 'FR',
    countryName: 'France',
    flag: '🇫🇷',
    domain: 'amazon.fr',
    defaultTag: 'jaiguruji0005-21',
    currencySymbol: '€',
    currencyCode: 'EUR',
    associatedLangs: ['fr'],
  },
  {
    countryCode: 'IT',
    countryName: 'Italy',
    flag: '🇮🇹',
    domain: 'amazon.it',
    defaultTag: 'jaiguruji0007-21',
    currencySymbol: '€',
    currencyCode: 'EUR',
    associatedLangs: ['it'],
  },
  {
    countryCode: 'CA',
    countryName: 'Canada',
    flag: '🇨🇦',
    domain: 'amazon.ca',
    defaultTag: 'jaiguruji000b-20',
    currencySymbol: 'CA$',
    currencyCode: 'CAD',
    associatedLangs: [],
  },
  {
    countryCode: 'AU',
    countryName: 'Australia',
    flag: '🇦🇺',
    domain: 'amazon.com.au',
    defaultTag: 'AUTAG-22',
    currencySymbol: 'A$',
    currencyCode: 'AUD',
    associatedLangs: [],
  },
  {
    countryCode: 'BR',
    countryName: 'Brazil',
    flag: '🇧🇷',
    domain: 'amazon.com.br',
    defaultTag: 'BRTAG-20',
    currencySymbol: 'R$',
    currencyCode: 'BRL',
    associatedLangs: ['pt'],
  },
  {
    countryCode: 'MX',
    countryName: 'Mexico',
    flag: '🇲🇽',
    domain: 'amazon.com.mx',
    defaultTag: 'MXTAG-20',
    currencySymbol: 'MX$',
    currencyCode: 'MXN',
    associatedLangs: [],
  },
  {
    countryCode: 'AE',
    countryName: 'United Arab Emirates',
    flag: '🇦🇪',
    domain: 'amazon.ae',
    defaultTag: 'AETAG-21',
    currencySymbol: 'AED',
    currencyCode: 'AED',
    associatedLangs: ['ar', 'fa'],
  },
];

const AFFILIATE_SETTINGS_STORAGE_KEY = 'pr_affiliate_settings_v3';

export interface AffiliateSettings {
  tags: Record<string, string>; // countryCode -> affiliateTag
  oneLinkEnabled: boolean;
  trackingSubId: string;
}

export function getDefaultAffiliateSettings(): AffiliateSettings {
  const tags: Record<string, string> = {};
  AMAZON_MARKETPLACES.forEach((m) => {
    tags[m.countryCode] = m.defaultTag;
  });

  return {
    tags,
    oneLinkEnabled: true,
    trackingSubId: 'pr-global-review',
  };
}

export function getAffiliateSettings(): AffiliateSettings {
  try {
    const saved = localStorage.getItem(AFFILIATE_SETTINGS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const defaults = getDefaultAffiliateSettings();
      return {
        tags: { ...defaults.tags, ...(parsed.tags || {}) },
        oneLinkEnabled: parsed.oneLinkEnabled ?? true,
        trackingSubId: parsed.trackingSubId || 'pr-global-review',
      };
    }
  } catch {
    // ignore
  }
  return getDefaultAffiliateSettings();
}

export function saveAffiliateSettings(settings: AffiliateSettings): void {
  try {
    localStorage.setItem(AFFILIATE_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event('affiliate_settings_updated'));
  } catch {
    // ignore
  }
}

export function resetAffiliateSettings(): AffiliateSettings {
  const defaults = getDefaultAffiliateSettings();
  saveAffiliateSettings(defaults);
  return defaults;
}

export interface GeoAffiliateTarget {
  marketplace: AmazonMarketplace;
  affiliateTag: string;
  shipsToText: string;
  countryName: string;
  countryCode: string;
  flag: string;
  domain: string;
}

// Jai Guruji - Auto Geo Affiliate
// Direct ASIN resolver using browser timezone + language detection
export function getAffiliateLink(asin?: string, fallbackQuery = ''): string {
  let userLang = '';
  let userTz = '';
  try {
    userLang = typeof navigator !== 'undefined' ? (navigator.language || '') : '';
    userTz = typeof Intl !== 'undefined' && Intl.DateTimeFormat ? (Intl.DateTimeFormat().resolvedOptions().timeZone || '') : '';
  } catch (e) {
    // fallback
  }

  const settings = getAffiliateSettings();
  const inTag = settings.tags['IN'] || 'jaiguruji00-21';
  const usTag = settings.tags['US'] || 'jaiguruji00-20';

  const isIndia =
    userTz.includes('Kolkata') ||
    userTz.includes('Calcutta') ||
    userLang.includes('hi') ||
    userLang.includes('IN') ||
    userLang.includes('ta') ||
    userLang.includes('te') ||
    userLang.includes('mr') ||
    userLang.includes('bn');

  const domain = isIndia ? 'amazon.in' : 'amazon.com';
  const activeTag = isIndia ? inTag : usTag;

  // Strict ASIN validation (Must be exactly 10 alphanumeric characters, not synthetic/fake)
  const isRealASIN = Boolean(
    asin &&
    asin.trim().length === 10 &&
    /^[B0-9][A-Z0-9]{9}$/i.test(asin.trim()) &&
    !asin.includes('99999')
  );

  if (isRealASIN) {
    return `https://www.${domain}/dp/${asin!.trim()}?tag=${activeTag}`;
  } else {
    // NEVER 404: Guaranteed working search fallback
    const q = encodeURIComponent(fallbackQuery.trim() || 'best sellers deals');
    return `https://www.${domain}/s?k=${q}&tag=${activeTag}&linkCode=ll2&ref=as_li_ss_tl`;
  }
}

/**
 * Detects user target Amazon marketplace from Browser TimeZone / IP / Country code + Current Language
 */
export function resolveGeoAffiliate(
  lang: LanguageCode,
  countryOverride?: string
): GeoAffiliateTarget {
  let userTz = '';
  let userNavLang = '';
  try {
    userTz = typeof Intl !== 'undefined' && Intl.DateTimeFormat ? (Intl.DateTimeFormat().resolvedOptions().timeZone || '') : '';
    userNavLang = typeof navigator !== 'undefined' ? (navigator.language || '') : '';
  } catch (e) {}

  const simulatedGeo = getSimulatedGeoLocation();
  const effectiveCountry = (countryOverride || simulatedGeo?.countryCode || 'US').toUpperCase();
  const settings = getAffiliateSettings();

  let targetMarketplace: AmazonMarketplace | undefined;

  // 1. Direct Timezone / Browser check for India (Jai Guruji Auto-Geo logic)
  const isIndiaBrowser =
    userTz.includes('Kolkata') ||
    userTz.includes('Calcutta') ||
    userNavLang.includes('hi') ||
    userNavLang.includes('IN');

  if (effectiveCountry === 'IN' || lang === 'hi' || lang === 'ta' || lang === 'te' || lang === 'mr' || lang === 'bn' || (!countryOverride && isIndiaBrowser)) {
    targetMarketplace = AMAZON_MARKETPLACES.find((m) => m.countryCode === 'IN');
  } else if (effectiveCountry === 'JP' || lang === 'ja' || userTz.includes('Tokyo')) {
    targetMarketplace = AMAZON_MARKETPLACES.find((m) => m.countryCode === 'JP');
  } else if (effectiveCountry === 'ES' || (lang === 'es' && effectiveCountry !== 'MX' && effectiveCountry !== 'US') || userTz.includes('Madrid')) {
    targetMarketplace = AMAZON_MARKETPLACES.find((m) => m.countryCode === 'ES');
  } else if (effectiveCountry === 'MX' || userTz.includes('Mexico')) {
    targetMarketplace = AMAZON_MARKETPLACES.find((m) => m.countryCode === 'MX');
  } else if (effectiveCountry === 'DE' || lang === 'de' || userTz.includes('Berlin')) {
    targetMarketplace = AMAZON_MARKETPLACES.find((m) => m.countryCode === 'DE');
  } else if (effectiveCountry === 'FR' || lang === 'fr' || userTz.includes('Paris')) {
    targetMarketplace = AMAZON_MARKETPLACES.find((m) => m.countryCode === 'FR');
  } else if (effectiveCountry === 'IT' || lang === 'it' || userTz.includes('Rome')) {
    targetMarketplace = AMAZON_MARKETPLACES.find((m) => m.countryCode === 'IT');
  } else if (effectiveCountry === 'BR' || lang === 'pt' || userTz.includes('Sao_Paulo')) {
    targetMarketplace = AMAZON_MARKETPLACES.find((m) => m.countryCode === 'BR');
  } else if (effectiveCountry === 'CA' || userTz.includes('Toronto') || userTz.includes('Vancouver')) {
    targetMarketplace = AMAZON_MARKETPLACES.find((m) => m.countryCode === 'CA');
  } else if (effectiveCountry === 'UK' || effectiveCountry === 'GB' || userTz.includes('London')) {
    targetMarketplace = AMAZON_MARKETPLACES.find((m) => m.countryCode === 'UK');
  } else if (effectiveCountry === 'AU' || userTz.includes('Sydney') || userTz.includes('Melbourne')) {
    targetMarketplace = AMAZON_MARKETPLACES.find((m) => m.countryCode === 'AU');
  } else if (effectiveCountry === 'AE' || effectiveCountry === 'SA' || lang === 'ar' || userTz.includes('Dubai')) {
    targetMarketplace = AMAZON_MARKETPLACES.find((m) => m.countryCode === 'AE');
  } else {
    // Check if lang matches any marketplace associatedLangs
    targetMarketplace = AMAZON_MARKETPLACES.find((m) =>
      m.associatedLangs.includes(lang)
    );
  }

  // Fallback to Amazon US (amazon.com)
  if (!targetMarketplace) {
    targetMarketplace = AMAZON_MARKETPLACES[0]; // US
  }

  const activeTag =
    settings.tags[targetMarketplace.countryCode] || targetMarketplace.defaultTag;

  // Compute shipsToText
  const shipsToText = `Ships to ${targetMarketplace.countryName}`;

  return {
    marketplace: targetMarketplace,
    affiliateTag: activeTag,
    shipsToText,
    countryName: targetMarketplace.countryName,
    countryCode: targetMarketplace.countryCode,
    flag: targetMarketplace.flag,
    domain: targetMarketplace.domain,
  };
}

/**
 * Builds a clean geo-localized affiliate URL with dynamic ?tag=
 * If a verified 10-character real ASIN is available, links to /dp/{ASIN}?tag=
 * Otherwise, NEVER 404: links to high-converting Amazon Search page with affiliate tag!
 */
export function buildAmazonAffiliateUrl(
  productName: string,
  modelNumber: string,
  lang: LanguageCode,
  countryOverride?: string,
  asin?: string
): { url: string; geoTarget: GeoAffiliateTarget } {
  const geoTarget = resolveGeoAffiliate(lang, countryOverride);
  
  const isRealASIN = Boolean(
    asin &&
    asin.trim().length === 10 &&
    /^[B0-9][A-Z0-9]{9}$/i.test(asin.trim()) &&
    !asin.includes('99999') &&
    !asin.startsWith('B0RANDOM')
  );

  let affiliateUrl = '';
  if (isRealASIN) {
    affiliateUrl = `https://www.${geoTarget.domain}/dp/${asin!.trim()}?tag=${geoTarget.affiliateTag}`;
  } else {
    // Clean search terms to avoid weird symbol artifacts
    const cleanSearch = `${productName} ${modelNumber}`
      .replace(/[\(\)\[\]\{\}\/\\+🔥✓]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    affiliateUrl = `https://www.${geoTarget.domain}/s?k=${encodeURIComponent(cleanSearch || 'electronics appliances')}&tag=${geoTarget.affiliateTag}&linkCode=ll2&ref=as_li_ss_tl`;
  }

  return {
    url: affiliateUrl,
    geoTarget,
  };
}
