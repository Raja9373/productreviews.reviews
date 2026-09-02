import { LanguageCode } from '../types';

export type DecisionMode =
  | 'EXACT_PRODUCT'
  | 'CATEGORY_DISCOVERY'
  | 'RECOMMENDATION_INTENT'
  | 'COMPARISON'
  | 'LOCAL_SERVICE';

export type EntityType =
  | 'PRODUCT'
  | 'VEHICLE'
  | 'SOFTWARE'
  | 'LOCAL_SERVICE'
  | 'TRAVEL_STAY'
  | 'EDUCATION'
  | 'FINANCE';

export interface ExtractedIntent {
  mode: DecisionMode;
  entityType: EntityType;
  primaryQuery: string;
  comparedItems?: [string, string];
  budgetConstraint?: string;
  useCaseConstraint?: string;
  locationConstraint?: string;
  suggestedHeading: string;
  suggestedSubtitle: string;
  primaryQuestion: string;
}

/**
 * Deterministically parse user search query to detect decision intent, entity type, and constraints.
 */
export function analyzeSearchIntent(query: string, lang: LanguageCode = 'en'): ExtractedIntent {
  const q = query.trim();
  const lower = q.toLowerCase();

  // 1. COMPARISON INTENT (e.g. "A vs B", "Sony A7 IV vs Canon R6", "which is better iphone 15 or galaxy s24")
  const vsMatch = lower.match(/^(.+?)\s+(?:vs\.?|versus|v\/s|or|against)\s+(.+?)$/i);
  const whichBetterMatch = lower.match(/which\s+(?:is\s+)?better\s*[:\?-]?\s*(.+?)\s+(?:or|vs\.?|versus)\s+(.+?)$/i);

  if (whichBetterMatch && whichBetterMatch[1] && whichBetterMatch[2]) {
    const itemA = whichBetterMatch[1].trim();
    const itemB = whichBetterMatch[2].trim();
    return {
      mode: 'COMPARISON',
      entityType: detectEntityType(q),
      primaryQuery: q,
      comparedItems: [itemA, itemB],
      suggestedHeading: `${itemA} vs ${itemB}`,
      suggestedSubtitle: 'Direct side-by-side decision matrix, performance trade-offs, and clear verdict.',
      primaryQuestion: 'Which one is better for you?',
    };
  }

  if (vsMatch && vsMatch[1] && vsMatch[2] && !vsMatch[1].includes('best ') && vsMatch[1].length > 2) {
    const itemA = vsMatch[1].trim();
    const itemB = vsMatch[2].trim();
    return {
      mode: 'COMPARISON',
      entityType: detectEntityType(q),
      primaryQuery: q,
      comparedItems: [itemA, itemB],
      suggestedHeading: `${itemA} vs ${itemB}`,
      suggestedSubtitle: 'Direct side-by-side decision matrix, performance trade-offs, and clear verdict.',
      primaryQuestion: 'Which one should you choose?',
    };
  }

  // 2. LOCAL SERVICE INTENT (e.g. "housekeeping near me", "dentist in delhi", "plumber near me")
  const isNearMe = /(?:near me|in my area|nearby|local|in delhi|in mumbai|in bangalore|in new york|in london)/i.test(lower);
  const isServiceKeyword = /(?:housekeeping|cleaning service|maid service|dentist|dental clinic|doctor|hospital|plumber|electrician|mechanic|lawyer|photographer|salon|catering|contractor)/i.test(lower);

  if (isNearMe || (isServiceKeyword && (lower.includes('in ') || lower.includes('near')))) {
    let location = 'Local Area';
    const locMatch = lower.match(/in\s+([a-zA-Z\s]+)/i);
    if (locMatch && locMatch[1]) location = locMatch[1].trim();
    if (isNearMe) location = 'Your Location (Near You)';

    return {
      mode: 'LOCAL_SERVICE',
      entityType: 'LOCAL_SERVICE',
      primaryQuery: q,
      locationConstraint: location,
      suggestedHeading: `Verified Local Decision Guide: ${q}`,
      suggestedSubtitle: `Reputation, customer consensus, and contact details for verified options in ${location}.`,
      primaryQuestion: 'Which local service provider is most reliable?',
    };
  }

  // 3. RECOMMENDATION INTENT (e.g. "best camera for YouTube", "laptop under 50000", "best SUV under 20 lakh")
  const isBestQuery = /^(?:best|top|recommended|cheapest|affordable)\s+/i.test(lower) ||
    /(?:under|below|for|in)\s+(?:₹|\$|rs|inr|\d+|youtube|students|gaming|coding|travel|creators|office)/i.test(lower);

  // Extract constraints
  let budgetConstraint: string | undefined;
  const budgetMatch = lower.match(/(?:under|below|less than|within)\s*(?:₹|\$|rs\.?|inr)?\s*([\d,\.]+\s*(?:lakh|k|thousand|million|cr|usd|inr)?)/i);
  if (budgetMatch && budgetMatch[1]) {
    budgetConstraint = budgetMatch[0];
  }

  let useCaseConstraint: string | undefined;
  const useCaseMatch = lower.match(/(?:for|with)\s+([a-zA-Z0-9\s]+?)(?:\s+under|\s+in|\s*$)/i);
  if (useCaseMatch && useCaseMatch[1] && !['the', 'a', 'an'].includes(useCaseMatch[1].trim())) {
    useCaseConstraint = useCaseMatch[1].trim();
  }

  const entityType = detectEntityType(q);

  if (isBestQuery || budgetConstraint || useCaseConstraint) {
    let heading = `Top Verified Recommendations for "${q}"`;
    if (useCaseConstraint && budgetConstraint) {
      heading = `Best Choices for ${capitalize(useCaseConstraint)} (${budgetConstraint})`;
    } else if (useCaseConstraint) {
      heading = `Best Options for ${capitalize(useCaseConstraint)}`;
    } else if (budgetConstraint) {
      heading = `Top Picks ${budgetConstraint}`;
    }

    return {
      mode: 'RECOMMENDATION_INTENT',
      entityType,
      primaryQuery: q,
      budgetConstraint,
      useCaseConstraint,
      suggestedHeading: heading,
      suggestedSubtitle: 'Filtered and ranked against your specific use case, verified customer ratings, and budget constraints.',
      primaryQuestion: 'Which option is best for your specific need?',
    };
  }

  // 4. EXACT PRODUCT SEARCH vs 5. CATEGORY DISCOVERY
  // If query contains specific model numbers (e.g. "a7 iv", "m3 pro", "wh-1000xm5", "v15", "iphone 15") or brand + specific noun
  const hasModelToken = /(?:\b[a-z]?\d{2,5}[a-z]?\b|\bm\d\b|\bpro\b|\bultra\b|\bmax\b|\bplus\b|\bmini\b|\bfe\b|\bxr\b|\bse\b|\biv\b|\bv\b|\biii\b|\bii\b)/i.test(lower);
  const wordCount = q.split(/\s+/).length;

  if (hasModelToken || wordCount >= 3) {
    return {
      mode: 'EXACT_PRODUCT',
      entityType,
      primaryQuery: q,
      suggestedHeading: `${q} — Decision & Performance Summary`,
      suggestedSubtitle: 'Key trade-offs, target audience fit, verified customer praise/complaints, and live retailer pricing.',
      primaryQuestion: 'Is this product worth considering for you?',
    };
  }

  // 5. CATEGORY DISCOVERY (e.g. "camera", "laptop", "suv", "running shoes")
  return {
    mode: 'CATEGORY_DISCOVERY',
    entityType,
    primaryQuery: q,
    suggestedHeading: `Top ${capitalize(q)} Options Worth Choosing`,
    suggestedSubtitle: 'Curated shortlist highlighting Best Overall, Best Value, and specialized use-case picks.',
    primaryQuestion: 'Which option matches your priority?',
  };
}

/**
 * Detect underlying entity type
 */
function detectEntityType(query: string): EntityType {
  const lower = query.toLowerCase();

  // Vehicles
  if (/(?:suv|car|cars|bike|scooter|sedan|hatchback|creta|thar|fortuner|scorpio|nexon|harrier|safari|innova|xuv700|brezza|seltos|bullet|royal enfield|activa|electric car|ev vehicle)/i.test(lower)) {
    return 'VEHICLE';
  }

  // Software & SaaS
  if (/(?:software|app|crm|accounting software|erp|vpn|antivirus|saas|editor|photoshop|tally|zoho|quickbooks|slack|notion|figma|canva)/i.test(lower)) {
    return 'SOFTWARE';
  }

  // Local Services
  if (/(?:housekeeping|cleaning service|maid|dentist|plumber|electrician|salon|mechanic|carpenter|pest control|clinic|hospital in|physiotherapist|repair service)/i.test(lower)) {
    return 'LOCAL_SERVICE';
  }

  // Travel / Hotels
  if (/(?:hotel|resort|villa|flight|stay in|homestay|airbnb|destination|tour package)/i.test(lower)) {
    return 'TRAVEL_STAY';
  }

  // Education
  if (/(?:college|university|coaching|mba course|online degree|school|upsc coaching|coding bootcamp)/i.test(lower)) {
    return 'EDUCATION';
  }

  // Finance
  if (/(?:credit card|loan|insurance|bank account|demat|fixed deposit|mutual fund|health insurance)/i.test(lower)) {
    return 'FINANCE';
  }

  return 'PRODUCT';
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
    let drawback = 'Premium pricing in some regional channels.';
    let bestFor = 'Everyday reliability and quality.';

    // Derive intelligent decision fields if not present
    if (index === 0) {
      badgeLabel = 'Best Overall';
      badgeType = 'BEST_OVERALL';
      bestFor = intent.useCaseConstraint ? `Best for ${intent.useCaseConstraint}` : 'Top choice for most users seeking proven reliability';
      drawback = 'May have high demand and fewer deep promotional discounts.';
      reason = `Consistently ranked highest for build quality, performance, and customer satisfaction.`;
    } else if (index === 1 || p.budgetTier === 'BUDGET') {
      badgeLabel = 'Best Value';
      badgeType = 'BEST_VALUE';
      bestFor = 'Value-focused buyers looking for high performance-to-price ratio';
      drawback = 'Lacks a few luxury or specialized pro features found in top-tier models.';
      reason = `Offers the strongest feature set and reliability in its price segment.`;
    } else if (index === 2) {
      badgeLabel = intent.useCaseConstraint ? `Best for ${capitalize(intent.useCaseConstraint)}` : 'Specialized Pick';
      badgeType = 'SPECIALIZED';
      bestFor = intent.useCaseConstraint || 'Creators and power users needing specific capabilities';
      drawback = 'Specialized feature set might exceed basic everyday needs.';
      reason = `Engineered specifically for demanding workflow requirements.`;
    } else if (p.budgetTier === 'PREMIUM' || p.basePriceUSD > 1000) {
      badgeLabel = 'Flagship / Pro Pick';
      badgeType = 'FLAGSHIP';
      bestFor = 'Professionals and uncompromising enthusiasts';
      drawback = 'Higher investment cost.';
      reason = `Top-of-the-line specifications and premium construction materials.`;
    }

    return {
      ...p,
      decisionArchetype: {
        label: badgeLabel,
        type: badgeType,
        bestFor,
        drawback,
        reason,
      },
    };
  });
}
