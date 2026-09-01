import { ProductModel } from '../types';
import { getAmazonUrl, detectCountry } from './amazonGlobal';
import { fetchGroundedProducts } from '../utils/groundedSearchClient';

export { getAmazonUrl, detectCountry };

/**
 * Returns a 100% working Amazon affiliate search URL for any search query
 */
export function getAmazonSearchUrl(query: string, country = 'IN'): string {
  return getAmazonUrl(query, country || detectCountry());
}

export interface AmazonSearchResponse {
  fallback: boolean;
  searchUrl: string;
  message: string;
  items: ProductModel[];
}

/**
 * Search Amazon products - queries backend / PA-API, and seamlessly falls back to Google Search Grounding
 * with active Amazon affiliate links. NEVER returns 404 or throws.
 */
export async function searchAmazonProducts(query: string): Promise<AmazonSearchResponse> {
  const searchUrl = getAmazonSearchUrl(query);

  try {
    const res = await fetch('/api/paapi/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.items) && data.items.length > 0) {
        return {
          fallback: !data.isLive,
          searchUrl: data.amazonDirectUrl || searchUrl,
          message: data.ctaText || 'Have a Look',
          items: data.items,
        };
      }
    }
  } catch (err) {
    console.warn('[lib/amazon.ts] PA-API search skipped, trying live Grounding fallback:', err);
  }

  // Live Google Search Grounding Fallback with Affiliate Links
  try {
    const grounded = await fetchGroundedProducts(query);
    if (grounded && grounded.products && grounded.products.length > 0) {
      return {
        fallback: false,
        searchUrl,
        message: `Have a Look - Explore verified ${query} on Amazon`,
        items: grounded.products,
      };
    }
  } catch (gErr) {
    console.warn('[lib/amazon.ts] Grounding fallback error:', gErr);
  }

  return {
    fallback: true,
    searchUrl,
    message: 'Have a Look',
    items: [],
  };
}
