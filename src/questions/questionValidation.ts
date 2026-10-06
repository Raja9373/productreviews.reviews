/**
 * ProductReviews.review — Question Intelligence Validation
 * Enforces quality, schema adherence, and zero-fabrication safety rules.
 */

import { MasterQuestion, MasterIntentType, QuestionType, CommercialIntent, MarketScope, LanguageScope, SuggestedPageType, PriorityLevel, IndexabilityStatus } from './masterQuestionTypes';
import { MASTER_PRODUCT_CATEGORIES, INTENT_TYPE_METADATA } from './questionTaxonomy';

const VALID_INTENTS = new Set<MasterIntentType>(Object.keys(INTENT_TYPE_METADATA) as MasterIntentType[]);
const VALID_QUESTION_TYPES = new Set<QuestionType>([
  'GENERIC_MASTER_INTENT',
  'ENTITY_MASTER_INTENT',
  'COMPARISON_MASTER_INTENT',
  'USE_CASE_MASTER_INTENT',
  'MARKET_MASTER_INTENT',
  'PROBLEM_MASTER_INTENT',
  'SPECIFICATION_MASTER_INTENT',
  'COMPATIBILITY_MASTER_INTENT',
  'UPGRADE_MASTER_INTENT'
]);
const VALID_COMMERCIAL_INTENTS = new Set<CommercialIntent>([
  'INFORMATIONAL',
  'COMMERCIAL_RESEARCH',
  'TRANSACTIONAL',
  'MIXED'
]);
const VALID_MARKET_SCOPES = new Set<MarketScope>(['GLOBAL', 'MARKET_DEPENDENT']);
const VALID_LANGUAGE_SCOPES = new Set<LanguageScope>(['LANGUAGE_NEUTRAL', 'LOCALIZATION_REQUIRED']);
const VALID_PAGE_TYPES = new Set<SuggestedPageType>([
  'PRODUCT_RESEARCH',
  'PRODUCT_REVIEW',
  'COMPARISON',
  'BUYING_GUIDE',
  'ALTERNATIVE',
  'PROBLEM_SOLUTION',
  'USE_CASE',
  'FAQ',
  'SPECIFICATION',
  'COMPATIBILITY',
  'UPGRADE_GUIDE'
]);
const VALID_PRIORITIES = new Set<PriorityLevel>(['P0', 'P1', 'P2', 'P3']);
const VALID_INDEXABILITY = new Set<IndexabilityStatus>(['CANDIDATE', 'CONDITIONAL', 'NOT_INDEXABLE']);

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates a single MasterQuestion against all Phase 1 schema & quality rules.
 */
export function validateMasterQuestion(record: MasterQuestion): ValidationResult {
  const errors: string[] = [];

  if (!record) {
    return { isValid: false, errors: ['Record is null or undefined'] };
  }

  // ID validation
  if (!record.id || typeof record.id !== 'string' || record.id.trim().length === 0) {
    errors.push('Missing or invalid ID');
  }

  // Question validation
  if (!record.question || typeof record.question !== 'string' || record.question.trim().length < 5) {
    errors.push('Question string too short or missing (minimum 5 chars)');
  }

  if (record.question && record.question.length > 300) {
    errors.push('Question string exceeds maximum length (300 chars)');
  }

  // Normalized question validation
  if (!record.normalizedQuestion || typeof record.normalizedQuestion !== 'string') {
    errors.push('Missing or invalid normalizedQuestion');
  }

  // Intent type validation
  if (!record.intentType || !VALID_INTENTS.has(record.intentType)) {
    errors.push(`Invalid intentType: ${record.intentType}`);
  }

  // Question type validation
  if (!record.questionType || !VALID_QUESTION_TYPES.has(record.questionType)) {
    errors.push(`Invalid questionType: ${record.questionType}`);
  }

  // Product category validation
  if (!record.productCategory || typeof record.productCategory !== 'string') {
    errors.push('Missing productCategory');
  }

  // Commercial intent validation
  if (!record.commercialIntent || !VALID_COMMERCIAL_INTENTS.has(record.commercialIntent)) {
    errors.push(`Invalid commercialIntent: ${record.commercialIntent}`);
  }

  // Market scope validation
  if (!record.marketScope || !VALID_MARKET_SCOPES.has(record.marketScope)) {
    errors.push(`Invalid marketScope: ${record.marketScope}`);
  }

  // Language scope validation
  if (!record.languageScope || !VALID_LANGUAGE_SCOPES.has(record.languageScope)) {
    errors.push(`Invalid languageScope: ${record.languageScope}`);
  }

  // Suggested page type validation
  if (!record.suggestedPageType || !VALID_PAGE_TYPES.has(record.suggestedPageType)) {
    errors.push(`Invalid suggestedPageType: ${record.suggestedPageType}`);
  }

  // Priority validation
  if (!record.priority || !VALID_PRIORITIES.has(record.priority)) {
    errors.push(`Invalid priority: ${record.priority}`);
  }

  // Indexability validation
  if (!record.indexability || !VALID_INDEXABILITY.has(record.indexability)) {
    errors.push(`Invalid indexability: ${record.indexability}`);
  }

  // Entity and Comparison boolean consistency
  if (typeof record.entityRequired !== 'boolean') {
    errors.push('entityRequired must be a boolean');
  }
  if (typeof record.comparisonRequired !== 'boolean') {
    errors.push('comparisonRequired must be a boolean');
  }

  // Version and createdAt check
  if (typeof record.version !== 'number' || record.version < 1) {
    errors.push('Version must be a positive integer');
  }
  if (!record.createdAt || isNaN(Date.parse(record.createdAt))) {
    errors.push('createdAt must be a valid ISO date string');
  }

  // ZERO FABRICATION CHECK: Ensure no search-volume / ranking properties were injected
  const forbiddenKeys = ['searchVolume', 'volume', 'kd', 'keywordDifficulty', 'cpc', 'ranking', 'traffic', 'searchesPerMonth'];
  const recordAny = record as any;
  for (const fKey of forbiddenKeys) {
    if (recordAny[fKey] !== undefined) {
      errors.push(`Fabricated metric detected in record: ${fKey}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
