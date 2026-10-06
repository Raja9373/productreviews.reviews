/**
 * ProductReviews.review — Content Expansion Controller
 * Executes deterministic content expansion batches through existing Phase 1-6 pipelines.
 * Enforces bounded concurrency, systemic abort triggers, sitemap verification,
 * and zero automatic recurring batches.
 */

import { IContentRepository } from '../store/contentRepository';
import {
  ContentBatch,
  ScalingCandidate,
  ScalingReadiness,
  ContentHealthAuditReport
} from './contentHealthTypes';
import { isEligibleForScaling } from './scalingEligibility';
import { evaluateSystemicFailureAbort, verifySitemapIntegrity } from './scalingSafety';

export interface RunBatchOptions {
  stopOnSystemicFailure?: boolean;
  verifySitemapAtEnd?: boolean;
}

export class ContentExpansionController {
  private activeBatch: ContentBatch | null = null;
  private batchHistory: ContentBatch[] = [];

  constructor() {}

  /**
   * Executes a planned batch explicitly (RUN_BATCH)
   */
  async runBatch(
    batch: ContentBatch,
    candidates: ScalingCandidate[],
    repository: IContentRepository,
    options: RunBatchOptions = { stopOnSystemicFailure: true, verifySitemapAtEnd: true }
  ): Promise<ContentBatch> {
    if (batch.status !== 'PLANNED') {
      throw new Error(`Cannot run batch ${batch.id}: status must be PLANNED (current: ${batch.status})`);
    }

    batch.status = 'RUNNING';
    batch.startedAt = new Date().toISOString();
    this.activeBatch = batch;

    const accumulatedRejections: string[] = [];

    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i];

      // Check abort condition before each candidate
      if (options.stopOnSystemicFailure && accumulatedRejections.length > 0) {
        const systemicCheck = evaluateSystemicFailureAbort(accumulatedRejections, candidates.length);
        if (systemicCheck.shouldPause) {
          batch.status = 'PAUSED';
          batch.pauseReason = systemicCheck.pauseReason;
          batch.pausedCount = candidates.length - i;
          break;
        }
      }

      // Check for fabricated claims, URLs, or ratings in candidate input
      const claimsStr = candidate.researchResult.evidencePoints?.map(e => e.claim).join(' ') || '';
      if (/\b(?:we tested in our lab|our hands-on lab test)\b/i.test(claimsStr)) {
        batch.status = 'PAUSED';
        batch.pauseReason = 'Immediate Abort: Fabricated laboratory testing claim detected in candidate data.';
        batch.pausedCount = candidates.length - i;
        break;
      }

      // Evaluate scaling eligibility
      const evalResult = isEligibleForScaling(candidate, repository);

      if (evalResult.action === 'MAP_TO_EXISTING') {
        batch.existingCanonicalReusedCount++;
        batch.duplicatePreventedCount++;
        continue;
      }

      if (!evalResult.isEligible || evalResult.action === 'REJECT') {
        batch.rejectedCount++;
        accumulatedRejections.push(...evalResult.rejectionReasons);
        continue;
      }

      // Candidate is genuinely eligible
      batch.eligibleCount++;
      const pipelineContent = evalResult.pipelineResult!.content;

      // Create record in repository
      const rec = repository.createRecord(pipelineContent);

      // Explicit approval gate
      const appRes = repository.approveContent(rec.id);
      if (appRes.success) {
        batch.approvedCount++;

        // Publication gate
        const pubRes = repository.publishContent(rec.id);
        if (pubRes.success) {
          batch.publishedCount++;
          batch.recordIds.push(rec.id);
        } else {
          accumulatedRejections.push(...(pubRes.blockers || ['Publication gate failed']));
        }
      } else {
        accumulatedRejections.push(...(appRes.blockers || ['Approval gate failed']));
      }
    }

    // Verify sitemap integrity post-execution
    if (batch.status === 'RUNNING') {
      if (options.verifySitemapAtEnd) {
        const sitemapCheck = verifySitemapIntegrity(repository);
        if (!sitemapCheck.isValid) {
          batch.status = 'PAUSED';
          batch.pauseReason = sitemapCheck.error;
        } else {
          batch.status = 'COMPLETED';
        }
      } else {
        batch.status = 'COMPLETED';
      }
    }

    batch.completedAt = new Date().toISOString();
    this.batchHistory.push({ ...batch });
    this.activeBatch = null;

    return batch;
  }

  /**
   * Evaluates overall scaling readiness for future publication rounds
   */
  evaluateScalingReadiness(
    healthReport: ContentHealthAuditReport,
    lastBatch?: ContentBatch
  ): { readiness: ScalingReadiness; reasons: string[] } {
    const reasons: string[] = [];

    if (healthReport.criticalIssues > 0) {
      reasons.push(`Detected ${healthReport.criticalIssues} critical production health issues.`);
    }

    if (healthReport.sitemapConsistency !== 'PASS') {
      reasons.push('Canonical XML sitemap consistency failed.');
    }

    if (lastBatch && lastBatch.status === 'PAUSED') {
      reasons.push(`Previous batch was paused: ${lastBatch.pauseReason || 'Safety threshold reached'}.`);
      return { readiness: 'PAUSED', reasons };
    }

    if (lastBatch && lastBatch.status === 'FAILED') {
      reasons.push('Previous batch failed.');
      return { readiness: 'BLOCKED', reasons };
    }

    if (reasons.length > 0) {
      return { readiness: 'NOT_READY', reasons };
    }

    reasons.push('Production health, sitemap consistency, and publication safety gates verified.');
    return { readiness: 'READY_FOR_NEXT_BATCH', reasons };
  }

  getActiveBatch(): ContentBatch | null {
    return this.activeBatch;
  }

  getBatchHistory(): ContentBatch[] {
    return this.batchHistory;
  }
}

export const contentExpansionController = new ContentExpansionController();
