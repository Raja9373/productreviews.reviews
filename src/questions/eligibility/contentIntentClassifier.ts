/**
 * ProductReviews.review — Content Intent Classifier
 * Classifies Master Questions and user queries into deterministic Content Intent categories.
 */

import { MasterQuestion, MasterIntentType } from '../masterQuestionTypes';
import { ContentIntentType } from './eligibilityTypes';

const INTENT_MAP: Record<MasterIntentType, ContentIntentType> = {
  PRODUCT_RESEARCH: 'PRODUCT_RESEARCH',
  REVIEW: 'PRODUCT_REVIEW',
  WORTH_IT: 'WORTH_IT',
  BUYING_DECISION: 'BUYING_DECISION',
  COMPARISON: 'COMPARISON',
  ALTERNATIVE: 'ALTERNATIVE',
  PROBLEM: 'PROBLEM_SOLUTION',
  RELIABILITY: 'RELIABILITY',
  PRICE_VALUE: 'PRICE_VALUE',
  FEATURE: 'FEATURE_EXPLAINER',
  SPECIFICATION: 'SPECIFICATION',
  COMPATIBILITY: 'COMPATIBILITY',
  USE_CASE: 'USE_CASE',
  BEST_FOR: 'BUYING_GUIDE',
  BEGINNER: 'BUYING_GUIDE',
  PROFESSIONAL: 'BUYING_GUIDE',
  UPGRADE: 'UPGRADE',
  GENERATION: 'GENERATION',
  BRAND: 'BRAND',
  SAFETY: 'SAFETY',
  MAINTENANCE: 'PROBLEM_SOLUTION',
  AVAILABILITY: 'AVAILABILITY',
  MARKET: 'BUYING_GUIDE',
  TRUST_EVIDENCE: 'TRUST_EVIDENCE'
};

/**
 * Classifies content intent from a MasterQuestion and optional raw query
 */
export function classifyContentIntent(
  masterQuestion?: MasterQuestion,
  query?: string
): ContentIntentType {
  const cleanQ = (query || '').toLowerCase().trim();

  // If a specific query string is provided with explicit intent signals, evaluate query signals
  if (cleanQ) {
    if (/\b(?:vs\.?|versus|compared to|difference between)\b/i.test(cleanQ)) {
      return 'COMPARISON';
    }
    if (/\b(?:worth it|worth buying|worth the money)\b/i.test(cleanQ)) {
      return 'WORTH_IT';
    }
    if (/\b(?:should i buy|buy or wait)\b/i.test(cleanQ)) {
      return 'BUYING_DECISION';
    }
    if (/\b(?:alternative|alternatives|competitor|replace)\b/i.test(cleanQ)) {
      return 'ALTERNATIVE';
    }
    if (/\b(?:problem|problems|defect|complaint|issue|issues|overheating)\b/i.test(cleanQ)) {
      return 'PROBLEM_SOLUTION';
    }
    if (/\b(?:reliable|reliability|durability|how long does it last)\b/i.test(cleanQ)) {
      return 'RELIABILITY';
    }
    if (/\b(?:compatible|compatibility|work with|support)\b/i.test(cleanQ)) {
      return 'COMPATIBILITY';
    }
    if (/\b(?:for gaming|for video editing|for students|for photography|for travel|for office)\b/i.test(cleanQ)) {
      return 'USE_CASE';
    }
    if (/\b(?:upgrade|upgrade from|older model)\b/i.test(cleanQ)) {
      return 'UPGRADE';
    }
    if (/\b(?:price|cost|how much|under|cheap|budget)\b/i.test(cleanQ)) {
      return 'PRICE_VALUE';
    }
    if (/\b(?:review|test|hands on|tested|benchmarks)\b/i.test(cleanQ)) {
      return 'PRODUCT_REVIEW';
    }
    if (/\b(?:available|in stock|buy in)\b/i.test(cleanQ)) {
      return 'AVAILABILITY';
    }
  }

  if (masterQuestion?.intentType && INTENT_MAP[masterQuestion.intentType]) {
    return INTENT_MAP[masterQuestion.intentType];
  }

  return 'PRODUCT_RESEARCH';
}
