/**
 * ProductReviews.review — Evidence Market Context & Boundary Engine
 * Enforces strict market boundaries on evidence points to prevent cross-border misrepresentation.
 * Zero-fabrication: If local evidence is absent, preserves UNKNOWN/GLOBAL status without inventing local facts.
 */

import { EvidencePoint } from '../../types';
import { MarketContext } from './marketContext';

export interface MarketSegregatedEvidence {
  localEvidence: EvidencePoint[];
  regionalEvidence: EvidencePoint[];
  globalEvidence: EvidencePoint[];
  unknownEvidence: EvidencePoint[];
  hasSufficientLocalEvidence: boolean;
  marketNotice?: string;
}

/**
 * Assesses the market relevance of an EvidencePoint relative to a target MarketContext
 */
export function tagEvidenceMarket(
  evidence: EvidencePoint,
  targetMarket: MarketContext
): EvidencePoint {
  if (targetMarket.countryCode === 'GLOBAL') {
    return {
      ...evidence,
      evidenceMarket: 'GLOBAL',
      marketRelevance: 'GLOBAL'
    };
  }

  // Check publisher domain / url TLD
  const url = evidence.sourceUrl || '';
  const publisher = (evidence.sourcePublisher || '').toLowerCase();
  const claimLower = evidence.claim.toLowerCase();

  let sourceCountry = evidence.sourceCountry;
  let marketRelevance: 'LOCAL' | 'REGIONAL' | 'GLOBAL' | 'UNKNOWN' = 'GLOBAL';

  if (url.includes('.in') || publisher.includes('.in') || claimLower.includes('inr') || claimLower.includes('india')) {
    sourceCountry = 'IN';
    marketRelevance = targetMarket.countryCode === 'IN' ? 'LOCAL' : 'REGIONAL';
  } else if (url.includes('.co.uk') || publisher.includes('.co.uk') || claimLower.includes('gbp') || claimLower.includes('uk price')) {
    sourceCountry = 'GB';
    marketRelevance = (targetMarket.countryCode === 'GB' || targetMarket.countryCode === 'UK') ? 'LOCAL' : 'REGIONAL';
  } else if (url.includes('.de') || publisher.includes('.de') || claimLower.includes('deutschland')) {
    sourceCountry = 'DE';
    marketRelevance = targetMarket.countryCode === 'DE' ? 'LOCAL' : (targetMarket.region === 'European Union' ? 'REGIONAL' : 'GLOBAL');
  } else if (url.includes('.ca') || publisher.includes('.ca') || claimLower.includes('canada')) {
    sourceCountry = 'CA';
    marketRelevance = targetMarket.countryCode === 'CA' ? 'LOCAL' : 'REGIONAL';
  } else if (url.includes('.jp') || publisher.includes('.jp') || claimLower.includes('japan')) {
    sourceCountry = 'JP';
    marketRelevance = targetMarket.countryCode === 'JP' ? 'LOCAL' : 'REGIONAL';
  } else if (url.includes('.com') || publisher.includes('us') || claimLower.includes('usd') || claimLower.includes('$')) {
    sourceCountry = 'US';
    marketRelevance = targetMarket.countryCode === 'US' ? 'LOCAL' : 'GLOBAL';
  }

  return {
    ...evidence,
    sourceCountry: sourceCountry || evidence.sourceCountry,
    evidenceMarket: sourceCountry || 'GLOBAL',
    marketRelevance
  };
}

/**
 * Segregates an array of EvidencePoints by market boundary
 */
export function segregateEvidenceByMarket(
  evidence: EvidencePoint[],
  targetMarket: MarketContext
): MarketSegregatedEvidence {
  const tagged = evidence.map((e) => tagEvidenceMarket(e, targetMarket));

  const localEvidence = tagged.filter((e) => e.marketRelevance === 'LOCAL');
  const regionalEvidence = tagged.filter((e) => e.marketRelevance === 'REGIONAL');
  const globalEvidence = tagged.filter((e) => e.marketRelevance === 'GLOBAL');
  const unknownEvidence = tagged.filter((e) => e.marketRelevance === 'UNKNOWN' || !e.marketRelevance);

  const hasSufficientLocal = targetMarket.countryCode === 'GLOBAL' || localEvidence.length >= 2;
  const marketNotice = !hasSufficientLocal && targetMarket.countryCode !== 'GLOBAL'
    ? `Notice: Direct local test evidence for ${targetMarket.marketName} is limited; conclusions are grounded in verified global specifications and editorial testing.`
    : undefined;

  return {
    localEvidence,
    regionalEvidence,
    globalEvidence,
    unknownEvidence,
    hasSufficientLocalEvidence: hasSufficientLocal,
    marketNotice
  };
}
