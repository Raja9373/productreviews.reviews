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
  const clean = rawQuery.trim();
  const lower = clean.toLowerCase();

  // 1. Resolve Target Market & Country constraint
  const { market, explicitCountry } = resolveTargetMarket(clean, userMarket);

  // 2. Extract Constraints
  const constraints: QueryConstraints = {
    explicitCountry,
  };

  // Budget extraction: under/below/less than ₹30,000 / $500 / 50000 / etc.
  const budgetMatch = clean.match(
    /(?:under|below|less than|max(?:imum)?)\s*([₹$€£C\$A\$¥R\$]?)\s*([\d,]+(?:\.\d+)?)\s*(k|thousand|lakh|lac)?/i
  );
  if (budgetMatch) {
    const symbol = budgetMatch[1];
    let num = parseFloat(budgetMatch[2].replace(/,/g, ''));
    const multiplier = (budgetMatch[3] || '').toLowerCase();
    if (multiplier === 'k' || multiplier === 'thousand') {
      num *= 1000;
    } else if (multiplier === 'lakh' || multiplier === 'lac') {
      num *= 100000;
    }
    constraints.budget = num;
    if (symbol) constraints.currency = symbol;
    else if (market === 'IN') constraints.currency = '₹';
    else if (market === 'US') constraints.currency = '$';
    else if (market === 'UK') constraints.currency = '£';
    else if (['DE', 'FR', 'ES', 'IT', 'NL'].includes(market)) constraints.currency = '€';
    else if (market === 'JP') constraints.currency = '¥';
    else if (market === 'CA') constraints.currency = 'C$';
  }

  // Location extraction: "near me" or "in [Location]"
  if (lower.includes('near me') || lower.includes('nearby') || lower.includes('around me')) {
    constraints.location = 'near me';
  } else {
    const locMatch = clean.match(/\b(?:in|at)\s+([A-Za-z\s]+)$/i);
    if (locMatch && locMatch[1]) {
      constraints.location = locMatch[1].trim();
    }
  }

  // Use case extraction
  const useCaseMatch = clean.match(/\bfor\s+([A-Za-z0-9\s]+?)(?:\s+under|\s+in|$)/i);
  if (useCaseMatch && useCaseMatch[1]) {
    constraints.useCase = useCaseMatch[1].trim();
  }

  // 3. Determine Intent Type & Domain
  let intent: IntentType = 'GENERAL_LOOKUP';
  let domain: DecisionDomain = 'PRODUCT';

  // Comparison intent: "X vs Y" or "compare X and Y"
  const vsMatch = clean.match(/^(.+?)\s+(?:vs\.?|versus|or)\s+(.+)$/i);
  if (vsMatch) {
    intent = 'COMPARISON';
    constraints.comparisonEntities = [vsMatch[1].trim(), vsMatch[2].trim()];
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
      language: userLang,
      constraints,
    };
  }

  // Local Discovery: "near me", "hotel in", "housekeeping", "plumber", "doctor", "CA near me"
  if (
    constraints.location === 'near me' ||
    lower.includes('hotel in ') ||
    lower.includes('resort in ') ||
    lower.includes('ca near me') ||
    lower.includes('chartered accountant') ||
    lower.includes('housekeeping') ||
    lower.includes('plumber') ||
    lower.includes('dentist') ||
    lower.includes('hospital in')
  ) {
    intent = 'LOCAL_DISCOVERY';
    domain = lower.includes('hotel') || lower.includes('resort') ? 'PLACE' : 'SERVICE';
    return {
      rawQuery,
      cleanQuery: clean,
      intent,
      domain,
      market,
      language: userLang,
      constraints,
    };
  }

  // Exact Entity: Specific model name / number
  // e.g. "Sony Alpha 7 IV", "iPhone 15 Pro", "MacBook Air M3", "Dell XPS 13"
  const isExactModel =
    /\b(?:alpha|mark|pro|max|ultra|plus|air|xps|thinkpad|galaxy|pixel|eos|lumix)\b/i.test(lower) ||
    /\b[a-z]{1,4}[-_]?\d{2,4}[a-z]?\b/i.test(lower) ||
    /\b(?:iv|iii|ii|v|vi)\b/i.test(lower);

  const isComparativeWord = /\b(?:best|top|cheapest|compare|which|list of|recommend)\b/i.test(lower);

  if (isExactModel && !isComparativeWord) {
    intent = 'EXACT_ENTITY';
    domain = 'PRODUCT';
    return {
      rawQuery,
      cleanQuery: clean,
      intent,
      domain,
      market,
      language: userLang,
      constraints,
    };
  }

  // Recommendation: "best X", "best phone under ₹30,000", "top SUV"
  if (isComparativeWord || constraints.budget !== undefined || constraints.useCase !== undefined) {
    intent = 'RECOMMENDATION';
    if (lower.includes('suv') || lower.includes('car') || lower.includes('bike')) {
      domain = 'VEHICLE';
    } else if (lower.includes('software') || lower.includes('app') || lower.includes('crm') || lower.includes('accounting')) {
      domain = 'SOFTWARE';
    } else if (lower.includes('hotel') || lower.includes('place')) {
      domain = 'PLACE';
    } else if (lower.includes('service') || lower.includes('course')) {
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
      language: userLang,
      constraints,
    };
  }

  // Category Discovery
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
      language: userLang,
      constraints,
    };
  }

  return {
    rawQuery,
    cleanQuery: clean,
    intent,
    domain,
    market,
    language: userLang,
    constraints,
  };
}
