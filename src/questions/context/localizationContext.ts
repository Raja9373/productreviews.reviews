/**
 * ProductReviews.review — Localization Context Architecture
 * Represents target localization states without duplicating master question data.
 */

import { MarketContext } from './marketContext';
import { LanguageContext } from './languageContext';

export interface LocalizationContext {
  language: string;
  countryCode?: string;
  locale: string;
  currency?: string;
  terminologyLocale?: string;
  translationRequired: boolean;
  localizationStatus: 'MASTER' | 'READY_FOR_LOCALIZATION' | 'LOCALIZED' | 'NOT_LOCALIZABLE';
}

/**
 * Builds the LocalizationContext from resolved language and market context
 */
export function resolveLocalizationContext(
  languageContext: LanguageContext,
  marketContext: MarketContext
): LocalizationContext {
  const isGlobalEnglish = marketContext.countryCode === 'GLOBAL' && languageContext.languageCode === 'en';
  const locale = marketContext.countryCode !== 'GLOBAL' 
    ? `${languageContext.languageCode}-${marketContext.countryCode}`
    : languageContext.languageCode;

  return {
    language: languageContext.languageCode,
    countryCode: marketContext.countryCode !== 'GLOBAL' ? marketContext.countryCode : undefined,
    locale,
    currency: marketContext.currency,
    terminologyLocale: marketContext.terminologyLocale || `${languageContext.languageCode}-${marketContext.countryCode}`,
    translationRequired: languageContext.languageCode !== 'en',
    localizationStatus: isGlobalEnglish ? 'MASTER' : 'READY_FOR_LOCALIZATION'
  };
}
