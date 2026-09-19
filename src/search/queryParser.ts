import {
  DecisionDomain,
  IntentType,
  LanguageCode,
  MarketCode,
  ParsedQuery,
  QueryConstraints,
} from '../types';
import { resolveTargetMarket } from '../localization/markets';

export function parseSearchQuery(
  rawQuery: string,
  userMarket?: MarketCode,
  userLang: LanguageCode = 'en'
): ParsedQuery {
  if (!rawQuery || !rawQuery.trim()) {
    return {
      rawQuery: rawQuery || '',
      cleanQuery: '',
      intent: 'GENERAL_LOOKUP',
      domain: 'PRODUCT',
      market: userMarket || 'US',
      language: userLang,
      constraints: {},
    };
  }

  // Bounded safe normalization: collapse whitespace, limit extreme adversarial length
  const clean = rawQuery.trim().slice(0, 1000).replace(/\s+/g, ' ');
  const lower = clean.toLowerCase();

  // 1. Resolve Target Market & Country constraint
  const { market, explicitCountry, explicitCurrency } = resolveTargetMarket(clean, userMarket);

  // Language detection from query: en / hi / ja / es
  let detectedLang: LanguageCode = userLang;
  if (/[\u0900-\u097F]|\b(?:kaisa|accha|achha|sasta|badiya|mehenga|ke\s+liye)\b/i.test(clean)) {
    detectedLang = 'hi';
  } else if (/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/i.test(clean)) {
    detectedLang = 'ja';
  } else if (/\b(?:mejor|tel[eé]fono|m[oó]vil|barato|precio|bajo|para)\b/i.test(lower) || /[áéíóúñ]/i.test(clean)) {
    detectedLang = 'es';
  }

  // 2. Extract Negation Constraints (Section 6)
  // "not X", "without X", "no X", "don't need X", "not interested in X"
  const negativeConstraints: string[] = [];
  const negationPatterns = [
    /\b(?:but\s+)?not\s+interested\s+in\s+([A-Za-z0-9\s-]+?)(?:\s+and\b|\s+or\b|\s+under\b|\s+in\b|\s+with\b|$|,|\.)/gi,
    /\b(?:don't|do\s+not)\s+(?:need|want)\s+([A-Za-z0-9\s-]+?)(?:\s+and\b|\s+or\b|\s+under\b|\s+in\b|\s+with\b|$|,|\.)/gi,
    /\b(?:but\s+)?not\s+([A-Za-z0-9\s-]+?)(?:\s+and\b|\s+or\b|\s+under\b|\s+in\b|\s+with\b|$|,|\.)/gi,
    /\bwithout\s+([A-Za-z0-9\s-]+?)(?:\s+and\b|\s+or\b|\s+under\b|\s+in\b|\s+with\b|$|,|\.)/gi,
    /\bno\s+([A-Za-z0-9\s-]+?)(?:\s+and\b|\s+or\b|\s+under\b|\s+in\b|\s+with\b|$|,|\.)/gi,
  ];

  for (const pattern of negationPatterns) {
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(clean)) !== null) {
      const term = match[1]?.trim().toLowerCase();
      if (term && term.length > 1 && !['a', 'an', 'the', 'for', 'in', 'with', 'to'].includes(term)) {
        if (!negativeConstraints.includes(term)) {
          negativeConstraints.push(term);
        }
      }
    }
  }

  const isNegated = (term: string) =>
    negativeConstraints.some((neg) => neg === term.toLowerCase() || neg.includes(term.toLowerCase()) || term.toLowerCase().includes(neg));

  // 3. Extract Product Type
  let productType: string | undefined;
  if (/\b(?:phone|phones|smartphone|smartphones|mobile|mobiles|android|iphone|iphones|cellphone)\b/i.test(lower)) {
    productType = 'smartphone';
  } else if (/\b(?:camera|cameras|mirrorless|dslr|eos|lumix|alpha\s*\d|a7\s*[ivx]+|a6\s*\d{3}|powershot|cybershot)\b/i.test(lower)) {
    productType = 'camera';
  } else if (/\b(?:laptop|laptops|notebook|notebooks|macbook|macbooks|chromebook|chromebooks|thinkpad|zenbook|xps|inspiron|legion)\b/i.test(lower)) {
    productType = 'laptop';
  } else if (/\b(?:tv|tvs|television|televisions|oled\s+tv|qled|bravia)\b/i.test(lower)) {
    productType = 'television';
  } else if (/\b(?:headphone|headphones|earphone|earphones|earbuds|audio|soundbar|speaker|speakers|wh-1000xm\d|xm\d|quietcomfort|airpods)\b/i.test(lower)) {
    productType = 'audio';
  } else if (/\b(?:ipad|ipads|tablet|tablets|galaxy\s+tab)\b/i.test(lower)) {
    productType = 'tablet';
  } else if (/\b(?:smartwatch|smartwatches|apple\s+watch|galaxy\s+watch|fitness\s+tracker)\b/i.test(lower)) {
    productType = 'smartwatch';
  } else if (/\b(?:kindle|e-reader|ereader|ebook\s+reader|paperwhite)\b/i.test(lower)) {
    productType = 'ereader';
  }

  // 4. Extract Brand
  const brandMatch = clean.match(/\b(apple|samsung|sony|dell|hp|lenovo|asus|acer|bose|sennheiser|canon|nikon|fujifilm|lg|panasonic|motorola|oneplus|xiaomi|google|microsoft|kindle|amazon|anker|dji|gopro|dyson|roomba|irobot|sonos)\b/i);
  const brand = brandMatch && !isNegated(brandMatch[1]) ? brandMatch[1].toLowerCase() : undefined;

  // 5. Extract Budget / Price (Section 5, 7)
  let budget: number | undefined;
  let budgetMin: number | undefined;
  let budgetMax: number | undefined;
  let currency: string | undefined = explicitCurrency;

  const normalizeCurrencySymbol = (sym?: string): string | undefined => {
    if (!sym) return undefined;
    const s = sym.toUpperCase().trim();
    if (s === 'CAD' || s === 'C$') return 'C$';
    if (s === 'AUD' || s === 'A$') return 'A$';
    if (s === 'USD' || s === '$') return '$';
    if (s === 'GBP' || s === '£') return '£';
    if (s === 'EUR' || s === '€') return '€';
    if (s === 'JPY' || s === '¥') return '¥';
    if (s === 'INR' || s === 'RS' || s === '₹') return '₹';
    return sym;
  };

  // Range: "between $500 and $800", "$500 to $800", "500-800"
  const rangeMatch = clean.match(/\bbetween\s*([₹$€£¥]|C\$|A\$|R\$|CAD|AUD|USD|INR|GBP|EUR|JPY)?\s*([\d,]+)\s*(?:and|to|-)\s*([₹$€£¥]|C\$|A\$|R\$|CAD|AUD|USD|INR|GBP|EUR|JPY)?\s*([\d,]+)/i);
  if (rangeMatch) {
    const sym = normalizeCurrencySymbol(rangeMatch[1] || rangeMatch[3]);
    const minVal = parseFloat(rangeMatch[2].replace(/,/g, ''));
    const maxVal = parseFloat(rangeMatch[4].replace(/,/g, ''));
    if (!isNaN(minVal) && !isNaN(maxVal)) {
      budgetMin = minVal;
      budgetMax = maxVal;
      budget = maxVal;
      if (sym) currency = sym;
    }
  }

  // Under / below / max / less than
  if (budget === undefined) {
    const budgetMatch = clean.match(
      /(?:under|below|less than|max(?:imum)?)\s*([₹$€£¥]|C\$|A\$|R\$|CAD|AUD|USD|INR|GBP|EUR|JPY)?\s*([\d,]+(?:\.\d+)?)\s*(k|thousand|lakh|lac)?/i
    );
    if (budgetMatch) {
      const symbol = normalizeCurrencySymbol(budgetMatch[1]);
      let num = parseFloat(budgetMatch[2].replace(/,/g, ''));
      const multiplier = (budgetMatch[3] || '').toLowerCase();
      if (multiplier === 'k' || multiplier === 'thousand') {
        num *= 1000;
      } else if (multiplier === 'lakh' || multiplier === 'lac') {
        num *= 100000;
      }
      budget = num;
      if (symbol) currency = symbol;
    }
  }

  // Around / approx / budget / price
  if (budget === undefined) {
    const approxMatch = clean.match(
      /(?:around|approx(?:imately)?|budget(?:\s+of)?|price(?:\s+of)?)\s*([₹$€£¥]|C\$|A\$|R\$|CAD|AUD|USD|INR|GBP|EUR|JPY)?\s*([\d,]+(?:\.\d+)?)\s*(k|thousand|lakh|lac)?/i
    );
    if (approxMatch) {
      const symbol = normalizeCurrencySymbol(approxMatch[1]);
      let num = parseFloat(approxMatch[2].replace(/,/g, ''));
      const multiplier = (approxMatch[3] || '').toLowerCase();
      if (multiplier === 'k' || multiplier === 'thousand') {
        num *= 1000;
      } else if (multiplier === 'lakh' || multiplier === 'lac') {
        num *= 100000;
      }
      budget = num;
      if (symbol) currency = symbol;
    }
  }

  // Standalone price token with explicit symbol or in budget-like query: e.g. "₹50,000", "$800"
  if (budget === undefined) {
    const standaloneMatch = clean.match(/(?:^|\s)([₹$€£¥]|C\$|A\$|R\$|CAD|AUD|USD|INR|GBP|EUR|JPY)\s*([\d,]+(?:\.\d+)?)\s*(k|thousand|lakh|lac)?(?:\s|$)/i);
    if (standaloneMatch) {
      const symbol = normalizeCurrencySymbol(standaloneMatch[1]);
      let num = parseFloat(standaloneMatch[2].replace(/,/g, ''));
      const multiplier = (standaloneMatch[3] || '').toLowerCase();
      if (multiplier === 'k' || multiplier === 'thousand') {
        num *= 1000;
      } else if (multiplier === 'lakh' || multiplier === 'lac') {
        num *= 100000;
      }
      budget = num;
      currency = symbol;
    }
  }

  // Default currency based on resolved market if budget exists without explicit symbol
  if (budget !== undefined && !currency) {
    if (market === 'IN') currency = '₹';
    else if (market === 'US') currency = '$';
    else if (market === 'UK') currency = '£';
    else if (['DE', 'FR', 'ES', 'IT', 'NL'].includes(market)) currency = '€';
    else if (market === 'JP') currency = '¥';
    else if (market === 'CA') currency = 'C$';
    else if (market === 'AU') currency = 'A$';
  }

  // 6. Extract Use Case (Section 5, 9)
  let useCase: string | undefined;

  // Pattern 1: Explicit "for <useCase>"
  const useCaseMatch = clean.match(/\bfor\s+([A-Za-z0-9\s-]+?)(?:\s+under|\s+below|\s+in\b|\s+with\b|\s+without\b|\s+but\b|$|,|\.)/i);
  if (useCaseMatch && useCaseMatch[1]) {
    const candidate = useCaseMatch[1].trim();
    if (candidate && !isNegated(candidate) && !['a', 'the', 'all', 'me', 'us', 'sale'].includes(candidate.toLowerCase())) {
      useCase = candidate;
    }
  }

  // Pattern 2: Known adjective use cases if not yet captured
  if (!useCase) {
    const knownUseCases = [
      'photography',
      'gaming',
      'travel',
      'video editing',
      'programming',
      'coding',
      'student',
      'college',
      'office work',
      'office',
      'outdoor use',
      'outdoor',
      'running',
      'workout',
      'fitness',
      'vlogging',
    ];
    for (const uc of knownUseCases) {
      const ucRegex = new RegExp(`\\b${uc.replace(/\s+/g, '\\s+')}\\b`, 'i');
      if (ucRegex.test(clean) && !isNegated(uc)) {
        useCase = uc;
        break;
      }
    }
  }

  // 7. Extract Specifications & Features (Section 5, 7)
  const specifications: string[] = [];
  const specPatterns = [
    /\b(\d+\s*(?:gb|tb)\s*ram)\b/gi,
    /\b(\d+\s*(?:gb|tb)(?:\s*(?:storage|ssd))?)\b/gi,
    /\b(oled|amoled|ips|mini[- ]led|retina)\b/gi,
    /\b(\d{2,3}\s*hz)\b/gi,
    /\b(usb[- ]c|thunderbolt|5g|wi-?fi\s*6e?|hdmi)\b/gi,
    /\b(4k|8k|1080p|fhd|uhd)\b/gi,
    /\b(\d+\s*(?:mah|w|hours?|hr|kg|g|lb|inch|in))\b/gi,
  ];

  for (const sp of specPatterns) {
    let sm: RegExpExecArray | null;
    while ((sm = sp.exec(clean)) !== null) {
      const matchText = sm[1]?.trim();
      if (matchText && !isNegated(matchText) && !specifications.includes(matchText)) {
        specifications.push(matchText);
      }
    }
  }

  const features: string[] = [];
  const featureMatches = [
    'lightweight',
    'compact',
    'wireless',
    'waterproof',
    'water-resistant',
    'noise cancelling',
    'anc',
    'long battery life',
    'battery life',
  ];
  for (const feat of featureMatches) {
    const fRegex = new RegExp(`\\b${feat.replace(/[- ]/g, '[- ]')}\\b`, 'i');
    if (fRegex.test(clean) && !isNegated(feat) && !features.includes(feat)) {
      features.push(feat);
    }
  }

  // 8. Location extraction: "near me" or "in [Location]"
  let location: string | undefined;
  if (lower.includes('near me') || lower.includes('nearby') || lower.includes('around me')) {
    location = 'near me';
  } else {
    const locMatch = clean.match(/\b(?:in|at)\s+([A-Za-z\s]+)$/i);
    if (locMatch && locMatch[1]) {
      const candidate = locMatch[1].trim();
      if (!explicitCountry || candidate.toLowerCase() !== explicitCountry.toLowerCase()) {
        location = candidate;
      }
    }
  }

  // 9. Build Constraints
  const constraints: QueryConstraints = {
    budget,
    budgetMin,
    budgetMax,
    currency,
    explicitCountry,
    location,
    useCase,
    brand,
    productType,
    specifications: specifications.length > 0 ? specifications : undefined,
    features: features.length > 0 ? features : undefined,
    negativeConstraints: negativeConstraints.length > 0 ? negativeConstraints : undefined,
  };

  // 10. Determine Intent & Domain
  let intent: IntentType = 'GENERAL_LOOKUP';
  let domain: DecisionDomain = 'PRODUCT';

  // Informational / Attribute Lookup terms (Section 2, 3)
  // Queries asking for specific properties or informational concepts are GENERAL_LOOKUP
  const isInformationalQuery =
    /^(?:what\s+is|how\s+does|how\s+to|why\s+is|difference\s+between|what\s+is\s+the\s+difference)\b/i.test(clean);

  const isAttributeQuery =
    /\b(?:battery\s*life|weight|ports|dimensions|specs|specifications|size|screen\s*size|ram|release\s*date|price\s*of)\b/i.test(lower);

  // Aspect terms that should NEVER trigger a product-vs-product comparison
  const nonProductAspectRegex =
    /^(?:water\s+resistance|battery\s+life|camera(?:s)?|price|specs|specifications|weight|size|durability|performance|display|screen|anc|noise\s+cancellation|ports)$/i;

  // Comparison Intent (Section 3, 15)
  // Multi-comparison check (e.g. "A vs B vs C")
  const vsSplit = clean.split(/\s+(?:vs\.?|versus)\s+/i);
  if (vsSplit.length > 2 && !isInformationalQuery) {
    const entities = vsSplit.map((e) => e.trim()).filter((e) => e.length > 0);
    constraints.multiComparisonEntities = entities;
    constraints.comparisonEntities = [entities[0], entities[1]];
    return {
      rawQuery,
      cleanQuery: clean,
      intent: 'COMPARISON',
      domain: 'PRODUCT',
      market,
      language: detectedLang,
      constraints,
    };
  }

  let vsMatch = clean.match(/^(.+?)\s+(?:vs\.?|versus)\s+(.+)$/i);
  if (!vsMatch) {
    vsMatch = clean.match(/^compare\s+(.+?)\s+(?:and|with|to)\s+(.+)$/i);
  }
  if (!vsMatch && !clean.includes('?') && !isInformationalQuery) {
    if (!/^(?:which|what|how|where|is|can|do|should)\b/i.test(clean)) {
      vsMatch = clean.match(/^(.+?)\s+or\s+(.+)$/i);
    }
  }

  if (vsMatch && !isInformationalQuery) {
    let entityA = vsMatch[1].trim();
    let entityB = vsMatch[2].trim();

    // Strip trailing constraint phrases from entityB
    const trailingConstraint = entityB.match(/^(.+?)\s+(?:for\s+[a-z0-9\s-]+|under\s+.*|in\s+.*)$/i);
    if (trailingConstraint) {
      entityB = trailingConstraint[1].trim();
    }

    // Safety guard: do not compare a product with a feature/attribute
    // e.g. "phone vs water resistance" is NOT a product comparison
    const isFalsePositiveComparison =
      nonProductAspectRegex.test(entityB) ||
      nonProductAspectRegex.test(entityA) ||
      entityA.toLowerCase() === 'compare';

    if (!isFalsePositiveComparison) {
      intent = 'COMPARISON';
      constraints.comparisonEntities = [entityA, entityB];
      if (lower.includes('software') || lower.includes('app') || lower.includes('tool')) {
        domain = 'SOFTWARE';
      } else if (lower.includes('suv') || lower.includes('car')) {
        domain = 'VEHICLE';
      } else {
        domain = 'PRODUCT';
      }
      return {
        rawQuery,
        cleanQuery: clean,
        intent,
        domain,
        market,
        language: detectedLang,
        constraints,
      };
    }
  }

  // Local Discovery / Places
  const isPlaceQuery =
    lower.includes('hotel') ||
    lower.includes('resort') ||
    lower.includes('taj ') ||
    lower.includes('taj exotica') ||
    lower.includes('hyatt') ||
    lower.includes('marriott') ||
    lower.includes('hilton') ||
    lower.includes('sheraton') ||
    lower.includes('radisson') ||
    lower.includes('hostel') ||
    lower.includes('lodge') ||
    lower.includes('motel') ||
    lower.includes('inn in ') ||
    lower.includes('villa');

  if (
    constraints.location === 'near me' ||
    lower.includes('hotel in ') ||
    lower.includes('resort in ') ||
    lower.includes('ca near me') ||
    lower.includes('chartered accountant') ||
    lower.includes('housekeeping') ||
    lower.includes('plumber') ||
    lower.includes('dentist') ||
    lower.includes('hospital in') ||
    isPlaceQuery
  ) {
    intent = isPlaceQuery ? 'GENERAL_LOOKUP' : 'LOCAL_DISCOVERY';
    domain = isPlaceQuery ? 'PLACE' : 'SERVICE';
    return {
      rawQuery,
      cleanQuery: clean,
      intent,
      domain,
      market,
      language: detectedLang,
      constraints,
    };
  }

  // Exact Entity Model & Line Recognition (Section 2, 4)
  // Check for known product lines, alphanumeric model codes, series/generation, and iconic single-word products
  const isProductFamily =
    /\b(?:iphone|ipad|macbook|galaxy|pixel|thinkpad|zenbook|xps|inspiron|legion|alpha|eos|lumix|kindle|paperwhite|roomba|sonos|airpods|quietcomfort|surface|gopro|playstation|xbox|bravia)\b/i.test(lower);

  const isModelCode =
    /\b[a-z]{1,5}[-_]?\d{1,5}[a-z0-9]*\b/i.test(lower) ||
    /\b(?:iv|iii|ii|v|vi)\b/i.test(lower);

  const isSeriesGen =
    /\b(?:series\s+\d+|gen\s+\d+|\d+(?:st|nd|rd|th)\s+gen(?:eration)?|mark\s+[ivx]+|generation)\b/i.test(lower);

  const isExactSingleProduct =
    /^(?:kindle|ipad|sonos|roomba)$/i.test(clean);

  const isExactModel = (isProductFamily || isModelCode || isSeriesGen || isExactSingleProduct);

  const isComparativeWord = /\b(?:best|top|cheapest|cheap|recommend|recommended|which|list of|good|suggest)\b/i.test(lower);

  // If exact model/product is named AND no comparative word AND not an attribute lookup:
  // (e.g. "Sony WH-1000XM5 review" is an exact entity review, whereas "Sony XM5 weight" is attribute lookup)
  if (isExactModel && !isComparativeWord && (!isAttributeQuery || lower.includes('review'))) {
    intent = 'EXACT_ENTITY';
    domain = 'PRODUCT';

    // Strip trailing in [country/location] from cleanQuery so downstream search looks up the product cleanly
    let entityCleanQuery = clean;
    if (constraints.explicitCountry) {
      entityCleanQuery = entityCleanQuery
        .replace(new RegExp(`\\b(?:in|at)\\s+${constraints.explicitCountry}\\b`, 'i'), '')
        .trim();
    } else if (constraints.location && constraints.location !== 'near me') {
      entityCleanQuery = entityCleanQuery
        .replace(new RegExp(`\\b(?:in|at)\\s+${constraints.location}\\b`, 'i'), '')
        .trim();
    }

    return {
      rawQuery,
      cleanQuery: entityCleanQuery || clean,
      intent,
      domain,
      market,
      language: detectedLang,
      constraints,
    };
  }

  // Recommendation Intent (Section 2, 12)
  if (isComparativeWord || constraints.budget !== undefined || (constraints.useCase !== undefined && !isExactModel)) {
    intent = 'RECOMMENDATION';
    if (lower.includes('suv') || lower.includes('car') || lower.includes('bike') || lower.includes('vehicle')) {
      domain = 'VEHICLE';
    } else if (lower.includes('software') || lower.includes('app') || lower.includes('crm') || lower.includes('accounting') || lower.includes('tool')) {
      domain = 'SOFTWARE';
    } else if (lower.includes('hotel') || lower.includes('resort') || lower.includes('place')) {
      domain = 'PLACE';
    } else if (
      lower.includes('mba') ||
      lower.includes('degree') ||
      lower.includes('course') ||
      lower.includes('university') ||
      lower.includes('college') ||
      lower.includes('education') ||
      lower.includes('certification')
    ) {
      domain = 'EDUCATION';
    } else if (
      lower.includes('credit card') ||
      lower.includes('loan') ||
      lower.includes('mortgage') ||
      lower.includes('insurance') ||
      lower.includes('bank account')
    ) {
      domain = 'FINANCIAL';
    } else if (lower.includes('service') || lower.includes('doctor') || lower.includes('plumber') || lower.includes('ca ')) {
      domain = 'SERVICE';
    } else {
      domain = 'PRODUCT';
    }
    return {
      rawQuery,
      cleanQuery: clean,
      intent,
      domain,
      market,
      language: detectedLang,
      constraints,
    };
  }

  // Category Discovery (Section 2)
  if (
    lower.includes('software') ||
    lower.includes('cameras') ||
    lower.includes('phones') ||
    lower.includes('headphones') ||
    lower.includes('laptops')
  ) {
    intent = 'CATEGORY_DISCOVERY';
    domain = lower.includes('software') ? 'SOFTWARE' : 'PRODUCT';
    return {
      rawQuery,
      cleanQuery: clean,
      intent,
      domain,
      market,
      language: detectedLang,
      constraints,
    };
  }

  // Informational / General Lookup fallback
  let finalDomain: DecisionDomain = domain;
  if (
    lower.includes('mba') ||
    lower.includes('degree') ||
    lower.includes('university') ||
    lower.includes('college') ||
    lower.includes('course')
  ) {
    finalDomain = 'EDUCATION';
  } else if (lower.includes('hotel') || lower.includes('resort')) {
    finalDomain = 'PLACE';
  } else if (lower.includes('suv') || lower.includes('car')) {
    finalDomain = 'VEHICLE';
  }

  return {
    rawQuery,
    cleanQuery: clean,
    intent: 'GENERAL_LOOKUP',
    domain: finalDomain,
    market,
    language: detectedLang,
    constraints,
  };
}
