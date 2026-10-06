/**
 * ProductReviews.review — Question Intelligence Normalizer
 * Provides deterministic normalization for duplicate detection and semantic matching.
 */

/**
 * Normalizes question strings for deduplication and indexing.
 * Preserves use cases, constraints, and product entities while standardizing formatting.
 */
export function normalizeMasterQuestion(question: string): string {
  if (!question || typeof question !== 'string') return '';

  return question
    .toLowerCase()
    .trim()
    // Standardize comparison tokens
    .replace(/\bversus\b/gi, 'vs')
    .replace(/\bvs\.\b/gi, 'vs')
    .replace(/\bv\/s\b/gi, 'vs')
    .replace(/\bcompared to\b/gi, 'vs')
    // Standardize contractions
    .replace(/what's/gi, 'what is')
    .replace(/how's/gi, 'how is')
    .replace(/there's/gi, 'there is')
    .replace(/it's/gi, 'it is')
    .replace(/don't/gi, 'do not')
    .replace(/doesn't/gi, 'does not')
    .replace(/isn't/gi, 'is not')
    .replace(/aren't/gi, 'are not')
    .replace(/won't/gi, 'will not')
    .replace(/can't/gi, 'cannot')
    .replace(/shouldn't/gi, 'should not')
    // Standardize common question framing
    .replace(/\bwhich one is better\b/gi, 'which is better')
    .replace(/\bwhich is a better\b/gi, 'which is better')
    .replace(/\bis it a good idea to buy\b/gi, 'should i buy')
    .replace(/\bis it worth buying\b/gi, 'is it worth it')
    .replace(/\bis it worth the money\b/gi, 'is it worth it')
    .replace(/\bis it worth the price\b/gi, 'is it worth it')
    .replace(/\bwhat are the alternatives to\b/gi, 'alternatives to')
    .replace(/\bwhat are the best alternatives to\b/gi, 'alternatives to')
    // Remove extraneous punctuation but keep hyphens in model names and slash in options
    .replace(/[?!,.:;""''`~*()[\]{}]/g, ' ')
    // Collapse multiple whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Generates a deterministic hash / deduplication key
 */
export function getDeduplicationKey(
  normalizedQuestion: string,
  category?: string,
  useCase?: string
): string {
  const normQ = normalizedQuestion.toLowerCase().trim();
  const cat = (category || 'global').toLowerCase().trim();
  const uc = (useCase || 'general').toLowerCase().trim();
  return `${cat}::${uc}::${normQ}`;
}

/**
 * Extracts key semantic tokens from a query to match against master questions
 */
export function extractIntentTokens(query: string): string[] {
  const norm = normalizeMasterQuestion(query);
  return norm
    .split(' ')
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of',
  'with', 'by', 'from', 'about', 'into', 'through', 'during', 'before', 'after',
  'above', 'below', 'under', 'down', 'up', 'out', 'off', 'over', 'under', 'again',
  'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all',
  'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no',
  'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very'
]);
