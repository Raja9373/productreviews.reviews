/**
 * ProductReviews.review — Evidence-Backed Content Synthesis Types
 * Represents synthesized content, claim provenance, sections, and quality gating.
 */

import { NichodResult, DecisionEngineResult, EvidencePoint, Confidence } from '../types';
import { ContentIntentType, EligibilityPageType, SeoEligibilityStatus } from '../questions/eligibility/eligibilityTypes';

export type ContentStatus =
  | 'DRAFT'
  | 'QUALITY_REVIEW'
  | 'READY_FOR_PUBLICATION'
  | 'REJECTED';

export type SectionContentType =
  | 'FACT'
  | 'SYNTHESIS'
  | 'DECISION'
  | 'TRADEOFF'
  | 'LIMITATION'
  | 'FAQ';

export interface ContentClaim {
  id: string;
  text: string;
  statementType: 'FACTUAL' | 'OPINION' | 'MIXED' | 'UNKNOWN';
  evidencePointIds: string[];
  sourceIds: string[];
  sourceUrls?: string[];
  marketRelevance: 'LOCAL' | 'REGIONAL' | 'GLOBAL' | 'UNKNOWN';
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';
  aspect?: string;
  isUnsupported?: boolean;
}

export interface ContentSection {
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  evidencePointIds: string[];
  sourceIds: string[];
  claims: ContentClaim[];
  contentType: SectionContentType;
}

export interface ContentEntityMetadata {
  name?: string;
  brand?: string;
  category?: string;
  model?: string;
  generation?: string;
  variant?: string;
  sku?: string;
  isAmbiguous?: boolean;
}

export interface ContentComparisonMetadata {
  entityAName?: string;
  entityBName?: string;
  isComparisonComplete: boolean;
  entityAEvidenceIds: string[];
  entityBEvidenceIds: string[];
}

export interface ContentMarketMetadata {
  countryCode: string;
  language: string;
  currency: string;
  hasLocalEvidence: boolean;
  localEvidenceCount: number;
}

export interface ContentInternalLink {
  title: string;
  urlPath: string;
  linkType: 'REVIEW' | 'COMPARISON' | 'ALTERNATIVE' | 'PROBLEM' | 'USE_CASE' | 'UPGRADE' | 'CATEGORY';
  targetIntent: string;
  isAvailable: boolean;
}

export interface ContentMetadataState {
  title: string;
  metaDescription: string;
  canonicalUrl: string;
  robots: string;
  ogTitle: string;
  ogDescription: string;
  ogType: 'website' | 'article' | 'product';
  isSafeForIndex: boolean;
  rejectionReasons: string[];
}

export interface ContentStructuredData {
  schemaType: 'WebPage' | 'Article' | 'BreadcrumbList' | 'FAQPage' | 'Product';
  jsonLd: Record<string, unknown>;
  hasFabricatedRatings: boolean;
  hasFabricatedOffers: boolean;
  isValid: boolean;
}

export interface ContentQualityValidationResult {
  passed: boolean;
  status: ContentStatus;
  reasons: string[];
  unsupportedClaims: ContentClaim[];
  superlativeViolations: string[];
  firstPersonViolations: string[];
  sourceUrlViolations: string[];
  marketViolations: string[];
  decisionConflictViolations: string[];
  nichodConflictViolations: string[];
  thinContentViolations: string[];
  affiliateBiasDetected: boolean;
}

export interface SynthesizedContent {
  questionId: string;
  canonicalIntentId?: string;
  intentClusterId?: string;
  intentType: ContentIntentType | string;
  pageType: EligibilityPageType | string;
  entity?: ContentEntityMetadata;
  comparison?: ContentComparisonMetadata;
  market?: ContentMarketMetadata;
  title: string;
  introduction: string;
  sections: ContentSection[];
  claims: ContentClaim[];
  nichod?: NichodResult;
  decision?: DecisionEngineResult;
  evidenceReferences: string[];
  contradictions?: string[];
  missingInformation?: string[];
  limitations?: string[];
  faqs?: Array<{ question: string; answer: string; evidencePointIds: string[] }>;
  internalLinks: ContentInternalLink[];
  metadata: ContentMetadataState;
  structuredData: ContentStructuredData[];
  contentStatus: ContentStatus;
  indexability: SeoEligibilityStatus;
  evidenceSnapshot: {
    totalPoints: number;
    factualPoints: number;
    localPoints: number;
    globalPoints: number;
    hasStructuredSources: boolean;
  };
  contentVersion: number;
  generatedAt: string;
  lastValidatedAt: string;
  refreshReadiness: {
    isRefreshNeeded: boolean;
    refreshReasons: string[];
    priceSensitive: boolean;
    availabilitySensitive: boolean;
  };
}
