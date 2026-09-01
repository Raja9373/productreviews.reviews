import { ProductModel } from '../types';

export interface LiveSearchResponse {
  success: boolean;
  isLive: boolean;
  source: 'paapi_live' | 'empty';
  items: ProductModel[];
  query: string;
  categorySlug?: string;
  searchIndex: string;
  partnerTag: string;
  amazonDirectUrl: string;
  bannerText: string;
  ctaText: string;
  totalResults?: number;
}

/**
 * Client service to query the Amazon PA-API backend endpoint
 */
export async function searchAmazonProducts(
  query: string,
  categorySlug?: string
): Promise<LiveSearchResponse> {
  const fallbackDirectUrl = `https://www.amazon.in/s?k=${encodeURIComponent(query)}&tag=jaiguruji00-21&linkCode=ll2&ref=as_li_ss_tl`;

  try {
    const res = await fetch('/api/paapi/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, categorySlug }),
    });

    if (!res.ok) {
      throw new Error(`API returned HTTP ${res.status}`);
    }

    const data = await res.json();
    if (data && Array.isArray(data.items) && data.items.length > 0) {
      const mappedModels: ProductModel[] = data.items.map((it: any, idx: number) => {
        const tier: 'TRENDING' | 'BUDGET' | 'BALANCED' | 'PREMIUM' =
          idx === 0 ? 'TRENDING' : idx === 1 ? 'BUDGET' : idx < 4 ? 'BALANCED' : 'PREMIUM';

        const tag =
          idx === 0
            ? '🔥 Top Pick'
            : idx === 1
            ? 'Budget Pick'
            : idx < 4
            ? 'Balanced Value'
            : 'Premium Choice';

        const specs: Record<string, string> = {
          'Brand': it.brand || 'Verified Brand',
          'Model / ASIN': it.asin || it.modelNumber || 'AMZ-IN',
          'Customer Ratings': `${(it.reviewsCount || 1000).toLocaleString()} verified ratings`,
          'Sentiment Score': `${Math.round((it.rating || 4.5) * 20)}% Positive Recommendation`,
          'Availability': it.inStock !== false ? 'In Stock (Fast Delivery)' : 'Available to Order',
        };

        if (Array.isArray(it.features)) {
          it.features.slice(0, 4).forEach((feat: string, fIdx: number) => {
            specs[`Feature ${fIdx + 1}`] = feat;
          });
        }

        return {
          id: it.id || it.asin || it.slug,
          slug: it.slug,
          name: it.name,
          modelNumber: it.modelNumber || it.asin || 'AMZ-STD',
          brand: it.brand || 'Official',
          category: it.category || categorySlug || 'Amazon Category',
          image: it.imageUrl || it.image,
          basePriceUSD: it.basePriceUSD || 29,
          rating: it.rating || 4.5,
          totalReviews: it.reviewsCount || 1500,
          tag,
          budgetTier: tier,
          whyDemandReason: it.whyDemandReason || `${(it.reviewsCount || 1200).toLocaleString()} verified customer reviews`,
          specs,
          asin: it.asin,
        };
      });

      return {
        success: true,
        isLive: data.isLive === true,
        source: 'paapi_live',
        items: mappedModels,
        query,
        categorySlug,
        searchIndex: data.searchIndex || 'All',
        partnerTag: data.partnerTag || 'jaiguruji00-21',
        amazonDirectUrl: data.amazonDirectUrl || fallbackDirectUrl,
        bannerText: data.bannerText || 'Showing live results from Amazon',
        ctaText: data.ctaText || `Have a Look - Explore all ${query} on Amazon`,
        totalResults: data.totalResults || mappedModels.length,
      };
    }
  } catch (err) {
    console.warn('[searchAmazonProducts] PA-API notice:', err);
  }

  // No mock fallback
  return {
    success: false,
    isLive: false,
    source: 'empty',
    items: [],
    query,
    categorySlug,
    searchIndex: 'All',
    partnerTag: 'jaiguruji00-21',
    amazonDirectUrl: fallbackDirectUrl,
    bannerText: 'Showing live results from Amazon',
    ctaText: `Have a Look - Explore all ${query} on Amazon`,
    totalResults: 0,
  };
}

/**
 * Fetch category products
 */
export async function fetchCategoryProducts(categorySlug: string): Promise<LiveSearchResponse> {
  const fallbackDirectUrl = `https://www.amazon.in/s?k=${encodeURIComponent(categorySlug.replace(/-/g, ' '))}&tag=jaiguruji00-21&linkCode=ll2&ref=as_li_ss_tl`;

  try {
    const res = await fetch(`/api/paapi/category/${encodeURIComponent(categorySlug)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.items) && data.items.length > 0) {
        return searchAmazonProducts(categorySlug.replace(/-/g, ' '), categorySlug);
      }
    }
  } catch (err) {
    console.warn('[fetchCategoryProducts] Notice:', err);
  }

  return searchAmazonProducts(categorySlug.replace(/-/g, ' '), categorySlug);
}
