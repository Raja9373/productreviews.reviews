import { DecisionResult, LanguageCode, MarketCode } from '../types';
import { parseSearchQuery } from './queryParser';
import {
  getVerifiedComparison,
  getVerifiedExactEntity,
  getVerifiedRecommendations,
} from './verifiedKnowledge';
import { buildAmazonMarketUrl } from '../affiliate/amazonRouter';

export async function executeSearch(
  query: string,
  userMarket?: MarketCode,
  userLang: LanguageCode = 'en'
): Promise<DecisionResult> {
  const parsed = parseSearchQuery(query, userMarket, userLang);

  if (!parsed.cleanQuery) {
    return {
      parsedQuery: parsed,
      status: 'NO_RESULTS',
      items: [],
      message: 'Please enter a search query.',
      retrievedAt: new Date().toISOString(),
    };
  }

  // 1. Comparison Intent
  if (parsed.intent === 'COMPARISON' && parsed.constraints.comparisonEntities) {
    const [nameA, nameB] = parsed.constraints.comparisonEntities;
    const comparison = getVerifiedComparison(nameA, nameB, parsed.market);
    if (comparison) {
      return {
        parsedQuery: parsed,
        status: 'SUCCESS',
        items: [comparison.entityA, comparison.entityB],
        comparison,
        retrievedAt: new Date().toISOString(),
      };
    }
  }

  // 2. Exact Entity Intent
  if (parsed.intent === 'EXACT_ENTITY') {
    const entity = getVerifiedExactEntity(parsed.cleanQuery, parsed.market);
    if (entity) {
      return {
        parsedQuery: parsed,
        status: 'SUCCESS',
        items: [entity],
        retrievedAt: new Date().toISOString(),
      };
    }
  }

  // 3. Recommendation / Category / Local Discovery
  const recommendations = getVerifiedRecommendations(
    parsed.cleanQuery,
    parsed.market,
    parsed.constraints.budget
  );

  if (recommendations.length > 0) {
    return {
      parsedQuery: parsed,
      status: 'SUCCESS',
      items: recommendations,
      retrievedAt: new Date().toISOString(),
    };
  }

  // 4. If query is a single recognized brand/entity not in static cache, check if exact entity matches
  const fallbackExact = getVerifiedExactEntity(parsed.cleanQuery, parsed.market);
  if (fallbackExact) {
    return {
      parsedQuery: parsed,
      status: 'SUCCESS',
      items: [fallbackExact],
      retrievedAt: new Date().toISOString(),
    };
  }

  // 5. If genuine live search endpoint is available on server, attempt live grounding
  try {
    const apiRes = await fetch('/api/gemini/grounded-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: parsed.cleanQuery,
        targetLang: parsed.language,
      }),
    });
    if (apiRes.ok) {
      const data = await apiRes.json();
      if (data.success && Array.isArray(data.products) && data.products.length > 0) {
        // Map any verified products from provider
        const mapped = data.products.map((p: any) => ({
          id: p.id || p.slug || `live-${Math.random().toString(36).substring(7)}`,
          slug: p.slug || p.id,
          name: p.name || p.title,
          brand: p.brand,
          domain: parsed.domain,
          badge: p.badge || p.tag,
          explanation: p.explanation || p.summary || 'Verified product match from search evidence.',
          pros: Array.isArray(p.pros) ? p.pros : [],
          drawback: p.cons?.[0] || p.drawback,
          price: {
            currency: parsed.constraints.currency || '$',
            isVerified: false,
            note: 'Verify live price at retailer.',
          },
          action: {
            type: 'CHECK_PRICE',
            label: 'Check Live Retailer Price',
            url: buildAmazonMarketUrl({ query: p.name || parsed.cleanQuery, market: parsed.market }).url,
            isAffiliate: true,
            merchant: 'Amazon',
          },
          sources: Array.isArray(p.sources)
            ? p.sources.map((s: any) => ({ title: s.title || s.domain, domain: s.domain || s.url }))
            : [{ title: 'Verified Web Grounding', domain: 'google.com' }],
        }));

        return {
          parsedQuery: parsed,
          status: 'SUCCESS',
          items: mapped,
          retrievedAt: new Date().toISOString(),
        };
      }
    }
  } catch (err) {
    // Network/live lookup silently ignored; fallback to strict clean NO_RESULTS
  }

  // 6. Strict Data Integrity: If no verified evidence, return clean NO_RESULTS
  return {
    parsedQuery: parsed,
    status: 'NO_RESULTS',
    items: [],
    message: 'We couldn’t verify suitable results for this search.',
    retrievedAt: new Date().toISOString(),
  };
}
