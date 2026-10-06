/**
 * ProductReviews.review — Research & Evidence Safety Engine
 * Enforces strict zero-fabrication rules: URL validation, currency/price isolation, and foreign claim defense.
 */

import { ClassifiedEvidencePoint } from './evidenceClassifier';

export interface SafetyCheckResult {
  isSafe: boolean;
  violations: string[];
}

/**
 * Validates that no foreign prices or warranties leak into local evidence
 */
export function validateEvidenceSafety(
  evidencePoints: ClassifiedEvidencePoint[],
  targetCountryCode?: string
): SafetyCheckResult {
  const violations: string[] = [];

  for (const ep of evidencePoints) {
    // 1. URL Fabrication Check: No non-http or placeholder fabricated URLs
    if (ep.sourceUrl) {
      if (!ep.sourceUrl.startsWith('http://') && !ep.sourceUrl.startsWith('https://')) {
        violations.push(`Invalid fabricated URL detected on claim ${ep.id}: ${ep.sourceUrl}`);
      }
    }

    // 2. Foreign Price Leakage Check
    if (targetCountryCode && targetCountryCode !== 'GLOBAL') {
      const claimLower = ep.claim.toLowerCase();

      if (targetCountryCode === 'IN') {
        if (ep.claimScope === 'LOCAL' && (claimLower.includes('$') || claimLower.includes('usd') || claimLower.includes('£') || claimLower.includes('€'))) {
          violations.push(`Foreign currency price claim tagged as LOCAL for India: "${ep.claim}"`);
        }
      }

      if (targetCountryCode === 'GB' || targetCountryCode === 'UK') {
        if (ep.claimScope === 'LOCAL' && (claimLower.includes('$') || claimLower.includes('usd') || claimLower.includes('₹') || claimLower.includes('inr'))) {
          violations.push(`Foreign currency price claim tagged as LOCAL for UK: "${ep.claim}"`);
        }
      }

      // 3. Foreign Warranty Leakage Check
      if (ep.claimScope === 'LOCAL' && claimLower.includes('warranty')) {
        if (targetCountryCode === 'IN' && (claimLower.includes('us warranty') || claimLower.includes('uk warranty'))) {
          violations.push(`Foreign warranty claim tagged as LOCAL for India: "${ep.claim}"`);
        }
      }
    }
  }

  return {
    isSafe: violations.length === 0,
    violations
  };
}
