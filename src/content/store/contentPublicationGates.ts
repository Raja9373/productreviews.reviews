/**
 * ProductReviews.review — Content Publication Gates & Validation Architecture
 * Enforces explicit approval, publication gates, slug safety,
 * duplicate intent prevention, and freshness evaluation.
 */

import {
  ContentRecord,
  PublicationGateResult,
  ContentIndexabilityState,
  ContentFreshnessState
} from './contentStoreTypes';
import { BASE_CANONICAL_URL } from '../../seo/metaManager';

/**
 * Generates an immutable, SEO-safe, collision-resistant canonical slug
 */
export function generateContentSlug(
  entityName: string | undefined,
  pageType: string,
  useCase?: string,
  marketCountry: string = 'GLOBAL'
): string {
  const parts: string[] = [];

  const cleanEntity = (entityName || 'product')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  parts.push(cleanEntity);

  const cleanType = pageType.toLowerCase().replace(/_/g, '-');
  if (cleanType !== 'product-review' && cleanType !== 'product-research') {
    parts.push(cleanType);
  }

  if (useCase && useCase !== 'general') {
    const cleanUc = useCase.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    if (cleanUc) parts.push(cleanUc);
  }

  if (marketCountry && marketCountry !== 'GLOBAL') {
    parts.push(marketCountry.toLowerCase());
  }

  return parts.join('-');
}

/**
 * Builds canonical URL for a content record
 */
export function buildCanonicalUrlForRecord(slug: string): string {
  return `${BASE_CANONICAL_URL}/review/${slug}`;
}

/**
 * Evaluates whether a content record meets the strict criteria to be APPROVED
 */
export function canApproveContent(record: ContentRecord): { allowed: boolean; reasons: string[]; blockers: string[] } {
  const blockers: string[] = [];
  const reasons: string[] = [];

  // 1. Must satisfy Phase 4 eligibility candidate status
  if (record.content.indexability !== 'ELIGIBLE_CANDIDATE') {
    blockers.push(`Phase 4 eligibility is ${record.content.indexability}`);
  }

  // 2. Must satisfy Phase 5 content status
  if (record.content.contentStatus === 'REJECTED') {
    blockers.push('Phase 5 content status is REJECTED');
  }

  // 3. Entity identity must not be ambiguous
  if (record.entity?.isAmbiguous) {
    blockers.push('Entity identity is ambiguous');
  }

  // 4. Comparison must have both entities verified
  if (record.pageType === 'COMPARISON') {
    if (!record.content.comparison?.isComparisonComplete) {
      blockers.push('Comparison requires two verified distinct entities');
    }
  }

  // 5. Must have substantive claims
  if (!record.content.claims || record.content.claims.length === 0) {
    blockers.push('Record has zero verified factual claims');
  }

  // 6. Must not have decision conflicts
  if (record.decisionSnapshot?.decision === 'INSUFFICIENT_EVIDENCE') {
    blockers.push('Decision Engine returned INSUFFICIENT_EVIDENCE');
  }

  // 7. Check for fake test claims or unsupported superlatives
  const fullText = [
    record.title,
    record.content.introduction,
    ...record.content.sections.flatMap(s => [...s.paragraphs, ...(s.bullets || [])])
  ].join(' ');

  if (/\b(?:we tested|our lab found|in our hands-on test)\b/i.test(fullText)) {
    blockers.push('Contains unverified hands-on laboratory testing claims');
  }

  if (/\b(?:world's best|#1|number one)\b/i.test(fullText)) {
    blockers.push('Contains unsupported superlatives');
  }

  const allowed = blockers.length === 0;
  if (allowed) {
    reasons.push('All content quality, evidence provenance, and architectural gates satisfied.');
  }

  return { allowed, reasons, blockers };
}

/**
 * Evaluates whether an APPROVED content record can be PUBLISHED to production
 */
export function canPublishContent(record: ContentRecord): PublicationGateResult {
  const blockers: string[] = [];
  const reasons: string[] = [];

  // Gate 1: Must already be in APPROVED status or undergo approval check
  const approvalCheck = canApproveContent(record);
  if (!approvalCheck.allowed) {
    blockers.push(...approvalCheck.blockers);
  }

  // Gate 2: Cannot publish DRAFT, REJECTED, or ARCHIVED directly (must be APPROVED or PUBLISHED)
  if (record.status !== 'APPROVED' && record.status !== 'PUBLISHED') {
    blockers.push(`Content is in ${record.status} state. Only APPROVED content can be published.`);
  }

  // Gate 3: Canonical URL and Slug must be valid
  if (!record.slug || record.slug.length < 3) {
    blockers.push('Invalid or empty content slug.');
  }
  if (!record.canonicalUrl.startsWith(BASE_CANONICAL_URL)) {
    blockers.push('Canonical URL does not match canonical host https://productreviews.review');
  }

  // Gate 4: Market context integrity (Local assertions require verified local evidence)
  if (record.market?.countryCode !== 'GLOBAL' && !record.market?.hasLocalEvidence) {
    const fullText = record.content.sections.flatMap(s => s.paragraphs).join(' ');
    if (record.market?.currency && fullText.includes(record.market.currency)) {
      blockers.push(`Local currency ${record.market.currency} claimed without local market evidence.`);
    }
  }

  // Gate 5: Structured Data must not fabricate ratings or offers
  if (record.schema) {
    for (const sd of record.schema) {
      if (sd.hasFabricatedRatings || sd.hasFabricatedOffers) {
        blockers.push('Structured data contains fabricated ratings or offers.');
      }
    }
  }

  const allowed = blockers.length === 0;
  const status = allowed ? 'PUBLISHED' : record.status;
  const indexability: ContentIndexabilityState = allowed ? 'INDEX_CANDIDATE' : 'NOINDEX';

  if (allowed) {
    reasons.push('Record satisfies all safety gates and is verified for production publication.');
  }

  return {
    allowed,
    status,
    indexability,
    reasons,
    blockers
  };
}

/**
 * Determines final SEO Indexability state for a published record
 */
export function resolveIndexability(record: ContentRecord): ContentIndexabilityState {
  if (record.status !== 'PUBLISHED') {
    return 'NOINDEX';
  }

  const pubCheck = canPublishContent(record);
  if (!pubCheck.allowed) {
    return 'NOINDEX';
  }

  if (record.content.indexability !== 'ELIGIBLE_CANDIDATE') {
    return 'NOINDEX';
  }

  return 'INDEX_CANDIDATE';
}

/**
 * Evaluates whether a content record is stale or requires re-research
 */
export function needsContentRefresh(record: ContentRecord): {
  isRefreshNeeded: boolean;
  freshnessState: ContentFreshnessState;
  reasons: string[];
} {
  const reasons: string[] = [];
  const now = Date.now();
  const capturedTime = record.evidenceSnapshot?.capturedAt
    ? new Date(record.evidenceSnapshot.capturedAt).getTime()
    : 0;

  const ageInDays = (now - capturedTime) / (1000 * 60 * 60 * 24);

  let freshnessState: ContentFreshnessState = 'CURRENT';

  // Volatile intents (Price, Availability) become review-recommended after 30 days
  if (record.pageType === 'PRICE_VALUE' || record.pageType === 'AVAILABILITY_GUIDE') {
    if (ageInDays > 30) {
      freshnessState = 'REVIEW_RECOMMENDED';
      reasons.push('Price and availability evidence is older than 30 days.');
    }
    if (ageInDays > 90) {
      freshnessState = 'STALE';
      reasons.push('Price/availability evidence is older than 90 days.');
    }
  } else if (ageInDays > 365) {
    freshnessState = 'STALE';
    reasons.push('Product evidence snapshot is older than 365 days.');
  } else if (ageInDays > 180) {
    freshnessState = 'REVIEW_RECOMMENDED';
    reasons.push('Product evidence snapshot is older than 180 days.');
  }

  return {
    isRefreshNeeded: freshnessState === 'STALE' || freshnessState === 'REVIEW_RECOMMENDED',
    freshnessState,
    reasons
  };
}
