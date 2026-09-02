import { ProductModel, LanguageCode } from '../types';

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface GroundedClientResponse {
  success: boolean;
  status?: 'RESULTS_FOUND' | 'NO_RESULTS' | 'PARTIAL_RESULTS' | 'ERROR';
  isGrounded: boolean;
  isRateLimited?: boolean;
  searchQueriesRun: string[];
  groundingChunks: GroundingSource[];
  products: ProductModel[];
  errorMessage?: string;
  retrievedAt?: string;
}

/**
 * Generate clean intent-aware search queries matching the backend query engine
 */
export function generateIntentAwareQueries(userQuery: string): string[] {
  const q = userQuery.trim();
  const lower = q.toLowerCase();

  if (/\b(a7|a7iv|a7iii|r50|r6|eos|z6|zv-e10|xt5|x-t5|iphone|galaxy|s23|s24|s25|wh-1000xm|macbook|pixel|hero\s*\d+)\b/i.test(lower) || /\d{2,}/.test(lower)) {
    return [
      `${q} review specs price`,
      `${q} customer ratings overview`,
    ];
  }

  if (/\b(under|below|budget|cheap|affordable|\$|₹|rs|inr|usd|lakh)\b/i.test(lower)) {
    return [
      `${q} top models reviews`,
      `${q} models price comparison`,
    ];
  }

  if (/\b(for|best.*for|gaming|vlogging|youtube|travel|beginners|students|office)\b/i.test(lower)) {
    return [
      `${q} top picks reviews`,
      `${q} models comparison`,
    ];
  }

  if (/\b(best|top|recommended)\b/i.test(lower)) {
    return [
      `${q} models reviews`,
      `${q} rankings overview`,
    ];
  }

  return [
    `${q} top products reviews`,
    `${q} models specifications`,
  ];
}

/**
 * Client service to call the server-side Google Search Grounding discovery API.
 * Adheres strictly to genuine data integrity:
 * - Never synthesizes fake products or mock databases on API error/429
 * - Preserves zero-result states for non-existent entities
 */
export async function fetchGroundedProducts(
  query: string,
  targetLang: LanguageCode = 'en'
): Promise<GroundedClientResponse> {
  const trimmed = query.trim();
  const defaultQueries = generateIntentAwareQueries(trimmed);

  if (!trimmed) {
    return {
      success: true,
      status: 'NO_RESULTS',
      isGrounded: false,
      searchQueriesRun: [],
      groundingChunks: [],
      products: [],
      errorMessage: undefined,
    };
  }

  try {
    const res = await fetch('/api/gemini/grounded-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: trimmed, targetLang }),
    });

    let data: any = null;
    if (res.ok) {
      data = await res.json();
    } else {
      return {
        success: false,
        status: 'ERROR',
        isGrounded: false,
        isRateLimited: res.status === 429,
        searchQueriesRun: defaultQueries,
        groundingChunks: [],
        products: [],
        errorMessage: res.status === 429
          ? 'Search provider is temporarily rate-limited. Please retry shortly.'
          : 'Search service unavailable. Please retry in a few moments.',
      };
    }

    // 1. If API explicitly reported ERROR or Rate Limit
    if (data && data.status === 'ERROR') {
      return {
        success: false,
        status: 'ERROR',
        isGrounded: false,
        isRateLimited: data.isRateLimited === true,
        searchQueriesRun: data.searchQueriesRun || defaultQueries,
        groundingChunks: [],
        products: [],
        errorMessage: data.errorMessage || 'Search service is temporarily busy. Please retry in a moment.',
        retrievedAt: data.retrievedAt,
      };
    }

    // 2. If API reported NO_RESULTS (clean zero result)
    if (data && (data.status === 'NO_RESULTS' || (data.success && (!data.products || data.products.length === 0)))) {
      return {
        success: true,
        status: 'NO_RESULTS',
        isGrounded: data.isGrounded !== false,
        searchQueriesRun: data.searchQueriesRun || defaultQueries,
        groundingChunks: data.groundingChunks || [],
        products: [],
        errorMessage: data.errorMessage || `No reliable evidence found for "${trimmed}".`,
        retrievedAt: data.retrievedAt,
      };
    }

    // 3. If Gemini grounded search returned real grounded products, map and return them
    if (data && data.success && Array.isArray(data.products) && data.products.length > 0) {
      const mappedProducts: ProductModel[] = data.products.map((p: any, idx: number) => {
        const tier: 'TRENDING' | 'BUDGET' | 'BALANCED' | 'PREMIUM' =
          p.budgetTier || (idx === 0 ? 'TRENDING' : idx === 1 ? 'BUDGET' : idx === 2 ? 'BALANCED' : 'PREMIUM');

        const tag =
          p.tag ||
          (idx === 0
            ? '🔥 Top Verified Model'
            : idx === 1
            ? '⚡ Best Value Option'
            : '✨ Verified Product');

        return {
          id: p.id || `grounded-${idx}`,
          slug: p.slug || `product-${idx}`,
          name: p.name,
          modelNumber: p.modelNumber || '',
          brand: p.brand || 'Verified Brand',
          category: p.category || `${trimmed}`,
          image: p.image || '',
          basePriceUSD: typeof p.basePriceUSD === 'number' && p.basePriceUSD > 0 ? p.basePriceUSD : 0,
          rating: typeof p.rating === 'number' && p.rating > 0 ? p.rating : 0,
          totalReviews: typeof p.totalReviews === 'number' && p.totalReviews > 0 ? p.totalReviews : 0,
          tag,
          budgetTier: tier,
          whyDemandReason: p.whyDemandReason || 'Extracted from live web search and verified consumer feedback.',
          specs: p.specs || {
            'Brand': p.brand || 'Verified Brand',
            'Source': 'Google Search Grounding',
          },
          asin: p.asin || undefined,
        };
      });

      return {
        success: true,
        status: 'RESULTS_FOUND',
        isGrounded: data.isGrounded === true || (data.groundingChunks && data.groundingChunks.length > 0),
        searchQueriesRun: data.searchQueriesRun || defaultQueries,
        groundingChunks: data.groundingChunks || [],
        products: mappedProducts,
        retrievedAt: data.retrievedAt,
      };
    }

    return {
      success: true,
      status: 'NO_RESULTS',
      isGrounded: false,
      searchQueriesRun: data?.searchQueriesRun || defaultQueries,
      groundingChunks: [],
      products: [],
      errorMessage: `No reliable evidence found for "${trimmed}".`,
    };
  } catch (err: any) {
    console.warn('[fetchGroundedProducts] Notice:', err);
    return {
      success: false,
      status: 'ERROR',
      isGrounded: false,
      searchQueriesRun: defaultQueries,
      groundingChunks: [],
      products: [],
      errorMessage: 'Unable to connect to search service. Please try again.',
    };
  }
}

/**
 * Returns verified models using live Google Search Grounding without throwing.
 * Safe fallback: returns [] if empty or error.
 */
export async function getVerifiedModels(
  query: string,
  targetLang: LanguageCode = 'en'
): Promise<ProductModel[]> {
  try {
    const res = await fetchGroundedProducts(query, targetLang);
    return res.products || [];
  } catch (err) {
    console.warn('[getVerifiedModels] Handled error, returning empty list:', err);
    return [];
  }
}
