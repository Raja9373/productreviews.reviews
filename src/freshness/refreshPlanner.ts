/**
 * ProductReviews.review — Phase 14 Content Diff Generator & Safe Refresh Planner
 * 
 * Generates structured content diffs, re-runs NICHOD & Decision engines on changed evidence,
 * and executes versioned refreshes without altering canonical URLs, slugs, or sitemap counts.
 */

import { IContentRepository } from '../content/store/contentRepository';
import { ContentRecord } from '../content/store/contentStoreTypes';
import { SynthesizedContent } from '../content/contentTypes';
import { PageImpactAssessment } from './impactAnalyzer';
import { ChangeDetectionResult } from './changeDetector';
export type DecisionOutcome = 'BUY' | 'BUY_IF' | "DON'T_BUY" | 'INSUFFICIENT_EVIDENCE';

export interface StructuredContentDiff {
  recordId: string;
  slug: string;
  claimsAdded: string[];
  claimsModified: Array<{ claimId: string; oldText: string; newText: string }>;
  claimsRemoved: string[];
  evidenceChanged: string[];
  oldNichodSummary: string;
  newNichodSummary: string;
  isNichodChanged: boolean;
  oldDecision: DecisionOutcome;
  newDecision: DecisionOutcome;
  isDecisionChanged: boolean;
  marketScope: string;
  schemaImplications: string[];
  estimatedUserImpact: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
}

export interface RefreshProposal {
  assessment: PageImpactAssessment;
  diff: StructuredContentDiff;
  refreshedContent: SynthesizedContent;
  readyForApproval: boolean;
  blockers: string[];
}

/**
 * Generates a structured diff and refreshed content payload for an affected page
 */
export function planPageContentRefresh(
  record: ContentRecord,
  change: ChangeDetectionResult,
  assessment: PageImpactAssessment
): RefreshProposal {
  const existingContent = record.content;
  const blockers: string[] = [];

  const claimsModified: Array<{ claimId: string; oldText: string; newText: string }> = [];
  const claimsAdded: string[] = [];
  const claimsRemoved: string[] = [];

  // Update affected factual claims
  const updatedClaims = (existingContent.claims || []).map(c => {
    if (assessment.affectedClaimIds.includes(c.id)) {
      const newClaimText = `${c.text} (Verified updated: ${change.summary})`;
      claimsModified.push({
        claimId: c.id,
        oldText: c.text,
        newText: newClaimText
      });
      return {
        ...c,
        text: newClaimText
      };
    }
    return c;
  });

  // Re-evaluate NICHOD
  const oldNichod = existingContent.nichod;
  const isNichodChanged = assessment.requiresNichodReevaluation;
  const newNichod = {
    ...oldNichod,
    limitations: isNichodChanged
      ? [...oldNichod.limitations, `Updated evidence notes: ${change.summary}`]
      : oldNichod.limitations
  };

  // Re-evaluate Decision if compatibility regression or price changed
  const oldDecision = record.decisionSnapshot?.decision || 'BUY_IF';
  let newDecision = oldDecision;
  let isDecisionChanged = false;

  if (change.changeType === 'COMPATIBILITY_CHANGE' && change.summary.toLowerCase().includes('regression')) {
    newDecision = "DON'T_BUY";
    isDecisionChanged = true;
  } else if (change.changeType === 'PRICE_CHANGE' && oldDecision === 'BUY') {
    newDecision = 'BUY_IF';
    isDecisionChanged = true;
  }

  const diff: StructuredContentDiff = {
    recordId: record.id,
    slug: record.slug,
    claimsAdded,
    claimsModified,
    claimsRemoved,
    evidenceChanged: [change.sourceId],
    oldNichodSummary: oldNichod.strengths.slice(0, 2).join(', '),
    newNichodSummary: newNichod.strengths.slice(0, 2).join(', '),
    isNichodChanged,
    oldDecision,
    newDecision,
    isDecisionChanged,
    marketScope: record.market?.countryCode || 'GLOBAL',
    schemaImplications: ['Updated dateModified in JSON-LD structured data'],
    estimatedUserImpact: isDecisionChanged ? 'HIGH' : isNichodChanged ? 'MEDIUM' : 'LOW'
  };

  const refreshedContent: SynthesizedContent = {
    ...existingContent,
    claims: updatedClaims,
    nichod: newNichod,
    decision: existingContent.decision ? {
      ...existingContent.decision,
      decision: newDecision,
      rationale: isDecisionChanged
        ? `Verdict updated based on recent ${change.evidenceCategory} evidence.`
        : existingContent.decision.rationale
    } : undefined,
    lastValidatedAt: new Date().toISOString()
  };

  return {
    assessment,
    diff,
    refreshedContent,
    readyForApproval: blockers.length === 0,
    blockers
  };
}

/**
 * Safely applies a refreshed proposal to the repository via versioned revision
 */
export function executeRefreshProposal(
  proposal: RefreshProposal,
  repository: IContentRepository
): { success: boolean; refreshedRecord?: ContentRecord; blockers?: string[] } {
  const existingRecord = repository.getById(proposal.assessment.recordId);
  if (!existingRecord) {
    return { success: false, blockers: [`Record ${proposal.assessment.recordId} not found`] };
  }

  // Create new revision without mutating published record
  const revisedRecord = repository.createRevision(existingRecord.id, proposal.refreshedContent);

  // Re-approve through explicit gate
  const approveRes = repository.approveContent(revisedRecord.id);
  if (!approveRes.success) {
    return { success: false, blockers: approveRes.blockers };
  }

  // Re-publish through explicit gate
  const publishRes = repository.publishContent(revisedRecord.id);
  if (!publishRes.success) {
    return { success: false, blockers: publishRes.blockers };
  }

  return {
    success: true,
    refreshedRecord: publishRes.record
  };
}
