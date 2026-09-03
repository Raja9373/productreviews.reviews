import { DecisionDomain, LanguageCode, MarketCode } from '../../types';
import { DiscoveredEntityRaw, SourceAdapter, SourceQueryOptions } from '../types';

export class OpenStreetMapAdapter implements SourceAdapter {
  readonly id = 'openstreetmap-directory';
  readonly name = 'OpenStreetMap & Open Business Directory';
  readonly sourceType = 'BUSINESS_DIRECTORY';
  readonly supportedDomains: DecisionDomain[] = ['LOCAL', 'PLACE', 'SERVICE'];

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
    if (!cleanQuery || cleanQuery.length < 3) return [];

    const timeoutMs = options?.timeoutMs || 3500;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      // Map local phrases like "CA near me" or "hotel in Goa" to sensible search queries
      let searchQuery = cleanQuery;
      if (cleanQuery.toLowerCase().includes('ca near me')) {
        // Chartered Accountant local search
        searchQuery = market === 'IN' ? 'Chartered Accountant in India' : 'Certified Public Accountant';
      }

      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        searchQuery
      )}&format=json&addressdetails=1&limit=${options?.limit || 3}`;

      const res = await fetch(url, {
        headers: { 'User-Agent': this.USER_AGENT },
        signal: controller.signal,
      });

      if (!res.ok) return [];

      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) return [];

      return data.map((item: any) => {
        const name = item.name || (item.display_name ? item.display_name.split(',')[0] : 'Local Business');
        const addr = item.address || {};
        const locationParts = [addr.suburb, addr.city || addr.town || addr.village, addr.state, addr.country]
          .filter(Boolean)
          .join(', ');

        const specs: Record<string, string> = {};
        if (locationParts) specs['Location'] = locationParts;
        if (item.type) specs['Category'] = String(item.type).replace(/_/g, ' ');
        if (item.class) specs['Directory Class'] = String(item.class);
        if (item.lat && item.lon) {
          specs['Coordinates'] = `${parseFloat(item.lat).toFixed(4)}°, ${parseFloat(item.lon).toFixed(4)}°`;
        }

        return {
          rawId: `osm-${item.osm_id || item.place_id || Math.random().toString(36).substring(7)}`,
          rawName: name,
          sourceAdapterId: this.id,
          sourceType: this.sourceType,
          sourceUrl: `https://www.openstreetmap.org/${item.osm_type || 'node'}/${item.osm_id || item.place_id}`,
          domain: domain === 'GENERAL' ? 'LOCAL' : domain,
          market,
          language: lang,
          summary: `Documented establishment registered in OpenStreetMap directory: ${item.display_name || name}.`,
          specs,
          isPriceVerified: false,
          priceNote: 'Service fees / room rates must be verified directly with the provider',
          retrievedAt: new Date().toISOString(),
          uncertainties: ['Operating hours and pricing must be confirmed directly with establishment.'],
        };
      });
    } catch {
      return [];
    } finally {
      clearTimeout(timer);
    }
  }

  async fetch(identifier: string, options?: SourceQueryOptions): Promise<DiscoveredEntityRaw | null> {
    const clean = identifier.replace(/^osm-/, '');
    const results = await this.discover(clean, 'LOCAL', 'US', 'en', options);
    return results[0] || null;
  }
}
