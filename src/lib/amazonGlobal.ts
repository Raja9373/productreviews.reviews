/**
 * Amazon Global Multi-Country Tag and Domain Registry
 * Supports 14 primary Amazon Associate store IDs with automatic browser geo-detection
 * and dynamic Vercel / process.env store ID loading.
 */

export type SupportedCountryCode =
  | 'IN'
  | 'US'
  | 'UK'
  | 'JP'
  | 'DE'
  | 'FR'
  | 'ES'
  | 'IT'
  | 'CA'
  | 'AU'
  | 'BR'
  | 'MX'
  | 'NL'
  | 'SG';

export function getStoreTag(country: string): string {
  const cc = (country || 'IN').toUpperCase();
  if (typeof process !== 'undefined' && process.env) {
    const envKey = `AMAZON_TAG_${cc}`;
    if (process.env[envKey]) return process.env[envKey] as string;
    if (process.env.AMAZON_PARTNER_TAG) return process.env.AMAZON_PARTNER_TAG as string;
  }
  return AMAZON_DEFAULT_TAGS[cc as SupportedCountryCode] || 'jaiguruji00-21';
}

export const AMAZON_DEFAULT_TAGS: Record<SupportedCountryCode, string> = {
  IN: 'jaiguruji00-21',
  US: 'jaiguruji00-20',
  UK: 'jaiguruji0002-21',
  JP: 'jaiguruji00-22',
  DE: 'jaiguruji0004-21',
  FR: 'jaiguruji0005-21',
  ES: 'jaiguruji0008-21',
  IT: 'jaiguruji0007-21',
  CA: 'jaiguruji000b-20',
  AU: 'jaiguruji000a-22',
  BR: 'jaiguruji0009-20',
  MX: 'jaiguruji0006-20',
  NL: 'jaiguruji000c-21',
  SG: 'jaiguruji000e-22',
};

export const AMAZON_TAGS = new Proxy(AMAZON_DEFAULT_TAGS, {
  get(target, prop: string) {
    return getStoreTag(prop);
  },
});

export const AMAZON_DOMAINS: Record<SupportedCountryCode, string> = {
  IN: 'https://www.amazon.in/s?k=',
  US: 'https://www.amazon.com/s?k=',
  UK: 'https://www.amazon.co.uk/s?k=',
  JP: 'https://www.amazon.co.jp/s?k=',
  DE: 'https://www.amazon.de/s?k=',
  FR: 'https://www.amazon.fr/s?k=',
  ES: 'https://www.amazon.es/s?k=',
  IT: 'https://www.amazon.it/s?k=',
  CA: 'https://www.amazon.ca/s?k=',
  AU: 'https://www.amazon.com.au/s?k=',
  BR: 'https://www.amazon.com.br/s?k=',
  MX: 'https://www.amazon.com.mx/s?k=',
  NL: 'https://www.amazon.nl/s?k=',
  SG: 'https://www.amazon.sg/s?k=',
};

export const COUNTRY_NAMES: Record<SupportedCountryCode, string> = {
  IN: 'India',
  US: 'United States',
  UK: 'United Kingdom',
  JP: 'Japan',
  DE: 'Germany',
  FR: 'France',
  ES: 'Spain',
  IT: 'Italy',
  CA: 'Canada',
  AU: 'Australia',
  BR: 'Brazil',
  MX: 'Mexico',
  NL: 'Netherlands',
  SG: 'Singapore',
};

export const COUNTRY_FLAGS: Record<SupportedCountryCode, string> = {
  IN: '🇮🇳',
  US: '🇺🇸',
  UK: '🇬🇧',
  JP: '🇯🇵',
  DE: '🇩🇪',
  FR: '🇫🇷',
  ES: '🇪🇸',
  IT: '🇮🇹',
  CA: '🇨🇦',
  AU: '🇦🇺',
  BR: '🇧🇷',
  MX: '🇲🇽',
  NL: '🇳🇱',
  SG: '🇸🇬',
};

/**
 * Detect user country code based on navigator.language, timezone, or explicit override.
 */
export function detectCountry(): SupportedCountryCode {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return 'IN';
  }

  // Check language code
  const lang = (navigator.language || (navigator as any).userLanguage || 'en-IN').toUpperCase();
  const timezone = Intl?.DateTimeFormat?.().resolvedOptions?.().timeZone || '';

  if (lang.includes('JA') || lang.includes('JP') || timezone.includes('Tokyo')) return 'JP';
  if (lang.includes('DE') || timezone.includes('Berlin')) return 'DE';
  if (lang.includes('FR') || timezone.includes('Paris')) return 'FR';
  if (lang.includes('ES') || timezone.includes('Madrid')) return 'ES';
  if (lang.includes('IT') || timezone.includes('Rome')) return 'IT';
  if (lang.includes('CA') || timezone.includes('Toronto') || timezone.includes('Vancouver')) return 'CA';
  if (lang.includes('GB') || lang.includes('UK') || timezone.includes('London')) return 'UK';
  if (lang.includes('US') || timezone.includes('New_York') || timezone.includes('Los_Angeles') || timezone.includes('Chicago')) return 'US';
  if (lang.includes('HI') || lang.includes('IN') || timezone.includes('Calcutta') || timezone.includes('Kolkata')) return 'IN';

  return 'IN';
}

/**
 * Generate a 100% working Amazon affiliate search URL for any query and country
 */
export function getAmazonUrl(query: string, countryCode: string = 'IN'): string {
  const cc = (countryCode || 'IN').toUpperCase() as SupportedCountryCode;
  const tag = AMAZON_TAGS[cc] || AMAZON_TAGS['US'];
  const domain = AMAZON_DOMAINS[cc] || AMAZON_DOMAINS['US'];
  return `${domain}${encodeURIComponent(query)}&tag=${tag}&linkCode=ll2&ref=as_li_ss_tl`;
}

/**
 * Get Country Specific Car / Auto Affiliate URL
 */
export function getCarUrl(query: string, countryCode: string = 'IN'): { url: string; partnerName: string; buttonText: string } {
  const cc = (countryCode || 'IN').toUpperCase();
  const q = encodeURIComponent(query);
  
  if (cc === 'UK') {
    return {
      url: `https://www.autotrader.co.uk/cars/search?postcode=SW1A1AA&radius=1500&make=&search-target=usedcars&keywords=${q}`,
      partnerName: 'AutoTrader UK',
      buttonText: 'Check Car Deals on AutoTrader',
    };
  }

  if (cc === 'CA') {
    return {
      url: `https://www.autotrader.ca/cars/?rcp=100&rcx=0&srt=3&prx=-1&loc=Canada&kwd=${q}`,
      partnerName: 'AutoTrader CA',
      buttonText: 'Check Car Deals on AutoTrader CA',
    };
  }

  if (cc === 'US') {
    return {
      url: `https://www.cargurus.com/Cars/new/searchresults.action?searchString=${q}`,
      partnerName: 'CarGurus US',
      buttonText: 'Check Car Deals on CarGurus',
    };
  }

  if (cc === 'DE' || cc === 'FR' || cc === 'ES' || cc === 'IT') {
    return {
      url: `https://www.autoscout24.com/lst?query=${q}`,
      partnerName: 'AutoScout24 Europe',
      buttonText: 'Compare Car Deals on AutoScout24',
    };
  }

  // Default: India CarDekho
  const qLower = query.toLowerCase();
  let carDekhoUrl = `https://www.cardekho.com/search?query=${q}`;
  if (qLower.includes('scorpio')) carDekhoUrl = 'https://www.cardekho.com/mahindra/scorpio-n';
  else if (qLower.includes('thar')) carDekhoUrl = 'https://www.cardekho.com/mahindra/thar-roxx';
  else if (qLower.includes('creta')) carDekhoUrl = 'https://www.cardekho.com/hyundai/creta';
  else if (qLower.includes('fortuner')) carDekhoUrl = 'https://www.cardekho.com/toyota/fortuner';
  else if (qLower.includes('brezza')) carDekhoUrl = 'https://www.cardekho.com/maruti/brezza';

  return {
    url: carDekhoUrl,
    partnerName: 'CarDekho',
    buttonText: 'Check On-Road Price',
  };
}

/**
 * Get Country Specific Hotel / Stays URL (Booking.com Global)
 */
export function getHotelUrl(query: string): { url: string; partnerName: string; buttonText: string } {
  return {
    url: `https://www.booking.com/search.html?ss=${encodeURIComponent(query)}&aid=304142`,
    partnerName: 'Booking.com',
    buttonText: 'Check Availability on Booking.com',
  };
}

/**
 * Get Flights URL (Skyscanner Global)
 */
export function getFlightUrl(query: string, countryCode: string = 'IN'): { url: string; partnerName: string; buttonText: string } {
  const cc = (countryCode || 'IN').toUpperCase();
  const domain = cc === 'UK' ? 'https://www.skyscanner.net' : cc === 'US' ? 'https://www.skyscanner.com' : 'https://www.skyscanner.co.in';
  return {
    url: `${domain}/search?query=${encodeURIComponent(query)}`,
    partnerName: 'Skyscanner',
    buttonText: 'Check Flight Prices on Skyscanner',
  };
}

/**
 * Get Country Specific Restaurant URL (Zomato / Yelp / TripAdvisor)
 */
export function getRestaurantUrl(query: string, countryCode: string = 'IN'): { url: string; partnerName: string; buttonText: string } {
  const cc = (countryCode || 'IN').toUpperCase();
  const q = encodeURIComponent(query);

  if (cc === 'US' || cc === 'CA') {
    return {
      url: `https://www.yelp.com/search?find_desc=${q}`,
      partnerName: 'Yelp',
      buttonText: 'View Menu & Reviews on Yelp',
    };
  }

  if (cc === 'UK' || cc === 'DE' || cc === 'FR' || cc === 'ES' || cc === 'IT' || cc === 'JP') {
    return {
      url: `https://www.tripadvisor.com/Search?q=${q}`,
      partnerName: 'TripAdvisor',
      buttonText: 'View Menu & Reviews on TripAdvisor',
    };
  }

  // India
  return {
    url: `https://www.zomato.com/search?q=${q}`,
    partnerName: 'Zomato',
    buttonText: 'View Menu & Reserve on Zomato',
  };
}

/**
 * Get Country Specific Real Estate URL
 */
export function getRealEstateUrl(query: string, countryCode: string = 'IN'): { url: string; partnerName: string; buttonText: string } {
  const cc = (countryCode || 'IN').toUpperCase();
  const q = encodeURIComponent(query);

  if (cc === 'US') {
    return {
      url: `https://www.zillow.com/homes/${q}_rb/`,
      partnerName: 'Zillow US',
      buttonText: 'Explore Listings on Zillow',
    };
  }

  if (cc === 'UK') {
    return {
      url: `https://www.rightmove.co.uk/property-for-sale/search.html?searchLocation=${q}`,
      partnerName: 'Rightmove UK',
      buttonText: 'Explore Listings on Rightmove',
    };
  }

  return {
    url: `https://www.99acres.com/search/property/buy/${q}`,
    partnerName: '99acres',
    buttonText: 'Explore Verified Properties on 99acres',
  };
}

/**
 * Get Country Specific Finance / Loans / Credit Cards URL
 */
export function getFinanceUrl(query: string, countryCode: string = 'IN'): { url: string; partnerName: string; buttonText: string } {
  const cc = (countryCode || 'IN').toUpperCase();
  const q = encodeURIComponent(query);

  if (cc === 'US') {
    return {
      url: `https://www.nerdwallet.com/search?query=${q}`,
      partnerName: 'NerdWallet US',
      buttonText: 'Compare Rates on NerdWallet',
    };
  }

  if (cc === 'UK') {
    return {
      url: `https://www.moneysavingexpert.com/search/?q=${q}`,
      partnerName: 'MoneySavingExpert UK',
      buttonText: 'Compare Deals on MoneySavingExpert',
    };
  }

  return {
    url: `https://www.bankbazaar.com/search?query=${q}`,
    partnerName: 'BankBazaar',
    buttonText: 'Compare Offers on BankBazaar',
  };
}

/**
 * Get Country Specific Healthcare URL
 */
export function getHealthcareUrl(query: string, countryCode: string = 'IN'): { url: string; partnerName: string; buttonText: string; infoOnly: boolean } {
  const cc = (countryCode || 'IN').toUpperCase();
  const q = encodeURIComponent(query);

  if (cc === 'US') {
    return {
      url: `https://www.zocdoc.com/search?dr_specialty=${q}`,
      partnerName: 'Zocdoc',
      buttonText: 'Find Doctors on Zocdoc',
      infoOnly: true,
    };
  }

  return {
    url: `https://www.practo.com/search/doctors?results_type=doctor&q=${q}`,
    partnerName: 'Practo',
    buttonText: 'Find Verified Doctors on Practo',
    infoOnly: true,
  };
}
