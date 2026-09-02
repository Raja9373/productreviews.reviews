import { AFFILIATE_MAP, AffiliatePartnerConfig } from '../data/affiliateMap';

export type AffiliatePartnerKey =
  | 'amazon'
  | 'cardekho'
  | 'software'
  | 'employers'
  | 'professionals'
  | 'services'
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
  | 'education'
  | 'places'
  | 'brands';

export type UserIntent =
  | 'BUY_CAR'
  | 'USE_SOFTWARE'
  | 'EMPLOYER_RESEARCH'
  | 'HIRE_PROFESSIONAL'
  | 'LOCAL_SERVICE'
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
  | 'PLACES_EXPERIENCE'
  | 'BRAND_LOOKUP'
  | 'AMAZON_SHOPPING';

/**
 * Detect user's primary intent from query text and optional category context
 */
export function detectUserIntent(query: string, categorySlug?: string): UserIntent {
  const q = query.toLowerCase().trim();
  const cat = (categorySlug || '').toLowerCase().trim();

  // 1. EMPLOYER REVIEWS (Must be before general brands/companies)
  if (/(?:employee reviews?|workplace|culture at|salary at|working at|work life balance|glassdoor|ambitionbox)/i.test(q)) {
    return 'EMPLOYER_RESEARCH';
  }

  // 2. APPS & SOFTWARE
  if (
    /(?:software|saas|crm|erp|accounting software|quickbooks|zoho|tally|freshbooks|xero|slack|notion|figma|canva|salesforce|hubspot|photoshop|vpn)/i.test(q) &&
    !/(?:software book|t-shirt)/i.test(q)
  ) {
    return 'USE_SOFTWARE';
  }

  // 3. PROFESSIONALS (CA, Lawyer, Doctor, Consultant, Photographer)
  if (/(?:chartered accountant|ca near me|lawyer|advocate|architect|consultant|photographer in|wedding photographer)/i.test(q)) {
    return 'HIRE_PROFESSIONAL';
  }

  // 4. LOCAL & HOME SERVICES (Housekeeping, Cleaning, Plumbing, Electrician)
  if (/(?:housekeeping|cleaning service|maid service|plumber|electrician|mechanic|carpenter|pest control|salon near)/i.test(q)) {
    return 'LOCAL_SERVICE';
  }

  // 5. CAR / VEHICLE / SUV INTENT
  const isVehicleQuery = /(suv|fortuner|thar|creta|scorpio|brezza|seltos|nexon|innova|xuv700|xuv|safari|harrier|grand vitara|car|cars|bike|bikes|activa|bullet|royal enfield|on road price)/i.test(q);
  const isAutomotiveCat = cat.includes('auto') || cat.includes('car') || cat.includes('bike');
  const isOnlyAccessory = /(car charger|car vacuum|car perfume|car mobile holder|dashcam|seat cover|car mat|car wash shampoo|wiper blade|tyre inflator)/i.test(q) &&
    !/(suv|thar|creta|scorpio|fortuner|brezza|seltos|nexon|xuv|innova|safari)/i.test(q);

  if ((isVehicleQuery || isAutomotiveCat) && !isOnlyAccessory) {
    return 'BUY_CAR';
  }

  // 6. FLIGHTS & AIRLINES
  if (/(flight|air ticket|airlines|mumbai to delhi flight|delhi to goa flight|cheap flight|indigo flight|air india flight)/i.test(q) || cat.includes('flight')) {
    return 'BOOK_FLIGHT';
  }

  // 7. RESORTS
  if (/(resort|beach resort|hill resort|luxury resort|resort in goa|weekend resort)/i.test(q) || cat.includes('resort')) {
    return 'BOOK_RESORT';
  }

  // 8. VILLAS & HOMESTAYS
  if (/(villa|homestay|airbnb|farmhouse|private pool villa)/i.test(q) || cat.includes('villa') || cat.includes('homestay')) {
    return 'BOOK_VILLA';
  }

  // 9. BANQUET HALLS & WEDDING VENUES
  if (/(banquet|wedding venue|marriage hall|party hall|marriage lawn)/i.test(q) || cat.includes('banquet')) {
    return 'BOOK_BANQUET';
  }

  // 10. HOTELS & STAYS
  if (/(hotel|oyo|5 star hotel|hotel in goa|hotel in delhi|hotels in|taj hotel|marriott|hyatt|stay in|residency)/i.test(q) || cat.includes('hotel')) {
    return 'BOOK_HOTEL';
  }

  // 11. CAFES & BAKERIES
  if (/(cafe|cafes|coffee shop|starbucks|blue tokai|bakery|pub|brewery|bar)/i.test(q) || cat.includes('cafe') || cat.includes('pub')) {
    return 'FIND_CAFE';
  }

  // 12. RESTAURANTS & DINING
  if (/(restaurant|biryani|food near|best food|dining|eatery|dhaba|buffet|zomato|swiggy|lunch|dinner)/i.test(q) || cat.includes('restaurant')) {
    return 'FIND_RESTAURANT';
  }

  // 13. FINANCE & CREDIT CARDS & LOANS
  if (/(best bank|credit card|credit cards|insurance|loan|bankbazaar|fixed deposit|mutual fund|demat|term insurance|health insurance)/i.test(q) || cat.includes('finan')) {
    return 'COMPARE_FINANCE';
  }

  // 14. HOSPITALS & HEALTHCARE
  if (/(best hospital|hospital in|doctor|clinic|apollo|max hospital|fortis|aiims|medanta|heart hospital|cancer hospital)/i.test(q) || cat.includes('hospital')) {
    return 'HEALTHCARE_INFO';
  }

  // 15. REAL ESTATE & HOUSING
  if (/(flat|2bhk|3bhk|property|house for sale|villa for sale|plot|real estate|apartment|residential flat)/i.test(q) || cat.includes('real-estate') || cat.includes('property')) {
    return 'REAL_ESTATE';
  }

  // 16. HIGHER EDUCATION & COLLEGES
  if (/(mba college|university|engineering college|coaching|online course|upsc coaching|neet coaching|shiksha)/i.test(q) || cat.includes('education')) {
    return 'EDUCATION';
  }

  // 17. PLACES & EXPERIENCES
  if (/(museum|things to do|tourist place|monument|sightseeing)/i.test(q)) {
    return 'PLACES_EXPERIENCE';
  }

  // 18. CORPORATE BRAND LOOKUP
  if (/^(?:samsung|apple|sony|microsoft|google|lg|tata|reliance|infosys|wipro|tesla)$/i.test(q)) {
    return 'BRAND_LOOKUP';
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
    case 'USE_SOFTWARE':
      return 'software';
    case 'EMPLOYER_RESEARCH':
      return 'employers';
    case 'HIRE_PROFESSIONAL':
      return 'professionals';
    case 'LOCAL_SERVICE':
      return 'services';
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
    case 'PLACES_EXPERIENCE':
      return 'places';
    case 'BRAND_LOOKUP':
      return 'brands';
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
} {
  const partnerKey = getAffiliatePartner(query, categorySlug);
  const partner = AFFILIATE_MAP[partnerKey] || AFFILIATE_MAP.amazon;

  let computedUrl: string | null = null;
  try {
    computedUrl = partner.url(query, country);
  } catch {
    computedUrl = AFFILIATE_MAP.amazon.url(query, country);
  }

  return {
    partnerKey,
    partnerName: partner.name,
    buttonText: partner.button,
    secondaryButtonText: partner.secondaryButton,
    url: computedUrl,
    infoOnly: partner.infoOnly === true,
    disclaimer: partner.disclaimer,
  };
}
