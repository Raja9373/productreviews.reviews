/**
 * ProductReviews.review — Phase 14 Claim & Page Impact Analyzer
 * 
 * Maps source changes to specific evidence points, claims, content sections,
 * production pages, NICHOD conditions, and decision verdicts.
 * Ensures comparison isolation and strict market boundary scoping.
 */

import { IContentRepository } from '../content/store/contentRepository';
import { ContentRecord } from '../content/store/contentStoreTypes';
import { ChangeDetectionResult } from './changeDetector';

export type PageImpactStatus =
  | 'NOT_AFFECTED'
  | 'MONITOR_ONLY'
  | 'REFRESH_RECOMMENDED'
  | 'REFRESH_REQUIRED'
  | 'URGENT_REVIEW'
  | 'MANUAL_REVIEW_REQUIRED';

export type RefreshPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';

export interface PageImpactAssessment {
  recordId: string;
  slug: string;
  title: string;
  pageType: string;
  market: string;
  impactStatus: PageImpactStatus;
  refreshPriority: RefreshPriority;
  affectedClaimIds: string[];
  affectedSectionIndices: number[];
  requiresNichodReevaluation: boolean;
  requiresDecisionReevaluation: boolean;
  isComparisonPage: boolean;
  affectedComparisonSide?: 'PRODUCT_A' | 'PRODUCT_B' | 'BOTH';
  impactRationale: string;
}

export interface BatchImpactAnalysisResult {
  sourceId: string;
  entityId: string;
  totalProductionPagesChecked: number;
  affectedPagesCount: number;
  urgentReviewCount: number;
  refreshRequiredCount: number;
  refreshRecommendedCount: number;
  monitorOnlyCount: number;
  assessments: PageImpactAssessment[];
  highestPriority: RefreshPriority;
}

/**
 * Analyzes impact of an evidence change across repository records
 */
export function analyzeEvidenceChangeImpact(
  change: ChangeDetectionResult,
  repository: IContentRepository
): BatchImpactAnalysisResult {
  const publishedRecords = repository.getPublishedIndexableRecords();
  const assessments: PageImpactAssessment[] = [];

  let urgentReviewCount = 0;
  let refreshRequiredCount = 0;
  let refreshRecommendedCount = 0;
  let monitorOnlyCount = 0;
  let highestPriority: RefreshPriority = 'NONE';

  const updateHighestPriority = (p: RefreshPriority) => {
    const priorityRanks: Record<RefreshPriority, number> = {
      CRITICAL: 4,
      HIGH: 3,
      MEDIUM: 2,
      LOW: 1,
      NONE: 0
    };
    if (priorityRanks[p] > priorityRanks[highestPriority]) {
      highestPriority = p;
    }
  };

  for (const rec of publishedRecords) {
    // 1. Check entity relevance
    const entityName = rec.entity?.name?.toLowerCase() || '';
    const entityModel = rec.entity?.model?.toLowerCase() || '';
    const targetEntity = change.entityId.toLowerCase();

    const isDirectMatch = entityName.includes(targetEntity) || entityModel.includes(targetEntity);
    const isComparison = rec.pageType === 'COMPARISON';

    let isComparisonMatch = false;
    let comparisonSide: 'PRODUCT_A' | 'PRODUCT_B' | 'BOTH' | undefined = undefined;

    if (isComparison) {
      const titleLower = rec.title.toLowerCase();
      if (titleLower.includes(targetEntity)) {
        isComparisonMatch = true;
        comparisonSide = 'PRODUCT_A'; // Standard primary evaluation side
      }
    }

    if (!isDirectMatch && !isComparisonMatch) {
      continue; // Page does not reference changed entity
    }

    // 2. Check Market Isolation
    const pageMarket = rec.market?.countryCode || 'GLOBAL';
    if (change.market !== 'GLOBAL' && pageMarket !== change.market) {
      // Market mismatch (e.g. India price change does not affect US/UK page)
      assessments.push({
        recordId: rec.id,
        slug: rec.slug,
        title: rec.title,
        pageType: rec.pageType,
        market: pageMarket,
        impactStatus: 'NOT_AFFECTED',
        refreshPriority: 'NONE',
        affectedClaimIds: [],
        affectedSectionIndices: [],
        requiresNichodReevaluation: false,
        requiresDecisionReevaluation: false,
        isComparisonPage: isComparison,
        affectedComparisonSide: comparisonSide,
        impactRationale: `Market-scoped change for ${change.market} does not leak into ${pageMarket} page.`
      });
      continue;
    }

    // 3. Determine Claim Impact and Section Indices
    const affectedClaimIds: string[] = [];
    const affectedSectionIndices: number[] = [];

    if (rec.content?.claims) {
      rec.content.claims.forEach((c, idx) => {
        const claimText = (c.text || (c as any).claim || '').toLowerCase();
        if (
          claimText.includes(targetEntity) ||
          c.evidencePointIds.some(id => id.includes(change.sourceId))
        ) {
          affectedClaimIds.push(c.id);
          affectedSectionIndices.push(idx);
        }
      });
    }

    // 4. Determine Impact Status and Refresh Priority
    let impactStatus: PageImpactStatus = 'MONITOR_ONLY';
    let refreshPriority: RefreshPriority = 'LOW';
    let requiresNichod = false;
    let requiresDecision = false;
    let rationale = '';

    if (!change.isMaterial) {
      impactStatus = 'MONITOR_ONLY';
      refreshPriority = 'LOW';
      rationale = 'Non-material or cosmetic source change. Monitored for tracking.';
      monitorOnlyCount++;
    } else if (change.changeType === 'REGULATORY_CHANGE' || change.isContradiction) {
      impactStatus = 'URGENT_REVIEW';
      refreshPriority = 'CRITICAL';
      requiresNichod = true;
      requiresDecision = true;
      rationale = change.isContradiction
        ? 'Severe evidence contradiction detected across authoritative sources.'
        : 'Regulatory compliance or safety alert requires urgent review.';
      urgentReviewCount++;
    } else if (
      change.changeType === 'COMPATIBILITY_CHANGE' ||
      change.changeType === 'SPECIFICATION_CHANGE' ||
      change.changeType === 'PROTOCOL_CHANGE'
    ) {
      impactStatus = 'REFRESH_REQUIRED';
      refreshPriority = 'HIGH';
      requiresNichod = true;
      requiresDecision = true;
      rationale = `Material change in ${change.evidenceCategory}. Factual refresh required.`;
      refreshRequiredCount++;
    } else if (change.changeType === 'PRICE_CHANGE' || change.changeType === 'AVAILABILITY_CHANGE') {
      impactStatus = 'REFRESH_RECOMMENDED';
      refreshPriority = 'MEDIUM';
      requiresNichod = false;
      requiresDecision = true;
      rationale = `Price or stock availability updated for ${pageMarket}. Re-evaluating value proposition.`;
      refreshRecommendedCount++;
    } else {
      impactStatus = 'REFRESH_RECOMMENDED';
      refreshPriority = 'MEDIUM';
      requiresNichod = true;
      rationale = `Updated evidence for ${change.evidenceCategory}.`;
      refreshRecommendedCount++;
    }

    updateHighestPriority(refreshPriority);

    assessments.push({
      recordId: rec.id,
      slug: rec.slug,
      title: rec.title,
      pageType: rec.pageType,
      market: pageMarket,
      impactStatus,
      refreshPriority,
      affectedClaimIds,
      affectedSectionIndices,
      requiresNichodReevaluation: requiresNichod,
      requiresDecisionReevaluation: requiresDecision,
      isComparisonPage: isComparison,
      affectedComparisonSide: comparisonSide,
      impactRationale: rationale
    });
  }

  return {
    sourceId: change.sourceId,
    entityId: change.entityId,
    totalProductionPagesChecked: publishedRecords.length,
    affectedPagesCount: assessments.filter(a => a.impactStatus !== 'NOT_AFFECTED').length,
    urgentReviewCount,
    refreshRequiredCount,
    refreshRecommendedCount,
    monitorOnlyCount,
    assessments,
    highestPriority
  };
}
