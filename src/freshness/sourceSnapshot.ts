/**
 * ProductReviews.review — Phase 14 Source Snapshot Model
 * 
 * Captures lightweight, normalized, deterministic snapshots of source evidence
 * to enable fast change detection without storing raw copyrighted web payloads.
 */

import { FreshnessEvidenceCategory } from './evidenceSourceRegistry';

export interface SourceEvidenceItem {
  claimId: string;
  claimText: string;
  keyFacts: Record<string, string | number | boolean>;
  verificationDate?: string;
}

export interface SourceSnapshot {
  snapshotId: string;
  sourceId: string;
  entityId: string;
  market: string;
  sourceCountry: string;
  evidenceCategory: FreshnessEvidenceCategory;
  retrievedAt: string;
  effectiveDate?: string;
  structuredDataHash: string;
  normalizedClaimHash: string;
  evidenceItems: SourceEvidenceItem[];
  version?: number;
}

/**
 * Computes deterministic hash for normalized claim strings
 */
export function computeDeterministicHash(input: string): string {
  let hash = 5381;
  const normalized = input.trim().toLowerCase().replace(/\s+/g, ' ');
  for (let i = 0; i < normalized.length; i++) {
    hash = ((hash << 5) + hash) + normalized.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  return `hash_${Math.abs(hash).toString(16)}`;
}

/**
 * Creates a normalized source snapshot from evidence items
 */
export function createSourceSnapshot(
  sourceId: string,
  entityId: string,
  evidenceCategory: FreshnessEvidenceCategory,
  evidenceItems: SourceEvidenceItem[],
  options: {
    market?: string;
    sourceCountry?: string;
    effectiveDate?: string;
    version?: number;
  } = {}
): SourceSnapshot {
  const normalizedText = evidenceItems
    .map(item => item.claimText.trim().toLowerCase().replace(/\s+/g, ' '))
    .sort()
    .join('||');

  const normalizedClaimHash = computeDeterministicHash(normalizedText);

  const factsJson = JSON.stringify(
    evidenceItems.map(item => item.keyFacts).sort()
  );
  const structuredDataHash = computeDeterministicHash(factsJson);

  return {
    snapshotId: `snap_${sourceId}_${entityId}_${Date.now()}`,
    sourceId,
    entityId,
    market: options.market || 'GLOBAL',
    sourceCountry: options.sourceCountry || 'GLOBAL',
    evidenceCategory,
    retrievedAt: new Date().toISOString(),
    effectiveDate: options.effectiveDate,
    structuredDataHash,
    normalizedClaimHash,
    evidenceItems,
    version: options.version || 1
  };
}
