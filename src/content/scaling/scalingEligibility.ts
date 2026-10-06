/**
 * ProductReviews.review — Scaling Eligibility & Cannibalization Controller
 * Evaluates candidates for scaling batches using strict, non-diluted Phase 4-6 gates.
 * Enforces canonical deduplication and distinct use-case preservation.
 */

import { IContentRepository } from '../store/contentRepository';
import { ScalingCandidate, ScalingEvaluationResult } from './contentHealthTypes';
import { executeContentPipeline } from '../contentPipeline';
import { resolveQuestionContext } from '../../questions/context';
import { resolvePageEligibility } from '../../questions/eligibility';
import { canApproveContent, canPublishContent } from '../store/contentPublicationGates';
import { checkMarketAssertionSafety } from '../contentSafety';

/**
 * Evaluates whether a master question candidate is eligible for inclusion in a scaling batch
 */
export function isEligibleForScaling(
  candidate: ScalingCandidate,
  repository: IContentRepository
): ScalingEvaluationResult {
  const rejectionReasons: string[] = [];
  const { masterQuestion, query, researchResult, useCase } = candidate;

  // 1. Context Resolution
  const resolvedContext = resolveQuestionContext(masterQuestion, query);

  // 2. Phase 4 Eligibility Resolver
  const eligibility = resolvePageEligibility(masterQuestion, resolvedContext, researchResult);
  if (eligibility.indexability !== 'ELIGIBLE_CANDIDATE') {
    rejectionReasons.push(`Phase 4 indexability gate unmet: ${eligibility.indexability}`);
  }

  // 3. Cannibalization & Existing Canonical Check
  const canonicalIntent = masterQuestion.duplicateGroupId || masterQuestion.id;
  const existingRecord = repository.getByCanonicalIntent(canonicalIntent);

  if (existingRecord) {
    // Check if this is a genuinely distinct use case (e.g., programming vs video editing)
    const existingUseCase = existingRecord.content.entity?.useCase || 'general';
    const candidateUseCase = useCase || resolvedContext.useCase || 'general';

    const isDistinctUseCase = (
      candidateUseCase !== 'general' &&
      existingUseCase !== 'general' &&
      candidateUseCase !== existingUseCase
    );

    if (!isDistinctUseCase) {
      // Map to existing canonical page to prevent duplicate cannibalization
      return {
        candidate,
        isEligible: false,
        action: 'MAP_TO_EXISTING',
        existingRecordId: existingRecord.id,
        rejectionReasons: [`Existing canonical page already covers intent ${canonicalIntent}.`]
      };
    }
  }

  // 4. Evidence Sufficiency & Provenance Check
  if (!researchResult.evidencePoints || researchResult.evidencePoints.length === 0) {
    rejectionReasons.push('Zero evidence points available; research is insufficient.');
  }

  // 5. Market Context Safety (e.g. India query with US-only evidence)
  const targetMarket = resolvedContext.market?.countryCode || 'GLOBAL';
  const hasLocalEv = researchResult.localEvidenceAvailable ?? false;
  const claimsText = researchResult.evidencePoints?.map(e => e.claim).join(' ') || '';
  const marketSafety = checkMarketAssertionSafety(claimsText, targetMarket, hasLocalEv);
  if (!marketSafety.passed) {
    rejectionReasons.push(...marketSafety.violations);
  }

  // 6. Execute Phase 5 Pipeline & Quality Gate
  const pipelineResult = executeContentPipeline(masterQuestion, query, researchResult, resolvedContext);
  if (!pipelineResult.isPublicationCandidate) {
    rejectionReasons.push('Phase 5 content synthesis failed quality or safety gates.');
    rejectionReasons.push(...pipelineResult.validation.reasons);
  }

  // 7. Phase 6 Gate Verification (Side-effect free prospective evaluation)
  const pipelineContent = pipelineResult.content;
  const prospectiveRecord = {
    id: 'rec_eval_preview',
    questionId: masterQuestion.id,
    canonicalIntentId: canonicalIntent,
    intentClusterId: pipelineContent.intentClusterId,
    pageType: pipelineContent.pageType,
    entity: pipelineContent.entity,
    market: pipelineContent.market,
    language: pipelineContent.market.language || 'en',
    currency: pipelineContent.market.currency,
    slug: pipelineContent.entity?.name ? pipelineContent.entity.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'product',
    canonicalUrl: `https://productreviews.review/review/${pipelineContent.entity?.name ? pipelineContent.entity.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'product'}`,
    title: pipelineContent.title,
    content: pipelineContent,
    evidenceSnapshot: {
      evidencePointIds: pipelineContent.claims.flatMap(c => c.evidencePointIds),
      sourceIds: pipelineContent.claims.flatMap(c => c.sourceIds),
      sourceStatus: researchResult.sourceStatus,
      capturedAt: pipelineContent.generatedAt,
      market: pipelineContent.market.countryCode,
      language: pipelineContent.market.language
    },
    nichodSnapshot: pipelineContent.nichod,
    decisionSnapshot: pipelineContent.decision,
    metadata: pipelineContent.metadata,
    schema: pipelineContent.structuredData,
    status: 'DRAFT' as const,
    indexability: 'NOINDEX' as const,
    version: 1,
    createdAt: pipelineContent.generatedAt,
    updatedAt: pipelineContent.generatedAt,
    freshnessState: 'CURRENT' as const
  };

  const approveCheck = canApproveContent(prospectiveRecord as any);
  if (!approveCheck.allowed) {
    rejectionReasons.push(...approveCheck.blockers);
  }

  const publishCheck = canPublishContent({ ...prospectiveRecord, status: 'APPROVED' } as any);
  if (!publishCheck.allowed) {
    rejectionReasons.push(...publishCheck.blockers);
  }

  const isEligible = rejectionReasons.length === 0;

  return {
    candidate,
    isEligible,
    action: isEligible ? 'CREATE_CANDIDATE' : 'REJECT',
    rejectionReasons,
    pipelineResult
  };
}
