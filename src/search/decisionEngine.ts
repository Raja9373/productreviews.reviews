import { DecisionResult, LanguageCode, MarketCode } from '../types';
import { parseSearchQuery } from './queryParser';
import { sourceRouter } from '../sources/sourceRouter';
import { EvidenceRankingEngine } from '../sources/ranking';
import { EvidenceComparisonEngine } from '../sources/comparisonEngine';

export interface SearchOptions {
  bypassCache?: boolean;
  timeoutMs?: number;
  disableExternalDiscovery?: boolean;
}

export async function executeSearch(
  query: string,
  userMarket?: MarketCode,
  userLang: LanguageCode = 'en',
  options?: SearchOptions
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

  // Absolute Test & Emergency Mode: If external discovery is explicitly disabled
  if (options?.disableExternalDiscovery || (typeof window !== 'undefined' && (window as any).__DISABLE_EXTERNAL_DISCOVERY__)) {
    return {
      parsedQuery: parsed,
      status: 'NO_RESULTS',
      items: [],
      message: 'We couldn’t find enough reliable current information for this search.',
      retrievedAt: new Date().toISOString(),
    };
  }

  // 1. Comparison Intent (e.g. "iPhone vs Samsung", "Sony A7 IV vs Canon R6")
  if (parsed.intent === 'COMPARISON' && parsed.constraints.comparisonEntities) {
    const [nameA, nameB] = parsed.constraints.comparisonEntities;
    const comparison = await EvidenceComparisonEngine.compare(
      nameA,
      nameB,
      parsed.market,
      parsed.language
    );

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

  // 2. Standard and Category Discovery via Source Adapters
  try {
    const discoveredEntities = await sourceRouter.discoverEntities(
      parsed.cleanQuery,
      parsed.domain,
      parsed.market,
      parsed.language,
      {
        bypassCache: options?.bypassCache,
        timeoutMs: options?.timeoutMs || 3500,
        budget: parsed.constraints.budget,
      }
    );

    if (discoveredEntities.length > 0) {
      // Rank and map to EntityItem
      const rankedItems = EvidenceRankingEngine.rankAndMapToEntityItems(
        discoveredEntities,
        parsed
      );

      // If a budget constraint was specified (e.g. under ₹50,000 / under ₹30,000)
      // and items have verified prices exceeding the budget, filter them conservatively.
      // If none match or no price is verified for a strict budget query, acknowledge insufficiency.
      if (parsed.constraints.budget) {
        const verifiedMatchingBudget = rankedItems.filter((item) => {
          if (!item.price.isVerified || !item.price.amount) {
            return false; // Price not verified
          }
          return item.price.amount <= parsed.constraints.budget!;
        });

        if (verifiedMatchingBudget.length > 0) {
          return {
            parsedQuery: parsed,
            status: 'SUCCESS',
            items: verifiedMatchingBudget,
            retrievedAt: new Date().toISOString(),
          };
        } else {
          // No current verified prices within budget from permitted sources
          return {
            parsedQuery: parsed,
            status: 'NO_RESULTS',
            items: [],
            message: `We couldn’t find enough reliable current information for this search under ${parsed.constraints.currency || ''}${parsed.constraints.budget.toLocaleString()}.`,
            retrievedAt: new Date().toISOString(),
          };
        }
      }

      if (rankedItems.length > 0) {
        return {
          parsedQuery: parsed,
          status: 'SUCCESS',
          items: rankedItems,
          retrievedAt: new Date().toISOString(),
        };
      }
    }
  } catch (err) {
    console.warn('[Decision Engine] Handled source discovery notice:', err);
  }

  // 3. Strict Data Integrity: If external discovery found no reliable evidence
  return {
    parsedQuery: parsed,
    status: 'NO_RESULTS',
    items: [],
    message: 'We couldn’t find enough reliable current information for this search.',
    retrievedAt: new Date().toISOString(),
  };
}
