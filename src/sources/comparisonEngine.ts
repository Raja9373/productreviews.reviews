import { ComparisonFactor, ComparisonItem, EntityItem, LanguageCode, MarketCode } from '../types';
import { sourceRouter } from './sourceRouter';
import { EvidenceRankingEngine } from './ranking';
import { parseSearchQuery } from '../search/queryParser';

export class EvidenceComparisonEngine {
  /**
   * Compares two entities based on legitimately discovered external source evidence
   */
  static async compare(
    nameA: string,
    nameB: string,
    market: MarketCode,
    lang: LanguageCode
  ): Promise<ComparisonItem | null> {
    const parsedA = parseSearchQuery(nameA, market, lang);
    const parsedB = parseSearchQuery(nameB, market, lang);

    // Fetch evidence for both entities in parallel
    const [entitiesA, entitiesB] = await Promise.all([
      sourceRouter.discoverEntities(nameA, parsedA.domain, market, lang),
      sourceRouter.discoverEntities(nameB, parsedB.domain, market, lang),
    ]);

    if (entitiesA.length === 0 || entitiesB.length === 0) {
      return null;
    }

    const itemA: EntityItem = EvidenceRankingEngine.rankAndMapToEntityItems(
      [entitiesA[0]],
      parsedA
    )[0];

    const itemB: EntityItem = EvidenceRankingEngine.rankAndMapToEntityItems(
      [entitiesB[0]],
      parsedB
    )[0];

    if (!itemA || !itemB) return null;

    // Build comparison factors from documented specs and properties
    const factors: ComparisonFactor[] = [];

    // Factor 1: Brand & Origin
    if (itemA.brand || itemB.brand) {
      factors.push({
        factor: 'Brand Ecosystem',
        entityAAssessment: itemA.brand ? `${itemA.brand} ecosystem` : 'Documented specification',
        entityBAssessment: itemB.brand ? `${itemB.brand} ecosystem` : 'Documented specification',
        winner: 'TIE',
        why: 'Ecosystem preference depends on existing hardware and software integration.',
      });
    }

    // Factor 2: Category / Classification
    const catA = itemA.specs?.['Category'] || itemA.explanation.slice(0, 50);
    const catB = itemB.specs?.['Category'] || itemB.explanation.slice(0, 50);
    if (catA && catB) {
      factors.push({
        factor: 'Classification & Design Focus',
        entityAAssessment: catA,
        entityBAssessment: catB,
        winner: 'TIE',
        why: 'Both options serve specialized roles based on their documented design philosophy.',
      });
    }

    // Factor 3: Factual Documentation
    factors.push({
      factor: 'Documented Specifications',
      entityAAssessment: Object.keys(itemA.specs || {}).length > 0
        ? `${Object.keys(itemA.specs || {}).length} technical specifications documented`
        : 'Basic public overview',
      entityBAssessment: Object.keys(itemB.specs || {}).length > 0
        ? `${Object.keys(itemB.specs || {}).length} technical specifications documented`
        : 'Basic public overview',
      winner: 'TIE',
      why: 'Compare exact technical specifications below for detailed decision criteria.',
    });

    return {
      entityA: itemA,
      entityB: itemB,
      factors,
      mainCompromise: `Selecting ${itemA.name} vs ${itemB.name} involves balancing ecosystem integration, physical specifications, and authorized retailer pricing in ${market}.`,
      verdictSummary: `Both ${itemA.name} and ${itemB.name} are documented benchmarks with objective source citations. Evaluate your workflow and price at authorized retailers.`,
    };
  }
}
