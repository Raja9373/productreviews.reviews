/**
 * ProductReviews.review — Content Store & Safe Publication Types
 * Defines data structures for persistent content records, evidence snapshots,
 * publication gates, audit trails, and versioning.
 */

import {
  SynthesizedContent,
  ContentEntityMetadata,
  ContentMarketMetadata,
  ContentMetadataState,
  ContentStructuredData
} from '../contentTypes';
import { NichodResult, DecisionEngineResult, SourceStatus } from '../../types';

export type ContentRecordStatus =
  | 'DRAFT'
  | 'QUALITY_REVIEW'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'REJECTED'
  | 'ARCHIVED';

export type ContentIndexabilityState =
  | 'NOINDEX'
  | 'INDEX_CANDIDATE'
  | 'INDEXED';

export type ContentFreshnessState =
  | 'CURRENT'
  | 'REVIEW_RECOMMENDED'
  | 'STALE'
  | 'UNKNOWN';

export interface EvidenceSnapshot {
  evidencePointIds: string[];
  sourceIds: string[];
  sourceStatus: SourceStatus | 'STRUCTURED' | 'UNSTRUCTURED' | 'UNAVAILABLE';
  capturedAt: string;
  market: string;
  language?: string;
  freshness?: string;
}

export interface PublicationAuditEntry {
  id: string;
  recordId: string;
  version: number;
  previousStatus: ContentRecordStatus;
  newStatus: ContentRecordStatus;
  timestamp: string;
  action: 'CREATE' | 'UPDATE' | 'APPROVE' | 'PUBLISH' | 'REJECT' | 'ARCHIVE';
  validationPassed: boolean;
  reasons: string[];
  operator?: string;
}

export interface PublicationGateResult {
  allowed: boolean;
  status: ContentRecordStatus;
  indexability: ContentIndexabilityState;
  reasons: string[];
  blockers: string[];
}

export interface ContentRecord {
  id: string;
  questionId: string;
  canonicalIntentId: string;
  intentClusterId?: string;
  pageType: string;
  entity: ContentEntityMetadata;
  market: ContentMarketMetadata;
  language: string;
  currency?: string;
  slug: string;
  canonicalUrl: string;
  title: string;
  content: SynthesizedContent;
  evidenceSnapshot: EvidenceSnapshot;
  nichodSnapshot?: NichodResult;
  decisionSnapshot?: DecisionEngineResult;
  metadata: ContentMetadataState;
  schema?: ContentStructuredData[];
  status: ContentRecordStatus;
  indexability: ContentIndexabilityState;
  version: number;
  createdAt: string;
  updatedAt: string;
  validatedAt?: string;
  publishedAt?: string;
  archivedAt?: string;
  freshnessState: ContentFreshnessState;
}

export interface ContentStoreQueryOptions {
  status?: ContentRecordStatus | ContentRecordStatus[];
  pageType?: string;
  entityName?: string;
  market?: string;
  language?: string;
  canonicalIntentId?: string;
  limit?: number;
  offset?: number;
}
