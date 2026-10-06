/**
 * ProductReviews.review — Content Quality Assessment Model
 * Categorical quality evaluation ensuring substantive evidence before indexability candidacy.
 * Zero numerical scores: strictly uses categorical dimensions and quality states.
 */

import { ContentQualityState, EvidenceReadinessState, MarketReadinessState } from './eligibilityTypes';
import { ResearchResult } from '../../types';

export interface QualityAssessment {
  qualityState: ContentQualityState;
  evidenceReadiness: EvidenceReadinessState;
  marketReadiness: MarketReadinessState;
  qualityDimensions: {
    intentClarity: boolean;
    entityClarity: boolean;
    evidenceSufficiency: boolean;
    factualPreponderance: boolean;
    marketCoverageSufficient: boolean;
  };
  qualityIssues: string[];
}

/**
 * Assesses content quality categorically from research result and context
 */
export function assessContentQuality(
  isEntityClear: boolean,
  isIntentClear: boolean,
  targetCountryCode: string = 'GLOBAL',
  researchResult?: ResearchResult
): QualityAssessment {
  const issues: string[] = [];

  const evidenceCount = researchResult?.evidencePoints?.length || 0;
  const factualCount = researchResult?.evidencePoints?.filter(e => e.statementType === 'FACTUAL').length || 0;
  const contradictionsCount = researchResult?.nichod?.contradictions?.length || 0;
  const isStructured = researchResult?.structuredEvidenceAvailable || false;

  const isLocalRequired = targetCountryCode !== 'GLOBAL';
  const localEvidenceAvailable = researchResult?.localEvidenceAvailable || false;
  const missingMarketEvidence = researchResult?.missingMarketEvidence || [];

  // 1. Evidence Readiness
  let evidenceReadiness: EvidenceReadinessState = 'INSUFFICIENT';
  if (evidenceCount >= 5 && factualCount >= 3) {
    evidenceReadiness = 'READY';
  } else if (evidenceCount >= 2) {
    evidenceReadiness = 'LIMITED';
    issues.push('Limited volume of extracted research claims.');
  } else {
    issues.push('Insufficient substantive evidence points.');
  }

  // 2. Market Readiness
  let marketReadiness: MarketReadinessState = 'NOT_REQUIRED';
  if (isLocalRequired) {
    if (localEvidenceAvailable && missingMarketEvidence.length === 0) {
      marketReadiness = 'READY';
    } else if (localEvidenceAvailable) {
      marketReadiness = 'LIMITED';
      issues.push(`Partial local market evidence for ${targetCountryCode}.`);
    } else {
      marketReadiness = 'INSUFFICIENT';
      issues.push(`Missing critical local market evidence for ${targetCountryCode}.`);
    }
  }

  // 3. Overall Content Quality State
  let qualityState: ContentQualityState = 'INSUFFICIENT';

  if (!isEntityClear || !isIntentClear) {
    qualityState = 'UNSUPPORTED';
    issues.push('Unresolved or ambiguous entity/intent context.');
  } else if (evidenceReadiness === 'READY' && (!isLocalRequired || marketReadiness === 'READY') && contradictionsCount === 0) {
    qualityState = isStructured ? 'EXCELLENT' : 'GOOD';
  } else if (evidenceReadiness === 'READY' && marketReadiness === 'LIMITED') {
    qualityState = 'GOOD';
  } else if (evidenceReadiness === 'LIMITED' || marketReadiness === 'INSUFFICIENT') {
    qualityState = 'LIMITED';
  } else {
    qualityState = 'INSUFFICIENT';
  }

  return {
    qualityState,
    evidenceReadiness,
    marketReadiness,
    qualityDimensions: {
      intentClarity: isIntentClear,
      entityClarity: isEntityClear,
      evidenceSufficiency: evidenceReadiness === 'READY',
      factualPreponderance: factualCount >= 2,
      marketCoverageSufficient: !isLocalRequired || marketReadiness === 'READY' || marketReadiness === 'LIMITED'
    },
    qualityIssues: issues
  };
}
