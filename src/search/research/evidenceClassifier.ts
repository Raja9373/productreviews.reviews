/**
 * ProductReviews.review — Claim-Level Evidence Market Classifier
 * Evaluates individual claims to prevent foreign/global evidence from leaking as local market facts.
 * Enforces zero-fabrication: Never invents URLs, prices, warranties, or source timestamps.
 */

import { EvidencePoint, EvidenceType, Sentiment, StatementType, Confidence, SourceStatus } from '../../types';
import { MarketContext } from '../../questions/context';

export type EvidenceMarketScope = 'LOCAL' | 'REGIONAL' | 'GLOBAL' | 'UNKNOWN';
export type EvidenceFreshness = 'CURRENT' | 'RECENT' | 'DATED' | 'UNKNOWN';

export interface ClassifiedEvidencePoint extends EvidencePoint {
  claimScope: EvidenceMarketScope;
  isLocalPrice: boolean;
  isForeignPrice: boolean;
  freshness: EvidenceFreshness;
  marketSafetyNotice?: string;
}

/**
 * Determines the market scope of a specific claim sentence
 */
export function classifyClaimMarketScope(
  claimText: string,
  sourceCountry?: string,
  targetCountry?: string
): {
  scope: EvidenceMarketScope;
  isLocalPrice: boolean;
  isForeignPrice: boolean;
  safetyNotice?: string;
} {
  const lower = claimText.toLowerCase();

  // Price & Currency detection
  const hasInr = lower.includes('₹') || lower.includes('inr') || lower.includes('rs.') || lower.includes('rupees');
  const hasGbp = lower.includes('£') || lower.includes('gbp') || lower.includes('pounds');
  const hasEur = lower.includes('€') || lower.includes('eur') || lower.includes('euros');
  const hasUsd = lower.includes('$') || lower.includes('usd') || lower.includes('dollars');
  const hasPriceWord = lower.includes('price') || lower.includes('cost') || lower.includes('retails at') || lower.includes('starting at');

  const isPriceClaim = (hasInr || hasGbp || hasEur || hasUsd) && hasPriceWord;

  // Regional power / voltage / network bands
  const isRegionalSpec = (
    lower.includes('voltage') ||
    lower.includes('220v') ||
    lower.includes('110v') ||
    lower.includes('plug type') ||
    lower.includes('lte band') ||
    lower.includes('5g band') ||
    lower.includes('esim only') ||
    lower.includes('sim tray')
  );

  // Warranty & Legal terms
  const isWarrantyClaim = lower.includes('warranty') || lower.includes('guarantee') || lower.includes('return policy') || lower.includes('consumer rights');

  // Availability / store stock
  const isAvailabilityClaim = lower.includes('stock') || lower.includes('available') || lower.includes('shortage') || lower.includes('inventory') || lower.includes('outlet');

  const isMarketDependent = isPriceClaim || isRegionalSpec || isWarrantyClaim || isAvailabilityClaim;

  // Global technical characteristics (camera, processor, battery, display, benchmarks)
  if (!isMarketDependent) {
    return {
      scope: 'GLOBAL',
      isLocalPrice: false,
      isForeignPrice: false
    };
  }

  // If no target country is specified (GLOBAL query)
  if (!targetCountry || targetCountry === 'GLOBAL') {
    return {
      scope: 'GLOBAL',
      isLocalPrice: false,
      isForeignPrice: false
    };
  }

  // Target country is specific (e.g. IN, GB, US, DE)
  if (targetCountry === 'IN') {
    if (hasInr || lower.includes('india') || sourceCountry === 'IN') {
      return { scope: 'LOCAL', isLocalPrice: isPriceClaim, isForeignPrice: false };
    }
    if (isPriceClaim && (hasUsd || hasGbp || hasEur)) {
      return {
        scope: 'GLOBAL', // Do NOT treat foreign currency as India local!
        isLocalPrice: false,
        isForeignPrice: true,
        safetyNotice: 'Foreign currency price cannot be used as verified local Indian selling price.'
      };
    }
  }

  if (targetCountry === 'GB' || targetCountry === 'UK') {
    if (hasGbp || lower.includes('uk') || lower.includes('united kingdom') || sourceCountry === 'GB') {
      return { scope: 'LOCAL', isLocalPrice: isPriceClaim, isForeignPrice: false };
    }
    if (isPriceClaim && (hasUsd || hasEur || hasInr)) {
      return {
        scope: 'GLOBAL',
        isLocalPrice: false,
        isForeignPrice: true,
        safetyNotice: 'Foreign currency price cannot be used as verified local UK selling price.'
      };
    }
  }

  if (targetCountry === 'US') {
    if ((hasUsd && !hasInr && !hasGbp) || lower.includes('usa') || lower.includes('united states') || sourceCountry === 'US') {
      return { scope: 'LOCAL', isLocalPrice: isPriceClaim, isForeignPrice: false };
    }
  }

  // European Union regional markets
  if (['DE', 'FR', 'IT', 'ES', 'NL'].includes(targetCountry)) {
    if (hasEur || lower.includes('europe') || lower.includes('eu') || sourceCountry === targetCountry) {
      return { scope: 'LOCAL', isLocalPrice: isPriceClaim, isForeignPrice: false };
    }
  }

  // Source country unknown or mismatch
  return {
    scope: sourceCountry === targetCountry ? 'LOCAL' : 'UNKNOWN',
    isLocalPrice: false,
    isForeignPrice: isPriceClaim
  };
}

/**
 * Assesses freshness safely without guessing timestamps
 */
export function assessEvidenceFreshness(evidenceDate?: string): EvidenceFreshness {
  if (!evidenceDate) return 'UNKNOWN';

  const parsed = Date.parse(evidenceDate);
  if (isNaN(parsed)) return 'UNKNOWN';

  const ageInDays = (Date.now() - parsed) / (1000 * 60 * 60 * 24);
  if (ageInDays <= 60) return 'CURRENT';
  if (ageInDays <= 365) return 'RECENT';
  return 'DATED';
}

/**
 * Classifies an array of EvidencePoints for a target MarketContext
 */
export function classifyEvidenceForMarket(
  evidencePoints: EvidencePoint[],
  targetMarket?: MarketContext
): ClassifiedEvidencePoint[] {
  const targetCode = targetMarket?.countryCode;

  return evidencePoints.map((ev) => {
    const { scope, isLocalPrice, isForeignPrice, safetyNotice } = classifyClaimMarketScope(
      ev.claim,
      ev.sourceCountry,
      targetCode
    );

    const freshness = assessEvidenceFreshness(ev.evidenceTimestamp);

    // ZERO URL FABRICATION: Ensure no URLs are constructed from sourceTitle
    const safeUrl = ev.sourceUrl && ev.sourceUrl.startsWith('http') ? ev.sourceUrl : undefined;

    return {
      ...ev,
      sourceUrl: safeUrl,
      claimScope: scope,
      isLocalPrice,
      isForeignPrice,
      freshness,
      marketRelevance: scope,
      marketSafetyNotice: safetyNotice
    };
  });
}
