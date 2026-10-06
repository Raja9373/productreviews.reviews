/**
 * ProductReviews.review — Page Value & Standalone Utility Tester
 * Assesses whether a user benefits from a dedicated, indexable URL or if the query produces thin content.
 */

import { PageValueLevel, ContentIntentType, EntityRequirementLevel } from './eligibilityTypes';

/**
 * Assesses the standalone editorial value of a page for an intent and entity configuration
 */
export function evaluatePageValue(
  contentIntent: ContentIntentType,
  entityRequirement: EntityRequirementLevel,
  isEntityBound: boolean,
  isAmbiguous: boolean,
  hasUseCase: boolean
): {
  pageValue: PageValueLevel;
  valueRationale: string;
} {
  // Ambiguous entity queries have no standalone page value (risk of misleading users)
  if (isAmbiguous) {
    return {
      pageValue: 'NO_STANDALONE_VALUE',
      valueRationale: 'Query has unresolved entity ambiguity; dedicated page would confuse product lines.'
    };
  }

  // Required entity is missing (e.g. "Is it worth buying?" without any entity)
  if (entityRequirement === 'ONE' && !isEntityBound) {
    return {
      pageValue: 'NO_STANDALONE_VALUE',
      valueRationale: 'Intent requires a concrete product entity, but none is bound.'
    };
  }

  // Comparison query with missing entities
  if (entityRequirement === 'TWO_OR_MORE' && !isEntityBound) {
    return {
      pageValue: 'NO_STANDALONE_VALUE',
      valueRationale: 'Comparison requires two distinct verified products.'
    };
  }

  // High-value commercial & research intents with resolved entities
  if (['PRODUCT_REVIEW', 'WORTH_IT', 'BUYING_DECISION', 'COMPARISON'].includes(contentIntent) && isEntityBound) {
    return {
      pageValue: 'HIGH_VALUE',
      valueRationale: 'High user decision intent with concrete product entity.'
    };
  }

  // Specialized use case evaluations
  if (contentIntent === 'USE_CASE' && hasUseCase) {
    return {
      pageValue: 'HIGH_VALUE',
      valueRationale: 'Targeted workload evaluation with distinct consumer decision context.'
    };
  }

  // Problem & solution guides
  if (contentIntent === 'PROBLEM_SOLUTION' && isEntityBound) {
    return {
      pageValue: 'USEFUL',
      valueRationale: 'Provides actionable post-purchase or pre-purchase defect awareness.'
    };
  }

  // Broad buying guides
  if (contentIntent === 'BUYING_GUIDE' || contentIntent === 'PRODUCT_RESEARCH') {
    return {
      pageValue: 'USEFUL',
      valueRationale: 'Category level buying guide providing broad market context.'
    };
  }

  // Technical specifications & compatibility
  if (['SPECIFICATION', 'COMPATIBILITY', 'UPGRADE'].includes(contentIntent) && isEntityBound) {
    return {
      pageValue: 'USEFUL',
      valueRationale: 'Specific technical compatibility or generational upgrade matrix.'
    };
  }

  return {
    pageValue: 'LIMITED_VALUE',
    valueRationale: 'Generic inquiry suitable as an inline search result rather than a dedicated indexable page.'
  };
}
