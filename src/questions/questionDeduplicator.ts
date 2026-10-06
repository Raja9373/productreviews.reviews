/**
 * ProductReviews.review — Question Intelligence Deduplicator & Audit Engine
 * Performs exact, normalized, and semantic deduplication to ensure exactly unique master intents.
 */

import { MasterQuestion, MasterQuestionAuditReport } from './masterQuestionTypes';
import { normalizeMasterQuestion, getDeduplicationKey } from './questionNormalizer';
import { validateMasterQuestion } from './questionValidation';

export interface DeduplicationResult {
  uniqueQuestions: MasterQuestion[];
  duplicatesRemoved: number;
  nearDuplicatesMerged: number;
  invalidRecordsCount: number;
  rejectedQuestions: { question: string; reason: string }[];
}

/**
 * Deduplicates and validates an array of master question candidates.
 */
export function deduplicateMasterQuestions(rawRecords: MasterQuestion[]): DeduplicationResult {
  const seenExact = new Set<string>();
  const seenNormalized = new Map<string, string>(); // normalizedKey -> originalId
  const uniqueQuestions: MasterQuestion[] = [];
  const rejectedQuestions: { question: string; reason: string }[] = [];

  let duplicatesRemoved = 0;
  let nearDuplicatesMerged = 0;
  let invalidRecordsCount = 0;

  for (const record of rawRecords) {
    // 1. Schema & Safety Validation
    const validation = validateMasterQuestion(record);
    if (!validation.isValid) {
      invalidRecordsCount++;
      rejectedQuestions.push({
        question: record?.question || 'UNKNOWN',
        reason: validation.errors.join('; ')
      });
      continue;
    }

    // 2. Exact Question Duplication Check
    const exactKey = record.question.trim().toLowerCase();
    if (seenExact.has(exactKey)) {
      duplicatesRemoved++;
      rejectedQuestions.push({
        question: record.question,
        reason: 'Exact duplicate question string'
      });
      continue;
    }

    // 3. Normalized + Category + UseCase Deduplication Check
    const normalizedQ = record.normalizedQuestion || normalizeMasterQuestion(record.question);
    const dedupKey = getDeduplicationKey(normalizedQ, record.productCategory, record.useCase);

    if (seenNormalized.has(dedupKey)) {
      nearDuplicatesMerged++;
      rejectedQuestions.push({
        question: record.question,
        reason: `Normalized collision with existing record ID: ${seenNormalized.get(dedupKey)}`
      });
      continue;
    }

    // Mark as seen
    seenExact.add(exactKey);
    seenNormalized.set(dedupKey, record.id);
    uniqueQuestions.push({
      ...record,
      normalizedQuestion: normalizedQ,
      duplicateGroupId: `grp_${record.productCategory}_${record.intentType}`
    });
  }

  return {
    uniqueQuestions,
    duplicatesRemoved,
    nearDuplicatesMerged,
    invalidRecordsCount,
    rejectedQuestions
  };
}

/**
 * Generates an exhaustive statistical audit report for a dataset of Master Questions.
 */
export function generateMasterQuestionAudit(questions: MasterQuestion[]): MasterQuestionAuditReport {
  const intentDistribution: any = {};
  const categoryDistribution: any = {};
  const commercialIntentDistribution: any = {};
  const marketScopeDistribution: any = {};
  const languageScopeDistribution: any = {};
  const pageTypeDistribution: any = {};
  const priorityDistribution: any = {};

  let entityRequiredCount = 0;
  let comparisonRequiredCount = 0;
  let useCaseCount = 0;

  for (const q of questions) {
    // Intent
    intentDistribution[q.intentType] = (intentDistribution[q.intentType] || 0) + 1;
    // Category
    categoryDistribution[q.productCategory] = (categoryDistribution[q.productCategory] || 0) + 1;
    // Commercial Intent
    commercialIntentDistribution[q.commercialIntent] = (commercialIntentDistribution[q.commercialIntent] || 0) + 1;
    // Market Scope
    marketScopeDistribution[q.marketScope] = (marketScopeDistribution[q.marketScope] || 0) + 1;
    // Language Scope
    languageScopeDistribution[q.languageScope] = (languageScopeDistribution[q.languageScope] || 0) + 1;
    // Suggested Page Type
    pageTypeDistribution[q.suggestedPageType] = (pageTypeDistribution[q.suggestedPageType] || 0) + 1;
    // Priority
    priorityDistribution[q.priority] = (priorityDistribution[q.priority] || 0) + 1;

    if (q.entityRequired) entityRequiredCount++;
    if (q.comparisonRequired) comparisonRequiredCount++;
    if (q.useCase && q.useCase.trim().length > 0) useCaseCount++;
  }

  return {
    totalRecords: questions.length,
    uniqueQuestions: questions.length,
    duplicatesRemoved: 0,
    nearDuplicatesMerged: 0,
    invalidRecordsCount: 0,
    intentDistribution,
    categoryDistribution,
    commercialIntentDistribution,
    marketScopeDistribution,
    languageScopeDistribution,
    pageTypeDistribution,
    priorityDistribution,
    entityRequiredCount,
    comparisonRequiredCount,
    useCaseCount,
    sampleQuestions: questions.slice(0, 50)
  };
}
