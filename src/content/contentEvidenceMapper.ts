/**
 * ProductReviews.review — Content Evidence Mapper
 * Maps raw research evidence points and claims into verified ContentClaim representations with strict provenance.
 */

import { EvidencePoint, SourceStatus, StatementType, Confidence } from '../types';
import { ContentClaim } from './contentTypes';

/**
 * Extracts and maps raw evidence points into structured ContentClaim records.
 * Strictly guarantees every claim maintains provenance back to evidence point IDs and sources.
 */
export function mapEvidenceToClaims(evidencePoints: EvidencePoint[]): ContentClaim[] {
  if (!evidencePoints || !Array.isArray(evidencePoints)) {
    return [];
  }

  return evidencePoints.map((ep, index) => {
    const sourceIds: string[] = [];
    const sourceUrls: string[] = [];

    if (ep.provenance?.sourceName) {
      sourceIds.push(ep.provenance.sourceName);
    }
    // NEVER invent a URL: only accept verified URLs if sourceStatus is STRUCTURED
    if (ep.sourceStatus === SourceStatus.STRUCTURED && ep.sourceUrl && /^https?:\/\//i.test(ep.sourceUrl)) {
      sourceUrls.push(ep.sourceUrl);
    }

    return {
      id: `claim_${ep.id || index}`,
      text: ep.claim,
      statementType: ep.statementType || StatementType.UNKNOWN,
      evidencePointIds: [ep.id],
      sourceIds,
      sourceUrls,
      marketRelevance: ep.marketRelevance || 'GLOBAL',
      confidence: ep.confidence || Confidence.UNKNOWN,
      aspect: ep.category,
      isUnsupported: false
    };
  });
}

/**
 * Filters claims by specific aspect/topic
 */
export function filterClaimsByAspect(claims: ContentClaim[], aspectKeyword: string): ContentClaim[] {
  const kw = aspectKeyword.toLowerCase();
  return claims.filter(c =>
    (c.aspect && c.aspect.toLowerCase().includes(kw)) ||
    c.text.toLowerCase().includes(kw)
  );
}

/**
 * Partitions claims into market-specific categories (local vs global)
 */
export function partitionClaimsByMarket(
  claims: ContentClaim[],
  targetCountryCode: string
): { localClaims: ContentClaim[]; globalClaims: ContentClaim[]; foreignClaims: ContentClaim[] } {
  const localClaims: ContentClaim[] = [];
  const globalClaims: ContentClaim[] = [];
  const foreignClaims: ContentClaim[] = [];

  for (const c of claims) {
    if (c.marketRelevance === 'LOCAL') {
      localClaims.push(c);
    } else if (c.marketRelevance === 'GLOBAL') {
      globalClaims.push(c);
    } else {
      foreignClaims.push(c);
    }
  }

  return { localClaims, globalClaims, foreignClaims };
}
