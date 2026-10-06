/**
 * ProductReviews.review — Phase 14 Change Detection & Materiality Classifier
 * 
 * Compares source snapshots and identifies factual, specification, price,
 * compatibility, protocol, firmware, or availability changes while filtering out
 * cosmetic formatting and non-material changes.
 */

import { SourceSnapshot } from './sourceSnapshot';
import { FreshnessEvidenceCategory } from './evidenceSourceRegistry';

export type DetectedChangeType =
  | 'NO_CHANGE'
  | 'NON_MATERIAL_CHANGE'
  | 'MATERIAL_FACT_CHANGE'
  | 'PRICE_CHANGE'
  | 'AVAILABILITY_CHANGE'
  | 'COMPATIBILITY_CHANGE'
  | 'FIRMWARE_SOFTWARE_CHANGE'
  | 'WARRANTY_CHANGE'
  | 'SPECIFICATION_CHANGE'
  | 'REGULATORY_CHANGE'
  | 'PROTOCOL_CHANGE'
  | 'SOURCE_REMOVED'
  | 'SOURCE_UNAVAILABLE'
  | 'SOURCE_CONTRADICTION'
  | 'UNKNOWN_CHANGE';

export interface ChangeDetectionResult {
  hasChanged: boolean;
  isMaterial: boolean;
  changeType: DetectedChangeType;
  sourceId: string;
  entityId: string;
  evidenceCategory: FreshnessEvidenceCategory;
  market: string;
  oldClaimHash?: string;
  newClaimHash?: string;
  summary: string;
  changedFacts: Record<string, { oldValue?: any; newValue?: any }>;
  isContradiction: boolean;
  contradictionDetails?: string;
}

/**
 * Checks if a textual change is merely cosmetic (punctuation, whitespace, casing, tracking params)
 */
export function isCosmeticChange(oldText: string, newText: string): boolean {
  const sanitize = (t: string) =>
    t
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, '')
      .replace(/\s+/g, ' ')
      .replace(/\b(?:utm_[a-z0-9_]+=[^&]+)\b/g, '')
      .trim();

  return sanitize(oldText) === sanitize(newText);
}

/**
 * Detects changes between an existing snapshot and a new incoming snapshot
 */
export function detectSourceChange(
  oldSnapshot: SourceSnapshot | undefined,
  newSnapshot: SourceSnapshot | undefined,
  options: {
    sourceAvailability?: 'ACTIVE' | 'UNAVAILABLE' | 'TEMPORARILY_UNAVAILABLE';
    conflictingSnapshot?: SourceSnapshot;
  } = {}
): ChangeDetectionResult {
  // Case 1: Source Unavailable or Removed
  if (options.sourceAvailability === 'UNAVAILABLE' || options.sourceAvailability === 'TEMPORARILY_UNAVAILABLE') {
    return {
      hasChanged: true,
      isMaterial: false,
      changeType: options.sourceAvailability === 'UNAVAILABLE' ? 'SOURCE_REMOVED' : 'SOURCE_UNAVAILABLE',
      sourceId: oldSnapshot?.sourceId || 'UNKNOWN',
      entityId: oldSnapshot?.entityId || 'UNKNOWN',
      evidenceCategory: oldSnapshot?.evidenceCategory || 'SPECIFICATION',
      market: oldSnapshot?.market || 'GLOBAL',
      summary: `Source status changed to ${options.sourceAvailability}. Existing evidence preserved as fallback.`,
      changedFacts: {},
      isContradiction: false
    };
  }

  // Case 2: New source for entity
  if (!oldSnapshot && newSnapshot) {
    return {
      hasChanged: true,
      isMaterial: true,
      changeType: 'MATERIAL_FACT_CHANGE',
      sourceId: newSnapshot.sourceId,
      entityId: newSnapshot.entityId,
      evidenceCategory: newSnapshot.evidenceCategory,
      market: newSnapshot.market,
      newClaimHash: newSnapshot.normalizedClaimHash,
      summary: 'Initial evidence snapshot captured for entity.',
      changedFacts: {},
      isContradiction: false
    };
  }

  if (!oldSnapshot || !newSnapshot) {
    return {
      hasChanged: false,
      isMaterial: false,
      changeType: 'NO_CHANGE',
      sourceId: 'UNKNOWN',
      entityId: 'UNKNOWN',
      evidenceCategory: 'SPECIFICATION',
      market: 'GLOBAL',
      summary: 'No snapshot available to compare.',
      changedFacts: {},
      isContradiction: false
    };
  }

  // Case 3: Contradiction with external conflicting snapshot
  if (options.conflictingSnapshot) {
    return {
      hasChanged: true,
      isMaterial: true,
      changeType: 'SOURCE_CONTRADICTION',
      sourceId: newSnapshot.sourceId,
      entityId: newSnapshot.entityId,
      evidenceCategory: newSnapshot.evidenceCategory,
      market: newSnapshot.market,
      oldClaimHash: oldSnapshot.normalizedClaimHash,
      newClaimHash: newSnapshot.normalizedClaimHash,
      summary: 'Contradiction detected between active evidence source and external snapshot.',
      changedFacts: {},
      isContradiction: true,
      contradictionDetails: `Source ${newSnapshot.sourceId} conflicts with ${options.conflictingSnapshot.sourceId}`
    };
  }

  // Case 4: Identical Hashes -> NO_CHANGE
  if (
    oldSnapshot.normalizedClaimHash === newSnapshot.normalizedClaimHash &&
    oldSnapshot.structuredDataHash === newSnapshot.structuredDataHash
  ) {
    return {
      hasChanged: false,
      isMaterial: false,
      changeType: 'NO_CHANGE',
      sourceId: newSnapshot.sourceId,
      entityId: newSnapshot.entityId,
      evidenceCategory: newSnapshot.evidenceCategory,
      market: newSnapshot.market,
      oldClaimHash: oldSnapshot.normalizedClaimHash,
      newClaimHash: newSnapshot.normalizedClaimHash,
      summary: 'Source content and structured key facts are strictly identical.',
      changedFacts: {},
      isContradiction: false
    };
  }

  // Case 5: Textual difference check for cosmetic / non-material changes
  const oldCombined = oldSnapshot.evidenceItems.map(e => e.claimText).join(' ');
  const newCombined = newSnapshot.evidenceItems.map(e => e.claimText).join(' ');

  if (isCosmeticChange(oldCombined, newCombined) && oldSnapshot.structuredDataHash === newSnapshot.structuredDataHash) {
    return {
      hasChanged: true,
      isMaterial: false,
      changeType: 'NON_MATERIAL_CHANGE',
      sourceId: newSnapshot.sourceId,
      entityId: newSnapshot.entityId,
      evidenceCategory: newSnapshot.evidenceCategory,
      market: newSnapshot.market,
      oldClaimHash: oldSnapshot.normalizedClaimHash,
      newClaimHash: newSnapshot.normalizedClaimHash,
      summary: 'Non-material change detected (cosmetic punctuation/whitespace/formatting).',
      changedFacts: {},
      isContradiction: false
    };
  }

  // Case 6: Material fact extraction by evidence category
  const changedFacts: Record<string, { oldValue?: any; newValue?: any }> = {};
  const oldFacts = oldSnapshot.evidenceItems[0]?.keyFacts || {};
  const newFacts = newSnapshot.evidenceItems[0]?.keyFacts || {};

  for (const [k, v] of Object.entries(newFacts)) {
    if (oldFacts[k] !== v) {
      changedFacts[k] = { oldValue: oldFacts[k], newValue: v };
    }
  }

  let changeType: DetectedChangeType = 'MATERIAL_FACT_CHANGE';
  switch (newSnapshot.evidenceCategory) {
    case 'PRICE':
      changeType = 'PRICE_CHANGE';
      break;
    case 'AVAILABILITY':
      changeType = 'AVAILABILITY_CHANGE';
      break;
    case 'COMPATIBILITY':
      changeType = 'COMPATIBILITY_CHANGE';
      break;
    case 'FIRMWARE':
    case 'SOFTWARE_SUPPORT':
      changeType = 'FIRMWARE_SOFTWARE_CHANGE';
      break;
    case 'WARRANTY':
      changeType = 'WARRANTY_CHANGE';
      break;
    case 'SPECIFICATION':
    case 'BENCHMARK':
      changeType = 'SPECIFICATION_CHANGE';
      break;
    case 'PROTOCOL':
      changeType = 'PROTOCOL_CHANGE';
      break;
    case 'REGULATORY':
      changeType = 'REGULATORY_CHANGE';
      break;
    default:
      changeType = 'MATERIAL_FACT_CHANGE';
  }

  return {
    hasChanged: true,
    isMaterial: true,
    changeType,
    sourceId: newSnapshot.sourceId,
    entityId: newSnapshot.entityId,
    evidenceCategory: newSnapshot.evidenceCategory,
    market: newSnapshot.market,
    oldClaimHash: oldSnapshot.normalizedClaimHash,
    newClaimHash: newSnapshot.normalizedClaimHash,
    summary: `Material change detected in ${newSnapshot.evidenceCategory} for entity ${newSnapshot.entityId}.`,
    changedFacts,
    isContradiction: false
  };
}
