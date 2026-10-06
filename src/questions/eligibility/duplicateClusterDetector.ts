/**
 * ProductReviews.review — Intent Cluster & Duplicate Cannibalization Detector
 * Deterministically groups queries with identical underlying intent to prevent self-cannibalization.
 * Preserves all original master questions while establishing canonical clustering.
 */

import { IntentClusterResult, IntentDuplicateStatus } from './eligibilityTypes';
import { normalizeMasterQuestion } from '../questionNormalizer';

/**
 * Generates an Intent Cluster ID from normalized intent core, category, and use-case
 */
export function detectIntentCluster(
  question: string,
  category: string = 'global',
  useCase?: string,
  questionId?: string
): IntentClusterResult {
  const norm = normalizeMasterQuestion(question);
  const cleanCategory = category.toLowerCase().trim();
  const cleanUseCase = (useCase || 'general').toLowerCase().trim();

  // Extract canonical intent stem
  let intentStem = 'research';
  if (/\b(?:worth it|worth buying|should i buy)\b/i.test(norm)) {
    intentStem = 'worth_buying';
  } else if (/\b(?:vs|versus|difference)\b/i.test(norm)) {
    intentStem = 'comparison';
  } else if (/\balternatives?\b/i.test(norm)) {
    intentStem = 'alternatives';
  } else if (/\b(?:problems?|defects?|complaints?)\b/i.test(norm)) {
    intentStem = 'problems';
  } else if (/\b(?:reliable|reliability|durability)\b/i.test(norm)) {
    intentStem = 'reliability';
  } else if (/\b(?:best|top)\b/i.test(norm)) {
    intentStem = 'best_recommendation';
  } else if (/\b(?:compatible|compatibility)\b/i.test(norm)) {
    intentStem = 'compatibility';
  } else if (/\b(?:upgrade|upgrading)\b/i.test(norm)) {
    intentStem = 'upgrade';
  }

  // Canonical Cluster Key (Uses Category and Use-case to maintain distinctness)
  const intentClusterId = `cluster::${cleanCategory}::${cleanUseCase}::${intentStem}`;
  const canonicalIntentId = `canonical::${cleanCategory}::${cleanUseCase}::${intentStem}`;

  let duplicateStatus: IntentDuplicateStatus = 'CANONICAL';

  // Check if query is a minor rephrasing variant
  if (norm.startsWith('should i buy') && intentStem === 'worth_buying') {
    duplicateStatus = 'VARIANT';
  } else if (norm.includes('is it worth it') && intentStem === 'worth_buying') {
    duplicateStatus = 'VARIANT';
  } else if (cleanUseCase !== 'general') {
    duplicateStatus = 'DISTINCT';
  }

  return {
    intentClusterId,
    canonicalIntentId,
    duplicateStatus,
    clusterRationale: `Clustered into ${intentStem} for category ${cleanCategory} and use-case ${cleanUseCase}`
  };
}
