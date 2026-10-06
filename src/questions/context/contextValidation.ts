/**
 * ProductReviews.review — Context Validation & Quality Suite
 * Enforces strict safety rules for entity binding, market boundaries, and zero-fabrication integrity.
 */

import { ResolvedQuestionContext } from './questionContextResolver';
import { QuestionEntityBinding } from './entityBinding';
import { MarketContext } from './marketContext';
import { CurrencyContext } from './currencyContext';

export interface ContextValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates a ResolvedQuestionContext for safety and structural consistency
 */
export function validateResolvedContext(context: ResolvedQuestionContext): ContextValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!context) {
    return { isValid: false, errors: ['Context is null or undefined'], warnings: [] };
  }

  // 1. Question ID validation
  if (!context.questionId || !/^MQ-\d{6}$/.test(context.questionId)) {
    errors.push(`Invalid questionId: ${context.questionId}`);
  }

  // 2. Entity Binding Safety
  if (!context.entity) {
    errors.push('Missing entity binding');
  } else {
    if (context.entity.bindingStatus === 'BOUND' && !context.entity.entityName && !context.entity.brand) {
      errors.push('Bound entity must specify either entityName or brand');
    }
    if (context.entity.bindingStatus === 'AMBIGUOUS' && !context.entity.ambiguityReason) {
      warnings.push('Ambiguous entity should provide an explicit ambiguityReason');
    }
  }

  // 3. Comparison Isolation Safety
  if (context.isComparison) {
    if (!context.comparisonEntity) {
      errors.push('Comparison query requires a comparisonEntity');
    } else if (context.entity.entityName && context.comparisonEntity.entityName) {
      if (context.entity.entityName === context.comparisonEntity.entityName && context.entity.bindingStatus === 'BOUND') {
        warnings.push('Comparison entity A and entity B have identical names');
      }
    }
  }

  // 4. Market Context Safety
  if (!context.market) {
    errors.push('Missing market context');
  } else {
    if (!context.market.countryCode) {
      errors.push('MarketContext missing countryCode');
    }
  }

  // 5. Currency Context & Zero-Fabrication Checks
  if (!context.currency) {
    errors.push('Missing currency context');
  } else {
    if (context.currency.isUnresolved && context.currency.currencyCode !== 'UNRESOLVED') {
      errors.push('Unresolved currency must have currencyCode = UNRESOLVED');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}
