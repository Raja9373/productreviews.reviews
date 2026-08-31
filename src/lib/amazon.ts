import { ProductModel } from '../types';
import { getMockResults } from '../data/mockProducts';
import { getAmazonUrl, detectCountry } from './amazonGlobal';

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
  items?: ProductModel[];
}

/**
 * Search Amazon products with instant fallback if PA-API keys are dummy/missing
 */
export async function searchAmazonProducts(query: string): Promise<AmazonSearchResponse> {
  const searchUrl = getAmazonSearchUrl(query);

  // Check if PA-API keys exist and are not dummy/placeholders
  const accessKey =
    (typeof process !== 'undefined' && process.env?.AMAZON_ACCESS_KEY) ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_AMAZON_ACCESS_KEY) ||
    '';

  const hasKeys =
    Boolean(accessKey) &&
    accessKey !== 'dummy' &&
    !accessKey.includes('dummy') &&
    !accessKey.includes('MY_AMAZON');

  if (!hasKeys) {
    return {
      fallback: true,
      searchUrl,
      message: 'Have a Look',
      items: getMockResults(query),
    };
  }

  // Else try PA-API backend
  try {
    const res = await fetch('/api/paapi/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) {
      return {
        fallback: true,
        searchUrl,
        message: 'Have a Look',
        items: getMockResults(query),
      };
    }

    const data = await res.json();
    return {
      fallback: !data.isLive,
      searchUrl: data.amazonDirectUrl || searchUrl,
      message: data.ctaText || 'Have a Look',
      items: data.items && data.items.length > 0 ? data.items : getMockResults(query),
    };
  } catch {
    return {
      fallback: true,
      searchUrl,
      message: 'Have a Look',
      items: getMockResults(query),
    };
  }
}
