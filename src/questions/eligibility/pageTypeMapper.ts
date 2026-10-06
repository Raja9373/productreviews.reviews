/**
 * ProductReviews.review — Page Type & Entity Requirement Mapper
 * Determines appropriate future page archetype and required entity count.
 */

import { ContentIntentType, EligibilityPageType, EntityRequirementLevel } from './eligibilityTypes';
import { MasterQuestion } from '../masterQuestionTypes';

export interface PageTypeMapping {
  pageType: EligibilityPageType;
  entityRequirement: EntityRequirementLevel;
  canBeStandalone: boolean;
  rationale: string;
}

/**
 * Maps ContentIntent to suitable PageType and EntityRequirementLevel
 */
export function mapIntentToPageType(
  contentIntent: ContentIntentType,
  masterQuestion?: MasterQuestion
): PageTypeMapping {
  switch (contentIntent) {
    case 'COMPARISON':
      return {
        pageType: 'COMPARISON',
        entityRequirement: 'TWO_OR_MORE',
        canBeStandalone: true,
        rationale: 'Head-to-head comparison requires at least two distinct product entities.'
      };

    case 'GENERATION':
      return {
        pageType: 'GENERATION_COMPARISON',
        entityRequirement: 'TWO_OR_MORE',
        canBeStandalone: true,
        rationale: 'Generation-to-generation comparison compares sequential models.'
      };

    case 'PRODUCT_REVIEW':
    case 'WORTH_IT':
    case 'BUYING_DECISION':
      return {
        pageType: 'PRODUCT_REVIEW',
        entityRequirement: 'ONE',
        canBeStandalone: true,
        rationale: 'In-depth single entity product evaluation and buying recommendation.'
      };

    case 'ALTERNATIVE':
      return {
        pageType: 'ALTERNATIVE',
        entityRequirement: 'ONE',
        canBeStandalone: true,
        rationale: 'Alternative guide centered around a primary product benchmark.'
      };

    case 'PROBLEM_SOLUTION':
      return {
        pageType: 'PROBLEM_SOLUTION',
        entityRequirement: 'ONE',
        canBeStandalone: true,
        rationale: 'Defect and common user complaints analysis for a specific product.'
      };

    case 'USE_CASE':
      return {
        pageType: 'USE_CASE',
        entityRequirement: masterQuestion?.entityRequired ? 'ONE' : 'NONE',
        canBeStandalone: true,
        rationale: 'Use-case specific testing and suitability guide.'
      };

    case 'BUYING_GUIDE':
    case 'PRICE_VALUE':
      return {
        pageType: 'BUYING_GUIDE',
        entityRequirement: 'NONE',
        canBeStandalone: true,
        rationale: 'Category or price-tiered buying guide for multiple products.'
      };

    case 'SPECIFICATION':
      return {
        pageType: 'SPECIFICATION',
        entityRequirement: masterQuestion?.entityRequired ? 'ONE' : 'NONE',
        canBeStandalone: true,
        rationale: 'Technical specification sheet and lab performance breakdown.'
      };

    case 'COMPATIBILITY':
      return {
        pageType: 'COMPATIBILITY',
        entityRequirement: 'ONE',
        canBeStandalone: true,
        rationale: 'Ecosystem, OS, network, or power standard compatibility matrix.'
      };

    case 'UPGRADE':
      return {
        pageType: 'UPGRADE_GUIDE',
        entityRequirement: 'ONE',
        canBeStandalone: true,
        rationale: 'Upgrade decision guide evaluating previous generation jump.'
      };

    case 'BRAND':
      return {
        pageType: 'BRAND_RESEARCH',
        entityRequirement: 'NONE',
        canBeStandalone: true,
        rationale: 'Brand reputation, reliability history, and product line overview.'
      };

    case 'SAFETY':
      return {
        pageType: 'SAFETY_GUIDE',
        entityRequirement: 'ONE',
        canBeStandalone: true,
        rationale: 'Safety advisories, thermal performance, and compliance standards.'
      };

    case 'AVAILABILITY':
      return {
        pageType: 'AVAILABILITY_GUIDE',
        entityRequirement: 'ONE',
        canBeStandalone: true,
        rationale: 'Market availability, regional retailer stock, and release tracking.'
      };

    case 'TRUST_EVIDENCE':
      return {
        pageType: 'FAQ',
        entityRequirement: 'NONE',
        canBeStandalone: false,
        rationale: 'General methodological or evidence transparency FAQ.'
      };

    default:
      return {
        pageType: 'PRODUCT_RESEARCH',
        entityRequirement: 'NONE',
        canBeStandalone: true,
        rationale: 'Broad exploratory product research.'
      };
  }
}
