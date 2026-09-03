import { MarketCode } from '../types';
import { getMarketInfo } from '../localization/markets';

/**
 * Resolves the compliant affiliate link for a given query/entity in a target market.
 * Uses secure server-side redirect to keep all AMAZON_TAG_* environment variables safe.
 * Never exposes environment variable values client-side.
 */
export function buildAmazonMarketUrl(params: {
  query: string;
  market: MarketCode;
  asin?: string;
}): { url: string; domain: string } {
  const marketInfo = getMarketInfo(params.market);
  const domain = marketInfo.amazonDomain;
  const searchParams = new URLSearchParams();
  searchParams.set('market', params.market);
  searchParams.set('q', params.query.trim());
  if (params.asin) {
    searchParams.set('asin', params.asin.trim());
  }

  return {
    url: `/api/affiliate/redirect?${searchParams.toString()}`,
    domain,
  };
}

export const AFFILIATE_DISCLOSURE_TEXT =
  'ProductReviews.review participates in the Amazon Associates Program and other affiliate programs. When you click links and make a purchase, we may earn an affiliate commission at no extra cost to you. Our rankings and verdicts are strictly evidence-based and never influenced by merchant relationships.';
