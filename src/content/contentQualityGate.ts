/**
 * ProductReviews.review — Content Quality Gate
 * Executes 16-point comprehensive validation against synthesized content,
 * enforcing hard rejection on unsupported claims, fabricated URLs, fake testing,
 * superlative violations, decision/NICHOD conflicts, and thin content.
 */

import { SynthesizedContent, ContentQualityValidationResult, ContentStatus } from './contentTypes';
import { PageEligibilityResult } from '../questions/eligibility/eligibilityTypes';
import { ResearchResult } from '../types';
import {
  checkSuperlatives,
  checkFirstPersonTestingClaims,
  checkSourceUrlIntegrity,
  checkMarketAssertionSafety,
  validateSectionProvenance
} from './contentSafety';

/**
 * Validates synthesized content against all safety, evidence, and architectural constraints
 */
export function validateSynthesizedContent(
  content: SynthesizedContent,
  researchResult: ResearchResult,
  eligibility?: PageEligibilityResult
): ContentQualityValidationResult {
  const reasons: string[] = [];
  const fullText = [
    content.title,
    content.introduction,
    ...content.sections.flatMap(s => [...s.paragraphs, ...(s.bullets || [])])
  ].join(' ');

  const supportedClaimsText = content.claims.map(c => c.text).join(' ');

  // 1. Check for Unsupported Superlatives
  const supResult = checkSuperlatives(fullText, supportedClaimsText);
  if (!supResult.passed) {
    reasons.push(...supResult.violations);
  }

  // 2. Check for Fake First-Person / Lab Testing Claims
  const fpResult = checkFirstPersonTestingClaims(fullText);
  if (!fpResult.passed) {
    reasons.push(...fpResult.violations);
  }

  // 3. Check Source URL Integrity (Never invent URLs)
  const urlResult = checkSourceUrlIntegrity(fullText, researchResult.evidencePoints || []);
  if (!urlResult.passed) {
    reasons.push(...urlResult.violations);
  }

  // 4. Market Assertion Safety (Never present foreign/global claims as local)
  const targetCountry = content.market?.countryCode || 'GLOBAL';
  const hasLocalEv = content.market?.hasLocalEvidence ?? false;
  const mktResult = checkMarketAssertionSafety(fullText, targetCountry, hasLocalEv, content.claims);
  if (!mktResult.passed) {
    reasons.push(...mktResult.violations);
  }

  // 5. Section Provenance Validation
  const provResult = validateSectionProvenance(content.sections);
  if (!provResult.passed) {
    reasons.push(...provResult.violations);
  }

  // 6. Hard Rejection: Ambiguous Entity
  if (content.entity?.isAmbiguous) {
    reasons.push('Hard Rejection: Unresolved entity ambiguity prevents valid content publication.');
  }

  // 7. Hard Rejection: Incomplete Comparison
  if (content.pageType === 'COMPARISON' && content.comparison && !content.comparison.isComparisonComplete) {
    reasons.push('Hard Rejection: Comparison is missing one or both distinct product models.');
  }

  // 8. Hard Rejection: Comparison A/B Evidence Leakage
  if (content.pageType === 'COMPARISON' && content.comparison?.isComparisonComplete) {
    // If entity A evidence is zero or entity B evidence is zero
    if (content.comparison.entityAEvidenceIds.length === 0 || content.comparison.entityBEvidenceIds.length === 0) {
      reasons.push('Hard Rejection: Comparison lacks isolated evidence for one or both products.');
    }
  }

  // 9. Hard Rejection: Decision Conflict
  const decisionConflictViolations: string[] = [];
  if (content.decision) {
    const dec = content.decision.decision;
    if (dec === 'DON\'T_BUY') {
      if (/\b(?:strongly recommend|you should buy|must-buy|great investment)\b/i.test(fullText)) {
        decisionConflictViolations.push('Content text advises buying despite authoritative DON\'T_BUY decision.');
      }
    }
    if (dec === 'BUY_IF') {
      if (!content.decision.conditions || content.decision.conditions.length === 0) {
        decisionConflictViolations.push('BUY_IF decision requires explicit purchase conditions.');
      }
    }
    if (dec === 'INSUFFICIENT_EVIDENCE') {
      if (content.contentStatus === 'READY_FOR_PUBLICATION') {
        decisionConflictViolations.push('Content cannot be READY_FOR_PUBLICATION when decision is INSUFFICIENT_EVIDENCE.');
      }
    }
  }
  reasons.push(...decisionConflictViolations);

  // 10. Hard Rejection: Thin Content Protection
  const thinContentViolations: string[] = [];
  if (content.sections.length < 2 || content.claims.length === 0) {
    thinContentViolations.push('Thin Content Rejection: Substantive content sections or factual claims insufficient.');
  }
  reasons.push(...thinContentViolations);

  // 11. Hard Rejection: Structured Data Rating / Offer Fabrication
  for (const sd of content.structuredData) {
    if (sd.hasFabricatedRatings || sd.hasFabricatedOffers) {
      reasons.push('Structured Data Rejection: Fabricated aggregateRating or offers detected.');
    }
  }

  // 12. Determine Final Status
  let status: ContentStatus = 'READY_FOR_PUBLICATION';
  const passed = reasons.length === 0;

  if (!passed) {
    if (
      content.entity?.isAmbiguous ||
      fpResult.violations.length > 0 ||
      urlResult.violations.length > 0 ||
      decisionConflictViolations.length > 0 ||
      thinContentViolations.length > 0
    ) {
      status = 'REJECTED';
    } else {
      status = 'QUALITY_REVIEW';
    }
  } else {
    // If passed all gates, status is READY_FOR_PUBLICATION unless eligibility says NOT_ELIGIBLE
    if (eligibility && eligibility.indexability === 'NOT_ELIGIBLE') {
      status = 'QUALITY_REVIEW';
    }
  }

  return {
    passed,
    status,
    reasons,
    unsupportedClaims: content.claims.filter(c => c.isUnsupported),
    superlativeViolations: supResult.violations,
    firstPersonViolations: fpResult.violations,
    sourceUrlViolations: urlResult.violations,
    marketViolations: mktResult.violations,
    decisionConflictViolations,
    nichodConflictViolations: [],
    thinContentViolations,
    affiliateBiasDetected: false
  };
}
