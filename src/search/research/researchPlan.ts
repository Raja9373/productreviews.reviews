/**
 * ProductReviews.review — Deterministic Research Query Planner
 * Generates focused, market-segregated search query tracks for global specs and local market facts.
 */

import { ResearchContext } from './researchContext';

export interface ResearchQueryTrack {
  globalQueries: string[];
  localQueries: string[];
  regionalQueries: string[];
}

export interface ResearchPlan {
  context: ResearchContext;
  queryTracks: ResearchQueryTrack;
  comparisonTrackB?: ResearchQueryTrack;
  plannedExecution: {
    executeGlobalSearch: boolean;
    executeLocalSearch: boolean;
    executeRegionalSearch: boolean;
  };
}

/**
 * Builds a deterministic query track for a specific entity and market
 */
function buildEntityQueryTrack(
  entityName: string,
  marketName?: string,
  marketCode?: string,
  useCase?: string,
  intentType?: string,
  currency?: string
): ResearchQueryTrack {
  const globalQueries: string[] = [];
  const localQueries: string[] = [];
  const regionalQueries: string[] = [];

  const ucClause = useCase ? `for ${useCase}` : '';

  // 1. Global Technical Queries (universal hardware and editorial benchmarks)
  if (intentType === 'PROBLEM') {
    globalQueries.push(`${entityName} common problems complaints defects issues`);
  } else if (intentType === 'RELIABILITY') {
    globalQueries.push(`${entityName} long term reliability build quality durability`);
  } else if (intentType === 'COMPATIBILITY') {
    globalQueries.push(`${entityName} specifications compatibility OS support`);
  } else {
    globalQueries.push(`${entityName} review strengths weaknesses test ${ucClause}`.trim());
    globalQueries.push(`${entityName} performance battery camera specifications`.trim());
  }

  // 2. Local Market Queries (strictly when a specific local market is requested)
  if (marketCode && marketCode !== 'GLOBAL' && marketName) {
    const currClause = currency ? `price in ${currency}` : 'price';
    localQueries.push(`${entityName} ${marketName} ${currClause} official authorized retailers`.trim());
    localQueries.push(`${entityName} ${marketName} warranty service availability`.trim());

    // Cellular or voltage compatibility if relevant
    if (intentType === 'COMPATIBILITY') {
      localQueries.push(`${entityName} ${marketName} 5G bands voltage frequency compatibility`.trim());
    }
  }

  // 3. Regional Queries (e.g. EU regulations)
  if (['DE', 'FR', 'IT', 'ES', 'NL'].includes(marketCode || '')) {
    regionalQueries.push(`${entityName} European Union warranty CE standard regulations`.trim());
  }

  return {
    globalQueries,
    localQueries,
    regionalQueries
  };
}

/**
 * Creates a comprehensive ResearchPlan for a ResearchContext
 */
export function createResearchPlan(context: ResearchContext): ResearchPlan {
  const primaryEntityName = context.entity?.name || context.query;
  const marketName = context.market.countryCode !== 'GLOBAL' ? context.market.marketName : undefined;
  const marketCode = context.market.countryCode;

  const queryTracks = buildEntityQueryTrack(
    primaryEntityName,
    marketName,
    marketCode,
    context.useCase,
    context.intentType,
    context.market.currency
  );

  let comparisonTrackB: ResearchQueryTrack | undefined;
  if (context.isComparison && context.comparisonEntity?.name) {
    comparisonTrackB = buildEntityQueryTrack(
      context.comparisonEntity.name,
      marketName,
      marketCode,
      context.useCase,
      context.intentType,
      context.market.currency
    );
  }

  const isLocalActive = Boolean(marketCode && marketCode !== 'GLOBAL' && queryTracks.localQueries.length > 0);
  const isRegionalActive = Boolean(queryTracks.regionalQueries.length > 0);

  return {
    context,
    queryTracks,
    comparisonTrackB,
    plannedExecution: {
      executeGlobalSearch: queryTracks.globalQueries.length > 0,
      executeLocalSearch: isLocalActive,
      executeRegionalSearch: isRegionalActive
    }
  };
}
