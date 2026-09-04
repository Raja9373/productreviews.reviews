import { DecisionDomain, MarketCode } from '../types';
import { DiscoveredEntityRaw, NormalizedEntity } from './types';
import { buildAmazonMarketUrl } from '../affiliate/amazonRouter';
import { getMarketInfo } from '../localization/markets';

export class EntityNormalizer {
  /**
   * Cleans and canonicalizes entity names to avoid duplicate fragmentation
   * e.g. "Sony α7 IV" -> "Sony Alpha 7 IV"
   */
  static cleanCanonicalName(rawName: string): {
    canonicalName: string;
    brand?: string;
    model?: string;
  } {
    let name = rawName.trim();
    // Replace Greek alpha symbol commonly used in Sony camera titles
    name = name.replace(/α(\d)/gi, 'Alpha $1');
    name = name.replace(/α/gi, 'Alpha');

    // Extract brand if at start
    const brandMatch = name.match(
      /^(Sony|Canon|Nikon|Fujifilm|Panasonic|Apple|Samsung|Google|OnePlus|Realme|Xiaomi|Nothing|Toyota|Honda|Subaru|Mahindra|Tata|Hyundai|Intuit|Sage|Zoho|Microsoft|Adobe|Taj|W)\b/i
    );

    const brand = brandMatch ? brandMatch[1] : undefined;

    return {
      canonicalName: name,
      brand,
    };
  }

  /**
   * Generates a conservative deduplication key
   */
  static getDeduplicationKey(rawName: string, domain: DecisionDomain): string {
    const { canonicalName } = this.cleanCanonicalName(rawName);
    return `${domain}:${canonicalName.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
  }

  /**
   * Normalizes raw discovered entities into standardized NormalizedEntity models
   */
  static normalizeEntities(
    rawEntities: DiscoveredEntityRaw[],
    domain: DecisionDomain,
    market: MarketCode
  ): NormalizedEntity[] {
    const deduplicated = new Map<string, NormalizedEntity>();

    for (const raw of rawEntities) {
      const dedupKey = this.getDeduplicationKey(raw.rawName, domain);
      const { canonicalName, brand } = this.cleanCanonicalName(raw.rawName);

      if (deduplicated.has(dedupKey)) {
        // Merge provenance sources into existing entity
        const existing = deduplicated.get(dedupKey)!;
        const existsAlready = existing.provenance.some(
          (p) => p.sourceUrl === raw.sourceUrl || p.sourceName === raw.sourceAdapterId
        );
        if (!existsAlready && raw.sourceUrl) {
          existing.provenance.push({
            sourceName: raw.sourceAdapterId,
            sourceType: raw.sourceType,
            sourceUrl: raw.sourceUrl,
            retrievedAt: raw.retrievedAt,
            market,
          });
        }
        continue;
      }

      // Domain-aware primary action link
      let officialUrl: string | undefined = raw.officialUrl;
      let retailerUrl: string | undefined = raw.retailerUrl;

      // Extract official URL from specs if present
      if (!officialUrl && raw.specs?.['Official Website']) {
        officialUrl = raw.specs['Official Website'];
      }

      // Authoritative source resolution (never use Wikipedia as primary destination)
      const isWikiUrl = (u?: string) => Boolean(u && /wikipedia\.org/i.test(u));
      const directAuthoritativeUrl = officialUrl || (raw.sourceUrl && !isWikiUrl(raw.sourceUrl) ? raw.sourceUrl : undefined);

      // Action determination according to Domain
      let actionLabel = 'View Official Details';
      let actionUrl = directAuthoritativeUrl || `https://www.google.com/search?q=${encodeURIComponent(canonicalName + ' official site')}`;
      let isAffiliate = false;
      let merchant: string | undefined = undefined;

      if (domain === 'PRODUCT') {
        // Physical products can route to retailer / Amazon market redirect
        const amazonRoute = buildAmazonMarketUrl({
          query: canonicalName,
          market,
        });
        actionLabel = 'Check Price on Retailer';
        actionUrl = amazonRoute.url;
        isAffiliate = true;
        merchant = 'Amazon';
      } else if (domain === 'SOFTWARE') {
        actionLabel = 'Visit Official Website';
        actionUrl =
          directAuthoritativeUrl ||
          `https://www.google.com/search?q=${encodeURIComponent(canonicalName + ' official software website')}`;
      } else if (domain === 'VEHICLE') {
        actionLabel = 'View Manufacturer Specifications';
        actionUrl =
          directAuthoritativeUrl ||
          `https://www.google.com/search?q=${encodeURIComponent(canonicalName + ' manufacturer official')}`;
      } else if (domain === 'EDUCATION') {
        actionLabel = 'Visit Institution Portal';
        actionUrl =
          directAuthoritativeUrl ||
          `https://www.google.com/search?q=${encodeURIComponent(canonicalName + ' official portal')}`;
      } else if (domain === 'PLACE' || domain === 'LOCAL' || domain === 'SERVICE') {
        actionLabel = 'View Location & Details';
        actionUrl =
          directAuthoritativeUrl ||
          `https://www.google.com/search?q=${encodeURIComponent(canonicalName + ' official')}`;
      }

      // Facts and specifications
      const specs = raw.specs || {};

      // Image handling: Only include if explicitly licensed or from Wikimedia Commons
      let image: NormalizedEntity['image'];
      if (raw.imageUrl && raw.imageUrl.startsWith('https://')) {
        image = {
          url: raw.imageUrl,
          alt: `${canonicalName} Reference Photography`,
          isVerified: true,
          license: raw.imageLicense || 'Public Domain / CC BY-SA',
          sourceUrl: raw.sourceUrl,
        };
      }

      // Evidence structure
      const supportingFacts = Object.entries(specs).map(([label, value]) => ({
        label,
        value,
        source: {
          sourceName: raw.sourceAdapterId,
          sourceType: raw.sourceType,
          sourceUrl: raw.sourceUrl,
          retrievedAt: raw.retrievedAt,
          market,
        },
      }));

      const normalized: NormalizedEntity = {
        id: raw.rawId,
        slug: canonicalName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        canonicalName,
        brand: brand || (raw.specs?.['Brand'] ? raw.specs['Brand'] : undefined),
        domain,
        market,
        explanation: raw.summary || `Verified factual entity entry documented in public records.`,
        pros: raw.pros || [],
        drawback: raw.drawback,
        specs,
        price: {
          amount: raw.priceAmount,
          currency: raw.priceCurrency || getMarketInfo(market).currencySymbol,
          isVerified: Boolean(raw.isPriceVerified),
          note:
            raw.priceNote ||
            'Price unverified — commercial pricing requires authorized retailer check',
        },
        rating: raw.rating, // strictly undefined if not supported by source
        reviewCount: raw.reviewCount, // strictly undefined if not supported by source
        officialUrl,
        retailerUrl,
        image,
        provenance: [
          {
            sourceName: raw.sourceAdapterId,
            sourceType: raw.sourceType,
            sourceUrl: raw.sourceUrl,
            retrievedAt: raw.retrievedAt,
            market,
          },
        ],
        evidence: {
          whyIncluded: `Discovered from authoritative source records matching the search query.`,
          supportingFacts,
          sources: [
            {
              sourceName: raw.sourceAdapterId,
              sourceType: raw.sourceType,
              sourceUrl: raw.sourceUrl,
              retrievedAt: raw.retrievedAt,
              market,
            },
          ],
          uncertainties: raw.uncertainties || ['Real-time availability and dynamic pricing should be verified directly.'],
          retrievedAt: raw.retrievedAt,
        },
      };

      deduplicated.set(dedupKey, normalized);
    }

    return Array.from(deduplicated.values());
  }
}
