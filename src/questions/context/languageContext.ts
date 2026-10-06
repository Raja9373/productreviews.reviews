/**
 * ProductReviews.review — Language Context Foundation
 * Resolves natural language contexts, handles mixed-language queries, and preserves user selection.
 */

import { LanguageCode } from '../../types';
import { SUPPORTED_LANGUAGES } from '../../localization/languages';
import { MarketContext } from './marketContext';

export interface LanguageContext {
  languageCode: string;
  languageName: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  detectionSource: 'EXPLICIT_USER' | 'APPLICATION_LOCALE' | 'QUERY_DETECTION' | 'MARKET_DEFAULT' | 'FALLBACK';
  isMixedLanguage: boolean;
  detectedKeywords?: string[];
}

const LANGUAGE_METADATA: Record<string, { name: string; nativeName: string; direction: 'ltr' | 'rtl' }> = {
  en: { name: 'English', nativeName: 'English', direction: 'ltr' },
  hi: { name: 'Hindi', nativeName: 'हिन्दी', direction: 'ltr' },
  de: { name: 'German', nativeName: 'Deutsch', direction: 'ltr' },
  fr: { name: 'French', nativeName: 'Français', direction: 'ltr' },
  es: { name: 'Spanish', nativeName: 'Español', direction: 'ltr' },
  it: { name: 'Italian', nativeName: 'Italiano', direction: 'ltr' },
  ja: { name: 'Japanese', nativeName: '日本語', direction: 'ltr' },
  pt: { name: 'Portuguese', nativeName: 'Português', direction: 'ltr' },
  nl: { name: 'Dutch', nativeName: 'Nederlands', direction: 'ltr' }
};

/**
 * Resolves LanguageContext using strict priority:
 * EXPLICIT USER > APPLICATION LOCALE > QUERY DETECTION > MARKET DEFAULT > ENGLISH FALLBACK
 */
export function resolveLanguageContext(
  query: string,
  explicitUserLang?: LanguageCode | string,
  appLocale?: string,
  marketContext?: MarketContext
): LanguageContext {
  const cleanQ = (query || '').trim();
  const lowerQ = cleanQ.toLowerCase();

  // 1. Explicit User Selection
  if (explicitUserLang && LANGUAGE_METADATA[explicitUserLang]) {
    const meta = LANGUAGE_METADATA[explicitUserLang];
    return {
      languageCode: explicitUserLang,
      languageName: meta.name,
      nativeName: meta.nativeName,
      direction: meta.direction,
      detectionSource: 'EXPLICIT_USER',
      isMixedLanguage: false
    };
  }

  // 2. Query Language Detection
  const detectedTokens: string[] = [];
  let detectedCode: string | null = null;
  let isMixed = false;

  // Hindi / Devanagari script or Hinglish keywords
  if (/[\u0900-\u097F]/.test(cleanQ)) {
    detectedCode = 'hi';
    detectedTokens.push('Devanagari script');
  } else if (/\b(?:kaisa|accha|achha|sasta|badiya|mehenga|ke\s+liye|kaunsa|kya|hai|hain|kaise|khareedein|kareeb)\b/i.test(lowerQ)) {
    detectedCode = 'hi';
    isMixed = true;
    detectedTokens.push('Hinglish tokens');
  } else if (/\bin hindi\b/i.test(lowerQ)) {
    detectedCode = 'hi';
    detectedTokens.push('explicit "in hindi" clause');
  }

  // Japanese Kanji / Hiragana / Katakana
  else if (/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(cleanQ)) {
    detectedCode = 'ja';
    detectedTokens.push('Japanese script');
  } else if (/\bin japanese\b/i.test(lowerQ)) {
    detectedCode = 'ja';
    detectedTokens.push('explicit "in japanese" clause');
  }

  // Spanish
  else if (/\b(?:mejor|tel[eé]fono|m[oó]vil|barato|precio|bajo|para|comprar|vale\s+la\s+pena)\b/i.test(lowerQ) || /[áéíóúñ]/i.test(cleanQ)) {
    detectedCode = 'es';
    detectedTokens.push('Spanish vocabulary');
  } else if (/\bin spanish\b|\ben español\b/i.test(lowerQ)) {
    detectedCode = 'es';
    detectedTokens.push('explicit "in spanish" clause');
  }

  // German
  else if (/\b(?:beste|bester|kaufen|preis|wert|lohnt\s+sich|vergleich|test)\b/i.test(lowerQ) || /[äöüß]/i.test(cleanQ)) {
    detectedCode = 'de';
    detectedTokens.push('German vocabulary');
  } else if (/\bin german\b|\bauf deutsch\b/i.test(lowerQ)) {
    detectedCode = 'de';
    detectedTokens.push('explicit "in german" clause');
  }

  // French
  else if (/\b(?:meilleur|acheter|prix|vaut\s+le\s+coup|comparatif|avis)\b/i.test(lowerQ) || /[éàèùâêîôûç]/i.test(cleanQ)) {
    detectedCode = 'fr';
    detectedTokens.push('French vocabulary');
  } else if (/\bin french\b|\ben français\b/i.test(lowerQ)) {
    detectedCode = 'fr';
    detectedTokens.push('explicit "in french" clause');
  }

  if (detectedCode && LANGUAGE_METADATA[detectedCode]) {
    const meta = LANGUAGE_METADATA[detectedCode];
    return {
      languageCode: detectedCode,
      languageName: meta.name,
      nativeName: meta.nativeName,
      direction: meta.direction,
      detectionSource: 'QUERY_DETECTION',
      isMixedLanguage: isMixed,
      detectedKeywords: detectedTokens
    };
  }

  // 3. Application Locale (e.g. "de", "fr")
  if (appLocale) {
    const langPrefix = appLocale.split('-')[0]?.toLowerCase();
    if (langPrefix && LANGUAGE_METADATA[langPrefix]) {
      const meta = LANGUAGE_METADATA[langPrefix];
      return {
        languageCode: langPrefix,
        languageName: meta.name,
        nativeName: meta.nativeName,
        direction: meta.direction,
        detectionSource: 'APPLICATION_LOCALE',
        isMixedLanguage: false
      };
    }
  }

  // 4. Market Default Language (if market is non-English like DE, FR, JP)
  if (marketContext && marketContext.language && LANGUAGE_METADATA[marketContext.language] && marketContext.countryCode !== 'GLOBAL') {
    const meta = LANGUAGE_METADATA[marketContext.language];
    return {
      languageCode: marketContext.language,
      languageName: meta.name,
      nativeName: meta.nativeName,
      direction: meta.direction,
      detectionSource: 'MARKET_DEFAULT',
      isMixedLanguage: false
    };
  }

  // 5. English Fallback
  const defaultMeta = LANGUAGE_METADATA['en'];
  return {
    languageCode: 'en',
    languageName: defaultMeta.name,
    nativeName: defaultMeta.nativeName,
    direction: defaultMeta.direction,
    detectionSource: 'FALLBACK',
    isMixedLanguage: false
  };
}
