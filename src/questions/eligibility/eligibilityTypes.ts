/**
 * ProductReviews.review — SEO Page Eligibility & Content Intent Types
 * Models content intent, page types, quality gates, and indexability eligibility.
 */

import { CommercialIntent } from '../masterQuestionTypes';

export type ContentIntentType =
  | 'PRODUCT_RESEARCH'
  | 'PRODUCT_REVIEW'
  | 'BUYING_DECISION'
  | 'WORTH_IT'
  | 'COMPARISON'
  | 'ALTERNATIVE'
  | 'PROBLEM_SOLUTION'
  | 'USE_CASE'
  | 'BUYING_GUIDE'
  | 'SPECIFICATION'
  | 'FEATURE_EXPLAINER'
  | 'COMPATIBILITY'
  | 'RELIABILITY'
  | 'PRICE_VALUE'
  | 'UPGRADE'
  | 'GENERATION'
  | 'BRAND'
  | 'SAFETY'
  | 'AVAILABILITY'
  | 'TRUST_EVIDENCE';

export type EligibilityPageType =
  | 'PRODUCT_RESEARCH'
  | 'PRODUCT_REVIEW'
  | 'COMPARISON'
  | 'BUYING_GUIDE'
  | 'ALTERNATIVE'
  | 'PROBLEM_SOLUTION'
  | 'USE_CASE'
  | 'SPECIFICATION'
  | 'COMPATIBILITY'
  | 'UPGRADE_GUIDE'
  | 'GENERATION_COMPARISON'
  | 'BRAND_RESEARCH'
  | 'SAFETY_GUIDE'
  | 'AVAILABILITY_GUIDE'
  | 'FAQ'
  | 'NONE';

export type EntityRequirementLevel =
  | 'NONE'
  | 'ONE'
  | 'TWO_OR_MORE';

export type ContentQualityState =
  | 'EXCELLENT'
  | 'GOOD'
  | 'LIMITED'
  | 'INSUFFICIENT'
  | 'UNSUPPORTED';

export type PageValueLevel =
  | 'HIGH_VALUE'
  | 'USEFUL'
  | 'LIMITED_VALUE'
  | 'NO_STANDALONE_VALUE';

export type EvidenceReadinessState =
  | 'READY'
  | 'LIMITED'
  | 'INSUFFICIENT';

export type MarketReadinessState =
  | 'READY'
  | 'LIMITED'
  | 'NOT_REQUIRED'
  | 'INSUFFICIENT';

export type LocalizationReadinessState =
  | 'READY'
  | 'MASTER_ONLY'
  | 'INSUFFICIENT';

export type SeoEligibilityStatus =
  | 'NOT_ELIGIBLE'
  | 'CONDITIONAL'
  | 'ELIGIBLE_CANDIDATE';

export type IntentDuplicateStatus =
  | 'CANONICAL'
  | 'VARIANT'
  | 'DUPLICATE'
  | 'DISTINCT';

export interface MetadataReadiness {
  titleReady: boolean;
  descriptionReady: boolean;
  canonicalReady: boolean;
  breadcrumbReady: boolean;
  schemaReady: boolean;
  contentReady: boolean;
  evidenceReady: boolean;
  localizationReady: boolean;
}

export interface IntentClusterResult {
  intentClusterId: string;
  canonicalIntentId: string;
  duplicateStatus: IntentDuplicateStatus;
  clusterRationale: string;
}

export interface PageEligibilityResult {
  questionId: string;
  canonicalIntentId: string;
  intentClusterId: string;
  duplicateStatus: IntentDuplicateStatus;
  contentIntent: ContentIntentType;
  pageType: EligibilityPageType;
  entityRequirement: EntityRequirementLevel;
  contentQuality: ContentQualityState;
  pageValue: PageValueLevel;
  evidenceReadiness: EvidenceReadinessState;
  marketReadiness: MarketReadinessState;
  localizationReadiness: LocalizationReadinessState;
  indexability: SeoEligibilityStatus;
  commercialIntent: CommercialIntent;
  metadataReadiness: MetadataReadiness;
  reasons: string[];
  missingRequirements: string[];
  contentBlueprint?: string[];
}
