import { MarketCode } from '../types';
import { getMarketInfo } from '../localization/markets';

// Server-side / client-compatible affiliate tag fallback mapping
// Preserves exact tags configured in the environment:
const DEFAULT_AFFILIATE_TAGS: Record<MarketCode, string> = {
  IN: 'jaiguruji00-21',
  US: 'jaiguruji00-20',
  UK: 'jaiguruji0002-21',
  DE: 'jaiguruji0004-21',
  FR: 'jaiguruji0005-21',
  ES: 'jaiguruji0008-21',
  IT: 'jaiguruji0007-21',
  CA: 'jaiguruji000b-20',
  AU: 'jaiguruji000a-22',
  JP: 'jaiguruji00-22',
  BR: 'jaiguruji0009-20',
  MX: 'jaiguruji0006-20',
  NL: 'jaiguruji000c-21',
  SG: 'jaiguruji000e-22',
};

/**
 * Resolves the compliant affiliate link for a given query/entity in a target market.
 * Does NOT invent ASINs. If no real verified ASIN exists, generates an exact verified keyword search URL.
 */
export function buildAmazonMarketUrl(params: {
  query: string;
  market: MarketCode;
  asin?: string;
}): { url: string; domain: string; tag: string } {
  const marketInfo = getMarketInfo(params.market);
  const domain = marketInfo.amazonDomain;
  const tag = DEFAULT_AFFILIATE_TAGS[params.market] || 'jaiguruji00-20';

  if (params.asin && /^[A-Z0-9]{10}$/i.test(params.asin.trim())) {
    // Only construct direct ASIN link when legitimately verified
    const cleanAsin = params.asin.trim();
    return {
      url: `https://www.${domain}/dp/${cleanAsin}?tag=${encodeURIComponent(tag)}`,
      domain,
      tag,
    };
  }

  // Otherwise, construct clean search landing URL
  const encodedQuery = encodeURIComponent(params.query.trim());
  return {
    url: `https://www.${domain}/s?k=${encodedQuery}&tag=${encodeURIComponent(tag)}`,
    domain,
    tag,
  };
}

export const AFFILIATE_DISCLOSURE_TEXT =
  'ProductReviews.review participates in the Amazon Associates Program and other affiliate programs. When you click links and make a purchase, we may earn an affiliate commission at no extra cost to you. Our rankings and verdicts are strictly evidence-based and never influenced by merchant relationships.';
