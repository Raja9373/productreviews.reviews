import { DecisionDomain, LanguageCode, MarketCode } from '../types';
import { DiscoveredEntityRaw, NormalizedEntity, SourceAdapter, SourceQueryOptions } from './types';
import { WikipediaAdapter } from './adapters/wikipediaAdapter';
import { OpenStreetMapAdapter } from './adapters/openStreetMapAdapter';
import { ServerGroundedAdapter } from './adapters/serverGroundedAdapter';
import { EntityNormalizer } from './normalizer';
import { discoveryCache } from './cache';

export class SourceRouter {
  private adapters: SourceAdapter[];

  constructor() {
    this.adapters = [
      new WikipediaAdapter(),
      new OpenStreetMapAdapter(),
      new ServerGroundedAdapter(),
    ];
  }

  /**
   * Routes query to appropriate adapters based on domain and context
   */
  getAdaptersForDomain(domain: DecisionDomain): SourceAdapter[] {
    return this.adapters.filter((adapter) =>
      adapter.supportedDomains.includes(domain)
    );
  }

  /**
   * Discovers and normalizes entities with cache, timeouts, and domain routing
   */
  async discoverEntities(
    query: string,
    domain: DecisionDomain,
    market: MarketCode,
    lang: LanguageCode,
    options?: SourceQueryOptions
  ): Promise<NormalizedEntity[]> {
    const cleanQuery = query.trim();
    if (!cleanQuery) return [];

    // 1. Check cache unless explicitly bypassed
    if (!options?.bypassCache) {
      const cached = discoveryCache.get(cleanQuery, domain, market, lang);
      if (cached) {
        return cached;
      }
    }

    // 2. Select permitted adapters for domain
    const activeAdapters = this.getAdaptersForDomain(domain);
    if (activeAdapters.length === 0) {
      return [];
    }

    // 3. Parallel discovery across domain-permitted adapters with bounded timeout
    const timeoutMs = options?.timeoutMs || 3500;
    const adapterPromises = activeAdapters.map(async (adapter) => {
      try {
        return await adapter.discover(cleanQuery, domain, market, lang, {
          ...options,
          timeoutMs,
        });
      } catch {
        return [] as DiscoveredEntityRaw[];
      }
    });

    const resultsByAdapter = await Promise.all(adapterPromises);
    const combinedRaw: DiscoveredEntityRaw[] = resultsByAdapter.flat();

    if (combinedRaw.length === 0) {
      return [];
    }

    // 4. Normalize entities & facts
    const normalized = EntityNormalizer.normalizeEntities(combinedRaw, domain, market);

    // 5. Cache normalized results
    if (normalized.length > 0 && !options?.bypassCache) {
      discoveryCache.set(cleanQuery, domain, market, lang, normalized);
    }

    return normalized;
  }
}

export const sourceRouter = new SourceRouter();
