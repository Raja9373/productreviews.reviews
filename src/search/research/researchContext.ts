/**
 * ProductReviews.review — Research Context Architecture
 * Maps query and entity/market context to explicit evidence requirements and research scopes.
 */

import { ResolvedQuestionContext } from '../../questions/context';
import { parseSearchQuery } from '../queryParser';
import { resolveQuestionContext } from '../../questions/context/questionContextResolver';
import { masterQuestionCatalog } from '../../questions/masterQuestionCatalog';

export type ResearchScopeType = 'GLOBAL' | 'LOCAL' | 'REGIONAL' | 'MIXED';

export interface ResearchContext {
  questionId?: string;
  query: string;
  intentType?: string;
  entity?: {
    entityId?: string;
    name?: string;
    brand?: string;
    category?: string;
    model?: string;
    generation?: string;
    variant?: string;
    sku?: string;
  };
  comparisonEntity?: {
    entityId?: string;
    name?: string;
    brand?: string;
    category?: string;
    model?: string;
    generation?: string;
    variant?: string;
    sku?: string;
  };
  isComparison: boolean;
  market: {
    countryCode?: string;
    marketName?: string;
    currency?: string;
    language?: string;
  };
  useCase?: string;
  constraints?: Record<string, unknown>;
  researchScope: ResearchScopeType;
  evidenceRequirements: string[];
  criticalLocalFacts: string[];
  unresolvedContext: string[];
}

export interface BuildResearchContextOptions {
  resolvedContext?: ResolvedQuestionContext;
  forcedScope?: ResearchScopeType;
}

/**
 * Derives the research scope from market context and intent
 */
export function determineResearchScope(
  marketCode?: string,
  intentType?: string,
  query?: string
): ResearchScopeType {
  const isGlobalMarket = !marketCode || marketCode === 'GLOBAL';
  const cleanQ = (query || '').toLowerCase();

  // Purely local query (e.g., price, warranty, availability in a specific country)
  const isPureLocal = (
    cleanQ.includes('price in') ||
    cleanQ.includes('cost in') ||
    cleanQ.includes('warranty in') ||
    cleanQ.includes('available in') ||
    cleanQ.includes('launch date in') ||
    cleanQ.includes('where to buy in')
  ) && !isGlobalMarket;

  if (isPureLocal) return 'LOCAL';

  // Regional (EU / UK regulatory or regional standard)
  if (['DE', 'FR', 'IT', 'ES', 'NL'].includes(marketCode || '') && (cleanQ.includes('eu') || cleanQ.includes('europe') || cleanQ.includes('ce mark'))) {
    return 'REGIONAL';
  }

  // Mixed: Product evaluation combined with a specific market (e.g., "Is iPhone 16 Pro worth it in India?")
  if (!isGlobalMarket) {
    return 'MIXED';
  }

  // Default: General product evaluation across global specifications
  return 'GLOBAL';
}

/**
 * Builds a deterministic list of evidence requirements based on intent type
 */
export function getEvidenceRequirements(
  intentType?: string,
  isComparison?: boolean,
  hasLocalMarket?: boolean
): { evidenceRequirements: string[]; criticalLocalFacts: string[] } {
  const requirements: string[] = [];
  const criticalLocal: string[] = [];

  switch (intentType) {
    case 'WORTH_IT':
    case 'BUYING_DECISION':
    case 'REVIEW':
      requirements.push('hardware specifications and lab test results');
      requirements.push('verified strengths and real-world weaknesses');
      requirements.push('user feedback and reliability track record');
      requirements.push('use-case performance benchmarks');
      if (hasLocalMarket) {
        criticalLocal.push('local retail pricing and value calculation');
        criticalLocal.push('local manufacturer warranty and service terms');
        criticalLocal.push('local stock availability and merchant legitimacy');
      }
      break;

    case 'COMPARISON':
    case 'GENERATION':
      requirements.push('head-to-head architectural and hardware differences');
      requirements.push('direct feature parity and spec trade-offs');
      requirements.push('aspect-by-aspect performance benchmarks');
      if (hasLocalMarket) {
        criticalLocal.push('local market price differential between Model A and Model B');
        criticalLocal.push('regional variant availability for both models');
      }
      break;

    case 'PROBLEM':
    case 'SAFETY':
      requirements.push('documented hardware or software defects and failure modes');
      requirements.push('thermal, battery, or build vulnerabilities');
      requirements.push('frequency of reported consumer complaints');
      if (hasLocalMarket) {
        criticalLocal.push('local recall notices or regional service advisories');
      }
      break;

    case 'COMPATIBILITY':
      requirements.push('cross-platform standard and OS support');
      requirements.push('port, protocol, and ecosystem requirements');
      if (hasLocalMarket) {
        criticalLocal.push('local cellular network band compatibility (LTE/5G)');
        criticalLocal.push('regional electrical voltage and plug standard');
      }
      break;

    case 'PRICE_VALUE':
      requirements.push('market competitive alternatives in same budget bracket');
      requirements.push('historical value retention');
      if (hasLocalMarket) {
        criticalLocal.push('verified local currency price from authorized retailers');
      }
      break;

    default:
      requirements.push('general technical specifications and capabilities');
      requirements.push('primary use-case suitability');
      if (hasLocalMarket) {
        criticalLocal.push('regional availability and local support');
      }
      break;
  }

  return { evidenceRequirements: requirements, criticalLocalFacts: criticalLocal };
}

/**
 * Constructs a comprehensive ResearchContext for a query
 */
export function buildResearchContext(
  query: string,
  options: BuildResearchContextOptions = {}
): ResearchContext {
  const cleanQ = (query || '').trim();

  // If a pre-resolved context is supplied, leverage it
  let resolvedCtx = options.resolvedContext;
  if (!resolvedCtx) {
    const matched = masterQuestionCatalog.matchIntent(cleanQ);
    const parsed = parseSearchQuery(cleanQ);
    const sampleMQ = matched?.masterQuestion || masterQuestionCatalog.getById('MQ-000001')!;
    resolvedCtx = resolveQuestionContext(sampleMQ, cleanQ, { parsedQuery: parsed });
  }

  const marketCode = resolvedCtx.market.countryCode;
  const hasLocalMarket = Boolean(marketCode && marketCode !== 'GLOBAL');
  const scope = options.forcedScope || determineResearchScope(marketCode, resolvedCtx.intentType, cleanQ);

  const { evidenceRequirements, criticalLocalFacts } = getEvidenceRequirements(
    resolvedCtx.intentType,
    resolvedCtx.isComparison,
    hasLocalMarket
  );

  return {
    questionId: resolvedCtx.questionId,
    query: cleanQ,
    intentType: resolvedCtx.intentType,
    entity: {
      entityId: resolvedCtx.entity.entityId,
      name: resolvedCtx.entity.entityName || resolvedCtx.entity.model,
      brand: resolvedCtx.entity.brand,
      category: resolvedCtx.entity.productCategory,
      model: resolvedCtx.entity.model,
      generation: resolvedCtx.entity.generation,
      variant: resolvedCtx.entity.variant,
      sku: resolvedCtx.entity.sku
    },
    comparisonEntity: resolvedCtx.comparisonEntity ? {
      entityId: resolvedCtx.comparisonEntity.entityId,
      name: resolvedCtx.comparisonEntity.entityName || resolvedCtx.comparisonEntity.model,
      brand: resolvedCtx.comparisonEntity.brand,
      category: resolvedCtx.comparisonEntity.productCategory,
      model: resolvedCtx.comparisonEntity.model,
      generation: resolvedCtx.comparisonEntity.generation,
      variant: resolvedCtx.comparisonEntity.variant,
      sku: resolvedCtx.comparisonEntity.sku
    } : undefined,
    isComparison: resolvedCtx.isComparison,
    market: {
      countryCode: resolvedCtx.market.countryCode,
      marketName: resolvedCtx.market.marketName,
      currency: resolvedCtx.currency.currencyCode !== 'UNRESOLVED' ? resolvedCtx.currency.currencyCode : undefined,
      language: resolvedCtx.language.languageCode
    },
    useCase: resolvedCtx.useCase,
    constraints: resolvedCtx.constraints,
    researchScope: scope,
    evidenceRequirements,
    criticalLocalFacts,
    unresolvedContext: resolvedCtx.unresolvedFields
  };
}
