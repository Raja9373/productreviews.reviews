/**
 * ProductReviews.review — Market Research Resolver
 * Synthesizes classified evidence into transparent market coverage status and missing-evidence limitations.
 */

import { ClassifiedEvidencePoint } from './evidenceClassifier';
import { MarketContext } from '../../questions/context';
import { ResearchContext } from './researchContext';

export type MarketCoverageStatus =
  | 'LOCAL_EVIDENCE_AVAILABLE'
  | 'LOCAL_EVIDENCE_LIMITED'
  | 'LOCAL_EVIDENCE_UNAVAILABLE'
  | 'GLOBAL_ONLY'
  | 'MIXED';

export interface MarketResearchResolution {
  coverageStatus: MarketCoverageStatus;
  localEvidencePoints: ClassifiedEvidencePoint[];
  globalEvidencePoints: ClassifiedEvidencePoint[];
  regionalEvidencePoints: ClassifiedEvidencePoint[];
  unknownEvidencePoints: ClassifiedEvidencePoint[];
  missingMarketEvidence: string[];
  marketLimitations: string[];
}

/**
 * Evaluates classified evidence points against the target research context
 */
export function resolveMarketResearchCoverage(
  classifiedEvidence: ClassifiedEvidencePoint[],
  researchContext: ResearchContext
): MarketResearchResolution {
  const targetCountry = researchContext.market.countryCode;
  const isGlobalQuery = !targetCountry || targetCountry === 'GLOBAL';

  const localPoints = classifiedEvidence.filter((e) => e.claimScope === 'LOCAL');
  const globalPoints = classifiedEvidence.filter((e) => e.claimScope === 'GLOBAL');
  const regionalPoints = classifiedEvidence.filter((e) => e.claimScope === 'REGIONAL');
  const unknownPoints = classifiedEvidence.filter((e) => e.claimScope === 'UNKNOWN');

  const missingMarketEvidence: string[] = [];
  const marketLimitations: string[] = [];

  let coverageStatus: MarketCoverageStatus = 'GLOBAL_ONLY';

  if (isGlobalQuery) {
    coverageStatus = 'GLOBAL_ONLY';
  } else {
    // Check local evidence coverage
    const hasLocalPrice = localPoints.some((e) => e.isLocalPrice);
    const hasLocalWarranty = localPoints.some((e) => e.claim.toLowerCase().includes('warranty'));
    const hasLocalAvailability = localPoints.some((e) => e.claim.toLowerCase().includes('available') || e.claim.toLowerCase().includes('stock'));

    if (!hasLocalPrice) {
      missingMarketEvidence.push(`${researchContext.market.marketName}-specific retail pricing`);
      marketLimitations.push(`Verified ${researchContext.market.marketName} price in ${researchContext.market.currency || 'local currency'} was not established from available evidence.`);
    }

    if (!hasLocalWarranty) {
      missingMarketEvidence.push(`${researchContext.market.marketName} manufacturer warranty and local service network`);
    }

    if (!hasLocalAvailability) {
      missingMarketEvidence.push(`Direct authorized retailer stock status in ${researchContext.market.marketName}`);
    }

    if (localPoints.length >= 3) {
      coverageStatus = globalPoints.length > 0 ? 'MIXED' : 'LOCAL_EVIDENCE_AVAILABLE';
    } else if (localPoints.length > 0) {
      coverageStatus = 'LOCAL_EVIDENCE_LIMITED';
    } else {
      coverageStatus = 'LOCAL_EVIDENCE_UNAVAILABLE';
      marketLimitations.push(`Direct local evidence for ${researchContext.market.marketName} is currently unavailable; findings are grounded in verified global specifications.`);
    }
  }

  return {
    coverageStatus,
    localEvidencePoints: localPoints,
    globalEvidencePoints: globalPoints,
    regionalEvidencePoints: regionalPoints,
    unknownEvidencePoints: unknownPoints,
    missingMarketEvidence,
    marketLimitations
  };
}
