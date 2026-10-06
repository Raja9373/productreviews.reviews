/**
 * ProductReviews.review — Dynamic Entity Binding Layer
 * Connects Master Questions to extracted entities while strictly preserving model names,
 * generations, storage/RAM variants, and brand boundaries.
 */

import { ParsedQuery } from '../../types';

export interface QuestionEntityBinding {
  questionId: string;
  entityId?: string;
  entityName?: string;
  brand?: string;
  productCategory?: string;
  model?: string;
  generation?: string;
  variant?: string;
  sku?: string;
  entityConfidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';
  bindingStatus: 'BOUND' | 'AMBIGUOUS' | 'UNBOUND';
  ambiguityReason?: string;
  source: 'QUERY' | 'DISCOVERY' | 'CATALOG' | 'INFERENCE' | 'UNKNOWN';
}

interface KnownEntityPattern {
  name: string;
  brand: string;
  category: string;
  model: string;
  generation?: string;
  regex: RegExp;
}

// Curated high-fidelity entity patterns across major tech and consumer categories
const KNOWN_ENTITIES: KnownEntityPattern[] = [
  // Apple iPhone
  { name: 'iPhone 16 Pro Max', brand: 'Apple', category: 'smartphones', model: 'iPhone 16 Pro Max', generation: '16', regex: /\biphone\s*16\s*pro\s*max\b/i },
  { name: 'iPhone 16 Pro', brand: 'Apple', category: 'smartphones', model: 'iPhone 16 Pro', generation: '16', regex: /\biphone\s*16\s*pro\b/i },
  { name: 'iPhone 16 Plus', brand: 'Apple', category: 'smartphones', model: 'iPhone 16 Plus', generation: '16', regex: /\biphone\s*16\s*plus\b/i },
  { name: 'iPhone 16', brand: 'Apple', category: 'smartphones', model: 'iPhone 16', generation: '16', regex: /\biphone\s*16\b/i },
  { name: 'iPhone 15 Pro Max', brand: 'Apple', category: 'smartphones', model: 'iPhone 15 Pro Max', generation: '15', regex: /\biphone\s*15\s*pro\s*max\b/i },
  { name: 'iPhone 15 Pro', brand: 'Apple', category: 'smartphones', model: 'iPhone 15 Pro', generation: '15', regex: /\biphone\s*15\s*pro\b/i },
  { name: 'iPhone 15', brand: 'Apple', category: 'smartphones', model: 'iPhone 15', generation: '15', regex: /\biphone\s*15\b/i },
  
  // Apple MacBook
  { name: 'MacBook Air M4', brand: 'Apple', category: 'laptops', model: 'MacBook Air M4', generation: 'M4', regex: /\b(?:macbook\s*air\s*m4|macbook\s*m4\s*air|m4\s*macbook\s*air)\b/i },
  { name: 'MacBook Air M3', brand: 'Apple', category: 'laptops', model: 'MacBook Air M3', generation: 'M3', regex: /\b(?:macbook\s*air\s*m3|macbook\s*m3\s*air|m3\s*macbook\s*air)\b/i },
  { name: 'MacBook Pro M4 Pro', brand: 'Apple', category: 'laptops', model: 'MacBook Pro M4 Pro', generation: 'M4', regex: /\b(?:macbook\s*pro\s*m4\s*pro|m4\s*pro\s*macbook\s*pro)\b/i },
  { name: 'MacBook Pro M3 Pro', brand: 'Apple', category: 'laptops', model: 'MacBook Pro M3 Pro', generation: 'M3', regex: /\b(?:macbook\s*pro\s*m3\s*pro|m3\s*pro\s*macbook\s*pro)\b/i },
  { name: 'MacBook Pro M4', brand: 'Apple', category: 'laptops', model: 'MacBook Pro M4', generation: 'M4', regex: /\b(?:macbook\s*pro\s*m4|m4\s*macbook\s*pro)\b/i },
  { name: 'MacBook Pro M3', brand: 'Apple', category: 'laptops', model: 'MacBook Pro M3', generation: 'M3', regex: /\b(?:macbook\s*pro\s*m3|m3\s*macbook\s*pro)\b/i },

  // Samsung Galaxy
  { name: 'Samsung Galaxy S25 Ultra', brand: 'Samsung', category: 'smartphones', model: 'Galaxy S25 Ultra', generation: 'S25', regex: /\b(?:samsung\s*)?galaxy\s*s25\s*ultra\b/i },
  { name: 'Samsung Galaxy S25+', brand: 'Samsung', category: 'smartphones', model: 'Galaxy S25+', generation: 'S25', regex: /\b(?:samsung\s*)?galaxy\s*s25\s*(?:\+|plus)\b/i },
  { name: 'Samsung Galaxy S25', brand: 'Samsung', category: 'smartphones', model: 'Galaxy S25', generation: 'S25', regex: /\b(?:samsung\s*)?galaxy\s*s25\b/i },
  { name: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', category: 'smartphones', model: 'Galaxy S24 Ultra', generation: 'S24', regex: /\b(?:samsung\s*)?galaxy\s*s24\s*ultra\b/i },
  { name: 'Samsung Galaxy S24+', brand: 'Samsung', category: 'smartphones', model: 'Galaxy S24+', generation: 'S24', regex: /\b(?:samsung\s*)?galaxy\s*s24\s*(?:\+|plus)\b/i },
  { name: 'Samsung Galaxy S24', brand: 'Samsung', category: 'smartphones', model: 'Galaxy S24', generation: 'S24', regex: /\b(?:samsung\s*)?galaxy\s*s24\b/i },

  // Google Pixel
  { name: 'Google Pixel 9 Pro XL', brand: 'Google', category: 'smartphones', model: 'Pixel 9 Pro XL', generation: '9', regex: /\b(?:google\s*)?pixel\s*9\s*pro\s*xl\b/i },
  { name: 'Google Pixel 9 Pro Fold', brand: 'Google', category: 'smartphones', model: 'Pixel 9 Pro Fold', generation: '9', regex: /\b(?:google\s*)?pixel\s*9\s*pro\s*fold\b/i },
  { name: 'Google Pixel 9 Pro', brand: 'Google', category: 'smartphones', model: 'Pixel 9 Pro', generation: '9', regex: /\b(?:google\s*)?pixel\s*9\s*pro\b/i },
  { name: 'Google Pixel 9', brand: 'Google', category: 'smartphones', model: 'Pixel 9', generation: '9', regex: /\b(?:google\s*)?pixel\s*9\b/i },

  // Audio / Headphones / Earbuds
  { name: 'Sony WH-1000XM5', brand: 'Sony', category: 'headphones', model: 'WH-1000XM5', generation: 'Mark 5', regex: /\b(?:sony\s*)?wh-?1000xm5\b/i },
  { name: 'Sony WH-1000XM4', brand: 'Sony', category: 'headphones', model: 'WH-1000XM4', generation: 'Mark 4', regex: /\b(?:sony\s*)?wh-?1000xm4\b/i },
  { name: 'Sony WF-1000XM5', brand: 'Sony', category: 'earbuds', model: 'WF-1000XM5', generation: 'Mark 5', regex: /\b(?:sony\s*)?wf-?1000xm5\b/i },
  { name: 'Bose QuietComfort Ultra Headphones', brand: 'Bose', category: 'headphones', model: 'QC Ultra', generation: 'Ultra', regex: /\b(?:bose\s*)?(?:quietcomfort\s*ultra|qc\s*ultra)\s*(?:headphones)?\b/i },
  { name: 'AirPods Pro 2', brand: 'Apple', category: 'earbuds', model: 'AirPods Pro 2', generation: 'Gen 2', regex: /\b(?:airpods\s*pro\s*2|airpods\s*pro\s*second\s*gen(?:eration)?)\b/i },

  // Cameras
  { name: 'Sony A7 IV', brand: 'Sony', category: 'cameras', model: 'Alpha 7 IV', generation: 'Mark IV', regex: /\b(?:sony\s*)?(?:a7\s*iv|a7m4|a74|alpha\s*7\s*iv)\b/i },
  { name: 'Canon EOS R6 Mark II', brand: 'Canon', category: 'cameras', model: 'EOS R6 Mark II', generation: 'Mark II', regex: /\b(?:canon\s*)?(?:eos\s*)?r6\s*mark\s*ii\b/i },

  // TVs
  { name: 'LG C3 OLED', brand: 'LG', category: 'tvs', model: 'C3 OLED', generation: 'C3', regex: /\b(?:lg\s*)?c3\s*(?:oled)?\b/i },
  { name: 'LG C4 OLED', brand: 'LG', category: 'tvs', model: 'C4 OLED', generation: 'C4', regex: /\b(?:lg\s*)?c4\s*(?:oled)?\b/i },
  { name: 'Samsung S90C OLED', brand: 'Samsung', category: 'tvs', model: 'S90C OLED', generation: 'S90C', regex: /\b(?:samsung\s*)?s90c\s*(?:oled)?\b/i },

  // Gaming
  { name: 'PlayStation 5 Pro', brand: 'Sony', category: 'gaming-consoles', model: 'PS5 Pro', generation: 'Pro', regex: /\b(?:playstation\s*5\s*pro|ps5\s*pro)\b/i },
  { name: 'PlayStation 5', brand: 'Sony', category: 'gaming-consoles', model: 'PS5', generation: 'Base', regex: /\b(?:playstation\s*5|ps5)\b/i },
  { name: 'Xbox Series X', brand: 'Microsoft', category: 'gaming-consoles', model: 'Series X', generation: 'Series', regex: /\bxbox\s*series\s*x\b/i },
  { name: 'Steam Deck OLED', brand: 'Valve', category: 'gaming-consoles', model: 'Steam Deck OLED', generation: 'OLED', regex: /\bsteam\s*deck\s*oled\b/i }
];

// Patterns that indicate ambiguity (broad family names spanning multiple distinct products)
const AMBIGUOUS_TERMS: Record<string, string> = {
  galaxy: 'Galaxy matches multiple distinct Samsung product lines: phones (S/A/Z series), tablets (Tab S), smartwatches (Watch), and earbuds (Buds).',
  iphone: 'iPhone matches multiple distinct generations (iPhone 16, 15, 14, SE) and tiers (Base, Plus, Pro, Pro Max).',
  pixel: 'Pixel matches multiple distinct Google product lines: phones (Pixel 9/8), watches (Pixel Watch), and tablets (Pixel Tablet).',
  macbook: 'MacBook matches multiple lines (Air vs Pro) and silicon generations (M1, M2, M3, M4).',
  playstation: 'PlayStation matches PS5, PS5 Pro, PS5 Slim, PS4, and PlayStation Portal handheld.',
  xbox: 'Xbox matches Xbox Series X, Xbox Series S, and Xbox One generations.',
  bose: 'Bose matches headphones (QC Ultra), earbuds (QC Earbuds), speakers (SoundLink), and soundbars.',
  sony: 'Sony is a multi-category brand spanning TVs (Bravia), cameras (Alpha), audio (WH/WF series), and consoles (PlayStation).'
};

// Storage and RAM variant extraction regex
const VARIANT_REGEX = /\b(\d+(?:gb|tb))\b/gi;

/**
 * Extracts storage or RAM variants (e.g. "256GB", "512GB", "1TB", "16GB RAM")
 */
export function extractVariant(query: string): string | undefined {
  const matches = query.match(VARIANT_REGEX);
  if (matches && matches.length > 0) {
    return matches.join(' / ').toUpperCase();
  }
  return undefined;
}

/**
 * Deterministically binds an entity to a Master Question from user input and parsed query
 */
export function bindEntityToMasterQuestion(
  questionId: string,
  query: string,
  parsedQuery?: ParsedQuery,
  forcedCategory?: string
): QuestionEntityBinding {
  const cleanQ = (query || '').trim().toLowerCase();
  const variant = extractVariant(cleanQ);

  // 1. Check for Exact Match from Known High-Fidelity Catalog
  for (const item of KNOWN_ENTITIES) {
    if (item.regex.test(cleanQ)) {
      return {
        questionId,
        entityId: `ENT-${item.brand.toUpperCase()}-${item.model.replace(/\s+/g, '-').toUpperCase()}`,
        entityName: item.name,
        brand: item.brand,
        productCategory: item.category,
        model: item.model,
        generation: item.generation,
        variant,
        entityConfidence: 'HIGH',
        bindingStatus: 'BOUND',
        source: 'QUERY'
      };
    }
  }

  // 2. Check for Ambiguous Single Brand / Family Queries (e.g. "Is Galaxy worth buying?")
  for (const [term, reason] of Object.entries(AMBIGUOUS_TERMS)) {
    const termRegex = new RegExp(`\\b${term}\\b`, 'i');
    if (termRegex.test(cleanQ)) {
      // Check if a specific model was already matched; if not, mark as AMBIGUOUS
      return {
        questionId,
        brand: term.charAt(0).toUpperCase() + term.slice(1),
        entityConfidence: 'LOW',
        bindingStatus: 'AMBIGUOUS',
        ambiguityReason: reason,
        source: 'QUERY'
      };
    }
  }

  // 3. Fallback to ParsedQuery Constraints if present
  if (parsedQuery?.constraints?.brand || parsedQuery?.constraints?.productType) {
    const brand = parsedQuery.constraints.brand;
    const prodType = parsedQuery.constraints.productType;
    return {
      questionId,
      brand,
      productCategory: forcedCategory || prodType,
      entityName: brand && prodType ? `${brand} ${prodType}` : brand || prodType,
      entityConfidence: 'MEDIUM',
      bindingStatus: 'BOUND',
      variant,
      source: 'DISCOVERY'
    };
  }

  // 4. Pure Category / Generic Intent (e.g. "best phone", "best laptop") -> UNBOUND
  return {
    questionId,
    productCategory: forcedCategory,
    variant,
    entityConfidence: 'UNKNOWN',
    bindingStatus: 'UNBOUND',
    source: 'QUERY'
  };
}

/**
 * Extracts and binds comparison entities for pairwise A vs B queries
 */
export function bindComparisonEntities(
  questionId: string,
  query: string,
  parsedQuery?: ParsedQuery
): {
  entityA: QuestionEntityBinding;
  entityB: QuestionEntityBinding;
  isComparison: boolean;
} {
  const cleanQ = (query || '').trim();
  const vsMatch = cleanQ.split(/\s+(?:vs\.?|versus|compared to)(?:\s+|$)/i);

  if (vsMatch.length >= 2 || /\b(?:vs\.?|versus|compared to)\b/i.test(cleanQ)) {
    const partA = vsMatch[0].replace(/^(?:compare|which is better|is)\s+/i, '').trim();
    const partB = (vsMatch[1] || '').replace(/\s+(?:for|in|under|better|worth it).*$/i, '').trim();

    const entityA = bindEntityToMasterQuestion(`${questionId}-A`, partA, parsedQuery);
    const entityB = partB ? bindEntityToMasterQuestion(`${questionId}-B`, partB, parsedQuery) : {
      questionId: `${questionId}-B`,
      entityName: undefined,
      brand: undefined,
      bindingStatus: 'UNBOUND' as const,
      entityConfidence: 'LOW' as const,
      source: 'QUERY' as const
    };

    return {
      entityA,
      entityB,
      isComparison: true
    };
  }

  // Fallback to comparisonEntities in ParsedQuery constraints if available
  if (parsedQuery?.constraints?.comparisonEntities && parsedQuery.constraints.comparisonEntities.length >= 2) {
    const [nameA, nameB] = parsedQuery.constraints.comparisonEntities;
    return {
      entityA: bindEntityToMasterQuestion(`${questionId}-A`, nameA, parsedQuery),
      entityB: bindEntityToMasterQuestion(`${questionId}-B`, nameB, parsedQuery),
      isComparison: true
    };
  }

  const defaultUnbound = bindEntityToMasterQuestion(questionId, query, parsedQuery);
  return {
    entityA: defaultUnbound,
    entityB: defaultUnbound,
    isComparison: false
  };
}
