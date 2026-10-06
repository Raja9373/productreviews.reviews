/**
 * ProductReviews.review — Phase 14 Evidence Source Registry & Freshness Policies
 * 
 * Manages verifiable evidence sources, status tracking, freshness policies,
 * and clear separation of active configurations, fixtures, and unavailable sources.
 */

export type SourceAuthorityType =
  | 'STANDARDS_BODY'
  | 'OEM_OFFICIAL'
  | 'BENCHMARK_LAB'
  | 'REGULATORY_AGENCY'
  | 'RETAIL_DISTRIBUTOR'
  | 'THIRD_PARTY_TESTING';

export type SourceAvailabilityStatus =
  | 'ACTIVE'
  | 'TEMPORARILY_UNAVAILABLE'
  | 'UNAVAILABLE'
  | 'UNCONFIGURED'
  | 'DEPRECATED'
  | 'FIXTURE_DATASET'
  | 'UNKNOWN';

export type FreshnessEvidenceCategory =
  | 'PRICE'
  | 'AVAILABILITY'
  | 'FIRMWARE'
  | 'SOFTWARE_SUPPORT'
  | 'COMPATIBILITY'
  | 'WARRANTY'
  | 'SPECIFICATION'
  | 'BENCHMARK'
  | 'PROTOCOL'
  | 'REGULATORY'
  | 'EXPERT_REVIEW'
  | 'OFFICIAL_DOCUMENTATION';

export interface FreshnessPolicy {
  category: FreshnessEvidenceCategory;
  maxAgeDays: number;
  priorityOnStale: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  requiresReVerification: boolean;
  description: string;
}

export interface RegisteredEvidenceSource {
  sourceId: string;
  sourceName: string;
  sourceType: string;
  authorityType: SourceAuthorityType;
  sourceStatus: 'STRUCTURED' | 'UNSTRUCTURED' | 'UNKNOWN';
  supportedMarkets: string[];
  supportedCategories: string[];
  supportedEvidenceTypes: FreshnessEvidenceCategory[];
  sourceCountry: string;
  lastCheckedAt?: string;
  lastSuccessfulCheckAt?: string;
  freshnessPolicy: FreshnessPolicy;
  availabilityStatus: SourceAvailabilityStatus;
  isLiveMonitoringConfigured: boolean;
  isFixtureDataset: boolean;
}

export const FRESHNESS_POLICIES: Record<FreshnessEvidenceCategory, FreshnessPolicy> = {
  PRICE: {
    category: 'PRICE',
    maxAgeDays: 14,
    priorityOnStale: 'HIGH',
    requiresReVerification: true,
    description: 'Retail pricing requires bi-weekly validation'
  },
  AVAILABILITY: {
    category: 'AVAILABILITY',
    maxAgeDays: 14,
    priorityOnStale: 'HIGH',
    requiresReVerification: true,
    description: 'Stock and market distribution status'
  },
  FIRMWARE: {
    category: 'FIRMWARE',
    maxAgeDays: 30,
    priorityOnStale: 'MEDIUM',
    requiresReVerification: true,
    description: 'Hardware firmware & software driver updates'
  },
  SOFTWARE_SUPPORT: {
    category: 'SOFTWARE_SUPPORT',
    maxAgeDays: 60,
    priorityOnStale: 'MEDIUM',
    requiresReVerification: false,
    description: 'OS support roadmap & security patch policies'
  },
  COMPATIBILITY: {
    category: 'COMPATIBILITY',
    maxAgeDays: 45,
    priorityOnStale: 'HIGH',
    requiresReVerification: true,
    description: 'Hardware ecosystem & cross-device compatibility matrices'
  },
  WARRANTY: {
    category: 'WARRANTY',
    maxAgeDays: 90,
    priorityOnStale: 'MEDIUM',
    requiresReVerification: false,
    description: 'Manufacturer warranty terms & regional consumer rights'
  },
  SPECIFICATION: {
    category: 'SPECIFICATION',
    maxAgeDays: 180,
    priorityOnStale: 'LOW',
    requiresReVerification: false,
    description: 'Physical hardware architectural specs'
  },
  BENCHMARK: {
    category: 'BENCHMARK',
    maxAgeDays: 90,
    priorityOnStale: 'LOW',
    requiresReVerification: false,
    description: 'Standardized performance & thermal telemetry'
  },
  PROTOCOL: {
    category: 'PROTOCOL',
    maxAgeDays: 60,
    priorityOnStale: 'HIGH',
    requiresReVerification: true,
    description: 'Industry standards (Matter, Thread, Wi-Fi 7, USB4/Thunderbolt)'
  },
  REGULATORY: {
    category: 'REGULATORY',
    maxAgeDays: 120,
    priorityOnStale: 'CRITICAL',
    requiresReVerification: true,
    description: 'Safety compliance & spectrum regulatory mandates'
  },
  EXPERT_REVIEW: {
    category: 'EXPERT_REVIEW',
    maxAgeDays: 90,
    priorityOnStale: 'LOW',
    requiresReVerification: false,
    description: 'Independent expert benchmark and audio/display lab tests'
  },
  OFFICIAL_DOCUMENTATION: {
    category: 'OFFICIAL_DOCUMENTATION',
    maxAgeDays: 180,
    priorityOnStale: 'LOW',
    requiresReVerification: false,
    description: 'OEM whitepapers & architectural manuals'
  }
};

export class EvidenceSourceRegistry {
  private sources: Map<string, RegisteredEvidenceSource> = new Map();

  constructor() {
    this.seedDefaultSources();
  }

  private seedDefaultSources(): void {
    const defaultSources: RegisteredEvidenceSource[] = [
      {
        sourceId: 'SRC-MATTER-ALLIANCE',
        sourceName: 'Connectivity Standards Alliance (Matter & Thread Standards)',
        sourceType: 'PROTOCOL_STANDARD',
        authorityType: 'STANDARDS_BODY',
        sourceStatus: 'STRUCTURED',
        supportedMarkets: ['GLOBAL', 'US', 'EU', 'IN', 'UK'],
        supportedCategories: ['Smart Home', 'Smart Lighting', 'Networking'],
        supportedEvidenceTypes: ['PROTOCOL', 'COMPATIBILITY'],
        sourceCountry: 'US',
        freshnessPolicy: FRESHNESS_POLICIES.PROTOCOL,
        availabilityStatus: 'ACTIVE',
        isLiveMonitoringConfigured: false, // Explicitly false (requires scheduler)
        isFixtureDataset: true
      },
      {
        sourceId: 'SRC-WIFI-ALLIANCE',
        sourceName: 'Wi-Fi Alliance Certification Database',
        sourceType: 'PROTOCOL_STANDARD',
        authorityType: 'STANDARDS_BODY',
        sourceStatus: 'STRUCTURED',
        supportedMarkets: ['GLOBAL', 'US', 'EU', 'IN', 'UK'],
        supportedCategories: ['Networking', 'Smartphones', 'Laptops'],
        supportedEvidenceTypes: ['PROTOCOL', 'SPECIFICATION'],
        sourceCountry: 'US',
        freshnessPolicy: FRESHNESS_POLICIES.PROTOCOL,
        availabilityStatus: 'ACTIVE',
        isLiveMonitoringConfigured: false,
        isFixtureDataset: true
      },
      {
        sourceId: 'SRC-USB-IF-INTEL',
        sourceName: 'USB-IF & Intel Thunderbolt Certification Registry',
        sourceType: 'PROTOCOL_STANDARD',
        authorityType: 'STANDARDS_BODY',
        sourceStatus: 'STRUCTURED',
        supportedMarkets: ['GLOBAL', 'US', 'EU', 'IN', 'UK'],
        supportedCategories: ['Laptops', 'Storage', 'Monitors'],
        supportedEvidenceTypes: ['PROTOCOL', 'COMPATIBILITY'],
        sourceCountry: 'US',
        freshnessPolicy: FRESHNESS_POLICIES.PROTOCOL,
        availabilityStatus: 'ACTIVE',
        isLiveMonitoringConfigured: false,
        isFixtureDataset: true
      },
      {
        sourceId: 'SRC-OEM-OFFICIAL-SPECS',
        sourceName: 'OEM Verified Specification Repository',
        sourceType: 'OEM_SPECS',
        authorityType: 'OEM_OFFICIAL',
        sourceStatus: 'STRUCTURED',
        supportedMarkets: ['GLOBAL', 'US', 'IN', 'UK'],
        supportedCategories: ['Smartphones', 'Laptops', 'Cameras', 'Audio & Headphones', 'Wearables', 'Tablets', 'TVs', 'Gaming'],
        supportedEvidenceTypes: ['SPECIFICATION', 'WARRANTY', 'FIRMWARE'],
        sourceCountry: 'GLOBAL',
        freshnessPolicy: FRESHNESS_POLICIES.SPECIFICATION,
        availabilityStatus: 'ACTIVE',
        isLiveMonitoringConfigured: false,
        isFixtureDataset: true
      },
      {
        sourceId: 'SRC-BENCHMARK-TELEMETRY',
        sourceName: 'Standard Benchmark Ingest Dataset',
        sourceType: 'BENCHMARK_LAB',
        authorityType: 'BENCHMARK_LAB',
        sourceStatus: 'STRUCTURED',
        supportedMarkets: ['GLOBAL'],
        supportedCategories: ['Smartphones', 'Laptops', 'Gaming'],
        supportedEvidenceTypes: ['BENCHMARK', 'SPECIFICATION'],
        sourceCountry: 'GLOBAL',
        freshnessPolicy: FRESHNESS_POLICIES.BENCHMARK,
        availabilityStatus: 'ACTIVE',
        isLiveMonitoringConfigured: false,
        isFixtureDataset: true
      },
      {
        sourceId: 'SRC-UNAUTH-SCRAPER-FEED',
        sourceName: 'Unauthenticated 3P E-commerce Scraper Feed',
        sourceType: 'SCRAPER',
        authorityType: 'RETAIL_DISTRIBUTOR',
        sourceStatus: 'UNSTRUCTURED',
        supportedMarkets: ['GLOBAL'],
        supportedCategories: [],
        supportedEvidenceTypes: ['PRICE', 'AVAILABILITY'],
        sourceCountry: 'UNKNOWN',
        freshnessPolicy: FRESHNESS_POLICIES.PRICE,
        availabilityStatus: 'UNAVAILABLE',
        isLiveMonitoringConfigured: false,
        isFixtureDataset: false
      }
    ];

    for (const src of defaultSources) {
      this.sources.set(src.sourceId, src);
    }
  }

  getSource(sourceId: string): RegisteredEvidenceSource | undefined {
    return this.sources.get(sourceId);
  }

  listSources(): RegisteredEvidenceSource[] {
    return Array.from(this.sources.values());
  }

  getActiveSources(): RegisteredEvidenceSource[] {
    return this.listSources().filter(s => s.availabilityStatus === 'ACTIVE');
  }

  registerSource(source: RegisteredEvidenceSource): void {
    this.sources.set(source.sourceId, source);
  }

  updateSourceStatus(sourceId: string, status: SourceAvailabilityStatus): void {
    const src = this.sources.get(sourceId);
    if (src) {
      src.availabilityStatus = status;
      src.lastCheckedAt = new Date().toISOString();
    }
  }
}

export const evidenceSourceRegistry = new EvidenceSourceRegistry();
