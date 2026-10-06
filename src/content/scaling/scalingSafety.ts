/**
 * ProductReviews.review — Scaling Safety & Batch Abort Controller
 * Enforces deterministic batch thresholds, systemic failure abort triggers,
 * category concentration warnings, and sitemap integrity guardrails.
 */

import { ScalingCandidate } from './contentHealthTypes';
import { IContentRepository } from '../store/contentRepository';
import { getCanonicalSitemapEntries } from '../../seo/sitemapGenerator';

export const SCALING_SAFETY_CONSTANTS = {
  MAX_BATCH_SIZE: 100,
  PILOT_BATCH_SIZE: 25,
  SYSTEMIC_FAILURE_THRESHOLD: 0.10, // 10% for identical systemic fault
  DUPLICATE_RATE_THRESHOLD: 0.50,   // 50% duplicate intent threshold
  CATEGORY_CONCENTRATION_THRESHOLD: 0.90 // 90% in single category triggers warning
} as const;

export interface CategoryConcentrationResult {
  category: string;
  percentage: number;
  isConcentrated: boolean;
}

/**
 * Checks category concentration in a pool of candidates
 */
export function checkCategoryConcentration(candidates: ScalingCandidate[]): CategoryConcentrationResult | undefined {
  if (candidates.length === 0) return undefined;

  const counts: Record<string, number> = {};
  for (const c of candidates) {
    const cat = c.masterQuestion.productCategory || 'general';
    counts[cat] = (counts[cat] || 0) + 1;
  }

  let highestCat = '';
  let highestCount = 0;
  for (const [cat, count] of Object.entries(counts)) {
    if (count > highestCount) {
      highestCount = count;
      highestCat = cat;
    }
  }

  const percentage = highestCount / candidates.length;
  const isConcentrated = percentage >= SCALING_SAFETY_CONSTANTS.CATEGORY_CONCENTRATION_THRESHOLD;

  return {
    category: highestCat,
    percentage,
    isConcentrated
  };
}

export function isSystemicSafetyIssue(reason: string): boolean {
  const lower = reason.toLowerCase();
  return (
    lower.includes('fabricated') ||
    lower.includes('fake') ||
    lower.includes('market leakage') ||
    lower.includes('superlative') ||
    lower.includes('conflict') ||
    lower.includes('sitemap') ||
    lower.includes('collision') ||
    lower.includes('unverified source url')
  );
}

/**
 * Evaluates whether a batch must be PAUSED due to systemic safety failures
 */
export function evaluateSystemicFailureAbort(
  rejectionReasons: string[],
  totalCandidates: number
): { shouldPause: boolean; pauseReason?: string } {
  if (totalCandidates === 0) return { shouldPause: false };

  // Count identical failure reasons
  const reasonCounts: Record<string, number> = {};
  for (const reason of rejectionReasons) {
    reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
  }

  for (const [reason, count] of Object.entries(reasonCounts)) {
    if (!isSystemicSafetyIssue(reason)) continue;
    const rate = count / totalCandidates;
    if (rate >= SCALING_SAFETY_CONSTANTS.SYSTEMIC_FAILURE_THRESHOLD) {
      return {
        shouldPause: true,
        pauseReason: `Systemic safety failure threshold exceeded: ${(rate * 100).toFixed(1)}% of candidates failed with reason: "${reason}".`
      };
    }
  }

  return { shouldPause: false };
}

/**
 * Verifies sitemap integrity for published records
 */
export function verifySitemapIntegrity(repository: IContentRepository): {
  isValid: boolean;
  publishedCount: number;
  sitemapCount: number;
  error?: string;
} {
  const publishedIndexable = repository.getPublishedIndexableRecords();
  const sitemapEntries = getCanonicalSitemapEntries();
  const reviewSitemapEntries = sitemapEntries.filter(s => s.loc.includes('/review/'));

  const sitemapUrls = reviewSitemapEntries.map(s => s.loc);
  const uniqueSitemap = new Set(sitemapUrls);

  if (sitemapUrls.length !== uniqueSitemap.size) {
    return {
      isValid: false,
      publishedCount: publishedIndexable.length,
      sitemapCount: reviewSitemapEntries.length,
      error: `Duplicate URLs detected in canonical XML sitemap (${sitemapUrls.length} total, ${uniqueSitemap.size} unique).`
    };
  }

  if (publishedIndexable.length !== reviewSitemapEntries.length) {
    return {
      isValid: false,
      publishedCount: publishedIndexable.length,
      sitemapCount: reviewSitemapEntries.length,
      error: `Sitemap count mismatch: ${publishedIndexable.length} published records vs ${reviewSitemapEntries.length} sitemap URLs.`
    };
  }

  for (const rec of publishedIndexable) {
    if (!uniqueSitemap.has(rec.canonicalUrl)) {
      return {
        isValid: false,
        publishedCount: publishedIndexable.length,
        sitemapCount: reviewSitemapEntries.length,
        error: `Published indexable record ${rec.id} (${rec.canonicalUrl}) is missing from canonical sitemap.`
      };
    }
  }

  return {
    isValid: true,
    publishedCount: publishedIndexable.length,
    sitemapCount: reviewSitemapEntries.length
  };
}
