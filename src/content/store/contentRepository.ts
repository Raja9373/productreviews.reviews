/**
 * ProductReviews.review — Content Repository & Store Architecture
 * Provides durable abstraction for content persistence, versioning,
 * immutable revision tracking, and audit logging.
 */

import {
  ContentRecord,
  ContentRecordStatus,
  ContentStoreQueryOptions,
  PublicationAuditEntry
} from './contentStoreTypes';
import { SynthesizedContent } from '../contentTypes';
import {
  generateContentSlug,
  buildCanonicalUrlForRecord,
  canApproveContent,
  canPublishContent,
  resolveIndexability,
  needsContentRefresh
} from './contentPublicationGates';
import { SourceStatus } from '../../types';

export interface IContentRepository {
  createRecord(content: SynthesizedContent): ContentRecord;
  getById(id: string): ContentRecord | undefined;
  getBySlug(slug: string): ContentRecord | undefined;
  getByCanonicalIntent(canonicalIntentId: string): ContentRecord | undefined;
  listRecords(options?: ContentStoreQueryOptions): ContentRecord[];
  updateDraft(id: string, updatedContent: SynthesizedContent): ContentRecord;
  approveContent(id: string): { success: boolean; record?: ContentRecord; blockers?: string[] };
  publishContent(id: string): { success: boolean; record?: ContentRecord; blockers?: string[] };
  rejectContent(id: string, reason: string): ContentRecord;
  archiveContent(id: string): ContentRecord;
  createRevision(id: string, newContent: SynthesizedContent): ContentRecord;
  getAuditTrail(recordId?: string): PublicationAuditEntry[];
  getPublishedIndexableRecords(): ContentRecord[];
  clear(): void;
}

export class MemoryContentRepository implements IContentRepository {
  private records = new Map<string, ContentRecord>();
  private slugIndex = new Map<string, string>(); // slug -> id
  private intentIndex = new Map<string, string>(); // canonicalIntentId -> id
  private auditLog: PublicationAuditEntry[] = [];

  constructor() {}

  /**
   * Creates a initial DRAFT content record from synthesized content
   */
  createRecord(content: SynthesizedContent): ContentRecord {
    const canonicalIntent = content.canonicalIntentId || content.questionId;
    
    // Check if canonical intent already exists
    if (this.intentIndex.has(canonicalIntent)) {
      const existingId = this.intentIndex.get(canonicalIntent)!;
      return this.records.get(existingId)!;
    }

    const entityName = content.entity?.name || content.entity?.model || 'product';
    const targetCountry = content.market?.countryCode || 'GLOBAL';
    let baseSlug = generateContentSlug(entityName, content.pageType, undefined, targetCountry);
    
    // Ensure slug uniqueness
    let uniqueSlug = baseSlug;
    let counter = 1;
    while (this.slugIndex.has(uniqueSlug)) {
      uniqueSlug = `${baseSlug}-${counter++}`;
    }

    const id = `rec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const record: ContentRecord = {
      id,
      questionId: content.questionId,
      canonicalIntentId: canonicalIntent,
      intentClusterId: content.intentClusterId,
      pageType: content.pageType,
      entity: content.entity || {},
      market: content.market || { countryCode: 'GLOBAL', language: 'en', currency: 'USD', hasLocalEvidence: false, localEvidenceCount: 0 },
      language: content.market?.language || 'en',
      currency: content.market?.currency || 'USD',
      slug: uniqueSlug,
      canonicalUrl: buildCanonicalUrlForRecord(uniqueSlug),
      title: content.title,
      content,
      evidenceSnapshot: {
        evidencePointIds: content.evidenceReferences,
        sourceIds: content.sections.flatMap(s => s.sourceIds),
        sourceStatus: content.evidenceSnapshot?.hasStructuredSources ? SourceStatus.STRUCTURED : SourceStatus.UNSTRUCTURED,
        capturedAt: content.generatedAt || now,
        market: content.market?.countryCode || 'GLOBAL',
        language: content.market?.language || 'en'
      },
      nichodSnapshot: content.nichod,
      decisionSnapshot: content.decision,
      metadata: content.metadata,
      schema: content.structuredData,
      status: 'DRAFT',
      indexability: 'NOINDEX',
      version: 1,
      createdAt: now,
      updatedAt: now,
      validatedAt: content.lastValidatedAt || now,
      freshnessState: 'CURRENT'
    };

    this.records.set(id, record);
    this.slugIndex.set(uniqueSlug, id);
    this.intentIndex.set(canonicalIntent, id);

    this.logAudit(id, 1, 'DRAFT', 'DRAFT', 'CREATE', true, ['Draft created from synthesis']);

    return record;
  }

  getById(id: string): ContentRecord | undefined {
    return this.records.get(id);
  }

  getBySlug(slug: string): ContentRecord | undefined {
    const id = this.slugIndex.get(slug);
    return id ? this.records.get(id) : undefined;
  }

  getByCanonicalIntent(canonicalIntentId: string): ContentRecord | undefined {
    const id = this.intentIndex.get(canonicalIntentId);
    return id ? this.records.get(id) : undefined;
  }

  listRecords(options: ContentStoreQueryOptions = {}): ContentRecord[] {
    let list = Array.from(this.records.values());

    if (options.status) {
      const statuses = Array.isArray(options.status) ? options.status : [options.status];
      list = list.filter(r => statuses.includes(r.status));
    }

    if (options.pageType) {
      list = list.filter(r => r.pageType === options.pageType);
    }

    if (options.market) {
      list = list.filter(r => r.market.countryCode === options.market);
    }

    if (options.canonicalIntentId) {
      list = list.filter(r => r.canonicalIntentId === options.canonicalIntentId);
    }

    if (options.offset) {
      list = list.slice(options.offset);
    }

    if (options.limit) {
      list = list.slice(0, options.limit);
    }

    return list;
  }

  /**
   * Updates an existing DRAFT record
   */
  updateDraft(id: string, updatedContent: SynthesizedContent): ContentRecord {
    const existing = this.records.get(id);
    if (!existing) {
      throw new Error(`Record ${id} not found.`);
    }

    if (existing.status === 'PUBLISHED') {
      throw new Error(`Cannot mutate PUBLISHED record ${id}. Use createRevision instead.`);
    }

    const now = new Date().toISOString();
    const updated: ContentRecord = {
      ...existing,
      title: updatedContent.title,
      content: updatedContent.contentStatus === 'REJECTED' ? updatedContent : updatedContent,
      updatedAt: now,
      validatedAt: now
    };

    this.records.set(id, updated);
    this.logAudit(id, existing.version, existing.status, updated.status, 'UPDATE', true, ['Draft updated']);
    return updated;
  }

  /**
   * Explicit approval of a content record
   */
  approveContent(id: string): { success: boolean; record?: ContentRecord; blockers?: string[] } {
    const existing = this.records.get(id);
    if (!existing) {
      return { success: false, blockers: [`Record ${id} not found`] };
    }

    const check = canApproveContent(existing);
    if (!check.allowed) {
      this.logAudit(id, existing.version, existing.status, existing.status, 'APPROVE', false, check.blockers);
      return { success: false, record: existing, blockers: check.blockers };
    }

    const updated: ContentRecord = {
      ...existing,
      status: 'APPROVED',
      updatedAt: new Date().toISOString()
    };

    this.records.set(id, updated);
    this.logAudit(id, existing.version, existing.status, 'APPROVED', 'APPROVE', true, check.reasons);
    return { success: true, record: updated };
  }

  /**
   * Explicit publication of an approved content record
   */
  publishContent(id: string): { success: boolean; record?: ContentRecord; blockers?: string[] } {
    const existing = this.records.get(id);
    if (!existing) {
      return { success: false, blockers: [`Record ${id} not found`] };
    }

    // Attempt publication gate
    const gate = canPublishContent(existing);
    if (!gate.allowed) {
      this.logAudit(id, existing.version, existing.status, existing.status, 'PUBLISH', false, gate.blockers);
      return { success: false, record: existing, blockers: gate.blockers };
    }

    const now = new Date().toISOString();
    const updated: ContentRecord = {
      ...existing,
      status: 'PUBLISHED',
      indexability: resolveIndexability({ ...existing, status: 'PUBLISHED' }),
      publishedAt: now,
      updatedAt: now
    };

    this.records.set(id, updated);
    this.logAudit(id, existing.version, existing.status, 'PUBLISHED', 'PUBLISH', true, gate.reasons);
    return { success: true, record: updated };
  }

  /**
   * Rejection of a content record
   */
  rejectContent(id: string, reason: string): ContentRecord {
    const existing = this.records.get(id);
    if (!existing) {
      throw new Error(`Record ${id} not found.`);
    }

    const updated: ContentRecord = {
      ...existing,
      status: 'REJECTED',
      indexability: 'NOINDEX',
      updatedAt: new Date().toISOString()
    };

    this.records.set(id, updated);
    this.logAudit(id, existing.version, existing.status, 'REJECTED', 'REJECT', true, [reason]);
    return updated;
  }

  /**
   * Archives a published content record safely
   */
  archiveContent(id: string): ContentRecord {
    const existing = this.records.get(id);
    if (!existing) {
      throw new Error(`Record ${id} not found.`);
    }

    const now = new Date().toISOString();
    const updated: ContentRecord = {
      ...existing,
      status: 'ARCHIVED',
      indexability: 'NOINDEX',
      archivedAt: now,
      updatedAt: now
    };

    this.records.set(id, updated);
    this.logAudit(id, existing.version, existing.status, 'ARCHIVED', 'ARCHIVE', true, ['Archived safely']);
    return updated;
  }

  /**
   * Creates a new revision (v2, v3) of a record without mutating published version
   */
  createRevision(id: string, newContent: SynthesizedContent): ContentRecord {
    const existing = this.records.get(id);
    if (!existing) {
      throw new Error(`Record ${id} not found.`);
    }

    const nextVersion = existing.version + 1;
    const now = new Date().toISOString();

    const revised: ContentRecord = {
      ...existing,
      version: nextVersion,
      content: newContent,
      title: newContent.title,
      evidenceSnapshot: {
        evidencePointIds: newContent.evidenceReferences,
        sourceIds: newContent.sections.flatMap(s => s.sourceIds),
        sourceStatus: newContent.evidenceSnapshot?.hasStructuredSources ? SourceStatus.STRUCTURED : SourceStatus.UNSTRUCTURED,
        capturedAt: newContent.generatedAt || now,
        market: newContent.market?.countryCode || 'GLOBAL',
        language: newContent.market?.language || 'en'
      },
      nichodSnapshot: newContent.nichod,
      decisionSnapshot: newContent.decision,
      status: 'QUALITY_REVIEW',
      indexability: 'NOINDEX', // Revisions must be reviewed and approved before indexing
      updatedAt: now,
      validatedAt: now
    };

    this.records.set(id, revised);
    this.logAudit(id, nextVersion, existing.status, 'QUALITY_REVIEW', 'UPDATE', true, [
      `Revision created: version ${nextVersion}`
    ]);

    return revised;
  }

  getAuditTrail(recordId?: string): PublicationAuditEntry[] {
    if (recordId) {
      return this.auditLog.filter(e => e.recordId === recordId);
    }
    return [...this.auditLog];
  }

  /**
   * Returns all PUBLISHED records that are eligible for indexing
   */
  getPublishedIndexableRecords(): ContentRecord[] {
    return Array.from(this.records.values()).filter(
      r => r.status === 'PUBLISHED' && r.indexability === 'INDEX_CANDIDATE'
    );
  }

  clear(): void {
    this.records.clear();
    this.slugIndex.clear();
    this.intentIndex.clear();
    this.auditLog = [];
  }

  private logAudit(
    recordId: string,
    version: number,
    previousStatus: ContentRecordStatus,
    newStatus: ContentRecordStatus,
    action: PublicationAuditEntry['action'],
    validationPassed: boolean,
    reasons: string[]
  ) {
    this.auditLog.push({
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      recordId,
      version,
      previousStatus,
      newStatus,
      timestamp: new Date().toISOString(),
      action,
      validationPassed,
      reasons
    });
  }
}

// Global Singleton Instance
export const contentRepository: IContentRepository = new MemoryContentRepository();
