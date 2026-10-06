/**
 * ProductReviews.review — Question Intelligence Service
 * Integrates Master Question intelligence into query understanding, search suggestions, and NICHOD routing.
 */

import { MasterQuestion, MasterQuestionMatch, MasterIntentType } from './masterQuestionTypes';
import { masterQuestionCatalog } from './masterQuestionCatalog';
import { ParsedQuery, MarketCode, LanguageCode } from '../types';
import { ResolvedQuestionContext, resolveQuestionContext, ResolveQuestionContextOptions } from './context';
import { ResearchPlan, createResearchPlan, buildResearchContext } from '../search/research';

export interface EnrichedQueryIntelligence {
  originalQuery: string;
  matchedMasterQuestion?: MasterQuestion;
  intentConfidence: number;
  suggestedRelatedQuestions: MasterQuestion[];
  commercialClassification: string;
  targetPageType?: string;
  marketScope: string;
  resolvedContext?: ResolvedQuestionContext;
  researchPlan?: ResearchPlan;
}

/**
 * Aligns a parsed search query with the Master Question database and attaches dynamic context
 */
export function alignQueryWithMasterIntent(
  rawQuery: string,
  parsedQuery?: ParsedQuery,
  options?: ResolveQuestionContextOptions
): EnrichedQueryIntelligence {
  const match = masterQuestionCatalog.matchIntent(rawQuery);

  let related: MasterQuestion[] = [];
  if (match) {
    // Get related questions in same category and compatible intent
    related = masterQuestionCatalog.query({
      productCategory: match.masterQuestion.productCategory,
      limit: 5
    }).items.filter((q) => q.id !== match.masterQuestion.id);
  } else if (parsedQuery?.constraints?.productType || parsedQuery?.constraints?.brand) {
    // Find category matches for extracted entity or brand
    const searchTarget = parsedQuery.constraints.productType || parsedQuery.constraints.brand || '';
    related = masterQuestionCatalog.query({
      searchQuery: searchTarget,
      limit: 5
    }).items;
  }

  let resolvedContext: ResolvedQuestionContext | undefined;
  let researchPlan: ResearchPlan | undefined;
  if (match) {
    resolvedContext = resolveQuestionContext(match.masterQuestion, rawQuery, {
      parsedQuery,
      ...options
    });
    const researchCtx = buildResearchContext(rawQuery, { resolvedContext });
    researchPlan = createResearchPlan(researchCtx);
  }

  return {
    originalQuery: rawQuery,
    matchedMasterQuestion: match?.masterQuestion,
    intentConfidence: match?.confidenceScore || 0,
    suggestedRelatedQuestions: related,
    commercialClassification: match?.masterQuestion.commercialIntent || 'COMMERCIAL_RESEARCH',
    targetPageType: match?.masterQuestion.suggestedPageType,
    marketScope: match?.masterQuestion.marketScope || 'GLOBAL',
    resolvedContext,
    researchPlan
  };
}

/**
 * Returns curated high-priority master question suggestions for a category or intent
 */
export function getMasterQuestionSuggestions(
  category?: string,
  intentType?: MasterIntentType,
  limit: number = 8
): MasterQuestion[] {
  return masterQuestionCatalog.query({
    productCategory: category,
    intentType,
    priority: ['P0', 'P1'],
    limit
  }).items;
}
