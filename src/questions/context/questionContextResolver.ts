/**
 * ProductReviews.review — Question Context Resolver
 * Integrates Master Question intent, entity binding, market, language, and currency contexts.
 */

import { MasterQuestion } from '../masterQuestionTypes';
import { ParsedQuery, MarketCode, LanguageCode } from '../../types';
import { QuestionEntityBinding, bindEntityToMasterQuestion, bindComparisonEntities } from './entityBinding';
import { MarketContext, resolveMarketContext } from './marketContext';
import { LanguageContext, resolveLanguageContext } from './languageContext';
import { CurrencyContext, resolveCurrencyContext } from './currencyContext';
import { LocalizationContext, resolveLocalizationContext } from './localizationContext';

export interface ResolveQuestionContextOptions {
  parsedQuery?: ParsedQuery;
  userMarket?: MarketCode;
  userLang?: LanguageCode | string;
  appLocale?: string;
  customConstraints?: Record<string, unknown>;
}

export interface ResolvedQuestionContext {
  questionId: string;
  intentType: string;
  query?: string;
  entity: QuestionEntityBinding;
  comparisonEntity?: QuestionEntityBinding;
  isComparison: boolean;
  market: MarketContext;
  language: LanguageContext;
  currency: CurrencyContext;
  localization: LocalizationContext;
  useCase?: string;
  constraints?: Record<string, unknown>;
  localizationMode: 'MASTER' | 'LOCALIZED' | 'MARKET_SPECIFIC';
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';
  unresolvedFields: string[];
}

/**
 * Resolves full multi-dimensional context for a Master Question and user query
 */
export function resolveQuestionContext(
  masterQuestion: MasterQuestion,
  query: string,
  options: ResolveQuestionContextOptions = {}
): ResolvedQuestionContext {
  const { parsedQuery, userMarket, userLang, appLocale, customConstraints } = options;

  // 1. Resolve Market Context
  const market = resolveMarketContext(query, userMarket, appLocale);

  // 2. Resolve Language Context
  const language = resolveLanguageContext(query, userLang, appLocale, market);

  // 3. Resolve Currency & Budget Context
  const currency = resolveCurrencyContext(query, market);

  // 4. Resolve Localization Context
  const localization = resolveLocalizationContext(language, market);

  // 5. Entity Binding (Handling Comparison vs Single Entity)
  let entity: QuestionEntityBinding;
  let comparisonEntity: QuestionEntityBinding | undefined;
  let isComparison = false;

  if (masterQuestion.comparisonRequired || /\b(?:vs\.?|versus|compared to)\b/i.test(query)) {
    const compResult = bindComparisonEntities(masterQuestion.id, query, parsedQuery);
    entity = compResult.entityA;
    comparisonEntity = compResult.entityB;
    isComparison = compResult.isComparison;
  } else {
    entity = bindEntityToMasterQuestion(masterQuestion.id, query, parsedQuery, masterQuestion.productCategory);
  }

  // 6. Use Case Resolution
  let useCase: string | undefined = masterQuestion.useCase;
  if (parsedQuery?.constraints?.useCase) {
    useCase = parsedQuery.constraints.useCase;
  } else {
    // Check for explicit query use-case indicators
    const ucMatch = query.match(/\bfor\s+([a-zA-Z0-9\s-]+?)(?:\s+(?:in|under|below|at|with|near|around|from|india|uk|us|usa|germany|japan|france|italy|canada|australia|spain|brazil|mexico)\b|$|\?)/i);
    if (ucMatch && ucMatch[1]) {
      const extracted = ucMatch[1].trim();
      if (!['sale', 'cheap', 'best', 'good'].includes(extracted.toLowerCase())) {
        useCase = extracted;
      }
    }
  }

  // 7. Determine Localization Mode & Confidence
  const unresolvedFields: string[] = [];
  if (entity.bindingStatus === 'AMBIGUOUS') unresolvedFields.push('entity (ambiguous model)');
  if (currency.isUnresolved) unresolvedFields.push('currency (unspecified)');

  let localizationMode: 'MASTER' | 'LOCALIZED' | 'MARKET_SPECIFIC' = 'MASTER';
  if (market.countryCode !== 'GLOBAL') {
    localizationMode = 'MARKET_SPECIFIC';
  } else if (language.languageCode !== 'en') {
    localizationMode = 'LOCALIZED';
  }

  let confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN' = 'HIGH';
  if (entity.bindingStatus === 'AMBIGUOUS' || currency.isUnresolved) {
    confidence = 'MEDIUM';
  } else if (entity.bindingStatus === 'UNBOUND' && masterQuestion.entityRequired) {
    confidence = 'LOW';
  }

  // Combined Constraints
  const mergedConstraints: Record<string, unknown> = {
    ...customConstraints,
    ...(parsedQuery?.constraints || {}),
    budget: currency.extractedBudget,
    budgetMin: currency.budgetMin,
    budgetMax: currency.budgetMax,
    currency: currency.currencyCode !== 'UNRESOLVED' ? currency.currencyCode : undefined,
    market: market.countryCode !== 'GLOBAL' ? market.countryCode : undefined,
    useCase
  };

  return {
    questionId: masterQuestion.id,
    intentType: masterQuestion.intentType,
    query,
    entity,
    comparisonEntity,
    isComparison,
    market,
    language,
    currency,
    localization,
    useCase,
    constraints: mergedConstraints,
    localizationMode,
    confidence,
    unresolvedFields
  };
}
