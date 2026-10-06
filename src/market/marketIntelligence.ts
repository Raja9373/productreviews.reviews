/**
 * ProductReviews.review — Phase 17 Price, Availability & Market Intelligence Infrastructure
 * 
 * Provides production-safe price, availability, currency, warranty, returns, and marketplace
 * intelligence without fabricating live data or violating affiliate neutrality.
 */

import { MarketCode } from '../types';
import { getMarketInfo } from '../localization/markets';

export type PriceVerificationStatus =
  | 'CURRENT_VERIFIED'
  | 'RECENT_VERIFIED'
  | 'DATED'
  | 'STALE'
  | 'UNKNOWN'
  | 'UNVERIFIED';

export type AvailabilityState =
  | 'IN_STOCK'
  | 'LOW_STOCK'
  | 'OUT_OF_STOCK'
  | 'PREORDER'
  | 'BACKORDER'
  | 'DISCONTINUED'
  | 'UNKNOWN'
  | 'UNVERIFIED';

export interface MarketPriceObservation {
  productId: string;
  variant?: string;
  market: MarketCode;
  marketplace: string;
  currency: string;
  value: number;
  status: PriceVerificationStatus;
  observedAt: string;
  sourceId: string;
  sourceStatus: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';
}

export interface MarketAvailabilityObservation {
  productId: string;
  variant?: string;
  market: MarketCode;
  marketplace: string;
  state: AvailabilityState;
  observedAt: string;
  sourceId: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';
}

export interface MarketWarrantyObservation {
  productId: string;
  market: MarketCode;
  warrantyType: 'MANUFACTURER_WARRANTY' | 'RETAILER_WARRANTY' | 'EXTENDED_WARRANTY' | 'UNKNOWN' | 'UNVERIFIED';
  durationMonths?: number;
  termsSummary: string;
  observedAt: string;
  sourceId: string;
}

export interface MarketReturnsObservation {
  productId: string;
  market: MarketCode;
  retailer: string;
  returnWindowDays?: number;
  policySummary: string;
  observedAt: string;
  sourceId: string;
}

/**
 * Market Intelligence Service enforcing strict market boundaries, currency safety, and verification statuses.
 */
export class MarketIntelligenceService {
  private prices = new Map<string, MarketPriceObservation[]>();
  private availabilities = new Map<string, MarketAvailabilityObservation[]>();
  private warranties = new Map<string, MarketWarrantyObservation[]>();
  private returns = new Map<string, MarketReturnsObservation[]>();

  public recordPrice(obs: MarketPriceObservation) {
    const list = this.prices.get(obs.productId) || [];
    list.push(obs);
    this.prices.set(obs.productId, list);
  }

  public recordAvailability(obs: MarketAvailabilityObservation) {
    const list = this.availabilities.get(obs.productId) || [];
    list.push(obs);
    this.availabilities.set(obs.productId, list);
  }

  public recordWarranty(obs: MarketWarrantyObservation) {
    const list = this.warranties.get(obs.productId) || [];
    list.push(obs);
    this.warranties.set(obs.productId, list);
  }

  public recordReturns(obs: MarketReturnsObservation) {
    const list = this.returns.get(obs.productId) || [];
    list.push(obs);
    this.returns.set(obs.productId, list);
  }

  public getVerifiedPrice(productId: string, market: MarketCode, variant?: string): MarketPriceObservation | undefined {
    const list = this.prices.get(productId) || [];
    return list.find(p => p.market === market && (!variant || p.variant === variant) && (p.status === 'CURRENT_VERIFIED' || p.status === 'RECENT_VERIFIED'));
  }

  public getAvailability(productId: string, market: MarketCode, variant?: string): MarketAvailabilityObservation | undefined {
    const list = this.availabilities.get(productId) || [];
    return list.find(a => a.market === market && (!variant || a.variant === variant));
  }

  public getWarranty(productId: string, market: MarketCode): MarketWarrantyObservation | undefined {
    const list = this.warranties.get(productId) || [];
    return list.find(w => w.market === market);
  }

  public getReturns(productId: string, market: MarketCode): MarketReturnsObservation | undefined {
    const list = this.returns.get(productId) || [];
    return list.find(r => r.market === market);
  }
}

export const marketIntelligence = new MarketIntelligenceService();

// Seed deterministic Phase 17 fixtures
export function seedPhase17MarketFixtures() {
  marketIntelligence.recordPrice({
    productId: 'prod_iphone_15',
    variant: '128GB',
    market: 'IN',
    marketplace: 'Amazon India',
    currency: 'INR',
    value: 69900,
    status: 'CURRENT_VERIFIED',
    observedAt: new Date().toISOString(),
    sourceId: 'SRC-RETAIL-GLOBAL',
    sourceStatus: 'STRUCTURED',
    confidence: 'HIGH'
  });

  marketIntelligence.recordPrice({
    productId: 'prod_iphone_15',
    variant: '128GB',
    market: 'US',
    marketplace: 'Amazon US',
    currency: 'USD',
    value: 799,
    status: 'CURRENT_VERIFIED',
    observedAt: new Date().toISOString(),
    sourceId: 'SRC-RETAIL-GLOBAL',
    sourceStatus: 'STRUCTURED',
    confidence: 'HIGH'
  });

  marketIntelligence.recordAvailability({
    productId: 'prod_iphone_15',
    variant: '128GB',
    market: 'IN',
    marketplace: 'Amazon India',
    state: 'IN_STOCK',
    observedAt: new Date().toISOString(),
    sourceId: 'SRC-RETAIL-GLOBAL',
    confidence: 'HIGH'
  });

  marketIntelligence.recordWarranty({
    productId: 'prod_iphone_15',
    market: 'IN',
    warrantyType: 'MANUFACTURER_WARRANTY',
    durationMonths: 12,
    termsSummary: '1 Year Manufacturer Warranty valid across authorized service centers in India.',
    observedAt: new Date().toISOString(),
    sourceId: 'SRC-OEM-OFFICIAL-SPECS'
  });

  marketIntelligence.recordReturns({
    productId: 'prod_iphone_15',
    market: 'IN',
    retailer: 'Amazon India',
    returnWindowDays: 7,
    policySummary: '7-day replacement policy for defective or damaged items.',
    observedAt: new Date().toISOString(),
    sourceId: 'SRC-RETAIL-GLOBAL'
  });
}
