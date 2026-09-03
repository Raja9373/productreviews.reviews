import { EntityItem, ParsedQuery } from '../types';
import { NormalizedEntity } from './types';

export class EvidenceRankingEngine {
  /**
   * Ranks discovered entities purely based on query relevance and factual completeness.
   * Affiliate commission explicitly has 0 influence on ranking.
   */
  static rankAndMapToEntityItems(
    entities: NormalizedEntity[],
    parsedQuery: ParsedQuery
  ): EntityItem[] {
    if (entities.length === 0) return [];

    const queryTokens = parsedQuery.cleanQuery
      .toLowerCase()
      .split(/\s+/)
      .filter((t) => t.length > 2 && !['best', 'under', 'for', 'top', 'the'].includes(t));

    const scored = entities.map((entity) => {
      let score = 0;
      const entityText = (
        entity.canonicalName +
        ' ' +
        (entity.brand || '') +
        ' ' +
        entity.explanation +
        ' ' +
        Object.values(entity.specs).join(' ')
      ).toLowerCase();

      // 1. Exact name match bonus
      if (entity.canonicalName.toLowerCase() === parsedQuery.cleanQuery.toLowerCase()) {
        score += 100;
      }

      // 2. Token overlap score
      for (const token of queryTokens) {
        if (entityText.includes(token)) {
          score += 15;
        }
      }

      // 3. Technical specification completeness
      const specCount = Object.keys(entity.specs).length;
      score += Math.min(specCount * 2, 20);

      // 4. Provenance depth
      score += Math.min(entity.provenance.length * 5, 15);

      return { entity, score };
    });

    // Sort descending by factual relevance score
    scored.sort((a, b) => b.score - a.score);

    // Map to final EntityItem model
    return scored.map(({ entity }, index) => {
      // Conservative badges per Phase 3 Section 8:
      // Only display BEST OVERALL when there is sufficient evidence and explicit scoring separation
      // Otherwise use 'Recommended option' or 'Relevant option'
      let badge = 'Relevant option';
      if (
        scored.length > 1 &&
        index === 0 &&
        scored[0].score >= 60 &&
        scored[0].score > (scored[1]?.score || 0) + 15
      ) {
        badge = 'BEST OVERALL';
      } else if (index === 0) {
        badge = 'Recommended option';
      } else {
        badge = 'Relevant option';
      }

      // Map primary action per Phase 3 Section 13 & 19
      let actionLabel = 'View Official Details';
      let actionUrl = entity.officialUrl || entity.provenance[0]?.sourceUrl || '#';
      let isAffiliate = false;
      let merchant: string | undefined = undefined;

      if (entity.domain === 'PRODUCT') {
        // Honest search fallback link per Section 3 & 19
        actionLabel = 'Search on Amazon';
        actionUrl = `/api/affiliate/redirect?market=${entity.market}&q=${encodeURIComponent(
          entity.canonicalName
        )}`;
        isAffiliate = true;
        merchant = 'Amazon';
      } else if (entity.domain === 'SOFTWARE') {
        actionLabel = 'Visit Official Website';
        actionUrl = entity.officialUrl || entity.provenance[0]?.sourceUrl || `https://www.google.com/search?q=${encodeURIComponent(entity.canonicalName + ' official software')}`;
      } else if (entity.domain === 'VEHICLE') {
        actionLabel = 'View Manufacturer Portal';
        actionUrl = entity.officialUrl || entity.provenance[0]?.sourceUrl || `https://www.google.com/search?q=${encodeURIComponent(entity.canonicalName + ' official')}`;
      } else if (entity.domain === 'EDUCATION') {
        actionLabel = 'Visit Institution Portal';
        actionUrl = entity.officialUrl || entity.provenance[0]?.sourceUrl || `https://www.google.com/search?q=${encodeURIComponent(entity.canonicalName)}`;
      } else if (entity.domain === 'PLACE' || entity.domain === 'LOCAL' || entity.domain === 'SERVICE') {
        actionLabel = 'View Directory Entry';
        actionUrl = entity.provenance[0]?.sourceUrl || `https://www.google.com/search?q=${encodeURIComponent(entity.canonicalName)}`;
      }

      return {
        id: entity.id,
        slug: entity.slug,
        name: entity.canonicalName,
        brand: entity.brand,
        domain: entity.domain,
        badge,
        explanation: entity.explanation,
        pros: entity.pros,
        drawback: entity.drawback,
        price: entity.price,
        specs: entity.specs,
        image: entity.image
          ? {
              url: entity.image.url,
              alt: entity.image.alt,
              isVerified: entity.image.isVerified,
            }
          : undefined,
        action: {
          type: entity.domain === 'PRODUCT' ? 'CHECK_PRICE' : 'VISIT_OFFICIAL',
          label: actionLabel,
          url: actionUrl,
          isAffiliate,
          merchant,
        },
        sources: entity.provenance.map((p) => ({
          title: p.sourceName,
          url: p.sourceUrl,
          domain: p.sourceUrl ? new URL(p.sourceUrl).hostname : undefined,
        })),
        evidence: entity.evidence,
        provenance: entity.provenance,
        rating: entity.rating,
        reviewCount: entity.reviewCount,
        officialUrl: entity.officialUrl,
        retailerUrl: entity.retailerUrl,
      };
    });
  }
}
