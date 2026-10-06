/**
 * ProductReviews.review — Global Question Intelligence Master Database
 * TypeScript Types and Interfaces for Phase 1 Master Questions
 */

export type MasterIntentType =
  | 'PRODUCT_RESEARCH'
  | 'REVIEW'
  | 'WORTH_IT'
  | 'BUYING_DECISION'
  | 'COMPARISON'
  | 'ALTERNATIVE'
  | 'PROBLEM'
  | 'RELIABILITY'
  | 'PRICE_VALUE'
  | 'FEATURE'
  | 'SPECIFICATION'
  | 'COMPATIBILITY'
  | 'USE_CASE'
  | 'BEST_FOR'
  | 'BEGINNER'
  | 'PROFESSIONAL'
  | 'UPGRADE'
  | 'GENERATION'
  | 'BRAND'
  | 'SAFETY'
  | 'MAINTENANCE'
  | 'AVAILABILITY'
  | 'MARKET'
  | 'TRUST_EVIDENCE';

export type QuestionType =
  | 'GENERIC_MASTER_INTENT'
  | 'ENTITY_MASTER_INTENT'
  | 'COMPARISON_MASTER_INTENT'
  | 'USE_CASE_MASTER_INTENT'
  | 'MARKET_MASTER_INTENT'
  | 'PROBLEM_MASTER_INTENT'
  | 'SPECIFICATION_MASTER_INTENT'
  | 'COMPATIBILITY_MASTER_INTENT'
  | 'UPGRADE_MASTER_INTENT';

export type CommercialIntent =
  | 'INFORMATIONAL'
  | 'COMMERCIAL_RESEARCH'
  | 'TRANSACTIONAL'
  | 'MIXED';

export type MarketScope =
  | 'GLOBAL'
  | 'MARKET_DEPENDENT';

export type LanguageScope =
  | 'LANGUAGE_NEUTRAL'
  | 'LOCALIZATION_REQUIRED';

export type SuggestedPageType =
  | 'PRODUCT_RESEARCH'
  | 'PRODUCT_REVIEW'
  | 'COMPARISON'
  | 'BUYING_GUIDE'
  | 'ALTERNATIVE'
  | 'PROBLEM_SOLUTION'
  | 'USE_CASE'
  | 'FAQ'
  | 'SPECIFICATION'
  | 'COMPATIBILITY'
  | 'UPGRADE_GUIDE';

export type PriorityLevel = 'P0' | 'P1' | 'P2' | 'P3';

export type IndexabilityStatus = 'CANDIDATE' | 'CONDITIONAL' | 'NOT_INDEXABLE';

/**
 * Core Master Question Record
 */
export interface MasterQuestion {
  id: string;
  question: string;
  normalizedQuestion: string;
  intentType: MasterIntentType;
  questionType: QuestionType;
  productCategory: string;
  entityRequired: boolean;
  comparisonRequired: boolean;
  useCase?: string;
  constraintTypes?: string[];
  commercialIntent: CommercialIntent;
  marketScope: MarketScope;
  languageScope: LanguageScope;
  suggestedPageType: SuggestedPageType;
  priority: PriorityLevel;
  indexability: IndexabilityStatus;
  duplicateGroupId?: string;
  relatedQuestionIds?: string[];
  rationale?: string;
  createdAt: string;
  version: number;
}

/**
 * Filter and query options for question catalog lookups
 */
export interface MasterQuestionFilter {
  intentType?: MasterIntentType | MasterIntentType[];
  questionType?: QuestionType | QuestionType[];
  productCategory?: string | string[];
  commercialIntent?: CommercialIntent;
  marketScope?: MarketScope;
  languageScope?: LanguageScope;
  priority?: PriorityLevel | PriorityLevel[];
  entityRequired?: boolean;
  comparisonRequired?: boolean;
  useCase?: string;
  limit?: number;
  offset?: number;
  searchQuery?: string;
}

/**
 * Query match result mapping a user query to a Master Question intent
 */
export interface MasterQuestionMatch {
  masterQuestion: MasterQuestion;
  confidenceScore: number;
  matchedTerms: string[];
  extractedEntity?: string;
  extractedComparisonTarget?: string;
  extractedUseCase?: string;
  extractedMarket?: string;
}

/**
 * Comprehensive Dataset Audit Report Interface
 */
export interface MasterQuestionAuditReport {
  totalRecords: number;
  uniqueQuestions: number;
  duplicatesRemoved: number;
  nearDuplicatesMerged: number;
  invalidRecordsCount: number;
  intentDistribution: Record<MasterIntentType, number>;
  categoryDistribution: Record<string, number>;
  commercialIntentDistribution: Record<CommercialIntent, number>;
  marketScopeDistribution: Record<MarketScope, number>;
  languageScopeDistribution: Record<LanguageScope, number>;
  pageTypeDistribution: Record<SuggestedPageType, number>;
  priorityDistribution: Record<PriorityLevel, number>;
  entityRequiredCount: number;
  comparisonRequiredCount: number;
  useCaseCount: number;
  sampleQuestions: MasterQuestion[];
}
