/**
 * ProductReviews.review — Batch Planner
 * Plans deterministic candidate expansion batches with bounded limits,
 * category concentration awareness, and explicit PLANNED status.
 */

import { ContentBatch, ScalingCandidate } from './contentHealthTypes';
import { SCALING_SAFETY_CONSTANTS, checkCategoryConcentration } from './scalingSafety';

/**
 * Plans a new scaling batch with bounded limits
 */
export function planBatch(
  requestedLimit: number,
  candidates: ScalingCandidate[],
  maxLimit: number = SCALING_SAFETY_CONSTANTS.MAX_BATCH_SIZE
): { batch: ContentBatch; plannedCandidates: ScalingCandidate[] } {
  // Enforce safety maximum limit (e.g. 100 max per sub-batch, or expansion max 250)
  const safeLimit = Math.min(requestedLimit, maxLimit);
  const plannedCandidates = candidates.slice(0, safeLimit);

  const concentration = checkCategoryConcentration(plannedCandidates);
  const warnings: string[] = [];

  if (concentration?.isConcentrated) {
    warnings.push(
      `CATEGORY_CONCENTRATION: Category "${concentration.category}" comprises ${(concentration.percentage * 100).toFixed(1)}% of planned batch.`
    );
  }

  const batch: ContentBatch = {
    id: `batch_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    requestedLimit: safeLimit,
    candidateCount: plannedCandidates.length,
    eligibleCount: 0,
    approvedCount: 0,
    publishedCount: 0,
    rejectedCount: 0,
    pausedCount: 0,
    duplicatePreventedCount: 0,
    existingCanonicalReusedCount: 0,
    status: 'PLANNED',
    warnings,
    categoryConcentration: concentration,
    createdAt: new Date().toISOString(),
    recordIds: []
  };

  return { batch, plannedCandidates };
}

/**
 * Prioritizes candidates based on evidence completeness, entity clarity, and intent strength.
 * Strictly affiliate-neutral: does NOT prioritize based on commercial monetization.
 */
export function prioritizeCandidates(candidates: ScalingCandidate[]): ScalingCandidate[] {
  return [...candidates].sort((a, b) => {
    // 1. Evidence count priority
    const evA = a.researchResult.evidencePoints?.length || 0;
    const evB = b.researchResult.evidencePoints?.length || 0;
    if (evB !== evA) return evB - evA;

    // 2. Structured source status
    const srcA = a.researchResult.structuredEvidenceAvailable ? 1 : 0;
    const srcB = b.researchResult.structuredEvidenceAvailable ? 1 : 0;
    if (srcB !== srcA) return srcB - srcA;

    // 3. Question priority (P0 before P1 before P2)
    const prioOrder: Record<string, number> = { P0: 0, P1: 1, P2: 2 };
    const pA = a.priority ? prioOrder[a.priority] ?? 1 : 1;
    const pB = b.priority ? prioOrder[b.priority] ?? 1 : 1;
    return pA - pB;
  });
}
