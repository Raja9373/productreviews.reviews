/**
 * ProductReviews.review — Master Question Catalog
 * High-performance, memory-efficient index and retrieval engine for the 10,000 Master Questions.
 */

import {
  MasterQuestion,
  MasterQuestionFilter,
  MasterQuestionMatch,
  MasterQuestionAuditReport,
  MasterIntentType
} from './masterQuestionTypes';
import { normalizeMasterQuestion, extractIntentTokens } from './questionNormalizer';
import { generatePhase15ExpansionCatalog } from './phase15Expansion';
import { generatePhase21ExpansionCatalog } from './phase21Expansion';
import { generatePhase22ExpansionCatalog } from './phase22Expansion';
import { generatePhase23AExpansionCatalog } from './phase23AExpansion';
import { generatePhase23BExpansionCatalog } from './phase23BExpansion';
import { generatePhase23CExpansionCatalog } from './phase23CExpansion';

// Import chunk files statically or on-demand
import chunk1 from './data/questions_chunk_1.json';
import chunk2 from './data/questions_chunk_2.json';
import chunk3 from './data/questions_chunk_3.json';
import chunk4 from './data/questions_chunk_4.json';
import chunk5 from './data/questions_chunk_5.json';
import chunk6 from './data/questions_chunk_6.json';
import chunk7 from './data/questions_chunk_7.json';
import chunk8 from './data/questions_chunk_8.json';
import chunk9 from './data/questions_chunk_9.json';
import chunk10 from './data/questions_chunk_10.json';
import auditSummaryJson from './data/audit_summary.json';

class MasterQuestionCatalogStore {
  private questions: MasterQuestion[] = [];
  private idIndex = new Map<string, MasterQuestion>();
  private normalizedIndex = new Map<string, MasterQuestion>();
  private categoryIndex = new Map<string, MasterQuestion[]>();
  private intentIndex = new Map<MasterIntentType, MasterQuestion[]>();
  private isInitialized = false;

  constructor() {
    this.init();
  }

  private init() {
    if (this.isInitialized) return;

    // Concatenate all 10 chunks plus Phase 15 expansion to reach 25,000
    const baseQuestions = [
      ...(chunk1 as MasterQuestion[]),
      ...(chunk2 as MasterQuestion[]),
      ...(chunk3 as MasterQuestion[]),
      ...(chunk4 as MasterQuestion[]),
      ...(chunk5 as MasterQuestion[]),
      ...(chunk6 as MasterQuestion[]),
      ...(chunk7 as MasterQuestion[]),
      ...(chunk8 as MasterQuestion[]),
      ...(chunk9 as MasterQuestion[]),
      ...(chunk10 as MasterQuestion[])
    ];

    const phase15Questions = generatePhase15ExpansionCatalog(baseQuestions);
    const baseAndPhase15 = [...baseQuestions, ...phase15Questions];
    const phase21Questions = generatePhase21ExpansionCatalog(baseAndPhase15);
    const upTo50k = [...baseAndPhase15, ...phase21Questions];
    const phase22Questions = generatePhase22ExpansionCatalog(upTo50k);
    const upTo100k = [...upTo50k, ...phase22Questions];
    const phase23AQuestions = generatePhase23AExpansionCatalog(upTo100k);
    const upTo150k = [...upTo100k, ...phase23AQuestions];
    const phase23BQuestions = generatePhase23BExpansionCatalog(upTo150k);
    const upTo200k = [...upTo150k, ...phase23BQuestions];
    const phase23CQuestions = generatePhase23CExpansionCatalog(upTo200k);

    this.questions = [...upTo200k, ...phase23CQuestions];

    // Build indices for O(1) lookups
    for (const q of this.questions) {
      this.idIndex.set(q.id, q);
      this.normalizedIndex.set(q.normalizedQuestion, q);

      // Category index
      const catList = this.categoryIndex.get(q.productCategory) || [];
      catList.push(q);
      this.categoryIndex.set(q.productCategory, catList);

      // Intent index
      const intentList = this.intentIndex.get(q.intentType) || [];
      intentList.push(q);
      this.intentIndex.set(q.intentType, intentList);
    }

    this.isInitialized = true;
  }

  /**
   * Total number of master questions loaded in catalog
   */
  public getTotalCount(): number {
    return this.questions.length;
  }

  /**
   * Get all master questions
   */
  public getAllQuestions(): readonly MasterQuestion[] {
    return this.questions;
  }

  /**
   * Retrieve a Master Question by its unique ID
   */
  public getById(id: string): MasterQuestion | undefined {
    return this.idIndex.get(id);
  }

  /**
   * Retrieve a Master Question by exact normalized question string
   */
  public getByNormalized(normalizedQuestion: string): MasterQuestion | undefined {
    return this.normalizedIndex.get(normalizeMasterQuestion(normalizedQuestion));
  }

  /**
   * Retrieve all questions for a given category
   */
  public getByCategory(category: string): MasterQuestion[] {
    return this.categoryIndex.get(category.toLowerCase()) || [];
  }

  /**
   * Retrieve all questions for a given intent type
   */
  public getByIntent(intentType: MasterIntentType): MasterQuestion[] {
    return this.intentIndex.get(intentType) || [];
  }

  /**
   * Query and filter master questions with pagination support
   */
  public query(filter: MasterQuestionFilter): {
    items: MasterQuestion[];
    total: number;
    hasMore: boolean;
  } {
    let result = this.questions;

    if (filter.productCategory) {
      const cats = Array.isArray(filter.productCategory)
        ? filter.productCategory.map((c) => c.toLowerCase())
        : [filter.productCategory.toLowerCase()];
      result = result.filter((q) => cats.includes(q.productCategory.toLowerCase()));
    }

    if (filter.intentType) {
      const intents = Array.isArray(filter.intentType) ? filter.intentType : [filter.intentType];
      result = result.filter((q) => intents.includes(q.intentType));
    }

    if (filter.questionType) {
      const qTypes = Array.isArray(filter.questionType) ? filter.questionType : [filter.questionType];
      result = result.filter((q) => qTypes.includes(q.questionType));
    }

    if (filter.commercialIntent) {
      result = result.filter((q) => q.commercialIntent === filter.commercialIntent);
    }

    if (filter.marketScope) {
      result = result.filter((q) => q.marketScope === filter.marketScope);
    }

    if (filter.languageScope) {
      result = result.filter((q) => q.languageScope === filter.languageScope);
    }

    if (filter.priority) {
      const priorities = Array.isArray(filter.priority) ? filter.priority : [filter.priority];
      result = result.filter((q) => priorities.includes(q.priority));
    }

    if (filter.entityRequired !== undefined) {
      result = result.filter((q) => q.entityRequired === filter.entityRequired);
    }

    if (filter.comparisonRequired !== undefined) {
      result = result.filter((q) => q.comparisonRequired === filter.comparisonRequired);
    }

    if (filter.useCase) {
      const ucLower = filter.useCase.toLowerCase();
      result = result.filter((q) => q.useCase?.toLowerCase().includes(ucLower));
    }

    if (filter.searchQuery && filter.searchQuery.trim().length > 0) {
      const tokens = extractIntentTokens(filter.searchQuery);
      if (tokens.length > 0) {
        result = result.filter((q) => {
          const norm = q.normalizedQuestion;
          return tokens.some((t) => norm.includes(t));
        });
      }
    }

    const total = result.length;
    const offset = filter.offset || 0;
    const limit = filter.limit || 50;
    const items = result.slice(offset, offset + limit);

    return {
      items,
      total,
      hasMore: offset + limit < total
    };
  }

  /**
   * Matches a raw user input query against the most relevant Master Question intent
   */
  public matchIntent(rawQuery: string): MasterQuestionMatch | null {
    if (!rawQuery || rawQuery.trim().length === 0) return null;

    const normalized = normalizeMasterQuestion(rawQuery);

    // 1. Exact match
    const exact = this.normalizedIndex.get(normalized);
    if (exact) {
      return {
        masterQuestion: exact,
        confidenceScore: 1.0,
        matchedTerms: extractIntentTokens(rawQuery)
      };
    }

    // 2. Semantic token overlap match
    const tokens = extractIntentTokens(rawQuery);
    if (tokens.length === 0) return null;

    let bestMatch: MasterQuestion | null = null;
    let highestScore = 0;
    let matchedTerms: string[] = [];

    // Search across candidates
    for (const q of this.questions) {
      let score = 0;
      const currentMatched: string[] = [];
      const normQ = q.normalizedQuestion;

      for (const t of tokens) {
        if (normQ.includes(t)) {
          score += 1;
          currentMatched.push(t);
        }
      }

      const normalizedScore = score / Math.max(tokens.length, 1);
      if (normalizedScore > highestScore) {
        highestScore = normalizedScore;
        bestMatch = q;
        matchedTerms = currentMatched;
      }

      if (highestScore >= 0.9) break; // Strong match found
    }

    if (bestMatch && highestScore >= 0.3) {
      return {
        masterQuestion: bestMatch,
        confidenceScore: Math.min(highestScore, 0.95),
        matchedTerms
      };
    }

    return null;
  }

  /**
   * Retrieves the comprehensive forensic audit summary
   */
  public getAuditSummary(): MasterQuestionAuditReport {
    return auditSummaryJson as unknown as MasterQuestionAuditReport;
  }
}

// Global Singleton Export
export const masterQuestionCatalog = new MasterQuestionCatalogStore();
