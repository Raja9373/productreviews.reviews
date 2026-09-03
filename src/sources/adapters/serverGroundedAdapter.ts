import { DecisionDomain, LanguageCode, MarketCode } from '../../types';
import { DiscoveredEntityRaw, SourceAdapter, SourceQueryOptions } from '../types';

export class ServerGroundedAdapter implements SourceAdapter {
  readonly id = 'server-grounded-search';
  readonly name = 'Live Search Evidence & Grounding Engine';
  readonly sourceType = 'EDITORIAL';
  readonly supportedDomains: DecisionDomain[] = [
    'PRODUCT',
    'SOFTWARE',
    'VEHICLE',
    'EDUCATION',
    'FINANCIAL',
    'PLACE',
    'LOCAL',
    'GENERAL',
  ];

  async discover(
    query: string,
    domain: DecisionDomain,
    market: MarketCode,
    lang: LanguageCode,
    options?: SourceQueryOptions
  ): Promise<DiscoveredEntityRaw[]> {
    const cleanQuery = query.trim();
    if (!cleanQuery || cleanQuery.length < 2) return [];

    const timeoutMs = options?.timeoutMs || 3500;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch('/api/gemini/grounded-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: cleanQuery,
          targetLang: lang,
          market,
          domain,
        }),
        signal: controller.signal,
      });

      if (!res.ok) return [];

      const data = await res.json();
      if (!data.success || !Array.isArray(data.products) || data.products.length === 0) {
        return [];
      }

      return data.products.map((p: any) => ({
        rawId: p.id || `live-${Math.random().toString(36).substring(7)}`,
        rawName: p.name || p.title || cleanQuery,
        sourceAdapterId: this.id,
        sourceType: this.sourceType,
        sourceUrl: p.sourceUrl || p.sources?.[0]?.url || 'https://google.com',
        domain,
        market,
        language: lang,
        summary: p.explanation || p.summary || 'Entity evidence grounded via live search sources.',
        specs: p.specs || {},
        pros: Array.isArray(p.pros) ? p.pros : [],
        drawback: p.drawback || p.cons?.[0],
        isPriceVerified: false,
        priceNote: 'Live commercial price must be confirmed at authorized retailer',
        retrievedAt: new Date().toISOString(),
        uncertainties: ['Dynamic price and merchant inventory require real-time merchant checkout check.'],
      }));
    } catch {
      return [];
    } finally {
      clearTimeout(timer);
    }
  }
}
