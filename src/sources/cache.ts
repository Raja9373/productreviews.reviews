import { NormalizedEntity } from './types';

interface CacheEntry {
  data: NormalizedEntity[];
  timestamp: number;
}

export class DiscoveryCache {
  private static instance: DiscoveryCache;
  private cache = new Map<string, CacheEntry>();
  private readonly TTL_MS = 10 * 60 * 1000; // 10 minutes
  private readonly MAX_ENTRIES = 100;

  static getInstance(): DiscoveryCache {
    if (!DiscoveryCache.instance) {
      DiscoveryCache.instance = new DiscoveryCache();
    }
    return DiscoveryCache.instance;
  }

  private buildKey(query: string, domain: string, market: string, lang: string): string {
    return `${query.toLowerCase().trim()}|${domain}|${market}|${lang}`;
  }

  get(query: string, domain: string, market: string, lang: string): NormalizedEntity[] | null {
    const key = this.buildKey(query, domain, market, lang);
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > this.TTL_MS) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set(query: string, domain: string, market: string, lang: string, data: NormalizedEntity[]): void {
    if (this.cache.size >= this.MAX_ENTRIES) {
      // Evict oldest entry
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }

    const key = this.buildKey(query, domain, market, lang);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

export const discoveryCache = DiscoveryCache.getInstance();
