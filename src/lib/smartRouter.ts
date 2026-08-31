import { AFFILIATE_MAP, AffiliatePartnerConfig } from '../data/affiliateMap';

export type AffiliatePartnerKey =
  | 'amazon'
  | 'cardekho'
  | 'flights'
  | 'hotels'
  | 'resorts'
  | 'restaurants'
  | 'villas'
  | 'cafes'
  | 'banquets'
  | 'finance'
  | 'healthcare'
  | 'realestate'
  | 'education';

export type UserIntent =
  | 'BUY_CAR'
  | 'BOOK_FLIGHT'
  | 'BOOK_HOTEL'
  | 'BOOK_RESORT'
  | 'FIND_RESTAURANT'
  | 'BOOK_VILLA'
  | 'FIND_CAFE'
  | 'BOOK_BANQUET'
  | 'COMPARE_FINANCE'
  | 'HEALTHCARE_INFO'
  | 'REAL_ESTATE'
  | 'EDUCATION'
  | 'AMAZON_SHOPPING';

/**
 * Detect user's primary intent from query text and optional category context
 */
export function detectUserIntent(query: string, categorySlug?: string): UserIntent {
  const q = query.toLowerCase().trim();
  const cat = (categorySlug || '').toLowerCase().trim();

  // 1. CAR / VEHICLE / SUV INTENT
  // Common sense check: if user searches for an SUV, car, bike or high value automobile (> ₹1 Lakh)
  const isVehicleQuery = /(suv|fortuner|thar|creta|scorpio|brezza|seltos|nexon|innova|xuv700|xuv|safari|harrier|grand vitara|car|cars|bike|bikes|activa|bullet|royal enfield|on road price|under.*lakh)/i.test(q);
  const isAutomotiveCat = cat.includes('auto') || cat.includes('car') || cat.includes('bike');

  // Check if it's merely a small accessory (e.g. "car vacuum", "car charger", "car perfume", "mobile holder")
  const isOnlyAccessory = /(car charger|car vacuum|car perfume|car mobile holder|dashcam|seat cover|car mat|car wash shampoo|wiper blade|tyre inflator)/i.test(q) &&
    !/(suv|thar|creta|scorpio|fortuner|brezza|seltos|nexon|xuv|innova|safari)/i.test(q);

  if ((isVehicleQuery || isAutomotiveCat) && !isOnlyAccessory) {
    return 'BUY_CAR';
  }

  // 2. FLIGHTS & AIRLINES
  if (/(flight|air ticket|airlines|mumbai to delhi flight|delhi to goa flight|cheap flight|indigo flight|air india flight)/i.test(q) || cat.includes('flight')) {
    return 'BOOK_FLIGHT';
  }

  // 3. RESORTS
  if (/(resort|beach resort|hill resort|luxury resort|resort in goa|weekend resort)/i.test(q) || cat.includes('resort')) {
    return 'BOOK_RESORT';
  }

  // 4. VILLAS & HOMESTAYS
  if (/(villa|homestay|airbnb|farmhouse|private pool villa)/i.test(q) || cat.includes('villa') || cat.includes('homestay')) {
    return 'BOOK_VILLA';
  }

  // 5. BANQUET HALLS & WEDDING VENUES
  if (/(banquet|wedding venue|marriage hall|party hall|marriage lawn)/i.test(q) || cat.includes('banquet')) {
    return 'BOOK_BANQUET';
  }

  // 6. HOTELS & STAYS
  if (/(hotel|oyo|5 star hotel|hotel in goa|hotel in delhi|taj hotel|marriott|hyatt|stay in|residency)/i.test(q) || cat.includes('hotel')) {
    return 'BOOK_HOTEL';
  }

  // 7. CAFES, BAKERIES & PUBS
  if (/(cafe|cafes|coffee shop|starbucks|blue tokai|bakery|pub|brewery|bar)/i.test(q) || cat.includes('cafe') || cat.includes('pub')) {
    return 'FIND_CAFE';
  }

  // 8. RESTAURANTS & FOOD
  if (/(restaurant|biryani|food near|best food|dining|eatery|dhaba|buffet|zomato|swiggy|lunch|dinner)/i.test(q) || cat.includes('restaurant')) {
    return 'FIND_RESTAURANT';
  }

  // 9. FINANCE & CREDIT CARDS & LOANS
  if (/(best bank|credit card|insurance|loan|bankbazaar|fixed deposit|mutual fund|demat|term insurance|health insurance)/i.test(q) || cat.includes('finan')) {
    return 'COMPARE_FINANCE';
  }

  // 10. HOSPITALS & HEALTHCARE
  if (/(best hospital|hospital in|doctor|clinic|apollo|max hospital|fortis|aiims|medanta|heart hospital|cancer hospital)/i.test(q) || cat.includes('hospital')) {
    return 'HEALTHCARE_INFO';
  }

  // 11. REAL ESTATE & PROPERTIES
  if (/(flat|2bhk|3bhk|property|house for sale|villa for sale|plot|real estate|apartment|residential flat)/i.test(q) || cat.includes('real-estate') || cat.includes('property')) {
    return 'REAL_ESTATE';
  }

  // 12. HIGHER EDUCATION & COURSES
  if (/(mba college|engineering college|coaching|online course|upsc coaching|neet coaching|shiksha)/i.test(q) || cat.includes('education')) {
    return 'EDUCATION';
  }

  return 'AMAZON_SHOPPING';
}

/**
 * Resolve affiliate partner key based on query and category
 */
export function getAffiliatePartner(query: string, categorySlug?: string): AffiliatePartnerKey {
  const intent = detectUserIntent(query, categorySlug);
  switch (intent) {
    case 'BUY_CAR':
      return 'cardekho';
    case 'BOOK_FLIGHT':
      return 'flights';
    case 'BOOK_RESORT':
      return 'resorts';
    case 'BOOK_HOTEL':
      return 'hotels';
    case 'FIND_RESTAURANT':
      return 'restaurants';
    case 'BOOK_VILLA':
      return 'villas';
    case 'FIND_CAFE':
      return 'cafes';
    case 'BOOK_BANQUET':
      return 'banquets';
    case 'COMPARE_FINANCE':
      return 'finance';
    case 'HEALTHCARE_INFO':
      return 'healthcare';
    case 'REAL_ESTATE':
      return 'realestate';
    case 'EDUCATION':
      return 'education';
    case 'AMAZON_SHOPPING':
    default:
      return 'amazon';
  }
}

/**
 * Resolve full destination details for a query
 */
export function resolveAffiliateDestination(
  query: string,
  categorySlug?: string,
  country = 'IN'
): {
  partnerKey: AffiliatePartnerKey;
  partnerName: string;
  buttonText: string;
  secondaryButtonText?: string;
  url: string | null;
  infoOnly: boolean;
  disclaimer?: string;
  showAmazonBanner: boolean;
  showAmazonAccessoryLink: boolean;
} {
  const partnerKey = getAffiliatePartner(query, categorySlug);
  const config = AFFILIATE_MAP[partnerKey] || AFFILIATE_MAP.amazon;
  const targetUrl = config.url(query, country);

  return {
    partnerKey,
    partnerName: config.name,
    buttonText: config.button,
    secondaryButtonText: config.secondaryButton,
    url: targetUrl,
    infoOnly: Boolean(config.infoOnly),
    disclaimer: config.disclaimer,
    showAmazonBanner: partnerKey === 'amazon',
    showAmazonAccessoryLink: partnerKey === 'cardekho',
  };
}
