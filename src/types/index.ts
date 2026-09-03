/**
 * ProductReviews.review - Universal Decision Engine Types
 * Pure, reliable, un-fabricated data structures.
 */

export type IntentType =
  | 'EXACT_ENTITY'
  | 'CATEGORY_DISCOVERY'
  | 'RECOMMENDATION'
  | 'COMPARISON'
  | 'LOCAL_DISCOVERY'
  | 'GENERAL_LOOKUP';

export type DecisionDomain =
  | 'PRODUCT'
  | 'SERVICE'
  | 'COMPANY'
  | 'SOFTWARE'
  | 'PLACE'
  | 'LOCAL'
  | 'EDUCATION'
  | 'VEHICLE'
  | 'FINANCIAL'
  | 'GENERAL';

export type SourceType =
  | 'OFFICIAL'
  | 'RETAILER'
  | 'AFFILIATE'
  | 'EDITORIAL'
  | 'BUSINESS_DIRECTORY'
  | 'TRAVEL'
  | 'AUTOMOTIVE'
  | 'SOFTWARE'
  | 'EDUCATION'
  | 'FINANCIAL'
  | 'LOCAL'
  | 'OTHER';

export interface SourceProvenance {
  sourceName: string;
  sourceType: SourceType;
  sourceUrl?: string;
  retrievedAt: string;
  market?: MarketCode;
  language?: LanguageCode;
  publishedAt?: string;
  lastUpdatedAt?: string;
}

export interface EvidenceItem {
  whyIncluded: string;
  supportingFacts: Array<{ label: string; value: string; source: SourceProvenance }>;
  sources: SourceProvenance[];
  uncertainties: string[];
  retrievedAt: string;
}

export type MarketCode =
  | 'US'
  | 'IN'
  | 'UK'
  | 'DE'
  | 'FR'
  | 'ES'
  | 'IT'
  | 'CA'
  | 'AU'
  | 'JP'
  | 'BR'
  | 'MX'
  | 'NL'
  | 'SG';

export type LanguageCode = 'en' | 'hi' | 'es' | 'it' | 'fr' | 'de';

export type ActionType =
  | 'CHECK_PRICE'
  | 'BUY_ON_AMAZON'
  | 'VISIT_OFFICIAL'
  | 'VIEW_DETAILS'
  | 'CONTACT'
  | 'BOOK';

export interface MarketInfo {
  code: MarketCode;
  name: string;
  currency: string;
  currencySymbol: string;
  amazonDomain: string;
  flag: string;
}

export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export interface QueryConstraints {
  budget?: number;
  currency?: string;
  explicitCountry?: string;
  location?: string;
  useCase?: string;
  brand?: string;
  comparisonEntities?: [string, string];
}

export interface ParsedQuery {
  rawQuery: string;
  cleanQuery: string;
  intent: IntentType;
  domain: DecisionDomain;
  market: MarketCode;
  language: LanguageCode;
  constraints: QueryConstraints;
}

export interface EntitySource {
  title: string;
  url?: string;
  domain?: string;
  note?: string;
}

export interface VerifiedPrice {
  amount?: number;
  currency: string;
  formatted?: string;
  isVerified: boolean;
  note?: string;
}

export interface EntityAction {
  type: ActionType;
  label: string;
  url: string;
  isAffiliate?: boolean;
  merchant?: string;
}

export interface EntityItem {
  id: string;
  slug: string;
  name: string;
  brand?: string;
  domain: DecisionDomain;
  badge?: 'BEST OVERALL' | 'BEST VALUE' | 'PREMIUM PICK' | string;
  explanation: string;
  pros: string[];
  drawback?: string;
  whoItIsFor?: string;
  price: VerifiedPrice;
  specs?: Record<string, string>;
  image?: {
    url: string;
    alt: string;
    isVerified: boolean;
  };
  action: EntityAction;
  sources: EntitySource[];
  evidence?: EvidenceItem;
  provenance?: SourceProvenance[];
  rating?: number;
  reviewCount?: number;
  officialUrl?: string;
  retailerUrl?: string;
}

export interface ComparisonFactor {
  factor: string;
  entityAAssessment: string;
  entityBAssessment: string;
  winner: 'A' | 'B' | 'TIE';
  why: string;
}

export interface ComparisonItem {
  entityA: EntityItem;
  entityB: EntityItem;
  factors: ComparisonFactor[];
  mainCompromise: string;
  verdictSummary: string;
}

export interface DecisionResult {
  parsedQuery: ParsedQuery;
  status: 'SUCCESS' | 'NO_RESULTS' | 'ERROR';
  message?: string;
  items: EntityItem[];
  alternatives?: EntityItem[];
  comparison?: ComparisonItem;
  retrievedAt: string;
}
