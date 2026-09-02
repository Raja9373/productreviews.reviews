import { LanguageCode } from '../types';

export type DecisionMode =
  | 'EXACT_PRODUCT'
  | 'CATEGORY_DISCOVERY'
  | 'RECOMMENDATION_INTENT'
  | 'COMPARISON'
  | 'LOCAL_SERVICE'
  | 'GENERAL_ENTITY_LOOKUP';

export type MasterType =
  | 'PRODUCTS'
  | 'SERVICES'
  | 'COMPANIES_BRANDS'
  | 'APPS_SOFTWARE'
  | 'WEBSITES_PLATFORMS'
  | 'PLACES_EXPERIENCES'
  | 'EDUCATION'
  | 'EMPLOYERS'
  | 'TRAVEL'
  | 'VEHICLES'
  | 'REAL_ESTATE'
  | 'ENTERTAINMENT_MEDIA'
  | 'FINANCE'
  | 'PROFESSIONALS';

export type EntityType =
  | 'PRODUCT'
  | 'VEHICLE'
  | 'SOFTWARE'
  | 'LOCAL_SERVICE'
  | 'TRAVEL_STAY'
  | 'EDUCATION'
  | 'FINANCE'
  | 'EMPLOYER'
  | 'COMPANY_BRAND'
  | 'PROFESSIONAL'
  | 'REAL_ESTATE'
  | 'ENTERTAINMENT';

export interface BudgetConstraint {
  raw: string;
  currency: string;
  currencySymbol: string;
  maxAmount?: number;
  minAmount?: number;
  formatted: string;
}

export interface ExtractedIntent {
  mode: DecisionMode;
  masterType: MasterType;
  entityType: EntityType;
  primaryQuery: string;
  entityName?: string;
  comparedItems?: [string, string];
  budgetConstraint?: string;
  budgetDetails?: BudgetConstraint;
  useCaseConstraint?: string;
  locationConstraint?: string;
  marketCountry?: string;
  brandConstraint?: string;
  suggestedHeading: string;
  suggestedSubtitle: string;
  primaryQuestion: string;
}

/**
 * Extract country or market from explicit query text, with fallback to language/locale.
 */
export function extractMarket(query: string, lang: LanguageCode = 'en'): { market: string; countryCode: string; explicit: boolean } {
  const lower = query.toLowerCase();

  // Priority 1: Explicit country or city in query (even in multilingual queries like "Japan mein best SUV")
  if (/\b(in india|in bharat|delhi|mumbai|bangalore|bengaluru|hyderabad|chennai|kolkata|jaipur|pune|ahmedabad|india mein|bharat mein)\b/i.test(lower)) {
    return { market: 'India', countryCode: 'IN', explicit: true };
  }
  if (/\b(in japan|in tokyo|osaka|japan mein|japan me)\b/i.test(lower)) {
    return { market: 'Japan', countryCode: 'JP', explicit: true };
  }
  if (/\b(in usa|in us|in united states|in america|in new york|in california|in texas)\b/i.test(lower)) {
    return { market: 'United States', countryCode: 'US', explicit: true };
  }
  if (/\b(in uk|in united kingdom|in london|in britain|in england)\b/i.test(lower)) {
    return { market: 'United Kingdom', countryCode: 'GB', explicit: true };
  }
  if (/\b(in spain|in madrid|in barcelona|en españa)\b/i.test(lower)) {
    return { market: 'Spain', countryCode: 'ES', explicit: true };
  }
  if (/\b(in germany|in berlin|in munich|in deutschland)\b/i.test(lower)) {
    return { market: 'Germany', countryCode: 'DE', explicit: true };
  }
  if (/\b(in france|in paris|en france)\b/i.test(lower)) {
    return { market: 'France', countryCode: 'FR', explicit: true };
  }
  if (/\b(in italy|in rome|in milan|in italia)\b/i.test(lower)) {
    return { market: 'Italy', countryCode: 'IT', explicit: true };
  }
  if (/\b(in canada|in toronto|in vancouver)\b/i.test(lower)) {
    return { market: 'Canada', countryCode: 'CA', explicit: true };
  }
  if (/\b(in australia|in sydney|in melbourne)\b/i.test(lower)) {
    return { market: 'Australia', countryCode: 'AU', explicit: true };
  }

  // Priority 2: Inferred from language code if no explicit market
  if (lang === 'hi' || lang === 'mr' || lang === 'ta' || lang === 'te' || lang === 'bn') {
    return { market: 'India', countryCode: 'IN', explicit: false };
  }
  if (lang === 'ja') {
    return { market: 'Japan', countryCode: 'JP', explicit: false };
  }
  if (lang === 'es') {
    return { market: 'Spain', countryCode: 'ES', explicit: false };
  }
  if (lang === 'de') {
    return { market: 'Germany', countryCode: 'DE', explicit: false };
  }
  if (lang === 'fr') {
    return { market: 'France', countryCode: 'FR', explicit: false };
  }
  if (lang === 'it') {
    return { market: 'Italy', countryCode: 'IT', explicit: false };
  }

  return { market: 'Global / US', countryCode: 'US', explicit: false };
}

/**
 * Parse budget constraints with multi-currency and linguistic unit support.
 */
export function extractBudget(query: string): BudgetConstraint | undefined {
  const lower = query.toLowerCase();

  // Pattern A: "between ₹50k and ₹1 lakh" / "from 50000 to 100000"
  const rangeMatch = lower.match(/(?:between|from)\s*(?:₹|\$|€|£|rs\.?|inr)?\s*([\d,\.]+\s*(?:lakh|lac|k|thousand|million|cr|l)?)\s*(?:and|to|-)\s*(?:₹|\$|€|£|rs\.?|inr)?\s*([\d,\.]+\s*(?:lakh|lac|k|thousand|million|cr|l)?)/i);
  if (rangeMatch && rangeMatch[1] && rangeMatch[2]) {
    const minVal = parseNumericBudget(rangeMatch[1]);
    const maxVal = parseNumericBudget(rangeMatch[2]);
    const currency = detectCurrency(query);
    return {
      raw: rangeMatch[0],
      currency: currency.code,
      currencySymbol: currency.symbol,
      minAmount: minVal,
      maxAmount: maxVal,
      formatted: `${currency.symbol}${formatAmount(minVal)} - ${currency.symbol}${formatAmount(maxVal)}`,
    };
  }

  // Pattern B: "under ₹50,000", "below 50k", "less than $1000", "under €800", "under 20 lakh", "under ₹20L", "below 20 lac"
  const singleBudgetMatch = lower.match(/(?:under|below|less than|within|max|budget of|upto|up to)\s*(?:₹|\$|€|£|rs\.?|inr|usd|eur|gbp)?\s*([\d,\.]+\s*(?:lakh|lac|k|thousand|million|cr|l)?)/i);
  if (singleBudgetMatch && singleBudgetMatch[1]) {
    const rawMatch = singleBudgetMatch[0];
    const maxVal = parseNumericBudget(singleBudgetMatch[1]);
    const currency = detectCurrency(query);
    if (maxVal > 0) {
      let formatted = `${currency.symbol}${formatAmount(maxVal)}`;
      if (currency.code === 'INR' && maxVal >= 100000) {
        const inLakh = maxVal / 100000;
        formatted = `₹${inLakh} Lakh`;
      }
      return {
        raw: rawMatch,
        currency: currency.code,
        currencySymbol: currency.symbol,
        maxAmount: maxVal,
        formatted,
      };
    }
  }

  // Pattern C: Standalone "20 lakh" or "₹50000" or "$1000" preceded by constraint keywords
  const symbolMatch = query.match(/(?:₹|Rs\.?\s*|INR\s*)([\d,\.]+\s*(?:lakh|lac|k|cr|l)?)/i);
  if (symbolMatch && symbolMatch[1]) {
    const maxVal = parseNumericBudget(symbolMatch[1]);
    if (maxVal > 0) {
      return {
        raw: symbolMatch[0],
        currency: 'INR',
        currencySymbol: '₹',
        maxAmount: maxVal,
        formatted: maxVal >= 100000 ? `₹${maxVal / 100000} Lakh` : `₹${maxVal.toLocaleString('en-IN')}`,
      };
    }
  }

  return undefined;
}

function parseNumericBudget(str: string): number {
  const clean = str.trim().toLowerCase();
  if (clean.includes('lakh') || clean.includes('lac') || clean.endsWith('l')) {
    const num = parseFloat(clean.replace(/[^0-9\.]/g, ''));
    return isNaN(num) ? 0 : Math.round(num * 100000);
  }
  if (clean.includes('cr') || clean.includes('crore')) {
    const num = parseFloat(clean.replace(/[^0-9\.]/g, ''));
    return isNaN(num) ? 0 : Math.round(num * 10000000);
  }
  if (clean.endsWith('k') || clean.includes('thousand')) {
    const num = parseFloat(clean.replace(/[^0-9\.]/g, ''));
    return isNaN(num) ? 0 : Math.round(num * 1000);
  }
  if (clean.includes('million') || clean.endsWith('m')) {
    const num = parseFloat(clean.replace(/[^0-9\.]/g, ''));
    return isNaN(num) ? 0 : Math.round(num * 1000000);
  }
  const num = parseFloat(clean.replace(/,/g, ''));
  return isNaN(num) ? 0 : num;
}

function detectCurrency(query: string): { code: string; symbol: string } {
  if (/₹|rs|inr|lakh|crore/i.test(query)) return { code: 'INR', symbol: '₹' };
  if (/€|eur|euro/i.test(query)) return { code: 'EUR', symbol: '€' };
  if (/£|gbp|pound/i.test(query)) return { code: 'GBP', symbol: '£' };
  if (/¥|jpy|yen/i.test(query)) return { code: 'JPY', symbol: '¥' };
  return { code: 'USD', symbol: '$' };
}

function formatAmount(val: number): string {
  if (val >= 100000) {
    return `${(val / 100000).toFixed(val % 100000 === 0 ? 0 : 1)} Lakh`;
  }
  return val.toLocaleString();
}

/**
 * Deterministically identify Master Type across the 14 defined domains.
 */
export function detectMasterType(query: string): { masterType: MasterType; entityType: EntityType } {
  const lower = query.toLowerCase();

  // 1. EMPLOYERS (Must check BEFORE Companies/Brands so "Samsung employee reviews" -> EMPLOYERS, not COMPANY_BRAND)
  if (
    /(?:employee reviews?|workplace|culture at|salary at|working at|work life balance|glassdoor|ambitionbox|interview experience|careers at|jobs at|as an employer)/i.test(lower)
  ) {
    return { masterType: 'EMPLOYERS', entityType: 'EMPLOYER' };
  }

  // 2. VEHICLES
  if (
    /(?:suv|car|cars|automobile|bike|scooter|sedan|hatchback|ev\b|electric car|thar|creta|fortuner|scorpio|nexon|harrier|safari|innova|xuv700|brezza|seltos|bullet|royal enfield|activa|motorcycle|diesel car|petrol car|mileage|on road price)/i.test(lower) &&
    !/(?:car charger|car perfume|car vacuum|car mobile holder|dashcam|toy car)/i.test(lower)
  ) {
    return { masterType: 'VEHICLES', entityType: 'VEHICLE' };
  }

  // 3. APPS & SOFTWARE
  if (
    /(?:software|saas|crm|erp|accounting software|quickbooks|zoho|tally|freshbooks|xero|slack|notion|figma|canva|salesforce|hubspot|photoshop|antivirus|vpn|code editor|project management tool|app for)/i.test(lower)
  ) {
    return { masterType: 'APPS_SOFTWARE', entityType: 'SOFTWARE' };
  }

  // 4. PROFESSIONALS (Lawyer, CA, Architect, Doctor, Consultant, Photographer)
  if (
    /(?:chartered accountant|ca near me|lawyer|advocate|architect|consultant|doctor|physician|surgeon|dentist near|photographer in|wedding photographer)/i.test(lower)
  ) {
    return { masterType: 'PROFESSIONALS', entityType: 'PROFESSIONAL' };
  }

  // 5. LOCAL SERVICES (Housekeeping, Cleaning, Plumbing, Electrician, Pest Control, Salon)
  if (
    /(?:housekeeping|cleaning service|maid service|plumber|electrician|mechanic|carpenter|pest control|salon near|spa near|appliance repair|laundry service)/i.test(lower)
  ) {
    return { masterType: 'SERVICES', entityType: 'LOCAL_SERVICE' };
  }

  // 6. EDUCATION (Colleges, Universities, MBA, Bootcamps, Degrees)
  if (
    /(?:mba college|university|iim\b|iit\b|engineering college|medical college|coding bootcamp|online degree|school in|coaching institute|upsc coaching)/i.test(lower)
  ) {
    return { masterType: 'EDUCATION', entityType: 'EDUCATION' };
  }

  // 7. TRAVEL (Hotels, Resorts, Flights, Homestays, Destinations)
  if (
    /(?:hotel|resort|villa|homestay|flight|airlines|airbnb|stay in|places to stay|resorts in|hotels in)/i.test(lower)
  ) {
    return { masterType: 'TRAVEL', entityType: 'TRAVEL_STAY' };
  }

  // 8. PLACES & EXPERIENCES (Museums, Spas, Monuments, Sightseeing)
  if (
    /(?:museum|things to do|tourist place|monument|sightseeing|theme park|water park|places to visit|attractions in)/i.test(lower)
  ) {
    return { masterType: 'PLACES_EXPERIENCES', entityType: 'TRAVEL_STAY' };
  }

  // 9. FINANCIAL PRODUCTS & PROVIDERS (Credit Cards, Loans, Banks, Insurance)
  if (
    /(?:credit card|credit cards|savings account|bank account|fixed deposit|mutual fund|home loan|personal loan|term insurance|health insurance|demat|broker)/i.test(lower)
  ) {
    return { masterType: 'FINANCE', entityType: 'FINANCE' };
  }

  // 10. REAL ESTATE (Flats, Apartments, Villas, Properties)
  if (
    /(?:flat in|apartment in|property in|2bhk|3bhk|house for sale|villa for sale|real estate|builder floor|residential plot)/i.test(lower)
  ) {
    return { masterType: 'REAL_ESTATE', entityType: 'REAL_ESTATE' };
  }

  // 11. ENTERTAINMENT & MEDIA (Movies, Series, Books, Games)
  if (
    /(?:movie|web series|tv show|anime|video game|ps5 game|xbox game|soundtrack)/i.test(lower)
  ) {
    return { masterType: 'ENTERTAINMENT_MEDIA', entityType: 'ENTERTAINMENT' };
  }

  // 12. WEBSITES & PLATFORMS
  if (
    /(?:website|ecommerce platform|hosting provider|domain registrar|cloud platform|payment gateway)/i.test(lower)
  ) {
    return { masterType: 'WEBSITES_PLATFORMS', entityType: 'SOFTWARE' };
  }

  // 13. COMPANIES & BRANDS (Corporate entity lookup)
  if (
    /^(?:samsung|apple|sony|microsoft|google|lg|tata|reliance|infosys|wipro|amazon|meta|tesla|toyota|honda)$/i.test(lower) ||
    /(?:company profile|brand history|headquarters of|parent company)/i.test(lower)
  ) {
    return { masterType: 'COMPANIES_BRANDS', entityType: 'COMPANY_BRAND' };
  }

  // 14. DEFAULT: PHYSICAL PRODUCTS
  return { masterType: 'PRODUCTS', entityType: 'PRODUCT' };
}

/**
 * Deterministically parse user search query to detect decision intent, master type, and constraints.
 */
export function analyzeSearchIntent(query: string, lang: LanguageCode = 'en'): ExtractedIntent {
  const q = query.trim();
  const lower = q.toLowerCase();

  const { masterType, entityType } = detectMasterType(q);
  const marketInfo = extractMarket(q, lang);
  const budgetInfo = extractBudget(q);

  // 1. COMPARISON INTENT (e.g. "Sony A7 IV vs Canon R6 Mark II", "A vs B")
  const vsMatch = lower.match(/^(.+?)\s+(?:vs\.?|versus|v\/s|against)\s+(.+?)$/i);
  const whichBetterMatch = lower.match(/which\s+(?:is\s+)?better\s*[:\?-]?\s*(.+?)\s+(?:or|vs\.?|versus)\s+(.+?)$/i);

  if (whichBetterMatch && whichBetterMatch[1] && whichBetterMatch[2]) {
    const itemA = cleanEntityName(whichBetterMatch[1]);
    const itemB = cleanEntityName(whichBetterMatch[2]);
    return {
      mode: 'COMPARISON',
      masterType,
      entityType,
      primaryQuery: q,
      comparedItems: [itemA, itemB],
      marketCountry: marketInfo.market,
      suggestedHeading: `${itemA} vs ${itemB}`,
      suggestedSubtitle: 'Direct side-by-side decision matrix, performance trade-offs, and clear verdict.',
      primaryQuestion: 'Which one is better for you?',
    };
  }

  if (vsMatch && vsMatch[1] && vsMatch[2] && !vsMatch[1].includes('best ') && vsMatch[1].length > 2) {
    const itemA = cleanEntityName(vsMatch[1]);
    const itemB = cleanEntityName(vsMatch[2]);
    return {
      mode: 'COMPARISON',
      masterType,
      entityType,
      primaryQuery: q,
      comparedItems: [itemA, itemB],
      marketCountry: marketInfo.market,
      suggestedHeading: `${itemA} vs ${itemB}`,
      suggestedSubtitle: 'Direct side-by-side decision matrix, performance trade-offs, and clear verdict.',
      primaryQuestion: 'Which one should you choose?',
    };
  }

  // 2. LOCAL SERVICE / LOCAL PROFESSIONAL INTENT (e.g. "housekeeping company near me", "best photographer in Delhi")
  const isNearMe = /(?:near me|in my area|nearby|local)/i.test(lower);
  const hasCitySpecifier = /(?:in delhi|in mumbai|in bangalore|in jaipur|in pune|in hyderabad|in chennai|in new york|in london|in tokyo|in paris)/i.test(lower);

  if (
    (masterType === 'SERVICES' || masterType === 'PROFESSIONALS') &&
    (isNearMe || hasCitySpecifier || lower.includes('in ') || lower.includes('near'))
  ) {
    let location = isNearMe ? 'Near You (Local Area)' : marketInfo.market;
    const locMatch = lower.match(/in\s+([a-zA-Z\s]+)/i);
    if (locMatch && locMatch[1]) location = locMatch[1].trim();

    return {
      mode: 'LOCAL_SERVICE',
      masterType,
      entityType,
      primaryQuery: q,
      locationConstraint: location,
      marketCountry: marketInfo.market,
      suggestedHeading: `Verified Decision Guide: ${capitalize(q)}`,
      suggestedSubtitle: `Reputation, service ratings, verified customer feedback, and contact details for verified options in ${location}.`,
      primaryQuestion: 'Which provider is most reliable and highly rated?',
    };
  }

  // 3. EMPLOYER REVIEWS (e.g. "Samsung employee reviews", "working at Google")
  if (masterType === 'EMPLOYERS') {
    const companyName = q.replace(/(?:employee reviews?|workplace|culture|salary|working at|glassdoor|careers|jobs)/gi, '').trim() || q;
    return {
      mode: 'EXACT_PRODUCT',
      masterType: 'EMPLOYERS',
      entityType: 'EMPLOYER',
      primaryQuery: q,
      entityName: companyName,
      marketCountry: marketInfo.market,
      suggestedHeading: `${companyName} — Workplace Culture & Employee Review Consensus`,
      suggestedSubtitle: 'Verified employee satisfaction, work-life balance, compensation ratings, and career growth synthesis.',
      primaryQuestion: 'Is this company a good place to work?',
    };
  }

  // 4. RECOMMENDATION INTENT (e.g. "best camera for YouTube", "best SUV under 20 lakh in India", "best accounting software for small business")
  const isBestQuery = /^(?:best|top|recommended|cheapest|affordable|top rated)\s+/i.test(lower) ||
    /(?:under|below|for|in|between)\s+(?:₹|\$|€|£|rs|inr|usd|lakh|\d+|youtube|students|coding|gaming|family|small business|beginners|travel)/i.test(lower);

  // Extract Use-Case constraint (e.g. "for YouTube", "for small business", "for students", "for gaming", "for family")
  let useCaseConstraint: string | undefined;
  const useCaseMatch = lower.match(/(?:for|for the)\s+([a-zA-Z0-9\s]+?)(?:\s+(?:under|below|in|with|between)|\s*$)/i);
  if (useCaseMatch && useCaseMatch[1]) {
    const ucCandidate = useCaseMatch[1].trim();
    if (!['the', 'a', 'an', 'sale', 'rent', 'india', 'japan', 'usa', 'delhi'].includes(ucCandidate)) {
      useCaseConstraint = ucCandidate;
    }
  }

  if (isBestQuery || budgetInfo || useCaseConstraint) {
    let heading = `Top Verified Picks for "${q}"`;
    if (useCaseConstraint && budgetInfo) {
      heading = `Best Choices for ${capitalize(useCaseConstraint)} (${budgetInfo.formatted})`;
    } else if (useCaseConstraint) {
      heading = `Top Recommended Options for ${capitalize(useCaseConstraint)}`;
    } else if (budgetInfo) {
      heading = `Top Picks ${budgetInfo.formatted}`;
    }

    return {
      mode: 'RECOMMENDATION_INTENT',
      masterType,
      entityType,
      primaryQuery: q,
      budgetConstraint: budgetInfo ? budgetInfo.formatted : undefined,
      budgetDetails: budgetInfo,
      useCaseConstraint,
      marketCountry: marketInfo.market,
      suggestedHeading: heading,
      suggestedSubtitle: `Evaluated across verified benchmarks, owner feedback, and real-world fit for ${marketInfo.market}.`,
      primaryQuestion: 'Which option offers the strongest value and reliability?',
    };
  }

  // 5. EXACT PRODUCT / EXACT ENTITY SEARCH (e.g. "Sony Alpha 7 IV", "QuickBooks", "Toyota Fortuner", "Samsung")
  const hasModelToken = /(?:\b[a-z]?\d{2,5}[a-z]?\b|\bm\d\b|\bpro\b|\bultra\b|\bmax\b|\bplus\b|\bmini\b|\bfe\b|\bxr\b|\bse\b|\biv\b|\bv\b|\biii\b|\bii\b|\balpha\b|\br6\b|\ba7\b)/i.test(lower);
  const wordCount = q.split(/\s+/).length;

  if (masterType === 'COMPANIES_BRANDS') {
    return {
      mode: 'GENERAL_ENTITY_LOOKUP',
      masterType: 'COMPANIES_BRANDS',
      entityType: 'COMPANY_BRAND',
      primaryQuery: q,
      entityName: q,
      marketCountry: marketInfo.market,
      suggestedHeading: `${q} — Brand & Entity Decision Summary`,
      suggestedSubtitle: 'Company overview, key product lines, verified consumer reputation, and customer satisfaction index.',
      primaryQuestion: 'What is this brand recognized for?',
    };
  }

  if (hasModelToken || wordCount >= 3 || masterType === 'APPS_SOFTWARE') {
    return {
      mode: 'EXACT_PRODUCT',
      masterType,
      entityType,
      primaryQuery: q,
      entityName: q,
      marketCountry: marketInfo.market,
      suggestedHeading: `${q} — Decision & Performance Summary`,
      suggestedSubtitle: 'Key trade-offs, target audience fit, verified customer praise/complaints, and live market pricing.',
      primaryQuestion: 'Is this option worth choosing for you?',
    };
  }

  // 6. CATEGORY DISCOVERY (e.g. "camera", "suv", "laptop", "credit cards")
  return {
    mode: 'CATEGORY_DISCOVERY',
    masterType,
    entityType,
    primaryQuery: q,
    marketCountry: marketInfo.market,
    suggestedHeading: `Top ${capitalize(q)} Options Worth Choosing`,
    suggestedSubtitle: 'Curated shortlist highlighting Best Overall, Best Value, and specialized use-case picks.',
    primaryQuestion: 'Which option matches your priority?',
  };
}

function cleanEntityName(str: string): string {
  return str
    .replace(/^(?:the|a|an)\s+/i, '')
    .replace(/[,\?]+$/, '')
    .trim();
}

function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Assign evidence-supported Decision Archetypes to products
 */
export function assignDecisionArchetypes(products: any[], intent: ExtractedIntent): any[] {
  if (!products || products.length === 0) return [];

  return products.map((p, index) => {
    let badgeLabel = 'Verified Pick';
    let badgeType: 'BEST_OVERALL' | 'BEST_VALUE' | 'SPECIALIZED' | 'FLAGSHIP' | 'BALANCED' = 'BALANCED';
    let reason = p.whyDemandReason || 'Balanced performance across verified customer reviews and benchmark tests.';
    let drawback = 'Standard market pricing without heavy clearance discounts.';
    let bestFor = 'Everyday reliability and quality.';

    if (index === 0) {
      badgeLabel = 'Best Overall';
      badgeType = 'BEST_OVERALL';
      bestFor = intent.useCaseConstraint ? `Best for ${intent.useCaseConstraint}` : 'Top choice for most users seeking proven reliability';
      drawback = 'High market demand; fewer deep promotional price drops.';
      reason = p.whyDemandReason || `Consistently ranked highest for build quality, performance, and customer satisfaction.`;
    } else if (index === 1 || p.budgetTier === 'BUDGET') {
      badgeLabel = 'Best Value';
      badgeType = 'BEST_VALUE';
      bestFor = 'Value-focused buyers looking for high performance-to-price ratio';
      drawback = 'Lacks a few luxury or specialized pro features found in top-tier models.';
      reason = p.whyDemandReason || `Offers the strongest feature set and reliability in its price segment.`;
    } else if (index === 2) {
      badgeLabel = intent.useCaseConstraint ? `Best for ${capitalize(intent.useCaseConstraint)}` : 'Specialized Pick';
      badgeType = 'SPECIALIZED';
      bestFor = intent.useCaseConstraint || 'Power users needing specialized workflow capabilities';
      drawback = 'Specialized feature set might exceed basic everyday requirements.';
      reason = p.whyDemandReason || `Engineered specifically for demanding workflow requirements.`;
    } else if (p.budgetTier === 'PREMIUM' || p.basePriceUSD > 1000) {
      badgeLabel = 'Flagship / Pro Pick';
      badgeType = 'FLAGSHIP';
      bestFor = 'Professionals and uncompromising enthusiasts';
      drawback = 'Higher initial investment cost.';
      reason = p.whyDemandReason || `Top-of-the-line specifications and premium construction materials.`;
    }

    return {
      ...p,
      decisionArchetype: {
        label: p.tag || badgeLabel,
        type: badgeType,
        bestFor,
        drawback,
        reason,
      },
    };
  });
}
