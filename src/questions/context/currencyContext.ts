/**
 * ProductReviews.review — Currency Context Layer
 * Extracts explicit currencies, budget constraints, and regional denomination symbols.
 * Zero-fabrication: Only derives expected currency, never invents prices.
 */

import { MarketContext } from './marketContext';

export interface CurrencyContext {
  currencyCode: string;
  symbol: string;
  currencyName: string;
  extractedBudget?: number;
  budgetMin?: number;
  budgetMax?: number;
  isDerivedFromMarket: boolean;
  isExplicitInQuery: boolean;
  isUnresolved: boolean;
}

const CURRENCY_SPECS: Record<string, { symbol: string; name: string; aliases: RegExp }> = {
  INR: { symbol: '₹', name: 'Indian Rupee', aliases: /(?:₹|rs\.?|\b(?:inr|rupees?|lakhs?|crores?)\b)/i },
  GBP: { symbol: '£', name: 'British Pound', aliases: /(?:£|\b(?:gbp|pounds?)\b)/i },
  EUR: { symbol: '€', name: 'Euro', aliases: /(?:€|\b(?:eur|euros?)\b)/i },
  JPY: { symbol: '¥', name: 'Japanese Yen', aliases: /(?:¥|\b(?:jpy|yen)\b)/i },
  CAD: { symbol: 'C$', name: 'Canadian Dollar', aliases: /(?:c\$|\b(?:cad|canadian\s+dollars?)\b)/i },
  AUD: { symbol: 'A$', name: 'Australian Dollar', aliases: /(?:a\$|\b(?:aud|australian\s+dollars?)\b)/i },
  SGD: { symbol: 'S$', name: 'Singapore Dollar', aliases: /(?:s\$|\b(?:sgd|singapore\s+dollars?)\b)/i },
  BRL: { symbol: 'R$', name: 'Brazilian Real', aliases: /(?:r\$|\b(?:brl|reais)\b)/i },
  USD: { symbol: '$', name: 'US Dollar', aliases: /(?:\$|\b(?:usd|dollars?)\b)/i },
  MXN: { symbol: '$', name: 'Mexican Peso', aliases: /\b(?:mxn|pesos?)\b/i }
};

/**
 * Resolves CurrencyContext from query text and resolved MarketContext
 */
export function resolveCurrencyContext(
  query: string,
  marketContext?: MarketContext
): CurrencyContext {
  const cleanQ = (query || '').trim();

  let extractedBudget: number | undefined;
  let budgetMin: number | undefined;
  let budgetMax: number | undefined;
  let explicitCurrencyCode: string | undefined;

  // 1. Detect Explicit Currency Symbol or Alias in Query
  for (const [code, spec] of Object.entries(CURRENCY_SPECS)) {
    if (spec.aliases.test(cleanQ)) {
      explicitCurrencyCode = code;
      break;
    }
  }

  // 2. Extract Budget Numbers
  // Patterns like: "under 50000", "under ₹50,000", "under £800", "between 500 and 1000", "below 1000"
  const underMatch = cleanQ.match(/(?:under|below|less than|max|up to)\s*(?:[₹$£€¥]|rs\.?)?\s*([\d,]+)/i);
  if (underMatch) {
    const rawNum = underMatch[1].replace(/,/g, '');
    const val = parseFloat(rawNum);
    if (!isNaN(val)) {
      extractedBudget = val;
      budgetMax = val;
    }
  }

  const rangeMatch = cleanQ.match(/(?:between|from)\s*(?:[₹$£€¥]|rs\.?)?\s*([\d,]+)\s*(?:and|to|-)\s*(?:[₹$£€¥]|rs\.?)?\s*([\d,]+)/i);
  if (rangeMatch) {
    const minVal = parseFloat(rangeMatch[1].replace(/,/g, ''));
    const maxVal = parseFloat(rangeMatch[2].replace(/,/g, ''));
    if (!isNaN(minVal) && !isNaN(maxVal)) {
      budgetMin = minVal;
      budgetMax = maxVal;
      extractedBudget = maxVal;
    }
  }

  // Check for Indian Lakh notation (e.g. "under 1.5 lakh")
  const lakhMatch = cleanQ.match(/(?:under|below)\s*(\d+(?:\.\d+)?)\s*lakh/i);
  if (lakhMatch) {
    const lakhs = parseFloat(lakhMatch[1]);
    if (!isNaN(lakhs)) {
      extractedBudget = lakhs * 100000;
      budgetMax = extractedBudget;
      explicitCurrencyCode = 'INR';
    }
  }

  // If explicit currency was found
  if (explicitCurrencyCode && CURRENCY_SPECS[explicitCurrencyCode]) {
    const spec = CURRENCY_SPECS[explicitCurrencyCode];
    return {
      currencyCode: explicitCurrencyCode,
      symbol: spec.symbol,
      currencyName: spec.name,
      extractedBudget,
      budgetMin,
      budgetMax,
      isDerivedFromMarket: false,
      isExplicitInQuery: true,
      isUnresolved: false
    };
  }

  // If market context specifies a local currency
  if (marketContext && marketContext.currency && CURRENCY_SPECS[marketContext.currency] && marketContext.countryCode !== 'GLOBAL') {
    const spec = CURRENCY_SPECS[marketContext.currency];
    return {
      currencyCode: marketContext.currency,
      symbol: spec.symbol,
      currencyName: spec.name,
      extractedBudget,
      budgetMin,
      budgetMax,
      isDerivedFromMarket: true,
      isExplicitInQuery: false,
      isUnresolved: false
    };
  }

  // If budget exists but no currency is specified and market is GLOBAL (e.g. "best laptop under 800")
  if (extractedBudget !== undefined) {
    return {
      currencyCode: 'UNRESOLVED',
      symbol: '',
      currencyName: 'Unspecified Currency',
      extractedBudget,
      budgetMin,
      budgetMax,
      isDerivedFromMarket: false,
      isExplicitInQuery: false,
      isUnresolved: true
    };
  }

  // Default Market-Neutral Currency Context
  const defaultSpec = CURRENCY_SPECS['USD'];
  return {
    currencyCode: 'USD',
    symbol: defaultSpec.symbol,
    currencyName: defaultSpec.name,
    isDerivedFromMarket: true,
    isExplicitInQuery: false,
    isUnresolved: false
  };
}
