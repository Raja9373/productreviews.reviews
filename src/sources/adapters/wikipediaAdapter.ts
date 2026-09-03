import { DecisionDomain, LanguageCode, MarketCode } from '../../types';
import { DiscoveredEntityRaw, SourceAdapter, SourceQueryOptions } from '../types';

export class WikipediaAdapter implements SourceAdapter {
  readonly id = 'wikipedia-editorial';
  readonly name = 'Wikipedia & Wikimedia Open Knowledge';
  readonly sourceType = 'EDITORIAL';
  readonly supportedDomains: DecisionDomain[] = [
    'PRODUCT',
    'SOFTWARE',
    'VEHICLE',
    'EDUCATION',
    'PLACE',
    'FINANCIAL',
    'COMPANY',
    'GENERAL',
  ];

  private readonly USER_AGENT =
    'ProductReviewsReview-DecisionEngine/2.0 (https://productreviews.review; contact@productreviews.review)';

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
      // 1. Search Wikipedia articles via MediaWiki Action API
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
        cleanQuery
      )}&srlimit=${options?.limit || 7}&utf8=&format=json&origin=*`;

      const searchRes = await fetch(searchUrl, {
        headers: { 'User-Agent': this.USER_AGENT },
        signal: controller.signal,
      });

      if (!searchRes.ok) return [];

      const searchData = await searchRes.json();
      const searchHits: Array<{ title: string; snippet: string; pageid: number }> =
        searchData.query?.search || [];

      if (searchHits.length === 0) return [];

      // 2. Fetch page summaries for candidates in parallel with strict timeout
      const results: DiscoveredEntityRaw[] = [];

      for (const hit of searchHits.slice(0, 5)) {
        try {
          const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
            hit.title
          )}`;
          const sumRes = await fetch(summaryUrl, {
            headers: { 'User-Agent': this.USER_AGENT },
            signal: controller.signal,
          });

          if (!sumRes.ok) continue;

          const sumData = await sumRes.json();

          // Reject disambiguation pages, empty extracts, or meta lists
          if (
            sumData.type === 'disambiguation' ||
            !sumData.extract ||
            /^list of/i.test(sumData.title) ||
            /^comparison of/i.test(sumData.title) ||
            /^index of/i.test(sumData.title)
          ) {
            continue;
          }

          // Relevance check: ensure the extract or description relates to query keywords
          const textLower = (
            (sumData.title || '') +
            ' ' +
            (sumData.description || '') +
            ' ' +
            (sumData.extract || '')
          ).toLowerCase();

          const queryKeywords = cleanQuery
            .toLowerCase()
            .split(/\s+/)
            .filter((k) => k.length > 2 && !['best', 'under', 'for', 'the', 'and', 'with', 'near', 'review'].includes(k));

          const matchesAtLeastOne =
            queryKeywords.length === 0 ||
            queryKeywords.some((kw) => textLower.includes(kw));

          if (!matchesAtLeastOne) continue;

          // Extract brand candidate if identifiable
          let brand: string | undefined;
          const knownBrands = [
            'Sony',
            'Canon',
            'Nikon',
            'Fujifilm',
            'Panasonic',
            'Apple',
            'Samsung',
            'Google',
            'OnePlus',
            'Realme',
            'Xiaomi',
            'Toyota',
            'Honda',
            'Subaru',
            'Mahindra',
            'Tata',
            'Hyundai',
            'Intuit',
            'Sage',
            'Zoho',
            'Microsoft',
            'Adobe',
          ];

          for (const b of knownBrands) {
            if (sumData.title.toLowerCase().startsWith(b.toLowerCase()) || textLower.includes(b.toLowerCase())) {
              brand = b;
              break;
            }
          }

          // Build factual summary
          const summary = sumData.extract.length > 240
            ? sumData.extract.substring(0, 240) + '...'
            : sumData.extract;

          // Build specs from description / extract
          const specs: Record<string, string> = {};
          if (sumData.description) {
            specs['Category'] = sumData.description;
          }
          if (sumData.timestamp) {
            specs['Article Updated'] = new Date(sumData.timestamp).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
            });
          }

          // Image if available via Wikimedia
          let imageUrl: string | undefined;
          let imageLicense: string | undefined;
          if (sumData.thumbnail?.source && !sumData.thumbnail.source.includes('placeholder')) {
            imageUrl = sumData.thumbnail.source;
            imageLicense = 'Wikimedia Commons / CC BY-SA';
          }

          results.push({
            rawId: `wiki-${sumData.pageid || hit.title.toLowerCase().replace(/\s+/g, '-')}`,
            rawName: sumData.title,
            sourceAdapterId: this.id,
            sourceType: this.sourceType,
            sourceUrl: sumData.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(sumData.title)}`,
            domain,
            market,
            language: lang,
            summary,
            specs,
            imageUrl,
            imageLicense,
            isPriceVerified: false,
            priceNote: 'Price unverified — commercial pricing requires authorized retailer check',
            retrievedAt: new Date().toISOString(),
            uncertainties: [
              'Retailer commercial pricing and dynamic stock status are not tracked in encyclopedic records.',
            ],
          });
        } catch {
          // Individual summary fetch fail silently skipped
        }
      }

      return results;
    } catch {
      return [];
    } finally {
      clearTimeout(timer);
    }
  }

  async fetch(identifier: string, options?: SourceQueryOptions): Promise<DiscoveredEntityRaw | null> {
    const clean = identifier.replace(/^wiki-/, '').replace(/-/g, ' ');
    const results = await this.discover(clean, 'GENERAL', 'US', 'en', options);
    return results[0] || null;
  }
}
