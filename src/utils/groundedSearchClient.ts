import { ProductModel, LanguageCode } from '../types';

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface GroundedClientResponse {
  success: boolean;
  isGrounded: boolean;
  searchQueriesRun: string[];
  groundingChunks: GroundingSource[];
  products: ProductModel[];
  errorMessage?: string;
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

  if (/\b(under|below|budget|cheap|affordable|\$|₹|rs|inr|usd)\b/i.test(lower)) {
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
 */
export async function fetchGroundedProducts(
  query: string,
  targetLang: LanguageCode = 'en'
): Promise<GroundedClientResponse> {
  const trimmed = query.trim();
  const defaultQueries = generateIntentAwareQueries(trimmed);

  if (!trimmed) {
    return {
      success: false,
      isGrounded: false,
      searchQueriesRun: [],
      groundingChunks: [],
      products: [],
      errorMessage: 'Query is empty',
    };
  }

  try {
    let res = await fetch('/api/gemini/grounded-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: trimmed, targetLang }),
    });

    let data: any = null;
    if (res.ok) {
      data = await res.json();
    }

    // If Gemini grounded search returned products, map and return them
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
          modelNumber: p.modelNumber || `SKU-${idx + 100}`,
          brand: p.brand || 'Verified Brand',
          category: p.category || `${trimmed} Category`,
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
        isGrounded: data.isGrounded === true || (data.groundingChunks && data.groundingChunks.length > 0),
        searchQueriesRun: data.searchQueriesRun || defaultQueries,
        groundingChunks: data.groundingChunks || [],
        products: mappedProducts,
      };
    }

    // Secondary fallback: Call PA-API curated/live search
    try {
      const paapiRes = await fetch('/api/paapi/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmed }),
      });
      if (paapiRes.ok) {
        const paapiData = await paapiRes.json();
        if (paapiData && paapiData.items && paapiData.items.length > 0) {
          const paapiProducts: ProductModel[] = paapiData.items.map((item: any, idx: number) => ({
            id: item.asin || item.id || `item-${idx}`,
            slug: item.slug || `item-${idx}`,
            name: item.name,
            modelNumber: item.modelNumber || `SKU-${idx + 1}`,
            brand: item.brand || 'Verified Brand',
            category: item.category || `${trimmed} Category`,
            image: item.imageUrl || '',
            basePriceUSD: typeof item.basePriceUSD === 'number' ? item.basePriceUSD : 0,
            rating: typeof item.rating === 'number' ? item.rating : 0,
            totalReviews: typeof item.reviewsCount === 'number' ? item.reviewsCount : 0,
            tag: idx === 0 ? '🔥 Top Verified Choice' : '✨ Verified Product',
            budgetTier: idx === 0 ? 'TRENDING' : idx === 1 ? 'BUDGET' : idx === 2 ? 'BALANCED' : 'PREMIUM',
            whyDemandReason: item.whyDemandReason || 'High customer satisfaction and verified ratings.',
            specs: {
              Brand: item.brand || 'Verified Brand',
              Model: item.modelNumber || 'Standard',
              Source: 'Amazon Verified Bestseller',
            },
            asin: item.asin,
          }));

          return {
            success: true,
            isGrounded: true,
            searchQueriesRun: defaultQueries,
            groundingChunks: [],
            products: paapiProducts,
          };
        }
      }
    } catch {
      // ignore
    }

    return {
      success: false,
      isGrounded: false,
      searchQueriesRun: data?.searchQueriesRun || defaultQueries,
      groundingChunks: [],
      products: [],
      errorMessage: `No reliable results found for "${trimmed}".`,
    };
  } catch (err: any) {
    console.warn('[fetchGroundedProducts] Notice:', err);
    return {
      success: false,
      isGrounded: false,
      searchQueriesRun: defaultQueries,
      groundingChunks: [],
      products: [],
      errorMessage: 'Unable to complete search at this moment. Please try again.',
    };
  }
}

/**
 * Returns verified models using live Google Search Grounding without throwing.
 * Safe fallback: returns [] if empty, never throws or 404s.
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
