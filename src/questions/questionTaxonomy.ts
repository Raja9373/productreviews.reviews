/**
 * ProductReviews.review — Question Intelligence Taxonomy
 * Defines standard product categories, intent mappings, and use cases across global markets.
 */

import {
  MasterIntentType,
  QuestionType,
  CommercialIntent,
  MarketScope,
  LanguageScope,
  SuggestedPageType,
  PriorityLevel,
  IndexabilityStatus
} from './masterQuestionTypes';

export const MASTER_PRODUCT_CATEGORIES = [
  'smartphones',
  'laptops',
  'tablets',
  'desktops',
  'monitors',
  'tvs',
  'headphones',
  'earbuds',
  'speakers',
  'cameras',
  'lenses',
  'smartwatches',
  'fitness-trackers',
  'e-readers',
  'gaming-consoles',
  'gaming-accessories',
  'keyboards',
  'mice',
  'printers',
  'routers',
  'networking-equipment',
  'storage-devices',
  'ssds',
  'hard-drives',
  'projectors',
  'microphones',
  'webcams',
  'smart-home-devices',
  'appliances',
  'kitchen-products',
  'personal-care-products',
  'beauty-products',
  'fitness-equipment',
  'office-products',
  'educational-products',
  'software',
  'apps',
  'subscriptions',
  'online-services',
  'productivity-tools',
  'ai-tools',
  'developer-tools',
  'business-software',
  'security-products',
  'automotive-accessories',
  'travel-products',
  'outdoor-products',
  'tools-equipment',
  'childrens-products',
  'smart-lighting',
  'smart-thermostats',
  'robot-vacuums',
  'air-purifiers',
  'espresso-machines',
  'power-banks',
  'solar-generators',
  'vr-headsets',
  'drones',
  'dash-cams',
  'electric-scooters'
] as const;

export type MasterCategory = typeof MASTER_PRODUCT_CATEGORIES[number];

export const INTENT_TYPE_METADATA: Record<MasterIntentType, {
  defaultCommercialIntent: CommercialIntent;
  defaultSuggestedPageType: SuggestedPageType;
  defaultPriority: PriorityLevel;
  defaultQuestionType: QuestionType;
  entityRequired: boolean;
  comparisonRequired: boolean;
  defaultIndexability: IndexabilityStatus;
}> = {
  PRODUCT_RESEARCH: {
    defaultCommercialIntent: 'COMMERCIAL_RESEARCH',
    defaultSuggestedPageType: 'PRODUCT_RESEARCH',
    defaultPriority: 'P0',
    defaultQuestionType: 'GENERIC_MASTER_INTENT',
    entityRequired: false,
    comparisonRequired: false,
    defaultIndexability: 'CANDIDATE'
  },
  REVIEW: {
    defaultCommercialIntent: 'COMMERCIAL_RESEARCH',
    defaultSuggestedPageType: 'PRODUCT_REVIEW',
    defaultPriority: 'P0',
    defaultQuestionType: 'ENTITY_MASTER_INTENT',
    entityRequired: true,
    comparisonRequired: false,
    defaultIndexability: 'CANDIDATE'
  },
  WORTH_IT: {
    defaultCommercialIntent: 'COMMERCIAL_RESEARCH',
    defaultSuggestedPageType: 'PRODUCT_REVIEW',
    defaultPriority: 'P0',
    defaultQuestionType: 'ENTITY_MASTER_INTENT',
    entityRequired: true,
    comparisonRequired: false,
    defaultIndexability: 'CANDIDATE'
  },
  BUYING_DECISION: {
    defaultCommercialIntent: 'COMMERCIAL_RESEARCH',
    defaultSuggestedPageType: 'BUYING_GUIDE',
    defaultPriority: 'P0',
    defaultQuestionType: 'ENTITY_MASTER_INTENT',
    entityRequired: true,
    comparisonRequired: false,
    defaultIndexability: 'CANDIDATE'
  },
  COMPARISON: {
    defaultCommercialIntent: 'COMMERCIAL_RESEARCH',
    defaultSuggestedPageType: 'COMPARISON',
    defaultPriority: 'P0',
    defaultQuestionType: 'COMPARISON_MASTER_INTENT',
    entityRequired: true,
    comparisonRequired: true,
    defaultIndexability: 'CANDIDATE'
  },
  ALTERNATIVE: {
    defaultCommercialIntent: 'COMMERCIAL_RESEARCH',
    defaultSuggestedPageType: 'ALTERNATIVE',
    defaultPriority: 'P1',
    defaultQuestionType: 'ENTITY_MASTER_INTENT',
    entityRequired: true,
    comparisonRequired: false,
    defaultIndexability: 'CANDIDATE'
  },
  PROBLEM: {
    defaultCommercialIntent: 'INFORMATIONAL',
    defaultSuggestedPageType: 'PROBLEM_SOLUTION',
    defaultPriority: 'P1',
    defaultQuestionType: 'PROBLEM_MASTER_INTENT',
    entityRequired: true,
    comparisonRequired: false,
    defaultIndexability: 'CANDIDATE'
  },
  RELIABILITY: {
    defaultCommercialIntent: 'COMMERCIAL_RESEARCH',
    defaultSuggestedPageType: 'PRODUCT_REVIEW',
    defaultPriority: 'P1',
    defaultQuestionType: 'ENTITY_MASTER_INTENT',
    entityRequired: true,
    comparisonRequired: false,
    defaultIndexability: 'CANDIDATE'
  },
  PRICE_VALUE: {
    defaultCommercialIntent: 'COMMERCIAL_RESEARCH',
    defaultSuggestedPageType: 'BUYING_GUIDE',
    defaultPriority: 'P1',
    defaultQuestionType: 'GENERIC_MASTER_INTENT',
    entityRequired: false,
    comparisonRequired: false,
    defaultIndexability: 'CANDIDATE'
  },
  FEATURE: {
    defaultCommercialIntent: 'INFORMATIONAL',
    defaultSuggestedPageType: 'SPECIFICATION',
    defaultPriority: 'P2',
    defaultQuestionType: 'GENERIC_MASTER_INTENT',
    entityRequired: false,
    comparisonRequired: false,
    defaultIndexability: 'CONDITIONAL'
  },
  SPECIFICATION: {
    defaultCommercialIntent: 'INFORMATIONAL',
    defaultSuggestedPageType: 'SPECIFICATION',
    defaultPriority: 'P2',
    defaultQuestionType: 'SPECIFICATION_MASTER_INTENT',
    entityRequired: false,
    comparisonRequired: false,
    defaultIndexability: 'CONDITIONAL'
  },
  COMPATIBILITY: {
    defaultCommercialIntent: 'INFORMATIONAL',
    defaultSuggestedPageType: 'COMPATIBILITY',
    defaultPriority: 'P1',
    defaultQuestionType: 'COMPATIBILITY_MASTER_INTENT',
    entityRequired: true,
    comparisonRequired: false,
    defaultIndexability: 'CANDIDATE'
  },
  USE_CASE: {
    defaultCommercialIntent: 'COMMERCIAL_RESEARCH',
    defaultSuggestedPageType: 'USE_CASE',
    defaultPriority: 'P0',
    defaultQuestionType: 'USE_CASE_MASTER_INTENT',
    entityRequired: false,
    comparisonRequired: false,
    defaultIndexability: 'CANDIDATE'
  },
  BEST_FOR: {
    defaultCommercialIntent: 'COMMERCIAL_RESEARCH',
    defaultSuggestedPageType: 'BUYING_GUIDE',
    defaultPriority: 'P0',
    defaultQuestionType: 'USE_CASE_MASTER_INTENT',
    entityRequired: false,
    comparisonRequired: false,
    defaultIndexability: 'CANDIDATE'
  },
  BEGINNER: {
    defaultCommercialIntent: 'COMMERCIAL_RESEARCH',
    defaultSuggestedPageType: 'BUYING_GUIDE',
    defaultPriority: 'P1',
    defaultQuestionType: 'USE_CASE_MASTER_INTENT',
    entityRequired: false,
    comparisonRequired: false,
    defaultIndexability: 'CANDIDATE'
  },
  PROFESSIONAL: {
    defaultCommercialIntent: 'COMMERCIAL_RESEARCH',
    defaultSuggestedPageType: 'BUYING_GUIDE',
    defaultPriority: 'P1',
    defaultQuestionType: 'USE_CASE_MASTER_INTENT',
    entityRequired: false,
    comparisonRequired: false,
    defaultIndexability: 'CANDIDATE'
  },
  UPGRADE: {
    defaultCommercialIntent: 'COMMERCIAL_RESEARCH',
    defaultSuggestedPageType: 'UPGRADE_GUIDE',
    defaultPriority: 'P1',
    defaultQuestionType: 'UPGRADE_MASTER_INTENT',
    entityRequired: true,
    comparisonRequired: false,
    defaultIndexability: 'CANDIDATE'
  },
  GENERATION: {
    defaultCommercialIntent: 'COMMERCIAL_RESEARCH',
    defaultSuggestedPageType: 'COMPARISON',
    defaultPriority: 'P1',
    defaultQuestionType: 'COMPARISON_MASTER_INTENT',
    entityRequired: true,
    comparisonRequired: true,
    defaultIndexability: 'CANDIDATE'
  },
  BRAND: {
    defaultCommercialIntent: 'COMMERCIAL_RESEARCH',
    defaultSuggestedPageType: 'BUYING_GUIDE',
    defaultPriority: 'P2',
    defaultQuestionType: 'GENERIC_MASTER_INTENT',
    entityRequired: false,
    comparisonRequired: false,
    defaultIndexability: 'CONDITIONAL'
  },
  SAFETY: {
    defaultCommercialIntent: 'INFORMATIONAL',
    defaultSuggestedPageType: 'FAQ',
    defaultPriority: 'P1',
    defaultQuestionType: 'PROBLEM_MASTER_INTENT',
    entityRequired: false,
    comparisonRequired: false,
    defaultIndexability: 'CANDIDATE'
  },
  MAINTENANCE: {
    defaultCommercialIntent: 'INFORMATIONAL',
    defaultSuggestedPageType: 'FAQ',
    defaultPriority: 'P2',
    defaultQuestionType: 'GENERIC_MASTER_INTENT',
    entityRequired: false,
    comparisonRequired: false,
    defaultIndexability: 'CONDITIONAL'
  },
  AVAILABILITY: {
    defaultCommercialIntent: 'TRANSACTIONAL',
    defaultSuggestedPageType: 'FAQ',
    defaultPriority: 'P2',
    defaultQuestionType: 'MARKET_MASTER_INTENT',
    entityRequired: false,
    comparisonRequired: false,
    defaultIndexability: 'CONDITIONAL'
  },
  MARKET: {
    defaultCommercialIntent: 'TRANSACTIONAL',
    defaultSuggestedPageType: 'BUYING_GUIDE',
    defaultPriority: 'P1',
    defaultQuestionType: 'MARKET_MASTER_INTENT',
    entityRequired: false,
    comparisonRequired: false,
    defaultIndexability: 'CANDIDATE'
  },
  TRUST_EVIDENCE: {
    defaultCommercialIntent: 'INFORMATIONAL',
    defaultSuggestedPageType: 'FAQ',
    defaultPriority: 'P1',
    defaultQuestionType: 'GENERIC_MASTER_INTENT',
    entityRequired: false,
    comparisonRequired: false,
    defaultIndexability: 'CANDIDATE'
  }
};
