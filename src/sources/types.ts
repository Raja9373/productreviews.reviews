import {
  DecisionDomain,
  EvidenceItem,
  LanguageCode,
  MarketCode,
  SourceProvenance,
  SourceType,
} from '../types';

export interface DiscoveredFact {
  label: string;
  value: string;
  source: SourceProvenance;
}

export interface DiscoveredEntityRaw {
  rawId: string;
  rawName: string;
  sourceAdapterId: string;
  sourceType: SourceType;
  sourceUrl?: string;
  domain: DecisionDomain;
  market?: MarketCode;
  language?: LanguageCode;
  summary?: string;
  specs?: Record<string, string>;
  pros?: string[];
  drawback?: string;
  facts?: DiscoveredFact[];
  officialUrl?: string;
  retailerUrl?: string;
  imageUrl?: string;
  imageLicense?: string;
  priceAmount?: number;
  priceCurrency?: string;
  isPriceVerified?: boolean;
  priceNote?: string;
  rating?: number;
  reviewCount?: number;
  retrievedAt: string;
  uncertainties?: string[];
}

export interface NormalizedEntity {
  id: string;
  slug: string;
  canonicalName: string;
  brand?: string;
  model?: string;
  variant?: string;
  category?: string;
  domain: DecisionDomain;
  market: MarketCode;
  explanation: string;
  pros: string[];
  drawback?: string;
  whoItIsFor?: string;
  specs: Record<string, string>;
  price: {
    amount?: number;
    currency: string;
    formatted?: string;
    isVerified: boolean;
    note?: string;
  };
  rating?: number;
  reviewCount?: number;
  officialUrl?: string;
  retailerUrl?: string;
  image?: {
    url: string;
    alt: string;
    isVerified: boolean;
    license?: string;
    sourceUrl?: string;
  };
  provenance: SourceProvenance[];
  evidence: EvidenceItem;
}

export interface SourceQueryOptions {
  timeoutMs?: number;
  signal?: AbortSignal;
  bypassCache?: boolean;
  limit?: number;
  budget?: number;
}

export interface SourceAdapter {
  readonly id: string;
  readonly name: string;
  readonly sourceType: SourceType;
  readonly supportedDomains: DecisionDomain[];

  /**
   * Discover candidate entities from external sources
   */
  discover(
    query: string,
    domain: DecisionDomain,
    market: MarketCode,
    lang: LanguageCode,
    options?: SourceQueryOptions
  ): Promise<DiscoveredEntityRaw[]>;

  /**
   * Fetch in-depth details for a specific identified entity
   */
  fetch?(
    identifier: string,
    options?: SourceQueryOptions
  ): Promise<DiscoveredEntityRaw | null>;
}
