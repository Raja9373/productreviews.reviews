import { ComparisonItem, EntityItem, ParsedQuery } from '../types';
import { parseSearchQuery } from '../search/queryParser';

export interface AIProvider {
  name: string;
  isAvailable(): Promise<boolean>;
  understandQuery(query: string, market?: string, lang?: string): Promise<ParsedQuery>;
  summarizeEntity?(item: EntityItem, lang?: string): Promise<string>;
  compareEntities?(itemA: EntityItem, itemB: EntityItem, lang?: string): Promise<ComparisonItem | null>;
}

/**
 * Deterministic default AI Provider.
 * Requires 0 API keys, 0 external network requests, runs at 0 cost and ultra-fast speed.
 */
export class DeterministicAIProvider implements AIProvider {
  name = 'DeterministicDecisionEngine';

  async isAvailable(): Promise<boolean> {
    return true;
  }

  async understandQuery(query: string, market?: string, lang?: string): Promise<ParsedQuery> {
    return parseSearchQuery(query, market as any, (lang || 'en') as any);
  }
}

// Singleton provider instance (future providers can be plugged in seamlessly)
export const activeAIProvider: AIProvider = new DeterministicAIProvider();
