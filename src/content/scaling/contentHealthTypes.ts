/**
 * ProductReviews.review — Phase 7 Content Health & Scaling Types
 * Categorical health states, remediation actions, batch abstractions,
 * and scaling readiness.
 */

import { ContentRecord, ContentRecordStatus } from '../store/contentStoreTypes';
import { MasterQuestion } from '../../questions/masterQuestionTypes';
import { ResearchResult } from '../../types';
import { ContentPipelineResult } from '../contentPipeline';

export type ContentHealthState =
  | 'HEALTHY'
  | 'REVIEW_RECOMMENDED'
  | 'STALE'
  | 'CONTENT_ISSUE'
  | 'INDEXABILITY_ISSUE'
  | 'EVIDENCE_ISSUE'
  | 'CANONICAL_ISSUE'
  | 'DUPLICATE_RISK';

export type RemediationRecommendation =
  | 'KEEP'
  | 'REFRESH_EVIDENCE'
  | 'REGENERATE_CONTENT'
  | 'REVIEW_CANONICAL'
  | 'REVIEW_INDEXABILITY'
  | 'MERGE_WITH_CANONICAL'
  | 'ARCHIVE_RECOMMENDED'
  | 'MANUAL_REVIEW';

export interface ContentRecordHealth {
  recordId: string;
  slug: string;
  canonicalUrl: string;
  status: ContentRecordStatus;
  healthState: ContentHealthState;
  remediation: RemediationRecommendation;
  issues: string[];
  warnings: string[];
  checks: {
    entityValid: boolean;
    canonicalIntentValid: boolean;
    pageTypeValid: boolean;
    marketValid: boolean;
    languageValid: boolean;
    evidenceSnapshotValid: boolean;
    freshnessValid: boolean;
    nichodConsistent: boolean;
    decisionConsistent: boolean;
    claimProvenanceValid: boolean;
    sourceIntegrityValid: boolean;
    canonicalUrlValid: boolean;
    slugUnique: boolean;
    metadataValid: boolean;
    schemaSafe: boolean;
    breadcrumbValid: boolean;
    internalLinksValid: boolean;
    affiliateNeutral: boolean;
    adsenseSafe: boolean;
    indexabilityConsistent: boolean;
    sitemapIncluded: boolean;
    duplicateRisk: boolean;
    thinContentRisk: boolean;
    staleContentRisk: boolean;
  };
  auditedAt: string;
}

export interface ContentHealthAuditReport {
  totalPublished: number;
  healthy: number;
  reviewRecommended: number;
  stale: number;
  evidenceIssue: number;
  canonicalIssue: number;
  duplicateRisk: number;
  indexabilityIssue: number;
  contentIssue: number;
  criticalIssues: number;
  sitemapConsistency: 'PASS' | 'FAIL';
  records: ContentRecordHealth[];
  generatedAt: string;
}

export type BatchStatus = 'PLANNED' | 'RUNNING' | 'COMPLETED' | 'PAUSED' | 'FAILED';

export type ScalingReadiness =
  | 'NOT_READY'
  | 'READY_FOR_NEXT_BATCH'
  | 'PAUSED'
  | 'BLOCKED';

export interface ScalingCandidate {
  masterQuestion: MasterQuestion;
  query: string;
  researchResult: ResearchResult;
  priority?: 'P0' | 'P1' | 'P2';
  useCase?: string;
  hasAffiliateProduct?: boolean;
}

export interface ContentBatch {
  id: string;
  requestedLimit: number;
  candidateCount: number;
  eligibleCount: number;
  approvedCount: number;
  publishedCount: number;
  rejectedCount: number;
  pausedCount: number;
  duplicatePreventedCount: number;
  existingCanonicalReusedCount: number;
  status: BatchStatus;
  pauseReason?: string;
  warnings: string[];
  categoryConcentration?: {
    category: string;
    percentage: number;
    isConcentrated: boolean;
  };
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  recordIds: string[];
}

export interface ScalingEvaluationResult {
  candidate: ScalingCandidate;
  isEligible: boolean;
  action: 'CREATE_CANDIDATE' | 'MAP_TO_EXISTING' | 'REJECT';
  existingRecordId?: string;
  rejectionReasons: string[];
  pipelineResult?: ContentPipelineResult;
}
