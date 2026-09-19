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

export enum SourceStatus {
  STRUCTURED = 'STRUCTURED',
  UNSTRUCTURED = 'UNSTRUCTURED',
  UNAVAILABLE = 'UNAVAILABLE',
}

export interface ResearchSource {
  id: string;
  title?: string;
  url?: string;
  publisher?: string;
  publishedAt?: string;
  sourceStatus: SourceStatus;
  citationType?: string;
}

export enum Sentiment {
  POSITIVE = 'POSITIVE',
  NEGATIVE = 'NEGATIVE',
  NEUTRAL = 'NEUTRAL',
  MIXED = 'MIXED',
  UNKNOWN = 'UNKNOWN',
}

export enum StatementType {
  FACTUAL = 'FACTUAL',
  OPINION = 'OPINION',
  MIXED = 'MIXED',
  UNKNOWN = 'UNKNOWN',
}

export enum EvidenceType {
  OFFICIAL = 'OFFICIAL',
  SPECIFICATION = 'SPECIFICATION',
  EXPERT_REVIEW = 'EXPERT_REVIEW',
  USER_FEEDBACK = 'USER_FEEDBACK',
  REGULATORY = 'REGULATORY',
  PRICE_MARKET = 'PRICE_MARKET',
  AVAILABILITY = 'AVAILABILITY',
  OTHER = 'OTHER',
}

export enum Confidence {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  UNKNOWN = 'UNKNOWN',
}

export interface EvidencePoint {
  id: string;
  productId?: string;
  claim: string;
  sentiment: Sentiment;
  statementType: StatementType;
  evidenceType: EvidenceType;
  sourceUrl?: string;
  sourceTitle?: string;
  sourcePublisher?: string;
  sourceDate?: string;
  evidenceTimestamp: string;
  confidence: Confidence;
  category?: string;
  excerpt?: string;
  supportsClaim: boolean;
  provenance: SourceProvenance;
  sourceStatus: SourceStatus;
}

export interface ResearchResult {
  researchAvailable: boolean;
  structuredEvidenceAvailable: boolean;
  sourceStatus: SourceStatus;
  evidencePoints: EvidencePoint[];
  generatedVerdict: string;
  nichod?: NichodResult;
  decision?: DecisionEngineResult;
}

export interface NichodResult {
  query: string;
  headline: string;
  summary: string;
  status?: 'INSUFFICIENT_EVIDENCE' | 'SUCCESS';
  reason?: string;
  keyPositives: string[];
  keyNegatives: string[];
  mixedOrUncertain: string[];
  strengths: string[];
  weaknesses: string[];
  risks: string[];
  tradeoffs: string[];
  suitableFor: string[];
  notSuitableFor: string[];
  contradictions: Array<{
    aspect: string;
    viewA: string;
    viewB: string;
    sourceA: string;
    sourceB: string;
  }>;
  missingInformation: string[];
  evidenceCount: number;
  relevantClaimCount: number;
  confidence: Confidence;
  evidenceStrength: 'STRONG' | 'MODERATE' | 'LIMITED' | 'INSUFFICIENT';
  limitations: string[];
  structuredEvidenceAvailable: boolean;
  sourceStatus: SourceStatus;
  claimCount: number;
}

export interface DecisionEngineResult {
  query: string;
  decision: 'BUY' | 'BUY_IF' | 'DON\'T_BUY' | 'INSUFFICIENT_EVIDENCE';
  headline: string;
  rationale: string;
  supportingFactors: string[];
  concerns: string[];
  conditions: string[];
  uncertainty: string[];
  evidenceStrength: 'STRONG' | 'MODERATE' | 'LIMITED' | 'INSUFFICIENT';
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';
  evidenceCount: number;
  relevantClaimCount: number;
  contradictionCount: number;
  sourceStatus: SourceStatus;
  limitations: string[];
}

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

export type LanguageCode = 'en' | 'hi' | 'es' | 'it' | 'fr' | 'de' | 'ja';

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
  budgetMin?: number;
  budgetMax?: number;
  currency?: string;
  explicitCountry?: string;
  location?: string;
  useCase?: string;
  brand?: string;
  productType?: string;
  comparisonEntities?: [string, string];
  specifications?: string[];
  features?: string[];
  negativeConstraints?: string[];
  multiComparisonEntities?: string[];
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

export interface ComparisonQuery {
  query: string;
  productA: string;
  productB: string;
  useCase?: string;
  budget?: string;
  market?: MarketCode;
}

export interface ComparisonAspect {
  aspect: string;
  productA?: string;
  productB?: string;
  evidenceA: EvidencePoint[];
  evidenceB: EvidencePoint[];
  status:
    | 'A_STRONGER'
    | 'B_STRONGER'
    | 'SIMILAR'
    | 'INCONCLUSIVE';
}

export interface ComparisonResult {
  query: string;
  productA: string;
  productB: string;
  aspects: ComparisonAspect[];
  productAStrengths: string[];
  productBStrengths: string[];
  productAWeaknesses: string[];
  productBWeaknesses: string[];
  tradeoffs: string[];
  contradictions: string[];
  missingInformation: string[];
  overallAssessment: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';
  evidenceStrength: 'STRONG' | 'MODERATE' | 'LIMITED' | 'INSUFFICIENT';
  sourceStatus: SourceStatus;
  decision: 'A' | 'B' | 'NEITHER' | 'CONDITIONAL' | 'INSUFFICIENT_EVIDENCE';
}

export interface DecisionResult {
  parsedQuery: ParsedQuery;
  status: 'SUCCESS' | 'NO_RESULTS' | 'ERROR';
  message?: string;
  items: EntityItem[];
  alternatives?: EntityItem[];
  comparison?: ComparisonItem;
  comparisonResult?: ComparisonResult;
  retrievedAt: string;
  nichod?: NichodResult;
  decision?: DecisionEngineResult;
}
