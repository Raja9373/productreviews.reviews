import { ProductModel, LanguageCode } from '../types';
import { fetchGroundedProducts, getVerifiedModels } from './groundedSearchClient';
import { searchAmazonProducts, LiveSearchResponse } from './paapiClient';

export { getVerifiedModels, fetchGroundedProducts, searchAmazonProducts };

/**
 * Unified product listing client that merges Google Search Grounding with Amazon live data.
 * Always returns ProductModel[] and NEVER throws on empty or missing keys.
 */
export async function getUnifiedProductList(
  query: string,
  categorySlug?: string,
  targetLang: LanguageCode = 'en'
): Promise<{
  products: ProductModel[];
  isGrounded: boolean;
  source: string;
  groundingSources?: Array<{ title: string; uri: string }>;
}> {
  try {
    // 1. Try Google Search Grounded Discovery first
    const grounded = await fetchGroundedProducts(query, targetLang);
    if (grounded && grounded.success && grounded.products.length > 0) {
      return {
        products: grounded.products,
        isGrounded: grounded.isGrounded,
        source: 'google_search_grounding',
        groundingSources: grounded.groundingChunks,
      };
    }

    // 2. Try PA-API / Amazon client
    const amz = await searchAmazonProducts(query, categorySlug);
    if (amz && amz.items && amz.items.length > 0) {
      return {
        products: amz.items,
        isGrounded: false,
        source: 'amazon_direct',
      };
    }

    return {
      products: [],
      isGrounded: false,
      source: 'empty',
    };
  } catch (err) {
    console.warn('[getUnifiedProductList] Error handled gracefully:', err);
    return {
      products: [],
      isGrounded: false,
      source: 'error_fallback',
    };
  }
}
